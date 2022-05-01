import * as fs from 'fs';
import { AppArguments } from '@antwika/app';
import { OpenApiJsonEndpoint } from '../src/OpenApiJsonEndpoint';

jest.mock('fs');

describe('OpenApiJsonEndpoint', () => {
  beforeAll(() => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{ "info": { "title": "Test app" } }');
  });

  it('can be instantiated without app arguments', async () => {
    const appArguments: AppArguments = { args: [] };
    const openApiJsonEndpoint = new OpenApiJsonEndpoint({ appArguments, template: './openapi.json' });
    expect(openApiJsonEndpoint).toBeDefined();
  });

  it('can be instantiated with app arguments', async () => {
    const appArguments: AppArguments = {
      args: [
        {
          shortName: 'sx',
          longName: 'swaggerProtocol',
          description: 'A protocol',
          value: 'http',
        },
        {
          shortName: 'sh',
          longName: 'swaggerHost',
          description: 'A host',
          value: 'localhost',
        },
        {
          shortName: 'sp',
          longName: 'swaggerPort',
          description: 'A port',
          value: '3000',
        },
      ],
    };
    const openApiJsonEndpoint = new OpenApiJsonEndpoint({ appArguments, template: './openapi.json' });
    expect(openApiJsonEndpoint).toBeDefined();
  });

  it('can handle requests', async () => {
    const appArguments: AppArguments = { args: [] };

    const openApiJsonEndpoint = new OpenApiJsonEndpoint({ appArguments, template: './openapi.json' });

    const mockRes = {
      end: jest.fn(),
      writeHead: jest.fn(),
    };

    const req = (): any => ({ url: '/' });
    const res = (): any => mockRes;

    await expect(openApiJsonEndpoint.canHandle({ req, res })).resolves.toBeTruthy();
    await openApiJsonEndpoint.handle({ req, res });
    expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(mockRes.end).toHaveBeenCalled();
  });
});
