import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { FolderRepository } from './folder.repository';
import { Folder } from './entities/folder.entity';
import { File } from './entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, File])],
  controllers: [FolderController],
  providers: [FolderService, FolderRepository],
  exports: [FolderService],
})
export class FolderModule {}