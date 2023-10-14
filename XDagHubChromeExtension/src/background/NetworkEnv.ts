import mitt from "mitt";
import Browser from "webextension-polyfill";
import { DEFAULT_API_ENV } from "_app/ApiProvider/ApiProvider";
import { API_ENV } from "_src/shared/api-env";
import { isValidUrl } from "_src/shared/utils";

export type NetworkEnvType =
  | { env: Exclude<API_ENV, API_ENV.customRPC>; customRpcUrl: null }
  | { env: API_ENV.customRPC; customRpcUrl: string };

class NetworkEnv {
  #events = mitt<{ changed: NetworkEnvType }>();

  async getActiveNetwork(): Promise<NetworkEnvType> {
    const { Xdag_Env, Xdag_Env_RPC } = await Browser.storage.local.get({
      Xdag_Env: DEFAULT_API_ENV,
      Xdag_Env_RPC: null,
    });
    const adjCustomUrl = Xdag_Env === API_ENV.customRPC ? Xdag_Env_RPC : null;
    return { env: Xdag_Env, customRpcUrl: adjCustomUrl };
  }

  async setActiveNetwork(network: NetworkEnvType) {
    const { env, customRpcUrl } = network;
    if (env === API_ENV.customRPC && !isValidUrl(customRpcUrl)) {
      throw new Error(`Invalid custom RPC url ${customRpcUrl}`);
    }
    await Browser.storage.local.set({
      Xdag_Env: env,
      Xdag_Env_RPC: customRpcUrl,
    });
    this.#events.emit("changed", network);
  }

  on = this.#events.on;

  off = this.#events.off;
}

const networkEnv = new NetworkEnv();
export default networkEnv;
