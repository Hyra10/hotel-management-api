import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from "./User";

@ObjectType()
@Index("UserRole_Name_key", ["name"], { unique: true })
@Index("UserRole_pkey", ["userRoleId"], { unique: true })
@Entity("UserRole")
export class UserRole extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "UserRoleId" })
  userRoleId?: number;

  @Field()
  @Column("character varying", { name: "Name", unique: true, length: 20 })
  name?: string;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.userRole)
  users?: User[];
}
