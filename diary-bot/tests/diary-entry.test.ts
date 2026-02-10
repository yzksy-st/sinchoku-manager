import { DiaryEntry } from '../src/domain/diary-entry';
import { DiaryContent } from '../src/domain/diary-content';

describe('DiaryEntry', () => {
    const validContent = DiaryContent.create('テスト日記').getValue();

    describe('正常系', () => {
        it('有効なパラメータでDiaryEntryが生成される', () => {
            const entry = DiaryEntry.create({
                id: 'msg-123',
                authorId: 'user-456',
                authorName: 'テストユーザー',
                content: validContent,
                createdAt: new Date('2026-01-26T12:00:00Z')
            });

            expect(entry.id).toBe('msg-123');
            expect(entry.authorId).toBe('user-456');
            expect(entry.authorName).toBe('テストユーザー');
            expect(entry.content.toString()).toBe('テスト日記');
        });

        it('ファイル名が日付形式で生成される', () => {
            const entry = DiaryEntry.create({
                id: 'msg-123',
                authorId: 'user-456',
                authorName: 'テストユーザー',
                content: validContent,
                createdAt: new Date('2026-01-26T12:00:00Z')
            });

            expect(entry.getFilename()).toBe('2026-01-26.md');
        });
    });

    describe('Markdown出力', () => {
        it('正しいMarkdown形式で出力される', () => {
            const entry = DiaryEntry.create({
                id: 'msg-123',
                authorId: 'user-456',
                authorName: 'テストユーザー',
                content: validContent,
                createdAt: new Date('2026-01-26T15:30:00+09:00')
            });

            const markdown = entry.toMarkdown();

            expect(markdown).toContain('## 15:30');
            expect(markdown).toContain('テスト日記');
        });
    });
});
