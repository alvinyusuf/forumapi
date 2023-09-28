const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createThread(addThread) {
    // date opsional, karena di database sudah ada nilai defaultnya menggunakan timestamp
    const id = `thread-${this._idGenerator()}`;
    const { owner, title, body } = addThread;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, owner, title, body',
      values: [id, owner, title, body],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT
              threads.id, users.username, threads.title, threads.body, threads.date
              FROM threads JOIN users ON threads.owner = users.id WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread yang anda cari tidak ada');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
