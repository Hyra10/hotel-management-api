import { User } from '../../entity/User';
import { Resolver, Arg, Query, Int, UseMiddleware, Ctx } from 'type-graphql';
import { Report } from '../../entity/Report';
import { isAuth } from '../middlewares/isAuth';
import { MyContext } from '../../utils/MyContext';

const mapRawQueryToReports = (rawQuery: any): Report[] => {
  const reports = rawQuery.map((x: any) => {
    const r = new Report()
    const u = new User();

    u.userId = x.UserId;
    u.userName = x.UserName;
    r.reportId = x.ReportId;
    r.message = x.Message;
    r.createdAt = x.CreatedAt;
    r.user = u

    return r
  });

  return reports;
}

@Resolver()
export class ReportResolver {

  @Query(() => [Report])
  async GetAllReports(
    @Arg('profesorId', () => Int) profesorId: number,
  ): Promise<Report[]> {
    
    const rawQuery = await Report.query(`
    SELECT "ReportId", "Message", "r"."CreatedAt",
      "u"."UserId", "u"."UserName" 
      FROM "Report" AS "r"
    JOIN "ProfessorStudent" AS "ps"
      ON "r"."UserId" = "ps"."StudentId"
    JOIN "User" AS "u"
      ON "r"."UserId" = "u"."UserId"
    WHERE "ps"."ProfesorId" = ${profesorId}
    ORDER BY "r"."CreatedAt" DESC`
    ) || [];

    const reports = mapRawQueryToReports(rawQuery)

    return reports;
  }

  @Query(() => [Report])
  @UseMiddleware(isAuth)
  async GetAllReportsByStudentId(
    @Arg('studentId', () => Int) studentId: number,
    @Ctx() { payload }: MyContext,
    ): Promise<Report[]> {
    const profesorId = +payload!.userId;

    const rawQuery = await Report.query(`
      SELECT "ReportId", "Message", "r"."CreatedAt",
        "u"."UserId", "u"."UserName" 
      FROM "Report" AS "r"
      JOIN "ProfessorStudent" AS "ps"
        ON "r"."UserId" = "ps"."StudentId"
      JOIN "User" AS "u"
        ON "r"."UserId" = "u"."UserId"
      WHERE "ps"."ProfesorId" = ${profesorId}
        AND "r"."UserId" = ${studentId}
      ORDER BY "r"."CreatedAt" DESC`
    ) || [];

    const reports = mapRawQueryToReports(rawQuery)

    return reports;
  }



}
