import { AppArguments } from '@antwika/app';
import { IHttpHandler, IHttpHandlable } from '@antwika/http';

export class SwaggerEndpoint implements IHttpHandler {
  private readonly openApiJsonUrl: string;

  constructor(appArguments: AppArguments) {
    const protocol = appArguments.args.find((arg) => arg.longName === 'swaggerProtocol')?.value || 'http';
    const host = appArguments.args.find((arg) => arg.longName === 'swaggerHost')?.value || 'localhost';
    const port = appArguments.args.find((arg) => arg.longName === 'swaggerPort')?.value || '3000';

    this.openApiJsonUrl = `${protocol}://${host}:${port}/api-docs/swagger.json`;
  }

  async canHandle(handlable: IHttpHandlable) {
    return !!handlable;
  }

  async handle(handlable: IHttpHandlable) {
    const res = handlable.res();

    const swaggerHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="SwaggerUI"
        />
        <title>SwaggerUI</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
      </head>
      <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js" crossorigin></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: '${this.openApiJsonUrl}',
            dom_id: '#swagger-ui',
          });
        };
      </script>
      </body>
      </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(swaggerHtml);
  }
}
