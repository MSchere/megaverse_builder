import { type CelestialBodyCreationApiRequest, type CelestialBodyCreationApiResponse } from "../types/api.types";
import { CelestialBodyCreationApiResponseSchema } from "../zod.schemas";

export async function expBackoffApiCall(request: {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    body: CelestialBodyCreationApiRequest;
    delay: number;
    retries: number;
}): Promise<CelestialBodyCreationApiResponse> {
    const { url, method, body, delay, retries } = request;
    let newDelay = delay;
    let apiResponse: CelestialBodyCreationApiResponse | null = null;
    for (let i = 0; i < retries; i++) {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        apiResponse = CelestialBodyCreationApiResponseSchema.parse(await res.json()); // Parse the response with zod
        if (apiResponse.error) {
            console.error(`Error calling ${method} ${url}, retrying in ${newDelay}`);
            await new Promise((resolve) => setTimeout(resolve, newDelay));
            newDelay *= 2; // Double the delay
            continue;
        }
        break;
    }
    if (!apiResponse) {
        throw new Error(`Error calling ${method} ${url}, no response`);
    }
    return apiResponse;
}
