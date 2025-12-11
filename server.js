const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { criarLinkPagamento } = require('./services/cielo.js');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/create-link', async (req, res) => {
  try {
    const {
      name,
      price,
      description = '',
      quantity = 1,
      orderNumber
    } = req.body ?? {};

    if (!name || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        error: { message: 'Informe nome e valor do link.' }
      });
    }

    const result = await criarLinkPagamento({
      name: String(name).trim(),
      description: String(description).trim(),
      price,
      quantity,
      orderNumber
    });

    if (!result?.success) {
      return res.status(result?.status || 500).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
