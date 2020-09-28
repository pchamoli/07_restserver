
process.env.PORT = process.env.PORT || 3000

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del Token
process.env.CADUCIDAD_TOKEN = '48h';

// SEED de autenticación
process.env.SEED = process.env.SEED || 'esta-es-mi-llave'

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://';
}

process.env.URLDB = urlDB;

process.env.CLIENT_ID =  process.env.CLIENT_ID || '1009349398689-t56nvdu70et6cuvf87j0lme715pvm3hc.apps.googleusercontent.com'