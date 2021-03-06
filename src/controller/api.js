const Base = require('./base.js');
const xml2js = require('xml2js');
module.exports = class extends Base {
    async __before() {
        const mock = this.mongoose('mock', 'mongoose');
        const url = this.ctx.url;
        var getPostData = function(ctx){
            return new Promise((resolve, reject) => {
                //获取xml格式的数据
                if (ctx.request.type.indexOf('xml')>-1) {
                  var data = "";
                  ctx.req.on("data", chunk => data += chunk);
                  ctx.req.on("end", () => resolve(data));
                }
                //使用koa-bodyparser获取json格式的数据
                else resolve(ctx.request.body);
              }
          )
        };
        let a = await getPostData(this.ctx);
        let parser = new xml2js.Parser();
        let getJson = function(data){
           return new Promise(function(resolve,reject){
                parser.parseString(data, function (err, result) {
                   if(err){
                       reject(err);
                   }else{
                       resolve(result);
                   }
                });
            });
        };
        console.log(a)
        let c = await getJson(a);
        console.log(JSON.stringify(c));
        const action = Object.keys(c['s:Envelope']['s:Body'][0])[1];
        const data = await mock.find({url:url,action:action});
        if(data.length>0){
            const headers= JSON.parse(data[0].resHeaders);
            for (const filed in headers) {
                this.ctx.set(filed,headers[filed]);
            }
            this.ctx.response.body = data[0].resContent;
            return false;
        }else{
            // var builder = new xml2js.Builder();
            // var xml = builder.buildObject(a.post);
            // console.log( Buffer.byteLength(xml));
            // console.log(xml);
            // this.ctx.req.body = xml;
            // let res = await proxy.web(this.ctx.req, this.ctx.res, {target: 'https://api.bettingpromotion.com/LiveTestAPI/BookmakerAPIService.asmx'})
           let option = {
            // These properties are part of the Fetch Standard
            method: this.ctx.method,
            headers: Object.assign(this.ctx.headers,{'Content-Length': Buffer.byteLength(a),'Host':'api.bettingpromotion.com'}),        // request headers. format is the identical to that accepted by the Headers constructor (see below)
            body: a,         // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
          
            // The following properties are node-fetch extensions
            timeout: 0,         // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
          };
          let res =await this.fetch('https://api.bettingpromotion.com/LiveTestAPI/BookmakerAPIService.asmx',option);
          let data = await res;
          const headers = data.headers.raw();
         console.log(headers);
          for (let key in headers){
              console.log(key +'  ' +headers[key][0].toString());
            this.ctx.set(key,headers[key][0]);
          }
            // this.ctx.set('content-type','text/xml; charset=utf-8')
          this.ctx.response.body = await data.text();
          return false;
        }
    }
};
