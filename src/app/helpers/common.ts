export class Common {
    static loadPromise(executionFunc: Function) {
         return new Promise((success, error) => {
             try {
                 executionFunc(success, error);
             } catch (err) {
                // Recorder.error(err);
                 error(err && err.message);
             }
         })
     };
     static mongoCallBk(onError: Function, method: Function) {
         return (err, response) => {
             try {
                 if (err) {
                     onError(err && err.message);
                 }
                 method(response);
             }
             catch (e) {
                // Recorder.error(e);
                 onError([(e && e.message), 500]);
             }
         }
     }
     static LoadModel(data, ModelClass) {
        var obj = new ModelClass();
        var load = function (iData, instance) {
            if (typeof instance === "object") {
                for (let key in instance) {
                    let isKey = false;
                    if (key === "id" && iData[key] === undefined) {
                        key = "_id";
                        isKey = true;
                    }
                    if (iData[key] !== undefined && typeof instance[key] === "function") {
                        instance[key] = instance[key]();
                    }
                    if (Array.isArray(instance[key])) {
                        if (iData[key] !== undefined && !iData[key].length) {
                            instance[key] = [];
                        } else if (iData[key] !== undefined && instance[key].length > 0 && typeof instance[key][0] === "string") {
                            instance[key] = iData[key].map(keyData => keyData.toString());
                        } else if (iData[key] !== undefined) {
                            instance[key] = iData[key].map(keyData => load(keyData, Common.deepCopy(instance[key][0])));
                        } else {
                            delete (instance[key]);
                        }
                    } else if (typeof instance[key] === "object") {
                        if (iData[key] !== undefined && Array.isArray(iData[key]) && iData[key][0]) {
                            load(iData[key][0], instance[key]);
                        } else if (iData[key] !== undefined && !Array.isArray(iData[key])) {
                            load(iData[key], instance[key]);
                        } else {
                            delete (instance[key]);
                        }
                    } else {
                        if (iData[key] !== undefined) {
                            if (isKey) {
                                instance["id"] = iData[key].toString();
                            } else {
                                instance[key] = iData[key];
                            }
                        }
                    }
                }
            } else if (typeof instance === "string") {
                instance = iData.toString();
            } else if (typeof instance === "number") {
                instance = parseInt(iData);
            }
            return instance;
        }
        load(data, obj);
        return obj;
    }
     static MakeUID(isDivided?: boolean): string {
        return Date.now().toString(16) + (isDivided ? "_" : "") + Math.random().toString(16).substring(2, 8);
    }
     static EnumValidator(enumClass) {
         return {
             validator: value => Object.values(enumClass).indexOf(value) !== -1,
             message: props => `Invalid ${props.path}`
         };
     }

     static deepCopy = (object) => {
        var clone = {};
        for (var index in object) {
            if (object[index] != null && typeof (object[index]) === "object")
                clone[index] = Common.deepCopy(object[index]);
            else
                clone[index] = object[index];
        }
        return clone;
    }
    static randomNumber(length){
        return Math.floor(Math.pow(10, length - 1) + (Math.random() * 9 * Math.pow(10, length - 1)));
    }
     
     
 }