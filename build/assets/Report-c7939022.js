var J=Object.defineProperty;var K=(n,e,r)=>e in n?J(n,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[e]=r;var x=(n,e,r)=>(K(n,typeof e!="symbol"?e+"":e,r),r);import{p,R as _,j as t,b as $,i as A,u as W,a as G,r as j,s as Q,m as X,F as Z,I as ee,S as te,M as E,B as k,d as ne,c as re}from"./index-fd811c46.js";const ae=()=>/^((?!chrome|android).)*safari/i.test(navigator.userAgent),O=n=>Array.isArray(n)&&n.every(e=>typeof e=="object"&&!(e instanceof Array)),se=n=>Array.isArray(n)&&n.every(e=>Array.isArray(e)),le=n=>Array.from(n.map(e=>Object.keys(e)).reduce((e,r)=>new Set([...e,...r]),[])),ie=(n,e)=>{e=e||le(n);let r=e,a=e;O(e)&&(r=e.map(o=>o.label),a=e.map(o=>o.key));const c=n.map(o=>a.map(l=>oe(l,o)));return[r,...c]},oe=(n,e)=>{const r=n.replace(/\[([^\]]+)]/g,".$1").split(".").reduce(function(a,c,o,l){const u=a[c];if(u==null)l.splice(1);else return u},e);return r===void 0?n in e?e[n]:"":r},ce=n=>typeof n>"u"||n===null?"":n,U=(n,e=",",r='"')=>n.filter(a=>a).map(a=>a.map(c=>ce(c)).map(c=>`${r}${c}${r}`).join(e)).join(`
`),de=(n,e,r,a)=>U(e?[e,...n]:n,r,a),ue=(n,e,r,a)=>U(ie(n,e),r,a),pe=(n,e,r,a)=>e?`${e.join(r)}
${n}`:n.replace(/"/g,'""'),N=(n,e,r,a)=>{if(O(n))return ue(n,e,r,a);if(se(n))return de(n,e,r,a);if(typeof n=="string")return pe(n,e,r);throw new TypeError('Data should be a "String", "Array of arrays" OR "Array of objects" ')},M=(n,e,r,a,c)=>{const o=N(n,r,a,c),l=ae()?"application/csv":"text/csv",u=new Blob([e?"\uFEFF":"",o],{type:l}),h=`data:${l};charset=utf-8,${e?"\uFEFF":""}${o}`,f=window.URL||window.webkitURL;return typeof f.createObjectURL>"u"?h:f.createObjectURL(u)},z={data:p.oneOfType([p.string,p.array,p.func]).isRequired,headers:p.array,target:p.string,separator:p.string,filename:p.string,uFEFF:p.bool,onClick:p.func,asyncOnClick:p.bool,enclosingCharacter:p.string},T={separator:",",filename:"generatedBy_react-csv.csv",uFEFF:!0,asyncOnClick:!1,enclosingCharacter:'"'},he={target:"_blank"};class L extends _.Component{constructor(e){super(e),this.state={}}buildURI(){return M(...arguments)}componentDidMount(){const{data:e,headers:r,separator:a,enclosingCharacter:c,uFEFF:o,target:l,specs:u,replace:h}=this.props;this.state.page=window.open(this.buildURI(e,o,r,a,c),l,u,h)}getWindow(){return this.state.page}render(){return null}}x(L,"defaultProps",Object.assign(T,he)),x(L,"propTypes",z);var S;let fe=(S=class extends _.Component{constructor(e){super(e),this.buildURI=this.buildURI.bind(this)}buildURI(){return M(...arguments)}handleLegacy(e,r=!1){if(window.navigator.msSaveOrOpenBlob){e.preventDefault();const{data:a,headers:c,separator:o,filename:l,enclosingCharacter:u,uFEFF:h}=this.props,f=r&&typeof a=="function"?a():a;let m=new Blob([h?"\uFEFF":"",N(f,c,o,u)]);return window.navigator.msSaveBlob(m,l),!1}}handleAsyncClick(e){const r=a=>{if(a===!1){e.preventDefault();return}this.handleLegacy(e,!0)};this.props.onClick(e,r)}handleSyncClick(e){if(this.props.onClick(e)===!1){e.preventDefault();return}this.handleLegacy(e)}handleClick(){return e=>{if(typeof this.props.onClick=="function")return this.props.asyncOnClick?this.handleAsyncClick(e):this.handleSyncClick(e);this.handleLegacy(e)}}render(){const{data:e,headers:r,separator:a,filename:c,uFEFF:o,children:l,onClick:u,asyncOnClick:h,enclosingCharacter:f,...m}=this.props,v=typeof window>"u"?"":this.buildURI(e,o,r,a,f);return t.jsx("a",{download:c,...m,ref:y=>this.link=y,target:"_self",href:v,onClick:this.handleClick(),children:l})}},x(S,"defaultProps",T),x(S,"propTypes",z),S);const ge=fe;var F={},me=A;Object.defineProperty(F,"__esModule",{value:!0});var P=F.default=void 0,xe=me($()),je=t,ve=(0,xe.default)((0,je.jsx)("path",{d:"M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"}),"Download");P=F.default=ve;var w={},ye=A;Object.defineProperty(w,"__esModule",{value:!0});var H=w.default=void 0,be=ye($()),Se=t,Ce=(0,be.default)((0,Se.jsx)("path",{d:"M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"}),"Print");H=w.default=Ce;const De=()=>{const n=W(),e=G(s=>s.userexplist);j.useEffect(()=>{n(Q(!1))},[]);const r=[{label:"ledger",key:"ledger.ledger"},{label:"amount",key:"amount"},{label:"date",key:"date"},{label:"narration",key:"narration"}],a=e.user.name,[c,o]=j.useState(!1),[l,u]=j.useState([]),h=new Date,f=()=>{const s=new Date;return new Date(s.setDate(s.getDate()-1))};var m=String(h.getMonth()+1).padStart(2,"0"),D=String(h.getDate()).padStart(2,"0");const v=h.getFullYear()+"-"+m+"-"+D,y=f().getFullYear()+"-"+String(f().getMonth()).padStart(2,"0")+"-"+String(f().getDate()).padStart(2,"0"),[d,R]=j.useState({from:y,to:v,ledger:"all"}),C=s=>{let i=s.target.name,g=s.target.value;R(b=>({...b,[i]:g}))},V=()=>{o(!0);let s;d.ledger=="all"?s=e.explist.filter((i,g)=>{if(i.date>=d.from&&i.date<=d.to)return i}):s=e.explist.filter((i,g)=>{if(i.date>=d.from&&i.date<=d.to&&i.ledger.ledger==d.ledger)return i}),u(s)},B=()=>{o(!1),R({from:y,to:v,ledger:"all"})},q=()=>{n(re(!0)),setTimeout(()=>{window.print()},1)},I=s=>{let i=new Date(s);var g=String(i.getDate()).padStart(2,"0");return g+"-"+i.toLocaleString("default",{month:"short"})+"-"+i.getFullYear().toString().substr(-2)};return j.useEffect(()=>{V(),console.log(d.ledger)},[d]),t.jsx(t.Fragment,{children:t.jsxs(X.div,{initial:{opacity:0,x:"100%"},animate:{opacity:1,x:0},exit:{opacity:0,x:"-100%"},transition:{duration:.2,ease:"easeInOut"},className:"report",children:[t.jsxs("div",{className:"cont",children:[t.jsxs("span",{children:[t.jsxs("span",{children:["From: ",t.jsx("input",{value:d.from,onChange:C,type:"date",name:"from",id:""})]}),t.jsxs("span",{children:["To: ",t.jsx("input",{value:d.to,onChange:C,type:"date",name:"to",id:""})]}),t.jsxs(Z,{className:"ledger caps mui",size:"small",children:[t.jsx(ee,{id:"demo-simple-select-label",children:"Ledger"}),t.jsxs(te,{name:"ledger",labelId:"demo-simple-select-label",onChange:C,value:d.ledger,defaultValue:d.ledger[1],id:"demo-simple-select",label:"Ledger",children:[t.jsx(E,{value:"all",children:"All"}),e.ledgerlist.map((s,i)=>t.jsx(E,{sx:{textTransform:"capitalize"},value:s.ledger,children:s.ledger},i))]})]}),t.jsx(k,{className:"muibtn",disabled:!c,title:"Clear search",variant:"contained",onClick:B,startIcon:t.jsx(ne,{}),children:"Clear"})]}),t.jsxs("span",{children:[t.jsx(ge,{data:l,headers:r,filename:`${a}-Expense Record`,children:t.jsx(k,{className:"muibtn",title:"Download",size:"small",variant:"contained",startIcon:t.jsx(P,{}),children:"Csv"})}),t.jsx(k,{className:"muibtn",title:"print",size:"small",variant:"contained",onClick:q,startIcon:t.jsx(H,{}),children:"Print"})]})]}),t.jsxs("div",{className:"table",children:[t.jsxs("div",{className:"head",children:[" ",t.jsxs("b",{children:["Accusoft - ",e.user.name]})," (Report from ",I(d.from)," to ",I(d.to),")"]}),t.jsxs("table",{id:"tavlecontent",children:[t.jsx("thead",{id:"table",children:t.jsxs("tr",{children:[t.jsx("th",{children:"S.no"}),t.jsx("th",{children:"Ledger"}),t.jsx("th",{children:"Amount"}),t.jsx("th",{children:"Narration"}),t.jsx("th",{children:"Date"})]})}),t.jsxs("tbody",{children:[l.length<1&&t.jsx("tr",{children:t.jsx("td",{colSpan:5,children:t.jsx("b",{children:"No Record Found"})})}),l==null?void 0:l.map((s,i)=>{let g=new Date(s.date);var b=String(g.getDate()).padStart(2,"0");let Y=b+" "+g.toLocaleString("default",{month:"short"})+", "+g.getFullYear().toString().substr(-2);return t.jsxs("tr",{children:[t.jsx("td",{children:i+1}),t.jsx("td",{children:s.ledger.ledger}),t.jsx("td",{children:s.amount}),t.jsx("td",{children:s.narration}),t.jsx("td",{children:Y})]},i)}),t.jsxs("tr",{id:"foot",children:[t.jsx("td",{colSpan:2,children:"Total"}),t.jsx("td",{colSpan:1,children:l==null?void 0:l.reduce((s,i)=>s=s+i.amount,0)}),t.jsx("td",{colSpan:2})]})]})]})]})]})})};export{De as default};
