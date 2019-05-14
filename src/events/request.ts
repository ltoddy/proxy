import http from "http";
import url from "url";

function handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
  const u: url.UrlWithStringQuery = url.parse(request.url);

  const options = {
    hostname: u.hostname,
    port: u.port || 80,
    path: u.path,
    method: request.method,
    headers: request.headers,
  };

  const req: http.ClientRequest = http.request(options, (res) => {
    response.writeHead(res.statusCode, res.headers);
    res.pipe(response);
  })
    .on("error", (e: Error) => response.end());

  request.pipe(req);
}

export default handleRequest;
