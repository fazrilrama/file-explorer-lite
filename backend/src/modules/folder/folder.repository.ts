import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
import { Folder } from './entities/folder.entity';
import { File } from './entities/file.entity';

@Injectable()
export class FolderRepository {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async findAll(): Promise<Folder[]> {
    return this.folderRepository.find();
  }

  async findById(id: number): Promise<Folder | null> {
    return this.folderRepository.findOne({ where: { id } });
  }

  async findByParentId(parentId: number | null): Promise<Folder[]> {
    return this.folderRepository.find({
      where: parentId === null ? { parentId: IsNull() } : { parentId },
    });
  }

  async findFilesByFolderId(folderId: number): Promise<File[]> {
    return this.fileRepository.find({ where: { folderId } });
  }

  async create(name: string, parentId: number | null): Promise<Folder> {
    const folder = this.folderRepository.create({ name, parentId });
    return this.folderRepository.save(folder);
  }

  async update(id: number, name: string): Promise<Folder> {
    await this.folderRepository.update(id, { name });
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.folderRepository.delete(id);
  }

  async search(query: string): Promise<Folder[]> {
    return this.folderRepository.find({
      where: { name: Like(`%${query}%`) },
    });
  }
}