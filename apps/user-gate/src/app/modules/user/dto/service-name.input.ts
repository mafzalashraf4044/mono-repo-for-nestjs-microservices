import { Field, InputType, registerEnumType } from '@nestjs/graphql';

import { MicroServices } from '@swiq/common/enums';
import { IsEnum } from 'class-validator';

// Register enum type
registerEnumType(MicroServices, {
  name: 'MicroServices',
});

@InputType()
class ServiceNameDTO {
  @Field(() => MicroServices)
  @IsEnum(MicroServices)
  serviceName: MicroServices;
}

export default ServiceNameDTO;
