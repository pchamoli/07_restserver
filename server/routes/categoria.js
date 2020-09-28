const express = require('express');

let {verificaToken, verificaAdminRole } = require ('../middlewares/autenticacion')

let app = express();

let Categoria = require('../models/categoria')

// Mostrar categoria
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email') // Averigua qué ids hay para saber si se puede jalar información de otras entidades
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
    
            res.json({
               ok:true,
               categorias 
            })
        })
})

app.get('/categoria/:id', (req, res) => {
    let id = req.params.id

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!categoriaDB ) {
            return res.status(400).json({
                ok:false,
                err : {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            ok:true,
            categoria: categoriaDB 
         })
    });
})

// Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) =>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!categoriaDB ) {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
           ok:true,
           categoria: categoriaDB 
        })
    })
})

app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, {
        new:true, //devuelve el objeto actualizado 
        runValidators:true, //aplica las validaciones del esquema del modelo
        context:'query'
        }, 
        (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!categoriaDB ) {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            categoria: categoriaDB 
         })
    })
})

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // solo un admin puede borrar categorias
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!categoriaDB ) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })
    }

    )
})


module.exports = app;