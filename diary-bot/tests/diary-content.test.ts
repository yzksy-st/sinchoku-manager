import { DiaryContent } from '../src/domain/diary-content';

describe('DiaryContent', () => {
    describe('正常系', () => {
        it('有効な内容でDiaryContentが生成される', () => {
            const result = DiaryContent.create('今日は良い日だった');

            expect(result.isSuccess()).toBe(true);
            if (result.isSuccess()) {
                expect(result.getValue().toString()).toBe('今日は良い日だった');
            }
        });

        it('前後の空白がトリムされる', () => {
            const result = DiaryContent.create('  日記の内容  ');

            expect(result.isSuccess()).toBe(true);
            if (result.isSuccess()) {
                expect(result.getValue().toString()).toBe('日記の内容');
            }
        });
    });

    describe('エッジケース', () => {
        it('空文字の場合はエラーを返す', () => {
            const result = DiaryContent.create('');

            expect(result.isFailure()).toBe(true);
            if (result.isFailure()) {
                expect(result.getError()).toBe('空の日記は保存できません');
            }
        });

        it('空白のみの場合はエラーを返す', () => {
            const result = DiaryContent.create('   ');

            expect(result.isFailure()).toBe(true);
            if (result.isFailure()) {
                expect(result.getError()).toBe('空の日記は保存できません');
            }
        });

        it('10000文字を超える場合はエラーを返す', () => {
            const longContent = 'あ'.repeat(10001);
            const result = DiaryContent.create(longContent);

            expect(result.isFailure()).toBe(true);
            if (result.isFailure()) {
                expect(result.getError()).toBe('文字数上限（10000文字）を超えています');
            }
        });

        it('ちょうど10000文字は許可される', () => {
            const maxContent = 'あ'.repeat(10000);
            const result = DiaryContent.create(maxContent);

            expect(result.isSuccess()).toBe(true);
        });
    });
});
