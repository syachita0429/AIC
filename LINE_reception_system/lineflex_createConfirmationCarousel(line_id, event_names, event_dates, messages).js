function createConfirmationCarousel(line_id, event_names, event_dates, messages) {
  try{
  const filteredColumns = getFilteredEventColumns(line_id);
  const event_ids = filteredColumns.event_id;
  
  let contentsArray = [];

  // event_idの数だけcarouselContentを生成し、contents配列に追加
  for (let i = 0; i < event_ids.length; i++) {
    const content = createConfirmationMessage(
      event_names[i], 
      event_dates[i], 
      messages[i]
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
