require 'csv'
require 'json'

file = File.read("./data.csv")
csv = CSV.new(file, :headers => true, :header_converters => :symbol, :converters => :all)
puts csv.to_a.map {|row| row.to_hash.to_json + "," }

