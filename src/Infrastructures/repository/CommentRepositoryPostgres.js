const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createComment(addComment) {
    const id = `comment-${this._idGenerator()}`;
    const { owner, id_thread, content } = addComment;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments(id, owner, id_thread, content, date) VALUES($1, $2, $3, $4, $5) RETURNING id, owner, id_thread, content',
      values: [id, owner, id_thread, content, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('gak komen mu ini');
    }

    return result.rows[0].id;
  }

  async getDetailComment(id, id_thread) {
    const query = {
      text: 'SELECT * FROM comments WHERE id_thread = $1 AND id = $2',
      values: [id_thread, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment ga ada');
    }
  }

  async deleteComment({ id, owner, id_thread }) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 AND owner = $2 AND id_thread = $3',
      values: [id, owner, id_thread],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('ada yang salah sama querynya');
    }
  }

  async getCommentsByThreadId(id_thread) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date,
        comments.content, comments.is_delete FROM comments
        INNER JOIN users ON comments.owner = users.id
        WHERE id_thread = $1`,
      values: [id_thread],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
