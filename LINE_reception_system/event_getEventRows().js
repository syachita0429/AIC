function getEventRows() {
  try {
    // eventシートのデータを検索し、enable列がtrueになっているイベント情報をすべて取得して返す。返り値は、各イベントを表すオブジェクトの配列。
    const sheet = SpreadsheetApp.openByUrl(config.spread_sheet_url).getSheetByName("event");
    const data = sheet.getDataRange().getValues();
    
    // ヘッダーのインデックスを取得して、列が移動しても対応できるようにする
    const headers = data[0];
    const enableIndex = headers.indexOf("enable");
    const eventData = [];

    // ヘッダー行を除いた各行をループ
    for (let i = 1; i < data.length; i++) {
      if (data[i][enableIndex] === true) {  // enable列がtrueの行を判定
        const rawDate = data[i][headers.indexOf("event_date")];
        const formattedDate = formatDate(rawDate); // 日付をフォーマット

        const rowObj = {
          event_id: data[i][headers.indexOf("event_id")],
          event_date: formattedDate, // フォーマット済みの日付を格納
          event_name: data[i][headers.indexOf("event_name")],
          event_image: data[i][headers.indexOf("event_image")],
          event_url: data[i][headers.indexOf("event_url")],
          form_url: data[i][headers.indexOf("form_url")],
        };
        eventData.push(rowObj); // 条件に合う行のデータをeventDataに追加
      }
    }
    
    return eventData; // enableがtrueの行のデータをすべて返す

  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.message);
    return null;
  }
}

// const eventRows = getEventRows(); 
// console.log("getEventContentsテスト:" + eventRows[1]["event_date"]);
// console.log("getEventContents数テスト:" + getEventRows().length)