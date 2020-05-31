import {Adaptor, AdaptorConfigure} from "../adaptor/adaptor.ts";
import {Endpoint, EndpointConfigure} from "../endpoint/endpoint.ts";
import EndpointInput from "../endpoint/endpoint-input.ts";
import {matchPath, parsePath} from "../util/match-path.ts";

export class EnlaceServer {
  protected readonly adaptors: Map<Adaptor<any, any>, AdaptorConfigure>;
  protected endpoints: Map<Endpoint, EndpointConfigure> = new Map();

  get allAdaptors(): Adaptor<any, any>[] {
    return [...this.adaptors.keys()];
  }
  get allEndpoints(): Endpoint[] {
    return [...this.endpoints.keys()];
  }

  constructor(adaptors: Map<Adaptor<any, any>, AdaptorConfigure> = new Map()) {
    this.adaptors = adaptors;
  }

  protected receiveContent(
    adaptor: Adaptor<any, any>,
    content: EndpointInput<any, any>,
  ): void {
    const path = content.path;
    const endpoints = this.decideEndpoints(path);
    let decidedEndpoint: Endpoint | null = null;
    // todo: handle multipe endpoint
    for (const endpoint of endpoints) {
      const selected = this.endpoints.get(endpoint)?.selectAdaptor(
        this.allAdaptors,
      );
      if (typeof selected === typeof adaptor) {
        decidedEndpoint = endpoint;
        break;
      }
    }
    if (decidedEndpoint) {
      const configure = this.endpoints.get(decidedEndpoint);
      content.pathParameters = parsePath(path, configure!.expectedPath);
      const result = decidedEndpoint?.receive(content);
      if (result) {
        adaptor.sendToClient(content, result);
      }
    } else {
      // todo: cannot receive content
    }
  }

  protected decideEndpoints(path: string): Endpoint[] {
    let result: Endpoint[] = [];
    for (const element of this.endpoints) {
      const [endpoint, configure] = element;
      const expectedPath = configure.expectedPath;
      if (matchPath(path, expectedPath)) {
        result.push(endpoint);
      }
    }
    return result;
  }

  public addAdaptor(adaptor: Adaptor<any, any>, configure: AdaptorConfigure) {
    adaptor.attachOnServer(this, configure);
    adaptor.didReceiveContent = (content) => {
      this.receiveContent(adaptor, content);
    };
    this.adaptors.set(adaptor, configure);
  }

  public addEndpoint(endpoint: Endpoint, configure: EndpointConfigure) {
    this.endpoints.set(endpoint, configure);
  }
}
