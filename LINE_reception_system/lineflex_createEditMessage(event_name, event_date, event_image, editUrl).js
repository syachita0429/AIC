// 「修正」への返信flex message
function createEditMessage(event_name, event_date, event_image, editUrl) {
  return {
  "type": "bubble",
  "size": "deca",
  "header": {
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "image",
            "url": event_image,
            "size": "full",
            "aspectMode": "cover",
            "aspectRatio": "1:1.4",
            "gravity": "center",
            "flex": 1
          }
        ]
      }
    ],
    "paddingAll": "0px"
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "contents": [],
                "size": "xl",
                "wrap": true,
                "text": "予約内容の修正",
                "color": "#ffffff",
                "weight": "bold"
              },
              {
                "type": "text",
                "text": event_name,
                "color": "#ffffffff",
                "size": "xl",
                "wrap": true
              },
              {
                "type": "text",
                "text": event_date,
                "color": "#ffffffff",
                "size": "lg",
                "wrap": true,
                "margin": "lg"
              },
              {
                "type": "text",
                "text": "以下のリンクから申し込み内容を編集し、送信してください。編集後の内容はフォーム送信後に送られるメールまたはメニューボタンの「予約内容確認」からご確認ください。",
                "color": "#ffffffcc",
                "size": "sm",
                "wrap": true,
                "margin": "lg"
              }
            ],
            "spacing": "sm"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "button",
                    "action": {
                      "type": "uri",
                      "label": "修正する",
                      "uri": editUrl
                    },
                    "style": "primary",
                    "color": "#3aacbd"
                  }
                ]
              }
            ],
            "paddingAll": "13px",
            "backgroundColor": "#3abda6",
            "cornerRadius": "2px",
            "margin": "xl"
          }
        ]
      }
    ],
    "paddingAll": "20px",
    "backgroundColor": "#3abda6"
  }
};
}
