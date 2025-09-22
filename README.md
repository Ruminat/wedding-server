# Wedding Server

A simple Express.js server that handles wedding invitation responses storage.

## Features

- Store wedding invitation responses
- Retrieve all stored responses (protected by secret key)
- Clear all responses (protected by secret key)

## Setup

1. Install dependencies:
```sh
npm install
```

2. Create `.env` file with the following variables:
```sh
JSON_FILES_LOCATION=path/to/data/directory
SECRET_KEY=your-secret-key
PORT=3176 # optional
HOST=http://localhost # optional
```

## Development

```sh
# Run in development mode with hot reload
npm run dev

# Type checking
npm run typecheck

# Lint code
npm run lint

# Fix linting issues
npm run lint-fix
```

## Production

```sh
# Build the project
npm run build

# Start the server
npm run start
```

## API Endpoints

### Store Answer
```http
POST /api/wedding/answer
```

Request body:
```json
{
  "who": "Guest Name",
  "answer": "yes"
}
```

### Get All Answers
```http
GET /api/wedding/answers?secret_key=your-secret-key
```

### Clear All Answers
```http
POST /api/wedding/clear?secret_key=your-secret-key
```

## Security

Protected endpoints (`/answers` and `/clear`) require a `secret_key` query parameter matching the one in `.env` file.
