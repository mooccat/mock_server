import { get } from "http";

module.exports = class extends think.Mongoose {
    get schema() {
      const schema = new think.Mongoose.Schema({
        url: {
          type: String,
        },
        method:{
          type:String,
          default:'get'
        },
        action: {
          type: String,
        },
        resCode: {
            type:Number,
            default:200
        },
        resHeaders:{
            
        },
        resContent:{

        }
      });
      return schema;
    }
  };
  