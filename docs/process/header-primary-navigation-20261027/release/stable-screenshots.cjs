const {chromium,expect}=require('/Users/meteor/github/meteor-store/node_modules/@playwright/test');
const fs=require('fs');
const {BASE,RELEASE,createReadOnlyContext,ready,assertHealth}=require('./production-observer.cjs');
const OUT='/tmp/meteor-header-production-20261027';
if(!process.argv.includes('--run')){console.log('Prepared screenshot-only run');process.exit(0);}
const state={base:BASE,release:RELEASE,startedAt:new Date().toISOString(),purpose:'Two stable expanded-menu screenshots only; no test rerun',events:[],screenshots:[]};
async function settle(page,panelId,arrowId){
 await page.locator(panelId).waitFor({state:'visible'});
 await page.evaluate(async()=>{
  await new Promise(requestAnimationFrame);
  const animations=document.getAnimations().filter(animation=>animation.effect&&Number.isFinite(animation.effect.getTiming().iterations));
  await Promise.allSettled(animations.map(animation=>animation.finished));
 });
 await expect.poll(()=>page.locator(panelId).evaluate(element=>Number(getComputedStyle(element).opacity))).toBe(1);
 return page.locator(arrowId+' svg').evaluate(element=>({transform:getComputedStyle(element).transform,transition:getComputedStyle(element).transition,activeAnimations:element.getAnimations().filter(animation=>animation.playState==='running').length}));
}
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});state.browser=browser.version();try{
 for(const config of [{label:'stable-desktop-en-1024',locale:'en',options:{viewport:{width:1024,height:900}},mobile:false},{label:'stable-mobile-zh-375',locale:'zh',options:{viewport:{width:375,height:900},hasTouch:true,isMobile:true},mobile:true}]){
  const context=await createReadOnlyContext(browser,config.label,config.options,state);
  const page=await context.newPage();page.setDefaultTimeout(15000);
  try{await ready(page,config.locale,state,config.label);let settled;
   if(config.mobile){await page.locator('[aria-controls="header-mobile-panel"]').tap();await page.locator('[aria-controls="header-mobile-products"]').tap();settled=await settle(page,'#header-mobile-products','[aria-controls="header-mobile-products"]');}
   else{await page.locator('#header-overview-products').hover();await expect(page.locator('#header-panel-products')).toBeVisible();settled=await settle(page,'#header-panel-products','#header-trigger-products');}
   expect(settled.activeAnimations).toBe(0);assertHealth(state,config.label);
   const path=OUT+'/'+config.label+'.png';await page.screenshot({path});state.screenshots.push({label:config.label,path,settled});console.log(config.label,'saved');
  }finally{await context.close();}
 }
}finally{await browser.close();state.finishedAt=new Date().toISOString();state.browserClosed=true;fs.writeFileSync(OUT+'/stable-screenshots-results.json',JSON.stringify(state,null,2));}})().catch(error=>{state.fatal=error.message;fs.writeFileSync(OUT+'/stable-screenshots-results.json',JSON.stringify(state,null,2));console.error(error);process.exitCode=1;});
