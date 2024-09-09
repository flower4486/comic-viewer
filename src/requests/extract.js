import JSZip, { file } from 'jszip';
let extractedImages = ref([]);

// 自定义比较函数，用于按照类似格式的属性进行自然数排序
function compareLabels(a, b) {
  const numberA = a.name;
  const numberB = b.name;
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
    dics.forEach((file) => {
      // console.log('file.name', file);
      const name = file.name.split('/').pop().split('.')[0];
      // console.log('file_index', name.split('/').pop().split('.')[0]);

      file
        .async('blob')
        .then((imageBlob) => {
          return URL.createObjectURL(imageBlob);
        })
        .then((img) => {
          extractedImages.value.push({ img, name });
        });
    });
  });
  return new Promise((res) => {
    res(extractedImages);
  });
};

export { extractAndDisplayImages, extractAndDisplayImages_sync, compareLabels };
