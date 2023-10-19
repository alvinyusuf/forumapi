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
        username: comment.username,
        content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
        date: comment.date,
      }));
    });

    // sorting data dari date yang paling lama
    detailComment.sort((a, b) => new Date(a.date) - new Date(b.date));

    detailThread.comments = detailComment;
    return detailThread;
  }
}

module.exports = GetDetailThreadUseCase;
