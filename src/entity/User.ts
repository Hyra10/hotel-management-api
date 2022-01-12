import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';
import { Hotel } from "./Hotel";
import { ProfessorStudent } from "./ProfessorStudent";
import { Report } from "./Report";
import { UserRole } from "./UserRole";

@ObjectType()
@Index("User_Email_key", ["email"], { unique: true })
@Index("User_pkey", ["userId"], { unique: true })
@Index("User_UserName_key", ["userName"], { unique: true })
@Entity("User")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "UserId" })
  userId?: number;

  @Field()
  @Column("character varying", { name: "UserName", unique: true, length: 15 })
  userName?: string;

  @Field()
  @Column("character varying", { name: "Email", unique: true, length: 50 })
  email?: string;

  @Field()
  @Column("character varying", { name: "Password" })
  password: string;

  @Field()
  @Column("timestamp without time zone", { name: "CreatedAt" })
  createdAt?: Date;

  @Field()
  @Column("timestamp without time zone", { name: "UpdatedAt" })
  updatedAt?: Date;

  @Field(() => Date, { nullable: true })
  @Column("timestamp without time zone", { name: "DeletedAt", nullable: true })
  deletedAt?: Date | null;

  @Field()
  @Column('int', { default: 0 })
  tokenVersion: number;

  @Field()
  @Column('boolean', { default: false })
  needsNewPassword: boolean;

  @Field(() => [Hotel])
  @OneToMany(() => Hotel, (hotel) => hotel.user)
  hotels?: Hotel[];

  @Field(() => [ProfessorStudent])
  @OneToMany(
    () => ProfessorStudent,
    (professorStudent) => professorStudent.profesor
  )
  professorStudents?: ProfessorStudent[];

  @Field(() => [ProfessorStudent])
  @OneToMany(
    () => ProfessorStudent,
    (professorStudent) => professorStudent.student
  )
  professorStudents2?: ProfessorStudent[];

  @Field(() => [Report])
  @OneToMany(() => Report, (report) => report.user)
  reports?: Report[];

  @Field(() => UserRole)
  @ManyToOne(() => UserRole, (userRole) => userRole.users)
  @JoinColumn([{ name: "UserRoleId", referencedColumnName: "userRoleId" }])
  userRole?: UserRole;

  @RelationId((user: User) => user.userRole)
  userRoleId?: number[];
}
