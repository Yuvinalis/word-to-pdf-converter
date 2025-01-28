const express = require("express");
const multer = require("multer");
const libre = require("libreoffice-convert");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("wordFile"), (req, res) => {
    const filePath = req.file.path;
    const outputPath = filePath + ".pdf";

    fs.readFile(filePath, (err, data) => {
        if (err) return res.status(500).send("Error reading file");

        libre.convert(data, ".pdf", undefined, (err, done) => {
            if (err) return res.status(500).send("Conversion failed");

            fs.writeFileSync(outputPath, done);
            res.download(outputPath, "converted.pdf", () => {
                fs.unlinkSync(filePath);
                fs.unlinkSync(outputPath);
            });
        });
    });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
