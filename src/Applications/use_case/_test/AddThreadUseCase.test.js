const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddTheradUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('harus orchestrating fitur add thread dengan benar', async () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      title: 'Ini contoh title',
      body: 'Ini contoh body',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      owner: payload.owner,
      title: payload.title,
      body: payload.body,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddTheradUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(payload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      owner: payload.owner,
      title: payload.title,
      body: payload.body,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      owner: payload.owner,
      title: payload.title,
      body: payload.body,
    }));
  });
});
