"use server";

import { ActionErrors, type ActionResponse } from "$lib/types/action.types";
import { BaseBodyType, CelestialBodyNumber } from "$lib/types/megaverse.types";
import { Phase } from "$lib/types/user.types";
import { formatGoalMap, formatMegaverse } from "$lib/utils/megaverse.utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import { getGoalMapAction } from "../queries/getGoalMap";
import { getMegaverseAction } from "../queries/getMegaverse";
import { createPolyanetAction } from "./createPolyanet";

export async function solveChallengeOneAction(): Promise<ActionResponse<string>> {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return {
                success: false,
                errorCode: ActionErrors.UNAUTHORIZED,
                errorMessage: "Unauthorized",
            };
        }
        if (session.user.phase !== Phase.PHASE_1) {
            return {
                success: false,
                errorCode: ActionErrors.FORBIDDEN,
                errorMessage: "You are not allowed to solve this challenge yet.",
            };
        }
        const res1 = await getGoalMapAction();
        if (!res1.success) {
            console.error("Error fetching goal map", res1.errorMessage);
            return {
                success: false,
                errorCode: res1.errorCode,
                errorMessage: res1.errorMessage,
            };
        }
        const goalMap = res1.data;
        const res2 = await getMegaverseAction();
        if (!res2.success) {
            console.error("Error fetching megaverse", res2.errorMessage);
            return {
                success: false,
                errorCode: res2.errorCode,
                errorMessage: res2.errorMessage,
            };
        }
        let megaverse = res2.data;
        const formattedGoalMap = formatGoalMap(goalMap);
        let formattedMegaverse = formatMegaverse(megaverse);
        console.info("-----------Solving challenge one-------------");
        while (formattedMegaverse !== formattedGoalMap) {
            for (let row = 0; row < goalMap.length; row++) {
                for (let col = 0; col < goalMap[row]!.length; col++) {
                    const megaverseCell = megaverse[row]![col]!;
                    const cell = goalMap[row]![col]!;
                    if (cell === BaseBodyType.SPACE) {
                        continue;
                    }
                    if (cell === BaseBodyType.POLYANET && megaverseCell?.type !== CelestialBodyNumber.POLYANET) {
                        const res = await createPolyanetAction([row, col]);
                        if (!res.success) {
                            console.error("Error creating polyanet", res.errorMessage);
                            return {
                                success: false,
                                errorCode: res.errorCode,
                                errorMessage: res.errorMessage,
                            };
                        }
                        console.info(`Polyanet created at [${row}, ${col}]`);
                    }
                }
            }
            // refetch the megaverse to check if the challenge is solved
            const res = await getMegaverseAction();
            if (!res.success) {
                console.error("Error fetching megaverse", res.errorMessage);
                return {
                    success: false,
                    errorCode: res.errorCode,
                    errorMessage: res.errorMessage,
                };
            }
            megaverse = res.data;
            formattedMegaverse = formatMegaverse(megaverse);
        }
        return {
            success: true,
            data: "Challenge one solved! 🎉",
        };
    } catch (error) {
        console.error("Error solving challenge one", error);
        return {
            success: false,
            errorCode: ActionErrors.INTERNAL_SERVER_ERROR,
            errorMessage: "Error solving challenge one",
        };
    }
}
