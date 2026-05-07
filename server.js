const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'bd.json');
const initialDatabase = { users: [] };

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function ensureDatabase() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify(initialDatabase, null, 2), 'utf8');
    }
}

function readDatabase() {
    ensureDatabase();

    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return data.trim() ? JSON.parse(data) : { ...initialDatabase };
    } catch (error) {
        console.error('Error reading database:', error);
        return { ...initialDatabase };
    }
}

function writeDatabase(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing database:', error);
        return false;
    }
}

function createPasswordHash(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

    return { salt, hash };
}

function verifyPassword(password, user) {
    if (!user.passwordHash || !user.passwordSalt) {
        return false;
    }

    const hash = crypto.pbkdf2Sync(password, user.passwordSalt, 100000, 64, 'sha512').toString('hex');
    const savedHash = Buffer.from(user.passwordHash, 'hex');
    const incomingHash = Buffer.from(hash, 'hex');

    return savedHash.length === incomingHash.length && crypto.timingSafeEqual(savedHash, incomingHash);
}

function sanitizeUser(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        age: user.age,
        registeredAt: user.registeredAt
    };
}

app.post('/api/register', (req, res) => {
    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const age = Number.parseInt(req.body.age, 10);

    if (!username || !email || !password || Number.isNaN(age)) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos'
        });
    }

    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({
            success: false,
            message: 'Introduce un correo valido'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'La password debe tener al menos 6 caracteres'
        });
    }

    if (age < 18) {
        return res.status(400).json({
            success: false,
            message: 'Debes tener 18 anos o mas'
        });
    }

    const database = readDatabase();
    const userExists = database.users.some((user) => user.email.toLowerCase() === email);

    if (userExists) {
        return res.status(409).json({
            success: false,
            message: 'Este correo ya esta registrado'
        });
    }

    const passwordData = createPasswordHash(password);
    const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        passwordHash: passwordData.hash,
        passwordSalt: passwordData.salt,
        age,
        registeredAt: new Date().toISOString()
    };

    database.users.push(newUser);

    if (!writeDatabase(database)) {
        return res.status(500).json({
            success: false,
            message: 'Error al guardar el usuario'
        });
    }

    return res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        user: sanitizeUser(newUser)
    });
});

app.post('/api/login', (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email y password son requeridos'
        });
    }

    const database = readDatabase();
    const user = database.users.find((databaseUser) => databaseUser.email.toLowerCase() === email);

    if (!user || !verifyPassword(password, user)) {
        return res.status(401).json({
            success: false,
            message: 'Email o password incorrectos'
        });
    }

    return res.json({
        success: true,
        message: 'Sesion iniciada correctamente',
        user: sanitizeUser(user)
    });
});

app.get('/api/users', (req, res) => {
    const database = readDatabase();
    res.json(database.users.map(sanitizeUser));
});

ensureDatabase();

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});
