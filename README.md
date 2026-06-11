# サービス名
Book-Action-App　

# サービスの説明
本を読む人でも、ただ読んで終わりの人が大半です。
読んで終わりで満足するのではなく、考え方を落とし込み実践することが重要です。
アプリは本の内容をメモするだけでなく、具体的な行動に落とし込み、継続するまでサポートします。

1.本一覧画面から、「本を追加」ボタンを押します。
2.本のタイトル、学んだこと、具体的な行動、頻度を入力します。
3.ホーム画面で、やることリストとして2.で記載した情報が出ます。
4.実行したら、チェックを入れます。
5.継続画面でそれまでの日々の進捗を確認することができます。

# 使用した言語

|言語|Ver|
|:--|:--|
|react|19|
|TypeScript|5.6|


# 環境設定の方法(.envなど)
このリポジトリをクローンしてください。 git@github.com/o68606007-spec/book_action_app.git

依存関係のインストールをしてください。 npm ci

.envファイルを作成しsupabaseの設定値を入力してください
 1.book_action_appという名前でプロジェクト名を作成してください。 
 2.book-users、books、learnings、actions、action_logsという名前のテーブルを作成し、以下のカラムを作成してください。 
 3.プロジェクトURLとプロジェクトキーを.env内のVITE_SUPABASE_URLとVITE_SUPABASE_PROJECT_KEY変数にコピー&ペーストしてください。

book-users
|Name	|Type	|option|
|:----|:----|:----|
|user_id	|varchar |non-null|
|firebase_uid |varchar |non-null|
|email   |varchar |non-null|
|name	|varchar	|non-null|

books
|Name	|Type	|option|
|:----|:----|:----|
|id	|int8	||
|user_id |varchar |non-null|
|title	|varchar	|non-null|

learnings
|Name	|Type	|option|
|:----|:----|:----|
|id	|int8	||	
|book_id |int8	|non-null|
|content |varchar	|non-null|

actions
|Name	|Type	|option|
|:----|:----|:----|
|id	|int8	||
|learning_id |int8||
|firebase_uid |varchar |non-null|
|content |varchar	|non-null|
|frequency |varchar	|non-null|

action_logs
|Name	|Type	|option|
|:----|:----|:----|
|id	|int8	||
|action_id |int8 ||
|executed_at |timestamp |non-null|
|is_done |boolean	|non-null|

# 起動の仕方
npm run dev ターミナルでURLをクリックすると、開くことができます。