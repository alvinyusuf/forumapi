const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  // async execute({ id, owner, id_thread }) {
  async execute(payload) {
    const deleteComment = new DeleteComment(payload);
    await this._commentRepository.getDetailComment(payload.id, payload.id_thread);
    await this._commentRepository.verifyCommentOwner(payload.id, payload.owner);
    return this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
