/* Vue enhances real HTML: all content and links remain usable without JavaScript. */
(() => {
  'use strict';
  if (!window.Vue) return;
  const { createApp, ref, reactive, computed, onMounted, onUnmounted, nextTick } = Vue;
  const projectElements = [...document.querySelectorAll('[data-project]')];
  const projects = projectElements.map((element) => ({
    id: element.dataset.project,
    category: element.dataset.category,
    name: element.querySelector('h3').textContent,
    description: element.querySelector('.project-description').textContent,
    tags: [...element.querySelectorAll('.tag')].map((tag) => tag.textContent),
    image: element.querySelector('img').getAttribute('src'),
    url: element.querySelector('.source-link').href,
    features: element.dataset.features.split('|'),
  }));

  createApp({
    setup() {
      const menuOpen = ref(false);
      const isDark = ref(document.documentElement.dataset.theme === 'dark');
      const showBackTop = ref(false);
      const toast = ref('');
      const query = ref('');
      const category = ref('all');
      const selectedProject = ref(null);
      const projectDialog = ref(null);
      const messagePreview = ref('');
      const mailLink = ref('');
      const formStatus = ref('');
      const form = reactive({ name: '', email: '', subject: '', message: '' });
      let toastTimer;
      let previousFocus;
      const mobile = matchMedia('(max-width: 760px)');
      const colorScheme = matchMedia('(prefers-color-scheme: dark)');

      const filteredProjects = computed(() => {
        const search = query.value.trim().toLocaleLowerCase();
        return projects.filter(
          (project) =>
            (category.value === 'all' || project.category === category.value) &&
            [project.name, project.description, ...project.tags]
              .join(' ')
              .toLocaleLowerCase()
              .includes(search),
        );
      });
      const isProjectVisible = (id) => filteredProjects.value.some((project) => project.id === id);
      const resetFilters = () => {
        query.value = '';
        category.value = 'all';
      };
      const announce = (message) => {
        toast.value = message;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.value = '';
        }, 4000);
      };
      const applyTheme = (dark) => {
        isDark.value = dark;
        document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      };
      const toggleTheme = () => {
        applyTheme(!isDark.value);
        try {
          localStorage.setItem('xiaowu-theme', isDark.value ? 'dark' : 'light');
        } catch {
          /* Not required. */
        }
      };
      const syncSystemTheme = (event) => {
        let saved;
        try {
          saved = localStorage.getItem('xiaowu-theme');
        } catch {
          /* Follow OS. */
        }
        if (saved !== 'light' && saved !== 'dark') applyTheme(event.matches);
      };
      const syncStorage = (event) => {
        if (event.key === 'xiaowu-theme')
          applyTheme(event.newValue === 'dark' || (!event.newValue && colorScheme.matches));
      };
      const closeMenu = (restoreFocus = false) => {
        menuOpen.value = false;
        if (restoreFocus) document.querySelector('.nav-toggle')?.focus();
      };
      const onKeydown = (event) => {
        if (event.key === 'Escape' && menuOpen.value) closeMenu(true);
      };
      const onOutsideClick = (event) => {
        if (menuOpen.value && !event.target.closest('.header-right')) closeMenu();
      };
      const onViewportChange = () => {
        const nav = document.querySelector('.site-nav');
        const toggle = document.querySelector('.nav-toggle');
        if (mobile.matches && nav?.contains(document.activeElement)) toggle?.focus();
        if (!mobile.matches && document.activeElement === toggle) nav?.querySelector('a')?.focus();
        closeMenu();
      };
      const onScroll = () => {
        showBackTop.value = window.scrollY > 500;
      };
      const backToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
        document.querySelector('.site-brand')?.focus({ preventScroll: true });
      };
      const copyText = async (text, success) => {
        try {
          if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(text);
          announce(success);
        } catch {
          announce('浏览器未允许复制，请手动选中并复制内容。');
        }
      };
      const openProject = async (id, event) => {
        selectedProject.value = projects.find((project) => project.id === id);
        if (!selectedProject.value) return;
        previousFocus = event.currentTarget;
        await nextTick();
        if (!projectDialog.value?.showModal) {
          announce('当前浏览器不支持详情弹窗，请使用项目源码链接。');
          return;
        }
        projectDialog.value.showModal();
      };
      const onDialogClose = () => {
        previousFocus?.focus();
      };
      const closeProject = () => {
        projectDialog.value?.close();
      };
      const onDialogBackdrop = (event) => {
        if (event.target !== projectDialog.value) return;
        const box = projectDialog.value.getBoundingClientRect();
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        )
          closeProject();
      };
      const prepareMail = () => {
        const normalized = Object.fromEntries(
          Object.entries(form).map(([key, value]) => [key, value.trim()]),
        );
        if (Object.values(normalized).some((value) => !value)) {
          formStatus.value = '请填写完整内容，不能只输入空格。';
          return;
        }
        // Remove header line breaks; encode the rest as mailto query parameters.
        const subject = normalized.subject.replace(/[\r\n]/g, ' ');
        const body = `你好，XiaoWu_5！\n\n${normalized.message}\n\n—— ${normalized.name}\n联系邮箱：${normalized.email}`;
        messagePreview.value = `主题：${subject}\n\n${body}`;
        mailLink.value = `mailto:lfu45757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        formStatus.value = '邮件草稿已生成，尚未发送。请打开邮件应用，或复制后手动发送。';
        nextTick(() => document.querySelector('#mail-preview')?.focus());
      };
      const invalidateMail = () => {
        messagePreview.value = '';
        mailLink.value = '';
        formStatus.value = '';
      };
      const clearForm = () => {
        Object.keys(form).forEach((key) => {
          form[key] = '';
        });
        invalidateMail();
        document.querySelector('#name')?.focus();
      };

      onMounted(() => {
        document.documentElement.classList.add('vue-ready');
        document.querySelectorAll('[data-current-year]').forEach((element) => {
          element.textContent = String(new Date().getFullYear());
        });
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('storage', syncStorage);
        document.addEventListener('keydown', onKeydown);
        document.addEventListener('click', onOutsideClick);
        mobile.addEventListener('change', onViewportChange);
        colorScheme.addEventListener('change', syncSystemTheme);
        onScroll();
      });
      onUnmounted(() => {
        clearTimeout(toastTimer);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('storage', syncStorage);
        document.removeEventListener('keydown', onKeydown);
        document.removeEventListener('click', onOutsideClick);
        mobile.removeEventListener('change', onViewportChange);
        colorScheme.removeEventListener('change', syncSystemTheme);
      });
      return {
        menuOpen,
        isDark,
        showBackTop,
        toast,
        query,
        category,
        filteredProjects,
        isProjectVisible,
        resetFilters,
        toggleTheme,
        closeMenu,
        backToTop,
        copyText,
        selectedProject,
        projectDialog,
        openProject,
        closeProject,
        onDialogClose,
        onDialogBackdrop,
        form,
        messagePreview,
        mailLink,
        formStatus,
        prepareMail,
        invalidateMail,
        clearForm,
      };
    },
  }).mount('#app');
})();
