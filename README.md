[![Build and Deploy](https://github.com/xryuseix/typetalk_reminder/actions/workflows/deploy.yaml/badge.svg)](https://github.com/xryuseix/typetalk_reminder/actions/workflows/deploy.yaml)

# Typetalk Reminder

Typetalk上で予定のリマインドを行うBOTです。イベントの当日朝9時と開始1時間前に通知してくれます。

## 使い方

[Releases](https://github.com/xryuseix/typetalk_reminder/releases)から最新のindex.jsとtemplate.xlsxをダウンロードしてください。

![](./assets/images/releases.png)

### スプレッドシートの設定

[Google スプレッドシート](https://docs.google.com/spreadsheets/)にて新しいスプレッドシートを作成してください。

![](./assets/images/sheet.png)

作成したら「ファイル」から「インポート」を選択して、ダウンロードしたtemplate.xlsxをアップロードしてください。

![](./assets/images/import.png)
![](./assets/images/upload.png)
![](./assets/images/import2.png)

次に、「拡張機能」の「Apps Script」を選択し、先ほどダウンロードしたindex.jsの中身をコピーして貼り付けてください。最後に保存する必要があります。

![](./assets/images/gas.png)
![](./assets/images/gaspaste.png)

次にタイマーを設定していきます。スクリプトエディタの左側にある「トリガー」を選択してください。

![](./assets/images/trigger.png)

新しいトリガーを図のように設定してください。

![](./assets/images/timer1.png)

この時、警告が出ますがunsafeを承知した上で選択してください。

![](./assets/images/auth.png)

もう一つタイマーを設定します。

![](./assets/images/timer2.png)

最終的にはこのようになります。

![](./assets/images/timer_result.png)

### Typetalkの設定

typetalkのトピックからトピックの設定を開き、ボットを作成してください。

![](./assets/images/typetalk.png)

ボットIDとボット名を設定してください。

![](./assets/images/bot.png)

この時生成される、「Typetalk Token」とメッセージの取得と「投稿のURL」を保存しておいてください。

最後に、スプレッドシートの「config」シートの「TYPETALK_TOKEN」と「TYPETALK_URL」に先ほど保存した値を入力してください。

![](./assets/images/config.png)

この時、zoomの接続先リンクやデフォルトの予定も変更しておくと良いです。

### 利用方法

まず、メンションを送りたい人のIDを「members」シートに追加してください。

![](./assets/images/userid.png)

そして、「schedule」シートで予定を追加してください。

![](./assets/images/schedule.png)