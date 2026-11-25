#!/usr/bin/env node
/**
 * scripts/fetch-lottery.js
 * Chạy trên Node.js (GitHub Actions / Server):
 * - Fetch kết quả xổ số 3 miền (Miền Nam, Miền Trung, Miền Bắc) từ xskt.com.vn (HTML theo ngày + fallback RSS).
 * - Parse đầy đủ các giải từ Đặc Biệt tới Giải 8 / Giải 7 (kèm Mã ĐB cho Miền Bắc).
 * - Lưu thành data/YYYY-MM-DD.json.
 * - Tự động xóa các file kết quả cũ hơn 32 ngày (chỉ giữ hôm nay và 31 ngày trước đó = 32 ngày).
 * - Cập nhật danh mục data/index.json.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const RETENTION_DAYS = 32; // Hôm nay + 31 ngày lùi lại = 32 ngày

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
  for (const st of candidates) {
    if (normalizeText(st.name) === norm || st.code === norm) return st;
    for (const al of st.aliases) {
      if (norm === al || norm.includes(al)) return st;
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

function mapPrizeKey(labelText) {
  const norm = normalizeText(labelText).replace(/\s+/g, '');
  if (!norm) return null;
  if (norm === 'db' || norm === 'gdb' || norm === 'dacbiet' || norm === 'giaidacbiet') return 'DB';
  if (norm === 'g1' || norm === '1' || norm === 'giainhat' || norm === 'nhat') return 'G1';
  if (norm === 'g2' || norm === '2' || norm === 'giainhi' || norm === 'nhi') return 'G2';
  if (norm === 'g3' || norm === '3' || norm === 'giaiba' || norm === 'ba') return 'G3';
  if (norm === 'g4' || norm === '4' || norm === 'giaitu' || norm === 'tu') return 'G4';
  if (norm === 'g5' || norm === '5' || norm === 'giainam' || norm === 'nam') return 'G5';
  if (norm === 'g6' || norm === '6' || norm === 'giaisau' || norm === 'sau') return 'G6';
  if (norm === 'g7' || norm === '7' || norm === 'giaibay' || norm === 'bay') return 'G7';
  if (norm === 'g8' || norm === '8' || norm === 'giaitam' || norm === 'tam') return 'G8';
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
      // Phòng trường hợp HTML nối liền nhiều giải cùng độ dài không có khoảng trắng
      for (let i = 0; i < tok.length; i += spec.digits) {
        results.push(tok.slice(i, i + spec.digits));
      }
    }
  }
  return results.slice(0, spec.count);
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
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
    return await res.text();
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

function parseMultiStationTable(html, region) {
  const tables = extractTables(html);
  const targetId = region === 'MN' ? 'MN0' : 'MT0';
  const ordered = [
    ...tables.filter(t => new RegExp(`id=["']?${targetId}["']?`, 'i').test(t)),
    ...tables.filter(t => !new RegExp(`id=["']?${targetId}["']?`, 'i').test(t))
  ];

  for (const table of ordered) {
    const rows = extractRows(table);
    if (rows.length < 8) continue;

    // Tìm hàng tiêu đề chứa tên các đài
    let stationColumns = [];
    let headerRowIdx = -1;
    for (let r = 0; r < Math.min(3, rows.length); r++) {
      const cells = extractCells(rows[r]);
      const cols = [];
      cells.forEach((cell, idx) => {
        if (idx === 0) return;
        const st = matchStation(cleanCellText(cell), region);
        if (st) cols.push({ colIdx: idx, station: st });
      });
      if (cols.length >= 2) {
        stationColumns = cols;
        headerRowIdx = r;
        break;
      }
    }

    if (stationColumns.length === 0) continue;

    const stationMap = new Map();
    for (const col of stationColumns) {
      stationMap.set(col.colIdx, {
        code: col.station.code,
        name: col.station.name,
        prizes: { DB: [], G1: [], G2: [], G3: [], G4: [], G5: [], G6: [], G7: [], G8: [] }
      });
    }

    for (let r = headerRowIdx + 1; r < rows.length; r++) {
      const cells = extractCells(rows[r]);
      if (cells.length < 2) continue;
      const prizeKey = mapPrizeKey(cleanCellText(cells[0]));
      if (!prizeKey || !PRIZE_SPECS_MN_MT[prizeKey]) continue;

      for (const col of stationColumns) {
        if (col.colIdx < cells.length) {
          const rawVal = cleanCellText(cells[col.colIdx]);
          const nums = extractNumbersForPrize(rawVal, PRIZE_SPECS_MN_MT[prizeKey]);
          if (nums.length > 0) {
            stationMap.get(col.colIdx).prizes[prizeKey] = nums;
          }
        }
      }
    }

    const parsedStations = Array.from(stationMap.values()).filter(s => s.prizes.DB.length > 0 || s.prizes.G8.length > 0);
    if (parsedStations.length > 0) {
      return parsedStations;
    }
  }
  return [];
}

function parseMBTable(html, ymd) {
  const tables = extractTables(html);
  const ordered = [
    ...tables.filter(t => /id=["']?MB0["']?/i.test(t)),
    ...tables.filter(t => !/id=["']?MB0["']?/i.test(t))
  ];

  const dow = parseYMD(ymd).getUTCDay();

  for (const table of ordered) {
    const rows = extractRows(table);
    if (rows.length < 7) continue;

    const prizes = { DB: [], G1: [], G2: [], G3: [], G4: [], G5: [], G6: [], G7: [] };
    let maDB = [];

    for (const row of rows) {
      const cells = extractCells(row);
      if (cells.length < 2) continue;
      const firstLabel = cleanCellText(cells[0]);
      const normFirst = normalizeText(firstLabel);

      if (normFirst.includes('ma db') || normFirst.includes('ky hieu')) {
        const rawCodes = cleanCellText(cells[1]);
        const codes = rawCodes.match(/\b\d{1,2}[A-Z]{1,3}\b/gi) || [];
        if (codes.length > 0) maDB = codes.map(c => c.toUpperCase());
        continue;
      }

      const prizeKey = mapPrizeKey(firstLabel);
      if (!prizeKey || !PRIZE_SPECS_MB[prizeKey]) continue;

      const rawVal = cleanCellText(cells[1]);
      if (prizeKey === 'DB' && maDB.length === 0) {
        const inlineCodes = rawVal.match(/\b\d{1,2}[A-Z]{1,3}\b/gi) || [];
        if (inlineCodes.length > 0) maDB = inlineCodes.map(c => c.toUpperCase());
      }

      const nums = extractNumbersForPrize(rawVal, PRIZE_SPECS_MB[prizeKey]);
      if (nums.length > 0) {
        prizes[prizeKey] = nums;
      }
    }

    if (prizes.DB.length > 0 || prizes.G7.length > 0) {
      return [
        {
          code: 'mien-bac',
          name: 'Miền Bắc',
          subtitle: MB_SUBTITLE_BY_DOW[dow] || 'Hà Nội',
          maDB,
          prizes
        }
      ];
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
    const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/i);
    const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/i);
    const descMatch = item.match(/<description>([\s\S]*?)<\/description>/i);
    if (!descMatch) continue;

    const headerStr = `${titleMatch ? titleMatch[1] : ''} ${linkMatch ? linkMatch[1] : ''}`;
    const datePatterns = [
      `${dd}-${mm}-${yyyy}`,
      `${dd}/${mm}/${yyyy}`,
      `${dNoPad}-${mNoPad}-${yyyy}`,
      `${dNoPad}/${mNoPad}/${yyyy}`,
      `${dd}-${mm}`,
      `${dNoPad}/${mNoPad}`
    ];
    if (!datePatterns.some(pat => headerStr.includes(pat))) continue;

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
      if (prizes.DB.length > 0) {
        const dow = parseYMD(targetYmd).getUTCDay();
        return [{
          code: 'mien-bac',
          name: 'Miền Bắc',
          subtitle: MB_SUBTITLE_BY_DOW[dow] || 'Hà Nội',
          maDB: [],
          prizes
        }];
      }
    } else {
      const blocks = desc.split(/\[([^\]]+)\]/g);
      const stations = [];
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
        if (prizes.DB.length > 0 || prizes.G8.length > 0) {
          stations.push({ code: st.code, name: st.name, prizes });
        }
      }
      if (stations.length > 0) return stations;
    }
  }
  return [];
}

async function fetchRegionForDate(region, ymd) {
  const [yyyy, mm, dd] = ymd.split('-');
  const d = Number(dd);
  const m = Number(mm);
  const slug = region === 'MN' ? 'xsmn' : region === 'MT' ? 'xsmt' : 'xsmb';
  const rssSlug = region === 'MN' ? 'mien-nam-xsmn' : region === 'MT' ? 'mien-trung-xsmt' : 'mien-bac-xsmb';

  const urlsToTry = [
    `https://xskt.com.vn/${slug}/ngay-${d}-${m}-${yyyy}`,
    `https://xskt.com.vn/${slug}/ngay-${dd}-${mm}-${yyyy}`
  ];
  if (ymd === getTodayVN()) {
    urlsToTry.push(`https://xskt.com.vn/${slug}`);
  }

  for (const url of urlsToTry) {
    try {
      const html = await fetchHtml(url);
      const parsed = region === 'MB' ? parseMBTable(html, ymd) : parseMultiStationTable(html, region);
      if (parsed.length > 0) {
        console.log(`[OK] Đã lấy ${region} ngày ${ymd} từ ${url} (${parsed.length} đài)`);
        return parsed;
      }
    } catch (err) {
      console.warn(`[WARN] Không lấy được HTML ${url}: ${err.message}`);
    }
  }

  // Fallback qua RSS của xskt.com.vn
  const rssUrl = `https://xskt.com.vn/rss-feed/${rssSlug}.rss`;
  try {
    const xml = await fetchHtml(rssUrl);
    const parsed = parseRssFeed(xml, region, ymd);
    if (parsed.length > 0) {
      console.log(`[OK] Đã lấy ${region} ngày ${ymd} từ RSS ${rssUrl} (${parsed.length} đài)`);
      return parsed;
    }
  } catch (err) {
    console.warn(`[WARN] Không lấy được RSS ${rssUrl}: ${err.message}`);
  }

  return [];
}

async function fetchAndSaveDate(ymd) {
  console.log(`\n=== Đang tải kết quả xổ số ngày ${ymd} ===`);
  const [mn, mt, mb] = await Promise.all([
    fetchRegionForDate('MN', ymd),
    fetchRegionForDate('MT', ymd),
    fetchRegionForDate('MB', ymd)
  ]);

  if (mn.length === 0 && mt.length === 0 && mb.length === 0) {
    throw new Error(`Không lấy được kết quả miền nào từ xskt.com.vn cho ngày ${ymd}`);
  }

  const outPath = path.join(DATA_DIR, `${ymd}.json`);
  let existing = null;
  if (fs.existsSync(outPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch (_) {
      existing = null;
    }
  }

  const payload = {
    date: ymd,
    dayOfWeek: parseYMD(ymd).getUTCDay(),
    updatedAt: new Date().toISOString(),
    source: 'xskt.com.vn',
    regions: {
      MN: mn.length > 0 ? mn : (existing?.regions?.MN || []),
      MT: mt.length > 0 ? mt : (existing?.regions?.MT || []),
      MB: mb.length > 0 ? mb : (existing?.regions?.MB || [])
    }
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`[SAVED] ${outPath}`);
}

function pruneAndBuildIndex(todayYmd) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const files = fs.readdirSync(DATA_DIR).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));

  const keptDates = [];
  for (const file of files) {
    const fileDate = file.replace(/\.json$/, '');
    const age = diffDays(fileDate, todayYmd);
    // Giữ tối đa 32 ngày: từ today (age = 0) lùi lại 31 ngày (age = 31). Xóa nếu age >= 32.
    if (age >= RETENTION_DAYS) {
      const fullPath = path.join(DATA_DIR, file);
      fs.unlinkSync(fullPath);
      console.log(`[PRUNED] Đã xóa file quá ${RETENTION_DAYS} ngày: ${file} (${age} ngày trước)`);
    } else if (age >= 0) {
      keptDates.push(fileDate);
    }
  }

  keptDates.sort((a, b) => b.localeCompare(a));

  const indexData = {
    updatedAt: new Date().toISOString(),
    retentionDays: RETENTION_DAYS,
    count: keptDates.length,
    latestDate: keptDates[0] || todayYmd,
    oldestDate: keptDates[keptDates.length - 1] || todayYmd,
    dates: keptDates
  };

  const indexPath = path.join(DATA_DIR, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2) + '\n', 'utf8');
  console.log(`[INDEX] Đã cập nhật data/index.json (${keptDates.length} ngày lưu trữ).`);
}

async function main() {
  const todayVN = getTodayVN();
  const cliDate = (process.argv[2] || process.env.TARGET_DATE || '').trim();
  const backfillDays = Math.max(1, Math.min(RETENTION_DAYS, Number(process.env.BACKFILL_DAYS || 1) || 1));

  const targetStart = /^\d{4}-\d{2}-\d{2}$/.test(cliDate) ? cliDate : todayVN;
  const datesToFetch = [];
  for (let i = 0; i < backfillDays; i++) {
    datesToFetch.push(subtractDays(targetStart, i));
  }

  let successCount = 0;
  for (const dt of datesToFetch) {
    try {
      await fetchAndSaveDate(dt);
      successCount++;
    } catch (err) {
      console.error(`[ERROR] Lỗi khi tải ngày ${dt}: ${err.message}`);
    }
  }

  pruneAndBuildIndex(todayVN);

  if (successCount === 0) {
    process.exitCode = 1;
  }
}

main();
