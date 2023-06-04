const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the detail thread action correctly', async () => {
    // Arrange
    const fakeIdGenerator = () => '123'; // stub!
    const useCasePayload = {
      threadId: `thread-${fakeIdGenerator}`,
    };

    const mockDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'This is Thread Body',
      date: '2023-06-04T05:19:40.105Z',
      username: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    /** creating use case instance */
    const getThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    // expect(detailThread).toEqual(
    //   new DetailThread({
    //     id: 'thread-123',
    //     title: mockDetailThread.title,
    //     body: mockDetailThread.body,
    //     date: mockDetailThread.date,
    //     username: mockDetailThread.username,
    //   }),
    // );

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
  });
});
