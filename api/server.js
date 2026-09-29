import express from 'express';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
app.use(express.json());   // permite ler JSON no corpo dos pedidos

app.get('/api/health', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', hora_db: resultado.rows[0].now });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ status: 'erro' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor a correr em http://localhost:${PORT}`));
