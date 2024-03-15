"use server";

import { authOptions } from "$lib/server/auth";
import { ActionErrors, type ActionResponse } from "$lib/types/action.types";
import { type Megaverse } from "$lib/types/megaverse.types";
import { MapApiResponseSchema } from "$lib/zod.schemas";
import { env } from "$src/env";
import { getServerSession } from "next-auth";

export async function getMegaverseAction(): Promise<ActionResponse<Megaverse>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return {
                success: false,
                errorCode: ActionErrors.UNAUTHORIZED,
                errorMessage: "Unauthorized",
            };
        }
        const userId = session.user.id;
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/map/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const apiResponse = MapApiResponseSchema.parse(await res.json()); // Parse the response with zod
        if (apiResponse.error) {
            console.error("Error fetching user map from API", apiResponse.message);
            return {
                success: false,
                errorCode: ActionErrors.INTERNAL_SERVER_ERROR,
                errorMessage: apiResponse.message,
            };
        }
        if (!apiResponse.map) {
            return {
                success: false,
                errorCode: ActionErrors.NOT_FOUND,
                errorMessage: "Map not found",
            };
        }
        return {
            success: true,
            data: apiResponse.map.content, // Return the map
        };
    } catch (error) {
        console.error("Error fetching user map", error);
        return {
            success: false,
            errorCode: ActionErrors.INTERNAL_SERVER_ERROR,
            errorMessage: "Internal server error",
        };
    }
}
