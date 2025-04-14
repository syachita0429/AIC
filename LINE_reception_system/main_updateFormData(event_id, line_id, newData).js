// line_idを取得し，それに対応するフォームデータの編集用URLを取得する関数
// 「修正」メッセージに反応し，doPost(e)で呼び出される関数

function updateFormData(event_id, line_id) {
  try{
  // スプレッドシートのIDとシート名を指定
  const spreadsheetUrl = config.spread_sheet_url;
  const spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  const formResponsesSheet = spreadsheet.getSheetByName(event_id);
  const formDataArr = getFormData(event_id, line_id);

  // 1行目のデータを配列として取得
  const headerRow = formResponsesSheet.getRange(1, 1, 1, formResponsesSheet.getLastColumn()).getValues()[0];

  // "edit_url"を含む列のインデックスを検索
  const editUrlColumnIndex = headerRow.indexOf('edit_url');

  if (formDataArr) {
    let edit_urls = []; 
      for (let i = 0; i < formDataArr.length; i++) {
        const edit_url = formDataArr[i][editUrlColumnIndex];
        edit_urls.push(edit_url);
        Logger.log('Edit URL: ' + edit_urls);  // 編集用URLをログで確認
  }

  if (edit_urls) {
      const edit_url = edit_urls.at(-1);
      return edit_url;  // 編集用URLを返す
    } else {
      Logger.log('該当行には編集用URLがありません');
    }
  } 

  return null;

  } catch(error) {
    Logger.log('エラーが発生しました: ' + error.message);
    return null;
  }
}