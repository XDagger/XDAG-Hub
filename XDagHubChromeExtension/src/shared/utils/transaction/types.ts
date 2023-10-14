import type { XDagAddress } from "_src/xdag/typescript/types";

export type TransactionSummary = {
  digest?: string;
  sender?: XDagAddress;
  timestamp?: string;
  gas?: any;
} | null;

export type XdagObjectChangeTypes =
  | "published"
  | "transferred"
  | "mutated"
  | "deleted"
  | "wrapped"
  | "created";
