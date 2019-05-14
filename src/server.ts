import http from "http";

import handleRequest from "./events/request";
import handleConnect from "./events/connect";

import { hostname, port } from "./config";

function serve() {
  const proxy: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end();
  });

  proxy.on("request", handleRequest);
  proxy.on("connect", handleConnect);

  proxy.listen(port, hostname, () => console.log(`server run at ${hostname}:${port}`));
}

serve();
