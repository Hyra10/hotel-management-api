import {
  BaseEntity,
  Column,
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
@Index("Report_pkey", ["reportId"], { unique: true })
@Entity("Report")
export class Report extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "ReportId" })
  reportId?: number;

  @Field()
  @Column("character varying", { name: "Message", length: 500 })
  message?: string;

  @Field()
  @Column("timestamp without time zone", { name: "CreatedAt" })
  createdAt?: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user?: User;

  @RelationId((report: Report) => report.user)
  userId?: number[];
}
