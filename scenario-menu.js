/* Scenario-selection add-on
 * Add this AFTER app.js in your HTML:
 * <script src="scenario-menu.js" defer></script>
 * Assumes the app.js globals described in this conversation.
 * Keep this as a classic script, not type="module".
 */
(() => {
  "use strict";

  function installScenarioMenu() {
    const screenElement = document.getElementById("screen");
    const nextButton = document.getElementById("next");
    const backButton = document.getElementById("back");
    const resetButton = document.getElementById("reset");
    const progress = document.getElementById("progress");
    const status = document.getElementById("status");

    if (!screenElement || !resetButton || !nextButton || !backButton ||
        typeof scenes === "undefined" || typeof state === "undefined" ||
        typeof render !== "function" || typeof save !== "function" ||
        typeof fresh !== "function") {
      console.error("Scenario menu: load this file after the compatible app.js. Required app elements or functions are missing.");
      return;
    }
    if (document.getElementById("scenarioMenuButton")) return;

    const style = document.createElement("style");
    style.textContent = `
      .scenario-menu-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr)); gap:16px; margin:20px 0; }
      .scenario-menu-card { border:1px solid #cbd5e1; border-radius:14px; padding:20px; background:#fff; color:#172033; display:flex; flex-direction:column; gap:12px; }
      .scenario-menu-card h3,.scenario-menu-card p { margin:0; }
      .scenario-menu-card button { margin-top:auto; cursor:pointer; padding:12px 16px; border:0; border-radius:8px; background:#155e75; color:white; font:inherit; }
      .scenario-menu-card button:focus-visible,#scenarioMenuButton:focus-visible { outline:3px solid #f59e0b; outline-offset:3px; }
      #scenarioMenuButton { margin:4px; }
    `;
    document.head.append(style);

    function element(tag, text, className) {
      const node = document.createElement(tag);
      if (text !== undefined) node.textContent = text;
      if (className) node.className = className;
      return node;
    }

    function cancelPendingRender() {
      if (typeof version !== "undefined") version += 1;
      if (typeof pending !== "undefined") pending = null;
    }

    function startScenario(index) {
      cancelPendingRender();
      state.i = index;
      state.step = 0;
      save();
      nextButton.hidden = false;
      backButton.hidden = false;
      render();
    }

    function showScenarioMenu() {
      cancelPendingRender();
      screenElement.replaceChildren(
        element("h2", "選擇你想練習的情境"),
        element("p", "可以從你最有感覺的情境開始，沒有指定順序。你也可以隨時回來選另一個。")
      );
      const grid = element("div", undefined, "scenario-menu-grid");
      scenes.forEach((scene, index) => {
        const card = element("article", undefined, "scenario-menu-card");
        card.append(element("small", `情境 ${index + 1}`), element("h3", scene.title || `情境 ${index + 1}`));
        if (typeof scene.intro === "string") card.append(element("p", scene.intro));
        const answer = state.answers && state.answers[index];
        if (answer !== null && answer !== undefined) {
          card.append(element("small", "你曾經探索過這個情境，可以再試另一種回應。"));
        }
        const start = element("button", "開始這個情境");
        start.type = "button";
        start.addEventListener("click", () => startScenario(index));
        card.append(start);
        grid.append(card);
      });
      screenElement.append(grid);
      nextButton.hidden = true;
      backButton.hidden = true;
      if (progress) progress.value = 0;
      if (status) status.textContent = "請選擇一個情境開始。";
      screenElement.setAttribute("tabindex", "-1");
      screenElement.focus({ preventScroll: true });
    }

    const menuButton = element("button", "選擇其他情境");
    menuButton.type = "button";
    menuButton.id = "scenarioMenuButton";
    menuButton.addEventListener("click", showScenarioMenu);
    resetButton.insertAdjacentElement("beforebegin", menuButton);

    resetButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      state = fresh();
      save();
      showScenarioMenu();
    }, true);

    showScenarioMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installScenarioMenu, { once: true });
  } else {
    installScenarioMenu();
  }
})();
