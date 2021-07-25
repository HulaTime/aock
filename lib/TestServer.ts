import http, { IncomingMessage, ServerResponse, Server } from 'http';

function _primaryListener(req: IncomingMessage, res: ServerResponse) {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    res.end(body);
  });
}

class TestServer {
  private _server: Server;
  private _port: number;
  public name: string = Math.floor(Math.random() * (1000) + 1).toString();

  constructor(port = 3000) {
    this._server = http.createServer(_primaryListener);
    this._port = port;
  }

  // public addListener(test: TestCondition) {
  //   this._server.addListener('request', (req: IncomingMessage, res: ServerResponse) => {
  //     test.evaluate();
  //   });
  // }
  // public addTest(test: Test): void {
  //   this._server.addListener('request', test.listener())
  // }

  public getPort(): number {
    return this._port;
  }

  public listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this._server.listen({ host: 'localhost', port: this._port }, () => {
          console.log(`Aock Server ${this.name} is running on "http://localhost:${this._port}"`);
          resolve();
        });
      } catch (err) {
        console.log(`Error starting Aock server ${this.name}`);
        reject(err);
      }
    });
  }

  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this._server.close((err) => {
          if (err) {
            console.log(`Error closing Aock server ${this.name}`);
            reject(err);
          }
          console.log(`Successfully closed Aock server ${this.name}`);
          resolve();
        });
      } catch (err) {
        console.log(`Error closing Aock server ${this.name}`);
        reject(err);
      }
    });
  }
}

export default TestServer;
