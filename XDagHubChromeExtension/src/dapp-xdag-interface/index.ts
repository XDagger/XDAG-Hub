import { registerWallet } from "@wallet-standard/core";
import { XDagWallet } from "./WalletStandardInterface";

registerWallet(new XDagWallet());
