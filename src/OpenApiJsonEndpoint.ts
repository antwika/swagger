import { AppArguments } from '@antwika/app';
import { IHttpHandler, IHttpHandlable } from '@antwika/http';

import fs from 'fs';
import { resolve } from 'path';

export interface IOpenApiJsonEndpointArgs {
  appArguments: AppArguments,
  template: string;
  title?: string;
}

export class OpenApiJsonEndpoint implements IHttpHandler {
  private openApiJsonContent: string;

  constructor(args: IOpenApiJsonEndpointArgs) {
    const protocol = args.appArguments.args.find((arg) => arg.longName === 'protocol')?.value || 'http';
    const host = args.appArguments.args.find((arg) => arg.longName === 'host')?.value || 'localhost';
    const port = args.appArguments.args.find((arg) => arg.longName === 'port')?.value || '3000';

    const content = JSON.parse(fs.readFileSync(resolve(args.template), 'utf8'));
    content.info.title = args.title || 'Swagger API';
    content.schemes = [protocol];
    content.host = `${host}:${port}`;

    this.openApiJsonContent = content;
  }

  async canHandle(handlable: IHttpHandlable) {
    return !!handlable;
  }

  async handle(handlable: IHttpHandlable) {
    const res = handlable.res();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(this.openApiJsonContent));
  }
}
