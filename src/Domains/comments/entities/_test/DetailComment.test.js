const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2023-06-04T05:19:40.105Z',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'user-123',
      date: '2023-06-04T05:19:40.105Z',
      content: {},
      isDeleted: false,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create detailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2023-06-04T05:19:40.105Z',
      content: 'This is Comment',
      isDeleted: false,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toStrictEqual(payload.id);
    expect(detailComment.username).toStrictEqual(payload.username);
    expect(detailComment.date).toStrictEqual(payload.date);
    expect(detailComment.content).toStrictEqual(payload.content);
    expect(detailComment.isDeleted).toStrictEqual(payload.isDeleted);
  });

  it('should create deleted detailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2023-06-04T05:19:40.105Z',
      content: 'This is Comment',
      isDeleted: true,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toStrictEqual(payload.id);
    expect(detailComment.username).toStrictEqual(payload.username);
    expect(detailComment.date).toStrictEqual(payload.date);
    expect(detailComment.content).toStrictEqual('**komentar telah dihapus**');
    expect(detailComment.isDeleted).toStrictEqual(payload.isDeleted);
  });
});
