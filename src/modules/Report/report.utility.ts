import { Report } from "../../entity/Report";


export const clientMessage = (word: string, cedula: string) =>
  `${word} Cliente Cedula: ${cedula}`;

export const addNewReport = async(
  userId: number, message: string
): Promise<boolean> => {
    
  const rawQuery = Report.create({
    user: { userId },
    message,
    createdAt: new Date(),
  })

  await rawQuery.save();

  return true;
}