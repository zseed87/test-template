import { addMosaic, checkEmail, checkNumber, checkPhone, checkStr, clearNull, compile, pointX, trim, uncompile } from "@/util/tools";

it("保留N位小数", () => {
  expect(pointX(1.2345678, 2)).toBe("1.23");
});

it("去掉字符串两端空格", () => {
  expect(trim("  abc ABC ")).toBe("abc ABC");
});

it("给字符串打马赛克", () => {
  expect(addMosaic("1234567890")).toBe("12******90");
  expect(addMosaic("123456")).toBe("1****6");
  expect(addMosaic("123")).toBe("1*3");
  expect(addMosaic("12")).toBe("12");
  expect(addMosaic("1")).toBe("1");
  expect(addMosaic("")).toBe("");
});

it("验证字符串，只能为字母、数字、下划线", () => {
  expect(checkStr("aA123_")).toBeTruthy();
  expect(checkStr("aA@123_")).toBeFalsy();
});

it("验证字符串,只能为数字，可以为空", () => {
  expect(checkNumber("123456")).toBeTruthy();
  expect(checkNumber("")).toBeTruthy();
  expect(checkNumber("123a")).toBeFalsy();
});

it("手机号验证", () => {
  expect(checkPhone("13600000000")).toBeTruthy();
  expect(checkPhone("11111111111")).toBeFalsy();
});

it("邮箱验证", () => {
  expect(checkEmail("test.test@email.com")).toBeTruthy();
  expect(checkEmail("test@.com")).toBeFalsy();
});

it("字符串加密", () => {
  expect(compile("abcdef")).toBe("gÃÅÇÉË");
});

it("字符串解密", () => {
  expect(uncompile("gÃÅÇÉË")).toBe("abcdef");
});

it("清除一个对象中那些属性为空值的属性", () => {
  expect(
    clearNull({ a: null, b: undefined, c: 0, d: "", e: "ok" })
  ).toEqual({ c: 0, e: "ok" });
});
