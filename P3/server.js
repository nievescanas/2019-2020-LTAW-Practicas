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

let productos = [];

console.log("Arrancando servidor...")

function leerCookie(nombre, cookie) {
         var lista = cookie.split(";");
         for (i in lista) {
             var busca = lista[i].search(nombre);
             if (busca > -1) {
               micookie=lista[i]
             }
        }
         var igual = micookie.indexOf("=");
         var valor = micookie.substring(igual+1);
         return valor;
  }

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
  console.log(qdata)
  console.log(filename)


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

      //-- Fichero js cliente
      case "/client.js":
        fs.readFile("./client.js", (err, data) => {
          //-- Generar el mensaje de respuesta
          res.writeHead(200, {'Content-Type': 'application/javascript'});
          res.write(data);
          res.end();
        return
        });
      break;

      //-- Acceso al recurso JSON
      case "/myquery":
        //-- El array de productos lo pasamos a una cadena de texto,
        //-- en formato JSON:
        content = JSON.stringify(productos) + '\n';
        //-- Generar el mensaje de respuesta
        //-- IMPORTANTE! Hay que indicar que se trata de un objeto JSON
        //-- en la cabecera Content-Type
        res.setHeader('Content-Type', 'application/json')
        res.write(content);
        res.end();
        return
    break;

    case "/trolley":
      color = qdata.color;
      precio = qdata.precio;
      mime = mime + "html";

      if (!cookie){
        content = fs.readFileSync("./registry.html", "utf-8")
      }else{
        if (cookie.includes("user")){
          content = fs.readFileSync("./page1_structure.html", "utf-8")
          if(cookie.includes("products=")){
              products = leerCookie("products", cookie)
              productos.push(color)
              // var num = array1.find(color)
              res.setHeader('Set-Cookie', 'products=' + products +'&'+ color)
              res.statusCode = 200;
          }else{
              productos.push(color)
              res.setHeader('Set-Cookie', 'products='+ color)
              res.statusCode = 200;
          }
        }
      }
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
          <title>Registro</title>
          <link rel="stylesheet" href="css/page_principal.css">
        </head>
          <body onload="main()">
            <div class="contenedor1">
            <p>Ya estas resgistrad@ : `
        req.on('data', chunk => {
            //-- Leer los datos (convertir el buffer a cadena)
            data = chunk.toString();
            console.log(data)
            user = data.slice(data.lastIndexOf('=')+1)
            //-- Añadir los datos a la respuesta
            content += user;
            //-- Fin del mensaje. Enlace al formulario
            content += `
                </p>
                </div>
                <div class="contenedor2"><a href="page_structure.html">
                  <button class = button_content type="button" >
                    <img src="/images/volver.PNG" class="img_product"  width="100";height="50";>
                  </button>
                <a></div>
              </body>
            </html>
            `
            //-- Mostrar los datos en la consola del servidor
            console.log("Datos recibidos: " + data)
            //-- Numero de usuario
            var num = Math.floor(Math.random() * 50)
            //-- Ususario
            res.setHeader('Set-Cookie', 'user'+ num +'=' + user) //-- Cookie usuario
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
