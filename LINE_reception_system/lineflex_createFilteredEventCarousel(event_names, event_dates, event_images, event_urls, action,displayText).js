function createFilteredEventCarousel(line_id, event_names, event_dates, event_images, event_urls, action,displayText) {
  try{
  const filteredColumns = getFilteredEventColumns(line_id);
  const event_ids = filteredColumns.event_id;
  
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
