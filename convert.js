/**
 * 文字列をUTF-8エンコードしたバイト配列にする
 */
function stringToUtf8Bytes(str) {
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);

    // サロゲートペア対応(絵文字など)
    if (0xD800 <= c && c <= 0xDBFF && i + 1 < str.length) {
      var next = str.charCodeAt(++i);
      var codePoint = (c - 0xD800) * 0x400 + (next - 0xDC00) + 0x10000;
      bytes.push(
        0xF0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3F),
        0x80 | ((codePoint >> 6) & 0x3F),
        0x80 | (codePoint & 0x3F)
      );
    } else if (c < 0x80) {
      bytes.push(c);
    } else if (c < 0x800) {
      bytes.push(
        0xC0 | (c >> 6),
        0x80 | (c & 0x3F)
      );
    } else {
      bytes.push(
        0xE0 | (c >> 12),
        0x80 | ((c >> 6) & 0x3F),
        0x80 | (c & 0x3F)
      );
    }
  }
  return bytes;
}
