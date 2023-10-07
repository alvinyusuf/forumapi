const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('harus membangkitkan error ketika tidak ada properti yang dibutuhkan', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      content: 'Ini adalah contoh comment',
    };

    // Action dan Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('harus membangkitkan error ketika ada tipe data yang tidak sesuai', () => {
    // Arrange
    const payload = {
      owner: true,
      id_thread: 'thread-123',
      content: { comment: 'Ini adalah contoh comment' },
    };

    // Action dan Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('harus membuat comment baru dengan benar', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      id_thread: 'thread-123',
      content: 'Ini adalah contoh comment',
    };

    // Action
    const { owner, id_thread, content } = new AddComment(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(id_thread).toEqual(payload.id_thread);
    expect(content).toEqual(payload.content);
  });
});
