const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const filePath = 'visitas.json';

app.use(cors());

app.get('/visitas', (req, res) => {
  let contador = 0;

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    contador = JSON.parse(data).visitas || 0;
  }

  contador++;

  fs.writeFileSync(filePath, JSON.stringify({ visitas: contador }));

  res.json({ visitas: contador });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});