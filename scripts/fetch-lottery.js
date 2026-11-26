#!/usr/bin/env node
/**
 * scripts/fetch-lottery.js
 * Chạy trên Node.js (GitHub Actions / CLI):
 * - Chỉ lấy dữ liệu thật từ xskt.com.vn (TUYỆT ĐỐI không dùng dữ liệu mẫu / số ngẫu nhiên).
 * - Parse chính xác bảng kết quả chính của đúng ngày, đúng miền (loại trừ bảng lô tô, thống kê, điện toán, Vietlott, bảng khác ngày).
 * - Validate nghiêm ngặt từng đài, từng giải (số lượng giải & số chữ số theo PRIZE_SPECS) và đối chiếu chéo với xskt.com.vn trước khi lưu.
 * - Lưu thành data/YYYY-MM-DD.json, giữ tối đa 32 ngày mở thưởng gần nhất và cập nhật data/index.json.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const RETENTION_DAYS = 32;

const STATIONS = [
  // 21 đài Miền Nam
  { code: 'tp-hcm', name: 'TP.HCM', region: 'MN', aliases: ['tp hcm', 'tphcm', 'hcm', 'ho chi minh', 'tp ho chi minh', 'thanh pho ho chi minh'] },
  { code: 'dong-thap', name: 'Đồng Tháp', region: 'MN', aliases: ['dong thap'] },
  { code: 'ca-mau', name: 'Cà Mau', region: 'MN', aliases: ['ca mau'] },
  { code: 'ben-tre', name: 'Bến Tre', region: 'MN', aliases: ['ben tre'] },
  { code: 'vung-tau', name: 'Vũng Tàu', region: 'MN', aliases: ['vung tau', 'ba ria vung tau'] },
  { code: 'bac-lieu', name: 'Bạc Liêu', region: 'MN', aliases: ['bac lieu'] },
  { code: 'dong-nai', name: 'Đồng Nai', region: 'MN', aliases: ['dong nai'] },
  { code: 'can-tho', name: 'Cần Thơ', region: 'MN', aliases: ['can tho'] },
  { code: 'soc-trang', name: 'Sóc Trăng', region: 'MN', aliases: ['soc trang'] },
  { code: 'tay-ninh', name: 'Tây Ninh', region: 'MN', aliases: ['tay ninh'] },
  { code: 'an-giang', name: 'An Giang', region: 'MN', aliases: ['an giang'] },
  { code: 'binh-thuan', name: 'Bình Thuận', region: 'MN', aliases: ['binh thuan'] },
  { code: 'vinh-long', name: 'Vĩnh Long', region: 'MN', aliases: ['vinh long'] },
  { code: 'binh-duong', name: 'Bình Dương', region: 'MN', aliases: ['binh duong'] },
  { code: 'tra-vinh', name: 'Trà Vinh', region: 'MN', aliases: ['tra vinh'] },
  { code: 'long-an', name: 'Long An', region: 'MN', aliases: ['long an'] },
  { code: 'binh-phuoc', name: 'Bình Phước', region: 'MN', aliases: ['binh phuoc'] },
  { code: 'hau-giang', name: 'Hậu Giang', region: 'MN', aliases: ['hau giang'] },
  { code: 'tien-giang', name: 'Tiền Giang', region: 'MN', aliases: ['tien giang'] },
  { code: 'kien-giang', name: 'Kiên Giang', region: 'MN', aliases: ['kien giang'] },
  { code: 'da-lat', name: 'Đà Lạt', region: 'MN', aliases: ['da lat', 'lam dong', 'da lat lam dong'] },

  // 14 đài Miền Trung
  { code: 'thua-thien-hue', name: 'Thừa Thiên Huế', region: 'MT', aliases: ['thua thien hue', 'hue', 'tt hue'] },
  { code: 'phu-yen', name: 'Phú Yên', region: 'MT', aliases: ['phu yen'] },
  { code: 'dak-lak', name: 'Đắk Lắk', region: 'MT', aliases: ['dak lak', 'dac lac', 'daklak'] },
  { code: 'quang-nam', name: 'Quảng Nam', region: 'MT', aliases: ['quang nam'] },
  { code: 'da-nang', name: 'Đà Nẵng', region: 'MT', aliases: ['da nang'] },
  { code: 'khanh-hoa', name: 'Khánh Hòa', region: 'MT', aliases: ['khanh hoa'] },
  { code: 'binh-dinh', name: 'Bình Định', region: 'MT', aliases: ['binh dinh'] },
  { code: 'quang-tri', name: 'Quảng Trị', region: 'MT', aliases: ['quang tri'] },
  { code: 'quang-binh', name: 'Quảng Bình', region: 'MT', aliases: ['quang binh'] },
  { code: 'gia-lai', name: 'Gia Lai', region: 'MT', aliases: ['gia lai'] },
  { code: 'ninh-thuan', name: 'Ninh Thuận', region: 'MT', aliases: ['ninh thuan'] },
  { code: 'quang-ngai', name: 'Quảng Ngãi', region: 'MT', aliases: ['quang ngai'] },
  { code: 'dak-nong', name: 'Đắk Nông', region: 'MT', aliases: ['dak nong', 'dac nong', 'daknong'] },
  { code: 'kon-tum', name: 'Kon Tum', region: 'MT', aliases: ['kon tum', 'kontum'] },

  // Miền Bắc
  { code: 'mien-bac', name: 'Miền Bắc', region: 'MB', aliases: ['mien bac', 'mb', 'xsmb', 'ha noi', 'quang ninh', 'bac ninh', 'hai phong', 'nam dinh', 'thai binh', 'thu do'] }
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

const PRIZE_SPECS_MN_MT = {
  DB: { digits: 6, count: 1 },
  G1: { digits: 5, count: 1 },
  G2: { digits: 5, count: 1 },
  G3: { digits: 5, count: 2 },
  G4: { digits: 5, count: 7 },
  G5: { digits: 4, count: 1 },
  G6: { digits: 4, count: 3 },
  G7: { digits: 3, count: 1 },
  G8: { digits: 2, count: 1 }
};

const PRIZE_SPECS_MB = {
  DB: { digits: 5, count: 1 },
  G1: { digits: 5, count: 1 },
  G2: { digits: 5, count: 2 },
  G3: { digits: 5, count: 6 },
  G4: { digits: 4, count: 4 },
  G5: { digits: 4, count: 6 },
  G6: { digits: 3, count: 3 },
  G7: { digits: 2, count: 4 }
};

// Bộ nhớ đệm HTML trang chủ & trang 90/100 ngày trong cùng 1 lần chạy
const htmlCache = new Map();

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

function getTodayVN() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const y = parts.find(p => p.type === 'year').value;
  const m = parts.find(p => p.type === 'month').value;
  const d = parts.find(p => p.type === 'day').value;
  return `${y}-${m}-${d}`;
}

function parseYMD(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatYMD(dateObj) {
  const y = dateObj.getUTCFullYear();
  const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function subtractDays(ymd, days) {
  const dt = parseYMD(ymd);
  dt.setUTCDate(dt.getUTCDate() - days);
  return formatYMD(dt);
}

function diffDays(olderYmd, newerYmd) {
  const msPerDay = 86400000;
  return Math.round((parseYMD(newerYmd).getTime() - parseYMD(olderYmd).getTime()) / msPerDay);
}

function matchStation(rawLabel, expectedRegion) {
  const norm = normalizeText(rawLabel);
  if (!norm) return null;
  const candidates = STATIONS.filter(s => !expectedRegion || s.region === expectedRegion);

  // Ưu tiên khớp chính xác tên đài hoặc alias trước
  for (const st of candidates) {
    if (normalizeText(st.name) === norm || normalizeText(st.code) === norm) return st;
    for (const al of st.aliases) {
      if (norm === normalizeText(al)) return st;
    }
  }
  // Khớp chứa tên đài / alias theo ranh giới từ
  const padded = ` ${norm} `;
  for (const st of candidates) {
    const stNorm = normalizeText(st.name);
    if (padded.includes(` ${stNorm} `)) return st;
    for (const al of st.aliases) {
      const alNorm = normalizeText(al);
      if (alNorm.length >= 4 && padded.includes(` ${alNorm} `)) return st;
    }
  }
  return null;
}

function decodeHtmlEntities(html) {
  return String(html || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)));
}

function cleanCellText(cellHtml) {
  return decodeHtmlEntities(
    String(cellHtml || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<(br|\/p|\/div|\/em|\/span|\/li|\/b|\/strong)\b[^>]*>/gi, ' | ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Chỉ map nhãn giải chính thức trong bảng kết quả HTML (ĐB, G.1..G.8, G1..G8, Giải nhất..Giải tám).
 * TUYỆT ĐỐI không map các số đơn lẻ '0'..'9' để không bao giờ nhận nhầm cột ĐẦU lô tô!
 */
function mapPrizeKey(labelText, cellHtml = '') {
  const titleMatch = String(cellHtml || '').match(/\btitle=["']([^"']+)["']/i);
  const candidates = [labelText, titleMatch ? titleMatch[1] : ''];

  for (const raw of candidates) {
    const norm = normalizeText(raw).replace(/\s+/g, '');
    if (!norm) continue;
    if (norm === 'db' || norm === 'gdb' || norm === 'dacbiet' || norm === 'giaidacbiet' || norm === 'giaidb') return 'DB';
    if (norm === 'g1' || norm === 'giainhat' || norm === 'giai1') return 'G1';
    if (norm === 'g2' || norm === 'giainhi' || norm === 'giai2') return 'G2';
    if (norm === 'g3' || norm === 'giaiba' || norm === 'giai3') return 'G3';
    if (norm === 'g4' || norm === 'giaitu' || norm === 'giai4') return 'G4';
    if (norm === 'g5' || norm === 'giainam' || norm === 'giai5') return 'G5';
    if (norm === 'g6' || norm === 'giaisau' || norm === 'giai6') return 'G6';
    if (norm === 'g7' || norm === 'giaibay' || norm === 'giai7') return 'G7';
    if (norm === 'g8' || norm === 'giaitam' || norm === 'giai8') return 'G8';
  }
  return null;
}

function extractNumbersForPrize(rawText, spec) {
  if (!rawText) return [];
  const tokens = rawText.match(/\d+/g) || [];
  const results = [];
  for (const tok of tokens) {
    if (tok.length === spec.digits) {
      results.push(tok);
    } else if (tok.length > spec.digits && tok.length % spec.digits === 0) {
      for (let i = 0; i < tok.length; i += spec.digits) {
        results.push(tok.slice(i, i + spec.digits));
      }
    } else {
      // Nếu xuất hiện cụm chữ số sai độ dài bất thường trong ô giải -> trả mảng rỗng để validate báo lỗi
      return [];
    }
  }
  return results;
}

/**
 * Parse ký hiệu Mã ĐB của XSMB trên xskt.com.vn:
 * - Dạng phổ biến trên xskt.com.vn: "Mã ĐB: 5 7 9 13 14 15 (LT)" -> ["5LT", "7LT", "9LT", "13LT", "14LT", "15LT"]
 * - Dạng viết liền: "1ZN 4ZN 7ZN" -> ["1ZN", "4ZN", "7ZN"]
 */
function parseMBSpecialCodes(rowHtml) {
  const strongMatch = rowHtml.match(/Mã\s*ĐB\s*:\s*<strong[^>]*>([\s\S]*?)<\/strong>/i);
  const targetText = cleanCellText(strongMatch ? strongMatch[1] : rowHtml);

  // Dạng "5 7 9 13 14 15 (LT)"
  const parenMatch = targetText.match(/((?:\d{1,2}[\s,\-]+)+\d{1,2}|\d{1,2})\s*\(\s*([A-Z]{1,4})\s*\)/i);
  if (parenMatch) {
    const nums = parenMatch[1].match(/\d{1,2}/g) || [];
    const suffix = parenMatch[2].toUpperCase();
    if (nums.length > 0) {
      return nums.map(n => `${n}${suffix}`);
    }
  }

  // Dạng "1LT 5LT 9LT" (chỉ lấy phần trước chữ XSMB để không bắt nhầm "100 ngày")
  const beforeLinks = targetText.split(/xsmb/i)[0] || targetText;
  const directCodes = beforeLinks.match(/\b\d{1,2}[A-Z]{1,4}\b/gi) || [];
  return directCodes.map(c => c.toUpperCase());
}

async function fetchHtml(url, useCache = false) {
  if (useCache && htmlCache.has(url)) {
    return htmlCache.get(url);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const text = await res.text();
    if (useCache) {
      htmlCache.set(url, text);
    }
    return text;
  } finally {
    clearTimeout(timer);
  }
}

function extractTables(html) {
  return html.match(/<table\b[\s\S]*?<\/table>/gi) || [];
}

function extractRows(tableHtml) {
  return tableHtml.match(/<tr\b[\s\S]*?<\/tr>/gi) || [];
}

function extractCells(rowHtml) {
  return rowHtml.match(/<t[dh]\b[\s\S]*?<\/t[dh]>/gi) || [];
}

/**
 * Kiểm tra hàng tiêu đề của bảng trên xskt.com.vn có chứa đúng ngày D-M-YYYY đang cần lấy hay không.
 * Trên xskt.com.vn, mọi bảng kết quả chính (MN, MT, MB) đều có:
 *   data-url="<dai>/<d>-<m>-<yyyy>" và title="Đọc kết quả ... ngày <d>-<m>-<yyyy>"
 * Nhờ kiểm tra này, tuyệt đối không bao giờ parse nhầm bảng ngày hôm qua hoặc bảng bị cache sai ngày.
 */
function headerRowMatchesExactDate(headerRowHtml, ymd) {
  const [yyyy, mm, dd] = ymd.split('-').map(Number);
  const fullDates = [];

  const dataUrlRegex = /data-url=["'][^"']*?\/(\d{1,2})-(\d{1,2})-(\d{4})["']/gi;
  for (const m of headerRowHtml.matchAll(dataUrlRegex)) {
    fullDates.push({ d: Number(m[1]), m: Number(m[2]), y: Number(m[3]) });
  }

  const textDateRegex = /(?:ngay|ngày|\b)(\d{1,2})[-/](\d{1,2})[-/](\d{4})\b/gi;
  for (const m of headerRowHtml.matchAll(textDateRegex)) {
    fullDates.push({ d: Number(m[1]), m: Number(m[2]), y: Number(m[3]) });
  }

  if (fullDates.length === 0) return false;
  return fullDates.every(dt => dt.d === dd && dt.m === mm && dt.y === yyyy);
}

/**
 * Kiểm tra loại thẻ <table> để loại bỏ tuyệt đối bảng lô tô, bảng tìm lô tô, điện toán, Vietlott, hoặc bảng khác miền.
 */
function isCandidateResultTable(tableHtml, region) {
  const openTag = (tableHtml.match(/<table\b[^>]*>/i) || [''])[0];
  if (!openTag) return false;

  // Loại trừ các bảng phụ: lô tô, tìm lô tô (fnMN0/fnMT0/fnMB0), điện toán (dtmb/trunggiai), vietlott
  if (/\b(loto|trunggiai|dtmb|vietlott|mega|power|max3d)\b/i.test(openTag)) return false;
  if (/\bid=["']?fn/i.test(openTag)) return false;

  if (region === 'MN') {
    if (/\bid=["']?(MT|MB)/i.test(openTag)) return false;
    // Bỏ qua bảng MN1 "(theo lịch MT)" nếu có id="MN1" trên trang ngày đơn lẻ; chỉ nhận tbl-xsmn
    return /\btbl-xsmn\b/i.test(openTag) || /\bid=["']?MN\d*["']?/i.test(openTag);
  }

  if (region === 'MT') {
    if (/\bid=["']?(MN|MB)/i.test(openTag)) return false;
    return /\btbl-xsmn\b/i.test(openTag) || /\bid=["']?MT\d*["']?/i.test(openTag);
  }

  if (region === 'MB') {
    if (/\bid=["']?(MN|MT)/i.test(openTag)) return false;
    if (/\btbl-xsmn\b/i.test(openTag)) return false;
    return /\bid=["']?MB\d*["']?/i.test(openTag) || /\bclass=["'][^"']*\bresult\b/i.test(openTag);
  }

  return false;
}

function parseMultiStationTable(html, region, ymd) {
  const tables = extractTables(html).filter(t => isCandidateResultTable(t, region));
  const primaryId = region === 'MN' ? 'MN0' : 'MT0';
  const ordered = [
    ...tables.filter(t => new RegExp(`\\bid=["']?${primaryId}["']?`, 'i').test((t.match(/<table\b[^>]*>/i) || [''])[0])),
    ...tables.filter(t => !new RegExp(`\\bid=["']?${primaryId}["']?`, 'i').test((t.match(/<table\b[^>]*>/i) || [''])[0]))
  ];

  for (const table of ordered) {
    const rows = extractRows(table);
    if (rows.length < 10) continue;

    // Hàng tiêu đề bắt buộc phải khớp chính xác ngày D-M-YYYY của ymd
    const headerRow = rows[0];
    if (!headerRowMatchesExactDate(headerRow, ymd)) continue;

    const headerCells = extractCells(headerRow);
    const stationColumns = [];
    headerCells.forEach((cell, idx) => {
      if (idx === 0) return;
      const st = matchStation(cleanCellText(cell), region);
      if (st) stationColumns.push({ colIdx: idx, station: st });
    });

    if (stationColumns.length < 2) continue;

    const stationMap = new Map();
    for (const col of stationColumns) {
      stationMap.set(col.colIdx, {
        code: col.station.code,
        name: col.station.name,
        prizes: { DB: [], G1: [], G2: [], G3: [], G4: [], G5: [], G6: [], G7: [], G8: [] }
      });
    }

    for (let r = 1; r < rows.length; r++) {
      const cells = extractCells(rows[r]);
      if (cells.length < stationColumns.length + 1) continue;
      const prizeKey = mapPrizeKey(cleanCellText(cells[0]), cells[0]);
      if (!prizeKey || !PRIZE_SPECS_MN_MT[prizeKey]) continue;

      for (const col of stationColumns) {
        if (col.colIdx < cells.length) {
          const rawVal = cleanCellText(cells[col.colIdx]);
          const nums = extractNumbersForPrize(rawVal, PRIZE_SPECS_MN_MT[prizeKey]);
          stationMap.get(col.colIdx).prizes[prizeKey] = nums;
        }
      }
    }

    const parsedStations = Array.from(stationMap.values());
    const validation = validateRegionResult(region, parsedStations, ymd);
    if (validation.valid) {
      return parsedStations;
    }
  }
  return [];
}

function parseMBTable(html, ymd) {
  const tables = extractTables(html).filter(t => isCandidateResultTable(t, 'MB'));
  const ordered = [
    ...tables.filter(t => /\bid=["']?MB0["']?/i.test((t.match(/<table\b[^>]*>/i) || [''])[0])),
    ...tables.filter(t => !/\bid=["']?MB0["']?/i.test((t.match(/<table\b[^>]*>/i) || [''])[0]))
  ];

  const dow = parseYMD(ymd).getUTCDay();

  for (const table of ordered) {
    const rows = extractRows(table);
    if (rows.length < 9) continue;

    const headerRow = rows[0];
    if (!headerRowMatchesExactDate(headerRow, ymd)) continue;
    if (!/xsmb|mien bac/i.test(normalizeText(cleanCellText(headerRow)))) continue;

    const prizes = { DB: [], G1: [], G2: [], G3: [], G4: [], G5: [], G6: [], G7: [] };
    let maDB = [];

    for (let r = 1; r < rows.length; r++) {
      const rowHtml = rows[r];
      const normRow = normalizeText(cleanCellText(rowHtml));

      if (normRow.includes('ma db') || normRow.includes('ky hieu')) {
        const extractedCodes = parseMBSpecialCodes(rowHtml);
        if (extractedCodes.length > 0) maDB = extractedCodes;
        continue;
      }

      const cells = extractCells(rowHtml);
      // Trong bảng MB0 của xskt.com.vn, các hàng giải chính luôn có 4 cột (Giải | Số trúng | ĐẦU | ĐUÔI).
      // Các hàng phụ của rowspan (Đầu 4, Đầu 7) chỉ có 2 cột -> kiểm tra cả mapPrizeKey lẫn số cột.
      if (cells.length < 2) continue;
      const prizeKey = mapPrizeKey(cleanCellText(cells[0]), cells[0]);
      if (!prizeKey || !PRIZE_SPECS_MB[prizeKey]) continue;

      // Chỉ đọc đúng cells[1] (cột kết quả giải), bỏ qua hoàn toàn cells[2] & cells[3] (ĐẦU / ĐUÔI lô tô)
      const rawVal = cleanCellText(cells[1]);
      prizes[prizeKey] = extractNumbersForPrize(rawVal, PRIZE_SPECS_MB[prizeKey]);
    }

    const candidate = [
      {
        code: 'mien-bac',
        name: 'Miền Bắc',
        subtitle: MB_SUBTITLE_BY_DOW[dow] || 'Hà Nội',
        maDB,
        prizes
      }
    ];

    const validation = validateRegionResult('MB', candidate, ymd);
    if (validation.valid) {
      return candidate;
    }
  }
  return [];
}

function parseRssFeed(xml, region, targetYmd) {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  const [yyyy, mm, dd] = targetYmd.split('-');
  const dNoPad = String(Number(dd));
  const mNoPad = String(Number(mm));

  for (const item of items) {
    const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/i);
    const pubMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
    const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/i);
    const descMatch = item.match(/<description>([\s\S]*?)<\/description>/i);
    if (!descMatch) continue;

    // Bắt buộc kiểm tra ngày có đầy đủ NĂM (YYYY) trong <link> hoặc <pubDate> để tránh nhầm năm/ngày
    const fullMeta = `${linkMatch ? linkMatch[1] : ''} ${pubMatch ? pubMatch[1] : ''} ${titleMatch ? titleMatch[1] : ''}`;
    const fullDatePatterns = [
      `ngay-${dNoPad}-${mNoPad}-${yyyy}`,
      `ngay-${dd}-${mm}-${yyyy}`,
      `${dd}/${mm}/${yyyy}`,
      `${dNoPad}/${mNoPad}/${yyyy}`
    ];
    if (!fullDatePatterns.some(pat => fullMeta.includes(pat))) continue;

    const desc = decodeHtmlEntities(
      descMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    );

    if (region === 'MB') {
      const prizes = { DB: [], G1: [], G2: [], G3: [], G4: [], G5: [], G6: [], G7: [] };
      const segments = desc.split(/(?=(?:ĐB|DB|[1-7])\s*:)/i);
      for (const seg of segments) {
        const m = seg.match(/^(ĐB|DB|[1-7])\s*:\s*([\s\S]+)$/i);
        if (!m) continue;
        const pKey = m[1].toUpperCase() === 'ĐB' || m[1].toUpperCase() === 'DB' ? 'DB' : `G${m[1]}`;
        if (PRIZE_SPECS_MB[pKey]) {
          prizes[pKey] = extractNumbersForPrize(m[2], PRIZE_SPECS_MB[pKey]);
        }
      }
      const dow = parseYMD(targetYmd).getUTCDay();
      const candidate = [{
        code: 'mien-bac',
        name: 'Miền Bắc',
        subtitle: MB_SUBTITLE_BY_DOW[dow] || 'Hà Nội',
        maDB: [],
        prizes
      }];
      if (validateRegionResult('MB', candidate, targetYmd).valid) {
        return candidate;
      }
    } else {
      const blocks = desc.split(/\[([^\]]+)\]/g);
      const stationByCode = new Map();
      for (let i = 1; i < blocks.length; i += 2) {
        const st = matchStation(blocks[i], region);
        const body = blocks[i + 1] || '';
        if (!st) continue;
        const prizes = { DB: [], G1: [], G2: [], G3: [], G4: [], G5: [], G6: [], G7: [], G8: [] };
        const segments = body.split(/(?=(?:ĐB|DB|[1-8])\s*:)/i);
        for (const seg of segments) {
          const m = seg.match(/^(ĐB|DB|[1-8])\s*:\s*([\s\S]+)$/i);
          if (!m) continue;
          const pKey = m[1].toUpperCase() === 'ĐB' || m[1].toUpperCase() === 'DB' ? 'DB' : `G${m[1]}`;
          if (PRIZE_SPECS_MN_MT[pKey]) {
            prizes[pKey] = extractNumbersForPrize(m[2], PRIZE_SPECS_MN_MT[pKey]);
          }
        }
        stationByCode.set(st.code, { code: st.code, name: st.name, prizes });
      }
      // Sắp xếp lại theo thứ tự đài chuẩn của lịch mở thưởng trong ngày
      const dow = parseYMD(targetYmd).getUTCDay();
      const scheduledCodes = WEEKLY_SCHEDULE[region][dow] || [];
      const orderedStations = [
        ...scheduledCodes.map(c => stationByCode.get(c)).filter(Boolean),
        ...Array.from(stationByCode.values()).filter(s => !scheduledCodes.includes(s.code))
      ];
      if (validateRegionResult(region, orderedStations, targetYmd).valid) {
        return orderedStations;
      }
    }
  }
  return [];
}

/**
 * Validate nghiêm ngặt kết quả của 1 miền trước khi chấp nhận lưu:
 * - Đủ đài mở thưởng hợp lệ của miền đó, không trùng lặp.
 * - Đủ tất cả các giải trong PRIZE_SPECS (ĐB..G8 cho MN/MT; ĐB..G7 cho MB).
 * - Đúng số lượng lô mỗi giải (spec.count) và đúng số chữ số mỗi giải (spec.digits):
 *   ĐB = 6 số (MN/MT) / 5 số (MB), G1/G2 = 5 số, G8 = 2 số (MN/MT), G7 = 3 số (MN/MT) / 2 số (MB)...
 */
function validateRegionResult(region, stations, ymd) {
  const errors = [];
  if (!Array.isArray(stations) || stations.length === 0) {
    return { valid: false, errors: [`${region} (${ymd}): Danh sách đài rỗng`] };
  }

  const dow = parseYMD(ymd).getUTCDay();
  const expectedCodes = WEEKLY_SCHEDULE[region]?.[dow] || [];
  const specs = region === 'MB' ? PRIZE_SPECS_MB : PRIZE_SPECS_MN_MT;

  if (region === 'MB' && stations.length !== 1) {
    errors.push(`MB (${ymd}): Phải có đúng 1 đài Miền Bắc, nhận được ${stations.length}`);
  }
  if ((region === 'MN' || region === 'MT') && stations.length < expectedCodes.length) {
    errors.push(`${region} (${ymd}): Thiếu đài mở thưởng (cần ${expectedCodes.length} đài [${expectedCodes.join(', ')}], nhận được ${stations.length})`);
  }

  const seenCodes = new Set();
  for (const st of stations) {
    if (!st || !st.code || !st.name || !st.prizes) {
      errors.push(`${region} (${ymd}): Cấu trúc đài không hợp lệ`);
      continue;
    }
    if (seenCodes.has(st.code)) {
      errors.push(`${region} (${ymd}): Trùng lặp đài ${st.code}`);
    }
    seenCodes.add(st.code);

    const knownStation = STATIONS.find(s => s.code === st.code && s.region === region);
    if (!knownStation) {
      errors.push(`${region} (${ymd}): Đài ${st.code} không thuộc miền ${region}`);
    }

    for (const [prizeKey, spec] of Object.entries(specs)) {
      const arr = st.prizes[prizeKey];
      if (!Array.isArray(arr)) {
        errors.push(`${region} - ${st.name} (${ymd}): Thiếu mảng giải ${prizeKey}`);
        continue;
      }
      if (arr.length !== spec.count) {
        errors.push(`${region} - ${st.name} (${ymd}): Giải ${prizeKey} phải có đúng ${spec.count} số, thực tế có ${arr.length}`);
        continue;
      }
      for (const num of arr) {
        const str = String(num);
        if (!/^\d+$/.test(str) || str.length !== spec.digits) {
          errors.push(`${region} - ${st.name} (${ymd}): Giải ${prizeKey} chứa số '${str}' sai định dạng (cần đúng ${spec.digits} chữ số)`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Đối chiếu chéo kết quả đã parse với đoạn tóm tắt văn bản (tintuc-content) ngay trên trang xskt.com.vn
 * (nếu trang có đoạn tóm tắt cho đúng ngày đó) để đảm bảo ĐB, G1, G2 khớp 100%.
 */
function crossCheckWithPageSummary(html, region, stations, ymd) {
  const [yyyy, mm, dd] = ymd.split('-');
  const d = Number(dd);
  const m = Number(mm);
  const summaryMatch = html.match(/<div class=["']info-xskt tintuc-content["']>([\s\S]*?)<\/div>/i);
  if (!summaryMatch) return { ok: true };

  const summaryHtml = summaryMatch[1];
  if (!summaryHtml.includes(`${d}-${m}-${yyyy}`) && !summaryHtml.includes(`${dd}-${mm}-${yyyy}`) && !summaryHtml.includes(`${d}/${m}/${yyyy}`) && !summaryHtml.includes(`${dd}/${mm}/${yyyy}`)) {
    return { ok: true };
  }

  if (region === 'MB') {
    const mb = stations[0];
    const dbMatch = summaryHtml.match(/vé số có số\s*<b[^>]*>(\d{5})<\/b>/i);
    const g1Match = summaryHtml.match(/Giải Nhất[\s\S]*?dãy số\s*<b[^>]*>(\d{5})<\/b>/i);
    if (dbMatch && mb.prizes.DB[0] !== dbMatch[1]) {
      return { ok: false, reason: `MB (${ymd}) lệch ĐB với tóm tắt xskt: bảng=${mb.prizes.DB[0]}, tóm tắt=${dbMatch[1]}` };
    }
    if (g1Match && mb.prizes.G1[0] !== g1Match[1]) {
      return { ok: false, reason: `MB (${ymd}) lệch G1 với tóm tắt xskt: bảng=${mb.prizes.G1[0]}, tóm tắt=${g1Match[1]}` };
    }
  } else {
    const lines = summaryHtml.split(/<br\s*\/?>/i);
    for (const line of lines) {
      const cleanLine = cleanCellText(line);
      if (!cleanLine.includes('Trúng giải ĐB')) continue;
      const st = stations.find(s => normalizeText(cleanLine).includes(normalizeText(s.name)));
      if (!st) continue;
      const dbMatch = cleanLine.match(/6 số\s+(\d{6})/i);
      const g1Match = cleanLine.match(/dãy số\s+(\d{5})/i);
      const g2Match = cleanLine.match(/cuối cùng là\s+(\d{5})\s+trúng giải Nhì/i);
      if (dbMatch && st.prizes.DB[0] !== dbMatch[1]) {
        return { ok: false, reason: `${st.name} (${ymd}) lệch ĐB với tóm tắt xskt: bảng=${st.prizes.DB[0]}, tóm tắt=${dbMatch[1]}` };
      }
      if (g1Match && st.prizes.G1[0] !== g1Match[1]) {
        return { ok: false, reason: `${st.name} (${ymd}) lệch G1 với tóm tắt xskt: bảng=${st.prizes.G1[0]}, tóm tắt=${g1Match[1]}` };
      }
      if (g2Match && st.prizes.G2[0] !== g2Match[1]) {
        return { ok: false, reason: `${st.name} (${ymd}) lệch G2 với tóm tắt xskt: bảng=${st.prizes.G2[0]}, tóm tắt=${g2Match[1]}` };
      }
    }
  }
  return { ok: true };
}

/**
 * So sánh 2 danh sách đài (ví dụ giữa trang ngày và trang chủ / trang 90 ngày của xskt.com.vn)
 */
function compareStationLists(a, b, region) {
  const specs = region === 'MB' ? PRIZE_SPECS_MB : PRIZE_SPECS_MN_MT;
  if (a.length !== b.length) return `Khác số lượng đài (${a.length} vs ${b.length})`;
  for (const stA of a) {
    const stB = b.find(x => x.code === stA.code);
    if (!stB) return `Không tìm thấy đài ${stA.name} khi đối chiếu`;
    for (const key of Object.keys(specs)) {
      const sA = stA.prizes[key].join(',');
      const sB = stB.prizes[key].join(',');
      if (sA !== sB) {
        return `Lệch giải ${key} đài ${stA.name}: [${sA}] vs [${sB}]`;
      }
    }
  }
  return null;
}

async function fetchRegionForDate(region, ymd) {
  const [yyyy, mm, dd] = ymd.split('-');
  const d = Number(dd);
  const m = Number(mm);
  const slug = region === 'MN' ? 'xsmn' : region === 'MT' ? 'xsmt' : 'xsmb';
  const rssSlug = region === 'MN' ? 'mien-nam-xsmn' : region === 'MT' ? 'mien-trung-xsmt' : 'mien-bac-xsmb';
  const archiveSlug = region === 'MB' ? '100-ngay' : '90-ngay';

  const parseFn = html => (region === 'MB' ? parseMBTable(html, ymd) : parseMultiStationTable(html, region, ymd));

  // 1. Thử URL theo ngày chính thức của xskt.com.vn
  const directUrls = [
    `https://xskt.com.vn/${slug}/ngay-${d}-${m}-${yyyy}`
  ];
  if (`${d}-${m}` !== `${dd}-${mm}`) {
    directUrls.push(`https://xskt.com.vn/${slug}/ngay-${dd}-${mm}-${yyyy}`);
  }

  let parsedResult = [];
  let sourceUrl = '';

  for (const url of directUrls) {
    try {
      const html = await fetchHtml(url);
      const parsed = parseFn(html);
      if (parsed.length > 0) {
        const summaryCheck = crossCheckWithPageSummary(html, region, parsed, ymd);
        if (!summaryCheck.ok) {
          throw new Error(summaryCheck.reason);
        }
        parsedResult = parsed;
        sourceUrl = url;
        break;
      }
    } catch (err) {
      console.warn(`[WARN] Không lấy được từ ${url}: ${err.message}`);
    }
  }

  // 2. Nếu trang ngày đơn lẻ bị lỗi cache phía xskt.com.vn (VD: trả về bảng ngày cũ nên bị bộ lọc ngày từ chối),
  //    lấy từ trang lưu trữ 90-ngay / 100-ngay hoặc trang ngay-D-M của chính xskt.com.vn (có kiểm tra đúng D-M-YYYY).
  const archiveUrl = `https://xskt.com.vn/${slug}/${archiveSlug}`;
  if (parsedResult.length === 0) {
    const backupUrls = [
      { url: archiveUrl, cache: true },
      { url: `https://xskt.com.vn/${slug}/ngay-${d}-${m}`, cache: false },
      { url: 'https://xskt.com.vn/', cache: true }
    ];
    for (const item of backupUrls) {
      try {
        const html = await fetchHtml(item.url, item.cache);
        const parsed = parseFn(html);
        if (parsed.length > 0) {
          parsedResult = parsed;
          sourceUrl = item.url;
          break;
        }
      } catch (err) {
        console.warn(`[WARN] Không lấy được từ ${item.url}: ${err.message}`);
      }
    }
  }

  // 3. Fallback RSS của xskt.com.vn (có kiểm tra đầy đủ năm YYYY và validate đủ giải)
  if (parsedResult.length === 0) {
    const rssUrl = `https://xskt.com.vn/rss-feed/${rssSlug}.rss`;
    try {
      const xml = await fetchHtml(rssUrl, true);
      const parsed = parseRssFeed(xml, region, ymd);
      if (parsed.length > 0) {
        parsedResult = parsed;
        sourceUrl = rssUrl;
      }
    } catch (err) {
      console.warn(`[WARN] Không lấy được RSS ${rssUrl}: ${err.message}`);
    }
  }

  if (parsedResult.length === 0) {
    return [];
  }

  // 4. Đối chiếu chéo với trang chủ https://xskt.com.vn/ hoặc trang archive 90/100 ngày của xskt.com.vn
  try {
    const homeHtml = await fetchHtml('https://xskt.com.vn/', true);
    const homeParsed = parseFn(homeHtml);
    if (homeParsed.length > 0) {
      const diff = compareStationLists(parsedResult, homeParsed, region);
      if (diff) {
        throw new Error(`Đối chiếu chéo với trang chủ https://xskt.com.vn/ thất bại (${region} ${ymd}): ${diff}`);
      }
    } else if (sourceUrl !== archiveUrl) {
      const archHtml = await fetchHtml(archiveUrl, true);
      const archParsed = parseFn(archHtml);
      if (archParsed.length > 0) {
        const diff = compareStationLists(parsedResult, archParsed, region);
        if (diff) {
          throw new Error(`Đối chiếu chéo với ${archiveUrl} thất bại (${region} ${ymd}): ${diff}`);
        }
      }
    }
  } catch (err) {
    if (err.message.startsWith('Đối chiếu chéo')) {
      throw err;
    }
  }

  console.log(`[OK] Đã lấy & xác thực ${region} ngày ${ymd} từ ${sourceUrl} (${parsedResult.length} đài)`);
  return parsedResult;
}

async function fetchAndSaveDate(ymd) {
  console.log(`\n=== Đang tải kết quả xổ số ngày ${ymd} ===`);
  const [mn, mt, mb] = await Promise.all([
    fetchRegionForDate('MN', ymd),
    fetchRegionForDate('MT', ymd),
    fetchRegionForDate('MB', ymd)
  ]);

  if (mn.length === 0 && mt.length === 0 && mb.length === 0) {
    throw new Error(`Chưa có hoặc không lấy được kết quả từ xskt.com.vn cho ngày ${ymd}`);
  }

  // Validate nghiêm ngặt từng miền có dữ liệu trước khi lưu
  for (const [reg, list] of [['MN', mn], ['MT', mt], ['MB', mb]]) {
    if (list.length > 0) {
      const check = validateRegionResult(reg, list, ymd);
      if (!check.valid) {
        throw new Error(`Dữ liệu ${reg} ngày ${ymd} không hợp lệ:\n  - ${check.errors.join('\n  - ')}`);
      }
    }
  }

  // Nếu là ngày quá khứ (< todayVN), bắt buộc phải đủ cả 3 miền MN, MT, MB mới lưu
  const todayVN = getTodayVN();
  if (diffDays(ymd, todayVN) > 0 && (mn.length === 0 || mt.length === 0 || mb.length === 0)) {
    const missing = [
      mn.length === 0 ? 'MN' : null,
      mt.length === 0 ? 'MT' : null,
      mb.length === 0 ? 'MB' : null
    ].filter(Boolean);
    throw new Error(`Ngày quá khứ ${ymd} thiếu kết quả miền: ${missing.join(', ')} — hủy lưu để tránh dữ liệu thiếu/sai`);
  }

  const outPath = path.join(DATA_DIR, `${ymd}.json`);
  const payload = {
    date: ymd,
    dayOfWeek: parseYMD(ymd).getUTCDay(),
    updatedAt: new Date().toISOString(),
    source: 'xskt.com.vn',
    regions: {
      MN: mn,
      MT: mt,
      MB: mb
    }
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`[SAVED] ${outPath}`);
  return true;
}

function pruneAndBuildIndex(todayYmd) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const files = fs.readdirSync(DATA_DIR).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));

  // Nếu hôm nay chưa tới giờ mở thưởng (chưa có file todayYmd.json), tính mốc 32 ngày từ ngày hôm qua
  // để kho dữ liệu luôn giữ đủ 32 ngày mở thưởng gần nhất.
  const hasTodayFile = files.includes(`${todayYmd}.json`);
  const anchorYmd = hasTodayFile ? todayYmd : subtractDays(todayYmd, 1);

  const keptDates = [];
  for (const file of files) {
    const fileDate = file.replace(/\.json$/, '');
    const ageFromToday = diffDays(fileDate, todayYmd);
    const ageFromAnchor = diffDays(fileDate, anchorYmd);

    if (ageFromAnchor >= RETENTION_DAYS || ageFromToday < 0) {
      const fullPath = path.join(DATA_DIR, file);
      fs.unlinkSync(fullPath);
      console.log(`[PRUNED] Đã xóa file ngoài phạm vi ${RETENTION_DAYS} ngày: ${file}`);
    } else {
      keptDates.push(fileDate);
    }
  }

  keptDates.sort((a, b) => b.localeCompare(a));

  const indexData = {
    updatedAt: new Date().toISOString(),
    retentionDays: RETENTION_DAYS,
    count: keptDates.length,
    latestDate: keptDates[0] || anchorYmd,
    oldestDate: keptDates[keptDates.length - 1] || anchorYmd,
    dates: keptDates
  };

  const indexPath = path.join(DATA_DIR, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2) + '\n', 'utf8');
  console.log(`[INDEX] Đã cập nhật data/index.json (${keptDates.length} ngày lưu trữ: ${indexData.latestDate} -> ${indexData.oldestDate}).`);
}

async function main() {
  const todayVN = getTodayVN();
  const cliDate = (process.argv[2] || process.env.TARGET_DATE || '').trim();
  const backfillDays = Math.max(1, Math.min(RETENTION_DAYS, Number(process.env.BACKFILL_DAYS || 1) || 1));

  const hasExplicitDate = /^\d{4}-\d{2}-\d{2}$/.test(cliDate);
  const targetStart = hasExplicitDate ? cliDate : todayVN;

  let successCount = 0;
  let hardFailureCount = 0;
  let todayNotDrawnYet = false;

  for (let i = 0; i < backfillDays; i++) {
    const dt = subtractDays(targetStart, i);
    try {
      await fetchAndSaveDate(dt);
      successCount++;
    } catch (err) {
      if (!hasExplicitDate && dt === todayVN && err.message.includes('Chưa có hoặc không lấy được')) {
        todayNotDrawnYet = true;
        console.log(`[INFO] Ngày hôm nay (${todayVN}) chưa có kết quả mở thưởng trên xskt.com.vn.`);
      } else {
        hardFailureCount++;
        console.error(`[ERROR] Lỗi khi tải ngày ${dt}: ${err.message}`);
      }
    }
  }

  // Nếu chạy backfill từ hôm nay mà hôm nay chưa tới giờ mở thưởng, tự lùi thêm 1 ngày để đủ đúng backfillDays ngày có kết quả
  if (todayNotDrawnYet && backfillDays > 1) {
    const extraDate = subtractDays(todayVN, backfillDays);
    try {
      await fetchAndSaveDate(extraDate);
      successCount++;
    } catch (err) {
      hardFailureCount++;
      console.error(`[ERROR] Lỗi khi tải ngày bổ sung ${extraDate}: ${err.message}`);
    }
  }

  pruneAndBuildIndex(todayVN);

  if (hardFailureCount > 0 || (successCount === 0 && !todayNotDrawnYet)) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  STATIONS,
  WEEKLY_SCHEDULE,
  PRIZE_SPECS_MN_MT,
  PRIZE_SPECS_MB,
  parseMultiStationTable,
  parseMBTable,
  parseRssFeed,
  validateRegionResult,
  fetchRegionForDate,
  fetchAndSaveDate
};
