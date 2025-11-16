import { Injectable } from '@nestjs/common';
import { FolderRepository } from './folder.repository';
import { Folder } from './entities/folder.entity';
import { File } from './entities/file.entity';

export interface FolderTree {
  id: number;
  name: string;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  children?: FolderTree[];
}

@Injectable()
export class FolderService {
  constructor(private readonly folderRepository: FolderRepository) {}

  async getAllFolders(): Promise<Folder[]> {
    return this.folderRepository.findAll();
  }

  async getFolderTree(): Promise<FolderTree[]> {
    const allFolders = await this.folderRepository.findAll();
    return this.buildTree(allFolders, null);
  }

  async getFolderById(id: number): Promise<Folder | null> {
    return this.folderRepository.findById(id);
  }

  async getSubFolders(parentId: number | null): Promise<Folder[]> {
    return this.folderRepository.findByParentId(parentId);
  }

  async getFiles(folderId: number): Promise<File[]> {
    return this.folderRepository.findFilesByFolderId(folderId);
  }

  async createFolder(name: string, parentId: number | null): Promise<Folder> {
    return this.folderRepository.create(name, parentId);
  }

  async updateFolder(id: number, name: string): Promise<Folder> {
    return this.folderRepository.update(id, name);
  }

  async deleteFolder(id: number): Promise<void> {
    await this.folderRepository.delete(id);
  }

  async searchFolders(query: string): Promise<Folder[]> {
    return this.folderRepository.search(query);
  }

  private buildTree(folders: Folder[], parentId: number | null): FolderTree[] {
    return folders
      .filter(f => f.parentId === parentId)
      .map(folder => ({
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
        children: this.buildTree(folders, folder.id),
      }));
  }
}