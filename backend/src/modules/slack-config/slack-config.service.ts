import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSlackConfigDto } from './dto/create-slack-config.dto';
import { UpdateSlackConfigDto } from './dto/update-slack-config.dto';

@Injectable()
export class SlackConfigService {
  constructor(private prisma: PrismaService) {}

  async create(createSlackConfigDto: CreateSlackConfigDto) {
    return this.prisma.slackConfig.create({
      data: createSlackConfigDto,
    });
  }

  async findAll() {
    return this.prisma.slackConfig.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const config = await this.prisma.slackConfig.findUnique({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(`Slack config with ID ${id} not found`);
    }

    return config;
  }

  async update(id: string, updateSlackConfigDto: UpdateSlackConfigDto) {
    await this.findOne(id);
    return this.prisma.slackConfig.update({
      where: { id },
      data: updateSlackConfigDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.slackConfig.delete({
      where: { id },
    });
  }

  async getDefaultConfig() {
    const configs = await this.prisma.slackConfig.findMany({
      take: 1,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return configs[0] || null;
  }
}
