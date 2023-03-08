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
roomId TEXT UNIQUE,
countUsers INTEGER NOT NULL,
title TEXT NULL
);
```

```
INSERT INTO Rooms (roomId, countUsers, title)
VALUES ('aaa', 2, 'mytitle')
ON CONFLICT (roomId)
DO UPDATE SET countUsers = EXCLUDED.countUsers, title = EXCLUDED.title
```
