import { config, Flight, FlightsTypes } from 'real-time-flight-lib';
import bigml= require('bigml') ;

const connection = new bigml.BigML();

// creating a set of source, dataset and model objects
export const crateBigMlObject = () => {
  const source = new bigml.Source();
  source.create('./data/iris.csv', function(error, sourceInfo) {
    if (!error && sourceInfo) {
      const dataset = new bigml.Dataset();
      dataset.create(sourceInfo, function(error, datasetInfo) {
        if (!error && datasetInfo) {
          const model = new bigml.Model();
          model.create(datasetInfo, function(error, modelInfo) {
            if (!error && modelInfo) {
              const prediction = new bigml.Prediction();
              prediction.create(modelInfo, {'petal length': 1});
            }
          });
        }
      });
    }
  });
};

export const craeteSourceBigML =() =>{

};

export const craeteDataSetBigML =() =>{

};
export const craeteModelBigML =() =>{

};
export const predictionBigML =() =>{

};