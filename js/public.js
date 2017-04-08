// 创建并显示新窗口
function openWebview(page, extras) {
	//	var w = plus.webview.open( page,page,{},"pop-in");
	//var subStyles = {
	//					top: "0px",
	//					bottom: "50px",
	//					background: "transparent"
	//				};

	var w = plus.webview.create(page, page, {}, extras);
	w.addEventListener('loaded', function() {
		plus.webview.show(w, 'pop-in', 300)
		//plus.webview.show(w)
	});
	w.addEventListener("loading", function() {
		//$('.loading_load').show().delay(4000).hide(0);
	});
	return w;
}

//open childWin
function openchildWin(page, extras) {
	var subStyles = {
		top: "0px",
		bottom: "50px",
		background: "transparent"
	};
	var nwaiting = plus.nativeUI.showWaiting();
	var w = plus.webview.open(page, page, subStyles, extras);
	w.addEventListener('loaded', function() {
		nwaiting.close();
		//plus.webview.show(w,'fade-in',300)
	});
	w.addEventListener("loading", function() {

		//$('.loading_load').show().delay(4000).hide(0);
	});
	return w;

}
// 创建并显示新窗口
function openWebviews(page, extras) {
	var subStyles = {
		top: "0px",
		bottom: "50px",
		background: "transparent"
	};
	var w = plus.webview.open(page, page, subStyles, extras);
	w.addEventListener('loaded', function() {
		//plus.webview.show(w,'pop-in',300)
	});
	w.addEventListener("loading", function() {
		//$('.loading_load').show().delay(4000).hide(0);
	});
	return w;
}

//创建主窗口
function openNewWin(html, extras, hardwareAccelerate) {
	//	var parentWebview = Webview.currentWebview();

	//如果已经创建结束函数

	var wn = null,
		// 创建新Webview窗口
		wn = plus.webview.create(html, html, {
			background: "transparent",

		}, extras);
	plus.webview.show(wn, "slide-in-right", 300);
}

//关闭自身窗口
function closeWin() {
	var ws = plus.webview.currentWebview();
	plus.webview.close(ws, 'auto');
}
//关闭自身窗口
function closeWinTo(view) {

	plus.webview.close(view, 'auto');
}