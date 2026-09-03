async(page)=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.reload(); await page.locator('[data-ready="true"]').waitFor(); await page.evaluate(async()=>await document.fonts.ready);
 const cases=[];
 for(const width of [1280,768,620,390,320]){
  await page.setViewportSize({width,height:1100});await page.waitForTimeout(80);
  for(let i=0;i<8;i++){
   await page.locator('#pd-board button').nth(i).click();
   const problems=await page.locator('#pixel-draft-room').evaluate(el=>{
    const field=el.querySelector('.pd-stadium').getBoundingClientRect(),hud=el.querySelector('.pd-scene-detail').getBoundingClientRect();
    return ['.pd-actor','.pd-nameplate','.pd-bubble'].flatMap(selector=>{
     const element=el.querySelector(selector);
     if(getComputedStyle(element).visibility==='hidden')return [];
     const b=element.getBoundingClientRect();
     const fits=b.left>=field.left-1&&b.right<=field.right+1&&b.top>=field.top-1&&b.bottom<=field.bottom+1;
     const speech=el.querySelector('.pd-bubble'),box=speech.getBoundingClientRect();
     const speechCollision=selector==='.pd-nameplate'&&getComputedStyle(speech).visibility!=='hidden'&&b.right>box.left&&b.left<box.right&&b.bottom>box.top&&b.top<box.bottom;
     const overlap=(b.right>hud.left&&b.left<hud.right&&b.bottom>hud.top&&b.top<hud.bottom)||speechCollision;
     return fits&&!overlap?[]:[{selector,fits,overlap}];
    });
   });
   cases.push({width,player:i,problems});
  }
 }
 const failures=cases.filter(c=>c.problems.length);
 if(failures.length)throw new Error(JSON.stringify(failures));
 return {cases:cases.length,failures};
}
