class Cell
  def initialize(be: :dead, x:, y:, z:)
    @state = be
    @x = x
    @y = y
    @z = z
  end

  def alive?
    @state == :alive
  end

  def to_s
    alive?.to_s
  end

  def be(state)
    die if state == :dead
    reanimate if state == :alive

    @future != @state
  end

  def die
    @future = :dead
    self
  end

  def reanimate
    @future = :alive
    self
  end

  def tick
    if @future
      @state = @future
      @future = nil
      self
    end
  end

  def coordinates_key
    "#{@x}:#{@y}:#{@z}"
  end

  def neighbors_keys
    coordinates_of_neighbors.map do |neighbor|
      "#{neighbor[0]}:#{neighbor[1]}:#{neighbor[2]}"
    end
  end

  def coordinates_of_neighbors
    ((@x - 1)..(@x + 1)).map do |x|
      ((@y - 1)..(@y + 1)).map do |y|
        ((@z - 1)..(@z + 1)).map do |z|
          [x, y, z] if (x != @x || y != @y || z != @z)
        end
      end
    end.flatten(2).compact
  end
end
