const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('harus membangkitkan error ketika properti yang dibutuhkan tidak ada', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Ini contoh title',
      username: 'user-123',
    };

    // Action dan Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('harus membangkitan error ketika tipe data yang dibutuhkan tidak sesuai', () => {
    // Arrange
    const payload = {
      id: true,
      title: 'Ini contoh title',
      username: [],
      body: {},
      date: '26-September-2023',
    };

    // Action dan Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_TYPE_DATA_SPECIFICATION');
  });

  it('harus membuat objek detailThread yang benar', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Ini contoh title',
      username: 'user-123',
      body: 'Ini contoh body',
      date: '26-September-2023',
    };

    // Action
    const {
      id, title, username, body, date,
    } = new DetailThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(username).toEqual(payload.username);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
  });
});
