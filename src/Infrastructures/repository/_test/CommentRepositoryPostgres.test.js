const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyThreadExists function', () => {
    it('should not throw NotFoundError when thread is available', async () => {
      // Arrange
      await ThreadsTableTestHelper.postThread({ id: 'thread-234' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyThreadExists('thread-234')).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when thread is not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyThreadExists('thread-234')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentExists function', () => {
    it('should not throw NotFoundError when comment is available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1122', username: 'user1122' });
      await ThreadsTableTestHelper.postThread({ id: 'thread-1122', owner: 'user-1122' });
      await CommentsTableTestHelper.postComment({ id: 'comment-1122', threadId: 'thread-1122', owner: 'user-1122' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-1122')).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment is not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-234')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should not throw AuthorizationError when owner is valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-2341', username: 'user2341' });
      await ThreadsTableTestHelper.postThread({ id: 'thread-2341', owner: 'user-2341' });
      await CommentsTableTestHelper.postComment({ id: 'comment-2341', threadId: 'thread-2341', owner: 'user-2341' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-2341', 'user-2341')).resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw AuthorizationError when owner is invalid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-3241', username: 'user3241' });
      await UsersTableTestHelper.addUser({ id: 'user-2233', username: 'user2233' });
      await ThreadsTableTestHelper.postThread({ id: 'thread-3241', owner: 'user-3241' });
      await CommentsTableTestHelper.postComment({ id: 'comment-3241', threadId: 'thread-3241', owner: 'user-3241' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-3241', 'user-2233')).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('AddComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-213' });
      await ThreadsTableTestHelper.postThread({ id: 'thread-213' });
      const addComment = new AddComment({
        threadId: 'thread-213',
        content: 'This is Comment',
        owner: 'user-213',
      });
      const fakeIdGenerator = () => '213'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.postComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-213');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321' });
      await ThreadsTableTestHelper.postThread({ id: 'thread-321' });
      const addComment = new AddComment({
        threadId: 'thread-321',
        content: 'This is Comment',
        owner: 'user-321',
      });
      const fakeIdGenerator = () => '321'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.postComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-321',
          content: 'This is Comment',
          owner: 'user-321',
        }),
      );
    });
  });

  describe('DeleteComment function', () => {
    it('should persist add comment and delete comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-213' });
      await ThreadsTableTestHelper.postThread({ id: 'thread-213' });
      const addComment = new AddComment({
        threadId: 'thread-213',
        content: 'This is Comment',
        owner: 'user-213',
      });
      const fakeIdGenerator = () => '213'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.postComment(addComment);

      // Assert
      await commentRepositoryPostgres.deleteComment('comment-213', 'user-213');
      const comments = await CommentsTableTestHelper.findCommentById('comment-213');
      expect(comments).toHaveLength(0);
    });
  });
});
