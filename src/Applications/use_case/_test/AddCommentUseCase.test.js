const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment');

describe('AddCommentUseCase', () => {
  it('harus orchestrating fitur add comment dengan benar', async () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      id_thread: 'thread-123',
      content: 'Ini adalah contoh comment',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      owner: payload.owner,
      id_thread: 'thread-123',
      content: payload.content,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mock function yang dibutuhkan
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.createComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addComment = await addCommentUseCase.execute(payload);

    // Assert
    expect(addComment).toStrictEqual(mockAddedComment);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(payload.id_thread);
    expect(mockCommentRepository.createComment).toBeCalledWith(new AddComment(payload));
  });
});
