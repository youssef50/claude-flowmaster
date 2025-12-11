import { IsOptional, IsObject } from 'class-validator';

export class ExecuteWorkflowDto {
  @IsOptional()
  @IsObject()
  initialData?: Record<string, any>;
}
