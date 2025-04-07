function testRoundTrip() {
  var originalString = "?data=?form_id=7aeb12ea-28fa-4aec-a4bf-7211e75f610e&affiliation=慶應義塾大学&grade=2年&name=谷地田 桜子";

  // ---- 圧縮 (バイナリ) ----
  var compressedBinary = runLengthEncodeBitwise2BitNoValue(originalString);

  // ---- Base64 にしてログ表示 (QRコード化したいならここを使う) ----
  var base64Str = Utilities.base64Encode(compressedBinary);
  Logger.log("Base64 => " + base64Str);

  // ---- 復号 (バイナリ⇒文字列) ----
  var decodedString = runLengthDecodeBitwise2BitNoValue(compressedBinary);

  // ---- ログに比較結果 ----
  Logger.log("originalString: " + originalString);
  Logger.log("decodedString:  " + decodedString);
  Logger.log("Is same? => " + (originalString === decodedString));
}
