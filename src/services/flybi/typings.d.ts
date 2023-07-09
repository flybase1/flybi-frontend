declare namespace API {
  type addUsingGETParams = {
    /** name */
    name?: string;
  };

  type Aimodel = {
    aiavatar?: string;
    aidescription?: string;
    ainame?: string;
    airoute?: string;
    createTime?: string;
    id?: number;
    isDelete?: number;
    isOnline?: string;
    updateTime?: string;
  };

  type AiModelAddRequest = {
    aiavatar?: string;
    aidescription?: string;
    ainame?: string;
    airoute?: string;
    isOnline?: string;
  };

  type AiModelQueryRequest = {
    aiavatar?: string;
    aidescription?: string;
    ainame?: string;
    airoute?: string;
    current?: number;
    id?: number;
    isOnline?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type AiModelUpdateRequest = {
    aiavatar?: string;
    aidescription?: string;
    ainame?: string;
    airoute?: string;
    id?: number;
    isOnline?: string;
  };

  type BaseResponseAimodel_ = {
    code?: number;
    data?: Aimodel;
    message?: string;
  };

  type BaseResponseBIResponse_ = {
    code?: number;
    data?: BIResponse;
    message?: string;
  };

  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseChart_ = {
    code?: number;
    data?: Chart;
    message?: string;
  };

  type BaseResponseChatMessage_ = {
    code?: number;
    data?: ChatMessage;
    message?: string;
  };

  type BaseResponseListAimodel_ = {
    code?: number;
    data?: Aimodel[];
    message?: string;
  };

  type BaseResponseListMapStringObject_ = {
    code?: number;
    data?: Record<string, any>[];
    message?: string;
  };

  type BaseResponseLoginUserVO_ = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseMapStringObject_ = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponsePageAimodel_ = {
    code?: number;
    data?: PageAimodel_;
    message?: string;
  };

  type BaseResponsePageChart_ = {
    code?: number;
    data?: PageChart_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type BIResponse = {
    chartId?: number;
    genChart?: string;
    genResult?: string;
  };

  type Chart = {
    chartData?: string;
    chartDetailTableName?: string;
    chartType?: string;
    createTime?: string;
    execMessage?: string;
    failedCount?: number;
    genChart?: string;
    genResult?: string;
    goal?: string;
    id?: number;
    isDelete?: number;
    name?: string;
    status?: string;
    updateTime?: string;
    userId?: number;
  };

  type ChartAddRequest = {
    chartData?: string;
    chartType?: string;
    goal?: string;
    name?: string;
  };

  type ChartDetailUploadRequest = {
    chartDetailName?: string;
    chartType?: string;
    csvData?: string;
    goal?: string;
    name?: string;
  };

  type ChartEditRequest = {
    chartData?: string;
    chartType?: string;
    goal?: string;
    id?: number;
  };

  type ChartQueryRequest = {
    chartType?: string;
    current?: number;
    goal?: string;
    id?: number;
    name?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type ChartUpdateRequest = {
    chartData?: string;
    chartType?: string;
    createTime?: string;
    failedCount?: number;
    genChart?: string;
    genResult?: string;
    goal?: string;
    id?: number;
    isDelete?: number;
    status?: string;
    updateTime?: string;
    userId?: number;
  };

  type ChatMessage = {
    aiavatar?: string;
    aimessage?: string;
    updateTime?: string;
    userAvatar?: string;
    userMessage?: string;
  };

  type DeleteAiModelRequest = {
    id?: number;
  };

  type DeleteRequest = {
    id?: number;
  };

  type genChartAiAsyncMQUsingPOSTParams = {
    chartType?: string;
    goal?: string;
    name?: string;
  };

  type genChartAiAsyncRetryUsingPOSTParams = {
    id?: number;
  };

  type genChartAiAsyncUsingPOSTParams = {
    chartType?: string;
    goal?: string;
    name?: string;
  };

  type genChartByAiUsingPOSTParams = {
    chartType?: string;
    goal?: string;
    name?: string;
  };

  type getAiModelByIdUsingGETParams = {
    /** AIId */
    AIId?: number;
  };

  type getChartByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getChartDetailByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type listAiModelUsingGETParams = {
    /** aName */
    aName?: string;
  };

  type LoginUserVO = {
    createTime?: string;
    email?: string;
    id?: number;
    leftCount?: number;
    phoneNum?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageAimodel_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Aimodel[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageChart_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Chart[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    createTime?: string;
    email?: string;
    id?: number;
    isDelete?: number;
    leftCount?: number;
    phoneNum?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    email?: string;
    id?: number;
    leftCount?: number;
    phoneNum?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    email?: string;
    id?: number;
    leftCount?: number;
    phoneNum?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };
}
