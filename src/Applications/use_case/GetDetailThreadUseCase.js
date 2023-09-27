class GetDetailThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    const detailThread = await this._threadRepository.getThreadById(threadId);
    return detailThread;
  }
}

module.exports = GetDetailThreadUseCase;
