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

  fs.readFile('page_structure.html', function(err, data) {
    if (err) {
      console.error(err);
      res.write("Error");
      res.end();
      return
    }else{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
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
