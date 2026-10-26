function opsi() {
  Kos.load(function (list) {
    var h = '<option value="">-- Pilih tagihan --</option>';
    list.forEach(function (t) {
      var s = Kos.status(t);
      if (s === 'Belum Bayar' || s === 'Terlambat') {
        h += '<option value="' + t.id_tagihan + '">' + t.periode + ' - ' + Kos.rp(Kos.total(t)) + ' (' + s + ')</option>';
      }
    });
    $('#id_tagihan').html(h);
  });
}

function setErr(name, msg) {
  $('[data-for="' + name + '"]').text(msg);
  $('[name="' + name + '"]').toggleClass('invalid', !!msg);
}

function validasi() {
  var id = $('#id_tagihan').val(), tgl = $('#tgl_bayar').val(), n = $('#nominal').val();
  var m = $('input[name="metode"]:checked').val(), f = $('#bukti')[0].files[0];
  var t = (Kos.data || []).filter(function (x) { return x.id_tagihan === id; })[0];
  var errs = {
    id_tagihan: t ? '' : 'Pilih tagihan yang belum lunas.',
    tgl_bayar: !tgl ? 'Tanggal bayar wajib diisi.' : tgl > Kos.sim() ? 'Tanggal bayar tidak boleh di masa depan.' : '',
    nominal: (n === '' || Number(n) <= 0) ? 'Nominal wajib diisi angka lebih dari 0.' : '',
    metode: m ? '' : 'Pilih tunai atau transfer.',
    bukti_bayar: (m === 'transfer' && !f) ? 'Bukti wajib diunggah untuk transfer.'
      : (f && !/\.(jpe?g|png|pdf)$/i.test(f.name)) ? 'Format harus JPG, PNG, atau PDF.'
      : (f && f.size > 2 * 1024 * 1024) ? 'Ukuran file maksimal 2 MB.' : ''
  };
  var ok = true;
  Object.keys(errs).forEach(function (k) {
    setErr(k, errs[k]);
    if (errs[k]) ok = false;
  });
  return ok;
}

window.initBayar = function () {
  opsi();
  $('#tgl_bayar').attr('max', Kos.sim());

  $('#id_tagihan').on('change', function () {
    var id = this.value;
    var t = (Kos.data || []).filter(function (x) { return x.id_tagihan === id; })[0];
    $('#nominal').val(t ? Kos.total(t) : '');
    $('#ringkas').html('<p class="struk-top">Ringkasan tagihan</p>' + (t ?
      t.items.map(function (i) { return '<div class="struk-row"><span>' + i.keterangan + '</span><b>' + Kos.rp(i.nominal) + '</b></div>'; }).join('') +
      '<div class="struk-total"><span>Total ' + t.periode + '</span><b>' + Kos.rp(Kos.total(t)) + '</b></div>' :
      '<p class="kosong">Pilih tagihan untuk melihat rinciannya.</p>'));
  });

  $('input[name="metode"]').on('change', function () {
    $('#bukti-info').text(this.value === 'transfer' ? '(wajib untuk transfer)' : '(opsional untuk tunai)');
  });

  $('#bukti').on('change', function () {
    var f = this.files[0];
    $('#preview-nama').text(f ? 'File dipilih: ' + f.name + ' (' + Math.round(f.size / 1024) + ' KB)' : 'Belum ada file dipilih.');
  });

  $('#form-bayar').on('submit', function (e) {
    e.preventDefault();
    if (!validasi()) return;
    var form = this, id = $('#id_tagihan').val();
    $('#hasil').removeClass('ok').text('Mengirim...');
    $.ajax({
      url: 'https://httpbin.org/post',
      method: 'POST',
      data: new FormData(form),
      processData: false,
      contentType: false,
      dataType: 'json'
    }).done(function () {
      var ov = JSON.parse(sessionStorage.getItem('tagihanStatus') || '{}');
      ov[id] = 'menunggu_verifikasi';
      sessionStorage.setItem('tagihanStatus', JSON.stringify(ov));
      form.reset();
      $('#preview-nama').text('Belum ada file dipilih.');
      opsi();
      $('#hasil').addClass('ok').text('Bukti terkirim, status: Menunggu Verifikasi');
    }).fail(function () {
      $('#hasil').text('Gagal mengirim. Periksa koneksi lalu coba lagi.');
    });
  });
};
