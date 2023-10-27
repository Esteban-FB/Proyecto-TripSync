const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors');
app.use(cors());
app.use(morgan('dev'))
app.use(express.json())

//importar conexion mongoBD
const archivoDB = require('./conexion')

//impotar arvhivo de rutas y modelos
const rutaLocal = require('./routes/ejemplos')

app.use('/api/ejemplos',rutaLocal)


app.get('/',(req,res)=>{
    res.end('Bienvenido al servidor backend node.js corriendo...')
})

//Configurar server básico
app.listen(5000,function(){
    console.log('El servidor está corriendo en el puerto 5000')
})