const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    await this._threadRepository.verifyThreadExists(addComment.threadId);
    return this._commentRepository.postComment(addComment);
  }
}

module.exports = AddCommentUseCase;
