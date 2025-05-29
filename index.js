const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const moviesRouter = require('./routes/movies');

app.get('/', (req, res) => {
  res.send('Movie API running');
});

app.use('/movies', moviesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 