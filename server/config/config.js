
process.env.PORT = process.env.PORT || 3000

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del Token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// SEED de autenticación
process.env.SEED = process.env.SEED || 'esta-es-mi-llave'

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://';
}

process.env.URLDB = urlDB;