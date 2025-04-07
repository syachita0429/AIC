/**
 * Uint8Array を 2進数の文字列に変換
 */
function uint8ArrayToBinaryString(uint8Array) {
  return Array.from(uint8Array, byte => byte.toString(2).padStart(8, '0')).join('');
}

/**
 * 文字列 → UTF-8バイト配列
 */
function stringToUtf8Bytes(str) {
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
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

/**
 * UTF-8バイト配列 → 文字列
 */
function utf8BytesToString(bytes) {
  var result = [];
  var i = 0;
  while (i < bytes.length) {
    var byte1 = bytes[i++];
    if (byte1 < 0x80) {
      result.push(String.fromCharCode(byte1));
    } else if (byte1 < 0xE0) {
      var byte2 = bytes[i++];
      var code = ((byte1 & 0x1F) << 6) | (byte2 & 0x3F);
      result.push(String.fromCharCode(code));
    } else if (byte1 < 0xF0) {
      var byte2 = bytes[i++];
      var byte3 = bytes[i++];
      var code = ((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F);
      result.push(String.fromCharCode(code));
    } else {
      var byte2 = bytes[i++];
      var byte3 = bytes[i++];
      var byte4 = bytes[i++];
      var codePoint = ((byte1 & 0x07) << 18) | ((byte2 & 0x3F) << 12)
                    | ((byte3 & 0x3F) << 6) | (byte4 & 0x3F);
      codePoint -= 0x10000;
      result.push(
        String.fromCharCode(0xD800 + (codePoint >> 10)),
        String.fromCharCode(0xDC00 + (codePoint & 0x3FF))
      );
    }
  }
  return result.join("");
}

/**
 * ランレングスエンコーディング
 */
function runLengthEncodeBitwiseNBitNoValue(str, n) {
  var binaryData = stringToUtf8Bytes(str);
  var bitString = "";
  for (var i = 0; i < binaryData.length; i++) {
    bitString += binaryData[i].toString(2).padStart(8, "0");
  }

  let compressed = [];
  let count = 1;
  let buffer = 0;
  let bufferSize = 0;
  const maxCount = (1 << n) - 1;

  if (bitString[0] === "1") {
    bufferSize += n;
  }

  for (let i = 1; i < bitString.length; i++) {
    if (bitString[i] === bitString[i - 1] && count < maxCount) {
      count++;
    } else {
      buffer = (buffer << n) | count;
      bufferSize += n;
      if (bufferSize >= 8) {
        compressed.push(buffer >> (bufferSize - 8));
        bufferSize -= 8;
        buffer &= (1 << bufferSize) - 1;
      }
      count = 1;
    }
  }

  buffer = (buffer << n) | count;
  bufferSize += n;
  if (bufferSize > 0) {
    compressed.push(buffer << (8 - bufferSize));
  }
  return new Uint8Array(compressed);
}

/**
 * ランレングスデコード
 */
function runLengthDecodeBitwiseNBitNoValue(compressedData, n) {
  let bitString = uint8ArrayToBinaryString(compressedData);
  let decodedBitString = "";
  let buffer = 0;
  let bufferSize = 0;
  let i = 0;
  let isZero = true;

  while (i < bitString.length) {
    buffer = (buffer << 1) | parseInt(bitString[i], 2);
    bufferSize++;
    i++;

    if (bufferSize === n) {
      const count = buffer & ((1 << n) - 1);
      bufferSize = 0;
      buffer = 0;

      const lastBit = isZero ? "0" : "1";
      decodedBitString += lastBit.repeat(count);
      isZero ^= 1;
    }
  }

  const byteArray = [];
  for (let i = 0; i < decodedBitString.length; i += 8) {
    const byte = decodedBitString.slice(i, i + 8);
    byteArray.push(parseInt(byte, 2));
  }

  return utf8BytesToString(byteArray);
}

/**
 * テスト関数
 */
function testRunLengthEncoding() {
  const inputString = "?data=?form_id=7aeb12ea-28fa-4aec-a4bf-7211e75f610e&affiliation=慶應義塾大学&grade=2年&name=谷地田 桜子";
  const compressedBinary = runLengthEncodeBitwiseNBitNoValue(inputString, 3);
  
  Logger.log("Compressed Binary: " + compressedBinary);

  const decompressedString = runLengthDecodeBitwiseNBitNoValue(compressedBinary, 3);

  Logger.log("Decompressed String: " + decompressedString);
  Logger.log("Is same? => " + (inputString === decompressedString));
}

/**
 * Base64エンコード (Google Apps Script 版)
 */
function base64Encode(byteArray) {
  return Utilities.base64Encode(byteArray);
}

/**
 * QRコードURLを生成する
 */
function createQrCodeUrl(binaryData) {
  // 1. バイナリデータ (Uint8Array) → Base64エンコード
  var base64Str = base64Encode(binaryData);

  // 2. URLエンコード
  var encodedBase64 = encodeURIComponent(base64Str);

  // 3. QRコードAPIのURLにセット
  var qrUrl = "https://api.qrserver.com/v1/create-qr-code/?data=" + encodedBase64;

  return qrUrl;
}

/**
 * テスト用：QRコードURLを生成
 */
function testQrCode() {
  // 1. 文字列を圧縮（バイナリ化）
  var inputString = "?data=?form_id=7aeb12ea-28fa-4aec-a4bf-7211e75f610e"
    + "&affiliation=慶應義塾大学&grade=2年&name=谷地田 桜子";
  var compressedBinary = runLengthEncodeBitwiseNBitNoValue(inputString, 3);

  // 2. QRコードURLを生成
  var qrUrl = createQrCodeUrl(compressedBinary);

  // 3. ログに出力 (URLをブラウザで開くとQRコード表示)
  Logger.log("QR Code URL: " + qrUrl);
}

/**
 * Base64デコード
 */
function base64Decode(base64Str) {
  return new Uint8Array(Utilities.base64Decode(base64Str));
}

/**
 * QRコードから取得したBase64を復号
 */
function decodeQrCodeData(base64Str) {
  // 1. Base64デコード → バイナリデータ (Uint8Array)
  var binaryData = base64Decode(base64Str);

  // 2. ランレングス復号
  var originalString = runLengthDecodeBitwiseNBitNoValue(binaryData, 3);

  return originalString;
}

/**
 * テスト用: QRコードから取得したBase64を復号
 */
function testDecodeQrCode() {
  // **ここにQRコードをスキャンして得たBase64文字列をセット**
  var scannedBase64 = "WKRahLJahUJWKSSMLRSKJJNKJRKRkJSLKhKRJKZaZSRSRJKhRKJSRbiSShRKJSJahKRJKaRKJKhSJaZSSZKJSLSRaZSZKRJSLSJJKSaKaZSqRJRSShKSSSSJRKKaJRKhLJaJRKMKLcMSJhKKKLSJkZUUNJJJURKJiNLRKJRRJWRKJKKJSZSSTLRShKRaRJUJSRLRKLSKJhSSLShKKJKRJUMJZKhKORKTRKjURJRKxrSJJiTTRKJKKRg%3D"; 

  // 1. Base64デコード → バイナリ
  var binaryData = base64Decode(scannedBase64);
  Logger.log("BinaryData: " + binaryData);
  
  // 2. ランレングス復号
  var originalString = runLengthDecodeBitwiseNBitNoValue(binaryData, 3);

  // 3. ログに出力
  Logger.log("Decoded String: " + originalString);
}

