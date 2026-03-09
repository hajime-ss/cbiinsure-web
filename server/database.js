const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'settings.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_email TEXT,
    receiver_email TEXT,
    email_subject TEXT,
    email_body_template TEXT
  )`, (err) => {
        if (err) {
            console.error("Error creating table", err);
        } else {
            // Check if settings exist, if not create default
            db.get("SELECT count(*) as count FROM settings", (err, row) => {
                if (row.count === 0) {
                    const insert = 'INSERT INTO settings (sender_email, receiver_email, email_subject, email_body_template) VALUES (?,?,?,?)';
                    db.run(insert, ["noreply@example.com", "admin@example.com", "New Insurance Request", "New request received from {name}."]);
                    console.log("Default settings inserted.");
                }
            });
        }
    });
}

module.exports = db;
