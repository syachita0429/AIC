// line_idを取得し，該当ユーザーのフォームデータをarchive_listに移動する関数
// 「削除」メッセージに反応し，doPostで呼び出される関数

function clearFormData(event_id, line_id) {
  try {
  // スプレッドシートのURL
  const spreadsheetUrl = config.spread_sheet_url;
  
  // スプレッドシートを取得
  const spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);

  // フォームの回答のシートを取得
    const formResponsesSheet = spreadsheet.getSheetByName(event_id);
  
  // アーカイブ用シートを取得または作成
  let archiveSheet = spreadsheet.getSheetByName('archive_list');
  if (!archiveSheet) {
    // archive_listシートがない場合は新しく作成
    archiveSheet = spreadsheet.insertSheet('archive_list');
  }
  
  // フォームの回答シートのデータ範囲を取得
  const formResponsesData = formResponsesSheet.getDataRange().getValues();
  const formIdColumnIndexInResponses = formResponsesData[0].indexOf('Form_ID');

  const form_idArr = getFormIds(event_id, line_id);

  const form_id = form_idArr[0];
  console.log("form_id:" + form_id);
  // form_idに対応する行を探す
  const foundRowIndex = formResponsesData.findIndex(row => row[formIdColumnIndexInResponses] === form_id);

  // archiveするデータ
  let archiveData = formResponsesData[foundRowIndex]

  // event_nameを取得
  const eventRows = getEventRows();
  const event_name = eventRows.filter(event => event.event_id === event_id).map(event => event.event_name)[0];

  archiveData.unshift(event_name);

  if (foundRowIndex !== -1) {
    // 行をアーカイブシートに追加
    archiveSheet.appendRow(archiveData);
    
    // 元の行を削除
    formResponsesSheet.deleteRow(foundRowIndex + 1); // シートは1ベースのため+1

  // フォームの回答のデータをスプレッドシートから全取得
  const values = formResponsesSheet.getDataRange().getValues();

  // フォームの回答のスプレッドシートの1行目を取得
  const header = values.shift();

  // 削除するフォームのデータ(配列)を取得
  const formData = formResponsesData[foundRowIndex];

  // ヘッダーとデータの対応付けを行い、オブジェクトを作成
  const messageContents = header.reduce((obj, key, index) => {
    obj[key] = formData[index];
    return obj;
  }, {});

  // フォーマットを生成 (文字列連結)
  let messageFormat = "キャンセルした情報はこちらです。"+ "\n" + "\n";
  for (const key in messageContents) {
    if (key !== 'edit_url' && key !== 'qr_url' && key !== 'attend') { // edit_url, qr_url, attend は除外
      messageFormat += `${key}: ${messageContents[key]}` + "\n" + "\n";
    }
  }

    Logger.log('削除完了');
    return { success: true, message: messageFormat };
  } else {
    Logger.log('対応するデータが見つかりませんでした。');
    return { success: false, message: '対応するデータが見つかりませんでした。申し訳ございませんが、キャンセルに失敗しました。' };
  }

  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.message);
    return null;
  }
}