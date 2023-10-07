const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createComment function', () => {
    it('harus bisa menambahkan sebuah comment baru', async () => {
      // Arrange
      const payload = {
        owner: 'user-123',
        id_thread: 'thread-123',
        content: 'Ini adalah contoh comment',
      };

      const expectResult = {
        id: 'comment-123',
        ...payload,
      };

      const registerUser = new RegisterUser({
        username: 'alvin',
        password: 'rahasia',
        fullname: 'Alvin Yusuf Riziq',
      });

      const addThread = new AddThread({
        owner: 'user-123',
        title: 'Ini contoh title',
        body: 'Ini contoh body',
      });

      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addComment = new AddComment(payload);

      // Action
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.createThread(addThread);
      const addedComment = await commentRepositoryPostgres.createComment(addComment);

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById('comment-123');
      const {
        id, owner, id_thread, content,
      } = comment[0];

      expect(comment).toHaveLength(1);
      expect({
        id, owner, id_thread, content,
      }).toEqual(expectResult);

      expect(addedComment).toStrictEqual(new AddedComment(expectResult));
      const user = await UsersTableTestHelper.findUsersById('user-123');
      expect(user).toHaveLength(1);
      const thread = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });
  });

  describe('getDetailComment function', () => {
    it('harus membangkitkan notFound error ketika error tidak ditemukan', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action dan Assert
      await expect(commentRepository.getDetailComment('comment-123', 'thread-123')).rejects.toThrow(NotFoundError);
    });

    it('jangan membangkitkan error ketika ditemukan comment', async () => {
      // Arrange
      const fakeIdGenerator = () => '4321';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: 'comment-4321' });

      // Action & Assert
      await expect(commentRepository.getDetailComment('comment-4321', 'thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('deleteComment dan verifyCommentOwner function', () => {
    it('harus membangkitkan AuthorizationError ketika owner dan user tidak sesuai', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action dan Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-321')).rejects.toThrowError(AuthorizationError);
    });

    it('harus membangkitkan invariant error', async () => {
      // Arrange
      const payload = {
        id: 'comment-123',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action dan Assert
      await expect(commentRepositoryPostgres.deleteComment(payload))
        .rejects.toThrowError(InvariantError);
    });

    it('harus sukses melakukan soft delete', async () => {
      // Arrange
      const payload = {
        id: 'comment-123',
        owner: 'user-123',
        id_thread: 'thread-123',
      };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      await commentRepositoryPostgres.deleteComment(payload);

      // Assert
      const comments = await CommentsTableTestHelper.getCommentById(payload.id);
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toBe(payload.id);
      expect(comments[0].owner).toBe(payload.owner);
      expect(comments[0].id_thread).toBe(payload.id_thread);
      expect(comments[0].content).toBe('Ini adalah contoh comment');
      expect(comments[0].is_delete).toBe(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('harus bisa menampilkan beberapa comments', async () => {
      // Arrange
      const id_user = 'user-123';
      const id_thread = 'thread-123';
      const id = 'comment-321';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({ id });

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(id_thread);

      // Assert
      expect(comments).toHaveLength(2);
    });
  });
});
