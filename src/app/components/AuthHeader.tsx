"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Loading from "./utils/Loading";

export default function AuthHeader() {
    const { status, data } = useSession({ required: true });

    return (
        <div className="z-30 flex w-full items-center justify-end gap-4 rounded bg-background p-2 font-bold">
            {status === "authenticated" ? (
                <p className="text-base">{`Welcome back user ${data.user.id.substring(0, 8)}!`}</p>
            ) : (
                <div className="h-6 w-[220px]">
                    <Loading />
                </div>
            )}
            <Button variant="outline" className="rounded font-bold" onClick={() => signOut()}>
                Logout
            </Button>
        </div>
    );
}
