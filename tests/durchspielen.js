const {chromium}=require('playwright');
const path=require('path'),os=require('os'),fs=require('fs');
const FILE='file://'+path.resolve(__dirname,'../Solvay-1927-Lernspiel-2D.html');
const OUT=fs.mkdtempSync(path.join(os.tmpdir(),'bruessel1927-'));const HELP=path.join(__dirname,'helpers.js');console.log('Ausgabe:',OUT);
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1180,height:820}});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('pageerror: '+e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.type()+': '+m.text())});
await p.goto(FILE);await p.addScriptTag({path:HELP});
// Struktur
const st=await p.evaluate(()=>{const out=[];
 const who=[...PHYS,'federle'];
 for(const d in PLACE)PLACE[d].forEach((P,ph)=>{const all=Object.values(P).flat();who.forEach(c=>{const n=all.filter(x=>x===c).length;if(n!==1)out.push(`PLACE ${d}/${ph}: ${c} ${n}x`)});all.forEach(c=>{if(!who.includes(c))out.push('PLACE fremd '+c)});
   for(const r in P){const sp=MAPS[r].spots.length;if(P[r].length>sp)out.push(`PLACE ${d}/${ph} ${r}: ${P[r].length} Personen, ${sp} Plätze`)}});
 for(const r in MAPS){grid=buildGrid(r);const M=MAPS[r];
   M.doors.forEach(d=>{if(!MAPS[d.to].doors.some(x=>x.to===r))out.push('kein Rückweg '+r+'->'+d.to)});
   const starts=M.doors.map(d=>doorGeo(d).spawn);
   const targets=[...M.doors.map(d=>['Tür '+d.to,doorGeo(d).trig]),...M.spots.map((s,i)=>['Platz'+i,s]),...M.objs.map(o=>['Obj '+o.id,o.stand])];
   for(const c in XSPOT)if(XSPOT[c][0]===r)targets.push(['X '+c,XSPOT[c][1]]);
   starts.forEach(s=>targets.forEach(([n,t])=>{const pth=findPath(s[0],s[1],t[0],t[1]);const sc=nearFree(s[0],s[1]),tc=nearFree(t[0],t[1]);if(!pth.length&&!(sc&&tc&&sc[0]===tc[0]&&sc[1]===tc[1]))out.push(`unerreichbar ${r}: ${n} von ${s}`)}));
   // Stehen Standpunkte/Spawn auf freien Feldern?
   [...starts.map(s=>['spawn',s]),...M.spots.map((s,i)=>['Platz'+i,s]),...M.objs.map(o=>['Obj '+o.id,o.stand])].forEach(([n,s])=>{if(!canStand(s[0],s[1]))out.push(`blockiert ${r}: ${n} ${s}`)});
 }
 grid=buildGrid('saal');if(!canStand(480,475))out.push('Startpunkt Saal blockiert');grid=buildGrid('hotel');if(!canStand(480,490))out.push('Start Tag3 Hotel blockiert');grid=buildGrid('wandel');if(!canStand(480,420))out.push('Start Tag2 Wandel blockiert');
 // Mithören: Sprecher am Ort?
 EAVES.forEach(e=>{const P=PLACE[e.d][e.ph][e.room]||[];if(P[0]!==e.who[0]&&P[0]!==e.who[1]||!e.who.every(c=>P.slice(0,2).includes(c)))out.push('EAVES '+e.id+' Sprecher nicht vorn: '+P);e.lines.forEach(l=>{if(l[0]!=='narr'&&!P.includes(l[0]))out.push('EAVES '+e.id+': '+l[0]+' spricht, ist aber nicht im Raum')})});
 // Reaktionen auf unbekannte Notizen
 for(const c in T)for(const n in T[c].react)if(!NOTES[n])out.push('react auf unbekannte Notiz '+c+'>'+n);
 for(const c in T)T[c].topics.forEach(t=>{if(t.give&&!NOTES[t.give])out.push('give unbekannt '+c+t.id)});
 return out});
console.log('STRUKTUR:',st.length?st:'ok');
// echtes Laufen: Name, Start, Lorentz anklicken
await p.fill('#nameIn','Test Schülerin');await p.click('#goBtn');await p.waitForTimeout(300);
await p.evaluate(()=>{close()});
await p.screenshot({path:OUT+'/s_saal.png'});
const box=await p.locator('#cv').boundingBox();
const lor=await p.evaluate(()=>{const n=npcs.find(n=>n.id==='lorentz');return [n.x,n.y]});
await p.mouse.click(box.x+lor[0]*box.width/960,box.y+(lor[1]-36)*box.height/560);
await p.waitForTimeout(2500);
console.log('Klick auf Lorentz öffnet Dialog:',await p.evaluate(()=>$('ov').classList.contains('on')&&$('panel').innerText.includes('Lorentz')));
await p.screenshot({path:OUT+'/s_dialog.png'});
await p.evaluate(()=>close());
// Tür anklicken
await p.mouse.click(box.x+480*box.width/960,box.y+545*box.height/560);await p.waitForTimeout(3500);
console.log('Tür Saal->Wandelgang per Klick:',await p.evaluate(()=>S.loc));
await p.evaluate(()=>{enterRoom('saal','wandel')});
// Tastatur
const k0=await p.evaluate(()=>[PL.x,PL.y]);await p.keyboard.down('ArrowUp');await p.waitForTimeout(500);await p.keyboard.up('ArrowUp');
console.log('Pfeiltaste bewegt:',JSON.stringify(k0),'->',JSON.stringify(await p.evaluate(()=>[Math.round(PL.x),Math.round(PL.y)])));
// Durchspielen
const res=await p.evaluate(()=>{const L=[];const hint=()=>{try{hintText();L.push('Tipp: '+hintText().slice(0,90))}catch(e){L.push('hintText FEHLER '+e.message)}};
 hint();
 __ask('lorentz','l1');__ask('lorentz','l2');__ask('debroglie','d1');__listen('m1');__fed();__fed();
 __ask('schroedinger','s1');hint();__show('born','N3');__rum('G2');__rum('G3');hint();
 {const t=__ask('pauli','p2a');if(has('P1'))throw new Error('P1 schon an Tag 1');if(avail('pauli').some(t=>t.id==='p2'))throw new Error('p2 an Tag 1 sichtbar');L.push('Pauli Tag 1: '+t.slice(0,90))}
 L.push('Tag1 Phase '+S.phase+' acts '+S.acts);__endDay();
 L.push('Tag '+S.day+' Ort '+S.loc);hint();
 __ask('heisenberg','h1');__ask('heisenberg','h2');__show('dirac','N5');__ask('pauli','p2');__show('einstein','N4');
 __show('pauli','N3');__show('dirac','N11');__show('dirac','N1');__ask('born','b3');__ask('pauli','p4');__show('ehrenfest','P1');__ask('pauli','p5');
 __fed();__fed();__rum('G1');__rum('G5');
 exp1();$('opts').children[0].click();$('xw').checked=false;$('x500').click();$('xw').checked=true;$('xw').onchange();$('x500').click();close();
 exp2();$('opts').children[0].click();$('xb').value=10;$('xb').oninput();$('xb').value=200;$('xb').oninput();close();
 exp3();$('opts').children[0].click();$('xu').value=20;$('xu').oninput();$('xu').value=80;$('xu').oninput();$('xw').checked=true;$('xw').onchange();$('x200').click();$('xw').checked=false;$('xw').onchange();$('xu').value=40;$('xu').oninput();
 $('xd').value='35';$('xm').click();L.push('exp3 falsch: '+$('xr').innerText.slice(0,160));
 {const lam=6.626e-34/Math.sqrt(2*9.109e-31*1.602e-19*4000);$('xd').value=(2*.135*lam/2.13e-10*1000).toFixed(1).replace('.',',')}$('xm').click();L.push('exp3 richtig: '+$('xr').innerText.slice(0,170));L.push('E3: '+has('E3'));close();
 L.push('Tag2 Phase '+S.phase);hint();__endDay();L.push('Tag '+S.day+' Ort '+S.loc);
 __ask('bohr','bo1');__ask('einstein','e2');__show('bohr','N9');__show('einstein','N10');__show('curie','N4');__fed();__rum('G4');hint();
 {__at('curie');talk('curie');const b=[...document.querySelectorAll('#opts button')].find(b=>b.textContent.includes('Zerfall zeigen'));if(!b)throw new Error('kein Curie-Thema');decayDemo();$('ag').children[5].click();$('aw').click();$('aw').click();$('aw').click();L.push('Curie-Modell: '+$('as').innerText.slice(0,150));$('cl').click();close();}
 notebook('b');$('gf').value='spin';$('gf').oninput();L.push('Glossar Suche spin: '+document.querySelectorAll('.gl dt').length+' Treffer, gesamt '+GLOSS.length);close();
 // Fürs Foto: alle Physiker auf 3
 for(const c of PHYS){let g=0;while((S.cnt[c]||0)<3&&g++<10){const t=avail(c).find(t=>!S.asked.includes(c+'.'+t.id));if(t){try{__ask(c,t.id)}catch(e){break}}else{const n=S.notes.find(n=>T[c].react[n]&&!S.asked.includes(c+'>'+n)&&!(T[c].react[n].if&&!T[c].react[n].if()));if(n)__show(c,n);else break}}}
 L.push('Foto: '+PHYS.filter(inPhoto).length+'/11 '+PHYS.filter(c=>!inPhoto(c)).join(','));
 L.push('Beziehungstafel: '+REL.filter(r=>r[4]()).length+'/'+REL.length);
 __endDay();
 L.push('Bildschirm: '+document.querySelector('.screen.on').id);
 let g=0;while(document.querySelector('.screen.on').id==='epi'&&g++<10)$('en').click();
 const all=Object.keys(NOTES).filter(n=>!S.notes.includes(n));L.push('Fehlende Notizen: '+(all.join(',')||'keine'));
 return L});
res.forEach(x=>console.log(x));
// Quiz
const qlog=await p.evaluate(()=>{const L=[];QA.forEach((q,i)=>{$('a'+i).value=q[1]});$('qchk').click();$('qnx').click();
 for(let pass=0;pass<10;pass++){const sp=[...document.querySelectorAll('#ol .ord span')].map(s=>QB.findIndex(x=>x[1]===s.textContent));for(let i=0;i<sp.length-1;i++)if(sp[i]>sp[i+1]){document.querySelectorAll('#ol .ord')[i].querySelectorAll('button')[1].click();break}}
 $('qchk').click();$('qnx').click();
 // erst eine falsche Antwort prüfen (Erklärung), dann richtig – Punkte zählen nur beim ersten Versuch
 QC.forEach((q,i)=>document.querySelector(`input[name=c${i}][value="${i===0?q.o.findIndex(o=>!o.ok):q.o.findIndex(o=>o.ok)}"]`).checked=true);$('qchk').click();L.push('QC-Erklärung: '+$('cf0').innerText.slice(0,80));
 L.push('Reihenfolge c0: '+[...document.querySelectorAll('input[name=c0]')].map(x=>x.value).join(''));
 QC.forEach((q,i)=>mcSet('c'+i,q.o));$('qchk').click();$('qnx').click();
 $('pm').value='5,27';$('pe').value='-25';$('vm').value='5,79';$('ve').value='5';mcSet('d',QD.o);$('qchk').click();$('qnx').click();
 mcSet('e',QE.o);$('qchk').click();$('qnx').click();
 $('lt').value='Zu kurz.';$('qchk').click();L.push('Labor zu kurz: '+$('qfb').innerText.slice(0,60));
 $('lt').value='Elektronen werden einzeln auf einen Doppelspalt geschossen. Jedes erzeugt einen Punkt an einer zufälligen Stelle. Erst viele Treffer bilden Interferenzstreifen nach der Wahrscheinlichkeit. Mit Wegmessung verschwinden die Streifen.';$('lt').oninput();L.push('Schreibhilfe: '+$('lterms').innerText);$('qchk').click();
 document.querySelector('input[name=hd][value="-1"]').checked=true;$('oh').value='Würfelt Gott in Brüssel?';
 $('fz').value='Mich hat überrascht, dass der Zufall zum Fundament gehört. Bohr überzeugt mich mehr, weil die Experimente ihm recht geben.';$('qchk').click();return L});
qlog.forEach(x=>console.log(x));
console.log('Nach Quiz:',await p.evaluate(()=>document.querySelector('.screen.on').id+' · '+S.quiz.pts+'/'+S.quiz.max+' · '+$('artTools').innerText.split('\n').slice(0,2).join(' | ')));
console.log('Artikel enthält:',await p.evaluate(()=>{const t=$('paper').innerText;return ['Würfelt Gott in Brüssel?','Mein eigener Satz zum Tag 1','Mein eigener Satz zum Tag 3','Selbst nachgeprüft','λ = h / p','|ψ|² als Antreffwahrscheinlichkeitsdichte','Richtigstellungen','Ausschließungsprinzip'].map(x=>x+':'+t.includes(x)).join(' ')}));
await p.screenshot({path:OUT+'/s_artikel.png',fullPage:true});
await p.emulateMedia({media:'print'});const pdf=await p.pdf({path:OUT+'/artikel.pdf',format:'A4',printBackground:true});
console.log('PDF-Seiten:',(pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)||[]).length);
await p.emulateMedia({media:'screen'});
// Fortsetzen
await p.reload();await p.waitForTimeout(300);
console.log('Fortsetzen-Knopf:',await p.locator('#contBtn').innerText());await p.click('#contBtn');
console.log('Nach Fortsetzen:',await p.evaluate(()=>document.querySelector('.screen.on').id));
console.log('FEHLER:',errs.length?errs:'keine');
await b.close()})().catch(e=>{console.error('ABBRUCH',e);process.exit(1)});
