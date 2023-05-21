import axios from 'axios'
import env from '@/service/env/index.js'

const host = env.backendHost
if (host) {
  axios.defaults.baseURL = host
}
// axios.interceptors.request.use(jwtInjector)

axios.interceptors.response.use(
  (res) => res,
  (e) => {
    return Promise.reject(e)
  }
)
function onError(e) {
  let res = e
  if (e.response) {
    res = e.response && e.response.data
    res = res || { cause: '' }
    res.success = false
    res.status = e.response.status
    res._error = e
  } else {
    res = {
      success: false,
      cause: e.message,
      status: 599
    }
  }
  throw res
}
function onSuccess(res, callback) {
  res.data.status = res.status
  if (callback) {
    callback(res.data)
  }
  return res.data
}
function parseArgs(params: any[]) {
  if (params.length < 1) {
    throw new Error('...(url, [args], callback) required')
  }
  let callback = params[params.length - 1]
  if (typeof callback !== 'function') {
    callback = null
  }

  const args = []
  const limit = callback ? params.length - 1 : params.length
  for (let i = 0; i < limit; i++) {
    args[i] = params[i]
  }
  return {
    args: args,
    callback: callback
  }
}
let codec
function GET(...args: any[]) {
  let param = parseArgs(args)
  if (param.args.length === 2) {
    param.args[1] = { params: param.args[1] }
  }
  return (
    axios
      // @ts-ignore
      .get(...param.args)
      .then((res) => onSuccess(res, param.callback))
      .catch((err) => onError(err))
  )
}
function POST(...args: any[]) {
  const param = parseArgs(args)
  return (
    axios
      // @ts-ignore
      .post(...param.args)
      .then((res) => onSuccess(res, param.callback))
      .catch((err) => onError(err))
  )
}
function UPLOAD(url, formData, callback) {
  return axios
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => onSuccess(res, callback))
    .catch((err) => onError(err))
}
function PUT(args) {
  const param = parseArgs(args)
  return (
    axios
      // @ts-ignore
      .put(...param.args)
      .then((res) => onSuccess(res, param.callback))
      .catch((err) => onError(err))
  )
}
function DELETE(args) {
  const param = parseArgs(args)
  if (param.args.length === 2) {
    param.args[1] = { data: param.args[1] }
  }
  return (
    axios
      // @ts-ignore
      .delete(...param.args)
      .then((res) => onSuccess(res, param.callback))
      .catch((err) => onError(err))
  )
}
const getCodec = () => codec

export { GET, PUT, POST, DELETE, UPLOAD, getCodec, onError, onSuccess }
