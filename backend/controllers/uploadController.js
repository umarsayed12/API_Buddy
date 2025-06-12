import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import parsePostman from "../services/parsePostman.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const handleUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const filePath = path.join(__dirname, "..", req.file.path);

    const fileData = await fs.promises.readFile(filePath, "utf-8");
    const json = JSON.parse(fileData);

    let parsedEndpoints;
    try {
      parsedEndpoints = parsePostman(json);
    } catch (parseError) {
      console.error("Postman parsing failed:", parseError.message);
      return res.status(400).json({ error: "Failed to parse Postman data." });
    }

    res.json({ endpoints: parsedEndpoints });

    await fs.promises.unlink(filePath);
  } catch (err) {
    console.error("Upload Error:", err.message);
    res.status(500).json({ error: "Failed to process file." });
  }
};
