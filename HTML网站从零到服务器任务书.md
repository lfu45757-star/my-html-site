# HTML 网站从零到服务器：可执行任务书

## 1. 项目目标

在 7 个阶段内完成一个可公开访问的三页静态网站，并建立最小可用的开发、版本管理、部署、HTTPS 与回滚流程。

最终成果：

- 首页 `index.html`：个人/项目简介、导航、行动按钮
- 项目页 `projects.html`：项目卡片、图片、外部链接
- 联系页 `contact.html`：带浏览器原生校验的联系表单（静态演示，不实际发信）
- 公共样式 `assets/css/style.css`
- 少量交互 `assets/js/main.js`（移动导航、页脚年份等）
- GitHub 仓库及清晰的 `README.md`
- Ubuntu 服务器上的 Nginx 静态站点
- 可选域名和必须完成的 HTTPS（有域名时）
- 一份部署与回滚记录

建议工期：7 天，每天 1.5–2.5 小时。若集中完成，约 12–16 小时。

## 2. 技术边界与参考

本任务以 HTML5、CSS3 和原生 JavaScript 为主，不引入 React、Vue、数据库或后端框架。

学习主线：

- 菜鸟教程：HTML5 文档骨架、元素与标签、标题、段落、链接、图片、列表、表格、表单、语义化标签。
- `mdn/learning-area`：按 MDN 学习模块组织的示例代码，用来核对语义、可访问性和标准写法。
- `microsoft/Web-Dev-For-Beginners`：以项目驱动学习，参考其 HTML/CSS/JavaScript、GitHub、可访问性与测验式学习结构。
- `sahandghavidel/HTML-CSS-JavaScript-projects-for-beginners`：从零开始的小项目集合，用于寻找页面组件与交互练习灵感；不要直接复制成品。

## 3. 目录结构

```text
my-html-site/
├─ index.html
├─ projects.html
├─ contact.html
├─ 404.html
├─ README.md
├─ assets/
│  ├─ css/
│  │  └─ style.css
│  ├─ js/
│  │  └─ main.js
│  └─ images/
└─ deploy/
   └─ nginx.conf
```

## 4. 阶段任务

### 阶段 0：准备账号与环境（30–60 分钟）

任务：

- [ ] 安装 VS Code、Git、Chrome 或 Edge。
- [ ] 安装 VS Code 扩展：Live Server、Prettier（可选）。
- [ ] 准备 GitHub 账号。
- [ ] 准备一台 Ubuntu 22.04/24.04 云服务器；安全组只开放 `22`、`80`、`443`。
- [ ] 如使用域名，准备一个域名并能修改 DNS。

本地验证：

```powershell
git --version
code --version
ssh -V
```

验收标准：三个命令都返回版本号；可以登录 GitHub；记录服务器公网 IP。

### 阶段 1：创建项目与首个 HTML 页面（60–90 分钟）

任务：

- [ ] 创建上述目录结构。
- [ ] 在每个页面写入 `<!doctype html>`、`<html lang="zh-CN">`、`<head>`、UTF-8 编码、viewport、标题和 `<body>`。
- [ ] 在 `index.html` 使用 `header`、`nav`、`main`、`section`、`footer`。
- [ ] 添加 `h1`，并保持每页只有一个主要 `h1`。
- [ ] 使用相对路径连接三个页面。
- [ ] 用 Live Server 打开页面，并使用浏览器开发者工具检查 DOM。

本地启动（不依赖扩展的备选方法）：

```powershell
python -m http.server 8080
```

访问 `http://localhost:8080`。

验收标准：三个页面均能打开；中文无乱码；导航无 404；刷新页面无控制台错误。

### 阶段 2：完成 HTML 内容与语义（2–3 小时）

任务：

- [ ] 首页包含简介、技能列表、项目预览和行动按钮。
- [ ] 项目页至少有 3 个 `article` 项目卡片，每个包含标题、描述、图片和链接。
- [ ] 联系页包含 `form`、`label`、姓名、邮箱、主题和留言字段；使用 `required`、`type="email"` 等原生校验。
- [ ] 每张内容图片都有准确的 `alt`；纯装饰图片用空 `alt=""`。
- [ ] 外链新窗口打开时添加 `rel="noopener noreferrer"`。
- [ ] 添加 `404.html`，提供返回首页的链接。

验收标准：关闭 CSS 后，页面内容顺序依然合理；键盘 Tab 能依次访问所有链接和表单控件；表单空提交会触发浏览器校验。

### 阶段 3：加入 CSS 与响应式布局（2–3 小时）

任务：

- [ ] 在所有页面引入同一个 `style.css`。
- [ ] 定义颜色、间距、字体和最大内容宽度的 CSS 变量。
- [ ] 使用 Flexbox 或 Grid 完成导航与卡片布局。
- [ ] 设置图片 `max-width: 100%; height: auto;`。
- [ ] 至少设置一个移动端断点，推荐 `768px`。
- [ ] 为链接、按钮和输入框添加清晰的 `:focus-visible` 状态。
- [ ] 保证正文与背景有足够对比度。

验收标准：在 360px、768px、1440px 三种视口下无横向滚动；文字不重叠；键盘焦点清晰可见。

### 阶段 4：最小 JavaScript 与质量检查（1–2 小时）

任务：

- [ ] 用 `defer` 引入 `main.js`。
- [ ] 实现移动端导航开关，并同步 `aria-expanded`。
- [ ] 自动显示当前年份。
- [ ] 不用 JavaScript 接管浏览器已有的表单校验。
- [ ] 检查所有页面的控制台、网络请求和链接。
- [ ] 用 Lighthouse 检查 Performance、Accessibility、Best Practices、SEO。

建议验收阈值：四项移动端分数均达到 90；如果未达到，在 README 记录原因与修复计划。

### 阶段 5：Git 与 GitHub 交付（60–90 分钟）

初始化并提交：

```powershell
git init
git branch -M main
git add .
git commit -m "feat: build responsive static portfolio"
```

在 GitHub 新建空仓库后执行：

```powershell
git remote add origin https://github.com/<你的用户名>/my-html-site.git
git push -u origin main
```

README 至少包含：项目截图、功能、目录结构、本地运行方法、部署方法、线上地址、已知限制。

验收标准：GitHub 默认分支为 `main`；仓库中没有密码、SSH 私钥或云厂商密钥；新电脑按 README 能在 10 分钟内运行项目。

### 阶段 6：部署到 Ubuntu + Nginx（1.5–2.5 小时）

以下命令在服务器执行。将 `<user>`、`<repo-url>`、`<domain>` 替换为真实值。

1. 登录并安装软件：

```bash
ssh <user>@<server-ip>
sudo apt update
sudo apt install -y nginx git
```

2. 拉取站点到临时目录，再发布到 Web 根目录：

```bash
git clone <repo-url> ~/my-html-site
sudo mkdir -p /var/www/my-html-site
sudo rsync -av --delete --exclude '.git' ~/my-html-site/ /var/www/my-html-site/
sudo chown -R www-data:www-data /var/www/my-html-site
sudo find /var/www/my-html-site -type d -exec chmod 755 {} \;
sudo find /var/www/my-html-site -type f -exec chmod 644 {} \;
```

3. 创建 `/etc/nginx/sites-available/my-html-site`：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name <domain> www.<domain>;

    root /var/www/my-html-site;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
}
```

如果暂时没有域名，把 `server_name` 改为 `_`，先用公网 IP 验证。

4. 启用站点并验证：

```bash
sudo ln -s /etc/nginx/sites-available/my-html-site /etc/nginx/sites-enabled/my-html-site
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx
```

验收标准：`nginx -t` 成功；访问 IP 或域名返回首页；三个页面和静态资源均为 200；不存在的路径显示自定义 404。

### 阶段 7：域名、HTTPS、回滚与最终验收（1–2 小时）

域名 DNS：

- [ ] 添加根域名 A 记录指向服务器公网 IPv4。
- [ ] 添加 `www` 的 CNAME 指向根域名，或添加相同 A 记录。
- [ ] 等待解析生效，用 `nslookup <domain>` 验证。

HTTPS（域名解析生效后执行）：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d <domain> -d www.<domain>
sudo certbot renew --dry-run
```

回滚流程：

```bash
cd ~/my-html-site
git log --oneline -5
git checkout <稳定提交SHA>
sudo rsync -av --delete --exclude '.git' ./ /var/www/my-html-site/
sudo nginx -t
sudo systemctl reload nginx
```

回到最新版：

```bash
cd ~/my-html-site
git checkout main
git pull --ff-only
sudo rsync -av --delete --exclude '.git' ./ /var/www/my-html-site/
sudo nginx -t
sudo systemctl reload nginx
```

最终验收：

- [ ] `http://` 自动跳转 `https://`。
- [ ] 浏览器证书有效，无混合内容警告。
- [ ] 手机与桌面端均可访问，导航与表单可用。
- [ ] HTML 页面、CSS、JS、图片均无 404。
- [ ] 服务器重启后 Nginx 自动启动。
- [ ] 已实际演练一次“切换到旧提交并恢复 main”的回滚流程。
- [ ] README 中写明线上 URL、部署时间、当前提交 SHA。

## 5. 每日执行建议

| 天数 | 重点 | 当日可交付物 |
|---|---|---|
| Day 1 | 环境、目录、HTML 骨架 | 三个可导航的裸 HTML 页面 |
| Day 2 | 内容、语义、图片、表单 | 内容完整且无 CSS 也可读 |
| Day 3 | CSS 与响应式 | 手机和桌面均可用 |
| Day 4 | JavaScript、无障碍、Lighthouse | 交互完成，质量报告达标 |
| Day 5 | Git、GitHub、README | 可复现的公开或私有仓库 |
| Day 6 | Ubuntu、Nginx、首次发布 | 公网 IP 可访问 |
| Day 7 | 域名、HTTPS、回滚、验收 | 正式线上地址与部署记录 |

## 6. 完成定义（Definition of Done）

只有同时满足以下条件，任务才算完成：

1. 网站不是单页示例，而是至少三个互相导航的页面。
2. HTML 结构语义清晰，中文编码正确，图片和表单具备基本可访问性。
3. 页面在常见手机和桌面宽度下正常显示。
4. 源代码已提交 GitHub，README 能让他人复现。
5. 网站通过 Nginx 从真实服务器提供服务。
6. 有域名时启用 HTTPS，并验证自动续期；无域名时明确标记该项未完成。
7. 已记录并演练回滚方法，不只验证“能部署”。

## 7. 可选加分项

- 使用 GitHub Actions 在推送 `main` 后通过 SSH 自动部署。
- 用 HTML 校验器修复语法错误。
- 添加 Open Graph、favicon、`robots.txt` 和 `sitemap.xml`。
- 对图片使用 WebP/AVIF，并设置 `width`、`height` 降低布局偏移。
- 为部署前版本创建 Git 标签，如 `v1.0.0`。

