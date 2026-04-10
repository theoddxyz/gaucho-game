(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Lh="183",w0=0,Uu=1,E0=2,ua=1,A0=2,Dr=3,Ci=0,mn=1,Dn=2,Ai=0,Ys=1,pl=2,Fu=3,Ou=4,R0=5,os=100,C0=101,P0=102,I0=103,L0=104,D0=200,N0=201,U0=202,F0=203,ml=204,gl=205,O0=206,z0=207,B0=208,k0=209,V0=210,H0=211,G0=212,W0=213,X0=214,_l=0,xl=1,vl=2,Zs=3,yl=4,Ml=5,bl=6,Sl=7,ap=0,q0=1,Y0=2,ri=0,cp=1,lp=2,hp=3,up=4,dp=5,fp=6,pp=7,zu="attached",K0="detached",mp=300,ds=301,Js=302,ac=303,cc=304,ja=306,fs=1e3,ni=1001,Ua=1002,Ht=1003,gp=1004,Nr=1005,Gt=1006,da=1007,Ti=1008,wn=1009,_p=1010,xp=1011,Kr=1012,Dh=1013,ci=1014,Fn=1015,Pi=1016,Nh=1017,Uh=1018,jr=1020,vp=35902,yp=35899,Mp=1021,bp=1022,On=1023,Ii=1026,ls=1027,Fh=1028,Oh=1029,Qs=1030,zh=1031,Bh=1033,fa=33776,pa=33777,ma=33778,ga=33779,Tl=35840,wl=35841,El=35842,Al=35843,Rl=36196,Cl=37492,Pl=37496,Il=37488,Ll=37489,Dl=37490,Nl=37491,Ul=37808,Fl=37809,Ol=37810,zl=37811,Bl=37812,kl=37813,Vl=37814,Hl=37815,Gl=37816,Wl=37817,Xl=37818,ql=37819,Yl=37820,Kl=37821,jl=36492,$l=36494,Zl=36495,Jl=36283,Ql=36284,eh=36285,th=36286,$r=2300,Zr=2301,lc=2302,Bu=2303,ku=2400,Vu=2401,Hu=2402,j0=2500,$0=0,Sp=1,nh=2,Z0=3200,Tp=0,J0=1,Gi="",en="srgb",dn="srgb-linear",Fa="linear",dt="srgb",xs=7680,Gu=519,Q0=512,eg=513,tg=514,kh=515,ng=516,ig=517,Vh=518,sg=519,ih=35044,Wu="300 es",ii=2e3,Jr=2001;function rg(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function og(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Qr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function ag(){const s=Qr("canvas");return s.style.display="block",s}const Xu={};function Oa(...s){const e="THREE."+s.shift();console.log(e,...s)}function wp(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Ee(...s){s=wp(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function De(...s){s=wp(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function za(...s){const e=s.join(" ");e in Xu||(Xu[e]=!0,Ee(...s))}function cg(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const lg={[_l]:xl,[vl]:bl,[yl]:Sl,[Zs]:Ml,[xl]:_l,[bl]:vl,[Sl]:yl,[Ml]:Zs};class or{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let qu=1234567;const Br=Math.PI/180,er=180/Math.PI;function Kn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(sn[s&255]+sn[s>>8&255]+sn[s>>16&255]+sn[s>>24&255]+"-"+sn[e&255]+sn[e>>8&255]+"-"+sn[e>>16&15|64]+sn[e>>24&255]+"-"+sn[t&63|128]+sn[t>>8&255]+"-"+sn[t>>16&255]+sn[t>>24&255]+sn[n&255]+sn[n>>8&255]+sn[n>>16&255]+sn[n>>24&255]).toLowerCase()}function Je(s,e,t){return Math.max(e,Math.min(t,s))}function Hh(s,e){return(s%e+e)%e}function hg(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function ug(s,e,t){return s!==e?(t-s)/(e-s):0}function kr(s,e,t){return(1-t)*s+t*e}function dg(s,e,t,n){return kr(s,e,1-Math.exp(-t*n))}function fg(s,e=1){return e-Math.abs(Hh(s,e*2)-e)}function pg(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function mg(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function gg(s,e){return s+Math.floor(Math.random()*(e-s+1))}function _g(s,e){return s+Math.random()*(e-s)}function xg(s){return s*(.5-Math.random())}function vg(s){s!==void 0&&(qu=s);let e=qu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function yg(s){return s*Br}function Mg(s){return s*er}function bg(s){return(s&s-1)===0&&s!==0}function Sg(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Tg(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function wg(s,e,t,n,i){const r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":s.set(a*h,c*u,c*d,a*l);break;case"YZY":s.set(c*d,a*h,c*u,a*l);break;case"ZXZ":s.set(c*u,c*d,a*h,a*l);break;case"XZX":s.set(a*h,c*g,c*f,a*l);break;case"YXY":s.set(c*f,a*h,c*g,a*l);break;case"ZYZ":s.set(c*g,c*f,a*h,a*l);break;default:Ee("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function qn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ft(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Eg={DEG2RAD:Br,RAD2DEG:er,generateUUID:Kn,clamp:Je,euclideanModulo:Hh,mapLinear:hg,inverseLerp:ug,lerp:kr,damp:dg,pingpong:fg,smoothstep:pg,smootherstep:mg,randInt:gg,randFloat:_g,randFloatSpread:xg,seededRandom:vg,degToRad:yg,radToDeg:Mg,isPowerOfTwo:bg,ceilPowerOfTwo:Sg,floorPowerOfTwo:Tg,setQuaternionFromProperEuler:wg,normalize:ft,denormalize:qn};class Le{constructor(e=0,t=0){Le.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class xn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3],d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(u!==_||c!==d||l!==f||h!==g){let p=c*d+l*f+h*g+u*_;p<0&&(d=-d,f=-f,g=-g,_=-_,p=-p);let m=1-a;if(p<.9995){const x=Math.acos(p),y=Math.sin(x);m=Math.sin(m*x)/y,a=Math.sin(a*x)/y,c=c*m+d*a,l=l*m+f*a,h=h*m+g*a,u=u*m+_*a}else{c=c*m+d*a,l=l*m+f*a,h=h*m+g*a,u=u*m+_*a;const x=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=x,l*=x,h*=x,u*=x}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*u+c*f-l*d,e[t+1]=c*g+h*d+l*u-a*f,e[t+2]=l*g+h*f+a*d-c*u,e[t+3]=h*g-a*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),u=a(r/2),d=c(n/2),f=c(i/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:Ee("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-i)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+l)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Je(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+i*l-r*c,this._y=i*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,i=-i,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){const l=Math.acos(a),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class A{constructor(e=0,t=0,n=0){A.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Yu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Yu.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*i-a*n),h=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=i+c*u+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return hc.copy(this).projectOnVector(e),this.sub(hc)}reflect(e){return this.sub(hc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const hc=new A,Yu=new xn;class Xe{constructor(e,t,n,i,r,o,a,c,l){Xe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,c,l)}set(e,t,n,i,r,o,a,c,l){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=i[0],p=i[3],m=i[6],x=i[1],y=i[4],b=i[7],w=i[2],E=i[5],C=i[8];return r[0]=o*_+a*x+c*w,r[3]=o*p+a*y+c*E,r[6]=o*m+a*b+c*C,r[1]=l*_+h*x+u*w,r[4]=l*p+h*y+u*E,r[7]=l*m+h*b+u*C,r[2]=d*_+f*x+g*w,r[5]=d*p+f*y+g*E,r[8]=d*m+f*b+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+i*r*l-i*o*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,g=t*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(i*l-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=d*_,e[4]=(h*t-i*c)*_,e[5]=(i*r-a*t)*_,e[6]=f*_,e[7]=(n*c-l*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-i*l,i*c,-i*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(uc.makeScale(e,t)),this}rotate(e){return this.premultiply(uc.makeRotation(-e)),this}translate(e,t){return this.premultiply(uc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const uc=new Xe,Ku=new Xe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ju=new Xe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ag(){const s={enabled:!0,workingColorSpace:dn,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===dt&&(i.r=Ri(i.r),i.g=Ri(i.g),i.b=Ri(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===dt&&(i.r=Ks(i.r),i.g=Ks(i.g),i.b=Ks(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Gi?Fa:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return za("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return za("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[dn]:{primaries:e,whitePoint:n,transfer:Fa,toXYZ:Ku,fromXYZ:ju,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:en},outputColorSpaceConfig:{drawingBufferColorSpace:en}},[en]:{primaries:e,whitePoint:n,transfer:dt,toXYZ:Ku,fromXYZ:ju,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:en}}}),s}const it=Ag();function Ri(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ks(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let vs;class Rg{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{vs===void 0&&(vs=Qr("canvas")),vs.width=e.width,vs.height=e.height;const i=vs.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=vs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Qr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Ri(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ri(t[n]/255)*255):t[n]=Ri(t[n]);return{data:t,width:e.width,height:e.height}}else return Ee("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Cg=0;class Gh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Cg++}),this.uuid=Kn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(dc(i[o].image)):r.push(dc(i[o]))}else r=dc(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function dc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Rg.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Ee("Texture: Unable to serialize Texture."),{})}let Pg=0;const fc=new A;class Wt extends or{constructor(e=Wt.DEFAULT_IMAGE,t=Wt.DEFAULT_MAPPING,n=ni,i=ni,r=Gt,o=Ti,a=On,c=wn,l=Wt.DEFAULT_ANISOTROPY,h=Gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Pg++}),this.uuid=Kn(),this.name="",this.source=new Gh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Le(0,0),this.repeat=new Le(1,1),this.center=new Le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(fc).x}get height(){return this.source.getSize(fc).y}get depth(){return this.source.getSize(fc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ee(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ee(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==mp)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fs:e.x=e.x-Math.floor(e.x);break;case ni:e.x=e.x<0?0:1;break;case Ua:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case fs:e.y=e.y-Math.floor(e.y);break;case ni:e.y=e.y<0?0:1;break;case Ua:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=mp;Wt.DEFAULT_ANISOTROPY=1;class Tt{constructor(e=0,t=0,n=0,i=1){Tt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],_=c[2],p=c[6],m=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+p)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(l+1)/2,b=(f+1)/2,w=(m+1)/2,E=(h+d)/4,C=(u+_)/4,v=(g+p)/4;return y>b&&y>w?y<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(y),i=E/n,r=C/n):b>w?b<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(b),n=E/i,r=v/i):w<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(w),n=C/r,i=v/r),this.set(n,i,r,t),this}let x=Math.sqrt((p-g)*(p-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(p-g)/x,this.y=(u-_)/x,this.z=(d-h)/x,this.w=Math.acos((l+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this.w=Je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this.w=Je(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ig extends or{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Tt(0,0,e,t),this.scissorTest=!1,this.viewport=new Tt(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},r=new Wt(i),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Gt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Gh(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class oi extends Ig{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ep extends Wt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Lg extends Wt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ze{constructor(e,t,n,i,r,o,a,c,l,h,u,d,f,g,_,p){ze.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,c,l,h,u,d,f,g,_,p)}set(e,t,n,i,r,o,a,c,l,h,u,d,f,g,_,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=o,m[9]=a,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ze().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,n=e.elements,i=1/ys.setFromMatrixColumn(e,0).length(),r=1/ys.setFromMatrixColumn(e,1).length(),o=1/ys.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=o*h,f=o*u,g=a*h,_=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+g*l,t[5]=d-_*l,t[9]=-a*c,t[2]=_-d*l,t[6]=g+f*l,t[10]=o*c}else if(e.order==="YXZ"){const d=c*h,f=c*u,g=l*h,_=l*u;t[0]=d+_*a,t[4]=g*a-f,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=_+d*a,t[10]=o*c}else if(e.order==="ZXY"){const d=c*h,f=c*u,g=l*h,_=l*u;t[0]=d-_*a,t[4]=-o*u,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const d=o*h,f=o*u,g=a*h,_=a*u;t[0]=c*h,t[4]=g*l-f,t[8]=d*l+_,t[1]=c*u,t[5]=_*l+d,t[9]=f*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const d=o*c,f=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=_-d*u,t[8]=g*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=f*u+g,t[10]=d-_*u}else if(e.order==="XZY"){const d=o*c,f=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+_,t[5]=o*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Dg,e,Ng)}lookAt(e,t,n){const i=this.elements;return Mn.subVectors(e,t),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),Ni.crossVectors(n,Mn),Ni.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),Ni.crossVectors(n,Mn)),Ni.normalize(),uo.crossVectors(Mn,Ni),i[0]=Ni.x,i[4]=uo.x,i[8]=Mn.x,i[1]=Ni.y,i[5]=uo.y,i[9]=Mn.y,i[2]=Ni.z,i[6]=uo.z,i[10]=Mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],p=n[10],m=n[14],x=n[3],y=n[7],b=n[11],w=n[15],E=i[0],C=i[4],v=i[8],T=i[12],F=i[1],P=i[5],U=i[9],z=i[13],G=i[2],B=i[6],H=i[10],O=i[14],Q=i[3],$=i[7],de=i[11],_e=i[15];return r[0]=o*E+a*F+c*G+l*Q,r[4]=o*C+a*P+c*B+l*$,r[8]=o*v+a*U+c*H+l*de,r[12]=o*T+a*z+c*O+l*_e,r[1]=h*E+u*F+d*G+f*Q,r[5]=h*C+u*P+d*B+f*$,r[9]=h*v+u*U+d*H+f*de,r[13]=h*T+u*z+d*O+f*_e,r[2]=g*E+_*F+p*G+m*Q,r[6]=g*C+_*P+p*B+m*$,r[10]=g*v+_*U+p*H+m*de,r[14]=g*T+_*z+p*O+m*_e,r[3]=x*E+y*F+b*G+w*Q,r[7]=x*C+y*P+b*B+w*$,r[11]=x*v+y*U+b*H+w*de,r[15]=x*T+y*z+b*O+w*_e,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],_=e[7],p=e[11],m=e[15],x=c*f-l*d,y=a*f-l*u,b=a*d-c*u,w=o*f-l*h,E=o*d-c*h,C=o*u-a*h;return t*(_*x-p*y+m*b)-n*(g*x-p*w+m*E)+i*(g*y-_*w+m*C)-r*(g*b-_*E+p*C)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],_=e[13],p=e[14],m=e[15],x=t*a-n*o,y=t*c-i*o,b=t*l-r*o,w=n*c-i*a,E=n*l-r*a,C=i*l-r*c,v=h*_-u*g,T=h*p-d*g,F=h*m-f*g,P=u*p-d*_,U=u*m-f*_,z=d*m-f*p,G=x*z-y*U+b*P+w*F-E*T+C*v;if(G===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/G;return e[0]=(a*z-c*U+l*P)*B,e[1]=(i*U-n*z-r*P)*B,e[2]=(_*C-p*E+m*w)*B,e[3]=(d*E-u*C-f*w)*B,e[4]=(c*F-o*z-l*T)*B,e[5]=(t*z-i*F+r*T)*B,e[6]=(p*b-g*C-m*y)*B,e[7]=(h*C-d*b+f*y)*B,e[8]=(o*U-a*F+l*v)*B,e[9]=(n*F-t*U-r*v)*B,e[10]=(g*E-_*b+m*x)*B,e[11]=(u*b-h*E-f*x)*B,e[12]=(a*T-o*P-c*v)*B,e[13]=(t*P-n*T+i*v)*B,e[14]=(_*y-g*w-p*x)*B,e[15]=(h*w-u*y+d*x)*B,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,g=r*u,_=o*h,p=o*u,m=a*u,x=c*l,y=c*h,b=c*u,w=n.x,E=n.y,C=n.z;return i[0]=(1-(_+m))*w,i[1]=(f+b)*w,i[2]=(g-y)*w,i[3]=0,i[4]=(f-b)*E,i[5]=(1-(d+m))*E,i[6]=(p+x)*E,i[7]=0,i[8]=(g+y)*C,i[9]=(p-x)*C,i[10]=(1-(d+_))*C,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const r=this.determinant();if(r===0)return n.set(1,1,1),t.identity(),this;let o=ys.set(i[0],i[1],i[2]).length();const a=ys.set(i[4],i[5],i[6]).length(),c=ys.set(i[8],i[9],i[10]).length();r<0&&(o=-o),Vn.copy(this);const l=1/o,h=1/a,u=1/c;return Vn.elements[0]*=l,Vn.elements[1]*=l,Vn.elements[2]*=l,Vn.elements[4]*=h,Vn.elements[5]*=h,Vn.elements[6]*=h,Vn.elements[8]*=u,Vn.elements[9]*=u,Vn.elements[10]*=u,t.setFromRotationMatrix(Vn),n.x=o,n.y=a,n.z=c,this}makePerspective(e,t,n,i,r,o,a=ii,c=!1){const l=this.elements,h=2*r/(t-e),u=2*r/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i);let g,_;if(c)g=r/(o-r),_=o*r/(o-r);else if(a===ii)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Jr)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=ii,c=!1){const l=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i);let g,_;if(c)g=1/(o-r),_=o/(o-r);else if(a===ii)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===Jr)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ys=new A,Vn=new ze,Dg=new A(0,0,0),Ng=new A(1,1,1),Ni=new A,uo=new A,Mn=new A,$u=new ze,Zu=new xn;class Bn{constructor(e=0,t=0,n=0,i=Bn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(Je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Je(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Je(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ee("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return $u.makeRotationFromQuaternion(e),this.setFromRotationMatrix($u,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Zu.setFromEuler(this),this.setFromQuaternion(Zu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Bn.DEFAULT_ORDER="XYZ";class Wh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Ug=0;const Ju=new A,Ms=new xn,_i=new ze,fo=new A,mr=new A,Fg=new A,Og=new xn,Qu=new A(1,0,0),ed=new A(0,1,0),td=new A(0,0,1),nd={type:"added"},zg={type:"removed"},bs={type:"childadded",child:null},pc={type:"childremoved",child:null};class At extends or{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ug++}),this.uuid=Kn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=At.DEFAULT_UP.clone();const e=new A,t=new Bn,n=new xn,i=new A(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ze},normalMatrix:{value:new Xe}}),this.matrix=new ze,this.matrixWorld=new ze,this.matrixAutoUpdate=At.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=At.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ms.setFromAxisAngle(e,t),this.quaternion.multiply(Ms),this}rotateOnWorldAxis(e,t){return Ms.setFromAxisAngle(e,t),this.quaternion.premultiply(Ms),this}rotateX(e){return this.rotateOnAxis(Qu,e)}rotateY(e){return this.rotateOnAxis(ed,e)}rotateZ(e){return this.rotateOnAxis(td,e)}translateOnAxis(e,t){return Ju.copy(e).applyQuaternion(this.quaternion),this.position.add(Ju.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Qu,e)}translateY(e){return this.translateOnAxis(ed,e)}translateZ(e){return this.translateOnAxis(td,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_i.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?fo.copy(e):fo.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),mr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_i.lookAt(mr,fo,this.up):_i.lookAt(fo,mr,this.up),this.quaternion.setFromRotationMatrix(_i),i&&(_i.extractRotation(i.matrixWorld),Ms.setFromRotationMatrix(_i),this.quaternion.premultiply(Ms.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(De("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(nd),bs.child=e,this.dispatchEvent(bs),bs.child=null):De("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(zg),pc.child=e,this.dispatchEvent(pc),pc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_i.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_i.multiply(e.parent.matrixWorld)),e.applyMatrix4(_i),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(nd),bs.child=e,this.dispatchEvent(bs),bs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,e,Fg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,Og,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];i.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}At.DEFAULT_UP=new A(0,1,0);At.DEFAULT_MATRIX_AUTO_UPDATE=!0;At.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Oe extends At{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Bg={type:"move"};class mc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Oe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Oe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Oe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),m=this._getHandJoint(l,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Bg)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Oe;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Ap={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ui={h:0,s:0,l:0},po={h:0,s:0,l:0};function gc(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ie{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=en){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=it.workingColorSpace){return this.r=e,this.g=t,this.b=n,it.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=it.workingColorSpace){if(e=Hh(e,1),t=Je(t,0,1),n=Je(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=gc(o,r,e+1/3),this.g=gc(o,r,e),this.b=gc(o,r,e-1/3)}return it.colorSpaceToWorking(this,i),this}setStyle(e,t=en){function n(r){r!==void 0&&parseFloat(r)<1&&Ee("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ee("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ee("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=en){const n=Ap[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ee("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ri(e.r),this.g=Ri(e.g),this.b=Ri(e.b),this}copyLinearToSRGB(e){return this.r=Ks(e.r),this.g=Ks(e.g),this.b=Ks(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=en){return it.workingToColorSpace(rn.copy(this),e),Math.round(Je(rn.r*255,0,255))*65536+Math.round(Je(rn.g*255,0,255))*256+Math.round(Je(rn.b*255,0,255))}getHexString(e=en){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=it.workingColorSpace){it.workingToColorSpace(rn.copy(this),t);const n=rn.r,i=rn.g,r=rn.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=it.workingColorSpace){return it.workingToColorSpace(rn.copy(this),t),e.r=rn.r,e.g=rn.g,e.b=rn.b,e}getStyle(e=en){it.workingToColorSpace(rn.copy(this),e);const t=rn.r,n=rn.g,i=rn.b;return e!==en?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Ui),this.setHSL(Ui.h+e,Ui.s+t,Ui.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ui),e.getHSL(po);const n=kr(Ui.h,po.h,t),i=kr(Ui.s,po.s,t),r=kr(Ui.l,po.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const rn=new Ie;Ie.NAMES=Ap;class Xh{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ie(e),this.near=t,this.far=n}clone(){return new Xh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class kg extends At{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Bn,this.environmentIntensity=1,this.environmentRotation=new Bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Hn=new A,xi=new A,_c=new A,vi=new A,Ss=new A,Ts=new A,id=new A,xc=new A,vc=new A,yc=new A,Mc=new Tt,bc=new Tt,Sc=new Tt;class Nn{constructor(e=new A,t=new A,n=new A){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Hn.subVectors(e,t),i.cross(Hn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Hn.subVectors(i,t),xi.subVectors(n,t),_c.subVectors(e,t);const o=Hn.dot(Hn),a=Hn.dot(xi),c=Hn.dot(_c),l=xi.dot(xi),h=xi.dot(_c),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,vi)===null?!1:vi.x>=0&&vi.y>=0&&vi.x+vi.y<=1}static getInterpolation(e,t,n,i,r,o,a,c){return this.getBarycoord(e,t,n,i,vi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,vi.x),c.addScaledVector(o,vi.y),c.addScaledVector(a,vi.z),c)}static getInterpolatedAttribute(e,t,n,i,r,o){return Mc.setScalar(0),bc.setScalar(0),Sc.setScalar(0),Mc.fromBufferAttribute(e,t),bc.fromBufferAttribute(e,n),Sc.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(Mc,r.x),o.addScaledVector(bc,r.y),o.addScaledVector(Sc,r.z),o}static isFrontFacing(e,t,n,i){return Hn.subVectors(n,t),xi.subVectors(e,t),Hn.cross(xi).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Hn.subVectors(this.c,this.b),xi.subVectors(this.a,this.b),Hn.cross(xi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Nn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Nn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return Nn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Nn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Nn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;Ss.subVectors(i,n),Ts.subVectors(r,n),xc.subVectors(e,n);const c=Ss.dot(xc),l=Ts.dot(xc);if(c<=0&&l<=0)return t.copy(n);vc.subVectors(e,i);const h=Ss.dot(vc),u=Ts.dot(vc);if(h>=0&&u<=h)return t.copy(i);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(Ss,o);yc.subVectors(e,r);const f=Ss.dot(yc),g=Ts.dot(yc);if(g>=0&&f<=g)return t.copy(r);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(Ts,a);const p=h*g-f*u;if(p<=0&&u-h>=0&&f-g>=0)return id.subVectors(r,i),a=(u-h)/(u-h+(f-g)),t.copy(i).addScaledVector(id,a);const m=1/(p+_+d);return o=_*m,a=d*m,t.copy(n).addScaledVector(Ss,o).addScaledVector(Ts,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class on{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Gn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Gn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Gn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Gn):Gn.fromBufferAttribute(r,o),Gn.applyMatrix4(e.matrixWorld),this.expandByPoint(Gn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),mo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),mo.copy(n.boundingBox)),mo.applyMatrix4(e.matrixWorld),this.union(mo)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Gn),Gn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(gr),go.subVectors(this.max,gr),ws.subVectors(e.a,gr),Es.subVectors(e.b,gr),As.subVectors(e.c,gr),Fi.subVectors(Es,ws),Oi.subVectors(As,Es),Ji.subVectors(ws,As);let t=[0,-Fi.z,Fi.y,0,-Oi.z,Oi.y,0,-Ji.z,Ji.y,Fi.z,0,-Fi.x,Oi.z,0,-Oi.x,Ji.z,0,-Ji.x,-Fi.y,Fi.x,0,-Oi.y,Oi.x,0,-Ji.y,Ji.x,0];return!Tc(t,ws,Es,As,go)||(t=[1,0,0,0,1,0,0,0,1],!Tc(t,ws,Es,As,go))?!1:(_o.crossVectors(Fi,Oi),t=[_o.x,_o.y,_o.z],Tc(t,ws,Es,As,go))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Gn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Gn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(yi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),yi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),yi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),yi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),yi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),yi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),yi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),yi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(yi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const yi=[new A,new A,new A,new A,new A,new A,new A,new A],Gn=new A,mo=new on,ws=new A,Es=new A,As=new A,Fi=new A,Oi=new A,Ji=new A,gr=new A,go=new A,_o=new A,Qi=new A;function Tc(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Qi.fromArray(s,r);const a=i.x*Math.abs(Qi.x)+i.y*Math.abs(Qi.y)+i.z*Math.abs(Qi.z),c=e.dot(Qi),l=t.dot(Qi),h=n.dot(Qi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const zt=new A,xo=new Le;let Vg=0;class Ut{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Vg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ih,this.updateRanges=[],this.gpuType=Fn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)xo.fromBufferAttribute(this,t),xo.applyMatrix3(e),this.setXY(t,xo.x,xo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix3(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix4(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyNormalMatrix(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.transformDirection(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=qn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ft(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=qn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ft(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=qn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ft(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=qn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ft(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=qn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ft(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ft(t,this.array),n=ft(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ft(t,this.array),n=ft(n,this.array),i=ft(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=ft(t,this.array),n=ft(n,this.array),i=ft(i,this.array),r=ft(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ih&&(e.usage=this.usage),e}}class Rp extends Ut{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Cp extends Ut{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class mt extends Ut{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Hg=new on,_r=new A,wc=new A;class ui{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Hg.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;_r.subVectors(e,this.center);const t=_r.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(_r,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(wc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(_r.copy(e.center).add(wc)),this.expandByPoint(_r.copy(e.center).sub(wc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Gg=0;const An=new ze,Ec=new At,Rs=new A,bn=new on,xr=new on,jt=new A;class Rt extends or{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Gg++}),this.uuid=Kn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(rg(e)?Cp:Rp)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Xe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,n){return An.makeTranslation(e,t,n),this.applyMatrix4(An),this}scale(e,t,n){return An.makeScale(e,t,n),this.applyMatrix4(An),this}lookAt(e){return Ec.lookAt(e),Ec.updateMatrix(),this.applyMatrix4(Ec.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Rs).negate(),this.translate(Rs.x,Rs.y,Rs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new mt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&Ee("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new on);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){De("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];bn.setFromBufferAttribute(r),this.morphTargetsRelative?(jt.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(jt),jt.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(jt)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&De('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ui);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){De("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(e){const n=this.boundingSphere.center;if(bn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];xr.setFromBufferAttribute(a),this.morphTargetsRelative?(jt.addVectors(bn.min,xr.min),bn.expandByPoint(jt),jt.addVectors(bn.max,xr.max),bn.expandByPoint(jt)):(bn.expandByPoint(xr.min),bn.expandByPoint(xr.max))}bn.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)jt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(jt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)jt.fromBufferAttribute(a,l),c&&(Rs.fromBufferAttribute(e,l),jt.add(Rs)),i=Math.max(i,n.distanceToSquared(jt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&De('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){De("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ut(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let v=0;v<n.count;v++)a[v]=new A,c[v]=new A;const l=new A,h=new A,u=new A,d=new Le,f=new Le,g=new Le,_=new A,p=new A;function m(v,T,F){l.fromBufferAttribute(n,v),h.fromBufferAttribute(n,T),u.fromBufferAttribute(n,F),d.fromBufferAttribute(r,v),f.fromBufferAttribute(r,T),g.fromBufferAttribute(r,F),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const P=1/(f.x*g.y-g.x*f.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(P),p.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(P),a[v].add(_),a[T].add(_),a[F].add(_),c[v].add(p),c[T].add(p),c[F].add(p))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let v=0,T=x.length;v<T;++v){const F=x[v],P=F.start,U=F.count;for(let z=P,G=P+U;z<G;z+=3)m(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const y=new A,b=new A,w=new A,E=new A;function C(v){w.fromBufferAttribute(i,v),E.copy(w);const T=a[v];y.copy(T),y.sub(w.multiplyScalar(w.dot(T))).normalize(),b.crossVectors(E,T);const P=b.dot(c[v])<0?-1:1;o.setXYZW(v,y.x,y.y,y.z,P)}for(let v=0,T=x.length;v<T;++v){const F=x[v],P=F.start,U=F.count;for(let z=P,G=P+U;z<G;z+=3)C(e.getX(z+0)),C(e.getX(z+1)),C(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ut(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new A,r=new A,o=new A,a=new A,c=new A,l=new A,h=new A,u=new A;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),_=e.getX(d+1),p=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,p),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)jt.fromBufferAttribute(e,t),jt.normalize(),e.setXYZ(t,jt.x,jt.y,jt.z)}toNonIndexed(){function e(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let _=0,p=c.length;_<p;_++){a.isInterleavedBufferAttribute?f=c[_]*a.data.stride+a.offset:f=c[_]*h;for(let m=0;m<h;m++)d[g++]=l[f++]}return new Ut(d,h,u)}if(this.index===null)return Ee("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Rt,n=this.index.array,i=this.attributes;for(const a in i){const c=i[a],l=e(c,n);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(i[c]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pp{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ih,this.updateRanges=[],this.version=0,this.uuid=Kn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const cn=new A;class eo{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.applyMatrix4(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.applyNormalMatrix(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.transformDirection(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=qn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ft(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ft(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=qn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=qn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=qn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=qn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ft(t,this.array),n=ft(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ft(t,this.array),n=ft(n,this.array),i=ft(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ft(t,this.array),n=ft(n,this.array),i=ft(i,this.array),r=ft(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Oa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Ut(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new eo(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Oa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let Wg=0;class jn extends or{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wg++}),this.uuid=Kn(),this.name="",this.type="Material",this.blending=Ys,this.side=Ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ml,this.blendDst=gl,this.blendEquation=os,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ie(0,0,0),this.blendAlpha=0,this.depthFunc=Zs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=xs,this.stencilZFail=xs,this.stencilZPass=xs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ee(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ee(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ys&&(n.blending=this.blending),this.side!==Ci&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ml&&(n.blendSrc=this.blendSrc),this.blendDst!==gl&&(n.blendDst=this.blendDst),this.blendEquation!==os&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Zs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Gu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==xs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==xs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==xs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ba extends jn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ie(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Cs;const vr=new A,Ps=new A,Is=new A,Ls=new Le,yr=new Le,Ip=new ze,vo=new A,Mr=new A,yo=new A,sd=new Le,Ac=new Le,rd=new Le;class sh extends At{constructor(e=new Ba){if(super(),this.isSprite=!0,this.type="Sprite",Cs===void 0){Cs=new Rt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Pp(t,5);Cs.setIndex([0,1,2,0,2,3]),Cs.setAttribute("position",new eo(n,3,0,!1)),Cs.setAttribute("uv",new eo(n,2,3,!1))}this.geometry=Cs,this.material=e,this.center=new Le(.5,.5),this.count=1}raycast(e,t){e.camera===null&&De('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ps.setFromMatrixScale(this.matrixWorld),Ip.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Is.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ps.multiplyScalar(-Is.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const o=this.center;Mo(vo.set(-.5,-.5,0),Is,o,Ps,i,r),Mo(Mr.set(.5,-.5,0),Is,o,Ps,i,r),Mo(yo.set(.5,.5,0),Is,o,Ps,i,r),sd.set(0,0),Ac.set(1,0),rd.set(1,1);let a=e.ray.intersectTriangle(vo,Mr,yo,!1,vr);if(a===null&&(Mo(Mr.set(-.5,.5,0),Is,o,Ps,i,r),Ac.set(0,1),a=e.ray.intersectTriangle(vo,yo,Mr,!1,vr),a===null))return;const c=e.ray.origin.distanceTo(vr);c<e.near||c>e.far||t.push({distance:c,point:vr.clone(),uv:Nn.getInterpolation(vr,vo,Mr,yo,sd,Ac,rd,new Le),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Mo(s,e,t,n,i,r){Ls.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(yr.x=r*Ls.x-i*Ls.y,yr.y=i*Ls.x+r*Ls.y):yr.copy(Ls),s.copy(e),s.x+=yr.x,s.y+=yr.y,s.applyMatrix4(Ip)}const Mi=new A,Rc=new A,bo=new A,zi=new A,Cc=new A,So=new A,Pc=new A;class oo{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mi.copy(this.origin).addScaledVector(this.direction,t),Mi.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Rc.copy(e).add(t).multiplyScalar(.5),bo.copy(t).sub(e).normalize(),zi.copy(this.origin).sub(Rc);const r=e.distanceTo(t)*.5,o=-this.direction.dot(bo),a=zi.dot(this.direction),c=-zi.dot(bo),l=zi.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Rc).addScaledVector(bo,d),f}intersectSphere(e,t){Mi.subVectors(e.center,this.origin);const n=Mi.dot(this.direction),i=Mi.dot(Mi)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,i=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,i=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Mi)!==null}intersectTriangle(e,t,n,i,r){Cc.subVectors(t,e),So.subVectors(n,e),Pc.crossVectors(Cc,So);let o=this.direction.dot(Pc),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;zi.subVectors(this.origin,e);const c=a*this.direction.dot(So.crossVectors(zi,So));if(c<0)return null;const l=a*this.direction.dot(Cc.cross(zi));if(l<0||c+l>o)return null;const h=-a*zi.dot(Pc);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Zt extends jn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.combine=ap,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const od=new ze,es=new oo,To=new ui,ad=new A,wo=new A,Eo=new A,Ao=new A,Ic=new A,Ro=new A,cd=new A,Co=new A;class ae extends At{constructor(e=new Rt,t=new Zt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){Ro.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(Ic.fromBufferAttribute(u,e),o?Ro.addScaledVector(Ic,h):Ro.addScaledVector(Ic.sub(t),h))}t.add(Ro)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),To.copy(n.boundingSphere),To.applyMatrix4(r),es.copy(e.ray).recast(e.near),!(To.containsPoint(es.origin)===!1&&(es.intersectSphere(To,ad)===null||es.origin.distanceToSquared(ad)>(e.far-e.near)**2))&&(od.copy(r).invert(),es.copy(e.ray).applyMatrix4(od),!(n.boundingBox!==null&&es.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,es)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const p=d[g],m=o[p.materialIndex],x=Math.max(p.start,f.start),y=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let b=x,w=y;b<w;b+=3){const E=a.getX(b),C=a.getX(b+1),v=a.getX(b+2);i=Po(this,m,e,n,l,h,u,E,C,v),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){const x=a.getX(p),y=a.getX(p+1),b=a.getX(p+2);i=Po(this,o,e,n,l,h,u,x,y,b),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const p=d[g],m=o[p.materialIndex],x=Math.max(p.start,f.start),y=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let b=x,w=y;b<w;b+=3){const E=b,C=b+1,v=b+2;i=Po(this,m,e,n,l,h,u,E,C,v),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){const x=p,y=p+1,b=p+2;i=Po(this,o,e,n,l,h,u,x,y,b),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function Xg(s,e,t,n,i,r,o,a){let c;if(e.side===mn?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,e.side===Ci,a),c===null)return null;Co.copy(a),Co.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(Co);return l<t.near||l>t.far?null:{distance:l,point:Co.clone(),object:s}}function Po(s,e,t,n,i,r,o,a,c,l){s.getVertexPosition(a,wo),s.getVertexPosition(c,Eo),s.getVertexPosition(l,Ao);const h=Xg(s,e,t,n,wo,Eo,Ao,cd);if(h){const u=new A;Nn.getBarycoord(cd,wo,Eo,Ao,u),i&&(h.uv=Nn.getInterpolatedAttribute(i,a,c,l,u,new Le)),r&&(h.uv1=Nn.getInterpolatedAttribute(r,a,c,l,u,new Le)),o&&(h.normal=Nn.getInterpolatedAttribute(o,a,c,l,u,new A),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new A,materialIndex:0};Nn.getNormal(wo,Eo,Ao,d.normal),h.face=d,h.barycoord=u}return h}const ld=new A,hd=new Tt,ud=new Tt,qg=new A,dd=new ze,Io=new A,Lc=new ui,fd=new ze,Dc=new oo;class Yg extends ae{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=zu,this.bindMatrix=new ze,this.bindMatrixInverse=new ze,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new on),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Io),this.boundingBox.expandByPoint(Io)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ui),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Io),this.boundingSphere.expandByPoint(Io)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Lc.copy(this.boundingSphere),Lc.applyMatrix4(i),e.ray.intersectsSphere(Lc)!==!1&&(fd.copy(i).invert(),Dc.copy(e.ray).applyMatrix4(fd),!(this.boundingBox!==null&&Dc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Dc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new Tt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===zu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===K0?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ee("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;hd.fromBufferAttribute(i.attributes.skinIndex,e),ud.fromBufferAttribute(i.attributes.skinWeight,e),ld.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const o=ud.getComponent(r);if(o!==0){const a=hd.getComponent(r);dd.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(qg.copy(ld).applyMatrix4(dd),o)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Lp extends At{constructor(){super(),this.isBone=!0,this.type="Bone"}}class qh extends Wt{constructor(e=null,t=1,n=1,i,r,o,a,c,l=Ht,h=Ht,u,d){super(null,o,a,c,l,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const pd=new ze,Kg=new ze;class Yh{constructor(e=[],t=[]){this.uuid=Kn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ee("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new ze)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new ze;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){const a=e[r]?e[r].matrixWorld:Kg;pd.multiplyMatrices(a,t[r]),pd.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Yh(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new qh(t,e,e,On,Fn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let o=t[r];o===void 0&&(Ee("Skeleton: No bone found with UUID:",r),o=new Lp),this.bones.push(o),this.boneInverses.push(new ze().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const o=t[i];e.bones.push(o.uuid);const a=n[i];e.boneInverses.push(a.toArray())}return e}}class rh extends Ut{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ds=new ze,md=new ze,Lo=[],gd=new on,jg=new ze,br=new ae,Sr=new ui;class $g extends ae{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new rh(new Float32Array(n*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,jg)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new on),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ds),gd.copy(e.boundingBox).applyMatrix4(Ds),this.boundingBox.union(gd)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ui),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ds),Sr.copy(e.boundingSphere).applyMatrix4(Ds),this.boundingSphere.union(Sr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(br.geometry=this.geometry,br.material=this.material,br.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Sr.copy(this.boundingSphere),Sr.applyMatrix4(n),e.ray.intersectsSphere(Sr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ds),md.multiplyMatrices(n,Ds),br.matrixWorld=md,br.raycast(e,Lo);for(let o=0,a=Lo.length;o<a;o++){const c=Lo[o];c.instanceId=r,c.object=this,t.push(c)}Lo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new rh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new qh(new Float32Array(i*this.count),i,this.count,Fh,Fn));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=i*e;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Nc=new A,Zg=new A,Jg=new Xe;class Hi{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Nc.subVectors(n,t).cross(Zg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Nc),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Jg.getNormalMatrix(e),i=this.coplanarPoint(Nc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ts=new ui,Qg=new Le(.5,.5),Do=new A;class Kh{constructor(e=new Hi,t=new Hi,n=new Hi,i=new Hi,r=new Hi,o=new Hi){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ii,n=!1){const i=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],_=r[9],p=r[10],m=r[11],x=r[12],y=r[13],b=r[14],w=r[15];if(i[0].setComponents(l-o,f-h,m-g,w-x).normalize(),i[1].setComponents(l+o,f+h,m+g,w+x).normalize(),i[2].setComponents(l+a,f+u,m+_,w+y).normalize(),i[3].setComponents(l-a,f-u,m-_,w-y).normalize(),n)i[4].setComponents(c,d,p,b).normalize(),i[5].setComponents(l-c,f-d,m-p,w-b).normalize();else if(i[4].setComponents(l-c,f-d,m-p,w-b).normalize(),t===ii)i[5].setComponents(l+c,f+d,m+p,w+b).normalize();else if(t===Jr)i[5].setComponents(c,d,p,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ts.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(e){ts.center.set(0,0,0);const t=Qg.distanceTo(e.center);return ts.radius=.7071067811865476+t,ts.applyMatrix4(e.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Do.x=i.normal.x>0?e.max.x:e.min.x,Do.y=i.normal.y>0?e.max.y:e.min.y,Do.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Do)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class jh extends jn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ie(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ka=new A,Va=new A,_d=new ze,Tr=new oo,No=new ui,Uc=new A,xd=new A;class $a extends At{constructor(e=new Rt,t=new jh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)ka.fromBufferAttribute(t,i-1),Va.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=ka.distanceTo(Va);e.setAttribute("lineDistance",new mt(n,1))}else Ee("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),No.copy(n.boundingSphere),No.applyMatrix4(i),No.radius+=r,e.ray.intersectsSphere(No)===!1)return;_d.copy(i).invert(),Tr.copy(e.ray).applyMatrix4(_d);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,p=g-1;_<p;_+=l){const m=h.getX(_),x=h.getX(_+1),y=Uo(this,e,Tr,c,m,x,_);y&&t.push(y)}if(this.isLineLoop){const _=h.getX(g-1),p=h.getX(f),m=Uo(this,e,Tr,c,_,p,g-1);m&&t.push(m)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,p=g-1;_<p;_+=l){const m=Uo(this,e,Tr,c,_,_+1,_);m&&t.push(m)}if(this.isLineLoop){const _=Uo(this,e,Tr,c,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Uo(s,e,t,n,i,r,o){const a=s.geometry.attributes.position;if(ka.fromBufferAttribute(a,i),Va.fromBufferAttribute(a,r),t.distanceSqToSegment(ka,Va,Uc,xd)>n)return;Uc.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(Uc);if(!(l<e.near||l>e.far))return{distance:l,point:xd.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}const vd=new A,yd=new A;class e_ extends $a{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)vd.fromBufferAttribute(t,i),yd.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+vd.distanceTo(yd);e.setAttribute("lineDistance",new mt(n,1))}else Ee("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class t_ extends $a{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class to extends jn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ie(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Md=new ze,oh=new oo,Fo=new ui,Oo=new A;class Ha extends At{constructor(e=new Rt,t=new to){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Fo.copy(n.boundingSphere),Fo.applyMatrix4(i),Fo.radius+=r,e.ray.intersectsSphere(Fo)===!1)return;Md.copy(i).invert(),oh.copy(e.ray).applyMatrix4(Md);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let g=d,_=f;g<_;g++){const p=l.getX(g);Oo.fromBufferAttribute(u,p),bd(Oo,p,c,i,e,t,this)}}else{const d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let g=d,_=f;g<_;g++)Oo.fromBufferAttribute(u,g),bd(Oo,g,c,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function bd(s,e,t,n,i,r,o){const a=oh.distanceSqToPoint(s);if(a<t){const c=new A;oh.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class Dp extends Wt{constructor(e=[],t=ds,n,i,r,o,a,c,l,h){super(e,t,n,i,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ga extends Wt{constructor(e,t,n,i,r,o,a,c,l){super(e,t,n,i,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class no extends Wt{constructor(e,t,n=ci,i,r,o,a=Ht,c=Ht,l,h=Ii,u=1){if(h!==Ii&&h!==ls)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,i,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Gh(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class n_ extends no{constructor(e,t=ci,n=ds,i,r,o=Ht,a=Ht,c,l=Ii){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,r,o,a,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Np extends Wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ae extends Rt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new mt(l,3)),this.setAttribute("normal",new mt(h,3)),this.setAttribute("uv",new mt(u,2));function g(_,p,m,x,y,b,w,E,C,v,T){const F=b/C,P=w/v,U=b/2,z=w/2,G=E/2,B=C+1,H=v+1;let O=0,Q=0;const $=new A;for(let de=0;de<H;de++){const _e=de*P-z;for(let me=0;me<B;me++){const qe=me*F-U;$[_]=qe*x,$[p]=_e*y,$[m]=G,l.push($.x,$.y,$.z),$[_]=0,$[p]=0,$[m]=E>0?1:-1,h.push($.x,$.y,$.z),u.push(me/C),u.push(1-de/v),O+=1}}for(let de=0;de<v;de++)for(let _e=0;_e<C;_e++){const me=d+_e+B*de,qe=d+_e+B*(de+1),wt=d+(_e+1)+B*(de+1),bt=d+(_e+1)+B*de;c.push(me,qe,bt),c.push(qe,wt,bt),Q+=6}a.addGroup(f,Q,T),f+=Q,d+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ae(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Za extends Rt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],o=[],a=[],c=[],l=new A,h=new Le;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const f=n+u/t*i;l.x=e*Math.cos(f),l.y=e*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new mt(o,3)),this.setAttribute("normal",new mt(a,3)),this.setAttribute("uv",new mt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Za(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ai extends Rt{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const _=[],p=n/2;let m=0;x(),o===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new mt(u,3)),this.setAttribute("normal",new mt(d,3)),this.setAttribute("uv",new mt(f,2));function x(){const b=new A,w=new A;let E=0;const C=(t-e)/n;for(let v=0;v<=r;v++){const T=[],F=v/r,P=F*(t-e)+e;for(let U=0;U<=i;U++){const z=U/i,G=z*c+a,B=Math.sin(G),H=Math.cos(G);w.x=P*B,w.y=-F*n+p,w.z=P*H,u.push(w.x,w.y,w.z),b.set(B,C,H).normalize(),d.push(b.x,b.y,b.z),f.push(z,1-F),T.push(g++)}_.push(T)}for(let v=0;v<i;v++)for(let T=0;T<r;T++){const F=_[T][v],P=_[T+1][v],U=_[T+1][v+1],z=_[T][v+1];(e>0||T!==0)&&(h.push(F,P,z),E+=3),(t>0||T!==r-1)&&(h.push(P,U,z),E+=3)}l.addGroup(m,E,0),m+=E}function y(b){const w=g,E=new Le,C=new A;let v=0;const T=b===!0?e:t,F=b===!0?1:-1;for(let U=1;U<=i;U++)u.push(0,p*F,0),d.push(0,F,0),f.push(.5,.5),g++;const P=g;for(let U=0;U<=i;U++){const G=U/i*c+a,B=Math.cos(G),H=Math.sin(G);C.x=T*H,C.y=p*F,C.z=T*B,u.push(C.x,C.y,C.z),d.push(0,F,0),E.x=B*.5+.5,E.y=H*.5*F+.5,f.push(E.x,E.y),g++}for(let U=0;U<i;U++){const z=w+U,G=P+U;b===!0?h.push(G,G+1,z):h.push(G+1,G,z),v+=3}l.addGroup(m,v,b===!0?1:2),m+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ai(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class $h extends ai{constructor(e=1,t=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new $h(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Zh extends Rt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],o=[];a(i),l(n),h(),this.setAttribute("position",new mt(r,3)),this.setAttribute("normal",new mt(r.slice(),3)),this.setAttribute("uv",new mt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const y=new A,b=new A,w=new A;for(let E=0;E<t.length;E+=3)f(t[E+0],y),f(t[E+1],b),f(t[E+2],w),c(y,b,w,x)}function c(x,y,b,w){const E=w+1,C=[];for(let v=0;v<=E;v++){C[v]=[];const T=x.clone().lerp(b,v/E),F=y.clone().lerp(b,v/E),P=E-v;for(let U=0;U<=P;U++)U===0&&v===E?C[v][U]=T:C[v][U]=T.clone().lerp(F,U/P)}for(let v=0;v<E;v++)for(let T=0;T<2*(E-v)-1;T++){const F=Math.floor(T/2);T%2===0?(d(C[v][F+1]),d(C[v+1][F]),d(C[v][F])):(d(C[v][F+1]),d(C[v+1][F+1]),d(C[v+1][F]))}}function l(x){const y=new A;for(let b=0;b<r.length;b+=3)y.x=r[b+0],y.y=r[b+1],y.z=r[b+2],y.normalize().multiplyScalar(x),r[b+0]=y.x,r[b+1]=y.y,r[b+2]=y.z}function h(){const x=new A;for(let y=0;y<r.length;y+=3){x.x=r[y+0],x.y=r[y+1],x.z=r[y+2];const b=p(x)/2/Math.PI+.5,w=m(x)/Math.PI+.5;o.push(b,1-w)}g(),u()}function u(){for(let x=0;x<o.length;x+=6){const y=o[x+0],b=o[x+2],w=o[x+4],E=Math.max(y,b,w),C=Math.min(y,b,w);E>.9&&C<.1&&(y<.2&&(o[x+0]+=1),b<.2&&(o[x+2]+=1),w<.2&&(o[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function f(x,y){const b=x*3;y.x=e[b+0],y.y=e[b+1],y.z=e[b+2]}function g(){const x=new A,y=new A,b=new A,w=new A,E=new Le,C=new Le,v=new Le;for(let T=0,F=0;T<r.length;T+=9,F+=6){x.set(r[T+0],r[T+1],r[T+2]),y.set(r[T+3],r[T+4],r[T+5]),b.set(r[T+6],r[T+7],r[T+8]),E.set(o[F+0],o[F+1]),C.set(o[F+2],o[F+3]),v.set(o[F+4],o[F+5]),w.copy(x).add(y).add(b).divideScalar(3);const P=p(w);_(E,F+0,x,P),_(C,F+2,y,P),_(v,F+4,b,P)}}function _(x,y,b,w){w<0&&x.x===1&&(o[y]=x.x-1),b.x===0&&b.z===0&&(o[y]=w/2/Math.PI+.5)}function p(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zh(e.vertices,e.indices,e.radius,e.detail)}}class i_{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ee("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(i=Math.floor(a+(c-a)/2),l=n[i]-o,l<0)a=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===o)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),c=t||(o.isVector2?new Le:new A);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new A,i=[],r=[],o=[],a=new A,c=new ze;for(let f=0;f<=e;f++){const g=f/e;i[f]=this.getTangentAt(g,new A)}r[0]=new A,o[0]=new A;let l=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Je(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(Je(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(i[g],f*g)),o[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function Jh(){let s=0,e=0,t=0,n=0;function i(r,o,a,c){s=r,e=a,t=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){i(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,i(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return s+e*r+t*o+n*a}}}const zo=new A,Fc=new Jh,Oc=new Jh,zc=new Jh;class s_ extends i_{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new A){const n=t,i=this.points,r=i.length,o=(r-(this.closed?0:1))*e;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=i[(a-1)%r]:(zo.subVectors(i[0],i[1]).add(i[0]),l=zo);const u=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(zo.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=zo),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),p<1e-4&&(p=_),Fc.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,_,p),Oc.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,_,p),zc.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,_,p)}else this.curveType==="catmullrom"&&(Fc.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Oc.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),zc.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Fc.calc(c),Oc.calc(c),zc.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new A().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}class ar extends Rt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,u=e/a,d=t/c,f=[],g=[],_=[],p=[];for(let m=0;m<h;m++){const x=m*d-o;for(let y=0;y<l;y++){const b=y*u-r;g.push(b,-x,0),_.push(0,0,1),p.push(y/a),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let x=0;x<a;x++){const y=x+l*m,b=x+l*(m+1),w=x+1+l*(m+1),E=x+1+l*m;f.push(y,b,E),f.push(b,w,E)}this.setIndex(f),this.setAttribute("position",new mt(g,3)),this.setAttribute("normal",new mt(_,3)),this.setAttribute("uv",new mt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ar(e.width,e.height,e.widthSegments,e.heightSegments)}}class Qh extends Rt{constructor(e=.5,t=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);const a=[],c=[],l=[],h=[];let u=e;const d=(t-e)/i,f=new A,g=new Le;for(let _=0;_<=i;_++){for(let p=0;p<=n;p++){const m=r+p/n*o;f.x=u*Math.cos(m),f.y=u*Math.sin(m),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<i;_++){const p=_*(n+1);for(let m=0;m<n;m++){const x=m+p,y=x,b=x+n+1,w=x+n+2,E=x+1;a.push(y,b,E),a.push(b,w,E)}}this.setIndex(a),this.setAttribute("position",new mt(c,3)),this.setAttribute("normal",new mt(l,3)),this.setAttribute("uv",new mt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qh(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class ao extends Rt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new A,d=new A,f=[],g=[],_=[],p=[];for(let m=0;m<=n;m++){const x=[],y=m/n;let b=0;m===0&&o===0?b=.5/t:m===n&&c===Math.PI&&(b=-.5/t);for(let w=0;w<=t;w++){const E=w/t;u.x=-e*Math.cos(i+E*r)*Math.sin(o+y*a),u.y=e*Math.cos(o+y*a),u.z=e*Math.sin(i+E*r)*Math.sin(o+y*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),p.push(E+b,1-y),x.push(l++)}h.push(x)}for(let m=0;m<n;m++)for(let x=0;x<t;x++){const y=h[m][x+1],b=h[m][x],w=h[m+1][x],E=h[m+1][x+1];(m!==0||o>0)&&f.push(y,b,E),(m!==n-1||c<Math.PI)&&f.push(b,w,E)}this.setIndex(f),this.setAttribute("position",new mt(g,3)),this.setAttribute("normal",new mt(_,3)),this.setAttribute("uv",new mt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ao(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class eu extends Zh{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new eu(e.radius,e.detail)}}class Wa extends Rt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),i=Math.floor(i);const c=[],l=[],h=[],u=[],d=new A,f=new A,g=new A;for(let _=0;_<=n;_++){const p=o+_/n*a;for(let m=0;m<=i;m++){const x=m/i*r;f.x=(e+t*Math.cos(p))*Math.cos(x),f.y=(e+t*Math.cos(p))*Math.sin(x),f.z=t*Math.sin(p),l.push(f.x,f.y,f.z),d.x=e*Math.cos(x),d.y=e*Math.sin(x),g.subVectors(f,d).normalize(),h.push(g.x,g.y,g.z),u.push(m/i),u.push(_/n)}}for(let _=1;_<=n;_++)for(let p=1;p<=i;p++){const m=(i+1)*_+p-1,x=(i+1)*(_-1)+p-1,y=(i+1)*(_-1)+p,b=(i+1)*_+p;c.push(m,x,b),c.push(x,y,b)}this.setIndex(c),this.setAttribute("position",new mt(l,3)),this.setAttribute("normal",new mt(h,3)),this.setAttribute("uv",new mt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wa(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}function tr(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(Ee("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function ln(s){const e={};for(let t=0;t<s.length;t++){const n=tr(s[t]);for(const i in n)e[i]=n[i]}return e}function r_(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Up(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}const o_={clone:tr,merge:ln};var a_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,c_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class li extends jn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=a_,this.fragmentShader=c_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=tr(e.uniforms),this.uniformsGroups=r_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class l_ extends li{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class oe extends jn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ie(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Tp,this.normalScale=new Le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class di extends oe{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Le(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Je(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ie(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ie(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ie(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class h_ extends jn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Z0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class u_ extends jn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Bo(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function d_(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Sd(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){const a=t[r]*e;for(let c=0;c!==e;++c)i[o++]=s[a+c]}return i}function Fp(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}class cr{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break e}o=t.length;break t}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class f_ extends cr{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ku,endingEnd:ku}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,o=e+1,a=i[r],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Vu:r=e,a=2*t-n;break;case Hu:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Vu:o=e,c=2*n-t;break;case Hu:o=1,c=n+i[1]-i[0];break;default:o=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(i-t),_=g*g,p=_*g,m=-d*p+2*d*_-d*g,x=(1+d)*p+(-1.5-2*d)*_+(-.5+d)*g+1,y=(-1-f)*p+(1.5+f)*_+.5*g,b=f*p-f*_;for(let w=0;w!==a;++w)r[w]=m*o[h+w]+x*o[l+w]+y*o[c+w]+b*o[u+w];return r}}class p_ extends cr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[l+d]*u+o[c+d]*h;return r}}class m_ extends cr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class g_ extends cr{interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this.settings||this.DefaultSettings_,u=h.inTangents,d=h.outTangents;if(!u||!d){const _=(n-t)/(i-t),p=1-_;for(let m=0;m!==a;++m)r[m]=o[l+m]*p+o[c+m]*_;return r}const f=a*2,g=e-1;for(let _=0;_!==a;++_){const p=o[l+_],m=o[c+_],x=g*f+_*2,y=d[x],b=d[x+1],w=e*f+_*2,E=u[w],C=u[w+1];let v=(n-t)/(i-t),T,F,P,U,z;for(let G=0;G<8;G++){T=v*v,F=T*v,P=1-v,U=P*P,z=U*P;const H=z*t+3*U*v*y+3*P*T*E+F*i-n;if(Math.abs(H)<1e-10)break;const O=3*U*(y-t)+6*P*v*(E-y)+3*T*(i-E);if(Math.abs(O)<1e-10)break;v=v-H/O,v=Math.max(0,Math.min(1,v))}r[_]=z*p+3*U*v*b+3*P*T*C+F*m}return r}}class $n{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Bo(t,this.TimeBufferType),this.values=Bo(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Bo(e.times,Array),values:Bo(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new m_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new p_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new f_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new g_(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case $r:t=this.InterpolantFactoryMethodDiscrete;break;case Zr:t=this.InterpolantFactoryMethodLinear;break;case lc:t=this.InterpolantFactoryMethodSmooth;break;case Bu:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ee("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return $r;case this.InterpolantFactoryMethodLinear:return Zr;case this.InterpolantFactoryMethodSmooth:return lc;case this.InterpolantFactoryMethodBezier:return Bu}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(De("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(De("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){const c=n[a];if(typeof c=="number"&&isNaN(c)){De("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){De("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(i!==void 0&&og(i))for(let a=0,c=i.length;a!==c;++a){const l=i[a];if(isNaN(l)){De("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===lc,r=e.length-1;let o=1;for(let a=1;a<r;++a){let c=!1;const l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(i)c=!0;else{const u=a*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){const _=t[u+g];if(_!==t[d+g]||_!==t[f+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];const u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}$n.prototype.ValueTypeName="";$n.prototype.TimeBufferType=Float32Array;$n.prototype.ValueBufferType=Float32Array;$n.prototype.DefaultInterpolation=Zr;class lr extends $n{constructor(e,t,n){super(e,t,n)}}lr.prototype.ValueTypeName="bool";lr.prototype.ValueBufferType=Array;lr.prototype.DefaultInterpolation=$r;lr.prototype.InterpolantFactoryMethodLinear=void 0;lr.prototype.InterpolantFactoryMethodSmooth=void 0;class Op extends $n{constructor(e,t,n,i){super(e,t,n,i)}}Op.prototype.ValueTypeName="color";class nr extends $n{constructor(e,t,n,i){super(e,t,n,i)}}nr.prototype.ValueTypeName="number";class __ extends cr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(i-t);let l=e*a;for(let h=l+a;l!==h;l+=4)xn.slerpFlat(r,0,o,l-a,o,l,c);return r}}class ir extends $n{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new __(this.times,this.values,this.getValueSize(),e)}}ir.prototype.ValueTypeName="quaternion";ir.prototype.InterpolantFactoryMethodSmooth=void 0;class hr extends $n{constructor(e,t,n){super(e,t,n)}}hr.prototype.ValueTypeName="string";hr.prototype.ValueBufferType=Array;hr.prototype.DefaultInterpolation=$r;hr.prototype.InterpolantFactoryMethodLinear=void 0;hr.prototype.InterpolantFactoryMethodSmooth=void 0;class sr extends $n{constructor(e,t,n,i){super(e,t,n,i)}}sr.prototype.ValueTypeName="vector";class x_{constructor(e="",t=-1,n=[],i=j0){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Kn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(y_(n[o]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push($n.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);const h=d_(c);c=Sd(c,1,h),l=Sd(l,1,h),!i&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new nr(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){const l=e[a],h=l.name.match(r);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(l)}}const o=[];for(const a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(Ee("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return De("AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,g,_){if(f.length!==0){const p=[],m=[];Fp(f,p,m,g),p.length!==0&&_.push(new u(d,p,m))}},i=[],r=e.name||"default",o=e.fps||30,a=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let u=0;u<l.length;u++){const d=l[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let _=0;_<d[g].morphTargets.length;_++)f[d[g].morphTargets[_]]=-1;for(const _ in f){const p=[],m=[];for(let x=0;x!==d[g].morphTargets.length;++x){const y=d[g];p.push(y.time),m.push(y.morphTarget===_?1:0)}i.push(new nr(".morphTargetInfluence["+_+"]",p,m))}c=f.length*o}else{const f=".bones["+t[u].name+"]";n(sr,f+".position",d,"pos",i),n(ir,f+".quaternion",d,"rot",i),n(sr,f+".scale",d,"scl",i)}}return i.length===0?null:new this(r,c,i,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function v_(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return nr;case"vector":case"vector2":case"vector3":case"vector4":return sr;case"color":return Op;case"quaternion":return ir;case"bool":case"boolean":return lr;case"string":return hr}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function y_(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=v_(s.type);if(s.times===void 0){const t=[],n=[];Fp(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const wi={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(Td(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!Td(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function Td(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class M_{constructor(e,t,n){const i=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){const u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){const f=l[u],g=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const b_=new M_;class ur{constructor(e){this.manager=e!==void 0?e:b_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}ur.DEFAULT_MATERIAL_NAME="__DEFAULT";const bi={};class S_ extends Error{constructor(e,t){super(e),this.response=t}}class zp extends ur{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=wi.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(bi[e]!==void 0){bi[e].push({onLoad:t,onProgress:n,onError:i});return}bi[e]=[],bi[e].push({onLoad:t,onProgress:n,onError:i});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Ee("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=bi[e],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,g=f!==0;let _=0;const p=new ReadableStream({start(m){x();function x(){u.read().then(({done:y,value:b})=>{if(y)m.close();else{_+=b.byteLength;const w=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:f});for(let E=0,C=h.length;E<C;E++){const v=h[E];v.onProgress&&v.onProgress(w)}m.enqueue(b),x()}},y=>{m.error(y)})}}});return new Response(p)}else throw new S_(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a==="")return l.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(g=>f.decode(g))}}}).then(l=>{wi.add(`file:${e}`,l);const h=bi[e];delete bi[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{const h=bi[e];if(h===void 0)throw this.manager.itemError(e),l;delete bi[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ns=new WeakMap;class T_ extends ur{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=wi.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let u=Ns.get(o);u===void 0&&(u=[],Ns.set(o,u)),u.push({onLoad:t,onError:i})}return o}const a=Qr("img");function c(){h(),t&&t(this);const u=Ns.get(this)||[];for(let d=0;d<u.length;d++){const f=u[d];f.onLoad&&f.onLoad(this)}Ns.delete(this),r.manager.itemEnd(e)}function l(u){h(),i&&i(u),wi.remove(`image:${e}`);const d=Ns.get(this)||[];for(let f=0;f<d.length;f++){const g=d[f];g.onError&&g.onError(u)}Ns.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),wi.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}}class w_ extends ur{constructor(e){super(e)}load(e,t,n,i){const r=new Wt,o=new T_(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class Ja extends At{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ie(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const Bc=new ze,wd=new A,Ed=new A;class tu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Le(512,512),this.mapType=wn,this.map=null,this.mapPass=null,this.matrix=new ze,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Kh,this._frameExtents=new Le(1,1),this._viewportCount=1,this._viewports=[new Tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;wd.setFromMatrixPosition(e.matrixWorld),t.position.copy(wd),Ed.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ed),t.updateMatrixWorld(),Bc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bc,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Jr||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Bc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ko=new A,Vo=new xn,Jn=new A;class Bp extends At{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ze,this.projectionMatrix=new ze,this.projectionMatrixInverse=new ze,this.coordinateSystem=ii,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ko,Vo,Jn),Jn.x===1&&Jn.y===1&&Jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ko,Vo,Jn.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(ko,Vo,Jn),Jn.x===1&&Jn.y===1&&Jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ko,Vo,Jn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Bi=new A,Ad=new Le,Rd=new Le;class un extends Bp{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=er*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Br*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return er*2*Math.atan(Math.tan(Br*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z),Bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z)}getViewSize(e,t){return this.getViewBounds(e,Ad,Rd),t.subVectors(Rd,Ad)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Br*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*i/c,t-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class E_ extends tu{constructor(){super(new un(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=er*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class A_ extends Ja{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(At.DEFAULT_UP),this.updateMatrix(),this.target=new At,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new E_}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class R_ extends tu{constructor(){super(new un(90,1,.5,500)),this.isPointLightShadow=!0}}class kp extends Ja{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new R_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Qa extends Bp{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class C_ extends tu{constructor(){super(new Qa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ah extends Ja{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(At.DEFAULT_UP),this.updateMatrix(),this.target=new At,this.shadow=new C_}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class P_ extends Ja{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Vr{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const kc=new WeakMap;class I_ extends ur{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ee("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ee("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=wi.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(l=>{if(kc.has(o)===!0)i&&i(kc.get(o)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(l),r.manager.itemEnd(e),l});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return wi.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){i&&i(l),kc.set(c,l),wi.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});wi.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Us=-90,Fs=1;class L_ extends At{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new un(Us,Fs,e,t);i.layers=this.layers,this.add(i);const r=new un(Us,Fs,e,t);r.layers=this.layers,this.add(r);const o=new un(Us,Fs,e,t);o.layers=this.layers,this.add(o);const a=new un(Us,Fs,e,t);a.layers=this.layers,this.add(a);const c=new un(Us,Fs,e,t);c.layers=this.layers,this.add(c);const l=new un(Us,Fs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===ii)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Jr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class D_ extends un{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const nu="\\[\\]\\.:\\/",N_=new RegExp("["+nu+"]","g"),iu="[^"+nu+"]",U_="[^"+nu.replace("\\.","")+"]",F_=/((?:WC+[\/:])*)/.source.replace("WC",iu),O_=/(WCOD+)?/.source.replace("WCOD",U_),z_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",iu),B_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",iu),k_=new RegExp("^"+F_+O_+z_+B_+"$"),V_=["material","materials","bones","map"];class H_{constructor(e,t,n){const i=n||pt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class pt{constructor(e,t,n){this.path=t,this.parsedPath=n||pt.parseTrackName(t),this.node=pt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new pt.Composite(e,t,n):new pt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(N_,"")}static parseTrackName(e){const t=k_.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);V_.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===t||a.uuid===t)return a;const c=n(a.children);if(c)return c}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=pt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ee("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){De("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){De("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){De("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){De("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){De("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){De("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){De("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const o=e[i];if(o===void 0){const l=t.nodeName;De("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){De("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){De("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}pt.Composite=H_;pt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};pt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};pt.prototype.GetterByBindingType=[pt.prototype._getValue_direct,pt.prototype._getValue_array,pt.prototype._getValue_arrayElement,pt.prototype._getValue_toArray];pt.prototype.SetterByBindingTypeAndVersioning=[[pt.prototype._setValue_direct,pt.prototype._setValue_direct_setNeedsUpdate,pt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[pt.prototype._setValue_array,pt.prototype._setValue_array_setNeedsUpdate,pt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[pt.prototype._setValue_arrayElement,pt.prototype._setValue_arrayElement_setNeedsUpdate,pt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[pt.prototype._setValue_fromArray,pt.prototype._setValue_fromArray_setNeedsUpdate,pt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Cd=new ze;class Vp{constructor(e,t,n=0,i=1/0){this.ray=new oo(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Wh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):De("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Cd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Cd),this}intersectObject(e,t=!0,n=[]){return ch(e,this,n,t),n.sort(Pd),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)ch(e[i],this,n,t);return n.sort(Pd),n}}function Pd(s,e){return s.distance-e.distance}function ch(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let o=0,a=r.length;o<a;o++)ch(r[o],e,t,!0)}}class G_{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Ee("THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Id(s,e,t,n){const i=W_(n);switch(t){case Mp:return s*e;case Fh:return s*e/i.components*i.byteLength;case Oh:return s*e/i.components*i.byteLength;case Qs:return s*e*2/i.components*i.byteLength;case zh:return s*e*2/i.components*i.byteLength;case bp:return s*e*3/i.components*i.byteLength;case On:return s*e*4/i.components*i.byteLength;case Bh:return s*e*4/i.components*i.byteLength;case fa:case pa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ma:case ga:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case wl:case Al:return Math.max(s,16)*Math.max(e,8)/4;case Tl:case El:return Math.max(s,8)*Math.max(e,8)/2;case Rl:case Cl:case Il:case Ll:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Pl:case Dl:case Nl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ul:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Fl:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Ol:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case zl:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Bl:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case kl:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Vl:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Hl:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Gl:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Wl:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Xl:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case ql:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Yl:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Kl:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case jl:case $l:case Zl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Jl:case Ql:return Math.ceil(s/4)*Math.ceil(e/4)*8;case eh:case th:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function W_(s){switch(s){case wn:case _p:return{byteLength:1,components:1};case Kr:case xp:case Pi:return{byteLength:2,components:1};case Nh:case Uh:return{byteLength:2,components:4};case ci:case Dh:case Fn:return{byteLength:4,components:1};case vp:case yp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Lh}}));typeof window<"u"&&(window.__THREE__?Ee("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Lh);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Hp(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function X_(s){const e=new WeakMap;function t(a,c){const l=a.array,h=a.usage,u=l.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=s.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(s.bindBuffer(l,a),u.length===0)s.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];s.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(s.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:i,remove:r,update:o}}var q_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Y_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,K_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,j_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Z_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,J_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Q_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ex=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,tx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,nx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ix=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,sx=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,rx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ox=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ax=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,cx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,hx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ux=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,dx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,fx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,px=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,mx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,gx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,_x=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,xx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,yx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,bx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Sx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,wx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Ex=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ax=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Rx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Cx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Px=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ix=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Lx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Dx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Nx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ux=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Fx=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ox=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,zx=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Bx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kx=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Vx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Hx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Gx=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Wx=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Xx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,qx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Yx=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Kx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$x=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Qx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ev=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,tv=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,iv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ov=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,av=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,cv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,hv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,uv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,pv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,mv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_v=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,xv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,yv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Mv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,bv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Sv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,wv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ev=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Av=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Rv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Cv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Pv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Iv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Lv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Dv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Uv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ov=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,kv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Vv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Wv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,qv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$v=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Jv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Qv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ey=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,ty=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ny=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,iy=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sy=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ry=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,oy=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ay=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cy=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ly=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,hy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uy=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,dy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,fy=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,py=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,my=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,gy=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_y=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vy=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,yy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,My=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,by=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ty=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ye={alphahash_fragment:q_,alphahash_pars_fragment:Y_,alphamap_fragment:K_,alphamap_pars_fragment:j_,alphatest_fragment:$_,alphatest_pars_fragment:Z_,aomap_fragment:J_,aomap_pars_fragment:Q_,batching_pars_vertex:ex,batching_vertex:tx,begin_vertex:nx,beginnormal_vertex:ix,bsdfs:sx,iridescence_fragment:rx,bumpmap_pars_fragment:ox,clipping_planes_fragment:ax,clipping_planes_pars_fragment:cx,clipping_planes_pars_vertex:lx,clipping_planes_vertex:hx,color_fragment:ux,color_pars_fragment:dx,color_pars_vertex:fx,color_vertex:px,common:mx,cube_uv_reflection_fragment:gx,defaultnormal_vertex:_x,displacementmap_pars_vertex:xx,displacementmap_vertex:vx,emissivemap_fragment:yx,emissivemap_pars_fragment:Mx,colorspace_fragment:bx,colorspace_pars_fragment:Sx,envmap_fragment:Tx,envmap_common_pars_fragment:wx,envmap_pars_fragment:Ex,envmap_pars_vertex:Ax,envmap_physical_pars_fragment:zx,envmap_vertex:Rx,fog_vertex:Cx,fog_pars_vertex:Px,fog_fragment:Ix,fog_pars_fragment:Lx,gradientmap_pars_fragment:Dx,lightmap_pars_fragment:Nx,lights_lambert_fragment:Ux,lights_lambert_pars_fragment:Fx,lights_pars_begin:Ox,lights_toon_fragment:Bx,lights_toon_pars_fragment:kx,lights_phong_fragment:Vx,lights_phong_pars_fragment:Hx,lights_physical_fragment:Gx,lights_physical_pars_fragment:Wx,lights_fragment_begin:Xx,lights_fragment_maps:qx,lights_fragment_end:Yx,logdepthbuf_fragment:Kx,logdepthbuf_pars_fragment:jx,logdepthbuf_pars_vertex:$x,logdepthbuf_vertex:Zx,map_fragment:Jx,map_pars_fragment:Qx,map_particle_fragment:ev,map_particle_pars_fragment:tv,metalnessmap_fragment:nv,metalnessmap_pars_fragment:iv,morphinstance_vertex:sv,morphcolor_vertex:rv,morphnormal_vertex:ov,morphtarget_pars_vertex:av,morphtarget_vertex:cv,normal_fragment_begin:lv,normal_fragment_maps:hv,normal_pars_fragment:uv,normal_pars_vertex:dv,normal_vertex:fv,normalmap_pars_fragment:pv,clearcoat_normal_fragment_begin:mv,clearcoat_normal_fragment_maps:gv,clearcoat_pars_fragment:_v,iridescence_pars_fragment:xv,opaque_fragment:vv,packing:yv,premultiplied_alpha_fragment:Mv,project_vertex:bv,dithering_fragment:Sv,dithering_pars_fragment:Tv,roughnessmap_fragment:wv,roughnessmap_pars_fragment:Ev,shadowmap_pars_fragment:Av,shadowmap_pars_vertex:Rv,shadowmap_vertex:Cv,shadowmask_pars_fragment:Pv,skinbase_vertex:Iv,skinning_pars_vertex:Lv,skinning_vertex:Dv,skinnormal_vertex:Nv,specularmap_fragment:Uv,specularmap_pars_fragment:Fv,tonemapping_fragment:Ov,tonemapping_pars_fragment:zv,transmission_fragment:Bv,transmission_pars_fragment:kv,uv_pars_fragment:Vv,uv_pars_vertex:Hv,uv_vertex:Gv,worldpos_vertex:Wv,background_vert:Xv,background_frag:qv,backgroundCube_vert:Yv,backgroundCube_frag:Kv,cube_vert:jv,cube_frag:$v,depth_vert:Zv,depth_frag:Jv,distance_vert:Qv,distance_frag:ey,equirect_vert:ty,equirect_frag:ny,linedashed_vert:iy,linedashed_frag:sy,meshbasic_vert:ry,meshbasic_frag:oy,meshlambert_vert:ay,meshlambert_frag:cy,meshmatcap_vert:ly,meshmatcap_frag:hy,meshnormal_vert:uy,meshnormal_frag:dy,meshphong_vert:fy,meshphong_frag:py,meshphysical_vert:my,meshphysical_frag:gy,meshtoon_vert:_y,meshtoon_frag:xy,points_vert:vy,points_frag:yy,shadow_vert:My,shadow_frag:by,sprite_vert:Sy,sprite_frag:Ty},ce={common:{diffuse:{value:new Ie(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xe}},envmap:{envMap:{value:null},envMapRotation:{value:new Xe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xe},normalScale:{value:new Le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ie(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ie(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0},uvTransform:{value:new Xe}},sprite:{diffuse:{value:new Ie(16777215)},opacity:{value:1},center:{value:new Le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}}},ti={basic:{uniforms:ln([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:ln([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Ie(0)},envMapIntensity:{value:1}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:ln([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Ie(0)},specular:{value:new Ie(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:ln([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new Ie(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:ln([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new Ie(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:ln([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:ln([ce.points,ce.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:ln([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:ln([ce.common,ce.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:ln([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:ln([ce.sprite,ce.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new Xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xe}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distance:{uniforms:ln([ce.common,ce.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distance_vert,fragmentShader:Ye.distance_frag},shadow:{uniforms:ln([ce.lights,ce.fog,{color:{value:new Ie(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};ti.physical={uniforms:ln([ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xe},clearcoatNormalScale:{value:new Le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xe},sheen:{value:0},sheenColor:{value:new Ie(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xe},transmissionSamplerSize:{value:new Le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xe},attenuationDistance:{value:0},attenuationColor:{value:new Ie(0)},specularColor:{value:new Ie(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xe},anisotropyVector:{value:new Le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xe}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};const Ho={r:0,b:0,g:0},ns=new Bn,wy=new ze;function Ey(s,e,t,n,i,r){const o=new Ie(0);let a=i===!0?0:1,c,l,h=null,u=0,d=null;function f(x){let y=x.isScene===!0?x.background:null;if(y&&y.isTexture){const b=x.backgroundBlurriness>0;y=e.get(y,b)}return y}function g(x){let y=!1;const b=f(x);b===null?p(o,a):b&&b.isColor&&(p(b,1),y=!0);const w=s.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||y)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function _(x,y){const b=f(y);b&&(b.isCubeTexture||b.mapping===ja)?(l===void 0&&(l=new ae(new Ae(1,1,1),new li({name:"BackgroundCubeMaterial",uniforms:tr(ti.backgroundCube.uniforms),vertexShader:ti.backgroundCube.vertexShader,fragmentShader:ti.backgroundCube.fragmentShader,side:mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(w,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),ns.copy(y.backgroundRotation),ns.x*=-1,ns.y*=-1,ns.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),l.material.uniforms.envMap.value=b,l.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(wy.makeRotationFromEuler(ns)),l.material.toneMapped=it.getTransfer(b.colorSpace)!==dt,(h!==b||u!==b.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=b,u=b.version,d=s.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new ae(new ar(2,2),new li({name:"BackgroundMaterial",uniforms:tr(ti.background.uniforms),vertexShader:ti.background.vertexShader,fragmentShader:ti.background.fragmentShader,side:Ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=it.getTransfer(b.colorSpace)!==dt,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||u!==b.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=b,u=b.version,d=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,y){x.getRGB(Ho,Up(s)),t.buffers.color.setClear(Ho.r,Ho.g,Ho.b,y,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,y=1){o.set(x),a=y,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(x){a=x,p(o,a)},render:g,addToRenderList:_,dispose:m}}function Ay(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,o=!1;function a(P,U,z,G,B){let H=!1;const O=u(P,G,z,U);r!==O&&(r=O,l(r.object)),H=f(P,G,z,B),H&&g(P,G,z,B),B!==null&&e.update(B,s.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,b(P,U,z,G),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function c(){return s.createVertexArray()}function l(P){return s.bindVertexArray(P)}function h(P){return s.deleteVertexArray(P)}function u(P,U,z,G){const B=G.wireframe===!0;let H=n[U.id];H===void 0&&(H={},n[U.id]=H);const O=P.isInstancedMesh===!0?P.id:0;let Q=H[O];Q===void 0&&(Q={},H[O]=Q);let $=Q[z.id];$===void 0&&($={},Q[z.id]=$);let de=$[B];return de===void 0&&(de=d(c()),$[B]=de),de}function d(P){const U=[],z=[],G=[];for(let B=0;B<t;B++)U[B]=0,z[B]=0,G[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:z,attributeDivisors:G,object:P,attributes:{},index:null}}function f(P,U,z,G){const B=r.attributes,H=U.attributes;let O=0;const Q=z.getAttributes();for(const $ in Q)if(Q[$].location>=0){const _e=B[$];let me=H[$];if(me===void 0&&($==="instanceMatrix"&&P.instanceMatrix&&(me=P.instanceMatrix),$==="instanceColor"&&P.instanceColor&&(me=P.instanceColor)),_e===void 0||_e.attribute!==me||me&&_e.data!==me.data)return!0;O++}return r.attributesNum!==O||r.index!==G}function g(P,U,z,G){const B={},H=U.attributes;let O=0;const Q=z.getAttributes();for(const $ in Q)if(Q[$].location>=0){let _e=H[$];_e===void 0&&($==="instanceMatrix"&&P.instanceMatrix&&(_e=P.instanceMatrix),$==="instanceColor"&&P.instanceColor&&(_e=P.instanceColor));const me={};me.attribute=_e,_e&&_e.data&&(me.data=_e.data),B[$]=me,O++}r.attributes=B,r.attributesNum=O,r.index=G}function _(){const P=r.newAttributes;for(let U=0,z=P.length;U<z;U++)P[U]=0}function p(P){m(P,0)}function m(P,U){const z=r.newAttributes,G=r.enabledAttributes,B=r.attributeDivisors;z[P]=1,G[P]===0&&(s.enableVertexAttribArray(P),G[P]=1),B[P]!==U&&(s.vertexAttribDivisor(P,U),B[P]=U)}function x(){const P=r.newAttributes,U=r.enabledAttributes;for(let z=0,G=U.length;z<G;z++)U[z]!==P[z]&&(s.disableVertexAttribArray(z),U[z]=0)}function y(P,U,z,G,B,H,O){O===!0?s.vertexAttribIPointer(P,U,z,B,H):s.vertexAttribPointer(P,U,z,G,B,H)}function b(P,U,z,G){_();const B=G.attributes,H=z.getAttributes(),O=U.defaultAttributeValues;for(const Q in H){const $=H[Q];if($.location>=0){let de=B[Q];if(de===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(de=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(de=P.instanceColor)),de!==void 0){const _e=de.normalized,me=de.itemSize,qe=e.get(de);if(qe===void 0)continue;const wt=qe.buffer,bt=qe.type,K=qe.bytesPerElement,ne=bt===s.INT||bt===s.UNSIGNED_INT||de.gpuType===Dh;if(de.isInterleavedBufferAttribute){const re=de.data,We=re.stride,Ue=de.offset;if(re.isInstancedInterleavedBuffer){for(let Be=0;Be<$.locationSize;Be++)m($.location+Be,re.meshPerAttribute);P.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Be=0;Be<$.locationSize;Be++)p($.location+Be);s.bindBuffer(s.ARRAY_BUFFER,wt);for(let Be=0;Be<$.locationSize;Be++)y($.location+Be,me/$.locationSize,bt,_e,We*K,(Ue+me/$.locationSize*Be)*K,ne)}else{if(de.isInstancedBufferAttribute){for(let re=0;re<$.locationSize;re++)m($.location+re,de.meshPerAttribute);P.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let re=0;re<$.locationSize;re++)p($.location+re);s.bindBuffer(s.ARRAY_BUFFER,wt);for(let re=0;re<$.locationSize;re++)y($.location+re,me/$.locationSize,bt,_e,me*K,me/$.locationSize*re*K,ne)}}else if(O!==void 0){const _e=O[Q];if(_e!==void 0)switch(_e.length){case 2:s.vertexAttrib2fv($.location,_e);break;case 3:s.vertexAttrib3fv($.location,_e);break;case 4:s.vertexAttrib4fv($.location,_e);break;default:s.vertexAttrib1fv($.location,_e)}}}}x()}function w(){T();for(const P in n){const U=n[P];for(const z in U){const G=U[z];for(const B in G){const H=G[B];for(const O in H)h(H[O].object),delete H[O];delete G[B]}}delete n[P]}}function E(P){if(n[P.id]===void 0)return;const U=n[P.id];for(const z in U){const G=U[z];for(const B in G){const H=G[B];for(const O in H)h(H[O].object),delete H[O];delete G[B]}}delete n[P.id]}function C(P){for(const U in n){const z=n[U];for(const G in z){const B=z[G];if(B[P.id]===void 0)continue;const H=B[P.id];for(const O in H)h(H[O].object),delete H[O];delete B[P.id]}}}function v(P){for(const U in n){const z=n[U],G=P.isInstancedMesh===!0?P.id:0,B=z[G];if(B!==void 0){for(const H in B){const O=B[H];for(const Q in O)h(O[Q].object),delete O[Q];delete B[H]}delete z[G],Object.keys(z).length===0&&delete n[U]}}}function T(){F(),o=!0,r!==i&&(r=i,l(r.object))}function F(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:T,resetDefaultState:F,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfObject:v,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:p,disableUnusedAttributes:x}}function Ry(s,e,t){let n;function i(l){n=l}function r(l,h){s.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,u){u!==0&&(s.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function a(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)o(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];t.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Cy(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(C){return!(C!==On&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const v=C===Pi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==wn&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Fn&&!v)}function c(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Ee("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),y=s.getParameter(s.MAX_VARYING_VECTORS),b=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),w=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:b,maxSamples:w,samples:E}}function Py(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new Hi,a=new Xe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,p=u.clipShadows,m=s.get(u);if(!i||g===null||g.length===0||r&&!p)r?h(null):l();else{const x=r?0:n,y=x*4;let b=m.clippingState||null;c.value=b,b=h(g,d,y,f);for(let w=0;w!==y;++w)b[w]=t[w];m.clippingState=b,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let p=null;if(_!==0){if(p=c.value,g!==!0||p===null){const m=f+_*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(p===null||p.length<m)&&(p=new Float32Array(m));for(let y=0,b=f;y!==_;++y,b+=4)o.copy(u[y]).applyMatrix4(x,a),o.normal.toArray(p,b),p[b+3]=o.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}const Wi=4,Ld=[.125,.215,.35,.446,.526,.582],as=20,Iy=256,wr=new Qa,Dd=new Ie;let Vc=null,Hc=0,Gc=0,Wc=!1;const Ly=new A;class Nd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){const{size:o=256,position:a=Ly}=r;Vc=this._renderer.getRenderTarget(),Hc=this._renderer.getActiveCubeFace(),Gc=this._renderer.getActiveMipmapLevel(),Wc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,i,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Od(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Fd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Vc,Hc,Gc),this._renderer.xr.enabled=Wc,e.scissorTest=!1,Os(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ds||e.mapping===Js?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Vc=this._renderer.getRenderTarget(),Hc=this._renderer.getActiveCubeFace(),Gc=this._renderer.getActiveMipmapLevel(),Wc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Gt,minFilter:Gt,generateMipmaps:!1,type:Pi,format:On,colorSpace:dn,depthBuffer:!1},i=Ud(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ud(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Dy(r)),this._blurMaterial=Uy(r,e,t),this._ggxMaterial=Ny(r,e,t)}return i}_compileMaterial(e){const t=new ae(new Rt,e);this._renderer.compile(t,wr)}_sceneToCubeUV(e,t,n,i,r){const c=new un(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Dd),u.toneMapping=ri,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ae(new Ae,new Zt({name:"PMREM.Background",side:mn,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,p=_.material;let m=!1;const x=e.background;x?x.isColor&&(p.color.copy(x),e.background=null,m=!0):(p.color.copy(Dd),m=!0);for(let y=0;y<6;y++){const b=y%3;b===0?(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[y],r.y,r.z)):b===1?(c.up.set(0,0,l[y]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[y],r.z)):(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[y]));const w=this._cubeSize;Os(i,b*w,y>2?w:0,w,w),u.setRenderTarget(i),m&&u.render(_,c),u.render(e,c)}u.toneMapping=f,u.autoClear=d,e.background=x}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===ds||e.mapping===Js;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Od()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Fd());const r=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;Os(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,wr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;const c=o.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(l*l-h*h),d=0+l*1.25,f=u*d,{_lodMax:g}=this,_=this._sizeLods[n],p=3*_*(n>g-Wi?n-g+Wi:0),m=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=g-t,Os(r,p,m,3*_,2*_),i.setRenderTarget(r),i.render(a,wr),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,Os(e,p,m,3*_,2*_),i.setRenderTarget(e),i.render(a,wr)}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&De("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[i];u.material=l;const d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*as-1),_=r/g,p=isFinite(r)?1+Math.floor(h*_):as;p>as&&Ee(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${as}`);const m=[];let x=0;for(let C=0;C<as;++C){const v=C/_,T=Math.exp(-v*v/2);m.push(T),C===0?x+=T:C<p&&(x+=2*T)}for(let C=0;C<m.length;C++)m[C]=m[C]/x;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-n;const b=this._sizeLods[i],w=3*b*(i>y-Wi?i-y+Wi:0),E=4*(this._cubeSize-b);Os(t,w,E,3*b,2*b),c.setRenderTarget(t),c.render(u,wr)}}function Dy(s){const e=[],t=[],n=[];let i=s;const r=s-Wi+1+Ld.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);e.push(a);let c=1/a;o>s-Wi?c=Ld[o-s+Wi-1]:o===0&&(c=0),t.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,p=2,m=1,x=new Float32Array(_*g*f),y=new Float32Array(p*g*f),b=new Float32Array(m*g*f);for(let E=0;E<f;E++){const C=E%3*2/3-1,v=E>2?0:-1,T=[C,v,0,C+2/3,v,0,C+2/3,v+1,0,C,v,0,C+2/3,v+1,0,C,v+1,0];x.set(T,_*g*E),y.set(d,p*g*E);const F=[E,E,E,E,E,E];b.set(F,m*g*E)}const w=new Rt;w.setAttribute("position",new Ut(x,_)),w.setAttribute("uv",new Ut(y,p)),w.setAttribute("faceIndex",new Ut(b,m)),n.push(new ae(w,null)),i>Wi&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Ud(s,e,t){const n=new oi(s,e,t);return n.texture.mapping=ja,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Os(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Ny(s,e,t){return new li({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Iy,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ec(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Uy(s,e,t){const n=new Float32Array(as),i=new A(0,1,0);return new li({name:"SphericalGaussianBlur",defines:{n:as,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Fd(){return new li({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Od(){return new li({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function ec(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Gp extends oi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Dp(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ae(5,5,5),r=new li({name:"CubemapFromEquirect",uniforms:tr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:mn,blending:Ai});r.uniforms.tEquirect.value=t;const o=new ae(i,r),a=t.minFilter;return t.minFilter===Ti&&(t.minFilter=Gt),new L_(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}function Fy(s){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?o(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===ac||f===cc)if(e.has(d)){const g=e.get(d).texture;return a(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const _=new Gp(g.height);return _.fromEquirectangularTexture(s,d),e.set(d,_),d.addEventListener("dispose",l),a(_.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){const f=d.mapping,g=f===ac||f===cc,_=f===ds||f===Js;if(g||_){let p=t.get(d);const m=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return n===null&&(n=new Nd(s)),p=g?n.fromEquirectangular(d,p):n.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),p.texture;if(p!==void 0)return p.texture;{const x=d.image;return g&&x&&x.height>0||_&&x&&c(x)?(n===null&&(n=new Nd(s)),p=g?n.fromEquirectangular(d):n.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),d.addEventListener("dispose",h),p.texture):null}}}return d}function a(d,f){return f===ac?d.mapping=ds:f===cc&&(d.mapping=Js),d}function c(d){let f=0;const g=6;for(let _=0;_<g;_++)d[_]!==void 0&&f++;return f===g}function l(d){const f=d.target;f.removeEventListener("dispose",l);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function Oy(s){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&za("WebGLRenderer: "+n+" extension not supported."),i}}}function zy(s,e,t,n){const i={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,t.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)e.update(d[f],s.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(g===void 0)return;if(f!==null){const x=f.array;_=f.version;for(let y=0,b=x.length;y<b;y+=3){const w=x[y+0],E=x[y+1],C=x[y+2];d.push(w,E,E,C,C,w)}}else{const x=g.array;_=g.version;for(let y=0,b=x.length/3-1;y<b;y+=3){const w=y+0,E=y+1,C=y+2;d.push(w,E,E,C,C,w)}}const p=new(g.count>=65535?Cp:Rp)(d,1);p.version=_;const m=r.get(u);m&&e.remove(m),r.set(u,p)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function By(s,e,t){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){s.drawElements(n,f,r,d*o),t.update(f,n,1)}function l(d,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,d*o,g),t.update(f,n,g))}function h(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let p=0;for(let m=0;m<g;m++)p+=f[m];t.update(p,n,1)}function u(d,f,g,_){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<d.length;m++)l(d[m]/o,f[m],_[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let m=0;for(let x=0;x<g;x++)m+=f[x]*_[x];t.update(m,n,1)}}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function ky(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:De("WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Vy(s,e,t){const n=new WeakMap,i=new Tt;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let F=function(){v.dispose(),n.delete(a),a.removeEventListener("dispose",F)};var f=F;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let b=0;g===!0&&(b=1),_===!0&&(b=2),p===!0&&(b=3);let w=a.attributes.position.count*b,E=1;w>e.maxTextureSize&&(E=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const C=new Float32Array(w*E*4*u),v=new Ep(C,w,E,u);v.type=Fn,v.needsUpdate=!0;const T=b*4;for(let P=0;P<u;P++){const U=m[P],z=x[P],G=y[P],B=w*E*4*P;for(let H=0;H<U.count;H++){const O=H*T;g===!0&&(i.fromBufferAttribute(U,H),C[B+O+0]=i.x,C[B+O+1]=i.y,C[B+O+2]=i.z,C[B+O+3]=0),_===!0&&(i.fromBufferAttribute(z,H),C[B+O+4]=i.x,C[B+O+5]=i.y,C[B+O+6]=i.z,C[B+O+7]=0),p===!0&&(i.fromBufferAttribute(G,H),C[B+O+8]=i.x,C[B+O+9]=i.y,C[B+O+10]=i.z,C[B+O+11]=G.itemSize===4?i.w:1)}}d={count:u,texture:v,size:new Le(w,E)},n.set(a,d),a.addEventListener("dispose",F)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const _=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(s,"morphTargetBaseInfluence",_),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Hy(s,e,t,n,i){let r=new WeakMap;function o(l){const h=i.render.frame,u=l.geometry,d=e.get(l,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function a(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:a}}const Gy={[cp]:"LINEAR_TONE_MAPPING",[lp]:"REINHARD_TONE_MAPPING",[hp]:"CINEON_TONE_MAPPING",[up]:"ACES_FILMIC_TONE_MAPPING",[fp]:"AGX_TONE_MAPPING",[pp]:"NEUTRAL_TONE_MAPPING",[dp]:"CUSTOM_TONE_MAPPING"};function Wy(s,e,t,n,i){const r=new oi(e,t,{type:s,depthBuffer:n,stencilBuffer:i}),o=new oi(e,t,{type:Pi,depthBuffer:!1,stencilBuffer:!1}),a=new Rt;a.setAttribute("position",new mt([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new mt([0,2,0,0,2,0],2));const c=new l_({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),l=new ae(a,c),h=new Qa(-1,1,1,-1,0,1);let u=null,d=null,f=!1,g,_=null,p=[],m=!1;this.setSize=function(x,y){r.setSize(x,y),o.setSize(x,y);for(let b=0;b<p.length;b++){const w=p[b];w.setSize&&w.setSize(x,y)}},this.setEffects=function(x){p=x,m=p.length>0&&p[0].isRenderPass===!0;const y=r.width,b=r.height;for(let w=0;w<p.length;w++){const E=p[w];E.setSize&&E.setSize(y,b)}},this.begin=function(x,y){if(f||x.toneMapping===ri&&p.length===0)return!1;if(_=y,y!==null){const b=y.width,w=y.height;(r.width!==b||r.height!==w)&&this.setSize(b,w)}return m===!1&&x.setRenderTarget(r),g=x.toneMapping,x.toneMapping=ri,!0},this.hasRenderPass=function(){return m},this.end=function(x,y){x.toneMapping=g,f=!0;let b=r,w=o;for(let E=0;E<p.length;E++){const C=p[E];if(C.enabled!==!1&&(C.render(x,w,b,y),C.needsSwap!==!1)){const v=b;b=w,w=v}}if(u!==x.outputColorSpace||d!==x.toneMapping){u=x.outputColorSpace,d=x.toneMapping,c.defines={},it.getTransfer(u)===dt&&(c.defines.SRGB_TRANSFER="");const E=Gy[d];E&&(c.defines[E]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=b.texture,x.setRenderTarget(_),x.render(l,h),_=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.dispose(),o.dispose(),a.dispose(),c.dispose()}}const Wp=new Wt,lh=new no(1,1),Xp=new Ep,qp=new Lg,Yp=new Dp,zd=[],Bd=[],kd=new Float32Array(16),Vd=new Float32Array(9),Hd=new Float32Array(4);function dr(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=zd[i];if(r===void 0&&(r=new Float32Array(i),zd[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function Xt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function qt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function tc(s,e){let t=Bd[e];t===void 0&&(t=new Int32Array(e),Bd[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Xy(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function qy(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2fv(this.addr,e),qt(t,e)}}function Yy(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Xt(t,e))return;s.uniform3fv(this.addr,e),qt(t,e)}}function Ky(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4fv(this.addr,e),qt(t,e)}}function jy(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;Hd.set(n),s.uniformMatrix2fv(this.addr,!1,Hd),qt(t,n)}}function $y(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;Vd.set(n),s.uniformMatrix3fv(this.addr,!1,Vd),qt(t,n)}}function Zy(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;kd.set(n),s.uniformMatrix4fv(this.addr,!1,kd),qt(t,n)}}function Jy(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Qy(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2iv(this.addr,e),qt(t,e)}}function eM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;s.uniform3iv(this.addr,e),qt(t,e)}}function tM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4iv(this.addr,e),qt(t,e)}}function nM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function iM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2uiv(this.addr,e),qt(t,e)}}function sM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;s.uniform3uiv(this.addr,e),qt(t,e)}}function rM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4uiv(this.addr,e),qt(t,e)}}function oM(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(lh.compareFunction=t.isReversedDepthBuffer()?Vh:kh,r=lh):r=Wp,t.setTexture2D(e||r,i)}function aM(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||qp,i)}function cM(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Yp,i)}function lM(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Xp,i)}function hM(s){switch(s){case 5126:return Xy;case 35664:return qy;case 35665:return Yy;case 35666:return Ky;case 35674:return jy;case 35675:return $y;case 35676:return Zy;case 5124:case 35670:return Jy;case 35667:case 35671:return Qy;case 35668:case 35672:return eM;case 35669:case 35673:return tM;case 5125:return nM;case 36294:return iM;case 36295:return sM;case 36296:return rM;case 35678:case 36198:case 36298:case 36306:case 35682:return oM;case 35679:case 36299:case 36307:return aM;case 35680:case 36300:case 36308:case 36293:return cM;case 36289:case 36303:case 36311:case 36292:return lM}}function uM(s,e){s.uniform1fv(this.addr,e)}function dM(s,e){const t=dr(e,this.size,2);s.uniform2fv(this.addr,t)}function fM(s,e){const t=dr(e,this.size,3);s.uniform3fv(this.addr,t)}function pM(s,e){const t=dr(e,this.size,4);s.uniform4fv(this.addr,t)}function mM(s,e){const t=dr(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function gM(s,e){const t=dr(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function _M(s,e){const t=dr(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function xM(s,e){s.uniform1iv(this.addr,e)}function vM(s,e){s.uniform2iv(this.addr,e)}function yM(s,e){s.uniform3iv(this.addr,e)}function MM(s,e){s.uniform4iv(this.addr,e)}function bM(s,e){s.uniform1uiv(this.addr,e)}function SM(s,e){s.uniform2uiv(this.addr,e)}function TM(s,e){s.uniform3uiv(this.addr,e)}function wM(s,e){s.uniform4uiv(this.addr,e)}function EM(s,e,t){const n=this.cache,i=e.length,r=tc(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));let o;this.type===s.SAMPLER_2D_SHADOW?o=lh:o=Wp;for(let a=0;a!==i;++a)t.setTexture2D(e[a]||o,r[a])}function AM(s,e,t){const n=this.cache,i=e.length,r=tc(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||qp,r[o])}function RM(s,e,t){const n=this.cache,i=e.length,r=tc(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||Yp,r[o])}function CM(s,e,t){const n=this.cache,i=e.length,r=tc(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Xp,r[o])}function PM(s){switch(s){case 5126:return uM;case 35664:return dM;case 35665:return fM;case 35666:return pM;case 35674:return mM;case 35675:return gM;case 35676:return _M;case 5124:case 35670:return xM;case 35667:case 35671:return vM;case 35668:case 35672:return yM;case 35669:case 35673:return MM;case 5125:return bM;case 36294:return SM;case 36295:return TM;case 36296:return wM;case 35678:case 36198:case 36298:case 36306:case 35682:return EM;case 35679:case 36299:case 36307:return AM;case 35680:case 36300:case 36308:case 36293:return RM;case 36289:case 36303:case 36311:case 36292:return CM}}class IM{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=hM(t.type)}}class LM{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=PM(t.type)}}class DM{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const Xc=/(\w+)(\])?(\[|\.)?/g;function Gd(s,e){s.seq.push(e),s.map[e.id]=e}function NM(s,e,t){const n=s.name,i=n.length;for(Xc.lastIndex=0;;){const r=Xc.exec(n),o=Xc.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){Gd(t,l===void 0?new IM(a,s,e):new LM(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new DM(a),Gd(t,u)),t=u}}}class _a{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);NM(a,c,this)}const i=[],r=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(o):r.push(o);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Wd(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const UM=37297;let FM=0;function OM(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const Xd=new Xe;function zM(s){it._getMatrix(Xd,it.workingColorSpace,s);const e=`mat3( ${Xd.elements.map(t=>t.toFixed(4))} )`;switch(it.getTransfer(s)){case Fa:return[e,"LinearTransferOETF"];case dt:return[e,"sRGBTransferOETF"];default:return Ee("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function qd(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+OM(s.getShaderSource(e),a)}else return r}function BM(s,e){const t=zM(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const kM={[cp]:"Linear",[lp]:"Reinhard",[hp]:"Cineon",[up]:"ACESFilmic",[fp]:"AgX",[pp]:"Neutral",[dp]:"Custom"};function VM(s,e){const t=kM[e];return t===void 0?(Ee("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Go=new A;function HM(){it.getLuminanceCoefficients(Go);const s=Go.x.toFixed(4),e=Go.y.toFixed(4),t=Go.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function GM(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ur).join(`
`)}function WM(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function XM(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function Ur(s){return s!==""}function Yd(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Kd(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const qM=/^[ \t]*#include +<([\w\d./]+)>/gm;function hh(s){return s.replace(qM,KM)}const YM=new Map;function KM(s,e){let t=Ye[e];if(t===void 0){const n=YM.get(e);if(n!==void 0)t=Ye[n],Ee('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return hh(t)}const jM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function jd(s){return s.replace(jM,$M)}function $M(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function $d(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const ZM={[ua]:"SHADOWMAP_TYPE_PCF",[Dr]:"SHADOWMAP_TYPE_VSM"};function JM(s){return ZM[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const QM={[ds]:"ENVMAP_TYPE_CUBE",[Js]:"ENVMAP_TYPE_CUBE",[ja]:"ENVMAP_TYPE_CUBE_UV"};function eb(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":QM[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const tb={[Js]:"ENVMAP_MODE_REFRACTION"};function nb(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":tb[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const ib={[ap]:"ENVMAP_BLENDING_MULTIPLY",[q0]:"ENVMAP_BLENDING_MIX",[Y0]:"ENVMAP_BLENDING_ADD"};function sb(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":ib[s.combine]||"ENVMAP_BLENDING_NONE"}function rb(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function ob(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=JM(t),l=eb(t),h=nb(t),u=sb(t),d=rb(t),f=GM(t),g=WM(r),_=i.createProgram();let p,m,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ur).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ur).join(`
`),m.length>0&&(m+=`
`)):(p=[$d(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ur).join(`
`),m=[$d(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ri?"#define TONE_MAPPING":"",t.toneMapping!==ri?Ye.tonemapping_pars_fragment:"",t.toneMapping!==ri?VM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,BM("linearToOutputTexel",t.outputColorSpace),HM(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ur).join(`
`)),o=hh(o),o=Yd(o,t),o=Kd(o,t),a=hh(a),a=Yd(a,t),a=Kd(a,t),o=jd(o),a=jd(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===Wu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Wu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=x+p+o,b=x+m+a,w=Wd(i,i.VERTEX_SHADER,y),E=Wd(i,i.FRAGMENT_SHADER,b);i.attachShader(_,w),i.attachShader(_,E),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function C(P){if(s.debug.checkShaderErrors){const U=i.getProgramInfoLog(_)||"",z=i.getShaderInfoLog(w)||"",G=i.getShaderInfoLog(E)||"",B=U.trim(),H=z.trim(),O=G.trim();let Q=!0,$=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(Q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,w,E);else{const de=qd(i,w,"vertex"),_e=qd(i,E,"fragment");De("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+B+`
`+de+`
`+_e)}else B!==""?Ee("WebGLProgram: Program Info Log:",B):(H===""||O==="")&&($=!1);$&&(P.diagnostics={runnable:Q,programLog:B,vertexShader:{log:H,prefix:p},fragmentShader:{log:O,prefix:m}})}i.deleteShader(w),i.deleteShader(E),v=new _a(i,_),T=XM(i,_)}let v;this.getUniforms=function(){return v===void 0&&C(this),v};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let F=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return F===!1&&(F=i.getProgramParameter(_,UM)),F},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=FM++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=E,this}let ab=0;class cb{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new lb(e),t.set(e,n)),n}}class lb{constructor(e){this.id=ab++,this.code=e,this.usedTimes=0}}function hb(s,e,t,n,i,r){const o=new Wh,a=new cb,c=new Set,l=[],h=new Map,u=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return c.add(v),v===0?"uv":`uv${v}`}function _(v,T,F,P,U){const z=P.fog,G=U.geometry,B=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?P.environment:null,H=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,O=e.get(v.envMap||B,H),Q=O&&O.mapping===ja?O.image.height:null,$=f[v.type];v.precision!==null&&(d=n.getMaxPrecision(v.precision),d!==v.precision&&Ee("WebGLProgram.getParameters:",v.precision,"not supported, using",d,"instead."));const de=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,_e=de!==void 0?de.length:0;let me=0;G.morphAttributes.position!==void 0&&(me=1),G.morphAttributes.normal!==void 0&&(me=2),G.morphAttributes.color!==void 0&&(me=3);let qe,wt,bt,K;if($){const ut=ti[$];qe=ut.vertexShader,wt=ut.fragmentShader}else qe=v.vertexShader,wt=v.fragmentShader,a.update(v),bt=a.getVertexShaderID(v),K=a.getFragmentShaderID(v);const ne=s.getRenderTarget(),re=s.state.buffers.depth.getReversed(),We=U.isInstancedMesh===!0,Ue=U.isBatchedMesh===!0,Be=!!v.map,Yt=!!v.matcap,rt=!!O,ht=!!v.aoMap,xt=!!v.lightMap,je=!!v.bumpMap,Dt=!!v.normalMap,I=!!v.displacementMap,Ot=!!v.emissiveMap,ct=!!v.metalnessMap,yt=!!v.roughnessMap,Te=v.anisotropy>0,R=v.clearcoat>0,M=v.dispersion>0,D=v.iridescence>0,Y=v.sheen>0,j=v.transmission>0,q=Te&&!!v.anisotropyMap,ve=R&&!!v.clearcoatMap,ie=R&&!!v.clearcoatNormalMap,Pe=R&&!!v.clearcoatRoughnessMap,Fe=D&&!!v.iridescenceMap,Z=D&&!!v.iridescenceThicknessMap,ee=Y&&!!v.sheenColorMap,ye=Y&&!!v.sheenRoughnessMap,be=!!v.specularMap,pe=!!v.specularColorMap,$e=!!v.specularIntensityMap,L=j&&!!v.transmissionMap,se=j&&!!v.thicknessMap,te=!!v.gradientMap,xe=!!v.alphaMap,J=v.alphaTest>0,X=!!v.alphaHash,Me=!!v.extensions;let ke=ri;v.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(ke=s.toneMapping);const Mt={shaderID:$,shaderType:v.type,shaderName:v.name,vertexShader:qe,fragmentShader:wt,defines:v.defines,customVertexShaderID:bt,customFragmentShaderID:K,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:d,batching:Ue,batchingColor:Ue&&U._colorsTexture!==null,instancing:We,instancingColor:We&&U.instanceColor!==null,instancingMorph:We&&U.morphTexture!==null,outputColorSpace:ne===null?s.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:dn,alphaToCoverage:!!v.alphaToCoverage,map:Be,matcap:Yt,envMap:rt,envMapMode:rt&&O.mapping,envMapCubeUVHeight:Q,aoMap:ht,lightMap:xt,bumpMap:je,normalMap:Dt,displacementMap:I,emissiveMap:Ot,normalMapObjectSpace:Dt&&v.normalMapType===J0,normalMapTangentSpace:Dt&&v.normalMapType===Tp,metalnessMap:ct,roughnessMap:yt,anisotropy:Te,anisotropyMap:q,clearcoat:R,clearcoatMap:ve,clearcoatNormalMap:ie,clearcoatRoughnessMap:Pe,dispersion:M,iridescence:D,iridescenceMap:Fe,iridescenceThicknessMap:Z,sheen:Y,sheenColorMap:ee,sheenRoughnessMap:ye,specularMap:be,specularColorMap:pe,specularIntensityMap:$e,transmission:j,transmissionMap:L,thicknessMap:se,gradientMap:te,opaque:v.transparent===!1&&v.blending===Ys&&v.alphaToCoverage===!1,alphaMap:xe,alphaTest:J,alphaHash:X,combine:v.combine,mapUv:Be&&g(v.map.channel),aoMapUv:ht&&g(v.aoMap.channel),lightMapUv:xt&&g(v.lightMap.channel),bumpMapUv:je&&g(v.bumpMap.channel),normalMapUv:Dt&&g(v.normalMap.channel),displacementMapUv:I&&g(v.displacementMap.channel),emissiveMapUv:Ot&&g(v.emissiveMap.channel),metalnessMapUv:ct&&g(v.metalnessMap.channel),roughnessMapUv:yt&&g(v.roughnessMap.channel),anisotropyMapUv:q&&g(v.anisotropyMap.channel),clearcoatMapUv:ve&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:ie&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pe&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Fe&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:ee&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:ye&&g(v.sheenRoughnessMap.channel),specularMapUv:be&&g(v.specularMap.channel),specularColorMapUv:pe&&g(v.specularColorMap.channel),specularIntensityMapUv:$e&&g(v.specularIntensityMap.channel),transmissionMapUv:L&&g(v.transmissionMap.channel),thicknessMapUv:se&&g(v.thicknessMap.channel),alphaMapUv:xe&&g(v.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Dt||Te),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!G.attributes.uv&&(Be||xe),fog:!!z,useFog:v.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||G.attributes.normal===void 0&&Dt===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:re,skinning:U.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:_e,morphTextureStride:me,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:s.shadowMap.enabled&&F.length>0,shadowMapType:s.shadowMap.type,toneMapping:ke,decodeVideoTexture:Be&&v.map.isVideoTexture===!0&&it.getTransfer(v.map.colorSpace)===dt,decodeVideoTextureEmissive:Ot&&v.emissiveMap.isVideoTexture===!0&&it.getTransfer(v.emissiveMap.colorSpace)===dt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Dn,flipSided:v.side===mn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Me&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Me&&v.extensions.multiDraw===!0||Ue)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Mt.vertexUv1s=c.has(1),Mt.vertexUv2s=c.has(2),Mt.vertexUv3s=c.has(3),c.clear(),Mt}function p(v){const T=[];if(v.shaderID?T.push(v.shaderID):(T.push(v.customVertexShaderID),T.push(v.customFragmentShaderID)),v.defines!==void 0)for(const F in v.defines)T.push(F),T.push(v.defines[F]);return v.isRawShaderMaterial===!1&&(m(T,v),x(T,v),T.push(s.outputColorSpace)),T.push(v.customProgramCacheKey),T.join()}function m(v,T){v.push(T.precision),v.push(T.outputColorSpace),v.push(T.envMapMode),v.push(T.envMapCubeUVHeight),v.push(T.mapUv),v.push(T.alphaMapUv),v.push(T.lightMapUv),v.push(T.aoMapUv),v.push(T.bumpMapUv),v.push(T.normalMapUv),v.push(T.displacementMapUv),v.push(T.emissiveMapUv),v.push(T.metalnessMapUv),v.push(T.roughnessMapUv),v.push(T.anisotropyMapUv),v.push(T.clearcoatMapUv),v.push(T.clearcoatNormalMapUv),v.push(T.clearcoatRoughnessMapUv),v.push(T.iridescenceMapUv),v.push(T.iridescenceThicknessMapUv),v.push(T.sheenColorMapUv),v.push(T.sheenRoughnessMapUv),v.push(T.specularMapUv),v.push(T.specularColorMapUv),v.push(T.specularIntensityMapUv),v.push(T.transmissionMapUv),v.push(T.thicknessMapUv),v.push(T.combine),v.push(T.fogExp2),v.push(T.sizeAttenuation),v.push(T.morphTargetsCount),v.push(T.morphAttributeCount),v.push(T.numDirLights),v.push(T.numPointLights),v.push(T.numSpotLights),v.push(T.numSpotLightMaps),v.push(T.numHemiLights),v.push(T.numRectAreaLights),v.push(T.numDirLightShadows),v.push(T.numPointLightShadows),v.push(T.numSpotLightShadows),v.push(T.numSpotLightShadowsWithMaps),v.push(T.numLightProbes),v.push(T.shadowMapType),v.push(T.toneMapping),v.push(T.numClippingPlanes),v.push(T.numClipIntersection),v.push(T.depthPacking)}function x(v,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),v.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),v.push(o.mask)}function y(v){const T=f[v.type];let F;if(T){const P=ti[T];F=o_.clone(P.uniforms)}else F=v.uniforms;return F}function b(v,T){let F=h.get(T);return F!==void 0?++F.usedTimes:(F=new ob(s,T,v,i),l.push(F),h.set(T,F)),F}function w(v){if(--v.usedTimes===0){const T=l.indexOf(v);l[T]=l[l.length-1],l.pop(),h.delete(v.cacheKey),v.destroy()}}function E(v){a.remove(v)}function C(){a.dispose()}return{getParameters:_,getProgramCacheKey:p,getUniforms:y,acquireProgram:b,releaseProgram:w,releaseShaderCache:E,programs:l,dispose:C}}function ub(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,c){s.get(o)[a]=c}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function db(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function Zd(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Jd(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,g,_,p,m){let x=s[e];return x===void 0?(x={id:d.id,object:d,geometry:f,material:g,materialVariant:o(d),groupOrder:_,renderOrder:d.renderOrder,z:p,group:m},s[e]=x):(x.id=d.id,x.object=d,x.geometry=f,x.material=g,x.materialVariant=o(d),x.groupOrder=_,x.renderOrder=d.renderOrder,x.z=p,x.group=m),e++,x}function c(d,f,g,_,p,m){const x=a(d,f,g,_,p,m);g.transmission>0?n.push(x):g.transparent===!0?i.push(x):t.push(x)}function l(d,f,g,_,p,m){const x=a(d,f,g,_,p,m);g.transmission>0?n.unshift(x):g.transparent===!0?i.unshift(x):t.unshift(x)}function h(d,f){t.length>1&&t.sort(d||db),n.length>1&&n.sort(f||Zd),i.length>1&&i.sort(f||Zd)}function u(){for(let d=e,f=s.length;d<f;d++){const g=s[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:c,unshift:l,finish:u,sort:h}}function fb(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new Jd,s.set(n,[o])):i>=r.length?(o=new Jd,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function pb(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new A,color:new Ie};break;case"SpotLight":t={position:new A,direction:new A,color:new Ie,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new Ie,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new Ie,groundColor:new Ie};break;case"RectAreaLight":t={color:new Ie,position:new A,halfWidth:new A,halfHeight:new A};break}return s[e.id]=t,t}}}function mb(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let gb=0;function _b(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function xb(s){const e=new pb,t=mb(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new A);const i=new A,r=new ze,o=new ze;function a(l){let h=0,u=0,d=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let f=0,g=0,_=0,p=0,m=0,x=0,y=0,b=0,w=0,E=0,C=0;l.sort(_b);for(let T=0,F=l.length;T<F;T++){const P=l[T],U=P.color,z=P.intensity,G=P.distance;let B=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Qs?B=P.shadow.map.texture:B=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=U.r*z,u+=U.g*z,d+=U.b*z;else if(P.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(P.sh.coefficients[H],z);C++}else if(P.isDirectionalLight){const H=e.get(P);if(H.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const O=P.shadow,Q=t.get(P);Q.shadowIntensity=O.intensity,Q.shadowBias=O.bias,Q.shadowNormalBias=O.normalBias,Q.shadowRadius=O.radius,Q.shadowMapSize=O.mapSize,n.directionalShadow[f]=Q,n.directionalShadowMap[f]=B,n.directionalShadowMatrix[f]=P.shadow.matrix,x++}n.directional[f]=H,f++}else if(P.isSpotLight){const H=e.get(P);H.position.setFromMatrixPosition(P.matrixWorld),H.color.copy(U).multiplyScalar(z),H.distance=G,H.coneCos=Math.cos(P.angle),H.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),H.decay=P.decay,n.spot[_]=H;const O=P.shadow;if(P.map&&(n.spotLightMap[w]=P.map,w++,O.updateMatrices(P),P.castShadow&&E++),n.spotLightMatrix[_]=O.matrix,P.castShadow){const Q=t.get(P);Q.shadowIntensity=O.intensity,Q.shadowBias=O.bias,Q.shadowNormalBias=O.normalBias,Q.shadowRadius=O.radius,Q.shadowMapSize=O.mapSize,n.spotShadow[_]=Q,n.spotShadowMap[_]=B,b++}_++}else if(P.isRectAreaLight){const H=e.get(P);H.color.copy(U).multiplyScalar(z),H.halfWidth.set(P.width*.5,0,0),H.halfHeight.set(0,P.height*.5,0),n.rectArea[p]=H,p++}else if(P.isPointLight){const H=e.get(P);if(H.color.copy(P.color).multiplyScalar(P.intensity),H.distance=P.distance,H.decay=P.decay,P.castShadow){const O=P.shadow,Q=t.get(P);Q.shadowIntensity=O.intensity,Q.shadowBias=O.bias,Q.shadowNormalBias=O.normalBias,Q.shadowRadius=O.radius,Q.shadowMapSize=O.mapSize,Q.shadowCameraNear=O.camera.near,Q.shadowCameraFar=O.camera.far,n.pointShadow[g]=Q,n.pointShadowMap[g]=B,n.pointShadowMatrix[g]=P.shadow.matrix,y++}n.point[g]=H,g++}else if(P.isHemisphereLight){const H=e.get(P);H.skyColor.copy(P.color).multiplyScalar(z),H.groundColor.copy(P.groundColor).multiplyScalar(z),n.hemi[m]=H,m++}}p>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_FLOAT_1,n.rectAreaLTC2=ce.LTC_FLOAT_2):(n.rectAreaLTC1=ce.LTC_HALF_1,n.rectAreaLTC2=ce.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const v=n.hash;(v.directionalLength!==f||v.pointLength!==g||v.spotLength!==_||v.rectAreaLength!==p||v.hemiLength!==m||v.numDirectionalShadows!==x||v.numPointShadows!==y||v.numSpotShadows!==b||v.numSpotMaps!==w||v.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=b+w-E,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,v.directionalLength=f,v.pointLength=g,v.spotLength=_,v.rectAreaLength=p,v.hemiLength=m,v.numDirectionalShadows=x,v.numPointShadows=y,v.numSpotShadows=b,v.numSpotMaps=w,v.numLightProbes=C,n.version=gb++)}function c(l,h){let u=0,d=0,f=0,g=0,_=0;const p=h.matrixWorldInverse;for(let m=0,x=l.length;m<x;m++){const y=l[m];if(y.isDirectionalLight){const b=n.directional[u];b.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),u++}else if(y.isSpotLight){const b=n.spot[f];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),f++}else if(y.isRectAreaLight){const b=n.rectArea[g];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(p),o.identity(),r.copy(y.matrixWorld),r.premultiply(p),o.extractRotation(r),b.halfWidth.set(y.width*.5,0,0),b.halfHeight.set(0,y.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){const b=n.point[d];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(p),d++}else if(y.isHemisphereLight){const b=n.hemi[_];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(p),_++}}}return{setup:a,setupView:c,state:n}}function Qd(s){const e=new xb(s),t=[],n=[];function i(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function vb(s){let e=new WeakMap;function t(i,r=0){const o=e.get(i);let a;return o===void 0?(a=new Qd(s),e.set(i,[a])):r>=o.length?(a=new Qd(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const yb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mb=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,bb=[new A(1,0,0),new A(-1,0,0),new A(0,1,0),new A(0,-1,0),new A(0,0,1),new A(0,0,-1)],Sb=[new A(0,-1,0),new A(0,-1,0),new A(0,0,1),new A(0,0,-1),new A(0,-1,0),new A(0,-1,0)],ef=new ze,Er=new A,qc=new A;function Tb(s,e,t){let n=new Kh;const i=new Le,r=new Le,o=new Tt,a=new h_,c=new u_,l={},h=t.maxTextureSize,u={[Ci]:mn,[mn]:Ci,[Dn]:Dn},d=new li({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Le},radius:{value:4}},vertexShader:yb,fragmentShader:Mb}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Rt;g.setAttribute("position",new Ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ae(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ua;let m=this.type;this.render=function(E,C,v){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;this.type===A0&&(Ee("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=ua);const T=s.getRenderTarget(),F=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),U=s.state;U.setBlending(Ai),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const z=m!==this.type;z&&C.traverse(function(G){G.material&&(Array.isArray(G.material)?G.material.forEach(B=>B.needsUpdate=!0):G.material.needsUpdate=!0)});for(let G=0,B=E.length;G<B;G++){const H=E[G],O=H.shadow;if(O===void 0){Ee("WebGLShadowMap:",H,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;i.copy(O.mapSize);const Q=O.getFrameExtents();i.multiply(Q),r.copy(O.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/Q.x),i.x=r.x*Q.x,O.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/Q.y),i.y=r.y*Q.y,O.mapSize.y=r.y));const $=s.state.buffers.depth.getReversed();if(O.camera._reversedDepth=$,O.map===null||z===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===Dr){if(H.isPointLight){Ee("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new oi(i.x,i.y,{format:Qs,type:Pi,minFilter:Gt,magFilter:Gt,generateMipmaps:!1}),O.map.texture.name=H.name+".shadowMap",O.map.depthTexture=new no(i.x,i.y,Fn),O.map.depthTexture.name=H.name+".shadowMapDepth",O.map.depthTexture.format=Ii,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Ht,O.map.depthTexture.magFilter=Ht}else H.isPointLight?(O.map=new Gp(i.x),O.map.depthTexture=new n_(i.x,ci)):(O.map=new oi(i.x,i.y),O.map.depthTexture=new no(i.x,i.y,ci)),O.map.depthTexture.name=H.name+".shadowMap",O.map.depthTexture.format=Ii,this.type===ua?(O.map.depthTexture.compareFunction=$?Vh:kh,O.map.depthTexture.minFilter=Gt,O.map.depthTexture.magFilter=Gt):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Ht,O.map.depthTexture.magFilter=Ht);O.camera.updateProjectionMatrix()}const de=O.map.isWebGLCubeRenderTarget?6:1;for(let _e=0;_e<de;_e++){if(O.map.isWebGLCubeRenderTarget)s.setRenderTarget(O.map,_e),s.clear();else{_e===0&&(s.setRenderTarget(O.map),s.clear());const me=O.getViewport(_e);o.set(r.x*me.x,r.y*me.y,r.x*me.z,r.y*me.w),U.viewport(o)}if(H.isPointLight){const me=O.camera,qe=O.matrix,wt=H.distance||me.far;wt!==me.far&&(me.far=wt,me.updateProjectionMatrix()),Er.setFromMatrixPosition(H.matrixWorld),me.position.copy(Er),qc.copy(me.position),qc.add(bb[_e]),me.up.copy(Sb[_e]),me.lookAt(qc),me.updateMatrixWorld(),qe.makeTranslation(-Er.x,-Er.y,-Er.z),ef.multiplyMatrices(me.projectionMatrix,me.matrixWorldInverse),O._frustum.setFromProjectionMatrix(ef,me.coordinateSystem,me.reversedDepth)}else O.updateMatrices(H);n=O.getFrustum(),b(C,v,O.camera,H,this.type)}O.isPointLightShadow!==!0&&this.type===Dr&&x(O,v),O.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(T,F,P)};function x(E,C){const v=e.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new oi(i.x,i.y,{format:Qs,type:Pi})),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(C,null,v,d,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(C,null,v,f,_,null)}function y(E,C,v,T){let F=null;const P=v.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(P!==void 0)F=P;else if(F=v.isPointLight===!0?c:a,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const U=F.uuid,z=C.uuid;let G=l[U];G===void 0&&(G={},l[U]=G);let B=G[z];B===void 0&&(B=F.clone(),G[z]=B,C.addEventListener("dispose",w)),F=B}if(F.visible=C.visible,F.wireframe=C.wireframe,T===Dr?F.side=C.shadowSide!==null?C.shadowSide:C.side:F.side=C.shadowSide!==null?C.shadowSide:u[C.side],F.alphaMap=C.alphaMap,F.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,F.map=C.map,F.clipShadows=C.clipShadows,F.clippingPlanes=C.clippingPlanes,F.clipIntersection=C.clipIntersection,F.displacementMap=C.displacementMap,F.displacementScale=C.displacementScale,F.displacementBias=C.displacementBias,F.wireframeLinewidth=C.wireframeLinewidth,F.linewidth=C.linewidth,v.isPointLight===!0&&F.isMeshDistanceMaterial===!0){const U=s.properties.get(F);U.light=v}return F}function b(E,C,v,T,F){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&F===Dr)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,E.matrixWorld);const z=e.update(E),G=E.material;if(Array.isArray(G)){const B=z.groups;for(let H=0,O=B.length;H<O;H++){const Q=B[H],$=G[Q.materialIndex];if($&&$.visible){const de=y(E,$,T,F);E.onBeforeShadow(s,E,C,v,z,de,Q),s.renderBufferDirect(v,null,z,de,E,Q),E.onAfterShadow(s,E,C,v,z,de,Q)}}}else if(G.visible){const B=y(E,G,T,F);E.onBeforeShadow(s,E,C,v,z,B,null),s.renderBufferDirect(v,null,z,B,E,null),E.onAfterShadow(s,E,C,v,z,B,null)}}const U=E.children;for(let z=0,G=U.length;z<G;z++)b(U[z],C,v,T,F)}function w(E){E.target.removeEventListener("dispose",w);for(const v in l){const T=l[v],F=E.target.uuid;F in T&&(T[F].dispose(),delete T[F])}}}function wb(s,e){function t(){let L=!1;const se=new Tt;let te=null;const xe=new Tt(0,0,0,0);return{setMask:function(J){te!==J&&!L&&(s.colorMask(J,J,J,J),te=J)},setLocked:function(J){L=J},setClear:function(J,X,Me,ke,Mt){Mt===!0&&(J*=ke,X*=ke,Me*=ke),se.set(J,X,Me,ke),xe.equals(se)===!1&&(s.clearColor(J,X,Me,ke),xe.copy(se))},reset:function(){L=!1,te=null,xe.set(-1,0,0,0)}}}function n(){let L=!1,se=!1,te=null,xe=null,J=null;return{setReversed:function(X){if(se!==X){const Me=e.get("EXT_clip_control");X?Me.clipControlEXT(Me.LOWER_LEFT_EXT,Me.ZERO_TO_ONE_EXT):Me.clipControlEXT(Me.LOWER_LEFT_EXT,Me.NEGATIVE_ONE_TO_ONE_EXT),se=X;const ke=J;J=null,this.setClear(ke)}},getReversed:function(){return se},setTest:function(X){X?ne(s.DEPTH_TEST):re(s.DEPTH_TEST)},setMask:function(X){te!==X&&!L&&(s.depthMask(X),te=X)},setFunc:function(X){if(se&&(X=lg[X]),xe!==X){switch(X){case _l:s.depthFunc(s.NEVER);break;case xl:s.depthFunc(s.ALWAYS);break;case vl:s.depthFunc(s.LESS);break;case Zs:s.depthFunc(s.LEQUAL);break;case yl:s.depthFunc(s.EQUAL);break;case Ml:s.depthFunc(s.GEQUAL);break;case bl:s.depthFunc(s.GREATER);break;case Sl:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}xe=X}},setLocked:function(X){L=X},setClear:function(X){J!==X&&(J=X,se&&(X=1-X),s.clearDepth(X))},reset:function(){L=!1,te=null,xe=null,J=null,se=!1}}}function i(){let L=!1,se=null,te=null,xe=null,J=null,X=null,Me=null,ke=null,Mt=null;return{setTest:function(ut){L||(ut?ne(s.STENCIL_TEST):re(s.STENCIL_TEST))},setMask:function(ut){se!==ut&&!L&&(s.stencilMask(ut),se=ut)},setFunc:function(ut,mi,gi){(te!==ut||xe!==mi||J!==gi)&&(s.stencilFunc(ut,mi,gi),te=ut,xe=mi,J=gi)},setOp:function(ut,mi,gi){(X!==ut||Me!==mi||ke!==gi)&&(s.stencilOp(ut,mi,gi),X=ut,Me=mi,ke=gi)},setLocked:function(ut){L=ut},setClear:function(ut){Mt!==ut&&(s.clearStencil(ut),Mt=ut)},reset:function(){L=!1,se=null,te=null,xe=null,J=null,X=null,Me=null,ke=null,Mt=null}}}const r=new t,o=new n,a=new i,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,p=null,m=null,x=null,y=null,b=null,w=null,E=null,C=new Ie(0,0,0),v=0,T=!1,F=null,P=null,U=null,z=null,G=null;const B=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,O=0;const Q=s.getParameter(s.VERSION);Q.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(Q)[1]),H=O>=1):Q.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),H=O>=2);let $=null,de={};const _e=s.getParameter(s.SCISSOR_BOX),me=s.getParameter(s.VIEWPORT),qe=new Tt().fromArray(_e),wt=new Tt().fromArray(me);function bt(L,se,te,xe){const J=new Uint8Array(4),X=s.createTexture();s.bindTexture(L,X),s.texParameteri(L,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(L,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Me=0;Me<te;Me++)L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY?s.texImage3D(se,0,s.RGBA,1,1,xe,0,s.RGBA,s.UNSIGNED_BYTE,J):s.texImage2D(se+Me,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,J);return X}const K={};K[s.TEXTURE_2D]=bt(s.TEXTURE_2D,s.TEXTURE_2D,1),K[s.TEXTURE_CUBE_MAP]=bt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[s.TEXTURE_2D_ARRAY]=bt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),K[s.TEXTURE_3D]=bt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ne(s.DEPTH_TEST),o.setFunc(Zs),je(!1),Dt(Uu),ne(s.CULL_FACE),ht(Ai);function ne(L){h[L]!==!0&&(s.enable(L),h[L]=!0)}function re(L){h[L]!==!1&&(s.disable(L),h[L]=!1)}function We(L,se){return u[L]!==se?(s.bindFramebuffer(L,se),u[L]=se,L===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=se),L===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=se),!0):!1}function Ue(L,se){let te=f,xe=!1;if(L){te=d.get(se),te===void 0&&(te=[],d.set(se,te));const J=L.textures;if(te.length!==J.length||te[0]!==s.COLOR_ATTACHMENT0){for(let X=0,Me=J.length;X<Me;X++)te[X]=s.COLOR_ATTACHMENT0+X;te.length=J.length,xe=!0}}else te[0]!==s.BACK&&(te[0]=s.BACK,xe=!0);xe&&s.drawBuffers(te)}function Be(L){return g!==L?(s.useProgram(L),g=L,!0):!1}const Yt={[os]:s.FUNC_ADD,[C0]:s.FUNC_SUBTRACT,[P0]:s.FUNC_REVERSE_SUBTRACT};Yt[I0]=s.MIN,Yt[L0]=s.MAX;const rt={[D0]:s.ZERO,[N0]:s.ONE,[U0]:s.SRC_COLOR,[ml]:s.SRC_ALPHA,[V0]:s.SRC_ALPHA_SATURATE,[B0]:s.DST_COLOR,[O0]:s.DST_ALPHA,[F0]:s.ONE_MINUS_SRC_COLOR,[gl]:s.ONE_MINUS_SRC_ALPHA,[k0]:s.ONE_MINUS_DST_COLOR,[z0]:s.ONE_MINUS_DST_ALPHA,[H0]:s.CONSTANT_COLOR,[G0]:s.ONE_MINUS_CONSTANT_COLOR,[W0]:s.CONSTANT_ALPHA,[X0]:s.ONE_MINUS_CONSTANT_ALPHA};function ht(L,se,te,xe,J,X,Me,ke,Mt,ut){if(L===Ai){_===!0&&(re(s.BLEND),_=!1);return}if(_===!1&&(ne(s.BLEND),_=!0),L!==R0){if(L!==p||ut!==T){if((m!==os||b!==os)&&(s.blendEquation(s.FUNC_ADD),m=os,b=os),ut)switch(L){case Ys:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case pl:s.blendFunc(s.ONE,s.ONE);break;case Fu:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ou:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:De("WebGLState: Invalid blending: ",L);break}else switch(L){case Ys:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case pl:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Fu:De("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ou:De("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:De("WebGLState: Invalid blending: ",L);break}x=null,y=null,w=null,E=null,C.set(0,0,0),v=0,p=L,T=ut}return}J=J||se,X=X||te,Me=Me||xe,(se!==m||J!==b)&&(s.blendEquationSeparate(Yt[se],Yt[J]),m=se,b=J),(te!==x||xe!==y||X!==w||Me!==E)&&(s.blendFuncSeparate(rt[te],rt[xe],rt[X],rt[Me]),x=te,y=xe,w=X,E=Me),(ke.equals(C)===!1||Mt!==v)&&(s.blendColor(ke.r,ke.g,ke.b,Mt),C.copy(ke),v=Mt),p=L,T=!1}function xt(L,se){L.side===Dn?re(s.CULL_FACE):ne(s.CULL_FACE);let te=L.side===mn;se&&(te=!te),je(te),L.blending===Ys&&L.transparent===!1?ht(Ai):ht(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),r.setMask(L.colorWrite);const xe=L.stencilWrite;a.setTest(xe),xe&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Ot(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?ne(s.SAMPLE_ALPHA_TO_COVERAGE):re(s.SAMPLE_ALPHA_TO_COVERAGE)}function je(L){F!==L&&(L?s.frontFace(s.CW):s.frontFace(s.CCW),F=L)}function Dt(L){L!==w0?(ne(s.CULL_FACE),L!==P&&(L===Uu?s.cullFace(s.BACK):L===E0?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):re(s.CULL_FACE),P=L}function I(L){L!==U&&(H&&s.lineWidth(L),U=L)}function Ot(L,se,te){L?(ne(s.POLYGON_OFFSET_FILL),(z!==se||G!==te)&&(z=se,G=te,o.getReversed()&&(se=-se),s.polygonOffset(se,te))):re(s.POLYGON_OFFSET_FILL)}function ct(L){L?ne(s.SCISSOR_TEST):re(s.SCISSOR_TEST)}function yt(L){L===void 0&&(L=s.TEXTURE0+B-1),$!==L&&(s.activeTexture(L),$=L)}function Te(L,se,te){te===void 0&&($===null?te=s.TEXTURE0+B-1:te=$);let xe=de[te];xe===void 0&&(xe={type:void 0,texture:void 0},de[te]=xe),(xe.type!==L||xe.texture!==se)&&($!==te&&(s.activeTexture(te),$=te),s.bindTexture(L,se||K[L]),xe.type=L,xe.texture=se)}function R(){const L=de[$];L!==void 0&&L.type!==void 0&&(s.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function M(){try{s.compressedTexImage2D(...arguments)}catch(L){De("WebGLState:",L)}}function D(){try{s.compressedTexImage3D(...arguments)}catch(L){De("WebGLState:",L)}}function Y(){try{s.texSubImage2D(...arguments)}catch(L){De("WebGLState:",L)}}function j(){try{s.texSubImage3D(...arguments)}catch(L){De("WebGLState:",L)}}function q(){try{s.compressedTexSubImage2D(...arguments)}catch(L){De("WebGLState:",L)}}function ve(){try{s.compressedTexSubImage3D(...arguments)}catch(L){De("WebGLState:",L)}}function ie(){try{s.texStorage2D(...arguments)}catch(L){De("WebGLState:",L)}}function Pe(){try{s.texStorage3D(...arguments)}catch(L){De("WebGLState:",L)}}function Fe(){try{s.texImage2D(...arguments)}catch(L){De("WebGLState:",L)}}function Z(){try{s.texImage3D(...arguments)}catch(L){De("WebGLState:",L)}}function ee(L){qe.equals(L)===!1&&(s.scissor(L.x,L.y,L.z,L.w),qe.copy(L))}function ye(L){wt.equals(L)===!1&&(s.viewport(L.x,L.y,L.z,L.w),wt.copy(L))}function be(L,se){let te=l.get(se);te===void 0&&(te=new WeakMap,l.set(se,te));let xe=te.get(L);xe===void 0&&(xe=s.getUniformBlockIndex(se,L.name),te.set(L,xe))}function pe(L,se){const xe=l.get(se).get(L);c.get(se)!==xe&&(s.uniformBlockBinding(se,xe,L.__bindingPointIndex),c.set(se,xe))}function $e(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},$=null,de={},u={},d=new WeakMap,f=[],g=null,_=!1,p=null,m=null,x=null,y=null,b=null,w=null,E=null,C=new Ie(0,0,0),v=0,T=!1,F=null,P=null,U=null,z=null,G=null,qe.set(0,0,s.canvas.width,s.canvas.height),wt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ne,disable:re,bindFramebuffer:We,drawBuffers:Ue,useProgram:Be,setBlending:ht,setMaterial:xt,setFlipSided:je,setCullFace:Dt,setLineWidth:I,setPolygonOffset:Ot,setScissorTest:ct,activeTexture:yt,bindTexture:Te,unbindTexture:R,compressedTexImage2D:M,compressedTexImage3D:D,texImage2D:Fe,texImage3D:Z,updateUBOMapping:be,uniformBlockBinding:pe,texStorage2D:ie,texStorage3D:Pe,texSubImage2D:Y,texSubImage3D:j,compressedTexSubImage2D:q,compressedTexSubImage3D:ve,scissor:ee,viewport:ye,reset:$e}}function Eb(s,e,t,n,i,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Le,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,M){return f?new OffscreenCanvas(R,M):Qr("canvas")}function _(R,M,D){let Y=1;const j=Te(R);if((j.width>D||j.height>D)&&(Y=D/Math.max(j.width,j.height)),Y<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const q=Math.floor(Y*j.width),ve=Math.floor(Y*j.height);u===void 0&&(u=g(q,ve));const ie=M?g(q,ve):u;return ie.width=q,ie.height=ve,ie.getContext("2d").drawImage(R,0,0,q,ve),Ee("WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+q+"x"+ve+")."),ie}else return"data"in R&&Ee("WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),R;return R}function p(R){return R.generateMipmaps}function m(R){s.generateMipmap(R)}function x(R){return R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?s.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(R,M,D,Y,j=!1){if(R!==null){if(s[R]!==void 0)return s[R];Ee("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let q=M;if(M===s.RED&&(D===s.FLOAT&&(q=s.R32F),D===s.HALF_FLOAT&&(q=s.R16F),D===s.UNSIGNED_BYTE&&(q=s.R8)),M===s.RED_INTEGER&&(D===s.UNSIGNED_BYTE&&(q=s.R8UI),D===s.UNSIGNED_SHORT&&(q=s.R16UI),D===s.UNSIGNED_INT&&(q=s.R32UI),D===s.BYTE&&(q=s.R8I),D===s.SHORT&&(q=s.R16I),D===s.INT&&(q=s.R32I)),M===s.RG&&(D===s.FLOAT&&(q=s.RG32F),D===s.HALF_FLOAT&&(q=s.RG16F),D===s.UNSIGNED_BYTE&&(q=s.RG8)),M===s.RG_INTEGER&&(D===s.UNSIGNED_BYTE&&(q=s.RG8UI),D===s.UNSIGNED_SHORT&&(q=s.RG16UI),D===s.UNSIGNED_INT&&(q=s.RG32UI),D===s.BYTE&&(q=s.RG8I),D===s.SHORT&&(q=s.RG16I),D===s.INT&&(q=s.RG32I)),M===s.RGB_INTEGER&&(D===s.UNSIGNED_BYTE&&(q=s.RGB8UI),D===s.UNSIGNED_SHORT&&(q=s.RGB16UI),D===s.UNSIGNED_INT&&(q=s.RGB32UI),D===s.BYTE&&(q=s.RGB8I),D===s.SHORT&&(q=s.RGB16I),D===s.INT&&(q=s.RGB32I)),M===s.RGBA_INTEGER&&(D===s.UNSIGNED_BYTE&&(q=s.RGBA8UI),D===s.UNSIGNED_SHORT&&(q=s.RGBA16UI),D===s.UNSIGNED_INT&&(q=s.RGBA32UI),D===s.BYTE&&(q=s.RGBA8I),D===s.SHORT&&(q=s.RGBA16I),D===s.INT&&(q=s.RGBA32I)),M===s.RGB&&(D===s.UNSIGNED_INT_5_9_9_9_REV&&(q=s.RGB9_E5),D===s.UNSIGNED_INT_10F_11F_11F_REV&&(q=s.R11F_G11F_B10F)),M===s.RGBA){const ve=j?Fa:it.getTransfer(Y);D===s.FLOAT&&(q=s.RGBA32F),D===s.HALF_FLOAT&&(q=s.RGBA16F),D===s.UNSIGNED_BYTE&&(q=ve===dt?s.SRGB8_ALPHA8:s.RGBA8),D===s.UNSIGNED_SHORT_4_4_4_4&&(q=s.RGBA4),D===s.UNSIGNED_SHORT_5_5_5_1&&(q=s.RGB5_A1)}return(q===s.R16F||q===s.R32F||q===s.RG16F||q===s.RG32F||q===s.RGBA16F||q===s.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function b(R,M){let D;return R?M===null||M===ci||M===jr?D=s.DEPTH24_STENCIL8:M===Fn?D=s.DEPTH32F_STENCIL8:M===Kr&&(D=s.DEPTH24_STENCIL8,Ee("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===ci||M===jr?D=s.DEPTH_COMPONENT24:M===Fn?D=s.DEPTH_COMPONENT32F:M===Kr&&(D=s.DEPTH_COMPONENT16),D}function w(R,M){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==Ht&&R.minFilter!==Gt?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function E(R){const M=R.target;M.removeEventListener("dispose",E),v(M),M.isVideoTexture&&h.delete(M)}function C(R){const M=R.target;M.removeEventListener("dispose",C),F(M)}function v(R){const M=n.get(R);if(M.__webglInit===void 0)return;const D=R.source,Y=d.get(D);if(Y){const j=Y[M.__cacheKey];j.usedTimes--,j.usedTimes===0&&T(R),Object.keys(Y).length===0&&d.delete(D)}n.remove(R)}function T(R){const M=n.get(R);s.deleteTexture(M.__webglTexture);const D=R.source,Y=d.get(D);delete Y[M.__cacheKey],o.memory.textures--}function F(R){const M=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(M.__webglFramebuffer[Y]))for(let j=0;j<M.__webglFramebuffer[Y].length;j++)s.deleteFramebuffer(M.__webglFramebuffer[Y][j]);else s.deleteFramebuffer(M.__webglFramebuffer[Y]);M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer[Y])}else{if(Array.isArray(M.__webglFramebuffer))for(let Y=0;Y<M.__webglFramebuffer.length;Y++)s.deleteFramebuffer(M.__webglFramebuffer[Y]);else s.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&s.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Y=0;Y<M.__webglColorRenderbuffer.length;Y++)M.__webglColorRenderbuffer[Y]&&s.deleteRenderbuffer(M.__webglColorRenderbuffer[Y]);M.__webglDepthRenderbuffer&&s.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const D=R.textures;for(let Y=0,j=D.length;Y<j;Y++){const q=n.get(D[Y]);q.__webglTexture&&(s.deleteTexture(q.__webglTexture),o.memory.textures--),n.remove(D[Y])}n.remove(R)}let P=0;function U(){P=0}function z(){const R=P;return R>=i.maxTextures&&Ee("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),P+=1,R}function G(R){const M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function B(R,M){const D=n.get(R);if(R.isVideoTexture&&ct(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&D.__version!==R.version){const Y=R.image;if(Y===null)Ee("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Ee("WebGLRenderer: Texture marked for update but image is incomplete");else{K(D,R,M);return}}else R.isExternalTexture&&(D.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,D.__webglTexture,s.TEXTURE0+M)}function H(R,M){const D=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&D.__version!==R.version){K(D,R,M);return}else R.isExternalTexture&&(D.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,D.__webglTexture,s.TEXTURE0+M)}function O(R,M){const D=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&D.__version!==R.version){K(D,R,M);return}t.bindTexture(s.TEXTURE_3D,D.__webglTexture,s.TEXTURE0+M)}function Q(R,M){const D=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&D.__version!==R.version){ne(D,R,M);return}t.bindTexture(s.TEXTURE_CUBE_MAP,D.__webglTexture,s.TEXTURE0+M)}const $={[fs]:s.REPEAT,[ni]:s.CLAMP_TO_EDGE,[Ua]:s.MIRRORED_REPEAT},de={[Ht]:s.NEAREST,[gp]:s.NEAREST_MIPMAP_NEAREST,[Nr]:s.NEAREST_MIPMAP_LINEAR,[Gt]:s.LINEAR,[da]:s.LINEAR_MIPMAP_NEAREST,[Ti]:s.LINEAR_MIPMAP_LINEAR},_e={[Q0]:s.NEVER,[sg]:s.ALWAYS,[eg]:s.LESS,[kh]:s.LEQUAL,[tg]:s.EQUAL,[Vh]:s.GEQUAL,[ng]:s.GREATER,[ig]:s.NOTEQUAL};function me(R,M){if(M.type===Fn&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Gt||M.magFilter===da||M.magFilter===Nr||M.magFilter===Ti||M.minFilter===Gt||M.minFilter===da||M.minFilter===Nr||M.minFilter===Ti)&&Ee("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,$[M.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,$[M.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,$[M.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,de[M.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,de[M.minFilter]),M.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,_e[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Ht||M.minFilter!==Nr&&M.minFilter!==Ti||M.type===Fn&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const D=e.get("EXT_texture_filter_anisotropic");s.texParameterf(R,D.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,i.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function qe(R,M){let D=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",E));const Y=M.source;let j=d.get(Y);j===void 0&&(j={},d.set(Y,j));const q=G(M);if(q!==R.__cacheKey){j[q]===void 0&&(j[q]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,D=!0),j[q].usedTimes++;const ve=j[R.__cacheKey];ve!==void 0&&(j[R.__cacheKey].usedTimes--,ve.usedTimes===0&&T(M)),R.__cacheKey=q,R.__webglTexture=j[q].texture}return D}function wt(R,M,D){return Math.floor(Math.floor(R/D)/M)}function bt(R,M,D,Y){const q=R.updateRanges;if(q.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,M.width,M.height,D,Y,M.data);else{q.sort((Z,ee)=>Z.start-ee.start);let ve=0;for(let Z=1;Z<q.length;Z++){const ee=q[ve],ye=q[Z],be=ee.start+ee.count,pe=wt(ye.start,M.width,4),$e=wt(ee.start,M.width,4);ye.start<=be+1&&pe===$e&&wt(ye.start+ye.count-1,M.width,4)===pe?ee.count=Math.max(ee.count,ye.start+ye.count-ee.start):(++ve,q[ve]=ye)}q.length=ve+1;const ie=s.getParameter(s.UNPACK_ROW_LENGTH),Pe=s.getParameter(s.UNPACK_SKIP_PIXELS),Fe=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,M.width);for(let Z=0,ee=q.length;Z<ee;Z++){const ye=q[Z],be=Math.floor(ye.start/4),pe=Math.ceil(ye.count/4),$e=be%M.width,L=Math.floor(be/M.width),se=pe,te=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,$e),s.pixelStorei(s.UNPACK_SKIP_ROWS,L),t.texSubImage2D(s.TEXTURE_2D,0,$e,L,se,te,D,Y,M.data)}R.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ie),s.pixelStorei(s.UNPACK_SKIP_PIXELS,Pe),s.pixelStorei(s.UNPACK_SKIP_ROWS,Fe)}}function K(R,M,D){let Y=s.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Y=s.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Y=s.TEXTURE_3D);const j=qe(R,M),q=M.source;t.bindTexture(Y,R.__webglTexture,s.TEXTURE0+D);const ve=n.get(q);if(q.version!==ve.__version||j===!0){t.activeTexture(s.TEXTURE0+D);const ie=it.getPrimaries(it.workingColorSpace),Pe=M.colorSpace===Gi?null:it.getPrimaries(M.colorSpace),Fe=M.colorSpace===Gi||ie===Pe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);let Z=_(M.image,!1,i.maxTextureSize);Z=yt(M,Z);const ee=r.convert(M.format,M.colorSpace),ye=r.convert(M.type);let be=y(M.internalFormat,ee,ye,M.colorSpace,M.isVideoTexture);me(Y,M);let pe;const $e=M.mipmaps,L=M.isVideoTexture!==!0,se=ve.__version===void 0||j===!0,te=q.dataReady,xe=w(M,Z);if(M.isDepthTexture)be=b(M.format===ls,M.type),se&&(L?t.texStorage2D(s.TEXTURE_2D,1,be,Z.width,Z.height):t.texImage2D(s.TEXTURE_2D,0,be,Z.width,Z.height,0,ee,ye,null));else if(M.isDataTexture)if($e.length>0){L&&se&&t.texStorage2D(s.TEXTURE_2D,xe,be,$e[0].width,$e[0].height);for(let J=0,X=$e.length;J<X;J++)pe=$e[J],L?te&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,pe.width,pe.height,ee,ye,pe.data):t.texImage2D(s.TEXTURE_2D,J,be,pe.width,pe.height,0,ee,ye,pe.data);M.generateMipmaps=!1}else L?(se&&t.texStorage2D(s.TEXTURE_2D,xe,be,Z.width,Z.height),te&&bt(M,Z,ee,ye)):t.texImage2D(s.TEXTURE_2D,0,be,Z.width,Z.height,0,ee,ye,Z.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){L&&se&&t.texStorage3D(s.TEXTURE_2D_ARRAY,xe,be,$e[0].width,$e[0].height,Z.depth);for(let J=0,X=$e.length;J<X;J++)if(pe=$e[J],M.format!==On)if(ee!==null)if(L){if(te)if(M.layerUpdates.size>0){const Me=Id(pe.width,pe.height,M.format,M.type);for(const ke of M.layerUpdates){const Mt=pe.data.subarray(ke*Me/pe.data.BYTES_PER_ELEMENT,(ke+1)*Me/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,ke,pe.width,pe.height,1,ee,Mt)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,pe.width,pe.height,Z.depth,ee,pe.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,J,be,pe.width,pe.height,Z.depth,0,pe.data,0,0);else Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?te&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,pe.width,pe.height,Z.depth,ee,ye,pe.data):t.texImage3D(s.TEXTURE_2D_ARRAY,J,be,pe.width,pe.height,Z.depth,0,ee,ye,pe.data)}else{L&&se&&t.texStorage2D(s.TEXTURE_2D,xe,be,$e[0].width,$e[0].height);for(let J=0,X=$e.length;J<X;J++)pe=$e[J],M.format!==On?ee!==null?L?te&&t.compressedTexSubImage2D(s.TEXTURE_2D,J,0,0,pe.width,pe.height,ee,pe.data):t.compressedTexImage2D(s.TEXTURE_2D,J,be,pe.width,pe.height,0,pe.data):Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?te&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,pe.width,pe.height,ee,ye,pe.data):t.texImage2D(s.TEXTURE_2D,J,be,pe.width,pe.height,0,ee,ye,pe.data)}else if(M.isDataArrayTexture)if(L){if(se&&t.texStorage3D(s.TEXTURE_2D_ARRAY,xe,be,Z.width,Z.height,Z.depth),te)if(M.layerUpdates.size>0){const J=Id(Z.width,Z.height,M.format,M.type);for(const X of M.layerUpdates){const Me=Z.data.subarray(X*J/Z.data.BYTES_PER_ELEMENT,(X+1)*J/Z.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,X,Z.width,Z.height,1,ee,ye,Me)}M.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,ee,ye,Z.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,be,Z.width,Z.height,Z.depth,0,ee,ye,Z.data);else if(M.isData3DTexture)L?(se&&t.texStorage3D(s.TEXTURE_3D,xe,be,Z.width,Z.height,Z.depth),te&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,ee,ye,Z.data)):t.texImage3D(s.TEXTURE_3D,0,be,Z.width,Z.height,Z.depth,0,ee,ye,Z.data);else if(M.isFramebufferTexture){if(se)if(L)t.texStorage2D(s.TEXTURE_2D,xe,be,Z.width,Z.height);else{let J=Z.width,X=Z.height;for(let Me=0;Me<xe;Me++)t.texImage2D(s.TEXTURE_2D,Me,be,J,X,0,ee,ye,null),J>>=1,X>>=1}}else if($e.length>0){if(L&&se){const J=Te($e[0]);t.texStorage2D(s.TEXTURE_2D,xe,be,J.width,J.height)}for(let J=0,X=$e.length;J<X;J++)pe=$e[J],L?te&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,ee,ye,pe):t.texImage2D(s.TEXTURE_2D,J,be,ee,ye,pe);M.generateMipmaps=!1}else if(L){if(se){const J=Te(Z);t.texStorage2D(s.TEXTURE_2D,xe,be,J.width,J.height)}te&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ee,ye,Z)}else t.texImage2D(s.TEXTURE_2D,0,be,ee,ye,Z);p(M)&&m(Y),ve.__version=q.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function ne(R,M,D){if(M.image.length!==6)return;const Y=qe(R,M),j=M.source;t.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+D);const q=n.get(j);if(j.version!==q.__version||Y===!0){t.activeTexture(s.TEXTURE0+D);const ve=it.getPrimaries(it.workingColorSpace),ie=M.colorSpace===Gi?null:it.getPrimaries(M.colorSpace),Pe=M.colorSpace===Gi||ve===ie?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);const Fe=M.isCompressedTexture||M.image[0].isCompressedTexture,Z=M.image[0]&&M.image[0].isDataTexture,ee=[];for(let X=0;X<6;X++)!Fe&&!Z?ee[X]=_(M.image[X],!0,i.maxCubemapSize):ee[X]=Z?M.image[X].image:M.image[X],ee[X]=yt(M,ee[X]);const ye=ee[0],be=r.convert(M.format,M.colorSpace),pe=r.convert(M.type),$e=y(M.internalFormat,be,pe,M.colorSpace),L=M.isVideoTexture!==!0,se=q.__version===void 0||Y===!0,te=j.dataReady;let xe=w(M,ye);me(s.TEXTURE_CUBE_MAP,M);let J;if(Fe){L&&se&&t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,$e,ye.width,ye.height);for(let X=0;X<6;X++){J=ee[X].mipmaps;for(let Me=0;Me<J.length;Me++){const ke=J[Me];M.format!==On?be!==null?L?te&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Me,0,0,ke.width,ke.height,be,ke.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Me,$e,ke.width,ke.height,0,ke.data):Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?te&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Me,0,0,ke.width,ke.height,be,pe,ke.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Me,$e,ke.width,ke.height,0,be,pe,ke.data)}}}else{if(J=M.mipmaps,L&&se){J.length>0&&xe++;const X=Te(ee[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,$e,X.width,X.height)}for(let X=0;X<6;X++)if(Z){L?te&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,ee[X].width,ee[X].height,be,pe,ee[X].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,$e,ee[X].width,ee[X].height,0,be,pe,ee[X].data);for(let Me=0;Me<J.length;Me++){const Mt=J[Me].image[X].image;L?te&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Me+1,0,0,Mt.width,Mt.height,be,pe,Mt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Me+1,$e,Mt.width,Mt.height,0,be,pe,Mt.data)}}else{L?te&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,be,pe,ee[X]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,$e,be,pe,ee[X]);for(let Me=0;Me<J.length;Me++){const ke=J[Me];L?te&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Me+1,0,0,be,pe,ke.image[X]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Me+1,$e,be,pe,ke.image[X])}}}p(M)&&m(s.TEXTURE_CUBE_MAP),q.__version=j.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function re(R,M,D,Y,j,q){const ve=r.convert(D.format,D.colorSpace),ie=r.convert(D.type),Pe=y(D.internalFormat,ve,ie,D.colorSpace),Fe=n.get(M),Z=n.get(D);if(Z.__renderTarget=M,!Fe.__hasExternalTextures){const ee=Math.max(1,M.width>>q),ye=Math.max(1,M.height>>q);j===s.TEXTURE_3D||j===s.TEXTURE_2D_ARRAY?t.texImage3D(j,q,Pe,ee,ye,M.depth,0,ve,ie,null):t.texImage2D(j,q,Pe,ee,ye,0,ve,ie,null)}t.bindFramebuffer(s.FRAMEBUFFER,R),Ot(M)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Y,j,Z.__webglTexture,0,I(M)):(j===s.TEXTURE_2D||j>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Y,j,Z.__webglTexture,q),t.bindFramebuffer(s.FRAMEBUFFER,null)}function We(R,M,D){if(s.bindRenderbuffer(s.RENDERBUFFER,R),M.depthBuffer){const Y=M.depthTexture,j=Y&&Y.isDepthTexture?Y.type:null,q=b(M.stencilBuffer,j),ve=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Ot(M)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,I(M),q,M.width,M.height):D?s.renderbufferStorageMultisample(s.RENDERBUFFER,I(M),q,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,q,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ve,s.RENDERBUFFER,R)}else{const Y=M.textures;for(let j=0;j<Y.length;j++){const q=Y[j],ve=r.convert(q.format,q.colorSpace),ie=r.convert(q.type),Pe=y(q.internalFormat,ve,ie,q.colorSpace);Ot(M)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,I(M),Pe,M.width,M.height):D?s.renderbufferStorageMultisample(s.RENDERBUFFER,I(M),Pe,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,Pe,M.width,M.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ue(R,M,D){const Y=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=n.get(M.depthTexture);if(j.__renderTarget=M,(!j.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),Y){if(j.__webglInit===void 0&&(j.__webglInit=!0,M.depthTexture.addEventListener("dispose",E)),j.__webglTexture===void 0){j.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,j.__webglTexture),me(s.TEXTURE_CUBE_MAP,M.depthTexture);const Fe=r.convert(M.depthTexture.format),Z=r.convert(M.depthTexture.type);let ee;M.depthTexture.format===Ii?ee=s.DEPTH_COMPONENT24:M.depthTexture.format===ls&&(ee=s.DEPTH24_STENCIL8);for(let ye=0;ye<6;ye++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,ee,M.width,M.height,0,Fe,Z,null)}}else B(M.depthTexture,0);const q=j.__webglTexture,ve=I(M),ie=Y?s.TEXTURE_CUBE_MAP_POSITIVE_X+D:s.TEXTURE_2D,Pe=M.depthTexture.format===ls?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(M.depthTexture.format===Ii)Ot(M)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Pe,ie,q,0,ve):s.framebufferTexture2D(s.FRAMEBUFFER,Pe,ie,q,0);else if(M.depthTexture.format===ls)Ot(M)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Pe,ie,q,0,ve):s.framebufferTexture2D(s.FRAMEBUFFER,Pe,ie,q,0);else throw new Error("Unknown depthTexture format")}function Be(R){const M=n.get(R),D=R.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==R.depthTexture){const Y=R.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Y){const j=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Y.removeEventListener("dispose",j)};Y.addEventListener("dispose",j),M.__depthDisposeCallback=j}M.__boundDepthTexture=Y}if(R.depthTexture&&!M.__autoAllocateDepthBuffer)if(D)for(let Y=0;Y<6;Y++)Ue(M.__webglFramebuffer[Y],R,Y);else{const Y=R.texture.mipmaps;Y&&Y.length>0?Ue(M.__webglFramebuffer[0],R,0):Ue(M.__webglFramebuffer,R,0)}else if(D){M.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[Y]),M.__webglDepthbuffer[Y]===void 0)M.__webglDepthbuffer[Y]=s.createRenderbuffer(),We(M.__webglDepthbuffer[Y],R,!1);else{const j=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,q=M.__webglDepthbuffer[Y];s.bindRenderbuffer(s.RENDERBUFFER,q),s.framebufferRenderbuffer(s.FRAMEBUFFER,j,s.RENDERBUFFER,q)}}else{const Y=R.texture.mipmaps;if(Y&&Y.length>0?t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=s.createRenderbuffer(),We(M.__webglDepthbuffer,R,!1);else{const j=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,q=M.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,q),s.framebufferRenderbuffer(s.FRAMEBUFFER,j,s.RENDERBUFFER,q)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Yt(R,M,D){const Y=n.get(R);M!==void 0&&re(Y.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),D!==void 0&&Be(R)}function rt(R){const M=R.texture,D=n.get(R),Y=n.get(M);R.addEventListener("dispose",C);const j=R.textures,q=R.isWebGLCubeRenderTarget===!0,ve=j.length>1;if(ve||(Y.__webglTexture===void 0&&(Y.__webglTexture=s.createTexture()),Y.__version=M.version,o.memory.textures++),q){D.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0){D.__webglFramebuffer[ie]=[];for(let Pe=0;Pe<M.mipmaps.length;Pe++)D.__webglFramebuffer[ie][Pe]=s.createFramebuffer()}else D.__webglFramebuffer[ie]=s.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){D.__webglFramebuffer=[];for(let ie=0;ie<M.mipmaps.length;ie++)D.__webglFramebuffer[ie]=s.createFramebuffer()}else D.__webglFramebuffer=s.createFramebuffer();if(ve)for(let ie=0,Pe=j.length;ie<Pe;ie++){const Fe=n.get(j[ie]);Fe.__webglTexture===void 0&&(Fe.__webglTexture=s.createTexture(),o.memory.textures++)}if(R.samples>0&&Ot(R)===!1){D.__webglMultisampledFramebuffer=s.createFramebuffer(),D.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,D.__webglMultisampledFramebuffer);for(let ie=0;ie<j.length;ie++){const Pe=j[ie];D.__webglColorRenderbuffer[ie]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,D.__webglColorRenderbuffer[ie]);const Fe=r.convert(Pe.format,Pe.colorSpace),Z=r.convert(Pe.type),ee=y(Pe.internalFormat,Fe,Z,Pe.colorSpace,R.isXRRenderTarget===!0),ye=I(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,ye,ee,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ie,s.RENDERBUFFER,D.__webglColorRenderbuffer[ie])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(D.__webglDepthRenderbuffer=s.createRenderbuffer(),We(D.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(q){t.bindTexture(s.TEXTURE_CUBE_MAP,Y.__webglTexture),me(s.TEXTURE_CUBE_MAP,M);for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0)for(let Pe=0;Pe<M.mipmaps.length;Pe++)re(D.__webglFramebuffer[ie][Pe],R,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe);else re(D.__webglFramebuffer[ie],R,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);p(M)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let ie=0,Pe=j.length;ie<Pe;ie++){const Fe=j[ie],Z=n.get(Fe);let ee=s.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ee=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ee,Z.__webglTexture),me(ee,Fe),re(D.__webglFramebuffer,R,Fe,s.COLOR_ATTACHMENT0+ie,ee,0),p(Fe)&&m(ee)}t.unbindTexture()}else{let ie=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ie=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ie,Y.__webglTexture),me(ie,M),M.mipmaps&&M.mipmaps.length>0)for(let Pe=0;Pe<M.mipmaps.length;Pe++)re(D.__webglFramebuffer[Pe],R,M,s.COLOR_ATTACHMENT0,ie,Pe);else re(D.__webglFramebuffer,R,M,s.COLOR_ATTACHMENT0,ie,0);p(M)&&m(ie),t.unbindTexture()}R.depthBuffer&&Be(R)}function ht(R){const M=R.textures;for(let D=0,Y=M.length;D<Y;D++){const j=M[D];if(p(j)){const q=x(R),ve=n.get(j).__webglTexture;t.bindTexture(q,ve),m(q),t.unbindTexture()}}}const xt=[],je=[];function Dt(R){if(R.samples>0){if(Ot(R)===!1){const M=R.textures,D=R.width,Y=R.height;let j=s.COLOR_BUFFER_BIT;const q=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ve=n.get(R),ie=M.length>1;if(ie)for(let Fe=0;Fe<M.length;Fe++)t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Fe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Fe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer);const Pe=R.texture.mipmaps;Pe&&Pe.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let Fe=0;Fe<M.length;Fe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(j|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(j|=s.STENCIL_BUFFER_BIT)),ie){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ve.__webglColorRenderbuffer[Fe]);const Z=n.get(M[Fe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Z,0)}s.blitFramebuffer(0,0,D,Y,0,0,D,Y,j,s.NEAREST),c===!0&&(xt.length=0,je.length=0,xt.push(s.COLOR_ATTACHMENT0+Fe),R.depthBuffer&&R.resolveDepthBuffer===!1&&(xt.push(q),je.push(q),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,je)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,xt))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ie)for(let Fe=0;Fe<M.length;Fe++){t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Fe,s.RENDERBUFFER,ve.__webglColorRenderbuffer[Fe]);const Z=n.get(M[Fe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Fe,s.TEXTURE_2D,Z,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){const M=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[M])}}}function I(R){return Math.min(i.maxSamples,R.samples)}function Ot(R){const M=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function ct(R){const M=o.render.frame;h.get(R)!==M&&(h.set(R,M),R.update())}function yt(R,M){const D=R.colorSpace,Y=R.format,j=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||D!==dn&&D!==Gi&&(it.getTransfer(D)===dt?(Y!==On||j!==wn)&&Ee("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):De("WebGLTextures: Unsupported texture color space:",D)),M}function Te(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=U,this.setTexture2D=B,this.setTexture2DArray=H,this.setTexture3D=O,this.setTextureCube=Q,this.rebindTextures=Yt,this.setupRenderTarget=rt,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=Dt,this.setupDepthRenderbuffer=Be,this.setupFrameBufferTexture=re,this.useMultisampledRTT=Ot,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Ab(s,e){function t(n,i=Gi){let r;const o=it.getTransfer(i);if(n===wn)return s.UNSIGNED_BYTE;if(n===Nh)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Uh)return s.UNSIGNED_SHORT_5_5_5_1;if(n===vp)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===yp)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===_p)return s.BYTE;if(n===xp)return s.SHORT;if(n===Kr)return s.UNSIGNED_SHORT;if(n===Dh)return s.INT;if(n===ci)return s.UNSIGNED_INT;if(n===Fn)return s.FLOAT;if(n===Pi)return s.HALF_FLOAT;if(n===Mp)return s.ALPHA;if(n===bp)return s.RGB;if(n===On)return s.RGBA;if(n===Ii)return s.DEPTH_COMPONENT;if(n===ls)return s.DEPTH_STENCIL;if(n===Fh)return s.RED;if(n===Oh)return s.RED_INTEGER;if(n===Qs)return s.RG;if(n===zh)return s.RG_INTEGER;if(n===Bh)return s.RGBA_INTEGER;if(n===fa||n===pa||n===ma||n===ga)if(o===dt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===fa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===pa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===fa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===pa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ma)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ga)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Tl||n===wl||n===El||n===Al)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Tl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===wl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===El)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Al)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Rl||n===Cl||n===Pl||n===Il||n===Ll||n===Dl||n===Nl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Rl||n===Cl)return o===dt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Pl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Il)return r.COMPRESSED_R11_EAC;if(n===Ll)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Dl)return r.COMPRESSED_RG11_EAC;if(n===Nl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ul||n===Fl||n===Ol||n===zl||n===Bl||n===kl||n===Vl||n===Hl||n===Gl||n===Wl||n===Xl||n===ql||n===Yl||n===Kl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ul)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Fl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ol)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===zl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Bl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===kl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Vl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Hl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Gl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Wl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Xl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ql)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Yl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Kl)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===jl||n===$l||n===Zl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===jl)return o===dt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===$l)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Zl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Jl||n===Ql||n===eh||n===th)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Jl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ql)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===eh)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===th)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===jr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const Rb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Cb=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Pb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Np(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new li({vertexShader:Rb,fragmentShader:Cb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ae(new ar(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ib extends or{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",p=new Pb,m={},x=t.getContextAttributes();let y=null,b=null;const w=[],E=[],C=new Le;let v=null;const T=new un;T.viewport=new Tt;const F=new un;F.viewport=new Tt;const P=[T,F],U=new D_;let z=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let ne=w[K];return ne===void 0&&(ne=new mc,w[K]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(K){let ne=w[K];return ne===void 0&&(ne=new mc,w[K]=ne),ne.getGripSpace()},this.getHand=function(K){let ne=w[K];return ne===void 0&&(ne=new mc,w[K]=ne),ne.getHandSpace()};function B(K){const ne=E.indexOf(K.inputSource);if(ne===-1)return;const re=w[ne];re!==void 0&&(re.update(K.inputSource,K.frame,l||o),re.dispatchEvent({type:K.type,data:K.inputSource}))}function H(){i.removeEventListener("select",B),i.removeEventListener("selectstart",B),i.removeEventListener("selectend",B),i.removeEventListener("squeeze",B),i.removeEventListener("squeezestart",B),i.removeEventListener("squeezeend",B),i.removeEventListener("end",H),i.removeEventListener("inputsourceschange",O);for(let K=0;K<w.length;K++){const ne=E[K];ne!==null&&(E[K]=null,w[K].disconnect(ne))}z=null,G=null,p.reset();for(const K in m)delete m[K];e.setRenderTarget(y),f=null,d=null,u=null,i=null,b=null,bt.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&Ee("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,n.isPresenting===!0&&Ee("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(K){l=K},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(K){if(i=K,i!==null){if(y=e.getRenderTarget(),i.addEventListener("select",B),i.addEventListener("selectstart",B),i.addEventListener("selectend",B),i.addEventListener("squeeze",B),i.addEventListener("squeezestart",B),i.addEventListener("squeezeend",B),i.addEventListener("end",H),i.addEventListener("inputsourceschange",O),x.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let re=null,We=null,Ue=null;x.depth&&(Ue=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=x.stencil?ls:Ii,We=x.stencil?jr:ci);const Be={colorFormat:t.RGBA8,depthFormat:Ue,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Be),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new oi(d.textureWidth,d.textureHeight,{format:On,type:wn,depthTexture:new no(d.textureWidth,d.textureHeight,We,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const re={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,re),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new oi(f.framebufferWidth,f.framebufferHeight,{format:On,type:wn,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),bt.setContext(i),bt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function O(K){for(let ne=0;ne<K.removed.length;ne++){const re=K.removed[ne],We=E.indexOf(re);We>=0&&(E[We]=null,w[We].disconnect(re))}for(let ne=0;ne<K.added.length;ne++){const re=K.added[ne];let We=E.indexOf(re);if(We===-1){for(let Be=0;Be<w.length;Be++)if(Be>=E.length){E.push(re),We=Be;break}else if(E[Be]===null){E[Be]=re,We=Be;break}if(We===-1)break}const Ue=w[We];Ue&&Ue.connect(re)}}const Q=new A,$=new A;function de(K,ne,re){Q.setFromMatrixPosition(ne.matrixWorld),$.setFromMatrixPosition(re.matrixWorld);const We=Q.distanceTo($),Ue=ne.projectionMatrix.elements,Be=re.projectionMatrix.elements,Yt=Ue[14]/(Ue[10]-1),rt=Ue[14]/(Ue[10]+1),ht=(Ue[9]+1)/Ue[5],xt=(Ue[9]-1)/Ue[5],je=(Ue[8]-1)/Ue[0],Dt=(Be[8]+1)/Be[0],I=Yt*je,Ot=Yt*Dt,ct=We/(-je+Dt),yt=ct*-je;if(ne.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(yt),K.translateZ(ct),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Ue[10]===-1)K.projectionMatrix.copy(ne.projectionMatrix),K.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const Te=Yt+ct,R=rt+ct,M=I-yt,D=Ot+(We-yt),Y=ht*rt/R*Te,j=xt*rt/R*Te;K.projectionMatrix.makePerspective(M,D,Y,j,Te,R),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function _e(K,ne){ne===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(ne.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(i===null)return;let ne=K.near,re=K.far;p.texture!==null&&(p.depthNear>0&&(ne=p.depthNear),p.depthFar>0&&(re=p.depthFar)),U.near=F.near=T.near=ne,U.far=F.far=T.far=re,(z!==U.near||G!==U.far)&&(i.updateRenderState({depthNear:U.near,depthFar:U.far}),z=U.near,G=U.far),U.layers.mask=K.layers.mask|6,T.layers.mask=U.layers.mask&-5,F.layers.mask=U.layers.mask&-3;const We=K.parent,Ue=U.cameras;_e(U,We);for(let Be=0;Be<Ue.length;Be++)_e(Ue[Be],We);Ue.length===2?de(U,T,F):U.projectionMatrix.copy(T.projectionMatrix),me(K,U,We)};function me(K,ne,re){re===null?K.matrix.copy(ne.matrixWorld):(K.matrix.copy(re.matrixWorld),K.matrix.invert(),K.matrix.multiply(ne.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(ne.projectionMatrix),K.projectionMatrixInverse.copy(ne.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=er*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(K){c=K,d!==null&&(d.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(U)},this.getCameraTexture=function(K){return m[K]};let qe=null;function wt(K,ne){if(h=ne.getViewerPose(l||o),g=ne,h!==null){const re=h.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let We=!1;re.length!==U.cameras.length&&(U.cameras.length=0,We=!0);for(let rt=0;rt<re.length;rt++){const ht=re[rt];let xt=null;if(f!==null)xt=f.getViewport(ht);else{const Dt=u.getViewSubImage(d,ht);xt=Dt.viewport,rt===0&&(e.setRenderTargetTextures(b,Dt.colorTexture,Dt.depthStencilTexture),e.setRenderTarget(b))}let je=P[rt];je===void 0&&(je=new un,je.layers.enable(rt),je.viewport=new Tt,P[rt]=je),je.matrix.fromArray(ht.transform.matrix),je.matrix.decompose(je.position,je.quaternion,je.scale),je.projectionMatrix.fromArray(ht.projectionMatrix),je.projectionMatrixInverse.copy(je.projectionMatrix).invert(),je.viewport.set(xt.x,xt.y,xt.width,xt.height),rt===0&&(U.matrix.copy(je.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),We===!0&&U.cameras.push(je)}const Ue=i.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const rt=u.getDepthInformation(re[0]);rt&&rt.isValid&&rt.texture&&p.init(rt,i.renderState)}if(Ue&&Ue.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let rt=0;rt<re.length;rt++){const ht=re[rt].camera;if(ht){let xt=m[ht];xt||(xt=new Np,m[ht]=xt);const je=u.getCameraImage(ht);xt.sourceTexture=je}}}}for(let re=0;re<w.length;re++){const We=E[re],Ue=w[re];We!==null&&Ue!==void 0&&Ue.update(We,ne,l||o)}qe&&qe(K,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),g=null}const bt=new Hp;bt.setAnimationLoop(wt),this.setAnimationLoop=function(K){qe=K},this.dispose=function(){}}}const is=new Bn,Lb=new ze;function Db(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Up(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,x,y,b){m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),u(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,b)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),_(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?c(p,m,x,y):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===mn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===mn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const x=e.get(m),y=x.envMap,b=x.envMapRotation;y&&(p.envMap.value=y,is.copy(b),is.x*=-1,is.y*=-1,is.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(is.y*=-1,is.z*=-1),p.envMapRotation.value.setFromMatrix4(Lb.makeRotationFromEuler(is)),p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,x,y){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*x,p.scale.value=y*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,x){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===mn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){const x=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Nb(s,e,t,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,y){const b=y.program;n.uniformBlockBinding(x,b)}function l(x,y){let b=i[x.id];b===void 0&&(g(x),b=h(x),i[x.id]=b,x.addEventListener("dispose",p));const w=y.program;n.updateUBOMapping(x,w);const E=e.render.frame;r[x.id]!==E&&(d(x),r[x.id]=E)}function h(x){const y=u();x.__bindingPointIndex=y;const b=s.createBuffer(),w=x.__size,E=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,w,E),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,y,b),b}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return De("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const y=i[x.id],b=x.uniforms,w=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,y);for(let E=0,C=b.length;E<C;E++){const v=Array.isArray(b[E])?b[E]:[b[E]];for(let T=0,F=v.length;T<F;T++){const P=v[T];if(f(P,E,T,w)===!0){const U=P.__offset,z=Array.isArray(P.value)?P.value:[P.value];let G=0;for(let B=0;B<z.length;B++){const H=z[B],O=_(H);typeof H=="number"||typeof H=="boolean"?(P.__data[0]=H,s.bufferSubData(s.UNIFORM_BUFFER,U+G,P.__data)):H.isMatrix3?(P.__data[0]=H.elements[0],P.__data[1]=H.elements[1],P.__data[2]=H.elements[2],P.__data[3]=0,P.__data[4]=H.elements[3],P.__data[5]=H.elements[4],P.__data[6]=H.elements[5],P.__data[7]=0,P.__data[8]=H.elements[6],P.__data[9]=H.elements[7],P.__data[10]=H.elements[8],P.__data[11]=0):(H.toArray(P.__data,G),G+=O.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,U,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(x,y,b,w){const E=x.value,C=y+"_"+b;if(w[C]===void 0)return typeof E=="number"||typeof E=="boolean"?w[C]=E:w[C]=E.clone(),!0;{const v=w[C];if(typeof E=="number"||typeof E=="boolean"){if(v!==E)return w[C]=E,!0}else if(v.equals(E)===!1)return v.copy(E),!0}return!1}function g(x){const y=x.uniforms;let b=0;const w=16;for(let C=0,v=y.length;C<v;C++){const T=Array.isArray(y[C])?y[C]:[y[C]];for(let F=0,P=T.length;F<P;F++){const U=T[F],z=Array.isArray(U.value)?U.value:[U.value];for(let G=0,B=z.length;G<B;G++){const H=z[G],O=_(H),Q=b%w,$=Q%O.boundary,de=Q+$;b+=$,de!==0&&w-de<O.storage&&(b+=w-de),U.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=b,b+=O.storage}}}const E=b%w;return E>0&&(b+=w-E),x.__size=b,x.__cache={},this}function _(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?Ee("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ee("WebGLRenderer: Unsupported uniform value type.",x),y}function p(x){const y=x.target;y.removeEventListener("dispose",p);const b=o.indexOf(y.__bindingPointIndex);o.splice(b,1),s.deleteBuffer(i[y.id]),delete i[y.id],delete r[y.id]}function m(){for(const x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:c,update:l,dispose:m}}const Ub=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Qn=null;function Fb(){return Qn===null&&(Qn=new qh(Ub,16,16,Qs,Pi),Qn.name="DFG_LUT",Qn.minFilter=Gt,Qn.magFilter=Gt,Qn.wrapS=ni,Qn.wrapT=ni,Qn.generateMipmaps=!1,Qn.needsUpdate=!0),Qn}class Ob{constructor(e={}){const{canvas:t=ag(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=wn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;const _=f,p=new Set([Bh,zh,Oh]),m=new Set([wn,ci,Kr,jr,Nh,Uh]),x=new Uint32Array(4),y=new Int32Array(4);let b=null,w=null;const E=[],C=[];let v=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ri,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let F=!1;this._outputColorSpace=en;let P=0,U=0,z=null,G=-1,B=null;const H=new Tt,O=new Tt;let Q=null;const $=new Ie(0);let de=0,_e=t.width,me=t.height,qe=1,wt=null,bt=null;const K=new Tt(0,0,_e,me),ne=new Tt(0,0,_e,me);let re=!1;const We=new Kh;let Ue=!1,Be=!1;const Yt=new ze,rt=new A,ht=new Tt,xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let je=!1;function Dt(){return z===null?qe:1}let I=n;function Ot(S,N){return t.getContext(S,N)}try{const S={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Lh}`),t.addEventListener("webglcontextlost",Me,!1),t.addEventListener("webglcontextrestored",ke,!1),t.addEventListener("webglcontextcreationerror",Mt,!1),I===null){const N="webgl2";if(I=Ot(N,S),I===null)throw Ot(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw De("WebGLRenderer: "+S.message),S}let ct,yt,Te,R,M,D,Y,j,q,ve,ie,Pe,Fe,Z,ee,ye,be,pe,$e,L,se,te,xe;function J(){ct=new Oy(I),ct.init(),se=new Ab(I,ct),yt=new Cy(I,ct,e,se),Te=new wb(I,ct),yt.reversedDepthBuffer&&d&&Te.buffers.depth.setReversed(!0),R=new ky(I),M=new ub,D=new Eb(I,ct,Te,M,yt,se,R),Y=new Fy(T),j=new X_(I),te=new Ay(I,j),q=new zy(I,j,R,te),ve=new Hy(I,q,j,te,R),pe=new Vy(I,yt,D),ee=new Py(M),ie=new hb(T,Y,ct,yt,te,ee),Pe=new Db(T,M),Fe=new fb,Z=new vb(ct),be=new Ey(T,Y,Te,ve,g,c),ye=new Tb(T,ve,yt),xe=new Nb(I,R,yt,Te),$e=new Ry(I,ct,R),L=new By(I,ct,R),R.programs=ie.programs,T.capabilities=yt,T.extensions=ct,T.properties=M,T.renderLists=Fe,T.shadowMap=ye,T.state=Te,T.info=R}J(),_!==wn&&(v=new Wy(_,t.width,t.height,i,r));const X=new Ib(T,I);this.xr=X,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const S=ct.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=ct.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return qe},this.setPixelRatio=function(S){S!==void 0&&(qe=S,this.setSize(_e,me,!1))},this.getSize=function(S){return S.set(_e,me)},this.setSize=function(S,N,W=!0){if(X.isPresenting){Ee("WebGLRenderer: Can't change size while VR device is presenting.");return}_e=S,me=N,t.width=Math.floor(S*qe),t.height=Math.floor(N*qe),W===!0&&(t.style.width=S+"px",t.style.height=N+"px"),v!==null&&v.setSize(t.width,t.height),this.setViewport(0,0,S,N)},this.getDrawingBufferSize=function(S){return S.set(_e*qe,me*qe).floor()},this.setDrawingBufferSize=function(S,N,W){_e=S,me=N,qe=W,t.width=Math.floor(S*W),t.height=Math.floor(N*W),this.setViewport(0,0,S,N)},this.setEffects=function(S){if(_===wn){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let N=0;N<S.length;N++)if(S[N].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}v.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(H)},this.getViewport=function(S){return S.copy(K)},this.setViewport=function(S,N,W,V){S.isVector4?K.set(S.x,S.y,S.z,S.w):K.set(S,N,W,V),Te.viewport(H.copy(K).multiplyScalar(qe).round())},this.getScissor=function(S){return S.copy(ne)},this.setScissor=function(S,N,W,V){S.isVector4?ne.set(S.x,S.y,S.z,S.w):ne.set(S,N,W,V),Te.scissor(O.copy(ne).multiplyScalar(qe).round())},this.getScissorTest=function(){return re},this.setScissorTest=function(S){Te.setScissorTest(re=S)},this.setOpaqueSort=function(S){wt=S},this.setTransparentSort=function(S){bt=S},this.getClearColor=function(S){return S.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor(...arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha(...arguments)},this.clear=function(S=!0,N=!0,W=!0){let V=0;if(S){let k=!1;if(z!==null){const le=z.texture.format;k=p.has(le)}if(k){const le=z.texture.type,ge=m.has(le),he=be.getClearColor(),Se=be.getClearAlpha(),Re=he.r,He=he.g,Ze=he.b;ge?(x[0]=Re,x[1]=He,x[2]=Ze,x[3]=Se,I.clearBufferuiv(I.COLOR,0,x)):(y[0]=Re,y[1]=He,y[2]=Ze,y[3]=Se,I.clearBufferiv(I.COLOR,0,y))}else V|=I.COLOR_BUFFER_BIT}N&&(V|=I.DEPTH_BUFFER_BIT),W&&(V|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&I.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Me,!1),t.removeEventListener("webglcontextrestored",ke,!1),t.removeEventListener("webglcontextcreationerror",Mt,!1),be.dispose(),Fe.dispose(),Z.dispose(),M.dispose(),Y.dispose(),ve.dispose(),te.dispose(),xe.dispose(),ie.dispose(),X.dispose(),X.removeEventListener("sessionstart",Au),X.removeEventListener("sessionend",Ru),$i.stop()};function Me(S){S.preventDefault(),Oa("WebGLRenderer: Context Lost."),F=!0}function ke(){Oa("WebGLRenderer: Context Restored."),F=!1;const S=R.autoReset,N=ye.enabled,W=ye.autoUpdate,V=ye.needsUpdate,k=ye.type;J(),R.autoReset=S,ye.enabled=N,ye.autoUpdate=W,ye.needsUpdate=V,ye.type=k}function Mt(S){De("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function ut(S){const N=S.target;N.removeEventListener("dispose",ut),mi(N)}function mi(S){gi(S),M.remove(S)}function gi(S){const N=M.get(S).programs;N!==void 0&&(N.forEach(function(W){ie.releaseProgram(W)}),S.isShaderMaterial&&ie.releaseShaderCache(S))}this.renderBufferDirect=function(S,N,W,V,k,le){N===null&&(N=xt);const ge=k.isMesh&&k.matrixWorld.determinant()<0,he=v0(S,N,W,V,k);Te.setMaterial(V,ge);let Se=W.index,Re=1;if(V.wireframe===!0){if(Se=q.getWireframeAttribute(W),Se===void 0)return;Re=2}const He=W.drawRange,Ze=W.attributes.position;let Ce=He.start*Re,gt=(He.start+He.count)*Re;le!==null&&(Ce=Math.max(Ce,le.start*Re),gt=Math.min(gt,(le.start+le.count)*Re)),Se!==null?(Ce=Math.max(Ce,0),gt=Math.min(gt,Se.count)):Ze!=null&&(Ce=Math.max(Ce,0),gt=Math.min(gt,Ze.count));const Nt=gt-Ce;if(Nt<0||Nt===1/0)return;te.setup(k,V,he,W,Se);let Ct,_t=$e;if(Se!==null&&(Ct=j.get(Se),_t=L,_t.setIndex(Ct)),k.isMesh)V.wireframe===!0?(Te.setLineWidth(V.wireframeLinewidth*Dt()),_t.setMode(I.LINES)):_t.setMode(I.TRIANGLES);else if(k.isLine){let nn=V.linewidth;nn===void 0&&(nn=1),Te.setLineWidth(nn*Dt()),k.isLineSegments?_t.setMode(I.LINES):k.isLineLoop?_t.setMode(I.LINE_LOOP):_t.setMode(I.LINE_STRIP)}else k.isPoints?_t.setMode(I.POINTS):k.isSprite&&_t.setMode(I.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)za("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),_t.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(ct.get("WEBGL_multi_draw"))_t.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const nn=k._multiDrawStarts,we=k._multiDrawCounts,yn=k._multiDrawCount,ot=Se?j.get(Se).bytesPerElement:1,kn=M.get(V).currentProgram.getUniforms();for(let Zn=0;Zn<yn;Zn++)kn.setValue(I,"_gl_DrawID",Zn),_t.render(nn[Zn]/ot,we[Zn])}else if(k.isInstancedMesh)_t.renderInstances(Ce,Nt,k.count);else if(W.isInstancedBufferGeometry){const nn=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,we=Math.min(W.instanceCount,nn);_t.renderInstances(Ce,Nt,we)}else _t.render(Ce,Nt)};function Eu(S,N,W){S.transparent===!0&&S.side===Dn&&S.forceSinglePass===!1?(S.side=mn,S.needsUpdate=!0,ho(S,N,W),S.side=Ci,S.needsUpdate=!0,ho(S,N,W),S.side=Dn):ho(S,N,W)}this.compile=function(S,N,W=null){W===null&&(W=S),w=Z.get(W),w.init(N),C.push(w),W.traverseVisible(function(k){k.isLight&&k.layers.test(N.layers)&&(w.pushLight(k),k.castShadow&&w.pushShadow(k))}),S!==W&&S.traverseVisible(function(k){k.isLight&&k.layers.test(N.layers)&&(w.pushLight(k),k.castShadow&&w.pushShadow(k))}),w.setupLights();const V=new Set;return S.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const le=k.material;if(le)if(Array.isArray(le))for(let ge=0;ge<le.length;ge++){const he=le[ge];Eu(he,W,k),V.add(he)}else Eu(le,W,k),V.add(le)}),w=C.pop(),V},this.compileAsync=function(S,N,W=null){const V=this.compile(S,N,W);return new Promise(k=>{function le(){if(V.forEach(function(ge){M.get(ge).currentProgram.isReady()&&V.delete(ge)}),V.size===0){k(S);return}setTimeout(le,10)}ct.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let rc=null;function x0(S){rc&&rc(S)}function Au(){$i.stop()}function Ru(){$i.start()}const $i=new Hp;$i.setAnimationLoop(x0),typeof self<"u"&&$i.setContext(self),this.setAnimationLoop=function(S){rc=S,X.setAnimationLoop(S),S===null?$i.stop():$i.start()},X.addEventListener("sessionstart",Au),X.addEventListener("sessionend",Ru),this.render=function(S,N){if(N!==void 0&&N.isCamera!==!0){De("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;const W=X.enabled===!0&&X.isPresenting===!0,V=v!==null&&(z===null||W)&&v.begin(T,z);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(v===null||v.isCompositing()===!1)&&(X.cameraAutoUpdate===!0&&X.updateCamera(N),N=X.getCamera()),S.isScene===!0&&S.onBeforeRender(T,S,N,z),w=Z.get(S,C.length),w.init(N),C.push(w),Yt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),We.setFromProjectionMatrix(Yt,ii,N.reversedDepth),Be=this.localClippingEnabled,Ue=ee.init(this.clippingPlanes,Be),b=Fe.get(S,E.length),b.init(),E.push(b),X.enabled===!0&&X.isPresenting===!0){const ge=T.xr.getDepthSensingMesh();ge!==null&&oc(ge,N,-1/0,T.sortObjects)}oc(S,N,0,T.sortObjects),b.finish(),T.sortObjects===!0&&b.sort(wt,bt),je=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,je&&be.addToRenderList(b,S),this.info.render.frame++,Ue===!0&&ee.beginShadows();const k=w.state.shadowsArray;if(ye.render(k,S,N),Ue===!0&&ee.endShadows(),this.info.autoReset===!0&&this.info.reset(),(V&&v.hasRenderPass())===!1){const ge=b.opaque,he=b.transmissive;if(w.setupLights(),N.isArrayCamera){const Se=N.cameras;if(he.length>0)for(let Re=0,He=Se.length;Re<He;Re++){const Ze=Se[Re];Pu(ge,he,S,Ze)}je&&be.render(S);for(let Re=0,He=Se.length;Re<He;Re++){const Ze=Se[Re];Cu(b,S,Ze,Ze.viewport)}}else he.length>0&&Pu(ge,he,S,N),je&&be.render(S),Cu(b,S,N)}z!==null&&U===0&&(D.updateMultisampleRenderTarget(z),D.updateRenderTargetMipmap(z)),V&&v.end(T),S.isScene===!0&&S.onAfterRender(T,S,N),te.resetDefaultState(),G=-1,B=null,C.pop(),C.length>0?(w=C[C.length-1],Ue===!0&&ee.setGlobalState(T.clippingPlanes,w.state.camera)):w=null,E.pop(),E.length>0?b=E[E.length-1]:b=null};function oc(S,N,W,V){if(S.visible===!1)return;if(S.layers.test(N.layers)){if(S.isGroup)W=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(N);else if(S.isLight)w.pushLight(S),S.castShadow&&w.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||We.intersectsSprite(S)){V&&ht.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Yt);const ge=ve.update(S),he=S.material;he.visible&&b.push(S,ge,he,W,ht.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||We.intersectsObject(S))){const ge=ve.update(S),he=S.material;if(V&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),ht.copy(S.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),ht.copy(ge.boundingSphere.center)),ht.applyMatrix4(S.matrixWorld).applyMatrix4(Yt)),Array.isArray(he)){const Se=ge.groups;for(let Re=0,He=Se.length;Re<He;Re++){const Ze=Se[Re],Ce=he[Ze.materialIndex];Ce&&Ce.visible&&b.push(S,ge,Ce,W,ht.z,Ze)}}else he.visible&&b.push(S,ge,he,W,ht.z,null)}}const le=S.children;for(let ge=0,he=le.length;ge<he;ge++)oc(le[ge],N,W,V)}function Cu(S,N,W,V){const{opaque:k,transmissive:le,transparent:ge}=S;w.setupLightsView(W),Ue===!0&&ee.setGlobalState(T.clippingPlanes,W),V&&Te.viewport(H.copy(V)),k.length>0&&lo(k,N,W),le.length>0&&lo(le,N,W),ge.length>0&&lo(ge,N,W),Te.buffers.depth.setTest(!0),Te.buffers.depth.setMask(!0),Te.buffers.color.setMask(!0),Te.setPolygonOffset(!1)}function Pu(S,N,W,V){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[V.id]===void 0){const Ce=ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[V.id]=new oi(1,1,{generateMipmaps:!0,type:Ce?Pi:wn,minFilter:Ti,samples:Math.max(4,yt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:it.workingColorSpace})}const le=w.state.transmissionRenderTarget[V.id],ge=V.viewport||H;le.setSize(ge.z*T.transmissionResolutionScale,ge.w*T.transmissionResolutionScale);const he=T.getRenderTarget(),Se=T.getActiveCubeFace(),Re=T.getActiveMipmapLevel();T.setRenderTarget(le),T.getClearColor($),de=T.getClearAlpha(),de<1&&T.setClearColor(16777215,.5),T.clear(),je&&be.render(W);const He=T.toneMapping;T.toneMapping=ri;const Ze=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),w.setupLightsView(V),Ue===!0&&ee.setGlobalState(T.clippingPlanes,V),lo(S,W,V),D.updateMultisampleRenderTarget(le),D.updateRenderTargetMipmap(le),ct.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let gt=0,Nt=N.length;gt<Nt;gt++){const Ct=N[gt],{object:_t,geometry:nn,material:we,group:yn}=Ct;if(we.side===Dn&&_t.layers.test(V.layers)){const ot=we.side;we.side=mn,we.needsUpdate=!0,Iu(_t,W,V,nn,we,yn),we.side=ot,we.needsUpdate=!0,Ce=!0}}Ce===!0&&(D.updateMultisampleRenderTarget(le),D.updateRenderTargetMipmap(le))}T.setRenderTarget(he,Se,Re),T.setClearColor($,de),Ze!==void 0&&(V.viewport=Ze),T.toneMapping=He}function lo(S,N,W){const V=N.isScene===!0?N.overrideMaterial:null;for(let k=0,le=S.length;k<le;k++){const ge=S[k],{object:he,geometry:Se,group:Re}=ge;let He=ge.material;He.allowOverride===!0&&V!==null&&(He=V),he.layers.test(W.layers)&&Iu(he,N,W,Se,He,Re)}}function Iu(S,N,W,V,k,le){S.onBeforeRender(T,N,W,V,k,le),S.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),k.onBeforeRender(T,N,W,V,S,le),k.transparent===!0&&k.side===Dn&&k.forceSinglePass===!1?(k.side=mn,k.needsUpdate=!0,T.renderBufferDirect(W,N,V,k,S,le),k.side=Ci,k.needsUpdate=!0,T.renderBufferDirect(W,N,V,k,S,le),k.side=Dn):T.renderBufferDirect(W,N,V,k,S,le),S.onAfterRender(T,N,W,V,k,le)}function ho(S,N,W){N.isScene!==!0&&(N=xt);const V=M.get(S),k=w.state.lights,le=w.state.shadowsArray,ge=k.state.version,he=ie.getParameters(S,k.state,le,N,W),Se=ie.getProgramCacheKey(he);let Re=V.programs;V.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?N.environment:null,V.fog=N.fog;const He=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;V.envMap=Y.get(S.envMap||V.environment,He),V.envMapRotation=V.environment!==null&&S.envMap===null?N.environmentRotation:S.envMapRotation,Re===void 0&&(S.addEventListener("dispose",ut),Re=new Map,V.programs=Re);let Ze=Re.get(Se);if(Ze!==void 0){if(V.currentProgram===Ze&&V.lightsStateVersion===ge)return Du(S,he),Ze}else he.uniforms=ie.getUniforms(S),S.onBeforeCompile(he,T),Ze=ie.acquireProgram(he,Se),Re.set(Se,Ze),V.uniforms=he.uniforms;const Ce=V.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Ce.clippingPlanes=ee.uniform),Du(S,he),V.needsLights=M0(S),V.lightsStateVersion=ge,V.needsLights&&(Ce.ambientLightColor.value=k.state.ambient,Ce.lightProbe.value=k.state.probe,Ce.directionalLights.value=k.state.directional,Ce.directionalLightShadows.value=k.state.directionalShadow,Ce.spotLights.value=k.state.spot,Ce.spotLightShadows.value=k.state.spotShadow,Ce.rectAreaLights.value=k.state.rectArea,Ce.ltc_1.value=k.state.rectAreaLTC1,Ce.ltc_2.value=k.state.rectAreaLTC2,Ce.pointLights.value=k.state.point,Ce.pointLightShadows.value=k.state.pointShadow,Ce.hemisphereLights.value=k.state.hemi,Ce.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ce.spotLightMatrix.value=k.state.spotLightMatrix,Ce.spotLightMap.value=k.state.spotLightMap,Ce.pointShadowMatrix.value=k.state.pointShadowMatrix),V.currentProgram=Ze,V.uniformsList=null,Ze}function Lu(S){if(S.uniformsList===null){const N=S.currentProgram.getUniforms();S.uniformsList=_a.seqWithValue(N.seq,S.uniforms)}return S.uniformsList}function Du(S,N){const W=M.get(S);W.outputColorSpace=N.outputColorSpace,W.batching=N.batching,W.batchingColor=N.batchingColor,W.instancing=N.instancing,W.instancingColor=N.instancingColor,W.instancingMorph=N.instancingMorph,W.skinning=N.skinning,W.morphTargets=N.morphTargets,W.morphNormals=N.morphNormals,W.morphColors=N.morphColors,W.morphTargetsCount=N.morphTargetsCount,W.numClippingPlanes=N.numClippingPlanes,W.numIntersection=N.numClipIntersection,W.vertexAlphas=N.vertexAlphas,W.vertexTangents=N.vertexTangents,W.toneMapping=N.toneMapping}function v0(S,N,W,V,k){N.isScene!==!0&&(N=xt),D.resetTextureUnits();const le=N.fog,ge=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?N.environment:null,he=z===null?T.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:dn,Se=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Re=Y.get(V.envMap||ge,Se),He=V.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ze=!!W.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ce=!!W.morphAttributes.position,gt=!!W.morphAttributes.normal,Nt=!!W.morphAttributes.color;let Ct=ri;V.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(Ct=T.toneMapping);const _t=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,nn=_t!==void 0?_t.length:0,we=M.get(V),yn=w.state.lights;if(Ue===!0&&(Be===!0||S!==B)){const Kt=S===B&&V.id===G;ee.setState(V,S,Kt)}let ot=!1;V.version===we.__version?(we.needsLights&&we.lightsStateVersion!==yn.state.version||we.outputColorSpace!==he||k.isBatchedMesh&&we.batching===!1||!k.isBatchedMesh&&we.batching===!0||k.isBatchedMesh&&we.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&we.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&we.instancing===!1||!k.isInstancedMesh&&we.instancing===!0||k.isSkinnedMesh&&we.skinning===!1||!k.isSkinnedMesh&&we.skinning===!0||k.isInstancedMesh&&we.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&we.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&we.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&we.instancingMorph===!1&&k.morphTexture!==null||we.envMap!==Re||V.fog===!0&&we.fog!==le||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==ee.numPlanes||we.numIntersection!==ee.numIntersection)||we.vertexAlphas!==He||we.vertexTangents!==Ze||we.morphTargets!==Ce||we.morphNormals!==gt||we.morphColors!==Nt||we.toneMapping!==Ct||we.morphTargetsCount!==nn)&&(ot=!0):(ot=!0,we.__version=V.version);let kn=we.currentProgram;ot===!0&&(kn=ho(V,N,k));let Zn=!1,Zi=!1,gs=!1;const vt=kn.getUniforms(),Jt=we.uniforms;if(Te.useProgram(kn.program)&&(Zn=!0,Zi=!0,gs=!0),V.id!==G&&(G=V.id,Zi=!0),Zn||B!==S){Te.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),vt.setValue(I,"projectionMatrix",S.projectionMatrix),vt.setValue(I,"viewMatrix",S.matrixWorldInverse);const Di=vt.map.cameraPosition;Di!==void 0&&Di.setValue(I,rt.setFromMatrixPosition(S.matrixWorld)),yt.logarithmicDepthBuffer&&vt.setValue(I,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&vt.setValue(I,"isOrthographic",S.isOrthographicCamera===!0),B!==S&&(B=S,Zi=!0,gs=!0)}if(we.needsLights&&(yn.state.directionalShadowMap.length>0&&vt.setValue(I,"directionalShadowMap",yn.state.directionalShadowMap,D),yn.state.spotShadowMap.length>0&&vt.setValue(I,"spotShadowMap",yn.state.spotShadowMap,D),yn.state.pointShadowMap.length>0&&vt.setValue(I,"pointShadowMap",yn.state.pointShadowMap,D)),k.isSkinnedMesh){vt.setOptional(I,k,"bindMatrix"),vt.setOptional(I,k,"bindMatrixInverse");const Kt=k.skeleton;Kt&&(Kt.boneTexture===null&&Kt.computeBoneTexture(),vt.setValue(I,"boneTexture",Kt.boneTexture,D))}k.isBatchedMesh&&(vt.setOptional(I,k,"batchingTexture"),vt.setValue(I,"batchingTexture",k._matricesTexture,D),vt.setOptional(I,k,"batchingIdTexture"),vt.setValue(I,"batchingIdTexture",k._indirectTexture,D),vt.setOptional(I,k,"batchingColorTexture"),k._colorsTexture!==null&&vt.setValue(I,"batchingColorTexture",k._colorsTexture,D));const Li=W.morphAttributes;if((Li.position!==void 0||Li.normal!==void 0||Li.color!==void 0)&&pe.update(k,W,kn),(Zi||we.receiveShadow!==k.receiveShadow)&&(we.receiveShadow=k.receiveShadow,vt.setValue(I,"receiveShadow",k.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&N.environment!==null&&(Jt.envMapIntensity.value=N.environmentIntensity),Jt.dfgLUT!==void 0&&(Jt.dfgLUT.value=Fb()),Zi&&(vt.setValue(I,"toneMappingExposure",T.toneMappingExposure),we.needsLights&&y0(Jt,gs),le&&V.fog===!0&&Pe.refreshFogUniforms(Jt,le),Pe.refreshMaterialUniforms(Jt,V,qe,me,w.state.transmissionRenderTarget[S.id]),_a.upload(I,Lu(we),Jt,D)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(_a.upload(I,Lu(we),Jt,D),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&vt.setValue(I,"center",k.center),vt.setValue(I,"modelViewMatrix",k.modelViewMatrix),vt.setValue(I,"normalMatrix",k.normalMatrix),vt.setValue(I,"modelMatrix",k.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Kt=V.uniformsGroups;for(let Di=0,_s=Kt.length;Di<_s;Di++){const Nu=Kt[Di];xe.update(Nu,kn),xe.bind(Nu,kn)}}return kn}function y0(S,N){S.ambientLightColor.needsUpdate=N,S.lightProbe.needsUpdate=N,S.directionalLights.needsUpdate=N,S.directionalLightShadows.needsUpdate=N,S.pointLights.needsUpdate=N,S.pointLightShadows.needsUpdate=N,S.spotLights.needsUpdate=N,S.spotLightShadows.needsUpdate=N,S.rectAreaLights.needsUpdate=N,S.hemisphereLights.needsUpdate=N}function M0(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(S,N,W){const V=M.get(S);V.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),M.get(S.texture).__webglTexture=N,M.get(S.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:W,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,N){const W=M.get(S);W.__webglFramebuffer=N,W.__useDefaultFramebuffer=N===void 0};const b0=I.createFramebuffer();this.setRenderTarget=function(S,N=0,W=0){z=S,P=N,U=W;let V=null,k=!1,le=!1;if(S){const he=M.get(S);if(he.__useDefaultFramebuffer!==void 0){Te.bindFramebuffer(I.FRAMEBUFFER,he.__webglFramebuffer),H.copy(S.viewport),O.copy(S.scissor),Q=S.scissorTest,Te.viewport(H),Te.scissor(O),Te.setScissorTest(Q),G=-1;return}else if(he.__webglFramebuffer===void 0)D.setupRenderTarget(S);else if(he.__hasExternalTextures)D.rebindTextures(S,M.get(S.texture).__webglTexture,M.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const He=S.depthTexture;if(he.__boundDepthTexture!==He){if(He!==null&&M.has(He)&&(S.width!==He.image.width||S.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(S)}}const Se=S.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(le=!0);const Re=M.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Re[N])?V=Re[N][W]:V=Re[N],k=!0):S.samples>0&&D.useMultisampledRTT(S)===!1?V=M.get(S).__webglMultisampledFramebuffer:Array.isArray(Re)?V=Re[W]:V=Re,H.copy(S.viewport),O.copy(S.scissor),Q=S.scissorTest}else H.copy(K).multiplyScalar(qe).floor(),O.copy(ne).multiplyScalar(qe).floor(),Q=re;if(W!==0&&(V=b0),Te.bindFramebuffer(I.FRAMEBUFFER,V)&&Te.drawBuffers(S,V),Te.viewport(H),Te.scissor(O),Te.setScissorTest(Q),k){const he=M.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+N,he.__webglTexture,W)}else if(le){const he=N;for(let Se=0;Se<S.textures.length;Se++){const Re=M.get(S.textures[Se]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Se,Re.__webglTexture,W,he)}}else if(S!==null&&W!==0){const he=M.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,he.__webglTexture,W)}G=-1},this.readRenderTargetPixels=function(S,N,W,V,k,le,ge,he=0){if(!(S&&S.isWebGLRenderTarget)){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=M.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ge!==void 0&&(Se=Se[ge]),Se){Te.bindFramebuffer(I.FRAMEBUFFER,Se);try{const Re=S.textures[he],He=Re.format,Ze=Re.type;if(S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+he),!yt.textureFormatReadable(He)){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!yt.textureTypeReadable(Ze)){De("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=S.width-V&&W>=0&&W<=S.height-k&&I.readPixels(N,W,V,k,se.convert(He),se.convert(Ze),le)}finally{const Re=z!==null?M.get(z).__webglFramebuffer:null;Te.bindFramebuffer(I.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(S,N,W,V,k,le,ge,he=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=M.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ge!==void 0&&(Se=Se[ge]),Se)if(N>=0&&N<=S.width-V&&W>=0&&W<=S.height-k){Te.bindFramebuffer(I.FRAMEBUFFER,Se);const Re=S.textures[he],He=Re.format,Ze=Re.type;if(S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+he),!yt.textureFormatReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!yt.textureTypeReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ce=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Ce),I.bufferData(I.PIXEL_PACK_BUFFER,le.byteLength,I.STREAM_READ),I.readPixels(N,W,V,k,se.convert(He),se.convert(Ze),0);const gt=z!==null?M.get(z).__webglFramebuffer:null;Te.bindFramebuffer(I.FRAMEBUFFER,gt);const Nt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await cg(I,Nt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Ce),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,le),I.deleteBuffer(Ce),I.deleteSync(Nt),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,N=null,W=0){const V=Math.pow(2,-W),k=Math.floor(S.image.width*V),le=Math.floor(S.image.height*V),ge=N!==null?N.x:0,he=N!==null?N.y:0;D.setTexture2D(S,0),I.copyTexSubImage2D(I.TEXTURE_2D,W,0,0,ge,he,k,le),Te.unbindTexture()};const S0=I.createFramebuffer(),T0=I.createFramebuffer();this.copyTextureToTexture=function(S,N,W=null,V=null,k=0,le=0){let ge,he,Se,Re,He,Ze,Ce,gt,Nt;const Ct=S.isCompressedTexture?S.mipmaps[le]:S.image;if(W!==null)ge=W.max.x-W.min.x,he=W.max.y-W.min.y,Se=W.isBox3?W.max.z-W.min.z:1,Re=W.min.x,He=W.min.y,Ze=W.isBox3?W.min.z:0;else{const Jt=Math.pow(2,-k);ge=Math.floor(Ct.width*Jt),he=Math.floor(Ct.height*Jt),S.isDataArrayTexture?Se=Ct.depth:S.isData3DTexture?Se=Math.floor(Ct.depth*Jt):Se=1,Re=0,He=0,Ze=0}V!==null?(Ce=V.x,gt=V.y,Nt=V.z):(Ce=0,gt=0,Nt=0);const _t=se.convert(N.format),nn=se.convert(N.type);let we;N.isData3DTexture?(D.setTexture3D(N,0),we=I.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(D.setTexture2DArray(N,0),we=I.TEXTURE_2D_ARRAY):(D.setTexture2D(N,0),we=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,N.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,N.unpackAlignment);const yn=I.getParameter(I.UNPACK_ROW_LENGTH),ot=I.getParameter(I.UNPACK_IMAGE_HEIGHT),kn=I.getParameter(I.UNPACK_SKIP_PIXELS),Zn=I.getParameter(I.UNPACK_SKIP_ROWS),Zi=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,Ct.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Ct.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Re),I.pixelStorei(I.UNPACK_SKIP_ROWS,He),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ze);const gs=S.isDataArrayTexture||S.isData3DTexture,vt=N.isDataArrayTexture||N.isData3DTexture;if(S.isDepthTexture){const Jt=M.get(S),Li=M.get(N),Kt=M.get(Jt.__renderTarget),Di=M.get(Li.__renderTarget);Te.bindFramebuffer(I.READ_FRAMEBUFFER,Kt.__webglFramebuffer),Te.bindFramebuffer(I.DRAW_FRAMEBUFFER,Di.__webglFramebuffer);for(let _s=0;_s<Se;_s++)gs&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,M.get(S).__webglTexture,k,Ze+_s),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,M.get(N).__webglTexture,le,Nt+_s)),I.blitFramebuffer(Re,He,ge,he,Ce,gt,ge,he,I.DEPTH_BUFFER_BIT,I.NEAREST);Te.bindFramebuffer(I.READ_FRAMEBUFFER,null),Te.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(k!==0||S.isRenderTargetTexture||M.has(S)){const Jt=M.get(S),Li=M.get(N);Te.bindFramebuffer(I.READ_FRAMEBUFFER,S0),Te.bindFramebuffer(I.DRAW_FRAMEBUFFER,T0);for(let Kt=0;Kt<Se;Kt++)gs?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Jt.__webglTexture,k,Ze+Kt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Jt.__webglTexture,k),vt?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Li.__webglTexture,le,Nt+Kt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Li.__webglTexture,le),k!==0?I.blitFramebuffer(Re,He,ge,he,Ce,gt,ge,he,I.COLOR_BUFFER_BIT,I.NEAREST):vt?I.copyTexSubImage3D(we,le,Ce,gt,Nt+Kt,Re,He,ge,he):I.copyTexSubImage2D(we,le,Ce,gt,Re,He,ge,he);Te.bindFramebuffer(I.READ_FRAMEBUFFER,null),Te.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else vt?S.isDataTexture||S.isData3DTexture?I.texSubImage3D(we,le,Ce,gt,Nt,ge,he,Se,_t,nn,Ct.data):N.isCompressedArrayTexture?I.compressedTexSubImage3D(we,le,Ce,gt,Nt,ge,he,Se,_t,Ct.data):I.texSubImage3D(we,le,Ce,gt,Nt,ge,he,Se,_t,nn,Ct):S.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,le,Ce,gt,ge,he,_t,nn,Ct.data):S.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,le,Ce,gt,Ct.width,Ct.height,_t,Ct.data):I.texSubImage2D(I.TEXTURE_2D,le,Ce,gt,ge,he,_t,nn,Ct);I.pixelStorei(I.UNPACK_ROW_LENGTH,yn),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ot),I.pixelStorei(I.UNPACK_SKIP_PIXELS,kn),I.pixelStorei(I.UNPACK_SKIP_ROWS,Zn),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Zi),le===0&&N.generateMipmaps&&I.generateMipmap(we),Te.unbindTexture()},this.initRenderTarget=function(S){M.get(S).__webglFramebuffer===void 0&&D.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?D.setTextureCube(S,0):S.isData3DTexture?D.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?D.setTexture2DArray(S,0):D.setTexture2D(S,0),Te.unbindTexture()},this.resetState=function(){P=0,U=0,z=null,Te.reset(),te.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ii}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=it._getDrawingBufferColorSpace(e),t.unpackColorSpace=it._getUnpackColorSpace()}}const tf=10,zb=1.9,Bb=9,kb=24,Wo=9900;class Vb{constructor(e){this.camera=e,this.position=new A(0,0,0),this.aimAngle=0,this.mouseWorld=new A,this.keys={w:!1,a:!1,s:!1,d:!1},this.onEPress=null,this._lastMoveAngle=0,this._isAiming=!1,this._camZoom=1,this._vy=0,this._onGround=!0,this._jumpTrigger=!1,this._sprinting=!1,this._velX=0,this._velZ=0,this._recoil=0,this._aimRMB=!1,this._aimCtrl=!1,this._lastKeyTap={w:0,a:0,s:0,d:0},this.onEmergencyBrake=null,document.addEventListener("mousedown",t=>{t.button===2&&(this._aimRMB=!0,this._isAiming=!0)}),document.addEventListener("mouseup",t=>{t.button===2&&(this._aimRMB=!1,this._isAiming=this._aimCtrl)}),document.addEventListener("contextmenu",t=>t.preventDefault()),document.addEventListener("wheel",t=>{t.preventDefault(),this._camZoom=Math.max(.3,Math.min(2.5,this._camZoom+t.deltaY*.001))},{passive:!1}),this.raycaster=new Vp,this.groundPlane=new Hi(new A(0,1,0),0),this.mouseNDC=new Le,document.addEventListener("keydown",t=>{var i;const n=t.key.toLowerCase();if(n in this.keys){if(!t.repeat&&!this.keys[n]){const r=performance.now();if(r-this._lastKeyTap[n]<250&&Math.sqrt(this._velX*this._velX+this._velZ*this._velZ)>3){const a=.7071067811865476,c={w:{x:0,z:-1},s:{x:0,z:1},a:{x:-1,z:0},d:{x:1,z:0}}[n],l=c.x*a+c.z*a,h=-c.x*a+c.z*a;l*this._velX+h*this._velZ<-1.5&&(this._velX*=.12,this._velZ*=.12,(i=this.onEmergencyBrake)==null||i.call(this))}this._lastKeyTap[n]=r}this.keys[n]=!0}n===" "&&(t.preventDefault(),this._jumpTrigger=!0),n==="shift"&&(this._sprinting=!0),n==="e"&&this.onEPress&&this.onEPress(),t.key==="Control"&&(t.preventDefault(),this._aimCtrl=!0,this._isAiming=!0)}),document.addEventListener("keyup",t=>{const n=t.key.toLowerCase();n in this.keys&&(this.keys[n]=!1),n==="shift"&&(this._sprinting=!1),t.key==="Control"&&(this._aimCtrl=!1,this._isAiming=this._aimRMB)}),document.addEventListener("mousemove",t=>{this.mouseNDC.x=t.clientX/window.innerWidth*2-1,this.mouseNDC.y=-(t.clientY/window.innerHeight)*2+1})}applyRecoil(){this._recoil=1}update(e,t,n=1,i=!1){const r=this._sprinting?zb:1,o=new A;if(this.keys.w&&(o.z-=1),this.keys.s&&(o.z+=1),this.keys.a&&(o.x-=1),this.keys.d&&(o.x+=1),o.length()>0){o.normalize();const _=.7071067811865476,p=o.x*_+o.z*_,m=-o.x*_+o.z*_;o.x=p,o.z=m;const x=Math.atan2(o.x,o.z),y=Math.PI/4;this._lastMoveAngle=Math.round(x/y)*y}const a=o.x*tf*n*r,c=o.z*tf*n*r;if(i){const _=o.length()>0?.3:.18,p=1-Math.exp(-e/_);this._velX+=(a-this._velX)*p,this._velZ+=(c-this._velZ)*p}else{const _=o.length()>0?5:8;this._velX+=(a-this._velX)*Math.min(1,_*e),this._velZ+=(c-this._velZ)*Math.min(1,_*e)}if(this.position.x+=this._velX*e,this.position.z+=this._velZ*e,this.position.x=Math.max(-Wo,Math.min(Wo,this.position.x)),this.position.z=Math.max(-Wo,Math.min(Wo,this.position.z)),t)for(const _ of t){if(_.active===!1||_.maxY!==void 0&&this.position.y>=_.maxY)continue;const p=_.sx/2,m=_.sz/2,x=this.position.x-_.x,y=this.position.z-_.z,b=p+.5-Math.abs(x),w=m+.5-Math.abs(y);b>0&&w>0&&(b<w?this.position.x+=Math.sign(x)*b:this.position.z+=Math.sign(y)*w)}this._jumpTrigger&&this._onGround&&(this._vy=Bb,this._onGround=!1),this._jumpTrigger=!1,this._onGround||(this._vy-=kb*e,this.position.y+=this._vy*e,this.position.y<=0&&(this.position.y=0,this._vy=0,this._onGround=!0)),this._recoil=Math.max(0,this._recoil-e/.14);const l=this._recoil*1.8,h=this._recoil*.9,u=Math.sin(this.aimAngle),d=Math.cos(this.aimAngle),f=new A(20,25,20).multiplyScalar(this._camZoom);this.camera.position.set(this.position.x+f.x-u*h,f.y+l,this.position.z+f.z-d*h),this.camera.lookAt(this.position.x,0,this.position.z),this.camera.updateMatrixWorld(),this.raycaster.setFromCamera(this.mouseNDC,this.camera);const g=new A;this.raycaster.ray.intersectPlane(this.groundPlane,g)&&(this.mouseWorld.copy(g),this.aimAngle=Math.atan2(g.x-this.position.x,g.z-this.position.z))}landOnHorse(){this.position.y=0,this._vy=0,this._onGround=!0}getPosition(){return{x:this.position.x,y:this.position.y,z:this.position.z}}getRotation(){return{x:0,y:this.aimAngle}}getMovementAngle(){return this._lastMoveAngle}isAiming(){return this._isAiming}isInAir(){return!this._onGround}isSprinting(){return this._sprinting}getAimDirection(){return new A(Math.sin(this.aimAngle),0,Math.cos(this.aimAngle)).normalize()}getFreshAimDirection(e=0){this.camera.updateMatrixWorld(),this.raycaster.setFromCamera(this.mouseNDC,this.camera);const t=new A;if(this.raycaster.ray.intersectPlane(this.groundPlane,t)){const n=t.x-this.position.x,i=t.z-this.position.z;if(n*n+i*i>.01)return new A(n,-e,i).normalize()}return this.getAimDirection()}getCameraRaycaster(){return this.camera.updateMatrixWorld(),this.raycaster.setFromCamera(this.mouseNDC,this.camera),this.raycaster}setPosition(e,t,n){this.position.set(e,0,n),this._vy=0,this._onGround=!0}}function Hb(s){const e=[],t=new P_(16771276,.55);s.add(t);const n=new ah(8952268,0);n.position.set(-80,30,-20),n.castShadow=!0,n.shadow.mapSize.set(1024,1024),n.shadow.camera.near=1,n.shadow.camera.far=350,n.shadow.camera.left=-120,n.shadow.camera.right=120,n.shadow.camera.top=120,n.shadow.camera.bottom=-120,s.add(n),s.add(n.target);const i=new ah(16764023,1.3);i.position.set(90,22,25),i.castShadow=!0,i.shadow.mapSize.set(2048,2048),i.shadow.camera.near=1,i.shadow.camera.far=350,i.shadow.camera.left=-120,i.shadow.camera.right=120,i.shadow.camera.top=120,i.shadow.camera.bottom=-120,s.add(i),s.add(i.target),s.background=new Ie(13137994),s.fog=new Xh(12085312,250,450);const r=new oe({color:8947848,roughness:.7}),o=new oe({color:6710886,roughness:.8}),a=new oe({color:8930372,roughness:.7}),c=[{x:0,z:0,sx:6,sy:8,sz:6,mat:o},{x:15,z:10,sx:10,sy:5,sz:8,mat:r},{x:-20,z:-15,sx:8,sy:6,sz:10,mat:a},{x:-10,z:20,sx:4,sy:3,sz:4,mat:r},{x:25,z:-20,sx:12,sy:4,sz:6,mat:o},{x:-40,z:30,sx:8,sy:7,sz:8,mat:r},{x:40,z:-35,sx:6,sy:10,sz:6,mat:a},{x:-35,z:-40,sx:10,sy:4,sz:10,mat:o},{x:35,z:35,sx:14,sy:3,sz:4,mat:r},{x:-15,z:0,sx:1,sy:3,sz:12,mat:o},{x:10,z:-25,sx:16,sy:2.5,sz:1,mat:r}];for(const l of c){const h=new ae(new Ae(l.sx,l.sy,l.sz),l.mat);h.position.set(l.x,l.sy/2,l.z),h.castShadow=!0,h.receiveShadow=!0,s.add(h),e.push({x:l.x,z:l.z,sx:l.sx,sy:l.sy,sz:l.sz})}return Gb(s),{colliders:e,sun:i,moon:n,ambient:t}}function Gb(s){const n=new oe({color:6041098,roughness:.95}),i=new oe({color:2756613,roughness:.97}),r=new oe({color:8014368,roughness:.95}),o=new oe({color:8018464,roughness:1}),a=new oe({color:13148240,roughness:.8}),c=(h,u,d,f,g,_,p)=>{const m=new ae(new Ae(u,d,f),h);m.position.set(1e3+g,_,1e3+p),m.castShadow=m.receiveShadow=!0,s.add(m)};c(o,34,.18,34,0,.09,0),c(n,14,6,10,0,3,0),c(i,15,2,11,0,6,0),c(i,13,1,9,0,7.5,0),c(n,.4,6,.4,-3,3,-5.3),c(n,.4,6,.4,3,3,-5.3),c(a,4,.5,.2,0,6.3,-5.2),c(n,.2,10,.2,0,5,-5.4),c(r,12,1.6,.2,-11,.8,-17),c(r,12,1.6,.2,11,.8,-17),c(r,.4,2,.4,-5,1,-17),c(r,.4,2,.4,5,1,-17),c(r,36,1.6,.2,0,.8,18),c(r,.2,1.6,36,18,.8,0),c(r,.2,1.6,36,-18,.8,0);for(const[h,u]of[[-18,-17],[18,-17],[18,18],[-18,18]])c(r,.4,2,.4,h,1,u);for(const h of[-9,0,9])c(r,.3,1.8,.3,18,.9,h),c(r,.3,1.8,.3,-18,.9,h);for(const h of[-9,0,9])c(r,.3,1.8,.3,h,.9,18);const l=new kp(16750899,4,40);l.position.set(1e3,3.5,1e3),s.add(l)}function nf(s,e){if(e===$0)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===nh||e===Sp){let t=s.getIndex();if(t===null){const o=[],a=s.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);s.setIndex(o),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===nh)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}function Wb(s){const e=new Map,t=new Map,n=s.clone();return Kp(s,n,function(i,r){e.set(r,i),t.set(i,r)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const r=i,o=e.get(i),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(c){return t.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Kp(s,e,t){t(s,e);for(let n=0;n<s.children.length;n++)Kp(s.children[n],e.children[n],t)}class fi extends ur{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new jb(t)}),this.register(function(t){return new $b(t)}),this.register(function(t){return new rS(t)}),this.register(function(t){return new oS(t)}),this.register(function(t){return new aS(t)}),this.register(function(t){return new Jb(t)}),this.register(function(t){return new Qb(t)}),this.register(function(t){return new eS(t)}),this.register(function(t){return new tS(t)}),this.register(function(t){return new Kb(t)}),this.register(function(t){return new nS(t)}),this.register(function(t){return new Zb(t)}),this.register(function(t){return new sS(t)}),this.register(function(t){return new iS(t)}),this.register(function(t){return new qb(t)}),this.register(function(t){return new sf(t,et.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new sf(t,et.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new cS(t)})}load(e,t,n,i){const r=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const l=Vr.extractUrlBase(e);o=Vr.resolveURL(l,this.path)}else o=Vr.extractUrlBase(e);this.manager.itemStart(e);const a=function(l){i?i(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new zp(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,o,function(h){t(h),r.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const o={},a={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===jp){try{o[et.KHR_BINARY_GLTF]=new lS(e)}catch(u){i&&i(u);return}r=JSON.parse(o[et.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new bS(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case et.KHR_MATERIALS_UNLIT:o[u]=new Yb;break;case et.KHR_DRACO_MESH_COMPRESSION:o[u]=new hS(r,this.dracoLoader);break;case et.KHR_TEXTURE_TRANSFORM:o[u]=new uS;break;case et.KHR_MESH_QUANTIZATION:o[u]=new dS;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function Xb(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}function Ft(s,e,t){const n=s.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const et={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class qb{constructor(e){this.parser=e,this.name=et.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let l;const h=new Ie(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],dn);const u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new ah(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new kp(h),l.distance=u;break;case"spot":l=new A_(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),ei(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),i=Promise.resolve(l),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(t.cache,a,c)})}}class Yb{constructor(){this.name=et.KHR_MATERIALS_UNLIT}getMaterialType(){return Zt}extendParams(e,t,n){const i=[];e.color=new Ie(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],dn),e.opacity=o[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,en))}return Promise.all(i)}}class Kb{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class jb{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?di:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Le(r,r)}return Promise.all(i)}}class $b{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?di:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class Zb{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?di:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class Jb{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?di:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new Ie(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],dn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,en)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class Qb{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?di:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class eS{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?di:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ie().setRGB(r[0],r[1],r[2],dn),Promise.all(i)}}class tS{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IOR}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?di:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5),Promise.resolve()}}class nS{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?di:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new Ie().setRGB(r[0],r[1],r[2],dn),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,en)),Promise.all(i)}}class iS{constructor(e){this.parser=e,this.name=et.EXT_MATERIALS_BUMP}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?di:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class sS{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ft(this.parser,e,this.name)!==null?di:null}extendMaterialParams(e,t){const n=Ft(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class rS{constructor(e){this.parser=e,this.name=et.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}}class oS{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=i.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}}class aS{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=i.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}}class sf{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){const c=i.byteOffset||0,l=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):o.ready.then(function(){const f=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}}class cS{constructor(e){this.name=et.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const l of i.primitives)if(l.mode!==Rn.TRIANGLES&&l.mode!==Rn.TRIANGLE_STRIP&&l.mode!==Rn.TRIANGLE_FAN&&l.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],c={};for(const l in o)a.push(this.parser.getDependency("accessor",o[l]).then(h=>(c[l]=h,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{const h=l.pop(),u=h.isGroup?h.children:[h],d=l[0].count,f=[];for(const g of u){const _=new ze,p=new A,m=new xn,x=new A(1,1,1),y=new $g(g.geometry,g.material,d);for(let b=0;b<d;b++)c.TRANSLATION&&p.fromBufferAttribute(c.TRANSLATION,b),c.ROTATION&&m.fromBufferAttribute(c.ROTATION,b),c.SCALE&&x.fromBufferAttribute(c.SCALE,b),y.setMatrixAt(b,_.compose(p,m,x));for(const b in c)if(b==="_COLOR_0"){const w=c[b];y.instanceColor=new rh(w.array,w.itemSize,w.normalized)}else b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"&&g.geometry.setAttribute(b,c[b]);At.prototype.copy.call(y,g),this.parser.assignFinalMaterial(y),f.push(y)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const jp="glTF",Ar=12,rf={JSON:1313821514,BIN:5130562};class lS{constructor(e){this.name=et.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ar),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==jp)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-Ar,r=new DataView(e,Ar);let o=0;for(;o<i;){const a=r.getUint32(o,!0);o+=4;const c=r.getUint32(o,!0);if(o+=4,c===rf.JSON){const l=new Uint8Array(e,Ar+o,a);this.content=n.decode(l)}else if(c===rf.BIN){const l=Ar+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class hS{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=et.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(const h in o){const u=uh[h]||h.toLowerCase();a[u]=o[h]}for(const h in e.attributes){const u=uh[h]||h.toLowerCase();if(o[h]!==void 0){const d=n.accessors[e.attributes[h]],f=js[d.componentType];l[u]=f.name,c[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(const g in f.attributes){const _=f.attributes[g],p=c[g];p!==void 0&&(_.normalized=p)}u(f)},a,l,dn,d)})})}}class uS{constructor(){this.name=et.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class dS{constructor(){this.name=et.KHR_MESH_QUANTIZATION}}class $p extends cr{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,g=e*l,_=g-l,p=-2*f+3*d,m=f-d,x=1-p,y=m-d+u;for(let b=0;b!==a;b++){const w=o[_+b+a],E=o[_+b+c]*h,C=o[g+b+a],v=o[g+b]*h;r[b]=x*w+y*E+p*C+m*v}return r}}const fS=new xn;class pS extends $p{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return fS.fromArray(r).normalize().toArray(r),r}}const Rn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},js={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},of={9728:Ht,9729:Gt,9984:gp,9985:da,9986:Nr,9987:Ti},af={33071:ni,33648:Ua,10497:fs},Yc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},uh={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ki={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},mS={CUBICSPLINE:void 0,LINEAR:Zr,STEP:$r},Kc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function gS(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new oe({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Ci})),s.DefaultMaterial}function ss(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function ei(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function _S(s,e,t){let n=!1,i=!1,r=!1;for(let l=0,h=e.length;l<h;l++){const u=e[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const o=[],a=[],c=[];for(let l=0,h=e.length;l<h;l++){const u=e[l];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;o.push(d)}if(i){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;a.push(d)}if(r){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;c.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){const h=l[0],u=l[1],d=l[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function xS(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function vS(s){let e;const t=s.extensions&&s.extensions[et.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+jc(t.attributes):e=s.indices+":"+jc(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+jc(s.targets[n]);return e}function jc(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function dh(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function yS(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const MS=new ze;class bS{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Xb,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;const c=a.match(/Version\/(\d+)/);i=n&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&o<98?this.textureLoader=new w_(this.options.manager):this.textureLoader=new I_(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new zp(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return ss(r,a,i),ei(a,i),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(const c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const o=t[i].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(o,a)=>{const c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(const[l,h]of o.children.entries())r(h,a.children[l])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[et.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,o){n.load(Vr.resolveURL(t.uri,i.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const o=Yc[i.type],a=js[i.componentType],c=i.normalized===!0,l=new a(i.count*o);return Promise.resolve(new Ut(l,o,c))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(o){const a=o[0],c=Yc[i.type],l=js[i.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0;let _,p;if(f&&f!==u){const m=Math.floor(d/f),x="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+m+":"+i.count;let y=t.cache.get(x);y||(_=new l(a,m*f,i.count*f/h),y=new Pp(_,f/h),t.cache.add(x,y)),p=new eo(y,c,d%f/h,g)}else a===null?_=new l(i.count*c):_=new l(a,d,i.count*c),p=new Ut(_,c,g);if(i.sparse!==void 0){const m=Yc.SCALAR,x=js[i.sparse.indices.componentType],y=i.sparse.indices.byteOffset||0,b=i.sparse.values.byteOffset||0,w=new x(o[1],y,i.sparse.count*m),E=new l(o[2],b,i.sparse.count*c);a!==null&&(p=new Ut(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let C=0,v=w.length;C<v;C++){const T=w[C];if(p.setX(T,E[C*c]),c>=2&&p.setY(T,E[C*c+1]),c>=3&&p.setZ(T,E[C*c+2]),c>=4&&p.setW(T,E[C*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=g}return p})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r];let a=this.textureLoader;if(o.uri){const c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){const i=this,r=this.json,o=r.textures[e],a=r.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);const d=(r.samplers||{})[o.sampler]||{};return h.magFilter=of[d.magFilter]||Gt,h.minFilter=of[d.minFilter]||Ti,h.wrapS=af[d.wrapS]||fs,h.wrapT=af[d.wrapT]||fs,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Ht&&h.minFilter!==Gt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const o=i.images[e],a=self.URL||self.webkitURL;let c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(u){l=!0;const d=new Blob([u],{type:o.mimeType});return c=a.createObjectURL(d),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(u){return new Promise(function(d,f){let g=d;t.isImageBitmapLoader===!0&&(g=function(_){const p=new Wt(_);p.needsUpdate=!0,d(p)}),t.load(Vr.resolveURL(u,r.path),g,void 0,f)})}).then(function(u){return l===!0&&a.revokeObjectURL(c),ei(u,o),u.userData.mimeType=o.mimeType||yS(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[et.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[et.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const c=r.associations.get(o);o=r.extensions[et.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new to,jn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new jh,jn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(i||r||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),i&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return oe}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let o;const a={},c=r.extensions||{},l=[];if(c[et.KHR_MATERIALS_UNLIT]){const u=i[et.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),l.push(u.extendParams(a,r,t))}else{const u=r.pbrMetallicRoughness||{};if(a.color=new Ie(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],dn),a.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",u.baseColorTexture,en)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=Dn);const h=r.alphaMode||Kc.OPAQUE;if(h===Kc.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===Kc.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Zt&&(l.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new Le(1,1),r.normalTexture.scale!==void 0)){const u=r.normalTexture.scale;a.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&o!==Zt&&(l.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Zt){const u=r.emissiveFactor;a.emissive=new Ie().setRGB(u[0],u[1],u[2],dn)}return r.emissiveTexture!==void 0&&o!==Zt&&l.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,en)),Promise.all(l).then(function(){const u=new o(a);return r.name&&(u.name=r.name),ei(u,r),t.associations.set(u,{materials:e}),r.extensions&&ss(i,u,r),u})}createUniqueName(e){const t=pt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(a){return n[et.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return cf(c,a,t)})}const o=[];for(let a=0,c=e.length;a<c;a++){const l=e[a],h=vS(l),u=i[h];if(u)o.push(u.promise);else{let d;l.extensions&&l.extensions[et.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=cf(new Rt,l,t),i[h]={primitive:l,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){const h=o[c].material===void 0?gS(this.cache):this.getDependency("material",o[c].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let f=0,g=h.length;f<g;f++){const _=h[f],p=o[f];let m;const x=l[f];if(p.mode===Rn.TRIANGLES||p.mode===Rn.TRIANGLE_STRIP||p.mode===Rn.TRIANGLE_FAN||p.mode===void 0)m=r.isSkinnedMesh===!0?new Yg(_,x):new ae(_,x),m.isSkinnedMesh===!0&&m.normalizeSkinWeights(),p.mode===Rn.TRIANGLE_STRIP?m.geometry=nf(m.geometry,Sp):p.mode===Rn.TRIANGLE_FAN&&(m.geometry=nf(m.geometry,nh));else if(p.mode===Rn.LINES)m=new e_(_,x);else if(p.mode===Rn.LINE_STRIP)m=new $a(_,x);else if(p.mode===Rn.LINE_LOOP)m=new t_(_,x);else if(p.mode===Rn.POINTS)m=new Ha(_,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(m.geometry.morphAttributes).length>0&&xS(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),ei(m,r),p.extensions&&ss(i,m,p),t.assignFinalMaterial(m),u.push(m)}for(let f=0,g=u.length;f<g;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&ss(i,u[0],r),u[0];const d=new Oe;r.extensions&&ss(i,d,r),t.associations.set(d,{meshes:e});for(let f=0,g=u.length;f<g;f++)d.add(u[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new un(Eg.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Qa(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),ei(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),o=i,a=[],c=[];for(let l=0,h=o.length;l<h;l++){const u=o[l];if(u){a.push(u);const d=new ze;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Yh(a,c)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,o=[],a=[],c=[],l=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){const f=i.channels[u],g=i.samplers[f.sampler],_=f.target,p=_.node,m=i.parameters!==void 0?i.parameters[g.input]:g.input,x=i.parameters!==void 0?i.parameters[g.output]:g.output;_.node!==void 0&&(o.push(this.getDependency("node",p)),a.push(this.getDependency("accessor",m)),c.push(this.getDependency("accessor",x)),l.push(g),h.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],g=u[2],_=u[3],p=u[4],m=[];for(let y=0,b=d.length;y<b;y++){const w=d[y],E=f[y],C=g[y],v=_[y],T=p[y];if(w===void 0)continue;w.updateMatrix&&w.updateMatrix();const F=n._createAnimationTracks(w,E,C,v,T);if(F)for(let P=0;P<F.length;P++)m.push(F[P])}const x=new x_(r,void 0,m);return ei(x,i),x})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const o=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=i.weights.length;c<l;c++)a.morphTargetInfluences[c]=i.weights[c]}),o})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=i.children||[];for(let l=0,h=a.length;l<h;l++)o.push(n.getDependency("node",a[l]));const c=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){const h=l[0],u=l[1],d=l[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,MS)});for(let f=0,g=u.length;f<g;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){const f=h.userData.pivot,g=u[0];h.pivot=new A().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],o=r.name?i.createUniqueName(r.name):"",a=[],c=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),r.camera!==void 0&&a.push(i.getDependency("camera",r.camera).then(function(l){return i._getNodeRef(i.cameraCache,r.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let h;if(r.isBone===!0?h=new Lp:l.length>1?h=new Oe:l.length===1?h=l[0]:h=new At,h!==l[0])for(let u=0,d=l.length;u<d;u++)h.add(l[u]);if(r.name&&(h.userData.name=r.name,h.name=o),ei(h,r),r.extensions&&ss(n,h,r),r.matrix!==void 0){const u=new ze;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){const u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new Oe;n.name&&(r.name=i.createUniqueName(n.name)),ei(r,n),n.extensions&&ss(t,r,n);const o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(i.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let h=0,u=c.length;h<u;h++){const d=c[h];d.parent!==null?r.add(Wb(d)):r.add(d)}const l=h=>{const u=new Map;for(const[d,f]of i.associations)(d instanceof jn||d instanceof Wt)&&u.set(d,f);return h.traverse(d=>{const f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=l(r),r})}_createAnimationTracks(e,t,n,i,r){const o=[],a=e.name?e.name:e.uuid,c=[];ki[r.path]===ki.weights?e.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(a);let l;switch(ki[r.path]){case ki.weights:l=nr;break;case ki.rotation:l=ir;break;case ki.translation:case ki.scale:l=sr;break;default:switch(n.itemSize){case 1:l=nr;break;case 2:case 3:default:l=sr;break}break}const h=i.interpolation!==void 0?mS[i.interpolation]:Zr,u=this._getArrayFromAccessor(n);for(let d=0,f=c.length;d<f;d++){const g=new l(c[d]+"."+ki[r.path],t.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),o.push(g)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=dh(t.constructor),i=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof ir?pS:$p;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function SS(s,e,t){const n=e.attributes,i=new on;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(i.set(new A(c[0],c[1],c[2]),new A(l[0],l[1],l[2])),a.normalized){const h=dh(js[a.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const a=new A,c=new A;for(let l=0,h=r.length;l<h;l++){const u=r[l];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,g=d.max;if(f!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),d.normalized){const _=dh(js[d.componentType]);c.multiplyScalar(_)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}s.boundingBox=i;const o=new ui;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=o}function cf(s,e,t){const n=e.attributes,i=[];function r(o,a){return t.getDependency("accessor",o).then(function(c){s.setAttribute(a,c)})}for(const o in n){const a=uh[o]||o.toLowerCase();a in s.attributes||i.push(r(n[o],a))}if(e.indices!==void 0&&!s.index){const o=t.getDependency("accessor",e.indices).then(function(a){s.setIndex(a)});i.push(o)}return it.workingColorSpace!==dn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${it.workingColorSpace}" not supported.`),ei(s,e),SS(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?_S(s,e.targets,t):s})}const TS=new fi;let gn=null;const Zp=[],Gs={x:116.5,z:79.5},fh=[],lf=new Vp(new A,new A(0,-1,0));function wS(s,e){if(fh.length===0)return!1;lf.ray.origin.set(s,10,e);for(const t of fh)if(lf.intersectObject(t,!1).length>0)return!0;return!1}const ES=new oe({color:12096608,roughness:.95,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4});function AS(){const e=document.createElement("canvas");e.width=e.height=256;const t=e.getContext("2d"),n=t.createImageData(256,256),i=n.data;for(let o=0;o<256;o++)for(let a=0;a<256;a++){const c=Math.sin(a/18+o/24)*.5+.5,l=Math.sin(a/9-o/14)*.25+.5,h=c*.65+l*.35,u=(o*256+a)*4;i[u]=18+h*22|0,i[u+1]=68+h*32|0,i[u+2]=95+h*48|0,i[u+3]=240}t.putImageData(n,0,0);const r=new Ga(e);return r.wrapS=r.wrapT=fs,r.repeat.set(3,3),r}const xa=AS(),RS=new oe({map:xa,roughness:.04,metalness:.18,transparent:!0,opacity:.88,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-8}),va=[],hf=new Map,CS=.28;let ph=0;function PS(s,e){if(!gn)return;const t=new Qh(.1,.28,22);t.rotateX(-Math.PI/2);const n=new Zt({color:10083822,transparent:!0,opacity:.55,side:Dn,depthWrite:!1}),i=new ae(t,n);i.position.set(s,.08,e),gn.add(i),va.push({ring:i,mat:n,t:0,dur:1.6,maxScale:14})}function uf(s,e,t){if(!wS(e,t))return;const n=hf.get(s)||0;ph-n<CS||(hf.set(s,ph),PS(e,t))}function IS(s){for(let e=va.length-1;e>=0;e--){const t=va[e];t.t+=s;const n=t.t/t.dur;t.ring.scale.setScalar(1+n*t.maxScale),t.mat.opacity=.55*(1-n),n>=1&&(gn.remove(t.ring),t.ring.geometry.dispose(),t.mat.dispose(),va.splice(e,1))}}const ps=[];function LS(){return ps.filter(s=>!s.fallen).map(s=>s.mesh)}function DS(s){var e;return((e=ps.find(t=>t.mesh===s))==null?void 0:e.key)??null}function NS(s,e){const t=ps.find(n=>n.key===s);t&&!t.falling&&!t.fallen&&Jp(t.mesh,e)}function Jp(s,e){const t=ps.find(i=>i.mesh===s);if(!t||t.falling||t.fallen)return;t.falling=!0,t.fallen=!1,t.t=0,t.startPos=s.position.clone(),t.startQuat=s.quaternion.clone();const n=new A(e.x,0,e.z).normalize();t.vel={x:n.x*4.5,y:5.5+Math.random()*2,z:n.z*4.5},t.spin=new A((Math.random()-.5)*18,(Math.random()-.5)*12,(Math.random()-.5)*18),t.currentPos=s.position.clone(),t.currentQuat=s.quaternion.clone(),US(s)}function US(s){if(!gn)return;const e=new A;s.getWorldPosition(e);const t=new eu(.06,0),n=new oe({color:8965290,roughness:.2,metalness:.1,transparent:!0,opacity:.85});for(let i=0;i<10;i++){const r=new ae(t,n);r.position.copy(e),r.scale.setScalar(.5+Math.random()*1.2),gn.add(r);const o={x:(Math.random()-.5)*8,y:3+Math.random()*5,z:(Math.random()-.5)*8},a=new A((Math.random()-.5)*20,(Math.random()-.5)*20,(Math.random()-.5)*20);ya.push({mesh:r,v:o,spin:a,t:0})}}const ya=[];function FS(s){for(const t of ps){if(!t.falling||t.fallen)continue;t.t+=s,t.vel.y+=-12*s,t.currentPos.x+=t.vel.x*s,t.currentPos.y+=t.vel.y*s,t.currentPos.z+=t.vel.z*s,t.mesh.position.copy(t.currentPos);const n=new xn().setFromEuler(new Bn(t.spin.x*s,t.spin.y*s,t.spin.z*s));t.currentQuat.multiply(n),t.mesh.quaternion.copy(t.currentQuat),t.currentPos.y<t.startPos.y-.5&&t.t>.2&&(t.fallen=!0,t.mesh.visible=!1)}for(let t=ya.length-1;t>=0;t--){const n=ya[t];n.t+=s,n.v.y+=-12*s,n.mesh.position.x+=n.v.x*s,n.mesh.position.y+=n.v.y*s,n.mesh.position.z+=n.v.z*s;const i=new xn().setFromEuler(new Bn(n.spin.x*s,n.spin.y*s,n.spin.z*s));n.mesh.quaternion.multiply(i),n.t>1.5&&(n.mesh.material.opacity=Math.max(0,.85*(1-(n.t-1.5)))),n.t>2.5&&(gn.remove(n.mesh),ya.splice(t,1))}}const Ws=[],OS=6,zS=22,Xs=new A(1,0,.4).normalize(),BS=4.5;let $c=0,df=5,Fr=null;const su=.38;function kS(){if(Fr)return;const s=.1,e=su,t=8,n=new oe({color:10389568,roughness:.98});Fr=new Oe;const i=[[1,0,0,0,1,0],[1,0,0,0,0,1],[0,1,0,0,0,1]];for(const[o,a,c,l,h,u]of i)for(let d=0;d<t;d++){const f=d/t*Math.PI*2,g=o*Math.cos(f)*e+l*Math.sin(f)*e,_=a*Math.cos(f)*e+h*Math.sin(f)*e,p=c*Math.cos(f)*e+u*Math.sin(f)*e,m=new ae(new Ae(s,s,s),n);m.position.set(g,_,p),m.castShadow=!0,Fr.add(m)}const r=[[0,e*.9,0],[e*.6,e*.6,0],[-e*.6,e*.6,0],[0,e*.9,e*.4],[0,e*.9,-e*.4],[0,-e*.9,0],[e*.6,-e*.6,0],[-e*.6,-e*.6,0]];for(const[o,a,c]of r){const l=new ae(new Ae(s*1.2,s*1.2,s*1.2),n);l.position.set(o,a,c),l.castShadow=!0,Fr.add(l)}}function VS(s){if(!gn||Ws.length>=OS)return;kS();const e=55+Math.random()*70,t=new A(-Xs.z,0,Xs.x),n=(Math.random()-.5)*70,i=s.x-Xs.x*e+t.x*n,r=s.z-Xs.z*e+t.z*n,o=Fr.clone(!0);o.position.set(i,su,r),o.rotation.set(0,Math.random()*Math.PI*2,0),gn.add(o),Ws.push({mesh:o,t:0,speed:BS*(.6+Math.random()*.8),bounce:Math.random()*Math.PI*2,driftAmp:.18+Math.random()*.22,driftFreq:.4+Math.random()*.35,driftPhase:Math.random()*Math.PI*2,gustFreq:.28+Math.random()*.25,gustPhase:Math.random()*Math.PI*2})}function HS(s,e){$c+=s,$c>=df&&e&&($c=0,df=4+Math.random()*3,VS(e));const t=new xn,n=Math.atan2(Xs.z,Xs.x);for(let i=Ws.length-1;i>=0;i--){const r=Ws[i];r.t+=s;const o=n+Math.sin(r.t*r.driftFreq*Math.PI*2+r.driftPhase)*r.driftAmp,a=.75+.5*(.5+.5*Math.sin(r.t*r.gustFreq*Math.PI*2+r.gustPhase)),c=r.speed*a,l=Math.cos(o),h=Math.sin(o);r.mesh.position.x+=l*c*s,r.mesh.position.z+=h*c*s,r.mesh.position.y=su+Math.abs(Math.sin(r.t*3+r.bounce))*.22;const u=new A(-h,0,l).normalize(),d=c/.38*s;if(t.setFromAxisAngle(u,d),r.mesh.quaternion.multiply(t),r.t>zS){gn.remove(r.mesh),Ws.splice(i,1);continue}if(e){const f=r.mesh.position.x-e.x,g=r.mesh.position.z-e.z;f*f+g*g>4e4&&(gn.remove(r.mesh),Ws.splice(i,1))}}}const ru=[];function Qp(s,e,t){if(!gn)return null;const n=30,i=12,r=Array.from({length:n},()=>({life:Math.random(),speed:.9+Math.random()*.8,ox:(Math.random()-.5)*.45,oz:(Math.random()-.5)*.45})),o=Array.from({length:i},()=>({life:Math.random(),speed:.28+Math.random()*.22,ox:(Math.random()-.5)*.55,oz:(Math.random()-.5)*.55})),a=new Float32Array(n*3),c=new Ut(a,3),l=new Rt;l.setAttribute("position",c),gn.add(new Ha(l,new to({color:16737792,size:.55,transparent:!0,opacity:.9,depthWrite:!1,blending:pl})));const h=new Float32Array(i*3),u=new Ut(h,3),d=new Rt;return d.setAttribute("position",u),gn.add(new Ha(d,new to({color:5592405,size:1.1,transparent:!0,opacity:.28,depthWrite:!1}))),{fd:r,sd:o,fAttr:c,sAttr:u,wx:s,wy:e,wz:t}}function GS(s,e){const{fd:t,sd:n,fAttr:i,sAttr:r,wx:o,wy:a,wz:c}=s,l=i.array,h=r.array;for(let u=0;u<t.length;u++)t[u].life+=e*t[u].speed,t[u].life>1&&(t[u].life-=1,t[u].ox=(Math.random()-.5)*.45,t[u].oz=(Math.random()-.5)*.45),l[u*3]=o+t[u].ox,l[u*3+1]=a+t[u].life*1.4,l[u*3+2]=c+t[u].oz;i.needsUpdate=!0;for(let u=0;u<n.length;u++)n[u].life+=e*n[u].speed,n[u].life>1&&(n[u].life-=1,n[u].ox=(Math.random()-.5)*.55,n[u].oz=(Math.random()-.5)*.55),h[u*3]=o+n[u].ox,h[u*3+1]=a+1.1+n[u].life*3.2,h[u*3+2]=c+n[u].oz;r.needsUpdate=!0}function WS(s,e,t){ph+=s,xa.offset.x+=.04*s,xa.offset.y+=.025*s,xa.needsUpdate=!0,e&&uf("player",e.x,e.z),t&&uf("horse",t.x,t.z),IS(s);for(const n of ru)GS(n,s);FS(s),HS(s,e)}function Rr(s,e,t,n,i,r=0,o=1){TS.load(s,a=>{const c=a.scene;c.position.set(t,n,i),c.rotation.y=r,c.scale.setScalar(o),c.updateMatrixWorld(!0,!0),c.traverse(l=>{if(/firecampoint|campfirepoint|firecamppoint|fogon|hoguera|campfire|firepit|fuego|brasero/i.test(l.name)){const u=new A;l.getWorldPosition(u);const d=Qp(u.x,u.y,u.z);d&&ru.push(d)}const h=l.name.toLowerCase();if(/botel|bottle/i.test(h)&&!ps.some(u=>u.mesh===l)){const u=new A;l.getWorldPosition(u);const d=`${u.x.toFixed(1)}_${u.z.toFixed(1)}`;ps.push({mesh:l,key:d,falling:!1,fallen:!1,t:0,startPos:l.position.clone(),startQuat:l.quaternion.clone(),rotAxis:new A(1,0,0)})}if(l.isMesh)if(l.castShadow=!0,l.receiveShadow=!0,/water|lagoon|lago|agua/i.test(h)){l.material=RS,l.renderOrder=2,l.position.y+=.03,l.updateMatrixWorld(!0,!1),fh.push(l);const u=new on().setFromObject(l),d=new A;u.getCenter(d),Zp.push({x:d.x,z:d.z,r:0,box:u.clone()})}else if(/shore|sand|arena|orilla|playa/i.test(h))l.material=ES.clone();else{const u=new on().setFromObject(l);u.max.y-u.min.y<.3&&u.min.y<1&&(l.material=l.material.clone(),l.material.polygonOffset=!0,l.material.polygonOffsetFactor=-1,l.material.polygonOffsetUnits=-4)}}),e.add(c)},void 0,a=>console.warn(`[landmarks] failed to load ${s}`,a))}function XS(){const s=new Oe,e=new oe({color:12613704,roughness:.8}),t=new oe({color:4860944,roughness:.85}),n=new oe({color:2891274,roughness:.9}),i=new oe({color:1576964,roughness:.92}),r=new oe({color:1182724,roughness:.88}),o=(a,c,l,h,u,d=0,f=0)=>{const g=new ae(a,c);return g.position.set(l,h,u),g.rotation.set(d,f,0),g.castShadow=!0,s.add(g),g};o(new ai(.2,.22,.42,9),new oe({color:3809288,roughness:.97}),0,.21,0,0,.5),o(new Ae(.4,.5,.22),t,0,.6,0),o(new ao(.16,10,8),e,0,1,0),o(new ai(.3,.3,.04,14),i,0,1.17,0),o(new ai(.14,.18,.22,14),i,0,1.29,0);for(const a of[-1,1])o(new Ae(.09,.34,.09),t,a*.26,.66,.1,-.65);for(const a of[-1,1])o(new Ae(.13,.12,.32),n,a*.12,.38,.18,-.2),o(new Ae(.11,.26,.11),n,a*.12,.16,.38,.3),o(new Ae(.12,.1,.22),r,a*.12,.07,.5,0);return s}function qS(s){gn=s;const e=XS();e.position.set(Gs.x,0,Gs.z),e.rotation.y=-.75,s.add(e),new fi().load("/models/npc.glb",n=>{s.remove(e);const i=n.scene;i.position.set(Gs.x,0,Gs.z),i.rotation.y=-.75,i.traverse(r=>{r.isMesh&&(r.castShadow=r.receiveShadow=!0)}),s.add(i)},void 0,()=>{});const t=Qp(114,.2,80);t&&ru.push(t),Rr("/models/camp.glb",s,-7823.3,0,5424.2),Rr("/models/well.glb",s,-7656.9,0,5268.8),Rr("/models/skulls.glb",s,-7173.3,0,2997.3),Rr("/models/shack.glb",s,-6258,0,2023.4,0,1.56),Rr("/models/shack.glb",s,110,0,100,0,1.56)}const Et=200,Xo=1,ff=2,pf=10,YS=4,KS=4,jS=4,$S=6;function Zc(s,e){for(const t of Zp)if(t.box){if(s>=t.box.min.x&&s<=t.box.max.x&&e>=t.box.min.z&&e<=t.box.max.z)return!0}else{const n=s-t.x,i=e-t.z;if(n*n+i*i<t.r*t.r)return!0}return!1}function ZS(s,e){let t=(Math.abs(s*73856093^e*19349663^s*e*1664525)||1)>>>0;return()=>(t^=t<<13,t^=t>>17,t^=t<<5,(t>>>0)/4294967296)}function qo(s,e){const t=Math.sin(s*127.1+e*311.7)*43758.5453;return t-Math.floor(t)}function JS(s,e){const t=Math.floor(s),n=Math.floor(e),i=s-t,r=e-n,o=i*i*(3-2*i),a=r*r*(3-2*r),c=qo(t,n),l=qo(t+1,n),h=qo(t,n+1),u=qo(t+1,n+1);return c+(l-c)*o+(h-c)*a+(u-h-l+c)*o*a}function mf(s,e){let t=0,n=.55;for(let i=0;i<4;i++)t+=JS(s,e)*n,s*=2.1,e*=2.1,n*=.5;return t}function QS(s,e){const t=mf(s/90,e/90)*.7+mf(s/18+7.3,e/18+3.9)*.3;if(t<.36){const i=t/.36;return[.04+.36*i,.02+.23*i,.002+.07*i]}const n=(t-.36)/.64;return[.4+.18*n,.25+.16*n,.07+.12*n]}const e1=new oe({roughness:.92,vertexColors:!0}),gf=[new oe({color:8026746,roughness:.97}),new oe({color:6971488,roughness:.95}),new oe({color:9207920,roughness:.96})],t1=[new oe({color:7229488,roughness:.99}),new oe({color:5914661,roughness:.99})],n1=[new oe({color:5923368,roughness:.97}),new oe({color:4871200,roughness:.97})],_f=[new oe({color:13279312,roughness:.97}),new oe({color:12094528,roughness:.97}),new oe({color:14204016,roughness:.93})],Jc=new fi;let mh=null,gh=null,_h=null,em=!1,i1=3,xh=[];function zs(){--i1===0&&(em=!0,xh.forEach(s=>s()),xh=[])}function s1(){Jc.load("/models/tree.glb",s=>{mh=s.scene,zs()},void 0,()=>zs()),Jc.load("/models/rock.glb",s=>{gh=s.scene,zs()},void 0,()=>zs()),Jc.load("/models/bush.glb",s=>{_h=s.scene,zs()},void 0,()=>zs())}s1();class r1{constructor(e,t){this.scene=e,this.colliders=t,this.chunks=new Map,this._queue=[],this._building=!1,this._requested=new Set}update(e){const t=Math.floor(e.x/Et),n=Math.floor(e.z/Et);for(let i=-Xo;i<=Xo;i++)for(let r=-Xo;r<=Xo;r++)this._request(t+i,n+r);for(const i of this.chunks.keys()){const[r,o]=i.split(",").map(Number);(Math.abs(r-t)>ff||Math.abs(o-n)>ff)&&this._unload(i)}if(this._queue.length>0&&!this._building){const{cx:i,cz:r}=this._queue.shift(),o=`${i},${r}`;this.chunks.has(o)?this._building=!1:(this._building=!0,em?(this._build(i,r),this._building=!1):xh.push(()=>{this._build(i,r),this._building=!1}))}}_request(e,t){const n=`${e},${t}`;this.chunks.has(n)||this._requested.has(n)||(this._requested.add(n),this._queue.unshift({cx:e,cz:t}))}_build(e,t){const n=`${e},${t}`;if(this.chunks.has(n))return;const i=ZS(e,t),r=e*Et+Et/2,o=t*Et+Et/2,a=[],c=[],l=new ar(Et,Et,pf,pf),h=l.attributes.position,u=new Float32Array(h.count*3);for(let f=0;f<h.count;f++){const[g,_,p]=QS(h.getX(f)+r,-h.getY(f)+o);u[f*3]=g,u[f*3+1]=_,u[f*3+2]=p}l.setAttribute("color",new Ut(u,3));const d=new ae(l,e1);if(d.rotation.x=-Math.PI/2,d.position.set(r,0,o),d.receiveShadow=!0,this.scene.add(d),mh)for(let f=0;f<YS;f++){const g=e*Et+i()*Et,_=t*Et+i()*Et;if(Zc(g,_)){i(),i(),i();continue}const p=mh.clone(!0),m=.35+i()*.15;p.position.set(g,0,_),p.scale.setScalar(m),p.rotation.y=i()*Math.PI*2,p.traverse(x=>{x.isMesh&&(x.castShadow=!0,x.receiveShadow=!0)}),this.scene.add(p),a.push(p),c.push({x:g,z:_,sx:1,sy:5,sz:1})}for(let f=0;f<KS;f++){const g=e*Et+i()*Et,_=t*Et+i()*Et;if(Zc(g,_)){i(),i(),i(),i();continue}const p=.5+i()*1,m=.35+i()*.55;let x;if(gh)x=gh.clone(!0),x.scale.set(p*.6,m*p*.6,p*(.8+i()*.4)*.6),x.traverse(y=>{y.isMesh&&(y.castShadow=y.receiveShadow=!0)});else{const y=.9+i()*.7,b=.4+i()*.35,w=.8+i()*.6,E=gf[Math.floor(i()*gf.length)];x=new ae(new Ae(y,b,w),E),x.scale.set(p,m*p,p*(.8+i()*.4)),x.castShadow=x.receiveShadow=!0}x.position.set(g,0,_),x.rotation.y=i()*Math.PI*2,this.scene.add(x),a.push(x),c.push({x:g,z:_,sx:p*1.6,sy:2,sz:p*1.6})}for(let f=0;f<jS;f++){const g=e*Et+i()*Et,_=t*Et+i()*Et;if(Zc(g,_)){i(),i(),i();continue}const p=.55+i()*.9;let m;if(_h)m=_h.clone(!0),m.scale.setScalar(p*.5),m.traverse(x=>{x.isMesh&&(x.castShadow=x.receiveShadow=!0)});else{const y=(i()>.38?t1:n1)[Math.floor(i()*2)],b=.25+i()*.3,w=.3+i()*.35;m=new ae(new Ae(w,b,w),y),m.scale.setScalar(p),m.castShadow=m.receiveShadow=!0}m.position.set(g,.25*p/2,_),m.rotation.y=i()*Math.PI*2,this.scene.add(m),a.push(m)}for(let f=0;f<$S;f++){const g=e*Et+i()*Et,_=t*Et+i()*Et,p=.06+i()*.08,m=.15+i()*.35,x=_f[Math.floor(i()*_f.length)],y=new ae(new Ae(m,p,m),x);y.position.set(g,p/2,_),y.scale.set(.6+i()*1.1,.28+i()*.22,.6+i()*.8),y.rotation.y=i()*Math.PI*2,y.receiveShadow=!0,this.scene.add(y),a.push(y)}c.forEach(f=>this.colliders.push(f)),this.chunks.set(n,{ground:d,objects:a,ownColl:c})}_unload(e){const t=this.chunks.get(e);if(t){this.scene.remove(t.ground),t.ground.geometry.dispose();for(const n of t.objects)this.scene.remove(n);for(const n of t.ownColl){const i=this.colliders.indexOf(n);i>=0&&this.colliders.splice(i,1)}this._requested.delete(e),this.chunks.delete(e)}}}const xf=new fi;let Yo=null,Ko=null;function vf(s=!1){return s?Ko||(Ko=new Promise(e=>xf.load("/models/bot.glb",t=>e(t.scene),void 0,()=>e(null))),Ko):Yo||(Yo=new Promise(e=>{xf.load("/models/player.glb",t=>e(t.scene),void 0,()=>e(null))}),Yo)}function yf(s){const e=new Oe,t=new Ie(s),n=new oe({color:t,roughness:.85}),i=new oe({color:t.clone().lerp(new Ie(16777215),.3),roughness:.85}),r=new oe({color:t.clone().lerp(new Ie(0),.25),roughness:.9}),o=new ae(new Ae(.78,1.1,.5),n);o.position.set(0,.62,0),o.name="body",o.castShadow=!0;const a=new ae(new Ae(.46,.46,.46),i);a.position.set(0,1.44,0),a.name="head",a.castShadow=!0;const c=new Ae(.22,.85,.22),l=new ae(c,n.clone());l.position.set(-.5,.58,0),l.castShadow=!0;const h=new ae(c,n.clone());h.position.set(.5,.58,0),h.castShadow=!0;const u=new Ae(.26,.78,.26),d=new ae(u,r.clone());d.position.set(-.19,-.22,0),d.name="leg_left",d.castShadow=!0;const f=new ae(u,r.clone());return f.position.set(.19,-.22,0),f.name="leg_right",f.castShadow=!0,e.add(o,a,l,h,d,f),e._hitboxes=[o,a],e._headMesh=a,e._legMeshes=[d,f],e}function o1(){const s=new Oe,e=(u,d,f,g,_,p,m)=>{const x=new ae(new Ae(u,d,f),new oe({color:g,roughness:.85}));return x.position.set(_,p,m),x.castShadow=!0,s.add(x),x},t=7027231,n=2759176,i=13378048,r=17544,o=13942928,a=e(.8,1.1,.5,n,0,.55,0);a.name="body",e(.78,.12,.52,r,0,.88,.01),e(.78,.12,.52,i,0,.72,.01);const c=e(.48,.46,.46,t,0,1.43,0);c.name="head",e(.5,.08,.1,i,0,1.5,.24),e(.5,.08,.1,i,0,1.36,.24),e(.1,.1,.05,r,-.14,1.46,.25),e(.1,.1,.05,r,.14,1.46,.25);for(let u=-2;u<=2;u++){const d=.2+Math.abs(u)*.04,f=u%2===0?i:o;e(.1,d,.06,f,u*.1,1.7+d*.5,0)}e(.22,.9,.22,t,.51,.6,0),e(.22,.9,.22,t,-.51,.6,0),e(.24,.07,.24,o,.51,.15,0),e(.24,.07,.24,o,-.51,.15,0);const l=e(.28,.8,.28,n,.2,-.4,0),h=e(.28,.8,.28,n,-.2,-.4,0);return l.name="leg_left",h.name="leg_right",e(.3,.1,.36,o,.2,-.85,.04),e(.3,.1,.36,o,-.2,-.85,.04),e(.72,.1,.1,o,0,1.1,.26),s._hitboxes=[a,c],s._headMesh=c,s._legMeshes=[l,h],s}class vh{constructor(e,t){this.id=t.id,this.name=t.name,this.color=t.color||"#ff4444",this.hp=t.hp,this.targetPos=new A(t.x,t.y??1,t.z),this.targetRY=t.ry||0,this._hitboxes=[],this.group=new Oe,this.group.position.set(t.x,0,t.z),e.add(this.group),this._scene=e,this._hat=null,this._hatFlying=!1,this._hatVel=new A,this._hatAngVel=new A,this._headMesh=null,this._legMeshes=[],this._detachedParts=[],this._staggerVel=0,this._staggerPos=0,t.name&&this._addNameLabel(t.name),this._gun=null,this._firepoint=null,this._gunRecoil=0,this._gunRestPos=null,this._hpBar=null,this._maxHp=200,this._dying=!1,this._dyingT=0,this._isBot=!!t.isBot;const n=i=>{const r=i.clone(!0);r.visible=!0;const o=[];r.traverse(a=>{var l;if(a.visible=!0,a.isMesh){a.castShadow=!0;const h=(l=a.material)!=null&&l.color?a.material.color.clone():new Ie(10123856);a.material=new oe({color:h,roughness:.85,metalness:0,transparent:!1,opacity:1,depthWrite:!0,depthTest:!0}),a.name==="body"&&a.material.color.set(this.color)}const c=a.name.toLowerCase();(c==="gun"||c==="weapon"||c==="pistol"||c==="rifle"||c==="revolver")&&(this._gun=a,this._gunRestPos=a.position.clone(),o.push(a)),(c.includes("hat")||c.includes("sombrero")||c.includes("cap"))&&(this._hat=a),(c.includes("firepoint")||c.includes("fire_point")||c.includes("muzzle"))&&(this._firepoint=a,a.visible=!1,a.isMesh&&(a.castShadow=!1,a.receiveShadow=!1))});for(const a of o)a.visible=!1,a.traverse(c=>{c.visible=!1});r.updateWorldMatrix(!0,!0);{const a=new on;a.setFromObject(r),a.max.y-a.min.y>.1&&(r.position.y-=a.min.y)}return this._hitboxes=[],this._headMesh=null,this._legMeshes=[],r.traverse(a=>{if(!a.isMesh)return;const c=a.name.toLowerCase();c==="body"&&this._hitboxes.push(a),(c==="head"||c.startsWith("head"))&&(this._hitboxes.push(a),this._headMesh=a),(c.includes("leg")||c.includes("pierna")||c.includes("thigh")||c.includes("shin"))&&this._legMeshes.push(a)}),r};if(t.local){const i=yf(this.color);this._hitboxes=i._hitboxes||[],this._headMesh=i._headMesh||null,this._legMeshes=i._legMeshes||[],this.group.add(i),vf(!1).then(r=>{if(!r)return;this.group.remove(i);const o=n(r);this.group.add(o)});return}vf(!!t.isBot).then(i=>{let r;i?r=n(i):(r=this._isBot?o1():yf(this.color),this._hitboxes=r._hitboxes||[],this._headMesh=r._headMesh||null,this._legMeshes=r._legMeshes||[]),this.group.add(r),this._isBot&&this._buildHPBar()})}_buildHat(){const e=new Oe,t=new oe({color:2955786}),n=new ai(.44,.46,.06,12),i=new ae(n,t);i.castShadow=!0,e.add(i);const r=new ai(.2,.25,.38,12),o=new ae(r,t);return o.position.y=.22,o.castShadow=!0,e.add(o),e}detachHat(){if(this._hatFlying||!this._hat)return;const e=this._hat.getWorldPosition(new A);this.group.remove(this._hat),this._scene.add(this._hat),this._hat.position.copy(e),this._hatVel.set((Math.random()-.5)*10,5+Math.random()*5,(Math.random()-.5)*10),this._hatAngVel.set((Math.random()-.5)*15,(Math.random()-.5)*15,(Math.random()-.5)*15),this._hatFlying=!0}updateHat(e){if(this._gun&&this._gunRestPos){this._gunRecoil=Math.max(0,this._gunRecoil-e/.1);const t=this._gunRecoil*.22;this._gun.position.set(this._gunRestPos.x,this._gunRestPos.y,this._gunRestPos.z+t)}!this._hatFlying||!this._hat||(this._hatVel.y-=18*e,this._hat.position.addScaledVector(this._hatVel,e),this._hat.rotation.x+=this._hatAngVel.x*e,this._hat.rotation.y+=this._hatAngVel.y*e,this._hat.rotation.z+=this._hatAngVel.z*e,this._hat.position.y<.08&&(this._hat.position.y=.08,this._hatVel.y*=-.3,this._hatVel.x*=.6,this._hatVel.z*=.6,this._hatAngVel.multiplyScalar(.4),Math.abs(this._hatVel.y)<.3&&(this._hatFlying=!1,this._hatVel.set(0,0,0),this._hatAngVel.set(0,0,0))))}respawnHat(){this._hat&&this._hatFlying&&this._scene.remove(this._hat),this._hat=null,this._hatFlying=!1,this._hatVel.set(0,0,0),this._hatAngVel.set(0,0,0)}_addNameLabel(e){const t=document.createElement("canvas");t.width=256,t.height=64;const n=t.getContext("2d");n.fillStyle="rgba(0,0,0,0.5)",n.roundRect(0,10,256,44,8),n.fill(),n.fillStyle="#fff",n.font="bold 28px sans-serif",n.textAlign="center",n.fillText(e,128,42);const i=new sh(new Ba({map:new Ga(t),transparent:!0}));i.scale.set(2,.5,1),i.position.y=2.2,this.group.add(i)}_buildHPBar(){const e=document.createElement("canvas");e.width=128,e.height=18,this._hpBarCanvas=e;const t=new Ga(e),n=new sh(new Ba({map:t,transparent:!0,depthTest:!1}));n.scale.set(1.4,.2,1),n.position.y=2.6,this.group.add(n),this._hpBar=n,this._hpBarTex=t,this._drawHPBar(this.hp??200)}_drawHPBar(e){if(!this._hpBarCanvas)return;const t=this._hpBarCanvas,n=t.getContext("2d"),i=Math.max(0,Math.min(1,e/this._maxHp));n.clearRect(0,0,t.width,t.height),n.fillStyle="rgba(0,0,0,0.6)",n.roundRect(0,0,t.width,t.height,4),n.fill();const r=Math.round((t.width-4)*i),o=i*120;n.fillStyle=`hsl(${o},90%,45%)`,n.roundRect(2,2,r,t.height-4,3),n.fill(),this._hpBarTex&&(this._hpBarTex.needsUpdate=!0)}setHP(e){this.hp=e,this._isBot&&this._drawHPBar(e)}startDying(){this._dying||(this._dying=!0,this._dyingT=0)}update(e){for(let n=this._detachedParts.length-1;n>=0;n--){const i=this._detachedParts[n];if(i.t+=e,i.t>=i.maxT){this._scene.remove(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),this._detachedParts.splice(n,1);continue}i.vel.y-=20*e,i.mesh.position.addScaledVector(i.vel,e),i.mesh.rotation.x+=i.angVel.x*e,i.mesh.rotation.y+=i.angVel.y*e,i.mesh.rotation.z+=i.angVel.z*e,i.mesh.position.y<.04&&(i.mesh.position.y=.04,i.vel.y*=-.28,i.vel.x*=.6,i.vel.z*=.6,i.angVel.multiplyScalar(.45)),i.t>i.maxT-.6&&(i.mesh.material.opacity=Math.max(0,(i.maxT-i.t)/.6))}if((Math.abs(this._staggerVel)>.001||Math.abs(this._staggerPos)>.001)&&(this._staggerVel-=this._staggerPos*32*e,this._staggerVel*=1-7*e,this._staggerPos+=this._staggerVel*e,this._dying||(this.group.rotation.z=this._staggerPos*.07),Math.abs(this._staggerPos)<.004&&Math.abs(this._staggerVel)<.004&&(this._staggerVel=0,this._staggerPos=0,this._dying||(this.group.rotation.z=0))),this._dying){this._dyingT+=e,this.group.rotation.z=Math.min(Math.PI/2,this._dyingT*3.5),this.group.position.y=Math.max(-.25,this.group.position.y-e*.4),this.updateHat(e);return}this.group.position.lerp(this.targetPos,Math.min(1,8*e));let t=this.targetRY-this.group.rotation.y;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;this.group.rotation.y+=t*Math.min(1,10*e),this.updateHat(e)}setTarget(e,t,n,i){this.targetPos.set(e,t,n),this.targetRY=i}snapTo(e,t,n,i){this.group.position.set(e,t,n),this.targetPos.set(e,t,n),this.group.rotation.y=i,this.targetRY=i}setAiming(e){this._gun&&(this._gun.visible=e)}triggerGunRecoil(){this._gunRecoil=1}getFirepointWorldPos(){return this._firepoint?this._firepoint.getWorldPosition(new A):null}applyImpact(e,t){var n,i,r,o,a,c;if(e==="head"){let l;if(this._headMesh){this._headMesh.updateWorldMatrix(!0,!1),l=this._headMesh.getWorldPosition(new A);const h=this._headMesh.geometry.clone(),u=((r=(i=(n=this._headMesh.material)==null?void 0:n.color)==null?void 0:i.getHex)==null?void 0:r.call(i))??9134144;this._headMesh.visible=!1,this._spawnFlyingPart(l,h,u,t,3.5)}else l=this.group.position.clone().add(new A(0,1.5,0)),this._spawnFlyingPart(l,new Ae(.46,.46,.46),9134144,t,3.5)}else if(e==="leg"){let l=null;if(this._legMeshes.length>0){const u=this._legMeshes.filter(d=>d.visible);l=u.length>0?u[Math.floor(Math.random()*u.length)]:this._legMeshes[Math.floor(Math.random()*this._legMeshes.length)]}let h;if(l){l.updateWorldMatrix(!0,!1),h=l.getWorldPosition(new A);const u=l.geometry.clone(),d=((c=(a=(o=l.material)==null?void 0:o.color)==null?void 0:a.getHex)==null?void 0:c.call(a))??2759176;l.visible=!1,this._spawnFlyingPart(h,u,d,t,3.5)}else h=this.group.position.clone().add(new A((Math.random()-.5)*.3,.35,0)),this._spawnFlyingPart(h,new Ae(.26,.7,.26),2759176,t,3.5)}else this._staggerPos=0,this._staggerVel=5*(Math.random()<.5?1:-1)}_spawnFlyingPart(e,t,n,i,r=3){const o=new oe({color:n,roughness:.85,transparent:!0,opacity:1}),a=new ae(t,o);a.position.copy(e),a.castShadow=!0,this._scene.add(a);const c=new A().subVectors(e,i).normalize(),l=new A(c.x*6+(Math.random()-.5)*5,Math.abs(c.y)*2+5+Math.random()*4,c.z*6+(Math.random()-.5)*5),h=new A((Math.random()-.5)*20,(Math.random()-.5)*20,(Math.random()-.5)*20);this._detachedParts.push({mesh:a,vel:l,angVel:h,t:0,maxT:r})}resetImpact(){this._headMesh&&(this._headMesh.visible=!0);for(const e of this._legMeshes)e.visible=!0;for(const e of this._detachedParts)this._scene.remove(e.mesh),e.mesh.geometry.dispose(),e.mesh.material.dispose();this._detachedParts=[],this._staggerVel=0,this._staggerPos=0}remove(e){e.remove(this.group),this._hat&&this._hatFlying&&e.remove(this._hat);for(const t of this._detachedParts)e.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose();this._detachedParts=[]}getHitboxes(){return this._hitboxes}}const a1=new fi,Mf=3,c1=1.4,l1=1.25,h1=6,u1=11,d1=.45,bf=2.2,f1=.35,p1=.4,m1=/leg|pata|pierna|hoof|pezuña|extremidad/i,g1=/torso|body|head|neck|mane|tail|saddle|ear|muzzle|eye|horn|nose|montura|pelo|crin|cola|cuerpo|cabeza|ojo|nariz|boca|diente|lomo|grupas/i,_1=/saddle|montura|manta|silla|alforja|arreo|cincha|estribo|rienda|brida|cube015/i,x1=/material0*[056]+|manta|saddle|montura/i,Sf=[{hShift:-.02,lMult:.7},{hShift:.05,lMult:1.25},{hShift:-.03,lMult:.55},{hShift:.07,lMult:1.4},{hShift:.02,lMult:.88}],v1=3.8,y1=-69,M1=40,b1=[{id:0,x:-30,z:10},{id:1,x:35,z:25},{id:2,x:105,z:95},{id:3,x:55,z:-15},{id:4,x:5,z:50},{id:5,x:-60,z:-35}];let jo=null;function S1(){return jo||(jo=new Promise(s=>a1.load("/models/horse.glb",e=>s(e.scene),void 0,()=>s(null))),jo)}function T1(s){const e=s.parent;if(!e)return s;const t=new on().setFromObject(s);if(t.isEmpty())return s;const n=s.getWorldPosition(new A),i=new A(n.x,t.max.y,n.z),r=new A,o=new xn,a=new A;s.matrixWorld.decompose(r,o,a);const c=new Oe;return c.position.copy(e.worldToLocal(i.clone())),e.remove(s),e.add(c),c.add(s),c.updateWorldMatrix(!0,!1),new ze().compose(r,o,a).premultiply(new ze().copy(c.matrixWorld).invert()).decompose(s.position,s.quaternion,s.scale),c}function w1(s){var u,d,f,g;const e=[];s.traverse(_=>{_!==s&&e.push(_)});const t=e.filter(_=>m1.test(_.name));let n=t.length>=2?t.slice(0,4):null;if(!n){const _=[];s.traverse(p=>{p.isMesh&&!g1.test(p.name)&&_.push(p)}),_.sort((p,m)=>{const x=new on().setFromObject(p).getCenter(new A).y,y=new on().setFromObject(m).getCenter(new A).y;return x-y}),n=_.slice(0,4)}if(n.length<2)return[];const i=new A,r=n.map(_=>{_.getWorldPosition(i);const p=i.clone();return s.worldToLocal(p),{obj:_,x:p.x,z:p.z}});r.sort((_,p)=>_.x-p.x);const o=Math.floor(r.length/2),a=r.slice(0,o).sort((_,p)=>p.z-_.z),c=r.slice(o).sort((_,p)=>p.z-_.z),l=[{obj:(u=a[0])==null?void 0:u.obj,phase:Math.PI*.5},{obj:(d=a[1])==null?void 0:d.obj,phase:0},{obj:(f=c[0])==null?void 0:f.obj,phase:Math.PI*1.5},{obj:(g=c[1])==null?void 0:g.obj,phase:Math.PI}].filter(_=>_.obj);return(l.length===n.length?l:n.map((_,p)=>({obj:_,phase:Math.PI*2*p/n.length}))).map(({obj:_,phase:p})=>({pivot:T1(_),legObj:_,phase:p}))}class E1{constructor(e,t){this.scene=e,this.network=t,this.horses=new Map,this.myHorseId=null,this._mountedSpeedMult=c1,this._mountPrompt=this._createPrompt(),this._nearestHorseId=null,this._anim=null,this._mountLandPos=null,this.onHoofTouch=null,this._init()}async _init(){const e=await S1();let t=0;for(const n of b1){const i=e?e.clone(!0):this._fallbackMesh();i.position.set(n.x,0,n.z);const r=n.x-v1,o=n.z-y1,a=Math.sqrt(r*r+o*o)>M1,c=a?Sf[t++%Sf.length]:null,l=[],h={h:0,s:0,l:0};i.traverse(_=>{var m;if(!_.isMesh)return;_.castShadow=!0,_.receiveShadow=!0;const p=Array.isArray(_.material)?_.material.map(x=>x.name).join(" "):((m=_.material)==null?void 0:m.name)??"";if((_1.test(_.name)||x1.test(p))&&(l.push(_),a&&(_.visible=!1)),a&&c&&(_.material=_.material.clone(),_.material.color.getHSL(h),h.l>=.08)){const x=(h.h+c.hShift+1)%1,y=Math.min(.95,h.l*c.lMult);_.material.color.setHSL(x,h.s,y)}}),this.scene.add(i),i.updateWorldMatrix(!0,!0);let u=null,d=null,f=null;if(i.traverse(_=>{const p=_.name.toLowerCase();!u&&/head|cabeza/.test(p)&&(u=_),!d&&/neck|cuello/.test(p)&&(d=_),!f&&/crin|mane|cube\.012/i.test(_.name)&&(f=_)}),f&&u&&f.parent){f.updateWorldMatrix(!0,!1);const _=new A,p=new xn,m=new A;f.matrixWorld.decompose(_,p,m),f.removeFromParent(),u.add(f),u.updateWorldMatrix(!0,!1);const x=new ze().copy(u.matrixWorld).invert(),y=new ze().compose(_,p,m);y.premultiply(x),y.decompose(f.position,f.quaternion,f.scale)}const g=e?w1(i):[];this.horses.set(n.id,{mesh:i,legs:g,riderId:null,saddleNodes:l,isWild:a,x:n.x,z:n.z,walkTime:0,_prevX:n.x,_prevZ:n.z,_vx:0,_vz:0,_sprinting:!1,_targetRY:i.rotation.y,_displayRY:i.rotation.y,_baseY:0,_bobY:0,headNode:u,neckNode:d})}}_fallbackMesh(){const e=new Oe,t=new ae(new Ae(1.3,.9,2.6),new oe({color:9127187}));return t.position.y=1.75,e.add(t),e}_createPrompt(){const e=document.createElement("div");return e.style.cssText=`
      position:fixed; bottom:100px; left:50%; transform:translateX(-50%);
      z-index:200; background:rgba(0,0,0,0.6); color:#fff;
      padding:8px 20px; border-radius:8px; font-size:14px;
      display:none; pointer-events:none; border:1px solid rgba(255,255,255,0.2);
    `,e.textContent="[E] Montar caballo",document.body.appendChild(e),e}isMountAnimating(){var e;return((e=this._anim)==null?void 0:e.type)==="mount"}consumeMountLand(){const e=this._mountLandPos;return this._mountLandPos=null,e}update(e,t){this._anim&&(this._anim.t+=t/this._anim.dur,this._anim.t>=1&&(this._anim.t=1,this._anim.type==="mount"&&(this._mountLandPos={x:this._anim.toX,z:this._anim.toZ}),this._anim=null));for(const[r,o]of this.horses){const a=o.x-o._prevX,c=o.z-o._prevZ,l=Math.sqrt(a*a+c*c)/Math.max(t,.001);o._vx=a/Math.max(t,.001),o._vz=c/Math.max(t,.001);const h=o.riderId!==null&&l>.8;o._prevX=o.x,o._prevZ=o.z,h?o.walkTime+=t:o.walkTime=0,this._animateLegs(o,h,r===this.myHorseId,l);let u=o._targetRY-o._displayRY;for(;u>Math.PI;)u-=Math.PI*2;for(;u<-Math.PI;)u+=Math.PI*2;o._displayRY+=u*Math.min(1,5*t),o.mesh.rotation.y=o._displayRY,o.mesh.position.y=o._baseY+o._bobY}if(this.myHorseId!==null)return;let n=null,i=Mf;for(const[r,o]of this.horses){if(o.riderId!==null)continue;const a=o.x-e.x,c=o.z-e.z,l=Math.sqrt(a*a+c*c);l<i&&(i=l,n=r)}this._mountPrompt.style.display=n!==null?"block":"none",this._nearestHorseId=n}_animateLegs(e,t,n=!1,i=0){const r=e._sprinting,o=r?u1:h1,a=d1*(r?1.35:1),c=e.walkTime;if(!t){for(const y of e.legs)y.pivot.rotation.x*=.85,y.pivot.rotation.z*=.85,y.legObj&&(y.legObj.rotation.x*=.85);e._bobY*=.85,e.mesh.rotation.z*=.85,e.headNode&&(e.headNode.rotation.x*=.85),e.neckNode&&(e.neckNode.rotation.x*=.85);return}const l=e._displayRY,h=-Math.sin(l),u=-Math.cos(l),d=u,f=-h,g=Math.sqrt((e._vx||0)**2+(e._vz||0)**2);let _=1,p=0;if(g>.5){const y=e._vx/g,b=e._vz/g;_=Math.max(-1,Math.min(1,y*h+b*u)),p=Math.max(-1,Math.min(1,y*d+b*f))}for(const y of e.legs){const b=Math.sin(o*c+y.phase),w=y._prevS??b;n&&w>.05&&b<=0&&this.onHoofTouch&&this.onHoofTouch(i,r),y._prevS=b;const E=b>0?b*a:b*a*.65;y.pivot.rotation.x=E*Math.max(.08,Math.abs(_));const C=Math.cos(o*c+y.phase)*a*.55;if(y.pivot.rotation.z=C*p,y.legObj){const v=Math.max(0,Math.sin(o*c+y.phase+.55))*a*.55;y.legObj.rotation.x=-v*Math.max(.08,Math.abs(_))}}const m=r?.07:.045;e._bobY=Math.abs(Math.sin(o*c))*m,e.mesh.rotation.z=Math.sin(o*c*.5)*(r?.04:.025);const x=r?.1:.06;e.headNode&&(e.headNode.rotation.x=Math.sin(o*c+Math.PI*.5)*x),e.neckNode&&(e.neckNode.rotation.x=Math.sin(o*c+Math.PI*.5)*x*.6)}tryMount(e,t=0,n=0,i=0){return this.myHorseId!==null?this._dismount(e):(this._nearestHorseId!==null&&this._mount(this._nearestHorseId,e,t,n,i),null)}_mount(e,t,n=0,i=0,r=0){var a,c;const o=this.horses.get(e);o&&(o.riderId=t,this.myHorseId=e,(a=o.saddleNodes)==null||a.forEach(l=>l.visible=!0),this._mountPrompt.style.display="none",(c=this.network)==null||c.sendMount(e),this._anim={type:"mount",t:0,dur:n>.5?.18:f1,startY:n,fromX:i,fromZ:r,toX:o.x,toZ:o.z})}_dismount(e){var a,c;const t=this.horses.get(this.myHorseId);if(!t)return this.myHorseId=null,null;const i=t.mesh.rotation.y-Math.PI+Math.PI/2,r=t.x+Math.sin(i)*bf,o=t.z+Math.cos(i)*bf;return this._anim={type:"dismount",t:0,dur:p1,fromX:t.x,fromZ:t.z,toX:r,toZ:o},t._baseY=0,t.riderId=null,(a=t.saddleNodes)==null||a.forEach(l=>l.visible=!1),(c=this.network)==null||c.sendDismount(this.myHorseId),this.myHorseId=null,{x:r,z:o}}getAnimY(){if(!this._anim)return null;const e=this._anim.t;if(this._anim.type==="mount"){const t=e*e*(3-2*e);return this._anim.startY+(2.5-this._anim.startY)*t+Math.sin(e*Math.PI)*.25}else return(1-e)*2.5+Math.sin(e*Math.PI)*.5}getMountModelPos(){if(!this._anim||this._anim.type!=="mount")return null;const e=this._anim.t*this._anim.t*(3-2*this._anim.t);return{x:this._anim.fromX+(this._anim.toX-this._anim.fromX)*e,z:this._anim.fromZ+(this._anim.toZ-this._anim.fromZ)*e}}getDismountModelPos(e){if(!this._anim||this._anim.type!=="dismount")return null;const t=this._anim.t;return{x:this._anim.fromX+(e.x-this._anim.fromX)*t,z:this._anim.fromZ+(e.z-this._anim.fromZ)*t}}syncRiderPosition(e,t,n,i=0,r=!1){if(this.myHorseId===null)return;const o=this.horses.get(this.myHorseId);o&&(o.x=e,o.z=t,o._sprinting=r,o._baseY=i,o.mesh.position.x=e,o.mesh.position.z=t,o._targetRY=n+Math.PI)}tryAutoMount(e,t,n=0){if(this.myHorseId!==null)return!1;for(const[i,r]of this.horses){if(r.riderId!==null)continue;const o=r.x-e.x,a=r.z-e.z;if(Math.sqrt(o*o+a*a)<Mf)return this._mount(i,t,n,e.x,e.z),!0}return!1}onRemoteMount(e,t){var i;const n=this.horses.get(e);n&&(n.riderId=t,(i=n.saddleNodes)==null||i.forEach(r=>r.visible=!0))}onRemoteDismount(e){var n;const t=this.horses.get(e);t&&(t.riderId=null,t._baseY=0,(n=t.saddleNodes)==null||n.forEach(i=>i.visible=!1))}onRemoteHorseMoved(e,t,n,i,r){const o=this.horses.get(e);o&&(o.x=t,o.z=n,o._baseY=0,o.mesh.position.x=t,o.mesh.position.z=n,o._targetRY=i+Math.PI,r&&r.snapTo(t,2.5,n,i))}isPlayerMounted(e){for(const t of this.horses.values())if(t.riderId===e)return!0;return!1}isMounted(){return this.myHorseId!==null}speedMultiplier(e=!1){return this.isMounted()?this._mountedSpeedMult*(e?l1:1):1}}const tm=65,ou=90,A1=.28,R1=20*Math.PI/180,C1=.38,P1=.005,I1=12;let Tf=0;const Ma=[];function L1(s,e,t,n,i=1.55,r=null){if(n-Tf<A1)return null;Tf=n;const o=r||{x:s.x+e.x*.8,y:i,z:s.z+e.z*.8},a=new Le(e.x,e.z).normalize(),c=[];for(const[,m]of t){const x=m.group.position.x-s.x,y=m.group.position.z-s.z,b=Math.sqrt(x*x+y*y);b>.5&&b<ou&&c.push({x:m.group.position.x,z:m.group.position.z,dist:b})}let l=null,h=R1;for(const m of c){const x=new Le(m.x-s.x,m.z-s.z).normalize(),y=Math.acos(Math.max(-1,Math.min(1,a.dot(x))));y<h&&(h=y,l=m)}let u=a.clone();if(l){const m=new Le(l.x-s.x,l.z-s.z).normalize();u.lerp(m,C1).normalize()}const d=l?l.dist:20,f=P1*Math.sqrt(d/I1),g=(Math.random()-.5)*2*f,_=Math.cos(g),p=Math.sin(g);return u.set(u.x*_-u.y*p,u.x*p+u.y*_).normalize(),{origin:{x:o.x,y:o.y,z:o.z},direction:{x:u.x,y:0,z:u.y}}}function D1(s,e,t){if(e.length===0)return null;const n=s.intersectObjects(e,!1);if(n.length===0)return null;const i=t.get(n[0].object.uuid);return i?{target:i,point:n[0].point.clone(),dist:n[0].distance,hitObject:n[0].object}:null}function nm(s,e,t,n=16776960,i=ou){const r=new ao(.12,4,4),o=new Zt({color:n}),a=new ae(r,o);a.position.set(e.x,e.y,e.z);const c=t&&typeof t.clone=="function"?t.clone().normalize():new A(t.x,t.y,t.z).normalize();s.add(a),Ma.push({mesh:a,dir:c,dist:0,maxDist:i})}function N1(s,e){for(let t=Ma.length-1;t>=0;t--){const n=Ma[t],i=tm*e;n.mesh.position.addScaledVector(n.dir,i),n.dist+=i,n.dist>=n.maxDist&&(s.remove(n.mesh),n.mesh.geometry.dispose(),n.mesh.material.dispose(),Ma.splice(t,1))}}function im(s,e){const t=new ao(.25,6,6),n=new Zt({color:16755200}),i=new ae(t,n);i.position.set(e.x,e.y,e.z),s.add(i),setTimeout(()=>{s.remove(i),t.dispose(),n.dispose()},65)}const hi=Object.create(null);hi.open="0";hi.close="1";hi.ping="2";hi.pong="3";hi.message="4";hi.upgrade="5";hi.noop="6";const ba=Object.create(null);Object.keys(hi).forEach(s=>{ba[hi[s]]=s});const yh={type:"error",data:"parser error"},sm=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",rm=typeof ArrayBuffer=="function",om=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s&&s.buffer instanceof ArrayBuffer,au=({type:s,data:e},t,n)=>sm&&e instanceof Blob?t?n(e):wf(e,n):rm&&(e instanceof ArrayBuffer||om(e))?t?n(e):wf(new Blob([e]),n):n(hi[s]+(e||"")),wf=(s,e)=>{const t=new FileReader;return t.onload=function(){const n=t.result.split(",")[1];e("b"+(n||""))},t.readAsDataURL(s)};function Ef(s){return s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new Uint8Array(s.buffer,s.byteOffset,s.byteLength)}let Qc;function U1(s,e){if(sm&&s.data instanceof Blob)return s.data.arrayBuffer().then(Ef).then(e);if(rm&&(s.data instanceof ArrayBuffer||om(s.data)))return e(Ef(s.data));au(s,!1,t=>{Qc||(Qc=new TextEncoder),e(Qc.encode(t))})}const Af="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Or=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let s=0;s<Af.length;s++)Or[Af.charCodeAt(s)]=s;const F1=s=>{let e=s.length*.75,t=s.length,n,i=0,r,o,a,c;s[s.length-1]==="="&&(e--,s[s.length-2]==="="&&e--);const l=new ArrayBuffer(e),h=new Uint8Array(l);for(n=0;n<t;n+=4)r=Or[s.charCodeAt(n)],o=Or[s.charCodeAt(n+1)],a=Or[s.charCodeAt(n+2)],c=Or[s.charCodeAt(n+3)],h[i++]=r<<2|o>>4,h[i++]=(o&15)<<4|a>>2,h[i++]=(a&3)<<6|c&63;return l},O1=typeof ArrayBuffer=="function",cu=(s,e)=>{if(typeof s!="string")return{type:"message",data:am(s,e)};const t=s.charAt(0);return t==="b"?{type:"message",data:z1(s.substring(1),e)}:ba[t]?s.length>1?{type:ba[t],data:s.substring(1)}:{type:ba[t]}:yh},z1=(s,e)=>{if(O1){const t=F1(s);return am(t,e)}else return{base64:!0,data:s}},am=(s,e)=>{switch(e){case"blob":return s instanceof Blob?s:new Blob([s]);case"arraybuffer":default:return s instanceof ArrayBuffer?s:s.buffer}},cm="",B1=(s,e)=>{const t=s.length,n=new Array(t);let i=0;s.forEach((r,o)=>{au(r,!1,a=>{n[o]=a,++i===t&&e(n.join(cm))})})},k1=(s,e)=>{const t=s.split(cm),n=[];for(let i=0;i<t.length;i++){const r=cu(t[i],e);if(n.push(r),r.type==="error")break}return n};function V1(){return new TransformStream({transform(s,e){U1(s,t=>{const n=t.length;let i;if(n<126)i=new Uint8Array(1),new DataView(i.buffer).setUint8(0,n);else if(n<65536){i=new Uint8Array(3);const r=new DataView(i.buffer);r.setUint8(0,126),r.setUint16(1,n)}else{i=new Uint8Array(9);const r=new DataView(i.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(n))}s.data&&typeof s.data!="string"&&(i[0]|=128),e.enqueue(i),e.enqueue(t)})}})}let el;function $o(s){return s.reduce((e,t)=>e+t.length,0)}function Zo(s,e){if(s[0].length===e)return s.shift();const t=new Uint8Array(e);let n=0;for(let i=0;i<e;i++)t[i]=s[0][n++],n===s[0].length&&(s.shift(),n=0);return s.length&&n<s[0].length&&(s[0]=s[0].slice(n)),t}function H1(s,e){el||(el=new TextDecoder);const t=[];let n=0,i=-1,r=!1;return new TransformStream({transform(o,a){for(t.push(o);;){if(n===0){if($o(t)<1)break;const c=Zo(t,1);r=(c[0]&128)===128,i=c[0]&127,i<126?n=3:i===126?n=1:n=2}else if(n===1){if($o(t)<2)break;const c=Zo(t,2);i=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),n=3}else if(n===2){if($o(t)<8)break;const c=Zo(t,8),l=new DataView(c.buffer,c.byteOffset,c.length),h=l.getUint32(0);if(h>Math.pow(2,21)-1){a.enqueue(yh);break}i=h*Math.pow(2,32)+l.getUint32(4),n=3}else{if($o(t)<i)break;const c=Zo(t,i);a.enqueue(cu(r?c:el.decode(c),e)),n=0}if(i===0||i>s){a.enqueue(yh);break}}}})}const lm=4;function Bt(s){if(s)return G1(s)}function G1(s){for(var e in Bt.prototype)s[e]=Bt.prototype[e];return s}Bt.prototype.on=Bt.prototype.addEventListener=function(s,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+s]=this._callbacks["$"+s]||[]).push(e),this};Bt.prototype.once=function(s,e){function t(){this.off(s,t),e.apply(this,arguments)}return t.fn=e,this.on(s,t),this};Bt.prototype.off=Bt.prototype.removeListener=Bt.prototype.removeAllListeners=Bt.prototype.removeEventListener=function(s,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+s];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+s],this;for(var n,i=0;i<t.length;i++)if(n=t[i],n===e||n.fn===e){t.splice(i,1);break}return t.length===0&&delete this._callbacks["$"+s],this};Bt.prototype.emit=function(s){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+s],n=1;n<arguments.length;n++)e[n-1]=arguments[n];if(t){t=t.slice(0);for(var n=0,i=t.length;n<i;++n)t[n].apply(this,e)}return this};Bt.prototype.emitReserved=Bt.prototype.emit;Bt.prototype.listeners=function(s){return this._callbacks=this._callbacks||{},this._callbacks["$"+s]||[]};Bt.prototype.hasListeners=function(s){return!!this.listeners(s).length};const nc=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),In=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),W1="arraybuffer";function hm(s,...e){return e.reduce((t,n)=>(s.hasOwnProperty(n)&&(t[n]=s[n]),t),{})}const X1=In.setTimeout,q1=In.clearTimeout;function ic(s,e){e.useNativeTimers?(s.setTimeoutFn=X1.bind(In),s.clearTimeoutFn=q1.bind(In)):(s.setTimeoutFn=In.setTimeout.bind(In),s.clearTimeoutFn=In.clearTimeout.bind(In))}const Y1=1.33;function K1(s){return typeof s=="string"?j1(s):Math.ceil((s.byteLength||s.size)*Y1)}function j1(s){let e=0,t=0;for(let n=0,i=s.length;n<i;n++)e=s.charCodeAt(n),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(n++,t+=4);return t}function um(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function $1(s){let e="";for(let t in s)s.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(s[t]));return e}function Z1(s){let e={},t=s.split("&");for(let n=0,i=t.length;n<i;n++){let r=t[n].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class J1 extends Error{constructor(e,t,n){super(e),this.description=t,this.context=n,this.type="TransportError"}}class lu extends Bt{constructor(e){super(),this.writable=!1,ic(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,n){return super.emitReserved("error",new J1(e,t,n)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=cu(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=$1(e);return t.length?"?"+t:""}}class Q1 extends lu{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let n=0;this._polling&&(n++,this.once("pollComplete",function(){--n||t()})),this.writable||(n++,this.once("drain",function(){--n||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=n=>{if(this.readyState==="opening"&&n.type==="open"&&this.onOpen(),n.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(n)};k1(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,B1(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=um()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let dm=!1;try{dm=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const eT=dm;function tT(){}class nT extends Q1{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let n=location.port;n||(n=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||n!==e.port}}doWrite(e,t){const n=this.request({method:"POST",data:e});n.on("success",t),n.on("error",(i,r)=>{this.onError("xhr post error",i,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,n)=>{this.onError("xhr poll error",t,n)}),this.pollXhr=e}}let $s=class Sa extends Bt{constructor(e,t,n){super(),this.createRequest=e,ic(this,n),this._opts=n,this._method=n.method||"GET",this._uri=t,this._data=n.data!==void 0?n.data:null,this._create()}_create(){var e;const t=hm(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const n=this._xhr=this.createRequest(t);try{n.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){n.setDisableHeaderCheck&&n.setDisableHeaderCheck(!0);for(let i in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(i)&&n.setRequestHeader(i,this._opts.extraHeaders[i])}}catch{}if(this._method==="POST")try{n.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{n.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(n),"withCredentials"in n&&(n.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(n.timeout=this._opts.requestTimeout),n.onreadystatechange=()=>{var i;n.readyState===3&&((i=this._opts.cookieJar)===null||i===void 0||i.parseCookies(n.getResponseHeader("set-cookie"))),n.readyState===4&&(n.status===200||n.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof n.status=="number"?n.status:0)},0))},n.send(this._data)}catch(i){this.setTimeoutFn(()=>{this._onError(i)},0);return}typeof document<"u"&&(this._index=Sa.requestsCount++,Sa.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=tT,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Sa.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};$s.requestsCount=0;$s.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Rf);else if(typeof addEventListener=="function"){const s="onpagehide"in In?"pagehide":"unload";addEventListener(s,Rf,!1)}}function Rf(){for(let s in $s.requests)$s.requests.hasOwnProperty(s)&&$s.requests[s].abort()}const iT=(function(){const s=fm({xdomain:!1});return s&&s.responseType!==null})();class sT extends nT{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=iT&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new $s(fm,this.uri(),e)}}function fm(s){const e=s.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||eT))return new XMLHttpRequest}catch{}if(!e)try{return new In[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const pm=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class rT extends lu{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,n=pm?{}:hm(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(n.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,n)}catch(i){return this.emitReserved("error",i)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const n=e[t],i=t===e.length-1;au(n,this.supportsBinary,r=>{try{this.doWrite(n,r)}catch{}i&&nc(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=um()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const tl=In.WebSocket||In.MozWebSocket;class oT extends rT{createSocket(e,t,n){return pm?new tl(e,t,n):t?new tl(e,t):new tl(e)}doWrite(e,t){this.ws.send(t)}}class aT extends lu{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=H1(Number.MAX_SAFE_INTEGER,this.socket.binaryType),n=e.readable.pipeThrough(t).getReader(),i=V1();i.readable.pipeTo(e.writable),this._writer=i.writable.getWriter();const r=()=>{n.read().then(({done:a,value:c})=>{a||(this.onPacket(c),r())}).catch(a=>{})};r();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const n=e[t],i=t===e.length-1;this._writer.write(n).then(()=>{i&&nc(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const cT={websocket:oT,webtransport:aT,polling:sT},lT=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,hT=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Mh(s){if(s.length>8e3)throw"URI too long";const e=s,t=s.indexOf("["),n=s.indexOf("]");t!=-1&&n!=-1&&(s=s.substring(0,t)+s.substring(t,n).replace(/:/g,";")+s.substring(n,s.length));let i=lT.exec(s||""),r={},o=14;for(;o--;)r[hT[o]]=i[o]||"";return t!=-1&&n!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=uT(r,r.path),r.queryKey=dT(r,r.query),r}function uT(s,e){const t=/\/{2,9}/g,n=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&n.splice(0,1),e.slice(-1)=="/"&&n.splice(n.length-1,1),n}function dT(s,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(n,i,r){i&&(t[i]=r)}),t}const bh=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ta=[];bh&&addEventListener("offline",()=>{Ta.forEach(s=>s())},!1);class Xi extends Bt{constructor(e,t){if(super(),this.binaryType=W1,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const n=Mh(e);t.hostname=n.host,t.secure=n.protocol==="https"||n.protocol==="wss",t.port=n.port,n.query&&(t.query=n.query)}else t.host&&(t.hostname=Mh(t.host).host);ic(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(n=>{const i=n.prototype.name;this.transports.push(i),this._transportsByName[i]=n}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Z1(this.opts.query)),bh&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ta.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=lm,t.transport=e,this.id&&(t.sid=this.id);const n=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](n)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Xi.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",Xi.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let n=0;n<this.writeBuffer.length;n++){const i=this.writeBuffer[n].data;if(i&&(t+=K1(i)),n>0&&t>this._maxPayload)return this.writeBuffer.slice(0,n);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,nc(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,n){return this._sendPacket("message",e,t,n),this}send(e,t,n){return this._sendPacket("message",e,t,n),this}_sendPacket(e,t,n,i){if(typeof t=="function"&&(i=t,t=void 0),typeof n=="function"&&(i=n,n=null),this.readyState==="closing"||this.readyState==="closed")return;n=n||{},n.compress=n.compress!==!1;const r={type:e,data:t,options:n};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),i&&this.once("flush",i),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},n=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?n():e()}):this.upgrading?n():e()),this}_onError(e){if(Xi.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),bh&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const n=Ta.indexOf(this._offlineEventListener);n!==-1&&Ta.splice(n,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}Xi.protocol=lm;class fT extends Xi{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),n=!1;Xi.priorWebsocketSuccess=!1;const i=()=>{n||(t.send([{type:"ping",data:"probe"}]),t.once("packet",u=>{if(!n)if(u.type==="pong"&&u.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;Xi.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{n||this.readyState!=="closed"&&(h(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const d=new Error("probe error");d.transport=t.name,this.emitReserved("upgradeError",d)}}))};function r(){n||(n=!0,h(),t.close(),t=null)}const o=u=>{const d=new Error("probe error: "+u);d.transport=t.name,r(),this.emitReserved("upgradeError",d)};function a(){o("transport closed")}function c(){o("socket closed")}function l(u){t&&u.name!==t.name&&r()}const h=()=>{t.removeListener("open",i),t.removeListener("error",o),t.removeListener("close",a),this.off("close",c),this.off("upgrading",l)};t.once("open",i),t.once("error",o),t.once("close",a),this.once("close",c),this.once("upgrading",l),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{n||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let n=0;n<e.length;n++)~this.transports.indexOf(e[n])&&t.push(e[n]);return t}}let pT=class extends fT{constructor(e,t={}){const n=typeof e=="object"?e:t;(!n.transports||n.transports&&typeof n.transports[0]=="string")&&(n.transports=(n.transports||["polling","websocket","webtransport"]).map(i=>cT[i]).filter(i=>!!i)),super(e,n)}};function mT(s,e="",t){let n=s;t=t||typeof location<"u"&&location,s==null&&(s=t.protocol+"//"+t.host),typeof s=="string"&&(s.charAt(0)==="/"&&(s.charAt(1)==="/"?s=t.protocol+s:s=t.host+s),/^(https?|wss?):\/\//.test(s)||(typeof t<"u"?s=t.protocol+"//"+s:s="https://"+s),n=Mh(s)),n.port||(/^(http|ws)$/.test(n.protocol)?n.port="80":/^(http|ws)s$/.test(n.protocol)&&(n.port="443")),n.path=n.path||"/";const r=n.host.indexOf(":")!==-1?"["+n.host+"]":n.host;return n.id=n.protocol+"://"+r+":"+n.port+e,n.href=n.protocol+"://"+r+(t&&t.port===n.port?"":":"+n.port),n}const gT=typeof ArrayBuffer=="function",_T=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s.buffer instanceof ArrayBuffer,mm=Object.prototype.toString,xT=typeof Blob=="function"||typeof Blob<"u"&&mm.call(Blob)==="[object BlobConstructor]",vT=typeof File=="function"||typeof File<"u"&&mm.call(File)==="[object FileConstructor]";function hu(s){return gT&&(s instanceof ArrayBuffer||_T(s))||xT&&s instanceof Blob||vT&&s instanceof File}function wa(s,e){if(!s||typeof s!="object")return!1;if(Array.isArray(s)){for(let t=0,n=s.length;t<n;t++)if(wa(s[t]))return!0;return!1}if(hu(s))return!0;if(s.toJSON&&typeof s.toJSON=="function"&&arguments.length===1)return wa(s.toJSON(),!0);for(const t in s)if(Object.prototype.hasOwnProperty.call(s,t)&&wa(s[t]))return!0;return!1}function yT(s){const e=[],t=s.data,n=s;return n.data=Sh(t,e),n.attachments=e.length,{packet:n,buffers:e}}function Sh(s,e){if(!s)return s;if(hu(s)){const t={_placeholder:!0,num:e.length};return e.push(s),t}else if(Array.isArray(s)){const t=new Array(s.length);for(let n=0;n<s.length;n++)t[n]=Sh(s[n],e);return t}else if(typeof s=="object"&&!(s instanceof Date)){const t={};for(const n in s)Object.prototype.hasOwnProperty.call(s,n)&&(t[n]=Sh(s[n],e));return t}return s}function MT(s,e){return s.data=Th(s.data,e),delete s.attachments,s}function Th(s,e){if(!s)return s;if(s&&s._placeholder===!0){if(typeof s.num=="number"&&s.num>=0&&s.num<e.length)return e[s.num];throw new Error("illegal attachments")}else if(Array.isArray(s))for(let t=0;t<s.length;t++)s[t]=Th(s[t],e);else if(typeof s=="object")for(const t in s)Object.prototype.hasOwnProperty.call(s,t)&&(s[t]=Th(s[t],e));return s}const bT=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var nt;(function(s){s[s.CONNECT=0]="CONNECT",s[s.DISCONNECT=1]="DISCONNECT",s[s.EVENT=2]="EVENT",s[s.ACK=3]="ACK",s[s.CONNECT_ERROR=4]="CONNECT_ERROR",s[s.BINARY_EVENT=5]="BINARY_EVENT",s[s.BINARY_ACK=6]="BINARY_ACK"})(nt||(nt={}));class ST{constructor(e){this.replacer=e}encode(e){return(e.type===nt.EVENT||e.type===nt.ACK)&&wa(e)?this.encodeAsBinary({type:e.type===nt.EVENT?nt.BINARY_EVENT:nt.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===nt.BINARY_EVENT||e.type===nt.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=yT(e),n=this.encodeAsString(t.packet),i=t.buffers;return i.unshift(n),i}}class uu extends Bt{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const n=t.type===nt.BINARY_EVENT;n||t.type===nt.BINARY_ACK?(t.type=n?nt.EVENT:nt.ACK,this.reconstructor=new TT(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(hu(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const n={type:Number(e.charAt(0))};if(nt[n.type]===void 0)throw new Error("unknown packet type "+n.type);if(n.type===nt.BINARY_EVENT||n.type===nt.BINARY_ACK){const r=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const o=e.substring(r,t);if(o!=Number(o)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const a=Number(o);if(!wT(a)||a<0)throw new Error("Illegal attachments");if(a>this.opts.maxAttachments)throw new Error("too many attachments");n.attachments=a}if(e.charAt(t+1)==="/"){const r=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););n.nsp=e.substring(r,t)}else n.nsp="/";const i=e.charAt(t+1);if(i!==""&&Number(i)==i){const r=t+1;for(;++t;){const o=e.charAt(t);if(o==null||Number(o)!=o){--t;break}if(t===e.length)break}n.id=Number(e.substring(r,t+1))}if(e.charAt(++t)){const r=this.tryParse(e.substr(t));if(uu.isPayloadValid(n.type,r))n.data=r;else throw new Error("invalid payload")}return n}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case nt.CONNECT:return Cf(t);case nt.DISCONNECT:return t===void 0;case nt.CONNECT_ERROR:return typeof t=="string"||Cf(t);case nt.EVENT:case nt.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&bT.indexOf(t[0])===-1);case nt.ACK:case nt.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class TT{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=MT(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const wT=Number.isInteger||function(s){return typeof s=="number"&&isFinite(s)&&Math.floor(s)===s};function Cf(s){return Object.prototype.toString.call(s)==="[object Object]"}const ET=Object.freeze(Object.defineProperty({__proto__:null,Decoder:uu,Encoder:ST,get PacketType(){return nt}},Symbol.toStringTag,{value:"Module"}));function Wn(s,e,t){return s.on(e,t),function(){s.off(e,t)}}const AT=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class gm extends Bt{constructor(e,t,n){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,n&&n.auth&&(this.auth=n.auth),this._opts=Object.assign({},n),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[Wn(e,"open",this.onopen.bind(this)),Wn(e,"packet",this.onpacket.bind(this)),Wn(e,"error",this.onerror.bind(this)),Wn(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var n,i,r;if(AT.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const o={type:nt.EVENT,data:t};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const h=this.ids++,u=t.pop();this._registerAckCallback(h,u),o.id=h}const a=(i=(n=this.io.engine)===null||n===void 0?void 0:n.transport)===null||i===void 0?void 0:i.writable,c=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!a||(c?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,t){var n;const i=(n=this.flags.timeout)!==null&&n!==void 0?n:this._opts.ackTimeout;if(i===void 0){this.acks[e]=t;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let a=0;a<this.sendBuffer.length;a++)this.sendBuffer[a].id===e&&this.sendBuffer.splice(a,1);t.call(this,new Error("operation has timed out"))},i),o=(...a)=>{this.io.clearTimeoutFn(r),t.apply(this,a)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...t){return new Promise((n,i)=>{const r=(o,a)=>o?i(o):n(a);r.withError=!0,t.push(r),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const n={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((i,...r)=>(this._queue[0],i!==null?n.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(i)):(this._queue.shift(),t&&t(null,...r)),n.pending=!1,this._drainQueue())),this._queue.push(n),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:nt.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(n=>String(n.id)===e)){const n=this.acks[e];delete this.acks[e],n.withError&&n.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case nt.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case nt.EVENT:case nt.BINARY_EVENT:this.onevent(e);break;case nt.ACK:case nt.BINARY_ACK:this.onack(e);break;case nt.DISCONNECT:this.ondisconnect();break;case nt.CONNECT_ERROR:this.destroy();const n=new Error(e.data.message);n.data=e.data.data,this.emitReserved("connect_error",n);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const n of t)n.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let n=!1;return function(...i){n||(n=!0,t.packet({type:nt.ACK,id:e,data:i}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:nt.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let n=0;n<t.length;n++)if(e===t[n])return t.splice(n,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let n=0;n<t.length;n++)if(e===t[n])return t.splice(n,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const n of t)n.apply(this,e.data)}}}function fr(s){s=s||{},this.ms=s.min||100,this.max=s.max||1e4,this.factor=s.factor||2,this.jitter=s.jitter>0&&s.jitter<=1?s.jitter:0,this.attempts=0}fr.prototype.duration=function(){var s=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*s);s=(Math.floor(e*10)&1)==0?s-t:s+t}return Math.min(s,this.max)|0};fr.prototype.reset=function(){this.attempts=0};fr.prototype.setMin=function(s){this.ms=s};fr.prototype.setMax=function(s){this.max=s};fr.prototype.setJitter=function(s){this.jitter=s};class wh extends Bt{constructor(e,t){var n;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,ic(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((n=t.randomizationFactor)!==null&&n!==void 0?n:.5),this.backoff=new fr({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const i=t.parser||ET;this.encoder=new i.Encoder,this.decoder=new i.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new pT(this.uri,this.opts);const t=this.engine,n=this;this._readyState="opening",this.skipReconnect=!1;const i=Wn(t,"open",function(){n.onopen(),e&&e()}),r=a=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",a),e?e(a):this.maybeReconnectOnOpen()},o=Wn(t,"error",r);if(this._timeout!==!1){const a=this._timeout,c=this.setTimeoutFn(()=>{i(),r(new Error("timeout")),t.close()},a);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(i),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(Wn(e,"ping",this.onping.bind(this)),Wn(e,"data",this.ondata.bind(this)),Wn(e,"error",this.onerror.bind(this)),Wn(e,"close",this.onclose.bind(this)),Wn(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){nc(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let n=this.nsps[e];return n?this._autoConnect&&!n.active&&n.connect():(n=new gm(this,e,t),this.nsps[e]=n),n}_destroy(e){const t=Object.keys(this.nsps);for(const n of t)if(this.nsps[n].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let n=0;n<t.length;n++)this.engine.write(t[n],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var n;this.cleanup(),(n=this.engine)===null||n===void 0||n.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const n=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(i=>{i?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",i)):e.onreconnect()}))},t);this.opts.autoUnref&&n.unref(),this.subs.push(()=>{this.clearTimeoutFn(n)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Cr={};function Ea(s,e){typeof s=="object"&&(e=s,s=void 0),e=e||{};const t=mT(s,e.path||"/socket.io"),n=t.source,i=t.id,r=t.path,o=Cr[i]&&r in Cr[i].nsps,a=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let c;return a?c=new wh(n,e):(Cr[i]||(Cr[i]=new wh(n,e)),c=Cr[i]),t.query&&!e.query&&(e.query=t.queryKey),c.socket(t.path,e)}Object.assign(Ea,{Manager:wh,Socket:gm,io:Ea,connect:Ea});let tt=null;function _m(){return tt=Ea(),tt}function xm(s,e){tt.emit("join",{roomId:s,name:e})}function vm(s){tt.volatile.emit("move",s)}function ym(s){tt.emit("shoot",s)}function Mm(s){tt.on("joined",s)}function bm(s){tt.on("playerJoined",s)}function Sm(s){tt.on("playerLeft",s)}function Tm(s){tt.on("playerMoved",s)}function wm(s){tt.on("playerShot",s)}function Em(s){tt.on("playerHit",s)}function Am(s){tt.on("playerKilled",s)}function Rm(s){tt.on("playerRespawned",s)}function RT(s){tt.emit("mountHorse",{horseId:s})}function CT(s){tt.emit("dismountHorse",{horseId:s})}function Cm(s){tt.volatile.emit("horseMoved",s)}function Pm(s){tt.on("playerMountedHorse",s)}function Im(s){tt.on("playerDismountedHorse",s)}function Lm(s){tt.on("horsePositionUpdate",s)}function Dm(s){tt.emit("npcChoice",{choice:s})}function Nm(s){tt.on("npcResponse",s)}function Um(s,e){tt.emit("bottleHit",{key:s,dir:e})}function Fm(s){tt.on("bottleHit",s)}function Om(s){tt.emit("ostrichKill",{idx:s})}function zm(s){tt.on("ostrichKill",s)}function Bm(s){tt.emit("cowCorralled",{id:s})}function km(s){tt.on("cowCorralled",s)}function Vm(s){tt.emit("bulletHit",{hitId:s})}function Hm(s,e){tt.emit("yell",{x:s,z:e})}function Gm(){tt.emit("toggleInvincible")}function Wm(s){tt.on("yell",s)}function Xm(s){tt.on("gmMessage",s)}function qm(s){tt.on("gmCommand",s)}function Ym(s){tt.on("npcSpawned",s)}function Km(s){tt.on("npcMoved",s)}function jm(s){tt.on("npcDialogue",s)}function $m(s){tt.on("npcRemoved",s)}function Hs(s,e={},t){tt.emit("gameEvent",{type:s,hour:t,...e})}function du(){return new URLSearchParams(window.location.search).get("room")||null}function Zm(){return Math.random().toString(36).substring(2,8)}const PT=Object.freeze(Object.defineProperty({__proto__:null,connect:_m,generateRoomId:Zm,getRoomId:du,joinRoom:xm,onBottleHit:Fm,onCowCorralled:km,onGmCommand:qm,onGmMessage:Xm,onHorsePositionUpdate:Lm,onJoined:Mm,onNpcDialogue:jm,onNpcMoved:Km,onNpcRemoved:$m,onNpcResponse:Nm,onNpcSpawned:Ym,onOstrichKill:zm,onPlayerDismountedHorse:Im,onPlayerHit:Em,onPlayerJoined:bm,onPlayerKilled:Am,onPlayerLeft:Sm,onPlayerMountedHorse:Pm,onPlayerMoved:Tm,onPlayerRespawned:Rm,onPlayerShot:wm,onYell:Wm,sendBottleHit:Um,sendBulletHit:Vm,sendCowCorralled:Bm,sendDismount:CT,sendGameEvent:Hs,sendHorseMoved:Cm,sendMount:RT,sendMove:vm,sendNpcChoice:Dm,sendOstrichKill:Om,sendShoot:ym,sendToggleInvincible:Gm,sendYell:Hm},Symbol.toStringTag,{value:"Module"})),Pt=s=>document.getElementById(s),IT="█",LT="░",DT=10;function Eh(s){const e=Math.round(Math.max(0,Math.min(100,s))/10);return IT.repeat(e)+LT.repeat(DT-e)}const Ne={lobby:Pt("lobby"),nameInput:Pt("name-input"),playBtn:Pt("play-btn"),crosshair:Pt("crosshair"),crosshairDot:Pt("crosshair-dot"),hud:Pt("hud"),barHp:Pt("bar-hp"),valHp:Pt("val-hp"),barHam:Pt("bar-ham"),valHam:Pt("val-ham"),barSed:Pt("bar-sed"),valSed:Pt("val-sed"),statTemp:Pt("stat-temp"),score:Pt("score"),gameTime:Pt("game-time"),scoreKd:Pt("score-kd"),playersCount:Pt("players-count"),killfeed:Pt("killfeed"),roomLink:Pt("room-link"),hitmarker:Pt("hitmarker"),damageOverlay:Pt("damage-overlay"),deathScreen:Pt("death-screen")};function NT(){Ne.lobby.style.display="none"}function UT(){Ne.crosshair.style.display="block",Ne.crosshairDot.style.display="block",document.body.classList.add("game-active"),Ne.hud.style.display="block",Ne.score.style.display="block",Ne.killfeed.style.display="block",Ne.roomLink.style.display="block"}function FT(s){Ne.crosshair&&Ne.crosshair.style.setProperty("--ch-color",s??"rgba(184,138,58,0.85)"),Ne.crosshairDot&&(Ne.crosshairDot.style.background=s??"rgba(232,200,112,0.9)")}function OT(s,e){Ne.crosshair&&(Ne.crosshair.style.left=s+"px",Ne.crosshair.style.top=e+"px"),Ne.crosshairDot&&(Ne.crosshairDot.style.left=s+"px",Ne.crosshairDot.style.top=e+"px")}function co(s){const e=Math.max(0,s);Ne.barHp.textContent=Eh(e),Ne.valHp.textContent=e,e>60?Ne.barHp.style.color="#885533":e>30?Ne.barHp.style.color="#7a4422":Ne.barHp.style.color="#cc2211"}function zT(s,e,t){Ne.barHam.textContent=Eh(s),Ne.valHam.textContent=s,Ne.barHam.style.color=s>40?"#7a5520":"#bb6611",Ne.barSed.textContent=Eh(e),Ne.valSed.textContent=e,Ne.barSed.style.color=e>40?"#225566":"#2288aa";let n,i;t>=38?(n="CALOR",i="#cc3322"):t>=28?(n="TIBIO",i="#8a7030"):t>=15?(n="FRESCO",i="#507050"):t>=5?(n="FRIO",i="#2266aa"):(n="HELADO",i="#4488cc"),Ne.statTemp.textContent=`TEMP ${t>0?"+":""}${t}°C  ${n}`,Ne.statTemp.style.color=i}function Ah(s,e){Ne.scoreKd.textContent=`K:${s}  M:${e}`}function BT(s,e){Ne.gameTime.textContent=s,Ne.gameTime.style.color=e?"#4a6090":"#c8a050"}function fu(s){Ne.playersCount.textContent=`${s} online`}function kT(s){const e=`${location.origin}?room=${s}`;Ne.roomLink.textContent=`sala: ${s}`,Ne.roomLink.title="click para copiar link",Ne.roomLink.onclick=()=>{navigator.clipboard.writeText(e);const t=Ne.roomLink.textContent;Ne.roomLink.textContent="link copiado",setTimeout(()=>{Ne.roomLink.textContent=t},1800)}}function VT(s,e){const t=document.createElement("div");t.className="kill-msg",t.innerHTML=`<b>${s}</b> &gt; <b>${e}</b>`,Ne.killfeed.appendChild(t),setTimeout(()=>t.remove(),5e3)}function Jm(){Ne.hitmarker.style.display="block",setTimeout(()=>{Ne.hitmarker.style.display="none"},180)}function HT(){let s=document.getElementById("_eat_msg");s||(s=document.createElement("div"),s.id="_eat_msg",s.style.cssText=`
      position:fixed; bottom:120px; left:50%; transform:translateX(-50%);
      z-index:300; font-family:'Share Tech Mono','Courier New',monospace;
      font-size:12px; color:#c8a050; letter-spacing:3px; pointer-events:none;
      opacity:0; transition:opacity .25s;
    `,document.body.appendChild(s)),s.textContent="+ CHURRASCO  VID+25  HAM+55",s.style.opacity="1",clearTimeout(s._t),s._t=setTimeout(()=>{s.style.opacity="0"},2200)}function GT(){Ne.damageOverlay.style.opacity="1",setTimeout(()=>{Ne.damageOverlay.style.opacity="0"},280)}function WT(){Ne.deathScreen.style.display="flex"}function XT(){Ne.deathScreen.style.display="none"}function qT(){return Ne.nameInput.value.trim()}function YT(s){Ne.playBtn.addEventListener("click",s),Ne.nameInput.addEventListener("keydown",e=>{e.key==="Enter"&&s()})}let Tn=null,Rh={x:0,z:0};function KT(){Tn=document.createElement("div"),Tn.id="coords-display",Tn.title="click para copiar",Tn.style.display="none",Tn.addEventListener("click",()=>{const s=`X:${Rh.x.toFixed(1)} Z:${Rh.z.toFixed(1)}`;navigator.clipboard.writeText(s);const e=Tn.textContent;Tn.textContent="copiado",setTimeout(()=>{Tn.textContent=e},1200)}),document.body.appendChild(Tn)}function jT(s,e){Tn&&(Rh={x:s,z:e},Tn.textContent=`${s.toFixed(0)},${e.toFixed(0)}`)}function $T(){Tn&&(Tn.style.display="block")}let Ln=null,Pr=null;const ZT=["Escapamos de gente a la que le gusta mandar.","Estamos buscando un templo.","Estábamos un poco perdidos."];function JT(s){Ln&&Ln.remove(),Ln=document.createElement("div"),Ln.style.cssText=`
    position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
    width:min(560px,86vw);
    background:rgba(7,4,1,0.97);
    border:1px solid #3a2808;
    padding:18px 24px;
    font-family:'Share Tech Mono','Courier New',monospace;
    color:#c8a050; z-index:500;
    pointer-events:auto; user-select:none;
  `,Ln.innerHTML=`
    <div style="font-size:9px;letter-spacing:4px;color:#4a3010;text-transform:uppercase;margin-bottom:10px;">
      ── El Viejo del Fuego ──
    </div>
    <div id="_npc_text" style="font-size:13px;line-height:1.75;color:#c8a050;min-height:22px;">${s}</div>
    <div id="_npc_choices" style="margin-top:14px;"></div>
  `,document.body.appendChild(Ln)}function QT(s){const e=document.getElementById("_npc_choices");if(!e)return;e.innerHTML="";let t=!1;ZT.forEach((n,i)=>{const r=document.createElement("button");r.textContent=`${i+1}. ${n}`,r.style.cssText=`
      display:block; width:100%;
      background:none; border:none; border-top:1px solid #2a1c08;
      color:#7a6030; font-family:inherit; font-size:12px;
      padding:9px 0; cursor:pointer; text-align:left;
      letter-spacing:0.5px; transition:color .12s;
    `,r.onmouseenter=()=>{r.style.color="#c8a050"},r.onmouseleave=()=>{r.style.color=t?r.style.color:"#7a6030"},r.onclick=()=>{t||(t=!0,e.querySelectorAll("button").forEach(o=>{o.disabled=!0,o.style.opacity="0.35",o.style.cursor="default"}),r.style.opacity="1",r.style.color="#c8a050",s(i))},e.appendChild(r)})}function ew(){const s=document.getElementById("_npc_choices");s&&(s.innerHTML=`
    <div style="font-size:10px;color:#3a2808;letter-spacing:2px;padding:8px 0;">
      esperando respuesta...
    </div>`)}function tw(s,e){const t=document.getElementById("_npc_text"),n=document.getElementById("_npc_choices");n&&(n.innerHTML=""),t&&(t.style.transition="opacity .3s",t.style.opacity="0",setTimeout(()=>{t.textContent=s,t.style.opacity="1"},320)),setTimeout(()=>{Ln&&(Ln.style.transition="opacity .6s",Ln.style.opacity="0",setTimeout(()=>{nw(),e&&e()},650))},3800)}function nw(){Ln&&(Ln.remove(),Ln=null)}let rs=null,Pf=null;function Qm(s=!1){rs||(rs=document.createElement("div"),rs.style.cssText=`
      position:fixed; top:40%; left:50%; transform:translate(-50%,-50%);
      z-index:300; font-family:'Share Tech Mono','Courier New',monospace;
      font-size:22px; letter-spacing:6px; color:#e8c050;
      text-shadow:0 0 18px rgba(230,180,40,0.7);
      pointer-events:none; opacity:0; transition:opacity .15s;
      text-transform:uppercase;
    `,document.body.appendChild(rs)),rs.textContent=s?"¡ARREEE!":"¡¡ ARREEE !!",rs.style.opacity="1",clearTimeout(Pf),Pf=setTimeout(()=>{rs.style.opacity="0"},s?800:1100)}function If(s,e=33){const t=document.getElementById("corral-count");t&&(t.textContent=`VACAS: ${s}/${e}`,t.style.color=s===e?"#44cc44":"#7a6030")}const iw=1e3,sw=1e3,rw=["↑","↗","→","↘","↓","↙","←","↖"];function ow(s,e){const t=document.getElementById("stable-waypoint");if(!t)return;const n=iw-s,i=sw-e,r=Math.sqrt(n*n+i*i);if(r<20){t.style.display="none";return}t.style.display="block";const o=Math.atan2(n,-i)*180/Math.PI,a=Math.round((o%360+360)%360/45)%8,c=rw[a],l=r>999?`${(r/1e3).toFixed(1)}km`:`${Math.round(r)}m`,h=t.querySelector(".wp-arrow"),u=t.querySelector(".wp-info");h&&(h.textContent=c),u&&(u.textContent=`ESTABLO ${l}`)}function aw(){Pr||(Pr=document.createElement("div"),Pr.style.cssText=`
    position:fixed; top:14px; left:50%; transform:translateX(-50%);
    z-index:210; pointer-events:none;
    font-family:'Share Tech Mono','Courier New',monospace;
    font-size:10px; color:#4a3010; letter-spacing:3px;
    text-align:center;
  `,Pr.innerHTML=`
    <div style="font-size:16px;color:#c8a050;transform:rotate(45deg);display:inline-block;line-height:1;">↑</div>
    <div style="margin-top:2px;">N</div>
  `,document.body.appendChild(Pr))}const cw=1.8,nl=9,lw=120,hw=new Zt({color:2759173,transparent:!0,opacity:0,depthWrite:!1,side:Dn}),uw=(()=>{const s=new ar(.52,.42);return s.rotateX(-Math.PI/2),s})();class dw{constructor(e){this.scene=e,this._prints=[],this._last=new Map}update(e,t){for(const[n,i]of e){if(i.riderId===null)continue;const r=this._last.get(n);if(!r){this._last.set(n,{x:i.x,z:i.z,side:0,dist:0});continue}const o=i.x-r.x,a=i.z-r.z;r.dist+=Math.sqrt(o*o+a*a),r.x=i.x,r.z=i.z,r.dist>=cw&&(r.dist=0,this._spawnPrint(i.x,i.z,o,a,r.side),r.side=1-r.side)}for(const[n]of this._last)(!e.has(n)||e.get(n).riderId===null)&&this._last.delete(n);for(let n=this._prints.length-1;n>=0;n--){const i=this._prints[n];i.t+=t;const r=Math.min(1,i.t/.3),o=Math.max(0,1-Math.max(0,i.t-(nl-2))/2);i.mesh.material.opacity=.32*r*o,i.t>=nl&&(this.scene.remove(i.mesh),i.mesh.material.dispose(),this._prints.splice(n,1))}}_spawnPrint(e,t,n,i,r){if(this._prints.length>=lw){const _=this._prints.shift();this.scene.remove(_.mesh),_.mesh.material.dispose()}const o=Math.sqrt(n*n+i*i)||1,a=-i/o,c=n/o,l=r===0?.38:-.38,h=a*l,u=c*l,d=Math.atan2(n,i),f=hw.clone();f.opacity=0;const g=new ae(uw,f);g.scale.set(1,1,1),g.position.set(e+h,.02,t+u),g.rotation.y=d,this.scene.add(g),this._prints.push({mesh:g,t:0,life:nl})}}const fw=600;let Qt=.5;const pw=[[0,8,8,22],[.18,18,12,38],[.25,195,95,45],[.3,130,165,215],[.5,130,195,235],[.68,138,170,210],[.75,198,118,65],[.8,70,35,55],[.87,12,8,24],[1,8,8,22]],mw=[[0,.04],[.22,.08],[.25,.38],[.32,.52],[.5,.62],[.68,.54],[.75,.36],[.82,.1],[1,.04]],gw=[[0,0],[.22,0],[.27,.6],[.33,1.1],[.5,1.5],[.68,1.2],[.75,.75],[.82,0],[1,0]],_w=[[0,200,160,90],[.25,255,135,50],[.35,255,215,140],[.5,255,250,220],[.68,255,218,130],[.75,255,122,42],[.82,90,60,160],[1,200,160,90]];function il(s,e){for(let t=0;t<s.length-1;t++){const[n,i]=s[t],[r,o]=s[t+1];if(e>=n&&e<=r)return i+(o-i)*((e-n)/(r-n))}return s[s.length-1][1]}function Lf(s,e){for(let n=0;n<s.length-1;n++){const[i,r,o,a]=s[n],[c,l,h,u]=s[n+1];if(e>=i&&e<=c){const d=(e-i)/(c-i);return[r+(l-r)*d,o+(h-o)*d,a+(u-a)*d]}}const t=s[s.length-1];return[t[1],t[2],t[3]]}function xw(s,e,t,n,i=null){pu||(Qt=(Qt+s/fw)%1);const[r,o,a]=Lf(pw,Qt);e.background.setRGB(r/255,o/255,a/255),e.fog.color.setRGB(r/255*.82,o/255*.82,a/255*.78),n.intensity=il(mw,Qt);const c=Qt<.25?Math.max(0,1-Qt/.22):Qt>.78?Math.min(1,(Qt-.78)/.1):0;n.color.setRGB(.55+(1-c)*.45,.5+(1-c)*.45,.55+c*.3),t.intensity=il(gw,Qt);const[l,h,u]=Lf(_w,Qt);t.color.setRGB(l/255,h/255,u/255),i&&(i.intensity=il(vw,Qt))}const vw=[[0,.55],[.18,.35],[.24,0],[.26,0],[.74,0],[.78,0],[.82,.3],[.9,.55],[1,.55]];function Xa(){return Qt}let pu=!1;function Aa(s){Qt=Math.max(0,Math.min(1,s)),pu=!0}function Ra(){pu=!1}function yw(){const s=(Qt-.5)*Math.PI*2;return Math.round(22+Math.cos(s)*17)}function Mw(){const s=Math.floor(Qt*1440),e=Math.floor(s/60),t=s%60;return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}`}function Df(){return Qt<.22||Qt>.8}let io=100,Ch=100;const bw=100/900,Sw=100/600,Tw=2.2,ww=1.4;function Ew(s,e,t){let n=1;t&&(n=ww),e&&(n=Tw),io=Math.max(0,io-bw*n*s),Ch=Math.max(0,Ch-Sw*n*s)}function Aw(){return Math.round(io)}function Rw(){return Math.round(Ch)}function Cw(s){io=Math.min(100,io+s)}let mu=null,Hr=[];new fi().load("/models/ostrich.glb",s=>{mu=s.scene,Hr.forEach(e0),Hr=[]},void 0,()=>{Hr=[]});function e0(s){s.children.slice().forEach(t=>{t!==s._hitbox&&s.remove(t)});const e=mu.clone(!0);e.scale.setScalar(1),e.traverse(t=>{t.isMesh&&(t.castShadow=t.receiveShadow=!0)}),s.add(e),s._legs=[],s._legPivots=[],s._neck=e.getObjectByName("neck")||null,s._headGroup=e.getObjectByName("head")||null}function Nf(s,e,t,n,i,r){const o=new oe({color:n,roughness:.85,transparent:!0,opacity:1,depthWrite:!1}),a=new ae(t,o);a.position.copy(e),a.castShadow=!0,s.add(a);const c=r?new A().subVectors(e,r).normalize():new A((Math.random()-.5)*2,1,(Math.random()-.5)*2).normalize(),l=new A(c.x*5+(Math.random()-.5)*4,Math.abs(c.y)*2+5+Math.random()*4,c.z*5+(Math.random()-.5)*4),h=new A((Math.random()-.5)*20,(Math.random()-.5)*20,(Math.random()-.5)*20);i.push({mesh:a,vel:l,angVel:h,t:0,maxT:7})}function Pw(s,e,t){for(let n=e.length-1;n>=0;n--){const i=e[n];if(i.t+=t,i.t>=i.maxT){s.remove(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),e.splice(n,1);continue}i.vel.y-=20*t,i.mesh.position.addScaledVector(i.vel,t),i.mesh.rotation.x+=i.angVel.x*t,i.mesh.rotation.y+=i.angVel.y*t,i.mesh.rotation.z+=i.angVel.z*t,i.mesh.position.y<.04&&(i.mesh.position.y=.04,i.vel.y*=-.25,i.vel.x*=.6,i.vel.z*=.6,i.angVel.multiplyScalar(.4)),i.t>i.maxT-.6&&(i.mesh.material.opacity=Math.max(0,(i.maxT-i.t)/.6))}}const Uf=28,Ff=1.6,Of=2.8,sl=7,zf=.45,Iw=120,Lw=[{x:13,z:-74},{x:-28,z:-82},{x:48,z:-52},{x:-18,z:-108},{x:62,z:-88},{x:8,z:-138},{x:-52,z:-62}],Ir=new oe({color:1380360,roughness:.98}),Jo=new oe({color:13664320,roughness:.9}),Dw=new oe({color:15245344,roughness:.85}),Bf=new oe({color:16742144,roughness:.5}),Nw=new oe({color:9120266,roughness:.88}),Uw=new oe({color:13936760,roughness:.9}),Fw=new Zt({transparent:!0,opacity:0,depthWrite:!1});function fn(s,e,t,n,i,r,o,a=0){const c=new ae(new Ae(s,e,t),n);return c.position.set(i,r,o),c.rotation.x=a,c.castShadow=!0,c}function t0(){const s=new Oe;s.add(fn(.58,.52,.72,Ir,0,1.38,0)),s.add(fn(.42,.46,.16,Ir,0,1.52,-.44,-.55)),s.add(fn(.14,.26,.38,Ir,-.37,1.48,.05)),s.add(fn(.14,.26,.38,Ir,.37,1.48,.05));const e=new Oe,t=fn(.14,.62,.14,Jo,0,1.96,.14,.28);e.add(t),e.add(fn(.22,.2,.24,Ir,0,2.38,.28)),e.add(fn(.08,.07,.2,Dw,0,2.34,.44)),e.add(fn(.05,.05,.03,Bf,-.11,2.41,.34)),e.add(fn(.05,.05,.03,Bf,.11,2.41,.34)),s.add(e);const n=[];for(const r of[-1,1]){const o=new Oe;o.position.set(r*.16,1.12,.04),s.add(o),o.add(fn(.11,.52,.11,Jo,0,-.26,0));const a=new Oe;a.position.set(0,-.52,0),o.add(a),a.add(fn(.09,.5,.09,Jo,0,-.25,.04)),a.add(fn(.2,.06,.18,Jo,0,-.53,.1)),n.push({pivot:o,kneePivot:a,phase:r>0?Math.PI:0})}const i=new ae(new Ae(.8,2.4,.9),Fw);return i.position.set(0,1.2,0),s.add(i),s._hitbox=i,s._legs=n,s._neck=t,s._headGroup=e,s._legPivots=[n[0].pivot,n[1].pivot],mu?e0(s):Hr&&Hr.push(s),s}function Ow(){const s=new Oe;return s.add(fn(.38,.09,.24,Nw,0,0,0)),s.add(fn(.34,.06,.07,Uw,0,.05,-.07)),s}function zw(s,e,t){const n=t0();return n.position.set(e+(Math.random()-.5)*4,0,t+(Math.random()-.5)*4),n.rotation.y=Math.random()*Math.PI*2,s.add(n),{mesh:n,spawnX:e,spawnZ:t,dead:!1,dying:!1,dyingT:0,walkT:Math.random()*10,wanderTimer:Math.random()*3,vx:0,vz:0,respawnTimer:0,churrascos:[],hp:2,wounded:!1,woundedT:0,woundedMaxT:6+Math.random()*3,detachedParts:[]}}class Bw{constructor(e){this._scene=e,this._entities=Lw.map(t=>zw(e,t.x,t.z)),this._bloodSpots=[]}getHitboxes(){const e=[];for(const t of this._entities)t.dead||t.dying||!t.mesh||(t.mesh._hitbox.updateWorldMatrix(!0,!1),e.push(t.mesh._hitbox));return e}getIndexByHitbox(e){return this._entities.findIndex(t=>t.mesh&&t.mesh._hitbox===e)}_spawnBloodSpot(e,t){var o;if(this._bloodSpots.length>80){const a=this._bloodSpots.shift();this._scene.remove(a),(o=a.geometry)==null||o.dispose()}const n=new Za(.2+Math.random()*.25,6),i=new Zt({color:5570560,transparent:!0,opacity:.7+Math.random()*.25,depthWrite:!1}),r=new ae(n,i);r.rotation.x=-Math.PI/2,r.position.set(e+(Math.random()-.5)*.4,.012,t+(Math.random()-.5)*.4),this._scene.add(r),this._bloodSpots.push(r)}kill(e){if(e<0||e>=this._entities.length)return;const t=this._entities[e];t.dead||t.dying||(t.dying=!0,t.dyingT=0)}hit(e,t,n){if(e<0||e>=this._entities.length)return;const i=this._entities[e];if(i.dead||i.dying||i.wounded)return;i.hp=Math.max(0,i.hp-1);const r=i.mesh.position.x,o=i.mesh.position.z,a=i.mesh.rotation.y;if(n==="head"&&i.mesh._headGroup&&!i._headDetached){i._headDetached=!0,i.mesh._headGroup.visible=!1;const c=r+Math.sin(a)*.28,l=o+Math.cos(a)*.28;Nf(this._scene,new A(c,2.3,l),new Ae(.22,.2,.24),1380360,i.detachedParts,t)}else{const c=Math.random()<.5?.16:-.16,l=r+Math.cos(a)*c,h=o-Math.sin(a)*c;Nf(this._scene,new A(l,.6,h),new Ae(.11,.52,.11),13664320,i.detachedParts,t)}i.hp<=0?(i.wounded=!0,i.woundedT=0,i.vx=0,i.vz=0,i.mesh._hitbox&&(i.mesh._hitbox.visible=!1)):i.wanderTimer=0}update(e,t){let n=null;for(const i of this._entities)i.detachedParts&&i.detachedParts.length>0&&Pw(this._scene,i.detachedParts,e);for(let i=0;i<this._entities.length;i++){const r=this._entities[i];if(r.dead){const c=this._tickChurrascos(r,e,t,n);c&&!n&&(n=c),r.respawnTimer-=e,r.respawnTimer<=0&&this._respawn(i);continue}if(r.wounded){r.woundedT+=e,r.mesh.rotation.z=Math.min(Math.PI/2,r.woundedT*3),r.mesh.position.y=0;const c=Math.max(0,.55-r.woundedT*.09),l=r.mesh.rotation.y;r.mesh.position.x+=Math.sin(l)*c*e,r.mesh.position.z+=Math.cos(l)*c*e,r._bloodTimer=(r._bloodTimer??0)+e,r._bloodTimer>=.35&&(r._bloodTimer=0,this._spawnBloodSpot(r.mesh.position.x,r.mesh.position.z)),r.woundedT>=r.woundedMaxT&&(r.wounded=!1,r.dying=!0,r.dyingT=0);continue}if(r.dying){r.dyingT+=e,r.mesh.rotation.z=Math.min(Math.PI/2,r.dyingT*4),r.mesh.position.y=0,r.dyingT>=1.4&&(r.lastX=r.mesh.position.x,r.lastZ=r.mesh.position.z,this._scene.remove(r.mesh),r.mesh=null,r.dead=!0,r.dying=!1,r.respawnTimer=Iw,this._spawnChurrascos(r));continue}if(r.wanderTimer-=e,r.wanderTimer<=0)if(Math.random()<.22)r.vx=0,r.vz=0,r.wanderTimer=1+Math.random()*1.5;else{const c=r.spawnX-r.mesh.position.x,l=r.spawnZ-r.mesh.position.z,h=Math.atan2(l,c)+(Math.random()-.5)*Math.PI*1.4;r.vx=Math.cos(h)*Ff,r.vz=Math.sin(h)*Ff,r.wanderTimer=2.5+Math.random()*3}const o=r.vx*r.vx+r.vz*r.vz>.01;if(o){const c=r.mesh.position.x+r.vx*e,l=r.mesh.position.z+r.vz*e,h=c-r.spawnX,u=l-r.spawnZ;h*h+u*u<Uf*Uf?(r.mesh.position.x=c,r.mesh.position.z=l):(r.vx=-r.vx,r.vz=-r.vz),r.mesh.rotation.y=Math.atan2(r.vx,r.vz),r.walkT+=e}this._animateWalk(r,o);const a=this._tickChurrascos(r,e,t,n);a&&!n&&(n=a)}return n}_animateWalk(e,t){const n=e.mesh;if(!t){for(const r of n._legs)r.pivot.rotation.x*=.8,r.kneePivot.rotation.x=r.pivot.rotation.x>0?-r.pivot.rotation.x*.55:0;n.position.y*=.8,n._neck&&(n._neck.rotation.x=.28);return}const i=e.walkT;n.position.y=Math.abs(Math.sin(sl*i))*.055,n._neck&&(n._neck.rotation.x=.28+Math.sin(sl*i)*.18);for(const r of n._legs){const o=Math.sin(sl*i+r.phase);r.pivot.rotation.x=o*zf,r.kneePivot.rotation.x=-Math.max(0,o)*zf*.65}}_spawnChurrascos(e){const t=e.lastX??e.spawnX,n=e.lastZ??e.spawnZ,i=3+Math.floor(Math.random()*3);for(let r=0;r<i;r++){const o=r/i*Math.PI*2+Math.random()*.6,a=.4+Math.random()*1,c=Ow();c.position.set(t+Math.cos(o)*a,.12,n+Math.sin(o)*a),c.rotation.y=Math.random()*Math.PI*2,this._scene.add(c),e.churrascos.push({mesh:c,t:0,bobPhase:Math.random()*Math.PI*2})}}_tickChurrascos(e,t,n,i){let r=null;for(let o=e.churrascos.length-1;o>=0;o--){const a=e.churrascos[o];if(a.t+=t,a.mesh.position.y=.12+Math.sin(a.t*2.2+a.bobPhase)*.06,a.mesh.rotation.y+=t*1.1,n&&!r&&!i){const c=a.mesh.position.x-n.x,l=a.mesh.position.z-n.z;if(c*c+l*l<Of*Of){this._scene.remove(a.mesh),e.churrascos.splice(o,1),r={hp:25,hunger:55};continue}}a.t>240&&(this._scene.remove(a.mesh),e.churrascos.splice(o,1))}return r}_respawn(e){const t=this._entities[e],n=(Math.random()-.5)*8,i=t0();i.position.set(t.spawnX+n,0,t.spawnZ+n),i.rotation.y=Math.random()*Math.PI*2,this._scene.add(i),t.mesh=i,t.dead=!1,t.dying=!1,t.dyingT=0,t.walkT=0,t.wanderTimer=1+Math.random()*2,t.vx=0,t.vz=0,t.respawnTimer=0,t.hp=2,t.wounded=!1,t.woundedT=0,t.detachedParts=[],t._headDetached=!1}}let gu=null,Gr=[];new fi().load("/models/cow.glb",s=>{gu=s.scene,Gr.forEach(n0),Gr=[]},void 0,()=>{Gr=[]});function n0(s){s.children.slice().forEach(i=>s.remove(i));const e=gu.clone(!0);e.scale.setScalar(.9),e.traverse(i=>{i.isMesh&&(i.castShadow=i.receiveShadow=!0)}),s.add(e);const n=["leg_fr","leg_fl","leg_br","leg_bl"].map(i=>e.getObjectByName(i)).filter(Boolean);s._legs=n.length===4?n.map(i=>({pivot:i,phase:0})):[],s._headGroup=e.getObjectByName("head")||e.getObjectByName("head_group")||null}const kw=new Zt({transparent:!0,opacity:0,depthWrite:!1}),Vw=new oe({color:9120266,roughness:.88}),Hw=new oe({color:13942928,roughness:.8}),Qo=1e3,ea=1e3,kf=15,Gw=3.8,Ww=-69,Vf=33,Vi={x:-137,z:12,hw:16,hd:12},Bs={x:-139,z:-39,hw:16,hd:12},ks=8,Hf=8,ta={grazing:{sigma:2.2,speed:.4,wpRadius:[4,12],timer:[5,12]},traveling:{sigma:.55,speed:1.7,wpRadius:[20,50],timer:[10,20]},fleeing:{sigma:3.8,speed:5,wpRadius:[50,80],timer:[4,8]}},Xw=16,qw=.12,Yw={grazing:.9,traveling:.45,fleeing:.25},Gf=2.5,i0=[{body:6041098,spot:15789280,horn:13942928},{body:1576968,spot:15261904,horn:13154416},{body:8011032,spot:16774376,horn:13680768},{body:4005904,spot:14207152,horn:12890208},{body:9127187,spot:16578798,horn:14207120}],Kw=i0.map(s=>({B:new oe({color:s.body,roughness:.93}),S:new oe({color:s.spot,roughness:.9}),H:new oe({color:s.horn,roughness:.8})}));function Wf(){let s=0,e=0;for(;s===0;)s=Math.random();for(;e===0;)e=Math.random();return Math.sqrt(-2*Math.log(s))*Math.cos(2*Math.PI*e)}function jw(s){let e=s>>>0;return()=>(e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296)}new A;function Xf(s,e,t,n,i,r){const o=new oe({color:n,roughness:.85,transparent:!0,opacity:1,depthWrite:!1}),a=new ae(t,o);a.position.copy(e),a.castShadow=!0,s.add(a);const c=r?new A().subVectors(e,r).normalize():new A((Math.random()-.5)*2,1,(Math.random()-.5)*2).normalize(),l=new A(c.x*5+(Math.random()-.5)*4,Math.abs(c.y)*2+5+Math.random()*4,c.z*5+(Math.random()-.5)*4),h=new A((Math.random()-.5)*20,(Math.random()-.5)*20,(Math.random()-.5)*20);i.push({mesh:a,vel:l,angVel:h,t:0,maxT:7})}function $w(s,e,t){for(let n=e.length-1;n>=0;n--){const i=e[n];if(i.t+=t,i.t>=i.maxT){s.remove(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),e.splice(n,1);continue}i.vel.y-=20*t,i.mesh.position.addScaledVector(i.vel,t),i.mesh.rotation.x+=i.angVel.x*t,i.mesh.rotation.y+=i.angVel.y*t,i.mesh.rotation.z+=i.angVel.z*t,i.mesh.position.y<.04&&(i.mesh.position.y=.04,i.vel.y*=-.25,i.vel.x*=.6,i.vel.z*=.6,i.angVel.multiplyScalar(.4)),i.t>i.maxT-.6&&(i.mesh.material.opacity=Math.max(0,(i.maxT-i.t)/.6))}}function Zw(s){const e=Math.floor(s()*i0.length),t=Kw[e],n=(c,l,h,u,d,f,g)=>{const _=new ae(new Ae(c,l,h),g);return _.position.set(u,d,f),_.castShadow=!0,_},i=new Oe;i.add(n(1.55,.82,.68,0,.92,0,t.B)),i.add(n(.28,.4,.26,.8,1.18,0,t.B)),i.add(n(.09,.55,.08,-.85,.98,0,t.B)),i.add(n(.58,.8,.71,.18,.92,.001,t.S)),i.add(n(.3,.13,.26,-.1,.518,.001,t.S));const r=new Oe;r.add(n(.48,.4,.36,1.1,1.44,0,t.B)),r.add(n(.07,.14,.05,1.03,1.66,.2,t.B)),r.add(n(.07,.14,.05,1.03,1.66,-.2,t.B)),r.add(n(.2,.19,.3,1.32,1.38,.001,t.S)),r.add(n(.05,.17,.04,.98,1.72,.18,t.H)),r.add(n(.05,.17,.04,.98,1.72,-.18,t.H)),i.add(r);const o=[{x:.48,z:.27,phase:0},{x:.48,z:-.27,phase:Math.PI},{x:-.48,z:.27,phase:Math.PI},{x:-.48,z:-.27,phase:0}],a=[];for(const c of o){const l=new Oe;l.position.set(c.x,.7,c.z);const h=new ae(new Ae(.16,.7,.14),t.B);h.position.set(0,-.35,0),h.castShadow=!0,l.add(h);const u=new ae(new Ae(.17,.05,.15),t.S);u.position.set(0,-.725,0),u.castShadow=!0,l.add(u),i.add(l),a.push({pivot:l,phase:c.phase})}return i._legs=a,i._headGroup=r,i._headColor=t.B.color.getHex(),gu?n0(i):Gr&&Gr.push(i),i}function Jw(){const s=new Oe,e=new ae(new Ae(.32,.1,.22),Vw);e.castShadow=!0,s.add(e);const t=new ae(new Ae(.08,.04,.28),Hw);return t.position.set(.12,.06,0),t.castShadow=!0,s.add(t),s}class Qw{constructor(e){this._scene=e,this._cows=[],this._corralled=new Set,this._hitboxMap=new Map,this._meats=[],this._bloodSpots=[];const t=jw(98765);for(let n=0;n<Vf;n++){const i=Zw(t);let r,o;if(n<4)r=Vi.x+(t()*2-1)*(Vi.hw-2.5),o=Vi.z+(t()*2-1)*(Vi.hd-2.5);else if(n<ks)r=Bs.x+(t()*2-1)*(Bs.hw-2.5),o=Bs.z+(t()*2-1)*(Bs.hd-2.5);else{const g=t()*Math.PI*2,_=8+t()*50;r=Gw+Math.cos(g)*_,o=Ww+Math.sin(g)*_}i.position.set(r,0,o),i.rotation.y=t()*Math.PI*2,i.scale.set(1.4,1.4,1.4);const a=new ae(new Ae(2.2,1.6,.85),kw);a.position.set(.2,.88,0),i.add(a),this._hitboxMap.set(a,n),e.add(i);const c=t()<.6?"grazing":"traveling",l=ta[c],h=l.wpRadius,u=t()*Math.PI*2,d=h[0]+t()*(h[1]-h[0]),f=n<ks;this._cows.push({id:n,mesh:i,hitbox:a,vx:0,vz:0,walkTime:t()*10,panicTimer:0,removed:!1,corrX:n<4?Vi.x:n<ks?Bs.x:null,corrZ:n<4?Vi.z:n<ks?Bs.z:null,corrHW:n<ks?Vi.hw:9999,corrHD:n<ks?Vi.hd:9999,escaped:!1,hp:2,wounded:!1,woundedT:0,woundedMaxT:5+t()*3,detachedParts:[],bbState:f?"grazing":c,waypoint:{x:f?r+(t()*2-1)*4:r+Math.cos(u)*d,z:f?o+(t()*2-1)*4:o+Math.sin(u)*d},waypointTimer:t()*l.timer[1],herdId:Math.floor(n/5),wanderAngle:t()*Math.PI*2})}}getCowHitboxes(){const e=[];for(const t of this._cows)t.removed||(t.hitbox.updateWorldMatrix(!0,!1),e.push(t.hitbox));return e}getCowIdByHitbox(e){const t=this._hitboxMap.get(e);return t!==void 0?t:-1}_killCowInternal(e){if(!e||e.removed)return;const t=e.mesh.position.x,n=e.mesh.position.z;e.removed=!0,this._hitboxMap.delete(e.hitbox),this._scene.remove(e.mesh),e.mesh.traverse(i=>{var r;i.isMesh&&((r=i.geometry)==null||r.dispose())});for(let i=0;i<8;i++){const r=i/8*Math.PI*2+Math.random()*.5,o=.5+Math.random()*1.2,a=Jw();a.position.set(t+Math.cos(r)*o,.12,n+Math.sin(r)*o),a.rotation.y=Math.random()*Math.PI*2,this._scene.add(a),this._meats.push({mesh:a,t:0,bobPhase:Math.random()*Math.PI*2})}}killCow(e){this._killCowInternal(this._cows[e])}hitCow(e,t,n){const i=this._cows[e];if(!i||i.removed||i.wounded)return;i.hp=Math.max(0,i.hp-1);const r=1.4,o=i.mesh.position.x,a=i.mesh.position.z;if(n==="head"&&i.mesh._headGroup&&!i._headDetached){i._headDetached=!0,i.mesh._headGroup.visible=!1;const c=new A(o+Math.cos(i.mesh.rotation.y)*1.1*r,1.44*r,a-Math.sin(i.mesh.rotation.y)*1.1*r);Xf(this._scene,c,new Ae(.48*r,.4*r,.36*r),i.mesh._headColor??6041098,i.detachedParts,t)}else{const c=Math.random()<.5?.27:-.27,l=Math.random()<.5?.48:-.48,h=new A(o+Math.cos(i.mesh.rotation.y)*l*r-Math.sin(i.mesh.rotation.y)*c*r,.35*r,a-Math.sin(i.mesh.rotation.y)*l*r-Math.cos(i.mesh.rotation.y)*c*r);Xf(this._scene,h,new Ae(.16*r,.7*r,.14*r),i.mesh._headColor??6041098,i.detachedParts,t)}if(i.hp<=0)i.wounded=!0,i.woundedT=0,i.vx=0,i.vz=0,this._hitboxMap.delete(i.hitbox),i.hitbox.visible=!1;else{i.bbState="fleeing",i.panicTimer=Math.max(i.panicTimer,5),i.waypointTimer=i.panicTimer+2;const c=t?i.mesh.position.x-t.x:Math.random()-.5,l=t?i.mesh.position.z-t.z:Math.random()-.5,h=Math.sqrt(c*c+l*l)||1;i.waypoint={x:i.mesh.position.x+c/h*50,z:i.mesh.position.z+l/h*50}}}_spawnBloodSpot(e,t){var o;if(this._bloodSpots.length>150){const a=this._bloodSpots.shift();this._scene.remove(a),(o=a.geometry)==null||o.dispose()}const n=new Za(.25+Math.random()*.35,7),i=new Zt({color:5570560,transparent:!0,opacity:.75+Math.random()*.2,depthWrite:!1}),r=new ae(n,i);r.rotation.x=-Math.PI/2,r.position.set(e+(Math.random()-.5)*.5,.012,t+(Math.random()-.5)*.5),this._scene.add(r),this._bloodSpots.push(r)}updateMeats(e,t){let n=null;for(let i=this._meats.length-1;i>=0;i--){const r=this._meats[i];if(r.t+=e,r.mesh.position.y=.12+Math.sin(r.t*2.4+r.bobPhase)*.07,r.mesh.rotation.y+=e*.9,t&&!n){const o=r.mesh.position.x-t.x,a=r.mesh.position.z-t.z;if(o*o+a*a<Gf*Gf){this._scene.remove(r.mesh),this._meats.splice(i,1),n={hp:8,hunger:18};continue}}r.t>300&&(this._scene.remove(r.mesh),this._meats.splice(i,1))}return n}corrall(e){if(this._corralled.has(e))return;this._corralled.add(e);const t=this._cows[e];t&&!t.removed&&(t.removed=!0,this._scene.remove(t.mesh),t.mesh.traverse(n=>{var i;n.isMesh&&((i=n.geometry)==null||i.dispose())}))}getCorralled(){return this._corralled.size}getTotal(){return Vf}yell(e,t,n=32){for(const i of this._cows){if(i.removed)continue;const r=i.mesh.position.x,o=i.mesh.position.z,a=r-e,c=o-t,l=Math.sqrt(a*a+c*c);if(l>n)continue;const h=l/Xw*1e3,u=l>.2?a/l:(Math.random()-.5)*2,d=l>.2?c/l:(Math.random()-.5)*2;setTimeout(()=>{if(i.removed)return;const f=i.mesh.position.x,g=i.mesh.position.z,_=Qo-f,p=ea-g,m=Math.sqrt(_*_+p*p)||1,x=u*.7+_/m*.3,y=d*.7+p/m*.3,b=Math.sqrt(x*x+y*y)||1,w=55+Math.random()*25;i.bbState="fleeing",i.waypoint={x:f+x/b*w,z:g+y/b*w},i.panicTimer=5+Math.random()*3,i.waypointTimer=i.panicTimer+2,i.wanderAngle=Math.atan2(x/b,y/b)},h)}}_spreadPanic(){for(const e of this._cows){if(e.removed||e.bbState!=="fleeing"||e.panicTimer<=0)continue;const t=e.mesh.position.x,n=e.mesh.position.z;for(const i of this._cows){if(i.removed||i.bbState==="fleeing"||i.id===e.id)continue;const r=i.mesh.position.x-t,o=i.mesh.position.z-n;if(r*r+o*o>=144)continue;const a=Math.sqrt(r*r+o*o)||1,c=r/a,l=o/a,h=Qo-i.mesh.position.x,u=ea-i.mesh.position.z,d=Math.sqrt(h*h+u*u)||1,f=c*.7+h/d*.3,g=l*.7+u/d*.3,_=Math.sqrt(f*f+g*g)||1,p=40+Math.random()*20;i.bbState="fleeing",i.waypoint={x:i.mesh.position.x+f/_*p,z:i.mesh.position.z+g/_*p},i.panicTimer=2.5+Math.random()*2,i.waypointTimer=i.panicTimer+1,i.wanderAngle=Math.atan2(f/_,g/_)}}}update(e,t,n){const i=[];for(const a of this._cows)a.detachedParts.length>0&&$w(this._scene,a.detachedParts,e);const r=new Map;for(const a of this._cows){if(a.removed)continue;let c=r.get(a.herdId);c||(c={x:0,z:0,n:0},r.set(a.herdId,c)),c.x+=a.mesh.position.x,c.z+=a.mesh.position.z,c.n+=1}const o=new Map;for(const[a,c]of r)o.set(a,{x:c.x/c.n,z:c.z/c.n});for(const a of this._cows){if(a.removed)continue;if(a.wounded){a.woundedT+=e,a.mesh.rotation.z=Math.min(Math.PI/2,a.woundedT*2.5),Math.floor(a.woundedT*3)%7===0&&(a.mesh.rotation.z+=Math.sin(a.woundedT*15)*.04);const p=Math.max(0,.45-a.woundedT*.08),m=a.mesh.rotation.y;a.mesh.position.x+=Math.cos(m)*p*e,a.mesh.position.z-=Math.sin(m)*p*e,a.mesh.position.y=0,a._bloodTimer=(a._bloodTimer??0)+e,a._bloodTimer>=.35&&(a._bloodTimer=0,this._spawnBloodSpot(a.mesh.position.x,a.mesh.position.z)),a.woundedT>=a.woundedMaxT&&this._killCowInternal(a);continue}const c=a.mesh.position.x,l=a.mesh.position.z,h=c-Qo,u=l-ea;if(h*h+u*u<kf*kf){i.push(a.id);continue}let d=0,f=0,g=!1;for(const p of t){const m=c-p.x,x=l-p.z,y=m*m+x*x;if(y<Hf*Hf&&y>.001){const b=1/Math.sqrt(y);d+=m*b,f+=x*b,g=!0}}if(g){const p=Math.sqrt(d*d+f*f)||1,m=d/p,x=f/p,y=Qo-c,b=ea-l,w=Math.sqrt(y*y+b*b)||1,E=m*.7+y/w*.3,C=x*.7+b/w*.3,v=Math.sqrt(E*E+C*C)||1;a.bbState="fleeing",a.waypoint={x:c+E/v*60,z:l+C/v*60},a.panicTimer=Math.max(a.panicTimer,3),a.waypointTimer=a.panicTimer+2,a.wanderAngle=Math.atan2(E/v,C/v)}if(a.panicTimer>0&&(a.panicTimer-=e,a.panicTimer<=0&&a.bbState==="fleeing")){a.bbState="grazing";const p=Math.random()*Math.PI*2;a.waypoint={x:c+Math.cos(p)*8,z:l+Math.sin(p)*8},a.waypointTimer=5+Math.random()*8}{const p=ta[a.bbState]??ta.grazing;a.waypointTimer-=e;const m=a.waypoint.x-c,x=a.waypoint.z-l,y=Math.sqrt(m*m+x*x)||1;if(a.bbState!=="fleeing"&&(y<p.wpRadius[0]*.5||a.waypointTimer<=0)){Math.random()<.35&&(a.bbState=a.bbState==="grazing"?"traveling":"grazing");const $=ta[a.bbState],de=Math.random()*Math.PI*2,_e=$.wpRadius[0]+Math.random()*($.wpRadius[1]-$.wpRadius[0]);a.waypoint={x:c+Math.cos(de)*_e,z:l+Math.sin(de)*_e},a.waypointTimer=$.timer[0]+Math.random()*($.timer[1]-$.timer[0])}const b=m/y*p.speed,w=x/y*p.speed,E=o.get(a.herdId),C=a.bbState==="fleeing"?.02:qw,v=E?(E.x-c)*C:0,T=E?(E.z-l)*C:0,F=p.sigma*Math.sqrt(e),P=Wf()*F,U=Wf()*F;let z=b+v+P,G=w+T+U;const B=Math.sqrt(z*z+G*G),H=p.speed*1.5;B>H&&(z*=H/B,G*=H/B);const O=Yw[a.bbState]??.6,Q=1-Math.exp(-e/O);a.vx+=(z-a.vx)*Q,a.vz+=(G-a.vz)*Q}if(a.mesh.position.x+=a.vx*e,a.mesh.position.z+=a.vz*e,a.corrHW<9999&&!a.escaped){const p=a.corrX-a.corrHW,m=a.corrX+a.corrHW,x=a.corrZ-a.corrHD,y=a.corrZ+a.corrHD,b=`${Math.round(a.corrX)},${Math.round(a.corrZ+a.corrHD)}`,w=n&&n.has(b);if(w&&a.mesh.position.z>y+1&&(a.escaped=!0),!a.escaped){const v=a.mesh.position.x-p,T=m-a.mesh.position.x,F=a.mesh.position.z-x,P=y-a.mesh.position.z;v<2&&(a.vx+=18*(1-v/2)*e),T<2&&(a.vx-=18*(1-T/2)*e),F<2&&(a.vz+=18*(1-F/2)*e),!w&&P<2&&(a.vz-=18*(1-P/2)*e),a.waypoint.x=Math.max(p+1,Math.min(m-1,a.waypoint.x)),a.waypoint.z=Math.max(x+1,Math.min(w?y+8:y-1,a.waypoint.z))}}const _=Math.sqrt(a.vx*a.vx+a.vz*a.vz);if(_>.1){let m=Math.atan2(-a.vz,a.vx)-a.mesh.rotation.y;for(;m>Math.PI;)m-=Math.PI*2;for(;m<-Math.PI;)m+=Math.PI*2;a.mesh.rotation.y+=m*Math.min(1,7*e),a.walkTime+=e;const x=Math.min(5.5,Math.max(2,_*2)),y=Math.min(.5,.26+_*.03);if(a.mesh._legs)for(const b of a.mesh._legs)b.pivot.rotation.z=Math.sin(a.walkTime*x+b.phase)*y;a.mesh.position.y=Math.abs(Math.sin(a.walkTime*x))*.03}else{if(a.mesh._legs)for(const p of a.mesh._legs)p.pivot.rotation.z*=.8;a.mesh.position.y*=.85}}return this._spreadPanic(),i}}let _u=null,Wr=[];new fi().load("/models/chicken.glb",s=>{_u=s.scene,Wr.forEach(s0),Wr=[]},void 0,()=>{Wr=[]});function s0(s){s.children.slice().forEach(i=>{i!==s._hitbox&&s.remove(i)});const e=_u.clone(!0);e.scale.setScalar(.55),e.traverse(i=>{i.isMesh&&(i.castShadow=i.receiveShadow=!0)}),s.add(e);const t=e.getObjectByName("leg_right")||e.getObjectByName("leg_r"),n=e.getObjectByName("leg_left")||e.getObjectByName("leg_l");s._legMeshes=t&&n?[t,n]:[]}function qf(){let s=0,e=0;for(;s===0;)s=Math.random();for(;e===0;)e=Math.random();return Math.sqrt(-2*Math.log(s))*Math.cos(2*Math.PI*e)}function eE(s){let e=s>>>0;return()=>(e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296)}function Yf(s,e,t,n,i,r){const o=new oe({color:n,roughness:.85,transparent:!0,opacity:1,depthWrite:!1}),a=new ae(t,o);a.position.copy(e),a.castShadow=!0,s.add(a);const c=r?new A().subVectors(e,r).normalize():new A((Math.random()-.5)*2,1,(Math.random()-.5)*2).normalize(),l=new A(c.x*6+(Math.random()-.5)*5,4+Math.random()*4,c.z*6+(Math.random()-.5)*5),h=new A((Math.random()-.5)*22,(Math.random()-.5)*22,(Math.random()-.5)*22);i.push({mesh:a,vel:l,angVel:h,t:0,maxT:7})}function tE(s,e,t){for(let n=e.length-1;n>=0;n--){const i=e[n];if(i.t+=t,i.t>=i.maxT){s.remove(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),e.splice(n,1);continue}i.vel.y-=20*t,i.mesh.position.addScaledVector(i.vel,t),i.mesh.rotation.x+=i.angVel.x*t,i.mesh.rotation.y+=i.angVel.y*t,i.mesh.rotation.z+=i.angVel.z*t,i.mesh.position.y<.03&&(i.mesh.position.y=.03,i.vel.y*=-.22,i.vel.x*=.58,i.vel.z*=.58,i.angVel.multiplyScalar(.38)),i.t>i.maxT-.5&&(i.mesh.material.opacity=Math.max(0,(i.maxT-i.t)/.5))}}const Kf=[{body:15259824,beak:13931530,comb:13376e3},{body:8010264,beak:12615696,comb:8917504},{body:1576968,beak:12613640,comb:11145728},{body:13127712,beak:13668376,comb:13376e3},{body:13678736,beak:13142544,comb:10032128}],nE=new Zt({transparent:!0,opacity:0,depthWrite:!1}),iE=[{x:-63,z:-48,n:5,hw:4,hd:4},{x:-54,z:-86,n:5,hw:4,hd:4},{x:-55,z:-2,n:5,hw:4,hd:4},{x:55,z:28,n:5,hw:4,hd:4},{x:71,z:-26,n:6,hw:4,hd:4}],na={grazing:{sigma:1.8,speed:.22,wpRadius:[2,7],timer:[3,9]},traveling:{sigma:.5,speed:.7,wpRadius:[6,18],timer:[5,12]},fleeing:{sigma:5.5,speed:5.5,wpRadius:[12,30],timer:[3,6]}},sE={grazing:.55,traveling:.28,fleeing:.12},rE=22,jf=4.5,$f=2.2;function oE(s){const e=Math.floor(s()*Kf.length),{body:t,beak:n,comb:i}=Kf[e],r=new Oe,o=(h,u,d,f,g,_,p)=>{const m=new ae(new Ae(h,u,d),new oe({color:f,roughness:.88}));return m.position.set(g,_,p),m.castShadow=!0,r.add(m),m};o(.36,.24,.28,t,0,.24,0),o(.2,.18,.2,t,.22,.4,0),o(.08,.05,.06,n,.34,.36,0),o(.06,.1,.05,i,.2,.52,0),o(.14,.16,.04,t,-.2,.34,.02),o(.04,.16,.22,t,.02,.24,.22),o(.04,.16,.22,t,.02,.24,-.22);const a=o(.05,.14,.05,n,.06,.06,.08),c=o(.05,.14,.05,n,.06,.06,-.08);a.name="leg_right",c.name="leg_left";const l=new ae(new Ae(.52,.45,.34),nE.clone());return l.position.set(.1,.28,0),r.add(l),r._hitbox=l,r._legMeshes=[a,c],r._headColor=t,_u?s0(r):Wr&&Wr.push(r),r}function aE(){const s=new Oe,e=new ae(new Ae(.18,.04,.1),new oe({color:15259824,roughness:.9}));return e.castShadow=!0,s.add(e),s}class cE{constructor(e){this._scene=e,this._chickens=[],this._hitboxMap=new Map,this._feathers=[];const t=eE(77531);let n=0;for(const i of iE){const r=i.hw??999,o=i.hd??999;for(let a=0;a<i.n;a++){const c=oE(t),l=Math.max(i.x-r+.5,Math.min(i.x+r-.5,i.x+(t()-.5)*r*1.6)),h=Math.max(i.z-o+.5,Math.min(i.z+o-.5,i.z+(t()-.5)*o*1.6));c.position.set(l,0,h),c.rotation.y=t()*Math.PI*2,e.add(c),this._hitboxMap.set(c._hitbox,n);const u="grazing",d=na[u],f=t()*Math.PI*2,g=Math.min(2.5,d.wpRadius[0]+t()*1.5);this._chickens.push({id:n,mesh:c,hitbox:c._hitbox,vx:0,vz:0,walkTime:t()*10,bbState:u,waypoint:{x:l+Math.cos(f)*g,z:h+Math.sin(f)*g},waypointTimer:t()*d.timer[1],panicTimer:0,herdId:Math.floor(n/5),removed:!1,hp:2,wounded:!1,woundedT:0,woundedMaxT:2.5+t()*1.5,detachedParts:[],spawnX:l,spawnZ:h,corrX:i.x,corrZ:i.z,corrHW:r,corrHD:o,escaped:!1}),n++}}}getHitboxes(){const e=[];for(const t of this._chickens)t.removed||t.wounded||(t.hitbox.updateWorldMatrix(!0,!1),e.push(t.hitbox));return e}getIdByHitbox(e){const t=this._hitboxMap.get(e);return t!==void 0?t:-1}hit(e,t,n){const i=this._chickens[e];if(!i||i.removed||i.wounded)return;i.hp=Math.max(0,i.hp-1);const r=i.mesh.position.x,o=i.mesh.position.z,a=i.mesh.rotation.y,c=i.mesh.scale.x??1;if(n==="head"){const l=r+Math.cos(a)*.22*c,h=o-Math.sin(a)*.22*c;Yf(this._scene,new A(l,.4*c,h),new Ae(.2,.18,.2),i.mesh._headColor??15259824,i.detachedParts,t)}else{const l=Math.random()<.5?.08:-.08,h=r+Math.cos(a)*.06-Math.sin(a)*l,u=o-Math.sin(a)*.06-Math.cos(a)*l;Yf(this._scene,new A(h,.1*c,u),new Ae(.05,.14,.05),13931530,i.detachedParts,t)}if(i.hp<=0)i.wounded=!0,i.woundedT=0,i.vx=0,i.vz=0,this._hitboxMap.delete(i.hitbox),i.hitbox.visible=!1;else{i.bbState="fleeing",i.panicTimer=Math.max(i.panicTimer,5),i.waypointTimer=i.panicTimer+2;const l=t?i.mesh.position.x-t.x:Math.random()-.5,h=t?i.mesh.position.z-t.z:Math.random()-.5,u=Math.sqrt(l*l+h*h)||1;i.waypoint={x:i.mesh.position.x+l/u*30,z:i.mesh.position.z+h/u*30}}}yell(e,t,n=40){for(const i of this._chickens){if(i.removed||i.wounded)continue;const r=i.mesh.position.x-e,o=i.mesh.position.z-t,a=Math.sqrt(r*r+o*o);if(a>n)continue;const c=a/rE*1e3,l=a>.2?r/a:(Math.random()-.5)*2,h=a>.2?o/a:(Math.random()-.5)*2;setTimeout(()=>{if(i.removed||i.wounded)return;i.bbState="fleeing",i.panicTimer=4+Math.random()*3,i.waypointTimer=i.panicTimer+2;const u=25+Math.random()*15;i.waypoint={x:i.mesh.position.x+l*u,z:i.mesh.position.z+h*u}},c)}}update(e,t,n){let i=null;for(const r of this._chickens)r.detachedParts.length>0&&tE(this._scene,r.detachedParts,e);for(let r=this._feathers.length-1;r>=0;r--){const o=this._feathers[r];if(o.t+=e,o.mesh.position.y=.08+Math.sin(o.t*2+o.bobPhase)*.05,o.mesh.rotation.y+=e*1.2,t&&t.length>0&&!i){const a=t[0];if(a){const c=o.mesh.position.x-a.x,l=o.mesh.position.z-a.z;if(c*c+l*l<$f*$f){this._scene.remove(o.mesh),this._feathers.splice(r,1),i={hp:5,hunger:12};continue}}}o.t>180&&(this._scene.remove(o.mesh),this._feathers.splice(r,1))}for(const r of this._chickens){if(r.removed)continue;if(r.wounded){if(r.woundedT+=e,r.mesh.rotation.z=Math.min(Math.PI/2,r.woundedT*4),r.woundedT>=r.woundedMaxT){r.removed=!0;const l=r.mesh.position.x,h=r.mesh.position.z;this._scene.remove(r.mesh);const u=2+Math.floor(Math.random()*3);for(let d=0;d<u;d++){const f=d/u*Math.PI*2+Math.random()*.5,g=.3+Math.random()*.8,_=aE();_.position.set(l+Math.cos(f)*g,.08,h+Math.sin(f)*g),_.rotation.y=Math.random()*Math.PI*2,this._scene.add(_),this._feathers.push({mesh:_,t:0,bobPhase:Math.random()*Math.PI*2})}}continue}const o=r.mesh.position.x,a=r.mesh.position.z;for(const l of t||[]){if(!l)continue;const h=o-l.x,u=a-l.z;if(h*h+u*u<jf*jf){const d=Math.sqrt(h*h+u*u)||1;r.bbState="fleeing",r.panicTimer=Math.max(r.panicTimer,3.5),r.waypointTimer=r.panicTimer+2,r.waypoint={x:o+h/d*25,z:a+u/d*25};break}}if(r.panicTimer>0&&(r.panicTimer-=e,r.panicTimer<=0&&r.bbState==="fleeing")){r.bbState="grazing";const l=Math.random()*Math.PI*2;r.waypoint={x:o+Math.cos(l)*5,z:a+Math.sin(l)*5},r.waypointTimer=3+Math.random()*6}{const l=na[r.bbState]??na.grazing;r.waypointTimer-=e;const h=r.waypoint.x-o,u=r.waypoint.z-a,d=Math.sqrt(h*h+u*u)||1;if(r.bbState!=="fleeing"&&(d<l.wpRadius[0]*.5||r.waypointTimer<=0)){Math.random()<.35&&(r.bbState=r.bbState==="grazing"?"traveling":"grazing");const v=na[r.bbState],T=Math.random()*Math.PI*2,F=v.wpRadius[0]+Math.random()*(v.wpRadius[1]-v.wpRadius[0]);r.waypoint={x:o+Math.cos(T)*F,z:a+Math.sin(T)*F},r.waypointTimer=v.timer[0]+Math.random()*(v.timer[1]-v.timer[0])}const f=h/d*l.speed,g=u/d*l.speed,_=l.sigma*Math.sqrt(e),p=qf()*_,m=qf()*_;let x=f+p,y=g+m;const b=Math.sqrt(x*x+y*y),w=l.speed*1.7;b>w&&(x*=w/b,y*=w/b);const E=sE[r.bbState]??.5,C=1-Math.exp(-e/E);r.vx+=(x-r.vx)*C,r.vz+=(y-r.vz)*C}if(r.mesh.position.x+=r.vx*e,r.mesh.position.z+=r.vz*e,r.corrHW<900&&!r.escaped){const l=r.corrX-r.corrHW,h=r.corrX+r.corrHW,u=r.corrZ-r.corrHD,d=r.corrZ+r.corrHD,f=`${Math.round(r.corrX)},${Math.round(r.corrZ+r.corrHD+1)}`,g=n&&n.has(f);if(g&&r.mesh.position.z>d+.5&&(r.escaped=!0),!r.escaped){const m=r.mesh.position.x-l,x=h-r.mesh.position.x,y=r.mesh.position.z-u,b=d-r.mesh.position.z;m<1.2&&(r.vx+=22*(1-m/1.2)*e),x<1.2&&(r.vx-=22*(1-x/1.2)*e),y<1.2&&(r.vz+=22*(1-y/1.2)*e),!g&&b<1.2&&(r.vz-=22*(1-b/1.2)*e),r.waypoint.x=Math.max(l+.5,Math.min(h-.5,r.waypoint.x)),r.waypoint.z=Math.max(u+.5,Math.min(g?d+5:d-.5,r.waypoint.z))}}const c=Math.sqrt(r.vx*r.vx+r.vz*r.vz);if(c>.04){let h=Math.atan2(-r.vz,r.vx)-r.mesh.rotation.y;for(;h>Math.PI;)h-=Math.PI*2;for(;h<-Math.PI;)h+=Math.PI*2;r.mesh.rotation.y+=h*Math.min(1,12*e),r.walkTime+=e*c*4.5,r.mesh.position.y=Math.abs(Math.sin(r.walkTime*7))*.025,r.mesh.rotation.x=Math.sin(r.walkTime*7)*.12}else r.mesh.position.y*=.82,r.mesh.rotation.x*=.85}return i}}let xu=null,Ca=[];new fi().load("/models/campesino.glb",s=>{xu=s.scene,Ca.forEach(r0),Ca=[]},void 0,()=>{Ca=[]});function r0(s){s.children.slice().forEach(t=>{t._keep||s.remove(t)});const e=xu.clone(!0);e.traverse(t=>{t.isMesh&&(t.castShadow=t.receiveShadow=!0)}),s.add(e),s._legs=[]}const lE=[{name:"Ramón",skin:9127187,shirt:12875578,shirt2:15777920,pants:2899563,hat:13936688,boot:3809296,scale:1.04,wM:1.22,bigote:!0,poncho:!0,tool:"shovel",speed:.54},{name:"Ofelia",skin:8075280,shirt:13652016,shirt2:16306320,pants:6299704,hat:13146144,boot:2758664,scale:.9,wM:.9,bigote:!1,skirt:!0,trenza:!0,tool:"none",speed:.51},{name:"Facundo",skin:10179875,shirt:4214912,shirt2:8425656,pants:1977886,hat:13148200,boot:3153936,scale:1.13,wM:1.12,bigote:!0,beard:!0,tool:"pitchfork",speed:.47},{name:"Celestino",skin:7024656,shirt:4749368,shirt2:9484400,pants:2631704,hat:12490784,boot:2627592,scale:.86,wM:.97,bigote:!0,grayHair:!0,tool:"cane",speed:.43},{name:"Zulma",skin:9131299,shirt:11550816,shirt2:15245488,pants:1579038,hat:13676592,boot:3153944,scale:.95,wM:.94,bigote:!1,skirt:!0,ponytail:!0,apron:!0,tool:"none",speed:.53}],hE=[{from:{x:-7,z:-106},to:{x:7,z:-106}},{from:{x:14,z:-118},to:{x:14,z:-132}},{from:{x:-14,z:-118},to:{x:-14,z:-132}},{from:{x:-6,z:-138},to:{x:6,z:-138}},{from:{x:0,z:-143},to:{x:0,z:-150}}];function uE(s){const e=new Oe,t=s.wM??1,n=(l,h,u,d,f,g,_)=>{const p=new ae(new Ae(h,u,d),new oe({color:l,roughness:.88}));return p.position.set(f,g,_),p.castShadow=p.receiveShadow=!0,p},i=[];for(const l of[-1,1]){const h=new Oe;h.position.set(l*.13*t,.52,0),h.add(n(s.pants,.21*t,.5,.19,0,-.25,0)),h.add(n(s.boot,.23*t,.14,.23,0,-.52,.02)),e.add(h),i.push({piv:h,phase:l>0?0:Math.PI})}s.skirt&&(e.add(n(s.pants,.56*t,.54,.32,0,.27,0)),e.add(n(s.shirt2,.58*t,.08,.34,0,.06,0)));const r=new Oe;e.add(r);const o=new Oe;if(o.position.set(0,.78,0),r.add(o),o.add(n(s.shirt,.52*t,.52,.27,0,0,0)),s.poncho)o.add(n(s.shirt2,.64*t,.44,.1,0,.02,.09)),o.add(n(s.shirt2,.64*t,.44,.1,0,.02,-.09)),o.add(n(12611616,.66*t,.07,.12,0,.22,0));else if(s.apron)o.add(n(s.shirt2,.13,.52,.28,-.15*t,0,0)),o.add(n(s.shirt2,.13,.52,.28,.15*t,0,0)),o.add(n(15786160,.3,.48,.05,0,0,.15)),o.add(n(13680784,.34,.06,.06,0,.23,.16));else{o.add(n(s.shirt2,.13,.52,.28,-.15*t,0,0)),o.add(n(s.shirt2,.13,.52,.28,.15*t,0,0));for(let l=-1;l<=1;l++)o.add(n(2758656,.05,.05,.05,0,l*.14,.14))}const a=[];for(const l of[-1,1]){const h=new Oe;h.position.set(l*(.34*t+.02),1.18,0),h.add(n(s.shirt,.17,.4,.17,0,-.2,0)),h.add(n(s.skin,.17,.14,.16,0,-.42,0)),r.add(h),a.push({piv:h,phase:l>0?Math.PI:0})}const c=new Oe;if(c.position.set(0,1.36,0),r.add(c),c.add(n(s.skin,.17,.14,.15,0,0,0)),c.add(n(s.skin,.4*t,.38,.36,0,.24,0)),c.add(n(1705984,.08,.07,.04,-.11,.27,.19)),c.add(n(1705984,.08,.07,.04,.11,.27,.19)),s.bigote&&c.add(n(2756608,.26,.06,.04,0,.16,.19)),s.beard&&(c.add(n(1707014,.32,.16,.06,0,.08,.18)),c.add(n(1707014,.14,.22,.06,-.13,.16,.17)),c.add(n(1707014,.14,.22,.06,.13,.16,.17))),s.grayHair&&(c.add(n(12630176,.44,.1,.38,0,.46,0)),c.add(n(12630176,.1,.22,.38,-.22,.36,0)),c.add(n(12630176,.1,.22,.38,.22,.36,0))),s.trenza&&(c.add(n(3807232,.12,.2,.12,.02,.24,-.2)),c.add(n(3807232,.1,.3,.1,.02,.02,-.19)),c.add(n(3807232,.08,.16,.08,.02,-.14,-.17)),c.add(n(s.shirt,.07,.07,.07,.02,-.23,-.16))),s.ponytail&&(c.add(n(2756608,.12,.12,.12,.02,.43,-.19)),c.add(n(2756608,.09,.28,.09,.03,.22,-.23)),c.add(n(s.shirt2,.07,.07,.07,.03,.1,-.21))),c.add(n(s.hat,.72,.07,.68,0,.46,0)),c.add(n(s.hat,.38,.24,.35,0,.58,0)),c.add(n(5908488,.4,.07,.37,0,.47,0)),s.tool==="shovel"){const l=new Oe;l.position.set(0,-.18,0),l.add(n(8013856,.07,.68,.07,0,-.34,0)),l.add(n(9476264,.23,.04,.04,0,-.7,-.03)),l.add(n(9476264,.22,.22,.04,0,-.78,-.02)),a[1].piv.add(l),e._toolGroup=l}if(s.tool==="pitchfork"){const l=new Oe;l.position.set(0,-.18,0),l.add(n(8013856,.07,.78,.07,0,-.39,0)),l.add(n(9476264,.28,.04,.04,0,-.72,0)),l.add(n(9476264,.04,.22,.04,-.1,-.8,0)),l.add(n(9476264,.04,.22,.04,0,-.8,0)),l.add(n(9476264,.04,.22,.04,.1,-.8,0)),a[0].piv.add(l),e._toolGroup=l}if(s.tool==="cane"){const l=new Oe;l.position.set(.45*t,.88,.08),l.rotation.z=.18,l.add(n(8013856,.07,.86,.07,0,-.43,0)),l.add(n(8013856,.18,.07,.07,.07,.06,0)),e.add(l),e._caneGroup=l}return e.scale.setScalar(s.scale??1),e._legs=i,e._armPivs=a,e._torso=o,e._hipGroup=r,e._headPivot=c,e}function dE(s){const e=document.createElement("canvas");e.width=256,e.height=48;const t=e.getContext("2d");t.fillStyle="rgba(0,0,0,0.5)",t.roundRect(4,4,248,40,8),t.fill(),t.fillStyle="#f0e0b0",t.font="bold 22px monospace",t.textAlign="center",t.fillText(s,128,30);const n=new Ga(e),i=new Ba({map:n,transparent:!0,depthTest:!1}),r=new sh(i);return r.scale.set(1.6,.32,1),r.position.set(0,2.2,0),r.visible=!1,r}function fE(s,e,t){s.idleLookTimer-=t,s.idleLookTimer<=0&&(s.idleLookTarget=(Math.random()-.5)*1.1,s.idleLookTimer=2.5+Math.random()*4),e._headPivot&&(e._headPivot.rotation.y+=(s.idleLookTarget-e._headPivot.rotation.y)*Math.min(1,1.8*t))}class pE{constructor(e){this._npcs=[],this._scene=e,lE.forEach((t,n)=>{const i=hE[n],r=uE(t);r.position.set((i.from.x+i.to.x)/2,0,(i.from.z+i.to.z)/2),r.rotation.y=Math.random()*Math.PI*2;const o=dE(t.name);o._keep=!0,r.add(o),e.add(r),xu?r0(r):Ca.push(r),this._npcs.push({root:r,label:o,patrol:i,t:Math.random(),dir:Math.random()>.5?1:-1,speed:t.speed??.52,walkT:Math.random()*10,pauseT:0,name:t.name,idleLookTimer:Math.random()*3,idleLookTarget:0})})}update(e,t){for(const n of this._npcs){const{root:i,patrol:r,label:o}=n;if(t){const d=i.position.x-t.x,f=i.position.z-t.z;o.visible=d*d+f*f<36}if(i._headPivot)if(t&&(()=>{const f=t.x-i.position.x,g=t.z-i.position.z;return f*f+g*g<64})()){const f=t.x-i.position.x,g=t.z-i.position.z;let _=Math.atan2(f,g)-i.rotation.y;for(;_>Math.PI;)_-=Math.PI*2;for(;_<-Math.PI;)_+=Math.PI*2;const p=Math.max(-.85,Math.min(.85,_));i._headPivot.rotation.y+=(p-i._headPivot.rotation.y)*Math.min(1,4*e)}else fE(n,i,e);if(n.pauseT>0){n.pauseT-=e,i._torso&&(i._torso.scale.y=1+Math.sin(n.walkT*1.5)*.018),i._hipGroup&&(i._hipGroup.rotation.y*=Math.max(0,1-3*e)),n.walkT+=e;continue}const a=r.to.x-r.from.x,c=r.to.z-r.from.z,l=Math.sqrt(a*a+c*c);if(n.t+=n.speed/Math.max(l,.01)*e*n.dir,n.t>=1&&(n.t=1,n.dir=-1,n.pauseT=.8+Math.random()*1.2),n.t<=0&&(n.t=0,n.dir=1,n.pauseT=.8+Math.random()*1.2),i.position.x=r.from.x+a*n.t,i.position.z=r.from.z+c*n.t,l>.01){let f=Math.atan2(a*n.dir,c*n.dir)-i.rotation.y;for(;f>Math.PI;)f-=Math.PI*2;for(;f<-Math.PI;)f+=Math.PI*2;i.rotation.y+=f*Math.min(1,8*e)}n.walkT+=e*n.speed*3.5;const h=2.8,u=.32;for(const d of i._legs)d.piv.rotation.x=Math.sin(n.walkT*h+d.phase)*u;for(const d of i._armPivs)d.piv.rotation.x=Math.sin(n.walkT*h+d.phase)*(u*.52);i._hipGroup&&(i._hipGroup.rotation.y=Math.sin(n.walkT*h*.5)*.08),i.position.y=Math.abs(Math.sin(n.walkT*h))*.022}}getNearby(e,t,n=5){for(const i of this._npcs){const r=i.root.position.x-e,o=i.root.position.z-t;if(r*r+o*o<n*n)return i.name}return null}}class mE{constructor(){this._visible=!1,this._selected=0,this._weapons=[{id:"shotgun",label:"ESCOPETA",icon:"🔫"},{id:"lasso",label:"LAZO",icon:"🪢"},{id:"food",label:"COMIDA",icon:"🥩"}],this._mouseX=0,this._mouseY=0,this._el=null,this._canvas=null,this._labelEl=null,this._build(),document.addEventListener("mousemove",e=>{this._mouseX=e.clientX,this._mouseY=e.clientY,this._visible&&(this._updateSelection(),this._draw())})}_build(){this._el=document.createElement("div"),this._el.id="radial-menu",this._el.style.cssText="display:none;position:fixed;inset:0;z-index:9999;pointer-events:none;",this._canvas=document.createElement("canvas"),this._canvas.style.cssText="position:absolute;inset:0;width:100%;height:100%;",this._el.appendChild(this._canvas),this._labelEl=document.createElement("div"),this._labelEl.style.cssText=["position:absolute","left:50%","top:calc(50% + 140px)","transform:translateX(-50%)","color:#f0c040","font:bold 22px sans-serif","text-shadow:0 2px 8px #000","letter-spacing:3px","text-align:center","pointer-events:none"].join(";"),this._el.appendChild(this._labelEl),this._hudEl=document.createElement("div"),this._hudEl.id="weapon-hud",this._hudEl.style.cssText=["position:fixed","bottom:80px","left:20px","color:#fff","font:bold 16px sans-serif","text-shadow:0 0 6px #000","background:rgba(0,0,0,0.45)","padding:6px 14px","border-radius:8px","border:1px solid rgba(255,255,255,0.2)","letter-spacing:1px"].join(";"),this._hudEl.textContent="🔫 ESCOPETA",document.body.appendChild(this._el),document.body.appendChild(this._hudEl)}show(e){this._visible=!0,this._el.style.display="block",this._selected=this._weapons.findIndex(t=>t.id===e),this._selected<0&&(this._selected=0),this._draw()}hide(){this._visible=!1,this._el.style.display="none"}getSelected(){var e;return((e=this._weapons[this._selected])==null?void 0:e.id)??"shotgun"}setHUD(e){const t=this._weapons.find(n=>n.id===e);t&&this._hudEl&&(this._hudEl.textContent=`${t.icon} ${t.label}`)}_updateSelection(){const e=window.innerWidth/2,t=window.innerHeight/2,n=this._mouseX-e,i=this._mouseY-t;if(Math.sqrt(n*n+i*i)<45)return;let r=Math.atan2(i,n);r=(r+Math.PI*2)%(Math.PI*2);const o=this._weapons.length;let a=r+Math.PI/2;a=(a+Math.PI*2)%(Math.PI*2),this._selected=Math.floor(a/(Math.PI*2/o))%o}_draw(){var l;const e=this._canvas;e.width=window.innerWidth,e.height=window.innerHeight;const t=e.getContext("2d");t.clearRect(0,0,e.width,e.height),t.fillStyle="rgba(0,0,0,0.50)",t.fillRect(0,0,e.width,e.height);const n=e.width/2,i=e.height/2,r=130,o=46,a=this._weapons.length,c=.04;for(let h=0;h<a;h++){const u=-Math.PI/2+(h+.5)/a*Math.PI*2,d=-Math.PI/2+h/a*Math.PI*2+c,f=-Math.PI/2+(h+1)/a*Math.PI*2-c,g=h===this._selected;t.beginPath(),t.moveTo(n+Math.cos(d)*o,i+Math.sin(d)*o),t.arc(n,i,r,d,f),t.arc(n,i,o,f,d,!0),t.closePath(),t.fillStyle=g?"rgba(200,160,50,0.88)":"rgba(35,25,15,0.80)",t.fill(),t.strokeStyle=g?"#f0c040":"#7a5a28",t.lineWidth=g?3:1.5,t.stroke();const _=(o+r)/2,p=n+Math.cos(u)*_,m=i+Math.sin(u)*_;t.textAlign="center",t.textBaseline="middle",t.font=g?"bold 28px sans-serif":"22px sans-serif",t.fillStyle=g?"#fff":"#bbb",t.fillText(this._weapons[h].icon,p,m-12),t.font=g?"bold 13px sans-serif":"11px sans-serif",t.fillText(this._weapons[h].label,p,m+14)}t.beginPath(),t.arc(n,i,o,0,Math.PI*2),t.fillStyle="rgba(15,10,5,0.92)",t.fill(),t.strokeStyle="#7a5a28",t.lineWidth=2,t.stroke(),t.beginPath(),t.arc(n,i,6,0,Math.PI*2),t.fillStyle="#f0c040",t.fill(),this._labelEl.textContent=((l=this._weapons[this._selected])==null?void 0:l.label)??""}}const gE=28,Zf=14,_E=48,xE=1,vE=8,Sn=20,o0=26,yE=o0/(Sn-1),ME=-10,bE=.977,rl=3,Jf=14;class SE{constructor(e){this._scene=e,this._state="idle",this._nodes=[],this._caught=null,this._line=null,this._tip=null,this._loop=null,this._charging=!1,this._chargeT=0,this._chargeEl=null,this._reeling=!1,this._build(),this._buildChargeUI()}_build(){const e=new Rt,t=new Float32Array(Sn*3);e.setAttribute("position",new Ut(t,3));const n=new jh({color:13148732});this._line=new $a(e,n),this._line.visible=!1,this._line.frustumCulled=!1,this._scene.add(this._line);const i=new Wa(.38,.045,6,18),r=new Zt({color:15777856});this._tip=new ae(i,r),this._tip.visible=!1,this._scene.add(this._tip);const o=new Wa(.4,.04,6,16),a=new Zt({color:15777856});this._loop=new ae(o,a),this._loop.visible=!1,this._scene.add(this._loop);for(let c=0;c<Sn;c++)this._nodes.push({pos:new A,prev:new A})}_buildChargeUI(){const e=document.createElement("div");e.style.cssText=["position:fixed","bottom:130px","left:50%","transform:translateX(-50%)","display:none","flex-direction:column","align-items:center","gap:4px","z-index:100"].join(";");const t=document.createElement("div");t.style.cssText="color:#f0c040;font:bold 12px monospace;text-shadow:0 1px 3px #000;letter-spacing:1px;",t.textContent="CARGANDO LAZO",e.appendChild(t);const n=document.createElement("div");n.style.cssText=["width:140px","height:14px","background:rgba(0,0,0,0.6)","border:2px solid #c8a23c","border-radius:7px","overflow:hidden"].join(";");const i=document.createElement("div");i.style.cssText="height:100%;width:0%;background:linear-gradient(90deg,#c8a23c,#f0e040);border-radius:7px;",n.appendChild(i),e.appendChild(n);const r=document.createElement("div");r.style.cssText="color:#fff;font:11px monospace;text-shadow:0 1px 3px #000;display:none;",e.appendChild(r),document.body.appendChild(e),this._chargeWrap=e,this._chargeLabel=t,this._chargeEl=n,this._chargeFill=i,this._statusLabel=r}_showUI(e){if(this._chargeWrap){if(!e){this._chargeWrap.style.display="none";return}this._chargeWrap.style.display="flex",e==="charging"?(this._chargeLabel.style.display="block",this._chargeEl.style.display="block",this._statusLabel.style.display="none"):e==="caught"&&(this._chargeLabel.style.display="none",this._chargeEl.style.display="none",this._statusLabel.style.display="block",this._statusLabel.textContent="🪢 LAZADO — Click der. para soltar")}}startCharge(){this._state!=="caught"&&(this._state!=="idle"&&this._state!=="retracting"||(this._line.visible=!1,this._tip.visible=!1,this._loop.visible=!1,this._caught=null,this._charging=!0,this._chargeT=0,this._state="charging",this._showUI("charging")))}releaseCharge(e,t){if(!this._charging)return;this._charging=!1,this._state="idle",this._showUI(null),this._chargeFill&&(this._chargeFill.style.width="0%");const n=Zf+(_E-Zf)*this._chargeT;this._throwWithSpeed(e,t,n)}_throwWithSpeed(e,t,n){this._state!=="idle"&&this._state!=="charging"&&(this._state="idle",this._line.visible=!1,this._tip.visible=!1,this._loop.visible=!1,this._caught=null),this._state="flying",this._line.visible=!0,this._tip.visible=!0,this._loop.visible=!1;for(let a=0;a<Sn;a++)this._nodes[a].pos.copy(e),this._nodes[a].prev.copy(e);const i=Math.max(.22,(t.y??0)+.14),r=new A(t.x,i,t.z).normalize();this._nodes[Sn-1].prev.sub(r.clone().multiplyScalar(n*.016))}pull(e){var i,r;if(this._state!=="caught"||!this._caught)return;const t=this._caught;if(t.type==="cow"&&t.obj&&!t.obj.removed){const o=e.x-t.obj.mesh.position.x,a=e.z-t.obj.mesh.position.z,c=Math.sqrt(o*o+a*a)||1,l=Math.min(vE,c-1);l>0&&(t.obj.mesh.position.x+=o/c*l,t.obj.mesh.position.z+=a/c*l,t.obj.panicTimer=.8)}else t.type;const n=((i=t.obj)==null?void 0:i.mesh)??((r=t.obj)==null?void 0:r.group);if(n){const o=e.x-n.position.x,a=e.z-n.position.z;o*o+a*a<4&&this.release()}}throw(e,t){this._throwWithSpeed(e,t,gE)}release(){this._state==="idle"||this._state==="retracting"||(this._charging=!1,this._caught=null,this._loop.visible=!1,this._showUI(null),this._state==="flying"||this._state==="caught"?(this._state="retracting",this._retractT=0):(this._state="idle",this._line.visible=!1,this._tip.visible=!1))}_forceIdle(){this._charging=!1,this._state="idle",this._retractT=0,this._line.visible=!1,this._tip.visible=!1,this._loop.visible=!1,this._caught=null,this._showUI(null)}isCaught(){return this._state==="caught"}isActive(){return this._state!=="idle"}isCharging(){return this._state==="charging"}getCaught(){return this._caught}startReel(){this._reeling=!0}stopReel(){this._reeling=!1}update(e,t,n,i,r){if(this._state==="charging"){this._chargeT=Math.min(1,this._chargeT+e/xE),this._chargeFill&&(this._chargeFill.style.width=`${this._chargeT*100}%`);return}if(this._state==="idle")return;if(this._state==="retracting"){this._retractT+=e;for(let d=Sn-1;d>=1;d--){const f=5+d*.5;this._nodes[d].pos.lerp(t,Math.min(1,e*f)),this._nodes[d].prev.copy(this._nodes[d].pos)}const u=this._line.geometry.attributes.position;for(let d=0;d<Sn;d++)u.setXYZ(d,this._nodes[d].pos.x,this._nodes[d].pos.y,this._nodes[d].pos.z);u.needsUpdate=!0,this._line.geometry.computeBoundingSphere(),this._tip.visible=!1,this._retractT>.4&&(this._state="idle",this._line.visible=!1);return}this._nodes[0].pos.copy(t),this._nodes[0].prev.copy(t);const o=5,a=e/o;for(let u=0;u<o;u++){for(let d=1;d<Sn;d++){const f=this._nodes[d],g=f.pos.clone().sub(f.prev).multiplyScalar(bE);g.y+=ME*a*a,f.prev.copy(f.pos),f.pos.add(g)}for(let d=0;d<4;d++){this._nodes[0].pos.copy(t);for(let f=0;f<Sn-1;f++){const g=this._nodes[f],_=this._nodes[f+1],p=_.pos.clone().sub(g.pos),m=p.length()||1e-4,x=p.multiplyScalar((m-yE)/m*.5);f>0&&g.pos.add(x),_.pos.sub(x)}for(let f=1;f<Sn;f++)this._nodes[f].pos.y<.05&&(this._nodes[f].prev.y=this._nodes[f].pos.y,this._nodes[f].pos.y=.05);this._nodes[0].pos.copy(t)}}if(this._state==="caught"&&this._caught){const u=this._caught;let d=null;const f=this._reeling?Jf*4:Jf;if(u.type==="cow"&&n&&!u.obj.removed){d=u.obj.mesh.position;const g=t.x-d.x,_=t.z-d.z,p=Math.sqrt(g*g+_*_)||1;p>2&&(u.obj.vx+=g/p*f*e,u.obj.vz+=_/p*f*e,u.obj.panicTimer=Math.max(u.obj.panicTimer,.3)),this._reeling&&p<3&&this.release()}else if(u.type==="ostrich"&&i){const g=i._entities[u.id];if(g&&!g.dead&&g.mesh){d=g.mesh.position;const _=this._reeling?.08:.5;if(g.vx*=_,g.vz*=_,this._reeling){const p=t.x-d.x,m=t.z-d.z,x=Math.sqrt(p*p+m*m)||1;g.vx+=p/x*f*e,g.vz+=m/x*f*e,x<3&&this.release()}}else{this.release();return}}else if(u.type==="player"&&r){const g=r.get(u.id);if(g)d=g.group.position;else{this.release();return}}else{this.release();return}if(d){const g=this._nodes[Sn-1];g.pos.set(d.x,Math.max(d.y+.8,.8),d.z),g.prev.copy(g.pos),this._loop.position.set(d.x,d.y+1,d.z),this._loop.rotation.x=Math.PI/2}}const c=this._line.geometry.attributes.position;for(let u=0;u<Sn;u++)c.setXYZ(u,this._nodes[u].pos.x,this._nodes[u].pos.y,this._nodes[u].pos.z);c.needsUpdate=!0,this._line.geometry.computeBoundingSphere();const l=this._nodes[Sn-1];this._tip.position.copy(l.pos);const h=new A().subVectors(l.pos,l.prev);if(h.lengthSq()>1e-4){const u=h.normalize(),d=new A(0,0,1);this._tip.quaternion.setFromUnitVectors(d,u)}if(this._tip.rotateZ(e*9),this._state==="flying"){const u=l.pos;if(n)for(const f of n._cows){if(f.removed)continue;const g=u.x-f.mesh.position.x,_=u.z-f.mesh.position.z;if(g*g+_*_<(rl*1.4)**2){this._state="caught",this._caught={type:"cow",id:f.id,obj:f},this._loop.visible=!0,this._showUI("caught");return}}if(i)for(let f=0;f<i._entities.length;f++){const g=i._entities[f];if(g.dead||g.dying||!g.mesh)continue;const _=u.x-g.mesh.position.x,p=u.z-g.mesh.position.z;if(_*_+p*p<rl**2){this._state="caught",this._caught={type:"ostrich",id:f,obj:g},this._loop.visible=!0,this._showUI("caught");return}}if(r)for(const[f,g]of r){const _=u.x-g.group.position.x,p=u.z-g.group.position.z;if(_*_+p*p<rl**2){this._state="caught",this._caught={type:"player",id:f,obj:g},this._loop.visible=!0,this._showUI("caught");return}}u.distanceTo(t)>=o0-1&&this.release()}}}const ia=new A(1,0,.4).normalize(),TE=5.5,Pa=45,wE=4,EE=30,AE=new Float32Array(Pa*3),Ia=new Rt;Ia.setAttribute("position",new Ut(AE,3));const RE=new to({color:13148256,size:.1,transparent:!0,opacity:.28,sizeAttenuation:!0,depthWrite:!1});class CE{constructor(e){this._parts=[],this._timer=0,this._points=new Ha(Ia,RE),this._points.frustumCulled=!1,e.add(this._points)}update(e,t){if(!t)return;for(this._timer+=e;this._timer>.18&&this._parts.length<Pa;){this._timer-=.18;const r=Math.random()*Math.PI*2,o=8+Math.random()*EE,a=-ia.x*o*.6+Math.cos(r)*o*.4,c=-ia.z*o*.6+Math.sin(r)*o*.4;this._parts.push({x:t.x+a,y:.05+Math.random()*.55,z:t.z+c,life:wE*(.4+Math.random()*.7),spd:TE*(.5+Math.random()*.8)})}const n=Ia.attributes.position;let i=0;for(let r=this._parts.length-1;r>=0;r--){const o=this._parts[r];if(o.life-=e,o.life<=0){this._parts.splice(r,1);continue}o.x+=ia.x*o.spd*e,o.z+=ia.z*o.spd*e,n.setXYZ(i++,o.x,o.y,o.z)}for(let r=i;r<Pa;r++)n.setXYZ(r,0,-9999,0);n.needsUpdate=!0,Ia.setDrawRange(0,Pa)}}let Xn=null,Qf=!1;function PE(){if(Qf)return;Qf=!0;const s=()=>{const e=speechSynthesis.getVoices();e.length&&(Xn=e.find(t=>t.lang==="es-AR")||e.find(t=>t.lang==="es-MX")||e.find(t=>t.lang.startsWith("es"))||e[0],console.log(`[SPEECH] Voz: ${Xn==null?void 0:Xn.name} (${Xn==null?void 0:Xn.lang})`))};speechSynthesis.onvoiceschanged=s,s()}PE();function a0(s,e={}){if(!window.speechSynthesis)return;speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(s);t.voice=Xn,t.lang=(Xn==null?void 0:Xn.lang)||"es-AR",t.pitch=e.pitch??.6,t.rate=e.rate??.82,t.volume=e.volume??1,speechSynthesis.speak(t)}function IE(s){a0(s,{pitch:.4,rate:.72,volume:.85})}let hn=null,Ei=null,us=null;function vu(){if(!hn)try{hn=new(window.AudioContext||window.webkitAudioContext);const s=hn.createDynamicsCompressor();s.threshold.value=-20,s.knee.value=14,s.ratio.value=4,s.attack.value=.004,s.release.value=.28,s.connect(hn.destination),Ei=hn.createGain(),Ei.gain.value=.78,Ei.connect(s);const e=hn.sampleRate,t=Math.floor(e*3.2),n=hn.createBuffer(2,t,e);for(let r=0;r<2;r++){const o=n.getChannelData(r);for(let a=0;a<t;a++)o[a]=(Math.random()*2-1)*Math.pow(1-a/t,1.5)}us=hn.createConvolver(),us.buffer=n;const i=hn.createGain();i.gain.value=.22,us.connect(i),i.connect(Ei),LE(),console.log("[AUDIO] OK, sampleRate="+e)}catch(s){console.warn("[AUDIO]",s.message)}}function Ge(){return hn||vu(),(hn==null?void 0:hn.state)==="suspended"&&hn.resume().catch(()=>{}),hn}function st(){var s;return((s=Ge())==null?void 0:s.currentTime)??0}const zr=new Map;async function yu(s){if(zr.has(s))return zr.get(s);const e=Ge();if(!e)return null;try{const t=await fetch(`/sounds/${s}`);if(!t.ok)throw new Error(t.status);const n=await t.arrayBuffer(),i=await e.decodeAudioData(n);return zr.set(s,i),i}catch{return zr.set(s,null),null}}const ep=["weapons/shotgun.mp3","weapons/bullet_whiz.mp3","weapons/impact_dirt.mp3","weapons/impact_flesh.mp3","weapons/impact_flesh_2.mp3","weapons/impact_glass.mp3","weapons/impact_glass_2.mp3","weapons/impact_metal.mp3","weapons/shell.mp3","weapons/shell_2.mp3","weapons/shell_3.mp3","player/step_sand_1.mp3","player/step_sand_2.mp3","player/step_sand_3.mp3","player/step_sand_4.mp3","player/step_grass_1.mp3","player/step_grass_2.mp3","player/step_grass_3.mp3","player/hurt_1.mp3","player/hurt_2.mp3","player/hurt_3.mp3","player/death.mp3","player/land.mp3","player/eat.mp3","player/body_fall.mp3","player/mount_leather.mp3","player/cloth.mp3","animals/cow_1.mp3","animals/cow_2.mp3","animals/cow_3.mp3","animals/cow_panic.mp3","animals/horse_neigh.mp3","animals/horse_snort.mp3","animals/horse_gallop.mp3","animals/chicken_1.mp3","animals/chicken_2.mp3","animals/chicken_panic.mp3","animals/ostrich.mp3","animals/coyote.mp3","ambient/wind.mp3","ambient/crickets.mp3","ambient/birds.mp3","ambient/thunder_1.mp3","ambient/thunder_2.mp3","ambient/thunder_3.mp3","ambient/rain.mp3","ambient/fire.mp3","ambient/bell_gm.mp3","ambient/corral_bell.mp3","ambient/wood_creak_1.mp3","ambient/wood_creak_2.mp3","ambient/creak_1.mp3","ambient/creak_2.mp3","ambient/creak_3.mp3"];function LE(){let s=0;const e=()=>{s>=ep.length||yu(ep[s++]).catch(()=>{}).finally(()=>setTimeout(e,40))};setTimeout(e,500)}function DE(s,e={}){const t=Ge();if(!t||!s)return null;const n=t.createBufferSource();n.buffer=s,n.loop=e.loop??!1,n.playbackRate.value=e.pitch??1;const i=t.createGain();if(i.gain.value=e.volume??1,n.connect(i),Ei&&i.connect(Ei),us&&(e.reverb??.18)>0){const r=t.createGain();r.gain.value=e.reverb??.18,i.connect(r),r.connect(us)}return n.start(e.when??st()),n}async function kt(s,e={},t=null){const n=zr.get(s)??await yu(s);return n?(DE(n,e),!0):(t==null||t(),!1)}async function pr(s,e={},t=null){const n=s[Math.floor(Math.random()*s.length)];return kt(n,e,t)}function an(s,e,t){const n=Ge();if(!n)return null;const i=Math.floor(n.sampleRate*s),r=n.createBuffer(1,i,n.sampleRate),o=r.getChannelData(0);for(let h=0;h<i;h++)o[h]=Math.random()*2-1;const a=n.createBufferSource();a.buffer=r;const c=n.createBiquadFilter();c.type="bandpass",c.frequency.value=e,c.Q.value=t;const l=n.createGain();return l.gain.value=0,a.connect(c),c.connect(l),{src:a,gain:l}}function Vt(s,e,t,n,i,r=1){const o=st(),a=s.gain;a.cancelScheduledValues(o),a.setValueAtTime(1e-4,o),a.linearRampToValueAtTime(r,o+e),a.linearRampToValueAtTime(r*n,o+e+t),a.linearRampToValueAtTime(1e-4,o+e+t+i)}function Ke(s,e=.18){if(Ei&&(s.connect(Ei),us&&e>0)){const t=Ge().createGain();t.gain.value=e,s.connect(t),t.connect(us)}}function vn(s){const e=Ge().createBiquadFilter();return e.type="lowpass",e.frequency.value=s,e}const NE=["player/step_sand_1.mp3","player/step_sand_2.mp3","player/step_sand_3.mp3","player/step_sand_4.mp3"],UE=["player/step_grass_1.mp3","player/step_grass_2.mp3","player/step_grass_3.mp3"];function FE(s="sand"){const e=.88+Math.random()*.24;pr(s==="grass"?UE:NE,{volume:.5,reverb:.06,pitch:e},()=>{if(!Ge())return;const i=st(),r=an(.12,1800,.5);r&&(Vt(r.gain,.003,.018,.06,.08,.18),Ke(r.gain,.04),r.src.start(i));const o=an(.08,600,.7);o&&(Vt(o.gain,.001,.01,0,.07,.12),Ke(o.gain,.02),o.src.start(i))})}function OE(){kt("weapons/shotgun.mp3",{volume:.9,reverb:.55,pitch:.95+Math.random()*.1},()=>{const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="sawtooth",t.frequency.setValueAtTime(58,e),t.frequency.exponentialRampToValueAtTime(20,e+.22);const n=vn(280),i=s.createGain();i.gain.setValueAtTime(1e-4,e),i.gain.linearRampToValueAtTime(.55,e+.006),i.gain.exponentialRampToValueAtTime(1e-4,e+.28),t.connect(n),n.connect(i),Ke(i,.45),t.start(e),t.stop(e+.3);const r=an(.55,160,.35);r&&(Vt(r.gain,.012,.06,.15,.42,.16),Ke(r.gain,.5),r.src.start(e))}),setTimeout(()=>kt("weapons/shell.mp3",{volume:.22,reverb:.06},()=>{const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="triangle",t.frequency.value=1800;const n=s.createGain();n.gain.setValueAtTime(1e-4,e),n.gain.linearRampToValueAtTime(.12,e+.003),n.gain.exponentialRampToValueAtTime(1e-4,e+.18),t.connect(n),Ke(n,.05),t.start(e),t.stop(e+.2)}),80+Math.random()*40)}function zE(){kt("weapons/bullet_whiz.mp3",{volume:.55,reverb:.08},()=>{const s=Ge();if(!s)return;const e=st(),t=1600+Math.random()*500,n=s.createOscillator();n.type="sine",n.frequency.setValueAtTime(t,e),n.frequency.exponentialRampToValueAtTime(t*.24,e+.2);const i=s.createGain();i.gain.setValueAtTime(1e-4,e),i.gain.linearRampToValueAtTime(.11,e+.012),i.gain.linearRampToValueAtTime(1e-4,e+.21),n.connect(i),Ke(i,.06),n.start(e),n.stop(e+.22)})}function BE(){kt("weapons/impact_dirt.mp3",{volume:.5,reverb:.1,pitch:.85+Math.random()*.3},()=>{if(!Ge())return;const e=st(),t=an(.12,450,.8);t&&(Vt(t.gain,.001,.015,.1,.09,.18),Ke(t.gain,.06),t.src.start(e))})}function kE(){kt("weapons/impact_flesh.mp3",{volume:.55,reverb:.06},()=>{if(!Ge())return;const e=st(),t=an(.09,320,1);t&&(Vt(t.gain,.001,.012,0,.07,.26),Ke(t.gain,.07),t.src.start(e))})}function VE(){const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="triangle",t.frequency.value=1760;const n=s.createGain();n.gain.setValueAtTime(1e-4,e),n.gain.linearRampToValueAtTime(.16,e+.003),n.gain.exponentialRampToValueAtTime(1e-4,e+.09),t.connect(n),Ke(n,.03),t.start(e),t.stop(e+.1)}function HE(){pr(["player/hurt_1.mp3","player/hurt_2.mp3","player/hurt_3.mp3"],{volume:.7,reverb:.05,pitch:.9+Math.random()*.2},()=>{const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="sine",t.frequency.setValueAtTime(130,e),t.frequency.exponentialRampToValueAtTime(45,e+.16);const n=s.createGain();n.gain.setValueAtTime(1e-4,e),n.gain.linearRampToValueAtTime(.38,e+.007),n.gain.exponentialRampToValueAtTime(1e-4,e+.2);const i=vn(700);t.connect(i),i.connect(n),Ke(n,.1),t.start(e),t.stop(e+.22)})}function GE(){kt("player/death.mp3",{volume:.8,reverb:.3},()=>{const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="sine",t.frequency.setValueAtTime(210,e),t.frequency.exponentialRampToValueAtTime(48,e+2.2);const n=s.createGain();n.gain.setValueAtTime(.28,e),n.gain.linearRampToValueAtTime(1e-4,e+2.4);const i=vn(700);t.connect(i),i.connect(n),Ke(n,.35),t.start(e),t.stop(e+2.5)})}function WE(){kt("player/body_fall.mp3",{volume:.75,reverb:.12},()=>{const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="sine",t.frequency.setValueAtTime(58,e),t.frequency.exponentialRampToValueAtTime(22,e+.22);const n=s.createGain();n.gain.setValueAtTime(1e-4,e),n.gain.linearRampToValueAtTime(.38,e+.004),n.gain.exponentialRampToValueAtTime(1e-4,e+.28);const i=vn(180);t.connect(i),i.connect(n),Ke(n,.14),t.start(e),t.stop(e+.3);const r=an(.25,580,.7);r&&(Vt(r.gain,.005,.03,.15,.18,.2),Ke(r.gain,.06),r.src.start(e+.02))})}function XE(){kt("player/land.mp3",{volume:.55,reverb:.06,pitch:.9+Math.random()*.2},()=>{const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="sine",t.frequency.setValueAtTime(75,e),t.frequency.exponentialRampToValueAtTime(28,e+.14);const n=s.createGain();n.gain.setValueAtTime(1e-4,e),n.gain.linearRampToValueAtTime(.26,e+.003),n.gain.exponentialRampToValueAtTime(1e-4,e+.14),t.connect(n),Ke(n,.08),t.start(e),t.stop(e+.16)})}function c0(){kt("player/eat.mp3",{volume:.55,reverb:.03},()=>{if(!Ge())return;const e=st(),t=an(.14,1700,1.8);t&&(Vt(t.gain,.006,.022,.28,.09,.13),Ke(t.gain,.03),t.src.start(e))})}function qE(){kt("player/exhale.mp3",{volume:.28,reverb:.02},()=>{if(!Ge())return;const e=st(),t=an(.22,900,.5);t&&(Vt(t.gain,.02,.06,.3,.12,.09),Ke(t.gain,.02),t.src.start(e))})}let qa=null;function YE(){if(qa)return;const s=()=>{const e=Ge();if(!e)return;const t=st(),n=(i,r,o)=>{const a=e.createOscillator();a.type="sine",a.frequency.setValueAtTime(r,t+i),a.frequency.exponentialRampToValueAtTime(r*.4,t+i+.13);const c=e.createGain();c.gain.setValueAtTime(1e-4,t+i),c.gain.linearRampToValueAtTime(o,t+i+.01),c.gain.exponentialRampToValueAtTime(1e-4,t+i+.15),a.connect(c),Ke(c,.04),a.start(t+i),a.stop(t+i+.17)};n(0,55,.24),n(.19,44,.15)};s(),qa=setInterval(s,860)}function Mu(){clearInterval(qa),qa=null}function Xr(s=!1){s?kt("animals/cow_panic.mp3",{volume:.7,reverb:.3,pitch:.9+Math.random()*.2},tp.bind(null,!0)):pr(["animals/cow_1.mp3","animals/cow_2.mp3","animals/cow_3.mp3"],{volume:.55,reverb:.35,pitch:.88+Math.random()*.24},tp.bind(null,!1))}function tp(s){const e=Ge();if(!e)return;const t=st(),n=s?290:155+Math.random()*25,i=s?.38:1.1+Math.random()*.35,r=e.createOscillator();r.type="sine",r.frequency.value=n*.52;const o=e.createGain();o.gain.value=s?55:25,r.connect(o);const a=e.createOscillator();a.type="sawtooth",a.frequency.value=n,s||(a.frequency.setValueAtTime(n*.88,t),a.frequency.linearRampToValueAtTime(n*1.06,t+i*.38),a.frequency.linearRampToValueAtTime(n*.9,t+i)),o.connect(a.frequency);const c=vn(s?950:720);c.Q={value:1.2};const l=e.createGain();Vt(l,.06,.1,.7,s?.18:.55,s?.35:.26),a.connect(c),c.connect(l),Ke(l,.3),r.start(t),a.start(t),r.stop(t+i+.7),a.stop(t+i+.7)}function l0(){kt("animals/horse_neigh.mp3",{volume:.65,reverb:.3,pitch:.92+Math.random()*.16},()=>{const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="sawtooth",t.frequency.setValueAtTime(310,e),t.frequency.linearRampToValueAtTime(570,e+.22),t.frequency.linearRampToValueAtTime(430,e+.5),t.frequency.exponentialRampToValueAtTime(175,e+.88);const n=vn(1100),i=s.createGain();Vt(i,.022,.08,.65,.38,.3),t.connect(n),n.connect(i),Ke(i,.3),t.start(e),t.stop(e+1)})}function h0(){kt("animals/horse_snort.mp3",{volume:.45,reverb:.12,pitch:.9+Math.random()*.2},()=>{if(!Ge())return;const e=st(),t=an(.28,320,1.2);t&&(Vt(t.gain,.008,.05,.4,.2,.22),Ke(t.gain,.12),t.src.start(e))})}function KE(s,e){const t=Ge();if(!t)return;const n=st(),i=t.createOscillator();i.type="sine";const r=e?80+Math.random()*20:55+Math.random()*15;i.frequency.setValueAtTime(r,n),i.frequency.exponentialRampToValueAtTime(22,n+(e?.075:.115));const o=t.createGain();o.gain.setValueAtTime(1e-4,n),o.gain.exponentialRampToValueAtTime(s,n+.006),o.gain.exponentialRampToValueAtTime(1e-4,n+(e?.085:.13)),i.connect(o),Ke(o,e?.08:.05),i.start(n),i.stop(n+(e?.1:.15));const a=an(.05,e?900:650,.4);a&&(Vt(a.gain,.001,.008,.02,.03,e?.18:.12),Ke(a.gain,.04),a.src.start(n))}function jE(s,e){const t=s>16||e,n=s>16?.28:s>7?.2:.14;KE(n,t)}function $E(){kt("player/mount_leather.mp3",{volume:.55,reverb:.08},()=>{const s=Ge();if(!s)return;const e=st(),t=an(.2,580,1.1);t&&(Vt(t.gain,.012,.04,.28,.12,.2),Ke(t.gain,.05),t.src.start(e));const n=s.createOscillator();n.type="sine",n.frequency.setValueAtTime(65,e+.05),n.frequency.exponentialRampToValueAtTime(28,e+.18);const i=s.createGain();Vt(i,.004,.04,0,.12,.18),n.connect(i),Ke(i,.07),n.start(e+.05),n.stop(e+.24)})}function ZE(){pr(["animals/chicken_1.mp3","animals/chicken_2.mp3"],{volume:.45,reverb:.1,pitch:.85+Math.random()*.3},()=>{const s=Ge();if(!s)return;const e=st();[[0,680,.13],[.11,820,.09]].forEach(([t,n,i])=>{const r=s.createOscillator();r.type="square",r.frequency.setValueAtTime(n,e+t),r.frequency.exponentialRampToValueAtTime(n*.65,e+t+i);const o=vn(1400),a=s.createGain();a.gain.setValueAtTime(1e-4,e+t),a.gain.linearRampToValueAtTime(.09,e+t+.012),a.gain.exponentialRampToValueAtTime(1e-4,e+t+i+.04),r.connect(o),o.connect(a),Ke(a,.08),r.start(e+t),r.stop(e+t+i+.06)})})}function JE(){kt("animals/chicken_panic.mp3",{volume:.6,reverb:.12,pitch:.9+Math.random()*.2},()=>{const s=Ge();if(!s)return;const e=st();for(let n=0;n<5;n++){const i=n*.09,r=700+Math.random()*400,o=s.createOscillator();o.type="square",o.frequency.setValueAtTime(r,e+i),o.frequency.exponentialRampToValueAtTime(r*.5,e+i+.08);const a=vn(1600),c=s.createGain();c.gain.setValueAtTime(1e-4,e+i),c.gain.linearRampToValueAtTime(.11,e+i+.008),c.gain.exponentialRampToValueAtTime(1e-4,e+i+.1),o.connect(a),a.connect(c),Ke(c,.06),o.start(e+i),o.stop(e+i+.12)}const t=an(.4,3800,.6);t&&(Vt(t.gain,.01,.05,.2,.28,.12),Ke(t.gain,.04),t.src.start(e+.05))})}function QE(){kt("animals/ostrich.mp3",{volume:.55,reverb:.22,pitch:.85+Math.random()*.3},()=>{const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="sine",t.frequency.setValueAtTime(48,e),t.frequency.linearRampToValueAtTime(62,e+.18),t.frequency.exponentialRampToValueAtTime(35,e+.65);const n=s.createGain();Vt(n,.015,.08,.5,.55,.3);const i=vn(200);t.connect(i),i.connect(n),Ke(n,.2),t.start(e),t.stop(e+.8)})}function eA(){kt("animals/coyote.mp3",{volume:.45,reverb:.6,pitch:.88+Math.random()*.24},()=>{const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="sine",t.frequency.setValueAtTime(275,e),t.frequency.linearRampToValueAtTime(530,e+.48),t.frequency.linearRampToValueAtTime(510,e+.85),t.frequency.linearRampToValueAtTime(370,e+1.9);const n=s.createOscillator();n.type="sine",n.frequency.value=5.8;const i=s.createGain();i.gain.value=11,n.connect(i),i.connect(t.frequency);const r=vn(1800),o=s.createGain();Vt(o,.09,.05,.82,.75,.18),t.connect(r),r.connect(o),Ke(o,.55),n.start(e+.45),n.stop(e+2.7),t.start(e),t.stop(e+2.7)})}function tA(){if(!Ge())return;const e=st(),t=an(.3,1700,2.2);t&&(Vt(t.gain,.01,.04,.2,.2,.16),Ke(t.gain,.08),t.src.start(e))}let Ya=null;function nA(){if(Ya)return;const s=()=>{if(!Ge())return;const t=st(),n=an(.25,820,1.4);n&&(Vt(n.gain,.02,.08,.38,.1,.09),Ke(n.gain,.05),n.src.start(t)),Ya=setTimeout(s,260)};s()}function iA(){clearTimeout(Ya),Ya=null}function bu(s,e,t,n){let i=null,r=null;return{start(){if(i)return;const o=Ge();o&&(r=o.createGain(),r.gain.value=1e-4,r.gain.linearRampToValueAtTime(e,o.currentTime+2),Ke(r,t),yu(s).then(a=>{if(!a){n==null||n();return}i=o.createBufferSource(),i.buffer=a,i.loop=!0,i.connect(r),i.start()}))},stop(){if(!r)return;const o=Ge();r.gain.linearRampToValueAtTime(1e-4,((o==null?void 0:o.currentTime)??0)+1.5),setTimeout(()=>{try{i==null||i.stop()}catch{}i=null,r=null},1700)},get active(){return!!i}}}const sA=bu("ambient/wind.mp3",.55,0,lA),u0=bu("ambient/crickets.mp3",.48,0,hA),d0=bu("ambient/birds.mp3",.38,.15,null),rA=()=>sA.start(),oA=()=>u0.start(),aA=()=>u0.stop(),cA=()=>d0.start(),np=()=>d0.stop();function lA(){}function hA(){}let ip=[];function uA(){if(ip.length)return;const s=Ge();s&&[36.7,37.4,55].forEach((e,t)=>{const n=s.createOscillator();n.type="sine",n.frequency.value=e;const i=s.createOscillator();i.type="sine",i.frequency.value=.04+t*.02;const r=s.createGain();r.gain.value=.018,i.connect(r),r.connect(n.frequency);const o=s.createGain();o.gain.value=.05-t*.01;const a=vn(120);n.connect(a),a.connect(o),o.connect(Ei),n.start(),i.start(),ip.push({stop:()=>{try{n.stop(),i.stop()}catch{}}})})}function dA(){pr(["ambient/thunder_1.mp3","ambient/thunder_2.mp3","ambient/thunder_3.mp3"],{volume:.58,reverb:.65,pitch:.7+Math.random()*.3},()=>{if(!Ge())return;const e=st(),t=2.8+Math.random()*1.5,n=an(t,55+Math.random()*30,.4);if(!n)return;const i=n.gain.gain;i.cancelScheduledValues(e),i.setValueAtTime(1e-4,e),i.linearRampToValueAtTime(.28,e+.18),i.linearRampToValueAtTime(.22,e+.6),i.linearRampToValueAtTime(1e-4,e+t),Ke(n.gain,.55),n.src.start(e)})}function fA(){if(!Ge())return;const e=st(),t=4.5;[60,90,130,200].forEach((n,i)=>{const r=an(.8,n,.5+i*.1);if(!r)return;r.src.loop=!0,r.src.loopEnd=.8;const o=r.gain.gain;o.cancelScheduledValues(e+i*.05),o.setValueAtTime(1e-4,e+i*.05),o.linearRampToValueAtTime(.22-i*.04,e+i*.05+.6),o.linearRampToValueAtTime(1e-4,e+i*.05+t-i*.3),Ke(r.gain,.25),r.src.start(e+i*.05),r.src.stop(e+i*.05+t-i*.3+.1)}),setTimeout(()=>Xr(!0),200),setTimeout(()=>Xr(!0),700),setTimeout(()=>Xr(!0),1300)}function pA(){pr(["ambient/wood_creak_1.mp3","ambient/wood_creak_2.mp3","ambient/creak_1.mp3","ambient/creak_2.mp3","ambient/creak_3.mp3"],{volume:.35,reverb:.12,pitch:.85+Math.random()*.3},()=>{const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="sawtooth";const n=180+Math.random()*80;t.frequency.setValueAtTime(n,e),t.frequency.linearRampToValueAtTime(n*.6,e+.18),t.frequency.linearRampToValueAtTime(n*.8,e+.32);const i=vn(900);i.Q.value=2;const r=s.createGain();Vt(r,.005,.04,.3,.22,.1),t.connect(i),i.connect(r),Ke(r,.1),t.start(e),t.stop(e+.38)})}function mA(){kt("ambient/bell_gm.mp3",{volume:.55,reverb:.45},()=>{const s=Ge();if(!s)return;const e=st();[[0,880],[.16,1108],[.3,660]].forEach(([t,n])=>{const i=s.createOscillator();i.type="sine",i.frequency.value=n;const r=s.createGain();r.gain.setValueAtTime(1e-4,e+t),r.gain.linearRampToValueAtTime(.11,e+t+.006),r.gain.exponentialRampToValueAtTime(1e-4,e+t+1),i.connect(r),Ke(r,.4),i.start(e+t),i.stop(e+t+1.1)})})}function gA(){kt("ambient/corral_bell.mp3",{volume:.65,reverb:.5},()=>{const s=Ge();if(!s)return;const e=st(),t=s.createOscillator();t.type="sine",t.frequency.value=648;const n=s.createGain();n.gain.setValueAtTime(1e-4,e),n.gain.linearRampToValueAtTime(.22,e+.012),n.gain.exponentialRampToValueAtTime(1e-4,e+1.5),t.connect(n),Ke(n,.42),t.start(e),t.stop(e+1.6)})}function _A(){const s=Ge();if(!s)return;const e=st();[[261,329,392,0],[392,494,587,.55],[523,659,784,1.1]].forEach(([t,n,i,r])=>{[t,n,i].forEach(o=>{const a=s.createOscillator();a.type="triangle",a.frequency.value=o;const c=s.createGain();c.gain.setValueAtTime(1e-4,e+r),c.gain.linearRampToValueAtTime(.12,e+r+.025),c.gain.exponentialRampToValueAtTime(1e-4,e+r+.9),a.connect(c),Ke(c,.28),a.start(e+r),a.stop(e+r+1)})})}let cs=[];function xA(){if(cs.length)return;vu();const s=Ge();if(!s)return;[82.4,110,146.8].forEach((r,o)=>{const a=s.createOscillator();a.type="triangle",a.frequency.value=r+(Math.random()-.5)*.9;const c=s.createOscillator();c.type="sine",c.frequency.value=.55+o*.18;const l=s.createGain();l.gain.value=.038,c.connect(l);const h=vn(650),u=s.createGain();u.gain.value=.058-o*.012,l.connect(u.gain),a.connect(h),h.connect(u),Ke(u,.55),a.start(),c.start(),cs.push({stop:()=>{try{a.stop(),c.stop()}catch{}}})});const e=[329,392,440,494,392,349,294];let t=0;const n=()=>{if(!cs.length)return;const r=Ge();if(!r)return;const o=st(),a=r.createOscillator();a.type="triangle",a.frequency.value=e[t%e.length]*.5,t++;const c=vn(1100),l=r.createGain();l.gain.setValueAtTime(1e-4,o),l.gain.linearRampToValueAtTime(.075,o+.05),l.gain.exponentialRampToValueAtTime(1e-4,o+2.5),a.connect(c),c.connect(l),Ke(l,.55),a.start(o),a.stop(o+2.8);const h=setTimeout(n,2800+Math.random()*3200);cs.push({stop:()=>clearTimeout(h)})},i=setTimeout(n,1200);cs.push({stop:()=>clearTimeout(i)})}function vA(){cs.forEach(s=>{var e;return(e=s.stop)==null?void 0:e.call(s)}),cs=[]}const yA={chicken:{label:"Pollo",icon:"🍗"},beef:{label:"Carne",icon:"🥩"},ostrich:{label:"Avestruz",icon:"🦤"}},Yn={chicken:0,beef:0,ostrich:0},qs={chicken:{hunger:0,hp:0},beef:{hunger:0,hp:0},ostrich:{hunger:0,hp:0}};let Pn="chicken",so=0;const MA=30;function sa(s,e=0,t=0){return so>=MA||!(s in Yn)?!1:(Yn[s]++,so++,qs[s].hunger=e||qs[s].hunger,qs[s].hp=t||qs[s].hp,Yn[Pn]===0&&(Pn=s),!0)}function f0(){if(Yn[Pn]===0){const e=Object.keys(Yn).find(t=>Yn[t]>0);if(!e)return null;Pn=e}return Yn[Pn]===0?null:(Yn[Pn]--,so--,{type:Pn,hunger:qs[Pn].hunger,hp:qs[Pn].hp})}function bA(){const s=Object.keys(Yn),e=s.indexOf(Pn);for(let t=1;t<=s.length;t++){const n=s[(e+t)%s.length];if(Yn[n]>0){Pn=n;break}}}function SA(){return so>0}function TA(){return so}function wA(){return Pn}function EA(){return{...Yn}}const AA=[{type:"house",x:-41,z:13,ry:0},{type:"house",x:-40,z:-33,ry:0},{type:"house",x:37,z:-28,ry:0},{type:"house",x:40,z:15,ry:0},{type:"house",x:-33,z:-71,ry:0},{type:"townhall",x:33,z:-68,ry:0},{type:"church",x:1,z:37,ry:0},{type:"cowcorral",x:-137,z:12,ry:0},{type:"cowcorral",x:-139,z:-39,ry:0},{type:"farm",x:-59,z:13,ry:0},{type:"farm",x:-58,z:-34,ry:0},{type:"farm",x:-51,z:-72,ry:0},{type:"farm",x:55,z:-28,ry:0},{type:"farm",x:58,z:14,ry:0},{type:"corral",x:-63,z:-48,ry:0},{type:"corral",x:-54,z:-86,ry:0},{type:"corral",x:-55,z:-2,ry:0},{type:"corral",x:55,z:28,ry:0},{type:"corral",x:71,z:-26,ry:0}],RA=[{type:"road",width:3.5,points:[{x:0,z:24},{x:0,z:-71},{x:19,z:-71}]},{type:"road",width:3.5,points:[{x:-31,z:13},{x:32,z:13}]},{type:"road",width:3.5,points:[{x:-31,z:-34},{x:26,z:-33}]},{type:"road",width:3.5,points:[{x:0,z:-72},{x:-23,z:-72},{x:-23,z:-72}]},{type:"river",width:6,points:[{x:7,z:-195},{x:281,z:-154},{x:278,z:-109},{x:299,z:29},{x:426,z:121},{x:700,z:195},{x:954,z:133},{x:1225,z:195},{x:1470,z:410},{x:1647,z:560},{x:1983,z:622},{x:2278,z:628},{x:2529,z:749},{x:2579,z:967},{x:2668,z:994},{x:3128,z:1286},{x:3441,z:1179},{x:3655,z:1059},{x:4028,z:1026},{x:4531,z:1373},{x:4605,z:1503},{x:5098,z:1396},{x:5265,z:1273},{x:5318,z:1093},{x:5931,z:686},{x:6511,z:716},{x:7438,z:1069},{x:8028,z:1843},{x:8801,z:2146},{x:8981,z:2033},{x:10145,z:1973},{x:10755,z:2369},{x:11375,z:2763},{x:11788,z:2803},{x:12674,z:2332},{x:13148,z:2282},{x:13674,z:2155},{x:14204,z:2199},{x:14524,z:2575},{x:15444,z:3102},{x:16504,z:3165},{x:17314,z:3062},{x:17908,z:2952},{x:21008,z:2665},{x:22701,z:3659},{x:23051,z:3619},{x:23654,z:3652},{x:24111,z:3615},{x:24298,z:3882},{x:27171,z:3799},{x:27534,z:3662},{x:27854,z:4145}]},{type:"river",width:6,points:[{x:8,z:-196},{x:-98,z:-181},{x:-206,z:-187},{x:-262,z:-206},{x:-310,z:-227},{x:-493,z:-300},{x:-572,z:-295},{x:-653,z:-259},{x:-705,z:-279},{x:-1038,z:-440},{x:-1097,z:-425},{x:-1107,z:-380},{x:-1457,z:-518},{x:-1508,z:-550},{x:-1499,z:-597},{x:-1554,z:-639},{x:-1590,z:-630}]},{type:"road",width:3.5,points:[{x:-70,z:12},{x:-117,z:11}]},{type:"road",width:3.5,points:[{x:-72,z:-35},{x:-116,z:-35},{x:-117,z:-35}]}],sp={objects:AA,paths:RA},CA=new fi;function Vs(s,e,t,n=1){CA.load(t,i=>{s.remove(e);const r=i.scene;r.position.copy(e.position),r.rotation.copy(e.rotation),r.scale.setScalar(n),r.traverse(o=>{o.isMesh&&(o.castShadow=o.receiveShadow=!0)}),s.add(r)},void 0,()=>{})}const $t=new oe({color:10522752,roughness:.92}),Cn=new oe({color:7364688,roughness:.95}),PA=new oe({color:13943962,roughness:.88}),Ka=new oe({color:15591640,roughness:.8}),Un=new oe({color:7027231,roughness:.95}),qr=new oe({color:9117728,roughness:.9}),Su=new oe({color:3807752,roughness:.97}),ro=new oe({color:9071168,roughness:.97}),Tu=new oe({color:4861456,roughness:1}),IA=new oe({color:2972184,roughness:.9}),LA=new oe({color:8030752,roughness:.9}),si=new oe({color:3162192,roughness:.5,metalness:.2}),rr=new oe({color:2757896,roughness:.97}),La=new oe({color:13936704,roughness:.5,metalness:.5}),DA=new oe({color:13378048,roughness:.8}),NA=new oe({color:11569216,roughness:.6,metalness:.4}),p0=new oe({color:9072720,roughness:1}),UA=new oe({color:2254506,roughness:.25,metalness:.1});function ue(s,e,t,n,i,r,o,a){const c=new ae(new Ae(e,t,n),s);return c.position.set(i,r+t/2,o),c.castShadow=c.receiveShadow=!0,a.add(c),c}function qi(s,e,t,n){const i=s/2,r=t/2,o=new Float32Array([-i,0,r,i,0,r,0,e,r,-i,0,-r,0,e,-r,i,0,-r,-i,0,-r,-i,0,r,0,e,r,-i,0,-r,0,e,r,0,e,-r,i,0,r,i,0,-r,0,e,-r,i,0,r,0,e,-r,0,e,r,-i,0,-r,i,0,-r,i,0,r,-i,0,-r,i,0,r,-i,0,r]),a=new Rt;a.setAttribute("position",new Ut(o,3)),a.computeVertexNormals();const c=new ae(a,n);return c.castShadow=c.receiveShadow=!0,c}const wu=[];function FA(){return wu}function Yi(s,e,t,n,i,r,o,a=1.4){s.push({x:e+(n+r)/2,z:t+(i+o)/2,sx:Math.max(.22,Math.abs(r-n)),sz:Math.max(.22,Math.abs(o-i)),maxY:a*.88})}function m0(s,e,t,n,i,r,o=2.2,a=1.4){const c=o/2;En(s,-i,r,-c,r,a),En(s,c,r,i,r,a),Yi(e,t,n,-i,r,-c,r,a),Yi(e,t,n,c,r,i,r,a);const l=new Oe;l.position.set(-c,0,r);const h=f=>{const g=new ae(new Ae(o,.12,.14),ro);g.position.set(c,f,0),g.castShadow=g.receiveShadow=!0,l.add(g)};h(a*.68),h(a*.38);const u=new ae(new Ae(.16,a,.16),ro);u.position.set(o,a/2,0),u.castShadow=u.receiveShadow=!0,l.add(u),s.add(l);const d={x:t,z:n+r,sx:o+.16,sz:.22,maxY:a+.1,active:!0};e.push(d),wu.push({cx:t,cz:n,gateX:t,gateZ:n+r,panel:l,collider:d,isOpen:!1,animT:0,animTarget:0})}function En(s,e,t,n,i,r=1.4){const o=n-e,a=i-t,c=Math.sqrt(o*o+a*a),l=(e+n)/2,h=(t+i)/2,u=Math.atan2(o,a),d=g=>{const _=new ae(new Ae(.14,.12,c),ro);_.position.set(l,g,h),_.rotation.y=u,_.castShadow=_.receiveShadow=!0,s.add(_)};d(r*.68),d(r*.38);const f=Math.max(2,Math.ceil(c/2.8));for(let g=0;g<=f;g++){const _=g/f,p=new ae(new Ae(.16,r,.16),ro);p.position.set(e+o*_,r/2,t+a*_),p.castShadow=p.receiveShadow=!0,s.add(p)}}function OA(s,e,t,n=18,i=14){const r=new Oe;r.position.set(e,0,t),s.add(r);const o=n/2,a=i/2;ue(Tu,n,.1,i,0,0,0,r);const c=5;for(let _=0;_<c;_++){const p=-a+1.4+_*((i-2.8)/(c-1)),m=_%2===0?IA:LA,x=new ae(new Ae(n-3,.4+Math.random()*.15,1),m);x.position.set(0,.25,p),x.castShadow=!0,r.add(x)}En(r,-o,-a,-2.2,-a),En(r,2.2,-a,o,-a),En(r,-o,a,o,a),En(r,-o,-a,-o,a),En(r,o,-a,o,a);const l=_=>{const p=new ae(new Ae(.2,1.9,.2),ro);p.position.set(_,.95,-a),r.add(p)};l(-2.2),l(2.2);const h=new Oe;h.position.set(o-3.5,0,-a+3.5);const u=4.5,d=3,f=4.5;ue(Un,u,d,f,0,0,0,h);const g=qi(u+.4,1.2,f+.4,Su);return g.position.set(0,d,0),h.add(g),ue(rr,1,1.8,.15,0,0,f/2+.05,h),r.add(h),r}function zA(s,e,t,n,i=32,r=24){const o=new Oe;o.position.set(t,0,n),s.add(o);const a=i/2,c=r/2,l=1.8;ue(Tu,i,.1,r,0,0,0,o),ue(Un,4,.7,1.2,a-3,0,0,o),ue($t,3.6,.4,.8,a-3,.7,0,o);const h=new Oe;h.position.set(-a+5,0,-c+4),ue(Un,.2,3,.2,-3,0,-2.5,h),ue(Un,.2,3,.2,3,0,-2.5,h),ue(Un,.2,3,.2,-3,0,2.5,h),ue(Un,.2,3,.2,3,0,2.5,h);const u=qi(7,1,6,Su);return u.position.set(0,3,0),h.add(u),o.add(h),En(o,-a,-c,a,-c,l),En(o,-a,-c,-a,c,l),En(o,a,-c,a,c,l),Yi(e,t,n,-a,-c,a,-c,l),Yi(e,t,n,-a,-c,-a,c,l),Yi(e,t,n,a,-c,a,c,l),m0(o,e,t,n,a,c,3,l),o}function BA(s,e,t,n,i=10,r=10){const o=new Oe;o.position.set(t,0,n),s.add(o);const a=i/2,c=r/2,l=1.4;ue(Tu,i,.08,r,0,0,0,o),ue(Un,2.2,.5,.7,a-1.5,0,0,o),ue($t,1.8,.3,.4,a-1.5,.5,0,o),En(o,-a,-c,a,-c,l),En(o,-a,-c,-a,c,l),En(o,a,-c,a,c,l),Yi(e,t,n,-a,-c,a,-c,l),Yi(e,t,n,-a,-c,-a,c,l),Yi(e,t,n,a,-c,a,c,l),m0(o,e,t,n,a,c,2.2,l);const h=new Oe;h.position.set(-a+2,0,-c+2),ue(Un,2.8,2.2,2.8,0,0,0,h);const u=qi(3.2,.9,3.2,Su);return u.position.set(0,2.2,0),h.add(u),ue(rr,.7,1,.12,0,0,1.45,h),o.add(h),o}function kA(s,e,t,n,i=0){const r=new Oe;r.position.set(t,0,n),r.rotation.y=i,s.add(r);const o=5,a=5,c=7;ue(PA,o*2,a,c*2,0,0,0,r),ue($t,o*2+.2,.5,c*2+.2,0,0,0,r);const l=qi(o*2+.7,2,c*2+.7,qr);return l.position.set(0,a,0),r.add(l),ue(rr,1.4,2.4,.18,0,0,c+.05,r),ue(La,.15,.15,.1,.55,1.2,c+.15,r),ue(si,1.2,1,.18,-2.2,2.8,c+.05,r),ue(si,1.2,1,.18,2.2,2.8,c+.05,r),ue(si,.18,1,1.2,o+.05,2.8,2,r),ue(si,.18,1,1.2,-o-.05,2.8,2,r),ue(Cn,.8,2.2,.8,o*.5,a+1.5,-c*.3,r),ue($t,1,.3,1,o*.5,a+2.7,-c*.3,r),e.push({x:t,z:n,sx:o*2,sy:a+2,sz:c*2}),r}function VA(s,e,t,n){const i=new Oe;i.position.set(t,0,n),s.add(i);const r=11,o=9,a=24;ue($t,r,o,a,0,0,4,i);const c=qi(r+.8,4,a+.8,qr);c.position.set(0,o,4),i.add(c);const l=6.5,h=20,u=6.5;ue(Cn,l,h,u,0,0,-10,i),ue(Cn,l+1,1.2,u+1,0,h,-10,i);const d=qi(l+1.2,5,u+1.2,qr);d.position.set(0,h+1.2,-10),i.add(d),ue(Ka,.35,4,.35,0,h+6.5,-10,i),ue(Ka,2.8,.35,.35,0,h+8.2,-10,i),ue(NA,1.4,1.1,1.4,0,h-2,-10,i);for(let g=-1;g<=1;g++)ue(si,.18,2.8,1.5,-5.55,4.5,4+g*7,i),ue(si,.18,2.8,1.5,r/2+.05,4.5,4+g*7,i);ue(si,3.5,3.5,.18,0,o-1,-10+u/2+.05,i),ue(rr,2.8,5,.2,0,0,-10+u/2+.06,i),ue($t,7.5,.4,2,0,0,-10+u/2+1,i),ue($t,6.5,.4,1.5,0,.4,-10+u/2+1.8,i),ue($t,5.5,.4,1,0,.8,-10+u/2+2.5,i),ue($t,4.5,5.5,5.5,-8,0,5,i);const f=qi(5,2.5,6,qr);return f.position.set(-8,5.5,5),i.add(f),ue($t,r+1,1,2.5,0,o,-10+u/2+1,i),e.push({x:t,z:n+4,sx:r,sy:o+4,sz:a}),e.push({x:t,z:n-10,sx:l,sy:h,sz:u}),i}function HA(s,e,t,n){const i=new Oe;i.position.set(t,0,n),s.add(i);const r=22,o=10,a=17;ue(Ka,r,o,a,0,0,0,i),ue($t,r+.4,.6,a+.4,0,0,0,i),ue(Cn,r+1,.8,a+1,0,o,0,i),ue(Cn,r+1,1.4,.45,0,o+.8,a/2,i),ue(Cn,r+1,1.4,.45,0,o+.8,-a/2,i),ue(Cn,.45,1.4,a+1,r/2,o+.8,0,i),ue(Cn,.45,1.4,a+1,-r/2,o+.8,0,i);const c=5.5,l=6,h=5.5;ue(Cn,c,l,h,0,o+.8,0,i);const u=qi(c+.8,3.5,h+.8,qr);u.position.set(0,o+.8+l,0),i.add(u),ue(Un,.22,9,.22,2.5,o+.8+l+4.5,0,i),ue(DA,3,1.8,.1,4,o+.8+l+8.5,0,i);for(let d=-2;d<=2;d++)ue(Ka,.65,o-.5,.65,d*3.8,0,a/2+.4,i);ue($t,r-1,.9,2.8,0,o-.5,a/2+1.5,i),ue($t,r-1,.5,2.8,0,o-1.4,a/2+1.5,i),ue($t,r+1,.55,3.5,0,0,a/2+1.7,i),ue($t,r-1,.55,2.8,0,.55,a/2+1.2,i),ue($t,r-3,.55,2.2,0,1.1,a/2+.8,i),ue(rr,1.6,5.2,.22,-1,0,a/2+.08,i),ue(rr,1.6,5.2,.22,1,0,a/2+.08,i),ue(La,.18,.18,.14,-.15,2.6,a/2+.2,i),ue(La,.18,.18,.14,.15,2.6,a/2+.2,i);for(const d of[-7.5,-3,3,7.5])ue(si,2.2,3,.2,d,5,a/2+.06,i),ue($t,2.6,.25,.4,d,3.4,a/2+.25,i);for(const d of[-5,0,5])ue(si,.2,2.6,2.2,r/2+.06,5,d,i),ue(si,.2,2.6,2.2,-r/2-.06,5,d,i);return ue(Cn,3,3,.22,0,o+.8+3,h/2+.12,i),ue(La,2.4,2.4,.16,0,o+.8+3,h/2+.24,i),ue(Cn,.1,.85,.1,.4,o+.8+3.2,h/2+.35,i),ue(Cn,.1,.65,.1,0,o+.8+2.9,h/2+.35,i),e.push({x:t,z:n,sx:r,sy:o+8,sz:a}),i}function GA(s,e,t=3.5){if(!(!e||e.length<2))for(let n=0;n<e.length-1;n++){const i=e[n],r=e[n+1],o=r.x-i.x,a=r.z-i.z,c=Math.sqrt(o*o+a*a);if(c<.1)continue;const l=new ae(new Ae(t,.07,c+.12),p0);l.position.set((i.x+r.x)/2,.01,(i.z+r.z)/2),l.rotation.y=Math.atan2(o,a),l.receiveShadow=!0,s.add(l)}}function WA(s,e,t=6){if(!e||e.length<2)return;const n=new s_(e.map(o=>new A(o.x,0,o.z))),i=Math.max(20,e.length*10),r=n.getPoints(i);for(let o=0;o<r.length-1;o++){const a=r[o],c=r[o+1],l=c.x-a.x,h=c.z-a.z,u=Math.sqrt(l*l+h*h)+.01,d=new ae(new Ae(t,.18,u+.05),UA);d.position.set((a.x+c.x)/2,-.06,(a.z+c.z)/2),d.rotation.y=Math.atan2(l,h),s.add(d)}}function XA(s,e,t,n=26,i=18){const r=new ae(new Ae(n,.07,i),p0);r.position.set(e,.01,t),r.receiveShadow=!0,s.add(r)}function qA(s,e,t){const n=new Oe;n.position.set(e,0,t),ue($t,1.8,.7,1.8,0,0,0,n);const i=new ae(new Ae(1.4,.05,1.4),new oe({color:1725849,roughness:.2}));i.position.set(0,.38,0),n.add(i);for(const r of[-.7,.7])ue(Un,.12,1.4,.12,r,.7,0,n);return ue(Un,1.7,.12,.12,0,1.75,0,n),s.add(n),n}function YA(s,e,t){const n=new Oe;n.position.set(e,0,t),ue(Un,.35,2.2,.35,0,0,0,n);const i=new ae(new $h(1.6,3.2,7),new oe({color:2783786,roughness:.9}));return i.position.y=3.8,i.castShadow=!0,n.add(i),s.add(n),n}function KA(s,e){wu.length=0;for(const t of sp.paths??[])t.type==="road"&&GA(s,t.points,t.width??3.5),t.type==="river"&&WA(s,t.points,t.width??6);for(const t of sp.objects??[]){const n=t.ry?t.ry*Math.PI/180:0;switch(t.type){case"church":Vs(s,VA(s,e,t.x,t.z),"/models/church.glb");break;case"townhall":Vs(s,HA(s,e,t.x,t.z),"/models/townhall.glb");break;case"house":Vs(s,kA(s,e,t.x,t.z,n),"/models/house.glb");break;case"farm":Vs(s,OA(s,t.x,t.z),"/models/farm.glb");break;case"corral":Vs(s,BA(s,e,t.x,t.z),"/models/corral.glb");break;case"cowcorral":Vs(s,zA(s,e,t.x,t.z),"/models/cow_corral.glb");break;case"plaza":XA(s,t.x,t.z,t.w??26,t.d??18);break;case"well":qA(s,t.x,t.z);break;case"tree":YA(s,t.x,t.z);break}}}document.addEventListener("mousemove",s=>OT(s.clientX,s.clientY));let rp=0;document.addEventListener("keydown",s=>{if(s.code!=="KeyF"||!St||pn)return;const e=performance.now()/1e3;if(e-rp<2.5)return;rp=e;const t=Ve==null?void 0:Ve.getPosition();t&&(Qe==null||Qe.yell(t.x,t.z),zn==null||zn.yell(t.x,t.z),Hm(t.x,t.z),JE(),Xr(!0),Qm(!1))});let ol=!1;document.addEventListener("keydown",s=>{if(s.code!=="KeyI"||!St)return;ol=!ol,Gm();const e=ol?8961023:null;lt&&lt.group.traverse(t=>{t.isMesh&&t.material&&(e!==null?(t.material.transparent=!0,t.material.opacity=.4):(t.material.transparent=!1,t.material.opacity=1))})});document.addEventListener("keydown",s=>{if(s.code!=="KeyQ"||!St||pn)return;const e=Ve==null?void 0:Ve.getPosition();if(!e)return;let t=null,n=8;for(const i of Da){const r=e.x-i.gateX,o=e.z-i.gateZ,a=Math.sqrt(r*r+o*o);a<n&&(n=a,t=i)}t&&(t.isOpen=!t.isOpen,t.animTarget=t.isOpen?1:0,t.collider.active=!t.isOpen)});document.addEventListener("keydown",s=>{s.code==="Digit1"&&tn!=="escopeta"&&(tn="escopeta",Ki.setHUD("escopeta"),_n.release()),s.code==="Digit2"&&tn!=="lasso"&&(tn="lasso",Ki.setHUD("lasso")),s.code==="Digit3"&&tn!=="food"&&(tn="food",Ki.setHUD("food"),_n.release()),s.code==="Tab"&&tn==="food"&&(s.preventDefault(),bA(),hs())});document.addEventListener("keydown",s=>{s.key==="Alt"&&(s.preventDefault(),Ki._visible||Ki.show(tn))});document.addEventListener("keyup",s=>{if(s.key==="Alt"){s.preventDefault();const e=Ki.getSelected();Ki.hide(),e!==tn&&(tn=e,Ki.setHUD(tn),tn!=="lasso"&&_n.release())}});const pi=new Ob({antialias:!0});pi.setSize(window.innerWidth,window.innerHeight);pi.setPixelRatio(1);pi.shadowMap.enabled=!1;document.body.appendChild(pi.domElement);const ms=new un(35,window.innerWidth/window.innerHeight,.1,600);ms.position.set(20,25,20);ms.lookAt(0,0,0);const at=new kg;window.addEventListener("resize",()=>{ms.aspect=window.innerWidth/window.innerHeight,ms.updateProjectionMatrix(),pi.setSize(window.innerWidth,window.innerHeight)});const sc=[],{colliders:jA,sun:ra,moon:oa,ambient:$A}=Hb(at);jA.forEach(s=>sc.push(s));const ZA=new r1(at,sc);qS(at);KA(at,sc);const Da=FA(),Ve=new Vb(ms);Ve.onEmergencyBrake=()=>{l0(),setTimeout(()=>h0(),180)};KT();let lt=null,fe=null;const Lt=new Map;let St=null,It={hp:100,kills:0,deaths:0},pn=!1;const JA=new dw(at);let aa=0;const Si=new Bw(at),zn=new cE(at),QA=new pE(at);let tn="shotgun";const Ki=new mE,_n=new SE(at),e2=new CE(at);let Qe=null,Ph=!1,g0=!1;_m();function t2(s){vu(),vA(),rA(),uA();const e=du()||Zm();NT(),$T();const t=new URL(window.location);t.searchParams.set("room",e),window.history.replaceState({},"",t),xm(e,s)}Mm(s=>{St=s.self.id,It={hp:s.self.hp,kills:s.self.kills,deaths:s.self.deaths},Ve.setPosition(s.self.x,s.self.y,s.self.z),lt=new vh(at,{...s.self,name:"",local:!0}),fe=new E1(at,PT),fe.onHoofTouch=(e,t)=>jE(e,t),Ve.onEPress=()=>{const e=Ve.getPosition(),t=(fe==null?void 0:fe._nearestHorseId)!==null,n=fe==null?void 0:fe.isMounted();if(t||n){const i=fe==null?void 0:fe.tryMount(St,0,e.x,e.z);i&&(Ve.setPosition(i.x,0,i.z),$E(),l0())}else tn==="food"&&SA()&&r2(e)},Pm(e=>fe==null?void 0:fe.onRemoteMount(e.horseId,e.playerId)),Im(e=>fe==null?void 0:fe.onRemoteDismount(e.horseId)),Lm(e=>{fe==null||fe.onRemoteHorseMoved(e.horseId,e.x,e.z,e.ry,Lt.get(e.riderId))}),Fm(({key:e,dir:t})=>NS(e,t)),zm(({idx:e}={})=>{Si.kill(e??0),QE()}),Qe=new Qw(at);for(const e of s.corralledCows??[])Qe.corrall(e);If(Qe.getCorralled()),km(({id:e,total:t})=>{Qe==null||Qe.corrall(e),If((Qe==null?void 0:Qe.getCorralled())??t),t===33?_A():gA()}),Wm(({x:e,z:t})=>{Qe==null||Qe.yell(e,t),Qm(!0)}),Nm(({type:e})=>{tw(e==="templo"?"¿El templo Ror? Queda para el norte.":"Si no sabes dónde ir… todos los caminos son el correcto.",()=>{Ph=!1,g0=!0,e==="templo"&&aw()})}),UT(),co(It.hp),Ah(It.kills,It.deaths),kT(s.roomId);for(const[e,t]of Object.entries(s.players))e!==St&&Lt.set(e,new vh(at,t));fu(Lt.size+1)});bm(s=>{s.id!==St&&(Lt.set(s.id,new vh(at,s)),fu(Lt.size+1))});Sm(s=>{var e;(e=Lt.get(s))==null||e.remove(at),Lt.delete(s),fu(Lt.size+1)});Tm(s=>{var e;fe!=null&&fe.isPlayerMounted(s.id)||(e=Lt.get(s.id))==null||e.setTarget(s.x,s.y,s.z,s.ry)});wm(s=>{im(at,s.origin);const e=new A(s.direction.x,s.direction.y,s.direction.z);if(nm(at,s.origin,e,16737860),St&&Ve){const t=Ve.getPosition();if(t){const n=t.x-s.origin.x,i=t.z-s.origin.z;Math.hypot(n,i)<18&&zE()}}setTimeout(()=>BE(),180+Math.random()*80)});Em(s=>{var e,t;s.id===St?(It.hp=s.hp,co(It.hp),GT(),lt==null||lt.detachHat(),HE(),It.hp<=30?YE():Mu()):((e=Lt.get(s.id))==null||e.detachHat(),(t=Lt.get(s.id))==null||t.setHP(s.hp)),s.attackerId===St&&(Jm(),VE(),kE())});Am(s=>{var e;VT(s.killerName,s.victimName),s.victimId!==St&&((e=Lt.get(s.victimId))==null||e.startDying()),s.victimId===St&&(pn=!0,It.deaths=s.victimDeaths,Ah(It.kills,It.deaths),WT(),GE(),WE(),Mu()),s.killerId===St&&(It.kills=s.killerKills,Ah(It.kills,It.deaths),Jm())});Rm(s=>{if(s.id===St)pn=!1,It.hp=s.hp,Ve.setPosition(s.x,s.y,s.z),co(It.hp),XT(),Mu(),lt==null||lt.respawnHat();else{const e=Lt.get(s.id);e&&(e.setTarget(s.x,s.y,s.z,0),e.respawnHat(),e.resetImpact())}});Xm(({text:s})=>{console.log("[GM]",s);const e=document.getElementById("gm-box"),t=document.getElementById("gm-text");if(!e||!t){console.warn("[GM] no gm-box found in DOM");return}t.textContent=s,e.style.cssText+=";display:flex !important;flex-direction:column;opacity:1;transition:opacity 0.6s;",clearTimeout(e._hideT),e._hideT=setTimeout(()=>{e.style.opacity="0",setTimeout(()=>{e.style.display="none",e.style.opacity="1"},650)},9e3),mA(),IE(s)});let Ih=1;qm(s=>{switch(console.log("[GM CMD]",s),s.type){case"set_time":Aa(s.hour/24),setTimeout(()=>Ra(),8e3);break;case"stampede":Qe==null||Qe.yellAt(0,0,99999),zn==null||zn.yell(0,0),fA();break;case"storm":{s.intensity,Aa(.78+Math.random()*.04),setTimeout(()=>Ra(),2e4);break}case"blood_moon":Aa(.01),at.fog.color.setRGB(.35,.02,.02),setTimeout(()=>Ra(),3e4);break;case"fog":at.fog.near=10,at.fog.far=Math.max(20,120*(1-(s.density??.5))),setTimeout(()=>{at.fog.near=80,at.fog.far=420},2e4);break;case"day_speed":Ih=s.mult??1,setTimeout(()=>{Ih=1},3e4);break;case"heal_all":It&&(It.hp=Math.min(200,It.hp+(s.amount??100)),co(It.hp));break}});const ji=new Map;function n2(s){const e=new Oe,t=new Ie(s||"#8B7355"),n=new oe({color:t,roughness:.85}),i=new oe({color:t.clone().lerp(new Ie(0),.3),roughness:.9}),r=new ae(new Ae(.65,.95,.42),n);r.position.set(0,.6,0),r.castShadow=!0;const o=new ae(new Ae(.4,.4,.4),n.clone());o.position.set(0,1.28,0),o.castShadow=!0;const a=new ai(.3,.3,.04,8),c=new ae(a,i.clone());c.position.set(0,1.5,0);const l=new ai(.18,.2,.22,8),h=new ae(l,i.clone());h.position.set(0,1.63,0);const u=new Ae(.22,.68,.22),d=new ae(u,i.clone());d.position.set(-.16,-.18,0),d.name="leg_l";const f=new ae(u,i.clone());return f.position.set(.16,-.18,0),f.name="leg_r",e.add(r,o,c,h,d,f),e}function i2(s){const e=document.createElement("div");return e.style.cssText='position:fixed;z-index:90;pointer-events:none;font-family:"Share Tech Mono",monospace;font-size:10px;color:#d4aa60;letter-spacing:1px;text-shadow:0 0 4px rgba(0,0,0,0.9);transform:translateX(-50%);white-space:nowrap;',e.textContent=s,document.body.appendChild(e),e}function s2(){const s=document.createElement("div");return s.style.cssText='position:fixed;z-index:91;pointer-events:none;font-family:"Share Tech Mono",monospace;font-size:11px;color:#e8c870;background:rgba(6,3,1,0.88);border:1px solid #5a3a14;padding:6px 10px;max-width:220px;line-height:1.5;letter-spacing:0.5px;transform:translate(-50%,-100%);display:none;white-space:pre-wrap;box-shadow:0 0 12px rgba(180,130,40,0.15);',document.body.appendChild(s),s}Ym(({id:s,name:e,x:t,z:n,color:i})=>{if(ji.has(s))return;const r=n2(i);r.position.set(t,0,n),at.add(r);const o=i2(e),a=s2();ji.set(s,{group:r,labelDiv:o,bubbleDiv:a,walkT:0,name:e}),console.log(`[NPC] Spawned "${e}" @(${t.toFixed(1)},${n.toFixed(1)})`)});Km(({id:s,x:e,z:t})=>{const n=ji.get(s);if(!n)return;const i=n.group.position.clone();n.group.position.set(e,0,t);const r=e-i.x,o=t-i.z;Math.abs(r)+Math.abs(o)>.01&&(n.group.rotation.y=Math.atan2(r,o))});jm(({id:s,name:e,text:t})=>{const n=ji.get(s),i=document.getElementById("gm-box"),r=document.getElementById("gm-text");i&&r&&(r.textContent=`${e}: "${t}"`,i.style.cssText+=";display:flex !important;flex-direction:column;opacity:1;transition:opacity 0.6s;",clearTimeout(i._hideT),i._hideT=setTimeout(()=>{i.style.opacity="0",setTimeout(()=>{i.style.display="none",i.style.opacity="1"},650)},9e3)),n&&(n.bubbleDiv.textContent=`"${t}"`,n.bubbleDiv.style.display="block",clearTimeout(n._hideB),n._hideB=setTimeout(()=>{n.bubbleDiv.style.display="none"},9e3)),a0(t)});$m(({id:s})=>{const e=ji.get(s);e&&(at.remove(e.group),e.labelDiv.remove(),e.bubbleDiv.remove(),ji.delete(s))});pi.domElement.addEventListener("mousedown",s=>{var e;if(!(s.button!==0||pn||!St)){if(tn==="food"){const t=f0();t&&(Cw(t.hunger),It.hp=Math.min(200,It.hp+t.hp),co(It.hp),HT(),c0(),hs());return}if(tn==="lasso"){if(_n.isCaught()||_n._state==="flying")return;_n.startCharge(),nA();return}OE();try{const t=Ve.getPosition(),i=(fe!=null&&fe.isMounted()?2.5:t.y)+.55,r=lt==null?void 0:lt.getFirepointWorldPos(),o=r?{x:r.x,y:r.y,z:r.z}:null,a=Ve.getFreshAimDirection(i),c=L1(t,a,Lt,performance.now()/1e3,i,o);if(!c)return;Ve.applyRecoil(),lt==null||lt.triggerGunRecoil(),im(at,c.origin);const l=Ve.getCameraRaycaster(),h=[],u=new Map;for(const[m,x]of Lt)for(const y of x.getHitboxes())h.push(y),u.set(y.uuid,{id:m,type:"player"});if(Qe)for(const m of Qe.getCowHitboxes()){const x=Qe.getCowIdByHitbox(m);x>=0&&(h.push(m),u.set(m.uuid,{id:x,type:"cow"}))}for(const m of Si.getHitboxes()){const x=Si.getIndexByHitbox(m);x>=0&&(h.push(m),u.set(m.uuid,{id:x,type:"ostrich"}))}for(const m of zn.getHitboxes()){const x=zn.getIdByHitbox(m);x>=0&&(h.push(m),u.set(m.uuid,{id:x,type:"chicken"}))}const d=D1(l,h,u),f=new A(c.origin.x,c.origin.y,c.origin.z);let g,_;if(d?(g=new A().subVectors(d.point,f).normalize(),_=f.distanceTo(d.point)+.2):(g=new A(c.direction.x,-i*.04,c.direction.z).normalize(),_=ou),nm(at,c.origin,g,16776960,_),d){const m=f.distanceTo(d.point),x=Math.max(30,m/tm*1e3);let y="body";if(d.target.type==="player")if((((e=d.hitObject)==null?void 0:e.name)??"")==="head")y="head";else{const w=Lt.get(d.target.id),E=w?w.group.position.y:0;y=d.point.y-E<.5?"leg":"body"}else d.target.type==="cow"?y=d.point.y>1.5?"head":d.point.y<.65?"leg":"body":d.target.type==="ostrich"?y=d.point.y>1.8?"head":d.point.y<.65?"leg":"body":d.target.type==="chicken"&&(y=d.point.y>.3?"head":d.point.y<.12?"leg":"body");setTimeout(()=>{var b;if(d.target.type==="player")Vm(d.target.id),(b=Lt.get(d.target.id))==null||b.applyImpact(y,d.point);else if(d.target.type==="cow"){const w=y==="body"?Math.random()<.8?"leg":"head":y,E=Qe==null?void 0:Qe._cows[d.target.id],C=(E==null?void 0:E.hp)??2;Qe==null||Qe.hitCow(d.target.id,d.point,w);const v=Qe==null?void 0:Qe._cows[d.target.id];v!=null&&v.wounded&&C>1?Hs("animal_wounded",{detail:"Una vaca quedó herida y se arrastra por la pampa."}):(v!=null&&v.removed||((v==null?void 0:v.hp)??2)<=0)&&Hs("animal_killed",{detail:"Una vaca fue abatida. La carne cae al pasto."})}else if(d.target.type==="ostrich"){const w=d.target.id,E=y==="body"?Math.random()<.8?"leg":"head":y,C=Si._entities[w],v=(C==null?void 0:C.hp)??2;Si.hit(w,d.point,E);const T=Si._entities[w];T!=null&&T.wounded&&v>1?Hs("animal_wounded",{detail:"Un avestruz herido corre en círculos por el campo."}):(T!=null&&T.dead||T!=null&&T.dying)&&Hs("animal_killed",{detail:"Un avestruz cayó. Sus plumas vuelan en el viento pampeano."}),T&&(T.wounded||T.dying||T.dead)&&Om(w)}else if(d.target.type==="chicken"){const w=y==="body"?Math.random()<.8?"leg":"head":y;zn.hit(d.target.id,d.point,w),Hs("animal_killed",{detail:"Una gallina explotó en plumas. El olor a asado flota en el aire."})}},x)}ym(c);const p=LS();if(p.length>0){const m=new A(c.origin.x,c.origin.y,c.origin.z),x=new A(c.direction.x,0,c.direction.z).normalize();let y=null,b=1/0;const w=new A,E=new on;for(const C of p){C.updateWorldMatrix(!0,!1),E.setFromObject(C),E.getCenter(w);const v=new A(w.x-m.x,0,w.z-m.z).dot(x);if(v<0||v>80)continue;const T=m.x+x.x*v,F=m.z+x.z*v;Math.sqrt((w.x-T)**2+(w.z-F)**2)<1.5&&v<b&&(y=C,b=v)}if(y){Jp(y,c.direction);const C=DS(y);C&&Um(C,c.direction)}}}catch(t){console.error("[DISPARO ERROR]",t)}}});pi.domElement.addEventListener("mousedown",s=>{s.button===2&&tn==="lasso"&&(_n.isCaught()?_n.startReel():_n.release())});pi.domElement.addEventListener("mouseup",s=>{s.button===2&&_n.stopReel()});pi.domElement.addEventListener("mouseup",s=>{if(s.button===0&&tn==="lasso"&&_n._state==="charging"){const e=Ve.getPosition(),n=(fe!=null&&fe.isMounted()?2.5:e.y)+.55,i=lt==null?void 0:lt.getFirepointWorldPos(),r=i?new A(i.x,i.y,i.z):new A(e.x,n,e.z),o=Ve.getFreshAimDirection(n);iA(),tA(),_n.releaseCharge(r,o)}});const Yr=document.createElement("div");Yr.style.cssText=["position:fixed","bottom:28px","right:16px","z-index:200","display:none","gap:6px","flex-direction:row","align-items:center",'font-family:"Share Tech Mono",monospace'].join(";");document.body.appendChild(Yr);function hs(){const s=EA(),e=wA(),t=yA;if(TA()===0){Yr.style.display="none";return}Yr.style.display="flex",Yr.innerHTML=Object.entries(t).map(([i,r])=>{const o=s[i];if(o===0)return"";const a=i===e;return`<div style="
      background:${a?"rgba(200,160,50,0.80)":"rgba(0,0,0,0.55)"};
      border:1px solid ${a?"#f0c040":"rgba(255,255,255,0.15)"};
      border-radius:5px; padding:3px 8px; font-size:13px; color:#fff;
      cursor:default; white-space:nowrap;
    ">${r.icon} <b>${o}</b></div>`}).join("")}const Na=[];function r2(s){const e=f0();if(!e)return;hs();const t=new Ae(.28,.12,.28),n=e.type==="chicken"?13928522:e.type==="ostrich"?13148240:9120266,i=new oe({color:n,roughness:.85}),r=new ae(t,i);r.castShadow=!0;const o=Ve.getRotation(),a=Math.sin(o.y),c=Math.cos(o.y);r.position.set(s.x+a*1.8,.08,s.z+c*1.8),at.add(r),Na.push({mesh:r,item:e,throwerId:St,age:0}),c0()}const o2=new G_,a2=1/20;let al=0,ca=0,cl=8+Math.random()*12,ll=30+Math.random()*60,hl=45+Math.random()*90,ul=6+Math.random()*10,dl=12+Math.random()*18,fl=20+Math.random()*30,la=0,ha=!1,Lr=!1,op=!1;function _0(){var n;requestAnimationFrame(_0);const s=Math.min(o2.getDelta(),.1);let e=null;if(!pn&&St){const i=(fe==null?void 0:fe.isMounted())??!1;Ve.update(s,sc,(fe==null?void 0:fe.speedMultiplier(Ve.isSprinting()))??(Ve.isSprinting()?1.9:1),i),e=Ve.getPosition();const r=Ve.getRotation();if(ZA.update(e),ra.position.set(e.x+90,22,e.z+25),ra.target.position.set(e.x,0,e.z),ra.target.updateMatrixWorld(),oa.position.set(e.x-80,30,e.z-20),oa.target.position.set(e.x,0,e.z),oa.target.updateMatrixWorld(),fe){fe.update(e,s);const c=fe.consumeMountLand();if(c&&Ve.setPosition(c.x,0,c.z),fe.isMounted()&&!fe.isMountAnimating()){const l=Ve.getMovementAngle(),h=Ve.isSprinting();fe.syncRiderPosition(e.x,e.z,l,e.y,h),Cm({horseId:fe.myHorseId,x:e.x,z:e.z,ry:l})}if(!fe.isMounted()&&Ve.isInAir()){const l=e.y;fe.tryAutoMount(e,St,l)&&Ve.landOnHorse()}}const o=Ve.isAiming()?r.y:Ve.getMovementAngle();if(Ve.isAiming())aa=o;else{let c=o-aa;for(;c>Math.PI;)c-=Math.PI*2;for(;c<-Math.PI;)c+=Math.PI*2;aa+=c*Math.min(1,12*s)}const a=aa;if(lt==null||lt.setAiming(Ve.isAiming()),lt){const c=fe==null?void 0:fe.getAnimY(),l=c??(fe!=null&&fe.isMounted()?2.5+e.y:e.y),h=fe==null?void 0:fe.getMountModelPos(),u=fe==null?void 0:fe.getDismountModelPos(e),d=h??u,f=d?d.x:e.x,g=d?d.z:e.z;lt.group.position.set(f,l,g),lt.group.rotation.y=a}if(jT(e.x,e.z),!g0&&!Ph){const c=e.x-Gs.x,l=e.z-Gs.z;c*c+l*l<36&&(Ph=!0,JT("¿Y ustedes? ¿Qué hace la gente de ciudad en un lugar tan lejano?"),setTimeout(()=>{QT(h=>{Dm(h),ew()})},2200))}al+=s,al>=a2&&(al=0,vm({x:e.x,y:e.y,z:e.z,rx:r.x,ry:a}))}for(const[,i]of Lt)i.update(s);lt==null||lt.updateHat(s),WS(s,e,fe!=null&&fe.isMounted()?e:null),fe&&JA.update(fe.horses,s),N1(at,s);for(let i=Na.length-1;i>=0;i--){const r=Na[i];if(r.age+=s,!e||r.age<1)continue;const o=e.x-r.mesh.position.x,a=e.z-r.mesh.position.z;o*o+a*a<2.5*2.5&&(sa(r.item.type,r.item.hunger,r.item.hp)&&hs(),at.remove(r.mesh),r.mesh.geometry.dispose(),r.mesh.material.dispose(),Na.splice(i,1))}if(_n.isActive()&&e){const r=(fe!=null&&fe.isMounted()?2.5:e.y)+.55,o=lt==null?void 0:lt.getFirepointWorldPos(),a=o?new A(o.x,o.y,o.z):new A(e.x,r,e.z);_n.update(s,a,Qe,Si,Lt)}if(St&&!pn){const i=e?[{x:e.x,z:e.z}]:[];for(const[,a]of Lt)i.push({x:a.group.position.x,z:a.group.position.z});const r=new Set(Da.filter(a=>a.isOpen).map(a=>`${Math.round(a.cx)},${Math.round(a.gateZ)}`)),o=zn.update(s,i,r);o&&e&&!pn&&sa("chicken",o.hunger,o.hp)&&hs()}for(const i of Da)i.animT!==i.animTarget&&(i.animT+=(i.animTarget-i.animT)*Math.min(1,7*s),Math.abs(i.animT-i.animTarget)<.005&&(i.animT=i.animTarget),i.panel.rotation.y=i.animT*-Math.PI/2);QA.update(s,e);const t=Si.update(s,e);if(t&&St&&!pn&&sa("ostrich",t.hunger,t.hp)&&hs(),Qe&&St&&!pn&&e){const i=Qe.updateMeats(s,e);i&&sa("beef",i.hunger,i.hp)&&hs()}if(Qe&&St&&!pn&&e){const i=[{x:e.x,z:e.z}];for(const[,a]of Lt)i.push({x:a.group.position.x,z:a.group.position.z});const r=new Set(Da.filter(a=>a.isOpen).map(a=>`${Math.round(a.cx)},${Math.round(a.gateZ)}`)),o=Qe.update(s,i,r);for(const a of o)Qe.corrall(a),Bm(a);ow(e.x,e.z)}if(St&&!pn&&e){const i=Ve.getCameraRaycaster(),r=[];for(const[,a]of Lt)r.push(...a.getHitboxes());Qe&&r.push(...Qe.getCowHitboxes()),r.push(...Si.getHitboxes()),r.push(...zn.getHitboxes());const o=r.length>0?i.intersectObjects(r,!1):[];FT(o.length>0?"#ff2020":null)}if(e2.update(s,e),ji.size>0){const i=window.innerWidth,r=window.innerHeight,o=new A;for(const[,a]of ji){a.walkT=(a.walkT||0)+s*2.2;const c=a.group.getObjectByName("leg_l"),l=a.group.getObjectByName("leg_r");if(c&&l&&(c.rotation.x=Math.sin(a.walkT)*.45,l.rotation.x=-Math.sin(a.walkT)*.45),o.set(a.group.position.x,a.group.position.y+2.1,a.group.position.z),o.project(ms),o.z<1){const h=(o.x*.5+.5)*i,u=(-o.y*.5+.5)*r;a.labelDiv.style.left=`${h}px`,a.labelDiv.style.top=`${u}px`,a.labelDiv.style.display="block",a.bubbleDiv.style.left=`${h}px`,a.bubbleDiv.style.top=`${u-8}px`}else a.labelDiv.style.display="none",a.bubbleDiv.style.display="none"}}if(xw(s*Ih,at,ra,$A,oa),St&&!pn&&(Ew(s,Ve.isSprinting(),(fe==null?void 0:fe.isMounted())??!1),zT(Aw(),Rw(),yw()),BT(Mw(),Df())),St&&e){const i=(fe==null?void 0:fe.isMounted())??!1,r=Math.hypot(Ve._velX??0,Ve._velZ??0)>.4,o=Df();!i&&r&&!pn?(ca-=s,ca<=0&&(FE("sand"),ca=Ve.isSprinting()?.28:.42)):ca=0,o&&!ha&&(oA(),np(),ha=!0,Lr=!1),!o&&ha&&(aA(),ha=!1);const a=Xa()>.24&&Xa()<.38;a&&!Lr&&(cA(),Lr=!0),!a&&Lr&&(np(),Lr=!1),cl-=s,cl<=0&&(Xr(!1),cl=7+Math.random()*13),o&&(ll-=s,ll<=0&&(eA(),ll=35+Math.random()*55)),hl-=s,hl<=0&&(Math.random()<.4&&dA(),hl=40+Math.random()*80),zn&&(ul-=s,ul<=0&&(ZE(),ul=5+Math.random()*9)),fl-=s,fl<=0&&(pA(),fl=18+Math.random()*28),i&&(dl-=s,dl<=0&&(h0(),dl=10+Math.random()*16));const c=((n=Ve.isInAir)==null?void 0:n.call(Ve))??!1;op&&!c&&XE(),op=c,r&&Ve.isSprinting()?(la-=s,la<=0&&(qE(),la=2.8+Math.random()*1.2)):la=0}pi.render(at,ms)}YT(()=>t2(qT()||"Gaucho"));document.addEventListener("click",()=>xA(),{once:!0});if(du()){const s=document.querySelector(".lobby-hint");s&&(s.textContent="Te uniste a una sala. Ingresa tu nombre y presiona JUGAR")}(function(){const e=document.getElementById("time-panel"),t=document.getElementById("time-slider"),n=document.getElementById("time-label"),i=document.getElementById("sky-arc");if(!e||!t||!n||!i)return;const r=i.getContext("2d"),o=i.width,a=i.height;function c(h){r.clearRect(0,0,o,a),r.strokeStyle="#3a2808",r.lineWidth=1,r.beginPath(),r.moveTo(0,a-12),r.lineTo(o,a-12),r.stroke();const u=o/2,d=a-12,f=o/2-10;r.strokeStyle="#2a1a06",r.lineWidth=1,r.beginPath(),r.arc(u,d,f,Math.PI,0),r.stroke();const g=Math.PI-(h-.25)/.5*Math.PI,_=h>=.22&&h<=.8,p=u+f*Math.cos(g),m=d-f*Math.sin(g);_&&(r.fillStyle="#f0e040",r.shadowColor="#f0e040",r.shadowBlur=10,r.beginPath(),r.arc(p,m,7,0,Math.PI*2),r.fill(),r.shadowBlur=0);const x=g+Math.PI,y=u+f*Math.cos(x),b=d-f*Math.sin(x);b<d&&(r.fillStyle="#c0c8e0",r.shadowColor="#c0c8e0",r.shadowBlur=8,r.beginPath(),r.arc(y,b,5,0,Math.PI*2),r.fill(),r.shadowBlur=0);const w=String(Math.floor(h*24)).padStart(2,"0"),E=String(Math.floor(h*1440%60)).padStart(2,"0");n.textContent=`${w}:${E}`}document.addEventListener("keydown",h=>{if(h.code!=="Backquote")return;const u=e.style.display!=="none";if(e.style.display=u?"none":"flex",!u){const d=Xa();t.value=Math.round(d*1440),c(d)}});let l=!1;t.addEventListener("mousedown",()=>{l=!0}),t.addEventListener("mouseup",()=>{l=!1,Ra()}),t.addEventListener("input",()=>{const h=t.valueAsNumber/1440;Aa(h),c(h)}),setInterval(()=>{if(e.style.display==="none"||l)return;const h=Xa();t.value=Math.round(h*1440),c(h)},500)})();_0();
