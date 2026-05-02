# CLI URL Shortener

A small command-line tool for shortening URLs via the [TinyURL API](https://tinyurl.com/app/dev) and storing them in a local SQLite database. Built in TypeScript as a learning project.

## Features

- Shorten URLs via the TinyURL API
- Persist shortened URLs in a local SQLite database
- Look up, list, and delete previously shortened URLs by ID
- Automatic deduplication — shortening the same URL twice returns the existing entry instead of creating a new one

## Requirements

- Node.js 18 or newer
- A free [TinyURL API token](https://tinyurl.com/app/settings/api)

## Installation

```bash
git clone https://github.com/GitWorkingTime/CLI-URL-Shortener.git
cd CLI-URL-Shortener
npm install
```

## Setup

Create a `.env` file in the project root with your TinyURL API token:

```
TINYURL=your_api_token_here
```

## Usage

All commands are run via `npm start`. Use `--silent` to suppress npm's own output:

```bash
npm start --silent -- <command> [arguments]
```

### Commands

#### `shorten <url>`

Shorten a URL and save it to local history. If the URL has already been shortened, the existing entry is returned instead of creating a new one.

```bash
npm start --silent -- shorten https://www.example.com
# Tiny URL: https://tinyurl.com/abc123
```

#### `list`

Display all shortened URLs from local history with their IDs.

```bash
npm start --silent -- list
# [ID: 1] | Url: https://www.example.com || Shortened: https://tinyurl.com/abc123
```

#### `delete <id>`

Remove a shortened URL from local history by its ID. Use `list` to find IDs.

```bash
npm start --silent -- delete 1
# This url (https://www.example.com) and it's associated shortened url is now removed
```

#### `reset`

Clear all entries from the local database.

```bash
npm start --silent -- reset
# All data has been cleared!
```

### Help

Each command has its own help text:

```bash
npm start --silent -- --help
npm start --silent -- shorten --help
```

## Project structure

```
CLI-URL-Shortener/
├── src/
│   ├── cli.ts          # Commander setup and command handlers
│   ├── shortener.ts    # TinyURL API client
│   └── db.ts           # SQLite data access layer
├── database/
│   └── data.db         # Local database (created on first run)
├── .env                # API token (not committed)
└── package.json
```

## Tech stack

- **TypeScript** — type safety throughout
- **commander** — CLI argument parsing and help generation
- **sqlite3** — synchronous SQLite client
- **dotenv** — environment variable loading
- **tsx** — runs TypeScript directly without a separate build step
