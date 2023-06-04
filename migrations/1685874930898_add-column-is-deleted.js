exports.up = (pgm) => {
  pgm.addColumn('comments', {
    isDeleted: {
      type: 'boolean',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('comments', 'is_deleted');
};
