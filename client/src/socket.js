import openSocket from "socket.io-client";

const url = "http://localhost:4000/";
export const socket = openSocket(url);
