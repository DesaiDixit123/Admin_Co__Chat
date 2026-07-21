import { combineReducers } from "redux";

// This will import all files ending with _Reducer.js in the current directory (and subfolders)
const modules = import.meta.glob("./**/*_Reducer.js", { eager: true });

const allReducers = {};

for (const path in modules) {
  const module = modules[path];
  // Each module might have multiple exports
  Object.assign(allReducers, module);
}

const reducer = combineReducers(allReducers);

export default reducer;