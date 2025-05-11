-- 1. Create the parent table: users
CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    gender VARCHAR(20),
    genderpronouns VARCHAR(20),
    creationtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create the child table: uploadedFiles
CREATE TABLE uploadedFiles (
    fileid SERIAL PRIMARY KEY,
    userid INT,
    subject VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    filesize BIGINT,
    mimetype TEXT,
    filedata BYTEA,
    uploadtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- 3. Create the child table: chatMessages
CREATE TABLE chatMessages (
    messageid SERIAL PRIMARY KEY,
    senderid INT NOT NULL,
    message TEXT NOT NULL,
    timesent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subject VARCHAR(100) NOT NULL,
    replyto INT,
    FOREIGN KEY (senderid) REFERENCES users(userid) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (replyto) REFERENCES chatMessages(messageid)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);