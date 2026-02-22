module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      // REMOVE "nativewind/babel" from here
      plugins: [], 
    };
  };