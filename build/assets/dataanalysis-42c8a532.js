import{u as F,a as D,r as h,s as E,j as e,m as C,F as j,I as v,S as g,M as n}from"./index-34586a00.js";const Y=()=>{const N=F(),x=D(a=>a.userexplist),r=new Date,f=r.getFullYear()+"-"+(r.getMonth()+1)+"-"+r.getUTCDate(),[l,y]=h.useState({date:f,month:r.getMonth(),year:r.getFullYear()}),[c,b]=h.useState({});h.useEffect(()=>{M(),N(E(!1))},[l]);let t={};const M=()=>{x.ledgerlist.forEach(i=>{t[i.ledger]=0}),t.total=0;let a=String(parseInt(l.month)+1).padStart(2,"0");const s=l.year+"-"+a+"-01",m=l.year+"-"+a+"-31";x.explist.forEach(i=>{let{ledger:d,amount:I,date:u}=i;d=d.ledger;const o=parseFloat(I);isNaN(o)||u>=s&&u<=m&&(t.total+=o,t.hasOwnProperty(d)?t[d]+=o:t[d]=o)}),b(t)},S=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],p=a=>{let s=a.target.name,m=a.target.value;y(i=>({...i,[s]:m}))};return e.jsx(e.Fragment,{children:e.jsxs(C.div,{initial:{opacity:0,x:"100%"},animate:{opacity:1,x:0},exit:{opacity:0,x:"-100%"},transition:{duration:.2,ease:"easeInOut"},className:"datanalysis",children:[e.jsxs("div",{className:"cont",children:[e.jsx("span",{children:e.jsxs(j,{size:"small",className:" select caps",children:[e.jsx(v,{id:"demo-simple-select-label",children:"Month"}),e.jsx(g,{name:"month",labelId:"demo-simple-select-label",onChange:p,value:l.month,id:"demo-simple-select",label:"Month",children:S.map((a,s)=>e.jsx(n,{sx:{textTransform:"capitalize"},value:s,children:a},s))})]})}),e.jsx("span",{children:e.jsxs(j,{size:"small",className:"select caps",children:[e.jsx(v,{id:"demo-simple-select-label",children:"Year"}),e.jsxs(g,{name:"year",labelId:"demo-simple-select-label",onChange:p,value:l.year,id:"demo-simple-select",label:"Year",children:[e.jsx(n,{value:"2021",children:"2021"}),e.jsx(n,{value:"2022",children:"2022"}),e.jsx(n,{value:"2023",children:"2023"}),e.jsx(n,{value:"2024",children:"2024"}),e.jsx(n,{value:"2025",children:"2025"})]})]})})]}),e.jsx("div",{className:"cards",children:Object.entries(c).map(([a,s])=>e.jsxs("div",{className:"card",id:a,children:[e.jsxs("div",{className:"data",children:[e.jsx("div",{className:"amt",children:s}),e.jsx("div",{className:"day",children:a})]}),e.jsx("div",{className:"icon",children:e.jsx("div",{className:"cir",style:{background:`conic-gradient(#034972 ${isNaN(Math.floor(s/c.total*100))?0:Math.floor(s/c.total*100)*3.6}deg,  #afbbcb  10.8deg)`},children:e.jsxs("div",{className:"per",children:[" ",isNaN(Math.floor(s/c.total*100))?0:Math.floor(s/c.total*100)," %"]})})})]},a))})]})})};export{Y as default};
