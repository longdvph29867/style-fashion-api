import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import bodyParser from "body-parser";
import routes from "./src/routes/index.js";
import { connectDB } from "./src/utils/db.js";
dotenv.config();
const PORT = process.env.PORT;
const URI_DB = process.env.MONGODB_URL;
// CDN CSS
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const app = express();

// Middleware để chuyển hướng
app.use((req, res, next) => {
  if (req.url === "/") {
    return res.redirect("https://style-fashion-api.vercel.app/v1/docs");
  }
  next();
});

app.use(bodyParser.json()); // to use body object in requests
dotenv.config();

app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
// connectDB(URI_DB);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Style fashion API",
      version: "0.1.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: "https://style-fashion-api.vercel.app/api/v1",
      },
      {
        url: "https://style-fashion-api-2rrd.vercel.app/api/v1",
      },
      {
        url: "http://localhost:8000/api/v1",
      },
    ],
  },
  apis: ["./src/**/*.js"],
  cors: true,
};

const specs = swaggerJsDoc(options);

app.use(
  "/v1/docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, { customCssUrl: CSS_URL })
);

app.use("/api/v1", routes);

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));
