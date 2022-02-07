const whitelistAddresses = require('./whitelist.json');

//var variable = whitelistAddresses['0xca10036f643f6B6A13f1454F638b2e3c65A9E5B6'].valueOf();
//console.log(variable);

var result = "";

function getNames(obj, name) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if ("object" == typeof(obj[key])) {
                getNames(obj[key], name);
            } else if (key.toLowerCase == name.toLowerCase) {
                result = (obj[key]);
            }
        }
    }
}

var wallet = "0xb860ba0e67c82151175ca4b4720d49f549ae8faa"

getNames(whitelistAddresses, "0xb860ba0e67c82151175ca4b4720d49f549ae8faa");
console.log(result);


if (wallet.toLowerCase === result.toLowerCase){
    console.log("true döndüm");
}