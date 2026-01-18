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
    categoryName?: string;
    categoryImgUrl?: string;
    description?: string;
  };

  type DeleteRequest = {
    id?: number;
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
    choiceList?: ProductVO[];
    recommendList?: ProductVO[];
  };

  type LoginUserVO = {
    id?: number;
    username?: string;
    avatarUrl?: string;
    userAccount?: string;
    gender?: number;
    email?: string;
    phone?: string;
    userRole?: string;
    createTime?: string;
    updateTime?: string;
  };

  type Product = {
    id?: number;
    productName?: string;
    description?: string;
    imageUrl?: string;
    tag?: string;
    price?: number;
    stock?: number;
    title?: string;
    isHero?: number;
    isBanner?: number;
    isChoice?: number;
    isRec?: number;
    feature?: string;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
  };

  type ProductVO = {
    id?: number;
    productName?: string;
    description?: string;
    imageUrl?: string;
    tag?: string;
    price?: number;
    stock?: number;
    title?: string;
    categoryName?: string;
    isHero?: number;
    isBanner?: number;
    isChoice?: number;
    isRec?: number;
    feature?: string[];
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
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
    createTime?: string;
    balance?: number;
  };
}
