// Reveal on scroll. Hidden state is applied by JS so the page still reads
// fully if scripting is unavailable.
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var els = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window && !reduce){
  els.forEach(function(el){ el.classList.add('pre'); });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.remove('pre'); io.unobserve(e.target); }
    });
  }, {threshold:0.12});
  els.forEach(function(el){ io.observe(el); });
}

// custom cursor dot, fine pointers only
if(window.matchMedia('(pointer: fine)').matches && !reduce){
  var dot = document.getElementById('cursor-dot');
  document.addEventListener('mousemove', function(e){
    dot.style.opacity = 1;
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', function(){ dot.style.opacity = 0; });
}
