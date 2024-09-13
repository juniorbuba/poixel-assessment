const pattern = new RegExp('index: (?:\\w+_?.?)_(?:\\d+) dup key: { (\\w+_?.?): \\"(.*)\\" }', 'i');

export const duplicateKeyError = (error, doc, next): void => {
  if (error === undefined) {
    next();
  } else if (error.name === 'MongoError' && error.code === 11000) {
    const match = pattern.exec(error.message);
    if (match !== null) {
      next(new Error(`${match[1]} ${match[2]} already exists`));
    } else {
      next(new Error('a duplicate entry exists'));
    }
  } else {
    next(new Error(error.message));
  }
};
