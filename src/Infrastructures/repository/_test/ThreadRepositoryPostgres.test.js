const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createThread function', () => {
    it('harus bisa menambahkan thread baru', async () => {
      // Arrange
      const payload = {
        owner: 'user-123',
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

      const fakeIdGenerator = () => '123';

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const expectResult = {
        id: 'thread-123',
        owner: payload.owner,
        title: payload.title,
        body: payload.body,
      };

      // Action
      // harus menambahkan user dulu, karena kolom owner memiliki relasi dengan tabel user
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.createThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById('thread-123');
      const {
        id, owner, title, body,
      } = threads[0];
      expect(threads).toHaveLength(1);
      expect({
        id, owner, title, body,
      }).toEqual(expectResult);
    });
  });

  describe('getThreadById function', () => {
    it('harus membangkitkan error notfound apabila id tidak ditemukan', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action dan Assert
      expect(threadRepository.getThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('harus bisa mendapatkan thread sesuai dengan id apabila id ditemukan di database', async () => {
      // Arrange
      const fakeIdGenerator = () => '321';

      const id = 'thread-321';

      const registerUser = new RegisterUser({
        username: 'alvin',
        password: 'rahasia',
        fullname: 'Alvin Yusuf Riziq',
      });

      const addThread = new AddThread({
        owner: 'user-321',
        title: 'Ini contoh title',
        body: 'Ini contoh body',
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      // membuat user dan thread baru terlebih dahulu
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.createThread(addThread);

      // Assert
      const result = await threadRepositoryPostgres.getThreadById(id);
      expect(result.id).toEqual(id);
      expect(result.owner).toEqual(registerUser.username);
      expect(result.title).toEqual(addThread.title);
      expect(result.body).toEqual(addThread.body);
      expect(result.date).toBeDefined();
    });
  });
});
