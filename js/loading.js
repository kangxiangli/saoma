//  ========== 
//  = loading加载动画的js = 
//  ========== 
	window.loadingStartTime = new Date()

var $loading = $('#loading')
	var $progress = $('#progress')
	var prg = 0

	var timer = 0
	var now = new Date() // 记录当前时间
	var timeout = 5000 // 超时时间

	window.onload = function() {
		complete();
	}

	if(now - loadingStartTime > timeout) { // 超时
		complete();
	} else {
		window.setTimeout(function() { // 未超时，则等待剩余时间
			complete();
		}, timeout - (now - loadingStartTime))
	}

function complete () {  // 封装完成进度功能
  goLoad(100, [1, 5], 10, function() {
    window.setTimeout(function() {
      $loading.delay(1000).hide()
    }, 1000)
  })
}

	function goLoad(dist, speed, delay, callback) {
		var _dist = random(dist)
		var _delay = random(delay)
		var _speed = random(speed)
		window.clearTimeout(timer)
		timer = window.setTimeout(function() {
			if(prg + _speed >= _dist) {
				window.clearTimeout(timer)
				prg = _dist
				callback && callback()
			} else {
				prg += _speed
				goLoad(_dist, speed, delay, callback)
			}

			$progress.html(parseInt(prg) + '%')
			// console.log(prg);
		}, _delay)
	}

	function random(n) {
		if(typeof n === 'object') {
			var times = n[1] - n[0]
			var offset = n[0]
			return Math.random() * times + offset
		} else {
			return n
		}
	}