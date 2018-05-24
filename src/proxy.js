const httpProxy = require('http-proxy')
const through2 = require('through2')
const unzip = require('zlib').unzipSync

module.exports = function proxyTo () {
  let proxy = httpProxy.createProxyServer()
  const web = proxy.web
  proxy.on('proxyRes', function (proxyRes, req, res) {
   
  })
  // promisefy request
  proxy.web = function () {
    let args = arguments
    let res = arguments[1]
    return new Promise(function (resolve, reject) {
      web.call(proxy, ...args, function (res) {
        reject(res)
      })
      res.on('finish', function () {
        if (res.bufferBody && res.bufferBody.length) {
          let buffer = Buffer.concat(res.bufferBody)
          let data
          try {
            buffer = unzip(buffer)
          } catch (e) {
          }

          data = buffer.toString('utf8')
         
          if (res.isJSON) {
            try {
              data = JSON.parse(data)
            } catch (e) {

            }
          }
          res.proxyBody = data
        }
        resolve()
      })
    })
  }

  // restream body
  proxy.on('proxyReq', function (proxyReq, req, res, options) {
    console.log(proxyReq)
    if (req.body) {
      let bodyData = req.body.toString();
      console.log('body:'+bodyData);
      // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
      proxyReq.setHeader('Content-Type', 'text/xml')
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
      // stream the content
      proxyReq.write(bodyData)
    }
  })
  return proxy
}