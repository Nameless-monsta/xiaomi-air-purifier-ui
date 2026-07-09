import * as THREE from 'three';

const rooms = {
  living: { number:'ROOM 01', title:'Living Room', status:'25.0°C · calm · 3 active', tint:0xb6a99a, devices:[['LIGHT / 01','FADO Lamp','68% · warm'],['MEDIA / 01','Television','Apple TV'],['MEDIA / 02','Apple TV','Playing'],['CLIMATE / 01','Air Conditioning','23.5°'],['CLEAN / 01','Robot Vacuum','Docked']] },
  bedroom:{ number:'ROOM 02', title:'Bedroom', status:'22.5°C · night · 2 active', tint:0x9da6b5, devices:[['LIGHT / 01','Bedside Lamp','35% · warm'],['LIGHT / 02','Ceiling','Off'],['CLIMATE / 01','Air Conditioning','22.5°'],['SWITCH / 01','Bedside Switch','Active']] },
  kitchen:{ number:'ROOM 03', title:'Kitchen', status:'24.0°C · bright · 2 active', tint:0xc2b28f, devices:[['LIGHT / 01','Pendant Lights','82% · neutral'],['LIGHT / 02','Counter Light','On'],['SWITCH / 01','Main Switch','Active'],['CLIMATE / 01','Air Conditioning','24.0°'],['CLEAN / 01','Robot Vacuum','Kitchen']] }
};

let state = {view:'home',room:'living',device:null,power:true,color:new THREE.Color('#f3d6a2'),brightness:.68};
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x101010,.07);
const camera = new THREE.PerspectiveCamera(32,1,.1,100); camera.position.set(0,.2,9);
const root = new THREE.Group(); scene.add(root);
const hemi = new THREE.HemisphereLight(0xffffff,0x181818,1.1); scene.add(hemi);
const key = new THREE.DirectionalLight(0xffffff,3); key.position.set(4,5,4); scene.add(key);
const rim = new THREE.PointLight(0xcbbfb0,12,18); rim.position.set(-4,1,3); scene.add(rim);

const dustGeo = new THREE.BufferGeometry(); const dust=[]; for(let i=0;i<700;i++){dust.push((Math.random()-.5)*18,(Math.random()-.5)*11,(Math.random()-.5)*9)} dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(dust,3));
const dustMat = new THREE.PointsMaterial({color:0x8c857e,size:.012,transparent:true,opacity:.22}); const points=new THREE.Points(dustGeo,dustMat); scene.add(points);

function material(color,rough=.35,metal=.2){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});}
function clearRoot(){while(root.children.length){const o=root.children.pop(); o.traverse?.(x=>{x.geometry?.dispose(); if(x.material){(Array.isArray(x.material)?x.material:[x.material]).forEach(m=>m.dispose())}})}}
function makeOrbitalRoom(){clearRoot(); const group=new THREE.Group(); const ringMat=new THREE.MeshBasicMaterial({color:rooms[state.room].tint,transparent:true,opacity:.18});
 for(let i=0;i<4;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.7+i*.45,.006,6,160),ringMat); ring.rotation.x=Math.PI/2+(i*.09); ring.rotation.z=i*.4; group.add(ring)}
 const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.05,4),new THREE.MeshStandardMaterial({color:0x22201e,roughness:.25,metalness:.25,wireframe:false})); group.add(core);
 const shell=new THREE.Mesh(new THREE.IcosahedronGeometry(1.12,3),new THREE.MeshBasicMaterial({color:rooms[state.room].tint,wireframe:true,transparent:true,opacity:.2})); group.add(shell); root.add(group); root.userData.mode='room';}
function makeLamp(){clearRoot(); const g=new THREE.Group();
 const base=new THREE.Mesh(new THREE.CylinderGeometry(.72,.84,.58,64),material(0x171717,.22,.5)); base.position.y=-.58; g.add(base);
 const shadeMat=new THREE.MeshPhysicalMaterial({color:state.color,roughness:.38,transmission:.14,transparent:true,opacity:.95,emissive:state.color,emissiveIntensity:state.power?state.brightness*1.4:.02});
 const shade=new THREE.Mesh(new THREE.SphereGeometry(1.05,64,48,0,Math.PI*2,0,Math.PI*.72),shadeMat); shade.scale.y=.9; shade.position.y=.28; g.add(shade);
 const glow=new THREE.PointLight(state.color,state.power?9*state.brightness:0,8); glow.position.set(0,.5,1.2); glow.name='lampGlow'; g.add(glow);
 const halo=new THREE.Mesh(new THREE.TorusGeometry(1.75,.008,8,180),new THREE.MeshBasicMaterial({color:state.color,transparent:true,opacity:.38})); halo.rotation.x=Math.PI/2; g.add(halo);
 root.add(g); root.userData.mode='device';}
function makeTV(){clearRoot(); const g=new THREE.Group(); const screen=new THREE.Mesh(new THREE.BoxGeometry(2.9,1.65,.12),material(0x080808,.12,.55)); g.add(screen); const image=new THREE.Mesh(new THREE.PlaneGeometry(2.66,1.41),new THREE.MeshBasicMaterial({color:0x3f454e})); image.position.z=.065; g.add(image); const stand=new THREE.Mesh(new THREE.CylinderGeometry(.5,.72,.08,64),material(0x171717,.18,.6)); stand.position.y=-1; g.add(stand); root.add(g);root.userData.mode='device';}
function makeAppleTV(){clearRoot(); const g=new THREE.Group(); const box=new THREE.Mesh(new THREE.BoxGeometry(2,2,.5),material(0x111111,.2,.6)); box.rotation.x=-.3; box.rotation.z=.2; g.add(box); root.add(g);root.userData.mode='device';}
function makeClimate(){clearRoot(); const g=new THREE.Group(); const outer=new THREE.Mesh(new THREE.TorusGeometry(1.5,.12,24,160),material(0xdcd4ca,.25,.3)); g.add(outer); const inner=new THREE.Mesh(new THREE.CircleGeometry(1.28,96),new THREE.MeshBasicMaterial({color:0x151515})); g.add(inner); root.add(g);root.userData.mode='device';}
function makeVacuum(){clearRoot(); const g=new THREE.Group(); const body=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.32,.38,80),material(0x151515,.2,.65)); body.rotation.x=Math.PI/2; g.add(body); const turret=new THREE.Mesh(new THREE.CylinderGeometry(.27,.3,.18,48),material(0x262626,.2,.45)); turret.rotation.x=Math.PI/2; turret.position.set(.45,.1,.22); g.add(turret); root.add(g);root.userData.mode='device';}
function renderSceneForView(){ if(state.view==='home'||state.view==='room') makeOrbitalRoom(); else {const t=state.device?.[0]||''; const name=state.device?.[1]||''; if(t.includes('LIGHT')||t.includes('SWITCH'))makeLamp(); else if(name==='Television')makeTV(); else if(name==='Apple TV')makeAppleTV(); else if(t.includes('CLIMATE'))makeClimate(); else makeVacuum();}}

function switchView(name){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));state.view=name;renderSceneForView();wash();}
function enterRoom(key){state.room=key; const r=rooms[key];document.getElementById('room-number').textContent=r.number;document.getElementById('room-title').textContent=r.title;document.getElementById('room-status').textContent=r.status;const rail=document.getElementById('device-rail');rail.innerHTML='';r.devices.forEach(d=>{const b=document.createElement('button');b.className='device-card';b.innerHTML=`<span>${d[0]}</span><strong>${d[1]}</strong><em>${d[2]}</em>`;b.addEventListener('click',()=>openDevice(d));rail.appendChild(b)});switchView('room');}
function openDevice(d){state.device=d;document.getElementById('device-type').textContent=d[0];document.getElementById('device-title').textContent=d[1]; const panels=['light','climate','media','vacuum'];panels.forEach(x=>document.getElementById(`${x}-controls`).classList.add('hidden')); if(d[0].includes('LIGHT')||d[0].includes('SWITCH'))document.getElementById('light-controls').classList.remove('hidden');else if(d[0].includes('CLIMATE'))document.getElementById('climate-controls').classList.remove('hidden');else if(d[0].includes('MEDIA'))document.getElementById('media-controls').classList.remove('hidden');else document.getElementById('vacuum-controls').classList.remove('hidden');switchView('device');}
function wash(){const w=document.getElementById('transition-wash');w.classList.remove('go');void w.offsetWidth;w.classList.add('go')}

document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>{enterRoom(b.dataset.room);document.getElementById('adaptive-menu').classList.remove('open')}));
document.querySelectorAll('[data-nav="home"]').forEach(b=>b.addEventListener('click',()=>switchView('home')));
document.getElementById('device-back').addEventListener('click',()=>switchView('room'));
document.querySelector('.menu-toggle').addEventListener('click',()=>document.getElementById('adaptive-menu').classList.add('open'));
document.getElementById('menu-close').addEventListener('click',()=>document.getElementById('adaptive-menu').classList.remove('open'));
document.getElementById('power-btn').addEventListener('click',e=>{state.power=!state.power;e.target.textContent=state.power?'ON':'OFF';e.target.classList.toggle('on',state.power);makeLamp()});
document.getElementById('brightness').addEventListener('input',e=>{state.brightness=e.target.value/100;document.getElementById('brightness-value').textContent=e.target.value+'%';if(state.view==='device')makeLamp()});
document.getElementById('temperature').addEventListener('input',e=>document.getElementById('temp-value').textContent=e.target.value+'K');
document.getElementById('climate').addEventListener('input',e=>document.getElementById('climate-value').textContent=Number(e.target.value).toFixed(1)+'°');
document.querySelectorAll('.swatches button').forEach(b=>b.addEventListener('click',()=>{state.color.set(b.dataset.color);document.documentElement.style.setProperty('--device',b.dataset.color);document.getElementById('hue-name').textContent=b.getAttribute('aria-label');makeLamp()}));
const hueTrack=document.getElementById('hue-track');function hueFromPoint(x){const r=hueTrack.getBoundingClientRect();let p=Math.max(0,Math.min(1,(x-r.left)/r.width));document.getElementById('hue-thumb').style.left=(p*100)+'%';const c=new THREE.Color().setHSL(p,.72,.68);state.color.copy(c);document.getElementById('hue-name').textContent=Math.round(p*360)+'°';makeLamp()}
hueTrack.addEventListener('pointerdown',e=>{hueTrack.setPointerCapture(e.pointerId);hueFromPoint(e.clientX)});hueTrack.addEventListener('pointermove',e=>{if(e.buttons)hueFromPoint(e.clientX)});

let pointer={x:0,y:0,down:false,px:0,py:0};canvas.addEventListener('pointerdown',e=>{pointer.down=true;pointer.px=e.clientX;pointer.py=e.clientY});canvas.addEventListener('pointerup',()=>pointer.down=false);canvas.addEventListener('pointermove',e=>{pointer.x=(e.clientX/innerWidth-.5);pointer.y=(e.clientY/innerHeight-.5);if(pointer.down){root.rotation.y+=(e.clientX-pointer.px)*.006;root.rotation.x+=(e.clientY-pointer.py)*.004;pointer.px=e.clientX;pointer.py=e.clientY}});
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();renderSceneForView();
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();points.rotation.y=t*.008; if(!pointer.down){root.rotation.y+=(pointer.x*.16-root.rotation.y)*.025;root.rotation.x+=(-pointer.y*.08-root.rotation.x)*.025} root.position.y=Math.sin(t*.7)*.05;root.rotation.z=Math.sin(t*.35)*.018; if(root.userData.mode==='room')root.children[0]?.children.forEach((c,i)=>{if(c.geometry?.type==='TorusGeometry')c.rotation.z+=.0008*(i+1)});renderer.render(scene,camera)}animate();
setInterval(()=>{const d=new Date();document.getElementById('clock').textContent=d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})},1000);
