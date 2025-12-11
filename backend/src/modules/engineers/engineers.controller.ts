import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EngineersService } from './engineers.service';
import { CreateEngineerDto } from './dto/create-engineer.dto';
import { UpdateEngineerDto } from './dto/update-engineer.dto';

@Controller('engineers')
export class EngineersController {
  constructor(private readonly engineersService: EngineersService) {}

  @Post()
  create(@Body() createEngineerDto: CreateEngineerDto) {
    return this.engineersService.create(createEngineerDto);
  }

  @Get()
  findAll(@Query('teamId') teamId?: string) {
    return this.engineersService.findAll(teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.engineersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEngineerDto: UpdateEngineerDto) {
    return this.engineersService.update(id, updateEngineerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.engineersService.remove(id);
  }
}
