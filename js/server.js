/*
 	功能：查看本地数据中是否含有指定的对象（商品），根据id
 	参数：id：商品的标识
 */
function checkObj(gender, size, color) {
	var jsonStr = cookieObj.get("datas");
	var jsonObj = JSON.parse(jsonStr);
	var isExist = false;
	for(var i = 0; i < jsonObj.length; i++) {
		//alert(jsonObj[i].pGender + "" + jsonObj[i].pSize + "" + jsonObj[i].pColor);
		if(jsonObj[i].pGender == gender && jsonObj[i].pSize == size && jsonObj[i].pColor == color) {
			isExist = true;
			break;
		}
	}
	//alert(isExist);
	return isExist; //return false;
}

/*
 	功能：更新本地数据
 	参数：arr    数组对象
 	返回一个值：最新的本地转换后的数组对象
 * */
function updateData(arr) {
	//alert("updateData");
	var jsonStr = JSON.stringify(arr);
	cookieObj.set({
		name: "datas",
		value: jsonStr
	});
	jsonStr = cookieObj.get("datas");
	return JSON.parse(jsonStr);
}

/*
 	获取商品的总数量
 	返回：数字
 */
function getTotalCount() {
	/*循环遍历数组，获取每一个对象中的pCount值相加总和*/
	var totalCount = 0; //默认为0
	var jsonStr = cookieObj.get("datas");
	var listObj = JSON.parse(jsonStr);
	for(var i = 0, len = listObj.length; i < len; i++) {
		totalCount = listObj[i].pCount + totalCount;
	}
	return totalCount;
}

/*
 	更新本地数据根据pid
 	id:商品的标识
 */
function updateObj(gender, size, color, num) {
	var jsonStr = cookieObj.get("datas");
	var listObj = JSON.parse(jsonStr);
	for(var i = 0; i < listObj.length; i++) {
		if(listObj[i].pGender == gender && listObj[i].pSize == size & listObj[i].pColor == color) {
			listObj[i].pCount = listObj[i].pCount + parseInt(num);
			break;
		}
	}
	return updateData(listObj)
}

/*
 	获取本地数据
 	返回 数组对象
 * */
function getAllData() {
	//alert("getAllData");
	var jsonStr = cookieObj.get("datas");
	var listObj = JSON.parse(jsonStr);
	//alert(listObj);
	return listObj;
}

function deleteObjByPid(id) {
	var lisObj = getAllData();
	for(var i = 0, len = lisObj.length; i < len; i++) {
		if(lisObj[i].pid == id) {
			lisObj.splice(i, 1);
			break;
		}
	}
	updateData(lisObj);
	return lisObj;
}