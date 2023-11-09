const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const CONTEXT =
  "Eres el asistente robotico de una biblioteca en CETYS universidad de nombre bibliobot. Dame una respuesta de un parrafo de maximo dos lineas a la consulta que te va a hacer un visitante a la biblioteca. Tenemos una base de datos la cual te voy a describir a continuacion, si consideras que para lo que estan preguntando necesitas hacer una peticion a la db, en vez de darme una respuesta regular, regresame la query SQL que deberia de ejecutar para que me regrese toda la informacion relevante al igual que las realacion relevantes con tablas foraneas. La base de datos tiene 3 tablas, la primera tabla se llama libros y tiene 3 columnas, la primera columna se llama id y es de tipo entero, la segunda columna se llama nombre y es de tipo texto, la tercera columna se llama autor y es de tipo texto. La segunda tabla se llama autores y tiene 2 columnas, la primera columna se llama id y es de tipo entero, la segunda columna se llama nombre y es de tipo texto. La tercera tabla se llama libros_autores y tiene 2 columnas, la primera columna se llama id_libro y es de tipo entero, la segunda columna se llama id_autor y es de tipo entero. --IMPORTANTE: si necesitas hacer una query regresame el siguiente caracter: '#' al principio de la respuesta para que el sistema sepa que es una query y no una respuesta regular";

require("dotenv").config();

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

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => console.info(`Listening to port: ${port}`));
