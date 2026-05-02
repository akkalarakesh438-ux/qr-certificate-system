const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
app.use(cors());

/* ===============================
   AZURE SQL CONFIG
=================================*/
const config = {
    user: 'STTServices',
    password: 'stt@1883',
    server: 'sttservices-db123.database.windows.net',
    database: 'STTServices',
    options: {
        encrypt: true, // required for Azure
        trustServerCertificate: false
    }
};

/* ===============================
   HOME ROUTE
=================================*/
app.get('/', (req, res) => {
    res.send("🚀 QR Certificate System Running (Azure Connected)");
});

/* ===============================
   VERIFY CERTIFICATE (FROM AZURE)
=================================*/
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
            <div style="font-family:Arial; width:420px; margin:auto; border:1px solid #ccc; padding:20px; border-radius:10px;">
                
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
        res.send("Database Error: " + err.message);
    }
});

/* ===============================
   QR GENERATION (GLOBAL URL)
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
   SERVER START
=================================*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
