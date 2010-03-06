require 'optparse'
require 'yaml'

require 'hotspotlogin/constants'

module HotSpotLogin

  @@config = DEFAULT_CONFIG unless class_variable_defined? :@@config

  def self.config; @@config; end

  def self.config=(h) 
    @@config = h

    # Now, set the Sinatra App
    App.set :host,    @@config['listen-address']
    App.set :port,    @@config['port']
    App.set :logging, @@config['log-http']
  end

  # Parses command line and configuration file
  def self.config!
    OptionParser.new do |opts|
      opts.banner = "Usage: #{$0} [options]"

      # Configuration file, if specified.

      opts.on('--conf FILE', 'configuration file') do |filename|
        @@config['conf'] = filename
        @@config.merge! YAML.load(File.read filename) 
      end

      # Command line switches override configuration file.

      opts.on('--uamsecret PASS', 'as in chilli.conf(5)') do |uamsecret|
        @@config['uamsecret'] = uamsecret
      end

      opts.on('--[no-]userpassword', 'like setting $userpassword=1 in hotspotlogin.cgi') do |userpassword|
        @@config['userpassword'] = userpassword
      end

      opts.on('--port PORT', 'TCP port to listen on') do |port|
        @@config['port'] = port.to_i
      end

      opts.on('--listen-address ADDR', 'IP address or hostname to listen on') do |addr|
        @@config['listen-address'] = addr
      end

      opts.on('--[no-]log-http', 'output an Apache-like log') do |log|
        @@config['log-http'] = log
      end

    end.parse!

   
  end
    
end
