/**
 * Result型 - 成功/失敗を型安全に表現するパターン
 * 例外を使わずにエラーハンドリングを行う
 */
export class Result<T> {
    private readonly _isSuccess: boolean;
    private readonly _value?: T;
    private readonly _error?: string;

    private constructor(isSuccess: boolean, value?: T, error?: string) {
        this._isSuccess = isSuccess;
        this._value = value;
        this._error = error;
        Object.freeze(this);
    }

    static success<T>(value: T): Result<T> {
        return new Result<T>(true, value, undefined);
    }

    static failure<T>(error: string): Result<T> {
        return new Result<T>(false, undefined, error);
    }

    isSuccess(): boolean {
        return this._isSuccess;
    }

    isFailure(): boolean {
        return !this._isSuccess;
    }

    getValue(): T {
        if (!this._isSuccess) {
            throw new Error('成功していないResultからvalueを取得できません');
        }
        return this._value as T;
    }

    getError(): string {
        if (this._isSuccess) {
            throw new Error('成功しているResultからerrorを取得できません');
        }
        return this._error as string;
    }
}
