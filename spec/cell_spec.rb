require 'spec_helper'

describe Cell do
  let(:x) { Faker::Number.between(-999, 999) }
  let(:y) { Faker::Number.between(-999, 999) }
  let(:z) { Faker::Number.between(-999, 999) }
  let(:living_cell) { Cell.new(be: :alive, x: x, y: y, z: z) }
  let(:dead_cell) { Cell.new(x: x, y: y, z: z) }

  context '#initialize' do
    it 'should accept a living state' do
      expect { Cell.new(be: :alive, x: x, y: y, z: z) }.to_not raise_error
    end

    it 'should require coordinates' do
      expect { Cell.new }.to raise_error(ArgumentError)
    end

    it 'should stash the coordinates' do
      expect(living_cell.instance_variable_get(:@x)).to eq(x)
    end

    it 'should default to being dead' do
      expect(Cell.new(x: x, y: y, z: z).alive?).to be_falsey
    end
  end

  context '#alive?' do
    it 'should return the current living state' do
      expect(living_cell.alive?).to be_truthy
      expect(dead_cell.alive?).to be_falsey
    end
  end

  context '#die' do
    it 'should kill the cell' do
      expect(living_cell.alive?).to be_truthy
      expect(living_cell.die.tick.alive?).to be_falsey
      expect(dead_cell.die.tick.alive?).to be_falsey
    end
  end

  context '#reanimate' do
    it 'should bring the cell back to life' do
      expect(dead_cell.reanimate.tick.alive?).to be_truthy
      expect(living_cell.reanimate.tick.alive?).to be_truthy
    end
  end

  context '#coordinates_key' do
    it 'should return the coordinates in a string format' do
      expect(living_cell.coordinates_key).to eq("#{x}:#{y}:#{z}")
    end
  end

  context '#coordinates_of_neighbors' do
    it 'should return the coordinates of neighbors' do
      expect(living_cell.coordinates_of_neighbors.count).to eq(26)
      expect(living_cell.coordinates_of_neighbors.all? do |coord|
        coord.count == 3 &&
        coord[0].between?(x - 1, x + 1) &&
        coord[1].between?(y - 1, y + 1) &&
        coord[2].between?(z - 1, z + 1)
      end).to be_truthy
    end
  end

  context '#neighbors_keys' do
    xit 'should return the coordinates keys of neighbors' do
    end
  end
end
