const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('harus orchestrating fitur delete comment dengan benar', async () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      id_thread: 'thread-123',
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getDetailComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(payload);

    // Assert
    expect(mockCommentRepository.getDetailComment).toBeCalledWith(payload.id, payload.id_thread);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(payload.id, payload.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(payload);
  });
});
