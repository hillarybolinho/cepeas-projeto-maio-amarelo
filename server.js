const express = require('express');
const path = require('path');
const db = require('./database'); // Importa o banco que criamos acima

const app = express();

// Configurações para ler formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Variável temporária para guardar os dados do cadastro antes do quiz terminar
let dadosUsuario = {};

// --- ROTAS ---

// 1. Receber Cadastro
app.post('/registrar', (req, res) => {
    dadosUsuario = {
        nome: req.body.nome,
        escola: req.body.escola || "Formado",
        turma: req.body.turma || "N/A"
    };
    console.log(`👤 Usuário registrado: ${dadosUsuario.nome}`);
    res.redirect('/quiz.html');
});

// 2. Processar Quiz (Cópia fiel para você colar aí!)
app.post('/processar-quiz', (req, res) => {
    const respostas = req.body;
    let notaFinal = 0;

    // GABARITO
    if (respostas.p1 === 'c') notaFinal += 1;
    if (respostas.p2 === 'b') notaFinal += 1;
    if (respostas.p3 === 'b') notaFinal += 1;
    if (respostas.p4 === 'c') notaFinal += 1;
    if (respostas.p5 === 'b') notaFinal += 1;
    if (respostas.p6 === 'b') notaFinal += 1;

    console.log(`📝 Usuário tirou nota: ${notaFinal}`);

    // Tentativa de salvar (Se falhar na nuvem, o código ignora e segue em frente)
    const query = `INSERT INTO resultados (nome, escola, turma, pontuacao) VALUES (?, ?, ?, ?)`;
    db.run(query, [
        dadosUsuario.nome || 'Anônimo', 
        dadosUsuario.escola || 'N/A', 
        dadosUsuario.turma || 'N/A', 
        notaFinal
    ], (err) => {
        if (err) console.error("❌ Erro de banco ignorado para não travar o site.");
    });

    // O PULO DO GATO: O redirecionamento agora é IMEDIATO
    res.redirect(`/resultado.html?nota=${notaFinal}`);
});