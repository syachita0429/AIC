function getFormIds(event_id, line_id) {
  // 引数のevent_id, line_idに対応するform_idを配列で返す関数
  try {
  // スプレッドシートのURL
  const spreadsheetUrl = config.spread_sheet_url;
  
  // スプレッドシートを取得
  const spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  const sheetName = event_id
  // フォームの回答のシートを取得
  const formResponsesSheet = spreadsheet.getSheetByName(sheetName);
  
  // フォームの回答シートのデータ範囲を取得
  const formResponsesData = formResponsesSheet.getDataRange().getValues();

  const formIdColumnIndexInResponses = formResponsesData[0].indexOf('Form_ID');

  if (formIdColumnIndexInResponses === -1) {
    Logger.log('「Form_ID」列が見つかりません');
    return { success: false, message: 'データが見つかりませんでした。' };
  }

  const formDataArr = getFormData(event_id, line_id);
  
  let form_idArr = [];
  for (let i = 0; i < formDataArr.length; i++) {
    form_idArr.push(formDataArr[i][formIdColumnIndexInResponses]);
  }

  return form_idArr; // form_ids配列を返す

  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.message);
    return null;
  }
}
// const event_ids = getEventColumns().event_id
// console.log(event_ids)
// // 各 event_id に対して getFormIds を実行し、null でない結果のみを格納
// const formIdsArray = event_ids
//   .map(event_id => getFormIds(event_id, "U553d4ef3bba56aa2983f9970fbcc5f18"))
//   .filter(formIds => formIds !== null)
//   .flat(); // 2次元配列を1次元配列に変換

// console.log("1次元配列の formIdsArray:", formIdsArray);