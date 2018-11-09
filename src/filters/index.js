/**
 * 将图片协议过滤为相对协议
 * @param {*} imgUrl 
 */
const relativeHttp =function(imgUrl){
  return typeof imgUrl=="string"?imgUrl.replace(/^(http:|https:)/,''):""
}
export default {
  relativeHttp
}
