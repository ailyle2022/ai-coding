interface iOrderNumber {
  orderNumber: string;
}

interface iCreateSalesOrderRequest {
  orderNumber: string;
  orignalOrderNumber: string;
  orderType: string;
  status: string;
}

interface iUpdateSalesOrderRequest {
  orignalOrderNumber: string;
  orderType: string;
  status: string;
}

interface iSalesOrderList {
  salesOrders: Array<iSalesOrder>;
}

interface iSalesOrder {
  orderNumber: string;
  orignalOrderNumber: string;
  orderType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface iRemoveResponse {
  success: boolean;
}

interface Empty {}
