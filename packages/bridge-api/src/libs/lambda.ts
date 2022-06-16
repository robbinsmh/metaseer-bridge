import { Handler as LambdaHandler } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';

export const middyfy = (handler: LambdaHandler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(httpErrorHandler())
    .use(cors());
};
