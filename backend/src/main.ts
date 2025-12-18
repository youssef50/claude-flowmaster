import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ProjectsService } from './modules/projects/projects.service';
import { TenantsService } from './modules/tenants/tenants.service';

async function bootstrap() {
  console.log('🚀 Starting Backend Bootstrap...');
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

  // Initialize the app (triggers onModuleInit, connecting Prisma)
  await app.init();

  // Seed demo data if needed
  const projectsService = app.get(ProjectsService);
  const tenantsService = app.get(TenantsService);

  try {
    const existingTenants = await tenantsService.findAll();
    let demoTenant;

    if (existingTenants.length === 0) {
      demoTenant = await tenantsService.create({
        name: 'Demo Workspace',
      });
      console.log('✅ Seeded demo tenant');
    } else {
      demoTenant = existingTenants[0];
    }

    const existingProjects = await projectsService.findAll();
    if (existingProjects.length === 0) {
      await projectsService.create({
        name: 'Demo Project',
        description: 'A sample project for demo purposes',
        tenantId: demoTenant.id,
      });
      console.log('✅ Seeded demo project');
    }
  } catch (error) {
    console.warn('⚠️ Seeding failed:', error.message);
  }

  // Start server
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
  console.log(`API available at http://localhost:${port}/api`);
}
bootstrap();
