const AddThread = require('../../Domains/threads/entities/AddThread');

class AddTheradUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  execute(payload) {
    const addThread = new AddThread(payload);
    return this._threadRepository.createThread(addThread);
  }
}

module.exports = AddTheradUseCase;
