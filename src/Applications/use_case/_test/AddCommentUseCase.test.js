const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const fakeIdGenerator = () => '123'; // stub!
    const useCasePayload = {
      threadId: `thread-${fakeIdGenerator}`,
      content: 'This is Comment',
      owner: `user-${fakeIdGenerator}`,
    };

    const mockAddedComment = new AddedComment({
      id: 'thread-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.postComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockCommentRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'thread-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    expect(mockCommentRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.postComment).toBeCalledWith(new AddComment({
      threadId: useCasePayload.threadId,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
  });
});
