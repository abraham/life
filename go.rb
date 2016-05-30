require 'pry'
require 'sinatra'
require 'sinatra-websocket'
require 'json'
require 'tilt/erubis'
require_relative 'lib/space'
require_relative 'lib/cell'

set :server, 'thin'
set :sockets, []

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
          if data['action'] == 'start'
            push result: 'Starting ticks'
            space = Space.new(layers: 3)

            space.future
            push result: 'coordinates', data: space.cells
          else
            push error: 'Unknown command'
          end
        rescue JSON::ParserError
          push error: 'Unable to parse JSON'
        end
      end

      ws.onclose do
        warn('websocket closed')
        settings.sockets.delete(ws)
      end
    end
  else
    status 400
    json error: 'Connection type not supported'
  end
end

private

def json(msg)
  content_type 'application/json'
  JSON.dump msg
end

def push(msg)
  EM.next_tick do
    settings.sockets.each { |socket| socket.send(JSON.dump(msg)) }
  end
end
