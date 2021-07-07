/** 根路由 **/

// ==================
// 第三方库
// ==================
import React, { useEffect, useCallback, FC } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {createBrowserHistory as createHistory} from "history"; // URL模式的history
// import { createHashHistory as createHistory } from "history"; // 锚点模式的history
import { Spin } from "antd";

// ==================
// 自定义的东西
// ==================
import { uncompile } from "@/util/tools";

// ==================
// 组件
// ==================
import BasicLayout from "@/layouts/BasicLayout";
import UserLayout from "@/layouts/UserLayout";

const history = createHistory();
import "./index.less";

// ==================
// 类型声明
// ==================
import { RootState, Dispatch } from "@/store";

// ==================
// 本组件
// ==================
const RouterCom: FC = (): JSX.Element => {
  const dispatch = useDispatch<Dispatch>();
  const userinfo = useSelector((state: RootState) => state.app.userinfo);
  const appLoading = useSelector((state: RootState) => state.app.appLoading);

  useEffect(() => {
    const userTemp = sessionStorage.getItem("userinfo");
    /**
     * sessionStorage中有user信息，但store中没有
     * 说明刷新了页面，需要重新同步user数据到store
     * **/
    if (userTemp && !userinfo.userBasicInfo) {
      dispatch.app.setUserInfo(JSON.parse(uncompile(userTemp)));
    }
  }, [dispatch.app, userinfo.userBasicInfo]);

  /** 跳转到某个路由之前触发 **/
  const onEnter = useCallback((Component, props) => {
    const userTemp = sessionStorage.getItem("userinfo");
    if (userTemp) {
      return <Component {...props} />;
    }
    return <Redirect to="/user/login" />;
  }, []);

  return (
    <>
      <Router history={history}>
        <Route
          render={(): JSX.Element => {
            return (
              <Switch>
                <Route path="/user" component={UserLayout} />
                <Route
                  path="/"
                  render={(props): JSX.Element => onEnter(BasicLayout, props)}
                />
              </Switch>
            );
          }}
        />
      </Router>
      <div className={"whole-loading-mark" + (appLoading.state ? " show-mark" : "")}>
        <Spin tip={appLoading.tip} size="large" />
      </div>
    </>
  );
}

export default RouterCom;
