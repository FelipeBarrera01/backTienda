import Server from './clases/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';
import cors from 'cors';



const server = new Server();
//body parser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());
// cors
server.app.use(cors({origin: true, credentials: true}));
//FileUpload
server.app.use(fileUpload({useTempFiles: true}));

//rutas de la app
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);


//conectar DB
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/tienda',{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err)=>{
    if(err) throw err;
    console.log('Base de datos online');
});

//levantar express
server.start(()=>{
    console.log(`Servidor en puerto ${server.port}`);
});