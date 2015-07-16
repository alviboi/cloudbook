/*
	this config file is used to configure the nw-ninja envelope, not the app itself
*/
var rc = require('rc')

module.exports = rc('cloudbook-dev', {
	appDir: './src',
	files: './src/**/**', // use the glob format
    platforms: [ 'linux32','linux64'],
    buildDir: './webkitbuilds',
    buildType: 'default',
    version: 'v0.12.0',
    extraffmpegpath:'/usr/lib/chromium-browser/libffmpegsumo.so', //This ffmpeg must support aac/ac3/mpeg4audio/h264/mov/mp3
    argv: process.argv.slice(2)
})
