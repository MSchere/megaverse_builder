import { getGoalMapAction } from "$lib/server/megaverse/queries/getGoalMap";
import { formatGoalMap } from "$lib/utils/megaverse.utils";
import LoadingMap from "./LoadingMap";

export default async function GoalMap() {
    const res = await getGoalMapAction();
    if (!res.success) {
        console.error("Error fetching goal map", res.errorMessage);
        return (
            <div className="relative">
                <LoadingMap />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    Error loading goal map ⚠️
                </span>
            </div>
        );
    }
    const goalMap = res.data;
    return (
        <p className="whitespace-pre-wrap text-center font-semibold leading-8 text-white">{formatGoalMap(goalMap)}</p>
    );
}
