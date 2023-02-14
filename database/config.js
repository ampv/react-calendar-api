const mongoose = require('mongoose')

const dbConnection = async () => {

    mongoose.set('strictQuery', true);

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('DB conected !!');

    } catch (error) {

        console.log(error);
        throw new Error('Error al inicializar la BD')
    }
}

module.exports = {
    dbConnection
}