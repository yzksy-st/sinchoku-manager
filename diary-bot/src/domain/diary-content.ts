import { Result } from './result';

/**
 * DiaryContent - 日記の内容を表すValue Object
 * 
 * 責務:
 * - 日記内容の検証（空文字チェック、文字数上限）
 * - 不変性の保証
 */
export class DiaryContent {
    private static readonly MAX_LENGTH = 10000;
    private static readonly EMPTY_ERROR = '空の日記は保存できません';
    private static readonly MAX_LENGTH_ERROR = `文字数上限（${DiaryContent.MAX_LENGTH}文字）を超えています`;

    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
        Object.freeze(this);
    }

    /**
     * DiaryContentを生成するファクトリメソッド
     * @param raw - 生の入力文字列
     * @returns 成功時はDiaryContent、失敗時はエラーメッセージを含むResult
     */
    static create(raw: string): Result<DiaryContent> {
        const trimmed = raw.trim();

        if (trimmed.length === 0) {
            return Result.failure<DiaryContent>(DiaryContent.EMPTY_ERROR);
        }

        if (trimmed.length > DiaryContent.MAX_LENGTH) {
            return Result.failure<DiaryContent>(DiaryContent.MAX_LENGTH_ERROR);
        }

        return Result.success(new DiaryContent(trimmed));
    }

    /**
     * 内容を文字列として取得
     */
    toString(): string {
        return this.value;
    }

    /**
     * 等価性の比較
     */
    equals(other: DiaryContent): boolean {
        return this.value === other.value;
    }
}
