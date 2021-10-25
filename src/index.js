const express = require('express');
const app = express();
const port = 3000;

const feedRoutes = require('./routes/feedRoutes');

app.use('/', feedRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})