(this.webpackJsonpvisquant=this.webpackJsonpvisquant||[]).push([[0],{140:function(e,t,n){},250:function(e,t,n){},251:function(e,t,n){"use strict";n.r(t);var c=n(5),s=(n(140),n(69)),a=n(70),r=n(79),i=n(78),o=n(254),j=n(257),u=n(255),h=n(0),l=n.n(h),d=n(121),b=n.n(d),x=n(33),O="pending",p="rejected",f="resolved",m=function(e){Object(r.a)(n,e);var t=Object(i.a)(n);function n(e){var c;return Object(s.a)(this,n),(c=t.call(this,e)).state={href:e.href,status:O,content:null},c}return Object(a.a)(n,[{key:"componentDidMount",value:function(){var e=this;fetch(this.state.href).then((function(e){return e.text()})).then((function(t){e.setState({content:t,status:f})})).catch((function(){e.setState({content:"Unable to load content.",status:p})}))}},{key:"render",value:function(){return this.state.status===O?Object(c.jsx)(o.a,{active:!0}):this.state.status===f?Object(c.jsx)(b.a,{source:this.state.content}):this.state.status===p?Object(c.jsx)(j.a,{status:"warning",title:"We were unable to load the content.",extra:Object(c.jsx)(x.b,{to:"/",children:Object(c.jsx)(u.a,{type:"default",children:"Back Home"},"home")})}):void 0}}]),n}(l.a.Component),y=function(){return Object(c.jsx)(j.a,{status:"404",title:"404",subTitle:"Sorry, the page you visited doesn't exist.",extra:Object(c.jsx)(x.b,{to:"/",children:Object(c.jsx)(u.a,{type:"default",children:"Back Home"})})})},g=n(260),v=n(262),k=n(258),w=n(259),C=n(253),I=n(256),S=C.a.Header,M="menu-key-draw",q="menu-key-help",F="menu-key-license",H="menu-key-github",B=function(e){Object(r.a)(n,e);var t=Object(i.a)(n);function n(e){var c;return Object(s.a)(this,n),(c=t.call(this,e)).state={currentSelectedKey:M},c}return Object(a.a)(n,[{key:"handlecheck",value:function(e){e.key!==H&&this.setState({currentSelectedKey:e.key})}},{key:"render",value:function(){return Object(c.jsx)(S,{children:Object(c.jsxs)(I.a,{theme:"dark",onClick:this.handleClick,selectedKeys:[this.state.currentSelectedKey],mode:"horizontal",children:[Object(c.jsx)(I.a.Item,{icon:Object(c.jsx)(g.a,{}),children:Object(c.jsx)(x.c,{to:"/",children:"Draw"})},M),Object(c.jsx)(I.a.Item,{icon:Object(c.jsx)(v.a,{}),children:Object(c.jsx)(x.c,{to:"/how-to",children:"Help"})},q),Object(c.jsx)(I.a.Item,{icon:Object(c.jsx)(k.a,{}),children:Object(c.jsx)(x.c,{to:"/license",children:"License"})},F),Object(c.jsx)(I.a.Item,{icon:Object(c.jsx)(w.a,{}),children:Object(c.jsx)("a",{href:"https://github.com/ChildrensMedicalResearchInstitute/ptm-visquant",target:"_blank",rel:"noopener noreferrer",children:"GitHub"})},H)]})})}}]),n}(l.a.Component),D=n(261),K=function(){return Object(c.jsx)(j.a,{icon:Object(c.jsx)(D.a,{}),status:"warning",title:"This page is under construction.",extra:Object(c.jsx)("p",{children:"New content is underway and will be coming to you real soon."})})},L=n(11),R=C.a.Content,T=C.a.Footer,E=function(){return Object(c.jsxs)(C.a,{className:"layout",children:[Object(c.jsx)(B,{}),Object(c.jsx)(R,{style:{padding:"0 50px"},children:Object(c.jsxs)(L.c,{children:[Object(c.jsx)(L.a,{path:"/",exact:!0,component:K}),Object(c.jsx)(L.a,{path:"/how-to",exact:!0,component:function(){return Object(c.jsx)(m,{href:"https://raw.githubusercontent.com/ChildrensMedicalResearchInstitute/ptm-visquant/redesign/docs/how_to.md"})}}),Object(c.jsx)(L.a,{path:"/license",exact:!0,component:function(){return Object(c.jsx)(m,{href:"https://raw.githubusercontent.com/ChildrensMedicalResearchInstitute/ptm-visquant/redesign/LICENSE.md"})}}),Object(c.jsx)(L.a,{component:y})]})}),Object(c.jsx)(T,{style:{textAlign:"center"},children:Object(c.jsxs)("p",{children:["Made with \u2661 by"," ",Object(c.jsx)("a",{href:"https://github.com/digitalpoetry",target:"_blank",rel:"noopener noreferrer",children:"Jonathan Du"}),". Copyright \xa9 2019 Children\u2019s Medical Research Institute"]})})]})};var J=function(){return Object(c.jsx)(x.a,{basename:"/",children:Object(c.jsx)(E,{})})},N=(n(250),function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,263)).then((function(t){var n=t.getCLS,c=t.getFID,s=t.getFCP,a=t.getLCP,r=t.getTTFB;n(e),c(e),s(e),a(e),r(e)}))}),_=n(17);n.n(_).a.render(Object(c.jsx)(l.a.StrictMode,{children:Object(c.jsx)(J,{})}),document.getElementById("root")),N()}},[[251,1,2]]]);
//# sourceMappingURL=main.aff99227.chunk.js.map