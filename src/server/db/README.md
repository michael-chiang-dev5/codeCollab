## Create user table

```
CREATE TABLE GoogleUserInfo
(
_id SERIAL PRIMARY KEY,
sub TEXT NOT NULL,
picture TEXT NULL,
email TEXT NOT NULL,
email_verified BOOLEAN NULL
);
```

```
CREATE TABLE Markdown
(
_id SERIAL PRIMARY KEY,
str TEXT NOT NULL
);
```

```
CREATE TABLE MarkdownMetadata
(
_id SERIAL PRIMARY KEY,
markdown_id INTEGER REFERENCES Markdown (_id) NOT NULL,
title TEXT NULL,
difficulty REAL NULL
);
```

This is for zoom rooms

```
CREATE TABLE Rooms
(
_id SERIAL PRIMARY KEY,
roomid TEXT UNIQUE,
countusers INTEGER NOT NULL,
title TEXT NULL,
users TEXT NOT NULL
);
```
