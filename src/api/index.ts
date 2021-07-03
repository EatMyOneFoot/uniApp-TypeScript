import http from "@/utils/request";
/**
 * 分类列表
 */
export const itemList = (params: any) =>
  http.request({
    url: "/user/itemList",
    method: "GET",
    params
  });

/**
 * 关闭订单
 */
export const cancelOrder = (data: any) =>
  http.request({
    url: "/user/cancelOrder",
    method: "POST",
    data
  });
