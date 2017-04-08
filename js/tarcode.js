//条形码js
var cleanHistroy;
var getRelute;
var flag=true;
//var ResultAry = new Array();
//mui.ready(function() {

getRelute = function(result) {

	function oneCode(result) {
//		var h = plus.webview.getLaunchWebview();
		
		var h = plus.webview.currentWebview().opener().opener();
//console.log(h);
		h.evalJS('websocket.utils.Post("' + result + '")');
		var str = "";
		str = '<div class="code_content_1">' + "扫描成功" + '</div>';
		$('#sm_code_content').append(str);
		setTimeout(function() {
			$('.code_content_1').remove();
		}, 2000)

	};
	if($("#Gallery_Toggle").hasClass("mui-active")) {
		moreCode(result);
	} else {
//		console.log("条码：" + result)
		oneCode(result);
	}

	function moreCode(result) {
		if($('.sm_code[data-result='+ result +']').length == 0||$('.sm_code[data-result='+ result +']').length=="undefind"){
			var str = "";
		str = '<li class="mui-table-view-cell "><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red">删除</a></div><div class="mui-slider-handle mui-table"><div class="sm_code" data-result="'+ result +'">' + result + '</div></div></li>';
		$('.OA_task_2').append(str);
		}else{
			mui.toast("该条码重复")
		}
		//window.localStorage.setItem('ResultAry', ResultAry);
	}
	
	//点击发送
		$("#sm_sended").unbind("click").click(function() {
			
			var ResultAry=new Array();
			$(".sm_code").each(function(i,item){
				ResultAry.push($(item).text());
			})

			//var h = plus.webview.getLaunchWebview();
			var h = plus.webview.currentWebview().opener().opener();
			//	window.localStorage.getItem('ResultAry', ResultAry);
			h.evalJS('websocket.utils.Post("' + ResultAry + '")');
			$(".OA_task_2 ").html("");
			
		});
		
		$("#sm_form_sended").unbind("click").click(function() {
			
			var ResultAry=new Array();
			$(".sm_code").each(function(i,item){
				ResultAry.push($(item).text());
			})

			//var h = plus.webview.getLaunchWebview();
			var h = plus.webview.currentWebview().opener().opener();
			h.evalJS("websocket.utils.Post('"+ResultAry+"','"+flag+"')");
			$(".OA_task_2 ").html("");
			
		});
		
	//点击清空执行的函数
	cleanHistroy = function() {
		var aDiv = $("#sm_clear");
		aDiv.click(function() {
			$(".OA_task_2 li").remove();
		});
	};

	//控制批量和扫描
	var slider = document.getElementById('Gallery');
	var group = slider.querySelector('.mui-slider-group');
	var items = mui('.sm_item', group);
	//克隆第一个节点
	var first = items[0].cloneNode(true);
	first.classList.add('mui-slider-item-duplicate');
	//克隆最后一个节点
	var last = items[items.length - 1].cloneNode(true);
	last.classList.add('mui-slider-item-duplicate');
	//处理是否循环逻辑，若支持循环，需支持两点：
	//1、在.mui-slider-group节点上增加.mui-slider-loop类
	//2、重复增加2个循环节点，图片顺序变为：N、1、2...N、1
	var sliderApi = mui(slider).slider();

}







//条码去重
function unique(arr) {
	var newArr = [];
	for(var i = 0, len = arr.length; i < len; i++) {
		for(var j = i + 1; j < len; j++) {
			if(arr[i] === arr[j]) { //获取没重复的最右一值放入新数组
				++i;
			}
		}
		newArr.push(arr[i]);
	}
	return newArr;
}
window.toggleLoop = function(loop) {

	if(loop == false) {
		//$('#Gallery_Toggle').removeClass("mui-active")
		$(".slide_box_1").css({
			"display": "block"

		});
		$(".slide_box_2").css({
			"display": "none"
		});

	} else {
		//$('#Gallery_Toggle').addClass("mui-active")
		$(".slide_box_2").css({
			"display": "block"

		});
		$(".slide_box_1").css({
			"display": "none"
		});

	}
}

//按下“循环”按钮的处理逻辑；
mui.ready(function() {
	document.getElementById('Gallery_Toggle').addEventListener('toggle', function(e) {

		var loop = e.detail.isActive;
		toggleLoop(loop);

	});
})

//		删除功能
mui.init({
	swipeBack: true //启用右滑关闭功能
});

	