const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("✅ Cliente conectado:", socket.id);

  socket.on("join_conversation", (conversationId) => {
    if (!conversationId) return;
    socket.join(String(conversationId));
    console.log("📌 Entrou na sala:", conversationId);
    console.log("📌 Salas do socket:", Array.from(socket.rooms));
  });

  socket.on("leave_conversation", (conversationId) => {
    socket.leave(String(conversationId));
    console.log("📌 Saiu da sala:", conversationId);
  });

  socket.on("disconnect", () => {
    console.log("⚠️ Desconectado:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Socket server OK 🚀");
});

app.post("/emit/new-message", (req, res) => {
  console.log("🔥 Recebi POST /emit/new-message:", req.body);

  const { conversationId, message, conversation } = req.body;

  if (!conversationId || !message) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  // ✅ Emite a mensagem para a sala da conversa
  io.to(String(conversationId)).emit("new_message", message);

  // ✅ Atualiza lista de conversas (opcional)
  if (conversation) {
    io.emit("conversation_updated", conversation);
  }

  return res.json({ ok: true });
});

server.listen(3000, () => {
  console.log("🚀 Socket server rodando na porta 3000");
});