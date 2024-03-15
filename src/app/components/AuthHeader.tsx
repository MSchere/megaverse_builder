"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Loading from "./utils/Loading";

export default function AuthHeader() {
    const { status, data } = useSession({ required: true });

    return (
        <div className="z-30 flex w-full items-center justify-center gap-4 rounded bg-background px-4 py-2 font-bold">
            <div className="flex w-full justify-between">
                {status === "authenticated" ? (
                    <>
                        <span className="text-base">{`Current ${data.user.phase.replace("-", ": ")}`}</span>
                        <p className="text-base">{`Welcome back user ${data.user.id.substring(0, 8)}!`}</p>
                    </>
                ) : (
                    <>
                        <div className="h-6 w-[220px]">
                            <Loading />
                        </div>
                        <div className="h-6 w-[220px]">
                            <Loading />
                        </div>
                    </>
                )}
            </div>
            <Button variant="outline" className="rounded font-bold" onClick={() => signOut()}>
                Logout
            </Button>
        </div>
    );
}
