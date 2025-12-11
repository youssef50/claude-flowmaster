import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateEngineerDto } from './dto/create-engineer.dto';
import { UpdateEngineerDto } from './dto/update-engineer.dto';

@Injectable()
export class EngineersService {
  constructor(private prisma: PrismaService) {}

  async create(createEngineerDto: CreateEngineerDto) {
    return this.prisma.engineer.create({
      data: createEngineerDto,
      include: {
        team: true,
      },
    });
  }

  async findAll(teamId?: string) {
    return this.prisma.engineer.findMany({
      where: teamId ? { teamId } : undefined,
      include: {
        team: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const engineer = await this.prisma.engineer.findUnique({
      where: { id },
      include: {
        team: true,
      },
    });

    if (!engineer) {
      throw new NotFoundException(`Engineer with ID ${id} not found`);
    }

    return engineer;
  }

  async update(id: string, updateEngineerDto: UpdateEngineerDto) {
    await this.findOne(id);
    return this.prisma.engineer.update({
      where: { id },
      data: updateEngineerDto,
      include: {
        team: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.engineer.delete({
      where: { id },
    });
  }
}
