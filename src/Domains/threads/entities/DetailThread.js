class DetailThread {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id, title, username, body, date,
    } = payload;

    this.id = id;
    this.title = title;
    this.username = username;
    this.body = body;
    this.date = date;
  }

  verifyPayload({
    id, title, username, body, date,
  }) {
    if (!id || !title || !username || !body || !date) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' || typeof title !== 'string' || typeof username !== 'string'
      || typeof body !== 'string' || typeof date !== 'string'
    ) {
      throw new Error('DETAIL_THREAD.NOT_MEET_TYPE_DATA_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
