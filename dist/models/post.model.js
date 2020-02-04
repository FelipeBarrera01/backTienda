"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postShema = new mongoose_1.Schema({
    img: {
        type: String
    },
    marca: {
        type: String
    },
    precio: {
        type: String
    },
    caracteristicas: [
        {
            type: String
        }
    ],
    created: {
        type: Date
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una referencia a un usuario']
    }
});
postShema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Post = mongoose_1.model('Post', postShema);
