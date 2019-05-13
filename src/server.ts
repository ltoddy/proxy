import http, { ClientRequest, IncomingMessage, Server, ServerResponse } from "http";
import net, { Socket } from "net";
import url, { UrlWithStringQuery } from "url";

import { hostname, port } from "./config";

function handleRequest(request: IncomingMessage, response: ServerResponse) {
  const u: UrlWithStringQuery = url.parse(request.url);

  const options = {
    hostname: u.hostname,
    port: u.port || 80,
    path: u.path,
    method: request.method,
    headers: request.headers,
  };

  const req: ClientRequest = http.request(options, (res) => {
    response.writeHead(res.statusCode, res.headers);
    res.pipe(response);
  })
    .on("error", (e) => response.end());

  request.pipe(req);
}

function handleConnect(request: IncomingMessage, cltSocket: Socket, head: Buffer | Uint8Array | string) {
  // connect to original server
  const srvUrl: UrlWithStringQuery = url.parse(`http://${request.url}`);

  const srvSocket: Socket = net.connect(Number.parseInt(srvUrl.port), srvUrl.hostname, () => {
    cltSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");

    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
  });

  cltSocket.pipe(srvSocket);
}

function serve() {
  const proxy: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end();
  });

  proxy.on("request", handleRequest);
  proxy.on("connect", handleConnect);

  proxy.listen(port, hostname, () => console.log(`server run at ${hostname}:${port}`));
}

serve();
