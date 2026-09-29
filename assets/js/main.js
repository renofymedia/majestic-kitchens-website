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
      cursor.style.transform='translate('+(cx-17)+'px,'+(cy-17)+'px)';
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
