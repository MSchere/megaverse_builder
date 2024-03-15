export enum CelestialBodyNumber {
    POLYANET = 0,
    SOLOON = 1,
    COMETH = 2,
}

export enum Color {
    RED = "RED",
    BLUE = "BLUE",
    PURPLE = "PURPLE",
    WHITE = "WHITE",
}

export enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export enum BaseBodyType {
    SPACE = "SPACE",
    POLYANET = "POLYANET",
    SOLOON = "SOLOON",
    COMETH = "COMETH",
}

export enum SoloonType {
    RED_SOLOON = `${Color.RED}_${BaseBodyType.SOLOON}`,
    BLUE_SOLOON = `${Color.BLUE}_${BaseBodyType.SOLOON}`,
    PURPLE_SOLOON = `${Color.PURPLE}_${BaseBodyType.SOLOON}`,
    WHITE_SOLOON = `${Color.WHITE}_${BaseBodyType.SOLOON}`,
}

export enum ComethType {
    UP_COMETH = `${Direction.UP}_${BaseBodyType.COMETH}`,
    DOWN_COMETH = `${Direction.DOWN}_${BaseBodyType.COMETH}`,
    LEFT_COMETH = `${Direction.LEFT}_${BaseBodyType.COMETH}`,
    RIGHT_COMETH = `${Direction.RIGHT}_${BaseBodyType.COMETH}`,
}

export type CelestialBodyType = BaseBodyType | SoloonType | ComethType;

export const emojiMap = {
    [BaseBodyType.SPACE]: "🌌",
    [BaseBodyType.POLYANET]: "🪐", // Will not ever be used because there is no base polyanet
    [BaseBodyType.SOLOON]: "🌕", // Will not ever be used because there is no base soloon
    [BaseBodyType.COMETH]: "☄️",
    [SoloonType.RED_SOLOON]: "🔴",
    [SoloonType.BLUE_SOLOON]: "🔵",
    [SoloonType.PURPLE_SOLOON]: "🟣",
    [SoloonType.WHITE_SOLOON]: "⚪️",
    [ComethType.UP_COMETH]: "⬆",
    [ComethType.DOWN_COMETH]: "⬇",
    [ComethType.LEFT_COMETH]: "⬅",
    [ComethType.RIGHT_COMETH]: "➡",
};

export interface BaseCelestialBody {
    type: CelestialBodyNumber;
}

export interface Polyanet extends BaseCelestialBody {
    type: CelestialBodyNumber.POLYANET;
}

export interface Soloon extends BaseCelestialBody {
    type: CelestialBodyNumber.SOLOON;
    color: Color;
}

export interface Cometh extends BaseCelestialBody {
    type: CelestialBodyNumber.COMETH;
    direction: Direction;
}

export type CelestialBody = Polyanet | Soloon | Cometh | null;

export type Coordinates = [number, number];

export type Megaverse = CelestialBody[][];

export type GoalMap = CelestialBodyType[][];
