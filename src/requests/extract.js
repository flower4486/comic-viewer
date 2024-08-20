import JSZip, { file } from 'jszip';
let extractedImages = ref([]);

// 自定义比较函数，用于按照类似格式的属性进行自然数排序
function compareLabels(a, b) {
  const numberA = a.index;
  const numberB = b.index;
  return numberA - numberB;
}

const extractAndDisplayImages = (zipData) => {
  if (!zipData) {
    return;
  }
  JSZip.loadAsync(zipData).then((zip) => {
    const imagePromises = [];
    zip.forEach((relativePath, file) => {
      if (!file.dir && file.name.match(/\.(webp|jpeg|png|jpg)$/g)) {
        const imagePromise = file.async('blob').then((imageBlob) => {
          return URL.createObjectURL(imageBlob);
        });
        imagePromises.push(imagePromise);
      }
    });
    Promise.all(imagePromises).then((images) => {
      extractedImages.value = images;
    });
  });
};
const extractAndDisplayImages_sync = (zipFile) => {
  let dics = [];
  extractedImages.value = [];
  JSZip.loadAsync(zipFile).then((zip) => {
    zip.forEach((relativePath, file) => {
      if (!file.dir && file.name.match(/\.(webp|jpg|jpeg|png)$/i)) {
        dics.push(file);
      }
    });
    // console.log('dics', dics);

    dics.forEach((file, index) => {
      console.log('file.name', file.name);
      file
        .async('blob')
        .then((imageBlob) => {
          return URL.createObjectURL(imageBlob);
        })
        .then((img) => {
          extractedImages.value.push({ img, index });
        });
    });
  });
};

export { extractedImages, extractAndDisplayImages, extractAndDisplayImages_sync, compareLabels };
