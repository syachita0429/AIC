function createQRMessage(name, qrCodeUrl) {
  return {
  "type": "bubble",
  "header": {
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "box",
        "layout": "horizontal",
        "contents": []
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
                "color": "#ffffff",
                "weight": "bold",
                "text": "受付QRコード"
              },
              {
                "type": "text",
                "contents": [],
                "size": "xl",
                "wrap": true,
                "color": "#ffffff",
                "weight": "bold",
                "text": name + "さま"
              },
              {
                "type": "text",
                "text": "イベント当日、入口にて以下のQRコードを読み取らせていただきます。",
                "color": "#ffffffcc",
                "size": "lg",
                "wrap": true
              }
            ],
            "spacing": "md"
          }
        ]
      },
      {
        "type": "image",
        "url": qrCodeUrl ,
        "size": "250px"
      }
    ],
    "paddingAll": "20px",
    "backgroundColor": "#3abda6"
  }
}

}