import { IsString, IsInt, IsOptional, IsUUID } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsUUID()
  columnId?: string;
}
