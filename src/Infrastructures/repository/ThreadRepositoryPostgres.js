const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createThread(addThread) {
    const id = `thread-${this._idGenerator()}`;
    const { owner, title, body } = addThread;
    // date opsional, karena di database sudah ada nilai defaultnya menggunakan timestamp
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, owner, title, body',
      values: [id, owner, title, body],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;
