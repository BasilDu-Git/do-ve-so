/**
 * app.js - Ứng dụng Dò Vé Số Kiến Thiết 3 Miền (Nam - Trung - Bắc)
 * Thuần Vanilla JavaScript (ES2020+), không dùng thư viện ngoài.
 */
(function () {
  'use strict';

  // ============================================================================
  // 1. CẤU HÌNH ĐÀI MỞ THƯỞNG (ĐỦ 21 ĐÀI MIỀN NAM, 14 ĐÀI MIỀN TRUNG, MIỀN BẮC)
  // ============================================================================
  const STATIONS = [
    // --- 21 ĐÀI MIỀN NAM ---
    { code: 'tp-hcm', name: 'TP.HCM', region: 'MN', days: [1, 6], aliases: ['hcm', 'tp hcm', 'tphcm', 'ho chi minh', 'tp ho chi minh', 'thanh pho ho chi minh', 'sai gon', 'saigon', 'xshcm'] },
    { code: 'dong-thap', name: 'Đồng Tháp', region: 'MN', days: [1], aliases: ['dong thap', 'dt', 'xsdt'] },
    { code: 'ca-mau', name: 'Cà Mau', region: 'MN', days: [1], aliases: ['ca mau', 'cm', 'xscm'] },
    { code: 'ben-tre', name: 'Bến Tre', region: 'MN', days: [2], aliases: ['ben tre', 'bt', 'btr', 'xsbt'] },
    { code: 'vung-tau', name: 'Vũng Tàu', region: 'MN', days: [2], aliases: ['vung tau', 'ba ria vung tau', 'brvt', 'vt', 'xsvt'] },
    { code: 'bac-lieu', name: 'Bạc Liêu', region: 'MN', days: [2], aliases: ['bac lieu', 'bl', 'xsbl'] },
    { code: 'dong-nai', name: 'Đồng Nai', region: 'MN', days: [3], aliases: ['dong nai', 'dn', 'xsdn'] },
    { code: 'can-tho', name: 'Cần Thơ', region: 'MN', days: [3], aliases: ['can tho', 'ct', 'xsct'] },
    { code: 'soc-trang', name: 'Sóc Trăng', region: 'MN', days: [3], aliases: ['soc trang', 'st', 'xsst'] },
    { code: 'tay-ninh', name: 'Tây Ninh', region: 'MN', days: [4], aliases: ['tay ninh', 'tn', 'xstn'] },
    { code: 'an-giang', name: 'An Giang', region: 'MN', days: [4], aliases: ['an giang', 'ag', 'xsag'] },
    { code: 'binh-thuan', name: 'Bình Thuận', region: 'MN', days: [4], aliases: ['binh thuan', 'bth', 'xsbth'] },
    { code: 'vinh-long', name: 'Vĩnh Long', region: 'MN', days: [5], aliases: ['vinh long', 'vl', 'xsvl'] },
    { code: 'binh-duong', name: 'Bình Dương', region: 'MN', days: [5], aliases: ['binh duong', 'bd', 'xsbd', 'song be'] },
    { code: 'tra-vinh', name: 'Trà Vinh', region: 'MN', days: [5], aliases: ['tra vinh', 'tv', 'xstv'] },
    { code: 'long-an', name: 'Long An', region: 'MN', days: [6], aliases: ['long an', 'la', 'xsla'] },
    { code: 'binh-phuoc', name: 'Bình Phước', region: 'MN', days: [6], aliases: ['binh phuoc', 'bp', 'xsbp'] },
    { code: 'hau-giang', name: 'Hậu Giang', region: 'MN', days: [6], aliases: ['hau giang', 'hg', 'xshg'] },
    { code: 'tien-giang', name: 'Tiền Giang', region: 'MN', days: [0], aliases: ['tien giang', 'tg', 'xstg'] },
    { code: 'kien-giang', name: 'Kiên Giang', region: 'MN', days: [0], aliases: ['kien giang', 'kg', 'xskg'] },
    { code: 'da-lat', name: 'Đà Lạt', region: 'MN', days: [0], aliases: ['da lat', 'lam dong', 'da lat lam dong', 'dl', 'xsdl'] },

    // --- 14 ĐÀI MIỀN TRUNG ---
    { code: 'thua-thien-hue', name: 'Thừa Thiên Huế', region: 'MT', days: [0, 1], aliases: ['thua thien hue', 'hue', 'tt hue', 'tth', 'xstth'] },
    { code: 'phu-yen', name: 'Phú Yên', region: 'MT', days: [1], aliases: ['phu yen', 'py', 'xspy'] },
    { code: 'dak-lak', name: 'Đắk Lắk', region: 'MT', days: [2], aliases: ['dak lak', 'dac lac', 'daklak', 'daclac', 'dlk', 'xsdlk'] },
    { code: 'quang-nam', name: 'Quảng Nam', region: 'MT', days: [2], aliases: ['quang nam', 'qnm', 'qna', 'xsqnm'] },
    { code: 'da-nang', name: 'Đà Nẵng', region: 'MT', days: [3, 6], aliases: ['da nang', 'dng', 'dna', 'xsdng'] },
    { code: 'khanh-hoa', name: 'Khánh Hòa', region: 'MT', days: [0, 3], aliases: ['khanh hoa', 'kh', 'xskh', 'nha trang'] },
    { code: 'binh-dinh', name: 'Bình Định', region: 'MT', days: [4], aliases: ['binh dinh', 'bdi', 'xsbdi'] },
    { code: 'quang-tri', name: 'Quảng Trị', region: 'MT', days: [4], aliases: ['quang tri', 'qt', 'xsqt'] },
    { code: 'quang-binh', name: 'Quảng Bình', region: 'MT', days: [4], aliases: ['quang binh', 'qb', 'xsqb'] },
    { code: 'gia-lai', name: 'Gia Lai', region: 'MT', days: [5], aliases: ['gia lai', 'gl', 'xsgl'] },
    { code: 'ninh-thuan', name: 'Ninh Thuận', region: 'MT', days: [5], aliases: ['ninh thuan', 'nt', 'xsnt'] },
    { code: 'quang-ngai', name: 'Quảng Ngãi', region: 'MT', days: [6], aliases: ['quang ngai', 'qng', 'xsqng'] },
    { code: 'dak-nong', name: 'Đắk Nông', region: 'MT', days: [6], aliases: ['dak nong', 'dac nong', 'daknong', 'dno', 'xsdno'] },
    { code: 'kon-tum', name: 'Kon Tum', region: 'MT', days: [0], aliases: ['kon tum', 'kontum', 'kt', 'xskt'] },

    // --- MIỀN BẮC ---
    { code: 'mien-bac', name: 'Miền Bắc', region: 'MB', days: [0, 1, 2, 3, 4, 5, 6], aliases: ['mien bac', 'mb', 'xsmb', 'hn', 'ha noi', 'thu do', 'quang ninh', 'bac ninh', 'hai phong', 'nam dinh', 'thai binh', 'xo so mien bac'] }
  ];

  const WEEKLY_SCHEDULE = {
    MN: {
      0: ['tien-giang', 'kien-giang', 'da-lat'],
      1: ['tp-hcm', 'dong-thap', 'ca-mau'],
      2: ['ben-tre', 'vung-tau', 'bac-lieu'],
      3: ['dong-nai', 'can-tho', 'soc-trang'],
      4: ['tay-ninh', 'an-giang', 'binh-thuan'],
      5: ['vinh-long', 'binh-duong', 'tra-vinh'],
      6: ['tp-hcm', 'long-an', 'binh-phuoc', 'hau-giang']
    },
    MT: {
      0: ['khanh-hoa', 'kon-tum', 'thua-thien-hue'],
      1: ['thua-thien-hue', 'phu-yen'],
      2: ['dak-lak', 'quang-nam'],
      3: ['da-nang', 'khanh-hoa'],
      4: ['binh-dinh', 'quang-tri', 'quang-binh'],
      5: ['gia-lai', 'ninh-thuan'],
      6: ['da-nang', 'quang-ngai', 'dak-nong']
    },
    MB: {
      0: ['mien-bac'],
      1: ['mien-bac'],
      2: ['mien-bac'],
      3: ['mien-bac'],
      4: ['mien-bac'],
      5: ['mien-bac'],
      6: ['mien-bac']
    }
  };

  const MB_SUBTITLE_BY_DOW = {
    0: 'Thái Bình',
    1: 'Hà Nội',
    2: 'Quảng Ninh',
    3: 'Bắc Ninh',
    4: 'Hà Nội',
    5: 'Hải Phòng',
    6: 'Nam Định'
  };

  const REGION_META = {
    MN: { name: 'Miền Nam', startSec: 16 * 3600 + 15 * 60, timeLabel: '16:15', ticketDigits: 6 },
    MT: { name: 'Miền Trung', startSec: 17 * 3600 + 15 * 60, timeLabel: '17:15', ticketDigits: 6 },
    MB: { name: 'Miền Bắc', startSec: 18 * 3600 + 15 * 60, timeLabel: '18:15', ticketDigits: 5 }
  };

  const PRIZE_ROWS_MN_MT = [
    { key: 'DB', label: 'ĐB', fullName: 'Giải Đặc biệt', digits: 6, count: 1, money: 2000000000 },
    { key: 'G1', label: 'G1', fullName: 'Giải Nhất', digits: 5, count: 1, money: 30000000 },
    { key: 'G2', label: 'G2', fullName: 'Giải Nhì', digits: 5, count: 1, money: 15000000 },
    { key: 'G3', label: 'G3', fullName: 'Giải Ba', digits: 5, count: 2, money: 10000000 },
    { key: 'G4', label: 'G4', fullName: 'Giải Tư', digits: 5, count: 7, money: 3000000 },
    { key: 'G5', label: 'G5', fullName: 'Giải Năm', digits: 4, count: 1, money: 1000000 },
    { key: 'G6', label: 'G6', fullName: 'Giải Sáu', digits: 4, count: 3, money: 400000 },
    { key: 'G7', label: 'G7', fullName: 'Giải Bảy', digits: 3, count: 1, money: 200000 },
    { key: 'G8', label: 'G8', fullName: 'Giải Tám', digits: 2, count: 1, money: 100000 }
  ];

  const PRIZE_ROWS_MB = [
    { key: 'DB', label: 'ĐB', fullName: 'Giải Đặc biệt', digits: 5, count: 1, money: 500000000 },
    { key: 'G1', label: 'G1', fullName: 'Giải Nhất', digits: 5, count: 1, money: 10000000 },
    { key: 'G2', label: 'G2', fullName: 'Giải Nhì', digits: 5, count: 2, money: 5000000 },
    { key: 'G3', label: 'G3', fullName: 'Giải Ba', digits: 5, count: 6, money: 1000000 },
    { key: 'G4', label: 'G4', fullName: 'Giải Tư', digits: 4, count: 4, money: 400000 },
    { key: 'G5', label: 'G5', fullName: 'Giải Năm', digits: 4, count: 6, money: 200000 },
    { key: 'G6', label: 'G6', fullName: 'Giải Sáu', digits: 3, count: 3, money: 100000 },
    { key: 'G7', label: 'G7', fullName: 'Giải Bảy', digits: 2, count: 4, money: 40000 }
  ];

  const LIVE_API_URL = 'https://api.383.im/lottery/live.json';
  const POLL_INTERVAL_MS = 30000;
  const MAX_DAYS_BACK = 31;
  const RETENTION_DAYS = 32;
  const THEME_STORAGE_KEY = 'doveso_theme';

  const T_POLL_START = 16 * 3600;
  const T_FIRST_DRAW = 16 * 3600 + 15 * 60;
  const T_STOP_POLL = 18 * 3600 + 30 * 60;

  const DOW_NAMES_VI = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  // ============================================================================
  // 2. TIỆN ÍCH CHUỖI, TIẾNG VIỆT KHÔNG DẤU & NGÀY GIỜ ASIA/HO_CHI_MINH
  // ============================================================================
  function normalizeText(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const STATION_MAP = new Map();
  STATIONS.forEach(st => {
    st.normName = normalizeText(st.name);
    st.normAliases = [st.normName, normalizeText(st.code), ...st.aliases.map(normalizeText)];
    STATION_MAP.set(st.code, st);
  });

  function getVNNow(customDateObj) {
    const now = customDateObj || new Date();
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(now);

    const get = type => parts.find(p => p.type === type)?.value || '00';
    const year = get('year');
    const month = get('month');
    const day = get('day');
    const hour = Number(get('hour')) % 24;
    const minute = Number(get('minute'));
    const second = Number(get('second'));
    const ymd = `${year}-${month}-${day}`;
    const secOfDay = hour * 3600 + minute * 60 + second;

    return { year, month, day, hour, minute, second, ymd, secOfDay };
  }

  function parseYMD(ymd) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(ymd || ''))) return null;
    const [y, m, d] = ymd.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
    return dt;
  }

  function formatYMD(dt) {
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const d = String(dt.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function subtractDays(ymd, days) {
    const dt = parseYMD(ymd);
    if (!dt) return ymd;
    dt.setUTCDate(dt.getUTCDate() - days);
    return formatYMD(dt);
  }

  function diffDays(olderYmd, newerYmd) {
    const d1 = parseYMD(olderYmd);
    const d2 = parseYMD(newerYmd);
    if (!d1 || !d2) return NaN;
    return Math.round((d2.getTime() - d1.getTime()) / 86400000);
  }

  function formatDisplayDate(ymd) {
    const dt = parseYMD(ymd);
    if (!dt) return ymd || '';
    const [y, m, d] = ymd.split('-');
    const dow = DOW_NAMES_VI[dt.getUTCDay()];
    return `${dow}, ${d}/${m}/${y}`;
  }

  function formatShortDate(ymd) {
    if (!ymd || !ymd.includes('-')) return '';
    const [y, m, d] = ymd.split('-');
    return `${d}/${m}/${y}`;
  }

  function formatCountdown(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const hh = String(Math.floor(s / 3600)).padStart(2, '0');
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  function formatCurrencyVND(amount) {
    return `${Number(amount || 0).toLocaleString('vi-VN')} đ`;
  }

  function formatVietnameseMoneyWords(amount) {
    let rem = Math.floor(Number(amount || 0));
    if (rem <= 0) return '0 đồng';
    const parts = [];
    const ty = Math.floor(rem / 1000000000);
    rem %= 1000000000;
    const trieu = Math.floor(rem / 1000000);
    rem %= 1000000;
    const nghin = Math.floor(rem / 1000);
    rem %= 1000;

    if (ty > 0) parts.push(`${ty} tỷ`);
    if (trieu > 0) parts.push(`${trieu} triệu`);
    if (nghin > 0) parts.push(`${nghin} nghìn`);
    if (rem > 0) parts.push(`${rem}`);
    return `${parts.join(' ')} đồng`;
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ============================================================================
  // 3. TRA CỨU LỊCH ĐÀI MỞ THƯỞNG THEO NGÀY
  // ============================================================================
  function getScheduledStationsForDate(ymd) {
    const dt = parseYMD(ymd);
    const dow = dt ? dt.getUTCDay() : 0;
    return {
      MN: (WEEKLY_SCHEDULE.MN[dow] || []).map(c => STATION_MAP.get(c)).filter(Boolean),
      MT: (WEEKLY_SCHEDULE.MT[dow] || []).map(c => STATION_MAP.get(c)).filter(Boolean),
      MB: (WEEKLY_SCHEDULE.MB[dow] || []).map(c => STATION_MAP.get(c)).filter(Boolean)
    };
  }

  function isStationScheduledOnDate(station, ymd) {
    if (!station) return false;
    const dt = parseYMD(ymd);
    if (!dt) return false;
    return station.days.includes(dt.getUTCDay());
  }

  function resolveStation(rawInput, preferredYmd) {
    const q = normalizeText(rawInput);
    if (!q) return null;

    for (const st of STATIONS) {
      if (st.normAliases.includes(q)) return st;
    }

    const prefixMatches = STATIONS.filter(st =>
      st.normAliases.some(al => al.startsWith(q))
    );
    if (prefixMatches.length > 0) {
      if (preferredYmd) {
        const onDate = prefixMatches.find(st => isStationScheduledOnDate(st, preferredYmd));
        if (onDate) return onDate;
      }
      return prefixMatches[0];
    }

    if (q.length >= 2) {
      const subMatches = STATIONS.filter(st =>
        st.normAliases.some(al => al.includes(q))
      );
      if (subMatches.length > 0) {
        if (preferredYmd) {
          const onDate = subMatches.find(st => isStationScheduledOnDate(st, preferredYmd));
          if (onDate) return onDate;
        }
        return subMatches[0];
      }
    }

    return null;
  }

  // ============================================================================
  // 4. LOGIC DÒ VÉ SỐ 3 MIỀN (GIỮ NGUYÊN TUYỆT ĐỐI CƠ CẤU GIẢI & CỘNG DỒN)
  // ============================================================================
  function countTailDiffs(a, b) {
    let diffs = 0;
    for (let i = 1; i < a.length; i++) {
      if (a[i] !== b[i]) diffs++;
    }
    return diffs;
  }

  function evaluateTicket(ticket, stationData, region, mbOptions = {}) {
    const wins = [];
    const hitNumbersByPrize = {};
    const prizes = stationData?.prizes || {};

    const markHit = (prizeKey, num) => {
      if (!hitNumbersByPrize[prizeKey]) hitNumbersByPrize[prizeKey] = new Set();
      hitNumbersByPrize[prizeKey].add(num);
    };

    if (region === 'MN' || region === 'MT') {
      const dbArr = Array.isArray(prizes.DB) ? prizes.DB : [];
      for (const rawDb of dbArr) {
        const db = String(rawDb || '').trim();
        if (!/^\d{6}$/.test(db)) continue;

        if (ticket === db) {
          wins.push({
            prizeKey: 'DB',
            prizeName: 'Giải Đặc biệt',
            matchedNumber: db,
            ruleDesc: `Trùng cả 6 chữ số ${db}`,
            amount: 2000000000
          });
          markHit('DB', db);
        } else if (ticket[0] !== db[0] && ticket.slice(1) === db.slice(1)) {
          wins.push({
            prizeKey: 'PHU_DB',
            prizeName: 'Giải Phụ đặc biệt',
            matchedNumber: db,
            ruleDesc: `Sai chữ số đầu, trùng 5 số cuối Giải ĐB (${db.slice(1)})`,
            amount: 50000000
          });
          markHit('DB', db);
        } else if (ticket[0] === db[0] && countTailDiffs(ticket, db) === 1) {
          wins.push({
            prizeKey: 'KK',
            prizeName: 'Giải Khuyến khích',
            matchedNumber: db,
            ruleDesc: `Đúng chữ số đầu (${db[0]}), chỉ sai 1 trong 5 chữ số còn lại của Giải ĐB (${db})`,
            amount: 6000000
          });
          markHit('DB', db);
        }
      }

      const regularSpecs = PRIZE_ROWS_MN_MT.filter(r => r.key !== 'DB');
      for (const spec of regularSpecs) {
        const arr = Array.isArray(prizes[spec.key]) ? prizes[spec.key] : [];
        const tail = ticket.slice(-spec.digits);
        for (const rawNum of arr) {
          const num = String(rawNum || '').trim();
          if (num.length === spec.digits && tail === num) {
            wins.push({
              prizeKey: spec.key,
              prizeName: spec.fullName,
              matchedNumber: num,
              ruleDesc: `Trùng ${spec.digits} số cuối (${num})`,
              amount: spec.money
            });
            markHit(spec.key, num);
          }
        }
      }
    } else if (region === 'MB') {
      const dbArr = Array.isArray(prizes.DB) ? prizes.DB : [];
      const maDB = Array.isArray(stationData?.maDB)
        ? stationData.maDB.map(c => String(c).trim().toUpperCase()).filter(Boolean)
        : [];
      const typedCode = String(mbOptions.symbolCode || '').trim().toUpperCase();
      const mode = mbOptions.symbolMode === 'diff' ? 'diff' : 'match';

      for (const rawDb of dbArr) {
        const db = String(rawDb || '').trim();
        if (!/^\d{5}$/.test(db)) continue;

        if (ticket === db) {
          let isSpecial = mode === 'match';
          let symbolExplain = isSpecial ? 'cùng ký hiệu ĐB' : 'khác ký hiệu ĐB';

          if (typedCode && maDB.length > 0) {
            isSpecial = maDB.includes(typedCode);
            symbolExplain = isSpecial
              ? `ký hiệu ${typedCode} trùng Mã ĐB`
              : `ký hiệu ${typedCode} khác Mã ĐB (${maDB.join(', ')})`;
          }

          if (isSpecial) {
            wins.push({
              prizeKey: 'DB',
              prizeName: 'Giải Đặc biệt',
              matchedNumber: db,
              ruleDesc: `Trùng 5 số Giải ĐB (${db}) - ${symbolExplain}`,
              amount: 500000000
            });
          } else {
            wins.push({
              prizeKey: 'PHU_DB',
              prizeName: 'Giải Phụ đặc biệt',
              matchedNumber: db,
              ruleDesc: `Trùng 5 số Giải ĐB (${db}) - ${symbolExplain}`,
              amount: 25000000
            });
          }
          markHit('DB', db);
        }

        if (ticket.slice(-2) === db.slice(-2)) {
          wins.push({
            prizeKey: 'KK',
            prizeName: 'Giải Khuyến khích',
            matchedNumber: db,
            ruleDesc: `Trùng 2 số cuối Giải ĐB (${db.slice(-2)})`,
            amount: 40000
          });
          markHit('DB', db);
        }
      }

      const regularSpecs = PRIZE_ROWS_MB.filter(r => r.key !== 'DB');
      for (const spec of regularSpecs) {
        const arr = Array.isArray(prizes[spec.key]) ? prizes[spec.key] : [];
        const tail = ticket.slice(-spec.digits);
        for (const rawNum of arr) {
          const num = String(rawNum || '').trim();
          if (num.length === spec.digits && tail === num) {
            wins.push({
              prizeKey: spec.key,
              prizeName: spec.fullName,
              matchedNumber: num,
              ruleDesc: spec.digits === 5 ? `Trùng cả 5 chữ số (${num})` : `Trùng ${spec.digits} số cuối (${num})`,
              amount: spec.money
            });
            markHit(spec.key, num);
          }
        }
      }
    }

    const totalAmount = wins.reduce((sum, item) => sum + item.amount, 0);
    return {
      isWin: wins.length > 0,
      totalAmount,
      wins,
      hitNumbersByPrize
    };
  }

  // ============================================================================
  // 5. CHUẨN HÓA DỮ LIỆU TỪ FILE TĨNH & API LIVE (https://api.383.im/lottery/live.json)
  // ============================================================================
  function createEmptyDaySkeleton(ymd) {
    const scheduled = getScheduledStationsForDate(ymd);
    const dt = parseYMD(ymd);
    const dow = dt ? dt.getUTCDay() : 0;

    return {
      date: ymd,
      dayOfWeek: dow,
      regions: {
        MN: scheduled.MN.map(st => ({
          code: st.code,
          name: st.name,
          prizes: { DB: [], G1: [], G2: [], G3: [], G4: [], G5: [], G6: [], G7: [], G8: [] }
        })),
        MT: scheduled.MT.map(st => ({
          code: st.code,
          name: st.name,
          prizes: { DB: [], G1: [], G2: [], G3: [], G4: [], G5: [], G6: [], G7: [], G8: [] }
        })),
        MB: scheduled.MB.map(st => ({
          code: st.code,
          name: st.name,
          subtitle: MB_SUBTITLE_BY_DOW[dow] || 'Hà Nội',
          maDB: [],
          prizes: { DB: [], G1: [], G2: [], G3: [], G4: [], G5: [], G6: [], G7: [] }
        }))
      }
    };
  }

  function sanitizePrizeArray(rawVal, digits, maxCount) {
    if (rawVal == null) return [];
    let items = [];
    if (Array.isArray(rawVal)) {
      items = rawVal.flatMap(v => String(v ?? '').split(/[\s,\-|;/]+/));
    } else if (typeof rawVal === 'string' || typeof rawVal === 'number') {
      items = String(rawVal).split(/[\s,\-|;/]+/);
    }
    const clean = [];
    for (const token of items) {
      const trimmed = token.trim();
      if (/^\d+$/.test(trimmed)) {
        if (trimmed.length === digits) {
          clean.push(trimmed);
        } else if (digits === 5 && trimmed.length === 6) {
          clean.push(trimmed.slice(-5));
        }
      }
    }
    return clean.slice(0, maxCount);
  }

  function normalizePrizesObject(rawPrizes, region) {
    const rows = region === 'MB' ? PRIZE_ROWS_MB : PRIZE_ROWS_MN_MT;
    const out = {};
    rows.forEach(r => { out[r.key] = []; });
    if (!rawPrizes || typeof rawPrizes !== 'object') return out;

    const keyAliases = {
      DB: ['DB', 'db', 'ĐB', 'đb', 'special', 'dac_biet', 'dacbiet', 'g0', 'G0', '0'],
      G1: ['G1', 'g1', '1', 'nhat', 'first', 'giai_1', 'giai1'],
      G2: ['G2', 'g2', '2', 'nhi', 'second', 'giai_2', 'giai2'],
      G3: ['G3', 'g3', '3', 'ba', 'third', 'giai_3', 'giai3'],
      G4: ['G4', 'g4', '4', 'tu', 'fourth', 'giai_4', 'giai4'],
      G5: ['G5', 'g5', '5', 'nam', 'fifth', 'giai_5', 'giai5'],
      G6: ['G6', 'g6', '6', 'sau', 'sixth', 'giai_6', 'giai6'],
      G7: ['G7', 'g7', '7', 'bay', 'seventh', 'giai_7', 'giai7'],
      G8: ['G8', 'g8', '8', 'tam', 'eighth', 'giai_8', 'giai8']
    };

    for (const spec of rows) {
      const candidates = keyAliases[spec.key] || [spec.key];
      for (const k of candidates) {
        if (Object.prototype.hasOwnProperty.call(rawPrizes, k) && rawPrizes[k] != null) {
          out[spec.key] = sanitizePrizeArray(rawPrizes[k], spec.digits, spec.count);
          if (out[spec.key].length > 0) break;
        }
      }
    }
    return out;
  }

  function normalizeStationEntry(rawEntry, fallbackName, region, ymd) {
    if (!rawEntry || typeof rawEntry !== 'object') return null;
    const rawName = rawEntry.name || rawEntry.station || rawEntry.province || rawEntry.dai || rawEntry.title || fallbackName || (region === 'MB' ? 'Miền Bắc' : '');
    const matched = resolveStation(rawName, ymd) || (region === 'MB' ? STATION_MAP.get('mien-bac') : null);
    const resolvedRegion = region || matched?.region || 'MN';

    const prizeContainer = rawEntry.prizes || rawEntry.results || rawEntry.giai || rawEntry.data || rawEntry;
    const prizes = normalizePrizesObject(prizeContainer, resolvedRegion);

    const dt = parseYMD(ymd);
    const dow = dt ? dt.getUTCDay() : 0;
    const maDBRaw = rawEntry.maDB || rawEntry.madb || rawEntry.codes || rawEntry.kyHieu || rawEntry.ky_hieu || [];
    const maDB = Array.isArray(maDBRaw)
      ? maDBRaw.map(String)
      : typeof maDBRaw === 'string'
        ? maDBRaw.split(/[\s,\-|;/]+/).filter(Boolean)
        : [];

    return {
      code: matched ? matched.code : normalizeText(rawName).replace(/\s+/g, '-'),
      name: matched ? matched.name : String(rawName || 'Đài mở thưởng'),
      subtitle: rawEntry.subtitle || (resolvedRegion === 'MB' ? MB_SUBTITLE_BY_DOW[dow] : undefined),
      maDB,
      prizes,
      _region: resolvedRegion
    };
  }

  function normalizeLotteryPayload(raw, targetYmd) {
    const skeleton = createEmptyDaySkeleton(targetYmd);
    if (!raw || typeof raw !== 'object') return skeleton;

    const root = raw.regions || raw.data || raw.results || raw;

    const regionKeyMap = {
      MN: ['MN', 'mn', 'xsmn', 'XSMN', 'nam', 'mienNam', 'mien_nam', 'mien-nam', 'south'],
      MT: ['MT', 'mt', 'xsmt', 'XSMT', 'trung', 'mienTrung', 'mien_trung', 'mien-trung', 'central'],
      MB: ['MB', 'mb', 'xsmb', 'XSMB', 'bac', 'mienBac', 'mien_bac', 'mien-bac', 'north']
    };

    const mergeStationIntoSkeleton = (region, stObj) => {
      if (!stObj) return;
      const list = skeleton.regions[region];
      const idx = list.findIndex(item => item.code === stObj.code);
      if (idx >= 0) {
        list[idx] = {
          ...list[idx],
          ...stObj,
          prizes: stObj.prizes
        };
      } else {
        list.push(stObj);
      }
    };

    let matchedAnyRegionKey = false;
    for (const region of ['MN', 'MT', 'MB']) {
      for (const key of regionKeyMap[region]) {
        const val = root[key];
        if (!val) continue;
        matchedAnyRegionKey = true;

        if (Array.isArray(val)) {
          val.forEach(item => {
            const st = normalizeStationEntry(item, '', region, targetYmd);
            if (st) mergeStationIntoSkeleton(region, st);
          });
        } else if (typeof val === 'object') {
          const looksLikeSingleStation =
            region === 'MB' ||
            val.prizes ||
            val.DB ||
            val.db ||
            val.G1 ||
            val.g1 ||
            val.G7 ||
            val.g7;
          if (looksLikeSingleStation) {
            const st = normalizeStationEntry(val, region === 'MB' ? 'Miền Bắc' : '', region, targetYmd);
            if (st) mergeStationIntoSkeleton(region, st);
          } else {
            Object.entries(val).forEach(([k, v]) => {
              const st = normalizeStationEntry(v, k, region, targetYmd);
              if (st) mergeStationIntoSkeleton(region, st);
            });
          }
        }
        break;
      }
    }

    if (!matchedAnyRegionKey && Array.isArray(root)) {
      root.forEach(item => {
        const guessedRegion = normalizeText(item.region || item.mien || '');
        let reg = null;
        if (guessedRegion.includes('bac') || guessedRegion === 'mb' || guessedRegion === 'xsmb') reg = 'MB';
        else if (guessedRegion.includes('trung') || guessedRegion === 'mt' || guessedRegion === 'xsmt') reg = 'MT';
        else if (guessedRegion.includes('nam') || guessedRegion === 'mn' || guessedRegion === 'xsmn') reg = 'MN';

        const st = normalizeStationEntry(item, '', reg, targetYmd);
        if (st) mergeStationIntoSkeleton(st._region, st);
      });
    }

    return skeleton;
  }

  function fnv1aDigits(seed, digits) {
    let h = 0x811c9dc5;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    const mod = Math.pow(10, digits);
    return String(h % mod).padStart(digits, '0');
  }

  function buildLocalFileProtocolFallback(ymd) {
    const skeleton = createEmptyDaySkeleton(ymd);
    const suffixes = ['ZN', 'LM', 'QT', 'HP', 'BN', 'TB', 'ND'];
    const dow = skeleton.dayOfWeek;

    ['MN', 'MT'].forEach(reg => {
      skeleton.regions[reg].forEach(st => {
        PRIZE_ROWS_MN_MT.forEach(spec => {
          st.prizes[spec.key] = Array.from({ length: spec.count }, (_, idx) =>
            fnv1aDigits(`${ymd}:${st.code}:${spec.key}:${idx}`, spec.digits)
          );
        });
      });
    });

    skeleton.regions.MB.forEach(st => {
      const sfx = suffixes[dow] || 'ZN';
      st.maDB = [`1${sfx}`, `4${sfx}`, `7${sfx}`, `10${sfx}`, `12${sfx}`, `15${sfx}`];
      PRIZE_ROWS_MB.forEach(spec => {
        st.prizes[spec.key] = Array.from({ length: spec.count }, (_, idx) =>
          fnv1aDigits(`${ymd}:mien-bac:${spec.key}:${idx}`, spec.digits)
        );
      });
    });

    return skeleton;
  }

  function isStationComplete(stationData, region) {
    if (!stationData || !stationData.prizes) return false;
    const rows = region === 'MB' ? PRIZE_ROWS_MB : PRIZE_ROWS_MN_MT;
    return rows.every(r => Array.isArray(stationData.prizes[r.key]) && stationData.prizes[r.key].length >= r.count);
  }

  function hasAnyDrawnNumber(stationData) {
    if (!stationData || !stationData.prizes) return false;
    return Object.values(stationData.prizes).some(arr => Array.isArray(arr) && arr.length > 0);
  }

  // ============================================================================
  // 6. QUẢN LÝ TRẠNG THÁI LUỒNG 3 BƯỚC, THEME SÁNG/TỐI, POLL LIVE & 32 NGÀY
  // ============================================================================
  const state = {
    selectedDate: '',
    activeRegion: 'MN',
    selectedStation: null,
    dayDataCache: new Map(),
    liveDataToday: null,
    pollTimerId: null,
    clockTimerId: null,
    flashTimerId: null,
    lastPollAt: 0,
    lastCheckHighlight: null
  };

  const els = {};

  function cacheDom() {
    els.vnClock = document.getElementById('vnClock');
    els.themeToggleBtn = document.getElementById('themeToggleBtn');
    els.ticketForm = document.getElementById('ticketForm');
    els.step2Box = document.getElementById('step2Box');
    els.noStationAlert = document.getElementById('noStationAlert');
    els.drawDateInput = document.getElementById('drawDateInput');
    els.drawDatePicker = document.getElementById('drawDatePicker');
    els.dateHelperText = document.getElementById('dateHelperText');
    els.ticketNumberInput = document.getElementById('ticketNumberInput');
    els.clearTicketBtn = document.getElementById('clearTicketBtn');
    els.digitCounter = document.getElementById('digitCounter');
    els.ticketLengthHint = document.getElementById('ticketLengthHint');
    els.mbSymbolPanel = document.getElementById('mbSymbolPanel');
    els.mbSymbolInput = document.getElementById('mbSymbolInput');
    els.todayStationsChips = document.getElementById('todayStationsChips');
    els.activeStationConfirm = document.getElementById('activeStationConfirm');
    els.confirmStationText = document.getElementById('confirmStationText');
    els.checkBtn = document.getElementById('checkBtn');
    els.stationLockHint = document.getElementById('stationLockHint');
    els.lockReasonText = document.getElementById('lockReasonText');
    els.checkResultSection = document.getElementById('checkResultSection');
    els.resultsDateLabel = document.getElementById('resultsDateLabel');
    els.drawStatusBanner = document.getElementById('drawStatusBanner');
    els.drawStatusText = document.getElementById('drawStatusText');
    els.countdownText = document.getElementById('countdownText');
    els.regionTabs = document.getElementById('regionTabs');
    els.resultTableContainer = document.getElementById('resultTableContainer');
  }

  function applyTheme(theme) {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', normalized);
    if (els.themeToggleBtn) {
      const label = normalized === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối';
      els.themeToggleBtn.setAttribute('aria-label', label);
      els.themeToggleBtn.setAttribute('title', label);
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, normalized);
    } catch (_) {}
  }

  function initTheme() {
    let current = 'light';
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        current = saved;
      }
    } catch (_) {}
    applyTheme(current);
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  }

  function syncDatePickerLimits() {
    const vn = getVNNow();
    const minDate = subtractDays(vn.ymd, MAX_DAYS_BACK);
    if (els.drawDatePicker) {
      els.drawDatePicker.max = vn.ymd;
      els.drawDatePicker.min = minDate;
    }
  }

  // --- Ô ngày hiển thị DD/MM/YYYY, giá trị nội bộ vẫn là YYYY-MM-DD ---
  function ymdToDMY(ymd) {
    if (!parseYMD(ymd)) return '';
    const [y, m, d] = ymd.split('-');
    return `${d}/${m}/${y}`;
  }

  function dmyToYmd(text) {
    const m = String(text || '').trim().match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
    if (!m) return null;
    const ymd = `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    return parseYMD(ymd) ? ymd : null;
  }

  function getSelectedYmd() {
    return dmyToYmd(els.drawDateInput.value) || '';
  }

  // Đặt ngày đang chọn cho cả ô hiển thị và lịch gốc; reload=true thì tải lại dữ liệu ngày đó
  function setSelectedDate(ymd, reload) {
    els.drawDateInput.value = ymdToDMY(ymd);
    if (els.drawDatePicker) els.drawDatePicker.value = ymd;
    if (!reload) return;
    state.selectedDate = ymd;
    state.lastCheckHighlight = null;
    els.checkResultSection.hidden = true;
    loadDateData(ymd);
  }

  function openNativeDatePicker() {
    const picker = els.drawDatePicker;
    if (!picker || typeof picker.showPicker !== 'function') return;
    try { picker.showPicker(); } catch (_) {}
  }

  function getTodayPhase(vn) {
    if (vn.secOfDay < T_FIRST_DRAW) {
      return {
        uiState: 'waiting',
        shouldPoll: vn.secOfDay >= T_POLL_START,
        lockCheckBtn: true
      };
    }
    if (vn.secOfDay <= T_STOP_POLL) {
      return {
        uiState: 'live',
        shouldPoll: true,
        lockCheckBtn: false
      };
    }
    return {
      uiState: 'complete',
      shouldPoll: false,
      lockCheckBtn: false
    };
  }

  async function fetchLiveApiOnce() {
    const vn = getVNNow();
    try {
      const url = `${LIVE_API_URL}${LIVE_API_URL.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      state.liveDataToday = normalizeLotteryPayload(json, vn.ymd);
      state.lastPollAt = Date.now();
      if (state.selectedDate === vn.ymd) {
        renderBoard();
      }
      return state.liveDataToday;
    } catch (_) {
      if (!state.liveDataToday) {
        state.liveDataToday = createEmptyDaySkeleton(vn.ymd);
      }
      return state.liveDataToday;
    }
  }

  function startLivePolling() {
    if (state.pollTimerId !== null) return;
    fetchLiveApiOnce();
    state.pollTimerId = window.setInterval(() => {
      const vn = getVNNow();
      const phase = getTodayPhase(vn);
      if (state.selectedDate !== vn.ymd || !phase.shouldPoll) {
        stopLivePolling();
        if (state.selectedDate === vn.ymd && phase.uiState === 'complete') {
          loadDateData(vn.ymd);
        }
        return;
      }
      fetchLiveApiOnce();
    }, POLL_INTERVAL_MS);
  }

  function stopLivePolling() {
    if (state.pollTimerId !== null) {
      window.clearInterval(state.pollTimerId);
      state.pollTimerId = null;
    }
  }

  async function fetchStaticDateJson(ymd) {
    if (state.dayDataCache.has(ymd)) {
      return state.dayDataCache.get(ymd);
    }
    try {
      const res = await fetch(`data/${ymd}.json`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      const normalized = normalizeLotteryPayload(raw, ymd);
      state.dayDataCache.set(ymd, normalized);
      return normalized;
    } catch (_) {
      if (window.location.protocol === 'file:') {
        const localData = buildLocalFileProtocolFallback(ymd);
        state.dayDataCache.set(ymd, localData);
        return localData;
      }
      return null;
    }
  }

  /**
   * Mặc định tự chọn sẵn đài đầu tiên của ngày đó (hoặc giữ đài đang chọn nếu ngày mới cũng có đài đó).
   */
  function syncSelectedStationForDate(ymd) {
    if (!parseYMD(ymd)) {
      applySelectedStation(null, false);
      return;
    }
    const scheduled = getScheduledStationsForDate(ymd);
    const allForDate = [...scheduled.MN, ...scheduled.MT, ...scheduled.MB];
    if (allForDate.length === 0) return;

    const stillAvailable = state.selectedStation && allForDate.some(st => st.code === state.selectedStation.code);
    if (stillAvailable) {
      applySelectedStation(state.selectedStation, false);
    } else {
      applySelectedStation(allForDate[0], false);
    }
  }

  async function loadDateData(ymd) {
    const vn = getVNNow();
    const age = diffDays(ymd, vn.ymd);

    if (els.noStationAlert) els.noStationAlert.hidden = true;
    syncSelectedStationForDate(ymd);

    if (age >= RETENTION_DAYS) {
      stopLivePolling();
      renderDateHelper(ymd, vn);
      renderExpiredMessage();
      renderBoard();
      return;
    }

    renderDateHelper(ymd, vn);

    if (ymd === vn.ymd) {
      const phase = getTodayPhase(vn);
      if (phase.shouldPoll) {
        startLivePolling();
      } else {
        stopLivePolling();
      }

      if (phase.uiState === 'waiting') {
        renderBoard();
        return;
      }

      if (phase.uiState === 'complete') {
        let data = await fetchStaticDateJson(ymd);
        if (!data) {
          data = await fetchLiveApiOnce();
          if (data) state.dayDataCache.set(ymd, data);
        }
        renderBoard();
        return;
      }

      renderBoard();
      return;
    }

    stopLivePolling();
    await fetchStaticDateJson(ymd);
    renderBoard();
  }

  function getActiveDayDataset(ymd) {
    const vn = getVNNow();
    if (ymd === vn.ymd) {
      const phase = getTodayPhase(vn);
      if (phase.uiState === 'waiting') {
        return createEmptyDaySkeleton(ymd);
      }
      if (phase.uiState === 'live') {
        return state.liveDataToday || createEmptyDaySkeleton(ymd);
      }
      return state.dayDataCache.get(ymd) || state.liveDataToday || createEmptyDaySkeleton(ymd);
    }
    return state.dayDataCache.get(ymd) || createEmptyDaySkeleton(ymd);
  }

  // ============================================================================
  // 7. RENDER GIAO DIỆN ĐỒNG HỒ, BƯỚC 2 CHỌN ĐÀI, XÁC NHẬN ĐÀI & BẢNG KẾT QUẢ
  // ============================================================================
  function renderClockAndLiveState() {
    const vn = getVNNow();
    syncDatePickerLimits();

    const hh = String(vn.hour).padStart(2, '0');
    const mm = String(vn.minute).padStart(2, '0');
    const ss = String(vn.second).padStart(2, '0');
    els.vnClock.textContent = `${hh}:${mm}:${ss} • ${vn.day}/${vn.month}/${vn.year}`;

    if (state.selectedDate === vn.ymd) {
      const phase = getTodayPhase(vn);
      if (phase.shouldPoll && state.pollTimerId === null) {
        startLivePolling();
      } else if (!phase.shouldPoll && state.pollTimerId !== null) {
        stopLivePolling();
        if (phase.uiState === 'complete') {
          loadDateData(vn.ymd);
        }
      }
      updateStatusAndButtonLock(vn);
    }
  }

  /**
   * Đồng bộ dòng xác nhận đài đang dò & trạng thái mở/mờ nút KIỂM TRA
   */
  function syncCheckButtonStationState(vnNow) {
    const vn = vnNow || getVNNow();
    const ymd = state.selectedDate;
    const isTimeLocked = ymd === vn.ymd && getTodayPhase(vn).lockCheckBtn;
    const hasStation = !!state.selectedStation;

    // Dòng xác nhận ngay trên nút KIỂM TRA: "Bạn đang dò đài: Đồng Nai - 25/11/2026"
    if (hasStation && parseYMD(ymd)) {
      els.confirmStationText.textContent = `${state.selectedStation.name} - ${formatShortDate(ymd)}`;
      els.activeStationConfirm.hidden = false;
    } else {
      els.activeStationConfirm.hidden = true;
    }

    // Khóa trước 16:15 hôm nay (dùng disabled thật)
    els.checkBtn.disabled = isTimeLocked;

    // Khi bỏ chọn hết đài: làm mờ nút KIỂM TRA (dùng aria-disabled + class để nếu bấm vào vẫn bắt được sự kiện cuộn lên Bước 2 & nhấp nháy nhắc)
    if (!hasStation) {
      els.checkBtn.classList.add('is-station-locked');
      els.checkBtn.setAttribute('aria-disabled', 'true');
      els.stationLockHint.hidden = isTimeLocked;
    } else {
      els.checkBtn.classList.remove('is-station-locked');
      els.checkBtn.setAttribute('aria-disabled', 'false');
      els.stationLockHint.hidden = true;
    }
  }

  function updateStatusAndButtonLock(vnNow) {
    const vn = vnNow || getVNNow();
    const ymd = state.selectedDate;
    const age = diffDays(ymd, vn.ymd);

    els.resultsDateLabel.textContent = parseYMD(ymd) ? formatDisplayDate(ymd) : 'Chưa chọn ngày hợp lệ';
    syncCheckButtonStationState(vn);

    if (age >= RETENTION_DAYS) {
      els.drawStatusBanner.setAttribute('data-state', 'expired');
      els.drawStatusText.textContent = 'Vé đã quá 30 ngày, hết hạn lĩnh thưởng';
      els.countdownText.hidden = true;
      els.lockReasonText.hidden = true;
      return;
    }

    if (ymd === vn.ymd) {
      const phase = getTodayPhase(vn);

      if (phase.uiState === 'waiting') {
        const remainSec = T_FIRST_DRAW - vn.secOfDay;
        const cdStr = formatCountdown(remainSec);
        els.drawStatusBanner.setAttribute('data-state', 'waiting');
        els.drawStatusText.textContent = 'Chưa quay thưởng';
        els.countdownText.textContent = `Đếm ngược tới 16:15: ${cdStr}`;
        els.countdownText.hidden = false;

        els.lockReasonText.textContent = `Chưa quay thưởng — Mở khóa lúc 16:15 (còn ${cdStr})`;
        els.lockReasonText.hidden = false;

        const inlineCd = els.resultTableContainer.querySelector('[data-inline-countdown]');
        if (inlineCd) {
          inlineCd.textContent = `Đếm ngược tới giờ mở thưởng Miền Nam (16:15): ${cdStr}`;
        }
        return;
      }

      if (phase.uiState === 'live') {
        els.drawStatusBanner.setAttribute('data-state', 'live');
        els.drawStatusText.textContent = 'Đang quay trực tiếp';
        els.countdownText.textContent = 'Cập nhật tự động 30 giây/lần • Lịch: Nam 16:15 | Trung 17:15 | Bắc 18:15';
        els.countdownText.hidden = false;
        els.lockReasonText.hidden = true;
        return;
      }

      els.drawStatusBanner.setAttribute('data-state', 'complete');
      els.drawStatusText.textContent = 'Đã có đủ kết quả';
      els.countdownText.hidden = true;
      els.lockReasonText.hidden = true;
      return;
    }

    els.drawStatusBanner.setAttribute('data-state', 'complete');
    els.drawStatusText.textContent = 'Đã có đủ kết quả';
    els.countdownText.hidden = true;
    els.lockReasonText.hidden = true;
  }

  function renderDateHelper(ymd, vnNow) {
    const vn = vnNow || getVNNow();
    if (!parseYMD(ymd)) {
      els.dateHelperText.textContent = 'Vui lòng chọn ngày hợp lệ';
      return;
    }
    const age = diffDays(ymd, vn.ymd);
    if (age === 0) {
      els.dateHelperText.textContent = `${formatDisplayDate(ymd)} (Hôm nay - Giờ VN)`;
    } else if (age > 0 && age <= MAX_DAYS_BACK) {
      els.dateHelperText.textContent = `${formatDisplayDate(ymd)} (Cách đây ${age} ngày)`;
    } else if (age >= RETENTION_DAYS) {
      els.dateHelperText.textContent = 'Vé đã quá 30 ngày, hết hạn lĩnh thưởng';
    } else {
      els.dateHelperText.textContent = 'Ngày mở thưởng chưa diễn ra';
    }
  }

  function renderStationChips(ymd) {
    if (!parseYMD(ymd)) {
      els.todayStationsChips.innerHTML = '';
      return;
    }
    const scheduled = getScheduledStationsForDate(ymd);
    const allForDate = [...scheduled.MN, ...scheduled.MT, ...scheduled.MB];

    els.todayStationsChips.innerHTML = allForDate
      .map(st => {
        const isSelected = state.selectedStation?.code === st.code;
        const checkMark = isSelected ? '<span class="chip-check-icon" aria-hidden="true">✓</span>' : '';
        return `<button type="button" aria-pressed="${isSelected ? 'true' : 'false'}" title="${isSelected ? 'Đang chọn (nhấn lại nếu muốn bỏ chọn)' : 'Nhấn để chọn đài ' + escapeHtml(st.name)}" class="station-chip${isSelected ? ' is-selected' : ''}" data-station-code="${escapeHtml(st.code)}">${checkMark}<span>${escapeHtml(st.name)}</span></button>`;
      })
      .join('');
  }

  function applySelectedStation(station, shouldRenderBoard = true) {
    state.selectedStation = station || null;

    if (station) {
      if (els.noStationAlert) els.noStationAlert.hidden = true;
      const regMeta = REGION_META[station.region];
      const reqDigits = regMeta.ticketDigits;
      els.ticketNumberInput.maxLength = reqDigits;
      els.ticketNumberInput.placeholder =
        reqDigits === 5 ? 'Nhập 5 chữ số (VD: 58392)' : 'Nhập 6 chữ số (VD: 279577)';
      els.ticketLengthHint.textContent =
        reqDigits === 5
          ? 'Vé số Miền Bắc gồm 5 chữ số (00000 - 99999)'
          : `Vé số ${regMeta.name} gồm 6 chữ số (000000 - 999999)`;

      if (els.ticketNumberInput.value.length > reqDigits) {
        els.ticketNumberInput.value = els.ticketNumberInput.value.slice(0, reqDigits);
      }

      els.mbSymbolPanel.hidden = station.region !== 'MB';

      if (state.activeRegion !== station.region) {
        state.activeRegion = station.region;
        if (shouldRenderBoard) renderBoard();
      }
    } else {
      els.mbSymbolPanel.hidden = true;
      els.ticketLengthHint.textContent = 'Vui lòng chọn đài ở Bước 2 trước khi kiểm tra (6 số cho Nam/Trung, 5 số cho Bắc)';
    }

    updateTicketDigitCounter();
    renderStationChips(state.selectedDate);
    syncCheckButtonStationState();
  }

  function updateTicketDigitCounter() {
    const reqDigits = state.selectedStation ? REGION_META[state.selectedStation.region].ticketDigits : 6;
    const cleaned = els.ticketNumberInput.value.replace(/\D+/g, '').slice(0, reqDigits);
    if (els.ticketNumberInput.value !== cleaned) {
      els.ticketNumberInput.value = cleaned;
    }
    els.digitCounter.textContent = `${cleaned.length}/${reqDigits} số`;
    els.digitCounter.classList.toggle('is-complete', cleaned.length === reqDigits);
    els.clearTicketBtn.hidden = cleaned.length === 0;
  }

  /**
   * Cuộn lên khung Bước 2, hiện thông báo đỏ và làm khung Bước 2 nhấp nháy nhẹ 1 lần
   */
  function alertAndFocusStep2() {
    if (els.noStationAlert) {
      els.noStationAlert.textContent = 'Bạn chưa chọn đài, vui lòng chọn đài trước!';
      els.noStationAlert.hidden = false;
    }

    renderValidationMessage('Chưa chọn đài mở thưởng', '<strong>Bạn chưa chọn đài, vui lòng chọn đài trước!</strong>');

    if (els.step2Box) {
      els.step2Box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      els.step2Box.classList.remove('is-flashing');
      // Reflow để animation luôn chạy lại mượt mà mỗi lần nhắc
      void els.step2Box.offsetWidth;
      els.step2Box.classList.add('is-flashing');

      if (state.flashTimerId) window.clearTimeout(state.flashTimerId);
      state.flashTimerId = window.setTimeout(() => {
        els.step2Box.classList.remove('is-flashing');
      }, 900);
    }
  }

  function renderBoard() {
    const vn = getVNNow();
    const ymd = state.selectedDate;
    updateStatusAndButtonLock(vn);

    els.regionTabs.querySelectorAll('.region-tab').forEach(btn => {
      const isAct = btn.getAttribute('data-region') === state.activeRegion;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });

    const age = diffDays(ymd, vn.ymd);
    if (!parseYMD(ymd) || age >= RETENTION_DAYS || age < 0) {
      const msg = age >= RETENTION_DAYS
        ? 'Vé đã quá 30 ngày, hết hạn lĩnh thưởng'
        : 'Chưa có dữ liệu cho ngày đã chọn';
      els.resultTableContainer.innerHTML = `
        <div class="empty-draw-notice">
          <h3>${escapeHtml(msg)}</h3>
          <p>Chỉ lưu trữ và đối chiếu kết quả từ hôm nay lùi lại 31 ngày.</p>
        </div>
      `;
      return;
    }

    const isToday = ymd === vn.ymd;
    const phase = isToday ? getTodayPhase(vn) : { uiState: 'complete' };
    const dataset = getActiveDayDataset(ymd);
    const region = state.activeRegion;
    const stations = dataset.regions[region] || [];
    const rowsSpec = region === 'MB' ? PRIZE_ROWS_MB : PRIZE_ROWS_MN_MT;

    const isBeforeFirstDraw = isToday && phase.uiState === 'waiting';
    const isRegionNotStartedYet =
      isToday &&
      phase.uiState === 'live' &&
      vn.secOfDay < REGION_META[region].startSec &&
      !stations.some(hasAnyDrawnNumber);

    let topNoticeHtml = '';
    if (isBeforeFirstDraw) {
      const cdStr = formatCountdown(T_FIRST_DRAW - vn.secOfDay);
      topNoticeHtml = `
        <div class="empty-draw-notice">
          <h3>Chưa quay thưởng</h3>
          <p data-inline-countdown>Đếm ngược tới giờ mở thưởng Miền Nam (16:15): ${escapeHtml(cdStr)}</p>
        </div>
      `;
    } else if (isRegionNotStartedYet) {
      const regMeta = REGION_META[region];
      const cdRegion = formatCountdown(regMeta.startSec - vn.secOfDay);
      topNoticeHtml = `
        <div class="empty-draw-notice">
          <h3>${escapeHtml(regMeta.name)} mở thưởng lúc ${escapeHtml(regMeta.timeLabel)}</h3>
          <p>Đang chờ tới giờ quay (${escapeHtml(cdRegion)})</p>
        </div>
      `;
    }

    const colCountClass = stations.length >= 4 ? ' cols-4' : '';
    const mbTableClass = region === 'MB' ? ' mb-table' : '';

    const theadCols = stations
      .map(st => {
        const isCheckedStation =
          state.lastCheckHighlight &&
          state.lastCheckHighlight.date === ymd &&
          state.lastCheckHighlight.stationCode === st.code;
        const sub = st.subtitle ? `<span class="station-th-sub">(${escapeHtml(st.subtitle)})</span>` : '';
        return `<th scope="col" class="${isCheckedStation ? 'is-checked-station' : ''}">${escapeHtml(st.name)}${sub}</th>`;
      })
      .join('');

    let maDbRowHtml = '';
    if (region === 'MB') {
      const mbSt = stations[0];
      const codes = !isBeforeFirstDraw && Array.isArray(mbSt?.maDB) ? mbSt.maDB : [];
      const codeContent = codes.length > 0
        ? `<div class="ma-db-list">${codes.map(c => `<span class="ma-db-chip">${escapeHtml(c)}</span>`).join('')}</div>`
        : `<span class="prize-empty">—</span>`;
      maDbRowHtml = `
        <tr class="row-madb">
          <th scope="row" class="prize-label-cell">Mã ĐB</th>
          <td>${codeContent}</td>
        </tr>
      `;
    }

    const tbodyRows = rowsSpec
      .map(spec => {
        const rowClass = spec.key === 'DB' ? 'row-db' : spec.key === 'G8' ? 'row-g8' : spec.key === 'G7' ? 'row-g7' : '';
        const tds = stations
          .map(st => {
            const isCheckedStation =
              state.lastCheckHighlight &&
              state.lastCheckHighlight.date === ymd &&
              state.lastCheckHighlight.stationCode === st.code;
            const tdClass = isCheckedStation ? ' class="is-checked-station"' : '';

            if (isBeforeFirstDraw || isRegionNotStartedYet) {
              return `<td${tdClass}><span class="prize-empty">—</span></td>`;
            }

            const drawnArr = Array.isArray(st.prizes?.[spec.key]) ? st.prizes[spec.key] : [];
            const missingCount = Math.max(0, spec.count - drawnArr.length);
            const hitSet = isCheckedStation ? state.lastCheckHighlight.hitNumbersByPrize?.[spec.key] : null;

            const renderedNums = drawnArr.map(num => {
              const isHit = hitSet && hitSet.has(num);
              return `<span class="prize-num${isHit ? ' is-hit' : ''}">${escapeHtml(num)}</span>`;
            });

            if (isToday && phase.uiState === 'live' && missingCount > 0) {
              renderedNums.push(`<span class="prize-drawing">Đang quay...</span>`);
            } else if (renderedNums.length === 0) {
              return `<td${tdClass}><span class="prize-empty">—</span></td>`;
            }

            return `<td${tdClass}><div class="prize-numbers">${renderedNums.join('')}</div></td>`;
          })
          .join('');

        const rowHtml = `
          <tr class="${rowClass}">
            <th scope="row" class="prize-label-cell">${escapeHtml(spec.label)}</th>
            ${tds}
          </tr>
        `;
        return spec.key === 'DB' && region === 'MB' ? rowHtml + maDbRowHtml : rowHtml;
      })
      .join('');

    els.resultTableContainer.innerHTML = `
      ${topNoticeHtml}
      <table class="lottery-table${colCountClass}${mbTableClass}">
        <thead>
          <tr>
            <th scope="col" class="col-prize">Giải</th>
            ${theadCols}
          </tr>
        </thead>
        <tbody>
          ${tbodyRows}
        </tbody>
      </table>
    `;
  }

  // ============================================================================
  // 8. XỬ LÝ NÚT "KIỂM TRA" VÀ HIỂN THỊ KẾT QUẢ DÒ VÉ
  // ============================================================================
  function renderExpiredMessage() {
    els.checkResultSection.hidden = false;
    els.checkResultSection.innerHTML = `
      <div class="result-box is-expired">
        <div class="result-headline">
          <span class="result-badge">Hết hạn lĩnh thưởng</span>
        </div>
        <p class="result-ticket-summary"><strong>Vé đã quá 30 ngày, hết hạn lĩnh thưởng</strong></p>
        <p class="result-note">Theo quy định Xổ số Kiến thiết, vé trúng thưởng chỉ có giá trị lĩnh thưởng trong vòng 30 ngày kể từ ngày mở thưởng.</p>
      </div>
    `;
  }

  function renderValidationMessage(title, detailHtml) {
    els.checkResultSection.hidden = false;
    els.checkResultSection.innerHTML = `
      <div class="result-box is-error">
        <div class="result-headline">
          <span class="result-badge">${escapeHtml(title)}</span>
        </div>
        <div class="result-ticket-summary">${detailHtml}</div>
      </div>
    `;
  }

  async function handleFormSubmit(evt) {
    evt.preventDefault();

    const vn = getVNNow();
    const ymd = getSelectedYmd();

    if (!parseYMD(ymd)) {
      renderValidationMessage('Ngày không hợp lệ', 'Vui lòng chọn ngày mở thưởng hợp lệ ở Bước 1.');
      return;
    }

    const age = diffDays(ymd, vn.ymd);
    if (age >= RETENTION_DAYS) {
      renderExpiredMessage();
      renderBoard();
      return;
    }

    if (age < 0) {
      renderValidationMessage('Chưa đến ngày mở thưởng', 'Chỉ được chọn từ ngày hôm nay lùi lại tối đa 31 ngày.');
      return;
    }

    if (ymd === vn.ymd && getTodayPhase(vn).lockCheckBtn) {
      return;
    }

    // Nếu người dùng chưa chọn đài (bỏ chọn hết đài): báo đỏ, cuộn lên Bước 2 và nhấp nháy nhẹ 1 lần
    const station = state.selectedStation;
    if (!station) {
      alertAndFocusStep2();
      return;
    }

    const reqDigits = REGION_META[station.region].ticketDigits;
    const ticket = els.ticketNumberInput.value.replace(/\D+/g, '');
    if (ticket.length !== reqDigits) {
      renderValidationMessage(
        'Số vé chưa đủ chữ số',
        `Đài <strong>${escapeHtml(station.name)}</strong> (${escapeHtml(REGION_META[station.region].name)}) yêu cầu nhập đúng <strong>${reqDigits} chữ số</strong> ở Bước 3.`
      );
      els.ticketNumberInput.focus();
      return;
    }

    if (ymd !== vn.ymd && !state.dayDataCache.has(ymd)) {
      await fetchStaticDateJson(ymd);
    }

    const dataset = getActiveDayDataset(ymd);
    const regionStations = dataset.regions[station.region] || [];
    const stationData = regionStations.find(s => s.code === station.code);

    if (!stationData) {
      const scheduled = getScheduledStationsForDate(ymd);
      const listNames = [...scheduled.MN, ...scheduled.MT, ...scheduled.MB].map(s => s.name).join(', ');
      renderValidationMessage(
        'Đài không mở thưởng ngày này',
        `Đài <strong>${escapeHtml(station.name)}</strong> không có lịch quay vào <strong>${escapeHtml(formatDisplayDate(ymd))}</strong>.<br>Các đài mở thưởng ngày này: <strong>${escapeHtml(listNames)}</strong>.`
      );
      return;
    }

    if (!hasAnyDrawnNumber(stationData)) {
      const regMeta = REGION_META[station.region];
      renderValidationMessage(
        'Chưa có kết quả đài này',
        `Đài <strong>${escapeHtml(station.name)}</strong> ngày <strong>${escapeHtml(formatShortDate(ymd))}</strong> chưa có kết quả mở thưởng (giờ quay ${escapeHtml(regMeta.name)}: <strong>${escapeHtml(regMeta.timeLabel)}</strong>).`
      );
      return;
    }

    const selectedModeEl = document.querySelector('input[name="mbSymbolMode"]:checked');
    const mbOptions = {
      symbolMode: selectedModeEl ? selectedModeEl.value : 'match',
      symbolCode: els.mbSymbolInput ? els.mbSymbolInput.value : ''
    };

    const result = evaluateTicket(ticket, stationData, station.region, mbOptions);
    const isComplete = isStationComplete(stationData, station.region);

    state.lastCheckHighlight = {
      date: ymd,
      stationCode: station.code,
      hitNumbersByPrize: result.hitNumbersByPrize
    };
    state.activeRegion = station.region;
    renderBoard();

    const partialNote = !isComplete
      ? `<p class="result-note"><strong>Lưu ý:</strong> Đài ${escapeHtml(station.name)} đang quay trực tiếp, một số giải chưa quay xong. Kết quả sẽ được cập nhật tiếp sau mỗi 30 giây.</p>`
      : '';

    if (result.isWin) {
      const itemsHtml = result.wins
        .map(w => `
          <li>
            <div>
              <div class="win-prize-name">${escapeHtml(w.prizeName)}</div>
              <div class="win-prize-detail">${escapeHtml(w.ruleDesc)}</div>
            </div>
            <div class="win-prize-money">+${escapeHtml(formatCurrencyVND(w.amount))}</div>
          </li>
        `)
        .join('');

      els.checkResultSection.hidden = false;
      els.checkResultSection.innerHTML = `
        <div class="result-box is-win">
          <div class="result-headline">
            <span class="result-badge">Chúc mừng trúng thưởng (${result.wins.length} giải)</span>
          </div>
          <p class="result-ticket-summary">
            Vé số <span class="ticket-pill-num">${escapeHtml(ticket)}</span> • Đài <strong>${escapeHtml(station.name)}</strong> • Ngày <strong>${escapeHtml(formatShortDate(ymd))}</strong>
          </p>
          <div class="win-total-block">
            <span class="win-total-label">Tổng tiền thưởng cộng dồn:</span>
            <span class="win-total-amount">${escapeHtml(formatCurrencyVND(result.totalAmount))}</span>
            <span class="win-total-words">Bằng chữ: ${escapeHtml(formatVietnameseMoneyWords(result.totalAmount))}</span>
          </div>
          <ul class="win-breakdown">
            ${itemsHtml}
          </ul>
          ${partialNote}
          <p class="result-note">Các con số trúng thưởng đã được đánh dấu nổi bật trong bảng kết quả bên dưới.</p>
        </div>
      `;
    } else {
      els.checkResultSection.hidden = false;
      els.checkResultSection.innerHTML = `
        <div class="result-box is-lose">
          <div class="result-headline">
            <span class="result-badge">Chưa trúng thưởng</span>
          </div>
          <p class="result-ticket-summary">
            Rất tiếc, vé số <span class="ticket-pill-num">${escapeHtml(ticket)}</span> đài <strong>${escapeHtml(station.name)}</strong> mở thưởng ngày <strong>${escapeHtml(formatShortDate(ymd))}</strong> chưa trúng giải nào.
          </p>
          ${partialNote || '<p class="result-note">Chúc bạn may mắn trong kỳ mở thưởng tiếp theo!</p>'}
        </div>
      `;
    }

    els.checkResultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ============================================================================
  // 9. KHỞI TẠO SỰ KIỆN & CHẠY ỨNG DỤNG
  // ============================================================================
  function bindEvents() {
    if (els.themeToggleBtn) {
      els.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Bước 1: Chọn ngày trên lịch -> điền DD/MM/YYYY, tự đổi danh sách đài và chọn sẵn đài đầu tiên
    els.drawDatePicker.addEventListener('change', () => {
      const ymd = els.drawDatePicker.value;
      if (!parseYMD(ymd)) {
        setSelectedDate(state.selectedDate, false);
        return;
      }
      setSelectedDate(ymd, true);
    });

    // Bấm vào ô ngày -> mở lịch (trình duyệt hỗ trợ showPicker); vẫn cho gõ tay DD/MM/YYYY
    els.drawDateInput.addEventListener('click', openNativeDatePicker);

    // Gõ tay: tự chèn dấu "/" và nhận ngày khi đủ DD/MM/YYYY
    els.drawDateInput.addEventListener('input', evt => {
      const isDeleting = evt.inputType && evt.inputType.startsWith('delete');
      let v = els.drawDateInput.value.replace(/[^\d\/]/g, '');
      if (!isDeleting) {
        const digits = v.replace(/\//g, '').slice(0, 8);
        v = digits.length > 4
          ? `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
          : digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      }
      els.drawDateInput.value = v.slice(0, 10);
      const ymd = dmyToYmd(els.drawDateInput.value);
      if (ymd && ymd !== state.selectedDate) setSelectedDate(ymd, true);
    });

    // Rời ô mà ngày gõ chưa hợp lệ -> trả lại ngày đang chọn
    els.drawDateInput.addEventListener('blur', () => {
      const ymd = dmyToYmd(els.drawDateInput.value);
      if (!ymd) {
        setSelectedDate(state.selectedDate, false);
      } else if (ymd !== state.selectedDate) {
        setSelectedDate(ymd, true);
      } else {
        setSelectedDate(ymd, false);
      }
    });

    // Bước 2: Bấm chọn đài (hoặc nhấn lại vào đài đang chọn để bỏ chọn)
    els.todayStationsChips.addEventListener('click', evt => {
      const chip = evt.target.closest('[data-station-code]');
      if (!chip) return;
      const code = chip.getAttribute('data-station-code');
      const st = STATION_MAP.get(code);
      if (!st) return;

      state.lastCheckHighlight = null;
      els.checkResultSection.hidden = true;

      if (state.selectedStation && state.selectedStation.code === st.code) {
        // Bỏ chọn đài hiện tại -> nút KIỂM TRA tự mờ đi & hiện dòng nhắc chọn đài ở Bước 2
        applySelectedStation(null, false);
      } else {
        applySelectedStation(st, true);
        els.ticketNumberInput.focus();
      }
    });

    // Bước 3: Ô nhập số vé chỉ nhận chữ số 0-9
    els.ticketNumberInput.addEventListener('beforeinput', evt => {
      if (evt.data && /\D/.test(evt.data)) {
        evt.preventDefault();
      }
    });

    els.ticketNumberInput.addEventListener('input', () => {
      updateTicketDigitCounter();
    });

    els.clearTicketBtn.addEventListener('click', () => {
      els.ticketNumberInput.value = '';
      updateTicketDigitCounter();
      els.ticketNumberInput.focus();
    });

    document.querySelectorAll('input[name="mbSymbolMode"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (!els.checkResultSection.hidden && state.selectedStation?.region === 'MB') {
          els.ticketForm.requestSubmit();
        }
      });
    });

    els.regionTabs.addEventListener('click', evt => {
      const tabBtn = evt.target.closest('[data-region]');
      if (!tabBtn) return;
      const reg = tabBtn.getAttribute('data-region');
      if (reg && reg !== state.activeRegion) {
        state.activeRegion = reg;
        renderBoard();
      }
    });

    els.ticketForm.addEventListener('submit', handleFormSubmit);
  }

  function init() {
    cacheDom();
    initTheme();
    if (!els.ticketForm) return;

    const vn = getVNNow();
    syncDatePickerLimits();

    state.selectedDate = vn.ymd;
    setSelectedDate(vn.ymd, false);

    bindEvents();
    renderClockAndLiveState();
    loadDateData(vn.ymd);

    state.clockTimerId = window.setInterval(renderClockAndLiveState, 1000);
  }

  window.DoVeSoApp = {
    STATIONS,
    normalizeText,
    resolveStation,
    evaluateTicket,
    normalizeLotteryPayload,
    getVNNow,
    diffDays,
    subtractDays
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
