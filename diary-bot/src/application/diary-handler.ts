import { Message } from 'discord.js';
import { DiaryContent, DiaryEntry, DiaryRepository } from '../domain';

/**
 * DiaryHandlerの設定
 */
export interface DiaryHandlerConfig {
    /** 監視対象のチャンネルID */
    readonly targetChannelId: string;
    /** BotのユーザーID（自身のメッセージを無視するため） */
    readonly botUserId: string;
}

/**
 * DiaryHandler - DiscordメッセージをDiaryEntryに変換して保存
 * 
 * アプリケーション層の責務:
 * - Discordメッセージの検証
 * - ドメインオブジェクトへの変換
 * - リポジトリへの保存の調整
 */
export class DiaryHandler {
    private readonly repository: DiaryRepository;
    private readonly config: DiaryHandlerConfig;

    constructor(repository: DiaryRepository, config: DiaryHandlerConfig) {
        this.repository = repository;
        this.config = config;
    }

    /**
     * Discordメッセージを処理
     * 
     * @param message - Discordメッセージ
     * @returns 処理結果（保存成功/スキップ/エラー）
     */
    async handle(message: Message): Promise<DiaryHandleResult> {
        // Bot自身のメッセージは無視
        if (message.author.id === this.config.botUserId) {
            return { status: 'skipped', reason: 'Bot自身のメッセージ' };
        }

        // Botからのメッセージは無視
        if (message.author.bot) {
            return { status: 'skipped', reason: 'Botからのメッセージ' };
        }

        // 対象チャンネル以外は無視
        if (message.channelId !== this.config.targetChannelId) {
            return { status: 'skipped', reason: '対象チャンネル外' };
        }

        // 空のメッセージは無視
        const contentResult = DiaryContent.create(message.content);
        if (contentResult.isFailure()) {
            return { status: 'skipped', reason: contentResult.getError() };
        }

        try {
            const entry = DiaryEntry.create({
                id: message.id,
                authorId: message.author.id,
                authorName: message.author.username,
                content: contentResult.getValue(),
                createdAt: message.createdAt
            });

            await this.repository.save(entry);

            return { status: 'saved', entry };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '不明なエラー';
            return { status: 'error', error: errorMessage };
        }
    }
}

/**
 * DiaryHandler の処理結果
 */
export type DiaryHandleResult =
    | { status: 'saved'; entry: DiaryEntry }
    | { status: 'skipped'; reason: string }
    | { status: 'error'; error: string };
