import { Router, Request, Response} from 'express';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../clases/token';
import { verificaToken } from '../middlewares/autenticacion';





const userRoutes = Router();
userRoutes.post('/login', (req: Request, res: Response)=>{
    const body = req.body;
    Usuario.findOne({email: body.email}, (err, userDB) =>{
        if(err) throw err;
        if(!userDB){
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
        if(userDB.compararContrasena(body.password )){
            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                avatar: userDB.avatar,
                email: userDB.email,
                
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }else{
            return res.json({
                ok: false
            });
        }
    });

});

userRoutes.post('/create', (req: Request, res: Response)=>{
    
    const user = {
        nombre: req.body.nombre,
        avatar: req.body.avatar,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10) 
    };
    Usuario.create(user).then(userDB=>{
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            avatar: userDB.avatar,
            email: userDB.email,
            
        });
        res.json({
            ok: true,
            token: tokenUser
       
    });
    }).catch(err =>{
        res.json({
            ok: false,
            err
        });
    });
    
});

userRoutes.post('/update', verificaToken,(req: any, res: Response) =>{
    const user  = {
        nombre: req.body.nombre || req.usuario.nombre,
        avatar: req.body.avatar || req.usuario.avatar,
        email: req.body.email || req.usuario.email
        
    };
    // new = true es para devolver la actualizacion del usuario
    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}, (err, userDB) =>{
        if(err) throw err;
        if(!userDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            avatar: userDB.avatar,
            email: userDB.email,
            
        });
        res.json({
            ok: true,
            token: tokenUser
       
    });
    });
   
});

userRoutes.get('/', [verificaToken], (req: any, res: Response)=>{
    const usuario = req.usuario;
    res.json({
        ok: true,
       usuario
    });
});

export default userRoutes;