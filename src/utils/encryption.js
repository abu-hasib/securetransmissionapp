/**
 * Encryption utilities using Web Crypto API
 * AES-GCM encryption with 256-bit keys and 12-byte IV
 */

export const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 12 bytes for GCM

/**
 * Derive a key from a passphrase using PBKDF2
 */
export async function deriveKeyFromPassphrase(passphrase) {
  const encoder = new TextEncoder();
  const salt = encoder.encode('secure-transmission-app-salt');

  // Import passphrase as raw key
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random IV (Initialization Vector)
 */
function generateIV() {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Global encryption key (hardcoded for backend simulation)
 * In production, this would be securely stored
 */
const BACKEND_ENCRYPTION_PASSPHRASE = 'SecureTransmissionMasterKey2026';

/**
 * Simulate backend encryption
 * This is what the "server" would do before sending data to the client
 */
export async function encryptDataBackend(sensitiveData) {
  const key = await deriveKeyFromPassphrase(BACKEND_ENCRYPTION_PASSPHRASE);
  const iv = generateIV();

  const encoder = new TextEncoder();
  const plaintext = JSON.stringify(sensitiveData);

  // Encrypt the data
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    key,
    encoder.encode(plaintext)
  );

  // Convert to hex strings for transmission
  const ciphertextArray = new Uint8Array(encryptedBuffer);
  const ciphertext = Array.from(ciphertextArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const ivHex = Array.from(iv)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    ciphertext,
    iv: ivHex,
    tag: 'EAD7B5C4F2E1A0B9', // Placeholder tag (embedded in GCM ciphertext)
    algorithm: ALGORITHM,
  };
}

/**
 * Decrypt data on the client side using a provided passphrase
 */
export async function decryptDataClient(encryptedData, passphrase) {
  const key = await deriveKeyFromPassphrase(passphrase);

  // Convert hex strings back to Uint8Array
  const iv = new Uint8Array(
    encryptedData.iv.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
  );

  const ciphertext = new Uint8Array(
    encryptedData.ciphertext.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
  );

  try {
    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    const plaintext = decoder.decode(decryptedBuffer);

    // Parse and validate JSON
    const data = JSON.parse(plaintext);

    // Validate structure
    if (!isValidSensitiveData(data)) {
      throw new Error('Invalid data structure');
    }

    return data;
  } catch (error) {
    // Re-throw with descriptive message for invalid passphrase
    if (error instanceof Error && error.message.includes('decrypt')) {
      throw new Error('Invalid passphrase: Decryption failed');
    }
    throw error;
  }
}

/**
 * Validate sensitive data structure
 */
function isValidSensitiveData(data) {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data;

  return (
    typeof obj.userId === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.accountBalance === 'string' &&
    typeof obj.role === 'string' &&
    typeof obj.lastLogin === 'string'
  );
}

/**
 * Format encrypted data for display
 */
export function formatEncryptedPayload(encryptedData) {
  const preview = encryptedData.ciphertext.substring(0, 64);
  return `${preview}...`;
}

/**
 * Simulate a man-in-the-middle attack by corrupting the encrypted payload
 */
export function simulateMITMAttack(encryptedData) {
  // Flip a few bits in the ciphertext
  const chars = encryptedData.ciphertext.split('');
  const randomIndex = Math.floor(Math.random() * chars.length);
  const currentChar = chars[randomIndex];
  const newChar = (parseInt(currentChar, 16) ^ 0xF).toString(16);
  chars[randomIndex] = newChar;

  return {
    ...encryptedData,
    ciphertext: chars.join(''),
  };
}
