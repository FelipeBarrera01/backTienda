import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../clases/file-system';




const postRoutes = Router();
const fileSystem = new FileSystem();
//obtener
postRoutes.get('/', async(req: any, res: Response)=>{

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    //ordenar el resultado con sort()
     const posts = await Post.find()
    .sort({_id: -1})
    .skip(skip)
    .limit(10)
    .populate('usuario', '-password')
     .exec();
     res.json({
         ok: true,
         pagina,
         posts
     });
});
// crear post
postRoutes.post('/',  [verificaToken], (req: any, res: Response) =>{
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
    body.img = imagenes;

    Post.create(body).then(async postDB =>{
        //En la respuesta de la creacion exite un nodo llamado usuario, populate extrae informacion
        //especfica del usuario y la añade en ese nodo. -password es para evitar que la constraseña salga
       await postDB.populate('usuario', '-password').execPopulate();


        res.json({
        ok: true,
        post:postDB
    });
    }).catch(err =>{
        res.json(err);
    });

    
});

postRoutes.post('/upload', [verificaToken], async (req:any , res:Response)=>{
    
    if(!req.files){
         return res.status(400).json({
             ok: false,
             mensaje: 'No se subió ningun archivo'
         });
    }
    const file: FileUpload = req.files.image;
    if(!file){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo - image'
        });
    }
    if(!file.mimetype.includes('image')){
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subió no es una imagen'
        });
    }

    await fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
});
postRoutes.get('/imagen/:userid/:img', (req: any, res: Response)=>{
    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});

export  default postRoutes;