//-- Puerto donde recibir las peticiones
const PUERTO = 8080;

//-- Modulo http
const http = require('http');
var url = require('url');

var fs = require('fs');  // -- Sistema de archivos

console.log("Arrancando servidor...")

//-- Funcion para atender a una Peticion
//-- req: Mensaje de solicitud
//-- res: Mensaje de respuesta
function peticion(req, res) {

  //-- Peticion recibida
  console.log("Peticion recibida!")

  //-- Parte la URL como propiedades
  var q = url.parse(req.url, true);

  //-- returns './default.htm'
  var filename = "." + q.pathname;
  if (filename == "./"){
    filename = "./page_structure.html"
  }
  console.log(filename)

  //-- Leer fichero
  fs.readFile(filename, function(err, data) {
    if (err) {              //-- Control de error de lectura
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }else{                //-- Contrucción menjase
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    }
  });

}

//-- Inicializar el servidor
//-- Cada vez que recibe una petición
//-- invoca a la funcion peticion para atenderla
const server = http.createServer(peticion);

//-- Configurar el servidor para escuchar en el
//-- puerto establecido
server.listen(PUERTO);

console.log("Servidor LISTO!")
console.log("Escuchando en puerto: " + PUERTO)
