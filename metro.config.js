const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('onnx')) {
  config.resolver.assetExts.push('onnx');
}

module.exports = config;
