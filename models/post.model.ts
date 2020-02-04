import { Schema, Document,model} from 'mongoose';

const postShema = new Schema({
    img:{
        type: String
    },
    marca: {
        type: String
    },
    precio:{
        type: String
    },
    caracteristicas:[
        {
        type: String
        }
    ],
    created: {
        type: Date
    },
   
 
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:[ true, 'Debe de existir una referencia a un usuario' ]
       }
});
postShema.pre<IPost>('save', function( next ){
    this.created = new Date();
    next();
});

interface IPost extends Document{
    created: Date;
    mensaje: string;
    img: string[];
    coords: string;
    usuario: string;
}

export const Post = model<IPost>('Post', postShema);