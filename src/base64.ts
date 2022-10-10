class Base64 {
  byte2Char(n: number) {
    n &= 0x3f;
    if (n < 26) {
      // 65  "A"
      return String.fromCharCode(n + 65);
    } else if (n < 52) {
      // 97 "a"
      return String.fromCharCode(n - 26 + 97);
    } else if (n < 62) {
      // 48
      // return  ( n - 52 + '0' )
      return String.fromCharCode(n - 52 + 48);
    } else if (n == 62) return "+";
    else return "/";
  }

  char2byte(c: number): number {
    // A-Z
    if (c >= 65 && c <= 90) return c - 65;
    else if (c >= 97 && c <= 122) return c - 97 + 26;
    else if (c >= 48 && c <= 57) return c - 48 + 52;
    else if (c == 43) return 62;
    else if (c == 47) return 63;
    else return 64;
  }
  encode(arr: Uint8Array, lineBreak: number = 0): string {
    let result = "";
    let preValue = 0;
    const arrLen = arr.length;
    let ResultLen = 0;
    for (let i = 0; i < arrLen; i++) {
      const n = arr[i];
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

    let remain = arrLen % 3;
    if (remain != 0) {
      result += this.byte2Char(preValue);
      result += remain == 1 ? "==" : "=";
    }
    return result;
  }

  
  decode(base64: string) {
    let b64arr = new TextEncoder().encode(base64);
    let resultMax = new Uint8Array(b64arr.length);

    let N = b64arr.length;

    let cur = 0;
    let rCur = 0;
    let preV = 0;
    let validAsciiIdx = 0;
    let currentAscii = 64;
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
            const v1 = preV | (currentAscii >> 4);
            preV = currentAscii << 4;
            resultMax[rCur++] = v1;
            break;
          case 2:
            const v2 = preV | (currentAscii >> 2);
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
      } else {
        break;
      }
    }

    return resultMax.slice(0, rCur);
  }

  toByteArray(b64:string){
    return this.decode(b64)
  }


  fromByteArray(arr: Uint8Array, lineBreak: number = 0){
    return this.encode(arr,lineBreak)
  }
}

const base64js = new Base64
export {base64js} 