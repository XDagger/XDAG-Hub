import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
import { WebsocketClient } from "../rpc/websocket-client.js";
import type { WebsocketClientOptions } from "../rpc/websocket-client.js";

/**
 * An object defining headers to be passed to the RPC server
 */
export type HttpHeaders = { [header: string]: string };

interface XdagHTTPTransportOptions {
  url: string;
  rpc?: { headers?: HttpHeaders; url?: string; };
  websocket?: WebsocketClientOptions & { url?: string; };
}

export interface XdagTransportRequestOptions {
  method: string;
  params: unknown[];
}

// eslint-disable-next-line @typescript-eslint/ban-types

export interface XdagTransportSubscribeOptions<T> {
  method: string;
  unsubscribe: string;
  params: unknown[];
  onMessage: (event: T) => void;
}

export interface XDagTransport {
  request<T = unknown>(input: XdagTransportRequestOptions): Promise<T>;
  subscribe<T = unknown>( input: XdagTransportSubscribeOptions<T>, ): Promise<() => Promise<boolean>>;
}

export class XDagHTTPTransport implements XDagTransport {
  private rpcClient: Client;
  private websocketClient: WebsocketClient;

  constructor({
    url,
    websocket: { url: websocketUrl, ...websocketOptions } = {} as WebsocketClientOptions,
    rpc,
  }: XdagHTTPTransportOptions) {
    const transport = new HTTPTransport(rpc?.url ?? url, {
      headers: {
        "Content-Type": "application/json",
        "Client-Sdk-Type": "typescript",
        ...rpc?.headers,
      },
    });
    this.rpcClient = new Client(new RequestManager([transport]));
    this.websocketClient = new WebsocketClient( websocketUrl ?? url, websocketOptions, );
  }

  async request<T>(input: XdagTransportRequestOptions): Promise<T> {
    return await this.rpcClient.request(input);
  }

  async subscribe<T>( input: XdagTransportSubscribeOptions<T>, ): Promise<() => Promise<boolean>> {
    const unsubscribe = await this.websocketClient.request(input);
    return async () => !!(await unsubscribe());
  }
}
