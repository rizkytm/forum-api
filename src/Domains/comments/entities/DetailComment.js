class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, date, username, content,
    } = payload;

    this.id = id;
    this.date = date;
    this.username = username;
    this.content = content;
  }

  _verifyPayload({
    id, date, username, content,
  }) {
    if (!id || !content || !date || !username) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
