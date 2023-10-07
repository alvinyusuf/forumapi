const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('harus membangkitkan error ketika properti ada yang kosong', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    };

    // Action dan Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('harus membangkitkan error ketika ada tipe data yang tidak sesuai', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      content: true,
      date: { date: 'ini contoh date' },
      is_delete: 'false',
    };

    // Action dan Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('harus berhasil menampilan detail comment dengan benar', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      content: 'ini contoh comment',
      date: '06 Oktober 2023',
      is_delete: true,
    };

    // Action
    const {
      id, owner, content, date,
    } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(date).toEqual(payload.date);
  });
});
