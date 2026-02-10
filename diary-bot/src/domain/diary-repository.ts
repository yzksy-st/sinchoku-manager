import { DiaryEntry } from './diary-entry';

/**
 * DiaryRepository - 日記保存のためのリポジトリインターフェース
 * 
 * 依存性逆転の原則（DIP）に従い、
 * ドメイン層がインフラ層に依存しないようにするためのインターフェース
 */
export interface DiaryRepository {
    /**
     * 日記エントリを保存する
     * 同日の日記が既に存在する場合は追記する
     * 
     * @param entry - 保存する日記エントリ
     * @throws 書き込みに失敗した場合
     */
    save(entry: DiaryEntry): Promise<void>;
}
