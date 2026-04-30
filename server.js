const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
app.use(cors());

/* ===============================
   HOME ROUTE
=================================*/
app.get('/', (req, res) => {
    res.send("🚀 QR Certificate System Running");
});

/* ===============================
   VERIFY API (TEMP - NO DB)
=================================*/
app.get('/verify/:id', async (req, res) => {
    const id = req.params.id;

    res.send(`
        <h1 style="text-align:center;color:green;">✅ Certificate Verified</h1>
        <div style="font-family:Arial; width:400px; margin:auto; border:1px solid #ccc; padding:20px; border-radius:10px;">
            
            <p><b>Certificate ID:</b> ${id}</p>
            <p><b>Status:</b> Verified ✔</p>
            <p style="color:gray;">(Database will be connected soon)</p>

        </div>
    `);
});

/* ===============================
   QR GENERATION API
=================================*/
app.get('/qr/:id', async (req, res) => {
    try {
        const certificateId = req.params.id;

        const baseUrl = "https://sttservices.onrender.com";

        const qrData = `${baseUrl}/verify/${certificateId}`;

        const qrImage = await QRCode.toDataURL(qrData);

        res.send(`
            <h2 style="text-align:center;">QR Code for Certificate</h2>
            <div style="text-align:center;">
                <img src="${qrImage}" />
                <p>${qrData}</p>
            </div>
        `);

    } catch (err) {
        res.send("Error generating QR: " + err.message);
    }
});

/* ===============================
   SERVER START (RENDER FIX)
=================================*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
