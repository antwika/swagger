import { AppArguments } from '@antwika/app';
import { SwaggerEndpoint } from '../src/SwaggerEndpoint';

describe('SwaggerEndpoint', () => {
  it('can be instantiated without app arguments', async () => {
    const appArguments: AppArguments = {
      args: [],
    };
    const swaggerEndpoint = new SwaggerEndpoint(appArguments);
    expect(swaggerEndpoint).toBeDefined();
  });

  it('can handle and respond to incoming requests', async () => {
    const appArguments: AppArguments = {
      args: [
        {
          shortName: 'x',
          longName: 'protocol',
          description: 'A protocol',
          value: 'http',
        },
        {
          shortName: 'h',
          longName: 'host',
          description: 'A host',
          value: 'localhost',
        },
        {
          shortName: 'p',
          longName: 'port',
          description: 'A port',
          value: '3000',
        },
      ],
    };
    const swaggerEndpoint = new SwaggerEndpoint(appArguments);

    const mockRes = {
      end: jest.fn(),
      writeHead: jest.fn(),
    };

    const req = (): any => ({ url: '/' });
    const res = (): any => mockRes;

    expect(swaggerEndpoint.canHandle({ req, res })).toBeTruthy();

    await swaggerEndpoint.handle({ req, res });

    expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'text/html' });
    expect(mockRes.end).toHaveBeenCalled();
  });
});
