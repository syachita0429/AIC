function sendFormSubmit(e) {
  try {
  ////sendFormSubmit関数
  //フォーム送信時に申し込みを受け付けた旨を返す関数
  //sendFormSubmit関数
  //フォーム送信時に申し込みを受け付けた旨を返す関数
  // LINE APIのアクセストークンを設定
  AIC.ACCESS_TOKEN = accesstoken();
  // 高山LINEテストアカウント

  // フォームの回答からform_idを取得
  const form_id = e.namedValues["Form_ID"][0];

  //form_idからline_idを取得
  const line_id = getLineId(form_id)
  
  // 取得したline_idにAICライブラリのpushMessage_send関数を実行
  if (line_id) {
    return AIC.pushMessage_send(line_id, "申し込みを受付けました。");
  } else {
    // line_idが見つからなかった場合の処理
    console.error('line_idが見つかりませんでした。');
    return;
  }

  } catch(error) {
    Logger.log('エラーが発生しました: ' + error.message);
    return null;
  }
}