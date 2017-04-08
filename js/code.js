//// 扩展API加载完毕后调用onPlusReady回调函数
//document.addEventListener("plusready", onPlusReady, false);
//// 扩展API加载完毕，现在可以正常调用扩展API
//function onPlusReady() {
//	var e = document.getElementById("scan");
//	//e.removeAttribute("disabled");
//}
var scan = null;

//function nwaiting (){
//	plus.nativeUI.showWaiting();
//}
// 从相册中选择二维码图片 
function scanPicture() {

	plus.gallery.pick(function(path) {

		// 弹出系统等待对话框
		plus.nativeUI.showWaiting("识别中...");

		plus.barcode.scan(path, onmarked, errored, [plus.barcode.QR]);
	}, function(err) {
		plus.nativeUI.toast("请选取图片");
	}, { filter: "image" });
}
// 条码识别成功事件
function onmarked(type, result, file) {
	window.localStorage.setItem('result', result);
	if(type == plus.barcode.QR) { //二维码
		//var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
		var reg = /^http([\\d\\D])*/;
		if(reg.test(result)) { //扫描结果为 url连接
			var h = plus.webview.currentWebview().opener();
			h.evalJS('websocket.utils.Post("' + result + '")');
			setTimeout(function() {
				startScan();
			}, 3000)
		} else {
			try {
				var Type = result.split(';')[1].split('=')[1];
				var Uuid = result.split(';')[0].split('=')[1];
				localStorage.Uuid = Uuid;
				switch(Type.toLowerCase()) {
					case "m_login":
						{ //登录
							var h = plus.webview.getLaunchWebview();
							h.evalJS("websocket.utils.Login()")
							//							scan.close(); //关闭摄像头
							//							setTimeout(startScan(), 1000)
							return;
						};
						break;
					default:
						{}
						break;
				}
			} catch(e) {
				alert(e.message);
			}
		}
	} else {
		//图片识别
		plus.nativeUI.closeWaiting();

		var reg = /^http([\\d\\D])*/;
		if(reg.test(result)) { //扫描结果为 url连接
			var h = plus.webview.currentWebview().opener();
			h.evalJS('websocket.utils.Post("' + result + '")');
			setTimeout(function() {
				startScan();
			}, 3000)
		}
		//ws.evalJS("scaned('" + type + "','" + result + "','" + file + "');");

	}
};

var img = null;
var blist = [];

function scaned(t, r, f) {
	//	alert(t);
	//		alert(r);
	//	alert(f);
	blist[blist.length] = {
		type: t,
		result: r,
		file: f
	};
	var Uuid = f.split(';')[0].split('=')[1];

}

//function update( t, r, f ) {
////	outSet( "扫描成功：");
////	outLine( t );r
////	outLine( r );
////	outLine( "\n图片地址："+f );
//	if ( !f || f=="null" ) {
//		img.src = "../img/barcode.png";	
//	} else {
//		
//		plus.io.resolveLocalFileSystemURL(f,function(entry){
//			alert(3)
//			img.src=entry.toLocalURL();
//		});
//		//img.src = "http://localhost:13131/"+f;
//	}
//}

function errored(error) {
	plus.nativeUI.alert("无法识别此图片");
}

function closeScan() {
	scan.close();
}

function startScan() {
	scan.start();
}
// 创建扫描控件
function startRecognize() {
	var filter = [plus.barcode.QR];
	scan = new plus.barcode.Barcode('bcid', filter, {
		frameColor: 'rgba(255,255,255,255)',
		scanbarColor: '#EDEDED'
	});
	scan.onmarked = onmarked;
	startScan();
}
var ws = null,
	wc = null;
// 扩展API加载完毕，现在可以正常调用扩展API 
function plusReady() {
	ws = plus.webview.currentWebview();
	wo = ws.opener();
	showSide()
}
mui.plusReady(function() {
	plusReady()

})
// 显示侧滑页面
function showSide() {
	// 防止快速点击可能导致多次创建
	if(wc) {
		return;
	}
	// 创建mask页面
	wc = plus.webview.open("barcode_mask.html", "side", {
		top: "0",
		bottom: "50px",
		width: "100%",
		popGesture: "none",
		background: 'transparent'
	});

	// 侧滑页面加载后显示（避免白屏）
	wc.addEventListener("loaded", function() {

		wc.show("none", 0);

	}, false);
}