import"./disclose-version.DwdwGuwu.js";import{$ as Te,B as Me,D as p,F as L,G as oe,H as se,J as Z,K as re,L as l,M as E,O as ee,P as n,R as J,S as Ee,T as N,U as de,V as Le,X as De,Y as ze,Z as r,_ as Ie,b as ye,c as R,d as B,f as Ve,g as Re,j as W,k as S,m as be,p as He,q as $,r as Be,t as Q,u as he,v as H,y as xe,z as h}from"./client.BttfaBO-.js";import{t as I}from"./Icon.COFMsQCg.js";import{n as O,t as G}from"./translation.Dy4hpLsJ.js";import{n as le}from"./config.Boz7jEDo.js";import{t as k}from"./musicPlayerStore.V_cH6YfT.js";import{a as ue,c as qe,i as Fe,l as Ae,n as Ke,o as Xe,r as je,s as Ne,t as Ue}from"./SidebarTrackInfo.CAoAABP3.js";ze();function We(s){const e=s-1;return e*e*e+1}function we(s){const e=s-1;return e*e*e+1}function ge(s){const e=typeof s=="string"&&s.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return e?[parseFloat(e[1]),e[2]||"px"]:[s,"px"]}function Ye(s,{delay:e=0,duration:t=400,easing:g=we,x:a=0,y:o=0,opacity:y=0}={}){const u=getComputedStyle(s),_=+u.opacity,i=u.transform==="none"?"":u.transform,c=_*(1-y),[m,v]=ge(a),[C,b]=ge(o);return{delay:e,duration:t,easing:g,css:(f,P)=>`
			transform: ${i} translate(${(1-f)*m}${v}, ${(1-f)*C}${b});
			opacity: ${_-c*P}`}}function Oe(s,{delay:e=0,duration:t=400,easing:g=we,axis:a="y"}={}){const o=getComputedStyle(s),y=+o.opacity,u=a==="y"?"height":"width",_=parseFloat(o[u]),i=a==="y"?["top","bottom"]:["left","right"],c=i.map(x=>`${x[0].toUpperCase()}${x.slice(1)}`),m=parseFloat(o[`padding${c[0]}`]),v=parseFloat(o[`padding${c[1]}`]),C=parseFloat(o[`margin${c[0]}`]),b=parseFloat(o[`margin${c[1]}`]),f=parseFloat(o[`border${c[0]}Width`]),P=parseFloat(o[`border${c[1]}Width`]);return{delay:e,duration:t,easing:g,css:x=>`overflow: hidden;opacity: ${Math.min(x*20,1)*y};${u}: ${x*_}px;padding-${i[0]}: ${x*m}px;padding-${i[1]}: ${x*v}px;margin-${i[0]}: ${x*C}px;margin-${i[1]}: ${x*b}px;border-${i[0]}-width: ${x*f}px;border-${i[1]}-width: ${x*P}px;min-${u}: 0`}}var Ge=S('<div class="fab-music-panel card-base shadow-xl rounded-2xl p-4 w-[20rem] max-w-[80vw] svelte-1lty5dg"><div class="fab-music-header svelte-1lty5dg"><!> <!></div> <!> <!> <!></div>');function Je(s,e){Z(e,!0);let t=de(Me(k.getState())),g=de(!1);function a(z){const d=z;d.detail&&se(t,d.detail,!0)}ye(()=>{window.addEventListener("music-sidebar:state",a)}),xe(()=>{typeof window<"u"&&window.removeEventListener("music-sidebar:state",a)});function o(){k.toggle()}function y(){k.prev()}function u(){k.next()}function _(){k.toggleMode()}function i(){se(g,!n(g))}function c(z){k.playIndex(z)}function m(z){k.seek(z)}function v(){k.toggleMute()}function C(z){k.setVolume(z)}var b=Ge(),f=l(b),P=l(f);Fe(P,{get currentSong(){return n(t).currentSong},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading}}),Ue(h(P,2),{get currentSong(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},onToggleMute:v,onSetVolume:C}),r(f);var x=h(f,2);Ke(x,{get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},onSeek:m});var D=h(x,2);Xe(D,{get isPlaying(){return n(t).isPlaying},get isShuffled(){return n(t).isShuffled},get repeatMode(){return n(t).isRepeating},onToggleMode:_,onPrev:y,onNext:u,onTogglePlay:o,onTogglePlaylist:i}),je(h(D,2),{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(g)},onClose:i,onPlaySong:c}),r(b),p(s,b),$()}var Qe=S('<div class="flex-1 min-w-0"><div class="text-sm font-medium text-90 truncate"> </div> <div class="text-xs text-50 truncate"> </div></div>'),Ze=S('<div class="text-xs text-30 mt-1"> </div>'),$e=S('<div class="flex-1 min-w-0"><div class="song-title text-lg font-bold text-90 truncate mb-1"> </div> <div class="song-artist text-sm text-50 truncate"> </div> <!></div>');function me(s,e){Z(e,!0);const t=Q(e,"showTime",3,!1),g=Q(e,"size",3,"mini");function a(i){return!Number.isFinite(i)||i<0?"0:00":`${Math.floor(i/60)}:${Math.floor(i%60).toString().padStart(2,"0")}`}var o=ee(),y=J(o),u=i=>{var c=Qe(),m=l(c),v=l(m,!0);r(m);var C=h(m,2),b=l(C,!0);r(C),r(c),L(()=>{N(v,e.song.title),N(b,e.song.artist)}),p(i,c)},_=i=>{var c=$e(),m=l(c),v=l(m,!0);r(m);var C=h(m,2),b=l(C,!0);r(C);var f=h(C,2),P=x=>{var D=Ze(),z=l(D);r(D),L((d,q)=>N(z,`${d??""} / ${q??""}`),[()=>a(e.currentTime),()=>a(e.duration)]),p(x,D)};H(f,x=>{t()&&x(P)}),r(c),L(()=>{N(v,e.song.title),N(b,e.song.artist)}),p(i,c)};H(y,i=>{g()==="mini"?i(u):i(_,-1)}),p(s,o),$()}var et=S('<!> <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0"><!></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div>',1),tt=S('<div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button><!></button></div>'),nt=S("<!> <!> <!>",1),it=S("<div><!></div>");function ke(s,e){Z(e,!0);const t=Q(e,"size",3,"mini"),g=Q(e,"showControls",3,!1),a=Q(e,"showPlaylist",3,!1);var o=it(),y=l(o),u=i=>{var c=et(),m=J(c);ue(m,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",interactive:!0,get onclick(){return e.onCoverClick}});var v=h(m,2);me(l(v),{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},size:"mini"}),r(v);var C=h(v,2),b=l(C);I(l(b),{icon:"material-symbols:visibility-off",class:"text-lg"}),r(b);var f=h(b,2);I(l(f),{icon:"material-symbols:expand-less",class:"text-lg"}),r(f),r(C),L((P,x)=>{R(v,"aria-label",P),R(b,"title",x)},[()=>G(O.musicPlayerExpand),()=>G(O.musicPlayerHide)]),E("click",v,function(...P){e.onInfoClick?.apply(this,P)}),E("keydown",v,P=>{(P.key==="Enter"||P.key===" ")&&(P.preventDefault(),e.onInfoClick?.())}),E("click",b,P=>{P.stopPropagation(),e.onHideClick?.()}),E("click",f,P=>{P.stopPropagation(),e.onExpandClick?.()}),p(i,c)},_=i=>{var c=nt(),m=J(c);ue(m,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded"});var v=h(m,2);me(v,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},showTime:!0,size:"expanded"});var C=h(v,2),b=f=>{var P=tt(),x=l(P);I(l(x),{icon:"material-symbols:visibility-off",class:"text-lg"}),r(x);var D=h(x,2);let z;I(l(D),{icon:"material-symbols:queue-music",class:"text-lg"}),r(D),r(P),L((d,q)=>{R(x,"title",d),z=B(D,1,"btn-plain w-8 h-8 rounded-lg flex items-center justify-center",null,z,{"text-[var(--primary)]":a()}),R(D,"title",q)},[()=>G(O.musicPlayerHide),()=>G(O.musicPlayerPlaylist)]),E("click",x,function(...d){e.onHideClick?.apply(this,d)}),E("click",D,function(...d){e.onPlaylistClick?.apply(this,d)}),p(f,P)};H(C,f=>{g()&&f(b)}),p(i,c)};H(y,i=>{t()==="mini"?i(u):i(_,-1)}),r(o),L(()=>B(o,1,Ve(t()==="mini"?"flex items-center gap-3 mb-0":"flex items-center gap-4 mb-4"))),p(s,o),$()}W(["click","keydown"]);var rt=S("<div><!></div>");function at(s,e){var t=rt();let g;ke(l(t),{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",get onCoverClick(){return e.onCoverClick},get onInfoClick(){return e.onInfoClick},get onHideClick(){return e.onHideClick},get onExpandClick(){return e.onExpandClick}}),r(t),L(()=>g=B(t,1,"mini-player card-base shadow-xl rounded-2xl p-3 absolute bottom-0 right-0 w-70 svelte-g9ac72",null,g,{"mini-enter":!e.isHidden,"mini-leave":e.isHidden,"pointer-events-none":e.isHidden})),p(s,t)}var ve=S("<button><!></button>");function fe(s,e){const t=Q(e,"repeatMode",3,0),g=Q(e,"disabled",3,!1);var a=ee(),o=J(a),y=_=>{var i=ve();let c;I(l(i),{icon:"material-symbols:shuffle",class:"text-lg"}),r(i),L(()=>{c=B(i,1,"w-10 h-10 rounded-lg",null,c,{"btn-regular":e.isActive,"btn-plain":!e.isActive}),i.disabled=g()}),E("click",i,function(...m){e.onclick?.apply(this,m)}),p(_,i)},u=_=>{var i=ve();let c;var m=l(i),v=f=>{I(f,{icon:"material-symbols:repeat-one",class:"text-lg"})},C=f=>{I(f,{icon:"material-symbols:repeat",class:"text-lg"})},b=f=>{I(f,{icon:"material-symbols:repeat",class:"text-lg opacity-50"})};H(m,f=>{t()===1?f(v):t()===2?f(C,1):f(b,-1)}),r(i),L(()=>c=B(i,1,"w-10 h-10 rounded-lg",null,c,{"btn-regular":e.isActive,"btn-plain":!e.isActive})),E("click",i,function(...f){e.onclick?.apply(this,f)}),p(_,i)};H(o,_=>{e.mode==="shuffle"?_(y):_(u,-1)}),p(s,a)}W(["click"]);var ot=S('<div class="controls flex items-center justify-center gap-2 mb-4"><!> <!> <!> <!> <!></div>');function lt(s,e){var t=ot(),g=l(t);fe(g,{mode:"shuffle",get isActive(){return e.isShuffled},get onclick(){return e.onShuffleClick}});var a=h(g,2);Ne(a,{get onclick(){return e.onPrevClick},disabled:!1});var o=h(a,2);qe(o,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get onclick(){return e.onPlayClick}});var y=h(o,2);Ae(y,{get onclick(){return e.onNextClick},disabled:!1});var u=h(y,2);{let _=re(()=>e.isRepeating>0);fe(u,{mode:"repeat",get isActive(){return n(_)},get repeatMode(){return e.isRepeating},get onclick(){return e.onRepeatClick}})}r(t),p(s,t)}var st=S('<div class="progress-bar flex-1 h-2 bg-(--btn-regular-bg) rounded-full cursor-pointer" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-(--primary) rounded-full transition-all duration-100"></div></div>');function ut(s,e){Z(e,!0);var t=st(),g=l(t);r(t),L(a=>{R(t,"aria-label",a),R(t,"aria-valuenow",e.duration>0?e.currentTime/e.duration*100:0),he(g,`width: ${e.duration>0?e.currentTime/e.duration*100:0}%`)},[()=>G(O.musicPlayerProgress)]),E("click",t,function(...a){e.onclick?.apply(this,a)}),E("keydown",t,function(...a){e.onkeydown?.apply(this,a)}),p(s,t),$()}W(["click","keydown"]);var ct=S('<div class="progress-section mb-4"><!></div>');function dt(s,e){var t=ct();ut(l(t),{get currentTime(){return e.currentTime},get duration(){return e.duration},get onclick(){return e.onProgressClick},get onkeydown(){return e.onProgressKeyDown}}),r(t),p(s,t)}var gt=S('<button class="btn-plain w-8 h-8 rounded-lg"><!></button>');function mt(s,e){var t=gt(),g=l(t),a=u=>{I(u,{icon:"material-symbols:volume-off",class:"text-lg"})},o=u=>{I(u,{icon:"material-symbols:volume-down",class:"text-lg"})},y=u=>{I(u,{icon:"material-symbols:volume-up",class:"text-lg"})};H(g,u=>{e.isMuted||e.volume===0?u(a):e.volume<.5?u(o,1):u(y,-1)}),r(t),E("click",t,function(...u){e.onclick?.apply(this,u)}),p(s,t)}W(["click"]);var vt=S('<div class="flex-1 h-2 bg-(--btn-regular-bg) rounded-full cursor-pointer touch-none" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div></div></div>');function ft(s,e){var t=vt(),g=l(t);let a;r(t),He(t,o=>e.volumeBarRef?.(o)),L(()=>{R(t,"aria-label",e.ariaLabel),R(t,"aria-valuenow",e.volume*100),a=B(g,1,"h-full bg-(--primary) rounded-full transition-all",null,a,{"duration-100":!e.isVolumeDragging,"duration-0":e.isVolumeDragging}),he(g,`width: ${e.volume*100}%`)}),E("pointerdown",t,function(...o){e.onpointerdown?.apply(this,o)}),E("keydown",t,function(...o){e.onkeydown?.apply(this,o)}),p(s,t)}W(["pointerdown","keydown"]);var yt=S('<div class="bottom-controls flex items-center gap-2"><!> <!> <!></div>');function bt(s,e){var t=yt(),g=l(t);mt(g,{get volume(){return e.volume},get isMuted(){return e.isMuted},get onclick(){return e.onVolumeButtonClick}});var a=h(g,2);{let y=re(()=>e.isMuted?0:e.volume);ft(a,{get volume(){return n(y)},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onpointerdown(){return e.onSliderPointerDown},get onkeydown(){return e.onSliderKeyDown},get ariaLabel(){return e.ariaLabel}})}var o=h(a,2);Ee(o,()=>e.children??Te),r(t),p(s,t)}var ht=S('<button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button>'),xt=S("<div><!> <!> <!> <!></div>");function wt(s,e){Z(e,!0);var t=xt();let g;var a=l(t);ke(a,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded",showControls:!0,get showPlaylist(){return e.showPlaylist},get onHideClick(){return e.onHideClick},get onPlaylistClick(){return e.onPlaylistClick}});var o=h(a,2);dt(o,{get currentTime(){return e.currentTime},get duration(){return e.duration},get onProgressClick(){return e.onProgressClick},get onProgressKeyDown(){return e.onProgressKeyDown}});var y=h(o,2);lt(y,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get isShuffled(){return e.isShuffled},get isRepeating(){return e.isRepeating},get canSkip(){return e.canSkip},get onPlayClick(){return e.onPlayClick},get onPrevClick(){return e.onPrevClick},get onNextClick(){return e.onNextClick},get onShuffleClick(){return e.onShuffleClick},get onRepeatClick(){return e.onRepeatClick}});var u=h(y,2);{let _=re(()=>G(O.musicPlayerVolume));bt(u,{get volume(){return e.volume},get isMuted(){return e.isMuted},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onVolumeButtonClick(){return e.onVolumeButtonClick},get onSliderPointerDown(){return e.onSliderPointerDown},get onSliderKeyDown(){return e.onSliderKeyDown},get ariaLabel(){return n(_)},children:(i,c)=>{var m=ht();I(l(m),{icon:"material-symbols:expand-more",class:"text-lg"}),r(m),L(v=>R(m,"title",v),[()=>G(O.musicPlayerCollapse)]),E("click",m,function(...v){e.onCollapseClick?.apply(this,v)}),p(i,m)},$$slots:{default:!0}})}r(t),L(()=>g=B(t,1,"expanded-player card-base shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out absolute bottom-0 right-0 w-80",null,g,{"opacity-0":e.isHidden,"scale-95":e.isHidden,"pointer-events-none":e.isHidden})),p(s,t),$()}W(["click"]);var kt=S('<span class="text-sm text-[var(--content-meta)]"> </span>'),pt=S('<div role="button" tabindex="0"><div class="w-6 h-6 flex items-center justify-center"><!></div> <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"><img decoding="async" class="w-full h-full object-cover"/></div> <div class="flex-1 min-w-0"><div> </div> <div> </div></div></div>');function _t(s,e){Z(e,!0);const t=Q(e,"lazy",3,!0);function g(d){return d.startsWith("http://")||d.startsWith("https://")||d.startsWith("/")?d:`/${d}`}var a=pt();let o;var y=l(a),u=l(y),_=d=>{I(d,{icon:"material-symbols:graphic-eq",class:"text-[var(--primary)] animate-pulse"})},i=d=>{I(d,{icon:"material-symbols:pause",class:"text-[var(--primary)]"})},c=d=>{var q=kt(),ae=l(q,!0);r(q),L(()=>N(ae,e.index+1)),p(d,q)};H(u,d=>{e.isCurrent&&e.isPlaying?d(_):e.isCurrent?d(i,1):d(c,-1)}),r(y);var m=h(y,2),v=l(m);r(m);var C=h(m,2),b=l(C);let f;var P=l(b,!0);r(b);var x=h(b,2);let D;var z=l(x,!0);r(x),r(C),r(a),L(d=>{o=B(a,1,"playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors",null,o,{"bg-[var(--btn-plain-bg)]":e.isCurrent,"text-[var(--primary)]":e.isCurrent}),R(a,"aria-label",`播放 ${e.song.title??""} - ${e.song.artist??""}`),R(v,"src",d),R(v,"alt",e.song.title),R(v,"loading",t()?"lazy":"eager"),f=B(b,1,"font-medium truncate",null,f,{"text-[var(--primary)]":e.isCurrent,"text-90":!e.isCurrent}),N(P,e.song.title),D=B(x,1,"text-sm text-[var(--content-meta)] truncate",null,D,{"text-[var(--primary)]":e.isCurrent}),N(z,e.song.artist)},[()=>g(e.song.cover)]),E("click",a,function(...d){e.onclick?.apply(this,d)}),E("keydown",a,d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),e.onclick())}),p(s,a),$()}W(["click","keydown"]);var Pt=S('<div class="playlist-panel card-base-transparent fixed bottom-70 right-4 w-80 max-h-96 overflow-hidden z-50 svelte-1v267om"><div class="playlist-header flex items-center justify-between p-4 border-b border-(--line-divider)"><h3 class="text-lg font-semibold text-90"> </h3> <button class="btn-plain w-8 h-8 rounded-lg"><!></button></div> <div class="playlist-content overflow-y-auto max-h-80 hide-scrollbar" role="presentation"></div></div>');function Ct(s,e){Z(e,!0);var t=ee(),g=J(t),a=o=>{var y=Pt(),u=l(y),_=l(u),i=l(_,!0);r(_);var c=h(_,2);I(l(c),{icon:"material-symbols:close",class:"text-lg"}),r(c),r(u);var m=h(u,2);Re(m,21,()=>e.playlist,Ie,(v,C,b)=>{{let f=re(()=>b===e.currentIndex);_t(v,{get song(){return n(C)},index:b,get isCurrent(){return n(f)},get isPlaying(){return e.isPlaying},onclick:()=>e.onPlaySong(b),lazy:b!==0})}}),r(m),r(y),L(v=>N(i,v),[()=>G(O.musicPlayerPlaylist)]),E("click",c,function(...v){e.onClose?.apply(this,v)}),be(3,y,()=>Oe,()=>({duration:300,axis:"y"})),p(o,y)};H(g,o=>{e.show&&o(a)}),p(s,t),$()}W(["click"]);var St=S('<div class="fixed bottom-20 right-4 z-60 max-w-sm"><div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"><!> <span class="text-sm flex-1"> </span> <button class="text-white/80 hover:text-white transition-colors"><!></button></div></div>'),Tt=S('<div class="music-player-fab-anchor fixed z-55"><div class="music-player-fab-shell"><!></div></div>'),Mt=S("<div><div><!></div> <!> <!> <!></div>"),Et=S(`<!> <!> <style>.music-player-fab-anchor {
			right: var(--fab-group-right, 1.5rem);
			bottom: calc(
				var(--fab-group-bottom, 10rem) +
					(
						var(--fab-button-size, 3rem) *
							var(--fab-visible-count, 1)
					) +
					(
						var(--fab-group-gap, 0.5rem) *
							(var(--fab-visible-count, 1) - 1)
					)
			);
			width: 0;
			height: 0;
			pointer-events: none;
		}

		.music-player-fab-shell {
			position: absolute;
			right: 0;
			bottom: 0.75rem;
			transform-origin: bottom right;
			pointer-events: auto;
			will-change: transform, opacity;
		}

		.orb-player-container {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		.orb-enter {
			animation: orbElasticIn 460ms cubic-bezier(0.22, 1.25, 0.36, 1)
				forwards;
		}

		.orb-leave {
			animation: orbElasticOut 360ms cubic-bezier(0.4, 0, 1, 1) forwards;
		}

		@keyframes orbElasticIn {
			0% {
				opacity: 0;
				transform: translateX(0) scale(0.55);
			}
			70% {
				opacity: 1;
				transform: translateX(0) scale(1.12);
			}
			100% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
		}

		@keyframes orbElasticOut {
			0% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
			100% {
				opacity: 0;
				transform: translateX(0) scale(0.6);
			}
		}

		.music-player.hidden-mode {
			width: 3rem;
			height: 3rem;
		}

		.music-player {
			width: 20rem;
			max-width: 20rem;
			min-width: 20rem;
			user-select: none;
		}

		:global(.mini-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.expanded-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.orb-player) {
			position: relative;
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}

		:global(.orb-player::before) {
			content: "";
			position: absolute;
			inset: -0.125rem;
			background: linear-gradient(
				45deg,
				var(--primary),
				transparent,
				var(--primary)
			);
			border-radius: 50%;
			z-index: -1;
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		:global(.orb-player:hover::before) {
			opacity: 0.3;
			animation: rotate 2s linear infinite;
		}

		:global(.orb-player .animate-pulse) {
			animation: musicWave 1.5s ease-in-out infinite;
		}

		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes musicWave {
			0%,
			100% {
				transform: scaleY(0.5);
			}
			50% {
				transform: scaleY(1);
			}
		}

		:global(.animate-pulse) {
			animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
		}

		:global(.progress-section div:hover),
		:global(.bottom-controls > div:hover) {
			transform: scaleY(1.2);
			transition: transform 0.2s ease;
		}

		@media (width < 768px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.75rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 5rem) +
						(
							var(--fab-button-size, 2.75rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				bottom: 0.5rem !important;
				right: 0.5rem !important;
			}
			:global(.mini-player) {
				width: 280px !important;
			}
			:global(.expanded-player) {
				width: 280px !important;
				max-width: 280px !important;
			}
			.music-player.expanded {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				right: 0.5rem !important;
			}
			:global(.playlist-panel) {
				width: 280px !important;
				right: 0.5rem !important;
				max-width: 280px !important;
			}
			:global(.controls) {
				gap: 8px;
			}
			:global(.controls button) {
				width: 36px;
				height: 36px;
			}
			:global(.controls button:nth-child(3)) {
				width: 44px;
				height: 44px;
			}
		}

		@media (width < 480px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.5rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 4.5rem) +
						(
							var(--fab-button-size, 2.5rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 260px !important;
				min-width: 260px !important;
				max-width: 260px !important;
			}
			:global(.expanded-player) {
				width: 260px !important;
				max-width: 260px !important;
			}
			:global(.playlist-panel) {
				width: 260px !important;
				max-width: 260px !important;
				right: 0.5rem !important;
			}
			:global(.song-title) {
				font-size: 14px;
			}
			:global(.song-artist) {
				font-size: 12px;
			}
			:global(.controls) {
				gap: 6px;
				margin-bottom: 12px;
			}
			:global(.controls button) {
				width: 32px;
				height: 32px;
			}
			:global(.controls button:nth-child(3)) {
				width: 40px;
				height: 40px;
			}
			:global(.playlist-item) {
				padding: 8px 12px;
			}
			:global(.playlist-item .w-10) {
				width: 32px;
				height: 32px;
			}
		}

		@keyframes slide-up {
			from {
				transform: translateY(100%);
				opacity: 0;
			}
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.animate-slide-up {
			animation: slide-up 0.3s ease-out;
		}

		@media (hover: none) and (pointer: coarse) {
			:global(.music-player button),
			:global(.playlist-item) {
				min-height: 44px;
			}
			:global(.progress-section > div),
			:global(.bottom-controls > div:nth-child(2)) {
				height: 12px;
			}
		}

		@keyframes spin-continuous {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		:global(.cover-container img) {
			animation: spin-continuous 3s linear infinite;
			animation-play-state: paused;
		}

		:global(.cover-container img.spinning) {
			animation-play-state: running;
		}

		:global(button.bg-\\\\[var\\\\(--primary\\\\)\\\\]) {
			box-shadow: 0 0 0 2px var(--primary);
			border: none;
		}</style>`,1);function qt(s,e){Z(e,!1);let t=Le(k.getState());const g=le.showFloatingPlayer,a=(le.floatingEntryMode??"default")==="fab",o=g&&le.enable;let y;function u(){k.toggle()}function _(){k.prev()}function i(){k.next()}function c(){k.toggleShuffle()}function m(){k.toggleRepeat()}function v(w){k.playIndex(w)}function C(w){const T=w.currentTarget;if(!T)return;const U=T.getBoundingClientRect(),X=(w.clientX-U.left)/U.width;k.setProgress(X)}function b(w){(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),k.setProgress(.5))}function f(){k.toggleMute()}function P(){k.toggleMute()}function x(w){const T=w.currentTarget;if(!T)return;const U=M=>{const F=T.getBoundingClientRect();if(F.width<=0)return;const A=Math.max(0,Math.min(1,(M-F.left)/F.width));k.setVolume(A)};U(w.clientX);const X=w.pointerId;T.setPointerCapture(X);const te=M=>{M.pointerId===X&&U(M.clientX)},ne=()=>{T.removeEventListener("pointermove",te),T.removeEventListener("pointerup",ie),T.removeEventListener("pointercancel",V),T.hasPointerCapture(X)&&T.releasePointerCapture(X)},ie=M=>{M.pointerId===X&&(U(M.clientX),ne())},V=M=>{M.pointerId===X&&ne()};T.addEventListener("pointermove",te),T.addEventListener("pointerup",ie),T.addEventListener("pointercancel",V)}function D(w){const T=w.target;if(!(T?.tagName==="INPUT"||T?.tagName==="TEXTAREA"||T?.contentEditable==="true")){if(w.key==="ArrowLeft"||w.key==="ArrowDown"){w.preventDefault(),k.setVolume(n(t).volume-.05);return}if(w.key==="ArrowRight"||w.key==="ArrowUp"){w.preventDefault(),k.setVolume(n(t).volume+.05);return}(w.key==="Enter"||w.key===" "||w.key==="m"||w.key==="M")&&(w.preventDefault(),f())}}function z(){k.togglePlaylist()}function d(){k.toggleExpanded()}function q(){k.toggleHidden()}function ae(){k.hideError()}function pe(w){}function _e(){return k.canSkip()}ye(()=>{y=k.subscribe(w=>{se(t,w)}),k.initialize()}),xe(()=>{y&&y(),k.destroy()}),Be();var ce=ee(),Pe=J(ce),Ce=w=>{var T=Et(),U=J(T),X=V=>{var M=St(),F=l(M),A=l(F);I(A,{icon:"material-symbols:error",class:"text-xl shrink-0"});var j=h(A,2),Y=l(j,!0);r(j);var K=h(j,2);I(l(K),{icon:"material-symbols:close",class:"text-lg"}),r(K),r(F),r(M),L(()=>N(Y,n(t).errorMessage)),E("click",K,ae),p(V,M)};H(U,V=>{n(t).showError&&V(X)});var te=h(U,2),ne=V=>{var M=ee(),F=J(M),A=j=>{var Y=Tt(),K=l(Y);Je(l(K),{}),r(K),r(Y),be(3,K,()=>Ye,()=>({y:16,duration:280,opacity:.12,easing:We})),p(j,Y)};H(F,j=>{n(t).isExpanded&&j(A)}),p(V,M)},ie=V=>{var M=Mt();let F;var A=l(M);ue(l(A),{get cover(){return n(t).currentSong.cover},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},size:"orb",onclick:q}),r(A);var j=h(A,2);{let K=oe(()=>n(t).isExpanded||n(t).isHidden);at(j,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isHidden(){return n(K)},onCoverClick:u,onInfoClick:d,onHideClick:q,onExpandClick:d})}var Y=h(j,2);{let K=oe(_e),Se=oe(()=>!n(t).isExpanded);wt(Y,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isShuffled(){return n(t).isShuffled},get isRepeating(){return n(t).isRepeating},get showPlaylist(){return n(t).showPlaylist},get canSkip(){return n(K)},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},isVolumeDragging:!1,get isHidden(){return n(Se)},volumeBarRef:pe,onPlayClick:u,onPrevClick:_,onNextClick:()=>i(),onShuffleClick:c,onRepeatClick:m,onProgressClick:C,onProgressKeyDown:b,onVolumeButtonClick:P,onSliderPointerDown:x,onSliderKeyDown:D,onHideClick:q,onPlaylistClick:z,onCollapseClick:d})}Ct(h(Y,2),{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(t).showPlaylist},onClose:z,onPlaySong:v}),r(M),L(()=>{F=B(M,1,"music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",null,F,{expanded:n(t).isExpanded,"hidden-mode":n(t).isHidden}),B(A,1,`orb-player-container ${n(t).isHidden?"orb-enter pointer-events-auto":"orb-leave pointer-events-none"}`)}),p(V,M)};H(te,V=>{a?V(ne):V(ie,-1)}),De(2),p(w,T)};H(Pe,w=>{o&&w(Ce)}),p(s,ce),$()}W(["click"]);export{qt as default};
