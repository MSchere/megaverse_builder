"use server";

import { authOptions } from "$lib/server/auth";
import { ActionErrors, type ActionResponse } from "$lib/types/action.types";
import { type GoalMap } from "$lib/types/megaverse.types";
import { GoalApiResponseSchema } from "$lib/zod.schemas";
import { env } from "$src/env";
import { getServerSession } from "next-auth";

export async function getGoalMapAction(): Promise<ActionResponse<GoalMap>> {
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
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/map/${userId}/goal`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const apiResponse = GoalApiResponseSchema.parse(await res.json()); // Parse the response with zod
        if (apiResponse.error) {
            console.error("Error fetching user goal from API", apiResponse.message);
            return {
                success: false,
                errorCode: ActionErrors.INTERNAL_SERVER_ERROR,
                errorMessage: apiResponse.message,
            };
        }
        return {
            success: true,
            data: apiResponse.goal, // Return the map
        };
    } catch (error) {
        console.error("Error fetching user goal", error);
        return {
            success: false,
            errorCode: ActionErrors.INTERNAL_SERVER_ERROR,
            errorMessage: "Internal server error",
        };
    }
}
