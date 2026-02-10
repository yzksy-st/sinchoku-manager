import * as fs from 'fs/promises';
import * as path from 'path';
import { DiaryEntry, DiaryRepository } from '../domain';

/**
 * ObsidianDiaryRepository - Obsidian Vaultに日記を保存する実装
 * 
 * セキュリティ対策:
 * - パストラバーサル攻撃の防止
 * - Vault外への書き込み禁止
 * - ファイル名のサニタイズ
 */
export class ObsidianDiaryRepository implements DiaryRepository {
    private readonly vaultPath: string;

    constructor(vaultPath: string) {
        if (!vaultPath || vaultPath.trim().length === 0) {
            throw new Error('VaultパスはSTEを指定してください');
        }
        // パスを正規化して保存
        this.vaultPath = path.resolve(vaultPath);
    }

    /**
     * 日記エントリを保存
     * 同日の日記が既に存在する場合は追記
     */
    async save(entry: DiaryEntry): Promise<void> {
        const filename = entry.getFilename();

        // セキュリティ: ファイル名をサニタイズ
        const sanitizedFilename = this.sanitizeFilename(filename);
        const filePath = path.join(this.vaultPath, sanitizedFilename);

        // セキュリティ: パストラバーサル攻撃の防止
        this.validatePathIsWithinVault(filePath);

        const markdown = entry.toMarkdown();

        // ディレクトリが存在することを確認
        await this.ensureVaultExists();

        // ファイルが存在する場合は追記、存在しない場合は新規作成
        await fs.appendFile(filePath, markdown, 'utf-8');
    }

    /**
     * パスがVault内に収まっているか検証
     * パストラバーサル攻撃を防止
     */
    private validatePathIsWithinVault(filePath: string): void {
        const resolvedPath = path.resolve(filePath);
        const resolvedVault = path.resolve(this.vaultPath);

        if (!resolvedPath.startsWith(resolvedVault)) {
            throw new Error('セキュリティエラー: Vault外への書き込みは許可されていません');
        }
    }

    /**
     * ファイル名をサニタイズ
     * 危険な文字を除去し、パストラバーサルを防止
     */
    private sanitizeFilename(filename: string): string {
        // ディレクトリトラバーサル文字を除去
        const sanitized = filename
            .replace(/\.\./g, '')
            .replace(/[/\\]/g, '')
            .replace(/[<>:"|?*]/g, '_');

        // YYYY-MM-DD.md 形式のみ許可
        const validPattern = /^\d{4}-\d{2}-\d{2}\.md$/;
        if (!validPattern.test(sanitized)) {
            throw new Error('無効なファイル名形式です');
        }

        return sanitized;
    }

    /**
     * Vaultディレクトリの存在を確認
     */
    private async ensureVaultExists(): Promise<void> {
        try {
            await fs.access(this.vaultPath);
        } catch {
            throw new Error(`Vaultディレクトリが存在しません: ${this.vaultPath}`);
        }
    }
}
