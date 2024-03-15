"use server";

import { authOptions } from "$lib/server/auth";
import { ActionErrors, type ActionResponse } from "$lib/types/action.types";
import { type Coordinates } from "$lib/types/megaverse.types";
import { expBackoffApiCall } from "$lib/utils/api.utils";
import { CoordinatesSchema } from "$lib/zod.schemas";
import { env } from "$src/env";
import { getServerSession } from "next-auth";

export async function createPolyanetAction(coordinate: Coordinates): Promise<ActionResponse<string>> {
    try {
        if (!CoordinatesSchema.safeParse(coordinate).success) {
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
            url: `${env.NEXT_PUBLIC_API_URL}/polyanets`,
            method: "POST",
            body: {
                candidateId: session.user.id,
                row: coordinate[0],
                column: coordinate[1],
            },
            delay: 1000,
            retries: 5,
        });
        return {
            success: true,
            data: "Polyanet created successfully",
        };
    } catch (error) {
        console.error("Error creating Polyanet", error);
        return {
            success: false,
            errorCode: ActionErrors.INTERNAL_SERVER_ERROR,
            errorMessage: "Error creating Polyanet",
        };
    }
}
