import { serve } from "https://deno.land/std/http/server.ts";
import { Adaptor, AdaptorConfigure } from "../../core/adaptor.ts";
import { EnlaceServer } from "../../core/server.ts";
import { int } from "../../util/mod.ts";
import { HttpEndpointInput, HttpSearchParameter } from "./endpoint_input.ts";
import { pathToUrl } from "../../util/path-to-url.ts";
import { Router } from "../../core/router.ts";
import { Log } from "../../util/mod.ts";
import { rgb24, bold } from "https://deno.land/std/fmt/colors.ts";
import { Client } from "../../client.ts";

export class HttpAdaptor extends Adaptor {
  readonly protocol: string = "Http";

  protected port!: int;
  protected host!: string;
  public server!: EnlaceServer;
  public router: Router = new Router(this);
  private encoder: TextEncoder = new TextEncoder();

  attachOnServer(server: EnlaceServer, configure: AdaptorConfigure): void {
    super.attachOnServer(server, configure);
    this.host = configure.host;
    this.port = configure.port;
    this.server = server;
    this.listenOnServer(this.host, this.port).then();
  }

  private async listenOnServer(host: string, port: int) {
    const s = serve({ port: port, hostname: host });
    Log.info(`listen on ${rgb24(bold(`http://${host}:${port}/`), 0xb7b1ff)}`, "Http");
    for await (const request of s) {
      const url = pathToUrl(request.proto, request.headers, request.url);
      const input = new HttpEndpointInput(url.pathname, request);
      const searchParameters: HttpSearchParameter = {};
      url.searchParams.forEach((value, key) => {
        searchParameters[key] = value;
      });
      input.queryParameters = searchParameters;
      this.clientToInput.set(input.client, input);
      this.didReceiveContent(input, input.client);
    }
  }
  
  public sendToClient(client: Client, content: any) {
    const input = this.clientToInput.get(client);
    if (input && input instanceof HttpEndpointInput) {
      // todo
      let responseUnit8Array = this.encoder.encode(`${content}`);
      // todo more infomation in response
      input.meta.respond({ body: responseUnit8Array })
    } else {
      // todo throw error here
    }
  }
}