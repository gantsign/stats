(this.webpackJsonpstats=this.webpackJsonpstats||[]).push([[6],{435:function(e,t,a){"use strict";a.r(t);var n=a(12),r=a(13),o=a(35),i=a(33),s=a(36),l=a(0),c=a(159),u=a(158),p=a(409),h=a(425),m=a.n(h),d=a(433),v=a(427),y=m()(v),f=function(e){function t(){var e,a;Object(n.a)(this,t);for(var r=arguments.length,s=new Array(r),l=0;l<r;l++)s[l]=arguments[l];return(a=Object(o.a)(this,(e=Object(i.a)(t)).call.apply(e,[this].concat(s)))).onResize=function(e){var t=e.bounds;t&&a.setState({width:t.width,height:t.height})},a}return Object(s.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this,t=this.props.repositoryName,a=this.props.variant,n="count"===a?"downloads_count":"downloads_delta",r="count"===a?"Download count":"Downloads / day",o=this.props.downloadsDf.where((function(e){return e.repository_name===t})).setIndex("data_at").subset([n]),i=[{x:o.getIndex().toArray(),y:o.getSeries(n).toArray(),type:"scatter"}];return l.createElement(d.a,{bounds:!0,onResize:this.onResize},(function(a){var n=a.measureRef,o=e.state||{width:800,height:600},s={width:o.width,height:o.height,title:t,xaxis:{title:"Date"},yaxis:{title:r}};return l.createElement("div",{ref:n,style:{height:"100%"}},l.createElement(y,{data:i,layout:s}))}))}}]),t}(l.Component),g=a(38),w=a(428),b=a.n(w);function E(e){return l.createElement(c.h,Object.assign({direction:"up"},e))}var N=function(e){function t(){var e,a;Object(n.a)(this,t);for(var r=arguments.length,s=new Array(r),l=0;l<r;l++)s[l]=arguments[l];return(a=Object(o.a)(this,(e=Object(i.a)(t)).call.apply(e,[this].concat(s)))).repoChanged=function(e){var t=a.state;if(t){var n=e.target.value,r=t.variant;a.setState({repositoryName:n,variant:r})}},a.variantChanged=function(e){var t=a.state;if(t){var n=t.repositoryName,r=e.target.value;a.setState({repositoryName:n,variant:r})}},a}return Object(s.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){this.setState({repositoryName:this.props.repositoryName,variant:"count"})}},{key:"componentDidUpdate",value:function(e){e.repositoryName!==this.props.repositoryName&&this.setState({repositoryName:this.props.repositoryName,variant:"count"})}},{key:"render",value:function(){var e=this.state;if(!e)return l.createElement(l.Fragment,null);var t=this.props.downloads,a=e.repositoryName||"",n=e.variant,r=new p.a({values:t}).parseDates(["data_at"]),o=r.getSeries("repository_name").distinct().toArray().sort((function(e,t){var a=e.replace("_","-"),n=t.replace("_","-");return a.localeCompare(n)})),i=this.props.open,s=this.props.classes;return l.createElement(c.b,{open:i,fullScreen:!0,TransitionComponent:E,className:"full-screen-dialog"},l.createElement(c.a,{position:"static"},l.createElement(c.p,null,l.createElement(u.MuiThemeProvider,{theme:g.a},l.createElement(c.c,{"aria-label":"Close",className:s.closeButton,onClick:this.props.onClose},l.createElement(b.a,null)),l.createElement(c.d,{htmlFor:"repo"},"Repository"),"\xa0",l.createElement(c.g,{value:a,onChange:this.repoChanged,inputProps:{name:"repo",id:"repo"}},o.map((function(e){return l.createElement(c.e,{key:e,value:e},e)}))),"\xa0\xa0",l.createElement(c.d,{htmlFor:"variant"},"View"),"\xa0",l.createElement(c.g,{value:n,onChange:this.variantChanged,inputProps:{name:"variant",id:"variant"}},l.createElement(c.e,{value:"count"},"Download count"),l.createElement(c.e,{value:"delta"},"Downloads / day"))))),a?l.createElement(f,{downloadsDf:r,repositoryName:a,variant:n}):l.createElement(l.Fragment,null))}}]),t}(l.Component),C=Object(u.withStyles)((function(e){return{closeButton:{position:"absolute",right:e.spacing.unit,top:e.spacing.unit}}}))(N);t.default=C}}]);
//# sourceMappingURL=6.6763fd9e.chunk.js.map