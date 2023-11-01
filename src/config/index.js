/*
 * @Author: lyu
 * @Date: 2021-04-05 21:20:45
 * @LastEditTime: 2021-04-06 08:37:50
 * @LastEditors: lyu
 * @FilePath: /generate-pages/src/config/index.js
 */
module.exports = {
  publicPath: '',
  pagesEntry: './config/index.js',
  pagesJsonPath: './pages.json',
  includes: [],
  rule: {
    globalStyle: /(?<=const\s+GLOBALSTYLE\s*=\s*)\{[\s\S]*?}(?=\s*;)/,
    easycom: /(?<=const\s+EASYCOM\s*=\s*)\{[\s\S]*?}(?=\s*;)/,
    tabBar: /(?<=const\s+TABBAR\s*=\s*)\{[\s\S]*?}(?=\s*;)/,
    condition: /(?<=const\s+CONDITION\s*=\s*)\{[\s\S]*?}(?=\s*;)/,
    subPackages: /(?<=const\s+SUBPACKAGES\s*=\s*)\[[\s\S]*?](?=\s*;)/,
    preloadRule: /(?<=const\s+PRELOADRULE\s*=\s*)\{[\s\S]*?}(?=\s*;)/,
    pagesother: /(?<=const\s+PAGESOTHER\s*=\s*)\{[\s\S]*?}(?=\s*;)/
  },
  nodemon: {
    'verbose': false,
    'execMap': {
      'js': 'node --harmony'
    },
    'restartable': 'rs',
    'ignore': ['.git', 'node_modules/*'],
    'env': {
      'NODE_ENV': 'development'
    },
    'ext': 'js'
  }
};
