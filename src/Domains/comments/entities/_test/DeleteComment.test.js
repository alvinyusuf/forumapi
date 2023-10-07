const DeleteComment = require('../DeleteComment');

describe('a DeleteComment entities', () => {
  it('harus mengembalikan error ketika data yang dibutuhkan tidak ada', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      id_thread: 'thread-123',
    };

    // Action dan Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('harus membangkitkan error ktika tipe data yang dibutuhkan tidak sesuai', () => {
    // Arrange
    const payload = {
      id: true,
      owner: ['user-123'],
      id_thread: { id_thread: 'thread-123' },
    };

    // Action dan Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('harus membuat comment baru dengan sesuai', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      id_thread: 'thread-123',
    };

    // Action
    const { id, owner, id_thread } = new DeleteComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(id_thread).toEqual(payload.id_thread);
  });
});
