/* 豆豆学科AI万能提问模板 · 渲染与交互 */
(function () {
  'use strict';
  var D = window.DD || {};

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function mk(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (html != null) { e.innerHTML = html; }
    return e;
  }
  function clear(n) { while (n && n.firstChild) { n.removeChild(n.firstChild); } }
  function btn(txt, cls) { var b = mk('button', cls, txt); b.type = 'button'; return b; }

  /* ---------- 提示 ---------- */
  var tTimer = null;
  function toast(msg) {
    var t = $('#toast');
    if (!t) { return; }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }

  /* ---------- 复制（含 file:// 兜底） ---------- */
  function doCopy(text, el) {
    function ok() {
      toast('✅ 已复制，到 AI 对话框粘贴即可');
      if (el) {
        var raw = el.getAttribute('data-raw') || el.textContent;
        el.setAttribute('data-raw', raw);
        el.textContent = '✅ 已复制';
        setTimeout(function () { el.textContent = raw; }, 1500);
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { fbCopy(text, ok); });
    } else { fbCopy(text, ok); }
  }
  function fbCopy(text, ok) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { ta.setSelectionRange(0, ta.value.length); } catch (e) {}
    var done = false;
    try { done = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    if (done) { ok(); } else { toast('❌ 复制失败，请长按文本手动复制'); }
  }

  /* ---------- 模板卡 ---------- */
  function tplCard(e, opt) {
    opt = opt || {};
    var prompt = e.p || '';
    if (opt.swap && prompt) {
      for (var i = 0; i < opt.swap.length; i++) {
        prompt = prompt.split(opt.swap[i][0]).join(opt.swap[i][1]);
      }
    }
    var c = mk('div', prompt ? 'tpl' : 'tpl bad');
    if (opt.id) { c.id = opt.id; }

    var h = mk('div', 'tpl-head');
    h.appendChild(mk('span', 'tpl-title', esc(e.t)));
    if (opt.tag) { h.appendChild(mk('span', 'tpl-tag', esc(opt.tag))); }
    c.appendChild(h);

    if (prompt) {
      var pre = mk('pre', 'tpl-pre fold', esc(prompt));
      c.appendChild(pre);
      var act = mk('div', 'tpl-act');
      var cb = btn('📋 复制提示词', 'copy-btn');
      cb.addEventListener('click', function () { doCopy(prompt, cb); });
      act.appendChild(cb);
      if (prompt.length > 96) {
        var mb = btn('展开全文 ▾', 'more-btn');
        mb.addEventListener('click', function () {
          var stillFold = pre.classList.toggle('fold');
          mb.textContent = stillFold ? '展开全文 ▾' : '收起 ▴';
        });
        act.appendChild(mb);
      }
      c.appendChild(act);
    }
    (e.x || []).forEach(function (x) {
      var cls = 'note' + (x[0] === 'quote' ? ' q' : '');
      var icon = x[0] === 'example' ? '📌 ' : '';
      c.appendChild(mk('div', cls, icon + esc(x[1])));
    });
    return c;
  }

  /* ---------- 分组选择器 ---------- */
  function selectBar(host, items, cur, onPick) {
    clear(host);
    items.forEach(function (it) {
      var b = btn(it.l, 'chip' + (it.v === cur ? ' on' : ''));
      b.addEventListener('click', function () { onPick(it.v); });
      host.appendChild(b);
    });
  }

  /* =========== 首页 =========== */
  function renderHome() {
    var box = $('#home-stats');
    if (!box) { return; }
    var m = D.meta || {};
    var rows = [
      [m.entries, '收录提示词'],
      [m.variants, '可组合套数'],
      [9, '覆盖年级'],
      [9, '覆盖学科']
    ];
    clear(box);
    rows.forEach(function (r) {
      var s = mk('div', 'stat');
      s.appendChild(mk('span', 'num', esc(r[0])));
      s.appendChild(mk('span', 'lb', esc(r[1])));
      box.appendChild(s);
    });
    var d1 = $('#d-quanke'), d2 = $('#d-spec'), d3 = $('#d-method');
    if (d1) { d1.textContent = '8 大专项功能 · 小学 ' + (m.quanke - 24) + ' 条 + 初中 ' + 24 + ' 条基准版，切换学科自动改写 = ' + m.variants + ' 套'; }
    if (d2) { d2.textContent = '共 ' + m.spec + ' 条：初中 ' + m.specMid + ' 条 / ' + m.groupsMid + ' 组，小学 ' + m.specPri + ' 条 / ' + m.groupsPri + ' 组'; }
    if (d3) { d3.textContent = '4S / 5S 提问法 · 五环公式 · 铁规矩 · 升级秘诀 · 家长陪问三步法'; }
  }

  /* =========== 全科万能提问 =========== */
  function renderQuanke() {
    var host = $('#qk-list');
    if (!host) { return; }
    var GRADES = { pri: ['一', '二', '三', '四', '五', '六'], mid: ['七', '八', '九'] };
    var SUBS = {
      pri: ['语文', '数学', '英语'],
      mid: D.subjectOrder || ['语文', '数学', '英语']
    };
    var st = { band: 'pri', g: { pri: '一', mid: '七' }, s: '语文' };
    try {
      var raw = JSON.parse(localStorage.getItem('dd_quanke') || '{}');
      if (raw.band) { st.band = raw.band; }
      if (raw.g) { st.g = raw.g; }
      if (raw.s) { st.s = raw.s; }
    } catch (e) {}
    function save() { try { localStorage.setItem('dd_quanke', JSON.stringify(st)); } catch (e) {} }

    var bandBox = $('#qk-band'), gBox = $('#qk-grade'), sBox = $('#qk-subject'),
        sLb = $('#qk-subject-lb'), sNote = $('#qk-subjnote'), catBox = $('#qk-cat');

    /* 吸顶锚点条会随宽度换行（1~4 行），高度不定 → 实测回写 --catbar-h，
       供 .tpl 的 scroll-margin-top 使用，保证跳转后标题不被吸顶条遮住 */
    function syncCatH() {
      try {
        var h = catBox && catBox.offsetHeight;
        if (h && document.documentElement && document.documentElement.style) {
          document.documentElement.style.setProperty('--catbar-h', h + 'px');
        }
      } catch (e) {}
    }

    function buildCat() {
      clear(catBox);
      (D.quanke || []).forEach(function (f) {
        var b = btn(f.no + ' ' + f.name, 'cat');
        b.addEventListener('click', function () {
          var t = $('#fn-' + f.no);
          if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
          $$('.catbar .cat', catBox).forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on');
        });
        catBox.appendChild(b);
      });
      syncCatH();
    }

    function build() {
      clear(bandBox);
      [['pri', '小学版（1-6 年级）'], ['mid', '初中版（7-9 年级）']].forEach(function (it) {
        var b = btn(it[1], 'tab' + (st.band === it[0] ? ' on' : ''));
        b.addEventListener('click', function () {
          st.band = it[0];
          st.s = it[0] === 'pri' ? (SUBS.pri.indexOf(st.s) >= 0 ? st.s : '语文') : (SUBS.mid.indexOf(st.s) >= 0 ? st.s : '语文');
          save(); drawAll();
        });
        bandBox.appendChild(b);
      });
      selectBar(gBox, GRADES[st.band].map(function (x) { return { l: x + '年级', v: x }; }),
        st.g[st.band], function (v) { st.g[st.band] = v; save(); drawAll(); });
      if (sLb) { sLb.textContent = st.band === 'pri' ? '选择学科' : '选择学科（自动改写学科关键词）'; }
      selectBar(sBox, SUBS[st.band].map(function (x) { return { l: x, v: x }; }),
        st.s, function (v) { st.s = v; save(); drawAll(); });
      if (sNote) {
        sNote.textContent = st.band === 'mid'
          ? '💡 初中版原始内容为「语文」基准版；切换学科时将自动替换学科名与学科关键词（单位／易错点／考点分布／书写规范／必背清单），等价于该学科的原始版本。'
          : '💡 小学版每个年级、每个学科都是独立编写的模板，切换即切换为对应版本的原文。';
      }
    }

    function drawList() {
      clear(host);
      (D.quanke || []).forEach(function (f) {
        var sec = mk('section', 'sec');
        sec.appendChild(mk('h2', '', '<span class="no">' + f.no + '</span>' + esc(f.name)));
        if (st.band === 'pri') {
          var e = null;
          (f.pri || []).forEach(function (x) { if (x.g === st.g.pri && x.s === st.s) { e = x; } });
          if (e) { sec.appendChild(tplCard(e, { id: 'fn-' + f.no, tag: st.g.pri + '年级 · ' + st.s })); }
        } else {
          var m = null;
          (f.mid || []).forEach(function (x) { if (x.g === st.g.mid) { m = x; } });
          var sw = st.s === '语文' ? null : (D.swap || {})[st.s];
          if (m) { sec.appendChild(tplCard(m, { id: 'fn-' + f.no, tag: st.g.mid + '年级 · ' + st.s, swap: sw })); }
        }
        host.appendChild(sec);
      });
    }

    function drawAll() { build(); drawList(); }
    buildCat(); drawAll();
    /* 宽度变化 → 换行数变化 → 重测高度 */
    window.addEventListener('resize', syncCatH);
    window.addEventListener('orientationchange', syncCatH);
    if (document.readyState !== 'complete') { window.addEventListener('load', syncCatH); }
  }

  /* =========== 专项突破与工具库 =========== */
  function renderZhuanxiang() {
    var host = $('#zx-list');
    if (!host) { return; }
    var st = { band: 'mid', gi: 0, kw: '' };
    try {
      var raw = JSON.parse(localStorage.getItem('dd_zx') || '{}');
      if (raw.band) { st.band = raw.band; }
      if (typeof raw.gi === 'number') { st.gi = raw.gi; }
    } catch (e) {}
    function save() { try { localStorage.setItem('dd_zx', JSON.stringify(st)); } catch (e) {} }

    var bandBox = $('#zx-band'), gBox = $('#zx-group'), sInput = $('#zx-search'), cnt = $('#zx-count');

    function groups() { return (D.spec || {})[st.band] || []; }

    function nodeEntries(n, acc) {
      (n.e || []).forEach(function (e) { acc.push(e); });
      (n.s || []).forEach(function (s) { nodeEntries(s, acc); });
      return acc;
    }
    function subCount(n) {
      var c = (n.e || []).length;
      (n.s || []).forEach(function (s) { c += subCount(s); });
      return c;
    }

    function drawBand() {
      clear(bandBox);
      [['mid', '初中版（7-9 年级）'], ['pri', '小学版（1-6 年级）']].forEach(function (it) {
        var list = (D.spec || {})[it[0]] || [];
        var total = list.reduce(function (a, g) { return a + subCount(g); }, 0);
        var b = btn(it[1] + ' · ' + total + ' 条', 'tab' + (st.band === it[0] ? ' on' : ''));
        b.addEventListener('click', function () {
          st.band = it[0]; st.gi = 0; st.kw = ''; if (sInput) { sInput.value = ''; }
          save(); drawAll();
        });
        bandBox.appendChild(b);
      });
    }
    function drawGroups() {
      var gs = groups();
      if (st.gi >= gs.length) { st.gi = 0; }
      clear(gBox);
      gs.forEach(function (g, i) {
        var b = btn(g.n + '（' + subCount(g) + '）', 'chip' + (i === st.gi ? ' on' : ''));
        b.addEventListener('click', function () { st.gi = i; save(); drawAll(); });
        gBox.appendChild(b);
      });
    }

    function renderNode(n, box, depth) {
      if (n.e && n.e.length) {
        n.e.forEach(function (e) { box.appendChild(tplCard(e)); });
      }
      (n.s || []).forEach(function (s) {
        var t = mk('h3', '', esc(s.n) + '<span class="tpl-tag">' + subCount(s) + '</span>');
        t.style.justifyContent = 'space-between';
        box.appendChild(t);
        renderNode(s, box, depth + 1);
      });
    }

    function drawList() {
      clear(host);
      var kw = (st.kw || '').trim().toLowerCase();
      if (kw) {
        var all = [];
        groups().forEach(function (g) {
          nodeEntries(g, []).forEach(function (e) {
            all.push({ e: e, g: g.n });
          });
        });
        var hit = all.filter(function (o) {
          var hay = (o.e.t || '') + ' ' + (o.e.p || '') + ' ' + ((o.e.x || []).map(function (x) { return x[1]; }).join(' '));
          return hay.toLowerCase().indexOf(kw) >= 0;
        });
        if (cnt) { cnt.textContent = '搜索「' + st.kw + '」：命中 ' + hit.length + ' 条（' + (st.band === 'mid' ? '初中版' : '小学版') + '全部 ' + all.length + ' 条）'; }
        if (!hit.length) { host.appendChild(mk('div', 'empty', '没有匹配的模板，换个关键词试试')); return; }
        var sec = mk('section', 'sec');
        sec.appendChild(mk('h2', '', '<span class="no">🔍</span>搜索结果'));
        hit.slice(0, 80).forEach(function (o) { sec.appendChild(tplCard(o.e, { tag: o.g })); });
        if (hit.length > 80) { sec.appendChild(mk('div', 'hint', '仅显示前 80 条，请缩小关键词范围')); }
        host.appendChild(sec);
        return;
      }
      var g = groups()[st.gi];
      if (!g) { return; }
      var sec = mk('section', 'sec');
      sec.appendChild(mk('h2', '', '<span class="no">' + (st.gi + 1) + '</span>' + esc(g.n)));
      var total = subCount(g);
      sec.appendChild(mk('p', '', '本组共 <b>' + total + '</b> 条模板，点击「📋 复制提示词」即可粘贴到 WorkBuddy / 豆包 / 其他 AI 使用。'));
      renderNode(g, sec, 0);
      host.appendChild(sec);
      if (cnt) { cnt.textContent = ''; }
    }

    function drawAll() { drawBand(); drawGroups(); drawList(); }
    if (sInput) {
      sInput.addEventListener('input', function () { st.kw = sInput.value; drawList(); });
    }
    drawAll();
  }

  /* =========== 提问方法论 =========== */
  function renderFangfa() {
    var host = $('#ff-body');
    if (!host) { return; }
    var M = D.method || {};

    function sec(no, title) {
      var s = mk('section', 'sec');
      s.appendChild(mk('h2', '', '<span class="no">' + no + '</span>' + esc(title)));
      return s;
    }

    /* 1. 提问法 */
    var s1 = sec('1', '提问法：4S（小学）/ 5S（初中）');
    s1.appendChild(mk('h3', '', '🎒 小学版 · 4S'));
    var g4 = mk('div', 'mcards');
    (M.s4 || []).forEach(function (x) {
      var c = mk('div', 'mcard');
      c.appendChild(mk('span', 'k', esc(x.k)));
      c.appendChild(mk('div', 't', esc(x.t)));
      c.appendChild(mk('div', 'd', esc(x.d)));
      g4.appendChild(c);
    });
    s1.appendChild(g4);
    s1.appendChild(mk('p', '', '💡 ' + esc(M.s4note)));
    s1.appendChild(mk('h3', '', '📘 初中版 · 5S（多一个「说目标」）'));
    var g5 = mk('div', 'mcards');
    (M.s5 || []).forEach(function (x) {
      var c = mk('div', 'mcard');
      c.appendChild(mk('span', 'k', esc(x.k)));
      c.appendChild(mk('div', 't', esc(x.t)));
      c.appendChild(mk('div', 'd', esc(x.d)));
      g5.appendChild(c);
    });
    s1.appendChild(g5);
    s1.appendChild(mk('p', '', '💡 ' + esc(M.s5note)));
    host.appendChild(s1);

    /* 2. 五环公式 */
    var s2 = sec('2', '五环提示词公式（豆包侧）');
    s2.appendChild(mk('p', '', '好的提问 = <b>角色 + 背景 + 任务 + 约束 + 引导</b>'));
    var fl = mk('div', 'flow');
    (M.five || []).forEach(function (x, i) {
      if (i) { fl.appendChild(mk('span', 'fa', '＋')); }
      fl.appendChild(mk('span', 'fi', esc(x.n + ' ' + x.t)));
    });
    s2.appendChild(fl);
    (M.five || []).forEach(function (x) {
      s2.appendChild(mk('p', '', '• <b>' + esc(x.t) + '</b>：' + esc(x.d) + '　<i>例：' + esc(x.e) + '</i>'));
    });
    host.appendChild(s2);

    /* 3. 铁规矩 */
    var s3 = sec('3', '使用 AI 的铁规矩');
    s3.appendChild(mk('h3', '', '🎒 小学版 · 3 条'));
    var r1 = mk('div', 'rules');
    (M.rules_pri || []).forEach(function (x) {
      var c = mk('div', 'rule');
      c.appendChild(mk('div', 'i', esc(x.i)));
      var b = mk('div', '');
      b.appendChild(mk('div', 't', esc(x.t)));
      b.appendChild(mk('div', 'd', esc(x.d)));
      c.appendChild(b);
      r1.appendChild(c);
    });
    s3.appendChild(r1);
    s3.appendChild(mk('h3', '', '📘 初中版 · 4 条（多一条「控制时间」）'));
    var r2 = mk('div', 'rules');
    (M.rules_mid || []).forEach(function (x) {
      var c = mk('div', 'rule');
      c.appendChild(mk('div', 'i', esc(x.i)));
      var b = mk('div', '');
      b.appendChild(mk('div', 't', esc(x.t)));
      b.appendChild(mk('div', 'd', esc(x.d)));
      c.appendChild(b);
      r2.appendChild(c);
    });
    s3.appendChild(r2);
    host.appendChild(s3);

    /* 4. 升级秘诀 */
    var s4 = sec('4', '提问升级秘诀');
    s4.appendChild(mk('h3', '', '🎒 小学版 · 3 条'));
    var t1 = mk('div', 'steps');
    (M.tips_pri || []).forEach(function (x) {
      var c = mk('div', 'step');
      c.appendChild(mk('div', 'sn'));
      var b = mk('div', 'sc');
      b.appendChild(mk('div', 'stt', esc(x.t)));
      b.appendChild(mk('div', 'sd', esc(x.d)));
      c.appendChild(b);
      t1.appendChild(c);
    });
    s4.appendChild(t1);
    s4.appendChild(mk('h3', '', '📘 初中版 · 4 条（多一条「一题多解」）'));
    var t2 = mk('div', 'steps');
    (M.tips_mid || []).forEach(function (x) {
      var c = mk('div', 'step');
      c.appendChild(mk('div', 'sn'));
      var b = mk('div', 'sc');
      b.appendChild(mk('div', 'stt', esc(x.t)));
      b.appendChild(mk('div', 'sd', esc(x.d)));
      c.appendChild(b);
      t2.appendChild(c);
    });
    s4.appendChild(t2);
    host.appendChild(s4);

    /* 5. 家长陪问 */
    var s5 = sec('5', '家长陪问三步法');
    var st5 = mk('div', 'steps');
    (M.parent || []).forEach(function (x) {
      var c = mk('div', 'step');
      c.appendChild(mk('div', 'sn'));
      var b = mk('div', 'sc');
      b.appendChild(mk('div', 'stt', esc(x.n)));
      b.appendChild(mk('div', 'sd', '小学：' + esc(x.p) + '　｜　初中：' + esc(x.m)));
      c.appendChild(b);
      st5.appendChild(c);
    });
    s5.appendChild(st5);
    s5.appendChild(mk('div', 'note q', esc(M.parent_note)));
    host.appendChild(s5);
  }

  /* ---------- 悬浮回到顶部 ---------- */
  function bindFab() {
    var f = $('#fab');
    if (!f) { return; }
    f.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    function chk() { if (window.pageYOffset > 500) { f.classList.add('on'); } else { f.classList.remove('on'); } }
    window.addEventListener('scroll', chk, { passive: true });
    chk();
  }

  /* ---------- 分派 ---------- */
  function boot() {
    var page = document.body.getAttribute('data-page') || '';
    if (page === 'home') { renderHome(); }
    else if (page === 'quanke') { renderQuanke(); }
    else if (page === 'zhuanxiang') { renderZhuanxiang(); }
    else if (page === 'fangfa') { renderFangfa(); }
    bindFab();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
