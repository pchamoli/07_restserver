const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

const fs = require('fs')
const path = require('path')

app.use(fileUpload())

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files){
        return res.status(400)
                    .jsoin({
                        ok:false,
                        err:{
                            message: 'No se ha seleccionado ningún archivo'
                        }
                    });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios']
    if (tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message : 'Los tipos permitidos son ' + tiposValidos
            }
        })
    }

    let sampleFiles = req.files.archivo;
    let nombreArchivo = sampleFiles.name.split('.')
    let extension = nombreArchivo[nombreArchivo.length-1]

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok:false,
            err: {
                message : 'No es una extensión válida'
            }
        })
    }

    if (!sampleFiles){
        return res.status(500).json({
            ok: false,
            err: {
                message:'no existe el archivo'
            }
        })
    }

    // Cambiar nombre al archivo
    let nombreArchivoFinal = `${id}-${new Date().getMilliseconds()}.${extension}`

    borrarArchivo(nombreArchivoFinal, tipo)

    sampleFiles.mv(`uploads/${tipo}/${nombreArchivoFinal}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })

        if (tipo ==='usuarios'){
            imagenUsuario(id,res,nombreArchivoFinal);
        }else{
            imagenProducto(id,res,nombreArchivoFinal);
        }
    })
})

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB) => {

        if(err){
            borrarArchivo(nombreArchivoFinal, 'usuarios')
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioDB) {
            borrarArchivo(nombreArchivoFinal, 'usuarios')
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) =>{
            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    })
}

function imagenProducto(id,res,nombreArchivo){
    Producto.findById(id, (err, productoDB) => {

        if(err){
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoGuardado) =>{
            res.json({
                ok:true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })
    })
}

function borrarArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`); 

    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;