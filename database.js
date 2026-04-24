const sqlite3 = require('sqlite3').verbose();

// Cria ou abre o arquivo do banco de dados
const db = new sqlite3.Database('./projeto_maio.db', (err) => {
    if (err) {
        console.error("❌ Erro ao abrir o banco:", err.message);
    } else {
        console.log("📂 Conectado ao banco de dados SQLite.");
    }
});

// Cria a tabela se ela não existir
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS resultados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        escola TEXT,
        turma TEXT,
        pontuacao INTEGER,
        data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;