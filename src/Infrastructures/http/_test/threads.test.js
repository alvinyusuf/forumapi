const pool = require('../../database/postgres/pool');
const ThreadsTableTestTable = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads endpoint', () => {
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
    await ThreadsTableTestTable.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  // afterEach(async () => {
  //   await ThreadsTableTestTable.cleanTable();
  //   await UsersTableTestHelper.cleanTable();
  //   await AuthenticationsTableTestHelper.cleanTable();
  // });

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
    });
  });
});
