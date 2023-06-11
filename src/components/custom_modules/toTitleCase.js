exports.toTitleCase = (str) => {
  str = str.split("_").join(" ");
  return str.toLowerCase().replace(/(^|\s)\S/g, function (char) {
    return char.toUpperCase();
  });
};
