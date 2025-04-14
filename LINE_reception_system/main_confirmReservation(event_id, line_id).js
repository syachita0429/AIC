function confirmReservation(event_ids, line_id) {
  // line_idから申し込み内容を取得し、LINEのメッセージに合わせたフォーマット(文字列型)で返す関数
  try{
  // スプレッドシートのURL
  const spreadsheetUrl = config.spread_sheet_url;
  
  // スプレッドシートを取得
  const spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);

  // フォームの回答シートを取得
  const formResponsesSheet = spreadsheet.getSheetByName(event_ids);
  // フォームのデータをスプレッドシートから全取得
  const values = formResponsesSheet.getDataRange().getValues();

  // スプレッドシートの1行目を取得
  const header = values.shift();

  // フォームのデータ(配列)を取得
  const formDataArr = getFormData(event_ids, line_id)
  const formData = formDataArr.at(-1);
 
  // ヘッダーとデータの対応付けを行い、オブジェクトを作成
  const messageContents = header.reduce((obj, key, index) => {
    obj[key] = formData[index];
    return obj;
  }, {});

  // フォーマットを生成 (文字列連結)
  let messageFormat = "申し込み内容はこちらです。"+ "\n" + "\n";
  for (const key in messageContents) {
    if (key !== 'edit_url' && key !== 'qr_url' && key !== 'attend') { 
      messageFormat += `${key}: ${messageContents[key]}` + "\n" + "\n";
    }
  }
  return messageFormat 

  } catch(error) {
    Logger.log('エラーが発生しました: ' + error.message);
    return null;
  }
}

// const event_ids = getEventColumns().event_id
// console.log(event_ids)
// // 各 event_id に対して confirmReservation を実行し、null でない結果のみを格納
// const confirmReservationArray = event_ids
//   .map(event_id => confirmReservation(event_id, "U553d4ef3bba56aa2983f9970fbcc5f18"))
//   .filter(confirmReservation => confirmReservation !== null)
//   .flat(); // 2次元配列を1次元配列に変換

// console.log("1次元配列の confirmReservationArray:", confirmReservationArray);