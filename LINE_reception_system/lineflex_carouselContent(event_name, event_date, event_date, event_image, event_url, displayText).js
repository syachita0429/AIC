function carouselContent(event_id, event_name, event_date, event_image, event_url, action, displayText) {
  let content =     {
  "type": "bubble",
  "size": "micro",
  "hero": {
    "type": "image",
    "url": event_image,
    "size": "full",
    "aspectMode": "cover",
    "aspectRatio": "1:1.4"
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": event_name,
        "weight": "bold",
        "size": "sm",
        "wrap": true,
        "align": "center"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "wrap": true,
                "color": "#8c8c8c",
                "size": "xs",
                "flex": 5,
                "text": event_date,
                "align": "center",
                "contents": []
              }
            ]
          }
        ]
      },
    ],
    "spacing": "sm",
    "paddingAll": "13px"
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "詳細はこちら",
              "uri": event_url
            },
            "style": "secondary"
          },
      {
        "type": "button",
        "action": {
          "type": "postback",
          "label": action,
          "data": JSON.stringify({
              "event_id": event_id,
              "event_name": event_name,
              "action": action
            }),
          "displayText": displayText
        },
        "style": "primary",
        "color": "#3abda6",
        "adjustMode": "shrink-to-fit"
      }
    ],
    "spacing": "md"
  }
}
return content
}
