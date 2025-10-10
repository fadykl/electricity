
(function(){
  const qInput = document.querySelector('#emp-q');
  const statusFilter = document.querySelector('#emp-status');
  const sortSel = document.querySelector('#emp-sort');
  const cards = Array.from(document.querySelectorAll('.emp-card'));
  if(!cards.length) return;
  function normalize(s){ return (s||'').toString().trim().toLowerCase(); }
  function apply(){
    const q = normalize(qInput && qInput.value);
    const status = statusFilter ? statusFilter.value : '';
    const sortedBy = sortSel ? sortSel.value : '';
    cards.forEach(c => {
      const hay = normalize(c.dataset.customer + ' ' + c.dataset.branch);
      const paid = c.dataset.paid === '1';
      const okQ = !q || hay.includes(q);
      const okStatus = !status || (status === 'paid' ? paid : !paid);
      c.style.display = (okQ && okStatus) ? '' : 'none';
    });
    if (sortedBy) {
      const grid = cards[0].parentElement;
      const key = sortedBy.split(':')[0];
      const dir = sortedBy.split(':')[1] || 'desc';
      const mult = dir === 'asc' ? 1 : -1;
      const getVal = (c) => {
        switch(key){
          case 'amount': return parseFloat(c.dataset.amount||'0');
          case 'kwh': return parseInt(c.dataset.kwh||'0', 10);
          case 'date': return Date.parse(c.dataset.date || '1970-01-01');
          default: return 0;
        }
      };
      const visCards = cards.filter(c => c.style.display !== 'none');
      visCards.sort((a,b) => (getVal(a) - getVal(b)) * mult);
      visCards.forEach(c => grid.appendChild(c));
    }
  }
  ['input','change'].forEach(ev => {
    if(qInput) qInput.addEventListener(ev, apply);
    if(statusFilter) statusFilter.addEventListener(ev, apply);
    if(sortSel) sortSel.addEventListener(ev, apply);
  });
  apply();
})();
// when opening:
function openModal(form){
  pendingForm = form;
  modal.classList.remove('mp-hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('mp-open');      // ← stop background scrolling
}

// when closing:
function closeModal(){
  modal.classList.add('mp-hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('mp-open');   // ← restore scrolling
  pendingForm = null;
}

