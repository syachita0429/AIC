// 例createEventCarousel("イベント名", "register");
function createEventCarousel(event_names, event_dates, event_images, event_urls, action,displayText) {
  try{
  const event_ids = getEventColumns().event_id;
  
  let contentsArray = [];

  // event_idの数だけcarouselContentを生成し、contents配列に追加
  for (let i = 0; i < event_ids.length; i++) {
    const content = carouselContent(
      event_ids[i],
      event_names[i], 
      event_dates[i], 
      event_images[i], 
      event_urls[i],
      action,
      displayText
    );
    contentsArray.push(content);
  }

  // カルーセルテンプレート
  const carouseltemplate = {
    "type": "carousel",
    "contents": contentsArray
  };

  return carouseltemplate;

  } catch (error) {
    Logger.log('createEventCarouselエラーが発生しました: ' + error.message);
    return null;
  }
}

// const columns = getEventColumns();
// const event_names = columns.event_name;
// const event_dates = columns.event_date;
// const event_images = columns.event_image;
// const event_urls = columns.event_url;

// // JSON形式で返されるcarouselを取得
// const carouselJSON = createEventCarousel(event_names, event_dates, event_images, event_urls);

// // JSON.stringifyを使ってJSONを文字列化し、内容をログに出力
// console.log("Carousel JSON String: " + JSON.stringify(carouselJSON, null, 2));