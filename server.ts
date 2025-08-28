import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { db } from "./src/database/client.ts";
import { courses } from "./src/database/schema.ts";
import { eq } from "drizzle-orm";
import { z } from "zod";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.get("/courses", async (request, reply) => {
  const result = await db
    .select({
      id: courses.id,
      title: courses.title,
    })
    .from(courses);

  return reply.send({ courses: result });
});

server.get("/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;
  const courseId = params.id;

  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId));

  if (result.length > 0) {
    return { course: result[0] };
  }

  return reply.status(404).send();
});

server.post(
  "/courses",
  {
    schema: {
      body: z.object({
        title: z.string().min(5, "Título precisa ter 5 caracteres"),
      }),
    },
  },
  async (request, reply) => {
    const courseTitle = request.body.title;

    const result = await db
      .insert(courses)
      .values({
        title: courseTitle,
      })
      .returning();

    return reply.status(201).send({ courseId: result[0].id });
  }
);

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
