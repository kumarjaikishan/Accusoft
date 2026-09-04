import{n as y}from"./rolldown-runtime-Dik6OG8R.js";import{f as $,p as _}from"./charts-CgdZtXbb.js";import{X as C}from"./ui-CTKq5eiq.js";var S=y(_(),1),e=$(),B=(0,S.forwardRef)(({label:n,id:b,name:o,type:m="text",value:s,onChange:d,placeholder:a,disabled:t=!1,required:r=!1,error:x,helperText:c,startAdornment:l,endAdornment:i,className:E="",inputClassName:v="",containerClassName:h="",rows:k,multiline:j=!1,inputMode:N,pattern:w,...g},f)=>{const u=b||o,p=`
    w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl font-medium
    bg-white dark:bg-slate-800/90
    text-slate-800 dark:text-slate-100
    border border-slate-200 dark:border-slate-700
    hover:border-slate-300 dark:hover:border-slate-600
    focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20
    placeholder:text-slate-400 dark:placeholder:text-slate-500
    disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed
    transition-all duration-150 outline-none
    ${x?"!border-rose-500 !ring-rose-500/20":""}
    ${l?"pl-8":""}
    ${i?"pr-8":""}
    ${v}
  `;return(0,e.jsxs)("div",{className:`w-full flex flex-col gap-1.5 ${h}`,children:[n&&(0,e.jsxs)("label",{htmlFor:u,className:"text-xs font-semibold text-slate-700 dark:text-slate-300 select-none",children:[n," ",r&&(0,e.jsx)("span",{className:"text-rose-500",children:"*"})]}),(0,e.jsxs)("div",{className:"relative w-full flex items-center",children:[l&&(0,e.jsx)("div",{className:"absolute left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-xs sm:text-sm",children:l}),j?(0,e.jsx)("textarea",{ref:f,id:u,name:o,value:s,onChange:d,placeholder:a,disabled:t,required:r,rows:k||3,className:`${p} resize-none`,...g}):(0,e.jsx)("input",{ref:f,id:u,name:o,type:m,value:s,onChange:d,placeholder:a,disabled:t,required:r,inputMode:N,pattern:w,className:p,...g}),i&&(0,e.jsx)("div",{className:"absolute right-3 flex items-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm",children:i})]}),c&&(0,e.jsx)("span",{className:`text-[11px] ${x?"text-rose-500 font-medium":"text-slate-400"}`,children:c})]})});B.displayName="TextInput";var M=({children:n,onClick:b,type:o="button",variant:m="primary",size:s="md",disabled:d=!1,loading:a=!1,icon:t,iconPosition:r="left",className:x="",...c})=>{const l={sm:"h-8 px-3 text-xs gap-1.5 rounded-lg",md:"h-10 px-4 text-xs sm:text-sm gap-2 rounded-xl",lg:"h-12 px-6 text-sm sm:text-base gap-2.5 rounded-xl font-bold"},i={primary:"bg-[var(--maincolor,#4f46e5)] hover:opacity-90 active:opacity-95 text-white shadow-xs focus-visible:ring-2 focus-visible:ring-[var(--maincolor)]/50",secondary:"bg-slate-100 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-slate-400/50",danger:"bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs focus-visible:ring-2 focus-visible:ring-rose-500/50",outline:"border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-slate-400/50",ghost:"hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-slate-400/50"};return(0,e.jsxs)("button",{type:o,onClick:b,disabled:d||a,className:`
        inline-flex items-center justify-center font-semibold
        transition-all duration-150 select-none outline-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${l[s]||l.md}
        ${i[m]||i.primary}
        ${x}
      `,...c,children:[a?(0,e.jsx)(C,{className:"animate-spin shrink-0",size:s==="sm"?14:s==="lg"?20:16}):t&&r==="left"&&(0,e.jsx)(t,{size:s==="sm"?14:s==="lg"?18:16,className:"shrink-0"}),(0,e.jsx)("span",{children:n}),!a&&t&&r==="right"&&(0,e.jsx)(t,{size:s==="sm"?14:s==="lg"?18:16,className:"shrink-0"})]})};export{B as n,M as t};
