import { WebSocketServer, WebSocket } from 'ws';
const port: number = 8080;
const wss = new WebSocketServer({ port });

console.log(`🚀 Serveur WebSocket lancé sur le port ${port}`);

wss.on('connection', (socket: WebSocket) => {
  console.log('Un client est connecté !');
  socket.on('message', (data: Buffer | ArrayBuffer | Buffer[]) => {
    const message = data.toString();
    console.log(' Message reçu :', message);
    socket.send(`Serveur a bien reçu : ${message}`);
  });

  socket.on('close', () => {
    console.log('Le client s’est déconnecté');
  });
});