"use server";

import { ActionErrors, type ActionResponse } from "$lib/types/action.types";
import { MapApiResponseSchema, UserIdSchema } from "$lib/zod.schemas";
import { Phase } from "$src/lib/types/user.types";
import { env } from "process";

// Server action that fetchers the user's megaverse map if it exists
// It serves as a login method
export async function loginAction(userId: string): Promise<ActionResponse<Phase>> {
    try {
        // Validate the userId
        if (UserIdSchema.safeParse(userId).success === false) {
            console.error("Invalid userId format");
            return {
                success: false,
                errorCode: ActionErrors.BAD_REQUEST,
                errorMessage: "Invalid userId format",
            };
        }
        // Fetch the user's map
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/map/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const apiResponse = MapApiResponseSchema.parse(await res.json()); // Parse the response with zod
        if (apiResponse.error) {
            console.error("Error logging in, API error", apiResponse.message);
            return {
                success: false,
                errorCode: ActionErrors.INTERNAL_SERVER_ERROR,
                errorMessage: apiResponse.message,
            };
        }
        const phase = !apiResponse.map ? Phase.PHASE_3 : apiResponse.map.content.length === 11 ? Phase.PHASE_1 : Phase.PHASE_2;
        return {
            success: true,
            data: phase, // Return current user phase
        };
    } catch (error) {
        console.error("Error fetching user map, internal error", error);
        return {
            success: false,
            errorCode: ActionErrors.INTERNAL_SERVER_ERROR,
            errorMessage: "Error fetching user map",
        };
    }
}
