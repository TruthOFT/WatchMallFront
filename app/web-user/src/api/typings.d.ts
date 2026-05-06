declare namespace API {
  type AddCategoryRequest = {
    name?: string;
    parentId?: string;
    icon?: string;
    description?: string;
    sortOrder?: number;
    isShow?: number;
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

  type AddCartRequest = {
    skuId?: string;
    quantity?: number;
  };

  type AddFavoriteRequest = {
    productId?: string;
  };

  type UserAddressAddRequest = {
    receiverName?: string;
    receiverPhone?: string;
    province?: string;
    city?: string;
    district?: string;
    detailAddress?: string;
    postalCode?: string;
    isDefault?: number;
  };

  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseCartVO = {
    code?: number;
    data?: CartVO;
    message?: string;
  };

  type BaseResponseCategory = {
    code?: number;
    data?: Category;
    message?: string;
  };

  type BaseResponseFavoriteStatusVO = {
    code?: number;
    data?: FavoriteStatusVO;
    message?: string;
  };

  type BaseResponseListFavoriteProductVO = {
    code?: number;
    data?: FavoriteProductVO[];
    message?: string;
  };

  type BaseResponseListUserAddressVO = {
    code?: number;
    data?: UserAddressVO[];
    message?: string;
  };

  type BaseResponseHomeProductVO = {
    code?: number;
    data?: HomeProductVO;
    message?: string;
  };

  type BaseResponseListCategory = {
    code?: number;
    data?: Category[];
    message?: string;
  };

  type BaseResponseListOrderVO = {
    code?: number;
    data?: OrderVO[];
    message?: string;
  };

  type BaseResponseListProductVO = {
    code?: number;
    data?: ProductVO[];
    message?: string;
  };

  type BaseResponseListProduct = {
    code?: number;
    data?: Product[];
    message?: string;
  };

  type BaseResponseLoginUserVO = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponsePageCategory = {
    code?: number;
    data?: PageCategory;
    message?: string;
  };

  type BaseResponsePageProductVO = {
    code?: number;
    data?: PageProductVO;
    message?: string;
  };

  type BaseResponseOrderDetailVO = {
    code?: number;
    data?: OrderDetailVO;
    message?: string;
  };

  type BaseResponseProductDetailVO = {
    code?: number;
    data?: ProductDetailVO;
    message?: string;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserAddressVO = {
    code?: number;
    data?: UserAddressVO;
    message?: string;
  };

  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
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

  type CartItemVO = {
    id?: string;
    productId?: string;
    skuId?: string;
    productName?: string;
    productTitle?: string;
    skuName?: string;
    image?: string;
    price?: number;
    quantity?: number;
    checked?: number;
    stock?: number;
  };

  type CartVO = {
    cartId?: string;
    itemList?: CartItemVO[];
    checkedAmount?: number;
    checkedCount?: number;
    totalCount?: number;
  };

  type CategoryQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    name?: string;
    parentId?: string;
    isShow?: number;
  };

  type CategoryVO = {
    id?: string;
    name?: string;
    parentId?: string;
    icon?: string;
    description?: string;
    sortOrder?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
  };

  type DeleteRequest = {
    id?: string;
  };

  type FeatureItem = {
    label?: string;
    value?: string;
  };

  type FavoriteProductVO = {
    productId?: string;
    name?: string;
    title?: string;
    price?: number;
    url?: string;
    favoriteTime?: string;
  };

  type FavoriteStatusVO = {
    hasFavorite?: boolean;
  };

  type getCategoryByIdParams = {
    id: string;
  };

  type getFavoriteStatusParams = {
    productId: string;
  };

  type getProductDetailParams = {
    id: string;
  };

  type getMyAddressDetailParams = {
    id: string;
  };

  type getOrderDetailParams = {
    id: string;
  };

  type getUserByIdParams = {
    id: string;
  };

  type getUserVOByIdParams = {
    id: string;
  };

  type HomeProductVO = {
    categoryVOList?: CategoryVO[];
    productVO?: ProductVO;
    bannerList?: ProductVO[];
    recommendList?: ProductVO[];
  };

  type ImageItem = {
    url?: string;
    isMain?: number;
    sortOrder?: number;
  };

  type listCategoryProductsParams = {
    categoryId: string;
    current?: string;
    pageSize?: string;
  };

  type listProductByCategoryParams = {
    categoryId: string;
    current?: string;
    pageSize?: string;
  };

  type listRelatedProductsParams = {
    id: string;
    size?: string;
  };

  type searchProductsParams = {
    keyword: string;
    current?: string;
    pageSize?: string;
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
    userRole?: number;
  };

  type CheckoutOrderRequest = {
    remark?: string;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
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

  type OrderVO = {
    id?: string;
    orderNo?: string;
    orderStatus?: number;
    totalAmount?: number;
    payAmount?: number;
    payTime?: string;
    closeTime?: string;
    createTime?: string;
    expireTime?: string;
    itemList?: OrderItemVO[];
  };

  type OrderDetailVO = {
    id?: string;
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
  };

  type PageCategory = {
    records?: Category[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageCategory;
    searchCount?: PageCategory;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type PageProductVO = {
    records?: ProductVO[];
    total?: string;
    size?: string;
    current?: string;
    orders?: OrderItem[];
    optimizeCountSql?: PageProductVO;
    searchCount?: PageProductVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: string;
    countId?: string;
    pages?: string;
  };

  type Product = {
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
    version?: number;
  };

  type MockPayRequest = {
    orderId?: string;
  };

  type ProductViewTrackRequest = {
    productId?: string;
    viewSource?: string;
    deviceType?: string;
  };

  type ProductDetailVO = {
    id?: string;
    name?: string;
    title?: string;
    brandId?: string;
    description?: string;
    feature?: string;
    featureLst?: FeatureItem[];
    tags?: string;
    price?: number;
    mainUrl?: string;
    imageList?: ProductImageVO[];
    categoryList?: CategoryVO[];
    skuList?: ProductSkuVO[];
  };

  type ProductImageVO = {
    id?: string;
    url?: string;
    isMain?: number;
    sortOrder?: number;
  };

  type ProductSkuVO = {
    id?: string;
    skuCode?: string;
    skuName?: string;
    image?: string;
    price?: number;
    marketPrice?: number;
    stock?: number;
  };

  type ProductVO = {
    id?: string;
    name?: string;
    title?: string;
    brandId?: string;
    description?: string;
    feature?: string;
    featureLst?: FeatureItem[];
    tags?: string;
    price?: number;
    status?: number;
    version?: number;
    url?: string;
  };

  type SkuItem = {
    id?: string;
    skuCode?: string;
    skuName?: string;
    image?: string;
    price?: number;
    marketPrice?: number;
    stock?: number;
    lockStock?: number;
  };

  type SetDefaultAddressRequest = {
    id?: string;
  };

  type RemoveFavoriteRequest = {
    productId?: string;
  };

  type UpdateCartItemCheckedRequest = {
    id?: string;
    checked?: number;
  };

  type UpdateCartItemQuantityRequest = {
    id?: string;
    quantity?: number;
  };

  type UserAddressUpdateRequest = {
    id?: string;
    receiverName?: string;
    receiverPhone?: string;
    province?: string;
    city?: string;
    district?: string;
    detailAddress?: string;
    postalCode?: string;
    isDefault?: number;
  };

  type UserAddressVO = {
    id?: string;
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

  type uploadFileParams = {
    biz: string;
  };

  type User = {
    id?: string;
    username?: string;
    userAccount?: string;
    email?: string;
    userPassword?: string;
    phone?: string;
    createTime?: string;
    updateTime?: string;
    avatarUrl?: string;
    gender?: number;
    balance?: number;
    isDelete?: number;
    userRole?: string;
  };

  type UserAddRequest = {
    userName?: string;
    userAccount?: string;
    userAvatar?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
    rememberMe?: boolean;
  };

  type UserRegisterRequest = {
    userAccount?: string;
    userPassword?: string;
    checkPassword?: string;
  };

  type UserUpdatePasswordRequest = {
    oldPassword?: string;
    newPassword?: string;
    checkPassword?: string;
  };

  type UserUpdateMyRequest = {
    username?: string;
    email?: string;
    phone?: string;
    gender?: number;
  };

  type UserUpdateRequest = {
    id?: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
    balance?: number;
  };

  type UserVO = {
    id?: string;
    username?: string;
    userAccount?: string;
    email?: string;
    userPassword?: string;
    phone?: string;
    createTime?: string;
    updateTime?: string;
    avatarUrl?: string;
    gender?: number;
    balance?: number;
    isDelete?: number;
    userRole?: string;
  };
}
