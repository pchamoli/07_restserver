const jwt = require('jsonwebtoken')
// Verificar Token

let verificaToken = (req, res, next) => {
    
    // lee header
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        //decoded tiene payload
        if (err) {
            return res.status(401).json(
                {ok: false,
                err}
                )
            }
            
        req.usuario = decoded.usuario;
        next();
        })

    //res.json({token:token});
};

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {

        res.json(
            {ok: false,
                err:{
                    message: 'El usuario no es administrador'
                }
            }
        )
    }
}

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        //decoded tiene payload
        if (err) {
            return res.status(401).json(
                {ok: false,
                err}
                )
            }
            
        req.usuario = decoded.usuario;
        next();
        })
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}