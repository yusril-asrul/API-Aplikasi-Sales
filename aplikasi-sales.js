const express = require('express');
const cors = require("cors");

const app = express();
const config = require("./config/app");


app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());

require('./route/index')(app)

app.listen(config.port, () => {
  console.log(`🚀 in port ${config.port}`)
});
