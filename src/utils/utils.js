export function getFileType(filename) {
  filename.toString();
  let filetype = filename.split('.').pop();
  return filetype;
}

//切分数组
export function chunkArray(array, chunkSize) {
  const chunks = Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, index) => array.slice(index * chunkSize, index * chunkSize + chunkSize));
  return chunks;
}

// 自定义比较函数，用于对包含更复杂汉字数字的数组进行排序
function compareChineseNumbers(a, b) {
  const chineseMap = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10, 百: 100, 千: 1000, 万: 10000 };

  function convertChineseToNumber(chinese) {
    let result = 0;
    let current = 0;
    let lastUnit = 1; // 上一个单位，默认为个位

    for (let i = 0; i < chinese.length; i++) {
      if (chineseMap[chinese[i]] >= 10) {
        if (chineseMap[chinese[i]] > lastUnit) {
          current = current ? current * chineseMap[chinese[i]] : chineseMap[chinese[i]];
          lastUnit = chineseMap[chinese[i]];
        } else {
          result += current;
          current = chineseMap[chinese[i]];
          lastUnit = chineseMap[chinese[i]];
        }
      } else {
        current += chineseMap[chinese[i]];
      }
    }

    result += current;
    return result;
  }
  if (a != null && b != null) {
    const numA = convertChineseToNumber(a);
    const numB = convertChineseToNumber(b);
    return numA - numB;
  } else if (a == null) {
    return -1;
  } else if (b == null) {
    return 1;
  }
}

function getChineseNumber(str) {
  return str.match(/[零一二三四五六七八九十百千万亿]+/g);
}
export // 自定义比较函数，根据字符串中的数字部分进行排序
function chapterSort(a, b) {
  if (a.cname.match(/\d+/) == null || b.cname.match(/\d+/) == null) {
    return compareChineseNumbers(getChineseNumber(a.cname), getChineseNumber(b.cname));
  } else {
    const a_arr = a.cname.match(/\d+/g);
    const b_arr = b.cname.match(/\d+/g);

    for (let index = 0; index < a_arr.length; index++) {
      let numA = parseInt(a_arr[index]); // 提取字符串中的数字部分并转为整数
      let numB = parseInt(b_arr[index]);
      if (numA != numB) {
        return numA - numB;
      }
    }
    return 0;
  }
}
