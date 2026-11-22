const fs = require('fs');
const files = JSON.parse(fs.readFileSync('scripts/imagekit-all-files.json', 'utf8'));
const backup = JSON.parse(fs.readFileSync('scripts/backups/products-backup-2026-11-21T17-03-24-308Z.json', 'utf8'));

const ENDPOINT = 'https://ik.imagekit.io/kketfxdcu';

// The 4 essential Infographic cards from /All 6 ml Attar Listing (Final)
const attarInfoCards = [
  '0) how to use.jpg',
  '1) Benefits.jpg',
  '2) Key features.jpg',
  '3) Body Roll onn Perfume (Attar).jpg'
].map(name => files.find(f => f.folder === '/All 6 ml Attar Listing (Final)' && f.name === name)?.url).filter(Boolean);

// The 2ml Combo preview cards from /2 ml Listing Combo (final)
const combo2mlPreviews = [
  'G_M_K_2ml_Combo.png',
  'S_F_J_2ml_front.png',
  'G_M_K_2ml_Combo_Pocket.png',
  'S_F_J_2ml_clean.png'
].map(name => files.find(f => f.folder === '/2 ml Listing Combo (final)' && f.name === name)?.url).filter(Boolean);

// Helper to find files by exact or partial name within folder(s)
function findInFolder(folderPrefix, matcher) {
  return files.filter(f => f.folder.startsWith(folderPrefix) && matcher(f));
}

function clean(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Map each product to its mainImage + full gallery
const mappings = backup.map(product => {
  const name = product.name || '';
  const volume = (product.volume || '').toLowerCase().trim();
  const category = (product.category || '').toLowerCase().trim();
  const normName = clean(name);

  let main = null;
  let gallery = [];

  // ==========================================
  // 1. COMBOS & SETS
  // ==========================================
  if (normName.includes('discovery') || (volume.includes('25ml') && normName.includes('set'))) {
    const list = files.filter(f => f.folder === '/5 ml combo' && f.name.match(/^[1-7]\.(jpeg|jpg|png)$/));
    list.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    gallery = list.map(f => f.url);
    main = gallery[0] || `${ENDPOINT}/5%20ml%20combo/1.jpeg`;
  }
  else if (normName.includes('8ml') || (normName.includes('combo') && volume.includes('40ml'))) {
    const numbered = files.filter(f => f.folder === '/8 ml combo listing (final)' && f.name.match(/^[1-5]\.png$/));
    numbered.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    const extra = files.filter(f => f.folder === '/8 ml combo listing (final)' && ['box.png', 'born iconic.png', 'cr globe.png', 'Zyphora.png', 'Platinum guility.png'].includes(f.name));
    gallery = [...numbered, ...extra].map(f => f.url);
    main = gallery[0] || `${ENDPOINT}/8%20ml%20combo%20listing%20(final)/1.png`;
  }
  else if (normName.includes('dangler')) {
    const numbered = files.filter(f => f.folder === '/Dangler Listing' && f.name.match(/^[1-8]\.png$/));
    numbered.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    const extra = files.filter(f => f.folder === '/Dangler Listing' && ['flora.png', 'black gold.png', 'silver ph.png'].includes(f.name));
    gallery = [...numbered, ...extra].map(f => f.url);
    main = gallery[0] || `${ENDPOINT}/Dangler%20Listing/1.png`;
  }
  else if (normName.includes('20mlcombo') || (normName.includes('combo') && volume.includes('80ml'))) {
    const male = files.filter(f => f.folder === '/20 ml combo Listing (final)/male generated').sort((a, b) => a.name.localeCompare(b.name));
    const female = files.filter(f => f.folder === '/20 ml combo Listing (final)/female generated').sort((a, b) => a.name.localeCompare(b.name));
    gallery = [...male, ...female].map(f => f.url);
    main = gallery[0];
  }

  // ==========================================
  // 2. 2ML ROLL-ON ATTARS
  // ==========================================
  else if (volume.includes('2ml') || normName.includes('rollon')) {
    // Determine scent
    let scent = '';
    if (normName.includes('gulab')) scent = 'gulab';
    else if (normName.includes('fantasia')) scent = 'fantasia';
    else if (normName.includes('sanaya')) scent = 'sanaya';
    else if (normName.includes('mogra')) scent = 'mogra';
    else if (normName.includes('kesar')) scent = 'kesar_chandan';
    else if (normName.includes('jannat')) scent = 'jannat_ul';

    if (scent) {
      const scentFiles = files.filter(f => f.folder === '/2 ml Listing Images' && clean(f.name).includes(clean(scent)));
      // Preferred main image: front bottle
      const frontFile = scentFiles.find(f => f.name.includes('front')) || scentFiles[0];
      main = frontFile ? frontFile.url : null;
      // Gallery: main front first, then box, usage, pocket, cap_separated, plus 4 info cards
      const sortOrder = ['front', 'box', 'usage', 'pocket', 'cap', 'separated'];
      scentFiles.sort((a, b) => {
        const idxA = sortOrder.findIndex(k => a.name.includes(k));
        const idxB = sortOrder.findIndex(k => b.name.includes(k));
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });
      gallery = [...new Set([
        main,
        ...scentFiles.map(f => f.url),
        ...attarInfoCards
      ])];
    }
  }

  // ==========================================
  // 3. 10ML PERFUMES
  // ==========================================
  else if (volume.includes('10ml') && (category.includes('perfume') || (!category.includes('diffuser') && !normName.includes('car')))) {
    let scent = '';
    ['flora', 'ocean', 'oud', 'knight', 'mist'].forEach(s => {
      if (normName.includes(s)) scent = s;
    });
    if (scent) {
      const mainFile = files.find(f => f.folder === '/10 ml' && f.name === `${scent}.png`);
      main = mainFile ? mainFile.url : null;
      const covers = files.filter(f => f.folder === '/10 ml' && f.name.startsWith('cover_'));
      const extra = files.filter(f => f.folder === '/10 ml' && clean(f.name).includes(scent) && f.name !== `${scent}.png`);
      gallery = [mainFile, ...extra, ...covers].filter(Boolean).map(f => f.url);
    }
  }

  // ==========================================
  // 4. CAR DIFFUSERS / HANGING PODS (10ML)
  // ==========================================
  else if (category.includes('diffuser') || normName.includes('car')) {
    const carFeatures = files.filter(f => f.folder === '/Car Perfume Listing (Final)' && (
      f.name.includes('features') || f.name.includes('benefits') || f.name.includes('how_to_use') || f.name.includes('front_preview')
    )).map(f => f.url);

    let scent = '';
    if (normName.includes('aqua')) scent = 'aqua';
    else if (normName.includes('sandal') || normName.includes('sendal')) scent = 'scandal';
    else if (normName.includes('lavender') || normName.includes('levender')) scent = 'levender';
    else if (normName.includes('lemon')) scent = 'lemon';
    else if (normName.includes('gulab') || normName.includes('rose')) scent = 'gulab';

    if (scent) {
      const scentBottles = files.filter(f => f.folder === '/Car Perfume Listing (Final)' && clean(f.name).includes(scent));
      // Prioritize plain bottle / single bottle shot over combo shots (exclude combo shots like Aqua_scandal, gulab_levender)
      const singleBottle = scentBottles.find(f => f.name.endsWith('.png') && !f.name.includes('_') && (f.name.includes('plain') || clean(f.name) === clean(scent) + 'png')) ||
                           scentBottles.find(f => f.name.endsWith('.png') && !f.name.includes('_')) ||
                           scentBottles.find(f => f.name.includes('plain')) ||
                           scentBottles[0];
      main = singleBottle ? singleBottle.url : null;
      // Put main bottle first, then other angles, then features
      const rest = scentBottles.filter(f => f.url !== main).map(f => f.url);
      gallery = [main, ...rest, ...carFeatures].filter(Boolean);
    } else {
      const p1 = files.find(f => f.folder === '/Car Perfume Listing (Final)' && f.name === 'car_perfume_product_1.jpg');
      const p2 = files.find(f => f.folder === '/Car Perfume Listing (Final)' && f.name === 'car_perfume_product_2.jpg');
      const combo = files.find(f => f.folder === '/Car Perfume Listing (Final)' && f.name === 'car_perfume_combo_product.jpg');
      main = p1 ? p1.url : null;
      gallery = [p1, p2, combo].filter(Boolean).map(f => f.url).concat(carFeatures);
    }
  }

  // ==========================================
  // 5. 50ML PERFUMES
  // ==========================================
  else if (volume.includes('50ml')) {
    // Specifically match 50ml files from /50 ml listing (final) or /50 ML New Packing/50 ml listing (final)
    let scent = '';
    if (normName.includes('flora')) scent = 'flora';
    else if (normName.includes('borniconic')) scent = 'born_iconic';
    else if (normName.includes('cobra')) scent = 'cobra';
    else if (normName.includes('silver') || normName.includes('pearl')) scent = 'silver_pearl';
    else if (normName.includes('advent')) scent = 'advent_45';
    else if (normName.includes('sea_aqua') || normName.includes('seaaqua')) scent = 'sea_aqua';

    // Flagship scents available in 100ml / multi-volume
    if (!scent) {
      ['peach', 'nectar', 'founder', 'brise', 'seamusk'].forEach(s => {
        if (normName.includes(s)) scent = s;
      });
    }

    if (['flora', 'born_iconic', 'cobra', 'silver_pearl', 'advent_45', 'sea_aqua'].includes(scent)) {
      const f50 = files.filter(f => f.folder === '/50 ml listing (final)' && clean(f.name).includes(clean(scent)));
      // Main image strictly prioritizes front standalone bottle (avoiding box, side, cap, top)
      const front = f50.find(f => !f.name.includes('box') && !f.name.includes('side') && !f.name.includes('cap') && !f.name.includes('top') && (f.name.includes('front') || f.name.includes('bottle'))) ||
                    f50.find(f => !f.name.includes('box') && !f.name.includes('side') && !f.name.includes('cap') && !f.name.includes('top')) ||
                    f50.find(f => !f.name.includes('box')) ||
                    f50[0];
      main = front ? front.url : null;
      // Sort gallery so front is first, then box, side, top, cap
      f50.sort((a, b) => {
        const order = ['front', 'bottle', 'box', 'side', 'top', 'cap'];
        const idxA = order.findIndex(k => a.name.includes(k));
        const idxB = order.findIndex(k => b.name.includes(k));
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });
      gallery = [main, ...f50.map(f => f.url).filter(u => u !== main)];
    } else if (scent) {
      // Flagship 50ml: Use the 100ml high-res angles (Tilt, Front, Left, Right)
      const flagFiles = files.filter(f => f.folder === '/100 ml' && clean(f.name).includes(scent));
      const tilt = flagFiles.find(f => f.name.includes('TILT')) || flagFiles[0];
      main = tilt ? tilt.url : null;
      gallery = [main, ...flagFiles.map(f => f.url).filter(u => u !== main)];
    }
  }

  // ==========================================
  // 6. 20ML SINGLE PERFUMES
  // ==========================================
  else if (volume.includes('20ml') && !normName.includes('combo')) {
    let scent = '';
    ['flora', 'belleza', 'daisy', 'million', 'bloomher', 'crglobe', 'borniconic', 'france2000'].forEach(s => {
      if (normName.includes(s)) scent = s;
    });

    if (scent) {
      const f20 = files.filter(f => f.folder === '/20 ml listing (final)' && clean(f.name).includes(clean(scent)));
      // Prioritize front standalone bottle without 'Copy', 'box', 'tilt', 'side'
      const front = f20.find(f => f.name.includes('front') && !f.name.includes('tilt')) || 
                    f20.find(f => f.name.endsWith('.png') && !f.name.includes('with box') && !f.name.includes('tilt') && !f.name.includes('side') && !f.name.includes('Copy')) || 
                    f20[0];
      main = front ? front.url : null;
      // Gallery: front, tilt, side, with box
      const sortOrder = ['front', 'tilt', 'side', 'with box'];
      f20.sort((a, b) => {
        const idxA = sortOrder.findIndex(k => a.name.includes(k));
        const idxB = sortOrder.findIndex(k => b.name.includes(k));
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });
      gallery = [main, ...f20.map(f => f.url).filter(u => u !== main)];
    } else {
      // Flagship 20ml
      let flagScent = '';
      ['peach', 'nectar', 'founder', 'brise', 'seamusk'].forEach(s => {
        if (normName.includes(s)) flagScent = s;
      });
      if (flagScent) {
        const flag20 = files.find(f => f.folder === '/20 ml listing (final)' && clean(f.name).includes(flagScent));
        const flagFiles = files.filter(f => f.folder === '/100 ml' && clean(f.name).includes(flagScent));
        flagFiles.sort((a, b) => {
          const order = ['TILT', 'FRONT', 'LEFT', 'RIGHT', '.jpg'];
          const idxA = order.findIndex(k => a.name.includes(k));
          const idxB = order.findIndex(k => b.name.includes(k));
          return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
        });
        const tilt = flagFiles.find(f => f.name.includes('TILT')) || flagFiles[0];
        main = flag20 ? flag20.url : (tilt ? tilt.url : null);
        gallery = [...new Set([main, ...(flag20 ? [flag20.url] : []), ...flagFiles.map(f => f.url)].filter(Boolean))];
      }
    }
  }

  // ==========================================
  // 7. 6ML PURE ATTARS & PERFUMES
  // ==========================================
  else if (volume.includes('6ml')) {
    const scentDefinitions = [
      { key: 'whiteoud', aliases: ['whiteoud', 'white_oud'] },
      { key: 'kesarchandan', aliases: ['kesarchandan', 'kesar_chandan', 'kesar chandan'] },
      { key: 'chandan', aliases: ['chandan'], exclude: ['kesar'] },
      { key: 'jannatulfirdaus', aliases: ['jannatul', 'jannat_ul', 'firdaus', 'firdous'] },
      { key: 'sanaya', aliases: ['sanaya'] },
      { key: 'sea_aqua', aliases: ['sea_aqua', 'seaaqua', 'sea aqua'] },
      { key: 'knight', aliases: ['knight'] },
      { key: 'exoticram', aliases: ['exotic_ram', 'exoticram', 'exotic ram'] },
      { key: 'royalblue', aliases: ['royal_blue', 'royalblue', 'royal blue'] },
      { key: 'flora', aliases: ['flora'] },
      { key: 'gulab', aliases: ['gulab'] },
      { key: 'mogra', aliases: ['mogra'] },
      { key: 'lavender', aliases: ['lavender', 'levender'] },
      { key: 'zafran', aliases: ['zafran'] },
      { key: 'radharani', aliases: ['radha_rani', 'radharani', 'radha rani'] },
      { key: 'shyamdarbar', aliases: ['shyam_darbar', 'shyamdarbar', 'shyam darbar'] },
      { key: 'lomani', aliases: ['lomani'] },
      { key: 'fantasia', aliases: ['fantasia'] },
      { key: 'kevra', aliases: ['kevra'] },
      { key: 'arabianoudh', aliases: ['arabian', 'arab_', 'arabianoudh', 'arabian_oudh'] },
      { key: 'advent45', aliases: ['advent_45', 'advent45', 'advent 45'] },
      { key: 'belleza', aliases: ['belleza'] },
      { key: 'blackoud', aliases: ['blackoud', 'black_oud', 'black oudh', 'black oud'] },
      { key: 'bloomher', aliases: ['bloomher', 'bloom_her', 'bloom her'] },
      { key: 'creamyvanilla', aliases: ['creamyvanilla', 'creamy vanilla', 'creamy_vanilla', 'vannila', 'vanilla'] },
      { key: 'france2000', aliases: ['france_2000', 'france2000', 'france 2000', 'france_6ml'] },
      { key: 'imagination', aliases: ['imagination'] },
      { key: 'lunarx2t', aliases: ['lunar_x2t', 'lunarx2t', 'lunar x2t', 'lunar_xt'] },
      { key: 'meninblack', aliases: ['men_in_black', 'meninblack', 'men in black'] },
      { key: 'millionaire', aliases: ['millionaire', 'millionare', 'million'] },
      { key: 'strawberry', aliases: ['strawberry'] }
    ];

    const matchedDef = scentDefinitions.find(s => {
      const nm = clean(name);
      if (s.exclude && s.exclude.some(ex => nm.includes(ex))) return false;
      return s.aliases.some(alias => nm.includes(clean(alias)));
    });

    if (matchedDef) {
      const s = matchedDef;
      const matchFile = (f) => {
        const fn = f.name.toLowerCase();
        const cfn = clean(fn);
        if (s.exclude && s.exclude.some(ex => cfn.includes(ex))) return false;
        return s.aliases.some(alias => fn.includes(alias) || cfn.includes(clean(alias)));
      };

      const plain = files.filter(f => f.folder === '/All 6 ml Attar Listing (Final)/All Attars Pure Plain' && matchFile(f));
      const box = files.filter(f => f.folder === '/All 6 ml Attar Listing (Final)/With Box' && matchFile(f));
      const graphics = files.filter(f => f.folder === '/All 6 ml Attar Listing (Final)/Front Graphics' && matchFile(f));

      // Choose best standalone bottle for mainImage
      const bestPlain = plain.find(f => f.name.includes('plain_png_name_6ml')) || plain[0];
      main = bestPlain ? bestPlain.url : (plain[0] || box[0] || graphics[0])?.url;

      // If no scent-specific box (e.g. Gulab, Sea Aqua), include generic roll-on box
      const genericBox = files.find(f => f.folder === '/All 6 ml Attar Listing (Final)/With Box' && f.name === '1) box.png');
      const boxList = box.length > 0 ? box : (genericBox ? [genericBox] : []);

      // Full gallery: Main bottle, other plain views, box shots, front graphics, 4 info cards
      const allFiles = [
        main,
        ...plain.map(f => f.url),
        ...boxList.map(f => f.url),
        ...graphics.map(f => f.url),
        ...attarInfoCards
      ];
      gallery = [...new Set(allFiles.filter(Boolean))];
    }
  }

  // ==========================================
  // 8. 100ML FLAGSHIP PERFUMES
  // ==========================================
  else if (volume.includes('100ml') || category.includes('perfumes') || category.includes('value for money')) {
    let scent = '';
    ['peach', 'nectar', 'founder', 'brise', 'seamusk'].forEach(s => {
      if (normName.includes(s)) scent = s;
    });
    if (scent) {
      const flagFiles = files.filter(f => f.folder === '/100 ml' && clean(f.name).includes(scent));
      const tilt = flagFiles.find(f => f.name.includes('TILT')) || flagFiles[0];
      main = tilt ? tilt.url : null;
      // Sort: Tilt first, then Front, Left, Right, then .jpg lifestyle
      flagFiles.sort((a, b) => {
        const order = ['TILT', 'FRONT', 'LEFT', 'RIGHT', '.jpg'];
        const idxA = order.findIndex(k => a.name.includes(k));
        const idxB = order.findIndex(k => b.name.includes(k));
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });
      gallery = [main, ...flagFiles.map(f => f.url).filter(u => u !== main)];
    }
  }

  // ==========================================
  // 9. ROOM FRESHENERS (200ML)
  // ==========================================
  else if (category.includes('room freshener') || normName.includes('roomfreshener') || normName.includes('triwind')) {
    let scent = '';
    if (normName.includes('aqua')) scent = 'aqua';
    else if (normName.includes('coco') || normName.includes('amber')) scent = 'coco';
    else if (normName.includes('rose')) scent = 'rose';
    else if (normName.includes('royal')) scent = 'royal';
    else if (normName.includes('sandal')) scent = 'sandal';

    if (scent) {
      const roomFiles = files.filter(f => f.folder === '/Air Fresheners Listing (final)' && clean(f.name).includes(scent));
      // Prioritize plain/isolated bottle for main (handles plain_ and plan_ typos), avoiding details/steps/longevity
      const plain = roomFiles.find(f => f.name.toLowerCase().startsWith('plain_') || f.name.toLowerCase().startsWith('plan_')) ||
                    roomFiles.find(f => !f.name.toLowerCase().includes('steps') && !f.name.toLowerCase().includes('details') && !f.name.toLowerCase().includes('longetivity') && !f.name.toLowerCase().includes('useful') && !f.name.toLowerCase().includes('comparision') && !f.name.toLowerCase().includes('af_')) ||
                    roomFiles[0];
      main = plain ? plain.url : null;
      // Sort gallery: plain first, then main hero product shot, steps, details, longevity, usefull
      roomFiles.sort((a, b) => {
        const getPriority = (name) => {
          const n = name.toLowerCase();
          if (n.startsWith('plain_') || n.startsWith('plan_')) return 1;
          if (!n.includes('steps') && !n.includes('details') && !n.includes('longetivity') && !n.includes('useful') && !n.includes('comparision') && !n.includes('af_')) return 2;
          if (n.includes('steps')) return 3;
          if (n.includes('details')) return 4;
          if (n.includes('longetivity')) return 5;
          if (n.includes('useful')) return 6;
          if (n.includes('comparision')) return 7;
          return 8;
        };
        return getPriority(a.name) - getPriority(b.name);
      });
      gallery = [main, ...roomFiles.map(f => f.url).filter(u => u !== main)];
    }
  }

  return {
    _id: product._id,
    name: product.name,
    volume: product.volume,
    category: product.category,
    mainImage: main,
    galleryCount: gallery.length,
    gallery: gallery
  };
});

fs.writeFileSync('scripts/rich-mapping-audit.json', JSON.stringify(mappings, null, 2));

console.log('=== AUDIT RESULTS ===');
console.log('Total Products:', mappings.length);
const fullyMapped = mappings.filter(m => m.mainImage && m.galleryCount > 0);
const multiImage = mappings.filter(m => m.galleryCount > 1);
const singleImage = mappings.filter(m => m.galleryCount === 1);
const unmapped = mappings.filter(m => !m.mainImage);

console.log('Mapped with Main Image:', fullyMapped.length);
console.log('Multi-Image Galleries (>1):', multiImage.length);
console.log('Single Image Only (=1):', singleImage.length);
console.log('Unmapped (=0):', unmapped.length);

if (unmapped.length > 0) {
  console.log('\nUnmapped:');
  unmapped.forEach(u => console.log(`- [${u.category}] "${u.name}" (${u.volume})`));
}

console.log('\n--- Sample Products Audit ---');
mappings.filter(m => 
  m.name.includes('Born Iconic') || 
  m.name.includes('Cobra') || 
  m.name.includes('Flora') ||
  m.name.includes('Creamy Vanilla') ||
  m.name.includes('Aqua Fresh') ||
  m.name.includes('20 ml Combo')
).forEach(m => {
  console.log(`\nProduct: "${m.name}" | Vol: "${m.volume}" | Cat: "${m.category}"`);
  console.log(`Main:    ${m.mainImage}`);
  console.log(`Gallery (${m.galleryCount}):`);
  m.gallery.forEach((g, i) => console.log(`  ${i+1}. ${g}`));
});
