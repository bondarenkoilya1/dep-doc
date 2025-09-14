import { HTTP_STATUS, CONTENT_TYPE_HTML } from "../constants/index.js";
import http from "http";

export const sendResponse = (
  status: number,
  response: http.ServerResponse,
  html?: string,
  error?: string
) => {
  if (status === HTTP_STATUS.OK) {
    response.writeHead(HTTP_STATUS.OK, { "Content-Type": CONTENT_TYPE_HTML });
    response.end(html || "No specified HTML");
    return;
  }

  response.writeHead(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  response.end(`${error}`);
};
