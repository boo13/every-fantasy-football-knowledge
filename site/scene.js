export function createScene(root, spriteArt, state) {
  const q = s => root.querySelector(s);
  const stage = q('.pd-stadium'), actor = q('.pd-actor'), playerCanvas = q('.pd-player-layer');
  const spots={A:{x:13,z:43,pose:"hips"},B:{x:19,z:29,pose:"ready"},C:{x:25,z:37,pose:"turn"},D:{x:26,z:29,pose:"kneel"},E:{x:20,z:36,pose:"jog"},F:{x:29,z:23,pose:"stretch"},G:{x:39,z:37,pose:"reach"},H:{x:34,z:29,pose:"rest"}};
  const spriteFrames=new Map();
  let selected, mood="confident", passedOver=null, animationFrame=0;
  let fieldKey='', hovered=null, hoverStarted=0, rendered=[], motionTime=0, lastTick=null, lastPaint=0, raf=null;
  let motionEnabled=root.dataset.motion!=='off', inView=true, destroyed=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const joints={
    hips:{head:[13,22,7,14],arms:[[5,10,19,25],[22,27,19,25]],waist:28},
    ready:{head:[14,21,10,16],arms:[[6,9,21,31],[24,29,21,31]],waist:29},
    turn:{head:[15,24,7,14],arms:[[9,13,18,27],[22,27,19,25]],waist:28},
    kneel:{head:[9,16,15,21],arms:[[6,9,25,33]],waist:32},
    jog:{head:[11,19,6,13],arms:[[5,10,18,23],[21,26,18,26]],waist:28},
    stretch:{head:[14,22,17,22],arms:[[5,10,27,42],[24,29,27,35]],waist:31},
    reach:{head:[13,21,9,15],arms:[[4,10,19,24],[23,29,1,15]],waist:28},
    rest:{head:[13,22,7,14],arms:[[9,11,19,27],[23,27,19,30]],waist:28},
    reaction:{head:[11,22,6,15],arms:[[5,10,18,25],[23,27,18,25]],waist:28},
  };
  const contains=(box,x,y)=>x>=box[0]&&x<=box[1]&&y>=box[2]&&y<=box[3];
  function moving() { return !destroyed&&motionEnabled&&!reduced.matches&&!document.hidden&&inView&&stage.clientWidth>0&&stage.clientHeight>0; }
  function idleStep(p) {
    const index=p.slot.charCodeAt(0)-65;
    return [0,1,1,2,2,1,0,3,3,0][Math.floor(((motionTime+index*613)%(4200+index*190))/180)]||0;
  }
  function pixelOffset(p,pose,x,y,step,attention) {
    const joint=joints[pose]||joints.reaction, direction=p.slot.charCodeAt(0)%2?1:-1;
    const head=contains(joint.head,x,y), arm=joint.arms.some(box=>contains(box,x,y));
    if(attention) {
      if(head)return [direction,-1];
      if(arm)return [x<16?1:-1,-Math.min(step,2)];
    } else {
      if(step===1&&head)return [direction,0];
      if(step===2&&y<joint.waist)return [['ready','jog','stretch','kneel'].includes(pose)?0:direction,1];
      if(step===2&&y>=joint.waist&&y<36)return [0,1];
      if(step===3&&arm)return [x<16?1:-1,-1];
    }
    return [0,0];
  }
  function fieldPlayers() { return state.actors().slice(); }
  function selectedSlot() { return fieldPlayers().find(p=>p.id===selected)?.slot || "C"; }
  function camera() {
    const w=Math.round(stage.clientWidth/2),h=Math.round(stage.clientHeight/2),fieldWidth=53.333;
    const focal=.82*Math.max(w,320)/fieldWidth*101.25;
    const center=w<260?spots[selectedSlot()].x:fieldWidth/2;
    const offsetY=w<330?Math.min(0,h-56-h*(-.8+81/(spots[selectedSlot()].z+25))):0;
    return {w,h,fieldWidth,focal,center,offsetY,scale:z=>focal/(z+25),point:(x,z)=>[w/2+(x-center)*focal/(z+25),h*(-.8+81/(z+25))+offsetY]};
  }
  function drawField() {
    const canvas=q('.pd-field');
    const {w,h,fieldWidth,focal,center,offsetY,point:project}=camera();
    if(!w||!h)return;
    const key=[w,h,center,offsetY].join(':');
    if(key===fieldKey)return;
    fieldKey=key;
    canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
    const palette=[[46,123,4],[50,134,4],[57,141,5],[48,130,4],[59,142,5],[42,118,3],[55,136,4],[50,132,4]];
    const pixels=ctx.createImageData(w,h);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++) {
      const z=81/((y-offsetY)/h+.8)-25;
      const worldX=(x-w/2)*(z+25)/focal+center;
      let noise=Math.imul(x+19,374761393)^Math.imul(y+71,668265263);noise=Math.imul(noise^(noise>>>13),1274126177);noise=(noise^(noise>>>16))>>>0;
      let color=palette[noise%palette.length];
      if(worldX<0||worldX>fieldWidth)color=worldX> -1.4&&worldX<fieldWidth+1.4?[115+noise%23,117+noise%23,106+noise%23]:[33,100+noise%17,3];
      const stripe=Math.floor(z/5)%2===0?.98:1.025;
      const i=(y*w+x)*4;pixels.data[i]=color[0]*stripe;pixels.data[i+1]=color[1]*stripe;pixels.data[i+2]=color[2];pixels.data[i+3]=255;
    }
    ctx.putImageData(pixels,0,0);
    function polygon(points,color='#f0efd5') {
      ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,z],i)=>{const p=project(x,z);if(i)ctx.lineTo(...p);else ctx.moveTo(...p);});ctx.closePath();ctx.fill();
    }
    function mark(x,z,width,depth,color) {polygon([[x,z],[x+width,z],[x+width,z+depth],[x,z+depth]],color);}
    mark(-.08,5,.16,90);mark(fieldWidth-.08,5,.16,90);
    for(let yard=10;yard<=85;yard++) {
      if(yard%5===0)mark(0,yard-.06,fieldWidth,.12,'#e1e7c5');
      else for(const x of [.35,23.58,29.75,fieldWidth-.9])mark(x,yard-.035,.55,.07,'#d8e1bf');
    }
    const paintDigits={0:['01110','11011','11011','11011','11011','11011','01110'],2:['01110','11011','00011','00110','01100','11000','11111'],3:['11110','00011','00011','01110','00011','00011','11110'],4:['11011','11011','11011','11111','00011','00011','00011'],5:['11111','11000','11000','11110','00011','00011','11110']};
    for(let yard=20;yard<=80;yard+=10)for(const side of [-1,1]) {
      const label=String(Math.min(yard,100-yard));
      const anchor=side<0?7:fieldWidth-7;
      const world=(u,v)=>[anchor+side*(v-3.5)*.28,yard-side*(u-7)*.25];
      [...label].forEach((digit,k)=>paintDigits[digit].forEach((row,v)=>[...row].forEach((pixel,u)=>{if(pixel==='1'){const a=u+k*9;polygon([world(a,v),world(a+1,v),world(a+1,v+1),world(a,v+1)],'#eff0d8');}})));
      if(yard!==50){const direction=yard<50?-1:1;const z=yard+direction*3.6;polygon([[anchor-.55,z],[anchor+.55,z],[anchor,z+direction*.85]],'#dce5c4');}
    }
    canvas.dataset.markings='20,30,40,50,40,30,20';
  }
  function sprite(p,pose,frame=0,step=0,attention=false) {
    const home=p.slot.charCodeAt(0)%2===1;
    const sequences={confident:[0,1,2,3,2,1,0,0],annoyed:[0,1,2,3,2,1,0,0],picked:[0,1,1,2,2,3,0,0]};
    const poses={hips:'front-hips',jog:'front-jog',reach:'front-reach',turn:'front-turn',ready:'back-ready',kneel:'back-kneel',stretch:'back-set',rest:'back-rest'};
    const name=sequences[pose]?(home?'front-':'back-')+pose+'-'+sequences[pose][frame%8]:poses[pose];
    const frameKey=name+(step?':'+(attention?'hover':'idle')+'-'+step:'');
    const key=p.slot+':'+p.skin+':'+frameKey;
    if(spriteFrames.has(key))return spriteFrames.get(key);
    const art=spriteArt[name],canvas=document.createElement('canvas');
    canvas.width=32;canvas.height=48;canvas.dataset.frameKey=frameKey;
    canvas.coverage=new Uint8Array(32*48);
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
    const colors=home?{O:'#17291f',J:'#17603b',D:'#0c3c2b',L:'#37854e',H:'#dbb333',Q:'#a27b22',G:'#f4d66a',P:'#d7b334',T:'#9d7e26',S:p.skin,K:'#835138',W:'#e8e7ce',B:'#eee7bb',N:'#f2ebcf',C:'#172723'}:{O:'#24362e',J:'#e3e6d7',D:'#9eafa1',L:'#f7f4de',H:'#e1e4db',Q:'#9aa9a1',G:'#f6f3df',P:'#dbe1d1',T:'#92a597',S:p.skin,K:'#835138',W:'#efebd5',B:'#3b458c',N:'#364183',C:'#1d2b26'};
    colors.K=p.skin==='#80543c'?'#52372b':p.skin==='#d8a378'?'#986641':'#835138';
    art.rows.forEach((row,y)=>[...row].forEach((token,x)=>{
      if(token==='.')return;
      const [dx,dy]=step?pixelOffset(p,pose,x,y,step,attention):[0,0],px=x+dx,py=y+dy;
      if(px<0||px>=32||py<0||py>=48)return;
      ctx.fillStyle=colors[token];ctx.fillRect(px,py,1,1);canvas.coverage[py*32+px]=1;
    }));

    spriteFrames.set(key,canvas);return canvas;
  }
  function drawPlayers(frame=0,layout=false) {
    const view=camera(),canvas=playerCanvas,active=moving();
    if(!view.w||!view.h)return;
    if(canvas.width!==view.w||canvas.height!==view.h){canvas.width=view.w;canvas.height=view.h;}
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
    ctx.clearRect(0,0,view.w,view.h);
    const scene=[];rendered=[];
    fieldPlayers().sort((a,b)=>spots[b.slot].z-spots[a.slot].z).forEach(p=>{
      const spot=spots[p.slot],scale=view.scale(spot.z),ground=view.point(spot.x,spot.z);
      const height=Math.round(scale*4.8),width=Math.round(height*32/48),x=Math.round(ground[0]-width/2),y=Math.round(ground[1]-height*45/48);
      const reacting=p.id===selected||p.id===passedOver;
      const protectedReaction=reacting&&frame>0;
      const attention=active&&!protectedReaction&&p.id===hovered;
      const step=active&&!protectedReaction?(attention?Math.min(2,1+Math.floor((motionTime-hoverStarted)/180)):idleStep(p)):0;
      const motion=protectedReaction?'reaction':!active?'still':attention?'hover':step?'idle':'rest';
      const pose=p.id===selected?mood:p.id===passedOver?'annoyed':spot.pose,art=sprite(p,pose,reacting?frame:0,step,attention);
      ctx.fillStyle='#285f12';
      for(let sy=-2;sy<=2;sy++)for(let sx=-Math.round(width*.34);sx<=Math.round(width*.45);sx++)if((sx+sy)%2===0&&Math.abs(sx)/(width*.46)+Math.abs(sy)/4<1.3)ctx.fillRect(Math.round(ground[0]+sx+2),Math.round(ground[1]+sy),1,1);
      ctx.drawImage(art,x,y,width,height);
      scene.push({id:p.id,pose,frameKey:art.dataset.frameKey,worldX:spot.x,depth:spot.z,x,y,width,height,scale,motion,motionStep:step});
      rendered.push({id:p.id,x,y,width,height,art});
      if(layout&&p.id===selected){
        actor.style.cssText='left:'+x*2+'px;top:'+y*2+'px;width:'+width*2+'px;height:'+height*2+'px';
        const bubble=q('#pd-bubble'),bw=bubble.offsetWidth;
        const right=x*2+width*2+14,left=x*2-bw-14;
        const bx=right+bw<stage.clientWidth-12?right:Math.max(12,left);
        const by=Math.min(stage.clientHeight-140,Math.max(48,y*2-18));
        bubble.style.left=bx+'px';bubble.style.top=by+'px';bubble.style.visibility='visible';
        bubble.dataset.side=bx< x*2?'left':'right';
        const plate=q('#pd-nameplate');
        plate.style.bottom='-21px';
        plate.style.left=Math.min(0,stage.clientWidth-12-x*2-plate.offsetWidth)+'px';
        const labelBox=plate.getBoundingClientRect(),hud=q('.pd-scene-detail').getBoundingClientRect();
        if(labelBox.right>hud.left&&labelBox.left<hud.right&&labelBox.bottom>hud.top&&labelBox.top<hud.bottom){
          const left=hud.left-stage.getBoundingClientRect().left-x*2-plate.offsetWidth-8;
          if(x*2+left>=12)plate.style.left=left+'px';
          else {
            const top=Math.max(48,Math.min(y*2-plate.offsetHeight-6,hud.top-stage.getBoundingClientRect().top-plate.offsetHeight-8));
            plate.style.bottom=(y*2+height*2-top-plate.offsetHeight)+'px';
          }
        }
        const finalLabel=plate.getBoundingClientRect(),speech=bubble.getBoundingClientRect();
        if(finalLabel.right>speech.left&&finalLabel.left<speech.right&&finalLabel.bottom>speech.top&&finalLabel.top<speech.bottom)bubble.style.visibility='hidden';
      }
    });
    canvas.dataset.scene=JSON.stringify(scene);canvas.dataset.frame=String(frame);
    canvas.dataset.motion=active?'running':'paused';canvas.dataset.motionFrame=String(active?Math.floor(motionTime/140):0);
    canvas.dataset.hovered=active&&rendered.some(p=>p.id===hovered)?hovered:'';
  }

  function tick(time) {
    raf=null;
    if(!moving()){lastTick=null;return;}
    if(lastTick!==null)motionTime+=Math.min(250,Math.max(0,time-lastTick));
    lastTick=time;
    if(motionTime-lastPaint>=140){lastPaint=motionTime;drawPlayers(animationFrame);}
    raf=requestAnimationFrame(tick);
  }
  function syncScheduler() {
    if(moving()){if(raf===null)raf=requestAnimationFrame(tick);}
    else {if(raf!==null)cancelAnimationFrame(raf);raf=null;lastTick=null;}
  }
  function draw(frame=animationFrame) {
    if(destroyed)return;
    selected=state.selected();animationFrame=moving()?frame:0;
    if(!fieldPlayers().some(p=>p.id===hovered))hovered=null;
    drawField();drawPlayers(animationFrame,true);syncScheduler();
  }
  function hover(id) {
    if(destroyed)return;
    const next=moving()&&rendered.some(p=>p.id===id)?id:null;
    if(next===hovered)return;
    hovered=next;hoverStarted=motionTime;drawPlayers(animationFrame);
  }
  function pointerMove(event) {
    if(event.pointerType==='touch')return;
    const bounds=playerCanvas.getBoundingClientRect();
    const x=(event.clientX-bounds.left)*playerCanvas.width/bounds.width,y=(event.clientY-bounds.top)*playerCanvas.height/bounds.height;
    const hit=[...rendered].reverse().find(p=>{
      const dx=Math.floor(x-p.x),dy=Math.floor(y-p.y);
      if(dx<0||dx>=p.width||dy<0||dy>=p.height)return false;
      const sx=Math.floor((dx+.5)*32/p.width),sy=Math.floor((dy+.5)*48/p.height);
      return p.art.coverage[sy*32+sx];
    });
    hover(hit?.id||null);
  }
  function pointerLeave() { hover(null); }
  function visibilityChanged() {
    if(destroyed)return;
    if(!moving()){hovered=null;animationFrame=0;}
    drawPlayers(animationFrame);syncScheduler();
  }
  const resizeObserver=new ResizeObserver(()=>draw());resizeObserver.observe(stage);
  const intersectionObserver=new IntersectionObserver(entries=>{inView=entries.some(entry=>entry.isIntersecting);visibilityChanged();});
  intersectionObserver.observe(stage);
  document.addEventListener('visibilitychange',visibilityChanged);
  reduced.addEventListener('change',visibilityChanged);
  playerCanvas.addEventListener('pointermove',pointerMove);
  playerCanvas.addEventListener('pointerleave',pointerLeave);
  document.fonts.ready.then(()=>draw());
  return {
    draw,
    react(next, other=null) { if(destroyed)return;mood=next;passedOver=other;draw(0); },
    hover,
    setMotion(enabled) { if(destroyed)return;motionEnabled=Boolean(enabled);visibilityChanged(); },
    destroy() {
      if(destroyed)return;
      destroyed=true;syncScheduler();resizeObserver.disconnect();intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange',visibilityChanged);reduced.removeEventListener('change',visibilityChanged);
      playerCanvas.removeEventListener('pointermove',pointerMove);playerCanvas.removeEventListener('pointerleave',pointerLeave);
      spriteFrames.clear();rendered=[];
    },
  };
}
