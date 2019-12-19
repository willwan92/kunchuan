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
  return function(a, b) {
    return a[property] - b[property]
  }
}

function judgePayStatus(statusCode) {
	let res;
	switch(statusCode) {
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
	switch(statusCode) {
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

function commonExport(params,name,url){
	axios({
		method: 'get',
		url: url,
		params: params,
		responseType: 'blob',
		headers: {"Authorization":'Bearer ' + sessionStorage.getItem('Admin-Token')}
		}).then(response => {
			download(response, name + '.xls')
		}).catch()
}

function download (data, name) {
	if (!data) {
		return
	}
	let url = window.URL.createObjectURL(new Blob([data.data], {type: 'application/octet-stream'}))
	let link = document.createElement('a')
	link.style.display = 'none'
	link.href = url
	link.setAttribute('download',name)
	document.body.appendChild(link)
	link.click()
}

export {
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

