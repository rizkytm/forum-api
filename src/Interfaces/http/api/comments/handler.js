const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const cddCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name,
    );
    const { content } = request.payload;
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const postCommentPayload = {
      threadId,
      content,
      owner,
    };
    const addedComment = await cddCommentUseCase.execute(postCommentPayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;
