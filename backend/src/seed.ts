import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FolderService } from './modules/folder/folder.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { File } from './modules/folder/entities/file.entity';
import { Repository } from 'typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const folderService = app.get(FolderService);
  const fileRepository: Repository<File> = app.get(getRepositoryToken(File));

  console.log('🌱 Seeding database...');

  // Create root folders
  const documents = await folderService.createFolder('Documents', null);
  const pictures = await folderService.createFolder('Pictures', null);
  const music = await folderService.createFolder('Music', null);

  // Create subfolders
  const work = await folderService.createFolder('Work', documents.id);
  const personal = await folderService.createFolder('Personal', documents.id);
  const vacation = await folderService.createFolder('Vacation 2024', pictures.id);
  const family = await folderService.createFolder('Family', pictures.id);

  // Create nested folders
  await folderService.createFolder('Projects', work.id);
  await folderService.createFolder('Reports', work.id);

  // Create files
  await fileRepository.save([
    { name: 'resume.pdf', folderId: work.id, size: 245000, mimeType: 'application/pdf' },
    { name: 'cover-letter.docx', folderId: work.id, size: 128000, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { name: 'beach.jpg', folderId: vacation.id, size: 2300000, mimeType: 'image/jpeg' },
    { name: 'sunset.jpg', folderId: vacation.id, size: 1800000, mimeType: 'image/jpeg' },
  ]);

  console.log('✅ Seeding completed!');
  await app.close();
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});