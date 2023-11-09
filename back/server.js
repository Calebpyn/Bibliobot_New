const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./db");
const CONTEXT =
  "Eres el asistente robotico de una biblioteca en CETYS universidad de nombre bibliobot. Dame una respuesta de un parrafo de maximo dos lineas a la consulta que te va a hacer un visitante a la biblioteca. Si es necesario modificar titulos o nombres de autor al momento de redactar el query debido a la mala pronunciación del usuario, te es permitido. Tenemos una base de datos la cual te voy a describir a continuacion, si consideras que para lo que estan preguntando necesitas hacer una peticion a la db, en vez de darme una respuesta regular, regresame la query SQL que deberia de ejecutar para que me regrese toda la informacion relevante al igual que las realacion relevantes con tablas foraneas. Esta base de datos está en Postgresql. La base de datos tiene 3 tablas, la primera tabla se llama libros y tiene 3 columnas, la primera columna se llama id y es de tipo entero, la segunda columna se llama nombre y es de tipo texto, la tercera columna se llama autor y es de tipo texto. La segunda tabla se llama autores y tiene 2 columnas, la primera columna se llama id y es de tipo entero, la segunda columna se llama nombre y es de tipo texto. La tercera tabla se llama libros_autores y tiene 2 columnas, la primera columna se llama id_libro y es de tipo entero, la segunda columna se llama id_autor y es de tipo entero. La tabla de Ubicaciones (ubicaciones) contiene un identificador único (id) que actúa como clave primaria, un nombre descriptivo de la ubicación, un número que representa el estante (estante), y otro número que representa la fila (fila) de la ubicación. La tabla de Relación Libros-Ubicaciones (libros_ubicaciones) facilita la conexión entre libros y ubicaciones mediante claves foráneas: id_libro, que referencia el ID único de un libro en la tabla libros, y id_ubicacion, que referencia el ID único de una ubicación en la tabla ubicaciones. Estas relaciones permiten asignar ubicaciones específicas a cada libro en la base de datos. --IMPORTANTE: si necesitas hacer una query regresame el siguiente caracter: '#' al principio de la respuesta para que el sistema sepa que es una query y no una respuesta regular, regresa el query en una sola línea, no agregues line-breaks. Toma en cuenta que el query que me proveeas será introducido directamente a la base de datos";

require("dotenv").config();

const clearContext = "Eres el asistente robotico de una biblioteca en CETYS universidad de nombre bibliobot. La respuesta que viene en este prompt, proveine de la base de datos de la biblioteca de CETYS univerisdad. Tomando el rol de assitente, dale un poco más de cuerpo a la repuesta, limitate únicamente a un párrafo de 2 líneas. Así mismo te proveeré la petición original, para que esta te pueda ayudar a reformular la tu repsuesta. --IMPORTANTE: Si la respuesta de la base de datos está vacía, solo regresa la siguinete respuesta: 'Lo sentimos, no podemos procesar tu petición...'";

const bodyParser = require("body-parser");

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.TEST_KEY,
});

const app = express();

const port = 4000;

const Routes = require("./routes/back.routes");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(Routes);

app.use((err, req, res, next) => {
  console.log(err);

  res.status(404).json({
    message: err,
  });
});

//Cahtgpt test

app.post("/chat", async (req, res) => {
  const { text } = req.body;
  const prompt = `${CONTEXT} Prompt: ${text} \n Fin del prompt.`;
  const completition = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  answer = completition.choices[0].message.content;
  res.json(answer);
});

app.post("/query", async (req, res) => {
    const {query} = req.body;
    console.log(query)
    const data = await db.query(query);
    console.log(data.rows)
    res.json(data.rows);
    // res.json(query)
});

app.post("/clear", async (req, res) => {
    const { text } = req.body;
    const { ogPropmt } = req.body;
    if(text != "[]"){
        const prompt = `${clearContext} Respuesta de la base de datos: ${text} \n Fin de la respuesta de la base de datos. \n Petición original: ${ogPropmt} \n Fin de la petición original`;
        console.log(prompt);
        const completition = await openai.chat.completions.create({
          messages: [{ role: "system", content: prompt }],
          model: "gpt-3.5-turbo",
        });
      
        answer = completition.choices[0].message.content;
        res.json(answer);
    } else {
        console.log("Lo sentimos, no pudimos porcesar tu petición...")
        res.json("Lo sentimos, no pudimos porcesar tu petición...")
    }

  });

app.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM libros");
    res.json(result.rows);
});

app.listen(port, () => console.info(`Listening to port: ${port}`));
