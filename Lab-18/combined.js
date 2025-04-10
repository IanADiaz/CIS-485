const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const secretKey = 'mySecretKey123';

// SHA-256 hashing
function hashData(data) {
	const hash = crypto.createHash('sha256');
	hash.update(data);
	return hash.digest('hex');
}

// Base64 encoding and decoding
	function encodeBase64(data) {
	return Buffer.from(data).toString('base64');
}

function decodeBase64(encodedData) {
	return Buffer.from(encodedData, 'base64').toString('utf-8');
}

// AES encryption and decryption
function encryptData(data) {
	return CryptoJS.AES.encrypt(data, secretKey).toString();
}

function decryptData(encryptedData) {
	const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
	return bytes.toString(CryptoJS.enc.Utf8);
}

// Combined function
function secureProcess(password) {
	// Hash
	const hashedPassword = hashData(password);
	console.log("Hashed:", hashedPassword);

	// Encode the hash with Base64
	const encodedHash = encodeBase64(hashedPassword);
	console.log("Base64 Encoded:", encodedHash);

	// Encrypt the encoded hash
	const encryptedHash = encryptData(encodedHash);
	console.log("Encrypted:", encryptedHash);

	// Decrypt, decode, and verify
	const decryptedHash = decryptData(encryptedHash);
	const decodedHash = decodeBase64(decryptedHash);
	console.log("Decrypted and Decoded:", decodedHash);
}

// Example usage
secureProcess("myPassword123");
