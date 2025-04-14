function logToProperties(key, value) {
  const properties = PropertiesService.getScriptProperties();
  const timestamp = new Date().toISOString(); // ISO形式で日時を記録
  const logEntry = {
    timestamp: timestamp,
    data: value
  };
  properties.setProperty(key, JSON.stringify(logEntry));
}