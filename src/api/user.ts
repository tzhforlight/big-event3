import request from '@/utils/request'

//接口返回数据类型定义
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data?: T
  user?: unknown
  success?: boolean
}

// 用户相关类型定义
export interface UserInfo {
  id: number
  username: string
  nickname?: string
  email?: string
  avatar?: string
  create_time?: string
  update_time?: string
  [key: string]: unknown
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  repassword: string
}

export interface UpdateUserInfoRequest {
  nickname?: string
  email?: string
  [key: string]: unknown
}

export interface UpdatePasswordRequest {
  old_pwd: string
  new_pwd: string
}

// 文章分类相关类型
export interface ArticleCategory {
  id?: number
  cate_name: string
  cate_alias: string
  create_time?: string
  update_time?: string
}

// 注册接口
export const userRegisterService = (params: RegisterRequest): Promise<ApiResponse<UserInfo>> => {
  return request.post('/api/reg', params)
}

// 登录接口
export const userLoginService = (params: LoginRequest): Promise<ApiResponse<UserInfo>> => {
  return request.post('/api/login', params)
}

//根据id获取用户信息接口
export const userGetInfoService = (id: number): Promise<ApiResponse<UserInfo>> => {
  return request.get('/api/my/userinfo', { params: { id } })
}

// 更新用户信息接口
export const userUpdateInfoService = (
  data: UpdateUserInfoRequest,
): Promise<ApiResponse<UserInfo>> => {
  return request.put('/api/my/userinfo/update', data)
}

//更新用户头像接口
export const userUpdateAvatarService = (data: {
  avatar: string
}): Promise<ApiResponse<UserInfo>> => {
  return request.post('/api/my/avatar/update', data)
}

// 更改用户密码接口
export const userUpdatePassService = (params: UpdatePasswordRequest): Promise<ApiResponse> => {
  return request.post('/api/my/password/update', params)
}

// 获取频道列表接口
export const artGetChannelsService = (): Promise<ApiResponse<ArticleCategory[]>> => {
  return request.get('/api/my/cate/list')
}

// 添加文章分类
export const artAddChannelService = (
  data: ArticleCategory,
): Promise<ApiResponse<ArticleCategory>> => {
  return request.post('/api/my/cate/add', data)
}

// 编辑文章分类
export const artEditChannelService = (
  data: ArticleCategory,
): Promise<ApiResponse<ArticleCategory>> => {
  return request.put('/api/my/cate/info', data)
}

// 删除文章分类
export const artDeleteChannelService = (id: number): Promise<ApiResponse> => {
  return request.delete('/api/my/cate/del', { params: { id } })
}

// 文章相关接口的类型
export interface ArticleQueryParams {
  page?: number
  pageSize?: number
  title?: string
  cate_id?: number
  [key: string]: unknown
}

export interface Article {
  id?: number
  title: string
  content: string
  img: string
  state: string
  cate_id: number
  create_time?: string
  update_time?: string
  [key: string]: unknown
}

//获取文章列表
export const artGetArticleService = (
  data: ArticleQueryParams,
): Promise<ApiResponse<{ list: Article[]; total: number }>> => {
  return request.get('/api/my/article/list', { params: data })
}

//根据id获取文章数据
export const artArticleInfoService = (id: number): Promise<ApiResponse<Article>> => {
  return request.get('/api/my/article/info', { params: { id } })
}

// 删除文章数据
export const artDeleteArticleService = (id: number): Promise<ApiResponse> => {
  return request.delete('/api/my/article/del', { params: { id } })
}

//发布文章
export const artPublishArticleService = (
  data: Article | FormData,
): Promise<ApiResponse<Article>> => {
  return request.post('/api/my/article/add', data)
}
