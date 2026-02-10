import { DiaryContent } from './diary-content';

/**
 * DiaryEntryの生成に必要なパラメータ
 */
export interface DiaryEntryProps {
    readonly id: string;
    readonly authorId: string;
    readonly authorName: string;
    readonly content: DiaryContent;
    readonly createdAt: Date;
}

/**
 * DiaryEntry - 日記エントリを表すEntity
 * 
 * 責務:
 * - 日記の識別（id）
 * - Markdown形式への変換
 * - ファイル名の生成
 */
export class DiaryEntry {
    readonly id: string;
    readonly authorId: string;
    readonly authorName: string;
    readonly content: DiaryContent;
    readonly createdAt: Date;

    private constructor(props: DiaryEntryProps) {
        this.id = props.id;
        this.authorId = props.authorId;
        this.authorName = props.authorName;
        this.content = props.content;
        this.createdAt = props.createdAt;
        Object.freeze(this);
    }

    /**
     * DiaryEntryを生成するファクトリメソッド
     */
    static create(props: DiaryEntryProps): DiaryEntry {
        return new DiaryEntry(props);
    }

    /**
     * 保存するファイル名を取得（YYYY-MM-DD.md形式）
     */
    getFilename(): string {
        const year = this.createdAt.getFullYear();
        const month = String(this.createdAt.getMonth() + 1).padStart(2, '0');
        const day = String(this.createdAt.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}.md`;
    }

    /**
     * Markdown形式に変換
     * フォーマット:
     * ## HH:MM
     * 
     * {内容}
     * 
     * ---
     */
    toMarkdown(): string {
        const hours = String(this.createdAt.getHours()).padStart(2, '0');
        const minutes = String(this.createdAt.getMinutes()).padStart(2, '0');

        return `## ${hours}:${minutes}

${this.content.toString()}

---

`;
    }
}
