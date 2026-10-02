import{n as L}from"./rolldown-runtime-Dik6OG8R.js";import{f as O,p as z}from"./charts-CgdZtXbb.js";import{Lt as R,Rt as I}from"./ui-CIV_xuQb.js";var s=L(z(),1),t=O(),M=(0,s.forwardRef)(({label:m,id:f,name:i,value:d,onChange:b,options:l=[],placeholder:k="Select option...",disabled:n=!1,required:w=!1,error:p,helperText:v,placement:j="bottom",className:S="",containerClassName:y="",menuClassName:N="",size:$="md",children:u,..._},E)=>{const[a,c]=(0,s.useState)(!1),x=(0,s.useRef)(null),o=(0,s.useMemo)(()=>{if(Array.isArray(l)&&l.length>0)return l.map(e=>typeof e=="object"&&e!==null?{value:e.value!==void 0?e.value:e._id,label:e.label!==void 0?e.label:e.name||e.ledger||String(e.value)}:{value:e,label:String(e)});if(u){const e=[];return s.Children.forEach(u,r=>{s.isValidElement(r)&&r.props&&e.push({value:r.props.value,label:r.props.children||r.props.label||String(r.props.value)})}),e}return[]},[l,u]),h=(0,s.useMemo)(()=>o.find(e=>String(e.value)===String(d)),[o,d]);(0,s.useEffect)(()=>{const e=r=>{x.current&&!x.current.contains(r.target)&&c(!1)};return a&&(document.addEventListener("mousedown",e),document.addEventListener("touchstart",e)),()=>{document.removeEventListener("mousedown",e),document.removeEventListener("touchstart",e)}},[a]);const C=e=>{n||(c(!1),b&&b({target:{name:i,value:e}}))},g=$==="sm";return(0,t.jsxs)("div",{ref:x,className:`relative flex flex-col gap-1.5 ${y}`,children:[m&&(0,t.jsx)("label",{htmlFor:f||i,className:"text-xs font-semibold text-slate-700 dark:text-slate-300 select-none flex items-center justify-between",children:(0,t.jsxs)("span",{children:[m," ",w&&(0,t.jsx)("span",{className:"text-rose-500",children:"*"})]})}),(0,t.jsxs)("div",{className:"relative w-full",children:[(0,t.jsxs)("button",{ref:E,type:"button",id:f||i,disabled:n,onClick:()=>!n&&c(e=>!e),className:`
            w-full flex items-center justify-between gap-2 text-left font-medium
            rounded-xl border transition-all duration-150 outline-none cursor-pointer select-none
            ${g?"h-8 px-2.5 text-xs":"h-[42px] px-3.5 text-xs sm:text-sm"}
            bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100
            border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600
            ${a?"border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm":"shadow-xs"}
            ${p?"border-rose-500! ring-rose-500/20!":""}
            ${n?"opacity-50 bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed":""}
            ${S}
          `,..._,children:[(0,t.jsx)("span",{className:"truncate",children:h?h.label:k||"Select..."}),(0,t.jsx)(R,{size:g?13:15,className:`text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-200 ${a?"rotate-180 text-indigo-500 dark:text-indigo-400":""}`})]}),a&&(0,t.jsx)("div",{className:`
              absolute left-0 right-0 z-[100] min-w-full max-h-60 overflow-y-auto no-scrollbar
              bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750
              rounded-xl shadow-2xl shadow-slate-900/20 dark:shadow-black/60 py-1
              backdrop-blur-md animate-in fade-in zoom-in-95 duration-100
              [scrollbar-width:none] [-ms-overflow-style:none]
              ${j==="top"?"bottom-full mb-1.5":"top-full mt-1.5"}
              ${N}
            `,children:o.length===0?(0,t.jsx)("div",{className:"px-3 py-2 text-xs text-slate-400 dark:text-slate-500 italic text-center",children:"No options available"}):o.map(e=>{const r=String(e.value)===String(d);return(0,t.jsxs)("button",{type:"button",onClick:()=>C(e.value),className:`
                      w-full px-3 py-2 text-xs text-left flex items-center justify-between gap-2 font-medium cursor-pointer transition-colors
                      ${r?"bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold":"text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"}
                    `,children:[(0,t.jsx)("span",{className:"truncate",children:e.label}),r&&(0,t.jsx)(I,{size:13,strokeWidth:2.5,className:"text-teal-600 dark:text-teal-400 shrink-0"})]},String(e.value))})})]}),v&&(0,t.jsx)("span",{className:`text-[11px] ${p?"text-rose-500 font-medium":"text-slate-400"}`,children:v})]})});M.displayName="SelectInput";export{M as t};
