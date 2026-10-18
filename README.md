# My HTML Site

我的第一个 HTML 学习网站，用来记录从页面结构到网站部署的学习过程。

## 当前学习进度

截至 2026-10-19，结合提交记录与当前代码，已完成以下内容：

- 首页：自我介绍、技能列表、项目预览和联系入口。
- 项目页：三个项目的文字介绍、截图、GitHub 链接，以及新窗口外链的 `rel="noopener noreferrer"` 属性。
- 联系页：电子邮件链接，以及姓名、邮箱、留言和提交按钮；输入项使用 `label`、`required` 和 `type="email"` 等原生表单属性。
- 404 页面：错误提示、导航和返回首页的链接。
- 公共 CSS：四个页面均已引入样式文件，定义了颜色、间距、字体和内容宽度变量。
- 基础布局：导航使用 Flexbox，项目卡片使用三列 Grid；视口宽度不超过 `768px` 时卡片改为单列，导航允许换行。
- 项目卡片图片已设置 `max-width: 100%` 和 `height: auto`。
- 已建立 Git 提交历史，并将学习进度推送到 GitHub 的 `main` 分支。

当前已进入阶段 3 的 CSS 与响应式布局学习；基础布局已写入代码，仍需继续完善和验收。

### 待完善内容与已知限制

- 联系表单尚无后端或发信服务，当前不会发送邮件；还需补充任务书要求的主题字段，并将表单中的 `dir` 元素替换为合适的容器。
- 部分页面有两个 `h1`，需要调整标题层级；项目图片路径还需统一为 URL 使用的 `/` 分隔符。
- 补齐链接、按钮和输入框的 `:focus-visible` 样式，并检查文字对比度。
- 在 `360px`、`768px`、`1440px` 视口下验证布局、溢出、图片和表单，并检查键盘操作。
- `assets/js/main.js` 当前为空；移动导航开关、`aria-expanded` 同步和页脚年份更新尚未实现。
- 浏览器控制台、网络请求、HTML 语义与 Lighthouse 检查尚需完成；本 README 未记录已通过的质量评分。
- 补充网站实际预览截图。
- `deploy/nginx.conf` 当前为空；服务器部署、域名、HTTPS 和回滚演练尚未完成，目前没有已记录的线上网站地址。

完整学习任务见 [HTML网站从零到服务器任务书](HTML网站从零到服务器任务书.md)。以上进度以现有代码为准；任务书中个别勾选项与代码细节仍需核对。

## 提交记录与学习里程碑

- 2026-10-18 · [`6354ac8`](https://github.com/lfu45757-star/my-html-site/commit/6354ac8a351e1e4cc6fbe23a1e405a35041d5d0b)：创建 HTML 页面、项目图片、学习任务书和目录骨架。
- 2026-10-18 · [`2bb7b83`](https://github.com/lfu45757-star/my-html-site/commit/2bb7b8350b8b4556a45d0808e08f867f9ebcf515)：补充当时的学习进度与 VS Code 手动提交、推送教程。
- 2026-10-19 · [`1e8e48d`](https://github.com/lfu45757-star/my-html-site/commit/1e8e48d4023d1e207350079f1dbc522fb5fbbe27)：引入公共 CSS，完成 Flexbox 导航、Grid 项目卡片和移动端断点；同时补充联系表单、404 页面及外链属性，并整理 Markdown 格式。

查看[完整提交历史](https://github.com/lfu45757-star/my-html-site/commits/main/)。

## 项目结构

```text
my-HTML-site/
├── index.html
├── projects.html
├── contact.html
├── 404.html
├── README.md
├── HTML网站从零到服务器任务书.md
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
└── deploy/nginx.conf
```

## 本地查看

使用 VS Code 打开项目文件夹，安装 Live Server 扩展后，右键 `index.html`，选择 **Open with Live Server**。

也可以直接用浏览器打开 `index.html` 查看当前静态页面。如果已安装 Python，可以在项目目录执行：

```powershell
python -m http.server 8080
```

然后访问 <http://localhost:8080>。当前没有构建步骤，也不需要安装 npm 依赖。

## 在 VS Code 中手动提交并推送

本项目远程仓库：<https://github.com/lfu45757-star/my-html-site>，分支为 `main`。

1. 在 VS Code 中打开本项目文件夹，修改代码后按 `Ctrl+S` 保存。
1. 按 `Ctrl+Shift+G` 打开“源代码管理”，点击文件检查本次差异。
1. 点击需要提交的文件旁的 `+`，把改动加入“暂存的更改”。如果全部文件都需要上传，可以点击“更改”标题旁的 `+`。
1. 在消息框中填写本次学习内容，例如 `feat: add homepage styles`，点击“提交（Commit）”。此时只是保存到了本地 Git。
1. 按 `Ctrl+Shift+P`，运行 `Git: Push`，把提交上传到 GitHub。也可从源代码管理的 `…` 菜单选择“推送（Push）”。
1. 刷新 GitHub 仓库页面，确认最新提交已出现。若提示登录，使用自己的 GitHub 账号完成浏览器授权。

“同步更改（Sync Changes）”会先拉取远程提交再推送本地提交。如果只想上传，选择“推送”。本项目首次推送完成后，后续不需要重新初始化仓库或重复添加 `origin`。

### VS Code 终端中的等价命令

在项目根目录打开终端，先检查改动，再执行：

```powershell
git status
git diff
git add .
git commit -m "feat: describe this learning update"
git push
```

`git add .` 会暂存当前目录下所有未忽略的改动，执行前先确认列表中都是准备上传的文件。没有改动时，无需再次提交。

如果提示远程有本地尚未获取的提交，先保存并提交本地改动，再执行 `git pull --rebase`，处理可能的冲突后执行 `git push`。

参考：[VS Code 提交说明](https://code.visualstudio.com/docs/sourcecontrol/staging-commits)、[远程仓库与推送](https://code.visualstudio.com/docs/sourcecontrol/repos-remotes)。
