import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Gogeta-Bot está activo!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
