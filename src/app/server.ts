import express = require("express");
import * as http from "http";
import {CorsOptions} from "cors";
import * as bodyParser from "body-parser";
import cors = require("cors");

export class Server {
    public static readonly PORT: number = 8888;
    // @ts-ignore
    private app: express.Application;
    // @ts-ignore
    private server: http.Server;
    // @ts-ignore
    private option: CorsOptions;
    // @ts-ignore
    private port: string | number;

    constructor() {
        this.createApp();
        this.createServer();
        this.createOptions();
        this.config();
        this.mountRoutesDefault();
    }

    private createApp(): void {
        this.app = express();
        this.app.use(bodyParser.urlencoded({extended: false}))
        this.app.use(bodyParser.json())
    }

    private createServer(): void {
        this.server = http.createServer(this.app)
    }

    private createOptions(): void {
        this.option = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: '*',
            preflightContinue: false
        };
    }

    private config(): void {
        this.port = process.env.PORT || Server.PORT;
    }

    private mountRoutesDefault() {
        this.server.listen(this.port, () => {
            console.log(`Server running on port: ${this.port}`)
        });

        const router = express.Router();

        router.use(cors(this.option));

        router.get('/', (req, res) => {
            res.json({"message": "Server started"});
        });

        this.app.use("/", router);
    }
}
