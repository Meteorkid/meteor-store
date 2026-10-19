import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {NativeScene} from '../src/components/product-covers/scenes/NativeScenes';
import sharp from 'sharp';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
async function main(){
const root=process.cwd();
const out=process.argv[2] ?? '/tmp/meteor-native-motion-render';mkdirSync(out,{recursive:true});
const ids=['xisland','xnook','statux','claude-phone-control','omnicrawl'];
const refs=new Map<string,string>();
for(const id of ids){
 const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-crf','19','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',`${out}/${id}.mp4`]);let error='';ff.stderr.on('data',d=>error+=d);const finished=once(ff,'close');
 for(let frame=0;frame<144;frame++){
  let svg=renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 800 500"><NativeScene productId={id} time={frame/30}/></svg>);
  svg=svg.replace(/href="(\/products\/[^\"]+)"/g,(_,p)=>{if(!refs.has(p))refs.set(p,'data:image/png;base64,'+readFileSync(root+'/public'+p).toString('base64'));return `href="${refs.get(p)}"`});
  const png=await sharp(Buffer.from(svg)).png().toBuffer();
  if([0,30,72,110,143].includes(frame))writeFileSync(`${out}/${id}-${frame}.png`,png);
  if(!ff.stdin.write(png))await once(ff.stdin,'drain');
 }
 ff.stdin.end();const [code]=await finished;if(code!==0)throw new Error(error);console.log(id,'complete');
}

}
main().catch(e=>{console.error(e);process.exitCode=1});
