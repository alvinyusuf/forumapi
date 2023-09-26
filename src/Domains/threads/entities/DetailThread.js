/* eslint-disable class-methods-use-this */
class DetailThread {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id, title, owner, body, date, comments,
    } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
    this.body = body;
    this.date = date;
    this.comments = comments;
  }

  verifyPayload(payload) {
    const {
      id, title, owner, body, date, comments,
    } = payload;

    if (!id || !title || !owner || !body || !date || !comments) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string' || typeof body !== 'string' || typeof date !== 'string' || !(comments instanceof Array)) {
      throw new Error('DETAIL_THREAD.NOT_MEET_TYPE_DATA_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
