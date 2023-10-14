import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
import { validate } from "superstruct";
import type { Struct } from "superstruct";
import { RPCValidationError } from "_src/xdag/typescript/utils";

/**
 * An object defining headers to be passed to the RPC server
 */
export type HttpHeaders = { [header: string]: string };

export class JsonRpcClient {
  private rpcClient: Client;

  constructor(url: string, httpHeaders?: HttpHeaders) {
    const transport = new HTTPTransport(url, {
      headers: {
        "Content-Type": "application/json",
        "Client-Sdk-Type": "typescript",
        ...httpHeaders,
      },
    });
    this.rpcClient = new Client(new RequestManager([transport]));
  }

  // async requestWithType<T>( method: string, args: any[], struct: Struct<T>, ): Promise<T> {
  // 	const req = { method, args };
  // 	const response = await this.request( method, args );
  // 	if ( process.env.NODE_ENV === "test" ) {
  // 		const [ err ] = validate( response, struct );
  // 		if ( err ) {
  // 			throw new RPCValidationError( {
  // 				req,
  // 				result: response,
  // 				cause: err,
  // 			} );
  // 		}
  // 	}
  // 	return response;
  // }
  async requestWithType<T>(
    method: string,
    args: any[] | object,
    struct: Struct<T>,
  ): Promise<T> {
    const req = { method, args };
    const response = await this.request(method, args);
    if (process.env.NODE_ENV === "test") {
      const [err] = validate(response, struct);
      if (err) {
        throw new RPCValidationError({
          req,
          result: response,
          cause: err,
        });
      }
    }
    return response;
  }

  // async request(method: string, params: any[]): Promise<any> {
  //   return await this.rpcClient.request({ method, params });
  // }
  async request(method: string, params: object | any[]): Promise<any> {
    return await this.rpcClient.request({ method, params });
  }
}
