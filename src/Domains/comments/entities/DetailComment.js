class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, date, username, content, isDeleted,
    } = payload;

    this.id = id;
    this.date = date;
    this.username = username;
    this.content = (isDeleted) ? '**komentar telah dihapus**' : content;
    this.isDeleted = isDeleted;
  }

  _verifyPayload({
    id, date, username, content, isDeleted,
  }) {
    if (!id || !content || !date || !username || typeof isDeleted === 'undefined') {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || typeof isDeleted !== 'boolean'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
