/* Majestic Kitchens — shared interactions */
(function(){
  'use strict';

  /* ---------- preloader ---------- */
  var loader=document.getElementById('loader');
  function hideLoader(){ if(loader) loader.classList.add('done'); }
  window.addEventListener('load',function(){ setTimeout(hideLoader,900); });
  setTimeout(hideLoader,3500); // safety

  /* ---------- page transition wipe ---------- */
  var wipe=document.getElementById('wipe');
  document.addEventListener('click',function(ev){
    var a=ev.target.closest('a');
    if(!a||!wipe) return;
    var href=a.getAttribute('href');
    if(!href||href.charAt(0)==='#'||a.target==='_blank'||href.indexOf('mailto:')===0||href.indexOf('tel:')===0) return;
    if(!/\.html(#.*)?$/.test(href)) return;
    ev.preventDefault();
    wipe.classList.remove('away');wipe.classList.add('go');
    setTimeout(function(){ window.location.href=href; },620);
  });
  // wipe away on arrival
  if(wipe){ requestAnimationFrame(function(){ wipe.classList.add('away'); }); }

  /* ---------- custom cursor ---------- */
  var cursor=document.getElementById('cursor');
  if(cursor&&window.matchMedia('(pointer:fine)').matches){
    var cx=0,cy=0,tx=0,ty=0,shown=false;
    document.addEventListener('mousemove',function(e){
      tx=e.clientX;ty=e.clientY;
      if(!shown){shown=true;cursor.classList.add('on');cx=tx;cy=ty;}
    });
    (function loop(){
      cx+=(tx-cx)*0.18; cy+=(ty-cy)*0.18;
      cursor.style.transform='translate('+cx+'px,'+cy+'px)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,.btn,.g-item,.faq-q,.t-dots button').forEach(function(el){
      el.addEventListener('mouseenter',function(){cursor.classList.add('grow')});
      el.addEventListener('mouseleave',function(){cursor.classList.remove('grow')});
    });
  }

  /* ---------- nav state ---------- */
  var nav=document.getElementById('nav');
  var heroBg=document.getElementById('heroBg');
  function onScroll(){
    if(nav) nav.classList.toggle('scrolled',window.scrollY>60);
    if(heroBg&&window.scrollY<window.innerHeight*1.2){
      heroBg.style.transform='translateY('+(window.scrollY*0.28)+'px)';
    }
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* active nav link */
  var page=(location.pathname.split('/').pop()||'index.html').split('#')[0];
  document.querySelectorAll('.nav-links a').forEach(function(a){
    var h=a.getAttribute('href');
    if(h===page||(page===''&&h==='index.html')) a.classList.add('active');
  });

  /* ---------- mobile menu ---------- */
  var burger=document.getElementById('burger'),menu=document.getElementById('mobileMenu');
  if(burger&&menu){
    burger.addEventListener('click',function(){
      burger.classList.toggle('open');menu.classList.toggle('open');
      document.body.style.overflow=menu.classList.contains('open')?'hidden':'';
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        burger.classList.remove('open');menu.classList.remove('open');document.body.style.overflow='';
      });
    });
  }

  /* ---------- scroll reveals ---------- */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);} });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* ---------- animated counters ---------- */
  var cio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return; cio.unobserve(e.target);
      var el=e.target,to=parseFloat(el.dataset.to),dec=parseInt(el.dataset.dec||'0',10),t0=null;
      function tick(t){
        if(!t0)t0=t; var p=Math.min((t-t0)/1600,1),v=to*(1-Math.pow(1-p,3));
        el.textContent=dec?v.toFixed(dec):Math.round(v);
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  },{threshold:.5});
  document.querySelectorAll('.count').forEach(function(el){cio.observe(el);});

  /* ---------- testimonial slider ---------- */
  var slider=document.getElementById('tSlider');
  if(slider){
    var track=slider.querySelector('.t-track'),
        slides=track.children.length,
        dots=slider.querySelector('.t-dots'),
        idx=0,timer=null;
    for(var i=0;i<slides;i++){
      var d=document.createElement('button');
      d.setAttribute('aria-label','Go to slide '+(i+1));
      (function(n){ d.addEventListener('click',function(){go(n);restart();}); })(i);
      dots.appendChild(d);
    }
    function go(n){
      idx=(n+slides)%slides;
      track.style.transform='translateX(-'+(idx*100)+'%)';
      dots.querySelectorAll('button').forEach(function(b,j){b.classList.toggle('on',j===idx);});
    }
    function restart(){ clearInterval(timer); timer=setInterval(function(){go(idx+1);},6000); }
    var prev=document.getElementById('tPrev'),next=document.getElementById('tNext');
    if(prev) prev.addEventListener('click',function(){go(idx-1);restart();});
    if(next) next.addEventListener('click',function(){go(idx+1);restart();});
    slider.addEventListener('mouseenter',function(){clearInterval(timer);});
    slider.addEventListener('mouseleave',restart);
    go(0);restart();
  }

  /* ---------- gallery lightbox ---------- */
  var lb=document.getElementById('lightbox');
  if(lb){
    var lbImg=lb.querySelector('img'),lbCap=document.getElementById('lbCap'),
        items=Array.prototype.slice.call(document.querySelectorAll('.g-item')),
        cur=0;
    function openLb(n){
      cur=(n+items.length)%items.length;
      var img=items[cur].querySelector('img');
      lbImg.src=img.src; lbImg.alt=img.alt;
      var cap=items[cur].querySelector('figcaption');
      if(cap){
        var kicker=cap.querySelector('small'),
            k=kicker?kicker.textContent.trim():'',
            rest=cap.textContent.replace(k,'').trim();
        lbCap.textContent=k?(k+' — '+rest):rest;
      } else { lbCap.textContent=''; }
      lb.classList.add('open'); document.body.style.overflow='hidden';
    }
    function closeLb(){ lb.classList.remove('open'); document.body.style.overflow=''; }
    items.forEach(function(it,n){ it.addEventListener('click',function(){openLb(n);}); });
    document.getElementById('lbClose').addEventListener('click',closeLb);
    document.getElementById('lbPrev').addEventListener('click',function(e){e.stopPropagation();openLb(cur-1);});
    document.getElementById('lbNext').addEventListener('click',function(e){e.stopPropagation();openLb(cur+1);});
    lb.addEventListener('click',function(e){ if(e.target===lb) closeLb(); });
    document.addEventListener('keydown',function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key==='Escape') closeLb();
      if(e.key==='ArrowLeft') openLb(cur-1);
      if(e.key==='ArrowRight') openLb(cur+1);
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q=item.querySelector('.faq-q'),a=item.querySelector('.faq-a');
    q.addEventListener('click',function(){
      var open=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(o){
        o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight=null;
      });
      if(!open){ item.classList.add('open'); a.style.maxHeight=a.scrollHeight+'px'; }
    });
  });

  /* ---------- quote form ---------- */
  var form=document.getElementById('quoteForm');
  if(form){
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var name=document.getElementById('fName'),phone=document.getElementById('fPhone'),ok=true;
      [name,phone].forEach(function(f){
        var bad=!f.value.trim();
        f.style.borderColor=bad?'#c0564f':'';
        if(bad) ok=false;
      });
      if(!ok) return;
      document.getElementById('formFields').style.display='none';
      document.getElementById('formThanks').style.display='block';
    });
  }

  /* ---------- footer year ---------- */
  var yr=document.getElementById('yr');
  if(yr) yr.textContent=new Date().getFullYear();
})();

/* ============ ENHANCEMENT PASS: MOTION ============ */
(function(){
  'use strict';
  var fine = window.matchMedia('(pointer:fine)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* body.ready — fires once the preloader lifts, starts hero intro */
  var readyFired = false;
  function fireReady(){ if(readyFired) return; readyFired = true; document.body.classList.add('ready'); }
  var lint = setInterval(function(){
    var l = document.getElementById('loader');
    if(l && l.classList.contains('done')){ clearInterval(lint); setTimeout(fireReady, 120); }
  }, 100);
  setTimeout(function(){ clearInterval(lint); fireReady(); }, 4500);

  /* nav: hide on scroll down, reveal on scroll up */
  var nav = document.getElementById('nav'), lastY = window.scrollY, menu = document.getElementById('mobileMenu');
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    if(nav && !(menu && menu.classList.contains('open'))){
      if(y > 500 && y > lastY + 4) nav.classList.add('nav-hide');
      else if(y < lastY - 4 || y < 500) nav.classList.remove('nav-hide');
    }
    lastY = y;
  }, {passive:true});

  /* velocity-reactive marquee */
  var track = document.querySelector('.marquee-track');
  if(track && !reduced){
    track.style.animation = 'none';
    var pos = 0, vel = 0, lastSY = window.scrollY;
    window.addEventListener('scroll', function(){
      var y = window.scrollY; vel += (y - lastSY) * 0.06; lastSY = y;
    }, {passive:true});
    (function mq(){
      vel *= 0.94;
      pos -= (1.1 + Math.min(Math.abs(vel), 14));
      var h = track.scrollWidth / 2;
      if(h > 0 && pos <= -h) pos += h;
      track.style.transform = 'translateX(' + pos + 'px)';
      requestAnimationFrame(mq);
    })();
  }

  /* services: image preview follows cursor */
  if(fine && !reduced){
    var pv = document.createElement('div'); pv.id = 'svcPreview';
    var pim = document.createElement('img'); pv.appendChild(pim); document.body.appendChild(pv);
    var px = 0, py = 0, tx2 = 0, ty2 = 0;
    document.addEventListener('mousemove', function(e){ tx2 = e.clientX + 30; ty2 = e.clientY - 105; });
    (function follow(){
      px += (tx2 - px) * 0.12; py += (ty2 - py) * 0.12;
      var s = pv.classList.contains('on') ? 1 : 0.92;
      pv.style.transform = 'translate(' + px + 'px,' + py + 'px) scale(' + s + ')';
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll('.svc-row[data-img]').forEach(function(row){
      row.addEventListener('mouseenter', function(){ pim.src = row.getAttribute('data-img'); pv.classList.add('on'); });
      row.addEventListener('mouseleave', function(){ pv.classList.remove('on'); });
    });
  }

  /* parallax: inner page heroes + craft imagery */
  var plxEls = [];
  document.querySelectorAll('.page-hero .ph-bg').forEach(function(el){ plxEls.push({el:el, s:0.12}); });
  document.querySelectorAll('.split .img-frame img').forEach(function(el){ plxEls.push({el:el, s:0.06, scale:1.18}); });
  if(plxEls.length && !reduced){
    (function ploop(){
      var vh = window.innerHeight;
      plxEls.forEach(function(o){
        var r = o.el.getBoundingClientRect();
        if(r.bottom < 0 || r.top > vh) return;
        var off = (r.top + r.height / 2 - vh / 2) * o.s;
        o.el.style.transform = 'translateY(' + (-off).toFixed(1) + 'px)' + (o.scale ? ' scale(' + o.scale + ')' : '');
      });
      requestAnimationFrame(ploop);
    })();
  }

  /* cursor VIEW state over gallery items */
  var cursor = document.getElementById('cursor');
  if(cursor && fine){
    document.querySelectorAll('.g-item').forEach(function(g){
      g.addEventListener('mouseenter', function(){ cursor.classList.add('view'); });
      g.addEventListener('mouseleave', function(){ cursor.classList.remove('view'); });
    });
  }

  /* preloader percentage counter */
  var loader = document.getElementById('loader');
  if(loader){
    var pct = document.createElement('div'); pct.className = 'pct'; pct.textContent = '00';
    loader.appendChild(pct);
    var n = 0, pi = setInterval(function(){
      n = Math.min(100, n + Math.ceil(Math.random() * 14));
      pct.textContent = (n < 10 ? '0' : '') + n;
      if(n >= 100) clearInterval(pi);
    }, 90);
  }

  /* footer giant wordmark */
  document.querySelectorAll('footer .wrap').forEach(function(w){
    var fb = w.querySelector('.f-bottom');
    if(fb && !w.querySelector('.f-giant')){
      var g = document.createElement('div');
      g.className = 'f-giant'; g.textContent = 'MAJESTIC'; g.setAttribute('aria-hidden', 'true');
      w.insertBefore(g, fb);
    }
  });

  /* magnetic buttons */
  if(fine && !reduced){
    document.querySelectorAll('.btn.solid').forEach(function(b){
      b.addEventListener('mousemove', function(e){
        var r = b.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        b.style.transform = 'translate(' + (x * 0.12).toFixed(1) + 'px,' + (y * 0.18).toFixed(1) + 'px)';
      });
      b.addEventListener('mouseleave', function(){ b.style.transform = ''; });
    });
  }

  /* word-by-word heading reveals */
  document.querySelectorAll('.sec-head h2, .cta-banner h2').forEach(function(h){
    var frag = document.createDocumentFragment(), di = 0;
    Array.prototype.slice.call(h.childNodes).forEach(function(nd){
      var isEl = nd.nodeType !== 3, text = nd.textContent;
      text.split(/(\s+)/).forEach(function(part){
        if(part === '') return;
        var w = document.createElement('span'); w.className = 'w';
        var s = document.createElement('span'); s.textContent = part;
        s.style.transitionDelay = (di * 45) + 'ms'; di++;
        w.appendChild(s);
        if(/^\s+$/.test(part)){ frag.appendChild(w); frag.appendChild(document.createTextNode(' ')); }
        else if(isEl){ var c = nd.cloneNode(false); c.appendChild(w); frag.appendChild(c); }
        else frag.appendChild(w);
      });
    });
    h.innerHTML = ''; h.appendChild(frag);
    var io2 = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ h.classList.add('words-in'); io2.disconnect(); } });
    }, {threshold: 0.3});
    io2.observe(h);
  });
})();
