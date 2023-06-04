const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');
const DetailCommentUseCase = require('../DetailCommentUseCase');

describe('DetailCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the detail comment action correctly', async () => {
    // Arrange
    const fakeIdGenerator = () => '123'; // stub!
    const useCasePayload = {
      threadId: `thread-${fakeIdGenerator}`,
    };

    const mockDetailCommentArray = [];
    const mockDetailComment = new DetailComment({
      id: 'comment-123',
      content: 'This is Comment',
      date: '2023-06-04T05:19:40.105Z',
      username: 'user-123',
    });
    mockDetailCommentArray.push(mockDetailComment);
    mockDetailCommentArray.push(mockDetailComment);

    /** creating dependency of use case */
    // const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDetailCommentArray));

    /** creating use case instance */
    const getCommentUseCase = new DetailCommentUseCase({
      // threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(detailComment).toEqual(
      expect.arrayContaining([
        expect.objectContaining(
          new DetailComment({
            id: mockDetailComment.id,
            username: mockDetailComment.username,
            date: mockDetailComment.date,
            content: mockDetailComment.content,
          }),
        ),
      ]),
    );

    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId,
    );
  });
});
