import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateWorkflowDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  nodes: any[];

  @IsArray()
  edges: any[];
}
