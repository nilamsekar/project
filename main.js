var Kos = {
  data: null,
  today: function () {
    var d = new Date(), p = function (n) { return ('0' + n).slice(-2); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  },
  sim: function () { return sessionStorage.getItem('tglSim') || Kos.today(); },
  rp: function (n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); },
  total: function (t) { return t.items.reduce(function (a, i) { return a + i.nominal; }, 0); },
  label: { belum_bayar: 'Belum Bayar', menunggu_verifikasi: 'Menunggu Verifikasi', lunas: 'Lunas', terlambat: 'Terlambat' },
  status: function (t) {
    var ov = JSON.parse(sessionStorage.getItem('tagihanStatus') || '{}');
    var s = ov[t.id_tagihan] || (t.status === 'terlambat' ? 'belum_bayar' : t.status);
    if (s === 'belum_bayar' && t.jatuh_tempo < Kos.sim()) s = 'terlambat';
    return Kos.label[s];
  },
  load: function (cb) {
    if (Kos.data) return cb(Kos.data);
    $.getJSON('data/tagihan.json', function (d) { Kos.data = d; cb(d); })
      .fail(function () { alert('Data gagal dimuat. Jalankan lewat Live Server.'); });
  }
};

$(function () {
  var $k = $('#konten'), home = $k.html(), idx = 0, timer;

  function show(n) {
    var $s = $('.slide');
    idx = (n + $s.length) % $s.length;
    $s.removeClass('active').eq(idx).addClass('active');
  }
  function auto() {
    clearInterval(timer);
    timer = setInterval(function () { show(idx + 1); }, 5000);
  }

  $k.on('click', '.next', function () { show(idx + 1); auto(); });
  $k.on('click', '.prev', function () { show(idx - 1); auto(); });

  $(document).on('click', '[data-load]', function (e) {
    e.preventDefault();
    var $a = $(this), init = $a.data('init');
    if ($a.closest('.nav').length) { $('.nav a').removeClass('active'); $a.addClass('active'); }
    $('.nav').removeClass('open');
    clearInterval(timer);
    $k.load($a.data('load'), function (r, s) {
      if (s === 'error') return $k.html('<p class="err">Halaman gagal dimuat. Jalankan lewat Live Server.</p>');
      if (init) window[init]();
      window.scrollTo(0, 0);
    });
  });

  $(document).on('click', '[data-home]', function (e) {
    e.preventDefault();
    $('.nav a').removeClass('active');
    $('.nav a[data-home]').addClass('active');
    $('.nav').removeClass('open');
    $k.html(home); idx = 0; auto();
    window.scrollTo(0, 0);
  });

  $('.menu-btn').on('click', function () { $('.nav').toggleClass('open'); });
  auto();
});
