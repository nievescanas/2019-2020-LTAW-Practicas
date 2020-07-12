//-- Puerto donde recibir las peticiones
const PUERTO = 8080;

//-- Modulo http
const http = require('http');
var url = require('url');

//-- Acceso al módulo fs, para lectura de ficheros
var fs = require('fs');
var filename

const util = require('util');
const exec = util.promisify(require('child_process').exec);



console.log("Arrancando servidor...")

//-- Inicializar el servidor cada vez que recibe una petición
//-- Funcion para atender solo a una Peticion
//-- req: Mensaje de solicitud
//-- res: Mensaje de respuesta
http.createServer((req, res) => {
  console.log("---> Peticion recibida")
  console.log("Recurso solicitado (URL): " + req.url)

  var q = url.parse(req.url, true); //-- Parte la URL como propiedades
  var filename = "." + q.pathname;  //-- returns './default.htm'

  console.log("Pathname: " +  q.pathname)
  console.log("search: " + q.search)
  console.log("Búsqueda:")
  let qdata = q.query
  console.log(qdata)

  //-- Acceso al objeto
  console.log("Artículo: " + qdata.articulo)
  console.log("Color: " + qdata.color)


  //-- Pagina principal y Tipo mime por petición
  let mime = "text/"
  let mime_img = "image/"

  if (filename == "./"){
    filename = "./page_structure.html"
    mime = mime + "html"
  }else if (filename == "./puerta-trasera/ls"){
    filename = filename + ".html"
    mime = mime + "html"
    async function lsExample() {
      const { stdout, stderr } = await exec('dir');
      console.log('stdout:', stdout);
      console.error('stderr:', stderr);
    }
    lsExample();
  }else{
    let point_position = q.pathname.lastIndexOf(".")
    let tipo = q.pathname.slice(point_position+1)

    if (point_position == -1){
      mime = mime + "html"
      filename = filename + "/index.html"
    }else if (tipo == "PNG") {
      mime = mime_img + tipo
    }else{
      mime = mime + tipo
    }
  };


//-- Leer fichero y construcción de respuesta
fs.readFile(filename, function(err, data) {
  if (err) {              //-- Control de error de lectura
    res.writeHead(404, {'Content-Type': mime});
    return res.end("404 Not Found");
  }else{                //-- Contrucción menjase
    res.writeHead(200, {'Content-Type': mime});
    res.write(data);
    return res.end();
  }
  console.log(res);
});}).listen(PUERTO);




console.log("Servidor LISTO!")
console.log("Escuchando en puerto: " + PUERTO)
