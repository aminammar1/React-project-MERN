import swaggerJSDoc from "swagger-jsdoc";

const option = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Real Estate Project API",
      version: "1.0.0",
      description: "Real Estate Project API with express",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./server/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(option);
export default swaggerSpec;
