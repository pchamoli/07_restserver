require ('./config/config')

const express = require('express');
const mongoose = require('mongoose')
const path = require('path')

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname , '../public')))

console.log(path.resolve(__dirname , '../public'))

// Configuración global de rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, 
    {useNewUrlParser: true, useCreateIndex: true},
    (err, resp) => {
    if (err) throw err

    console.log('Base de Datos ONLINE')
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`)
})