import { Module } from '@nestjs/common';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { WorkflowExecutionService } from './workflow-execution.service';
import { SlackModule } from '../slack/slack.module';
import { TeamsModule } from '../teams/teams.module';
import { EngineersModule } from '../engineers/engineers.module';

@Module({
  imports: [SlackModule, TeamsModule, EngineersModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowExecutionService],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
