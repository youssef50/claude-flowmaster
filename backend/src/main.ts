import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ProjectsService } from './modules/projects/projects.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.CORS_ORIGIN,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  const projectsService = app.get(ProjectsService);
  const existing = await projectsService.findAll();
  if (existing.length === 0) {
    await projectsService.create({
      name: 'Demo Project',
      description: 'A sample project for demo purposes',
      tenantId: 'demo-tenant',
    });
    console.log('✅ Seeded demo project');
  }

  // Start server
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
  console.log(`API available at http://localhost:${port}/api`);
}
bootstrap();
