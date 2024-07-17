const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.PASSWORD;

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: '12345', // Altere para uma chave secreta forte
  resave: false,
  saveUninitialized: true
}));

// Middleware para verificar se o usuário está logado
function checkAuth(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/');
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    req.session.loggedIn = true;
    res.redirect('/receitas');
  } else {
    res.send('<p>Senha incorreta. <a href="/">Tente novamente</a></p>');
  }
});

app.get('/receitas', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'receitas.html'));
});

// Servir arquivos estáticos da pasta docs
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});