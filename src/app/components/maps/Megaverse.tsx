import { getMegaverseAction } from "$lib/server/megaverse/queries/getMegaverse";
import { formatMegaverse } from "$lib/utils/megaverse.utils";
import LoadingMap from "./LoadingMap";

export default async function Megaverse() {
    const res = await getMegaverseAction();
    if (!res.success) {
        console.error("Error fetching megaverse", res.errorMessage);
        return (
            <div className="relative">
                <LoadingMap />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    Error loading megaverse ⚠️
                </span>
            </div>
        );
    }
    const megaverse = res.data;
    return (
        <p className="whitespace-pre-wrap text-center font-semibold leading-8 text-white">
            {formatMegaverse(megaverse)}
        </p>
    );
}
