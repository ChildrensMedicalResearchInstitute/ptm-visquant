(this.webpackJsonpvisquant=this.webpackJsonpvisquant||[]).push([[0],{140:function(e,t,n){},250:function(e,t,n){},251:function(e,t,n){"use strict";n.r(t);var c=n(5),s=(n(140),n(69)),a=n(70),r=n(79),i=n(78),o=n(254),h=n(257),u=n(256),j=n(0),l=n.n(j),b=n(121),d=n.n(b),x=n(33),O="pending",p="rejected",f="resolved",m=function(e){Object(r.a)(n,e);var t=Object(i.a)(n);function n(e){var c;return Object(s.a)(this,n),(c=t.call(this,e)).state={href:e.href,status:O,content:null},c}return Object(a.a)(n,[{key:"componentDidMount",value:function(){this.fetchContent()}},{key:"componentDidUpdate",value:function(e){e.href!==this.props.href&&this.setState({href:this.props.href,status:O},this.fetchContent)}},{key:"fetchContent",value:function(){var e=this;fetch(this.state.href).then((function(e){return e.text()})).then((function(t){e.setState({status:f,content:t})})).catch((function(){e.setState({status:p,content:"Unable to load content."})}))}},{key:"render",value:function(){switch(this.state.status){case O:return Object(c.jsx)(o.a,{active:!0});case f:return Object(c.jsx)(d.a,{source:this.state.content});case p:return Object(c.jsx)(h.a,{status:"warning",title:"We were unable to load the content.",extra:Object(c.jsx)(x.b,{to:"/",children:Object(c.jsx)(u.a,{type:"default",children:"Back Home"},"home")})})}}}]),n}(l.a.Component),y=function(e){var t=e.match.params.subpage,n="how-to".concat(t?"-"+t:"",".md"),s="https://raw.githubusercontent.com/ChildrensMedicalResearchInstitute/ptm-visquant/master/docs/".concat(n);return Object(c.jsx)(m,{href:s})},g=function(){return Object(c.jsx)(h.a,{status:"404",title:"404",subTitle:"Sorry, the page you visited doesn't exist.",extra:Object(c.jsx)(x.b,{to:"/",children:Object(c.jsx)(u.a,{type:"default",children:"Back Home"})})})},v=n(258),k=n(261),w=n(260),C=n(259),I=n(253),S=n(255),M=I.a.Header,H="menu-key-draw",q="menu-key-help",D="menu-key-license",F="menu-key-github",B=function(e){Object(r.a)(n,e);var t=Object(i.a)(n);function n(e){var c;return Object(s.a)(this,n),(c=t.call(this,e)).state={currentSelectedKey:H},c}return Object(a.a)(n,[{key:"handlecheck",value:function(e){e.key!==F&&this.setState({currentSelectedKey:e.key})}},{key:"render",value:function(){return Object(c.jsx)(M,{children:Object(c.jsxs)(S.a,{theme:"dark",onClick:this.handleClick,selectedKeys:[this.state.currentSelectedKey],mode:"horizontal",children:[Object(c.jsx)(S.a.Item,{icon:Object(c.jsx)(v.a,{}),children:Object(c.jsx)(x.c,{to:"/",children:"Draw"})},H),Object(c.jsx)(S.a.Item,{icon:Object(c.jsx)(k.a,{}),children:Object(c.jsx)(x.c,{to:"/how-to",children:"Help"})},q),Object(c.jsx)(S.a.Item,{icon:Object(c.jsx)(w.a,{}),children:Object(c.jsx)(x.c,{to:"/license",children:"License"})},D),Object(c.jsx)(S.a.Item,{icon:Object(c.jsx)(C.a,{}),children:Object(c.jsx)("a",{href:"https://github.com/ChildrensMedicalResearchInstitute/ptm-visquant",target:"_blank",rel:"noopener noreferrer",children:"GitHub"})},F)]})})}}]),n}(l.a.Component),K=n(262),L=function(){return Object(c.jsx)(h.a,{icon:Object(c.jsx)(K.a,{}),status:"warning",title:"This page is under construction.",extra:Object(c.jsx)("p",{children:"New content is underway and will be coming to you real soon."})})},R=n(11),T=I.a.Content,E=I.a.Footer,J=function(){return Object(c.jsxs)(I.a,{className:"layout",style:{minHeight:"100vh"},children:[Object(c.jsx)(B,{}),Object(c.jsx)(T,{style:{padding:"0 50px"},children:Object(c.jsxs)(R.c,{children:[Object(c.jsx)(R.a,{path:"/",exact:!0,component:L}),Object(c.jsx)(R.a,{path:"/how-to/:subpage?",component:y}),Object(c.jsx)(R.a,{path:"/license",exact:!0,component:function(){return Object(c.jsx)(m,{href:"https://raw.githubusercontent.com/ChildrensMedicalResearchInstitute/ptm-visquant/master/LICENSE.md"})}}),Object(c.jsx)(R.a,{component:g})]})}),Object(c.jsx)(E,{style:{textAlign:"center"},children:Object(c.jsxs)("p",{children:["Made with \u2661 by"," ",Object(c.jsx)("a",{href:"https://github.com/digitalpoetry",target:"_blank",rel:"noopener noreferrer",children:"Jonathan Du"}),". Copyright \xa9 2019 Children\u2019s Medical Research Institute."]})})]})};var N=function(){return Object(c.jsx)(x.a,{basename:"/",children:Object(c.jsx)(J,{})})},P=(n(250),function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,263)).then((function(t){var n=t.getCLS,c=t.getFID,s=t.getFCP,a=t.getLCP,r=t.getTTFB;n(e),c(e),s(e),a(e),r(e)}))}),U=n(17);n.n(U).a.render(Object(c.jsx)(l.a.StrictMode,{children:Object(c.jsx)(N,{})}),document.getElementById("root")),P()}},[[251,1,2]]]);
//# sourceMappingURL=main.9a02ee20.chunk.js.map