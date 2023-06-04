const DetailThread = require('../../Domains/threads/entities/DetailThread');

class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const result = await this._threadRepository.getThreadById(useCasePayload.threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload.threadId);
    const detailThread = new DetailThread(result);
    return {
      ...detailThread,
      comments,
    };
  }
}

module.exports = DetailThreadUseCase;
