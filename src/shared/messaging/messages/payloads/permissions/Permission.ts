import type { PermissionType } from "./PermissionType";
import type { XDagAddress } from "_src/xdag/typescript/types";

//TODO: add description, name, tags
//TODO add PageLink for instance where the origin and the wallet landing page are different.
export interface Permission {
  name?: string;
  id: string;
  origin: string;
  pagelink?: string | undefined;
  favIcon: string | undefined;
  accounts: XDagAddress[];
  allowed: boolean | null;
  permissions: PermissionType[];
  createdDate: string;
  responseDate: string | null;
  requestMsgID: string;
}
