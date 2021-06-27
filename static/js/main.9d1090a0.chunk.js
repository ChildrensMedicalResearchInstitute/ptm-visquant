(this.webpackJsonpvisquant=this.webpackJsonpvisquant||[]).push([[0],{185:function(e,t,n){},287:function(e,t){},289:function(e,t,n){},290:function(e,t,n){"use strict";n.r(t);n(185);var r=n(36),c={PENDING:"pending",REJECTED:"rejected",RESOLVED:"resolved"},a=n(300),s=n(298),i=n(0),o=n.n(i),u=n(39),l=n(6),j=function(){return Object(l.jsx)(a.a,{status:"404",title:"404",subTitle:"Sorry, the page you visited doesn't exist.",extra:Object(l.jsx)(u.b,{to:"/",children:Object(l.jsx)(s.a,{type:"default",children:"Back Home"})})})},h=function(){return Object(l.jsx)(a.a,{status:"500",title:"Blip in the network",subTitle:"Something went wrong. Please try again later.",extra:Object(l.jsx)(s.a,{type:"default",onClick:function(){return location.reload()},children:"Refresh"},"home")})},d=n(297),f=n(141),b=n.n(f),p=c.PENDING,x=c.RESOLVED,O=c.REJECTED,g=function(e){var t=o.a.useState(null),n=Object(r.a)(t,2),c=(n[0],n[1]),a=o.a.useState(p),s=Object(r.a)(a,2),i=s[0],u=s[1],j=o.a.useState(null),f=Object(r.a)(j,2),g=f[0],m=f[1];switch(o.a.useEffect((function(){u(p),fetch(e.href).then((function(e){return c(e.status),e.text()})).then((function(e){u(x),m(e)})).catch((function(){u(O),m(null)}))}),[e.href]),i){case p:return Object(l.jsx)(d.a,{active:!0});case x:return Object(l.jsx)(b.a,{source:g});case O:return Object(l.jsx)(h,{})}},m=function(e){var t=e.match.params.subpage,n="how-to".concat(t?"-"+t:"",".md"),r="https://raw.githubusercontent.com/ChildrensMedicalResearchInstitute/ptm-visquant/master/docs/".concat(n);return Object(l.jsx)(g,{href:r})},y=n(305),v=n(296),w=function(){return Object(l.jsx)(v.a,{message:"Under construction",description:Object(l.jsxs)("p",{children:["This new PTM Visquant app is under construction and currently lacks some of the existing features in the current prototype. Please check out"," ",Object(l.jsx)("a",{href:"https://visquant.cmri.org.au/",children:"visquant.cmri.org.au"})," if this app is currently missing the feature you need."]}),type:"warning",icon:Object(l.jsx)(y.a,{}),showIcon:!0})},E=n(91),C=10,k="grey",I=30,S=20,P=5,R=.9,D=20,T=.5,q=function(e){var t=o.a.createRef();return o.a.useEffect((function(){var n=E.b(t.current);(function(t){t.append("rect").attr("x",0).attr("y",I-C/2).attr("height",C).attr("width",e.scale(e.graphics.length)).attr("fill",k)})(n),function(t){t.selectAll("region").data(e.graphics.regions.filter((function(e){return!1!==e.display}))).enter().append("g").append("rect").attr("rx",P).attr("ry",P).attr("x",(function(t){return e.scale(t.start)})).attr("y",I-S/2).attr("width",(function(t){return e.scale(t.end-t.start)})).attr("height",S).style("fill",(function(e){return e.colour})).style("fill-opacity",R).style("stroke","black")}(n),function(t){t.selectAll("motif").data(e.graphics.motifs.filter((function(e){return!1!==e.display}))).enter().append("rect").attr("x",(function(t){return e.scale(t.start)})).attr("y",(function(){return I-D/2})).attr("width",(function(t){return e.scale(t.end-t.start)})).attr("height",D).style("fill",(function(e){return e.colour})).style("fill-opacity",T)}(n)}),[]),Object(l.jsx)("svg",{ref:t})},F=n(292),N=c.PENDING,L=c.RESOLVED,M=c.REJECTED,V=function(e){var t=o.a.useState(null),n=Object(r.a)(t,2),c=n[0],a=n[1],s=o.a.useState(N),i=Object(r.a)(s,2),u=i[0],j=i[1];return o.a.useEffect((function(){return t=e.id,void fetch("https://pfam.xfam.org/protein/".concat(t,"/graphic")).then((function(e){return e.json()})).then((function(e){console.assert(1===e.length,{data:e,error:"Unexpected response from Pfam"}),a(e[0]),j(L)})).catch((function(){a(null),j(M)}));var t}),[e.id]),Object(l.jsxs)("div",{style:{margin:"20px 0",overflow:"visible"},children:[Object(l.jsx)("div",{children:c?c.metadata.identifier:""}),Object(l.jsx)("div",{style:{color:"grey"},children:c?c.metadata.accession:""}),Object(l.jsx)("div",{children:function(){switch(u){case N:return Object(l.jsx)(F.a,{style:{display:"flex",justifyContent:"center"}});case L:return Object(l.jsx)(q,{graphics:c,scale:e.scale});case M:return Object(l.jsx)(v.a,{message:'Could not find protein "'.concat(e.id,'"'),type:"error",showIcon:!0})}}()})]})},J=n(295),A=function(e){return Object(l.jsx)(J.a,{mode:"tags",style:{width:"100%"},onChange:e.onChange,allowClear:!0,autoFocus:!0,tokenSeparators:[","],placeholder:"Protein entry name or accession",defaultValue:e.defaultValue})},H=n(68),B=n(294),G=n(114),U=n.n(G),_=n(20),z=[0,4e3],K=[0,2e3],Q=Object(_.f)((function(e){var t,n=null!==(t=U.a.parse(e.location.search,{ignoreQueryPrefix:!0}).id)&&void 0!==t?t:[],c=o.a.useState(n),a=Object(r.a)(c,2),s=a[0],u=a[1],j=E.a().domain(z).range(K);function h(t){e.history.push({search:"?"+U.a.stringify({id:t})}),u(t)}return Object(i.useEffect)((function(){return h(s)}),[]),Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)(w,{}),Object(l.jsxs)(B.a,{style:{margin:"20px 0"},children:[Object(l.jsx)(A,{onChange:h,defaultValue:s}),0===s.length?Object(l.jsx)(H.a,{style:{margin:"40px"},description:Object(l.jsxs)("p",{children:["To get started, enter Pfam protein entry name or accession.",Object(l.jsx)("br",{}),"For example, TAU_RAT or P19332."]})}):s.map((function(e){return Object(l.jsx)(V,{id:e,scale:j},e)}))]})]})})),W=n(303),X=n(302),Y=n(301),Z=n(304),$=n(293),ee=n(299),te=$.a.Header,ne="menu-key-draw",re="menu-key-help",ce="menu-key-license",ae="menu-key-github",se=function(){var e=o.a.useState([]),t=Object(r.a)(e,2),n=t[0],c=t[1];return Object(l.jsx)(te,{children:Object(l.jsxs)(ee.a,{theme:"dark",onClick:function(e){e.key!==ae&&c([e.key])},selectedKeys:n,mode:"horizontal",children:[Object(l.jsx)(ee.a.Item,{icon:Object(l.jsx)(W.a,{}),children:Object(l.jsx)(u.c,{to:"/",children:"Draw"})},ne),Object(l.jsx)(ee.a.Item,{icon:Object(l.jsx)(X.a,{}),children:Object(l.jsx)(u.c,{to:"/how-to",children:"Help"})},re),Object(l.jsx)(ee.a.Item,{icon:Object(l.jsx)(Y.a,{}),children:Object(l.jsx)(u.c,{to:"/license",children:"License"})},ce),Object(l.jsx)(ee.a.Item,{icon:Object(l.jsx)(Z.a,{}),children:Object(l.jsx)("a",{href:"https://github.com/ChildrensMedicalResearchInstitute/ptm-visquant",target:"_blank",rel:"noopener noreferrer",children:"GitHub"})},ae)]})})},ie=$.a.Content,oe=$.a.Footer,ue=function(){return Object(l.jsxs)($.a,{className:"layout",style:{minHeight:"100vh"},children:[Object(l.jsx)(se,{}),Object(l.jsx)(ie,{style:{margin:"50px"},children:Object(l.jsxs)(_.c,{children:[Object(l.jsx)(_.a,{path:"/",exact:!0,component:Q}),Object(l.jsx)(_.a,{path:"/how-to/:subpage?",component:m}),Object(l.jsx)(_.a,{path:"/license",exact:!0,component:function(){return Object(l.jsx)(g,{href:"https://raw.githubusercontent.com/ChildrensMedicalResearchInstitute/ptm-visquant/master/LICENSE.md"})}}),Object(l.jsx)(_.a,{component:j})]})}),Object(l.jsx)(oe,{style:{textAlign:"center"},children:Object(l.jsxs)("p",{children:["Made with \u2661 by"," ",Object(l.jsx)("a",{href:"https://github.com/digitalpoetry",target:"_blank",rel:"noopener noreferrer",children:"Jonathan Du"}),". Copyright \xa9 2019 Children\u2019s Medical Research Institute."]})})]})};var le=function(){return Object(l.jsx)(u.a,{basename:"/",children:Object(l.jsx)(ue,{})})},je=(n(289),function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,306)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,a=t.getLCP,s=t.getTTFB;n(e),r(e),c(e),a(e),s(e)}))}),he=n(26);n.n(he).a.render(Object(l.jsx)(o.a.StrictMode,{children:Object(l.jsx)(le,{})}),document.getElementById("root")),je()}},[[290,1,2]]]);
//# sourceMappingURL=main.9d1090a0.chunk.js.map