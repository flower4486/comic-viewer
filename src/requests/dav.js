import { pa } from 'element-plus/es/locales.mjs';
import { createClient } from 'webdav';

const client = createClient('http://192.168.31.70:5244/dav', {
  username: 'admin',
  password: 'root',
});

async function listDirectory(path) {
  const list = await client.getDirectoryContents(path);
  console.log('list:', list);
  return list;
}

async function getFileContent(path) {
  const buff = await client.getFileContents(path);
  return buff;
}

export { listDirectory, getFileContent };
