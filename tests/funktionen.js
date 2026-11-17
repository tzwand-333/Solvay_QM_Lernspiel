const {chromium}=require('playwright');
const path=require('path'),os=require('os'),fs=require('fs');
const FILE='file://'+path.resolve(__dirname,'../Solvay-1927-Lernspiel-2D.html');
const OUT=fs.mkdtempSync(path.join(os.tmpdir(),'bruessel1927-'));const HELP=path.join(__dirname,'helpers.js');console.log('Ausgabe:',OUT);
(async()=>{const b=await chromium.launch();const errs=[];
const mk=async(ctx)=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});await p.goto(FILE);await p.addScriptTag({path:HELP});return p};
// 1) Spieler A spielt etwas, sichert Datei
let ctx=await b.newContext({viewport:{width:1180,height:820},acceptDownloads:true});let p=await mk(ctx);
await p.fill('#nameIn','Anna Ärger');await p.click('#goBtn');await p.waitForTimeout(200);
await p.keyboard.press('Escape');console.log('Escape schließt Intro (öffnet Aufträge):',await p.evaluate(()=>$('panel').innerText.slice(0,20)));
await p.keyboard.press('Escape');console.log('Escape schließt Aufträge:',await p.evaluate(()=>!$('ov').classList.contains('on')));
await p.evaluate(()=>{__ask('lorentz','l1');__ask('debroglie','d1');notebook()});await p.keyboard.press('Escape');console.log('Escape schließt Notizbuch:',await p.evaluate(()=>!$('ov').classList.contains('on')));
await p.evaluate(()=>talk('lorentz'));await p.keyboard.press('Escape');console.log('Escape beendet Gespräch:',await p.evaluate(()=>!$('ov').classList.contains('on')));
const [dl]=await Promise.all([p.waitForEvent('download'),p.click('#svBtn')]);const fpath=OUT+'/'+dl.suggestedFilename();await dl.saveAs(fpath);
console.log('Datei:',dl.suggestedFilename(),'| Meldung:',await p.evaluate(()=>$('panel').innerText.slice(0,60)));
await p.screenshot({path:OUT+'/n_save.png'});
// 2) gleiches Gerät, Spieler B will neu beginnen -> Rückfrage
await p.reload();await p.addScriptTag({path:HELP});
await p.fill('#nameIn','Ben');await p.click('#goBtn');await p.waitForTimeout(100);
console.log('Rückfrage:',await p.evaluate(()=>$('ov').classList.contains('on')&&$('panel').innerText.slice(0,120).replace(/\n/g,' ')));
await p.screenshot({path:OUT+'/n_guard.png'});
await p.keyboard.press('Escape');console.log('Abbrechen lässt Stand:',await p.evaluate(()=>load().name));
await p.click('#goBtn');await p.click('#gy');await p.waitForTimeout(100);console.log('Nach Ersetzen:',await p.evaluate(()=>load().name+' '+S.notes.length));
// 3) anderes Gerät (neuer Kontext): Datei laden
const ctx2=await b.newContext({viewport:{width:1024,height:768}});const p2=await mk(ctx2);
await p2.setInputFiles('#fileIn',fpath);await p2.waitForTimeout(300);
console.log('Geladen auf anderem Gerät:',await p2.evaluate(()=>document.querySelector('.screen.on').id+' '+S.name+' Notizen '+S.notes.join(',')));
// falsche Datei
await p2.reload();fs.writeFileSync(OUT+'/kaputt.json','{"x":1}');await p2.setInputFiles('#fileIn',OUT+'/kaputt.json');await p2.waitForTimeout(200);
console.log('Falsche Datei:',await p2.evaluate(()=>$('panel').innerText.slice(0,40)));
// 4) Alter Spielstand im Quiz (alte Fassung)
await p2.evaluate(()=>{const o=fresh();delete o.tele;delete o.teach;o.name='Alt';o.phase_='quiz';o.quiz={step:4,pts:10,max:15,head:0,fazit:''};localStorage.setItem('solvay1927v2',JSON.stringify(o))});
await p2.reload();await p2.click('#contBtn');console.log('Alter Quiz-Stand:',await p2.evaluate(()=>document.querySelector('.screen.on').id+' Schritt '+(S.quiz.step+1)+' tele '+JSON.stringify(S.tele)));
await p2.evaluate(()=>{const o=fresh();delete o.tele;o.name='Alt2';o.phase_='art';o.notes=['N1','N2'];o.quiz={step:5,pts:10,max:15,head:1,fazit:'Altes Fazit aus der vorigen Fassung.'};localStorage.setItem('solvay1927v2',JSON.stringify(o))});
await p2.reload();await p2.click('#contBtn');console.log('Alter Artikel-Stand:',await p2.evaluate(()=>document.querySelector('.screen.on').id+' | '+$('paper').querySelector('h2').innerText));
// 5) Lehrkraft-Modus
const ctx3=await b.newContext({viewport:{width:1180,height:820}});const p3=await mk(ctx3);
await p3.fill('#nameIn','Lehrkraft');await p3.click('#goBtn');await p3.waitForTimeout(100);await p3.evaluate(()=>close());
console.log('🎓 sichtbar:',await p3.isVisible('#lkBtn'));await p3.click('#lkBtn');await p3.screenshot({path:OUT+'/n_teach.png'});
await p3.click('[data-j="3,0"]');console.log('Sprung Tag 3:',await p3.evaluate(()=>S.day+'/'+S.phase+' '+S.loc+' offen: '+missing().map(t=>t.t).join('|')+' Telegramme '+Object.keys(S.tele)));
await p3.click('#lkBtn');await p3.click('#tkDone');console.log('Heute erledigt:',await p3.evaluate(()=>missing().length));
await p3.click('#tkEve');await p3.evaluate(()=>{let g=0;while($('nx')&&g++<30)$('nx').click()});await p3.click('#tfill');await p3.screenshot({path:OUT+'/n_tele.png'});await p3.click('#tsend');
console.log('Nach Telegramm Tag 3:',await p3.evaluate(()=>document.querySelector('.screen.on').id));
await p3.evaluate(()=>{let g=0;while(document.querySelector('.screen.on').id==='epi'&&g++<10)$('en').click()});
for(let i=0;i<7;i++){const st=await p3.evaluate(()=>Q.step);await p3.click('#qfill');if(i===2)await p3.screenshot({path:OUT+'/n_quiz.png',fullPage:true});await p3.click('#qchk');if(await p3.isVisible('#qnx'))await p3.click('#qnx');}
console.log('Lehrkraft-Quiz:',await p3.evaluate(()=>document.querySelector('.screen.on').id+' '+S.quiz.pts+'/'+S.quiz.max));
await p3.screenshot({path:OUT+'/n_art.png',fullPage:true});
// Lehrkraft direkt zum Artikel
await p3.evaluate(()=>{S.phase_='game';startGame();close();teacher();$('tkArt').click()});console.log('Beispielartikel:',await p3.evaluate(()=>document.querySelector('.screen.on').id));
// 6) Experiment 3 Ansicht
await p3.evaluate(()=>{S.phase_='game';startGame();close();addFlag('pred3done');exp3()});await p3.screenshot({path:OUT+'/n_exp3.png'});
await p3.evaluate(()=>{$('xw').checked=true;$('xw').onchange();$('x200').click();$('x200').click()});await p3.screenshot({path:OUT+'/n_exp3w.png'});
console.log('FEHLER:',errs.length?errs:'keine');await b.close()})().catch(e=>{console.error('ABBRUCH',e);process.exit(1)});
