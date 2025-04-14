// 日付フォーマット関数
function formatDate(date) {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月を2桁に
    const day = String(date.getDate()).padStart(2, '0'); // 日を2桁に
    return `${year}-${month}-${day}`;
  } else {
    Logger.log("Invalid Date: " + date);
    return date; // 不正な場合はそのまま返す
  }
}
