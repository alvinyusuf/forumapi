const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createThread(addThread) {
    const id = `thread-${this._idGenerator()}`;
    const { owner, title, body } = addThread;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, owner, title, body',
      values: [id, owner, title, body, date],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT
              threads.id, users.username as owner, threads.title, threads.body, threads.date
              FROM threads JOIN users ON threads.owner = users.id WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread yang anda cari tidak ada');
    }

    return new DetailThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
