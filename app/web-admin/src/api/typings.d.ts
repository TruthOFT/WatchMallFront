declare namespace API {
  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseHomeProductVO = {
    code?: number;
    data?: HomeProductVO;
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
    data?: number;
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

  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type CategoryVO = {
    id?: number;
    name?: string;
    parentId?: number;
    icon?: string;
    description?: string;
    sortOrder?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
  };

  type DeleteRequest = {
    id?: number;
  };

  type FeatureItem = {
    label?: string;
    value?: string;
  };

  type getUserByIdParams = {
    id: number;
  };

  type getUserVOByIdParams = {
    id: number;
  };

  type HomeProductVO = {
    categoryVOList?: CategoryVO[];
    productVO?: ProductVO;
    bannerList?: ProductVO[];
    recommendList?: ProductVO[];
  };

  type LoginUserVO = {
    id?: number;
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

  type Product = {
    id?: number;
    name?: string;
    title?: string;
    brandId?: number;
    description?: string;
    feature?: string;
    tags?: string;
    price?: number;
    isHero?: number;
    isBanner?: number;
    isRec?: number;
    status?: number;
    version?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
  };

  type ProductVO = {
    id?: number;
    name?: string;
    title?: string;
    brandId?: number;
    description?: string;
    feature?: string;
    featureLst?: FeatureItem[];
    tags?: string;
    price?: number;
    status?: number;
    version?: number;
    url?: string;
  };

  type User = {
    id?: number;
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
    userRole?: number;
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

  type UserUpdateMyRequest = {
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    balance?: number;
  };

  type UserUpdateRequest = {
    id?: number;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
    balance?: number;
  };

  type UserVO = {
    id?: number;
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
    userRole?: number;
  };
}
