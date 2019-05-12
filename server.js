const http = require("http");
const net = require("net");
const url = require("url");

const PORT = 2333;

function handleRequest(request, response) {
  const u = url.parse(request.url);

  const options = {
    hostname: u.hostname,
    port: u.port || 80,
    path: u.path,
    method: request.method,
    headers: request.headers,
  };

  const req = http.request(options, (res) => {
    response.writeHead(res.statusCode, res.headers);
    res.pipe(response);
  })
    .on('error', (e) => response.end());

  request.pipe(req);
}

function handleConnect(request, socket) {
  const u = url.parse('http://' + request.url);

  const s = net.connect(u.port, u.hostname, () => {
    socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    s.pipe(socket);
  })
    .on('error', (e) => socket.end());

  socket.pipe(s);
}

function serve() {
  http.createServer()
    .on('request', handleRequest)
    .on('connect', handleConnect)
    .listen(PORT, '0.0.0.0',
      () => console.log(`server run at 0.0.0.0:${PORT}`));
}

serve();
