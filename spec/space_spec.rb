require 'spec_helper'

describe Space do
  let(:layers) { Faker::Number.number(1).to_i }
  let(:space) { Space.new(layers: layers) }

  context '#initialize' do
    it 'should take the number of layers' do
      expect { Space.new(layers: layers) }.to_not raise_error
    end

    it 'should default to 13 layers' do
      expect(Space.new.instance_variable_get(:@layers)).to eq(13)
    end

    it 'should keep the number of layers' do
      expect(space.instance_variable_get(:@layers)).to eq(layers)
    end
  end

  context '#create_primary_cell' do
    it 'should create a primary cell at grid 0:0:0' do
      expect(space.instance_variable_get(:@cells)['0:0:0']).to_not be_nil
      expect(space.instance_variable_get(:@cells)['0:0:0'].class).to eq(Cell)
      expect(space.instance_variable_get(:@cells)['0:0:0'].coordinates_key).to eq('0:0:0')
    end
  end

  context '#setup' do
    it 'should create a full grid' do
      expect(space.instance_variable_get(:@cells).count).to eq((layers * 2 + 1)**3)
      expect(space.instance_variable_get(:@cells)['0:0:0'].class).to eq(Cell)
      expect(space.instance_variable_get(:@cells)["#{layers}:#{layers}:#{layers}"].class).to eq(Cell)
      negative_layers = -1 * layers
      expect(space.instance_variable_get(:@cells)["#{negative_layers}:#{negative_layers}:#{negative_layers}"].class).to eq(Cell)
    end
  end

  context '#cell_alive?' do
    let(:x) { Faker::Number.between(-999, 999) }
    let(:y) { Faker::Number.between(-999, 999) }
    let(:z) { Faker::Number.between(-999, 999) }
    let(:living_cell) { Cell.new(be: :alive, x: x, y: y, z: z) }
    let(:dead_cell) { Cell.new(x: x, y: y, z: z) }

    it 'should return true if a cell is alive' do
      space.instance_variable_set(:@cells, living_cell.coordinates_key => living_cell)
      expect(space.cell_alive?(living_cell.coordinates_key)).to be_truthy
    end

    it 'should return false if a cell is dead' do
      space.instance_variable_set(:@cells, dead_cell.coordinates_key => dead_cell)
      expect(space.cell_alive?(dead_cell.coordinates_key)).to be_falsey
    end

    it 'should return nil if a there is no cell' do
      space.instance_variable_set(:@cells, {})
      expect(space.cell_alive?(living_cell.coordinates_key)).to be_nil
    end
  end

  context '#suggest_state' do
    it 'should return the state based on living neighbors' do
      expect(space.send(:suggest_state, 0, true)).to eq(:dead)
      expect(space.send(:suggest_state, 1, true)).to eq(:dead)
      expect(space.send(:suggest_state, 2, true)).to eq(:dead)
      expect(space.send(:suggest_state, 3, true)).to eq(:alive)
      expect(space.send(:suggest_state, 4, false)).to eq(:dead)
      expect(space.send(:suggest_state, 4, true)).to eq(:alive)
      expect(space.send(:suggest_state, 5, true)).to eq(:alive)
      expect(space.send(:suggest_state, 6, true)).to eq(:alive)
      expect(space.send(:suggest_state, 7, true)).to eq(:alive)
      expect(space.send(:suggest_state, 8, true)).to eq(:dead)
      expect(space.send(:suggest_state, 9, true)).to eq(:dead)
    end
  end
end
