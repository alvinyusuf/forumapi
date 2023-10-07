// class DetailComment {
//   constructor(payload) {
//     this.verifyPayload(payload);

//     this.id = payload.id;
//     this.username = payload.owner;
//     this.date = payload.date;
//     this.content = payload.is_delete ? '**komentar telah dihapus**' : payload.content;
//   }

//   verifyPayload({
//     id, owner, content, date, is_delete,
//   }) {
//     const username = owner;
//     if (!id || !username || !content || !date || is_delete === 'undefined') {
//       throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
//     }

//     if (
//       typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string'
//        || typeof date !== 'string' || typeof is_delete !== 'boolean'
//     ) {
//       throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
//     }
//   }
// }

class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, content, date,
    } = payload;

    this.id = id;
    this.username = username;
    this.content = content;
    this.date = date;
  }

  _verifyPayload({
    id, username, content, date,
  }) {
    if (!id || !username || !content || !date) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || typeof date !== 'string') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
