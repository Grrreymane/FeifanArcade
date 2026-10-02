# 非凡街机厅 · Feifan Arcade

Feifan 的像素游戏作品集。纯静态站点，无构建依赖，中英双语。

- `index.html` / `style.css` / `app.js` — 页面、样式、路由（`#/` 街机厅首页，`#/<slug>` 游戏详情）
- `assets/<slug>/data.json` — 每款游戏的文案、数据、截图列表（中英双语）
- `data.js` / `play/games.js` — 由 `node tools/build-data.mjs` 从各 data.json 生成（`friends_only` 的游戏只进亲友版）
- `locked.js` — 求职版的加密包（data.js + app.js），由 `tools/lock.mjs` 生成，`gate.js` 在浏览器里输密码解密

## 更新求职版

改完 data.json 或 app.js 后，需要重新生成并加密：

```bash
node tools/build-data.mjs
FA_PASSWORD='你的密码' node tools/lock.mjs
```

换密码也是重跑这一步；旧设备上记住的密码会自动失效。密码门只防普通访客：仓库是公开的，源文件在 GitHub 上仍然看得到。

## 本地预览

```bash
node tools/serve.mjs 5190
```

## 重新截图

截图用无依赖的 headless Chrome 脚本 `tools/shoot.mjs`，每张图的状态配方在 `tools/recipes/`：

```bash
node --experimental-websocket tools/shoot.mjs tools/recipes/rebirthday-shots.mjs
```

配方会读取同级目录 `../Fishing`、`../人生重开模拟器`、`../mouse-cultivation-2` 里的游戏源码。

## 亲友版

`play/` 是给亲友的轻松版入口（`/FeifanArcade/play/`）：不需要密码，只有街机厅，没有求职内容，不被搜索引擎收录。光速逃亡和我被Agent包围了只在亲友版里。
机子上的"你的存档"彩蛋读取的是访客自己浏览器里的游戏存档（`sea-monster-*`、`rl-meta`、`mouse_cultivation_save_v4`），
这要求网站和游戏在同一个域名下；以后换自定义域名时，这个彩蛋会读不到存档。
