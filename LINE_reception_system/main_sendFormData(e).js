function sendFormData(e) {
  try {
    // LINE APIのアクセストークンを設定
    AIC.ACCESS_TOKEN = accesstoken();

    // フォームの回答データを取得
    const form_id = e.namedValues['Form_ID'][0];
    const line_id = getLineId(form_id);

    // フォームの回答シートを取得
    const formResponseSheet = SpreadsheetApp.getActiveSheet();
    const values = formResponseSheet.getDataRange().getValues();
    const header = values.shift();

    // 回答データをメッセージに変換
    const questionKeys = header.slice(0, e.values.length);
    const message = e.values.map((answer, index) => {
      const question = questionKeys[index] || '未回答';
      return `${question}: ${answer}`;
    }).join('\n\n');
    

    // イベント情報を取得
    const event_id = parseInt(formResponseSheet.getName(), 10); // 10進数として整数型に変換
    const eventRows = getEventRows();
    const event_name = eventRows.filter(event => event.event_id === event_id).map(event => event.event_name)[0];
    const event_date = eventRows.filter(event => event.event_id === event_id).map(event => event.event_date)[0];

    // 確認メッセージを作成
    const flex_message = createConfirmationMessage(event_name, event_date, message);
    

    // LINE APIにプッシュメッセージを送信
    if (!line_id || !flex_message) {
      throw new Error('line_idまたはflex_messageが無効です');
    }
    return AIC.pushMessage_send_flex(line_id, flex_message);

  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.message);
    return null;
  }
}
