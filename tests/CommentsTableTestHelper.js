/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    owner = 'user-123',
    id_thread = 'thread-123',
    content = 'Ini adalah contoh comment',
    date = new Date().toISOString,
  }) {
    const query = {
      text: 'INSERT INTO comments(id, owner, id_thread, content, date) VALUES($1, $2, $3, $4, $5)',
      values: [id, owner, id_thread, content, date],
    };

    await pool.query(query);
  },

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getAllComment() {
    const query = {
      text: 'SELECT * FROM comments',
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
