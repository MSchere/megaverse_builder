import { type GoalMap, type Megaverse } from "./megaverse.types";

export type ApiError = {
    error: true;
    message: string;
};

export type MapApiResponse =
    | {
          error: undefined;
          map: {
              _id: string;
              content: Megaverse;
          } | null;
      }
    | ApiError;

export type GoalApiResponse =
    | {
          error: undefined;
          goal: GoalMap;
      }
    | ApiError;

export type CelestialBodyCreationApiRequest = {
    candidateId: string;
    row: number;
    column: number;
    color?: string;
    direction?: string;
};

export type CelestialBodyCreationApiResponse = { error?: boolean | string };
