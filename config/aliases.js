const path = require('path');

const aliases = {
  root: path.resolve(__dirname, '../'),
  src: path.resolve(__dirname, '../src/'),
  assets: path.resolve(__dirname, '../src/assets'),
  core: path.resolve(__dirname, '../src/core'),
  services: path.resolve(__dirname, '../src/services'),
  features: path.resolve(__dirname, '../src/features'),
  globalstyles: path.resolve(__dirname, '../src/globalstyles'),
  Layouts: path.resolve(__dirname, '../src/Layouts'),
  App: path.resolve(__dirname, '../src/App'),
  OldFlow: path.resolve(__dirname, '../src/OldFlow'),
  FlowBuilder: path.resolve(__dirname, '../src/FlowBuilder')
};

module.exports = aliases;
