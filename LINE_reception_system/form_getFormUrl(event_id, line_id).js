function getFormUrl(event_id, line_id) {
  try {
    // スプレッドシートのURLを取得
    const spreadsheetUrl = config.spread_sheet_url;

    // スプレッドシートを取得
    const spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
    if (!spreadsheet) {
      Logger.log('スプレッドシートが見つかりません: ' + spreadsheetUrl);
      return null;
    }

    // form_idを生成
    const form_id = Utilities.getUuid();

    // id_listシートにデータを書き込み
    const idListSheet = spreadsheet.getSheetByName('id_list');
    if (!idListSheet) {
      Logger.log('id_listシートが見つかりません');
      return null;
    }
    idListSheet.appendRow([line_id, form_id, event_id]);

    // eventシートからform_urlを取得
    const eventSheet = spreadsheet.getSheetByName('event');
    if (!eventSheet) {
      Logger.log('eventシートが見つかりません');
      return null;
    }

    const dataRange = eventSheet.getDataRange();
    const values = dataRange.getValues();
    Logger.log('eventシートのデータ: ' + JSON.stringify(values));

    let form_url;
    for (let i = 1; i < values.length; i++) { // 1行目はヘッダーのためスキップ
      if (values[i][0] === event_id) { // 型をそのまま比較
        form_url = values[i][5]; // form_urlは6列目
        break;
      }
    }

    // form_urlが見つからなかった場合
    if (!form_url) {
      Logger.log('event_idに対応するform_urlが見つかりません');
      return null;
    }

    // createPrefilledFormUrl 関数を使って、初期値を設定したURLを取得
    const prefilledUrl = createPrefilledFormUrl(form_url, form_id);

    return prefilledUrl;

  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.message);
    return null;
  }
}

// // テスト呼び出し
// Logger.log("getFormUrlテスト: " + getFormUrl(1, "U553d4ef3bba56aa2983f9970fbcc5f18"));
