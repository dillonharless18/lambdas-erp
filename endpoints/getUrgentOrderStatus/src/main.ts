import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as serverless from 'aws-serverless-express';
import * as express from 'express';

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  // app.enableCors(); // Enable CORS if needed
  await app.init();

  const server = serverless.createServer(expressApp);
  exports.handler = (event, context) =>
    serverless.proxy(server, event, context);
}
bootstrap();
