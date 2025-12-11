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
import { RunbooksService } from './runbooks.service';
import { CreateRunbookDto } from './dto/create-runbook.dto';
import { UpdateRunbookDto } from './dto/update-runbook.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('runbooks')
export class RunbooksController {
  constructor(private readonly runbooksService: RunbooksService) {}

  // Runbooks
  @Post()
  create(@Body() createRunbookDto: CreateRunbookDto) {
    return this.runbooksService.createRunbook(createRunbookDto);
  }

  @Get()
  findAll(@Query('folderId') folderId?: string, @Query('tagId') tagId?: string) {
    return this.runbooksService.findAllRunbooks(folderId, tagId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.runbooksService.findOneRunbook(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRunbookDto: UpdateRunbookDto) {
    return this.runbooksService.updateRunbook(id, updateRunbookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.runbooksService.deleteRunbook(id);
  }
}

@Controller('folders')
export class FoldersController {
  constructor(private readonly runbooksService: RunbooksService) {}

  @Post()
  create(@Body() createFolderDto: CreateFolderDto) {
    return this.runbooksService.createFolder(createFolderDto);
  }

  @Get()
  findAll() {
    return this.runbooksService.findAllFolders();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.runbooksService.deleteFolder(id);
  }
}

@Controller('tags')
export class TagsController {
  constructor(private readonly runbooksService: RunbooksService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.runbooksService.createTag(createTagDto);
  }

  @Get()
  findAll() {
    return this.runbooksService.findAllTags();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.runbooksService.deleteTag(id);
  }
}
