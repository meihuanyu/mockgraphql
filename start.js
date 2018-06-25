require('babel-core/register')({
    'presets': [
      'stage-3'
    ]
  })
  
  require('babel-polyfill')
  require('./src/index')