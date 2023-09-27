class AddThread {
  constructor(payload) {
    this.verifyPayload(payload);

    this.owner = payload.owner;
    this.title = payload.title;
    this.body = payload.body;
  }

  verifyPayload(payload) {
    const { owner, title, body } = payload;

    // mengecek apakah data yang dibutuhkan sudah dipanggil atau belum
    if (!owner || !title || !body) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    // mengecek tipe data, apakah tipe data sudah benar atau belum
    if (typeof owner !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
