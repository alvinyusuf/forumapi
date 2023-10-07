const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const addComment = new AddComment(payload);
    // mengecek apakah comment sudah ada di DB atau belum
    await this._threadRepository.getThreadById(addComment.id_thread);
    return this._commentRepository.createComment(addComment);
  }
}

module.exports = AddCommentUseCase;
