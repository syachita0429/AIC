function getEventIdsByLineId(line_id) {
  // スプレッドシートを開く
  let spreadsheet = SpreadsheetApp.openByUrl(config.spread_sheet_url); // スプレッドシートのURLを指定
  let sheet = spreadsheet.getSheetByName("id_list"); // シート名を指定
  
  // id_listシートのデータを取得
  let data = sheet.getDataRange().getValues();
  
  // line_id列とevent_id列のインデックスを指定
  let lineIdIndex = 0; // line_idがある列のインデックス（0始まり）
  let eventIdIndex = 2; // event_idがある列のインデックス
  
  // line_idに対応するevent_idを収集
  let eventIds = new Set(); // 重複を防ぐためにSetを使用
  for (let i = 1; i < data.length; i++) { // 1行目はヘッダーなのでスキップ
    if (data[i][lineIdIndex] === line_id) {
      eventIds.add(String(data[i][eventIdIndex])); // 数値を文字列に変換してSetに追加
    }
  }
  
  // 戻り値としてevent_id配列を返す（Setを配列に変換）
  return Array.from(eventIds);
}

// let result = getEventIdsByLineId("U0d8928ef44d01f67b6b03aea15bb248e");
// Logger.log(result); // [1] （重複なし）