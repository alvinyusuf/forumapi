const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('harus membangkitkan error ketika invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action dan Assert
    await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.getThreadById()).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
