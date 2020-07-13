//-- Puerto donde recibir las peticiones
const PUERTO = 8080;

//-- Modulo http
const http = require('http');
var url = require('url');

//-- Acceso al módulo fs, para lectura de ficheros
var fs = require('fs');
var filename

//-- Recursos para la ejecución ls
const util = require('util');
const exec = util.promisify(require('child_process').exec);

console.log("Arrancando servidor...")

//-- Inicializar el servidor cada vez que recibe una petición
//-- Funcion para atender solo a una Peticion
//-- req: Mensaje de solicitud
//-- res: Mensaje de respuesta
function peticion(req, res) {
  console.log("---> Peticion recibida")
  console.log("Recurso solicitado (URL): " + req.url)

  //-- Partes de la url
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  let qdata = q.query;
  const cookie = req.headers.cookie;

  //-- Pagina principal y Tipo mime por petición
  let mime = "text/"
  let mime_img = "image/"

  switch (q.pathname) {
    case "/":
      content = fs.readFileSync("./page_structure.html", "utf-8")
      mime = mime + "html"
      res.statusCode = 200;
       //-- Generar el mensaje de respuesta
      res.setHeader('Content-Type', mime)
      res.write(content);
      res.end();
    break;
    case "./registry.html":
      mime = mime + "html"
      res.setHeader('Content-Type', mime)
      res.write(content);
      res.end();
    break;
    //-- Pagina de acceso
    case "/myform":
      if (req.method === 'POST') {
        // Handle post info...
        var content = `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="utf-8">
            <title>FORM 1</title>
          </head>
          <body>
            <p>Recibido: `
        req.on('data', chunk => {
            //-- Leer los datos (convertir el buffer a cadena)
            data = chunk.toString();
            //-- Añadir los datos a la respuesta
            content += data;
            //-- Fin del mensaje. Enlace al formulario
            content += `
                </p>
                <a href="/">[Formulario]</a>
              </body>
            </html>
            `
            //-- Mostrar los datos en la consola del servidor
            console.log("Datos recibidos: " + data)

            user = data.slice(data.lastIndexOf('=')+1)
            res.setHeader('Set-Cookie', 'user=' + user)
            res.statusCode = 200;
         });
         req.on('end', ()=> {
           //-- Generar el mensaje de respuesta
           res.setHeader('Content-Type', 'text/html')
           res.write(content);
           res.end();
         })
         return
      }

    break;
    default:
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

      fs.readFile(filename, function(err, data) {
          if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
          }
          //-- Generar el mensaje de respuesta
          res.writeHead(200, {'Content-Type': mime});
          res.write(data);
          res.end();
        });
        console.log(filename)
    break
   }
 }

 //-- Inicializar el servidor cada vez que recibe una petición
 //-- invoca a la funcion peticion para atenderla
 const server = http.createServer(peticion)

 //-- Configurar el servidor para escuchar en el
 //-- puerto establecido
 server.listen(PUERTO);

 console.log("Servidor LISTO!")
 console.log("Escuchando en puerto: " + PUERTO)
