require 'pry'
require_relative 'cell'

class Space
  LIKELIHOOD_OF_STARTING_ALIVE = 75
  DEFAULT_LAYERS = 13
  X = 0
  Y = 0
  Z = 0

  WXYZ_RULES = [3, 4, 5, 6].freeze
  # WXYZ_RULES = [4, 5, 5, 5].freeze
  # WXYZ_RULES = [2, 3, 3, 4].freeze
  # WXYZ_RULES = [5, 7, 6, 6].freeze

  attr_reader :cells, :changed_cells

  def initialize(layers: DEFAULT_LAYERS, fill_percent: LIKELIHOOD_OF_STARTING_ALIVE)
    @cells = {}
    @changed_cells = {}
    @layers = layers
    @fill_percent = fill_percent
    create_primary_cell
    setup
  end

  def to_json
    JSON.dump(@cells)
  end

  def randomish_state
    rand(100) >= @fill_percent ? :alive : :dead
  end

  def setup
    start_index = -1 * @layers
    end_index = @layers
    (start_index..end_index).each do |x|
      (start_index..end_index).each do |y|
        (start_index..end_index).each do |z|
          state = randomish_state
          cell = Cell.new(be: state, x: x, y: y, z: z)
          add_cell(cell)
        end
      end
    end
  end

  def future
    @changed_cells = {}
    @cells.each do |key, cell|
      living = number_of_living_neighbors(cell.neighbors_keys)
      future_state = suggest_state(living, cell.alive?)
      @changed_cells[key] = cell if cell.be(future_state)
    end
  end

  def tick
    @changed_cells.each { |_key, cell| cell.tick }
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
      if WXYZ_RULES[0] <= living_neighbors && living_neighbors <= WXYZ_RULES[1]
        :alive
      else
        :dead
      end
    else
      if WXYZ_RULES[2] <= living_neighbors && living_neighbors <= WXYZ_RULES[3]
        :alive
      else
        :dead
      end
    end
  end

  def add_cell(cell)
    @cells[cell.coordinates_key] = cell
  end

  def create_primary_cell
    add_cell(Cell.new(be: randomish_state, x: X, y: Y, z: Z))
  end
end
