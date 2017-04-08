/*修改头像代码*/
$(function() {
	function toFixed2(num) {
		return parseFloat(+num.toFixed(2));
	}
	$('#cancleBtn').on('click', function() {
		$("#showEdit").fadeOut();
		$('#showResult').fadeIn();
	});
	$('#confirmBtn').on('click', function() {
		//debugger
		$("#showEdit").fadeOut();
		var $image = $('#report > img');
		var dataURL = $image.cropper("getCroppedCanvas");
		var imgurl = dataURL.toDataURL("image/jpeg", 0.5);
		imgurl = imgurl.replace("image/jpeg");
		//      alert(JSON.stringify(imgurl));
		$("#changeAvatar > img").attr("src", imgurl);
		$("#basetxt").val(imgurl);
		$('#showResult').fadeIn();
		var MemberId = localStorage.MemberId;
		var U_Num = localStorage.U_Num;
		//上传头像图片
		var img = convertBase64UrlToBlob(imgurl);
		var formData = new FormData();
		formData.append("file", img);
		formData.append("MemberId", MemberId);
		formData.append("U_Num", U_Num);
		mui.ajax({
			url: $.xiaodie.host + "/Members/MemberInfo/Upload",
			type: "post",
			data: formData,
			processData: false, //默认为true  对data参数进行序列化处理
			contentType: false,
			success: function(data) {
				mui.toast(data.Message);
			},
			error: function(data) {
				mui.toast("更新头像失败");
			}
		});
	});

	function cutImg() {
		$('#showResult').fadeOut();
		$("#showEdit").fadeIn();
		
		var $image = $('#report > img');
		$image.cropper({
			aspectRatio: 1 / 1,
			autoCropArea: 0.7,
			strict: true,
			guides: false,
			center: true,
			highlight: false,
			dragCrop: false,
			cropBoxMovable: false,
			cropBoxResizable: false,
			zoom: -0.2,
			checkImageOrigin: true,
			background: false,
			minContainerHeight: 400,
			minContainerWidth: 300
		});
	}

	function doFinish(startTimestamp, sSize, rst) {
		//console.log(startTimestamp, sSize, rst)
		var finishTimestamp = (new Date()).valueOf();
		var elapsedTime = (finishTimestamp - startTimestamp);
		//$('#elapsedTime').text('压缩耗时： ' + elapsedTime + 'ms');
		var sourceSize = toFixed2(sSize / 1024),
			resultSize = toFixed2(rst.base64Len / 1024),
			scale = parseInt(100 - (resultSize / sourceSize * 100));
		$("#report").html('<img src="' + rst.base64 + '" style="width: 100%;height:100%">');
		cutImg();
//			openWebview("template/dialog.html")
	}

	$('#image').on('change', function(e) {

		var startTimestamp = (new Date()).valueOf();
		var that = this;
		lrz(this.files[0], {
			width: 800,
			height: 800,
			quality: 0.7
		}).then(function(rst) {
			//console.log(rst);
			doFinish(startTimestamp, that.files[0].size, rst);
			return rst;
		}).then(function(rst) {
			// 这里该上传给后端啦
			// 伪代码：ajax(rst.base64)..

			return rst;
		}).then(function(rst) {
			// 如果您需要，一直then下去都行
			// 因为是Promise对象，可以很方便组织代码 \(^o^)/~
		}).catch(function(err) {
			// 万一出错了，这里可以捕捉到错误信息
			// 而且以上的then都不会执行

//			alert(err);
		}).always(function() {
			// 不管是成功失败，这里都会执行
		});
	});
	initData();
	//修改昵称姓名
	$("#saveRealName").on("click", function() {
		var realName = $("#name_tue").val();
//		alert(realName)
		var Flag = 0;
		//真实姓名
		if(realName == null || realName == "" || realName == undefined) {
			plus.nativeUI.toast("请填写名称");
			return false;
		} else {
			if(realName.length > 20 || realName.length < 1) {
				plus.nativeUI.toast("字符串长度1~20");
				return false
			} else {
				UpdateData({ MemberName: realName }, Flag);
			}
		}
	});
	//修改性别
	$(".woman").on("click", function() {
		var Flag = 2;
		//性别
		var gender = 1;
		//女
		$(this).removeClass("sexOp");
		$(".man").addClass("sexOp");
		//$("#man").removeAttr("checked");
		UpdateData({ Gender: gender }, Flag);
	});
	$(".man").on("click", function() {
		var Flag = 2;
		//性别
		var gender = 0;
		//男
		$(this).removeClass("sexOp");

		$(".woman").addClass("sexOp");
		//$("#woman").removeAttr("checked");
		UpdateData(gender, Flag);
	});
	//修改身份证号
	$("#saveCard").on("click", function() {
		var carInp = $("#cardNum").val();
		var Flag = 6;
		if(carInp == null || carInp == '' || carInp == undefined) {
			plus.nativeUI.toast("请填写身份证号");
			return false;
		} else {
			// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if(reg.test(carInp) === false) {
				plus.nativeUI.toast("身份证输入不合法");
				return false;
			} else {
				$(".idCard").val(carInp);
				UpdateData(carInp, Flag);
			}
		}
	})
	//修改邮箱
	$("#saveEmail").on("click", function() {
		var email = $("#id_email").val();
		var Flag = 3;
		if(email == null || email == "" || email == undefined) {
			plus.nativeUI.toast("请填写邮箱");
			return false;
		} else {
			if(email.length > 32) {
				plus.nativeUI.toast("字符串最大长度32");
				return false;
			} else {
				var patt = "^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$";
				var regex = new RegExp(patt);
				if(regex.test(email)) {
					UpdateData({ Email: email }, Flag);
				} else {
					plus.nativeUI.toast("邮箱格式错误");
					return false;
				}
			}
		}
	});

	//修改密码
	$("#savePass").on("click", function() {
		var oldPass = $("#psd").val();
		var first = $("#newpsd").val();
		var second = $("#newpsd_agin").val();
		if(oldPass == null || oldPass == "" || oldPass == undefined) {
			plus.nativeUI.toast("请填写原始密码");
			return false;
		} else {
			if(first != second) {
				plus.nativeUI.toast("两次密码不一致");
				return false
			} else {
				if(first.length > 16 || first.length < 6) {
					plus.nativeUI.toast("密码长度6~16位");
					return false
				} else {
					resetPass(oldPass, first);
				}
			}
		}
	});
	//修改手机号码
	$("#savePhone").on("click", function() {
		var Flag = 1;
		var phone = $("#phone_number").val();
		if(phone == null || phone == "" || phone == undefined) {
			plus.nativeUI.toast("请填手机号码");
			return false;
		} else {
			var patt = "(1(([3587][0-9])|(47)|[8][0126789]))\\d{8}$";
			var regex = new RegExp(patt);
			if(!regex.test(phone)) {
				plus.nativeUI.toast("请填写正确的手机号码");
				return false
			} else {
				// UpdateData(phone, Flag);
			}
		}
	});
});
//修改密码
function resetPass(oldPass, first) {
	var MemberId = localStorage.MemberId;
	var U_Num = localStorage.U_Num;
	//  alert(oldPass)
	mui.ajax({
		url: $.xiaodie.host + "/Members/MemberInfo/UpdateData",
		type: "post",
		data: {
			MemberPass: first,
			OldPass: oldPass,
			MemberId: MemberId,
			U_Num: U_Num,
			Flag: 1
		},
		success: function(data) {
		
			if(data.ResultType == 3) {
					plus.nativeUI.toast(data.Message);
				//          	alert(JSON.stringify(data))
				mui.openWindow({
					url: '../../sm_login.html',
					id: 'login',
					show: {
						aniShow: 'pop-in'
					},
					waiting: {
						autoShow: false
					}
				});
				

			} else {
				plus.nativeUI.toast(data.Message);
				return false;
			}
		},
		error: function(a) {
			plus.nativeUI.toast(a);
		}
	});
}
//初始化个人信息
var host = "http://oa.0-fashion.com";

function initData() {
	//debugger
	var MemberId = localStorage.MemberId;
	var U_Num = localStorage.U_Num;
	//  alert(MemberId)  
	if(MemberId == null || MemberId == "" || MemberId == undefined) {
		return false;
	} else {
		mui.ajax({
			url: host + "/Members/MemberInfo/GetMemberInfo",
			type: 'POST',
			data: {
				MemberId: MemberId,
				U_Num: U_Num
			},
			success: function(data) {
				//alert(JSON.stringify(data))
				if(data.ResultType == 3) {
					var MemberInfo = data.Data;
					var MemberPhoto = MemberInfo.MemberPhoto;
					window.localStorage.setItem("MemberPhoto", MemberPhoto)
					var MemberName = MemberInfo.MemberName;
					var MemberPhone = MemberInfo.MemberPhone;
					var Email = MemberInfo.Email;
					var EndTime = MemberInfo.EndTime;
					var MemberType = MemberInfo.MemberType;
					var Gender = MemberInfo.Gender;
					//1表示女，0表示男

					if(MemberPhoto == "" || MemberPhoto == null) {
						
						MemberPhoto = window.localStorage.getItem("defaultMemberPhoto");
						
					}
					if(MemberName == null ){MemberName = '添加昵称'};
					if(MemberPhone == null ){MemberPhone = '添加电话'}
					if(Email == null ){Email = '添加邮箱'}
					
					$("#changeAvatar img").attr("src", MemberPhoto);
					$(".sm_head_nav .sm_s_photo").attr("src", MemberPhoto);
					$(".header_img_box .header_img").attr("src", MemberPhoto);
					$("#adminName").html(MemberName);
					$("#true_name").html(MemberName);
					$("#name_tue").attr("value", MemberName);
					$("#number_phone").html(MemberPhone);
					$("#email_id").html(Email);
					$("#number_phone").val(MemberPhone);
					$("#phone_number").attr("value", MemberPhone);
					if(MemberPhone != null && MemberPhone != "" && MemberPhone != undefined) {
						enablePhone();
					}
					if(Gender == 1) {
						$("#sex_div .man").addClass("sexOp");
						$("#sex_div .woman").removeClass("sexOp");
						$("#woman").attr("checked", true);
					} else {
						$("#man").attr("checked", true);
						$("#sex_div .woman").addClass("sexOp");
						$("#sex_div .man").removeClass("sexOp");
					}
					$("#email_id").val(Email);
					$("#id_email").attr("value", Email);

				} else {
					return false;
				}
			}
		});
	}

}
//修改个人信息
function UpdateData(fdata, Flag) {
	var MemberId = localStorage.MemberId;
	var U_Num = localStorage.U_Num;

	var pdata = {
		MemberId: MemberId,
		U_Num: U_Num,
		Flag: Flag
	}
	pdata = $.extend(true, pdata, fdata);
	console.log(pdata, JSON.stringify(pdata));
	mui.ajax({
		url: $.xiaodie.host + "/Members/MemberInfo/UpdateData",
		type: "post",
		data: pdata,
		success: function(data) {
			//      	alert(JSON.stringify(data))
			if(data.ResultType == 3) {

				//成功后，添加返回上一层代码
				plus.nativeUI.toast("修改成功");
				//              if(Flag ==2){
				//              	return;
				//              }
				//             mui.openWindow({
				//				url: 'wode.html',
				//				id: 'wode',
				//				show: {
				//					aniShow: 'pop-in'
				//				},
				//				waiting: {
				//					autoShow: false
				//				}
				//			});

				setValue(fdata, Flag);
			} else {
				plus.nativeUI.toast(data.Message);
			}
		}
	});
}

function setValue(keyWord, Flag) {
	if(Flag == 0) {
		$("#true_name").html(keyWord.MemberName);
		$("#name_tue").attr("value", keyWord.MemberName);
	} else if(Flag == 3) {
		$("#email_id").html(keyWord.Email);
		$("#id_email").attr("value", keyWord.Email);
	} else if(Flag == 10) {
		enablePhone();
		$("#number_phone").val(keyWord.Phone);
		$("#phone_number").attr("value", keyWord.Phone);
	}
}

////展示对话框
//function showDialog(msg) {
//  $(".dialog_p").html(msg);
//  $(".mask_bg,.dialog_info").show();
//}
//
////隐藏对话框
//function hideDialog() {
//  $(".mask_bg,.dialog_info").hide();
//}
//
//
//$(".back_ig").click(function() {
//  $(this).parent().parent().animate({
//      "left" : "150%"
//  });
//})
////提示信息
//$(".only_sub").click(function () {
//    $(".mask_bg,.dialog_info").show();
//})
//$("#confirm").click(function() {
//  $(".mask_bg,.dialog_info").hide();
//});

//设置可以访问通讯录
function enablePhone() {
	localStorage.EnablePhone = "true";
}

//Base64转换Blob
function convertBase64UrlToBlob(urlData) {
	//	alert(urlData);
	var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
	//处理异常,将ascii码小于0的转换为大于0
	var ab = new ArrayBuffer(bytes.length);
	var ia = new Uint8Array(ab);
	for(var i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}
	return new Blob([ab], {
		type: 'image/png'
	});
}