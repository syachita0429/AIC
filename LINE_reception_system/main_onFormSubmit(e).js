function onFormSubmit(e) {
  // フォーム送信時に edit_url, qr_url を作成し、さらに name, 所属, 学年を含む QR コード URL を生成

  // フォームの回答シートを取得
  const formResponseSheet = SpreadsheetApp.getActiveSheet();
  const form = FormApp.openByUrl(formResponseSheet.getFormUrl());

  // フォーム回答データ一覧を取得
  const formResponses = form.getResponses();
  console.log("formResponses:" + formResponses);

  // ヘッダー行を取得
  const headerRow = formResponseSheet
    .getRange(1, 1, 1, formResponseSheet.getLastColumn())
    .getValues()[0];

  try {
    // form_id を取得
    const form_id = e.namedValues["Form_ID"][0];

    // editUrl の生成
    // フォーム回答一覧から最後のデータ (＝一番新しいデータ) の編集用 URL を取得
    const editUrl = formResponses[formResponses.length - 1].getEditResponseUrl();

    // シート上で "edit_url" のカラムを特定して挿入
    const editUrlColumnIndex = headerRow.indexOf("edit_url") + 1;
    formResponseSheet
      .getRange(e.range.getRow(), editUrlColumnIndex)
      .setValue(editUrl);
    console.log("editUrlを挿入しました。");

    // ===== ここから name, affiliation, grade を取得して QR コード URL に付加するロジック =====

    // 新しく送信された回答行のデータを取得
    //   e.range.getRow() で今回追加された行番号を取得
    //   先頭列から最終列までのデータを配列として取得
    const rowIndex = e.range.getRow();
    const rowValues = formResponseSheet
      .getRange(rowIndex, 1, 1, formResponseSheet.getLastColumn())
      .getValues()[0];

    // ヘッダに "氏名" を含む列インデックスを探し、名前を取得
    const nameIndex = headerRow.findIndex(header => header.includes("氏名"));
    const name = (nameIndex > -1) ? rowValues[nameIndex] : "";

    // ヘッダに "所属" を含む列インデックスを探し、所属を取得
    const affiliationIndex = headerRow.findIndex(header => header.includes("所属"));
    const affiliation = (affiliationIndex > -1) ? rowValues[affiliationIndex] : "";

    // ヘッダに "学年" を含む列インデックスを探し、学年を取得
    const gradeIndex = headerRow.findIndex(header => header.includes("学年"));
    const grade = (gradeIndex > -1) ? rowValues[gradeIndex] : "";

    // ===== receptionUrl を作成して QR コード化 =====

    const qrCodeGeneratorUrl = config.code_generator; // QRコード生成サービスのAPI

    // ?form_id=xxx&affiliation=yyy&grade=zzz&name=aaa の順序
    const receptionUrl = `?form_id=${form_id}&affiliation=${affiliation}&grade=${grade}&name=${name}`;
    const qrCodeUrl = qrCodeGeneratorUrl + encodeURIComponent(receptionUrl);

    // "qr_url" カラムに保存
    const qrUrlColumnIndex = headerRow.indexOf("qr_url") + 1;
    formResponseSheet
      .getRange(rowIndex, qrUrlColumnIndex)
      .setValue(qrCodeUrl);

    console.log("QRコード URL を挿入しました。\n", qrCodeUrl);

  } catch (error) {
    Logger.log("エラーが発生しました: " + error.message);
    return null;
  }
}
