import http, { IncomingMessage, ServerResponse } from 'http';

import config from './config';

// class HET: HttpErrorTester {
//   constructor(port) {
//     this.port = port || config.hetPort;
//   }
// }

function primaryListener(req: IncomingMessage, res: ServerResponse) {
  console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++: url', req.url);
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    console.log('data', data)
    res.writeHead(200);
    res.end(data);
  })
}

const server = http.createServer(primaryListener);
const serverOptions = {
  port: config.hetPort || 3000,
  host: 'localhost'
};

server.listen(serverOptions, () => {
  console.log(`HET Server is running on "http://${serverOptions.host}:${serverOptions.port}"`);
});

server.on