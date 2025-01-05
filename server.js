const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Obtener las credenciales desde la variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

const app = express();
app.use(cors());
app.use(express.json());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.post('/api/send-notification', async (req, res) => {
    try {
        const { tokens, title, body } = req.body;

        const results = [];
        for (const token of tokens) {
            const message = {
                notification: { title, body },
                token
            };

            const response = await admin.messaging().send(message);
            results.push(response);
        }

        res.json({
            success: true,
            results
        });
    } catch (error) {
        console.error('Error al enviar notificaciones:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
