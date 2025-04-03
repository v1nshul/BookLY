# BookLY: Books List API

## Overview
This is a Books List API that allows users to manage their book collection. The backend is built with Koa.js, and the frontend is a React application.

## Project Structure
- **Backend**: Located at the root (`/`), runs with `node index.js`.
- **Frontend**: Located in `/react-app/`, runs with `npm start`.
- **API Documentation**: JSDoc-generated documentation available at `/docs/jsdoc/`.
- **OpenAPI Spec**: Available in YAML and JSON formats at `/docs/yaml` and `/docs/json`.

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install backend dependencies:
   ```sh
   npm install
   ```
3. Install frontend dependencies:
   ```sh
   cd react-app
   npm install
   ```

## Running the Servers
### Start the Backend Server
```sh
node app.js
```

### Start the Frontend Server
```sh
cd react-app
npm start
```

## Running Tests
1. Install testing dependencies (if not already installed):
   ```sh
   npm install --save-dev jest supertest
   ```
2. Run tests:
   ```sh
   npm test
   ```

## API Endpoints
- **Books API**: Manage books (add, update, delete, list, search).
- **User Book List**: Users can add books to their personal collection.
- **Reviews API**: Users can review books.

## Documentation
- **JSDoc API Docs**: `https://radiusironic-historyharlem-3000.codio-box.uk/docs/jsdoc`
- **OpenAPI YAML**: `https://radiusironic-historyharlem-3000.codio-box.uk/docs/yaml`
- **OpenAPI JSON**: `https://radiusironic-historyharlem-3000.codio-box.uk/docs/json`
