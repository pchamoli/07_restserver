const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const { identity } = require('underscore');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un valor válido'
}

let Schema = mongoose.Schema;

let categoriaSchema = new Schema(
    {
        descripcion: {
            type: String,
            unique : true,
            required: [true, 'La descripción es necesaria']
        },
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }
        /* ,
        email: {
            type: String,
            unique: true,
            required: [true, 'El email es necesario']
        },
        password: {
            type: String,
            required: [true, 'La clave es obligatoria']
        },
        img: {type: String, required: false},
        role: {
            type: String, 
            default:'USER_ROLE',
            enum: rolesValidos },
        estado: {type: Boolean, default: true},
        google: {type: Boolean, default:false} */
    }

);
/* 
categoriaSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject
} */

categoriaSchema.plugin(uniqueValidator, {
    message : `{PATH} debe ser unico`
})


module.exports = mongoose.model('Categoria', categoriaSchema)