import { combineReducers } from 'redux';
import DataReducer from './links-reducer';

const reducers = {
  dataReducer: DataReducer
}

const rootReducer = combineReducers(reducers);

export default rootReducer;