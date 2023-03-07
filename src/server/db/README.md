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
