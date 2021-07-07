/** 登录页 **/

// ==================
// 所需的各种插件
// ==================
import React, { useState, useEffect, FC, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { uncompile, compile } from "@/util/tools";

// ==================
// 所需的所有组件
// ==================
import { Form, Input, Button, Checkbox, message, ConfigProvider, Row, Col } from "antd";
import {
	UserOutlined,
	LockOutlined,
	MobileOutlined,
	MailOutlined,
} from "@ant-design/icons";
import LogoImg from "@/assets/logo.png";

// ==================
// 类型声明
// ==================
import { Dispatch } from "@/store";
import { Menu, Power, Res, Role, UserBasicInfo } from "@/models/index.type";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

import { History } from "history";
import { Link, match } from "react-router-dom";

/**
 * 除了mapState和mapDispatch
 * 每个页面都自动被注入history,location,match 3个对象
 */
type Props = {
	history: History;
	location: Location;
	match: match;
};

// ==================
// CSS
// ==================
import "./index.less";

// ==================
// 常量
// ==================

// ==================
// 本组件
// ==================
const LoginContainer: FC<Props> = (props: Props): JSX.Element => {
	const dispatch = useDispatch<Dispatch>();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false); // 是否正在登录中
	const [rememberPassword, setRememberPassword] = useState(false); // 是否记住密码
	const [show, setShow] = useState(false); // 加载完毕时触发动画
	const [type, setType] = useState<string>("account");

	// 进入登陆页时，判断之前是否保存了用户名和密码
	useEffect(() => {
		const userLoginInfo = localStorage.getItem("userLoginInfo");
		if (userLoginInfo) {
			const userLoginInfoObj = JSON.parse(userLoginInfo);
			setRememberPassword(true);

			form.setFieldsValue({
				username: userLoginInfoObj.username,
				password: uncompile(userLoginInfoObj.password),
			});
		}
		setShow(true);

		return () => {
			setLoading(false);
		};
	}, [form]);

	/**
   * 执行登录
   * 这里模拟：
   * 1.登录，得到用户信息
   * 2.通过用户信息获取其拥有的所有角色信息
   * 3.通过角色信息获取其拥有的所有权限信息
   * **/
   const loginIn = useCallback(
    async (username, password) => {
      let userBasicInfo: UserBasicInfo | null = null;
      let roles: Role[] = [];
      let menus: Menu[] = [];
      let powers: Power[] = [];
  
      /** 1.登录 （返回信息中有该用户拥有的角色id） **/
      const res1: Res | undefined = await dispatch.app.onLogin({
        username,
        password,
      });
      if (!res1 || res1.status !== 200 || !res1.data) {
        // 登录失败
        return res1;
      }
  
      userBasicInfo = res1.data;
  
      /** 2.根据角色id获取角色信息 (角色信息中有该角色拥有的菜单id和权限id) **/
      const res2 = await dispatch.sys.getRoleById({
        id: (userBasicInfo as UserBasicInfo).roles,
      });
      if (!res2 || res2.status !== 200) {
        // 角色查询失败
        return res2;
      }
  
      roles = res2.data.filter((item: Role) => item.conditions === 1); // conditions: 1启用 -1禁用
  
      /** 3.根据菜单id 获取菜单信息 **/
      const menuAndPowers = roles.reduce(
        (a, b) => [...a, ...b.menuAndPowers],
        []
      );
      const res3 = await dispatch.sys.getMenusById({
        id: Array.from(new Set(menuAndPowers.map((item) => item.menuId))),
      });
      if (!res3 || res3.status !== 200) {
        // 查询菜单信息失败
        return res3;
      }
  
      menus = res3.data.filter((item: Menu) => item.conditions === 1);
  
      /** 4.根据权限id，获取权限信息 **/
      const res4 = await dispatch.sys.getPowerById({
        id: Array.from(
          new Set(menuAndPowers.reduce((a, b) => [...a, ...b.powers], []))
        ),
      });
      if (!res4 || res4.status !== 200) {
        // 权限查询失败
        return res4;
      }
      powers = res4.data.filter((item: Power) => item.conditions === 1);
      return { status: 200, data: { userBasicInfo, roles, menus, powers } };
    },
    [dispatch.sys, dispatch.app]
  );
  
  // 用户提交登录
  const onSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await loginIn(values.username, values.password);
      if (res && res.status === 200) {
        message.success("登录成功");
        if (rememberPassword) {
          localStorage.setItem(
            "userLoginInfo",
            JSON.stringify({
              username: values.username,
              password: compile(values.password), // 密码简单加密一下再存到localStorage
            })
          ); // 保存用户名和密码
        } else {
          localStorage.removeItem("userLoginInfo");
        }
        /** 将这些信息加密后存入sessionStorage,并存入store **/
        sessionStorage.setItem(
          "userinfo",
          compile(JSON.stringify(res.data))
        );
        await dispatch.app.setUserInfo(res.data);
        props.history.replace("/"); // 跳转到主页
      } else {
        message.error(res?.message ?? "登录失败");
        setLoading(false);
      }
    } finally {
			setLoading(false);
		}
  };

	// 记住密码按钮点击
	const onRemember = (e: CheckboxChangeEvent): void => {
		setRememberPassword(e.target.checked);
	};

	return (
		<ConfigProvider componentSize="large">
			<div className={show ? "page-login show" : "page-login"}>
				<div className="login-top">
					<div className="login-header">
						<Link to="/">
							<img alt="logo" className="login-logo" src={LogoImg} />
							<span className="login-title">中后台管理系统</span>
						</Link>
					</div>
					{/* <div className="login-desc">描述...</div> */}
				</div>
				<div className="login-main">
					{/* <Tabs
						activeKey={type}
						onChange={setType}
						className="login-tab"
					>
						<Tabs.TabPane
							key="account"
							tab="账户密码登录"
						/>
						<Tabs.TabPane
							key="mobile"
							tab="手机号登录"
						/>
					</Tabs> */}
					<Form form={form} onFinish={onSubmit}>
						{type === "account" ? (
							<div className="login-account">
								<Form.Item
									name="username"
									rules={[
										{ max: 12, message: "最大长度为12位字符" },
										{
											required: true,
											whitespace: true,
											message: "请输入用户名",
										},
									]}
								>
									<Input prefix={<UserOutlined className="prefix-icon" />} placeholder="用户名" />
								</Form.Item>
								<Form.Item
									name="password"
									rules={[
										{ required: true, message: "请输入密码" },
										// { max: 11, message: "最大长度18个字符" },
									]}
								>
									<Input.Password
										prefix={<LockOutlined className="prefix-icon" />}
										type="password"
										placeholder="密码"
									/>
								</Form.Item>
								<div className="login-remember">
									<Checkbox checked={rememberPassword} onChange={onRemember}>
										记住密码
									</Checkbox>
									{/* <a className="login-form-forgot" href="">
										忘记密码
									</a> */}
								</div>
							</div>
						) : (
							<div className="login-mobile">
								<Form.Item
									name="mobile"
									rules={[
										{
											required: true,
											whitespace: true,
											message: "请输入手机号码",
										},
									]}
								>
									<Input prefix={<MobileOutlined className="prefix-icon" />} placeholder="手机号码" maxLength={11} />
								</Form.Item>
								<Form.Item style={{ marginBottom: 0 }}>
									<Row justify="space-between">
										<Col span={13}>
											<Form.Item name="mobileCode" rules={[{ required: true, message: "请输入验证码" }]}>
												<Input prefix={<MailOutlined className="prefix-icon" />} placeholder="验证码" />
											</Form.Item>
										</Col>
										<Col span={10}>
											<Button className="code-button">获取验证码</Button>
										</Col>
									</Row>
								</Form.Item>
							</div>
						)}

						<Form.Item>
							<Button type="primary" htmlType="submit" className="login-button" loading={loading}>
								登录
							</Button>
						</Form.Item>
					</Form>
					{/* <Space className="login-other">
						其他登录方式 :
            <AlipayCircleOutlined className="login-icon" />
            <TaobaoCircleOutlined className="login-icon" />
            <WeiboCircleOutlined className="login-icon" />
          </Space> */}
				</div>
			</div>
		</ConfigProvider>
	);
};

export default LoginContainer;
