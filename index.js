const express = require("express");
const cors = require("cors");
const multer = require("multer");

const fs = require("fs");
const path = require("path");

const fieldName = "file";
const storagePath = "uploads";

if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath);
} else {
  fs.readdir(storagePath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(storagePath, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, storagePath);
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

app.post("/upload", upload.single(fieldName), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Upload failed..." });
  }

  if (req.file.originalname === "test-1.txt") {
    return res.status(500).json({ message: "Sorry, something went wrong..." });
  }

  return res.status(200).json({ message: "Uploaded successfully!" });
});

app.delete("/delete", (req, res) => {
  const fileName = req.body.fileName;

  if (fileName === "test-2.txt") {
    return res.status(500).json({ message: "Sorry, something went wrong..." });
  }

  fs.unlink(path.join(storagePath, fileName), (err) => {
    if (err) {
      return res.status(400).json({ message: "Failed to delete file..." });
    }

    return res.status(200).json({ message: "Successfully deleted!" });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
