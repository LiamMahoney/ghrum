const express = require('express');
const { log } = require('./src/utils/log');
const ghrumRouter = require('./src/routes/ghrum');

const port = process.env.PORT ? process.env.PORT : 3000
const app = express();

app.use(express.json());

app.use('/', ghrumRouter);

app.listen(port, ()=> {
    log.info(`ghrum listening on port ${port}`);
});