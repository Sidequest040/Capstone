const express = require('express');
const app = express();

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
