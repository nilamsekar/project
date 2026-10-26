var rows = [], filterStatus = '';

function badge(s) {
  var c = { 'Belum Bayar': 'b-belum', 'Menunggu Verifikasi': 'b-menunggu', 'Lunas': 'b-lunas', 'Terlambat': 'b-telat' }[s];
  return '<span class="badge ' + c + '">' + s + '</span>';
}

function baris(t, s) {
  return '<tr class="row" tabindex="0" data-id="' + t.id_tagihan + '">' +
    '<td data-label="Periode"><b>' + t.periode + '</b></td>' +
    '<td data-label="Total" class="num">' + Kos.rp(Kos.total(t)) + '</td>' +
    '<td data-label="Jatuh tempo">' + t.jatuh_tempo + '</td>' +
    '<td data-label="Status">' + badge(s) + '</td></tr>';
}

function render() {
  var aktif = '', riwayat = '', belum = 0, nA = 0, nL = 0, nT = 0;
  rows.forEach(function (t) {
    var s = Kos.status(t);
    if (s === 'Lunas') nL++; else { nA++; belum += Kos.total(t); }
    if (s === 'Terlambat') nT++;
    if (filterStatus && s !== filterStatus) return;
    if (s === 'Lunas') riwayat += baris(t, s); else aktif += baris(t, s);
  });
  $('#tb-aktif').html(aktif || '<tr><td colspan="4">Tidak ada tagihan aktif untuk filter ini.</td></tr>');
  $('#tb-riwayat').html(riwayat || '<tr><td colspan="4">Tidak ada riwayat lunas untuk filter ini.</td></tr>');
  $('#total-belum').text(Kos.rp(belum));
  $('#n-aktif').text(nA);
  $('#n-lunas').text(nL);
  $('#n-telat').text(nT);
  $('#rincian').prop('hidden', true);
}

function rincian(id) {
  var t = rows.filter(function (x) { return x.id_tagihan === id; })[0];
  $('.tbl tr.row').removeClass('sel').filter('[data-id="' + id + '"]').addClass('sel');
  $('#rincian-judul').text('Rincian tagihan ' + t.periode);
  $('#rincian-body').html(t.items.map(function (i) {
    return '<div class="struk-row"><span>' + i.keterangan + '</span><b>' + Kos.rp(i.nominal) + '</b></div>';
  }).join(''));
  $('#rincian-total').text(Kos.rp(Kos.total(t)));
  var vb = { menunggu: ['b-menunggu', 'Menunggu'], valid: ['b-lunas', 'Valid'], ditolak: ['b-telat', 'Ditolak'] };
  $('#rincian-bayar').html('<p class="struk-top sub">Riwayat pembayaran</p>' + ((t.pembayaran || []).map(function (p) {
    var v = vb[p.status_verifikasi];
    return '<div class="struk-row"><span>' + p.tgl_bayar + ' (' + p.metode + ')</span><span><b>' + Kos.rp(p.nominal) +
      '</b> <span class="badge ' + v[0] + '">' + v[1] + '</span></span></div>';
  }).join('') || '<p class="kosong">Belum ada pembayaran.</p>'));
  $('#rincian-badge').html(badge(Kos.status(t)));
  $('#rincian').prop('hidden', false)[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

window.initTagihan = function () {
  filterStatus = '';
  $('#tgl-sim').val(Kos.sim()).on('change', function () {
    sessionStorage.setItem('tglSim', this.value || Kos.today());
    render();
  });
  $('.chips').on('click', '.chip', function () {
    $('.chip').removeClass('on'); $(this).addClass('on');
    filterStatus = $(this).data('status');
    render();
  });
  $('.tbl').on('click', 'tr.row', function () { rincian($(this).data('id')); })
    .on('keydown', 'tr.row', function (e) { if (e.key === 'Enter') rincian($(this).data('id')); });
  Kos.load(function (d) { rows = d; render(); });
};
