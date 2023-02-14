// RUTAS DE LA APLICACIÓN
// HOST + /API/EVENTS

const { Router } = require("express");
const isDate = require("../helpers/isDate");
const { check } = require('express-validator');
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const router = Router();

//Todas las rutas tienen que pasasr por la validacion del JWT
router.use(validarJWT)

//obtener eventos de calendario
router.get('/', getEventos)

//crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('start', 'Fecha de finalización es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento
)

//actualizar un nuevo evento
router.put('/:id', actualizarEvento)

//borrar un nuevo evento
router.delete('/:id', eliminarEvento)

module.exports = router