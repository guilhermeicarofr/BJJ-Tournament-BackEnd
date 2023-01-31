import { registrations } from "@prisma/client"
import { db } from "database/database"

export async function createRegistration({ userId, categoryId }: Partial<registrations>) {
  return await db.registrations.create({
    data: {
      userId,
      categoryId
    }
  });
}
