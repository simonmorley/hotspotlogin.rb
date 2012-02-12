require 'bundler/capistrano'
#require 'thinking_sphinx/deploy/capistrano'
load 'deploy/assets'

ssh_options[:forward_agent] = true
#set :rvm_ruby_string, '1.9.3'
$:.unshift(File.expand_path('./lib', ENV['rvm_path']))
require 'rvm/capistrano'
set :rvm_ruby_string, '1.9.3-p0'


set :user, 'ubuntu'
set :stages, %w(production playground)
set :default_stage, "production"

require 'capistrano/ext/multistage'

set :domain, 'www.polkaspots.com'
#set :applicationdir, "/var/www/html/ps-ec2-rm1"
 
set :scm, 'git'
set :repository,  "git@github.com:simonmorley/hotspotlogin.rb.git"
set :git_enable_submodules, 1 # if you have vendored rails
set :branch, 'master'
set :git_shallow_clone, 1
set :scm_verbose, true
 
# roles (servers)
role :web, domain
role :app, domain
role :db,  domain, :primary => true
 
# deploy config
#set :deploy_to, applicationdir
set :deploy_via, :remote_cache
 
# additional settings
default_run_options[:pty] = true  # Forgo errors when deploying from windows



