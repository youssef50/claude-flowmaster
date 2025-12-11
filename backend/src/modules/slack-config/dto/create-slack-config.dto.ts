import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSlackConfigDto {
  @IsString()
  @IsNotEmpty()
  workspace: string;

  @IsString()
  @IsNotEmpty()
  botToken: string;

  @IsString()
  @IsOptional()
  defaultChannel?: string;
}
