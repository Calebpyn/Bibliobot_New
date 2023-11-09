const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./db");
const CONTEXT =
  "Eres el asistente robotico de una biblioteca en CETYS universidad de nombre bibliobot. Dame una respuesta de un parrafo de maximo dos lineas a la consulta que te va a hacer un visitante a la biblioteca. Tenemos una base de datos la cual te voy a describir a continuacion, si consideras que para lo que estan preguntando necesitas hacer una peticion a la db, en vez de darme una respuesta regular, regresame la query SQL que deberia de ejecutar para que me regrese toda la informacion relevante al igual que las realacion relevantes con tablas foraneas. La base de datos tiene 3 tablas, la primera tabla se llama libros y tiene 3 columnas, la primera columna se llama id y es de tipo entero, la segunda columna se llama nombre y es de tipo texto, la tercera columna se llama autor y es de tipo texto. La segunda tabla se llama autores y tiene 2 columnas, la primera columna se llama id y es de tipo entero, la segunda columna se llama nombre y es de tipo texto. La tercera tabla se llama libros_autores y tiene 2 columnas, la primera columna se llama id_libro y es de tipo entero, la segunda columna se llama id_autor y es de tipo entero. --IMPORTANTE: si necesitas hacer una query regresame el siguiente caracter: '#' al principio de la respuesta para que el sistema sepa que es una query y no una respuesta regular, regresa el query en una sola línea, no agregues line-breaks. Toma en cuenta que el query que me proveeas será introducido directamente a la base de datos";

require("dotenv").config();

const clearContext = "Eres el asistente robotico de una biblioteca en CETYS universidad de nombre bibliobot. La respuesta que viene en este prompt, proveine de la base de datos de la biblioteca de CETYS univerisdad. Tomando el rol de assitente, dale un poco más de cuerpo a la repuesta, limitate únicamente a un párrafo de 2 líneas. Así mismo te proveeré la petición original, para que esta te pueda ayudar a reformular la tu repsuesta.";

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
    res.json(data.rows);
    // res.json(query)
});

app.post("/clear", async (req, res) => {
    const { text } = req.body;
    const { ogPropmt } = req.body;
    const prompt = `${clearContext} Prompt: ${text} \n Fin del prompt. \n Petición original: ${ogPropmt} \n Fin de la petición original`;
    console.log(prompt);
    const completition = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });
  
    answer = completition.choices[0].message.content;
    res.json(answer);
  });

app.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM libros");
    res.json(result.rows);
});

app.listen(port, () => console.info(`Listening to port: ${port}`));
