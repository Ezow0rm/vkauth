import{s as L,n as y,o as k}from"../chunks/scheduler.63274e7e.js";import{S as C,i as E,g as d,s as M,y as j,h as f,f as l,c as T,z as A,k as i,x as H,a as _}from"../chunks/index.95432262.js";import{g as S}from"../chunks/navigation.0b8929a7.js";function q(m){let a,u,n,r,c,h,o,v="",p,s,g="";return document.title=c=m[0].title,{c(){a=d("meta"),n=d("meta"),h=M(),o=d("a"),o.innerHTML=v,p=M(),s=d("a"),s.innerHTML=g,this.h()},l(e){const t=j("svelte-sa0yjj",document.head);a=f(t,"META",{property:!0,content:!0}),n=f(t,"META",{property:!0,content:!0}),t.forEach(l),h=T(e),o=f(e,"A",{href:!0,"data-svelte-h":!0}),A(o)!=="svelte-admikr"&&(o.innerHTML=v),p=T(e),s=f(e,"A",{href:!0,"data-svelte-h":!0}),A(s)!=="svelte-psy15c"&&(s.innerHTML=g),this.h()},h(){i(a,"property","og:image"),i(a,"content",u=m[0].image),i(n,"property","vk:image"),i(n,"content",r=m[0].image),i(o,"href","/auth"),i(s,"href","/otp")},m(e,t){H(document.head,a),H(document.head,n),_(e,h,t),_(e,o,t),_(e,p,t),_(e,s,t)},p(e,[t]){t&1&&u!==(u=e[0].image)&&i(a,"content",u),t&1&&r!==(r=e[0].image)&&i(n,"content",r),t&1&&c!==(c=e[0].title)&&(document.title=c)},i:y,o:y,d(e){e&&(l(h),l(o),l(p),l(s)),l(a),l(n)}}}function x(m,a,u){let{data:n}=a;return k(()=>S("/auth")),m.$$set=r=>{"data"in r&&u(0,n=r.data)},[n]}class w extends C{constructor(a){super(),E(this,a,x,q,L,{data:0})}}export{w as component};