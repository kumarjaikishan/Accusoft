import{r as l,R as T,W as nn,X as Vn,Y as Lt,e as Mt}from"./index-Ble0O47O.js";function Yn(e){function t(f,p,h,E,a){for(var N=0,u=0,Y=0,z=0,j,S,K=0,ne=0,M,ee=M=j=0,W=0,H=0,Oe=0,J=0,ke=h.length,ye=ke-1,ue,R="",U="",Be="",Ie="",pe;W<ke;){if(S=h.charCodeAt(W),W===ye&&u+z+Y+N!==0&&(u!==0&&(S=u===47?10:47),z=Y=N=0,ke++,ye++),u+z+Y+N===0){if(W===ye&&(0<H&&(R=R.replace(_,"")),0<R.trim().length)){switch(S){case 32:case 9:case 59:case 13:case 10:break;default:R+=h.charAt(W)}S=59}switch(S){case 123:for(R=R.trim(),j=R.charCodeAt(0),M=1,J=++W;W<ke;){switch(S=h.charCodeAt(W)){case 123:M++;break;case 125:M--;break;case 47:switch(S=h.charCodeAt(W+1)){case 42:case 47:e:{for(ee=W+1;ee<ye;++ee)switch(h.charCodeAt(ee)){case 47:if(S===42&&h.charCodeAt(ee-1)===42&&W+2!==ee){W=ee+1;break e}break;case 10:if(S===47){W=ee+1;break e}}W=ee}}break;case 91:S++;case 40:S++;case 34:case 39:for(;W++<ye&&h.charCodeAt(W)!==S;);}if(M===0)break;W++}switch(M=h.substring(J,W),j===0&&(j=(R=R.replace(v,"").trim()).charCodeAt(0)),j){case 64:switch(0<H&&(R=R.replace(_,"")),S=R.charCodeAt(1),S){case 100:case 109:case 115:case 45:H=p;break;default:H=ge}if(M=t(p,H,M,S,a+1),J=M.length,0<se&&(H=n(ge,R,Oe),pe=c(3,M,H,p,B,Q,J,S,a,E),R=H.join(""),pe!==void 0&&(J=(M=pe.trim()).length)===0&&(S=0,M="")),0<J)switch(S){case 115:R=R.replace(X,s);case 100:case 109:case 45:M=R+"{"+M+"}";break;case 107:R=R.replace(C,"$1 $2"),M=R+"{"+M+"}",M=q===1||q===2&&i("@"+M,3)?"@-webkit-"+M+"@"+M:"@"+M;break;default:M=R+M,E===112&&(M=(U+=M,""))}else M="";break;default:M=t(p,n(p,R,Oe),M,E,a+1)}Be+=M,M=Oe=H=ee=j=0,R="",S=h.charCodeAt(++W);break;case 125:case 59:if(R=(0<H?R.replace(_,""):R).trim(),1<(J=R.length))switch(ee===0&&(j=R.charCodeAt(0),j===45||96<j&&123>j)&&(J=(R=R.replace(" ",":")).length),0<se&&(pe=c(1,R,p,f,B,Q,U.length,E,a,E))!==void 0&&(J=(R=pe.trim()).length)===0&&(R="\0\0"),j=R.charCodeAt(0),S=R.charCodeAt(1),j){case 0:break;case 64:if(S===105||S===99){Ie+=R+h.charAt(W);break}default:R.charCodeAt(J-1)!==58&&(U+=r(R,j,S,R.charCodeAt(2)))}Oe=H=ee=j=0,R="",S=h.charCodeAt(++W)}}switch(S){case 13:case 10:u===47?u=0:1+j===0&&E!==107&&0<R.length&&(H=1,R+="\0"),0<se*be&&c(0,R,p,f,B,Q,U.length,E,a,E),Q=1,B++;break;case 59:case 125:if(u+z+Y+N===0){Q++;break}default:switch(Q++,ue=h.charAt(W),S){case 9:case 32:if(z+N+u===0)switch(K){case 44:case 58:case 9:case 32:ue="";break;default:S!==32&&(ue=" ")}break;case 0:ue="\\0";break;case 12:ue="\\f";break;case 11:ue="\\v";break;case 38:z+u+N===0&&(H=Oe=1,ue="\f"+ue);break;case 108:if(z+u+N+le===0&&0<ee)switch(W-ee){case 2:K===112&&h.charCodeAt(W-3)===58&&(le=K);case 8:ne===111&&(le=ne)}break;case 58:z+u+N===0&&(ee=W);break;case 44:u+Y+z+N===0&&(H=1,ue+="\r");break;case 34:case 39:u===0&&(z=z===S?0:z===0?S:z);break;case 91:z+u+Y===0&&N++;break;case 93:z+u+Y===0&&N--;break;case 41:z+u+N===0&&Y--;break;case 40:if(z+u+N===0){if(j===0)switch(2*K+3*ne){case 533:break;default:j=1}Y++}break;case 64:u+Y+z+N+ee+M===0&&(M=1);break;case 42:case 47:if(!(0<z+N+Y))switch(u){case 0:switch(2*S+3*h.charCodeAt(W+1)){case 235:u=47;break;case 220:J=W,u=42}break;case 42:S===47&&K===42&&J+2!==W&&(h.charCodeAt(J+2)===33&&(U+=h.substring(J,W+1)),ue="",u=0)}}u===0&&(R+=ue)}ne=K,K=S,W++}if(J=U.length,0<J){if(H=p,0<se&&(pe=c(2,U,H,f,B,Q,J,E,a,E),pe!==void 0&&(U=pe).length===0))return Ie+U+Be;if(U=H.join(",")+"{"+U+"}",q*le!==0){switch(q!==2||i(U,2)||(le=0),le){case 111:U=U.replace(P,":-moz-$1")+U;break;case 112:U=U.replace(A,"::-webkit-input-$1")+U.replace(A,"::-moz-$1")+U.replace(A,":-ms-input-$1")+U}le=0}}return Ie+U+Be}function n(f,p,h){var E=p.trim().split(m);p=E;var a=E.length,N=f.length;switch(N){case 0:case 1:var u=0;for(f=N===0?"":f[0]+" ";u<a;++u)p[u]=o(f,p[u],h).trim();break;default:var Y=u=0;for(p=[];u<a;++u)for(var z=0;z<N;++z)p[Y++]=o(f[z]+" ",E[u],h).trim()}return p}function o(f,p,h){var E=p.charCodeAt(0);switch(33>E&&(E=(p=p.trim()).charCodeAt(0)),E){case 38:return p.replace(k,"$1"+f.trim());case 58:return f.trim()+p.replace(k,"$1"+f.trim());default:if(0<1*h&&0<p.indexOf("\f"))return p.replace(k,(f.charCodeAt(0)===58?"":"$1")+f.trim())}return f+p}function r(f,p,h,E){var a=f+";",N=2*p+3*h+4*E;if(N===944){f=a.indexOf(":",9)+1;var u=a.substring(f,a.length-1).trim();return u=a.substring(0,f).trim()+u+";",q===1||q===2&&i(u,1)?"-webkit-"+u+u:u}if(q===0||q===2&&!i(a,1))return a;switch(N){case 1015:return a.charCodeAt(10)===97?"-webkit-"+a+a:a;case 951:return a.charCodeAt(3)===116?"-webkit-"+a+a:a;case 963:return a.charCodeAt(5)===110?"-webkit-"+a+a:a;case 1009:if(a.charCodeAt(4)!==100)break;case 969:case 942:return"-webkit-"+a+a;case 978:return"-webkit-"+a+"-moz-"+a+a;case 1019:case 983:return"-webkit-"+a+"-moz-"+a+"-ms-"+a+a;case 883:if(a.charCodeAt(8)===45)return"-webkit-"+a+a;if(0<a.indexOf("image-set(",11))return a.replace(ie,"$1-webkit-$2")+a;break;case 932:if(a.charCodeAt(4)===45)switch(a.charCodeAt(5)){case 103:return"-webkit-box-"+a.replace("-grow","")+"-webkit-"+a+"-ms-"+a.replace("grow","positive")+a;case 115:return"-webkit-"+a+"-ms-"+a.replace("shrink","negative")+a;case 98:return"-webkit-"+a+"-ms-"+a.replace("basis","preferred-size")+a}return"-webkit-"+a+"-ms-"+a+a;case 964:return"-webkit-"+a+"-ms-flex-"+a+a;case 1023:if(a.charCodeAt(8)!==99)break;return u=a.substring(a.indexOf(":",15)).replace("flex-","").replace("space-between","justify"),"-webkit-box-pack"+u+"-webkit-"+a+"-ms-flex-pack"+u+a;case 1005:return x.test(a)?a.replace(D,":-webkit-")+a.replace(D,":-moz-")+a:a;case 1e3:switch(u=a.substring(13).trim(),p=u.indexOf("-")+1,u.charCodeAt(0)+u.charCodeAt(p)){case 226:u=a.replace(F,"tb");break;case 232:u=a.replace(F,"tb-rl");break;case 220:u=a.replace(F,"lr");break;default:return a}return"-webkit-"+a+"-ms-"+u+a;case 1017:if(a.indexOf("sticky",9)===-1)break;case 975:switch(p=(a=f).length-10,u=(a.charCodeAt(p)===33?a.substring(0,p):a).substring(f.indexOf(":",7)+1).trim(),N=u.charCodeAt(0)+(u.charCodeAt(7)|0)){case 203:if(111>u.charCodeAt(8))break;case 115:a=a.replace(u,"-webkit-"+u)+";"+a;break;case 207:case 102:a=a.replace(u,"-webkit-"+(102<N?"inline-":"")+"box")+";"+a.replace(u,"-webkit-"+u)+";"+a.replace(u,"-ms-"+u+"box")+";"+a}return a+";";case 938:if(a.charCodeAt(5)===45)switch(a.charCodeAt(6)){case 105:return u=a.replace("-items",""),"-webkit-"+a+"-webkit-box-"+u+"-ms-flex-"+u+a;case 115:return"-webkit-"+a+"-ms-flex-item-"+a.replace(L,"")+a;default:return"-webkit-"+a+"-ms-flex-line-pack"+a.replace("align-content","").replace(L,"")+a}break;case 973:case 989:if(a.charCodeAt(3)!==45||a.charCodeAt(4)===122)break;case 931:case 953:if(Z.test(f)===!0)return(u=f.substring(f.indexOf(":")+1)).charCodeAt(0)===115?r(f.replace("stretch","fill-available"),p,h,E).replace(":fill-available",":stretch"):a.replace(u,"-webkit-"+u)+a.replace(u,"-moz-"+u.replace("fill-",""))+a;break;case 962:if(a="-webkit-"+a+(a.charCodeAt(5)===102?"-ms-"+a:"")+a,h+E===211&&a.charCodeAt(13)===105&&0<a.indexOf("transform",10))return a.substring(0,a.indexOf(";",27)+1).replace(y,"$1-webkit-$2")+a}return a}function i(f,p){var h=f.indexOf(p===1?":":"{"),E=f.substring(0,p!==3?h:10);return h=f.substring(h+1,f.length-1),xe(p!==2?E:E.replace(te,"$1"),h,p)}function s(f,p){var h=r(p,p.charCodeAt(0),p.charCodeAt(1),p.charCodeAt(2));return h!==p+";"?h.replace(G," or ($1)").substring(4):"("+p+")"}function c(f,p,h,E,a,N,u,Y,z,j){for(var S=0,K=p,ne;S<se;++S)switch(ne=ae[S].call(b,f,K,h,E,a,N,u,Y,z,j)){case void 0:case!1:case!0:case null:break;default:K=ne}if(K!==p)return K}function g(f){switch(f){case void 0:case null:se=ae.length=0;break;default:if(typeof f=="function")ae[se++]=f;else if(typeof f=="object")for(var p=0,h=f.length;p<h;++p)g(f[p]);else be=!!f|0}return g}function w(f){return f=f.prefix,f!==void 0&&(xe=null,f?typeof f!="function"?q=1:(q=2,xe=f):q=0),w}function b(f,p){var h=f;if(33>h.charCodeAt(0)&&(h=h.trim()),Ce=h,h=[Ce],0<se){var E=c(-1,p,h,h,B,Q,0,0,0,0);E!==void 0&&typeof E=="string"&&(p=E)}var a=t(ge,h,p,0,0);return 0<se&&(E=c(-2,a,h,h,B,Q,a.length,0,0,0),E!==void 0&&(a=E)),Ce="",le=0,Q=B=1,a}var v=/^\0+/g,_=/[\0\r\f]/g,D=/: */g,x=/zoo|gra/,y=/([,: ])(transform)/g,m=/,\r+?/g,k=/([\t\r\n ])*\f?&/g,C=/@(k\w+)\s*(\S*)\s*/,A=/::(place)/g,P=/:(read-only)/g,F=/[svh]\w+-[tblr]{2}/,X=/\(\s*(.*)\s*\)/g,G=/([\s\S]*?);/g,L=/-self|flex-/g,te=/[^]*?(:[rp][el]a[\w-]+)[^]*/,Z=/stretch|:\s*\w+\-(?:conte|avail)/,ie=/([^-])(image-set\()/,Q=1,B=1,le=0,q=1,ge=[],ae=[],se=0,xe=null,be=0,Ce="";return b.use=g,b.set=w,e!==void 0&&w(e),b}var Un={animationIterationCount:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},he={};function ve(){return(ve=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}var Nt=function(e,t){for(var n=[e[0]],o=0,r=t.length;o<r;o+=1)n.push(t[o],e[o+1]);return n},pt=function(e){return e!==null&&typeof e=="object"&&(e.toString?e.toString():Object.prototype.toString.call(e))==="[object Object]"&&!nn.typeOf(e)},ot=Object.freeze([]),Ee=Object.freeze({});function Fe(e){return typeof e=="function"}function zt(e){return e.displayName||e.name||"Component"}function wt(e){return e&&typeof e.styledComponentId=="string"}var Le=typeof process<"u"&&he!==void 0&&(he.REACT_APP_SC_ATTR||he.SC_ATTR)||"data-styled",vt=typeof window<"u"&&"HTMLElement"in window,Xn=!!(typeof SC_DISABLE_SPEEDY=="boolean"?SC_DISABLE_SPEEDY:typeof process<"u"&&he!==void 0&&(he.REACT_APP_SC_DISABLE_SPEEDY!==void 0&&he.REACT_APP_SC_DISABLE_SPEEDY!==""?he.REACT_APP_SC_DISABLE_SPEEDY!=="false"&&he.REACT_APP_SC_DISABLE_SPEEDY:he.SC_DISABLE_SPEEDY!==void 0&&he.SC_DISABLE_SPEEDY!==""&&he.SC_DISABLE_SPEEDY!=="false"&&he.SC_DISABLE_SPEEDY));function De(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];throw new Error("An error occurred. See https://git.io/JUIaE#"+e+" for more information."+(n.length>0?" Args: "+n.join(", "):""))}var Zn=(function(){function e(n){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=n}var t=e.prototype;return t.indexOfGroup=function(n){for(var o=0,r=0;r<n;r++)o+=this.groupSizes[r];return o},t.insertRules=function(n,o){if(n>=this.groupSizes.length){for(var r=this.groupSizes,i=r.length,s=i;n>=s;)(s<<=1)<0&&De(16,""+n);this.groupSizes=new Uint32Array(s),this.groupSizes.set(r),this.length=s;for(var c=i;c<s;c++)this.groupSizes[c]=0}for(var g=this.indexOfGroup(n+1),w=0,b=o.length;w<b;w++)this.tag.insertRule(g,o[w])&&(this.groupSizes[n]++,g++)},t.clearGroup=function(n){if(n<this.length){var o=this.groupSizes[n],r=this.indexOfGroup(n),i=r+o;this.groupSizes[n]=0;for(var s=r;s<i;s++)this.tag.deleteRule(r)}},t.getGroup=function(n){var o="";if(n>=this.length||this.groupSizes[n]===0)return o;for(var r=this.groupSizes[n],i=this.indexOfGroup(n),s=i+r,c=i;c<s;c++)o+=this.tag.getRule(c)+`/*!sc*/
`;return o},e})(),tt=new Map,rt=new Map,Ye=1,Ke=function(e){if(tt.has(e))return tt.get(e);for(;rt.has(Ye);)Ye++;var t=Ye++;return tt.set(e,t),rt.set(t,e),t},Qn=function(e){return rt.get(e)},Kn=function(e,t){t>=Ye&&(Ye=t+1),tt.set(e,t),rt.set(t,e)},Jn="style["+Le+'][data-styled-version="5.3.11"]',qn=new RegExp("^"+Le+'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)'),eo=function(e,t,n){for(var o,r=n.split(","),i=0,s=r.length;i<s;i++)(o=r[i])&&e.registerName(t,o)},to=function(e,t){for(var n=(t.textContent||"").split(`/*!sc*/
`),o=[],r=0,i=n.length;r<i;r++){var s=n[r].trim();if(s){var c=s.match(qn);if(c){var g=0|parseInt(c[1],10),w=c[2];g!==0&&(Kn(w,g),eo(e,w,c[3]),e.getTag().insertRules(g,o)),o.length=0}else o.push(s)}}},no=function(){return typeof __webpack_nonce__<"u"?__webpack_nonce__:null},on=function(e){var t=document.head,n=e||t,o=document.createElement("style"),r=(function(c){for(var g=c.childNodes,w=g.length;w>=0;w--){var b=g[w];if(b&&b.nodeType===1&&b.hasAttribute(Le))return b}})(n),i=r!==void 0?r.nextSibling:null;o.setAttribute(Le,"active"),o.setAttribute("data-styled-version","5.3.11");var s=no();return s&&o.setAttribute("nonce",s),n.insertBefore(o,i),o},oo=(function(){function e(n){var o=this.element=on(n);o.appendChild(document.createTextNode("")),this.sheet=(function(r){if(r.sheet)return r.sheet;for(var i=document.styleSheets,s=0,c=i.length;s<c;s++){var g=i[s];if(g.ownerNode===r)return g}De(17)})(o),this.length=0}var t=e.prototype;return t.insertRule=function(n,o){try{return this.sheet.insertRule(o,n),this.length++,!0}catch{return!1}},t.deleteRule=function(n){this.sheet.deleteRule(n),this.length--},t.getRule=function(n){var o=this.sheet.cssRules[n];return o!==void 0&&typeof o.cssText=="string"?o.cssText:""},e})(),ro=(function(){function e(n){var o=this.element=on(n);this.nodes=o.childNodes,this.length=0}var t=e.prototype;return t.insertRule=function(n,o){if(n<=this.length&&n>=0){var r=document.createTextNode(o),i=this.nodes[n];return this.element.insertBefore(r,i||null),this.length++,!0}return!1},t.deleteRule=function(n){this.element.removeChild(this.nodes[n]),this.length--},t.getRule=function(n){return n<this.length?this.nodes[n].textContent:""},e})(),ao=(function(){function e(n){this.rules=[],this.length=0}var t=e.prototype;return t.insertRule=function(n,o){return n<=this.length&&(this.rules.splice(n,0,o),this.length++,!0)},t.deleteRule=function(n){this.rules.splice(n,1),this.length--},t.getRule=function(n){return n<this.length?this.rules[n]:""},e})(),Wt=vt,io={isServer:!vt,useCSSOMInjection:!Xn},rn=(function(){function e(n,o,r){n===void 0&&(n=Ee),o===void 0&&(o={}),this.options=ve({},io,{},n),this.gs=o,this.names=new Map(r),this.server=!!n.isServer,!this.server&&vt&&Wt&&(Wt=!1,(function(i){for(var s=document.querySelectorAll(Jn),c=0,g=s.length;c<g;c++){var w=s[c];w&&w.getAttribute(Le)!=="active"&&(to(i,w),w.parentNode&&w.parentNode.removeChild(w))}})(this))}e.registerId=function(n){return Ke(n)};var t=e.prototype;return t.reconstructWithOptions=function(n,o){return o===void 0&&(o=!0),new e(ve({},this.options,{},n),this.gs,o&&this.names||void 0)},t.allocateGSInstance=function(n){return this.gs[n]=(this.gs[n]||0)+1},t.getTag=function(){return this.tag||(this.tag=(r=(o=this.options).isServer,i=o.useCSSOMInjection,s=o.target,n=r?new ao(s):i?new oo(s):new ro(s),new Zn(n)));var n,o,r,i,s},t.hasNameForId=function(n,o){return this.names.has(n)&&this.names.get(n).has(o)},t.registerName=function(n,o){if(Ke(n),this.names.has(n))this.names.get(n).add(o);else{var r=new Set;r.add(o),this.names.set(n,r)}},t.insertRules=function(n,o,r){this.registerName(n,o),this.getTag().insertRules(Ke(n),r)},t.clearNames=function(n){this.names.has(n)&&this.names.get(n).clear()},t.clearRules=function(n){this.getTag().clearGroup(Ke(n)),this.clearNames(n)},t.clearTag=function(){this.tag=void 0},t.toString=function(){return(function(n){for(var o=n.getTag(),r=o.length,i="",s=0;s<r;s++){var c=Qn(s);if(c!==void 0){var g=n.names.get(c),w=o.getGroup(s);if(g&&w&&g.size){var b=Le+".g"+s+'[id="'+c+'"]',v="";g!==void 0&&g.forEach((function(_){_.length>0&&(v+=_+",")})),i+=""+w+b+'{content:"'+v+`"}/*!sc*/
`}}}return i})(this)},e})(),lo=/(a)(d)/gi,Bt=function(e){return String.fromCharCode(e+(e>25?39:97))};function ht(e){var t,n="";for(t=Math.abs(e);t>52;t=t/52|0)n=Bt(t%52)+n;return(Bt(t%52)+n).replace(lo,"$1-$2")}var Te=function(e,t){for(var n=t.length;n;)e=33*e^t.charCodeAt(--n);return e},an=function(e){return Te(5381,e)};function so(e){for(var t=0;t<e.length;t+=1){var n=e[t];if(Fe(n)&&!wt(n))return!1}return!0}var co=an("5.3.11"),uo=(function(){function e(t,n,o){this.rules=t,this.staticRulesId="",this.isStatic=(o===void 0||o.isStatic)&&so(t),this.componentId=n,this.baseHash=Te(co,n),this.baseStyle=o,rn.registerId(n)}return e.prototype.generateAndInjectStyles=function(t,n,o){var r=this.componentId,i=[];if(this.baseStyle&&i.push(this.baseStyle.generateAndInjectStyles(t,n,o)),this.isStatic&&!o.hash)if(this.staticRulesId&&n.hasNameForId(r,this.staticRulesId))i.push(this.staticRulesId);else{var s=Me(this.rules,t,n,o).join(""),c=ht(Te(this.baseHash,s)>>>0);if(!n.hasNameForId(r,c)){var g=o(s,"."+c,void 0,r);n.insertRules(r,c,g)}i.push(c),this.staticRulesId=c}else{for(var w=this.rules.length,b=Te(this.baseHash,o.hash),v="",_=0;_<w;_++){var D=this.rules[_];if(typeof D=="string")v+=D;else if(D){var x=Me(D,t,n,o),y=Array.isArray(x)?x.join(""):x;b=Te(b,y+_),v+=y}}if(v){var m=ht(b>>>0);if(!n.hasNameForId(r,m)){var k=o(v,"."+m,void 0,r);n.insertRules(r,m,k)}i.push(m)}}return i.join(" ")},e})(),go=/^\s*\/\/.*$/gm,po=[":","[",".","#"];function ho(e){var t,n,o,r,i=Ee,s=i.options,c=s===void 0?Ee:s,g=i.plugins,w=g===void 0?ot:g,b=new Yn(c),v=[],_=(function(y){function m(k){if(k)try{y(k+"}")}catch{}}return function(k,C,A,P,F,X,G,L,te,Z){switch(k){case 1:if(te===0&&C.charCodeAt(0)===64)return y(C+";"),"";break;case 2:if(L===0)return C+"/*|*/";break;case 3:switch(L){case 102:case 112:return y(A[0]+C),"";default:return C+(Z===0?"/*|*/":"")}case-2:C.split("/*|*/}").forEach(m)}}})((function(y){v.push(y)})),D=function(y,m,k){return m===0&&po.indexOf(k[n.length])!==-1||k.match(r)?y:"."+t};function x(y,m,k,C){C===void 0&&(C="&");var A=y.replace(go,""),P=m&&k?k+" "+m+" { "+A+" }":A;return t=C,n=m,o=new RegExp("\\"+n+"\\b","g"),r=new RegExp("(\\"+n+"\\b){2,}"),b(k||!m?"":m,P)}return b.use([].concat(w,[function(y,m,k){y===2&&k.length&&k[0].lastIndexOf(n)>0&&(k[0]=k[0].replace(o,D))},_,function(y){if(y===-2){var m=v;return v=[],m}}])),x.hash=w.length?w.reduce((function(y,m){return m.name||De(15),Te(y,m.name)}),5381).toString():"",x}var ln=T.createContext();ln.Consumer;var sn=T.createContext(),fo=(sn.Consumer,new rn),ft=ho();function mo(){return l.useContext(ln)||fo}function bo(){return l.useContext(sn)||ft}var wo=(function(){function e(t,n){var o=this;this.inject=function(r,i){i===void 0&&(i=ft);var s=o.name+i.hash;r.hasNameForId(o.id,s)||r.insertRules(o.id,s,i(o.rules,s,"@keyframes"))},this.toString=function(){return De(12,String(o.name))},this.name=t,this.id="sc-keyframes-"+t,this.rules=n}return e.prototype.getName=function(t){return t===void 0&&(t=ft),this.name+t.hash},e})(),vo=/([A-Z])/,xo=/([A-Z])/g,Co=/^ms-/,yo=function(e){return"-"+e.toLowerCase()};function Gt(e){return vo.test(e)?e.replace(xo,yo).replace(Co,"-ms-"):e}var Vt=function(e){return e==null||e===!1||e===""};function Me(e,t,n,o){if(Array.isArray(e)){for(var r,i=[],s=0,c=e.length;s<c;s+=1)(r=Me(e[s],t,n,o))!==""&&(Array.isArray(r)?i.push.apply(i,r):i.push(r));return i}if(Vt(e))return"";if(wt(e))return"."+e.styledComponentId;if(Fe(e)){if(typeof(w=e)!="function"||w.prototype&&w.prototype.isReactComponent||!t)return e;var g=e(t);return Me(g,t,n,o)}var w;return e instanceof wo?n?(e.inject(n,o),e.getName(o)):e:pt(e)?(function b(v,_){var D,x,y=[];for(var m in v)v.hasOwnProperty(m)&&!Vt(v[m])&&(Array.isArray(v[m])&&v[m].isCss||Fe(v[m])?y.push(Gt(m)+":",v[m],";"):pt(v[m])?y.push.apply(y,b(v[m],m)):y.push(Gt(m)+": "+(D=m,(x=v[m])==null||typeof x=="boolean"||x===""?"":typeof x!="number"||x===0||D in Un||D.startsWith("--")?String(x).trim():x+"px")+";"));return _?[_+" {"].concat(y,["}"]):y})(e):e.toString()}var Yt=function(e){return Array.isArray(e)&&(e.isCss=!0),e};function re(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];return Fe(e)||pt(e)?Yt(Me(Nt(ot,[e].concat(n)))):n.length===0&&e.length===1&&typeof e[0]=="string"?e:Yt(Me(Nt(e,n)))}var So=function(e,t,n){return n===void 0&&(n=Ee),e.theme!==n.theme&&e.theme||t||n.theme},Ro=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,Eo=/(^-|-$)/g;function ct(e){return e.replace(Ro,"-").replace(Eo,"")}var $o=function(e){return ht(an(e)>>>0)};function Je(e){return typeof e=="string"&&!0}var mt=function(e){return typeof e=="function"||typeof e=="object"&&e!==null&&!Array.isArray(e)},Oo=function(e){return e!=="__proto__"&&e!=="constructor"&&e!=="prototype"};function ko(e,t,n){var o=e[n];mt(t)&&mt(o)?cn(o,t):e[n]=t}function cn(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];for(var r=0,i=n;r<i.length;r++){var s=i[r];if(mt(s))for(var c in s)Oo(c)&&ko(e,s[c],c)}return e}var at=T.createContext();at.Consumer;function Po(e){var t=l.useContext(at),n=l.useMemo((function(){return(function(o,r){if(!o)return De(14);if(Fe(o)){var i=o(r);return i}return Array.isArray(o)||typeof o!="object"?De(8):r?ve({},r,{},o):o})(e.theme,t)}),[e.theme,t]);return e.children?T.createElement(at.Provider,{value:n},e.children):null}var dt={};function dn(e,t,n){var o=wt(e),r=!Je(e),i=t.attrs,s=i===void 0?ot:i,c=t.componentId,g=c===void 0?(function(C,A){var P=typeof C!="string"?"sc":ct(C);dt[P]=(dt[P]||0)+1;var F=P+"-"+$o("5.3.11"+P+dt[P]);return A?A+"-"+F:F})(t.displayName,t.parentComponentId):c,w=t.displayName,b=w===void 0?(function(C){return Je(C)?"styled."+C:"Styled("+zt(C)+")"})(e):w,v=t.displayName&&t.componentId?ct(t.displayName)+"-"+t.componentId:t.componentId||g,_=o&&e.attrs?Array.prototype.concat(e.attrs,s).filter(Boolean):s,D=t.shouldForwardProp;o&&e.shouldForwardProp&&(D=t.shouldForwardProp?function(C,A,P){return e.shouldForwardProp(C,A,P)&&t.shouldForwardProp(C,A,P)}:e.shouldForwardProp);var x,y=new uo(n,v,o?e.componentStyle:void 0),m=y.isStatic&&s.length===0,k=function(C,A){return(function(P,F,X,G){var L=P.attrs,te=P.componentStyle,Z=P.defaultProps,ie=P.foldedComponentIds,Q=P.shouldForwardProp,B=P.styledComponentId,le=P.target,q=(function(E,a,N){E===void 0&&(E=Ee);var u=ve({},a,{theme:E}),Y={};return N.forEach((function(z){var j,S,K,ne=z;for(j in Fe(ne)&&(ne=ne(u)),ne)u[j]=Y[j]=j==="className"?(S=Y[j],K=ne[j],S&&K?S+" "+K:S||K):ne[j]})),[u,Y]})(So(F,l.useContext(at),Z)||Ee,F,L),ge=q[0],ae=q[1],se=(function(E,a,N,u){var Y=mo(),z=bo(),j=a?E.generateAndInjectStyles(Ee,Y,z):E.generateAndInjectStyles(N,Y,z);return j})(te,G,ge),xe=X,be=ae.$as||F.$as||ae.as||F.as||le,Ce=Je(be),f=ae!==F?ve({},F,{},ae):F,p={};for(var h in f)h[0]!=="$"&&h!=="as"&&(h==="forwardedAs"?p.as=f[h]:(Q?Q(h,Lt,be):!Ce||Lt(h))&&(p[h]=f[h]));return F.style&&ae.style!==F.style&&(p.style=ve({},F.style,{},ae.style)),p.className=Array.prototype.concat(ie,B,se!==B?se:null,F.className,ae.className).filter(Boolean).join(" "),p.ref=xe,l.createElement(be,p)})(x,C,A,m)};return k.displayName=b,(x=T.forwardRef(k)).attrs=_,x.componentStyle=y,x.displayName=b,x.shouldForwardProp=D,x.foldedComponentIds=o?Array.prototype.concat(e.foldedComponentIds,e.styledComponentId):ot,x.styledComponentId=v,x.target=o?e.target:e,x.withComponent=function(C){var A=t.componentId,P=(function(X,G){if(X==null)return{};var L,te,Z={},ie=Object.keys(X);for(te=0;te<ie.length;te++)L=ie[te],G.indexOf(L)>=0||(Z[L]=X[L]);return Z})(t,["componentId"]),F=A&&A+"-"+(Je(C)?C:ct(zt(C)));return dn(C,ve({},P,{attrs:_,componentId:F}),n)},Object.defineProperty(x,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(C){this._foldedDefaultProps=o?cn({},e.defaultProps,C):C}}),Object.defineProperty(x,"toString",{value:function(){return"."+x.styledComponentId}}),r&&Vn(x,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0,withComponent:!0}),x}var I=function(e){return(function t(n,o,r){if(r===void 0&&(r=Ee),!nn.isValidElementType(o))return De(1,String(o));var i=function(){return n(o,r,re.apply(void 0,arguments))};return i.withConfig=function(s){return t(n,o,ve({},r,{},s))},i.attrs=function(s){return t(n,o,ve({},r,{attrs:Array.prototype.concat(r.attrs,s).filter(Boolean)}))},i})(dn,e)};["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","textPath","tspan"].forEach((function(e){I[e]=I(e)}));var $e;function Ne(e,t){return e[t]}function Ao(e=[],t,n=0){return[...e.slice(0,n),t,...e.slice(n)]}function Do(e=[],t,n="id"){const o=e.slice(),r=Ne(t,n);return r?o.splice(o.findIndex((i=>Ne(i,n)===r)),1):o.splice(o.findIndex((i=>i===t)),1),o}function Ut(e){return e.map(((t,n)=>{const o=Object.assign(Object.assign({},t),{sortable:t.sortable||!!t.sortFunction||void 0});return t.id||(o.id=n+1),o}))}function Ue(e,t){return Math.ceil(e/t)}function ut(e,t){return Math.min(e,t)}(function(e){e.ASC="asc",e.DESC="desc"})($e||($e={}));const oe=()=>null;function un(e,t=[],n=[]){let o={},r=[...n];return t.length&&t.forEach((i=>{if(!i.when||typeof i.when!="function")throw new Error('"when" must be defined in the conditional style object and must be function');i.when(e)&&(o=i.style||{},i.classNames&&(r=[...r,...i.classNames]),typeof i.style=="function"&&(o=i.style(e)||{}))})),{conditionalStyle:o,classNames:r.join(" ")}}function nt(e,t=[],n="id"){const o=Ne(e,n);return o?t.some((r=>Ne(r,n)===o)):t.some((r=>r===e))}function qe(e,t){return t?e.findIndex((n=>Xe(n.id,t))):-1}function Xe(e,t){return e==t}function Io(e,t){const n=!e.toggleOnSelectedRowsChange;switch(t.type){case"SELECT_ALL_ROWS":{const{keyField:o,rows:r,rowCount:i,mergeSelections:s}=t,c=!e.allSelected,g=!e.toggleOnSelectedRowsChange;if(s){const w=c?[...e.selectedRows,...r.filter((b=>!nt(b,e.selectedRows,o)))]:e.selectedRows.filter((b=>!nt(b,r,o)));return Object.assign(Object.assign({},e),{allSelected:c,selectedCount:w.length,selectedRows:w,toggleOnSelectedRowsChange:g})}return Object.assign(Object.assign({},e),{allSelected:c,selectedCount:c?i:0,selectedRows:c?r:[],toggleOnSelectedRowsChange:g})}case"SELECT_SINGLE_ROW":{const{keyField:o,row:r,isSelected:i,rowCount:s,singleSelect:c}=t;return c?i?Object.assign(Object.assign({},e),{selectedCount:0,allSelected:!1,selectedRows:[],toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:1,allSelected:!1,selectedRows:[r],toggleOnSelectedRowsChange:n}):i?Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length>0?e.selectedRows.length-1:0,allSelected:!1,selectedRows:Do(e.selectedRows,r,o),toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length+1,allSelected:e.selectedRows.length+1===s,selectedRows:Ao(e.selectedRows,r),toggleOnSelectedRowsChange:n})}case"SELECT_MULTIPLE_ROWS":{const{keyField:o,selectedRows:r,totalRows:i,mergeSelections:s}=t;if(s){const c=[...e.selectedRows,...r.filter((g=>!nt(g,e.selectedRows,o)))];return Object.assign(Object.assign({},e),{selectedCount:c.length,allSelected:!1,selectedRows:c,toggleOnSelectedRowsChange:n})}return Object.assign(Object.assign({},e),{selectedCount:r.length,allSelected:r.length===i,selectedRows:r,toggleOnSelectedRowsChange:n})}case"CLEAR_SELECTED_ROWS":{const{selectedRowsFlag:o}=t;return Object.assign(Object.assign({},e),{allSelected:!1,selectedCount:0,selectedRows:[],selectedRowsFlag:o})}case"SORT_CHANGE":{const{sortDirection:o,selectedColumn:r,clearSelectedOnSort:i}=t;return Object.assign(Object.assign(Object.assign({},e),{selectedColumn:r,sortDirection:o,currentPage:1}),i&&{allSelected:!1,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case"CHANGE_PAGE":{const{page:o,paginationServer:r,visibleOnly:i,persistSelectedOnPageChange:s}=t,c=r&&s,g=r&&!s||i;return Object.assign(Object.assign(Object.assign(Object.assign({},e),{currentPage:o}),c&&{allSelected:!1}),g&&{allSelected:!1,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case"CHANGE_ROWS_PER_PAGE":{const{rowsPerPage:o,page:r}=t;return Object.assign(Object.assign({},e),{currentPage:r,rowsPerPage:o})}}}const jo=re`
	pointer-events: none;
	opacity: 0.4;
`,_o=I.div`
	position: relative;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	max-width: 100%;
	${({disabled:e})=>e&&jo};
	${({theme:e})=>e.table.style};
`,Ho=re`
	position: sticky;
	position: -webkit-sticky; /* Safari */
	top: 0;
	z-index: 1;
`,To=I.div`
	display: flex;
	width: 100%;
	${({$fixedHeader:e})=>e&&Ho};
	${({theme:e})=>e.head.style};
`,Fo=I.div`
	display: flex;
	align-items: stretch;
	width: 100%;
	${({theme:e})=>e.headRow.style};
	${({$dense:e,theme:t})=>e&&t.headRow.denseStyle};
`,gn=(e,...t)=>re`
		@media screen and (max-width: ${599}px) {
			${re(e,...t)}
		}
	`,Lo=(e,...t)=>re`
		@media screen and (max-width: ${959}px) {
			${re(e,...t)}
		}
	`,Mo=(e,...t)=>re`
		@media screen and (max-width: ${1280}px) {
			${re(e,...t)}
		}
	`,No=e=>(t,...n)=>re`
			@media screen and (max-width: ${e}px) {
				${re(t,...n)}
			}
		`,We=I.div`
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	line-height: normal;
	${({theme:e,$headCell:t})=>e[t?"headCells":"cells"].style};
	${({$noPadding:e})=>e&&"padding: 0"};
`,pn=I(We)`
	flex-grow: ${({button:e,grow:t})=>t===0||e?0:t||1};
	flex-shrink: 0;
	flex-basis: 0;
	max-width: ${({maxWidth:e})=>e||"100%"};
	min-width: ${({minWidth:e})=>e||"100px"};
	${({width:e})=>e&&re`
			min-width: ${e};
			max-width: ${e};
		`};
	${({right:e})=>e&&"justify-content: flex-end"};
	${({button:e,center:t})=>(t||e)&&"justify-content: center"};
	${({compact:e,button:t})=>(e||t)&&"padding: 0"};

	/* handle hiding cells */
	${({hide:e})=>e&&e==="sm"&&gn`
    display: none;
  `};
	${({hide:e})=>e&&e==="md"&&Lo`
    display: none;
  `};
	${({hide:e})=>e&&e==="lg"&&Mo`
    display: none;
  `};
	${({hide:e})=>e&&Number.isInteger(e)&&No(e)`
    display: none;
  `};
`,zo=re`
	div:first-child {
		white-space: ${({$wrapCell:e})=>e?"normal":"nowrap"};
		overflow: ${({$allowOverflow:e})=>e?"visible":"hidden"};
		text-overflow: ellipsis;
	}
`,Wo=I(pn).attrs((e=>({style:e.style})))`
	${({$renderAsCell:e})=>!e&&zo};
	${({theme:e,$isDragging:t})=>t&&e.cells.draggingStyle};
	${({$cellStyle:e})=>e};
`;var Bo=l.memo((function({id:e,column:t,row:n,rowIndex:o,dataTag:r,isDragging:i,onDragStart:s,onDragOver:c,onDragEnd:g,onDragEnter:w,onDragLeave:b}){const{conditionalStyle:v,classNames:_}=un(n,t.conditionalCellStyles,["rdt_TableCell"]);return l.createElement(Wo,{id:e,"data-column-id":t.id,role:"cell",className:_,"data-tag":r,$cellStyle:t.style,$renderAsCell:!!t.cell,$allowOverflow:t.allowOverflow,button:t.button,center:t.center,compact:t.compact,grow:t.grow,hide:t.hide,maxWidth:t.maxWidth,minWidth:t.minWidth,right:t.right,width:t.width,$wrapCell:t.wrap,style:v,$isDragging:i,onDragStart:s,onDragOver:c,onDragEnd:g,onDragEnter:w,onDragLeave:b},!t.cell&&l.createElement("div",{"data-tag":r},(function(D,x,y,m){return x?y&&typeof y=="function"?y(D,m):x(D,m):null})(n,t.selector,t.format,o)),t.cell&&t.cell(n,o,t,e))}));const Xt="input";var hn=l.memo((function({name:e,component:t=Xt,componentOptions:n={style:{}},indeterminate:o=!1,checked:r=!1,disabled:i=!1,onClick:s=oe}){const c=t,g=c!==Xt?n.style:(b=>Object.assign(Object.assign({fontSize:"18px"},!b&&{cursor:"pointer"}),{padding:0,marginTop:"1px",verticalAlign:"middle",position:"relative"}))(i),w=l.useMemo((()=>(function(b,...v){let _;return Object.keys(b).map((D=>b[D])).forEach(((D,x)=>{typeof D=="function"&&(_=Object.assign(Object.assign({},b),{[Object.keys(b)[x]]:D(...v)}))})),_||b})(n,o)),[n,o]);return l.createElement(c,Object.assign({type:"checkbox",ref:b=>{b&&(b.indeterminate=o)},style:g,onClick:i?oe:s,name:e,"aria-label":e,checked:r,disabled:i},w,{onChange:oe}))}));const Go=I(We)`
	flex: 0 0 48px;
	min-width: 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
`;function Vo({name:e,keyField:t,row:n,rowCount:o,selected:r,selectableRowsComponent:i,selectableRowsComponentProps:s,selectableRowsSingle:c,selectableRowDisabled:g,onSelectedRow:w}){const b=!(!g||!g(n));return l.createElement(Go,{onClick:v=>v.stopPropagation(),className:"rdt_TableCell",$noPadding:!0},l.createElement(hn,{name:e,component:i,componentOptions:s,checked:r,"aria-checked":r,onClick:()=>{w({type:"SELECT_SINGLE_ROW",row:n,isSelected:r,keyField:t,rowCount:o,singleSelect:c})},disabled:b}))}const Yo=I.button`
	display: inline-flex;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	border: none;
	background-color: transparent;
	${({theme:e})=>e.expanderButton.style};
`;function Uo({disabled:e=!1,expanded:t=!1,expandableIcon:n,id:o,row:r,onToggled:i}){const s=t?n.expanded:n.collapsed;return l.createElement(Yo,{"aria-disabled":e,onClick:()=>i&&i(r),"data-testid":`expander-button-${o}`,disabled:e,"aria-label":t?"Collapse Row":"Expand Row",role:"button",type:"button"},s)}const Xo=I(We)`
	white-space: nowrap;
	font-weight: 400;
	min-width: 48px;
	${({theme:e})=>e.expanderCell.style};
`;function Zo({row:e,expanded:t=!1,expandableIcon:n,id:o,onToggled:r,disabled:i=!1}){return l.createElement(Xo,{onClick:s=>s.stopPropagation(),$noPadding:!0},l.createElement(Uo,{id:o,row:e,expanded:t,expandableIcon:n,disabled:i,onToggled:r}))}const Qo=I.div`
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.expanderRow.style};
	${({$extendedRowStyle:e})=>e};
`;var Ko=l.memo((function({data:e,ExpanderComponent:t,expanderComponentProps:n,extendedRowStyle:o,extendedClassNames:r}){const i=["rdt_ExpanderRow",...r.split(" ").filter((s=>s!=="rdt_TableRow"))].join(" ");return l.createElement(Qo,{className:i,$extendedRowStyle:o},l.createElement(t,Object.assign({data:e},n)))}));const gt="allowRowEvents";var it,bt,Zt;(function(e){e.LTR="ltr",e.RTL="rtl",e.AUTO="auto"})(it||(it={})),(function(e){e.LEFT="left",e.RIGHT="right",e.CENTER="center"})(bt||(bt={})),(function(e){e.SM="sm",e.MD="md",e.LG="lg"})(Zt||(Zt={}));const Jo=re`
	&:hover {
		${({$highlightOnHover:e,theme:t})=>e&&t.rows.highlightOnHoverStyle};
	}
`,qo=re`
	&:hover {
		cursor: pointer;
	}
`,er=I.div.attrs((e=>({style:e.style})))`
	display: flex;
	align-items: stretch;
	align-content: stretch;
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.rows.style};
	${({$dense:e,theme:t})=>e&&t.rows.denseStyle};
	${({$striped:e,theme:t})=>e&&t.rows.stripedStyle};
	${({$highlightOnHover:e})=>e&&Jo};
	${({$pointerOnHover:e})=>e&&qo};
	${({$selected:e,theme:t})=>e&&t.rows.selectedHighlightStyle};
	${({$conditionalStyle:e})=>e};
`;function tr({columns:e=[],conditionalRowStyles:t=[],defaultExpanded:n=!1,defaultExpanderDisabled:o=!1,dense:r=!1,expandableIcon:i,expandableRows:s=!1,expandableRowsComponent:c,expandableRowsComponentProps:g,expandableRowsHideExpander:w,expandOnRowClicked:b=!1,expandOnRowDoubleClicked:v=!1,highlightOnHover:_=!1,id:D,expandableInheritConditionalStyles:x,keyField:y,onRowClicked:m=oe,onRowDoubleClicked:k=oe,onRowMouseEnter:C=oe,onRowMouseLeave:A=oe,onRowExpandToggled:P=oe,onSelectedRow:F=oe,pointerOnHover:X=!1,row:G,rowCount:L,rowIndex:te,selectableRowDisabled:Z=null,selectableRows:ie=!1,selectableRowsComponent:Q,selectableRowsComponentProps:B,selectableRowsHighlight:le=!1,selectableRowsSingle:q=!1,selected:ge,striped:ae=!1,draggingColumnId:se,onDragStart:xe,onDragOver:be,onDragEnd:Ce,onDragEnter:f,onDragLeave:p}){const[h,E]=l.useState(n);l.useEffect((()=>{E(n)}),[n]);const a=l.useCallback((()=>{E(!h),P(!h,G)}),[h,P,G]),N=X||s&&(b||v),u=l.useCallback((H=>{H.target.getAttribute("data-tag")===gt&&(m(G,H),!o&&s&&b&&a())}),[o,b,s,a,m,G]),Y=l.useCallback((H=>{H.target.getAttribute("data-tag")===gt&&(k(G,H),!o&&s&&v&&a())}),[o,v,s,a,k,G]),z=l.useCallback((H=>{C(G,H)}),[C,G]),j=l.useCallback((H=>{A(G,H)}),[A,G]),S=Ne(G,y),{conditionalStyle:K,classNames:ne}=un(G,t,["rdt_TableRow"]),M=le&&ge,ee=x?K:{},W=ae&&te%2==0;return l.createElement(l.Fragment,null,l.createElement(er,{id:`row-${D}`,role:"row",$striped:W,$highlightOnHover:_,$pointerOnHover:!o&&N,$dense:r,onClick:u,onDoubleClick:Y,onMouseEnter:z,onMouseLeave:j,className:ne,$selected:M,$conditionalStyle:K},ie&&l.createElement(Vo,{name:`select-row-${S}`,keyField:y,row:G,rowCount:L,selected:ge,selectableRowsComponent:Q,selectableRowsComponentProps:B,selectableRowDisabled:Z,selectableRowsSingle:q,onSelectedRow:F}),s&&!w&&l.createElement(Zo,{id:S,expandableIcon:i,expanded:h,row:G,onToggled:a,disabled:o}),e.map((H=>H.omit?null:l.createElement(Bo,{id:`cell-${H.id}-${S}`,key:`cell-${H.id}-${S}`,dataTag:H.ignoreRowClick||H.button?null:gt,column:H,row:G,rowIndex:te,isDragging:Xe(se,H.id),onDragStart:xe,onDragOver:be,onDragEnd:Ce,onDragEnter:f,onDragLeave:p})))),s&&h&&l.createElement(Ko,{key:`expander-${S}`,data:G,extendedRowStyle:ee,extendedClassNames:ne,ExpanderComponent:c,expanderComponentProps:g}))}const nr=I.span`
	padding: 2px;
	color: inherit;
	flex-grow: 0;
	flex-shrink: 0;
	${({$sortActive:e})=>e?"opacity: 1":"opacity: 0"};
	${({$sortDirection:e})=>e==="desc"&&"transform: rotate(180deg)"};
`,or=({sortActive:e,sortDirection:t})=>T.createElement(nr,{$sortActive:e,$sortDirection:t},"▲"),rr=I(pn)`
	${({button:e})=>e&&"text-align: center"};
	${({theme:e,$isDragging:t})=>t&&e.headCells.draggingStyle};
`,ar=re`
	cursor: pointer;
	span.__rdt_custom_sort_icon__ {
		i,
		svg {
			transform: 'translate3d(0, 0, 0)';
			${({$sortActive:e})=>e?"opacity: 1":"opacity: 0"};
			color: inherit;
			font-size: 18px;
			height: 18px;
			width: 18px;
			backface-visibility: hidden;
			transform-style: preserve-3d;
			transition-duration: 95ms;
			transition-property: transform;
		}

		&.asc i,
		&.asc svg {
			transform: rotate(180deg);
		}
	}

	${({$sortActive:e})=>!e&&re`
			&:hover,
			&:focus {
				opacity: 0.7;

				span,
				span.__rdt_custom_sort_icon__ * {
					opacity: 0.7;
				}
			}
		`};
`,ir=I.div`
	display: inline-flex;
	align-items: center;
	justify-content: inherit;
	height: 100%;
	width: 100%;
	outline: none;
	user-select: none;
	overflow: hidden;
	${({disabled:e})=>!e&&ar};
`,lr=I.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;var sr=l.memo((function({column:e,disabled:t,draggingColumnId:n,selectedColumn:o={},sortDirection:r,sortIcon:i,sortServer:s,pagination:c,paginationServer:g,persistSelectedOnSort:w,selectableRowsVisibleOnly:b,onSort:v,onDragStart:_,onDragOver:D,onDragEnd:x,onDragEnter:y,onDragLeave:m}){l.useEffect((()=>{typeof e.selector=="string"&&console.error(`Warning: ${e.selector} is a string based column selector which has been deprecated as of v7 and will be removed in v8. Instead, use a selector function e.g. row => row[field]...`)}),[]);const[k,C]=l.useState(!1),A=l.useRef(null);if(l.useEffect((()=>{A.current&&C(A.current.scrollWidth>A.current.clientWidth)}),[k]),e.omit)return null;const P=()=>{if(!e.sortable&&!e.selector)return;let B=r;Xe(o.id,e.id)&&(B=r===$e.ASC?$e.DESC:$e.ASC),v({type:"SORT_CHANGE",sortDirection:B,selectedColumn:e,clearSelectedOnSort:c&&g&&!w||s||b})},F=B=>l.createElement(or,{sortActive:B,sortDirection:r}),X=()=>l.createElement("span",{className:[r,"__rdt_custom_sort_icon__"].join(" ")},i),G=!(!e.sortable||!Xe(o.id,e.id)),L=!e.sortable||t,te=e.sortable&&!i&&!e.right,Z=e.sortable&&!i&&e.right,ie=e.sortable&&i&&!e.right,Q=e.sortable&&i&&e.right;return l.createElement(rr,{"data-column-id":e.id,className:"rdt_TableCol",$headCell:!0,allowOverflow:e.allowOverflow,button:e.button,compact:e.compact,grow:e.grow,hide:e.hide,maxWidth:e.maxWidth,minWidth:e.minWidth,right:e.right,center:e.center,width:e.width,draggable:e.reorder,$isDragging:Xe(e.id,n),onDragStart:_,onDragOver:D,onDragEnd:x,onDragEnter:y,onDragLeave:m},e.name&&l.createElement(ir,{"data-column-id":e.id,"data-sort-id":e.id,role:"columnheader",tabIndex:0,className:"rdt_TableCol_Sortable",onClick:L?void 0:P,onKeyPress:L?void 0:B=>{B.key==="Enter"&&P()},$sortActive:!L&&G,disabled:L},!L&&Q&&X(),!L&&Z&&F(G),typeof e.name=="string"?l.createElement(lr,{title:k?e.name:void 0,ref:A,"data-column-id":e.id},e.name):e.name,!L&&ie&&X(),!L&&te&&F(G)))}));const cr=I(We)`
	flex: 0 0 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	font-size: unset;
`;function dr({headCell:e=!0,rowData:t,keyField:n,allSelected:o,mergeSelections:r,selectedRows:i,selectableRowsComponent:s,selectableRowsComponentProps:c,selectableRowDisabled:g,onSelectAllRows:w}){const b=i.length>0&&!o,v=g?t.filter((x=>!g(x))):t,_=v.length===0,D=Math.min(t.length,v.length);return l.createElement(cr,{className:"rdt_TableCol",$headCell:e,$noPadding:!0},l.createElement(hn,{name:"select-all-rows",component:s,componentOptions:c,onClick:()=>{w({type:"SELECT_ALL_ROWS",rows:v,rowCount:D,mergeSelections:r,keyField:n})},checked:o,indeterminate:b,disabled:_}))}function fn(e=it.AUTO){const t=typeof window=="object",[n,o]=l.useState(!1);return l.useEffect((()=>{if(t)if(e!=="auto")o(e==="rtl");else{const r=!(!window.document||!window.document.createElement),i=document.getElementsByTagName("BODY")[0],s=document.getElementsByTagName("HTML")[0],c=i.dir==="rtl"||s.dir==="rtl";o(r&&c)}}),[e,t]),n}const ur=I.div`
	display: flex;
	align-items: center;
	flex: 1 0 auto;
	height: 100%;
	color: ${({theme:e})=>e.contextMenu.fontColor};
	font-size: ${({theme:e})=>e.contextMenu.fontSize};
	font-weight: 400;
`,gr=I.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-wrap: wrap;
`,Qt=I.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	box-sizing: inherit;
	z-index: 1;
	align-items: center;
	justify-content: space-between;
	display: flex;
	${({$rtl:e})=>e&&"direction: rtl"};
	${({theme:e})=>e.contextMenu.style};
	${({theme:e,$visible:t})=>t&&e.contextMenu.activeStyle};
`;function pr({contextMessage:e,contextActions:t,contextComponent:n,selectedCount:o,direction:r}){const i=fn(r),s=o>0;return n?l.createElement(Qt,{$visible:s},l.cloneElement(n,{selectedCount:o})):l.createElement(Qt,{$visible:s,$rtl:i},l.createElement(ur,null,((c,g,w)=>{if(g===0)return null;const b=g===1?c.singular:c.plural;return w?`${g} ${c.message||""} ${b}`:`${g} ${b} ${c.message||""}`})(e,o,i)),l.createElement(gr,null,t))}const hr=I.div`
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex: 1 1 auto;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	flex-wrap: wrap;
	${({theme:e})=>e.header.style}
`,fr=I.div`
	flex: 1 0 auto;
	color: ${({theme:e})=>e.header.fontColor};
	font-size: ${({theme:e})=>e.header.fontSize};
	font-weight: 400;
`,mr=I.div`
	flex: 1 0 auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	> * {
		margin-left: 5px;
	}
`,br=({title:e,actions:t=null,contextMessage:n,contextActions:o,contextComponent:r,selectedCount:i,direction:s,showMenu:c=!0})=>l.createElement(hr,{className:"rdt_TableHeader",role:"heading","aria-level":1},l.createElement(fr,null,e),t&&l.createElement(mr,null,t),c&&l.createElement(pr,{contextMessage:n,contextActions:o,contextComponent:r,direction:s,selectedCount:i}));function mn(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function"){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n}const wr={left:"flex-start",right:"flex-end",center:"center"},vr=I.header`
	position: relative;
	display: flex;
	flex: 1 1 auto;
	box-sizing: border-box;
	align-items: center;
	padding: 4px 16px 4px 24px;
	width: 100%;
	justify-content: ${({align:e})=>wr[e]};
	flex-wrap: ${({$wrapContent:e})=>e?"wrap":"nowrap"};
	${({theme:e})=>e.subHeader.style}
`,xr=e=>{var{align:t="right",wrapContent:n=!0}=e,o=mn(e,["align","wrapContent"]);return l.createElement(vr,Object.assign({align:t,$wrapContent:n},o))},Cr=I.div`
	display: flex;
	flex-direction: column;
`,yr=I.div`
	position: relative;
	width: 100%;
	border-radius: inherit;
	${({$responsive:e,$fixedHeader:t})=>e&&re`
			overflow-x: auto;

			// hidden prevents vertical scrolling in firefox when fixedHeader is disabled
			overflow-y: ${t?"auto":"hidden"};
			min-height: 0;
		`};

	${({$fixedHeader:e=!1,$fixedHeaderScrollHeight:t="100vh"})=>e&&re`
			max-height: ${t};
			-webkit-overflow-scrolling: touch;
		`};

	${({theme:e})=>e.responsiveWrapper.style};
`,Kt=I.div`
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${e=>e.theme.progress.style};
`,Sr=I.div`
	position: relative;
	width: 100%;
	${({theme:e})=>e.tableWrapper.style};
`,Rr=I(We)`
	white-space: nowrap;
	${({theme:e})=>e.expanderCell.style};
`,Er=I.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${({theme:e})=>e.noData.style};
`,$r=()=>T.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},T.createElement("path",{d:"M7 10l5 5 5-5z"}),T.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),Or=I.select`
	cursor: pointer;
	height: 24px;
	max-width: 100%;
	user-select: none;
	padding-left: 8px;
	padding-right: 24px;
	box-sizing: content-box;
	font-size: inherit;
	color: inherit;
	border: none;
	background-color: transparent;
	appearance: none;
	direction: ltr;
	flex-shrink: 0;

	&::-ms-expand {
		display: none;
	}

	&:disabled::-ms-expand {
		background: #f60;
	}

	option {
		color: initial;
	}
`,kr=I.div`
	position: relative;
	flex-shrink: 0;
	font-size: inherit;
	color: inherit;
	margin-top: 1px;

	svg {
		top: 0;
		right: 0;
		color: inherit;
		position: absolute;
		fill: currentColor;
		width: 24px;
		height: 24px;
		display: inline-block;
		user-select: none;
		pointer-events: none;
	}
`,Pr=e=>{var{defaultValue:t,onChange:n}=e,o=mn(e,["defaultValue","onChange"]);return l.createElement(kr,null,l.createElement(Or,Object.assign({onChange:n,defaultValue:t},o)),l.createElement($r,null))},d={columns:[],data:[],title:"",keyField:"id",selectableRows:!1,selectableRowsHighlight:!1,selectableRowsNoSelectAll:!1,selectableRowSelected:null,selectableRowDisabled:null,selectableRowsComponent:"input",selectableRowsComponentProps:{},selectableRowsVisibleOnly:!1,selectableRowsSingle:!1,clearSelectedRows:!1,expandableRows:!1,expandableRowDisabled:null,expandableRowExpanded:null,expandOnRowClicked:!1,expandableRowsHideExpander:!1,expandOnRowDoubleClicked:!1,expandableInheritConditionalStyles:!1,expandableRowsComponent:function(){return T.createElement("div",null,"To add an expander pass in a component instance via ",T.createElement("strong",null,"expandableRowsComponent"),". You can then access props.data from this component.")},expandableIcon:{collapsed:T.createElement((()=>T.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},T.createElement("path",{d:"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"}),T.createElement("path",{d:"M0-.25h24v24H0z",fill:"none"}))),null),expanded:T.createElement((()=>T.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},T.createElement("path",{d:"M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"}),T.createElement("path",{d:"M0-.75h24v24H0z",fill:"none"}))),null)},expandableRowsComponentProps:{},progressPending:!1,progressComponent:T.createElement("div",{style:{fontSize:"24px",fontWeight:700,padding:"24px"}},"Loading..."),persistTableHead:!1,sortIcon:null,sortFunction:null,sortServer:!1,striped:!1,highlightOnHover:!1,pointerOnHover:!1,noContextMenu:!1,contextMessage:{singular:"item",plural:"items",message:"selected"},actions:null,contextActions:null,contextComponent:null,defaultSortFieldId:null,defaultSortAsc:!0,responsive:!0,noDataComponent:T.createElement("div",{style:{padding:"24px"}},"There are no records to display"),disabled:!1,noTableHead:!1,noHeader:!1,subHeader:!1,subHeaderAlign:bt.RIGHT,subHeaderWrap:!0,subHeaderComponent:null,fixedHeader:!1,fixedHeaderScrollHeight:"100vh",pagination:!1,paginationServer:!1,paginationServerOptions:{persistSelectedOnSort:!1,persistSelectedOnPageChange:!1},paginationDefaultPage:1,paginationResetDefaultPage:!1,paginationTotalRows:0,paginationPerPage:10,paginationRowsPerPageOptions:[10,15,20,25,30],paginationComponent:null,paginationComponentOptions:{},paginationIconFirstPage:T.createElement((()=>T.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},T.createElement("path",{d:"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"}),T.createElement("path",{fill:"none",d:"M24 24H0V0h24v24z"}))),null),paginationIconLastPage:T.createElement((()=>T.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},T.createElement("path",{d:"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"}),T.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}))),null),paginationIconNext:T.createElement((()=>T.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},T.createElement("path",{d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}),T.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}))),null),paginationIconPrevious:T.createElement((()=>T.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},T.createElement("path",{d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"}),T.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}))),null),dense:!1,conditionalRowStyles:[],theme:"default",customStyles:{},direction:it.AUTO,onChangePage:oe,onChangeRowsPerPage:oe,onRowClicked:oe,onRowDoubleClicked:oe,onRowMouseEnter:oe,onRowMouseLeave:oe,onRowExpandToggled:oe,onSelectedRowsChange:oe,onSort:oe,onColumnOrderChange:oe},Ar={rowsPerPageText:"Rows per page:",rangeSeparatorText:"of",noRowsPerPage:!1,selectAllRowsItem:!1,selectAllRowsItemText:"All"},Dr=I.nav`
	display: flex;
	flex: 1 1 auto;
	justify-content: flex-end;
	align-items: center;
	box-sizing: border-box;
	padding-right: 8px;
	padding-left: 8px;
	width: 100%;
	${({theme:e})=>e.pagination.style};
`,et=I.button`
	position: relative;
	display: block;
	user-select: none;
	border: none;
	${({theme:e})=>e.pagination.pageButtonsStyle};
	${({$isRTL:e})=>e&&"transform: scale(-1, -1)"};
`,Ir=I.div`
	display: flex;
	align-items: center;
	border-radius: 4px;
	white-space: nowrap;
	${gn`
    width: 100%;
    justify-content: space-around;
  `};
`,bn=I.span`
	flex-shrink: 1;
	user-select: none;
`,jr=I(bn)`
	margin: 0 24px;
`,_r=I(bn)`
	margin: 0 4px;
`;var Hr=l.memo((function({rowsPerPage:e,rowCount:t,currentPage:n,direction:o=d.direction,paginationRowsPerPageOptions:r=d.paginationRowsPerPageOptions,paginationIconLastPage:i=d.paginationIconLastPage,paginationIconFirstPage:s=d.paginationIconFirstPage,paginationIconNext:c=d.paginationIconNext,paginationIconPrevious:g=d.paginationIconPrevious,paginationComponentOptions:w=d.paginationComponentOptions,onChangeRowsPerPage:b=d.onChangeRowsPerPage,onChangePage:v=d.onChangePage}){const _=(()=>{const B=typeof window=="object";function le(){return{width:B?window.innerWidth:void 0,height:B?window.innerHeight:void 0}}const[q,ge]=l.useState(le);return l.useEffect((()=>{if(!B)return()=>null;function ae(){ge(le())}return window.addEventListener("resize",ae),()=>window.removeEventListener("resize",ae)}),[]),q})(),D=fn(o),x=_.width&&_.width>599,y=Ue(t,e),m=n*e,k=m-e+1,C=n===1,A=n===y,P=Object.assign(Object.assign({},Ar),w),F=n===y?`${k}-${t} ${P.rangeSeparatorText} ${t}`:`${k}-${m} ${P.rangeSeparatorText} ${t}`,X=l.useCallback((()=>v(n-1)),[n,v]),G=l.useCallback((()=>v(n+1)),[n,v]),L=l.useCallback((()=>v(1)),[v]),te=l.useCallback((()=>v(Ue(t,e))),[v,t,e]),Z=l.useCallback((B=>b(Number(B.target.value),n)),[n,b]),ie=r.map((B=>l.createElement("option",{key:B,value:B},B)));P.selectAllRowsItem&&ie.push(l.createElement("option",{key:-1,value:t},P.selectAllRowsItemText));const Q=l.createElement(Pr,{onChange:Z,defaultValue:e,"aria-label":P.rowsPerPageText},ie);return l.createElement(Dr,{className:"rdt_Pagination"},!P.noRowsPerPage&&x&&l.createElement(l.Fragment,null,l.createElement(_r,null,P.rowsPerPageText),Q),x&&l.createElement(jr,null,F),l.createElement(Ir,null,l.createElement(et,{id:"pagination-first-page",type:"button","aria-label":"First Page","aria-disabled":C,onClick:L,disabled:C,$isRTL:D},s),l.createElement(et,{id:"pagination-previous-page",type:"button","aria-label":"Previous Page","aria-disabled":C,onClick:X,disabled:C,$isRTL:D},g),!P.noRowsPerPage&&!x&&Q,l.createElement(et,{id:"pagination-next-page",type:"button","aria-label":"Next Page","aria-disabled":A,onClick:G,disabled:A,$isRTL:D},c),l.createElement(et,{id:"pagination-last-page",type:"button","aria-label":"Last Page","aria-disabled":A,onClick:te,disabled:A,$isRTL:D},i)))}));const Ae=(e,t)=>{const n=l.useRef(!0);l.useEffect((()=>{n.current?n.current=!1:e()}),t)};function Tr(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Fr=function(e){return(function(t){return!!t&&typeof t=="object"})(e)&&!(function(t){var n=Object.prototype.toString.call(t);return n==="[object RegExp]"||n==="[object Date]"||(function(o){return o.$$typeof===Lr})(t)})(e)},Lr=typeof Symbol=="function"&&Symbol.for?Symbol.for("react.element"):60103;function Ze(e,t){return t.clone!==!1&&t.isMergeableObject(e)?ze((n=e,Array.isArray(n)?[]:{}),e,t):e;var n}function Mr(e,t,n){return e.concat(t).map((function(o){return Ze(o,n)}))}function Jt(e){return Object.keys(e).concat((function(t){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t).filter((function(n){return Object.propertyIsEnumerable.call(t,n)})):[]})(e))}function qt(e,t){try{return t in e}catch{return!1}}function Nr(e,t,n){var o={};return n.isMergeableObject(e)&&Jt(e).forEach((function(r){o[r]=Ze(e[r],n)})),Jt(t).forEach((function(r){(function(i,s){return qt(i,s)&&!(Object.hasOwnProperty.call(i,s)&&Object.propertyIsEnumerable.call(i,s))})(e,r)||(qt(e,r)&&n.isMergeableObject(t[r])?o[r]=(function(i,s){if(!s.customMerge)return ze;var c=s.customMerge(i);return typeof c=="function"?c:ze})(r,n)(e[r],t[r],n):o[r]=Ze(t[r],n))})),o}function ze(e,t,n){(n=n||{}).arrayMerge=n.arrayMerge||Mr,n.isMergeableObject=n.isMergeableObject||Fr,n.cloneUnlessOtherwiseSpecified=Ze;var o=Array.isArray(t);return o===Array.isArray(e)?o?n.arrayMerge(e,t,n):Nr(e,t,n):Ze(t,n)}ze.all=function(e,t){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce((function(n,o){return ze(n,o,t)}),{})};var zr=Tr(ze);const en={text:{primary:"rgba(0, 0, 0, 0.87)",secondary:"rgba(0, 0, 0, 0.54)",disabled:"rgba(0, 0, 0, 0.38)"},background:{default:"#FFFFFF"},context:{background:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},divider:{default:"rgba(0,0,0,.12)"},button:{default:"rgba(0,0,0,.54)",focus:"rgba(0,0,0,.12)",hover:"rgba(0,0,0,.12)",disabled:"rgba(0, 0, 0, .18)"},selected:{default:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},highlightOnHover:{default:"#EEEEEE",text:"rgba(0, 0, 0, 0.87)"},striped:{default:"#FAFAFA",text:"rgba(0, 0, 0, 0.87)"}},tn={default:en,light:en,dark:{text:{primary:"#FFFFFF",secondary:"rgba(255, 255, 255, 0.7)",disabled:"rgba(0,0,0,.12)"},background:{default:"#424242"},context:{background:"#E91E63",text:"#FFFFFF"},divider:{default:"rgba(81, 81, 81, 1)"},button:{default:"#FFFFFF",focus:"rgba(255, 255, 255, .54)",hover:"rgba(255, 255, 255, .12)",disabled:"rgba(255, 255, 255, .18)"},selected:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},highlightOnHover:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},striped:{default:"rgba(0, 0, 0, .87)",text:"#FFFFFF"}}};function Wr(e,t,n,o){const[r,i]=l.useState((()=>Ut(e))),[s,c]=l.useState(""),g=l.useRef("");Ae((()=>{i(Ut(e))}),[e]);const w=l.useCallback((m=>{var k,C,A;const{attributes:P}=m.target,F=(k=P.getNamedItem("data-column-id"))===null||k===void 0?void 0:k.value;F&&(g.current=((A=(C=r[qe(r,F)])===null||C===void 0?void 0:C.id)===null||A===void 0?void 0:A.toString())||"",c(g.current))}),[r]),b=l.useCallback((m=>{var k;const{attributes:C}=m.target,A=(k=C.getNamedItem("data-column-id"))===null||k===void 0?void 0:k.value;if(A&&g.current&&A!==g.current){const P=qe(r,g.current),F=qe(r,A),X=[...r];X[P]=r[F],X[F]=r[P],i(X),t(X)}}),[t,r]),v=l.useCallback((m=>{m.preventDefault()}),[]),_=l.useCallback((m=>{m.preventDefault()}),[]),D=l.useCallback((m=>{m.preventDefault(),g.current="",c("")}),[]),x=(function(m=!1){return m?$e.ASC:$e.DESC})(o),y=l.useMemo((()=>r[qe(r,n==null?void 0:n.toString())]||{}),[n,r]);return{tableColumns:r,draggingColumnId:s,handleDragStart:w,handleDragEnter:b,handleDragOver:v,handleDragLeave:_,handleDragEnd:D,defaultSortDirection:x,defaultSortColumn:y}}var Vr=l.memo((function(e){const{data:t=d.data,columns:n=d.columns,title:o=d.title,actions:r=d.actions,keyField:i=d.keyField,striped:s=d.striped,highlightOnHover:c=d.highlightOnHover,pointerOnHover:g=d.pointerOnHover,dense:w=d.dense,selectableRows:b=d.selectableRows,selectableRowsSingle:v=d.selectableRowsSingle,selectableRowsHighlight:_=d.selectableRowsHighlight,selectableRowsNoSelectAll:D=d.selectableRowsNoSelectAll,selectableRowsVisibleOnly:x=d.selectableRowsVisibleOnly,selectableRowSelected:y=d.selectableRowSelected,selectableRowDisabled:m=d.selectableRowDisabled,selectableRowsComponent:k=d.selectableRowsComponent,selectableRowsComponentProps:C=d.selectableRowsComponentProps,onRowExpandToggled:A=d.onRowExpandToggled,onSelectedRowsChange:P=d.onSelectedRowsChange,expandableIcon:F=d.expandableIcon,onChangeRowsPerPage:X=d.onChangeRowsPerPage,onChangePage:G=d.onChangePage,paginationServer:L=d.paginationServer,paginationServerOptions:te=d.paginationServerOptions,paginationTotalRows:Z=d.paginationTotalRows,paginationDefaultPage:ie=d.paginationDefaultPage,paginationResetDefaultPage:Q=d.paginationResetDefaultPage,paginationPerPage:B=d.paginationPerPage,paginationRowsPerPageOptions:le=d.paginationRowsPerPageOptions,paginationIconLastPage:q=d.paginationIconLastPage,paginationIconFirstPage:ge=d.paginationIconFirstPage,paginationIconNext:ae=d.paginationIconNext,paginationIconPrevious:se=d.paginationIconPrevious,paginationComponent:xe=d.paginationComponent,paginationComponentOptions:be=d.paginationComponentOptions,responsive:Ce=d.responsive,progressPending:f=d.progressPending,progressComponent:p=d.progressComponent,persistTableHead:h=d.persistTableHead,noDataComponent:E=d.noDataComponent,disabled:a=d.disabled,noTableHead:N=d.noTableHead,noHeader:u=d.noHeader,fixedHeader:Y=d.fixedHeader,fixedHeaderScrollHeight:z=d.fixedHeaderScrollHeight,pagination:j=d.pagination,subHeader:S=d.subHeader,subHeaderAlign:K=d.subHeaderAlign,subHeaderWrap:ne=d.subHeaderWrap,subHeaderComponent:M=d.subHeaderComponent,noContextMenu:ee=d.noContextMenu,contextMessage:W=d.contextMessage,contextActions:H=d.contextActions,contextComponent:Oe=d.contextComponent,expandableRows:J=d.expandableRows,onRowClicked:ke=d.onRowClicked,onRowDoubleClicked:ye=d.onRowDoubleClicked,onRowMouseEnter:ue=d.onRowMouseEnter,onRowMouseLeave:R=d.onRowMouseLeave,sortIcon:U=d.sortIcon,onSort:Be=d.onSort,sortFunction:Ie=d.sortFunction,sortServer:pe=d.sortServer,expandableRowsComponent:wn=d.expandableRowsComponent,expandableRowsComponentProps:vn=d.expandableRowsComponentProps,expandableRowDisabled:xt=d.expandableRowDisabled,expandableRowsHideExpander:Ct=d.expandableRowsHideExpander,expandOnRowClicked:xn=d.expandOnRowClicked,expandOnRowDoubleClicked:Cn=d.expandOnRowDoubleClicked,expandableRowExpanded:yt=d.expandableRowExpanded,expandableInheritConditionalStyles:yn=d.expandableInheritConditionalStyles,defaultSortFieldId:Sn=d.defaultSortFieldId,defaultSortAsc:Rn=d.defaultSortAsc,clearSelectedRows:St=d.clearSelectedRows,conditionalRowStyles:En=d.conditionalRowStyles,theme:Rt=d.theme,customStyles:Et=d.customStyles,direction:Ge=d.direction,onColumnOrderChange:$n=d.onColumnOrderChange,className:On,ariaLabel:$t}=e,{tableColumns:Ot,draggingColumnId:kt,handleDragStart:Pt,handleDragEnter:At,handleDragOver:Dt,handleDragLeave:It,handleDragEnd:jt,defaultSortDirection:kn,defaultSortColumn:Pn}=Wr(n,$n,Sn,Rn),[{rowsPerPage:Se,currentPage:fe,selectedRows:lt,allSelected:_t,selectedCount:Ht,selectedColumn:we,sortDirection:je,toggleOnSelectedRowsChange:An},Pe]=l.useReducer(Io,{allSelected:!1,selectedCount:0,selectedRows:[],selectedColumn:Pn,toggleOnSelectedRowsChange:!1,sortDirection:kn,currentPage:ie,rowsPerPage:B,selectedRowsFlag:!1,contextMessage:d.contextMessage}),{persistSelectedOnSort:Tt=!1,persistSelectedOnPageChange:Qe=!1}=te,Ft=!(!L||!Qe&&!Tt),Dn=j&&!f&&t.length>0,In=xe||Hr,jn=l.useMemo((()=>(($={},V="default",de="default")=>{const me=tn[V]?V:de;return zr({table:{style:{color:(O=tn[me]).text.primary,backgroundColor:O.background.default}},tableWrapper:{style:{display:"table"}},responsiveWrapper:{style:{}},header:{style:{fontSize:"22px",color:O.text.primary,backgroundColor:O.background.default,minHeight:"56px",paddingLeft:"16px",paddingRight:"8px"}},subHeader:{style:{backgroundColor:O.background.default,minHeight:"52px"}},head:{style:{color:O.text.primary,fontSize:"12px",fontWeight:500}},headRow:{style:{backgroundColor:O.background.default,minHeight:"52px",borderBottomWidth:"1px",borderBottomColor:O.divider.default,borderBottomStyle:"solid"},denseStyle:{minHeight:"32px"}},headCells:{style:{paddingLeft:"16px",paddingRight:"16px"},draggingStyle:{cursor:"move"}},contextMenu:{style:{backgroundColor:O.context.background,fontSize:"18px",fontWeight:400,color:O.context.text,paddingLeft:"16px",paddingRight:"8px",transform:"translate3d(0, -100%, 0)",transitionDuration:"125ms",transitionTimingFunction:"cubic-bezier(0, 0, 0.2, 1)",willChange:"transform"},activeStyle:{transform:"translate3d(0, 0, 0)"}},cells:{style:{paddingLeft:"16px",paddingRight:"16px",wordBreak:"break-word"},draggingStyle:{}},rows:{style:{fontSize:"13px",fontWeight:400,color:O.text.primary,backgroundColor:O.background.default,minHeight:"48px","&:not(:last-of-type)":{borderBottomStyle:"solid",borderBottomWidth:"1px",borderBottomColor:O.divider.default}},denseStyle:{minHeight:"32px"},selectedHighlightStyle:{"&:nth-of-type(n)":{color:O.selected.text,backgroundColor:O.selected.default,borderBottomColor:O.background.default}},highlightOnHoverStyle:{color:O.highlightOnHover.text,backgroundColor:O.highlightOnHover.default,transitionDuration:"0.15s",transitionProperty:"background-color",borderBottomColor:O.background.default,outlineStyle:"solid",outlineWidth:"1px",outlineColor:O.background.default},stripedStyle:{color:O.striped.text,backgroundColor:O.striped.default}},expanderRow:{style:{color:O.text.primary,backgroundColor:O.background.default}},expanderCell:{style:{flex:"0 0 48px"}},expanderButton:{style:{color:O.button.default,fill:O.button.default,backgroundColor:"transparent",borderRadius:"2px",transition:"0.25s",height:"100%",width:"100%","&:hover:enabled":{cursor:"pointer"},"&:disabled":{color:O.button.disabled},"&:hover:not(:disabled)":{cursor:"pointer",backgroundColor:O.button.hover},"&:focus":{outline:"none",backgroundColor:O.button.focus},svg:{margin:"auto"}}},pagination:{style:{color:O.text.secondary,fontSize:"13px",minHeight:"56px",backgroundColor:O.background.default,borderTopStyle:"solid",borderTopWidth:"1px",borderTopColor:O.divider.default},pageButtonsStyle:{borderRadius:"50%",height:"40px",width:"40px",padding:"8px",margin:"px",cursor:"pointer",transition:"0.4s",color:O.button.default,fill:O.button.default,backgroundColor:"transparent","&:disabled":{cursor:"unset",color:O.button.disabled,fill:O.button.disabled},"&:hover:not(:disabled)":{backgroundColor:O.button.hover},"&:focus":{outline:"none",backgroundColor:O.button.focus}}},noData:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:O.text.primary,backgroundColor:O.background.default}},progress:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:O.text.primary,backgroundColor:O.background.default}}},$);var O})(Et,Rt)),[Et,Rt]),_n=l.useMemo((()=>Object.assign({},Ge!=="auto"&&{dir:Ge})),[Ge]),ce=l.useMemo((()=>{if(pe)return t;if(we!=null&&we.sortFunction&&typeof we.sortFunction=="function"){const $=we.sortFunction,V=je===$e.ASC?$:(de,me)=>-1*$(de,me);return[...t].sort(V)}return(function($,V,de,me){return V?me&&typeof me=="function"?me($.slice(0),V,de):$.slice(0).sort(((O,st)=>{const He=V(O),Re=V(st);if(de==="asc"){if(He<Re)return-1;if(He>Re)return 1}if(de==="desc"){if(He>Re)return-1;if(He<Re)return 1}return 0})):$})(t,we==null?void 0:we.selector,je,Ie)}),[pe,we,je,t,Ie]),Ve=l.useMemo((()=>{if(j&&!L){const $=fe*Se,V=$-Se;return ce.slice(V,$)}return ce}),[fe,j,L,Se,ce]),Hn=l.useCallback(($=>{Pe($)}),[]),Tn=l.useCallback(($=>{Pe($)}),[]),Fn=l.useCallback(($=>{Pe($)}),[]),Ln=l.useCallback((($,V)=>ke($,V)),[ke]),Mn=l.useCallback((($,V)=>ye($,V)),[ye]),Nn=l.useCallback((($,V)=>ue($,V)),[ue]),zn=l.useCallback((($,V)=>R($,V)),[R]),_e=l.useCallback(($=>Pe({type:"CHANGE_PAGE",page:$,paginationServer:L,visibleOnly:x,persistSelectedOnPageChange:Qe})),[L,Qe,x]),Wn=l.useCallback(($=>{const V=Ue(Z||Ve.length,$),de=ut(fe,V);L||_e(de),Pe({type:"CHANGE_ROWS_PER_PAGE",page:de,rowsPerPage:$})}),[fe,_e,L,Z,Ve.length]);if(j&&!L&&ce.length>0&&Ve.length===0){const $=Ue(ce.length,Se),V=ut(fe,$);_e(V)}Ae((()=>{P({allSelected:_t,selectedCount:Ht,selectedRows:lt.slice(0)})}),[An]),Ae((()=>{Be(we,je,ce.slice(0))}),[we,je]),Ae((()=>{G(fe,Z||ce.length)}),[fe]),Ae((()=>{X(Se,fe)}),[Se]),Ae((()=>{_e(ie)}),[ie,Q]),Ae((()=>{if(j&&L&&Z>0){const $=Ue(Z,Se),V=ut(fe,$);fe!==V&&_e(V)}}),[Z]),l.useEffect((()=>{Pe({type:"CLEAR_SELECTED_ROWS",selectedRowsFlag:St})}),[v,St]),l.useEffect((()=>{if(!y)return;const $=ce.filter((de=>y(de))),V=v?$.slice(0,1):$;Pe({type:"SELECT_MULTIPLE_ROWS",keyField:i,selectedRows:V,totalRows:ce.length,mergeSelections:Ft})}),[t,y]);const Bn=x?Ve:ce,Gn=Qe||v||D;return l.createElement(Po,{theme:jn},!u&&(!!o||!!r)&&l.createElement(br,{title:o,actions:r,showMenu:!ee,selectedCount:Ht,direction:Ge,contextActions:H,contextComponent:Oe,contextMessage:W}),S&&l.createElement(xr,{align:K,wrapContent:ne},M),l.createElement(yr,Object.assign({$responsive:Ce,$fixedHeader:Y,$fixedHeaderScrollHeight:z,className:On},_n),l.createElement(Sr,null,f&&!h&&l.createElement(Kt,null,p),l.createElement(_o,Object.assign({disabled:a,className:"rdt_Table",role:"table"},$t&&{"aria-label":$t}),!N&&(!!h||ce.length>0&&!f)&&l.createElement(To,{className:"rdt_TableHead",role:"rowgroup",$fixedHeader:Y},l.createElement(Fo,{className:"rdt_TableHeadRow",role:"row",$dense:w},b&&(Gn?l.createElement(We,{style:{flex:"0 0 48px"}}):l.createElement(dr,{allSelected:_t,selectedRows:lt,selectableRowsComponent:k,selectableRowsComponentProps:C,selectableRowDisabled:m,rowData:Bn,keyField:i,mergeSelections:Ft,onSelectAllRows:Tn})),J&&!Ct&&l.createElement(Rr,null),Ot.map(($=>l.createElement(sr,{key:$.id,column:$,selectedColumn:we,disabled:f||ce.length===0,pagination:j,paginationServer:L,persistSelectedOnSort:Tt,selectableRowsVisibleOnly:x,sortDirection:je,sortIcon:U,sortServer:pe,onSort:Hn,onDragStart:Pt,onDragOver:Dt,onDragEnd:jt,onDragEnter:At,onDragLeave:It,draggingColumnId:kt}))))),!ce.length&&!f&&l.createElement(Er,null,E),f&&h&&l.createElement(Kt,null,p),!f&&ce.length>0&&l.createElement(Cr,{className:"rdt_TableBody",role:"rowgroup"},Ve.map((($,V)=>{const de=Ne($,i),me=(function(Re=""){return typeof Re!="number"&&(!Re||Re.length===0)})(de)?V:de,O=nt($,lt,i),st=!!(J&&yt&&yt($)),He=!!(J&&xt&&xt($));return l.createElement(tr,{id:me,key:me,keyField:i,"data-row-id":me,columns:Ot,row:$,rowCount:ce.length,rowIndex:V,selectableRows:b,expandableRows:J,expandableIcon:F,highlightOnHover:c,pointerOnHover:g,dense:w,expandOnRowClicked:xn,expandOnRowDoubleClicked:Cn,expandableRowsComponent:wn,expandableRowsComponentProps:vn,expandableRowsHideExpander:Ct,defaultExpanderDisabled:He,defaultExpanded:st,expandableInheritConditionalStyles:yn,conditionalRowStyles:En,selected:O,selectableRowsHighlight:_,selectableRowsComponent:k,selectableRowsComponentProps:C,selectableRowDisabled:m,selectableRowsSingle:v,striped:s,onRowExpandToggled:A,onRowClicked:Ln,onRowDoubleClicked:Mn,onRowMouseEnter:Nn,onRowMouseLeave:zn,onSelectedRow:Fn,draggingColumnId:kt,onDragStart:Pt,onDragOver:Dt,onDragEnd:jt,onDragEnter:At,onDragLeave:It})})))))),Dn&&l.createElement("div",null,l.createElement(In,{onChangePage:_e,onChangeRowsPerPage:Wn,rowCount:Z||ce.length,currentPage:fe,rowsPerPage:Se,direction:Ge,paginationRowsPerPageOptions:le,paginationIconLastPage:q,paginationIconFirstPage:ge,paginationIconNext:ae,paginationIconPrevious:se,paginationComponentOptions:be})))}));const Yr=()=>{const e=Mt(o=>{var r;return(r=o.theme)==null?void 0:r.mode}),t=Mt(o=>{var r;return(r=o.theme)==null?void 0:r.mainColor});return l.useMemo(()=>Br(e,t),[e,t])},Br=(e,t)=>({table:{style:{backgroundColor:"transparent"}},header:{style:{display:"none"}},headRow:{style:{backgroundColor:t||(e==="dark"?"#0f172a":"#1e293b"),color:"#ffffff",minHeight:"48px",borderTopLeftRadius:"8px",borderTopRightRadius:"8px"}},headCells:{style:{fontWeight:"700",fontSize:"14px",textTransform:"uppercase",letterSpacing:"0.05em"}},rows:{style:{backgroundColor:"var(--theme-surface)",color:"var(--theme-content)",minHeight:"45px","&:not(:last-child)":{borderBottomStyle:"solid",borderBottomWidth:"1px",borderBottomColor:"var(--theme-border)"}},highlightOnHoverStyle:{backgroundColor:"var(--theme-page)"}},pagination:{style:{backgroundColor:"var(--theme-surface)",color:"var(--theme-content)",borderTop:"1px solid var(--theme-border)",marginTop:"0px",borderBottomLeftRadius:"8px",borderBottomRightRadius:"8px"}}});export{Vr as X,Yr as u};
