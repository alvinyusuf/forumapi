/* eslint-disable no-undef */
const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('harus membangkitkan error ketika tidak ada properti yang dibutuhkan', () => {
    // Arrange
    const payload = {
      title: 'Bagaimana cara mengatasi error node.js',
    };

    // Action dan Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('harus membangkitkan error ketika ada data yang tidak sesuai tipe datanya', () => {
    // Arrange
    const payload = {
      title: {
        judul: 'ini adalah judul',
      },
      body: true,
    };

    // Action dan Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('harus membuat objek addThread dengan benar', () => {
    // Assert
    const payload = {
      title: 'ini contoh title',
      body: 'ini contoh body',
    };

    // Action
    const { title, body } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
