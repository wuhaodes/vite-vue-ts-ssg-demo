import request from '@/utils/request'

// 短信登录方法
export async function login(data: Record<string, any>) {
  return await request({
    url: '/login',
    method: 'post',
    data,
  })
}
// 手机号登录方法
export async function mobileLogin(data: Record<string, any>) {
  return await request({
    url: '/mobileLogin',
    method: 'post',
    data,
  })
}

// 发送短信验证码
export async function getForgotCode(params: Record<string, any>) {
  return await request({
    url: '/user/register/getForgotPwdCode',
    method: 'get',
    params,
  })
}
// 忘记密码
export async function forgotPwd(data: Record<string, any>) {
  return await request({
    url: '/user/register/handleForgotPassword',
    method: 'post',
    data,
  })
}

// 发送短信验证码
export async function getRegisterCode(params: Record<string, any>) {
  return await request({
    url: '/user/register/getRegisterCode',
    method: 'get',
    params,
  })
}
export async function getLoginCode(params: Record<string, any>) {
  return await request({
    url: '/user/register/getLoginCode',
    method: 'get',
    params,
  })
}

// 注册方法
export async function userRegister(data: Record<string, any>) {
  return await request({
    url: '/user/register/submit',
    method: 'post',
    data,
  })
}

// 获取用户详细信息
export async function getInfo() {
  return await request({
    url: '/getInfo',
    method: 'get',
  })
}

// 退出方法
export async function logout() {
  return await request({
    url: '/logout',
    method: 'post',
  })
}

// 获取验证码
export async function getCodeImg() {
  return await request({
    url: '/captchaImage',
    method: 'get',
  })
}
