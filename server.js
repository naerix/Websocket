const express = require("express");
const { Router } = express;
const Container = require("./Container.js");
const ContenedorMsg = require("./ContainerMsj");
const { engine } = require('express-handlebars');
const app = express();
const PORT = process.env.PORT || 8080;

const contenedor = new Container();
const contenedorMsg = new ContenedorMsg()

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const moment = require('moment');
const timestamp = moment().format('h:mm a');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


httpServer.listen(PORT, () => console.log("SERVER ON http://localhost:" + PORT));



app.use(express.static(__dirname + '/public'));

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

app.get("/", async (req, res) => {
  res.render("inicio", {title: "E-commerce"});
});

// app.get("/form", (req, res) => {
//   res.render('form', {title: "Agregar productos"});
// });

// app.post("/form", (req, res) => {
//   const { body } = req;
//   console.log(body);
//   contenedor.save(body);
//   res.render('gracias')
// });


// routerProductos.get("/", async (req, res) => {

//   try {
//     const productos = await contenedor.getAll();
//     const productsExist = productos.length != 0
//     res.render('pages/products', { title: 'listado de productos', products: productos, productsExist })
//   } catch (error) {
//     res.json({ error: true, msj: "error" });
//   }
// });

// routerProductos.get("/:id", async (req, res) => {
//   const id = req.params.id;
//   res.json((await contenedor.getById(id)) ?? { error: "no encontrado" });
// });

// routerProductos.post("/", async (req, res) => {
//   try {
//     const { body } = req;
//     contenedor.save(body);
//     res.json("ok");
//   } catch (error) {
//     res.json({ error: true, msj: "error" });
//   }
// });

// routerProductos.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, price } = req.body;
//     console.log(name, price, id)
//     await contenedor.updateById(id, name, price);
//     res.json({ succes: true });
//   } catch (error) {
//     res.json({ error: true, msj: "error" });
//   }
// });

// routerProductos.delete("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     contenedor.deleteById(id);
//     res.send("Eliminado");
//   } catch (error) {
//     res.json({ error: true, msj: "error" });
//   }
// });



// Corre cuando se conecta un clinte
io.on("connection", async (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  // Muestra la lista completa de productos al cliente
  socket.emit("product-list", await contenedor.getAll());

  // Muestra el historial completo de mensajes al cliente
  socket.emit("msg-list", await contenedorMsg.getAll());

  // Recibe prodcuto del cliente
  socket.on("product", async (data) => {
    console.log(data)

    // Guarda el producto nuevo en productos.json
    await contenedor.save(data);

    // Muestra el mensaje por consola
    console.log('Se recibio un producto nuevo', "producto:", data);

    // Devuelve el historial completo de mensajes al cliente con el nuevo mensaje
    io.emit("product-list", await contenedor.getAll());

  });

  // Recibe mensaje del cliente
  socket.on("msg", async (data) => {

    // Guarda en mensaje nuevo en mensajes.json
    await contenedorMsg.save({ socketid: socket.id, timestamp: timestamp, ...data });

    // Muestra el mensaje por consola
    console.log('Se recibio un msg nuevo', "msg:", data);

    // Devuelve el historial completo de mensajes al cliente con el nuevo mensaje
    io.emit("msg-list", await contenedorMsg.getAll());

  });
});
