class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, credentialId } = payload;

    this.title = title;
    this.body = body;
    this.credentialId = credentialId;
  }

  _verifyPayload({ title, body }) {
    if (!title || !body) {
      throw new Error('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof title !== 'string'
      || typeof body !== 'string'
    ) {
      throw new Error('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
