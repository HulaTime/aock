import http, { Server } from 'http';
// import http, { IncomingMessage, ServerResponse, Server } from 'http';

// import 

// function _primaryListener(req: IncomingMessage, res: ServerResponse) {
// }

class TestServer {
  private _server: Server;
  private _port: number;

  constructor(port = 3000) {
    // this._server = http.createServer(_primaryListener);
    this._server = http.createServer();
    this._port = port;
  }

  // public addListener(test: TestCondition) {
  //   this._server.addListener('request', (req: IncomingMessage, res: ServerResponse) => {
  //     test.evaluate();
  //   });
  // }

  public listen(): void {
    this._server.listen({ host: 'localhost', port: this._port }, () => {
      console.log(`Aock Server is running on "http://localhost:${this._port}"`);
    });
  }
}

export default TestServer;
