// filename: js/app.js (colocar em js/app.js)
// Lógica do modal de doações, instruções dinâmicas e validação
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) setTimeout(()=> loadingScreen.style.display='none', 900);

  const donateBtn = document.getElementById('donate-btn');
  const donationModal = document.getElementById('donationModal');
  const donationOverlay = document.getElementById('donationOverlay');
  const closeDonationModal = document.getElementById('closeDonationModal');
  const cancelDonation = document.getElementById('cancelDonation');
  const finalizeDonation = document.getElementById('finalizeDonation');
  const donationForm = document.getElementById('donationForm');
  const amountBtns = Array.from(document.querySelectorAll('.amount-btn'));
  const customAmount = document.getElementById('customAmount');
  const paymentOptionEls = Array.from(document.querySelectorAll('.payment-option'));
  const paymentDetails = document.getElementById('paymentDetails');
  const toast = document.getElementById('toast');

  // Payment info - personalize aqui
  const PAYMENT_INFO = {
    emola: {
      title: 'Doação via e-Mola',
      lines: [
        'Abra a app e-Mola e escolha "Enviar Dinheiro".',
        'Número (e-Mola): +258879233624',
        'Referência: DOACAO GUPHASSANA',
        'Envie comprovativo para info.guphassana@gmail.com para recibo.'
      ]
    },
    mpesa: {
      title: 'Doação via M-Pesa',
      lines: [
        'Abra o serviço M-Pesa no telemóvel.',
        'Enviar para: +25882xxxxxxx (substituir pelo número real).',
        'Referência: DOACAO GUPHASSANA',
        'Guarde o comprovativo e envie por email se quiser recibo.'
      ]
    },
    bank: {
      title: 'Transferência Bancária',
      lines: [
        'Banco: [Nome do Banco]',
        'Titular: Associação Guphassana',
        'NIB/IBAN: 0000 0000 0000 0000',
        'Usar referência: DOACAO GUPHASSANA e enviar comprovativo por email.'
      ]
    },
    paypal: {
      title: 'PayPal / Cartão (exemplo)',
      lines: [
        'Será redirecionado para PayPal (ou poderá usar cartão).',
        'Link: https://paypal.me/guphassana (substituir pelo link real).',
        'Após pagamento, envie comprovativo para info.guphassana@gmail.com.'
      ],
      redirect: 'https://paypal.me/guphassana'
    }
  };

  // State
  let selectedAmount = 0;
  let selectedMethod = null;

  // Helpers
  function showModal() {
    donationModal.setAttribute('aria-hidden','false');
    donationModal.classList.add('show');
    // focus management
    const firstFocusable = donationModal.querySelector('button, [href], input, select, textarea');
    if (firstFocusable) firstFocusable.focus();
    renderPaymentDetails();
    updateFinalizeButton();
  }
  function hideModal() {
    donationModal.setAttribute('aria-hidden','true');
    donationModal.classList.remove('show');
    // return focus to donateBtn
    donateBtn.focus();
  }
  function showToast(msg, ms=3500) {
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(()=> { toast.hidden = true; }, ms);
  }
  function formatNumber(n){ return Number(n).toLocaleString(); }

  // Amount buttons
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount = parseInt(btn.dataset.amount, 10) || 0;
      customAmount.value = '';
      renderPaymentDetails();
      updateFinalizeButton();
    });
  });

  // custom amount input
  if (customAmount) {
    customAmount.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      selectedAmount = parseInt(customAmount.value, 10) || 0;
      renderPaymentDetails();
      updateFinalizeButton();
    });
  }

  // payment options behavior
  paymentOptionEls.forEach(label => {
    label.addEventListener('click', () => {
      // toggle radio inside
      const input = label.querySelector('input[type="radio"]');
      if (input) input.checked = true;
      paymentOptionEls.forEach(l => l.classList.remove('active'));
      label.classList.add('active');
      selectedMethod = label.dataset.method;
      renderPaymentDetails();
      updateFinalizeButton();
    });
  });

  // render payment details
  function renderPaymentDetails() {
    if (!paymentDetails) return;
    if (!selectedMethod) {
      paymentDetails.innerHTML = `<p style="color:var(--muted)">Selecione um método de pagamento para ver instruções.</p>`;
      return;
    }
    const info = PAYMENT_INFO[selectedMethod];
    if (!info) {
      paymentDetails.innerHTML = `<p style="color:var(--muted)">Instruções indisponíveis.</p>`;
      return;
    }
    let html = `<h4 style="margin:0 0 8px 0;color:var(--primary)">${info.title}</h4><ol>`;
    info.lines.forEach(line => html += `<li style="margin-bottom:6px">${line}</li>`);
    html += `</ol>`;
    if (selectedAmount && selectedAmount > 0) {
      html += `<p style="font-weight:700;margin-top:8px">Valor: ${formatNumber(selectedAmount)} MT</p>`;
    } else {
      html += `<p style="color:var(--muted);margin-top:8px">Valor: — selecione um valor</p>`;
    }
    // for PayPal show link as clickable
    if (info.redirect) {
      html += `<p style="margin-top:8px"><a href="${info.redirect}" target="_blank" rel="noopener">Abrir PayPal (nova aba)</a></p>`;
    }
    paymentDetails.innerHTML = html;
  }

  function updateFinalizeButton() {
    if (selectedMethod && selectedAmount && selectedAmount > 0) {
      finalizeDonation.disabled = false;
    } else {
      finalizeDonation.disabled = true;
    }
  }

  // finalize action (simulation)
  donationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedMethod || !selectedAmount || selectedAmount <= 0) {
      showToast('Selecione método e valor válidos.');
      return;
    }
    // If PayPal - open redirect and show toast
    const info = PAYMENT_INFO[selectedMethod];
    if (info && info.redirect) {
      window.open(info.redirect, '_blank', 'noopener');
      showToast('A abrir PayPal em nova aba...');
      // optionally keep modal open for user to confirm
      hideModal();
      return;
    }

    // For other methods, show simulated confirmation + instructions visible
    showToast(`Obrigado! Instruções para ${selectedMethod.toUpperCase()} exibidas`);
    // keep modal open so user can follow instructions, or close it automatically:
    // hideModal();
  });

  // Open / close events
  donateBtn && donateBtn.addEventListener('click', showModal);
  closeDonationModal && closeDonationModal.addEventListener('click', hideModal);
  cancelDonation && cancelDonation.addEventListener('click', hideModal);
  donationOverlay && donationOverlay.addEventListener('click', hideModal);

  // close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && donationModal.getAttribute('aria-hidden') === 'false') {
      hideModal();
    }
  });

  // init default instructions
  renderPaymentDetails();
  updateFinalizeButton();
});
