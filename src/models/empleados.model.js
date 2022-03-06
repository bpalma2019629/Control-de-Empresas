const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpleadosSchema = Schema({
    nombre: String,
    puesto: String,
    departamento:String,
    empresa: {type: Schema.Types.ObjectId, ref:'usuarios'}
});

module.exports = mongoose.model('empleados', EmpleadosSchema);