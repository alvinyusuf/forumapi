const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('harus membangkitkan error ketika tidak ada properti yang dibutuhkan', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Ini adalah contoh title',
      owner: 'user-123',
    };

    // Action dan Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('harus membangkitkan error ketika tipe data yang digunakan tidak sesuai', () => {
    // Arrange
    const payload = {
      id: [],
      title: true,
      owner: 'user-123',
      body: 'Ini contoh body',
    };

    // Action dan Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('harus membuat objek addedThread dengan benar', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Ini contoh title',
      owner: 'user-123',
      body: 'ini contoh body',
    };

    // Action
    const {
      id, title, owner, body,
    } = new AddedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
    expect(body).toEqual(payload.body);
  });
});
