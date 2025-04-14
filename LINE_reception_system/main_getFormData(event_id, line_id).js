// line_idに関連するフォームデータを取得する関数
function getFormData(event_id, line_id) {
  try{

  // スプレッドシートのURL
  const spreadsheetUrl = config.spread_sheet_url;

  // // スプレッドシートを取得
  const spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  
  // id_listシートを取得
  const idListSheet = spreadsheet.getSheetByName('id_list');
  if (!idListSheet) {
    Logger.log('シート「id_list」が見つかりません');
    return null;
  }

  // id_listシートからline_idとevent_idに対応するform_idを取得
  const dataRange = idListSheet.getDataRange();
  const values = dataRange.getValues();
  const formIds = values.filter(row => row[0] === line_id && row[2] === event_id).map(row => row[1]);
  // formIdが見つからなかった場合
  if (!formIds.length) {
    Logger.log('対応するform_idが見つかりません');
    return null;
  }

  // event_idに対応するシートを取得
  const formResponsesSheet = spreadsheet.getSheetByName(event_id);
  if (!formResponsesSheet) {
    Logger.log(`シート「${event_id}」が見つかりません`);
    return null;
  }

  // formResponsesSheetからformIdに対応する行を取得
  const formResponsesData = formResponsesSheet.getDataRange().getValues();
  const formIdColumnIndex = formResponsesSheet.getDataRange().getValues()[0].indexOf('Form_ID') + 1; // ヘッダー行を含むため、+1

  const foundRows = formResponsesData.filter(row => formIds.includes(row[formIdColumnIndex - 1]));
 
  return foundRows
  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.message);
    return null;
  }
};
// const event_ids = getEventColumns().event_id
// console.log(event_ids)
// // 各 event_id に対して getFormIds を実行し、null でない結果のみを格納
// const formDataArray = event_ids
//   .map(event_id => getFormData(event_id, "U553d4ef3bba56aa2983f9970fbcc5f18"))
//   .filter(formData => formData !== null)
//   .flat(); // 2次元配列を1次元配列に変換

// console.log("1次元配列の formDataArray:", formDataArray);