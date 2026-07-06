
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Kafka } from "kafkajs";
import { mergeCRDT } from "./crdt";
import { aiOptimizer } from "./ai";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const kafka = new Kafka({
  clientId: "celestial",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

let state = { value: 0 };

async function start() {
  await producer.connect();
  setInterval(async () => {
    const event = {
      type: "INCREMENT",
      amount: Math.floor(Math.random() * 5) + 1,
    };
    const strategy = aiOptimizer(state, event);
    state = mergeCRDT(state, event, strategy);
    io.emit("state", { state, event, strategy });
    await producer.send({
      topic: "events",
      messages: [{ value: JSON.stringify({ event, strategy }) }],
    });
  }, 2000);
}

io.on("connection", (socket) => {
  socket.emit("state", { state });
});

server.listen(4000, () => {
  console.log("Backend running on :4000");
  start();
});
