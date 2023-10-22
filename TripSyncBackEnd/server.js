const express = require('express')
const morgan = require('morgan')
const app = express()
 
app.use(morgan('dev'))
app.use(express.json())

//importar conexion mongoBD
const archivoDB = require('./conexion')

//impotar arvhivo de rutas y modelos
const rutaLocal = require('./routes/ejemploRoutes')

app.use('/api/local',rutaLocal)


app.get('/',(req,res)=>{
    res.end('Bienvenido al servidor backend node.js corriendo...')
})

//Configurar server básico
app.listen(5000,function(){
    console.log('El servidor está corriendo en el puerto 5000')
})