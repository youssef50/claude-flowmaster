import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { SlackConfigModule } from '../slack-config/slack-config.module';

@Module({
  imports: [SlackConfigModule],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
