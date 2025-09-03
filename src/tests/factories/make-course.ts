import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";

export async function makeCourse() {
  const result = await db
    .insert(courses)
    .values({
      title: faker.lorem.words(4),
    })
    .returning();

  return result[0];
}
