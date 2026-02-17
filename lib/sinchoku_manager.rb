# lib/sinchoku_manager.rb

require 'date'
require_relative 'discord_notifier'

class SinchokuManager
  # 実行すべきかどうかを判断するロジック
  # weekday_only: true → 平日のみ実行、false → 毎日実行
  def self.should_run?(time, weekday_only: true)
    return true unless weekday_only

    # 0=日, 1=月, 2=火, 3=水, 4=木, 5=金, 6=土
    (1..5).include?(time.wday)
  end

  # 実際に通知を送るロジック
  def self.perform_check(target)
    puts "Running job for #{target['name']}..."
    DiscordNotifier.send(target['webhook_url'], target['message'])
  end
end