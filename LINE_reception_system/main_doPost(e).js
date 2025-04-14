function doPost(e) {
  try {
    // ログ管理: リクエストデータを記録
    logToProperties('LastRequest', e);

    // LINE APIのアクセストークンを設定
    AIC.ACCESS_TOKEN = accesstoken();

    // POSTデータをパース
    const postData = JSON.parse(e.postData.contents);
    const events = postData.events;

    let responseEventId = null; // レスポンスとして返すevent_idを記録

    // イベントごとに処理を行う
    events.forEach((event, index) => {
      logToProperties(`Event${index + 1}`, event); // 各イベントをプロパティに記録

      try {
        const eventType = event.type;
        const replyToken = event.replyToken;
        const line_id = event.source.userId;

        // イベント処理の条件分岐
        switch (eventType) {
          case "message":
            const messageText = event.message.text;

            // メッセージ内容に応じた処理
            switch (true) {
              case messageText === "申し込みたい":
                {
                  const columns = getEventColumns();
                  const eventCarousel = createEventCarousel(
                    columns.event_name,
                    columns.event_date,
                    columns.event_image,
                    columns.event_url,
                    "申し込みへすすむ",
                    "申し込みへすすむ"
                  );
                  logToProperties(`GeneratedEventCarousel${index + 1}`, eventCarousel);
                  AIC.reply_send_flex(replyToken, eventCarousel);
                }
                break;

              case messageText === "削除したい":
              case messageText === "修正したい":
              case messageText === "受付したい":
                  {
                      const actionMap = {
                          "削除したい": "削除へすすむ",
                          "修正したい": "修正へすすむ",
                          "受付したい": "受付へすすむ",
                      };
                      const action = actionMap[messageText];

                      // フィルタリングされたイベントデータを取得
                      const filteredColumns = getFilteredEventColumns(line_id);

                      // データが存在しない場合の処理
                      if (!filteredColumns || !filteredColumns.event_name || filteredColumns.event_name.length === 0) {
                          // レスポンスを返す
                          AIC.reply_send("申し訳ございませんが、申し込み内容を取得できませんでした。", replyToken);
                      } else {
                          // フィルタリング結果でFlex Messageを作成
                          const filteredCarousel = createFilteredEventCarousel(
                              line_id,
                              filteredColumns.event_name,
                              filteredColumns.event_date,
                              filteredColumns.event_image,
                              filteredColumns.event_url,
                              action,
                              action
                          );
                          logToProperties(`GeneratedFilteredCarousel${index + 1}`, filteredCarousel);

                          if (filteredCarousel) {
                              // Flex Message を送信
                              AIC.reply_send_flex(replyToken, filteredCarousel);
                          } else {
                              // カルーセル作成に失敗した場合
                              AIC.reply_send("申し訳ございませんが、申し込み内容を取得できませんでした。", replyToken);
                          }
                      }
                  }
                  break;


              case messageText === "確認したい":
                  {
                      const filteredColumns = getFilteredEventColumns(line_id);

                      // データが存在しない場合の処理
                      if (!filteredColumns || !filteredColumns.event_id || filteredColumns.event_id.length === 0) {
                          // レスポンスを返す
                          AIC.reply_send("申し訳ございませんが、申し込み内容を取得できませんでした。", replyToken);
                      } else {
                          const event_ids = filteredColumns.event_id;
                          const event_names = filteredColumns.event_name;
                          const event_dates = filteredColumns.event_date;

                          // 各 event_id に対して confirmReservation を実行し、null でない結果のみを格納
                          const messages = event_ids
                              .map(event_id => confirmReservation(event_id, line_id))
                              .filter(confirmReservation => confirmReservation !== null)
                              .flat(); // 2次元配列を1次元配列に変換

                          const filteredCarousel = createConfirmationCarousel(
                              line_id,
                              event_names,
                              event_dates,
                              messages
                          );

                          // filteredCarousel の中身を文字列化して表示
                          logToProperties("GeneratedFilteredCarousel: " + filteredCarousel);

                          if (filteredCarousel) {
                              // Flex Message を送信
                              AIC.reply_send_flex(replyToken, filteredCarousel);

                              // 処理された event_id を記録
                              responseEventId = event_ids[0]; // 最初の event_id を記録
                          } else {
                              AIC.reply_send("申し訳ございませんが、申し込み内容を取得できませんでした。", replyToken);
                          }
                      }
                  }
                  break;


              default:
                logToProperties(`UnhandledMessage${index + 1}`, messageText);
                break;
            }
            break;

          case "postback":
            const postbackData = JSON.parse(event.postback.data);
            logToProperties(`ParsedPostbackData${index + 1}`, postbackData);

            const action = postbackData.action;
            switch (action) {
              case "申し込みへすすむ":
                {
                  const event_id = parseInt(postbackData.event_id, 10);

                  const action = postbackData.action;
                  const eventRows = getEventRows();

                  // イベント情報を取得
                  const event_date = eventRows.filter(event => event.event_id === event_id).map(event => event.event_date)[0];
                  const event_image = eventRows.filter(event => event.event_id === event_id).map(event => event.event_image)[0];
                 
                  // form_url を取得
                  const form_url = getFormUrl(event_id, line_id);

                  if (!form_url) {
                    throw new Error("form_url is null or undefined");
                  }

                  // Flex Message の生成
                  const flexMessage = createApplicationMessage(
                    postbackData.event_name,
                    event_date,
                    event_image,
                    form_url
                  );

                  // ログ: Flex Message の生成内容
                  logToProperties(`GeneratedPostbackFlexMessage${index + 1}`, flexMessage);

                  if (flexMessage) {
                    // Flex Message を送信
                  AIC.reply_send_flex(replyToken, flexMessage);

                  // 処理された event_id を記録
                  responseEventId = event_id;
                  } else {
                    AIC.reply_send("申し訳ございませんが、申し込みフォームを取得できませんでした。", reply_token);
                  }
                }
                break;

              case "削除へすすむ":
                  {
                      const event_id = parseInt(postbackData.event_id, 10);
                      const event_name = postbackData.event_name; 

                      const action = postbackData.action;
                      const eventRows = getEventRows();

                      // イベント情報を取得
                      const event_date = eventRows.filter(event => event.event_id === event_id).map(event => event.event_date)[0];
                      const event_image = eventRows.filter(event => event.event_id === event_id).map(event => event.event_image)[0];

                      // Flex Message の生成
                      const flexMessage = createCancellationMessage(
                          event_id,
                          event_name,
                          event_date,
                          event_image,
                          "申込内容を消去します。"
                      );

                      // ログ: Flex Message の生成内容
                      logToProperties(`GeneratedPostbackFlexMessage${index + 1}`, flexMessage);

                      // Flex Message を送信
                      AIC.reply_send_flex(replyToken, flexMessage);
                  }
                  break;

              case "申込内容を消去します。":
                  {
                      const event_id = parseInt(postbackData.event_id, 10);
                      const event_name = postbackData.event_name; 

                      // 申込内容を消去する処理
                      const result = clearFormData(event_id, line_id);

                      // 消去成功/失敗のメッセージ
                      let messageText
                      let messageContent
                      if (result) {
                          messageText = `${event_name}の申込内容をキャンセルしました。`
                          messageContent = result.message;
                      }
                      // メッセージを送信
                      AIC.reply_send(messageText + messageContent, replyToken);
                  }
                  break;


              case "修正へすすむ":
                {
                  const event_id = parseInt(postbackData.event_id, 10);

                  const action = postbackData.action;
                  const eventRows = getEventRows();

                  // イベント情報を取得
                  const event_date = eventRows.filter(event => event.event_id === event_id).map(event => event.event_date)[0];
                  const event_image = eventRows.filter(event => event.event_id === event_id).map(event => event.event_image)[0];
          
                  // editUrlの取得
                  const editUrl = updateFormData(event_id, line_id);

                  // Flex Message の生成
                  const flexMessage = createEditMessage(
                    postbackData.event_name,
                    event_date,
                    event_image,
                    editUrl
                  );

                  // ログ: Flex Message の生成内容
                  logToProperties(`GeneratedPostbackFlexMessage${index + 1}`, flexMessage);

                  if (editUrl) {
                    // Flex Message を送信
                  AIC.reply_send_flex(replyToken, flexMessage);

                  // 処理された event_id を記録
                  responseEventId = event_id;
                  } else {
                    AIC.reply_send("申し訳ございませんが、申し込み内容を取得できませんでした。", reply_token);
                  }
                  
                }
                break;

              case "受付へすすむ":
                {
                  const event_id = parseInt(postbackData.event_id, 10);

                  // Flex Message の生成
                  const flexMessage = sendQR(event_id, line_id)

                  // ログ: Flex Message の生成内容
                  logToProperties(`GeneratedPostbackFlexMessage${index + 1}`, flexMessage);

                  if (flexMessage) {
                    // Flex Message を送信
                  AIC.reply_send_flex(replyToken, flexMessage);

                  // 処理された event_id を記録
                  responseEventId = event_id;
                  } else {
                    AIC.reply_send("申し訳ございませんが、申し込み内容を取得できませんでした。", reply_token);
                  }
                  
                }
                break;

              default:
                logToProperties(`UnhandledPostback${index + 1}`, postbackData);
                break;
            }
            break;

          default:
            logToProperties(`UnsupportedEventType${index + 1}`, eventType);
            break;
        }
      } catch (innerError) {
        logToProperties(`ErrorInEvent${index + 1}`, {
          message: innerError.message,
          stack: innerError.stack,
          event: event,
        });
      }
    });

    // 成功レスポンスを記録
    logToProperties('LastResponse', { status: "Success", event_id: responseEventId });

    // 成功レスポンスを返す
    return ContentService.createTextOutput(responseEventId || "No event_id processed")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    // エラーをプロパティに記録
    logToProperties('LastError', { message: error.message, stack: error.stack });

    // エラーレスポンスを返す
    return ContentService.createTextOutput("Error occurred").setMimeType(ContentService.MimeType.TEXT);
  }
}
