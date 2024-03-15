import {
    BaseBodyType,
    CelestialBodyNumber,
    emojiMap,
    type CelestialBody,
    type GoalMap,
    type Megaverse,
} from "../types/megaverse.types";

export function formatGoalMap(map: GoalMap): string {
    const formattedMap = map.map((row) => row.map((bodyType) => emojiMap[bodyType]).join(" ")).join("\n");
    return formattedMap;
}

export function formatMegaverse(map: Megaverse): string {
    const formattedMap = map.map((row) => row.map((body) => getCelestialBodyEmoji(body)).join(" ")).join("\n");
    return formattedMap;
}

function getCelestialBodyEmoji(body: CelestialBody): string {
    switch (body?.type) {
        case CelestialBodyNumber.POLYANET:
            return emojiMap[BaseBodyType.POLYANET];
        case CelestialBodyNumber.SOLOON:
            return emojiMap[`${body.color}_${BaseBodyType.SOLOON}`];
        case CelestialBodyNumber.COMETH:
            return emojiMap[`${body.direction}_${BaseBodyType.COMETH}`];
        default:
            return emojiMap[BaseBodyType.SPACE];
    }
}
