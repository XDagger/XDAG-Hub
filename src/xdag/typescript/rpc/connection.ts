
interface ConnectionOptions {
  fullnode: string;
  websocket?: string;
  /** @deprecated Use the new faucet APIs from `/Xdag.js/faucet` instead. */
  faucet?: string;
}

export class Connection {
  #options: ConnectionOptions;

  constructor(options: ConnectionOptions) {
    this.#options = options;
  }

  get fullnode() {
    return this.#options.fullnode;
  }

  get websocket() {
    return this.#options.websocket || this.#options.fullnode;
  }

  /** @deprecated Use the new faucet APIs from `/Xdag.js/faucet` instead. */
  get faucet() {
    return this.#options.faucet;
  }
}

// TODO: Maybe don't have pre-built connections, and instead just have pre-built objects that folks
// can use with the connection?
export const localnetConnection = new Connection({
  fullnode: "http://127.0.0.1:9000",
  faucet: "",
});

export const devnetConnection = new Connection({
  fullnode: "https://testnet-rpc.xdagj.org",
  faucet: "",
});

export const testnetConnection = new Connection({
  fullnode: "https://testnet-rpc.xdagj.org",
  faucet: "",
});

export const mainnetConnection = new Connection({
  fullnode: "https://mainnet-rpc.xdagj.org",
});
