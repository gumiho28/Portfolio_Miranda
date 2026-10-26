'use strict';
const $ = s => document.querySelector(s);
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = value => new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(value);
const initial = {
pets:[
{id:1,name:'Luna',breed:'Aspin',age:'2 years',type:'dog',status:'available',art:'dog-gold.svg'},
{id:2,name:'Milo',breed:'Puspin',age:'8 months',type:'cat',status:'available',art:'cat-gold.svg'},
{id:3,name:'Bantay',breed:'Aspin',age:'3 years',type:'dog',status:'available',art:'dog-brown.svg'},
{id:4,name:'Suki',breed:'Puspin',age:'1 year',type:'cat',status:'available',art:'cat-gray.svg'},
{id:5,name:'Coco',breed:'Mixed breed',age:'10 months',type:'dog',status:'available',art:'dog-gray.svg'},
{id:6,name:'Pepper',breed:'Puspin',age:'2 years',type:'cat',status:'available',art:'cat-brown.svg'}],
applications:[{id:1,petId:1,petName:'Luna',applicant:'Sample applicant',address:'Example residence, Baguio',housing:'Owned house',fence:'Yes',household:'Two adults (sample)',otherPets:'None (sample)',hours:'4',status:'Pending'}],
reports:[{id:1,petName:'Pip',location:'Sample neighborhood, Baguio',type:'dog',description:'Fictional report: blue collar, friendly.',lastSeen:'2026-01-10T09:00',status:'Missing'},{id:2,petName:'Nori',location:'Example garden, Baguio',type:'cat',description:'Fictional report: white paws, orange collar.',lastSeen:'2026-01-11T10:30',status:'Missing'}],
shelters:[{id:1,name:'Pine Haven (sample)',location:'Baguio City',schedule:'Mon–Sat, 9AM–5PM',status:'Open'},{id:2,name:'Hillside Rescue (sample)',location:'Benguet',schedule:'Mon–Fri, 8AM–5PM',status:'At capacity'}],
donations:12500
};
let state=structuredClone(initial), nextId=20, adminTab='applications', noticeTimer;
function notify(message){clearTimeout(noticeTimer);$('#notice').textContent=message;noticeTimer=setTimeout(()=>$('#notice').textContent='',6000);}
function art(pet){return 'assets/'+(pet.art|| (pet.type==='cat'?'cat-gold.svg':'dog-gold.svg'));}
function renderStats(){
 $('#home-available').textContent=state.pets.filter(p=>p.status==='available').length;
 $('#home-missing').textContent=state.reports.filter(p=>p.status==='Missing').length;
 $('#home-applications').textContent=state.applications.length;
 $('#fund-total').textContent='Demo total: '+money(state.donations);
 $('#fund-progress').value=state.donations;
}
function renderPets(){
 const query=$('#search').value.trim().toLowerCase(),type=$('#type-filter').value;
 const pets=state.pets.filter(p=>p.status==='available'&&(!type||p.type===type)&&(!query||(p.name+' '+p.breed).toLowerCase().includes(query)));
 $('#search-count').textContent=pets.length+' sample '+(pets.length===1?'pet':'pets')+' found';
 $('#pet-grid').innerHTML=pets.length?pets.map(p=>'<article class="pet-card"><div class="pet-img"><img src="'+art(p)+'" alt="Illustration of '+esc(p.name)+'" width="400" height="300"></div><div class="pet-details"><h3>'+esc(p.name)+'</h3><p><strong>Breed:</strong> '+esc(p.breed)+'</p><p><strong>Age:</strong> '+esc(p.age)+'</p><div class="pet-actions"><button class="btn-primary" data-apply="'+p.id+'">Apply for '+esc(p.name)+'</button></div></div></article>').join(''):'<p class="empty">No sample pets match your search. Try another name or choose All types.</p>';
}
function renderReports(){
 $('#missing-feed').innerHTML=state.reports.length?state.reports.map(p=>'<article class="missing-card '+(p.status==='Found'?'found':'')+'"><div class="missing-img-container"><img src="'+art(p)+'" alt="Sample '+p.type+' illustration" width="100" height="100"></div><div><h4>'+esc(p.status)+': '+esc(p.petName)+'</h4><p>'+esc(p.location)+'</p><p>'+esc(p.lastSeen.replace('T',' '))+'</p><p>'+esc(p.description)+'</p></div></article>').join(''):'<p>No sample reports.</p>';
}
function renderShelters(){
 $('#shelter-list').innerHTML=state.shelters.map(s=>'<article class="shelter-card"><div class="shelter-mark" aria-hidden="true">⌂</div><div><h3>'+esc(s.name)+' <span class="status-badge '+(s.status==='Open'?'status-open':'status-full')+'">'+esc(s.status)+'</span></h3><p>'+esc(s.location)+'</p><p>'+esc(s.schedule)+'</p><p class="form-note">Example directory listing. No real contact or booking service.</p></div></article>').join('');
}
function options(values,current){return values.map(v=>'<option'+(v===current?' selected':'')+'>'+esc(v)+'</option>').join('');}
function renderAdmin(){
 document.querySelectorAll('[data-admin-tab]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.adminTab===adminTab));
 const wrap=$('#admin-content');
 if(adminTab==='applications'){
  wrap.innerHTML='<h3>Adoption Applications</h3><p>Try an application from Adopt, then review it here. Approving it updates the sample pet’s availability.</p><div class="table-wrap"><table class="data-table"><thead><tr><th>Pet</th><th>Applicant</th><th>Status</th><th>Review</th></tr></thead><tbody>'+state.applications.map(a=>'<tr><td>'+esc(a.petName)+'</td><td>'+esc(a.applicant)+'</td><td><select data-app-status="'+a.id+'" aria-label="Status for application '+a.id+'">'+options(['Pending','Approved','Rejected'],a.status)+'</select></td><td><button class="small-button" data-answers="'+a.id+'">View answers</button></td></tr>').join('')+'</tbody></table></div>'+(!state.applications.length?'<p>No demo applications yet.</p>':'');
 }else if(adminTab==='pets'){
  wrap.innerHTML='<h3>Manage Sample Pets</h3><p>Add a fictional pet or edit the examples. Illustrations stand in for uploads.</p><form id="pet-form" class="admin-add"><label>Name<input name="name" required maxlength="60" placeholder="Sample pet name"></label><label>Breed<input name="breed" required maxlength="60" placeholder="Aspin or Puspin"></label><label>Age<input name="age" required maxlength="30" placeholder="e.g. 2 years"></label><label>Type<select name="type"><option value="dog">Dog</option><option value="cat">Cat</option></select></label><button class="btn-primary">Add sample pet</button></form><div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Breed / Age</th><th>Status</th><th>Actions</th></tr></thead><tbody>'+state.pets.map(p=>'<tr><td>'+esc(p.name)+'</td><td>'+esc(p.breed)+' / '+esc(p.age)+'</td><td>'+esc(p.status)+'</td><td><div class="row-actions"><button class="small-button" data-edit-pet="'+p.id+'">Edit '+esc(p.name)+'</button><button class="small-button" data-delete-pet="'+p.id+'">Remove</button></div></td></tr>').join('')+'</tbody></table></div>';
 }else if(adminTab==='reports'){
  wrap.innerHTML='<h3>Lost-pet Reports</h3><p>Update a report and see the change on Lost & Found.</p><div class="table-wrap"><table class="data-table"><thead><tr><th>Pet</th><th>Location</th><th>Status</th></tr></thead><tbody>'+state.reports.map(r=>'<tr><td>'+esc(r.petName)+'</td><td>'+esc(r.location)+'</td><td><select aria-label="Report status for '+esc(r.petName)+'" data-report-status="'+r.id+'">'+options(['Missing','Found'],r.status)+'</select></td></tr>').join('')+'</tbody></table></div>';
 }else if(adminTab==='shelters'){
  wrap.innerHTML='<h3>Shelter Availability</h3><p>Changes appear in the sample shelter directory.</p>'+state.shelters.map(s=>'<label>'+esc(s.name)+'<select data-shelter-status="'+s.id+'">'+options(['Open','At capacity'],s.status)+'</select></label>').join('');
 }else{
  const adopted=state.pets.filter(p=>p.status==='adopted').length, total=state.pets.length;
  const breeds=[...new Set(state.pets.map(p=>p.breed))];
  wrap.innerHTML='<h3>Adoption Analytics</h3><p class="form-note">Descriptive counts from this demo session, not real outcomes or a validated prediction of adoption.</p><div class="analytics-grid"><div class="analytics-block"><h4>Sample pet adoption rate</h4><strong>'+Math.round(total?adopted/total*100:0)+'%</strong><p>'+adopted+' adopted of '+total+' sample pets</p><progress max="'+Math.max(total,1)+'" value="'+adopted+'" aria-label="Sample adoption rate"></progress></div><div class="analytics-block"><h4>Applications</h4><strong>'+state.applications.filter(a=>a.status==='Pending').length+'</strong><p>Pending sample reviews</p><p>'+state.applications.filter(a=>a.status==='Approved').length+' approved · '+state.applications.filter(a=>a.status==='Rejected').length+' rejected</p></div></div><h4 style="margin-top:28px">Adoption share by sample breed</h4>'+breeds.map(b=>{const group=state.pets.filter(p=>p.breed===b), n=group.filter(p=>p.status==='adopted').length;return '<div class="bar-row"><span>'+esc(b)+': '+n+' of '+group.length+'</span><progress max="'+group.length+'" value="'+n+'" aria-label="'+esc(b)+' sample adoption share"></progress></div>';}).join('');
 }
}
function renderAll(){renderStats();renderPets();renderReports();renderShelters();renderAdmin();}
function showPage(){
 const allowed=['home','adopt','lost','shelters','donate','admin'];
 const id=allowed.includes(location.hash.slice(1))?location.hash.slice(1):'home';
 document.querySelectorAll('main>section').forEach(s=>{s.hidden=s.id!==id;s.classList.toggle('active',s.id===id);});
 document.querySelectorAll('.nav-links a').forEach(a=>{a.classList.toggle('active',a.hash==='#'+id);if(a.hash==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 window.scrollTo({top:0,behavior:'instant'});
}
window.addEventListener('hashchange',showPage);
$('#search-form').addEventListener('submit',event=>{event.preventDefault();renderPets();});
$('#search').addEventListener('input',renderPets);$('#type-filter').addEventListener('change',renderPets);
document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.dataset.apply){
  const pet=state.pets.find(p=>p.id===Number(button.dataset.apply));if(!pet||pet.status!=='available')return;
  $('#application-form').reset();$('#application-form').elements.petId.value=pet.id;$('#application-pet').textContent=pet.name;$('#application-dialog').showModal();
 }
 if(button.classList.contains('close-dialog'))button.closest('dialog').close();
 if(button.dataset.adminTab){adminTab=button.dataset.adminTab;renderAdmin();}
 if(button.dataset.answers){
  const a=state.applications.find(a=>a.id===Number(button.dataset.answers));
  $('#answers-title').textContent='Application for '+a.petName;
  const fields={Applicant:a.applicant,'Example address':a.address,Housing:a.housing,'Fence or gate':a.fence,Household:a.household,'Other pets':a.otherPets,'Hours alone':a.hours,Status:a.status};
  $('#answers-content').innerHTML='<dl class="answer-list">'+Object.entries(fields).map(([k,v])=>'<dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd>').join('')+'</dl>';
  $('#answers-dialog').showModal();
 }
 if(button.dataset.deletePet){
  const id=Number(button.dataset.deletePet);state.pets=state.pets.filter(p=>p.id!==id);renderAll();notify('Sample pet removed. Reset demo restores the original examples.');
 }
 if(button.dataset.editPet){
  const p=state.pets.find(p=>p.id===Number(button.dataset.editPet));$('#answers-title').textContent='Edit sample pet';
  $('#answers-content').innerHTML='<form id="edit-pet-form"><input type="hidden" name="id" value="'+p.id+'"><label>Name<input name="name" value="'+esc(p.name)+'" required maxlength="60"></label><label>Breed<input name="breed" value="'+esc(p.breed)+'" required maxlength="60"></label><label>Age<input name="age" value="'+esc(p.age)+'" required maxlength="30"></label><button class="btn-primary">Save sample pet</button></form>';$('#answers-dialog').showModal();
 }
});
document.addEventListener('change',event=>{
 const el=event.target;
 if(el.dataset.appStatus){
  const app=state.applications.find(a=>a.id===Number(el.dataset.appStatus)), pet=state.pets.find(p=>p.id===app.petId);
  if(el.value==='Approved'&&(!pet||state.applications.some(a=>a.id!==app.id&&a.petId===app.petId&&a.status==='Approved'))){notify('That sample pet is no longer available.');renderAdmin();return;}
  app.status=el.value;if(pet)pet.status=state.applications.some(a=>a.petId===pet.id&&a.status==='Approved')?'adopted':'available';
  renderAll();notify('Demo application status updated.');
 }
 if(el.dataset.reportStatus){state.reports.find(r=>r.id===Number(el.dataset.reportStatus)).status=el.value;renderAll();notify('Demo report updated.');}
 if(el.dataset.shelterStatus){state.shelters.find(s=>s.id===Number(el.dataset.shelterStatus)).status=el.value;renderAll();notify('Sample directory updated.');}
});
document.addEventListener('submit',event=>{
 const form=event.target;if(!['application-form','lost-form','donation-form','pet-form','edit-pet-form'].includes(form.getAttribute('id')))return;
 event.preventDefault();const data=Object.fromEntries(new FormData(form));
 if(form.getAttribute('id')==='application-form'){
  const pet=state.pets.find(p=>p.id===Number(data.petId));if(!pet||pet.status!=='available'){notify('This sample pet is no longer available.');return;}
  state.applications.unshift({...data,id:nextId++,petId:pet.id,petName:pet.name,status:'Pending'});$('#application-dialog').close();notify('Demo application added. Open Admin preview to review it. Nothing was sent.');
 }else if(form.getAttribute('id')==='lost-form'){
  state.reports.unshift({...data,id:nextId++,status:'Missing'});notify('Sample report added to this page only.');
 }else if(form.getAttribute('id')==='donation-form'){
  state.donations+=Number(data.amount);notify('Simulated '+money(Number(data.amount))+' added. No payment was made.');
 }else if(form.getAttribute('id')==='pet-form'){
  state.pets.push({...data,id:nextId++,status:'available'});notify('Sample pet added to Adopt.');
 }else{
  const pet=state.pets.find(p=>p.id===Number(data.id));if(pet){pet.name=data.name;pet.breed=data.breed;pet.age=data.age;}$('#answers-dialog').close();notify('Sample pet updated.');
 }
 renderAll();
});
$('#reset-demo').addEventListener('click',()=>{
 state=structuredClone(initial);nextId=20;adminTab='applications';document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.querySelectorAll('form').forEach(f=>f.reset());$('#search').value='';$('#type-filter').value='';renderAll();notify('Demo reset. All changes cleared.');
});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',event=>{if(event.target===d){const r=d.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();}}));
$('#lost-form').elements.lastSeen.defaultValue='2026-01-12T09:00';
renderAll();showPage();
