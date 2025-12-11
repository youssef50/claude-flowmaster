import { IsString, IsEmail, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateEngineerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  slackUserId?: string;

  @IsUUID()
  teamId: string;
}
