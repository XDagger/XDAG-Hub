import { type XdagObjectChangeTypes } from "./types";

export const ObjectChangeLabels = {
  created: "Created",
  mutated: "Updated",
  transferred: "Transfer",
  published: "Publish",
  deleted: "Deleted",
  wrapped: "Wrap",
};

export function getObjectChangeLabel(type: XdagObjectChangeTypes) {
  return ObjectChangeLabels[type];
}
