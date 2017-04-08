//扫描二维码后执行的函数
var img = null;
var blist = [];
var arr = [];

function scaned(t, r, f) {
	window.localStorage.setItem('r', r);
	arr.push(r);
	var html = "<div class='hdata'>" + r + "<a class='del_btn'>删除</a></div>";
	$("#history1").find(".ditem1").append(html);
}
//删除每条扫码数据
$(function() {
	$('#history1').on('click', '.del_btn', function() {
		$(this).parent(".hdata").remove();
		$(this).parent('.hdata').fadeOut(500)
	});
});
function selected(id) {
	var h = blist[id];
	update(h.type, h.result, h.file);
	if(h.result.indexOf("http://") == 0 || h.result.indexOf("https://") == 0) {
		plus.nativeUI.confirm(h.result, function(i) {
			if(i.index == 0) {
				plus.runtime.openURL(h.result);
			}
		}, "", ["打开", "取消"]);
	} else {
		plus.nativeUI.alert(h.result);
	}
}
//点击清空执行的函数
function cleanHistroy() {
	var aDiv = $("#clearAll");
	aDiv.click(function() {
		$(".hdata").remove();
	});
}

function onempty() {
	if(window.plus) {
		plus.nativeUI.alert('无扫描记录');
	} else {
		alert('无扫描记录');
	}
}
var ws = null,
	wo = null;
var scan = null,
	domready = false,
	bCancel = false;
// H5 plus事件处理
function plusReady() {
	if(ws || !window.plus || !domready) {
		return;
	}
	// 获取窗口对象
	ws = plus.webview.currentWebview();
	wo = ws.opener();
	// 开始扫描
	ws.addEventListener('show', function() {
		//var filter = [plus.barcode.CODE39,plus.barcode.CODE93];
		scan = new plus.barcode.Barcode('bcid', {
			frameColor: '#00FF00',
			scanbarColor: '#00FF00'
		});
		scan.onmarked = onmarked;
		scan.start({
			conserve: true,
			filename: "_doc/barcode/"
		});
	});
	// 显示页面并关闭等待框
	ws.show("pop-in");
	wo.evalJS("closeWaiting()");
}
if(window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}
// 监听DOMContentLoaded事件
document.addEventListener("DOMContentLoaded", function() {
	domready = true;
	plusReady();
}, false);
// 二维码扫描成功
function onmarked(type, result, file) {
	window.localStorage.setItem('result', result);
	if(type == plus.barcode.QR) { //二维码
		var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
		if(reg.test(result)) { //扫描结果为 url连接
			scan.close();
			window.location.href = result;
		} else {
			try {

				var dtype = result.split(';')[1].split('=')[1];
				switch(dtype.toLowerCase()) {
					case "qr_login":
						{ //登录
							scan.close(); //关闭摄像头
							qrlogin(result);
							return;
						}
						break;
					default:
						{

						}
						break;
				}
			} catch(e) {
				plus.nativeUI.toast('二维码无法识别');
				
			}
		}
	} else { //条码
		wo.evalJS("scaned('" + type + "','" + result + "','" + file + "');");
	  back();
	}
	
}
//登录
function qrlogin(result) {
	var uuId = result.split(';')[0].split('=')[1];
	var AdminId = 3134; // localStorage.AdminId;
	window.localStorage.uuid = uuId;
	$.xiaodie.ajax({
		url: "/Login/ScanComplete",
		type: "post",
		data: {
			uuid: uuId,
			adminId: AdminId
		},
		success: function(data) {
			if(data.ResultType == 3) {
				window.location.href = '../login/login.html';
			}else{
				plus.nativeUI.toast(data.Message);
			}
		},
		error: function(data) {
			alert(JSON.stringify(data))
		}
	})
}
//点击发送执行的函数
function sendmassage() {
	//var AdminId = localStorage.AdminId;
	var AdminId = 3134;
	$.xiaodie.ajax({
		url: "/Msg/SendBarCodeInfo",
		type: "post",
		data: {
			barcode: arr,
			AdminId: AdminId
		},
		success: function(data) {
			if(data.ResultType == "3") {
				if(window.localStorage) {
					window.localStorage.clear();
					$("#nohistory1").empty();
				}
			} else {
				showMsg(data.Message)
			}
		},
		error: function(data) {
			console.log(JSON.stringify(data));
		}
	});
}

// 从相册中选择二维码图片 
function scanSwitch() {
	if(bCancel) {
		scan.start({
			conserve: true,
			filename: "_doc/barcode/"
		});
		btCancel && (btCancel.innerText = '暂　停');
	} else {
		scan.cancel();
		btCancel && (btCancel.innerText = '开　始');
	}
	bCancel = !bCancel;
}

function showMsg(msg) {
	$(".warmPromptBg,.warmSure").show();
	$(".warmPrompt .xinXi").html(msg);

	$(".hideWarm").click(function() {
		$(".warmPromptBg,.warmSure").hide();
	});
}
//ajax

var hostTest = "http://11.1.1.111:40880";//"http://11.1.1.111:8012/",http://0-fashion.com/;
var hostServer = "http://0-fashion.imwork.net:40880";
//var isTestApi=true;
var isTestApi=false;
(function($) {
    $.xiaodie = $.xiaodie || {
        version : 1.0
    };
    if(isTestApi){
     	$.xiaodie.host=hostTest;
    }else{
    	$.xiaodie.host=hostServer;
    }
     FastClick.attach(document.body);
})(jQuery);

(function($) {
    var $xiaodie = $.xiaodie;
    $xiaodie.ajax = function(options) {
        var successEvent = options.success;
        var errorEvent = options.error;
        var completeEvent = options.complete;
        var beforeSendEvent = options.beforeSend;
        var url = options.url;
        if ((url || "").indexOf("http") == -1) {
            url = $xiaodie.host + url;
        }
        $.ajax({
            url : url,
            type : options.type || "get",
            data : options.data,
            async : options.async || true,
            jsonp : options.jsonp,
            timeout : options.timeout || 20000,
            contentType : options.contentType || "application/x-www-form-urlencoded",
            dataType : options.dataType || "json",
            cache : options.cahce || false,
            beforeSend : function() {
                if ($.isFunction(beforeSendEvent)) {
                   return beforeSendEvent();
                }
            },
            success : function(data) {
                if ($.isFunction(successEvent)) {
                    successEvent(data);
                }
            },
            complete : function(a, b) {
                if ($.isFunction(completeEvent)) {
                    completeEvent(a, b);
                }
            },
            error : function(a, b, c) {
                if ($.isFunction(errorEvent)) {
                    errorEvent(a, b, c);
                }
            }
        });
    };
    $.xiaodie.post = function(url, data, successEvent,errorEvent) {
        $xiaodie.ajax({
            url : url,
            type : "post",
            data : data,
            success : successEvent,
            error:errorEvent
        });
    }
    $.xiaodie.get = function(url, data, successEvent,errorEvent) {
        $xiaodie.ajax({
            url : url,
            type : "get",
            data : data,
            success : successEvent,
            error:errorEvent
        });
    }
})(jQuery);
