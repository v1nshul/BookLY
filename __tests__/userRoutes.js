const request = require('supertest');
const app = require('../app');
const mysql = require('promise-mysql');
const info = require('../config');

let userId, bookId, connection;

// Mock auth middleware
jest.mock('../middleware/auth', () => {
  return jest.fn().mockImplementation(async (ctx, next) => {
    ctx.state.user = { ID: 1 }; // Default, updated in beforeAll
    await next();
  });
});

// Mock authenticate from controllers/auth
jest.mock('../controllers/auth', () => ({
  authenticate: jest.fn().mockImplementation(async (ctx, next) => {
    ctx.state.user = { ID: 1 }; // Default, updated in beforeAll
    await next();
  }),
  login: jest.requireActual('../controllers/auth').login, // Keep real login if needed
}));

describe('User Routes', () => {
  let server;

  beforeAll(async () => {
    server = app.callback();
    connection = await mysql.createConnection(info.config);
    await connection.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [
      'testuser',
      '$2b$10$1.q9tVk/gofsp0vrc8BWz.QrfSodoVYhgL69tXF1TF6AdqWo4Phs6',
      'test@example.com'
    ]);
    const [user] = await connection.query('SELECT LAST_INSERT_ID() as id');
    userId = user.id;

    // Update mocks with dynamic userId
    jest.requireMock('../middleware/auth').mockImplementation(async (ctx, next) => {
      ctx.state.user = { ID: userId };
      await next();
    });
    jest.requireMock('../controllers/auth').authenticate.mockImplementation(async (ctx, next) => {
      ctx.state.user = { ID: userId };
      await next();
    });
  });

  afterAll(async () => {
    await connection.end();
    jest.resetAllMocks();
  });

  describe('POST /api/home/register', () => {
    it('should create a new user', async () => {
      const res = await request(server)
        .post('/api/home/register')
        .send({
          username: 'unique_112233',
          password: 'password',
          email: 'unique_email@example.com'
        });
      console.log('Create user response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
  });
});

describe('Book Routes', () => {
  let server;

  beforeAll(async () => {
    server = app.callback();
    connection = await mysql.createConnection(info.config);
    await connection.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [
      'testuser2',
      '$2b$10$1.q9tVk/gofsp0vrc8BWz.QrfSodoVYhgL69tXF1TF6AdqWo4Phs6',
      'test2@example.com'
    ]);
    const [user] = await connection.query('SELECT LAST_INSERT_ID() as id');
    userId = user.id;

    await connection.query('INSERT INTO books (title, description, authorID) VALUES (?, ?, ?)', [
      'Test Book',
      'A test book',
      1
    ]);
    const [book] = await connection.query('SELECT LAST_INSERT_ID() as id');
    bookId = book.id;

    // Update mocks with dynamic userId
    jest.requireMock('../middleware/auth').mockImplementation(async (ctx, next) => {
      ctx.state.user = { ID: userId };
      await next();
    });
    jest.requireMock('../controllers/auth').authenticate.mockImplementation(async (ctx, next) => {
      ctx.state.user = { ID: userId };
      await next();
    });
  });

  afterAll(async () => {
    await connection.end();
    jest.resetAllMocks();
  });

  describe('GET /api/home/books/search', () => {
    it('should search books', async () => {
      const res = await request(server)
        .get('/api/home/books/search')
        .query({ query: 'test search' });
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('GET /api/home/books/', () => {
    it('should get all books', async () => {
      const res = await request(server)
        .get('/api/home/books/');
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('POST /api/home/books/add', () => {
    it('should add book to user list', async () => {
      const res = await request(server)
        .post('/api/home/books/add')
        .send({
          title: 'Test Book',
          author: 'Test Author'
        });
      expect(res.statusCode).toEqual(201);
    });
  });

  describe('DELETE /api/home/books/remove', () => {
    it('should remove book from user list', async () => {
      const res = await request(server)
        .delete('/api/home/books/remove')
        .send({
          title: 'Test Book',
          author: 'Test Author'
        });
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('POST /api/home/books/reviews', () => {
    it('should add a book review', async () => {
      const res = await request(server)
        .post('/api/home/books/reviews')
        .send({
          book_id: bookId,
          rating: 4,
          comment: 'Great book!'
        });
      expect(res.statusCode).toEqual(201);
    });
  });

  describe('GET /api/home/books/reviews', () => {
    it('should get book reviews', async () => {
      const res = await request(server)
        .get('/api/home/books/reviews')
        .query({ book_id: bookId });
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('POST /api/home/books', () => {
  it('should create a new book', async () => {
    const res = await request(server)
      .post('/api/home/books')
      .send({
        title: 'Test Book 2',
        description: 'Another test book',
        author: "tester"
      });
    console.log('Create book response:', res.statusCode, JSON.stringify(res.body, null, 2));
    expect(res.statusCode).toEqual(201);
  });
});
});