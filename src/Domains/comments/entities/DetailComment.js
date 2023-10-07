class DetailComment {
  constructor(payload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.owner = payload.owner;
    this.content = payload.is_delete ? '**komentar telah dihapus**' : payload.content;
    this.date = payload.date;
  }

  verifyPayload({
    id, owner, content, date, is_delete,
  }) {
    if (!id || !owner || !content || !date || is_delete === 'undefined') {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' || typeof owner !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof is_delete !== 'boolean'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
