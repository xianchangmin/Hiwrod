//1.获取元素								
var productList = document.getElementsByClassName("product_list")[0];

// 2.通过ajax获取数据	
ajax("get", "https://www.easy-mock.com/mock/5ba06ec82ee5a7654dc13dd7/example/watson", "", function(res) {

	//3.数据渲染(购全球)
	var myData = res.data.item_list;

	//4.循环数组
	for (var i in myData) {

		var eachData = myData[i];

		//5.处理最高价
		var marketPrice;
		if (eachData.min_market_price) {
			marketPrice = "¥" + eachData.min_market_price / 100;
		} else {
			marketPrice = "";
		}

		//6.处理促销活动
		var proActivity;
		if (eachData.promotions) {
			proActivity = eachData.promotions[0];
		} else {
			proActivity = "";
		}

		// 7.渲染数据
		productList.innerHTML += '<li draggable="true"><div><img src="' + eachData.over_image_url +
			'"/></div><div class="txt"><p>' +
			eachData.item_name + '</p><p><span>¥' + eachData.min_app_price / 100 + '</span><del>' + marketPrice +
			'</del><span class="iconfont">&#xe658;</span></p></div><p>' + proActivity + '</p></li>';

	}

	var aLi = document.querySelectorAll(".product_list>li"); //产品列表中的li
	var oBasket = document.querySelector(".basket");
	var myObj = {};	//用于产品去重

	// 1.循环绑定aLi的拖拽事件
	for (var i = 0; i < aLi.length; i++) {

		aLi[i].ondragstart = function(ev) {

			var ev = ev || window.event;

			var li_img = this.querySelector("img").src;
			var li_name = this.querySelector(".txt>p:nth-of-type(1)").innerHTML; //产品名字
			var li_price = this.querySelector(".txt>p:nth-of-type(2)>span:first-child").innerText; //产品名字
			ev.dataTransfer.setData("src", li_img);
			ev.dataTransfer.setData("name", li_name);
			ev.dataTransfer.setData("price", li_price);

		}

	}

	oBasket.ondragover = function(ev) {

		var ev = ev || window.event;

		ev.preventDefault();

	}

	oBasket.ondrop = function(ev) {

		var ev = ev || window.event;

		// 获取传输过来的数据
		var src = ev.dataTransfer.getData("src"); //图片路径
		var name = ev.dataTransfer.getData("name"); //产品名字
		var price = ev.dataTransfer.getData("price"); //单价

		//判断是否存在该产品
		if (myObj[name]) { //已有该产品

			var cart_list = this.querySelectorAll("li>span:nth-of-type(1)");
			var num_list = this.querySelectorAll("li>span:nth-of-type(3)");

			for (var j = 0; j < cart_list.length; j++) {

				if (name == cart_list[j].innerHTML) {

					num_list[j].innerHTML = Number(num_list[j].innerHTML) + 1;

				}

			}

		} else { //不存在该产品
			// 创建标签
			var newLi = document.createElement("li");
			var newImg = document.createElement("img");
			var newSpan1 = document.createElement("span");
			var newSpan2 = document.createElement("span");
			var newSpan3 = document.createElement("span");

			newImg.src = src;
			newSpan1.innerHTML = name;
			newSpan2.innerHTML = price;
			newSpan3.innerHTML = 1;

			newLi.appendChild(newImg);
			newLi.appendChild(newSpan1);
			newLi.appendChild(newSpan2);
			newLi.appendChild(newSpan3);

			this.appendChild(newLi);

			myObj[name] = true;

		}

	}

}, function(err) {
	console.log(err);
});
