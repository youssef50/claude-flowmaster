import { Module } from '@nestjs/common';
import { RunbooksService } from './runbooks.service';
import { RunbooksController, FoldersController, TagsController } from './runbooks.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RunbooksController, FoldersController, TagsController],
  providers: [RunbooksService],
})
export class RunbooksModule {}
