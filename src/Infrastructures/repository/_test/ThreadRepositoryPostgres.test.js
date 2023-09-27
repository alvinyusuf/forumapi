const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createThread function', () => {
    it('harus bisa menambahkan thread baru', async () => {
      // Arrange
      const payload = {
        owner: 'user-1234',
        title: 'Ini contoh title',
        body: 'Ini contoh body',
      };

      // Arrange untuk User
      const registerUser = new RegisterUser({
        username: 'alvin',
        password: 'rahasia',
        fullname: 'Alvin Yusuf Riziq',
      });

      // Arrange untuk thread
      const addThread = new AddThread(payload);

      const fakeIdGenerator = () => '1234';

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      // harus menambahkan user dulu, karena kolom owner memiliki relasi dengan tabel user
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.createThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById('thread-1234');
      expect(threads).toHaveLength(1);
    });
  });

  describe('getThreadById function', () => {
    it('harus bisa mendapatkan thread sesuai dengan id', async () => {
      // Arrange
      const fakeIdGenerator = () => '1234';
    });
  });
});
