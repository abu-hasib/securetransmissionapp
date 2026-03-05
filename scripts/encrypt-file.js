import fs from "fs";
import crypto from "crypto";

const PASSPHRASE = "SecureTransmissionMasterKey2026";
const SALT = "secure-transmission-app-salt";
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12;
const ITERATIONS = 100000;

// Derive key using PBKDF2 (matches encryption.js)
const secretKey = crypto.pbkdf2Sync(
  PASSPHRASE,
  SALT,
  ITERATIONS,
  KEY_LENGTH,
  "sha256"
);

const iv = crypto.randomBytes(IV_LENGTH);

const data = fs.readFileSync("./public/data.json", "utf8");

const cipher = crypto.createCipheriv("aes-256-gcm", secretKey, iv);

let encrypted = cipher.update(data, "utf8");
encrypted = Buffer.concat([encrypted, cipher.final()]);
const authTag = cipher.getAuthTag();

// Match Web Crypto API format: append auth tag to ciphertext
const fullCiphertext = Buffer.concat([encrypted, authTag]);

// Convert to hex strings to match encryption.js format
const ciphertext = fullCiphertext.toString("hex");
const ivHex = iv.toString("hex");

const output = {
  ciphertext,
  iv: ivHex,
  tag: authTag.toString("hex"), // Store tag separately for reference
  algorithm: "AES-GCM",
};

fs.writeFileSync("./public/encrypted.json", JSON.stringify(output, null, 2));

console.log("Encrypted file generated.");