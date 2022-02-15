import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import * as bodyParser from 'body-parser';

class App {
  public app: express.Application;
  public server: http.Server;
  public io;
  public port = process.env.PORT || 4000;

  constructor() {
    const messages = [
      {name:"Tim",message:"Hello"},
      {name:"John",message:"Hello Tim"}
    ]
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server);

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended:false}));
    
    this.app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
    this.app.get('/messages', (req, res) => {
      res.send(messages);
    });
    this.app.post('/message', (req, res) => {
      messages.push(req.body);
      this.io.emit('message', req.body);
      res.sendStatus(200);
    });

    this.io.on('connection', (socket) => {
        console.log('user connected');
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
    });
  }
 
  public listen() {
    this.server.listen(this.port, () => {
      console.log(`Server ready on port ${this.port}`);
    });
  }

}
 
export default App;