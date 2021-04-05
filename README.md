# Spacefix

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Converts leading tabs to spaces, and `CRLF` and `CR` EOLs to proper `LF`
line feeds, skips binary files without modifying them.

An example Node.js TypeScript program with Visual Studio Code project setup,
including working code completion.

## Usage

```
node spacefix.js --force -tab=2 file1 [file2 ...]
```

Both `--force` (or `-f`) and `--tab` (or `-t`) arguments can also appear
multiple times at any point in-between files, allowing to change
behavior for following files.

## Build

```
git clone https://github.com/garnetius/spacefix-ts.git spacefix
cd spacefix
npm ci
npm run build
```
