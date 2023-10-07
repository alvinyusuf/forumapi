const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('harus membangkitkan error ketika properti yang dibutuhkan tidak ada', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Ini adalah contoh comment',
    };

    // Action dan Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('harus membangkitkan error ketiak tipe data yang dibutuhkan tidak sesuai', () => {
    // Arrange
    const payload = {
      id: true,
      owner: { user: 'user-123' },
      id_thread: 'thread-123',
      content: [],
    };

    // Action dan Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('harus berhasil membuat komentar dengan benar', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      id_thread: 'thread-123',
      content: 'Ini contoh comment',
    };

    // Action
    const {
      id, owner, id_thread, content,
    } = new AddedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(id_thread).toEqual(payload.id_thread);
    expect(content).toEqual(payload.content);
  });
});
