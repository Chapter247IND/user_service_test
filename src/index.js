import cors from "cors";
import express from "express";
import expressJSDocSwagger from "express-jsdoc-swagger";
import swStats from "swagger-stats";
import trimRequest from "trim-request";
import router from "./routes";

const options = {
  info: {
    version: "1.0.0",
    title: "API Doc",
    description: "API Doc",
  },
  security: {
    BearerAuth: {
      type: "http",
      scheme: "bearer",
    },
  },
  baseDir: __dirname,
  swaggerUIPath: "/api-docs",
  exposeSwaggerUI: true,
};

const app = express();

expressJSDocSwagger(app)(options).on("finish", (config) => {
  app.use(swStats.getMiddleware({ swaggerSpec: config }));
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use("/v1", trimRequest.all, router);

const PORT = process.env.PORT || 8000;

app
  .listen(PORT)
  .on("listening", () => {
    console.log("Process started on port %d", PORT);
  })
  .on("error", console.log);
