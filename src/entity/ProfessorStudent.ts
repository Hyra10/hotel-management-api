import {
  BaseEntity,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from "./User";

@ObjectType()
@Index("ProfessorStudent_pkey", ["professorStudentId"], { unique: true })
@Entity("ProfessorStudent")
export class ProfessorStudent extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "ProfessorStudentId" })
  professorStudentId?: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.professorStudents)
  @JoinColumn([{ name: "ProfesorId", referencedColumnName: "userId" }])
  profesor?: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.professorStudents2)
  @JoinColumn([{ name: "StudentId", referencedColumnName: "userId" }])
  student?: User;

  @RelationId((professorStudent: ProfessorStudent) => professorStudent.profesor)
  profesorId?: number[];

  @RelationId((professorStudent: ProfessorStudent) => professorStudent.student)
  studentId?: number[];
}
