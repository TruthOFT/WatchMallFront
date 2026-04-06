declare namespace API {
  type BaseResponse<T> = {
    code?: number;
    data?: T;
    message?: string;
  };

  type PageResult<T> = {
    records?: T[];
    total?: number;
    size?: number;
    current?: number;
    pages?: number;
  };

  type DeleteRequest = {
    id?: string;
  };

  type UploadFileParams = {
    biz: string;
  };

  type LoginUserVO = {
    id?: string;
    username?: string;
    userAccount?: string;
    email?: string;
    phone?: string;
    createTime?: string;
    updateTime?: string;
    avatarUrl?: string;
    gender?: number;
    balance?: number;
    userRole?: string;
  };

  type UserAdminQueryRequest = {
    current?: number;
    pageSize?: number;
    keyword?: string;
    userRole?: string;
  };

  type UserAdminPageVO = {
    id?: string;
    username?: string;
    userAccount?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    userRole?: string;
    balance?: number;
    createTime?: string;
    updateTime?: string;
  };

  type UserAdminDetailVO = {
    id?: string;
    username?: string;
    userAccount?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    gender?: number;
    balance?: number;
    userRole?: string;
    createTime?: string;
    updateTime?: string;
  };

  type UserAddressAdminVO = {
    id?: string;
    userId?: string;
    receiverName?: string;
    receiverPhone?: string;
    province?: string;
    city?: string;
    district?: string;
    detailAddress?: string;
    postalCode?: string;
    isDefault?: number;
    createTime?: string;
    updateTime?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
    rememberMe?: boolean;
  };

  type Category = {
    id?: string;
    name?: string;
    parentId?: string;
    icon?: string;
    description?: string;
    sortOrder?: number;
    isShow?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
  };

  type AddCategoryRequest = {
    name?: string;
    parentId?: string;
    icon?: string;
    description?: string;
    sortOrder?: number;
    isShow?: number;
  };

  type CategoryQueryRequest = {
    current?: number;
    pageSize?: number;
    name?: string;
    parentId?: string;
    isShow?: number;
  };

  type ImageItem = {
    url?: string;
    isMain?: number;
    sortOrder?: number;
  };

  type SkuItem = {
    skuCode?: string;
    skuName?: string;
    image?: string;
    price?: number;
    marketPrice?: number;
    stock?: number;
    lockStock?: number;
  };

  type AddProductRequest = {
    name?: string;
    title?: string;
    description?: string;
    tags?: string;
    feature?: string;
    price?: number;
    isHero?: number;
    isBanner?: number;
    isRec?: number;
    status?: number;
    categoryIds?: string[];
    images?: ImageItem[];
    skus?: SkuItem[];
  };

  type UpdateProductRequest = AddProductRequest & {
    id?: string;
  };

  type ProductAdminQueryRequest = {
    current?: number;
    pageSize?: number;
    keyword?: string;
    status?: number;
    categoryId?: string;
  };

  type ProductAdminPageVO = {
    id?: string;
    name?: string;
    title?: string;
    tags?: string;
    price?: number;
    status?: number;
    isHero?: number;
    isBanner?: number;
    isRec?: number;
    mainUrl?: string;
    categoryNames?: string;
    skuCount?: number;
    createTime?: string;
    updateTime?: string;
  };

  type ProductAdminImageItemVO = {
    id?: string;
    url?: string;
    isMain?: number;
    sortOrder?: number;
    createTime?: string;
  };

  type ProductAdminSkuItemVO = {
    id?: string;
    skuCode?: string;
    skuName?: string;
    image?: string;
    price?: number;
    marketPrice?: number;
    stock?: number;
    lockStock?: number;
    version?: number;
    createTime?: string;
    updateTime?: string;
  };

  type ProductAdminDetailVO = {
    id?: string;
    name?: string;
    title?: string;
    brandId?: string;
    description?: string;
    feature?: string;
    tags?: string;
    price?: number;
    isHero?: number;
    isBanner?: number;
    isRec?: number;
    status?: number;
    createTime?: string;
    updateTime?: string;
    categoryIds?: string[];
    images?: ProductAdminImageItemVO[];
    skus?: ProductAdminSkuItemVO[];
  };

  type OrderItemVO = {
    id?: string;
    orderId?: string;
    productId?: string;
    skuId?: string;
    productName?: string;
    productTitle?: string;
    skuName?: string;
    skuImage?: string;
    price?: number;
    quantity?: number;
    totalAmount?: number;
  };

  type OrderAdminQueryRequest = {
    current?: number;
    pageSize?: number;
    keyword?: string;
    orderStatus?: number;
  };

  type OrderAdminPageVO = {
    id?: string;
    orderNo?: string;
    userId?: string;
    orderStatus?: number;
    totalAmount?: number;
    payAmount?: number;
    receiverName?: string;
    receiverPhone?: string;
    productSummary?: string;
    itemCount?: number;
    payTime?: string;
    closeTime?: string;
    createTime?: string;
  };

  type OrderAdminDetailVO = {
    id?: string;
    userId?: string;
    orderNo?: string;
    orderStatus?: number;
    totalAmount?: number;
    payAmount?: number;
    addressId?: string;
    receiverName?: string;
    receiverPhone?: string;
    province?: string;
    city?: string;
    district?: string;
    detailAddress?: string;
    remark?: string;
    payTime?: string;
    closeTime?: string;
    createTime?: string;
    expireTime?: string;
    itemList?: OrderItemVO[];
    payLogList?: PayLogAdminPageVO[];
  };

  type OrderAdminStatsVO = {
    totalCount?: number;
    pendingCount?: number;
    paidCount?: number;
    closedCount?: number;
    overduePendingCount?: number;
    todayCount?: number;
  };

  type PayLogAdminQueryRequest = {
    current?: number;
    pageSize?: number;
    keyword?: string;
    userId?: string;
    payStatus?: number;
    payTimeStart?: string;
    payTimeEnd?: string;
  };

  type PayLogAdminPageVO = {
    id?: string;
    orderId?: string;
    orderNo?: string;
    userId?: string;
    payNo?: string;
    payType?: number;
    payStatus?: number;
    payAmount?: number;
    payTime?: string;
    remark?: string;
  };

  type PayLogAdminDetailVO = {
    id?: string;
    orderId?: string;
    orderNo?: string;
    userId?: string;
    payNo?: string;
    payType?: number;
    payStatus?: number;
    payAmount?: number;
    payTime?: string;
    remark?: string;
    createTime?: string;
    updateTime?: string;
  };

  type DashboardSummaryVO = {
    todayOrderCount?: number;
    paidOrderCount?: number;
    pendingOrderCount?: number;
    totalUserCount?: number;
    totalProductCount?: number;
    recentOrderList?: OrderAdminPageVO[];
  };
}
