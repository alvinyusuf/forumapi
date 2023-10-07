const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comment endpoint', () => {
  // thread id yang akan digunakan di setiap pengujian
  const threadId = 'thread-123';
  let commentId = 'comment-123';
  // membuat user login supaya mendapatkan access token
  async function addUserAndGetAccessToken({
    username = 'alvin',
    password = 'rahasia',
    fullname = 'Alvin Yusuf Riziq',
  }) {
    const request = {
      username,
      password,
    };

    const server = await createServer(container);
    // menambahan user baru
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username,
        password,
        fullname,
      },
    });

    // melakukan proses login user baru untuk mendapatkan token
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: request,
    });

    const responseJson = JSON.parse(response.payload);
    return `Bearer ${responseJson.data.accessToken}`;
  }

  // mendapatkan access token, karena function access token bersifat asynchronus
  let accessToken;
  beforeAll(async () => {
    accessToken = await addUserAndGetAccessToken({});
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  // afterEach(async () => {
  // });

  describe('ketika POST /threads/{threadID}/comments', () => {
    // pengujian positif dilakukan terlebih dahulu karena untuk mempermudah
    it('harus mengembalikan response 201 dan membuat comment dengan benar', async () => {
      // Arrange
      const payload = {
        content: 'Ini contoh comment',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload,
        headers: {
          authorization: accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      commentId = responseJson.data.addedComment.id;
    });

    it('harus merespon 400 ketika data payload tidak lengkap', async () => {
      // Arrange
      const payload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload,
        headers: {
          authorization: accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('content comment belum ada');
    });

    it('harus merespon 401 ketika tidak memiliki authorisasi', async () => {
      // Arrange
      const payload = {
        content: 'Ini adalah contoh comment',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('harus merespon 404 ketika tidak ditemukan thread', async () => {
      // Action
      const payload = {
        content: 'Ini contoh comment',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-321/comments',
        payload,
        headers: {
          authorization: accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread yang anda cari tidak ada');
    });
  });

  describe('ketika DELETE /threads/{threadID}/comments/{commentId}', () => {
    it('harus merespon 200 dan comment berhasil dihapus', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
