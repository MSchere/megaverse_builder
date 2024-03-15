"use server";

import { ActionErrors, type ActionResponse } from "$lib/types/action.types";
import { MapApiResponseSchema, UserIdSchema } from "$lib/zod.schemas";
import { env } from "process";

// Server action that fetchers the user's megaverse map if it exists
// It serves as a login method
export async function loginAction(userId: string): Promise<ActionResponse<boolean>> {
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
            console.error("Error fetching user map from API", apiResponse.message);
            return {
                success: false,
                errorCode: ActionErrors.INTERNAL_SERVER_ERROR,
                errorMessage: apiResponse.message,
            };
        }
        return {
            success: true,
            data: !!apiResponse.map, // Return true if the map exists
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
