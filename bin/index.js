#! /usr/bin/env node
/*
 * @Author: lyu
 * @Date: 2021-04-03 13:51:55
 * @LastEditTime: 2022-08-11 08:53:40
 * @LastEditors: Please set LastEditors
 * @FilePath: /generate-pages/bin/index.js
 */

const { resolve } = require('path');
const {
  argv: {
    config: configPath,
    watch: watchPath
  }
} = require('yargs');
const _ = require('lodash');
const fs = require('fs-extra');
const shell = require('shelljs');
const chalk = require('chalk');
const CONFIG = require('../src/config');
const rootPath = process.cwd(); // 当前用户项目根目录
// 内部执行入口js
const evalJsPath = resolve(__dirname, '../src/index.js');
// 获取到nodemon 默认配置
const monConfigPath = resolve(__dirname, '../nodemon.json');
// 获取到用户定义配置文件 pages.config.js
let pagesConfigPath = resolve(rootPath, './pages.config.js');
// pages.config.js 内容
let pagesConfigJSON = {};

(async () => {
  if (configPath === true || configPath == null) {
    const exists = await fs.pathExists(pagesConfigPath);
    if (!exists) {
      // 文件不存在的时候
      return console.log(chalk.red.bold(`配置文件 pages.config.js 不存在，请配置或者通过命令行传递 --config`));
    }
  } else {
    pagesConfigPath = resolve(rootPath, configPath);
  }

  try {
    // 开始读取 配置文件内容 pages.config.js
    pagesConfigJSON = require(pagesConfigPath);
    // 没有通过cli传递的 watch 读取 配置文件中的
    if (watchPath === true || watchPath == null) {
      if (pagesConfigJSON.nodemon == null) {
        return console.log(chalk.red.bold(`nodemon节点不存在且 watch 目录不存在，请检查配置`));
      }
      if (pagesConfigJSON.nodemon != null && pagesConfigJSON.nodemon.watch == null) {
        return console.log(chalk.red.bold(`watch 目录不存在，请检查配置`));
      }
    } else {
      if (pagesConfigJSON.nodemon == null) {
        CONFIG.nodemon = {};
      }
      pagesConfigJSON.nodemon.watch = [resolve(rootPath, watchPath)];
    }
  } catch (error) {
    console.error(error);
    return console.log(chalk.red.bold(`配置文件读取失败，请检查配置文件`));
  }
  const nodemonJSON = await fs.readJson(monConfigPath);
  // 将配置合并
  _.merge(CONFIG, pagesConfigJSON);
  // 将配置合并 nodemon.json
  _.merge(nodemonJSON, CONFIG.nodemon);
  try {
    await fs.writeJson(monConfigPath, nodemonJSON);
  } catch (error) {
    console.error(error);
    return console.log(chalk.red.bold(`写入 nodemon.json 失败，请检查 config.js 配置`));
  }
  for (const [key, value] of Object.entries(CONFIG.rule)) {
    CONFIG.rule[key] = value.toString();
  }
  // 写入到缓存文件中
  await fs.writeJson(resolve(__dirname, '../cache.config.json'), { ...CONFIG, pagesConfigPath });
  shell.exec(`nodemon ${evalJsPath} --config ${monConfigPath}`);
})();
