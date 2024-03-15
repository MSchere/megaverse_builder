import { Phase } from "$src/lib/types/user.types";
import { Suspense } from "react";
import AuthHeader from "./components/AuthHeader";
import ChallengeButton from "./components/buttons/ChallengeButton";
import GoalMap from "./components/maps/GoalMap";
import LoadingMap from "./components/maps/LoadingMap";
import Megaverse from "./components/maps/Megaverse";

export default function HomePage() {
    return (
        <main className="container flex flex-col items-center justify-center gap-20 px-4 py-8 md:px-24 md:py-16 ">
            <div className="md:border-slate relative flex flex-col gap-16 rounded md:border-2 ">
                <AuthHeader />
                <div className="flex flex-col gap-16 px-0 py-8  md:px-32">
                    <div className="flex flex-col gap-8">
                        <h1 className="text-center text-5xl  font-extrabold tracking-tight text-white md:text-[5rem]">
                            <span className="text-pink-400">Megaverse</span> Builder 🪐
                        </h1>
                        <p className="text-center text-3xl font-semibold md:text-[2rem]">
                            <span className="text-yellow-300">Create</span> your very own universe!
                        </p>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="flex w-full flex-col gap-4">
                            <span className="text-center text-2xl font-semibold text-white md:text-[1.5rem]">
                                Your current megaverse:
                            </span>
                            <Suspense fallback={<LoadingMap />}>
                                <Megaverse />
                            </Suspense>
                        </div>
                        <div className="flex w-full flex-col gap-4">
                            <span className="text-center text-2xl font-semibold text-white md:text-[1.5rem]">
                                Your current goal:
                            </span>
                            <Suspense fallback={<LoadingMap />}>
                                <GoalMap />
                            </Suspense>
                        </div>
                    </div>
                    <div className="flex justify-center gap-8">
                        <ChallengeButton phase={Phase.PHASE_1} />
                        <ChallengeButton phase={Phase.PHASE_2} />
                    </div>
                </div>
            </div>
        </main>
    );
}
