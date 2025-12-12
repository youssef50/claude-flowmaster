import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Projects
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.projectsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  // Columns
  @Post(':id/columns')
  createColumn(
    @Param('id') projectId: string,
    @Body() createColumnDto: CreateColumnDto
  ) {
    return this.projectsService.createColumn(projectId, createColumnDto);
  }

  @Patch('columns/:columnId')
  updateColumn(
    @Param('columnId') columnId: string,
    @Body() body: { title: string }
  ) {
    return this.projectsService.updateColumn(columnId, body.title);
  }

  @Delete('columns/:columnId')
  deleteColumn(@Param('columnId') columnId: string) {
    return this.projectsService.deleteColumn(columnId);
  }

  // Cards
  @Post('cards')
  createCard(@Body() createCardDto: CreateCardDto) {
    return this.projectsService.createCard(createCardDto);
  }

  @Patch('cards/:cardId')
  updateCard(
    @Param('cardId') cardId: string,
    @Body() updateCardDto: UpdateCardDto
  ) {
    return this.projectsService.updateCard(cardId, updateCardDto);
  }

  @Delete('cards/:cardId')
  deleteCard(@Param('cardId') cardId: string) {
    return this.projectsService.deleteCard(cardId);
  }

  @Post('cards/reorder')
  updateCardsOrder(
    @Body() body: { cards: Array<{ id: string; order: number; columnId: string }> }
  ) {
    return this.projectsService.updateCardsOrder(body.cards);
  }
}
