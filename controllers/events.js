const { response } = require('express')
const Evento = require('../models/Evento')

const getEventos = async (req, res = response) => {

    //trae todos los eventos creados en la BD
    const eventos = await Evento.find()
        .populate('user', 'name') //rellenar datos de usuario

    res.json({
        ok: true,
        msg: eventos
    })
}

const crearEvento = async (req, res = response) => {

    //verificar que tenga el evento
    // console.log(req.body);

    //instancia del modelo
    const evento = new Evento(req.body)

    try {

        evento.user = req.uid
        const eventoCreado = await evento.save()
        res.json({
            ok: true,
            msg: eventoCreado
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error mientras se intentaba crear el evento.'
        })

    }
}

const actualizarEvento = async (req, res = response) => {

    //tomar el id
    const eventoId = req.params.id
    const uid = req.uid

    try {
        //verificar si el eveto existe
        const evento = await Evento.findById(eventoId)

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun evento asociado con el id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true })

        res.json({
            ok: true,
            msg: eventoActualizado
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error mientras se intentaba acualizar el evento.'
        })

    }

    res.json({
        ok: true,
        msg: eventoId
    })
}

const eliminarEvento = async (req, res = response) => {

    //tomar el id
    const eventoId = req.params.id
    const uid = req.uid

    try {
        //verificar si el eveto existe
        const evento = await Evento.findById(eventoId)

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun evento asociado con el id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para eliminar este evento'
            })
        }

        await Evento.findByIdAndDelete(eventoId)

        res.json({
            ok: true
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error mientras se intentaba eliminar el evento.'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}