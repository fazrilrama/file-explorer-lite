import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';

@Controller('api/v1/folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  async getAllFolders() {
    const folders = await this.folderService.getAllFolders();
    return { success: true, data: folders };
  }

  @Get('tree')
  async getFolderTree() {
    const tree = await this.folderService.getFolderTree();
    return { success: true, data: tree };
  }

  @Get(':id/subfolders')
  async getSubFolders(@Param('id') id: string) {
    const parentId = id === 'root' ? null : parseInt(id);
    const subFolders = await this.folderService.getSubFolders(parentId);
    return { success: true, data: subFolders };
  }

  @Get(':id/files')
  async getFiles(@Param('id') id: string) {
    const files = await this.folderService.getFiles(parseInt(id));
    return { success: true, data: files };
  }

  @Get('search')
  async searchFolders(@Query('q') query: string) {
    const results = await this.folderService.searchFolders(query || '');
    return { success: true, data: results };
  }

  @Post()
  async createFolder(@Body() createFolderDto: CreateFolderDto) {
    const folder = await this.folderService.createFolder(
      createFolderDto.name,
      createFolderDto.parentId || null,
    );
    return { success: true, data: folder };
  }

  @Put(':id')
  async updateFolder(@Param('id') id: string, @Body('name') name: string) {
    const folder = await this.folderService.updateFolder(parseInt(id), name);
    return { success: true, data: folder };
  }

  @Delete(':id')
  async deleteFolder(@Param('id') id: string) {
    await this.folderService.deleteFolder(parseInt(id));
    return { success: true, message: 'Folder deleted successfully' };
  }
}