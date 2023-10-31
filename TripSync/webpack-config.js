const path = require('path');

module.exports = {
  // ... other webpack configuration settings ...

  resolve: {
    alias: {
      'react-native-maps': path.resolve(__dirname, '../node_modules/react-native-maps'), // For mobile
      'react-native-web-maps': '@preflower/react-native-web-maps', // For web
    },
  },
};