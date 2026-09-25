import{n as o}from"./rolldown-runtime-Dik6OG8R.js";import{f as l,p as c}from"./charts-CgdZtXbb.js";import{rn as s}from"./ui-DXKltjFm.js";var m=o(c(),1),u=o(s(),1),r=l(),x=({open:t,onClose:i,children:n,shadow:a=!0})=>((0,m.useEffect)(()=>{if(t){const d=window.innerWidth-document.documentElement.clientWidth;return document.body.style.overflowY="hidden",document.body.style.paddingRight=`${d}px`,()=>{setTimeout(()=>{document.body.style.overflowY="scroll",document.body.style.paddingRight="0px"},100)}}},[t]),t?(0,u.createPortal)((0,r.jsx)("div",{onClick:i,className:`
        fixed inset-0 z-1000 
        bg-black/50 backdrop-blur-[5px]
        flex items-center justify-center animate-in fade-in duration-200
      `,children:(0,r.jsx)("div",{onClick:e=>e.stopPropagation(),className:"relative bg-surface rounded-[15px] modalboxe transition-all animate-in zoom-in-95 fade-in duration-200",style:a?{boxShadow:"0 10px 20px rgba(0,0,0,0.4)"}:void 0,children:n})}),document.body):null);export{x as t};
