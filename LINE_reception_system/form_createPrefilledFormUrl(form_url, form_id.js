function createPrefilledFormUrl(form_url, form_id) {
  // 引数のform_urlとform_idから、「Form_ID」フィールドにform_idの初期値が入ったprefilledUrlを返す関数
  try {
  const form = FormApp.openByUrl(form_url);
  const items = form.getItems();

  // "Form_ID"というタイトルの項目を探す
  const item = items.find(item => {
    return item.getTitle() === 'Form_ID';
  });

  if (!item) {
    console.error('「Form_ID」というタイトルの項目が見つかりません');
    return null;
  }

  // 質問の種別によってasTextItem()などを使い分ける
  const itemResponse = item.asTextItem().createResponse(form_id);
  const formResponse = form.createResponse().withItemResponse(itemResponse);

  // 生成されたURLを格納する変数
  const prefilledUrl = formResponse.toPrefilledUrl();
  return prefilledUrl;

  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.message);
    return null;
  }
};