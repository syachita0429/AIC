function getFilteredEventColumns(line_id) {
  try {

    // eventシートのデータを一括取得
    const eventRows = getEventRows(); // enable=true のみ取得

    // 各 event_id に対して getFormData を呼び出し、null でない場合の event_id を格納
    const final_event_ids = eventRows
      .map(row => row.event_id)
      .filter(event_id => {
        const formData = getFormData(event_id, line_id);
        return formData !== null && formData.length > 0;
      });

    // 必要なデータを収集
    const columnData = {
      event_id: final_event_ids,
      event_date: [],
      event_name: [],
      event_image: [],
      event_url: [],
      form_url: []
    };

    final_event_ids.forEach(event_id => {
      const matchingEvents = eventRows.filter(event => event.event_id === event_id);

      columnData.event_date.push(...matchingEvents.map(event => formatDate(event.event_date))); // 日付をフォーマット
      columnData.event_name.push(...matchingEvents.map(event => event.event_name));
      columnData.event_image.push(...matchingEvents.map(event => event.event_image));
      columnData.event_url.push(...matchingEvents.map(event => event.event_url));
      columnData.form_url.push(...matchingEvents.map(event => event.form_url));
    });

    return columnData;

  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    return null;
  }
}

// // テスト用コード
// function testGetFilteredEventColumns() {
//   try {
//     const testLineId = "U553d4ef3bba56aa2983f9970fbcc5f18"; // テスト用の line_id
//     const filteredColumns = getFilteredEventColumns(testLineId);
//     console.log("Filtered Event Columns:", filteredColumns);
//     console.log("Filtered Event Ids:", filteredColumns.event_id);
//     console.log("Filtered Event Dates:", filteredColumns.event_date);
//     console.log("Filtered Event Names:", filteredColumns.event_name);
//   } catch (error) {
//     console.error("エラーが発生しました:", error.message);
//   }
// }

// // テスト関数の呼び出し
// testGetFilteredEventColumns();