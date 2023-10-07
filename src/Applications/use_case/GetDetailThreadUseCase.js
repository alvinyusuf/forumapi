const DetailComment = require('../../Domains/comments/entities/DetailComment');

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id_thread) {
    const detailThread = await this._threadRepository.getThreadById(id_thread);

    const comments = await this._commentRepository.getCommentsByThreadId(id_thread);

    const detailComment = [];
    comments.forEach((comment) => {
      detailComment.push(new DetailComment({
        id: comment.id,
        owner: comment.owner,
        content: comment.content,
        date: comment.date,
        is_delete: comment.is_delete,
      }));
    });
    detailThread.comments = detailComment;
    // detailThread.comments = detailComments;
    return detailThread;
  }
}

module.exports = GetDetailThreadUseCase;
