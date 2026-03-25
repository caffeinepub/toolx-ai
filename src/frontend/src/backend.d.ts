import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UsageRecordArray = Array<UsageRecord>;
export interface UsageRecord {
    date: string;
    count: bigint;
}
export enum Plan {
    pro = "pro",
    free = "free"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    canUseBackgroundRemover(arg0: null): Promise<boolean>;
    getBackgroundRemoverUsage(arg0: null): Promise<bigint>;
    getCallerUserRole(): Promise<UserRole>;
    getLifetimeUsageCount(arg0: null): Promise<bigint>;
    getRemainingUsage(arg0: null): Promise<bigint>;
    getTopUsageRecordsQuery(limit: bigint): Promise<UsageRecordArray>;
    getUserPlan(arg0: null): Promise<Plan>;
    incrementBackgroundRemoverUsage(arg0: null): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    upgradeToPro(arg0: null): Promise<Plan>;
}
