const express = require('express')

const {verificaToken} = require('../middlewares/autenticacion')

let app = express();

let Producto = require('../models/producto');
const producto = require('../models/producto');


app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino

    let regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex})
    .populate('categoria', 'nombre')
    .exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                producto: productoDB 
            })
        }

        res.json({
            ok: true,
            productos
        })
    })
})

// Obtener Productos

app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible: true})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err,productos) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    producto: productoDB 
                })
            }

            res.json({
                ok:true,
                productos
            })
        })
})


app.get('/producto/:id', verificaToken,(req , res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err : {
                        message: 'ID no existe'
                    }
                })
            }
    
            res.json({
                ok: true,
                producto: productoDB
            })

        })
})


app.post('/producto', verificaToken, (req , res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni:body.precioUni,
        descripcion:body.descripcion,
        disponible:body.disponible,
        categoria: body.categoria
    });

    producto.save ((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                producto: productoDB 
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})


app.put('/producto/:id',verificaToken, (req , res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El ID No existe'
                }
            }) 
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
        
        productoDB.save( (err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    })
})

app.delete('/producto/:id', verificaToken, (req , res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;

    Producto.findById(id,
        (err, productoDB) => {
            if (err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }
    
            if(!productoDB){
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'El ID No existe'
                    }
                }) 
            }

            productoDB.disponible = false;
            productoDB.save((err, productoBorrado) => {
                if (err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }
        
                res.json({
                    ok: true,
                    producto: productoBorrado,
                    mensaje: 'producto borrado'
                })
            })
        })
})


module.exports = app;