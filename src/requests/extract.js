import JSZip from 'jszip';
let extractedImages = ref([]);

// 自定义比较函数，用于按照类似格式的属性进行自然数排序
function compareLabels(a, b) {
  const numberA = parseInt(a.name.match(/\d+/g)[1]);
  const numberB = parseInt(b.name.match(/\d+/g)[1]);
  return numberA - numberB;
}

const extractAndDisplayImages = (zipData) => {
  if (!zipData) {
    return;
  }
  JSZip.loadAsync(zipData).then((zip) => {
    const imagePromises = [];
    let dics = [];
    // console.log('zip:', zip);
    zip.forEach((relativePath, file) => {
      if (!file.dir && file.name.match(/\.(webp|jpg|jpeg|png)$/i)) {
        dics.push(file);
      }
    });
    // Promise.all(imagePromises).then((Images) => {
    //   // console.log('Images', Images);
    //   extractedImages = Images;
    // });
    dics.sort(compareLabels);
    console.log(dics);
    for (const file of dics) {
      file
        .async('blob')
        .then((imageBlob) => {
          return URL.createObjectURL(imageBlob);
        })
        .then((img) => {
          extractedImages.value.push(img);
        });
    }
  });
};
async function processImage(file) {
  try {
    const imageBlob = await file.async('blob');
    const img = URL.createObjectURL(imageBlob);
    extractedImages.value.push(img);
  } catch (error) {
    // 处理错误
    console.error(error);
  }
}
export { extractedImages, extractAndDisplayImages };
