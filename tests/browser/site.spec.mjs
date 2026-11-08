import { test, expect } from '@playwright/test';
const pages = ['index.html', 'projects.html', 'contact.html', '404.html'];
for (const width of [360, 768, 1440]) {
  for (const file of pages) {
    test(`${file} at ${width}px: renders without errors or overflow`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('requestfailed', (request) => errors.push(request.url()));
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/${file}`);
      await expect(page.locator('html')).toHaveClass(/vue-ready/);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      expect(
        await page.locator('img').evaluateAll((images) => images.every((image) => image.alt)),
      ).toBe(true);
      expect(errors).toEqual([]);
    });
  }
}
test('project filter, case-insensitive search, no results and reset', async ({ page }) => {
  await page.goto('/projects.html');
  const cards = page.locator('.project-card:visible');
  await expect(cards).toHaveCount(3);
  await page.getByRole('button', { name: '自动化', exact: true }).click();
  await expect(cards).toHaveCount(1);
  await expect(cards).toContainText('wechatbot');
  await page.getByRole('button', { name: '全部项目', exact: true }).click();
  await page.getByRole('searchbox').fill(' WEB UI ');
  await expect(cards).toHaveCount(1);
  await expect(cards).toContainText('YouDub');
  await page.getByRole('searchbox').fill('nonexistent');
  await expect(cards).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '暂时没有找到这个项目。' })).toBeVisible();
  await page.getByRole('button', { name: '重置筛选' }).click();
  await expect(cards).toHaveCount(3);
});
test('project dialog traps focus, Escape closes and restores focus', async ({ page }) => {
  await page.goto('/projects.html');
  const trigger = page.getByRole('button', { name: '项目详情' }).first();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
  await expect(dialog.getByRole('heading', { name: 'wechatbot-rust-v0.3.2' })).toBeVisible();
  await expect(dialog.getByRole('button', { name: '关闭项目详情' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement.closest('dialog'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});
test('theme persists across pages and reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/index.html');
  await page.getByRole('button', { name: '切换深色主题' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto('/projects.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: '切换浅色主题' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
test('mobile navigation, Escape and breakpoint focus', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/index.html');
  const toggle = page.getByRole('button', { name: '展开导航' });
  const nav = page.getByRole('navigation', { name: '主要导航' });
  await expect(nav).not.toBeVisible();
  await toggle.click();
  await expect(nav).toBeVisible();
  await nav.getByRole('link', { name: '项目', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(nav).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link', { name: '首页', exact: true })).toBeFocused();
});
test('contact validates, previews encoded mail and never sends a request', async ({ page }) => {
  await page.goto('/contact.html');
  await page.getByRole('button', { name: '生成邮件草稿' }).click();
  await expect(page.locator('#name')).toBeFocused();
  await page.locator('#name').fill('测试者');
  await page.locator('#email').fill('hello@example.com');
  await page.locator('#subject').fill('Vue & HTML #交流');
  await page.locator('#message').fill('你好！\n想聊聊 <script>alert(1)</script> 与 Vue。');
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.getByRole('button', { name: '生成邮件草稿' }).click();
  await expect(page.locator('#mail-preview')).toBeVisible();
  await expect(page.locator('#mail-preview')).toContainText('<script>alert(1)</script>');
  const href = await page.getByRole('link', { name: '打开邮件应用' }).getAttribute('href');
  expect(href).toContain('subject=' + encodeURIComponent('Vue & HTML #交流'));
  expect(decodeURIComponent(href)).toContain('hello@example.com');
  await expect(page.getByRole('status').first()).toContainText('尚未发送');
  expect(requests).toEqual([]);
  await page.locator('#subject').fill('修改后');
  await expect(page.locator('#mail-preview')).toHaveCount(0);
  await page.getByRole('button', { name: '清空', exact: true }).click();
  await expect(page.locator('#name')).toHaveValue('');
});
test('blocked storage still mounts and switches theme', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage blocked');
      },
    });
  });
  await page.goto('/index.html');
  await expect(page.locator('html')).toHaveClass(/vue-ready/);
  await page.getByRole('button', { name: /切换.*主题/ }).click();
});
test('without JavaScript content, navigation, sources and email remain usable', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 360, height: 800 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/projects.html');
  await expect(page.locator('.project-card')).toHaveCount(3);
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.locator('.source-link').first()).toBeVisible();
  await expect(page.locator('.project-toolbar')).not.toBeVisible();
  await page.goto('http://127.0.0.1:4173/contact.html');
  await expect(page.locator('.contact-email')).toBeVisible();
  await expect(page.locator('form')).not.toBeVisible();
  await context.close();
});
test('deep unknown paths use a functioning 404; preview refuses private files', async ({
  page,
  request,
}) => {
  expect((await request.get('/.git/config')).status()).toBe(404);
  expect((await request.get('/package-lock.json')).status()).toBe(404);
  await page.goto('/unknown/deep/page');
  await expect(page.getByRole('heading', { name: '这一页，还没有被写出来。' })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/vue-ready/);
  await page.getByRole('link', { name: '回到首页' }).click();
  await expect(page).toHaveURL(/index.html$/);
});
test('capture desktop, mobile and dark previews', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/index.html');
  await expect(page.locator('html')).toHaveClass(/vue-ready/);
  await page.screenshot({ path: 'docs/images/home-vue-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contact.html');
  await expect(page.locator('html')).toHaveClass(/vue-ready/);
  await page.screenshot({ path: 'docs/images/contact-vue-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/projects.html');
  await page.getByRole('button', { name: '切换深色主题' }).click();
  await page.screenshot({ path: 'docs/images/projects-vue-dark.png', fullPage: true });
});

test('clipboard confirms success and gives a manual-copy fallback', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.lastCopied = text;
        },
      },
    });
  });
  await page.goto('/contact.html');
  await page.getByRole('button', { name: '复制邮箱' }).click();
  await expect(page.locator('.toast')).toHaveText('邮箱地址已复制。');
  expect(await page.evaluate(() => window.lastCopied)).toBe('lfu45757@gmail.com');
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error('Permission denied');
    };
  });
  await page.getByRole('button', { name: '复制邮箱' }).click();
  await expect(page.locator('.toast')).toContainText('请手动选中并复制');
});

test('if Vue cannot load, static content and navigation still work', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.route('**/assets/vendor/vue.global.prod.js', (route) => route.abort());
  await page.goto('/projects.html');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.locator('.project-card:visible')).toHaveCount(3);
  await expect(page.locator('.project-toolbar')).not.toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: '联系', exact: true }).click();
  await expect(page.locator('.contact-email')).toBeVisible();
  await expect(page.locator('form')).not.toBeVisible();
});

test('contact rejects whitespace-only fields', async ({ page }) => {
  await page.goto('/contact.html');
  await page.locator('#name').fill('   ');
  await page.locator('#email').fill('hello@example.com');
  await page.locator('#subject').fill('   ');
  await page.locator('#message').fill('   ');
  await page.getByRole('button', { name: '生成邮件草稿' }).click();
  await expect(page.locator('.form-status')).toContainText('不能只输入空格');
  await expect(page.locator('#mail-preview')).toHaveCount(0);
});

test('back-to-top is initially hidden and returns keyboard focus to the brand', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/index.html');
  const button = page.getByRole('button', { name: '返回顶部' });
  await expect(button).not.toBeVisible();
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.locator('.site-brand')).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('cards use lightweight WebP previews and details retain original PNG', async ({ page }) => {
  await page.goto('/projects.html');
  const cards = page.locator('.project-visual img');
  await expect
    .poll(() =>
      cards.evaluateAll((images) =>
        images.every(
          (image) =>
            image.complete && image.naturalWidth > 0 && image.currentSrc.endsWith('-960.webp'),
        ),
      ),
    )
    .toBe(true);
  await page.getByRole('button', { name: '项目详情' }).nth(1).click();
  await expect(page.locator('.dialog-image')).toHaveAttribute('src', 'assets/images/MyLike_1.png');
});
