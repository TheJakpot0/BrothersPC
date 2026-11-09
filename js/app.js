const loadTranslations = async () => {
  const languages = ["ru", "kk"];
  const entries = await Promise.all(
    languages.map(async (language) => {
      const response = await fetch(`js/locales/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${language} translations: ${response.status}`);
      }

      const translations = await response.json();
      if (!translations || typeof translations !== "object" || Array.isArray(translations)) {
        throw new Error(`Invalid ${language} translation file`);
      }

      return [language, translations];
    }),
  );
  const translations = Object.fromEntries(entries);
  const keys = Object.keys(translations.ru).sort();
  if (
    keys.length !== Object.keys(translations.kk).length ||
    keys.some((key) => !Object.hasOwn(translations.kk, key)) ||
    Object.values(translations.ru).some((value) => typeof value !== "string") ||
    Object.values(translations.kk).some((value) => typeof value !== "string")
  ) {
    throw new Error("Translation files must contain matching string keys");
  }

  return translations;
};

loadTranslations().then((translations) => {
const $ = (s) => document.querySelector(s);
const zn = (id) => ZONES.find((z) => z.id === id);
let language = localStorage.getItem("brothers-language") === "kk" ? "kk" : "ru";
const t = (key, ...args) => {
  return translations[language][key].replace(/\{(\d+)\}/g, (placeholder, index) =>
    args[index] === undefined ? placeholder : args[index],
  );
};
const zoneName = (zone) => language === "kk" ? zone.nameKk || zone.name : zone.name;
const zoneDescription = (zone) => language === "kk" ? zone.descKk || zone.desc : zone.desc;
const localizedSpec = (label) => {
  const key = {
    Процессор: "processor", Видеокарта: "graphicsCard", ОЗУ: "ram",
    Монитор: "monitor", Клавиатура: "keyboard", Мышь: "mouse", Наушники: "headphones",
  }[label];
  return key ? t(key) : label;
};
const localizedSpecValue = (value) => value === "Уточняется" ? t("specPending") : value;
const applyLanguage = () => {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    const active = button.dataset.lang === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active);
  });
};

const fmt = (n) => (n == null ? "—" : `${n.toLocaleString(language === "kk" ? "kk-KZ" : "ru-RU")} ₸`);
const p2 = (n) => String(n).padStart(2, "0");
const st = { zone: null, di: 0, time: null, pack: "h1", n: 1, pcNearby: false };

const dateOf = (i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
};

const isWE = (d) => {
  const g = d.getDay();
  return g === 0 || g===5 || g === 6;
}; // выходные: сб и вс (при необходимости добавьте пятницу)

const tf = (z, d) => (isWE(d) ? z.tariff.we : z.tariff.wd);

// Зоны
const renderZones = () => { $("#zg").innerHTML = ZONES.map(
  (z) => `
    <article class="z" id="zc-${z.id}">
      <div class="z-info">
        <div class="im">
          <img src="${z.image}" alt="${zoneName(z)}">
        </div>
        <div class="bd">
          <h3>${zoneName(z)}</h3>
          <p>${zoneDescription(z)}</p>
          <span>${z.seats ? `${z.seats} ${t("pcCount")}` : t("seatsUnknown")}</span>
        </div>
      </div>
      ${z.specs ? `
        <aside class="z-specs">
          <h4 class="specs-title">${t("specs")}</h4>
          <ul class="specs" aria-label="${t("specs")}">
            ${z.specs.map(([label, value]) => `<li><span>${localizedSpec(label)}</span><strong>${localizedSpecValue(value)}</strong></li>`).join("")}
          </ul>
        </aside>
      ` : ""}
    </article>
  `,
).join(""); };

// Цены
const cols = [
  ["h1", "hour1"],
  ["h3", "hour3"],
  ["h5", "hour5"],
  ["day", "day"],
  ["night", "night"],
];

const activeTariff = isWE(new Date()) ? "we" : "wd";
const renderPriceColumn = (tariff, type, label) => `
  <div class="price-column ${activeTariff === type ? "active" : ""}">
    <strong>${label}</strong>
    ${cols
      .map(
        ([key, name]) => `
          <div class="price-item">
            <span>${t(name)}</span>
            <span class="${tariff[key] == null ? "na" : ""}">${fmt(tariff[key])}</span>
          </div>
        `,
      )
      .join("")}
  </div>
`;
const renderPricePair = (z) => {
  const wd = z.tariff.wd || z.tariff;
  const we = z.tariff.we || z.tariff;
  return `
    <div class="price-pair">
      ${renderPriceColumn(wd, "wd", t("weekdaysShort"))}
      ${renderPriceColumn(we, "we", t("weekendsShort"))}
    </div>
  `;
};

const renderPrices = () => {
$("#pt").innerHTML = ZONES.map(
  (z) => `
      <tr>
        <td class="zn">${zoneName(z)}</td>
        <td>${renderPriceColumn(z.tariff.wd || z.tariff, "wd", t("weekdaysShort"))}</td>
        <td>${renderPriceColumn(z.tariff.we || z.tariff, "we", t("weekendsShort"))}</td>
      </tr>
    `,
).join("");

$("#pm").innerHTML = ZONES.map((z) => {
  return `
    <details>
      <summary>${zoneName(z)}</summary>
      <div class="in">
        ${renderPricePair(z)}
      </div>
    </details>
  `;
}).join("");
};

// Конструктор бронирования
const kkMonths = [
  "қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым",
  "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан",
];
const dLong = (d) =>
  language === "kk"
    ? `${d.getDate()} ${kkMonths[d.getMonth()]}`
    : d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
const packLabel = (k) =>
  k === "day" ? t("dayHours") : k === "night" ? t("nightHours") : t(cols.find((c) => c[0] === k)[1]);
const toMin = (t) => +t.slice(0, 2) * 60 + +t.slice(3);
const isPast = (t) => {
  const n = new Date();
  return st.di === 0 && toMin(t) <= n.getHours() * 60 + n.getMinutes();
};

const isTimeUnavailable = (t) => {
  const min = toMin(t);
  return st.pack === "day"
    ? isPast(t) || min < 10 * 60 || min > 18 * 60
    : st.pack === "night"
      ? isPast(t) || (min < 22 * 60 && min >= 8 * 60)
      : isPast(t);
};

function fixTime() {
  if (st.time && isTimeUnavailable(st.time)) {
    st.time = null;
  }
}

function getMaxPc() {
  const z = st.zone ? zn(st.zone) : null;
  return z && Number.isFinite(z.seats) && z.seats > 0 ? z.seats : 20;
}

function priceNow(k) {
  const z = st.zone && zn(st.zone);
  return z ? tf(z, dateOf(st.di))[k] : null;
}

function updateQtyControls() {
  const min = 1;
  const max = getMaxPc();
  const minus = $("#qm");
  const plus = $("#qp");
  const nearby = $("#pc-nearby");

  minus.disabled = st.n <= min;
  plus.disabled = st.n >= max;
  nearby.disabled = st.n <= min;
  nearby.title = nearby.disabled ? t("nearbyUnavailable") : t("chooseNearby");
  if (nearby.disabled) {
    st.pcNearby = false;
  }
  nearby.checked = st.pcNearby;

  minus.title = st.n <= min ? t("minPc") : t("decreasePc");
  plus.title = st.n >= max ? t("maxPc", max) : t("addPc", max);
}

function renderAll() {
  const maxPc = getMaxPc();
  if (st.n > maxPc) {
    st.n = maxPc;
  }

  $("#bz").innerHTML = ZONES.map(
    (z) =>
    `<button type="button" class="chip" aria-pressed="${z.id === st.zone}" data-z="${z.id}">${zoneName(z)}</button>`,
  ).join("");

  $("#bday").innerHTML = [0, 1]
    .map((i) => {
      const d = dateOf(i);
      return `<button type="button" class="chip" aria-pressed="${st.di === i}" data-d="${i}">${i ? t("tomorrow") : t("today")}, ${dLong(d)} (${isWE(d) ? t("weekend") : t("weekday")})</button>`;
    })
    .join("");

  fixTime();

  const bt = $("#btime");
  const prev = bt.scrollTop;

  bt.innerHTML = Array.from({ length: 1440 / TIME_STEP }, (_, i) => {
    const m = i * TIME_STEP;
    const t = `${p2(Math.floor(m / 60))}:${p2(m % 60)}`;
    const off = isTimeUnavailable(t);

    return `<button type="button" class="chip" aria-pressed="${st.time === t}" data-t="${t}" ${off ? "disabled" : ""}>${t}</button>`;
  }).join("");

  if (st.sc) {
    bt.scrollTop = prev;
  } else {
    const t =
      bt.querySelector("[aria-pressed=true]") ||
      bt.querySelector("button:not(:disabled)");
    if (t) {
      bt.scrollTop = t.offsetTop - bt.offsetTop;
    }
    st.sc = true;
  }

  $("#bpk").innerHTML = cols
    .map(([k]) => {
      const p = priceNow(k);
      return `<button type="button" class="chip" aria-pressed="${st.pack === k}" data-k="${k}">${packLabel(k)}${p != null ? ` · ${fmt(p)}` : ""}</button>`;
    })
    .join("");

  document
    .querySelectorAll(".z")
    .forEach((e) => e.classList.toggle("sel", e.id === `zc-${st.zone}`));

  updateQtyControls();
  upd();
}

function cost() {
  const p = priceNow(st.pack);
  return p == null ? null : p * st.n;
}

function upd() {
  const z = st.zone && zn(st.zone);
  const d = dateOf(st.di);

  $("#qn").textContent = st.n;
  $("#s1").textContent = z ? zoneName(z) : "—";
  $("#s2").textContent = `${dLong(d)}, ${isWE(d) ? t("weekend") : t("weekday")}`;
  $("#s3").textContent = st.time || "—";
  $("#s4").textContent = packLabel(st.pack);
  $("#s5").textContent = st.n;
  $("#s8").textContent = st.pcNearby ? t("yes") : t("no");

  const c = cost();
  $("#s6").textContent = !z ? "—" : c == null ? t("onRequest") : fmt(c);
  $("#s7").textContent = !z
    ? t("chooseZonePrice")
    : c == null
      ? t("priceMissing")
      : t(
          "accordingToPrice",
          isWE(d) ? t("weekend") : t("weekday"),
          st.n > 1 ? `, ${st.n} ${t("pcCount")}` : "",
        );
}
  

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-z],[data-d],[data-t],[data-k]");
  if (!b) {
    return;
  }

  if (b.dataset.z) {
    st.zone = b.dataset.z;
    const maxPc = getMaxPc();
    if (st.n > maxPc) {
      st.n = maxPc;
    }
    renderAll();
    if (!b.classList.contains("chip")) {
      $("#bk").scrollIntoView({ behavior: "smooth" });
    }
  } else if (b.dataset.d !== undefined) {
    st.di = +b.dataset.d;
    st.sc = false;
    renderAll();
  } else if (b.dataset.t) {
    st.time = b.dataset.t;
    renderAll();
  } else {
    st.pack = b.dataset.k;
    st.sc = false;
    renderAll();
  }
});

$("#pc-nearby").addEventListener("change", (e) => {
  st.pcNearby = st.n > 1 && e.target.checked;
  e.target.checked = st.pcNearby;
  upd();
});

$("#qm").onclick = () => {
  if (st.n <= 1) {
    return;
  }

  st.n = Math.max(1, st.n - 1);
  updateQtyControls();
  upd();
};

$("#qp").onclick = () => {
  const max = getMaxPc();
  if (st.n >= max) {
    return;
  }

  st.n = Math.min(max, st.n + 1);
  updateQtyControls();
  upd();
};

$("#ph").addEventListener("input", (e) => {
  let g = e.target.value.replace(/\D/g, "");
  if (g.length > 10 && (g[0] === "7" || g[0] === "8")) {
    g = g.slice(1);
  }

  g = g.slice(0, 10);
  e.target.value = [g.slice(0, 3), g.slice(3, 6), g.slice(6, 8), g.slice(8, 10)]
    .filter(Boolean)
    .join(" ");
});

const missingBookingFields = () => {
  const miss = [];
  const phone = $("#ph").value.replace(/\D/g, "");

  if (!st.zone) {
    miss.push(t("missingZone"));
  }
  if (!st.time) {
    miss.push(t("missingStartTime"));
  }
  if (!$("#nm").value.trim()) {
    miss.push(t("missingName"));
  }
  if (phone.length !== 10) {
    miss.push(t("missingPhone"));
  }
  return miss;
};

$("#send").addEventListener("click", () => {
  const miss = missingBookingFields();
  if (miss.length) {
    $("#er").textContent = t("missingFields", miss.join(", "));
    return;
  }

  $("#er").textContent = "";

  const c = cost();
  const comment = $("#comment").value.trim();
  const msg = [
    t("whatsappGreeting"),
    "",
    `${t("zoneLabel")}: ${zoneName(zn(st.zone))}`,
    `${t("dateLabel")}: ${$("#s2").textContent}`,
    `${t("timeLabel")}: ${st.time}`,
    `${t("tariffLabel")}: ${packLabel(st.pack)}`,
    `${t("computerCountLabel")}: ${st.n}`,
    `${t("nearbyLabel")}: ${st.pcNearby ? t("yes") : t("no")}`,
    //`Предварительная стоимость: ${c == null ? "уточнить" : fmt(c)}`,
    "",
    `${t("name")}: ${$("#nm").value.trim()}`,
    `${t("phoneLabel")}: +7 ${$("#ph").value}`,
  ];
  if (comment) {
    msg.push("", `${t("commentLabel")}\n${comment}`);
  }

  window.open(
    `https://wa.me/${CONFIG.whatsapp || ""}?text=${encodeURIComponent(msg.join("\n"))}`,
    "_blank",
    "noopener",
  );
});

// Карта и контакты
const ph = (v) => v || t("addedSoon");
let address = language === "kk" ? CONFIG.addressKk || CONFIG.address : CONFIG.address;
$("#ad").textContent = address || t("addressSoon");
const q = encodeURIComponent("Brothers Cyber Club");
const has = CONFIG.lat != null && CONFIG.lon != null;

if (has && CONFIG.twoGisKey) {
  $("#mp").innerHTML = "";
  const s = document.createElement("script");
  s.src = "https://mapgl.2gis.com/api/js/v1";
  s.onload = () => {
    const m = new mapgl.Map("mp", {
      center: [CONFIG.lon, CONFIG.lat],
      zoom: 16,
      key: CONFIG.twoGisKey,
    });
    new mapgl.Marker(m, { coordinates: [CONFIG.lon, CONFIG.lat] });
  };
  document.head.appendChild(s);
} else if (has) {
  const k = 0.004;
  const bb = [
    CONFIG.lon - k,
    CONFIG.lat - k / 2,
    CONFIG.lon + k,
    CONFIG.lat + k / 2,
  ].join("%2C");
  $("#mp").innerHTML =
    `<iframe title="${t("mapTitle")}" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${bb}&layer=mapnik&marker=${CONFIG.lat}%2C${CONFIG.lon}"></iframe>`;
} else {
  $("#mp").innerHTML =
    `<p>${address || t("addressFallback")}<br>${t("openClub2gis")}</p>`;
}

const base = CONFIG.twoGisUrl || `https://2gis.kz/search/${q}`;
const oid = (CONFIG.twoGisUrl || "").match(/\/(?:geo|firm)\/(\d+)/);
const city = CONFIG.twoGisCity || "ust-kamenogorsk";

// формат 2GIS: /directions/points/<откуда>|<куда>; пустое «откуда» = местоположение пользователя
$("#rt").href = has
  ? `https://2gis.kz/${city}/directions/points/%7C${CONFIG.lon}%2C${CONFIG.lat}${oid ? `%3B${oid[1]}` : ""}`
  : base;
$("#o2").href = CONFIG.twoGisFirmId
  ? `https://2gis.kz/firm/${CONFIG.twoGisFirmId}`
  : base;
const renderContactInfo = () => {
  address = language === "kk" ? CONFIG.addressKk || CONFIG.address : CONFIG.address;
  $("#ad").textContent = address || t("addressSoon");
  if (!has) {
    $("#mp").innerHTML = `<p>${address || t("addressFallback")}<br>${t("openClub2gis")}</p>`;
  } else {
    const mapFrame = $("#mp iframe");
    if (mapFrame) mapFrame.title = t("mapTitle");
  }
  $("#cg").innerHTML = [
  [t("addressLabel"), address],
  [t("phone"), CONFIG.phone],
  [t("whatsappLabel"), CONFIG.whatsapp && `+${CONFIG.whatsapp}`],
  [t("instagramLabel"), CONFIG.instagram],
  [t("hoursLabel"), CONFIG.hours],
]
  .map(([k, v]) => {
    const value =
      k === "Instagram" && v
        ? `<a class="instagram-link" href="${v}" target="_blank" rel="noopener noreferrer">@${new URL(v).pathname.split("/").filter(Boolean).pop()}</a>`
        : ph(v);
    return `<div><dt>${k}</dt><dd class="${v ? "" : "na"}">${value}</dd></div>`;
  })
  .join("");
};
renderContactInfo();
$("#yr").textContent = new Date().getFullYear();

// Меню
$("#mb").onclick = () => {
  const o = $("#nv").classList.toggle("o");
  $("#mb").setAttribute("aria-expanded", o);
};

$("#nv").onclick = (e) => {
  if (e.target.tagName === "A") {
    $("#nv").classList.remove("o");
  }
};

document.querySelector(".lang-switch").addEventListener("click", (e) => {
  const button = e.target.closest("[data-lang]");
  if (!button || button.dataset.lang === language) return;
  language = button.dataset.lang;
  localStorage.setItem("brothers-language", language);
  applyLanguage();
  renderZones();
  renderPrices();
  renderAll();
  renderContactInfo();
  const missing = missingBookingFields();
  $("#er").textContent = missing.length ? t("missingFields", missing.join(", ")) : "";
});

// Появление
const io = new IntersectionObserver(
  (es) => {
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08 },
);

document.querySelectorAll(".rv").forEach((e) => io.observe(e));
applyLanguage();
renderZones();
renderPrices();
renderAll();
}).catch((error) => {
  console.error("Could not initialize page translations.", error);
  const message = document.createElement("main");
  message.setAttribute("role", "alert");
  message.textContent =
    "Не удалось загрузить переводы. Откройте сайт через веб-сервер и проверьте файлы js/locales/ru.json и js/locales/kk.json.";
  document.body.replaceChildren(message);
});
