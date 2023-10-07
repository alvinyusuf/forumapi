const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('GetDetailThreadUseCase', () => {
  it('harus orchestrating fitur get detail thread dengan benar', async () => {
    // Arrange
    const threadId = 'thread-123';

    const payload = {
      owner: 'alvin',
      title: 'Ini contoh title',
      body: 'Ini contoh body',
      content: 'Ini contoh comment',
      date: new Date().toISOString(),
    };

    const mockDetailThread = new DetailThread({
      id: threadId,
      title: payload.title,
      owner: 'user-123',
      body: payload.body,
      date: payload.date,
    });

    const mockFirstComment = {
      id: 'comment-123',
      owner: payload.owner,
      content: payload.content,
      date: payload.date,
      is_delete: false,
    };

    const mockSecondComment = {
      id: 'comment-321',
      owner: payload.owner,
      content: payload.content,
      date: payload.date,
      is_delete: true,
    };

    const comments = [mockFirstComment, mockSecondComment];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(comments));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toEqual({
      id: threadId,
      title: payload.title,
      owner: 'user-123',
      body: payload.body,
      date: payload.date,
      comments: [new DetailComment(mockFirstComment), new DetailComment(mockSecondComment)],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
  });

  it('harus orchestrating fitur get detail thread dengan comment yang sudah dihapus dengan benar', async () => {
    // Arrange
    const threadId = 'thread-123';

    const payload = {
      owner: 'alvin',
      title: 'Ini contoh title',
      body: 'Ini contoh body',
      content: 'Ini contoh comment',
      date: new Date().toISOString(),
    };

    const mockDetailThread = new DetailThread({
      id: threadId,
      title: payload.title,
      owner: 'user-123',
      body: payload.body,
      date: payload.date,
    });

    const mockComment = {
      id: 'comment-123',
      owner: payload.owner,
      content: payload.content,
      date: payload.date,
      is_delete: true,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([mockComment]));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toEqual({
      id: threadId,
      title: payload.title,
      owner: 'user-123',
      body: payload.body,
      date: payload.date,
      comments: [new DetailComment(mockComment)],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
  });

  it('harus orchestrating fitur get detail thread tanpa comment dengan benar', async () => {
    // Arrange
    const threadId = 'thread-123';

    const payload = {
      owner: 'alvin',
      title: 'Ini contoh title',
      body: 'Ini contoh body',
      content: 'Ini contoh comment',
      date: new Date().toISOString(),
    };

    const mockDetailThread = new DetailThread({
      id: threadId,
      title: payload.title,
      owner: 'user-123',
      body: payload.body,
      date: payload.date,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([]));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toEqual({
      id: threadId,
      title: payload.title,
      owner: 'user-123',
      body: payload.body,
      date: payload.date,
      comments: [],
    });
  });
});
