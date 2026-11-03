const $=s=>document.querySelector(s),zn=id=>ZONES.find(z=>z.id===id);
const fmt=n=>n==null?'—':n.toLocaleString('ru-RU')+' ₸';
const p2=n=>String(n).padStart(2,'0');
const st={zone:null,di:0,time:null,pack:'h1',n:1};
const dateOf=i=>{const d=new Date();d.setDate(d.getDate()+i);return d};
const isWE=d=>{const g=d.getDay();return g===0||g===6}; // выходные: сб и вс (при необходимости добавьте пятницу)
const tf=(z,d)=>isWE(d)?z.tariff.we:z.tariff.wd;
// Зоны
$('#zg').innerHTML=ZONES.map(z=>`<article class="z ${z.size==='XL'?'XL':z.size==='L'?'L':''}" id="zc-${z.id}"><div class="im">Фото: ${z.name}</div><div class="bd"><h3>${z.name}</h3><p>${z.desc}</p><div class="ft"><span>${z.seats?z.seats+' мест':'Мест: уточняется'}</span><button class="btn sm" data-z="${z.id}">Забронировать</button></div></div></article>`).join('');
// Цены
const cols=[['h1','1 час'],['h3','3 часа'],['h5','5 часов'],['day','День'],['night','Ночь']];
const rowsT=[];
ZONES.forEach(z=>{
 if(z.tariff.wd){[['wd','Будни'],['we','Выходные']].forEach(([k,l],i)=>rowsT.push({z,t:z.tariff[k],sub:l,first:i===0}))}
 else rowsT.push({z,t:z.tariff,sub:'',first:true});
});
$('#pt').innerHTML=rowsT.map(r=>`<tr><td class="zn">${r.z.name}${r.sub?`<small>${r.sub}</small>`:''}</td>${cols.map(c=>`<td class="${r.t[c[0]]==null?'na':''}">${fmt(r.t[c[0]])}</td>`).join('')}<td>${r.first?`<button class="btn sm" data-z="${r.z.id}">Забронировать</button>`:''}</td></tr>`).join('');
$('#pm').innerHTML=ZONES.map(z=>{
 const blocks=z.tariff.wd?[['Будни',z.tariff.wd],['Выходные',z.tariff.we]]:[['',z.tariff]];
 return `<details><summary>${z.name}</summary><div class="in">${blocks.map(([l,t])=>(l?`<strong>${l}</strong>`:'')+cols.map(c=>`<div><span class="na">${c[1]}</span><span>${fmt(t[c[0]])}</span></div>`).join('')).join('')}<button class="btn sm" data-z="${z.id}" style="justify-self:start">Забронировать</button></div></details>`}).join('');
// Конструктор бронирования
const dLong=d=>d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
const packLabel=k=>k==='day'?'День (10:00–18:00)':cols.find(c=>c[0]===k)[1];
const toMin=t=>+t.slice(0,2)*60+ +t.slice(3);
const isPast=t=>{const n=new Date();return st.di===0&&toMin(t)<=n.getHours()*60+n.getMinutes()};
function fixTime(){
 if(st.pack==='day')st.time='10:00';
 else if(st.time&&isPast(st.time))st.time=null;
}
function priceNow(k){const z=st.zone&&zn(st.zone);return z?tf(z,dateOf(st.di))[k]:null}
function renderAll(){
 $('#bz').innerHTML=ZONES.map(z=>`<button type="button" class="chip" aria-pressed="${z.id===st.zone}" data-z="${z.id}">${z.name}</button>`).join('');
 $('#bday').innerHTML=[0,1].map(i=>{const d=dateOf(i);return `<button type="button" class="chip" aria-pressed="${st.di===i}" data-d="${i}">${i?'Завтра':'Сегодня'}, ${dLong(d)} (${isWE(d)?'выходной':'будни'})</button>`}).join('');
 fixTime();
 const bt=$('#btime'),prev=bt.scrollTop;
 bt.innerHTML=Array.from({length:1440/TIME_STEP},(_,i)=>{const m=i*TIME_STEP,t=p2(Math.floor(m/60))+':'+p2(m%60);const off=st.pack==='day'?t!=='10:00':isPast(t);return `<button type="button" class="chip" aria-pressed="${st.time===t}" data-t="${t}" ${off?'disabled':''}>${t}</button>`}).join('');
 if(st.sc){bt.scrollTop=prev}else{const t=bt.querySelector('[aria-pressed=true]')||bt.querySelector('button:not(:disabled)');if(t)bt.scrollTop=t.offsetTop-bt.offsetTop;st.sc=true}
 $('#bpk').innerHTML=cols.map(([k])=>{const p=priceNow(k);return `<button type="button" class="chip" aria-pressed="${st.pack===k}" data-k="${k}">${packLabel(k)}${p!=null?' · '+fmt(p):''}</button>`}).join('');
 document.querySelectorAll('.z').forEach(e=>e.classList.toggle('sel',e.id==='zc-'+st.zone));
 upd();
}
function cost(){const p=priceNow(st.pack);return p==null?null:p*st.n}
function upd(){
 const z=st.zone&&zn(st.zone),d=dateOf(st.di);
 $('#qn').textContent=st.n;
 $('#s1').textContent=z?z.name:'—';
 $('#s2').textContent=dLong(d)+', '+(isWE(d)?'выходной':'будни');
 $('#s3').textContent=st.time||'—';
 $('#s4').textContent=packLabel(st.pack);
 $('#s5').textContent=st.n;
 const c=cost();$('#s6').textContent=!z?'—':c==null?'По запросу':fmt(c);
 $('#s7').textContent=!z?'Выберите зону — покажем стоимость':c==null?'Цена не внесена — стоимость уточнит администратор':'По прайс-листу ('+(isWE(d)?'выходные':'будни')+')'+(st.n>1?', '+st.n+' ПК':'');
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-z],[data-d],[data-t],[data-k]');if(!b)return;
 if(b.dataset.z){st.zone=b.dataset.z;renderAll();if(!b.classList.contains('chip'))$('#bk').scrollIntoView({behavior:'smooth'})}
 else if(b.dataset.d!==undefined){st.di=+b.dataset.d;st.sc=false;renderAll()}
 else if(b.dataset.t){st.time=b.dataset.t;renderAll()}
 else{st.pack=b.dataset.k;st.sc=false;renderAll()}
});
$('#qm').onclick=()=>{st.n=Math.max(1,st.n-1);upd()};
$('#qp').onclick=()=>{st.n=Math.min(20,st.n+1);upd()};
$('#ph').addEventListener('input',e=>{
 let g=e.target.value.replace(/\D/g,'');
 if(g.length>10&&(g[0]==='7'||g[0]==='8'))g=g.slice(1);
 g=g.slice(0,10);
 e.target.value=[g.slice(0,3),g.slice(3,6),g.slice(6,8),g.slice(8,10)].filter(Boolean).join(' ');
});
$('#send').addEventListener('click',()=>{
 const miss=[],phone=$('#ph').value.replace(/\D/g,'');
 if(!st.zone)miss.push('зону');if(!st.time)miss.push('время начала');
 if(!$('#nm').value.trim())miss.push('имя');
 if(phone.length!==10)miss.push('телефон (10 цифр после +7)');
 if(miss.length){$('#er').textContent='Выберите/заполните: '+miss.join(', ')+'.';return}
 $('#er').textContent='';
 const c=cost();
 const msg=['Здравствуйте! Хочу забронировать место в Brothers Cyber Club.','','Зона: '+zn(st.zone).name,'Дата: '+$('#s2').textContent,'Время: '+st.time,'Тариф: '+packLabel(st.pack),'Количество компьютеров: '+st.n,'Предварительная стоимость: '+(c==null?'уточнить':fmt(c)),'','Имя: '+$('#nm').value.trim(),'Телефон: +7 '+$('#ph').value].join('\n');
 window.open('https://wa.me/'+(CONFIG.whatsapp||'')+'?text='+encodeURIComponent(msg),'_blank','noopener');
});
// Карта и контакты
const ph=v=>v||'Будет добавлено';
$('#ad').textContent=CONFIG.address||'Адрес клуба будет добавлен.';
const q=encodeURIComponent('Brothers Cyber Club');
const has=CONFIG.lat!=null&&CONFIG.lon!=null;
if(has&&CONFIG.twoGisKey){
 $('#mp').innerHTML='';
 const s=document.createElement('script');s.src='https://mapgl.2gis.com/api/js/v1';
 s.onload=()=>{const m=new mapgl.Map('mp',{center:[CONFIG.lon,CONFIG.lat],zoom:16,key:CONFIG.twoGisKey});new mapgl.Marker(m,{coordinates:[CONFIG.lon,CONFIG.lat]})};
 document.head.appendChild(s);
}else if(has){
 const k=.004,bb=[CONFIG.lon-k,CONFIG.lat-k/2,CONFIG.lon+k,CONFIG.lat+k/2].join('%2C');
 $('#mp').innerHTML=`<iframe title="Карта" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${bb}&layer=mapnik&marker=${CONFIG.lat}%2C${CONFIG.lon}"></iframe>`;
}else $('#mp').innerHTML=`<p>${CONFIG.address||'Адрес будет добавлен'}<br>Откройте клуб в 2GIS кнопкой ниже.</p>`;
const base=CONFIG.twoGisUrl||`https://2gis.kz/search/${q}`;
const oid=(CONFIG.twoGisUrl||'').match(/\/(?:geo|firm)\/(\d+)/),city=CONFIG.twoGisCity||'ust-kamenogorsk';
// формат 2GIS: /directions/points/<откуда>|<куда>; пустое «откуда» = местоположение пользователя
$('#rt').href=has?`https://2gis.kz/${city}/directions/points/%7C${CONFIG.lon}%2C${CONFIG.lat}${oid?'%3B'+oid[1]:''}`:base;
$('#o2').href=CONFIG.twoGisFirmId?`https://2gis.kz/firm/${CONFIG.twoGisFirmId}`:base;
$('#cg').innerHTML=[['Адрес',CONFIG.address],['Телефон',CONFIG.phone],['WhatsApp',CONFIG.whatsapp&&'+'+CONFIG.whatsapp],['Instagram',CONFIG.instagram],['График работы',CONFIG.hours]].map(([k,v])=>`<div><dt>${k}</dt><dd class="${v?'':'na'}">${ph(v)}</dd></div>`).join('');
$('#yr').textContent=new Date().getFullYear();
// Меню
$('#mb').onclick=()=>{const o=$('#nv').classList.toggle('o');$('#mb').setAttribute('aria-expanded',o)};
$('#nv').onclick=e=>{if(e.target.tagName==='A')$('#nv').classList.remove('o')};
// Появление
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));
renderAll();