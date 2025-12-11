import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRunbookDto } from './dto/create-runbook.dto';
import { UpdateRunbookDto } from './dto/update-runbook.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class RunbooksService {
  constructor(private prisma: PrismaService) {}

  // Runbooks
  async createRunbook(createRunbookDto: CreateRunbookDto) {
    const { tagIds, ...runbookData } = createRunbookDto;

    const runbook = await this.prisma.runbook.create({
      data: {
        ...runbookData,
        content: runbookData.content || { blocks: [] },
        tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        folder: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return runbook;
  }

  async findAllRunbooks(folderId?: string, tagId?: string) {
    return this.prisma.runbook.findMany({
      where: {
        ...(folderId && { folderId }),
        ...(tagId && {
          tags: {
            some: {
              tagId,
            },
          },
        }),
      },
      include: {
        folder: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOneRunbook(id: string) {
    return this.prisma.runbook.findUnique({
      where: { id },
      include: {
        folder: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async updateRunbook(id: string, updateRunbookDto: UpdateRunbookDto) {
    const { tagIds, ...runbookData } = updateRunbookDto;

    // If tagIds are provided, update the tags
    if (tagIds !== undefined) {
      // Delete existing tags
      await this.prisma.runbookTag.deleteMany({
        where: { runbookId: id },
      });

      // Create new tags
      if (tagIds.length > 0) {
        await this.prisma.runbookTag.createMany({
          data: tagIds.map((tagId) => ({
            runbookId: id,
            tagId,
          })),
        });
      }
    }

    return this.prisma.runbook.update({
      where: { id },
      data: runbookData,
      include: {
        folder: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async deleteRunbook(id: string) {
    return this.prisma.runbook.delete({
      where: { id },
    });
  }

  // Folders
  async createFolder(createFolderDto: CreateFolderDto) {
    return this.prisma.folder.create({
      data: createFolderDto,
    });
  }

  async findAllFolders() {
    return this.prisma.folder.findMany({
      include: {
        _count: {
          select: { runbooks: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async deleteFolder(id: string) {
    return this.prisma.folder.delete({
      where: { id },
    });
  }

  // Tags
  async createTag(createTagDto: CreateTagDto) {
    return this.prisma.tag.create({
      data: createTagDto,
    });
  }

  async findAllTags() {
    return this.prisma.tag.findMany({
      include: {
        _count: {
          select: { runbooks: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async deleteTag(id: string) {
    return this.prisma.tag.delete({
      where: { id },
    });
  }
}
