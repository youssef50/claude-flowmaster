import { PartialType } from '@nestjs/mapped-types';
import { CreateSlackConfigDto } from './create-slack-config.dto';

export class UpdateSlackConfigDto extends PartialType(CreateSlackConfigDto) {}
