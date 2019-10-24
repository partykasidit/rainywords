import openSocket from "socket.io-client";

const url = "http://localhost:4000/game";
//172.20.10.4:4000/game
export const socket = openSocket(url);
