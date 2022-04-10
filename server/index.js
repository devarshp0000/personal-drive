require('dotenv').config();
require('./build-front-end')();
const express = require('express');
const busboy = require('connect-busboy');
const { resolve } = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const morgan = require('morgan');

app.use(express.json());
app.use(morgan('tiny'));
app.use(
  busboy({
    highWaterMark: 50 * 1024 * 1024,
  })
);

const router = require('./router');

app.use('/api', router());

process.on('uncaughtException', (err) => {
  console.log(err);
});
app.listen(PORT, () => {
  console.log(`server started on url: http://localhost:${PORT}/`);
});

app.use(express.static(resolve(__dirname, '..', 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(resolve(__dirname, '..', 'client', 'build', 'index.html'));
});
