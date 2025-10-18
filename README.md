
# AI競馬予想アプリ

Gemini AIの能力を活用して、ユーザーが入力したレース情報に基づき、詳細な競馬予想を生成するWebアプリケーションです。

## ✨ 主な機能

- **AIによる高精度な予測**: トップ3の有力馬を、信頼度と詳細な理由と共に予測します。
- **Web検索連携 (Grounding)**: Google検索を活用し、最新の競走馬のコンディションやニュースを予測に反映させます。
- **思考プロセスの可視化**: AIがどのように結論に至ったか、リアルタイムのストリーミングで思考の過程を表示します。
- **透明性の確保**: AIが予測の根拠として参照したWebサイトのソースを明示します。
- **インタラクティブなUI**: 使いやすいフォームで、レース情報や出走馬のデータを簡単に入力できます。

## 🛠️ 技術スタック

- React
- TypeScript
- Tailwind CSS
- Google Gemini API (@google/genai)

## 🚀 導入と実行方法

このアプリケーションをローカル環境で実行するには、Node.jsとnpmが必要です。

### 1. 前提条件

- [Node.js](https://nodejs.org/) (バージョン 18.x 以上を推奨)
- [npm](https://www.npmjs.com/) (通常Node.jsに同梱)

### 2. インストール手順

1.  **プロジェクトをクローンまたはダウンロードします。**

2.  **プロジェクトのルートディレクトリに移動し、必要なパッケージをインストールします。**
    ```bash
    npm install
    ```
    *(もし`package.json`が存在しない場合は、先に `npm init -y` を実行してください)*

### 3. 環境設定

アプリケーションを実行するには、Google Gemini APIキーが必要です。

1.  **APIキーの取得**: [Google AI Studio](https://aistudio.google.com/app/apikey) にアクセスしてAPIキーを取得します。

2.  **.envファイルの作成**: プロジェクトのルートディレクトリに `.env` という名前のファイルを作成します。

3.  **APIキーの設定**: 作成した `.env` ファイルに、取得したAPIキーを以下のように記述します。

    ```
    VITE_API_KEY="YOUR_GEMINI_API_KEY"
    ```
    `YOUR_GEMINI_API_KEY` の部分を、ご自身のAPIキーに置き換えてください。

4.  **ソースコードの修正**:
    Vite環境で環境変数を読み込むために、`services/geminiService.ts` ファイル内のAPIキー設定を1箇所だけ修正する必要があります。

    - **変更前:**
      ```typescript
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      ```

    - **変更後:**
      ```typescript
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY as string });
      ```

### 4. アプリケーションの実行

以下のコマンドを実行して、開発サーバーを起動します。

```bash
npm run dev
```
*(もし`package.json`に`dev`スクリプトがない場合は、`npm install vite` を実行してから `vite` コマンドで起動するか、`package.json`の`scripts`に `"dev": "vite"` を追加してください)*

ターミナルに表示されたURL (通常は `http://localhost:5173`) をブラウザで開くと、アプリケーションが表示されます。

## 使い方

1.  **レース情報を入力**: 「レース名」「競馬場」「距離」を入力します。
2.  **出走馬リストを作成**: 各馬の「馬番」「馬名」「騎手」と、AIの予測精度を高めるための「過去の成績・近走の状態」を入力します。
3.  **予測を生成**: 「AI予測を生成」ボタンをクリックします。
4.  **結果を確認**: AIの思考プロセスがリアルタイムで表示され、完了後に詳細な予測結果と参照ソースが表示されます。

## 🩺 トラブルシューティング

- **APIキーに関するエラー**:
  - `API key not valid` などのエラーが表示された場合、`.env` ファイルに設定したAPIキーが正しいか、Google AI Studioで有効になっているかを確認してください。
  - 無料利用枠を超えた場合、[Google Cloudの請求先アカウント](https://ai.google.dev/gemini-api/docs/billing)が設定されているか確認してください。

- **予測結果が正しく表示されない**:
  - 「AIからの応答を解析できませんでした」というエラーが表示される場合、AIが予期しない形式で応答した可能性があります。入力情報（特に「過去の成績」）を少し変更して、再度試してみてください。

- **その他の問題**:
  - ブラウザの開発者コンソール（Windows: `Ctrl+Shift+I`, Mac: `Cmd+Option+I`）を開き、エラーメッセージを確認してください。

