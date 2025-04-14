function sendFlexMessage(reply_token, flexContent) {
  // LINE APIのアクセストークンを設定
  AIC.ACCESS_TOKEN = accesstoken();
  // 高山LINEテストアカウント
  try {
    return AIC.reply_send_flex(reply_token, flexContent)
  } catch(error) {
    Logger.log('エラーが発生しました: ' + error.message);
    const msg = "申し訳ありません。エラーが発生しました。時間を置いてからやり直してください。"
    return AIC.reply_send(msg, reply_token);
  }
}