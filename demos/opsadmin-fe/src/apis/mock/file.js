import { randomCharactors } from './mock-util';

const files = [];

export default {
  name: 'file',
  records: files,
  post_upload (formData) {
    const file = formData.get('file');
    const path = `${randomCharactors({ min: 32 })}_${file.name}`;

    file.savePath = path;

    files.push(file);

    return {
      code: 0,
      msg: '',
      data: path
    }
  }
};
