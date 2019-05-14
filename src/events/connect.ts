import { IncomingMessage } from "http";
import net, { Socket } from "net";
import url, { UrlWithStringQuery } from "url";

function handleConnect(request: IncomingMessage, clientSocket: Socket, head: Buffer | Uint8Array | string) {
  // connect to original server
  const srvUrl: UrlWithStringQuery = url.parse(`http://${request.url}`);

  const srvSocket: Socket = net.connect(Number.parseInt(srvUrl.port), srvUrl.hostname, () => {
    clientSocket.write("HTTP/1.1 200 Connection Established\r\n" +
      "Proxy-agent: node\r\n" +
      "\r\n");

    srvSocket.write(head);
    srvSocket.pipe(clientSocket);
    clientSocket.pipe(srvSocket);
  });
}

export default handleConnect;
