import { array, boolean, integer, object, string, union } from "superstruct";
import { builder } from "./bcs.js";
import { normalizeXDagAddress } from "../types/index.js";
import type { ObjectId, SharedObjectRef } from "../types/index.js";
import type { Infer } from "superstruct";

const ObjectArg = union([
  object({
    Shared: object({
      objectId: string(),
      initialSharedVersion: union([integer(), string()]),
      mutable: boolean(),
    }),
  }),
]);

export const PureCallArg = object({ Pure: array(integer()) });
export type PureCallArg = Infer<typeof PureCallArg>;

export const ObjectCallArg = object({ Object: ObjectArg });
export type ObjectCallArg = Infer<typeof ObjectCallArg>;

export const BuilderCallArg = union([PureCallArg, ObjectCallArg]);
export type BuilderCallArg = Infer<typeof BuilderCallArg>;

export const Inputs = {
  Pure(data: unknown, type?: string): PureCallArg {
    return {
      Pure: Array.from(
        // NOTE: We explicitly set this to be growable to infinity, because we have maxSize validation at the builder-level:
        data instanceof Uint8Array ? data : builder.ser(type!, data, { maxSize: Infinity }).toBytes(),
      ),
    };
  },
  SharedObjectRef({ objectId, mutable, initialSharedVersion, }: SharedObjectRef): ObjectCallArg {
    return {
      Object: {
        Shared: {
          mutable,
          initialSharedVersion,
          objectId: normalizeXDagAddress(objectId),
        },
      },
    };
  },
};

export function getIdFromCallArg(arg: ObjectId | ObjectCallArg) {
  if (typeof arg === "string") {
    return normalizeXDagAddress(arg);
  }
  return normalizeXDagAddress(arg.Object.Shared.objectId);
}

export function getSharedObjectInput( arg: BuilderCallArg, ): SharedObjectRef | undefined {
  return typeof arg === "object" && "Object" in arg && "Shared" in arg.Object
    ? arg.Object.Shared
    : undefined;
}

export function isSharedObjectInput(arg: BuilderCallArg): boolean {
  return !!getSharedObjectInput(arg);
}

export function isMutableSharedObjectInput(arg: BuilderCallArg): boolean {
  return getSharedObjectInput(arg)?.mutable ?? false;
}
