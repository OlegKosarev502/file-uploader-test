const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads");
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.static("uploads"));
app.use(cors());
const port = 8000;

app.get("/", (_req, res) => {
  res.send("Ready!");
});

app.post("/upload", upload.single("FILE"), (req, res) => {
  if (req.file) {
    if (req.file.originalname === "1.png") {
      return new Promise((resolve) => {
        setTimeout(() => {
          res.status(200).json({ message: "Uploaded successfully!" });
          resolve();
        }, 2000);
      });
    }

    if (req.file.originalname === "2.png") {
      res.status(500).json({ message: "Upload failed..." });
    }

    return res.status(200).json({ message: "Uploaded successfully!" });
  }

  return res.status(400).json({ message: "Upload failed..." });
});

app.delete("/delete", (req, res) => {
  const fileName = req.body.fileName;

  fs.unlink(`uploads/${fileName}`, (err) => {
    if (err) {
      return res.status(400).json({ message: "Failed to delete file..." });
    }

    return res.status(200).json({ message: "Successfully deleted!" });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
