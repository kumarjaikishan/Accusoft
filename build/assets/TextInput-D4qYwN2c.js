import{n as w}from"./rolldown-runtime-Dik6OG8R.js";import{f as $,p as y}from"./charts-CgdZtXbb.js";var I=w(y(),1),e=$(),S=(0,I.forwardRef)(({label:i,id:b,name:t,type:g="text",value:o,onChange:x,placeholder:d,disabled:n=!1,required:s=!1,error:c,helperText:m,startAdornment:a,endAdornment:l,className:z="",inputClassName:h="",containerClassName:j="",rows:k,multiline:N=!1,inputMode:v,pattern:_,...f},u)=>{const r=b||t,p=`
    w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl font-medium
    bg-white dark:bg-slate-800/90
    text-slate-800 dark:text-slate-100
    border border-slate-200 dark:border-slate-700
    hover:border-slate-300 dark:hover:border-slate-600
    focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20
    placeholder:text-slate-400 dark:placeholder:text-slate-500
    disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed
    transition-all duration-150 outline-none
    ${c?"!border-rose-500 !ring-rose-500/20":""}
    ${a?"pl-8":""}
    ${l?"pr-8":""}
    ${h}
  `;return(0,e.jsxs)("div",{className:`w-full flex flex-col gap-1.5 ${j}`,children:[i&&(0,e.jsxs)("label",{htmlFor:r,className:"text-xs font-semibold text-slate-700 dark:text-slate-300 select-none",children:[i," ",s&&(0,e.jsx)("span",{className:"text-rose-500",children:"*"})]}),(0,e.jsxs)("div",{className:"relative w-full flex items-center",children:[a&&(0,e.jsx)("div",{className:"absolute left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-xs sm:text-sm",children:a}),N?(0,e.jsx)("textarea",{ref:u,id:r,name:t,value:o,onChange:x,placeholder:d,disabled:n,required:s,rows:k||3,className:`${p} resize-none`,...f}):(0,e.jsx)("input",{ref:u,id:r,name:t,type:g,value:o,onChange:x,placeholder:d,disabled:n,required:s,inputMode:v,pattern:_,className:p,...f}),l&&(0,e.jsx)("div",{className:"absolute right-3 flex items-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm",children:l})]}),m&&(0,e.jsx)("span",{className:`text-[11px] ${c?"text-rose-500 font-medium":"text-slate-400"}`,children:m})]})});S.displayName="TextInput";export{S as t};
