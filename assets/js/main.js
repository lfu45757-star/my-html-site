"use strict";

// 页脚保留静态年份作为无 JavaScript 时的后备内容。
document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const toggle = document.querySelector("[data-nav-toggle]");
const navigation = document.querySelector("#primary-navigation");

if (toggle && navigation) {
  const mobileViewport = window.matchMedia("(max-width: 768px)");

  const setExpanded = (expanded) => {
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.textContent = expanded ? "收起导航" : "展开导航";
    navigation.hidden = !expanded;
  };

  const syncViewport = () => {
    // 切换宽度时，先把焦点移出即将隐藏的内容。
    if (mobileViewport.matches && navigation.contains(document.activeElement)) {
      toggle.hidden = false;
      toggle.focus();
    } else if (!mobileViewport.matches && document.activeElement === toggle) {
      navigation.hidden = false;
      navigation.querySelector("a").focus();
    }
    toggle.hidden = !mobileViewport.matches;
    setExpanded(!mobileViewport.matches);
  };

  syncViewport();
  mobileViewport.addEventListener("change", syncViewport);
  toggle.addEventListener("click", () => {
    setExpanded(toggle.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileViewport.matches && !navigation.hidden) {
      setExpanded(false);
      toggle.focus();
    }
  });
}

const demoForm = document.querySelector("[data-demo-form]");
if (demoForm) {
  // submit 只会在原生校验通过后触发；此处仅阻止静态演示表单跳转。
  demoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#form-status").textContent =
      "填写内容已通过浏览器校验。这是演示表单，留言尚未发送，请使用上方邮箱联系我。";
  });
}
