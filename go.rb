require 'sinatra'
require 'sinatra-websocket'
require 'json'
require 'tilt'
require_relative 'lib/space'
require_relative 'lib/cell'

set :server, 'thin'
set :sockets, []
set :spaces, []

get '/' do
  erb :index
end

get '/bower_components/*' do |sub_path|
  content_type 'application/javascript' if sub_path.end_with?('.js')

  path = File.join(settings.root, 'bower_components', sub_path)
  File.read(File.expand_path(path))
end

get '/live' do
  if request.websocket?
    request.websocket do |ws|
      ws.onopen do
        ws.send(JSON.dump(result: 'Hello World!'))
        settings.sockets << ws
      end

      ws.onmessage do |msg|
        beginning_time = Time.now

        begin
          data = JSON.parse msg
          action = data['action']
          if action == 'start'
            push result: 'starting-ticks'
            space = Space.new(layers: data['layers'].to_i || 13,
                              fill_percent: data['fillPercent'] || 75)

            space.future
            space.tick
            set_space ws, space
            push result: 'coordinates', data: space.changed_cells
          elsif action == 'tick'
            space = get_space ws
            if space
              space.future
              space.tick
              push result: 'coordinates', data: space.changed_cells
            end
          elsif action == 'stop'
            index = settings.sockets.index(ws)
            settings.spaces.delete_at(index) if index
          else
            push error: 'Unknown command'
          end
        rescue JSON::ParserError
          push error: 'Unable to parse JSON'
        end

        end_time = Time.now
        puts "#{(end_time - beginning_time) * 1000} milliseconds onmessage #{msg}"
      end

      ws.onclose do
        warn('websocket closed')
        index = settings.sockets.index(ws)
        settings.spaces.delete_at(index) if index
        settings.sockets.delete(ws)
      end
    end
  else
    status 400
    json error: 'Connection type not supported'
  end
end

private


def get_space(ws)
  index = settings.sockets.index(ws)
  settings.spaces[index] if index
end

def set_space(ws, space)
  index = settings.sockets.index(ws)
  settings.spaces[index] = space if index
end

def json(msg)
  content_type 'application/json'
  JSON.dump msg
end

def push(msg)
  EM.next_tick do
    settings.sockets.each { |socket| socket.send(JSON.dump(msg)) }
  end
end
