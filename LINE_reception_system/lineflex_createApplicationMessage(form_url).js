// 「申し込みたい」への返信flex message
function createApplicationMessage(event_name, event_date, event_image, form_url) {
  return {
  "type": "bubble",
  "size": "deca",
  "hero": {
    "type": "image",
    "size": "250px",
    "aspectRatio": "1:1.4",
    "aspectMode": "cover",
    "url": event_image
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": event_name,
        "weight": "bold",
        "size": "lg",
        "wrap": true,
        "align": "center"
      },
      {
        "type": "text",
        "text": event_date,
        "align": "center",
        "margin": "lg"
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "spacing": "sm",
    "contents": [
      {
        "type": "button",
        "style": "primary",
        "height": "sm",
        "action": {
          "type": "uri",
          "label": "申し込む",
          "uri": form_url
        },
        "color": "#00bfff"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": []
      }
    ],
    "flex": 0
  }
};
}
