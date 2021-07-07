/** 这个文件封装了一些常用的工具函数 **/

/**
 * 保留N位小数
 * 最终返回的是字符串
 * 若转换失败，返回参数原值
 * @param str - 数字或字符串
 * @param x   - 保留几位小数点
 */
 export const pointX = (str: string | number, x = 0): string | number => {
	if (!str && str !== 0) {
		return str;
	}
	const temp = Number(str);
	if (temp === 0) {
		return temp.toFixed(x);
	}
	return temp ? temp.toFixed(x) : str;
};

/**
   去掉字符串两端空格
*/
export const trim = (str: string): string => {
	const reg = /^\s*|\s*$/g;
	return str.replace(reg, "");
};

/**
  给字符串打马赛克
  如：将123456转换为1****6，最多将字符串中间6个字符变成*
  如果字符串长度小于等于2，将不会有效果
*/
export const addMosaic = (str: string): string => {
	const s = String(str);
	const lenth = s.length;
	const howmuch = ((): number => {
		if (s.length <= 2) {
			return 0;
		}
		const l = s.length - 2;
		if (l <= 6) {
			return l;
		}
		return 6;
	})();
	const start = Math.floor((lenth - howmuch) / 2);
	const ret = s.split("").map((v, i) => {
		if (i >= start && i < start + howmuch) {
			return "*";
		}
		return v;
	});
	return ret.join("");
};
/**
 * 验证身份证
 * **/
export const checkIdCard = (str: string): boolean => {
	const rex = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	if (rex.test(str)) {
		// 系数
		const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		// 校验码对照表
		const b = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
		const ids = str.split("");
		let sum = 0;
		for (let i = 0; i < 17; i++) {
			sum += parseInt(ids[i]) * c[i];
		}
		if (ids[17].toUpperCase() != b[sum % 11].toUpperCase()) {
			return false;
		}
		return true;
	} else {
		return false;
	}
};
/**
 * 验证字符串
 * 只能为字母、数字、下划线
 * 可以为空
 * **/
export const checkStr = (str: string): boolean => {
	if (str === "") {
		return true;
	}
	const rex = /^[_a-zA-Z0-9]+$/;
	return rex.test(str);
};
/**
 * 验证字符串
 * 只能为数字
 * **/
export const checkNumber = (str: string): boolean => {
	const rex = /^\d*$/;
	return rex.test(str);
};
/** 正则 手机号验证 **/
export const checkPhone = (str: string | number): boolean => {
	const rex = /^1[345789]\d{9}$/;
	return rex.test(String(str));
};

/** 正则 固话验证 **/
export const checkTel = (str: string | number): boolean => {
	const rex = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
	return rex.test(String(str));
};

/** 正则 邮箱验证 **/
export const checkEmail = (str: string): boolean => {
	const rex = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
	return rex.test(str);
};
/** 正则 非中文 **/
export const checkNoZh = (str: string | number): boolean => {
	const rex = /^[^\u4e00-\u9fa5]*$/;
	return rex.test(String(str));
};
/**
  字符串加密
  简单的加密方法
*/
export const compile = (code: string): string => {
	let c = String.fromCharCode(code.charCodeAt(0) + code.length);
	for (let i = 1; i < code.length; i++) {
		c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
	}
	return c;
};

/**
  字符串解谜
  对应上面的字符串加密方法
*/
export const uncompile = (code: string): string => {
	let c = String.fromCharCode(code.charCodeAt(0) - code.length);
	for (let i = 1; i < code.length; i++) {
		c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
	}
	return c;
};

/**
 * 清除一个对象中那些属性为空值的属性
 * 0 算有效值
 * **/
export const clearNull = <T>(obj: T): T => {
	const temp: T = { ...obj };
	Object.keys(temp).forEach(key => {
		if (temp[key] !== 0 && temp[key] !== "" && !temp[key]) {
			delete temp[key];
		} else if (typeof temp[key] === "string") {
			temp[key] = trim(temp[key]);
		}
	});
	return temp;
};

/**
 * 用while 实现的数组循环，相对for、for in要高效
 * @param array 数组
 * @param callback 回调函数
 */
export const forEach = <T>(array: T[], callback: (item: T, idx: number) => void): T[] => {
	let index = -1;
	const length = array.length;
	while (++index < length) {
		callback(array[index], index);
	}
	return array;
};

/**
 * 把层级数据转为一维数据
 * @param arr 数组
 */
export const flatten = (arr: any[] = [], param?: string): any[] => {
	return [].concat(
		...arr.map((item: any) => [].concat(item, ...flatten((param ? item[param] : item.child) || [], param)))
	);
};

/**
 * 把一维数据转为层级数据
 * @param arr 数组
 */
export const unflatten = (one: any, arr: any[]) => {
	let kids;
	if (!one) {
		// 第1次递归
		kids = arr.filter((item: any) => !item.parentId);
	} else {
		kids = arr.filter((item: any) => item.parentId === one.id);
	}
	forEach(kids, (item: any) => {
		item.children = unflatten(item, arr);
	});
	return kids.length ? kids : null;
};

// 详情显示地址组件数据
export const parseAddress = (str: string) => {
	return str.replace(/\//g, "").replace(/,/g, "");
};

// 通过code获取desc
export const getDescByCode = (
	arr: {
		desc: string;
		code: string | number;
	}[],
	code: string | number
) => {
	const obj = arr.find(item => item.code == code);
	return obj ? obj.desc : "";
};

// 通过desc获取code
export const getCodeByDesc = (
	arr: {
		desc: string;
		code: string | number;
	}[],
	desc: string
) => {
	const obj = arr.find(item => item.desc === desc);
	return obj ? obj.code : "";
};

// 数组去重（不能去掉{}）
export const unique = (arr: any[]) => {
	return Array.from(new Set(arr));
};

// 枚举 转 { label,value }
export const enumToSelectorOptions = (enumValue: any, enumType: any) => {
	return Object.entries(enumValue).map(([key, value]) => ({
		label: value as string,
		value: enumType[key],
	}));
};

// treeSelect设置不可选值
export const setDisabledById = (arr: any[], selectedId: string | number) => {
	if (!selectedId) {
		return arr;
	}
	for (let i = 0, len = arr.length; i < len; i++) {
		if (arr[i].id == selectedId) {
			arr[i].disabled = true;
			return arr;
		} else if (arr[i].children?.length) {
			arr[i].children = setDisabledById(arr[i].children, selectedId);
			arr[i].disabled = false;
		} else {
			arr[i].disabled = false;
		}
	}
	return arr;
};