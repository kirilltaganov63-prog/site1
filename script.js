const FORM_ENDPOINT='/api/lead';
const PHP_FALLBACK_ENDPOINT='/lead.php';
const nav=document.getElementById('nav'), burger=document.getElementById('burger'), header=document.querySelector('.header'), modal=document.getElementById('modal');
burger?.addEventListener('click',()=>nav?.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));
function setHeader(){header?.classList.toggle('fixed',scrollY>30)}setHeader();addEventListener('scroll',setHeader,{passive:true});
document.querySelectorAll('.open-modal').forEach(b=>b.addEventListener('click',()=>modal?.classList.add('show')));
document.getElementById('close')?.addEventListener('click',()=>modal?.classList.remove('show'));
modal?.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
addEventListener('keydown',e=>{if(e.key==='Escape')modal?.classList.remove('show')});
function maskPhone(input){input.addEventListener('input',()=>{let d=input.value.replace(/\D/g,'');if(d.startsWith('8'))d='7'+d.slice(1);if(!d.startsWith('7'))d='7'+d;d=d.slice(0,11);let s='+7';if(d.length>1)s+=' ('+d.slice(1,4);if(d.length>=4)s+=')';if(d.length>4)s+=' '+d.slice(4,7);if(d.length>7)s+='-'+d.slice(7,9);if(d.length>9)s+='-'+d.slice(9,11);input.value=s;});}
document.querySelectorAll('input[type="tel"]').forEach(maskPhone);
function setMessage(form,type,text){const m=form.querySelector('.form-message'); if(m){m.className='form-message '+type; m.textContent=text;}}
async function postJSON(url,payload){return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});}
async function sendLead(payload){try{const r=await postJSON(FORM_ENDPOINT,payload);if(r.ok)return r;}catch(e){} return postJSON(PHP_FALLBACK_ENDPOINT,payload);}
document.querySelectorAll('.lead-form').forEach(form=>form.addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(form);const phone=(fd.get('phone')||'').toString().trim();const nums=phone.replace(/\D/g,'');if(nums.length<11){setMessage(form,'error','Введите корректный номер телефона.');return;}const btn=form.querySelector('button[type="submit"]');const old=btn.textContent;btn.disabled=true;btn.textContent='Отправка...';try{const r=await sendLead({phone,source:'margo-site',page:location.href,createdAt:new Date().toISOString()});if(!r.ok)throw new Error('bad');setMessage(form,'success','Спасибо! Заявка отправлена. Мы скоро свяжемся с вами.');form.reset();setTimeout(()=>modal?.classList.remove('show'),1000);}catch(err){setMessage(form,'error','Не удалось отправить. Напишите в WhatsApp или позвоните: +7 (918) 555-55-55.');}finally{btn.disabled=false;btn.textContent=old;}}));
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.stats-panel,.work-card,.review-card,.about,.materials,.steps,.contact-strip').forEach(el=>{el.classList.add('reveal');obs.observe(el)});
