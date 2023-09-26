/* eslint-disable no-undef */
const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('harus membangkitkan error ketika properti yang dibutuhkan tidak ada', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Ini contoh title',
      owner: 'user-123',
      comments: [],
    };

    // Action dan Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('harus membangkitan error ketika tipe data yang dibutuhkan tidak sesuai', () => {
    // Arrange
    const payload = {
      id: true,
      title: 'Ini contoh title',
      owner: [],
      body: {},
      date: '26-September-2023',
      comments: [],
    };

    // Action dan Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_TYPE_DATA_SPECIFICATION');
  });

  it('harus membuat objek detailThread yang benar', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Ini contoh title',
      owner: 'user-123',
      body: 'Ini contoh body',
      date: '26-September-2023',
      comments: [],
    };

    // Action
    const {
      id, title, owner, body, date, comments,
    } = new DetailThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(comments).toEqual(payload.comments);
  });
});
