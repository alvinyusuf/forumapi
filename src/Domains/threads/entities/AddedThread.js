class AddedThread {
  constructor(payload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.owner = payload.owner;
    this.title = payload.title;
    this.body = payload.body;
  }

  verifyPayload(payload) {
    const { id } = payload;
    const { owner } = payload;
    const { title } = payload;
    const { body } = payload;

    // mengecek apakah data yang dibutuhkan sudah ada atau belum
    if (!id || !title || !owner || !body) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    // mengecek apakah tipe data yang dibutuhkan sudah benar atau belum
    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string' || typeof body !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
