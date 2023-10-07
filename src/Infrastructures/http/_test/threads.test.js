const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads endpoint', () => {
  let threadId;
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
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('ketika POST /threads', () => {
    it('harus mengembalikan responCode 201 dan menambahkan thread baru', async () => {
      // Arrange
      const request = {
        title: 'contoh title',
        body: 'contoh body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: request,
        headers: {
          authorization: accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();

      threadId = responseJson.data.addedThread.id;
    });

    it('harus merespon 400 ketika payload tidak memuat semua properti', async () => {
      // Arrange
      const request = {
        title: 'contoh title',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: request,
        headers: {
          authorization: accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('payload belum lengkap');
    });

    it('harus merespon 400 ketika payload tidak sesuai tipe datanya', async () => {
      // Arrange
      const request = {
        title: true,
        body: { body: 'contoh body' },
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: request,
        headers: {
          authorization: accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tipe data tidak sesuai');
    });

    it('harus merespon 401 ketika tidak memiliki authorisasi', async () => {
      // Arrange
      const request = {
        title: 'ini contoh title',
        body: 'contoh body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: request,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('ketika GET /threads', () => {
    it('harus merespon 200', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      console.log(responseJson);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });

    it('harus merespon 404 ketika thread tidak ditemukan', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxx',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread yang anda cari tidak ada');
    });
  });
});
