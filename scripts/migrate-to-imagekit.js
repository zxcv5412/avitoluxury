const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const ENDPOINT = 'https://ik.imagekit.io/kketfxdcu';
const isDryRun = !process.argv.includes('--execute');

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function generateCandidateUrls(product) {
  const name = product.name || '';
  const normName = normalize(name);
  const volume = (product.volume || '').toLowerCase().trim();
  const category = (product.category || '').toLowerCase().trim();
  const candidates = [];

  const add = (main, gallery) => {
    candidates.push({
      main,
      gallery: gallery && gallery.length > 0 ? gallery : [main]
    });
  };

  // 1. Discovery Set (5 ml combo)
  if (normName.includes('discovery') || (volume.includes('25ml') && normName.includes('set'))) {
    add(`${ENDPOINT}/5%20ml%20combo/1.jpeg`, [
      `${ENDPOINT}/5%20ml%20combo/1.jpeg`,
      `${ENDPOINT}/5%20ml%20combo/2.jpeg`,
      `${ENDPOINT}/5%20ml%20combo/3.jpeg`,
      `${ENDPOINT}/5%20ml%20combo/4.jpeg`,
      `${ENDPOINT}/5%20ml%20combo/6.jpeg`,
      `${ENDPOINT}/5%20ml%20combo/7.jpeg`
    ]);
  }

  // 2. 8ml Combo Pack
  if (normName.includes('8_ml') || (normName.includes('combo') && volume.includes('40ml'))) {
    add(`${ENDPOINT}/8%20ml%20combo%20listing%20(final)/1.png`, [
      `${ENDPOINT}/8%20ml%20combo%20listing%20(final)/1.png`,
      `${ENDPOINT}/8%20ml%20combo%20listing%20(final)/2.png`,
      `${ENDPOINT}/8%20ml%20combo%20listing%20(final)/4.png`,
      `${ENDPOINT}/8%20ml%20combo%20listing%20(final)/5.png`
    ]);
  }

  // 3. Dangler Combo Set
  if (normName.includes('dangler')) {
    add(`${ENDPOINT}/Dangler%20Listing/1.png`, [
      `${ENDPOINT}/Dangler%20Listing/1.png`,
      `${ENDPOINT}/Dangler%20Listing/2.png`,
      `${ENDPOINT}/Dangler%20Listing/3.png`,
      `${ENDPOINT}/Dangler%20Listing/4.png`,
      `${ENDPOINT}/Dangler%20Listing/5.png`,
      `${ENDPOINT}/Dangler%20Listing/6.png`,
      `${ENDPOINT}/Dangler%20Listing/8.png`
    ]);
  }

  // 4. 20ml Combo
  if (normName === '20_ml_combo' || (normName.includes('20') && normName.includes('combo'))) {
    add(`${ENDPOINT}/20%20ml%20combo%20Listing%20(final)/male%20generated/1.png`, [
      `${ENDPOINT}/20%20ml%20combo%20Listing%20(final)/male%20generated/1.png`,
      `${ENDPOINT}/20%20ml%20combo%20Listing%20(final)/male%20generated/2.png`,
      `${ENDPOINT}/20%20ml%20combo%20Listing%20(final)/male%20generated/3.png`,
      `${ENDPOINT}/20%20ml%20combo%20Listing%20(final)/female%20generated/1.png`,
      `${ENDPOINT}/20%20ml%20combo%20Listing%20(final)/female%20generated/2.png`,
      `${ENDPOINT}/20%20ml%20combo%20Listing%20(final)/female%20generated/3.png`
    ]);
  }

  // 5. 2ml Roll-On Attars (checked BEFORE 6ml attars)
  if (volume.includes('2ml') || normName.includes('roll_on') || normName.includes('rollon')) {
    let base = normName.replace('_roll_on_perfume', '').replace('_roll_on', '').replace('_gold', '');
    if (base.includes('gulab')) {
      add(`${ENDPOINT}/2%20ml%20Listing%20Images/gulab_front.png`, [
        `${ENDPOINT}/2%20ml%20Listing%20Images/gulab_front.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/gulab_front_box_final.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/gulab_usage.png`
      ]);
    } else if (base.includes('fantasia')) {
      add(`${ENDPOINT}/2%20ml%20Listing%20Images/fantasia_front.png`, [
        `${ENDPOINT}/2%20ml%20Listing%20Images/fantasia_front.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/fantasia_box_final.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/fantasia_usage.png`
      ]);
    } else if (base.includes('sanaya')) {
      add(`${ENDPOINT}/2%20ml%20Listing%20Images/sanaya_front_bottle.png`, [
        `${ENDPOINT}/2%20ml%20Listing%20Images/sanaya_front_bottle.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/sanaya_cap_separated.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/sanaya_usage.png`
      ]);
    } else if (base.includes('mogra')) {
      add(`${ENDPOINT}/2%20ml%20Listing%20Images/mogra_front_bottle.png`, [
        `${ENDPOINT}/2%20ml%20Listing%20Images/mogra_front_bottle.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/mogra_box_final.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/mogra_usage.png`
      ]);
    } else if (base.includes('kesar')) {
      add(`${ENDPOINT}/2%20ml%20Listing%20Images/kesar_chandan_front_bottle.png`, [
        `${ENDPOINT}/2%20ml%20Listing%20Images/kesar_chandan_front_bottle.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/kesar_chandan_box_final.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/kesar_chandan_usage.png`
      ]);
    } else if (base.includes('jannat')) {
      add(`${ENDPOINT}/2%20ml%20Listing%20Images/jannat_ul.png`, [
        `${ENDPOINT}/2%20ml%20Listing%20Images/jannat_ul.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/jannat_ul_box_final.png`,
        `${ENDPOINT}/2%20ml%20Listing%20Images/jannat_ul_usage.png`
      ]);
    }
  }

  // 6. 10ml Perfumes
  if (volume.includes('10ml') && (category.includes('perfume') || (!category.includes('diffuser') && !normName.includes('car')))) {
    const ml10 = ['flora', 'ocean', 'oud', 'knight', 'mist'];
    for (const s of ml10) {
      if (normName.includes(s)) {
        add(`${ENDPOINT}/10%20ml/${s}.png`, [`${ENDPOINT}/10%20ml/${s}.png`]);
        break;
      }
    }
  }

  // 7. Car Diffusers / Hanging Pods (10ml)
  if (category.includes('diffuser') || normName.includes('car_air_freshner') || normName.includes('car_perfume')) {
    const carFeatures = [
      `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/car_fume_features_1.jpg`,
      `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/car_fume_features_2.jpg`,
      `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/car_fume_benefits.jpg`,
      `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/car_fume_how_to_use.jpg`
    ];

    if (normName.includes('aqua')) {
      add(`${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/aqua.png`, [
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/aqua.png`,
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/Aqua_scandal.jpg`,
        ...carFeatures
      ]);
    } else if (normName.includes('sandal') || normName.includes('sendal')) {
      add(`${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/scandal.png`, [
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/scandal.png`,
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/scandal%20plain.png`,
        ...carFeatures
      ]);
    } else if (normName.includes('lavender') || normName.includes('levender')) {
      add(`${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/levender.png`, [
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/levender.png`,
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/gulab_levender.jpg`,
        ...carFeatures
      ]);
    } else if (normName.includes('lemon')) {
      add(`${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/lemon.png`, [
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/lemon.png`,
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/lemon%20plain.png`,
        ...carFeatures
      ]);
    } else if (normName.includes('gulab') || normName.includes('rose')) {
      add(`${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/gulab.png`, [
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/gulab.png`,
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/gulab_levender.jpg`,
        ...carFeatures
      ]);
    } else {
      add(`${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/car_perfume_product_1.jpg`, [
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/car_perfume_product_1.jpg`,
        `${ENDPOINT}/Car%20Perfume%20Listing%20(Final)/car_perfume_product_2.jpg`,
        ...carFeatures
      ]);
    }
  }

  // 8. 20ml Single Perfumes
  if (volume.includes('20ml') && !normName.includes('combo')) {
    const scents20 = [
      { key: 'flora', file: 'flora.png', gallery: ['flora.png', 'flora tilt.png'] },
      { key: 'belleza', file: 'belleza front.png', gallery: ['belleza front.png', 'belleza tilt.png', 'belleza.png'] },
      { key: 'daisy', file: 'daisy front.png', gallery: ['daisy front.png', 'daisy tilt.png'] },
      { key: 'millionaire', file: 'millionaire.png', gallery: ['millionaire.png'] },
      { key: 'bloom_her', file: 'bloom her front.png', gallery: ['bloom her front.png'] },
      { key: 'cr_globe', file: 'cr globe front.png', gallery: ['cr globe front.png', 'cr globe.png'] },
      { key: 'born_iconic', file: 'born iconic front.png', gallery: ['born iconic front.png', 'born iconic tilt.png', 'born iconic.png'] },
      { key: 'france_2000', file: 'france 2000.png', gallery: ['france 2000.png', 'france 2000 side.png'] }
    ];

    for (const sc of scents20) {
      if (normName.includes(sc.key)) {
        add(
          `${ENDPOINT}/20%20ml%20listing%20(final)/${encodeURIComponent(sc.file)}`,
          sc.gallery.map(g => `${ENDPOINT}/20%20ml%20listing%20(final)/${encodeURIComponent(g)}`)
        );
        break;
      }
    }

    if (normName.includes('peach')) {
      add(`${ENDPOINT}/100%20ml/PEACH_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/PEACH_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/PEACH_100_ML_FRONT.png`
      ]);
    } else if (normName.includes('nectar')) {
      add(`${ENDPOINT}/100%20ml/NECTAR_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/NECTAR_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/NECTAR_100_ML_FRONT.png`
      ]);
    } else if (normName.includes('founder')) {
      add(`${ENDPOINT}/100%20ml/FOUNDER_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/FOUNDER_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/FOUNDER_100_ML_FRONT.png`
      ]);
    } else if (normName.includes('brise')) {
      add(`${ENDPOINT}/100%20ml/BRISE%20D_AVRIL_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/BRISE%20D_AVRIL_100_ML_TILT.png`
      ]);
    } else if (normName.includes('sea_musk')) {
      add(`${ENDPOINT}/100%20ml/SEA%20MUSK_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/SEA%20MUSK_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/SEA%20MUSK_100_ML_FRONT.png`
      ]);
    }
  }

  // 9. 50ml Perfumes
  if (volume.includes('50ml')) {
    if (normName.includes('flora')) {
      add(`${ENDPOINT}/50%20ml%20listing%20(final)/flora_box_uppr_50ml_.png`, [
        `${ENDPOINT}/50%20ml%20listing%20(final)/flora_box_uppr_50ml_.png`
      ]);
    } else if (normName.includes('silver') || normName.includes('pearl')) {
      add(`${ENDPOINT}/50%20ml%20listing%20(final)/50ml_silver_pearl.png`, [
        `${ENDPOINT}/50%20ml%20listing%20(final)/50ml_silver_pearl.png`,
        `${ENDPOINT}/50%20ML%20New%20Packing/50%20ml%20listing%20(final)/50ml_silver_pearl_top%2Bview.png`
      ]);
    } else if (normName.includes('advent')) {
      add(`${ENDPOINT}/50%20ml%20listing%20(final)/50ml_advent_45.png`, [
        `${ENDPOINT}/50%20ml%20listing%20(final)/50ml_advent_45.png`,
        `${ENDPOINT}/50%20ML%20New%20Packing/50%20ml%20listing%20(final)/50ml_advent_45_side.png`
      ]);
    } else if (normName.includes('sea_aqua')) {
      add(`${ENDPOINT}/50%20ml%20listing%20(final)/50ml_sea_aqua_front.png`, [
        `${ENDPOINT}/50%20ml%20listing%20(final)/50ml_sea_aqua_front.png`
      ]);
    } else if (normName.includes('born_iconic')) {
      add(`${ENDPOINT}/20%20ml%20listing%20(final)/born%20iconic%20front.png`, [
        `${ENDPOINT}/20%20ml%20listing%20(final)/born%20iconic%20front.png`,
        `${ENDPOINT}/20%20ml%20listing%20(final)/born%20iconic%20tilt.png`
      ]);
    } else if (normName.includes('cobra')) {
      add(`${ENDPOINT}/20%20ml%20listing%20(final)/millionaire.png`, [
        `${ENDPOINT}/20%20ml%20listing%20(final)/millionaire.png`
      ]);
    }

    if (normName.includes('peach')) {
      add(`${ENDPOINT}/100%20ml/PEACH_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/PEACH_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/PEACH_100_ML_FRONT.png`
      ]);
    } else if (normName.includes('nectar')) {
      add(`${ENDPOINT}/100%20ml/NECTAR_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/NECTAR_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/NECTAR_100_ML_FRONT.png`
      ]);
    } else if (normName.includes('founder')) {
      add(`${ENDPOINT}/100%20ml/FOUNDER_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/FOUNDER_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/FOUNDER_100_ML_FRONT.png`
      ]);
    } else if (normName.includes('brise')) {
      add(`${ENDPOINT}/100%20ml/BRISE%20D_AVRIL_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/BRISE%20D_AVRIL_100_ML_TILT.png`
      ]);
    } else if (normName.includes('sea_musk')) {
      add(`${ENDPOINT}/100%20ml/SEA%20MUSK_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/SEA%20MUSK_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/SEA%20MUSK_100_ML_FRONT.png`
      ]);
    }
  }

  // 10. 100ml Perfumes
  if (volume.includes('100ml') || category.includes('luxury perfumes') || category.includes('premium perfumes') || category.includes('value for money')) {
    if (normName.includes('peach')) {
      add(`${ENDPOINT}/100%20ml/PEACH_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/PEACH_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/PEACH_100_ML_FRONT.png`
      ]);
    } else if (normName.includes('nectar')) {
      add(`${ENDPOINT}/100%20ml/NECTAR_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/NECTAR_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/NECTAR_100_ML_FRONT.png`
      ]);
    } else if (normName.includes('founder')) {
      add(`${ENDPOINT}/100%20ml/FOUNDER_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/FOUNDER_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/FOUNDER_100_ML_FRONT.png`
      ]);
    } else if (normName.includes('brise')) {
      add(`${ENDPOINT}/100%20ml/BRISE%20D_AVRIL_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/BRISE%20D_AVRIL_100_ML_TILT.png`
      ]);
    } else if (normName.includes('sea_musk')) {
      add(`${ENDPOINT}/100%20ml/SEA%20MUSK_100_ML_TILT.png`, [
        `${ENDPOINT}/100%20ml/SEA%20MUSK_100_ML_TILT.png`,
        `${ENDPOINT}/100%20ml/SEA%20MUSK_100_ML_FRONT.png`
      ]);
    }
  }

  // 11. 6ml Attars
  if (volume.includes('6ml') || category.includes('attar')) {
    if (normName.includes('creamy_vanilla') || normName.includes('vanilla')) {
      add(
        `${ENDPOINT}/All%206%20ml%20Attar%20Listing%20(Final)/All%20Attars%20Pure%20Plain/Creamy%20Vanilla.png`,
        [
          `${ENDPOINT}/All%206%20ml%20Attar%20Listing%20(Final)/All%20Attars%20Pure%20Plain/Creamy%20Vanilla.png`,
          `${ENDPOINT}/All%206%20ml%20Attar%20Listing%20(Final)/With%20Box/creamy%20vanilla_roll_on_box_.png`,
          `${ENDPOINT}/All%206%20ml%20Attar%20Listing%20(Final)/Front%20Graphics/creamy_vannila_frontroll_on.jpg`
        ]
      );
    }

    const attarMap = {
      'white_oud': 'white_oud',
      'kesar_chandan': 'kesar_chandan',
      'kesar': 'kesar_chandan',
      'jannat_ul_firdaus': 'jannatul_firdaus',
      'jannat_ul': 'jannatul_firdaus',
      'jannat': 'jannatul_firdaus',
      'sanaya': 'sanaya',
      'sea_aqua': 'sea_aqua',
      'knight': 'knight',
      'exotic_ram': 'exotic_ram',
      'royal_blue': 'royal_blue',
      'flora': 'flora',
      'gulab': 'gulab',
      'mogra': 'mogra',
      'chandan': 'chandan',
      'lavender': 'lavender',
      'zafran': 'zafran',
      'radha_rani': 'radha_rani',
      'shyam_darbar': 'shyam_darbar',
      'lomani': 'lomani',
      'fantasia': 'fantasia',
      'kevra': 'kevra',
      'arabian_oudh': 'arabian_oudh',
      'arabian_oud': 'arabian_oudh',
      'advent_45': 'advent_45',
      'advent': 'advent_45',
      'belleza': 'belleza',
      'black_oud': 'black_oud',
      'bloom_her': 'bloom_her',
      'creamy_vanilla': 'creamy_vanilla',
      'france_2000': 'france_2000',
      'imagination': 'imagination',
      'lunar_x2t': 'lunar_x2t',
      'men_in_black': 'men_in_black',
      'millionaire': 'millionaire',
      'strawberry': 'strawberry'
    };

    let matchedSlug = null;
    for (const [k, v] of Object.entries(attarMap)) {
      if (normName.includes(k)) {
        matchedSlug = v;
        break;
      }
    }

    if (matchedSlug) {
      add(
        `${ENDPOINT}/All%206%20ml%20Attar%20Listing%20(Final)/All%20Attars%20Pure%20Plain/${matchedSlug}_plain_png_name_6ml.png`,
        [`${ENDPOINT}/All%206%20ml%20Attar%20Listing%20(Final)/All%20Attars%20Pure%20Plain/${matchedSlug}_plain_png_name_6ml.png`]
      );
    }
  }

  // 12. Room Fresheners (200ml)
  if (category.includes('room freshener') || normName.includes('room_freshener') || normName.includes('air_freshener')) {
    if (normName.includes('coco') || normName.includes('amber')) {
      add(`${ENDPOINT}/Air%20Fresheners%20Listing%20(final)/Plain_CoCo%20Vibes%20Amber%20Air%20Freshener%20Spray.png`, [
        `${ENDPOINT}/Air%20Fresheners%20Listing%20(final)/Plain_CoCo%20Vibes%20Amber%20Air%20Freshener%20Spray.png`
      ]);
    } else {
      add(`${ENDPOINT}/Air%20Fresheners%20Listing%20(final)/Plain_front_Aqua_fresh.png`, [
        `${ENDPOINT}/Air%20Fresheners%20Listing%20(final)/Plain_front_Aqua_fresh.png`
      ]);
    }
  }

  return candidates;
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function run() {
  console.log(`=======================================================`);
  console.log(`IMAGEKIT MIGRATION SCRIPT (${isDryRun ? 'DRY-RUN MODE' : '*** LIVE EXECUTION MODE ***'})`);
  console.log(`Target Endpoint: ${ENDPOINT}`);
  console.log(`=======================================================\n`);

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();

  let matched = 0;
  let skipped = 0;
  const skippedList = [];

  console.log('Analyzing matches against live ImageKit assets...\n');

  for (const product of products) {
    const candidates = generateCandidateUrls(product);
    let validMatch = null;

    for (const c of candidates) {
      const isMainValid = await checkUrl(c.main);
      if (isMainValid) {
        const validGallery = [];
        for (const g of c.gallery) {
          if (await checkUrl(g)) {
            validGallery.push(g);
          }
        }
        validMatch = {
          main: c.main,
          gallery: validGallery.length > 0 ? validGallery : [c.main]
        };
        break;
      }
    }

    if (validMatch) {
      matched++;
      console.log(`[MATCH] ${product.name} (${product.volume || 'N/A'}) - Cat: ${product.category || 'N/A'}`);
      console.log(`  -> Main:    ${validMatch.main}`);
      console.log(`  -> Gallery: ${validMatch.gallery.length} image(s)`);

      if (!isDryRun) {
        await db.collection('products').updateOne(
          { _id: product._id },
          {
            $set: {
              mainImage: validMatch.main,
              images: validMatch.gallery.map(u => ({ url: u })),
              updatedAt: new Date()
            }
          }
        );
        console.log(`  -> UPDATED IN MONGODB`);
      }
      console.log('');
    } else {
      skipped++;
      skippedList.push({ name: product.name, volume: product.volume, category: product.category, id: product._id });
      console.log(`[SKIPPED] ${product.name} (${product.volume || 'N/A'}) - Cat: ${product.category || 'N/A'}\n`);
    }
  }

  console.log(`=======================================================`);
  console.log(`MIGRATION SUMMARY:`);
  console.log(`Total Products:     ${products.length}`);
  console.log(`Matched & Verified: ${matched}`);
  console.log(`Skipped / Pending:  ${skipped}`);
  console.log(`Mode:               ${isDryRun ? 'DRY-RUN (0 changes made)' : 'LIVE (Database updated)'}`);
  console.log(`=======================================================`);

  if (skippedList.length > 0) {
    console.log('\n--- Unmatched Products List ---');
    skippedList.forEach((s, idx) => {
      console.log(`${idx + 1}. [${s.category || 'N/A'}] "${s.name}" (${s.volume || 'N/A'})`);
    });
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
