/* ===== ДАННЫЕ САЙТА: меняйте цены, зоны, контакты и компьютеры здесь ===== */
const CONFIG={
  whatsapp:"77778300406",            // например "77001234567" (без + и пробелов)
  phone:null, instagram:null, hours:null,
  address:null, lat:null, lon:null,   // координаты клуба для карты 2GIS
  twoGisFirmId:null         // ID организации в 2GIS (необязательно)
};
/* Тариф: T(1 час, 3 часа, 5 часов, день, ночь). Цены в тенге. */
const T=(h1,h3,h5,day,night)=>({h1,h3,h5,day,night});
/* W(будни, выходные) */
const W=(wd,we)=>({wd,we});
/* seats: null = количество мест неизвестно */
const ZONES=[
 {id:'general',name:'Общий зал',size:'XL',seats:null,desc:'Основной зал для одиночной игры и игры с друзьями.',tariff:W(T(500,1000,1500,2000,2500),T(700,1400,2100,2100,2500))},
 {id:'asus',name:'ASUS Zone',size:'L',seats:null,desc:'Отдельная зона с оборудованием ASUS.',tariff:W(T(700,1500,2000,3800,3800),T(1300,2500,3800,3800,3800))},
 {id:'pubg',name:'PUBG Zone',size:'M',seats:null,desc:'Зона для любителей PUBG и соревновательных игр.',tariff:W(T(600,1200,1600,3000,3000),T(800,1600,2400,3000,3000))},
 {id:'vip10',name:'VIP 10',size:'M',seats:null,desc:'VIP-зона для тех, кто ценит комфорт.',tariff:W(T(700,1500,2000,3200,3400),T(1300,2500,3400,3200,3400))},
 {id:'vipsmoke',name:'VIP Smoking',size:'M',seats:null,desc:'VIP-зона для курящих.',tariff:W(T(800,1500,2000,3000,3200),T(1200,2400,3500,3000,3200))},
 {id:'duo',name:'Duo-комната',size:'L',seats:null,desc:'Комната на двоих.',tariff:W(T(1700,3500,4500,4000,6000),T(2000,4000,4800,4000,6000))},
 {id:'squad',name:'Squad-комната',size:'L',seats:null,desc:'Комната для команды.',tariff:W(T(1200,2000,3200,5000,5000),T(1500,3000,4500,5000,5000))}
];
