import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { TeamsModule } from './modules/teams/teams.module';
import { EngineersModule } from './modules/engineers/engineers.module';
import { SlackConfigModule } from './modules/slack-config/slack-config.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { SlackModule } from './modules/slack/slack.module';
import { RunbooksModule } from './modules/runbooks/runbooks.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { ProjectsModule } from './modules/projects/projects.module';
import databaseConfig from './config/database.config';
import slackConfig from './config/slack.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, slackConfig],
    }),
    PrismaModule,
    TeamsModule,
    EngineersModule,
    SlackConfigModule,
    WorkflowsModule,
    SlackModule,
    RunbooksModule,
    TenantsModule,
    ProjectsModule,
  ],
})
export class AppModule {}
