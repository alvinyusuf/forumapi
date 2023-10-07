class DeleteComment {
  constructor(payload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.owner = payload.owner;
    this.id_thread = payload.id_thread;
  }

  verifyPayload({ id, owner, id_thread }) {
    if (!id || !owner || !id_thread) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof id_thread !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;
