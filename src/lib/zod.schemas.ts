import { z } from "zod";
import {
    type ApiError,
    type CelestialBodyCreationApiResponse,
    type GoalApiResponse,
    type MapApiResponse,
} from "./types/api.types";
import {
    BaseBodyType,
    CelestialBodyNumber,
    ComethType,
    SoloonType,
    type CelestialBody,
    type CelestialBodyType,
    type Cometh,
    type Coordinates,
    type GoalMap,
    type Megaverse,
    type Polyanet,
    type Soloon,
} from "./types/megaverse.types";

// xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export const UserIdSchema: z.ZodSchema = z
    .string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid userId format");

export const CelestialBodyNumberSchema: z.ZodNativeEnum<typeof CelestialBodyNumber> = z.nativeEnum(CelestialBodyNumber);

export const BaseBodyTypeSchema: z.ZodNativeEnum<typeof BaseBodyType> = z.nativeEnum(BaseBodyType);

export const SoloonTypesSchema: z.ZodNativeEnum<typeof SoloonType> = z.nativeEnum(SoloonType);

export const ComethTypesSchema: z.ZodNativeEnum<typeof ComethType> = z.nativeEnum(ComethType);

export const CelestialBodyTypeSchema: z.ZodSchema<CelestialBodyType> = z.union([
    BaseBodyTypeSchema,
    SoloonTypesSchema,
    ComethTypesSchema,
]);

export const PolyanetSchema: z.ZodSchema<Polyanet> = z.object({
    type: z.literal(CelestialBodyNumber.POLYANET),
});

export const SoloonSchema: z.ZodSchema<Soloon> = z.object({
    type: z.literal(CelestialBodyNumber.SOLOON),
    color: z.enum(["red", "blue", "purple", "white"]).transform((color) => color.toUpperCase()),
}) as unknown as z.ZodType<Soloon, z.ZodTypeDef, Soloon>; // TODO: FIx Type conflicts with the enums

export const ComethSchema: z.ZodSchema<Cometh> = z.object({
    type: z.literal(CelestialBodyNumber.COMETH),
    direction: z.enum(["up", "down", "left", "right"]).transform((direction) => direction.toUpperCase()),
}) as unknown as z.ZodType<Cometh, z.ZodTypeDef, Cometh>; // TODO: FIx Type conflicts with the enums

export const CelestialBodySchema: z.ZodSchema<CelestialBody> = z.union([
    PolyanetSchema,
    SoloonSchema,
    ComethSchema,
    z.null(),
]);

export const CellNumberSchema: z.ZodSchema<number> = z.number().min(0).max(29);

export const CoordinatesSchema: z.ZodSchema<Coordinates> = z.tuple([CellNumberSchema, CellNumberSchema]);

export const MegaverseSchema: z.ZodSchema<Megaverse> = z.array(z.array(CelestialBodySchema));

export const GoalMapSchema: z.ZodSchema<GoalMap> = z.array(z.array(CelestialBodyTypeSchema));

export const ApiErrorSchema: z.ZodSchema<ApiError> = z.object({
    error: z.literal(true),
    message: z.string(),
});

export const MapApiResponseSchema: z.ZodSchema<MapApiResponse> = z.union([
    z.object({
        error: z.undefined(),
        map: z.union([
            z.object({
                _id: z.string(),
                content: MegaverseSchema,
            }),
            z.null(),
        ]),
    }),
    ApiErrorSchema,
]);

export const GoalApiResponseSchema: z.ZodSchema<GoalApiResponse> = z.union([
    z.object({
        error: z.undefined(),
        goal: GoalMapSchema,
    }),
    ApiErrorSchema,
]);

export const CelestialBodyCreationApiResponseSchema: z.ZodSchema<CelestialBodyCreationApiResponse> = z.object({
    error: z.union([z.undefined(), z.string(), z.boolean()]),
});
