# My HTML Site

我的第一个 HTML 学习网站，用来记录从页面结构到网站部署的学习过程。

## 当前学习进度

截至 2026-10-18，已完成的代码内容：

- 首页：自我介绍、技能列表、项目预览和联系入口。
- 项目页：三个项目的文字介绍、截图和 GitHub 链接。
- 联系页：电子邮件链接。
- 已使用 HTML 文档骨架、语义化标签、列表、链接和图片。
- 已初始化 Git 并保存首次提交。

接下来继续完成：

- 完善 404 页面和联系表单。
- 编写公共 CSS 和响应式布局（`assets/css/style.css` 当前为空）。
- 编写 JavaScript 交互（`assets/js/main.js` 当前为空）。
- 完成浏览器测试、无障碍检查及页面细节优化。
- 配置 Nginx、服务器部署和 HTTPS（`deploy/nginx.conf` 当前为空）。

完整学习任务见 [HTML网站从零到服务器任务书](HTML网站从零到服务器任务书.md)。此列表按现有文件记录，不代表已经完成浏览器验收或服务器部署。

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
