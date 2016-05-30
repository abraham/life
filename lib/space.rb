require 'pry'
require_relative 'cell'

class Space
  LIKELIHOOD_OF_STARTING_ALIVE = 75
  STAYIN_ALIVE = [4].freeze
  GOOD_NEIGHBOR_COUNT = [5, 6, 7].freeze
  X = 0
  Y = 0
  Z = 0

  attr_reader :cells

  def initialize(layers: 13)
    @cells = {}
    @layers = layers
    create_primary_cell
    setup
  end

  def to_json
    JSON.dump(@cells)
  end

  def randomish_state
    rand(100) <= LIKELIHOOD_OF_STARTING_ALIVE ? :alive : :dead
  end

  def setup
    start_index = -1 * @layers
    end_index = @layers
    (start_index..end_index).each do |x|
      (start_index..end_index).each do |y|
        (start_index..end_index).each do |z|
          state = randomish_state
          cell = Cell.new(be: state, x: x, y: y, z: z)
          # puts "#{cell.alive?} vs #{state}"
          add_cell(cell)
        end
      end
    end
  end

  def display
    start_index = -1 * @layers
    end_index = @layers
    grid = []
    (start_index..end_index).map do |x|
      grid[x + @layers] = ''
      (start_index..end_index).map do |y|
        # puts "#{x}:#{y}:#{@layers}:#{@cells["#{x}:#{y}:#{@layers}"].alive?}"
        grid[x + @layers] << (@cells["#{x}:#{y}:#{@layers}"].alive? ? '*' : ' ')
      end
    end
    puts grid
    puts '======================='
    future
  end

  def future
    @cells.each do |_key, cell|
      living = number_of_living_neighbors(cell.neighbors_keys)
      future_state = suggest_state(living, cell.alive?)
      cell.be(future_state) if future_state
    end
    tick
  end

  def tick
    @cells.each { |_key, cell| cell.tick }
    # display
  end

  def cell_alive?(key)
    true if @cells[key] && @cells[key].alive?
  end

  private

  def number_of_living_neighbors(keys)
    keys.map { |key| cell_alive?(key) }.compact.count
  end

  def suggest_state(living_neighbors, alive)
    if alive
      if living_neighbors <= 1 || living_neighbors >= 8
        :dead
      else
        :alive
      end
    else
      if living_neighbors == 5
        :alive
      else
        :dead
      end
    end

    # if STAYIN_ALIVE.include?(living_neighbors) && alive
    #   :alive
    # elsif GOOD_NEIGHBOR_COUNT.include?(living_neighbors)
    #   :alive
    # else
    #   :dead
    # end

    # if living <= 1
    #   :dead
    # elsif living == 5
    #   :alive
    # elsif living >= 8
    #   :dead
    # end
  end

  def add_cell(cell)
    # puts "adding cell with #{cell.alive?}"
    @cells[cell.coordinates_key] = cell
  end

  def create_primary_cell
    add_cell(Cell.new(be: randomish_state, x: X, y: Y, z: Z))
  end
end
