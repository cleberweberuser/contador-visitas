const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let onlineUsers = 0;

app.use(cors());

// API para retornar número atual de usuários online
app.get('/online', (req, res) => {
  res.json({ online: onlineUsers });
});

wss.on('connection', (ws) => {
  onlineUsers++;
  console.log('Nova conexão. Online agora:', onlineUsers);

  // Atualiza todos os clientes conectados com o novo número
  broadcastOnlineCount();

  ws.on('close', () => {
    onlineUsers--;
    console.log('Desconectado. Online agora:', onlineUsers);
    broadcastOnlineCount();
  });
});

// Envia o número atual de usuários online para todos os conectados
function broadcastOnlineCount() {
  const data = JSON.stringify({ type: 'online', online: onlineUsers });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
