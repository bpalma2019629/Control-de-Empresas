const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuariosSchema = Schema({
    nombre: String,
    usuario: String,
    password:String,
    rol:String
});

module.exports = mongoose.model('usuarios', UsuariosSchema);