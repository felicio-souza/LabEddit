-- Active: 1689117440913@@127.0.0.1@3306
CREATE TABLE users(

    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role NOT NULL,
    created_at TEXT DEFAULT(DATETIME())


);

INSERT INTO users (id, name, email, password, role)
VALUES
("us0001", "fernando", "fernando@empresa.teste", "sol2023", "ADMIN"),
("us0002", "saulo", "saulo@casa.teste", "casa2023", "NORMAL"),
("us0003", "marina", "brunas@face.teste", "bike123", "NORMAL")
;

SELECT * FROM users;

CREATE TABLE posts(

    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes TEXT DEFAULT(0) NOT NULL,
    dislikes TEXT DEFAULT(0) NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)

);

INSERT INTO posts (id, creator_id, content )
VALUES
("ps0001", "us0001", "Hoje a lua esta bela"),
("ps0002", "us0002", "A casa de nuitas moradas"),
("ps0003", "us0003", "A vida que buscamos");


CREATE TABLE likes_dislikes(

    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES post(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE

);

INSERT INTO likes_dislikes (user_id, post_id, like)
VALUES
("us0001", "ps0002", 1),
("us0002", "ps0003", 1),
("us0003", "ps0001", 0)
;


CREATE TABLE comment_post(
id TEXT UNIQUE PRIMARY KEY NOT NULL,
user_id NOT NULL,
post_id NOT NULL,
content TEXT NOT NULL,
likes INTEGER NOT NULL, 
dislikes INTEGER NOT NULL,
created_at TEXT DEFAULT(DATETIME()) NOT NULL,
updated_at TEXT DEFAULT(DATETIME()) NOT NULL,

Foreign Key (user_id) REFERENCES users(id),
Foreign Key (post_id) REFERENCES posts(id)
);


CREATE TABLE like_dislike_comment_post(
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    like INTEGER,

    Foreign Key (user_id) REFERENCES users(id),
    Foreign Key (comment_id) REFERENCES comment_post(id)
);
SELECT * FROM posts;
SELECT * FROM users;

SELECT * FROM likes_dislikes;

DROP TABLE users;
DROP TABLE posts;