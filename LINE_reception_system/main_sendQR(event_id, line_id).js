function sendQR(event_id, line_id) {
  // スプレッドシートからevent_idとline_idに対応するデータのqrCodeUrlを取得し、createQRMessageを呼び出してQRコードflexmessageで表示する関数
  try {
  // LINE APIのアクセストークンを設定
  AIC.ACCESS_TOKEN = accesstoken();
  // 高山LINEテストアカウント

  // form_idを取得
  const form_idArr = getFormIds(event_id, line_id)
  const form_id = form_idArr[0];
  // スプレッドシートのURL
  const spreadsheetUrl = config.spread_sheet_url;

  // スプレッドシートを開く
  const spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  const sheet = spreadsheet.getSheetByName(event_id);

  // データ範囲を取得
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  // ヘッダー行のインデックスを取得
  const headerRow = values[0];
  const formIdColumnIndex = headerRow.indexOf('Form_ID') + 1; // 1を足すのは、配列のインデックスが0から始まるため
  const qrUrlColumnIndex = headerRow.indexOf('qr_url') + 1;
  // 氏名に関連する列を動的に特定
  const nameColumIndex = headerRow.findIndex(header => header.includes('氏名')) + 1;

  // formIdに対応する行を探す
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[formIdColumnIndex - 1] === form_id) {
      const qrCodeUrl = row[qrUrlColumnIndex - 1];
      console.log(qrCodeUrl);
      const name = row[nameColumIndex - 1];
      console.log(name);

  // flexmessageを準備
  const QRFlexMessage = createQRMessage(name, qrCodeUrl);
  return QRFlexMessage;
    }
  }


  } catch(error) {
    Logger.log('エラーが発生しました: ' + error.message);
    return null;
  }
} 