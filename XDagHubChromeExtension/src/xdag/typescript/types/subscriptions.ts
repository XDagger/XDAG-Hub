import { number } from "superstruct";
import type { Infer } from "superstruct";

export const SubscriptionId = number();
export type SubscriptionId = Infer<typeof SubscriptionId>;

export type Unsubscribe = () => Promise<boolean>;
