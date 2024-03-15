"use server";

import { ActionErrors, type ActionResponse } from "$lib/types/action.types";
import { BaseBodyType, CelestialBodyNumber, type Color, type Direction } from "$lib/types/megaverse.types";
import { formatGoalMap, formatMegaverse } from "$lib/utils/megaverse.utils";
import { getGoalMapAction } from "../queries/getGoalMap";
import { getMegaverseAction } from "../queries/getMegaverse";
import { createComethAction } from "./createCometh";
import { createPolyanetAction } from "./createPolyanet";
import { createSoloonAction } from "./createSoloon";

export async function solveChallengeTwoAction(): Promise<ActionResponse<string>> {
    try {
        const res = await getGoalMapAction();
        if (!res.success) {
            console.error("Error fetching goal map", res.errorMessage);
            return {
                success: false,
                errorCode: res.errorCode,
                errorMessage: res.errorMessage,
            };
        }
        const goalMap = res.data;

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
        console.info("-----------Solving challenge two-------------");
        while (formattedMegaverse !== formattedGoalMap) {
            for (let row = 0; row < goalMap.length; row++) {
                for (let col = 0; col < goalMap[row]!.length; col++) {
                    const cell = goalMap[row]![col]!;
                    const megaverseCell = megaverse[row]![col]!;
                    const splitCell = cell.split("_");
                    let cellType: BaseBodyType = splitCell[0] as BaseBodyType;
                    if (splitCell.length > 1) {
                        cellType = splitCell[1] as BaseBodyType;
                    }
                    if (cellType === BaseBodyType.SPACE) {
                        continue;
                    }
                    if (cellType === BaseBodyType.POLYANET && megaverseCell?.type !== CelestialBodyNumber.POLYANET) {
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
                    if (cellType === BaseBodyType.SOLOON && megaverseCell?.type !== CelestialBodyNumber.SOLOON) {
                        const color = cell.split("_")[0]! as Color;
                        const res = await createSoloonAction([row, col], color);
                        if (!res.success) {
                            console.error("Error creating soloon", res.errorMessage);
                            return {
                                success: false,
                                errorCode: res.errorCode,
                                errorMessage: res.errorMessage,
                            };
                        }
                        console.info(`${color} Soloon created at [${row}, ${col}]`);
                    }
                    if (cellType === BaseBodyType.COMETH && megaverseCell?.type !== CelestialBodyNumber.COMETH) {
                        const direction = cell.split("_")[0]! as Direction;
                        const res = await createComethAction([row, col], direction);
                        if (!res.success) {
                            console.error("Error creating cometh", res.errorMessage);
                            return {
                                success: false,
                                errorCode: res.errorCode,
                                errorMessage: res.errorMessage,
                            };
                        }
                        console.info(`${direction} Cometh created at [${row}, ${col}]`);
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
            data: "Challenge two solved! 🎉",
        };
    } catch (error) {
        console.error("Error solving challenge two", error);
        return {
            success: false,
            errorCode: ActionErrors.INTERNAL_SERVER_ERROR,
            errorMessage: "Error solving challenge two",
        };
    }
}
