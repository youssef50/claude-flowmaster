import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateRunbookDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  content?: any; // JSON content

  @IsOptional()
  @IsUUID()
  folderId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];
}
