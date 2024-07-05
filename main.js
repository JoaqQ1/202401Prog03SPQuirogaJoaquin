const TABLA_PERSONA = 'tablaPersonas';
const ABM = 'frmAbm';
const API = 'https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero';
var PERSONAS = ''

CargarPersonasXML();
const botonAgregar = $('btnAgregar');
const botonCancelar = $('btnCancelar');
const botonAceptar = $('btnAceptar');
const selectTipo = $('tipo');

botonAgregar.addEventListener('click',MostrarAgregarPersona);
botonAceptar.addEventListener('click',AgregarPersona);
botonCancelar.addEventListener('click',()=>{
    $(ABM).style.display = 'none';
    $('frmPrincipal').style.display = 'grid';
    ResetearAbm();
});

selectTipo.addEventListener('change',CargarAtributosDelTipo);

class Persona{
    constructor(id,nombre,apellido,fechaNacimiento){
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }
    toString(){
        return `ID: ${this.id}, Nombre: ${this.nombre}, Apellido: ${this.apellido}, FechaNacimiento: ${this.fechaNacimiento}`;
    }
    toJson(){
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            fechaNacimiento: this.fechaNacimiento
        });
    }
    }
class Ciudadano extends Persona
{
    constructor(id,nombre ,apellido,fechaNacimiento,dni,ventas)
    {
        super(id,nombre,apellido,fechaNacimiento);
        this.dni = dni;
    }
    toString()
    {
        return `${super.toString()}, Dni: ${this.dni}`;
    }
    toJson()
    {
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            fechaNacimiento: this.fechaNacimiento,
            dni: this.dni,
        });
    }
}
class Extranjero extends Persona
{
    constructor(id,nombre ,apellido,fechaNacimiento,paisOrigen)
    {
        super(id,nombre,apellido,fechaNacimiento);
        this.paisOrigen = paisOrigen;
    }
    toString()
    {
        return `${super.toString()}, PaisOrigen: ${this.paisOrigen}`;
    }
    toJson()
    {
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            fechaNacimiento: this.fechaNacimiento,
            paisOrigen: this.paisOrigen,
        });
    }
}
function ResetearAbm()
{
    let datos = $("frmAbm").querySelectorAll(".datos");
    $('tipo').value = '--';
    datos.forEach((element)=>
    {
        element.value = "";
    });
}
function $(id){
    return document.getElementById(id);
}
function CargarAtributosDelTipo()
{
    let atributo1Padre = $('atributo1').parentNode;
    let atributo1 = $('atributo1');
    if($('tipo').value == 'Ciudadano'){
        
        atributo1Padre.innerHTML = 'Dni:';
        atributo1Padre.appendChild(atributo1);
        atributo1Padre.style.display = 'block';
    }
    else if($('tipo').value == 'Extranjero'){
        atributo1Padre.innerHTML = 'Pais Origen:';
        atributo1Padre.appendChild(atributo1);
        atributo1Padre.style.display = 'block';
    }
    else{
        atributo1Padre.style.display = 'none';
    }
}
function ObtenerPersonasXML(callback)
{
    let http = new XMLHttpRequest();
    http.onreadystatechange = function()
    {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let personas = ParsearPersonas(this.response);
                PERSONAS = personas;
                callback(personas, null);
            } else {
                callback(null, new Error("Fallo en la carga de personas"));
            }
        }
    }
    http.open("GET", API, true);
    http.send();
}
function ParsearPersonas(cadenaDePersonas)
{            
    let arrayDePersonas = [];
    
    datosPersonas = JSON.parse(cadenaDePersonas);
    arrayDePersonas = datosPersonas.map((element)=>
    {
        if(element.hasOwnProperty('dni'))
        {
            return new Ciudadano(element.id,element.nombre,element.apellido,element.fechaNacimiento,element.dni);
        }
        else
        {
            return new Extranjero(element.id,element.nombre,element.apellido,element.fechaNacimiento,element.paisOrigen)
        }
    });    
    
    return arrayDePersonas;
}

function CargarPersonasXML()
{
    ObtenerPersonasXML(function(personas,error){
        if (error) {
            console.log(error.message);
        } else {
            CargarTabla(personas);
            MostrarSpinnerOcultarPrincipal(false);
        }
    });
    
}
function CargarTabla(personas)
{
    let tablaPadre = $(TABLA_PERSONA);
                    
    personas.forEach(persona => {
        let filaDePersonaNueva = document.createElement('tr');                
        
        filaDePersonaNueva.innerHTML = `
        <td class="columna" name="id">${persona.id}</td>
        <td class="columna" name="nombre">${persona.nombre}</td>
        <td class="columna" name="apellido">${persona.apellido}</td>
        <td class="columna" name="fechaNacimiento">${persona.fechaNacimiento}</td>
        <td class="columna" name="dni">${persona.dni || "N/A"}</td>
        <td class="columna" name="paisOrigen">${persona.paisOrigen || "N/A"}</td>
        <td class="columna"><button class="btnModificar">Modificar</button></td>                    
        <td class="columna"><button class="btnEliminar">Eliminar</button></td>            
        `;

        filaDePersonaNueva.querySelector('.btnModificar').addEventListener('click', function(event) {
            MostrarModificarPersona(event);
        });

        filaDePersonaNueva.querySelector('.btnEliminar').addEventListener('click', function(event) {
            MostrarEliminarPersona(event);
        });
        tablaPadre.appendChild(filaDePersonaNueva);   
    }); 

}
function MostrarSpinnerOcultarPrincipal(mostrar){
    $('spinner').style.display = mostrar ? 'grid' : 'none';
    $('frmPrincipal').style.display = mostrar ? 'none' : 'grid';
}
function MostrarAgregarPersona(){
    $('frmPrincipal').style.display = 'none';
    $("id").parentNode.style.display = 'none';
    $("tituloABM").innerHTML = 'Agregar persona';
    $('atributo1').parentNode.style.display = 'none';
    $('frmAbm').style.display = 'grid';

    // Clono los botones para que solo tengan el nuevo evento que les agrego 
    let botonAceptar = $('btnAceptar').cloneNode(true);
    botonAceptar.addEventListener('click',AgregarPersona);
    $('btnAceptar').parentNode.replaceChild(botonAceptar,$('btnAceptar'));

}
function ValidarDatos() 
{
    let nombre = $('nombre').value;
    let apellido = $('apellido').value;
    let año = $('año').value;
    let mes = $('mes').value;
    let dia = $('dia').value;
    let atributo1 = $('atributo1');
    

    if(typeof nombre !== 'null' && nombre != '' && 
        typeof apellido !== 'null' && apellido != '' &&
        typeof año !== 'null' && año.length == 4 && año > 0 &&
        typeof mes !== 'null' && mes <= 12 && mes > 0 &&
        typeof dia !== 'null' && dia <= 31 && dia > 0)
    {
        if(atributo1.parentElement.textContent == 'Dni:')
        {
            if(typeof atributo1.value !== 'null' && atributo1.value > 0){
                return true
            }
        }
        else
        {
            if(typeof atributo1.value !== 'null' && atributo1.value != '')
            {
                return true;
            }
        }
    }
    alert('Datos mal ingresados!');
    return false;
} 
async function AgregarPersona() 
{
    if (ValidarDatos()) {
        MostrarSpinnerOcultarAbm(true);

        let { tipo, datos } = ObtenerDatosPersona();
        
        try {
            let response = await EnviarPersonaAsincrono({ tipo, datos });
            let id = await response.json();
            let persona = CrearInstanciaPersona(tipo, datos, id.id);
            
            if (response.ok) {
                ResetearUIPrincipal();
                ActualizarTabla(persona);
            } else {
                ResetearUIPrincipal();
                CargarPersonasXML();
                alert('No se pudo realizar la operación!');
            }
        } catch (error) {
            console.error('Error al agregar persona:', error.message);
            ResetearUIPrincipal();
            CargarPersonasXML();
            alert('No se pudo realizar la operación!');
        } finally {
            MostrarSpinnerOcultarAbm(true);
        }
    }
}
function MostrarSpinnerOcultarAbm(mostrar) {
    $('spinner').style.display = mostrar ? 'grid' : 'none';
    $('frmAbm').style.display = mostrar ? 'none' : 'block';
}
function ObtenerDatosPersona() {
    let nombre = $('nombre').value;
    let apellido = $('apellido').value;
    
    let fechaNacimiento = [$('año').value,$('mes').value,$('dia').value].join('');
    let atributo1 = $('atributo1').value;

    if ($('tipo').textContent == 'Ciudadano') {
        return {
            tipo: 'Ciudadano',
            datos: {
                nombre: nombre,
                apellido: apellido,
                fechaNacimiento: fechaNacimiento,
                dni: atributo1,
            }
        };
    } else {
        return {
            tipo: 'Extranjero',
            datos: {
                nombre: nombre,
                apellido: apellido,
                fechaNacimiento: fechaNacimiento,
                paisOrigen: atributo1,
            }
        };
    }
}
async function EnviarPersonaAsincrono(persona) {
    let response = await fetch(API, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(persona.datos)
    });
    return response;
}
function CrearInstanciaPersona(tipo, datos, id) {
    if (tipo == 'Ciudadano') {
        return new Ciudadano(
            id,
            datos.nombre,
            datos.apellido,
            datos.fechaNacimiento,
            datos.dni
        );
    } else {
        return new Extranjero(
            id,
            datos.nombre,
            datos.apellido,
            datos.fechaNacimiento,
            datos.paisOrigen
        );
    }
}
function ResetearUIPrincipal() {
    ResetearAbm();
    VaciarElemento($('tablaPersonas'));
}
function VaciarElemento(elementoAVaciar)
{
    
    while(elementoAVaciar.hasChildNodes())
    {
        elementoAVaciar.removeChild(elementoAVaciar.lastChild);                  
    } 
}
function ModificarTablaIncluyendo(persona,incluir){
    PERSONAS = PERSONAS.filter(p=>p.id != persona.id);
    if(incluir){
        PERSONAS.push(persona);
    }
    CargarTabla(PERSONAS);
    MostrarSpinnerOcultarPrincipal(false);
}
function ActualizarTabla(persona) 
{
    PERSONAS.push(persona);
    CargarTabla(PERSONAS);
    MostrarSpinnerOcultarPrincipal(false);
}

function MostrarModificarPersona(event){
    let fila = event.target.closest('tr');
    let datos = ObtenerDatosFila(fila);
    MostrarAbmConDatos(datos,'Modificar persona');

    // Clono los botones para que solo tengan el nuevo evento que les agrego 
    let botonAceptar = $('btnAceptar').cloneNode(true);
    botonAceptar.addEventListener('click',ModificiarPersona);
    $('btnAceptar').parentNode.replaceChild(botonAceptar,$('btnAceptar'))
}
function ModificiarPersona(){
    if(ValidarDatos()){
        MostrarSpinnerOcultarAbm(true);
        let { tipo, datos } = ObtenerDatosPersona();
        
        let persona; 
        if(tipo == 'Ciudadano'){
            persona = new Ciudadano(parseInt($('id').textContent),datos.nombre,datos.apellido,datos.fechaNacimiento,datos.dni)
        }else{
            persona = new Extranjero(parseInt($('id').textContent),datos.nombre,datos.apellido,datos.fechaNacimiento,datos.paisOrigen)
        }

        let promesa = fetch(API,{
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: persona.toJson()
        });

        promesa
        .then(res=>{
            if (res.ok) {
                ResetearUIPrincipal();
                ModificarTablaIncluyendo(persona,true);
            } 
            else 
            {
                ResetearUIPrincipal();
                CargarPersonasXML();
                alert('No se pudo realizar la operación!');
            }
        })
    }
}
function MostrarEliminarPersona(event){
    let fila = event.target.closest('tr');
    let datos = ObtenerDatosFila(fila);
    MostrarAbmConDatos(datos,'Eliminar persona');

    // Clono los botones para que solo tengan el nuevo evento que les agrego 
    let botonAceptar = $('btnAceptar').cloneNode(true);
    botonAceptar.addEventListener('click',EliminarPersona);
    $('btnAceptar').parentNode.replaceChild(botonAceptar,$('btnAceptar'));
}
function EliminarPersona(){
    MostrarSpinnerOcultarAbm(true);
    let { tipo, datos } = ObtenerDatosPersona();
        
    let persona; 
    if(tipo == 'Ciudadano'){
        persona = new Ciudadano(parseInt($('id').textContent),datos.nombre,datos.apellido,datos.fechaNacimiento,datos.dni)
    }else{
        persona = new Extranjero(parseInt($('id').textContent),datos.nombre,datos.apellido,datos.fechaNacimiento,datos.paisOrigen)
    }
    
    let id = {'id':persona.id}
    

    let promesa = fetch(API,{
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(id)
        });

        promesa
        .then(res=>{
            if (res.ok) {
                ResetearUIPrincipal();
                ModificarTablaIncluyendo(persona,false);
            } 
            else 
            {
                ResetearUIPrincipal();
                CargarPersonasXML();
                alert('No se pudo realizar la operación!');
            }
        })
}
function ObtenerDatosFila(fila) {
    let datos = {};
    let celdas = fila.querySelectorAll('td');
    
    celdas.forEach(celda => {
        let name = celda.getAttribute('name');
        if (name) {
            datos[name] = celda.textContent;
        }
    });

    return datos;
}
function MostrarAbmConDatos(datos,tituloABM)
{
    $('frmPrincipal').style.display = 'none';
    $("id").parentNode.style.display = 'grid';
    $("id").innerHTML = datos.id;
    $("tituloABM").innerHTML = tituloABM;
    $('frmAbm').style.display = 'grid';
    ColocarDatosPersona(datos);
}
function ColocarDatosPersona(persona)
{
    if(persona.paisOrigen != 'N/A')
    {
        $("tipo").value = "Extranjero";
    }
    else
    {
        $("tipo").value = "Ciudadano";
    }

    CargarAtributosDelTipo();
    $('nombre').value = persona.nombre;
    $('apellido').value = persona.apellido;
    $('año').value = persona.fechaNacimiento.slice(0,4);
    $('mes').value = persona.fechaNacimiento.slice(4,6);
    $('dia').value = persona.fechaNacimiento.slice(7);
    if (persona.paisOrigen !== 'N/A')
    {
        $('atributo1').value = persona.paisOrigen;
    } 
    else
    {
        $('atributo1').value = persona.dni;
    }
}

