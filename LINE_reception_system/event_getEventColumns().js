function getEventColumns() {
  try{
  // eventシートのデータを検索し、enable列がtrueになっているイベント情報をすべて取得して返す
  const sheet = SpreadsheetApp.openByUrl(config.spread_sheet_url).getSheetByName("event");
  const data = sheet.getDataRange().getValues();
  
  // ヘッダーのインデックスを取得して、列が移動しても対応できるようにする
  const headers = data[0];
  const enableIndex = headers.indexOf("enable");
  
  // 各列のデータを配列で格納するためのオブジェクト
  const columnData = {
    event_id: [],
    event_date: [],
    event_name: [],
    event_image: [],
    event_url: [],
    form_url: []
  };

  // enableがtrueの行を判定してデータを取得
  for (let i = 1; i < data.length; i++) {
    if (data[i][enableIndex] === true) { // enable列がtrueの行を判定
      columnData.event_id.push(data[i][headers.indexOf("event_id")]);

       // 日付データをフォーマット変換（例: YYYY-MM-DD）
        const rawDate = data[i][headers.indexOf("event_date")];
        const formattedDate = formatDate(rawDate);
        columnData.event_date.push(formattedDate);
      
      columnData.event_name.push(data[i][headers.indexOf("event_name")]);
      columnData.event_image.push(data[i][headers.indexOf("event_image")]);
      columnData.event_url.push(data[i][headers.indexOf("event_url")]);
      columnData.form_url.push(data[i][headers.indexOf("form_url")]);
    }
  }
  
  return columnData;  // 各列のデータをオブジェクトで返す

  }  catch (error) {
    Logger.log('getEventColumnsエラーが発生しました: ' + error.message);
    return null;
  }
}

// // 呼び出し例
// const columns = getEventColumns();
// console.log("Event IDs:", columns.event_id);
// console.log("Event Dates:", columns.event_date);
// console.log("Event Names:", columns["event_name"]);
// console.log("Form URLs:", columns.form_url);
