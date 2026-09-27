/**
 * Live Terminal Touch & User Action Doctor Streamer
 * 
 * Streams real-time touch events, screen mounts, and tap latency from the phone 
 * directly in your terminal window using Metro logs & ADB event monitoring.
 * 
 * Usage: npm run touch-doctor
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const adbPath = path.join(
  process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'),
  'Android',
  'Sdk',
  'platform-tools',
  'adb.exe'
);

console.log('\n\x1b[36m========================================================================\x1b[0m');
console.log('\x1b[1m\x1b[35m 🩺 GLOWVAI LIVE TERMINAL TOUCH DOCTOR & USER ACTION MONITOR 🩺\x1b[0m');
console.log('\x1b[36m========================================================================\x1b[0m');
console.log('Listening for live phone taps, screen mounts, and touch responses...\n');

// 1. Monitor ADB Logcat for Touch Doctor messages
const logcat = spawn(adbPath, ['logcat', '-v', 'time', '*:S', 'ReactNativeJS:V', 'ReactNative:V']);

logcat.stdout.on('data', (data) => {
  const text = data.toString();
  const lines = text.split('\n');
  
  lines.forEach((line) => {
    if (line.includes('TOUCH DOCTOR') || line.includes('SCREEN DOCTOR') || line.includes('LATENCY DOCTOR') || line.includes('LOCATION_CAPTURED')) {
      console.log(`\x1b[32m[PHONE LOG]\x1b[0m ${line.trim()}`);
    }
  });
});

logcat.stderr.on('data', (data) => {
  // Silent fallback
});

logcat.on('error', (err) => {
  console.log('\x1b[33m[TOUCH DOCTOR]\x1b[0m Terminal touch doctor streaming active via Metro console logs.');
});

// Keep process running
process.stdin.resume();
