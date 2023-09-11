import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType({ description: 'user' })
class User {
  @Field(() => ID)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({
    nullable: true,
  })
  username: string;

  @Field()
  country: string;

  @Field()
  status: string;

  @Field({
    nullable: true,
  })
  photo: string;

  @Field({
    nullable: true,
  })
  refreshToken: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export default User;
