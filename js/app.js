const $ = (s) => document.querySelector(s);
const zn = (id) => ZONES.find((z) => z.id === id);
const translations = {
  ru: {
    menu: "Меню", home: "Главная", zones: "Игровые зоны", zonesShort: "Зоны",
    prices: "Цены", contacts: "Контакты", book: "Забронировать",
    heroTagline: "Твоя игра. Твоя команда. Твоя территория.",
    heroDescription: "Игровые зоны, комфортные места и атмосфера, ради которой хочется возвращаться.",
    bookPlace: "Забронировать место", viewZones: "Посмотреть игровые зоны",
    zonesDescription: "Выберите формат: общий зал для одиночной игры, VIP для комфорта или отдельная комната для команды.",
    booking: "Бронирование",
    bookingDescription: "Соберите заявку — мы подготовим сообщение в WhatsApp. Бронь подтверждает администратор клуба.",
    bookingHold: "Напомним что бронь держится 15 минут",
    zoneStep: "1. Зона", dayStep: "2. День", startTimeStep: "3. Время начала",
    tariffStep: "4. Тариф", computerCountStep: "5. Количество компьютеров",
    less: "Меньше", more: "Больше", nearbyPc: "ПК рядом", contactStep: "6. Контакты",
    name: "Имя", phone: "Телефон", comment: "Комментарий (необязательно)",
    commentPlaceholder: "Например, пожелания по бронированию",
    yourRequest: "Ваша заявка", zone: "Зона", date: "Дата", time: "Время",
    tariff: "Тариф", computers: "Компьютеры", sendWhatsapp: "Отправить заявку в WhatsApp",
    priceDisclaimer: "Цены на сайте носят информационный характер и не являются публичной офертой.",
    personalDataConsent: "Нажимая отправить вы соглашаетесь с обработкой персональных данных",
    pricesDescription: "Стоимость в тенге (₸). Будни и выходные — по прайс-листу клуба. «День» — с 10:00 до 18:00. «Ночь» — с 22:00 до 10:00.",
    hour1: "1 час", hour3: "3 часа", hour5: "5 часов",
    weekdays: "Будни", weekends: "Выходные", inside: "Что внутри",
    insideDescription: "Всё, что нужно для долгой игры.",
    featureHardware: "Топовое железо", featurePeripherals: "Премиальная периферия",
    featureMonitors: "Мониторы 360 Гц", featureChairs: "Удобные игровые кресла",
    featureInternet: "Быстрый интернет", featureCooling: "Мощное охлаждение",
    findUs: "Как нас найти", buildRoute: "Построить маршрут", open2gis: "Открыть в 2GIS",
    navLabel: "Основная навигация", languageSelector: "Язык страницы",
    russian: "Русский язык", kazakh: "Казахский язык",
    today: "Сегодня", tomorrow: "Завтра",
    weekend: "выходной", weekday: "будни", hide: "Скрыть", specs: "Характеристики",
    pcCount: "ПК", seatsUnknown: "Мест: уточняется",
    weekdaysShort: "Будни", weekendsShort: "Выходные",
    day: "День", night: "Ночь", dayHours: "День (10:00–18:00)", nightHours: "Ночь (22:00–10:00)",
    nearbyUnavailable: "Доступно при выборе двух или более ПК",
    chooseNearby: "Выбрать ПК рядом", minPc: "Минимум 1 ПК",
    decreasePc: "Уменьшить количество ПК", maxPc: (n) => `Максимум для зоны: ${n} ПК`,
    addPc: (n) => `Добавить ПК (до ${n})`, yes: "Да", no: "Нет",
    onRequest: "По запросу", chooseZonePrice: "Выберите зону — покажем стоимость",
    priceMissing: "Цена не внесена — стоимость уточнит администратор",
    accordingToPrice: (day, count) => `По прайс-листу (${day})${count > 1 ? `, ${count} ПК` : ""}`,
    missingFields: (fields) => `Выберите/заполните: ${fields.join(", ")}.`,
    missingZone: "зону", missingStartTime: "время начала", missingName: "имя",
    missingPhone: "телефон (10 цифр после +7)",
    whatsappGreeting: "Здравствуйте! Хочу забронировать место в Brothers Cyber Lounge.",
    zoneLabel: "Зона", dateLabel: "Дата", timeLabel: "Время", tariffLabel: "Тариф",
    computerCountLabel: "Количество компьютеров", nearbyLabel: "ПК рядом",
    phoneLabel: "Телефон", commentLabel: "Комментарий:",
    addressLabel: "Адрес", whatsappLabel: "WhatsApp", instagramLabel: "Instagram",
    hoursLabel: "График работы", addedSoon: "Будет добавлено",
    addressSoon: "Адрес клуба будет добавлен.", addressFallback: "Адрес будет добавлен",
    openClub2gis: "Откройте клуб в 2GIS кнопкой ниже.", mapTitle: "Карта",
    processor: "Процессор", graphicsCard: "Видеокарта", ram: "ОЗУ",
    monitor: "Монитор", keyboard: "Клавиатура", mouse: "Мышь", headphones: "Наушники",
    specPending: "Уточняется",
  },
  kk: {
    menu: "Мәзір", home: "Басты бет", zones: "Ойын аймақтары", zonesShort: "Аймақтар",
    prices: "Бағалар", contacts: "Байланыс", book: "Брондау",
    heroTagline: "Сенің ойының. Сенің командаң. Сенің аумағың.",
    heroDescription: "Ойын аймақтары, жайлы орындар және қайта оралғың келетін ерекше атмосфера.",
    bookPlace: "Орынды брондау", viewZones: "Ойын аймақтарын көру",
    zonesDescription: "Форматты таңдаңыз: жеке ойнауға арналған жалпы зал, жайлылыққа арналған VIP-аймақ немесе командаға арналған жеке бөлме.",
    booking: "Брондау",
    bookingDescription: "Өтінім қалдырыңыз — біз WhatsApp хабарламасын дайындаймыз. Броньды клуб әкімшісі растайды.",
    bookingHold: "Ескерту: бронь 15 минут сақталады",
    zoneStep: "1. Аймақ", dayStep: "2. Күн", startTimeStep: "3. Басталу уақыты",
    tariffStep: "4. Тариф", computerCountStep: "5. Компьютер саны",
    less: "Азайту", more: "Көбейту", nearbyPc: "Қатар тұрған ПК", contactStep: "6. Байланыс деректері",
    name: "Аты", phone: "Телефон", comment: "Түсініктеме (міндетті емес)",
    commentPlaceholder: "Мысалы, брондау бойынша тілектеріңіз",
    yourRequest: "Сіздің өтініміңіз", zone: "Аймақ", date: "Күні", time: "Уақыты",
    tariff: "Тариф", computers: "Компьютерлер", sendWhatsapp: "WhatsApp-қа өтінім жіберу",
    priceDisclaimer: "Сайттағы бағалар ақпараттық сипатта берілген және жария оферта болып табылмайды.",
    personalDataConsent: "Жіберу батырмасын басу арқылы дербес деректеріңізді өңдеуге келісесіз",
    pricesDescription: "Бағалар теңгемен (₸). Жұмыс және демалыс күндерінің бағасы клуб прайс-парағына сай. «Күндіз» — 10:00–18:00. «Түнде» — 22:00–10:00.",
    hour1: "1 сағат", hour3: "3 сағат", hour5: "5 сағат",
    weekdays: "Жұмыс күндері", weekends: "Демалыс күндері", inside: "Біздің мүмкіндіктер",
    insideDescription: "Ұзақ ойынға қажеттінің бәрі.",
    featureHardware: "Заманауи компьютерлер", featurePeripherals: "Премиум периферия",
    featureMonitors: "360 Гц мониторлар", featureChairs: "Ыңғайлы ойын креслолары",
    featureInternet: "Жылдам интернет", featureCooling: "Қуатты салқындату жүйесі",
    findUs: "Бізді қалай табуға болады", buildRoute: "Бағыт құру", open2gis: "2GIS-те ашу",
    navLabel: "Негізгі навигация", languageSelector: "Бет тілі",
    russian: "Орыс тілі", kazakh: "Қазақ тілі",
    today: "Бүгін", tomorrow: "Ертең",
    weekend: "демалыс күні", weekday: "жұмыс күні", hide: "Жасыру", specs: "Сипаттамалары",
    pcCount: "ПК", seatsUnknown: "Орын саны нақтылануда",
    weekdaysShort: "Жұмыс күндері", weekendsShort: "Демалыс күндері",
    day: "Күндіз", night: "Түнде", dayHours: "Күндіз (10:00–18:00)", nightHours: "Түнде (22:00–10:00)",
    nearbyUnavailable: "Екі немесе одан көп ПК таңдағанда қолжетімді",
    chooseNearby: "Қатар тұрған ПК таңдау", minPc: "Кемінде 1 ПК",
    decreasePc: "ПК санын азайту", maxPc: (n) => "Аймақ үшін ең көбі: " + n + " ПК",
    addPc: (n) => n + " ПК-ге дейін қосу", yes: "Иә", no: "Жоқ",
    onRequest: "Сұраныс бойынша", chooseZonePrice: "Аймақты таңдаңыз — бағасын көрсетеміз",
    priceMissing: "Бағасы көрсетілмеген — нақты құнын әкімші айтады",
    accordingToPrice: (day, count) => `Прайс-парақ бойынша (${day})${count > 1 ? `, ${count} ПК` : ""}`,
    missingFields: (fields) => `Таңдаңыз/толтырыңыз: ${fields.join(", ")}.`,
    missingZone: "аймақты", missingStartTime: "басталу уақытын", missingName: "атыңызды",
    missingPhone: "+7-ден кейінгі 10 таңбалы телефон нөмірін",
    whatsappGreeting: "Сәлеметсіз бе! Brothers Cyber Lounge-тан орын брондағым келеді.",
    zoneLabel: "Аймақ", dateLabel: "Күні", timeLabel: "Уақыты", tariffLabel: "Тариф",
    computerCountLabel: "Компьютер саны", nearbyLabel: "Қатар тұрған ПК",
    phoneLabel: "Телефон", commentLabel: "Түсініктеме:",
    addressLabel: "Мекенжай", whatsappLabel: "WhatsApp", instagramLabel: "Instagram",
    hoursLabel: "Жұмыс уақыты", addedSoon: "Жақында қосылады",
    addressSoon: "Клубтың мекенжайы жақында қосылады.", addressFallback: "Мекенжайы жақында қосылады",
    openClub2gis: "Төмендегі батырма арқылы клубты 2GIS-тен ашыңыз.", mapTitle: "Карта",
    processor: "Процессор", graphicsCard: "Бейне карта", ram: "ЖЖҚ",
    monitor: "Монитор", keyboard: "Пернетақта", mouse: "Тінтуір", headphones: "Құлаққап",
    specPending: "Нақтылануда",
  },
};
let language = localStorage.getItem("brothers-language") === "kk" ? "kk" : "ru";
const t = (key, ...args) => {
  const value = translations[language][key] ?? translations.ru[key];
  return typeof value === "function" ? value(...args) : value;
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
    <article class="z ${z.size === "XL" ? "XL" : z.size === "L" ? "L" : ""}" id="zc-${z.id}">
      <div class="im">
        <img src="${z.image}" alt="${zoneName(z)}">
        ${z.specs ? `
          <button type="button" class="specs-toggle btn sm" aria-expanded="false">${t("specs")}</button>
          <ul class="specs" aria-label="${t("specs")}">
            ${z.specs.map(([label, value]) => `<li><span>${localizedSpec(label)}</span><strong>${localizedSpecValue(value)}</strong></li>`).join("")}
          </ul>
        ` : ""}
      </div>
      <div class="bd">
        <h3>${zoneName(z)}</h3>
        <p>${zoneDescription(z)}</p>
        <div class="ft">
          <span>${z.seats ? `${z.seats} ${t("pcCount")}` : t("seatsUnknown")}</span>
          <button class="btn sm" data-z="${z.id}">${t("book")}</button>
        </div>
      </div>
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
        <td><button class="btn sm" data-z="${z.id}">${t("book")}</button></td>
      </tr>
    `,
).join("");

$("#pm").innerHTML = ZONES.map((z) => {
  return `
    <details>
      <summary>${zoneName(z)}</summary>
      <div class="in">
        ${renderPricePair(z)}
        <button class="btn sm" data-z="${z.id}" style="justify-self:start">${t("book")}</button>
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
      : t("accordingToPrice", isWE(d) ? t("weekend") : t("weekday"), st.n);
}
  

document.addEventListener("click", (e) => {
  const specsToggle = e.target.closest(".specs-toggle");
  if (specsToggle) {
    const expanded = specsToggle.getAttribute("aria-expanded") !== "true";
    specsToggle.closest(".z").classList.toggle("specs-open", expanded);
    specsToggle.setAttribute("aria-expanded", expanded);
    specsToggle.textContent = expanded ? t("hide") : t("specs");
    return;
  }

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
    $("#er").textContent = t("missingFields", miss);
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
  $("#er").textContent = missing.length ? t("missingFields", missing) : "";
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
