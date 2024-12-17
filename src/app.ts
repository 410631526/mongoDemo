import express from 'express'
import {router} from "./Routers"
import { logger } from './middlewares/log';
const http = require('http');
import cors from 'cors';
import { MongoDB } from './utils/MongoDB';
require('dotenv').config()
const app: express.Application = express()
const server = http.createServer(app);

export const DB = new MongoDB({
  name:process.env.DBUSER as string,
  password:process.env.DBPASSWORD as string,
  host:process.env.DBHOST as string,
  port:process.env.DBPORT as string,
  dbName:process.env.DBNAME as string
});

// 確保從環境變數中讀取前端的 origin URL
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173"; // 默認使用 http://localhost:5173

app.use(cors({
  origin: frontendOrigin, // 設置具體的前端 URL，而不是 '*'
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  exposedHeaders: ['Content-Disposition'],
  credentials: true,  // 允許帶憑證的請求
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use('/assets', express.static(process.env.assetsPath as string));

for (const route of router) {
  app.use(route.getRouter());
}

server.listen(process.env.PORT, () => {
  logger.info('listening on *:' + process.env.PORT);
});