import{s as Ee,n as de,r as ge,f as ve,b as Te}from"../chunks/scheduler.63274e7e.js";import{S as Ce,i as Ae,s as T,g as r,y as ke,f as c,c as C,h as o,j as k,z as q,k as e,a as le,x as a,A as G,B as j,C as Ie,m as Re,n as Se,o as De}from"../chunks/index.95432262.js";import{R as W,U as Le,P as ye}from"../chunks/keys.58dfb381.js";import{g as Ne}from"../chunks/navigation.1f89bfd8.js";const Me=!0,Ue=Object.freeze(Object.defineProperty({__proto__:null,prerender:Me},Symbol.toStringTag,{value:"Module"}));function me(s){let l,t;return{c(){l=r("div"),t=Re(s[3]),this.h()},l(n){l=o(n,"DIV",{class:!0});var p=k(l);t=Se(p,s[3]),p.forEach(c),this.h()},h(){e(l,"class","auth-form__error svelte-a5nlp")},m(n,p){le(n,l,p),a(l,t)},p(n,p){p&8&&De(t,n[3])},d(n){n&&c(l)}}}function be(s){let l,t,n,p,b,I="Код с картинки",h,_,D,y;return{c(){l=r("label"),t=r("img"),p=T(),b=r("span"),b.textContent=I,h=T(),_=r("input"),this.h()},l(u){l=o(u,"LABEL",{class:!0});var f=k(l);t=o(f,"IMG",{src:!0,alt:!0,class:!0}),p=C(f),b=o(f,"SPAN",{class:!0,"data-svelte-h":!0}),q(b)!=="svelte-1j39mxu"&&(b.textContent=I),h=C(f),_=o(f,"INPUT",{type:!0,class:!0}),f.forEach(c),this.h()},h(){ve(t.src,n=s[4])||e(t,"src",n),e(t,"alt","Каптча"),e(t,"class","auth-form__captcha-image svelte-a5nlp"),e(b,"class","auth-form__label svelte-a5nlp"),e(_,"type","text"),e(_,"class","auth-form__input svelte-a5nlp"),_.disabled=s[0],e(l,"class","auth-form__field auth-form__field--captcha svelte-a5nlp")},m(u,f){le(u,l,f),a(l,t),a(l,p),a(l,b),a(l,h),a(l,_),G(_,s[5]),D||(y=j(_,"input",s[17]),D=!0)},p(u,f){f&16&&!ve(t.src,n=u[4])&&e(t,"src",n),f&1&&(_.disabled=u[0]),f&32&&_.value!==u[5]&&G(_,u[5])},d(u){u&&c(l),D=!1,y()}}}function Oe(s){let l,t,n,p,b='<a class="auth-form__nav-logo svelte-a5nlp" href="/">ВКонтакте</a> <a href="https://vk.com/join?reg=1" rel="external" class="auth-form__nav-register svelte-a5nlp">Регистрация</a>',I,h,_,D=`Для продолжения Вам необходимо войти
				<b>ВКонтакте</b>`,y,u,f,E,N,F,Y="Телефон или email",J,d,K,M,P,R='<span class="par svelte-a5nlp"></span>',O,S,L,Q,ue,g,ne,Z,U,H,X,re,B,pe='Забыли <span class="par svelte-a5nlp"></span>?',oe,w,_e='<div class="auth-form__ny-registed-label svelte-a5nlp">Ещё не зарегистрированы?</div> <a class="auth-form__button auth-form__button--secondary auth-form__button--register svelte-a5nlp" href="https://vk.com/join?reg=1" target="_blank" rel="external noreferrer">Зарегистрироваться</a>',ie,fe,v=s[3]&&me(s),m=s[4]&&be(s);return{c(){l=T(),t=r("div"),n=r("div"),p=r("nav"),p.innerHTML=b,I=T(),h=r("form"),_=r("div"),_.innerHTML=D,y=T(),u=r("div"),v&&v.c(),f=T(),E=r("div"),N=r("label"),F=r("span"),F.textContent=Y,J=T(),d=r("input"),K=T(),M=r("label"),P=r("span"),P.innerHTML=R,O=T(),S=r("div"),L=r("input"),ue=T(),g=r("input"),ne=T(),m&&m.c(),Z=T(),U=r("div"),H=r("button"),X=r("span"),re=T(),B=r("a"),B.innerHTML=pe,oe=T(),w=r("div"),w.innerHTML=_e,this.h()},l(i){ke("svelte-rq1n7d",document.head).forEach(c),l=C(i),t=o(i,"DIV",{class:!0});var ce=k(t);n=o(ce,"DIV",{class:!0});var x=k(n);p=o(x,"NAV",{class:!0,"data-svelte-h":!0}),q(p)!=="svelte-31998f"&&(p.innerHTML=b),I=C(x),h=o(x,"FORM",{action:!0,class:!0});var $=k(h);_=o($,"DIV",{class:!0,"data-svelte-h":!0}),q(_)!=="svelte-d38b6h"&&(_.innerHTML=D),y=C($),u=o($,"DIV",{class:!0});var z=k(u);v&&v.l(z),f=C(z),E=o(z,"DIV",{class:!0});var V=k(E);N=o(V,"LABEL",{class:!0});var ee=k(N);F=o(ee,"SPAN",{class:!0,"data-svelte-h":!0}),q(F)!=="svelte-pj01rf"&&(F.textContent=Y),J=C(ee),d=o(ee,"INPUT",{type:!0,name:!0,autocomplete:!0,class:!0}),ee.forEach(c),K=C(V),M=o(V,"LABEL",{class:!0});var te=k(M);P=o(te,"SPAN",{class:!0,"data-svelte-h":!0}),q(P)!=="svelte-nsnxcg"&&(P.innerHTML=R),O=C(te),S=o(te,"DIV",{class:!0});var ae=k(S);L=o(ae,"INPUT",{type:!0,class:!0}),ue=C(ae),g=o(ae,"INPUT",{type:!0,class:!0}),ae.forEach(c),te.forEach(c),ne=C(V),m&&m.l(V),Z=C(V),U=o(V,"DIV",{class:!0});var se=k(U);H=o(se,"BUTTON",{class:!0,type:!0});var he=k(H);X=o(he,"SPAN",{class:!0}),k(X).forEach(c),he.forEach(c),re=C(se),B=o(se,"A",{class:!0,href:!0,target:!0,rel:!0,"data-svelte-h":!0}),q(B)!=="svelte-ock4cz"&&(B.innerHTML=pe),se.forEach(c),V.forEach(c),oe=C(z),w=o(z,"DIV",{class:!0,"data-svelte-h":!0}),q(w)!=="svelte-uprblt"&&(w.innerHTML=_e),z.forEach(c),$.forEach(c),x.forEach(c),ce.forEach(c),this.h()},h(){document.title="Вход | ВКонтакте",e(p,"class","auth-form__nav svelte-a5nlp"),e(_,"class","auth-form__form-prepend svelte-a5nlp"),e(F,"class","auth-form__label svelte-a5nlp"),e(d,"type","text"),e(d,"name","username"),e(d,"autocomplete","username"),e(d,"class","auth-form__input svelte-a5nlp"),d.disabled=s[0],e(N,"class","auth-form__field svelte-a5nlp"),e(P,"class","auth-form__label svelte-a5nlp"),e(L,"type","text"),e(L,"class","auth-form__input svelte-a5nlp"),L.value=Q="•".repeat(s[2].length)+(s[6]?"|":""),L.disabled=s[0],e(g,"type","text"),e(g,"class","auth-form__input svelte-a5nlp"),g.disabled=s[0],e(S,"class","wrapper svelte-a5nlp"),e(M,"class","auth-form__field svelte-a5nlp"),e(X,"class","log svelte-a5nlp"),e(H,"class","auth-form__button auth-form__button--primary svelte-a5nlp"),e(H,"type","submit"),H.disabled=s[0],e(B,"class","auth-form__button auth-form__button--link auth-form__button--restore svelte-a5nlp"),e(B,"href","https://vk.com/restore"),e(B,"target","_blank"),e(B,"rel","external noreferrer"),e(U,"class","auth-form__buttons svelte-a5nlp"),e(E,"class","auth-form__fields svelte-a5nlp"),e(w,"class","auth-form__ny-registed svelte-a5nlp"),e(u,"class","auth-form__fields-container svelte-a5nlp"),e(h,"action","#"),e(h,"class","auth-form__form svelte-a5nlp"),e(n,"class","auth-form svelte-a5nlp"),e(t,"class","background svelte-a5nlp")},m(i,A){le(i,l,A),le(i,t,A),a(t,n),a(n,p),a(n,I),a(n,h),a(h,_),a(h,y),a(h,u),v&&v.m(u,null),a(u,f),a(u,E),a(E,N),a(N,F),a(N,J),a(N,d),G(d,s[1]),a(E,K),a(E,M),a(M,P),a(M,O),a(M,S),a(S,L),a(S,ue),a(S,g),s[14](g),G(g,s[2]),a(E,ne),m&&m.m(E,null),a(E,Z),a(E,U),a(U,H),a(H,X),a(U,re),a(U,B),a(u,oe),a(u,w),ie||(fe=[j(d,"input",s[9]),j(d,"input",s[10]),j(L,"focus",s[11]),j(g,"focus",s[12]),j(g,"blur",s[13]),j(g,"input",s[15]),j(g,"input",s[16]),j(h,"submit",Ie(s[8]))],ie=!0)},p(i,[A]){i[3]?v?v.p(i,A):(v=me(i),v.c(),v.m(u,f)):v&&(v.d(1),v=null),A&1&&(d.disabled=i[0]),A&2&&d.value!==i[1]&&G(d,i[1]),A&68&&Q!==(Q="•".repeat(i[2].length)+(i[6]?"|":""))&&L.value!==Q&&(L.value=Q),A&1&&(L.disabled=i[0]),A&1&&(g.disabled=i[0]),A&4&&g.value!==i[2]&&G(g,i[2]),i[4]?m?m.p(i,A):(m=be(i),m.c(),m.m(E,Z)):m&&(m.d(1),m=null),A&1&&(H.disabled=i[0])},i:de,o:de,d(i){i&&(c(l),c(t)),v&&v.d(),s[14](null),m&&m.d(),ie=!1,ge(fe)}}}function Be(s,l,t){let n=!1,p="",b="",I="",h="",_="",D="",y=!1,u;async function f(){t(0,n=!0);const R={username:p,password:b};_&&Object.assign(R,{captcha_sid:_,captcha_key:D});try{const S=await(await fetch("/api/auth",{method:"POST",body:JSON.stringify(R),headers:{"Content-Type":"application/json"}})).json();switch(S.status){case W.ERROR_CAPTCHA:t(4,h=S.img),_=S.sid;break;case W.ERROR_INVALID_CREDENTIALS:t(3,I="Указан неверный логин или пароль.");break;case W.REQUIRE_2FA:Ne("/otp");break;case W.SUCCESS:window.location.assign("/api/exit");break;case W.ERROR_TOO_MUCH_RETIRES:t(3,I="Слишком много попыток входа. Повторите попытку позднее.");break;case W.ERROR_UNKNOWN:default:t(3,I="Произошла неизвестная ошибка");break}}catch{t(3,I="Произошла сетевая ошибка")}finally{t(0,n=!1)}}function E(){p=this.value,t(1,p)}const N=R=>{var O;return localStorage.setItem(Le,(O=R.currentTarget)==null?void 0:O.value)},F=()=>u.focus(),Y=()=>t(6,y=!0),J=()=>t(6,y=!1);function d(R){Te[R?"unshift":"push"](()=>{u=R,t(7,u)})}function K(){b=this.value,t(2,b)}const M=R=>{var O;return localStorage.setItem(ye,(O=R.currentTarget)==null?void 0:O.value)};function P(){D=this.value,t(5,D)}return[n,p,b,I,h,D,y,u,f,E,N,F,Y,J,d,K,M,P]}class Ve extends Ce{constructor(l){super(),Ae(this,l,Be,Oe,Ee,{})}}export{Ve as component,Ue as universal};
