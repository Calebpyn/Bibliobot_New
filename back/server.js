const express = require ('express');
const cors = require('cors');
const morgan = require('morgan')

require('dotenv').config()

const bodyParser = require('body-parser');

const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.TEST_KEY,
})

const app = express();

const port = 4000;

const Routes = require('./routes/back.routes');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(Routes);



app.use((err, req, res, next) => {

    console.log(err)

    res.status(404).json({
        message: err
    })

});

//Cahtgpt test

app.post("/chat", async (req, res) => {

    const {prompt} = req.body;

    const completition = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(completition.choices[0].message.content);

    res.json(completition.choices[0].message);



})

app.get("/", (req, res) => {
    res.send("Hello")
})

app.listen(port, () => console.info(`Listening to port: ${port}`));


