import { axiosDownloadFuzz } from './axiosClient.js'
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


function downloadFile({ url, params, filename }) {
	axiosDownloadFuzz.get(url, {
		params: params
	}).then(response => {
    if (response.status == 200) {
      download(response.data, filename)
    } else {
      alert('文件可能不存在，请检查后重试！');
    }
  }).catch(err => {
    console.log(err);
  })
}

function download(data, filename) {
	if (!data) {
		return
  }
  
  let fileBlob = new Blob([data], { type: 'text/plain' })
  if (navigator.msSaveBlob) {
    // for IE
    navigator.msSaveBlob(fileBlob, filename);
  } else {
    let url = window.URL.createObjectURL(fileBlob)
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
  }
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
  document.body.removeChild(link);
}

function toNumberArr(arr) {
	if (arr && arr[0]) {
		return arr.map(item => {
			return Number(item);
		})
	}
}

function isBase64(str) {
	if (str ==='' || str.trim() ===''){ return false; }
	try {
			return btoa(atob(str)) === str;
	} catch (err) {
			return false;
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

function getTreeData(arr) {
	let tmpArr = [];
	let tmpObj = {};

	arr.forEach(item => {
		tmpObj = Object.assign({}, item);

		if (item.children && item.children[0]) {
			tmpObj.children = getTreeData(item.children);
		}

		tmpArr.push(tmpObj);
	});

	return tmpArr;
}

function formatTreeData(treeData, pid) {
	if (!Array.isArray(treeData) || !treeData.length ) return;

	let formatedTreeData = [];
	let tmpObj = {};

	treeData.forEach((item, index) => {
		if (item.pid === pid) {
			tmpObj = treeData.slice(index, index + 1)[0];
			formatedTreeData.push(tmpObj);
		}
	});

	formatedTreeData.forEach((element, idx) => {
		if (!element.isleaf) {
			formatedTreeData[idx].children = formatTreeData(treeData, element.id);
		}
	})

	return formatedTreeData;
}

export {
	formatTreeData,
	isBase64,
	getTreeData,
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
	downloadFile,
	download
}

