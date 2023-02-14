//RUTAS DE USUARIOS
// HOST + /API/AUTH

const { Router } = require("express");
const { check } = require('express-validator')
const router = Router()
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");


//Rutas
router.post(
    '/new',
    [//midlewares
        //el nombre tiene que ser obligatorio y que no sea vacio
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario
)

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ]
    ,
    loginUsuario
)

router.get(
    '/renew',
    validarJWT, 
    revalidarToken
)

module.exports = router;