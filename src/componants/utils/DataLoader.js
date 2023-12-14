import * as d3 from 'd3';
// https://raw.githubusercontent.com/mirkofebbo/NEUROLIVE_DATA/main/DW_ALL_breathing.csv
class DataLoader {
    async fetchCsvData(event, day, name, type = 'csv' ){
      try {
        const response = await fetch(`https://raw.githubusercontent.com/mirkofebbo/NEUROLIVE_DATA/main/${event}_${day}_${name}.${type}`);
        const textData = await response.text();
        return d3.csvParse(textData);
      } catch (error) {
        console.error("Error fetching CSV data: ", error);
        return null;
      }
    }
}

export default DataLoader;
  