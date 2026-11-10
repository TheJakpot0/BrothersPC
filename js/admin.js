(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storageKeys = {
    api: "brothers-admin-api",
    access: "brothers-admin-access",
    refresh: "brothers-admin-refresh",
    expires: "brothers-admin-expires",
  };
  const tokenStorage = window.sessionStorage;
  let apiBase = tokenStorage.getItem(storageKeys.api) || window.BROTHERS_API_URL || "http://localhost:8080";
  let zones = [];
  let editingZoneId = null;
  let refreshInFlight = null;
  let noticeTimer;

  const loginScreen = $("#login-screen");
  const adminApp = $("#admin-app");
  const loginForm = $("#login-form");
  const loginError = $("#login-error");
  const appNotice = $("#app-notice");

  $("#api-url").value = apiBase;

  class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.name = "ApiError";
      this.status = status;
    }
  }

  function normalizedApiBase(value) {
    let url;
    try {
      url = new URL(value.trim());
    } catch {
      throw new Error("Укажите корректный адрес API.");
    }
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Адрес API должен начинаться с http:// или https://.");
    }
    return url.href.replace(/\/+$/, "");
  }

  function setNotice(message, type = "success") {
    clearTimeout(noticeTimer);
    appNotice.textContent = message;
    appNotice.className = `notice ${type === "error" ? "error" : ""}`;
    appNotice.hidden = false;
    noticeTimer = window.setTimeout(() => {
      appNotice.hidden = true;
    }, 6500);
  }

  function setApiIndicator(connected) {
    const indicator = $("#api-indicator");
    indicator.textContent = connected ? apiBase : "API не подключен";
    indicator.classList.toggle("connected", connected);
    $("#connection-value").textContent = connected ? "Подключен" : "Нет связи";
  }

  function showLogin(message = "") {
    loginScreen.hidden = false;
    adminApp.hidden = true;
    loginError.textContent = message;
    loginError.hidden = !message;
  }

  function saveTokens(tokens) {
    tokenStorage.setItem(storageKeys.access, tokens.accessToken);
    tokenStorage.setItem(storageKeys.refresh, tokens.refreshToken);
    tokenStorage.setItem(storageKeys.expires, String(Date.now() + tokens.expiresIn * 1000));
  }

  function clearTokens() {
    tokenStorage.removeItem(storageKeys.access);
    tokenStorage.removeItem(storageKeys.refresh);
    tokenStorage.removeItem(storageKeys.expires);
  }

  async function readResponse(response) {
    const text = await response.text();
    let result = null;
    if (text) {
      try {
        result = JSON.parse(text);
      } catch {
        result = { error: text };
      }
    }
    if (!response.ok) {
      throw new ApiError(result?.error || `Ошибка запроса (${response.status}).`, response.status);
    }
    return result;
  }

  async function rawRequest(path, options = {}) {
    const response = await fetch(`${apiBase}/api/v1${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    return readResponse(response);
  }

  async function refreshTokens() {
    if (refreshInFlight) return refreshInFlight;
    const refreshToken = tokenStorage.getItem(storageKeys.refresh);
    if (!refreshToken) {
      throw new ApiError("Сессия истекла. Войдите снова.", 401);
    }
    refreshInFlight = (async () => {
      const tokens = await rawRequest("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
      saveTokens(tokens);
      return tokens.accessToken;
    })();
    try {
      return await refreshInFlight;
    } finally {
      refreshInFlight = null;
    }
  }

  async function apiRequest(path, options = {}, canRetry = true) {
    let accessToken = tokenStorage.getItem(storageKeys.access);
    const expiresAt = Number(tokenStorage.getItem(storageKeys.expires));
    if (!accessToken) {
      throw new ApiError("Сессия истекла. Войдите снова.", 401);
    }
    if (expiresAt && expiresAt < Date.now() + 15000) {
      accessToken = await refreshTokens();
    }

    const response = await fetch(`${apiBase}/api/v1${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 401 && canRetry) {
      await refreshTokens();
      return apiRequest(path, options, false);
    }
    return readResponse(response);
  }

  function showPage(name) {
    const titles = {
      overview: "Обзор",
      zones: "Игровые зоны",
      config: "Контакты и адрес",
      settings: "Настройки",
    };
    $$(".page").forEach((page) => {
      const active = page.dataset.panel === name;
      page.hidden = !active;
      page.classList.toggle("active", active);
    });
    $$(".nav-link").forEach((button) => {
      button.classList.toggle("active", button.dataset.page === name);
    });
    $("#page-title").textContent = titles[name];
  }

  function makeButton(text, className, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = text;
    button.addEventListener("click", action);
    return button;
  }

  function renderZones() {
    const list = $("#zones-list");
    list.replaceChildren();
    $("#zone-count").textContent = String(zones.length);
    if (!zones.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "Зон пока нет. Добавьте первую зону.";
      list.append(empty);
      return;
    }
    zones.forEach((zone) => {
      const card = document.createElement("article");
      card.className = "zone-card";
      const description = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = zone.name || zone.id;
      const subtitle = document.createElement("p");
      subtitle.textContent = `${zone.id} · ${zone.seats == null ? "места не указаны" : `${zone.seats} мест`} · ${zone.size || "размер не указан"}`;
      description.append(title, subtitle);

      const actions = document.createElement("div");
      actions.className = "zone-actions";
      actions.append(
        makeButton("Редактировать", "button secondary", () => openZoneEditor(zone)),
        makeButton("Удалить", "button danger", () => deleteZone(zone)),
      );
      card.append(description, actions);
      list.append(card);
    });
  }

  function fillForm(form, values) {
    Object.entries(values).forEach(([name, value]) => {
      const input = form.elements.namedItem(name);
      if (input) input.value = value ?? "";
    });
  }

  function readForm(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function appendSpecRow(spec = { name: "", value: "" }) {
    const row = document.createElement("div");
    row.className = "spec-row";
    const name = document.createElement("input");
    name.className = "spec-name";
    name.placeholder = "Название";
    name.setAttribute("aria-label", "Название характеристики");
    name.required = true;
    name.value = spec.name || "";
    const value = document.createElement("input");
    value.className = "spec-value";
    value.placeholder = "Значение";
    value.setAttribute("aria-label", "Значение характеристики");
    value.required = true;
    value.value = spec.value || "";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-spec";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Удалить характеристику");
    remove.addEventListener("click", () => row.remove());
    row.append(name, value, remove);
    $("#specs-list").append(row);
  }

  function populateTariffs(zone) {
    for (const day of ["wd", "we"]) {
      const row = $(`[data-tariff="${day}"]`);
      $$(".tariff-input", row).forEach((input) => input.remove());
      for (const field of ["h1", "h3", "h5", "day", "night"]) {
        const input = document.createElement("input");
        input.className = "tariff-input";
        input.type = "number";
        input.min = "0";
        input.step = "1";
        input.required = true;
        input.setAttribute("aria-label", `${day === "wd" ? "Будни" : "Выходные"}: ${field}`);
        input.dataset.field = field;
        input.value = zone?.tariff?.[day]?.[field] ?? 0;
        row.append(input);
      }
    }
  }

  function openZoneEditor(zone = null) {
    editingZoneId = zone?.id ?? null;
    const form = $("#zone-form");
    form.reset();
    $("#zone-dialog-title").textContent = zone ? "Редактировать зону" : "Новая зона";
    fillForm(form, zone || { size: "L" });
    form.elements.namedItem("id").readOnly = Boolean(zone);
    populateTariffs(zone);
    $("#specs-list").replaceChildren();
    (zone?.specs || []).forEach(appendSpecRow);
    $("#zone-dialog").showModal();
  }

  function zonePayload(form) {
    const values = readForm(form);
    const tariff = {};
    for (const day of ["wd", "we"]) {
      tariff[day] = {};
      $$(".tariff-row[data-tariff='" + day + "'] .tariff-input").forEach((input) => {
        tariff[day][input.dataset.field] = Number(input.value);
      });
    }
    const specs = $$(".spec-row", $("#specs-list")).map((row) => ({
      name: $(".spec-name", row).value.trim(),
      value: $(".spec-value", row).value.trim(),
    }));
    return {
      id: values.id.trim(),
      name: values.name.trim(),
      nameKk: values.nameKk.trim(),
      size: values.size.trim(),
      seats: values.seats === "" ? null : Number(values.seats),
      desc: values.desc.trim(),
      descKk: values.descKk.trim(),
      tariff,
      image: values.image.trim(),
      specs,
    };
  }

  async function deleteZone(zone) {
    if (!window.confirm(`Удалить зону «${zone.name}»? Это действие нельзя отменить.`)) return;
    try {
      await apiRequest(`/zones/${encodeURIComponent(zone.id)}`, { method: "DELETE" });
      zones = zones.filter((item) => item.id !== zone.id);
      renderZones();
      setNotice("Зона удалена.");
    } catch (error) {
      handleRequestError(error);
    }
  }

  async function loadContent() {
    const [loadedZones, config, settings] = await Promise.all([
      apiRequest("/zones"),
      apiRequest("/config"),
      apiRequest("/settings/time-step"),
    ]);
    if (!Array.isArray(loadedZones)) throw new Error("API вернул неверный формат списка зон.");
    zones = loadedZones;
    renderZones();
    fillForm($("#config-form"), config);
    $("#time-step").value = String(settings.timeStep);
    $("#time-step-value").textContent = `${settings.timeStep} мин`;
    setApiIndicator(true);
  }

  function handleRequestError(error) {
    if (error instanceof ApiError && error.status === 401) {
      clearTokens();
      setApiIndicator(false);
      showLogin("Сессия истекла. Войдите снова.");
      return;
    }
    setNotice(error.message || "Не удалось выполнить запрос.", "error");
  }

  async function openDashboard() {
    loginScreen.hidden = true;
    adminApp.hidden = false;
    setApiIndicator(false);
    try {
      await loadContent();
      setNotice("Данные успешно загружены.");
    } catch (error) {
      handleRequestError(error);
    }
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginError.hidden = true;
    const submit = $('button[type="submit"]', loginForm);
    submit.disabled = true;
    try {
      apiBase = normalizedApiBase($("#api-url").value);
      tokenStorage.setItem(storageKeys.api, apiBase);
      const credentials = Object.fromEntries(new FormData(loginForm).entries());
      const tokens = await rawRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: credentials.username, password: credentials.password }),
      });
      saveTokens(tokens);
      await openDashboard();
    } catch (error) {
      loginError.textContent = error.message || "Не удалось войти.";
      loginError.hidden = false;
    } finally {
      submit.disabled = false;
      $("#password").value = "";
    }
  });

  $("#logout-button").addEventListener("click", async () => {
    const refreshToken = tokenStorage.getItem(storageKeys.refresh);
    let message = "";
    try {
      if (refreshToken) {
        await rawRequest("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      message = `Не удалось завершить сессию на сервере: ${error.message}`;
    } finally {
      clearTokens();
      showLogin(message);
    }
  });

  $$(".nav-link").forEach((button) => {
    button.addEventListener("click", () => showPage(button.dataset.page));
  });
  $$("[data-go]").forEach((button) => {
    button.addEventListener("click", () => showPage(button.dataset.go));
  });
  $("#add-zone").addEventListener("click", () => openZoneEditor());
  $("#add-spec").addEventListener("click", () => appendSpecRow());
  $("#close-zone-dialog").addEventListener("click", () => $("#zone-dialog").close());
  $("#cancel-zone").addEventListener("click", () => $("#zone-dialog").close());

  $("#zone-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const payload = zonePayload(form);
    try {
      const path = editingZoneId
        ? `/zones/${encodeURIComponent(editingZoneId)}`
        : "/zones";
      const savedZone = await apiRequest(path, {
        method: editingZoneId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      if (editingZoneId) {
        zones = zones.map((zone) => zone.id === editingZoneId ? savedZone : zone);
      } else {
        zones.push(savedZone);
      }
      renderZones();
      $("#zone-dialog").close();
      setNotice(editingZoneId
        ? "Зона сохранена в API. Публичный сайт пока использует статические данные."
        : "Зона добавлена в API. Публичный сайт пока использует статические данные.");
    } catch (error) {
      handleRequestError(error);
    }
  });

  $("#config-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = readForm(form);
    const config = {
      whatsapp: values.whatsapp.trim(),
      phone: values.phone.trim(),
      instagram: values.instagram.trim(),
      hours: values.hours.trim(),
      address: values.address.trim(),
      addressKk: values.addressKk.trim(),
      lat: Number(values.lat),
      lon: Number(values.lon),
      twoGisUrl: values.twoGisUrl.trim(),
    };
    try {
      const savedConfig = await apiRequest("/config", {
        method: "PUT",
        body: JSON.stringify(config),
      });
      fillForm(form, savedConfig);
      setNotice("Данные сохранены в API. Публичный сайт пока использует статическую конфигурацию.");
    } catch (error) {
      handleRequestError(error);
    }
  });

  $("#settings-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const timeStep = Number($("#time-step").value);
    try {
      const settings = await apiRequest("/settings/time-step", {
        method: "PUT",
        body: JSON.stringify({ timeStep }),
      });
      $("#time-step").value = String(settings.timeStep);
      $("#time-step-value").textContent = `${settings.timeStep} мин`;
      setNotice("Настройки сохранены в API. Публичная форма пока не загружает их автоматически.");
    } catch (error) {
      handleRequestError(error);
    }
  });

  async function restoreSession() {
    if (!tokenStorage.getItem(storageKeys.access)) return;
    try {
      apiBase = normalizedApiBase(tokenStorage.getItem(storageKeys.api) || apiBase);
      $("#api-url").value = apiBase;
      await openDashboard();
    } catch (error) {
      clearTokens();
      showLogin(error.message || "Не удалось восстановить сессию.");
    }
  }

  restoreSession();
})();
