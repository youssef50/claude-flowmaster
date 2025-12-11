import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SlackConfigService } from './slack-config.service';
import { CreateSlackConfigDto } from './dto/create-slack-config.dto';
import { UpdateSlackConfigDto } from './dto/update-slack-config.dto';

@Controller('slack-config')
export class SlackConfigController {
  constructor(private readonly slackConfigService: SlackConfigService) {}

  @Post()
  create(@Body() createSlackConfigDto: CreateSlackConfigDto) {
    return this.slackConfigService.create(createSlackConfigDto);
  }

  @Get()
  findAll() {
    return this.slackConfigService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slackConfigService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSlackConfigDto: UpdateSlackConfigDto) {
    return this.slackConfigService.update(id, updateSlackConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slackConfigService.remove(id);
  }
}
