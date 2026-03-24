export const PLAN_ORDER = ["free", "basic", "pro", "enterprise"] as const;

export type PlanId = (typeof PLAN_ORDER)[number];
