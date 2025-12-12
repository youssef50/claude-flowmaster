import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // Projects
  async create(createProjectDto: CreateProjectDto) {
    // Create project with default columns
    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        columns: {
          create: [
            { title: 'Business Development', order: 0 },
            { title: 'Scoping', order: 1 },
            { title: 'In Progress', order: 2 },
            { title: 'Delivered', order: 3 },
          ],
        },
      },
      include: {
        columns: {
          include: {
            cards: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        tenant: true,
      },
    });

    return project;
  }

  async findAll(tenantId?: string) {
    return this.prisma.project.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        tenant: true,
        _count: {
          select: { columns: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        tenant: true,
        columns: {
          include: {
            cards: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
      include: {
        columns: {
          include: {
            cards: true,
          },
        },
        tenant: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  // Columns
  async createColumn(projectId: string, createColumnDto: CreateColumnDto) {
    const columnCount = await this.prisma.projectColumn.count({
      where: { projectId },
    });

    return this.prisma.projectColumn.create({
      data: {
        ...createColumnDto,
        projectId,
        order: createColumnDto.order ?? columnCount,
      },
      include: {
        cards: true,
      },
    });
  }

  async updateColumn(columnId: string, title: string) {
    return this.prisma.projectColumn.update({
      where: { id: columnId },
      data: { title },
    });
  }

  async deleteColumn(columnId: string) {
    return this.prisma.projectColumn.delete({
      where: { id: columnId },
    });
  }

  // Cards
  async createCard(createCardDto: CreateCardDto) {
    const cardCount = await this.prisma.projectCard.count({
      where: { columnId: createCardDto.columnId },
    });

    return this.prisma.projectCard.create({
      data: {
        ...createCardDto,
        order: createCardDto.order ?? cardCount,
      },
    });
  }

  async updateCard(cardId: string, updateCardDto: UpdateCardDto) {
    return this.prisma.projectCard.update({
      where: { id: cardId },
      data: updateCardDto,
    });
  }

  async deleteCard(cardId: string) {
    return this.prisma.projectCard.delete({
      where: { id: cardId },
    });
  }

  // Bulk update cards order
  async updateCardsOrder(cards: Array<{ id: string; order: number; columnId: string }>) {
    await this.prisma.$transaction(
      cards.map((card) =>
        this.prisma.projectCard.update({
          where: { id: card.id },
          data: { order: card.order, columnId: card.columnId },
        })
      )
    );

    return { success: true };
  }
}
