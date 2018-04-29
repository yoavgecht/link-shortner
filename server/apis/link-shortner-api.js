const alphabets = '123456789abcdfghijklmnopqrstuvwxyzABCDFGHJKLMNOPQRSTUVWXYZ',
base = alphabets.length;


/**
 * Taken from
 * https://github.com/delight-im/ShortURL/blob/master/JavaScript/ShortURL.js
 *
 * @param num
 * @returns returns shortened code that maps to the database
 */
const encode = (num) => {
    let encoded = '';
    while (num > 0) {
        var remainder = num % base;
        num = Math.floor(num / base);
        encoded = alphabets[remainder].toString() + encoded;
        
    }
    return encoded;
};

/**
 * Taken from
 * https://github.com/delight-im/ShortURL/blob/master/JavaScript/ShortURL.js
 *
 * @param code
 * @returns ID in database
 */


const decode = (str) => {
   var decoded = 0;
    while (str){
        var index = alphabets.indexOf(str[0]);
        var power = str.length - 1;
        decoded += index * (Math.pow(base, power));
        str = str.substring(1);
    }
    return decoded;
}

module.exports = {
    encode, decode
};