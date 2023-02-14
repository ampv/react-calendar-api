require('dotenv').config()
const cors = require('cors')
const express = require('express')
const { dbConnection } = require('./database/config')

//crear el servidor de express
const app = express()

//base de datos
dbConnection()

//cors
app.use(cors())

//directorio publico
//el use en express funciona como un middleware
//basicamente es una funcion que se ejecuta cuando alguien haga una peticion al servidor
app.use(express.static('public'))

//lectura y parseo del body y extraer su contenido
app.use(express.json())

//Rutas
app.use('/api/auth', require('./routes/auth'))

//escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})