const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
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
    it('should not throw InvariantError when thread is available', async () => {
      // Arrange
      await ThreadsTableTestHelper.postThread({ id: 'thread-234' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyThreadExists('thread-234')).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw InvariantError when thread is not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyThreadExists('thread-234')).rejects.toThrowError(NotFoundError);
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
});
