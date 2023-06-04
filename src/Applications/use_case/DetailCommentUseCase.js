const DetailComment = require('../../Domains/comments/entities/DetailComment');

class DetailCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const result = await this._commentRepository.getCommentsByThreadId(useCasePayload.threadId);
    // console.log(result);
    // const detailComment = new DetailComment(result);
    return result;
  }
}

module.exports = DetailCommentUseCase;
