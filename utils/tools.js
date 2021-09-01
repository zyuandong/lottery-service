const fs = require('fs');
const path = require('path');

const mkdir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const getState = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
      }
    });
  });
};

const isExistsDir = async (dir) => {
  // console.log('==dir=', dir);
  // console.log('=== path.parse', path.parse(dir).dir);
  // const isExists = fs.statSync(dir);

  const isExists = await getState(dir);

  if (isExists && isExists.isDirectory()) {
    return true;
  } else {
    return false;
  }

  // return isExists;
};

// const mkdirs = async (dir, callback) => {
//   const flag = await isExistsDir(dir)
//   if (flag) {
//     callback()
//   } else {
//     console.log('+++', path.dirname(dir));
//     mkdirs(path.dirname(dir), () => {
//       fs.mkdir(dir, callback);
//     })
//   }
// }

const base64ToSVG = (str, filePath) => {
  const buf = Buffer.from(str, 'base64');
  fs.writeFile(filePath, buf, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('== base64 to SVG success');
    }
  });
  return filePath;
};

module.exports = {
  mkdir,
  // mkdirs,
  isExistsDir,
  base64ToSVG,
};
