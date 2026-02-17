# spec/sinchoku_manager_spec.rb

require 'spec_helper'
require 'timecop'

# テストで使う偽のDiscordNotifierを先に定義
class DiscordNotifier; end

require_relative '../lib/sinchoku_manager'

describe SinchokuManager do
  # --- 平日・休日のロジックをテスト ---
  describe '.should_run?' do
    after { Timecop.return }

    context 'weekday_only: true の場合' do
      it '平日（金曜日）の場合、trueを返すこと' do
        friday = Time.parse("2025-08-08")
        Timecop.freeze(friday)
        expect(SinchokuManager.should_run?(Time.now, weekday_only: true)).to be true
      end

      it '休日（土曜日）の場合、falseを返すこと' do
        saturday = Time.parse("2025-08-09")
        Timecop.freeze(saturday)
        expect(SinchokuManager.should_run?(Time.now, weekday_only: true)).to be false
      end
    end

    context 'weekday_only: false の場合' do
      it '平日（金曜日）の場合、trueを返すこと' do
        friday = Time.parse("2025-08-08")
        Timecop.freeze(friday)
        expect(SinchokuManager.should_run?(Time.now, weekday_only: false)).to be true
      end

      it '休日（土曜日）の場合でも、trueを返すこと' do
        saturday = Time.parse("2025-08-09")
        Timecop.freeze(saturday)
        expect(SinchokuManager.should_run?(Time.now, weekday_only: false)).to be true
      end
    end
  end

  # --- 通知処理が呼び出されるかをテスト ---
  describe '.perform_check' do
    it 'DiscordNotifier.sendメソッドを正しい引数で呼び出すこと' do
      # 1. 偽のDiscordNotifierを用意し、「send」という命令を待つ状態にする
      allow(DiscordNotifier).to receive(:send)

      # 2. テストに使うダミーのターゲット情報を作成
      sample_target = {
        'name' => 'test_job',
        'webhook_url' => 'https://example.com/webhook',
        'message' => 'テストメッセージ'
      }

      # 3. 実際に通知処理を実行する
      SinchokuManager.perform_check(sample_target)

      # 4. DiscordNotifierのsendが、正しいURLとメッセージで呼び出されたかを確認
      expect(DiscordNotifier).to have_received(:send).with(
        'https://example.com/webhook',
        'テストメッセージ'
      )
    end
  end
end