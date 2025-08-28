import fastify from "fastify";
import { db } from "./src/database/client";
import { courses } from "./src/database/schema";

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
});

server.get("/courses", async (request, reply) => {
  const result = await db.select().from(courses);

  return reply.send({ courses });
});
