import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  parentId?: number | null;
}