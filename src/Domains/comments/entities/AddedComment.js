class AddedComment {
  constructor(payload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.owner = payload.owner;
    this.id_thread = payload.id_thread;
    this.content = payload.content;
  }

  verifyPayload({
    id, owner, id_thread, content,
  }) {
    if (!id || !owner || !id_thread || !content) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof id_thread !== 'string' || typeof content !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
