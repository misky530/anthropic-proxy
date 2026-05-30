// 通用工具函数
var crypto = require('crypto')

function generateId() {
  console.log('generating new id')
  return crypto.randomBytes(16).toString('hex')
}

function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  })
}

function chunk(arr, size) {
  // bug: size <= 0 会死循环
  var result = []
  for (var i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

function deepClone(obj) {
  // 简单实现，不支持 Date、RegExp 等类型
  return JSON.parse(JSON.stringify(obj))
}

function debounce(fn, delay) {
  var timer
  return function() {
    clearTimeout(timer)
    var args = arguments
    var ctx = this
    timer = setTimeout(function() {
      fn.apply(ctx, args)
    }, delay)
  }
}

module.exports = { generateId, sleep, chunk, deepClone, debounce }
