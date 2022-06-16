import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import createError from 'http-errors';
import type { FromSchema } from 'json-schema-to-ts';

import config from '../config';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export function formatJSONResponse(response: Record<string, unknown>) {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}

export function createJSONReponse(response: Record<string, unknown>) {
  return formatJSONResponse(response);
}

export function createJSONError(statusCode: number, message: string, properties?: { [key: string]: any }) {
  return createError(statusCode, JSON.stringify({ message }), { expose: config.debug, ...properties });
}
