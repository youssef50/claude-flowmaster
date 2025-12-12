import { IsString, IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateCardDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsUUID()
  columnId: string;
}
