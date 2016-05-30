require 'sinatra'
require 'sinatra-websocket'
require 'json'
require 'tilt/erubis'
require_relative 'lib/space'
require_relative 'lib/cell'

set :server, 'thin'
set :sockets, []
set :spaces, []

get '/' do
  erb :index
end

get '/live' do
  if request.websocket?
    request.websocket do |ws|
      ws.onopen do
        ws.send(JSON.dump(result: 'Hello World!'))
        settings.sockets << ws
      end

      ws.onmessage do |msg|
        begin
          data = JSON.parse msg
          action = data['action']
          if action == 'start'
            puts 'action = start'
            push result: 'Starting ticks'
            space = Space.new(layers: data['layers'].to_i || 13,
                              fill_percent: data['fillPercent'] || 75)

            space.future
            set_space ws, space
            push result: 'coordinates', data: space.cells
          elsif action == 'tick'
            puts 'tick'
            space = get_space ws
            space.future
            push result: 'coordinates', data: space.cells
          elsif action == 'stop'
            index = settings.sockets.index(ws)
            settings.spaces.delete_at(index)
            settings.sockets.delete(ws)
          else
            push error: 'Unknown command'
          end
        rescue JSON::ParserError
          push error: 'Unable to parse JSON'
        end
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
  settings.spaces[index]
end

def set_space(ws, space)
  index = settings.sockets.index(ws)
  settings.spaces[index] = space
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
