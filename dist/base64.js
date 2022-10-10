"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Base64 = /** @class */ (function () {
    function Base64() {
    }
    Base64.prototype.byte2Char = function (n) {
        n &= 0x3f;
        if (n < 26) {
            // 65  "A"
            return String.fromCharCode(n + 65);
        }
        else if (n < 52) {
            // 97 "a"
            return String.fromCharCode(n - 26 + 97);
        }
        else if (n < 62) {
            // 48
            // return  ( n - 52 + '0' )
            return String.fromCharCode(n - 52 + 48);
        }
        else if (n == 62)
            return "+";
        else
            return "/";
    };
    Base64.prototype.char2byte = function (c) {
        // A-Z
        if (c >= 65 && c <= 90)
            return c - 65;
        else if (c >= 97 && c <= 122)
            return c - 97 + 26;
        else if (c >= 48 && c <= 57)
            return c - 48 + 52;
        else if (c == 43)
            return 62;
        else if (c == 47)
            return 63;
        else
            return 64;
    };
    Base64.prototype.encode = function (arr, lineBreak) {
        if (lineBreak === void 0) { lineBreak = 0; }
        var result = "";
        var preValue = 0;
        var arrLen = arr.length;
        var ResultLen = 0;
        for (var i = 0; i < arrLen; i++) {
            var n = arr[i];
            switch (i % 3) {
                case 0:
                    result += this.byte2Char(n >> 2);
                    preValue = (n << 4) & 0x3f;
                    ResultLen++;
                    if (ResultLen && lineBreak && ResultLen % lineBreak == 0) {
                        result += "\r\n";
                    }
                    break;
                case 1:
                    result += this.byte2Char((n >> 4) | preValue);
                    preValue = (n << 2) & 0x3f;
                    ResultLen++;
                    if (ResultLen && lineBreak && ResultLen % lineBreak == 0) {
                        result += "\r\n";
                    }
                    break;
                case 2:
                    result += this.byte2Char((n >> 6) | preValue);
                    ResultLen++;
                    if (ResultLen && lineBreak && ResultLen % lineBreak == 0) {
                        result += "\r\n";
                    }
                    result += this.byte2Char(n);
                    ResultLen++;
                    if (ResultLen && lineBreak && ResultLen % lineBreak == 0) {
                        result += "\r\n";
                    }
                    break;
                default:
                    break;
            }
        }
        var remain = arrLen % 3;
        if (remain != 0) {
            result += this.byte2Char(preValue);
            result += remain == 1 ? "==" : "=";
        }
        return result;
    };
    Base64.prototype.decode = function (base64) {
        var b64arr = new TextEncoder().encode(base64);
        var resultMax = new Uint8Array(b64arr.length);
        var N = b64arr.length;
        var cur = 0;
        var rCur = 0;
        var preV = 0;
        var validAsciiIdx = 0;
        var currentAscii = 64;
        while (cur < N) {
            currentAscii = 64;
            do {
                currentAscii = this.char2byte(b64arr[cur]);
                cur++;
            } while (currentAscii == 64 && cur < N);
            if (currentAscii < 64) {
                switch (validAsciiIdx & 3) {
                    case 0:
                        preV = currentAscii << 2;
                        break;
                    case 1:
                        var v1 = preV | (currentAscii >> 4);
                        preV = currentAscii << 4;
                        resultMax[rCur++] = v1;
                        break;
                    case 2:
                        var v2 = preV | (currentAscii >> 2);
                        preV = currentAscii << 6;
                        resultMax[rCur++] = v2;
                        break;
                    case 3:
                        resultMax[rCur++] = preV | currentAscii;
                        break;
                    default:
                        break;
                }
                validAsciiIdx++;
            }
            else {
                break;
            }
        }
        return resultMax.slice(0, rCur);
    };
    Base64.prototype.toByteArray = function (b64) {
        return this.decode(b64);
    };
    Base64.prototype.fromByteArray = function (arr, lineBreak) {
        if (lineBreak === void 0) { lineBreak = 0; }
        return this.encode(arr, lineBreak);
    };
    return Base64;
}());
var base64js = new Base64;
exports.base64js = base64js;
