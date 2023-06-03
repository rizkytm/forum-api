const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    await this._commentRepository.verifyThreadExists(addComment.threadId);
    return this._commentRepository.postComment(addComment);
  }
}

module.exports = AddCommentUseCase;
