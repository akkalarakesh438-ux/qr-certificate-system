const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
app.use(cors());

// SQL Config (using SA login)
const config = {
    user: 'sa',
    password: 'stt@1883',
    server: 'DESKTOP-1LNIDHF',
    database: 'STTServices',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Home route
app.get('/', (req, res) => {
    res.send("🚀 QR Certificate System Running");
});

// Verify certificate API
app.get('/verify/:id', async (req, res) => {
    try {
       const pool = await sql.connect(config);

const result = await pool.request()
    .input('id', sql.VarChar, req.params.id)
    .query('SELECT * FROM Completion_Certificates WHERE CertificateID = @id');
        if (result.recordset.length === 0) {
            return res.send("<h2 style='color:red'>❌ Invalid Certificate</h2>");
        }

        const data = result.recordset[0];

        res.send(`
    <h1 style="text-align:center;color:green;">✅ Certificate Verified</h1>
    <div style="font-family:Arial; width:400px; margin:auto; border:1px solid #ccc; padding:20px; border-radius:10px;">
        
        <p><b>Name:</b> ${data.StudentName}</p>
        <p><b>Course:</b> ${data.CourseName}</p>
        <p><b>Course ID:</b> ${data.CourseID}</p>
        <p><b>Certificate ID:</b> ${data.CertificateID}</p>
        <p><b>Status:</b> ${data.Status}</p>
        <p><b>Company:</b> ${data.CompanyName}</p>
        <p><b>Issued Date:</b> ${data.IssueDate || 'Not Issued'}</p>

    </div>
`);

    } catch (err) {
        res.send("Error: " + err.message);
    }
});
app.get('/qr/:id', async (req, res) => {
    try {
        const certificateId = req.params.id;

const baseUrl = "https://sttservices.onrender.com";  // we will create this

const qrData = `${baseUrl}/verify/${certificateId}`;

        res.send(`
            <h2>QR Code for Certificate</h2>
            <img src="${qrImage}" />
            <p>${qrData}</p>
        `);

    } catch (err) {
        res.send("Error generating QR: " + err.message);
    }
});

// Start server
app.listen(3000, '0.0.0.0', () => {
    console.log("✅ Server running on network");
}