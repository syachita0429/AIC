/**
 * runLengthEncodeBitwise2BitNoValue() の結果 (Uint8Array) を
 * ビット列に展開して元の文字列に戻す。
 */
function runLengthDecodeBitwise2BitNoValue(compressedBinary) {
  // バイナリから 2ビット単位のカウント値を取り出す
  var runs = [];
  for (var i = 0; i < compressedBinary.length; i++) {
    var byteVal = compressedBinary[i] & 0xFF; // JSでは符号付きになることがあるので一応マスク
    // 1バイト (8ビット) から4回(2ビット×4)読み出す
    for (var shift = 6; shift >= 0; shift -= 2) {
      var runCount = (byteVal >> shift) & 0b11; // 0〜3
      if (runCount === 0) {
        // 0 はパディングとみなす(余りビット)
        break;
      }
      runs.push(runCount);
    }
  }

  // ランレングス値をビット列へ展開
  // ※ エンコードで「先頭は 0 ビットにそろえる」設計なので、decode 側も firstBit = '0' で進める
  var bitString = "";
  var currentBit = '0';
  for (var j = 0; j < runs.length; j++) {
    var count = runs[j];
    for (var k = 0; k < count; k++) {
      bitString += currentBit;
    }
    // ビットを反転
    currentBit = (currentBit === '0') ? '1' : '0';
  }

  // 8ビット単位で区切ってバイト配列に
  var byteArray = [];
  for (var idx = 0; idx + 8 <= bitString.length; idx += 8) {
    var byteStr = bitString.substring(idx, idx + 8);
    byteArray.push(parseInt(byteStr, 2));
  }

  // バイト配列 => UTF-8文字列
  var originalStr = Utilities.newBlob(byteArray, "application/octet-stream")
    .getDataAsString("UTF-8");
  return originalStr;
}
