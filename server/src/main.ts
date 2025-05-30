import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { TelegramService } from "./telegram/telegram.service";
import { ExceptionsFilter } from "./common/filters/exceptions.filter";
import * as express from "express";
import { join } from "path";

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  const telegramService = app.get(TelegramService);

  app.use("/uploads", express.static(join(__dirname, "..", "uploads")));
  app.useGlobalFilters(new ExceptionsFilter(telegramService));
  app.enableCors({ credentials: true, origin: true });
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("KTK Dashboard")
    .setVersion("1")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        in: "header",
      },
      "jwt",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  await app.listen(PORT, () =>
    console.log(`Server started http://localhost:${PORT}/api/docs`),
  );
}
void bootstrap();
