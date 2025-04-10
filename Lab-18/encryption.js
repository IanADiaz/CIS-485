const CryptoJS = require('crypto-js');
//const secretKey = 'secretKey123';
const readline = require('readline');
const fs = require('fs');

//function encryptData(data) {
//	return CryptoJS.AES.encrypt(data, secretKey).toString();
//}

//function decryptData(encryptedData) {
//	const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
//	return bytes.toString(CryptoJS.enc.Utf8);
//}

//function passkeyencryption(messageInput, passInput) {
//	return CryptoJS.AES.encrypt(messageInput, passInput).toString();
//}

//function passkeydecryption(ciphertext, passInput) {
//	const bytes = CryptoJS.AES.decrypt(ciphertext, passInput);
//	const ogText = bytes.toString(CryptoJS.enc.Utf8);
//	return ogText;
//}
function passkeyEncryption(messageInput, passInput) {
    return CryptoJS.AES.encrypt(messageInput, passInput).toString();
}


function passkeyDecryption(ciphertext, passInput) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, passInput);
    return bytes.toString(CryptoJS.enc.Utf8);
}

function encryptFileWithPassword(inputFilePath, password, outputFilePath) {
    try {
        const fileData = fs.readFileSync(inputFilePath, 'utf-8');
        const encrypted = passkeyEncryption(fileData, password);
        fs.writeFileSync(outputFilePath, encrypted);
        console.log(`Encrypted content saved to: ${outputFilePath}`);
    } catch (err) {
        console.error("Error encrypting file:", err.message);
    }
}

function decryptFileWithPassword(encryptedFilePath, password, outputFilePath) {
    try {
        const encryptedContent = fs.readFileSync(encryptedFilePath, 'utf-8');
        const decrypted = passkeyDecryption(encryptedContent, password);
        fs.writeFileSync(outputFilePath, decrypted);
        console.log(` Decrypted content saved to: ${outputFilePath}`);
    } catch (err) {
        console.error("Error decrypting file:", err.message);
    }
}
//const message = "sensitive data";
//const encrypted = encryptData(message);
//console.log("Encrypted:", encrypted);

//const decrypted = decryptData(encrypted);
//console.log("Decrypted:", decrypted);

const read = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

//read.question('Type what you want encrypted:', function(input) {
//	const encrypted = encryptData(input);
//	console.log('Encrypted:', encrypted);
//	
//	const decrypted = decryptData(encrypted);
//	console.log('Decrypted:', decrypted);
//	read.close();
//});


//read.question('Type what you want encrypted:', function(messageInput) {
//	read.question('Enter password:', function(passInput) {
//
//     		const encrypted = passkeyencryption(messageInput, passInput);
//      		console.log('Encrypted:', encrypted);
//
//      		const decrypted = passkeydecryption(encrypted, passInput);
//      		console.log('Decrypted:', decrypted);
//      		read.close();
//	});
//});

read.question("Enter the path of the file you want to encrypt: ", function(inputFile) {
    read.question("Enter a password: ", function(password) {
        read.question("Enter a name for the encrypted file (e.g. encrypted.txt): ", function(encryptedFile) {
            encryptFileWithPassword(inputFile, password, encryptedFile);

            read.question("📂 Enter a name for the decrypted file (e.g. decrypted.txt): ", function(decryptedFile) {
                decryptFileWithPassword(encryptedFile, password, decryptedFile);
                read.close();
            });
        });
    });
});











