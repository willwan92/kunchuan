import axios from 'axios';

const TokenKey = 'Admin-Token'

function getToken() {
	return sessionStorage.getItem(TokenKey)
}

function setToken(token) {
	return sessionStorage.setItem(TokenKey, token);
}

function removeToken() {
	return sessionStorage.removeItem(TokenKey)
}

function deepCopy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function compare(property) {
	return function (a, b) {
		return a[property] - b[property]
	}
}

function checkFileType(file, validTypes) {
	if (!file || !Array.isArray(validTypes)) {
		return false;
	}

	// 获取文件扩展名
	const fileType = file.name.match(/\.\w+$/g)[0];

	for(let i = 0, len = validTypes.length; i < len; i++)  {
		if (fileType === validTypes[i]) {
			return true;
		}
	}

	return false;
}

function judgePayStatus(statusCode) {
	let res;
	switch (statusCode) {
		case 1:
			res = '待支付'
			break;
		case 2:
			res = '已付款'
			break;
		case 3:
			res = '已关闭'
			break;
		case 4:
			res = '退款中'
			break;
		case 5:
			res = '已退款'
			break;
	}
	return res;
}

function judgeLogisticsStatus(statusCode) {
	let res;
	switch (statusCode) {
		case 1:
			res = '已完成'
			break;
		case 2:
			res = '待发货'
			break;
		case 3:
			res = '待收货'
			break;
		case 0:
			res = '无'
			break;
	}
	return res;
}

//判断ip地址的合法性
function checkIp(value) {
	var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	var reg = value.match(exp);
	if (reg == null) {
		return false;
	}
	return true;
}

function commonExport(params, name, url) {
	axios({
		method: 'get',
		url: url,
		params: params,
		responseType: 'blob',
		headers: { "Authorization": 'Bearer ' + sessionStorage.getItem('Admin-Token') }
	}).then(response => {
		download(response, name + '.xls')
	}).catch()
}

function download(data, name) {
	if (!data) {
		return
	}
	let url = window.URL.createObjectURL(new Blob([data.data], { type: 'application/octet-stream' }))
	let link = document.createElement('a')
	link.style.display = 'none'
	link.href = url
	link.setAttribute('download', name)
	document.body.appendChild(link)
	link.click()
}

function downloadFileByUrl(url) {
	if (!url) {
		return
	}
	let link = document.createElement('a')
	link.style.display = 'none'
	link.href = url
	link.setAttribute('type', 'download');
	document.body.appendChild(link)
	link.click()
}

function toNumberArr(arr) {
	if (arr && arr[0]) {
		return arr.map(item => {
			return Number(item);
		})
	}
}

function getCascaderOptions({ arr, label, value, filter = '' }) {
	let tmpArr = [];
	let tmpObj = {};

	arr.forEach((item, index) => {
		tmpObj = {
			label: item[label],
			value: item[value]
		};

		if (item.children && item.children[0]) {
			tmpObj.children = getCascaderOptions({
				arr: item.children,
				label: label,
				value: value,
				filter: filter
			});

			tmpArr.push(tmpObj);
		} else {
			if (!filter) {
				tmpArr.push(tmpObj);
			} else if (filter && item[filter]) {
				tmpArr.push(tmpObj);
			}
		}
	});

	return tmpArr;
}

export {
	checkFileType,
	downloadFileByUrl,
	toNumberArr,
	getCascaderOptions,
	checkIp,
	getToken,
	setToken,
	removeToken,
	deepCopy,
	compare,
	judgePayStatus,
	judgeLogisticsStatus,
	commonExport,
	download
}

