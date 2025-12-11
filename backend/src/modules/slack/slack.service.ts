import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SlackConfigService } from '../slack-config/slack-config.service';

@Injectable()
export class SlackService {
  private client: WebClient | null = null;

  constructor(private slackConfigService: SlackConfigService) {}

  private async getClient(): Promise<WebClient> {
    if (this.client) {
      return this.client;
    }

    const config = await this.slackConfigService.getDefaultConfig();
    if (!config) {
      throw new InternalServerErrorException('No Slack configuration found. Please create a Slack config first.');
    }

    this.client = new WebClient(config.botToken);
    return this.client;
  }

  async sendMessage(channel: string, text: string) {
    try {
      const client = await this.getClient();
      const result = await client.chat.postMessage({
        channel,
        text,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to send Slack message: ${error.message}`);
    }
  }

  async sendDirectMessage(userId: string, text: string) {
    try {
      const client = await this.getClient();

      // Open a DM channel with the user
      const dmChannel = await client.conversations.open({
        users: userId,
      });

      if (!dmChannel.channel?.id) {
        throw new Error('Failed to open DM channel');
      }

      // Send message to the DM channel
      const result = await client.chat.postMessage({
        channel: dmChannel.channel.id,
        text,
      });

      return result;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to send DM: ${error.message}`);
    }
  }
}
