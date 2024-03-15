"use client";

import { solveChallengeOneAction } from "$lib/server/megaverse/commands/solveChallengeOne";
import { solveChallengeTwoAction } from "$lib/server/megaverse/commands/solveChallengeTwo";
import { toast } from "$src/app/hooks/use-toast";
import { Phase } from "$src/lib/types/user.types";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import Spinner from "../utils/Spinner";
export default function ChallengeButton({ phase }: { phase: Phase }) {
    const { status, data } = useSession({ required: true });
    const router = useRouter();
    const [state, formAction] = useFormState(
        phase === Phase.PHASE_1 ? solveChallengeOneAction : solveChallengeTwoAction,
        undefined
    );
    useEffect(() => {
        if (!state) return;
        if (!state.success) {
            toast({
                variant: "destructive",
                title: state.errorMessage,
            });
            console.error(state.errorMessage);
            return;
        }
        toast({
            variant: "creative",
            title: state.data,
        });
        router.refresh();
    }, [state]);

    function SubmitButton() {
        const { pending } = useFormStatus();
        return (
            <>
                {pending && <Spinner />}
                <Button
                    disabled={status !== "authenticated" || data.user.phase !== phase || pending}
                    type="submit"
                    variant="outline"
                    className="flex-grow rounded-xl p-8 text-xl"
                >
                    {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {`Solve Challenge ${phase.split("-")[1]}`}
                </Button>
            </>
        );
    }
    return (
        <form action={formAction}>
            <SubmitButton />
        </form>
    );
}
