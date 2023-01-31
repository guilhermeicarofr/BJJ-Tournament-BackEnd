import { categories } from "@prisma/client";
import { db } from "database/database";

export async function createCategory({ eventId, absolute, male, belt, ageClass, weightClass }: Partial<categories>) {
  return await db.categories.create({
    data: {
      eventId,
      absolute,
      male,
      belt,
      ageClass,
      weightClass
    }
  });
}
