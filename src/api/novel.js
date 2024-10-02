import { requests } from '@/utils/requests';

export function getNovelId(novel_name) {
  return new Promise((res, rej) => {
    requests({
      url: '/novel/id',
      method: 'POST',
      data: {
        name: novel_name,
      },
    })
      .then((result) => {
        console.log('net return', result.data);
        res(result.data);
      })
      .catch((error) => {
        rej(error);
      });
  });
}

export function uploadNovel(formData) {
  return new Promise((res, rej) => {
    requests({
      url: '/novel/uploadNovel',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    })
      .then((result) => {
        res(result.data);
      })
      .catch((error) => {
        rej(error);
      });
  });
}

export function getChapterList(nid) {
  return new Promise((res, rej) => {
    requests({
      url: '/novel/chapterList',
      method: 'POST',
      data: {
        nid,
      },
    })
      .then((result) => {
        res(result.data);
      })
      .catch((error) => {
        rej(error);
      });
  });
}

export function getChapterContent(cid) {
  console.log('cid', cid);
  return new Promise((res, rej) => {
    requests({
      url: '/novel/chapterContent',
      method: 'POST',
      data: {
        cid: cid,
      },
    })
      .then((result) => {
        res(result.data);
      })
      .catch((error) => {
        rej(error);
      });
  });
}

export function deleNovelPost(nid) {
  return new Promise((res, rej) => {
    requests({
      url: '/novel/deleNovel',
      method: 'POST',
      data: {
        nid: nid,
      },
    })
      .then((result) => {
        res(result.data);
      })
      .catch((error) => {
        rej(error);
      });
  });
}

export function addRecordPost(rname, cnum, pnum) {
  console.log('addRecord', `${rname}+${cnum}+${pnum}`);

  return new Promise((res, rej) => {
    requests({
      url: '/novel/addRecord',
      method: 'POST',
      data: {
        rname,
        cnum,
        pnum,
      },
    })
      .then((result) => {
        res(result.data);
      })
      .catch((err) => {
        rej(err);
      });
  });
}
export function selctRecordPost(rname) {
  console.log('rname', rname);

  return new Promise((res, rej) => {
    requests({
      url: '/novel/selectRecord',
      method: 'POST',
      data: {
        rname,
      },
    })
      .then((result) => {
        res(result.data);
      })
      .catch((err) => {
        rej(err);
      });
  });
}
//查询收藏
export function selctLikesPost() {
  return new Promise((res, rej) => {
    requests({
      url: '/like/all',
      method: 'POST',
      data: {},
    })
      .then((result) => {
        res(result.data);
      })
      .catch((err) => {
        rej(err);
      });
  });
}
//添加收藏
export function addLikesPost(lname, path) {
  return new Promise((res, rej) => {
    requests({
      url: '/like/add',
      method: 'POST',
      data: {
        lname,
        path,
      },
    })
      .then((result) => {
        res(result.data);
      })
      .catch((err) => {
        rej(err);
      });
  });
}
// 删除收藏
export function deleLikePost(lname) {
  console.log('lname', lname);

  return new Promise((res, rej) => {
    requests({
      url: '/like/dele',
      method: 'POST',
      data: {
        lname,
      },
    })
      .then((result) => {
        res(result.data);
      })
      .catch((error) => {
        rej(error);
      });
  });
}
