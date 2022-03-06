const Empleados = require('../models/empleados.model');
const PDF = require('pdfkit-construct');
const fs = require('fs'); 
const xl = require('excel4node');
const { options } = require('pdfkit');
const { count } = require('console');
const { resetWatchers } = require('nodemon/lib/monitor/watch');

function RegistrarEmpleados(req, res) {
    var parametros = req.body;
    var empleadosModels = new Empleados();

    if (req.user.rol == 'Rol_Empresa') {
        if (parametros.nombre, parametros.puesto, parametros.departamento) {
            empleadosModels.nombre = parametros.nombre;
            empleadosModels.puesto = parametros.puesto;
            empleadosModels.departamento = parametros.departamento;
            empleadosModels.empresa = req.user.sub;

            empleadosModels.save((err, usuarioGuardado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!usuarioGuardado) return res.status(400).send({ mensaje: "Error al agregar el empleado" });
                return res.status(200).send({ usuario: usuarioGuardado });
            })

        }
    } else {
        return res.status(500).send({ mensaje: "No esta Autorizado para crear un empleado" });
    }
}

function EditarEmpleado(req,res){
    var idEmp = req.params.idEmpleado;
    var parametros = req.body;

    Empleados.findById(idEmp, (err, empleadoEncontrado)=>{
        if(empleadoEncontrado.empresa == req.user.sub){
            Empleados.findByIdAndUpdate(idEmp, parametros,{new:true}, (err, empleadoEditado) =>{
                if (err) return res.status(500).send({mensaje:'Error en la peticion'});
                if (!empleadoEditado) return res.status(404).send({mensaje: 'Error al Editar el empleado'})
                return res.status(200).send({empleado: empleadoEditado});
            })
        }else{
            return res.status(500).send({mensaje: 'no esta autorizado para editar'});
        }
    })
}

function EliminarEmpleado(req,res){
    var idEmp = req.params.idEmpleado;

    Empleados.findById(idEmp, (err, empleadoEncontrado)=>{
        if(empleadoEncontrado.empresa == req.user.sub){
            Empleados.findByIdAndDelete(idEmp, (err, empleadoEliminado) =>{
                if (err) return res.status(500).send({mensaje:'Error en la peticion'});
                if (!empleadoEliminado) return res.status(404).send({mensaje: 'Error al Eliminar el empleado'})
                return res.status(200).send({empleado: empleadoEliminado});
            })
        }else{
            return res.status(500).send({mensaje: 'No esta autorizado para eliminar'});
        }
    }) 
}

function cantidadEmpleados(req,res){
    Empleados.find({empresa: req.user.sub}, (err, empledosEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!empledosEncontrados) return res.status(500).send({mensaje: 'Error al obtener los empleados'});

        return res.status(200).send({empleados: empledosEncontrados.length});
    })
}

function ObtenerEmpleados(req,res){
    Empleados.find({empresa: req.user.sub}, (err, empledosEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!empledosEncontrados) return res.status(500).send({mensaje: 'Error al obtener los empleados'});

        return res.status(200).send({empleados: empledosEncontrados});
    }).populate("empresa", "nombre")
}

function ObtenerEmpleadoPorId(req,res){
    var idEmp = req.params.idEmpleado;
    
    Empleados.findById(idEmp, (err, empleadoEncontrado)=>{
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if (!empleadoEncontrado) return res.status(404).send({mensaje: 'Error al Encontrar el empleado'});
        if(empleadoEncontrado.empresa._id == req.user.sub){
                return res.status(200).send({empleado: empleadoEncontrado});
        }else{
            return res.status(500).send({mensaje: 'No esta autorizado para realizar la busqueda'});
        }
    }).populate("empresa", "nombre"); 
}

function obtenerEmpleadoPorNombre(req,res){
    var NomEmp = req.body.nombre;

    Empleados.findOne({nombre: NomEmp, empresa: req.user.sub}, (err, empleadoEncontrado)=>{
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if (!empleadoEncontrado) return res.status(500).send({mensaje: 'No se pudo Realizar la busqueda'});

        return res.status(200).send({empleado: empleadoEncontrado});

    })  
}

function obtenerEmpleadoPorPuesto(req,res){
    var pues = req.body.puesto;

    Empleados.findOne({puesto: pues, empresa: req.user.sub}, (err, empleadoEncontrado)=>{
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if (!empleadoEncontrado) return res.status(500).send({mensaje: 'No se pudo Realizar la busqueda'});

        return res.status(200).send({empleado: empleadoEncontrado});

    })  
}

function obtenerEmpleadoPorDepartamento(req,res){
    var dep = req.body.departamento;

    Empleados.findOne({departamento: dep, empresa: req.user.sub}, (err, empleadoEncontrado)=>{
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if (!empleadoEncontrado) return res.status(500).send({mensaje: 'No se pudo Realizar la busqueda'});

        return res.status(200).send({empleado: empleadoEncontrado});

    })  
}

function crearPdf(req,res){
    var cont = 1;
    var doc = new PDF({
        size: 'A4',
        margins: {top: 120, left: 50, right: 10, bottom: 20},
        bufferPages: true,  
    });

    if (req.user.rol == 'Rol_Empresa') {
        Empleados.find({empresa: req.user.sub}, (err, empledosEncontrados)=>{
            doc.setDocumentHeader({}, () => {
    
    
                doc.lineJoin('miter')
                    .rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill("#082183");
    
                doc.fill("#FFFFFF")
                    .fontSize(40)
                    .text(req.user.nombre, doc.header.x, doc.header.y-93);
            });
            doc.fontSize(20).text('Empleados : '+empledosEncontrados.length);
            doc.fontSize(20).text('Listado:');
            doc.text(' ');
            doc.fontSize(12).text('------------------------------------------------');
            doc.text(' ');
            
            for(let i = 0; i < empledosEncontrados.length; i++){
                doc.fill('#FF0000').fontSize(17).text('Empleado '+cont+':');
                doc.fill("#000000").fontSize(12).text('ID: '+empledosEncontrados[i]._id);
                doc.text('Nombre: '+empledosEncontrados[i].nombre);
                doc.text('Puesto: '+empledosEncontrados[i].puesto);
                doc.text('Departamento: '+empledosEncontrados[i].departamento);
                doc.text(' ');
                doc.text('------------------------------------------------');
                doc.text(' ');
                cont++;
            }
    
            doc.setDocumentFooter({}, () => {
    
                doc.lineJoin('miter')
                    .rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber).fill("#4D6DEC");
    
                doc.fill("#FFFFFF")
                    .fontSize(15)
                    .text("Registro de Empleados", doc.footer.x+180, doc.footer.y+3);
            });
    
            doc.render();
    
            doc.pipe(fs.createWriteStream ('Empleados-'+req.user.nombre+'.pdf'));
            doc.end();
        })
    
        return res.status(200).send({mensaje: 'se ha guardado el pdf'})
    } else {
        return res.status(500).send({ mensaje: "No esta Autorizado para generar un pdf" });
    }
}

function crearExcel(req, res){
    var fila = 5;

    var wb = new xl.Workbook();

    var ws = wb.addWorksheet('Empleados');

    var style = wb.createStyle({
        font:{
            color: '#040404',
            size: 14,
        },
        border: { 
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    })

    var def = wb.createStyle({
        font:{
            color: '#1850D1',
            size: 14,
        }
    })

    var titulo = wb.createStyle({
        font:{
            color:'FFFFFF',
            size:14
        },
        fill:{
            type:'pattern',
            patternType:'solid',
            fgColor: '#082183'
        },
        border: { 
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    })

    var empresa = wb.createStyle({
        font:{
            bold: true,
            color:'CC0000',
            size:18
        }
    })

    if (req.user.rol == 'Rol_Empresa') {
        Empleados.find({empresa: req.user.sub}, (err, empledosEncontrados)=>{
            ws.cell(1,1).string("Empresa: "+req.user.nombre).style(empresa);
            ws.cell(3,1).string("Empleados: "+empledosEncontrados.length).style(def);

            ws.cell(4, 1).string("Id").style(titulo);
            ws.cell(4,2).string("Nombre").style(titulo);
            ws.cell(4,3).string("Puesto").style(titulo);
            ws.cell(4,4).string("Departamento").style(titulo);

            for(let i = 0; i < empledosEncontrados.length; i++){
                ws.cell(fila, 1).string((empledosEncontrados[i]._id).toString()).style(style);
                ws.cell(fila, 2).string(empledosEncontrados[i].nombre).style(style);
                ws.cell(fila, 3).string(empledosEncontrados[i].puesto).style(style);
                ws.cell(fila, 4).string(empledosEncontrados[i].departamento).style(style);
                fila++;
            }

            ws.column(1).setWidth(35);
            ws.column(2).setWidth(30);
            ws.column(3).setWidth(35);
            ws.column(4).setWidth(50);;

            wb.write('Excel-Empleados-'+req.user.nombre+'.xlsx')

            return res.status(200).send({mensaje: 'Excel Guardado'});

        })

    } else {
        return res.status(500).send({ mensaje: "No esta Autorizado para crear un empleado" });
    }
    
}

module.exports = {
    EditarEmpleado,
    EliminarEmpleado,
    RegistrarEmpleados,
    cantidadEmpleados,
    ObtenerEmpleados,
    ObtenerEmpleadoPorId,
    obtenerEmpleadoPorNombre,
    obtenerEmpleadoPorPuesto,
    obtenerEmpleadoPorDepartamento,
    crearPdf,
    crearExcel
}