function createConfirmationMessage(event_name, event_date, message) {
  return{
    "type": "bubble",
    "size": "giga",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "申し込み内容",
          "weight": "bold",
          "color": "#1DB446",
          "size": "sm"
        },
        {
          "type": "text",
          "text": event_name,
          "weight": "regular",
          "margin": "none",
          "size": "xxl",
            "wrap": true
        },
        {
          "type": "text",
          "text": event_date,
          "size": "lg",
          "wrap": true
        },
        {
          "type": "separator",
          "margin": "xxl"
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "xxl",
          "spacing": "sm",
          "contents": [
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": message,
                  "size": "sm",
                  "color": "#555555",
                  "flex": 0,
                  "wrap": true
                }
              ]
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": []
            },
            {
              "type": "separator"
            }
          ]
        }
      ]
    },
    "styles": {
      "footer": {
        "separator": true
      }
    }
  };
}

