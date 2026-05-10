const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// ── POST /api/auth/login ──────────────────────────────────────────────────────
// Body: { correo, password }
// Respuesta: { ok, token, usuario: { id, nombre, apellidos, correo, rol } }
router.post("/login", async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password)
    return res
      .status(400)
      .json({ ok: false, mensaje: "Correo y contraseña requeridos." });

  try {
    const [rows] = await db.execute(
      "SELECT id, nombre, apellidos, correo, password_hash, rol, activo FROM usuarios WHERE correo = ?",
      [correo.toLowerCase().trim()],
    );

    if (rows.length === 0)
      return res
        .status(401)
        .json({ ok: false, mensaje: "Correo no encontrado." });

    const user = rows[0];

    if (!user.activo)
      return res
        .status(403)
        .json({ ok: false, mensaje: "Cuenta inactiva. Contacta soporte." });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res
        .status(401)
        .json({ ok: false, mensaje: "Contraseña incorrecta." });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "8h" },
    );

    return res.json({
      ok: true,
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
        rol: user.rol, // "residente" | "asesor" | "jefe"
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    return res
      .status(500)
      .json({ ok: false, mensaje: "Error interno del servidor." });
  }
});

// ── GET /api/auth/me  (ruta protegida de ejemplo) ────────────────────────────
router.get("/me", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ ok: false, mensaje: "Sin token." });
  try {
    const payload = jwt.verify(
      auth.split(" ")[1],
      process.env.JWT_SECRET || "secreto",
    );
    const [rows] = await db.execute(
      "SELECT id, nombre, apellidos, correo, rol FROM usuarios WHERE id = ?",
      [payload.id],
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ ok: false, mensaje: "Usuario no encontrado." });
    return res.json({ ok: true, usuario: rows[0] });
  } catch {
    return res.status(401).json({ ok: false, mensaje: "Token inválido." });
  }
});

module.exports = router;
