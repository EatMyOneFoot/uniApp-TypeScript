import http from "@/utils/request";

// 用户登录
export const login = (data: any) =>
  http.request({
    url: "/user/login",
    method: "POST",
    data
  });

// 退出登录
export const logout = (data: any) =>
  http.request({
    url: "/user/logout",
    method: "POST",
    data
  });
