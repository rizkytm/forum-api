const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'Thread Title',
        body: 'This is Thread Body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.postThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'Thread Title',
        body: 'This is Thread Body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedThread = await threadRepositoryPostgres.postThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'Thread Title',
          owner: 'user-123',
        }),
      );
    });
  });

  // describe('getThreadById function', () => {
  //   it('should return detail thread correctly', async () => {
  //     // Arrange
  //     const fakeIdGenerator = () => '123'; // stub!
  //     const detailThread = {
  //       id: 'thread-123',
  //       title: 'Thread Title',
  //       body: 'This is Thread Body',
  //       date: '2023-06-04T05:19:40.105Z',
  //       username: 'user-123',
  //     };
  //     const addThread = new AddThread({
  //       title: detailThread.title,
  //       body: detailThread.body,
  //       owner: detailThread.username,
  //     });

  //     const threadRepositoryPostgres = new ThreadRepositoryPostgres(
  //       pool,
  //       fakeIdGenerator,
  //     );

  //     // Action
  //     console.log(addThread);
  //     await threadRepositoryPostgres.postThread(addThread);
  //     const thread = await threadRepositoryPostgres.getThreadById(
  //       detailThread.id,
  //     );

  //     // Assert
  //     expect(thread).toStrictEqual(new DetailThread(detailThread));
  //   });
  // });

  describe('getThreadById', () => {
    it('should throw InvariantError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-999'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return detail thread correctly', async () => {
      // Arrange
      const postThread = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'This is Thread Body',
        owner: 'user-123',
        createdAt: new Date().toISOString(),
      };
      const detailThread = {
        ...postThread,
        username: 'thread-user',
        date: postThread.createdAt,
      };
      await UsersTableTestHelper.addUser({ username: detailThread.username });
      await ThreadsTableTestHelper.postThread(postThread);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toStrictEqual(new DetailThread(detailThread));
    });
  });
});
