import { Client, GatewayIntentBits, Events } from 'discord.js';
import { loadEnvironmentConfig } from './config';
import { DiaryHandler } from './application';
import { ObsidianDiaryRepository } from './infrastructure';

/**
 * Discord日記Bot - メインエントリーポイント
 * 
 * 機能:
 * - 指定チャンネルのメッセージを監視
 * - 日記として認識したメッセージをObsidianに保存
 */
async function main(): Promise<void> {
    console.log('🚀 Discord日記Bot を起動中...');

    // 環境変数を読み込み
    const config = loadEnvironmentConfig();
    console.log('✅ 環境変数を読み込みました');

    // Obsidianリポジトリを初期化
    const repository = new ObsidianDiaryRepository(config.obsidianVaultPath);
    console.log(`📁 Obsidian Vault: ${config.obsidianVaultPath}`);

    // Discord Clientを作成
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    // Bot準備完了時
    client.once(Events.ClientReady, (readyClient) => {
        console.log(`✅ Botがログインしました: ${readyClient.user.tag}`);
        console.log(`👀 監視チャンネルID: ${config.diaryChannelId}`);
        console.log('📝 日記の投稿を待機中...');
    });

    // DiaryHandlerを作成（Bot IDは接続後に取得）
    let diaryHandler: DiaryHandler | null = null;

    client.on(Events.ClientReady, (readyClient) => {
        diaryHandler = new DiaryHandler(repository, {
            targetChannelId: config.diaryChannelId,
            botUserId: readyClient.user.id
        });
    });

    // メッセージ受信時
    client.on(Events.MessageCreate, async (message) => {
        if (!diaryHandler) return;

        const result = await diaryHandler.handle(message);

        switch (result.status) {
            case 'saved':
                console.log(`✅ 日記を保存しました: ${result.entry.getFilename()}`);
                // リアクションで保存成功を通知
                try {
                    await message.react('📝');
                } catch (error) {
                    console.warn('リアクションの追加に失敗しました');
                }
                break;
            case 'skipped':
                // スキップはログに出さない（対象チャンネル外のメッセージが多いため）
                break;
            case 'error':
                console.error(`❌ エラー: ${result.error}`);
                break;
        }
    });

    // エラーハンドリング
    client.on(Events.Error, (error) => {
        console.error('Discord Client エラー:', error);
    });

    // Discordに接続
    await client.login(config.discordBotToken);
}

// エントリーポイント
main().catch((error) => {
    console.error('❌ 起動エラー:', error.message);
    process.exit(1);
});
