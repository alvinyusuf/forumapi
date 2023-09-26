/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class AddThread {
  constructor(payload) {
    this.verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
  }

  verifyPayload({ title, body }) {
    // mengecek apakah data yang dibutuhkan sudah dipanggil atau belum
    if (!title || !body) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    // mengecek tipe data, apakah tipe data sudah benar atau belum
    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
