class AddComment {
  constructor(payload) {
    this.verifyPayload(payload);

    this.owner = payload.owner;
    this.id_thread = payload.id_thread;
    this.content = payload.content;
  }

  verifyPayload(payload) {
    const { owner, id_thread, content } = payload;

    if (!owner || !id_thread || !content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof id_thread !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
