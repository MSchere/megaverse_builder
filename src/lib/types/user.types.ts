export enum Phase {
    PHASE_1 = "phase-1",
    PHASE_2 = "phase-2",
    PHASE_3 = "phase-3"
}

export interface UserType {
    id: string;
    phase: Phase;
}