const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('harus orchestrating fitur get detail thread dengan benar', async () => {
    // Arrange
    const threadId = 'thread-123';

    const payload = {
      title: 'Ini contoh title',
      body: 'Ini contoh body',
      date: new Date().toISOString(),
    };

    const mockDetailThread = new DetailThread({
      id: threadId,
      title: payload.title,
      owner: 'user-123',
      body: payload.body,
      date: payload.date,
      comments: [],
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toStrictEqual(new DetailThread({
      id: threadId,
      title: payload.title,
      owner: 'user-123',
      body: payload.body,
      date: payload.date,
      comments: [],
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
  });
});
