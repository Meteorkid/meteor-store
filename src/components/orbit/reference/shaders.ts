export type SurfaceRecipe =
  | 'star'
  | 'cratered'
  | 'cloudDeck'
  | 'continents'
  | 'rust'
  | 'bandsStorm'
  | 'softBands'
  | 'smooth'
  | 'streaks';

// Three-dimensional simplex noise after Ashima Arts and Stefan Gustavson (MIT).
// Sampling it on the unit sphere makes every surface seamless.
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p,int octaves){
  float a=0.5;float s=0.0;float n=0.0;
  for(int i=0;i<octaves;i++){
    s+=a*snoise(p);n+=a;
    p=p*2.03+vec3(17.1,9.2,4.7);
    a*=0.5;
  }
  return s/n;
}
`;

const CELLS = /* glsl */ `
vec3 hash33(vec3 p){
  p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));
  return fract(sin(p)*43758.5453123);
}
// Cellular noise shaped into pits with raised rims.
float craters(vec3 p){
  vec3 i=floor(p);vec3 f=fract(p);
  float h=0.0;
  for(int x=-1;x<=1;x++){for(int y=-1;y<=1;y++){for(int z=-1;z<=1;z++){
    vec3 g=vec3(float(x),float(y),float(z));
    vec3 o=hash33(i+g);
    vec3 c=g+o-f;
    float r=0.1+0.34*fract(o.x*7.3+o.z*3.1);
    float d=length(c)/r;
    if(d<1.35){
      float pit=1.0-smoothstep(0.5,1.0,d);
      float rim=smoothstep(0.72,1.0,d)*(1.0-smoothstep(1.0,1.35,d));
      h+=rim*0.55-pit*0.9;
    }
  }}}
  return h;
}
`;

const RECIPES: Record<SurfaceRecipe | 'clouds', string> = {
  star: /* glsl */ `vec3 surface(vec3 p,float lat,float lon){return uC0;}`,

  cratered: /* glsl */ `
  vec3 surface(vec3 p,float lat,float lon){
    float base=fbm(p*2.6+11.0,5)*0.5+0.5;
    vec3 c=mix(uC1,uC0,smoothstep(0.25,0.75,base));
    float h=craters(p*3.5)*0.9+craters(p*8.0+3.0)*0.6+craters(p*18.0+7.0)*0.35;
    c*=clamp(1.0+h*0.42,0.45,1.5);
    c*=0.88+0.24*(fbm(p*30.0,4)*0.5+0.5);
    return c;
  }`,

  cloudDeck: /* glsl */ `
  vec3 surface(vec3 p,float lat,float lon){
    vec3 q=vec3(p.x,p.y*3.4,p.z);
    vec3 w=vec3(fbm(q*1.4+1.3,4),fbm(q*1.4+5.1,4),fbm(q*1.4+9.7,4));
    float v=fbm(q*1.8+w*2.3+uSeed,6)*0.5+0.5;
    float fine=fbm(q*5.0+w*3.0,4)*0.5+0.5;
    vec3 c=mix(uC1,uC0,smoothstep(0.22,0.72,v));
    return c*(0.92+0.16*fine);
  }`,

  continents: /* glsl */ `
  vec3 surface(vec3 p,float lat,float lon){
    float h=fbm(p*1.55+uSeed,6)+0.2*fbm(p*6.2+uSeed*2.0,4);
    float land=smoothstep(0.075,0.095,h);
    float latDeg=abs(lat)*57.2958;
    vec3 ocean=uC0*(0.78+0.5*smoothstep(-0.3,0.08,h));
    float dry=smoothstep(-0.12,0.32,fbm(p*3.4+40.0,5)+0.3*(0.5-abs(p.y)));
    vec3 ground=mix(uC1,uC2,dry);
    ground*=0.86+0.28*(fbm(p*14.0+3.0,4)*0.5+0.5);
    vec3 c=mix(ocean,ground,land);
    float cap=smoothstep(72.0,74.0,latDeg+fbm(p*5.0+70.0,4)*5.0);
    return mix(c,vec3(0.92,0.94,0.96),cap);
  }`,

  rust: /* glsl */ `
  vec3 surface(vec3 p,float lat,float lon){
    float n=fbm(p*2.1+uSeed,6)*0.5+0.5;
    float patches=smoothstep(0.5,0.68,fbm(p*1.7+21.0,5)*0.5+0.5+0.12*(n-0.5));
    vec3 c=mix(uC0,uC1,patches*0.85);
    c*=0.84+0.32*n;
    c*=0.92+0.16*(fbm(p*16.0,4)*0.5+0.5);
    float latDeg=abs(lat)*57.2958;
    float cap=smoothstep(79.0,82.0,latDeg+fbm(p*6.0+70.0,4)*5.0);
    return mix(c,uC2,cap);
  }`,

  bandsStorm: /* glsl */ `
  vec3 surface(vec3 p,float lat,float lon){
    float turb=fbm(p*vec3(5.0,15.0,5.0)+uSeed,5);
    float y=p.y+turb*0.02;
    float b=sin(y*24.0+1.4*sin(y*8.0))*0.5+0.5;
    float b2=snoise(vec3(y*11.0,1.7,uSeed))*0.5+0.5;
    vec3 c=mix(uC0,uC1,smoothstep(0.2,0.8,b));
    c=mix(c,uC2,smoothstep(0.42,0.8,b2)*0.85);
    c=mix(c,uC3,smoothstep(0.55,0.9,b2*b)*0.9);
    c*=0.94+0.12*(fbm(p*vec3(8.0,32.0,8.0)+5.0,4)*0.5+0.5);
    float dl=atan(sin(lon-1.2),cos(lon-1.2));
    float dy=lat+0.38;
    float e=length(vec2(dl/0.25,dy/0.115));
    float ang=atan(dy*2.2,dl);
    c=mix(c,uC0,(1.0-smoothstep(1.0,1.45,e))*0.5);
    float storm=1.0-smoothstep(0.78,1.0,e);
    c=mix(c,uC4*(0.94+0.1*sin(e*13.0+ang*2.0)),storm);
    return c;
  }`,

  softBands: /* glsl */ `
  vec3 surface(vec3 p,float lat,float lon){
    float y=p.y+fbm(p*vec3(4.0,10.0,4.0)+uSeed,4)*0.012;
    float b=sin(y*17.0)*0.5+0.5;
    float b2=snoise(vec3(y*8.0,4.1,uSeed))*0.5+0.5;
    return mix(uC1,uC0,0.55*b+0.45*b2);
  }`,

  smooth: /* glsl */ `
  vec3 surface(vec3 p,float lat,float lon){
    float n=fbm(vec3(p.x,p.y*4.0,p.z)*1.2+uSeed,3)*0.1;
    return mix(uC1,uC0,smoothstep(-0.7,0.7,p.y+n));
  }`,

  streaks: /* glsl */ `
  vec3 surface(vec3 p,float lat,float lon){
    vec3 q=vec3(p.x,p.y*7.5,p.z);
    float s=fbm(q*1.8+uSeed,5)*0.5+0.5;
    float deep=fbm(p*1.6+8.0,4)*0.5+0.5;
    vec3 c=uC0*(0.82+0.32*deep);
    return mix(c,uC1,smoothstep(0.55,0.74,s)*0.42);
  }`,

  clouds: /* glsl */ `
  vec3 surface(vec3 p,float lat,float lon){return vec3(1.0);}
  float cloudAlpha(vec3 p){
    vec3 q=vec3(p.x,p.y*1.5,p.z);
    vec3 w=vec3(fbm(q*1.6+3.1,3),fbm(q*1.6+7.7,3),fbm(q*1.6+12.4,3));
    float v=fbm(q*2.4+w*1.5+uSeed,6);
    return smoothstep(0.1,0.46,v)*0.72;
  }`,
};

export const bakeVertex = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec2 vUv;
void main(){
  vUv=uv;
  gl_Position=vec4(position.xy,0.0,1.0);
  #include <logdepthbuf_vertex>
}`;

export function bakeFragment(recipe: SurfaceRecipe | 'clouds'): string {
  return /* glsl */ `
#include <logdepthbuf_pars_fragment>
precision highp float;
uniform vec3 uC0;uniform vec3 uC1;uniform vec3 uC2;uniform vec3 uC3;uniform vec3 uC4;
uniform float uSeed;
varying vec2 vUv;
const float PI_=3.14159265359;
${NOISE}
${recipe === 'cratered' ? CELLS : ''}
${RECIPES[recipe]}
void main(){
  #include <logdepthbuf_fragment>
  float phi=vUv.x*2.0*PI_;
  float theta=(1.0-vUv.y)*PI_;
  vec3 p=vec3(-cos(phi)*sin(theta),cos(theta),sin(phi)*sin(theta));
  float lat=asin(clamp(p.y,-1.0,1.0));
  float lon=atan(p.z,-p.x);
  ${
    recipe === 'clouds'
      ? 'gl_FragColor=vec4(surface(p,lat,lon),cloudAlpha(p));'
      : 'gl_FragColor=vec4(surface(p,lat,lon),1.0);'
  }
}`;
}

export const sunVertex = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec3 vDir;
varying vec3 vN;
varying vec3 vV;
void main(){
  vDir=position;
  vec4 mv=modelViewMatrix*vec4(position,1.0);
  vN=normalize(normalMatrix*normal);
  vV=normalize(-mv.xyz);
  gl_Position=projectionMatrix*mv;
  #include <logdepthbuf_vertex>
}`;

export const sunFragment = /* glsl */ `
#include <logdepthbuf_pars_fragment>
uniform vec3 uC0;uniform vec3 uC1;uniform vec3 uC2;
uniform float uTime;
varying vec3 vDir;
varying vec3 vN;
varying vec3 vV;
${NOISE}
void main(){
  #include <logdepthbuf_fragment>
  vec3 p=normalize(vDir);
  float t=uTime*0.035;
  float w=fbm(p*2.1+vec3(t,-t*0.6,t*0.4),4);
  float n=fbm(p*4.6+w*1.5+vec3(-t*0.5,t,0.0),5)*0.5+0.5;
  float g=fbm(p*17.0+vec3(t*2.0),3)*0.5+0.5;
  n=n*0.82+g*0.18;
  vec3 c=mix(uC2,uC1,smoothstep(0.22,0.52,n));
  c=mix(c,uC0,smoothstep(0.46,0.72,n));
  float ndv=clamp(dot(normalize(vN),normalize(vV)),0.0,1.0);
  c*=mix(0.62,1.25,pow(ndv,0.5));
  gl_FragColor=vec4(c,1.0);
  #include <colorspace_fragment>
}`;

export const atmosphereVertex = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec3 vN;
varying vec3 vV;
varying vec3 vWorldN;
void main(){
  vec4 mv=modelViewMatrix*vec4(position,1.0);
  vN=normalize(normalMatrix*normal);
  vV=normalize(-mv.xyz);
  vWorldN=normalize(mat3(modelMatrix)*normal);
  gl_Position=projectionMatrix*mv;
  #include <logdepthbuf_vertex>
}`;

export const atmosphereFragment = /* glsl */ `
#include <logdepthbuf_pars_fragment>
uniform vec3 uColor;
uniform float uStrength;
uniform vec3 uSunDir;
varying vec3 vN;
varying vec3 vV;
varying vec3 vWorldN;
void main(){
  #include <logdepthbuf_fragment>
  float ndv=abs(dot(normalize(vN),normalize(vV)));
  // Back faces of a 1.08 radius shell: zero at the silhouette, full at the planet's limb.
  float fresnel=pow(clamp(ndv/0.38,0.0,1.0),3.0);
  float lit=smoothstep(-0.3,0.55,dot(normalize(vWorldN),uSunDir));
  vec3 c=uColor*uStrength*fresnel*(0.04+0.96*lit);
  gl_FragColor=vec4(c,1.0);
  #include <colorspace_fragment>
}`;

export const ringVertex = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec3 vLocal;
varying vec2 vUv;
void main(){
  vLocal=position;
  vUv=uv;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
  #include <logdepthbuf_vertex>
}`;

export const ringFragment = /* glsl */ `
#include <logdepthbuf_pars_fragment>
uniform sampler2D uMap;
uniform vec3 uColor;
uniform vec3 uSunLocal;
varying vec3 vLocal;
varying vec2 vUv;
void main(){
  #include <logdepthbuf_fragment>
  vec4 t=texture2D(uMap,vUv);
  // The planet's shadow falls across the rings. Everything here is in planet radii.
  float along=dot(-vLocal,uSunLocal);
  float off=length(vLocal+uSunLocal*along);
  float shadow=along>0.0?smoothstep(0.97,1.03,off):1.0;
  vec3 c=uColor*(0.1+0.78*shadow)*(0.82+0.18*t.r);
  gl_FragColor=vec4(c,t.a);
  #include <colorspace_fragment>
}`;

export const starVertex = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
attribute float aSize;
attribute float aBright;
uniform float uPixelRatio;
varying float vBright;
void main(){
  vBright=aBright;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
  gl_PointSize=aSize*uPixelRatio;
  #include <logdepthbuf_vertex>
}`;

export const starFragment = /* glsl */ `
#include <logdepthbuf_pars_fragment>
uniform vec3 uTint;
varying float vBright;
void main(){
  #include <logdepthbuf_fragment>
  float d=length(gl_PointCoord-0.5)*2.0;
  float a=1.0-smoothstep(0.35,1.0,d);
  gl_FragColor=vec4(uTint*vBright*a,1.0);
  #include <colorspace_fragment>
}`;
