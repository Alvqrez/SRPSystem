const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const authRoutes  = require("./routes/auth");
const citasRoutes = require("./routes/citas");

const app  = express();
const PORT = process.env.PORT || 3306;

app.use(cors());
app.use(express.json());

// ── Rutas ────────────────────────────────────────────────────────────────────
app.use("/api/auth",  authRoutes);
app.use("/api/citas", citasRoutes);

// Health check
app.get("/api/health", (_, res) =>
  res.json({ ok: true, mensaje: "VinculaTec API corriendo 🚀" }),
);

// ── Inicio ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Servidor corriendo en http://localhost:${PORT}`);
});
