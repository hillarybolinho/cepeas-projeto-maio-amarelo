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

// 2. Processar Quiz (Substituindo o C++)
app.post('/processar-quiz', (req, res) => {
    const respostas = req.body;
    let notaFinal = 0;

    // GABARITO (Lógica que era do C++)
    if (respostas.p1 === 'c') notaFinal += 1; // Amarelo
    if (respostas.p2 === 'b') notaFinal += 1; // Faixa de pedestres
    if (respostas.p3 === 'b') notaFinal += 1; // 1,5 metro
    if (respostas.p4 === 'c') notaFinal += 1; // Dê a preferência
    if (respostas.p5 === 'b') notaFinal += 1; // 10 anos
    if (respostas.p6 === 'b') notaFinal += 1; // Perda de aderência

    console.log(`📝 ${dadosUsuario.nome} tirou nota: ${notaFinal}`);

    // SALVAR NO BANCO DE DADOS
    const query = `INSERT INTO resultados (nome, escola, turma, pontuacao) VALUES (?, ?, ?, ?)`;
    db.run(query, [dadosUsuario.nome, dadosUsuario.escola, dadosUsuario.turma, notaFinal], function(err) {
        if (err) {
            console.error("❌ Erro ao salvar:", err.message);
            return res.status(500).send("Erro ao salvar no banco.");
        }
        // Manda para a página de resultado com a nota na URL
        res.redirect(`/resultado.html?nota=${notaFinal}`);
    });
});

// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 PROJETO RODANDO COM SUCESSO!`);
    console.log(`👉 Acesse: http://localhost:${PORT}`);
    console.log(`💡 O C++ foi substituído pelo JavaScript com sucesso.\n`);
});