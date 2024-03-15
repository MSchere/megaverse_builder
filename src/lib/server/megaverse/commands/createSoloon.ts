"use server";

import { authOptions } from "$lib/server/auth";
import { ActionErrors, type ActionResponse } from "$lib/types/action.types";
import { type Color, type Coordinates } from "$lib/types/megaverse.types";
import { expBackoffApiCall } from "$lib/utils/api.utils";
import { CoordinatesSchema } from "$lib/zod.schemas";
import { env } from "$src/env";
import { getServerSession } from "next-auth";

export async function createSoloonAction(coordinates: Coordinates, color: Color): Promise<ActionResponse<string>> {
    try {
        if (!CoordinatesSchema.safeParse(coordinates).success) {
            return {
                success: false,
                errorCode: ActionErrors.BAD_REQUEST,
                errorMessage: "Invalid coordinates format, must be an array of 2 numbers between 0 and 29",
            };
        }
        const session = await getServerSession(authOptions);
        if (!session) {
            return {
                success: false,
                errorCode: ActionErrors.UNAUTHORIZED,
                errorMessage: "Unauthorized",
            };
        }
        await expBackoffApiCall({
            url: `${env.NEXT_PUBLIC_API_URL}/soloons`,
            method: "POST",
            body: {
                candidateId: session.user.id,
                row: coordinates[0],
                column: coordinates[1],
                color: color.toLowerCase(),
            },
            delay: 1000,
            retries: 5,
        });
        return {
            success: true,
            data: "Soloon created successfully",
        };
    } catch (error) {
        console.error("Error creating Soloon", error);
        return {
            success: false,
            errorCode: ActionErrors.INTERNAL_SERVER_ERROR,
            errorMessage: "Error creating Soloon",
        };
    }
}
