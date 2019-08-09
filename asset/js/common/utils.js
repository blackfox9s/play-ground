var utils = {
  numPad : function(n, width) {
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
  }
};
