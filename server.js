const fastify = require("fastify");

const server = fastify();

const courses = [
  { id: 1, title: "Curso de Node.js" },
  { id: 2, title: "Curso de React" },
  { id: 3, title: "Curso de React Native" },
];

server.get("/courses", () => {
  return courses;
});

server.post("/courses", () => {
  
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server runnning!");
});
