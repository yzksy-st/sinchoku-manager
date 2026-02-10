import * as dotenv from 'dotenv';
import * as path from 'path';

// .envファイルを読み込み（プロジェクトルートの親ディレクトリから）
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * 環境変数設定を読み込み、検証する
 * セキュリティ: 必須環境変数が未設定の場合は起動を拒否
 */
export interface EnvironmentConfig {
    readonly discordBotToken: string;
    readonly diaryChannelId: string;
    readonly obsidianVaultPath: string;
}

/**
 * 環境変数を読み込み、検証する
 * @throws 必須環境変数が未設定の場合
 */
export function loadEnvironmentConfig(): EnvironmentConfig {
    const errors: string[] = [];

    const discordBotToken = process.env.DISCORD_BOT_TOKEN;
    if (!discordBotToken || discordBotToken === 'ここにBot Tokenを貼り付けてください') {
        errors.push('DISCORD_BOT_TOKEN が設定されていません');
    }

    const diaryChannelId = process.env.DIARY_CHANNEL_ID;
    if (!diaryChannelId) {
        errors.push('DIARY_CHANNEL_ID が設定されていません');
    }

    const obsidianVaultPath = process.env.OBSIDIAN_VAULT_PATH;
    if (!obsidianVaultPath || obsidianVaultPath === 'ここにVaultパスを貼り付けてください') {
        errors.push('OBSIDIAN_VAULT_PATH が設定されていません');
    }

    if (errors.length > 0) {
        throw new Error(
            `環境変数の設定エラー:\n${errors.map(e => `  - ${e}`).join('\n')}\n\n` +
            `.env ファイルを確認してください。`
        );
    }

    return {
        discordBotToken: discordBotToken!,
        diaryChannelId: diaryChannelId!,
        obsidianVaultPath: obsidianVaultPath!
    };
}
