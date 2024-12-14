import { Schema, model, connect, Mongoose } from 'mongoose';
import { logger } from '../middlewares/log';
import { MongoInfo } from '../interfaces/MongoInfo';
import mongoose from 'mongoose';

// 設定 strictQuery
mongoose.set('strictQuery', true);

export class MongoDB {
    DB: Mongoose | void | undefined;
    isConnected: boolean = false;

    constructor(info: MongoInfo) {
        const url = `mongodb://${info.name}:${encodeURIComponent(info.password)}@${info.host}:${info.port}/${info.dbName}`;
        this.init(url).then(() => {
            logger.info(`Success: connected to MongoDB @${url}`);
            this.isConnected = true;
        }).catch((err) => {
            logger.error(`Error: cannot connect to MongoDB @${url}`, err);
            process.exit(1); // 停止進程
        });
    }

    async init(url: string) {
        try {
            this.DB = await connect(url);
        } catch (err) {
            logger.error(`Error: cannot connect to MongoDB`, err);
            throw err;
        }
    }

    getState(): boolean {
        return this.isConnected;
    }
}
