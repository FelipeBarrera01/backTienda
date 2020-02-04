"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_1 = __importDefault(require("./routes/post"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
//body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// cors
server.app.use(cors_1.default({ origin: true, credentials: true }));
//FileUpload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
//rutas de la app
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
//conectar DB
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default.connect('mongodb://localhost:27017/tienda', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (err)
        throw err;
    console.log('Base de datos online');
});
//levantar express
server.start(() => {
    console.log(`Servidor en puerto ${server.port}`);
});
