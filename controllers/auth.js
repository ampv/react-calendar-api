// logica de cada endPoint
const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body

    try {

        let usuario = await Usuario.findOne({ email })

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario registrado con ese correo.'
            })
        }

        usuario = new Usuario(req.body)

        //encriptar contraseña
        //el metodo genSaltSync() es un numero o pedazo de info aleatoria usado para la encriptación
        const salt = bcrypt.genSaltSync()

        //reemplazar contraseña encriptada
        usuario.password = bcrypt.hashSync(password, salt)

        //se crea el usuario en la base de datos
        await usuario.save()

        //generar JWT
        const token = await generarJWT(usuario.id, usuario.name)

        //se retorna mensaje
        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error creando el usuario'
        })

    }

}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body

    try {

        const usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun usuario registrado con ese email.'
            })
        }

        //confirmar los passwords, retorna true o false
        const validPassword = bcrypt.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña ingresada no coincide.'
            })
        }

        //generar JWT
        const token = await generarJWT(usuario.id, usuario.name)

        return res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error iniciando sesion'
        })

    }
}

const revalidarToken = async (req, res = response) => {

    const { uid, name } = req

    //generar un nuevo JWT y retornarlo en esta peticion
    const token = await generarJWT(uid, name)

    res.json({
        ok: true,
        uid, name,
        token
    })

}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}