module.exports.notEmpty = (...args) => {
  if (!args) {
    throw new Error(`IllegalArgumentException`);
  }
  args.forEach(arg => {
    if (!arg) {
      throw new Error(`IllegalArgumentException`);
    }
  });
};
