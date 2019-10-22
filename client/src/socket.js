import openSocket from "socket.io-client";

const url = "http://localhost:4000/game";
export const socket = openSocket(url);
