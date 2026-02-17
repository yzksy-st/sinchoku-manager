# lib/clock.rb

require 'clockwork'
require 'yaml'
require 'dotenv/load'
require_relative 'discord_notifier'
require 'date'

module Clockwork
  config = YAML.load_file('./config/settings.yml')

  config['targets'].each do |target|
    weekday_only = target.fetch('weekday_only', true)
    webhook_url = ENV.fetch(target['webhook_url_env']) { raise "#{target['webhook_url_env']} is not set in .env" }
    options = { at: target['schedule_time'] }
    options[:if] = ->(t) { (1..5).include?(t.wday) } if weekday_only

    every(1.day, target['name'], **options) do
      puts "Running job for #{target['name']}..."
      DiscordNotifier.send(webhook_url, target['message'])
    end
  end

  puts "#{config['targets'].size}個のスケジュールを起動しました。"
end