const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
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

  async deleteCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteCommentPayload = {
      threadId,
      commentId,
      owner,
    };
    await deleteCommentUseCase.execute(deleteCommentPayload);
    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
