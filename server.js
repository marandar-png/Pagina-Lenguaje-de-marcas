const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const dbPath = path.join(__dirname, 'bd.json');

// Función para leer la base de datos
function readDatabase() {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            return data.trim() ? JSON.parse(data) : { users: [] };
        }
        return { users: [] };
    } catch (error) {
        console.error('Error reading database:', error);
        return { users: [] };
    }
}

// Función para escribir en la base de datos
function writeDatabase(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing database:', error);
        return false;
    }
}

// Ruta para registrar usuario
app.post('/api/register', (req, res) => {
    const { username, email, password, age } = req.body;

    // Validación básica
    if (!username || !email || !password || !age) {
        return res.status(400).json({ 
            success: false, 
            message: 'Todos los campos son requeridos' 
        });
    }

    if (age < 18) {
        return res.status(400).json({ 
            success: false, 
            message: 'Debes tener 18 años o más' 
        });
    }

    const database = readDatabase();

    // Verificar si el usuario ya existe
    if (database.users.some(user => user.email === email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Este correo ya está registrado' 
        });
    }

    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        username,
        email,
        password, // En producción, esto debe estar hasheado
        age,
        registeredAt: new Date().toISOString()
    };

    database.users.push(newUser);

    if (writeDatabase(database)) {
        res.json({ 
            success: true, 
            message: 'Usuario registrado exitosamente',
            user: { id: newUser.id, username, email }
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Error al guardar el usuario' 
        });
    }
});

// Ruta para obtener usuarios (solo para verificación)
app.get('/api/users', (req, res) => {
    const database = readDatabase();
    res.json(database.users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        age: user.age,
        registeredAt: user.registeredAt
    })));
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
