-- Seed data for Akamatsu Health & Lifestyle
-- 15 products across all categories

insert into products (
  name_ja, name_en, description_ja, description_en,
  ingredients, ingredients_en, ingredients_ja,
  how_to_use, category, price, sale_price, stock_quantity,
  image_urls, rating_avg, review_count, is_bestseller, is_new,
  nutrition_per_serving, serving_size, certifications
) values

-- 1. Turmeric & Ginger Complex (Health / Bestseller)
(
  'ウコン＆生姜エキス複合体',
  'Turmeric & Ginger Complex',
  '有機ウコンと有機生姜を高濃度で配合したサプリメントです。クルクミノイドとジンゲロールの相乗効果で、体の内側からしっかりサポートします。',
  'High-potency organic turmeric and ginger supplement. Synergistic blend of curcuminoids and gingerols to support your body from the inside out.',
  '*有機ウコン末, *有機生姜末, セルロース, ステアリン酸マグネシウム',
  '*Organic Turmeric Powder, *Organic Ginger Powder, Cellulose, Magnesium Stearate',
  '*有機ウコン末, *有機生姜末, セルロース, ステアリン酸マグネシウム',
  '1日2カプセルを目安に、水または白湯でお召し上がりください。',
  'health',
  3800, null, 45,
  array['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600'],
  4.8, 312,
  true, false,
  '{"calories": 10, "fat_g": 0, "saturated_fat_g": 0, "trans_fat_g": 0, "carbs_g": 2, "fiber_g": 0, "sugars_g": 0, "protein_g": 0, "sodium_mg": 5, "active_compounds": [{"name_en": "Curcuminoids", "name_ja": "クルクミノイド", "amount": "95", "unit": "mg", "is_key": true}, {"name_en": "Gingerols", "name_ja": "ジンゲロール", "amount": "5", "unit": "mg", "is_key": true}]}',
  '2カプセル (800mg)',
  array['organic', 'gluten_free', 'no_additives']
),

-- 2. Collagen Beauty Drink (Beauty / Bestseller / On Sale)
(
  'マリンコラーゲン 美容ドリンク',
  'Marine Collagen Beauty Drink',
  '深海魚由来の低分子コラーゲンペプチドを1本あたり5,000mg配合。ヒアルロン酸・ビタミンCとの黄金比率で、透明感のある肌へ導きます。',
  'Marine-sourced low-molecular collagen peptides, 5,000mg per bottle. Golden ratio blend with hyaluronic acid and vitamin C for luminous skin.',
  '*魚コラーゲンペプチド, ヒアルロン酸, ビタミンC, *はちみつ, クエン酸',
  '*Fish Collagen Peptides, Hyaluronic Acid, Vitamin C, *Honey, Citric Acid',
  '*魚コラーゲンペプチド, ヒアルロン酸, ビタミンC, *はちみつ, クエン酸',
  '1日1本を目安に、そのままお飲みください。冷やしてお召し上がりいただくと、より美味しくいただけます。',
  'beauty',
  4200, 3360, 28,
  array['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600'],
  4.7, 198,
  true, false,
  '{"calories": 25, "fat_g": 0, "saturated_fat_g": 0, "trans_fat_g": 0, "carbs_g": 3, "fiber_g": 0, "sugars_g": 2, "protein_g": 5, "sodium_mg": 30, "active_compounds": [{"name_en": "Collagen Peptides", "name_ja": "コラーゲンペプチド", "amount": "5000", "unit": "mg", "is_key": true}, {"name_en": "Hyaluronic Acid", "name_ja": "ヒアルロン酸", "amount": "50", "unit": "mg", "is_key": true}]}',
  '1本 (50ml)',
  array['gluten_free', 'no_additives']
),

-- 3. Organic Matcha Powder (Lifestyle / New)
(
  '有機抹茶パウダー 宇治産',
  'Organic Matcha Powder — Uji Origin',
  '京都宇治産の有機茶葉を使用した最高品質の抹茶パウダー。L-テアニン豊富で、穏やかな集中力と落ち着きをもたらします。',
  'Premium organic matcha from Uji, Kyoto. Rich in L-theanine for calm focus and sustained energy without the jitters.',
  '*有機抹茶',
  '*Organic Matcha',
  '*有機抹茶',
  '茶碗に1〜2g（ティースプーン約1杯）を計量し、70〜80°Cのお湯で点てます。牛乳やアーモンドミルクでラテにもどうぞ。',
  'lifestyle',
  2800, null, 60,
  array['https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600'],
  4.9, 445,
  false, true,
  '{"calories": 5, "fat_g": 0, "saturated_fat_g": 0, "trans_fat_g": 0, "carbs_g": 1, "fiber_g": 1, "sugars_g": 0, "protein_g": 0, "sodium_mg": 2, "potassium_mg": 27, "active_compounds": [{"name_en": "L-Theanine", "name_ja": "L-テアニン", "amount": "19", "unit": "mg", "is_key": true}, {"name_en": "EGCG (Catechins)", "name_ja": "カテキン (EGCG)", "amount": "137", "unit": "mg", "is_key": true}]}',
  '2g',
  array['organic', 'gluten_free', 'vegan', 'no_additives']
),

-- 4. Ashwagandha Root Extract (Wellness)
(
  'アシュワガンダ根エキス KSM-66®',
  'Ashwagandha Root Extract KSM-66®',
  '世界最高水準の有機アシュワガンダエキス「KSM-66®」を使用。ストレスホルモンを調整し、睡眠の質と回復力を高めます。',
  'Premium KSM-66® organic ashwagandha root extract. Clinically studied to reduce cortisol, improve sleep quality, and enhance recovery.',
  '*KSM-66® 有機アシュワガンダ根エキス, セルロース',
  '*KSM-66® Organic Ashwagandha Root Extract, Cellulose',
  '*KSM-66® 有機アシュワガンダ根エキス, セルロース',
  '就寝1時間前に1〜2カプセルを水でお召し上がりください。',
  'wellness',
  4500, null, 32,
  array['https://images.unsplash.com/photo-1550572017-edd951b55104?w=600'],
  4.6, 156,
  true, false,
  '{"calories": 5, "fat_g": 0, "saturated_fat_g": 0, "trans_fat_g": 0, "carbs_g": 1, "fiber_g": 0, "sugars_g": 0, "protein_g": 0, "sodium_mg": 3, "active_compounds": [{"name_en": "Withanolides", "name_ja": "ウィサノライド", "amount": "5", "unit": "%", "is_key": true}]}',
  '1カプセル (300mg)',
  array['organic', 'gluten_free', 'vegan', 'no_additives']
),

-- 5. Organic Granola Clusters (Lifestyle / On Sale)
(
  '有機グラノーラクラスター ハニー&アーモンド',
  'Organic Granola Clusters — Honey & Almond',
  '有機オーツ麦をベースに、アーモンド・カシューナッツ・有機はちみつでじっくり焼き上げた贅沢なグラノーラ。グルテンフリー認証済み。',
  'Organic oats, almonds, cashews, and raw honey slow-baked to golden perfection. Certified gluten-free and free from refined sugar.',
  '*有機オーツ麦, *有機はちみつ, アーモンド, カシューナッツ, *有機ひまわり油, シナモン, 塩',
  '*Organic Rolled Oats, *Organic Honey, Almonds, Cashews, *Organic Sunflower Oil, Cinnamon, Salt',
  '*有機オーツ麦, *有機はちみつ, アーモンド, カシューナッツ, *有機ひまわり油, シナモン, 塩',
  'そのままお召し上がりください。ヨーグルトや牛乳と合わせても美味しくいただけます。',
  'lifestyle',
  1800, 1440, 75,
  array['https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600'],
  4.5, 89,
  false, false,
  '{"calories": 210, "fat_g": 9, "saturated_fat_g": 1, "trans_fat_g": 0, "carbs_g": 28, "fiber_g": 3, "sugars_g": 8, "protein_g": 5, "sodium_mg": 95, "potassium_mg": 180}',
  '45g (約1/2カップ)',
  array['organic', 'gluten_free', 'no_additives']
),

-- 6. Vitamin D3 + K2 (Supplements)
(
  'ビタミンD3 + K2 ソフトカプセル',
  'Vitamin D3 + K2 Softgels',
  'ビタミンD3（5,000IU）とMK-7型ビタミンK2を最適な比率で配合。骨密度の維持と免疫機能のサポートに。',
  'Optimal ratio of Vitamin D3 (5,000 IU) and MK-7 Vitamin K2. Supports bone density, calcium absorption, and immune function.',
  'ビタミンD3 (コレカルシフェロール), ビタミンK2 (MK-7, メナキノン-7), オリーブオイル, ゼラチン',
  'Vitamin D3 (Cholecalciferol), Vitamin K2 (MK-7, Menaquinone-7), Olive Oil, Gelatin',
  'ビタミンD3 (コレカルシフェロール), ビタミンK2 (MK-7, メナキノン-7), オリーブオイル, ゼラチン',
  '1日1カプセルを食事と一緒にお召し上がりください。',
  'supplements',
  2900, null, 52,
  array['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600'],
  4.7, 203,
  true, false,
  '{"calories": 10, "fat_g": 1, "saturated_fat_g": 0, "trans_fat_g": 0, "carbs_g": 0, "fiber_g": 0, "sugars_g": 0, "protein_g": 0, "sodium_mg": 0, "active_compounds": [{"name_en": "Vitamin D3", "name_ja": "ビタミンD3", "amount": "5000", "unit": "IU", "is_key": true}, {"name_en": "Vitamin K2 (MK-7)", "name_ja": "ビタミンK2 (MK-7)", "amount": "100", "unit": "mcg", "is_key": true}]}',
  '1カプセル',
  array['gluten_free']
),

-- 7. Rose Hip Face Oil (Beauty / New)
(
  'オーガニック ローズヒップフェイスオイル',
  'Organic Rosehip Face Oil',
  'チリ産有機ローズヒップを低温圧搾した純粋なオイル。レチノール・ビタミンC・必須脂肪酸を豊富に含み、シミ・ハリ・乾燥に多角的にアプローチします。',
  'Cold-pressed pure organic rosehip oil from Chile. Naturally rich in retinol, vitamin C, and essential fatty acids for a multi-action brightening and firming effect.',
  '*有機ローズヒップ種子油',
  '*Organic Rosa Canina Fruit Oil',
  '*有機ローズヒップ種子油',
  '洗顔後、化粧水の後に数滴を顔全体になじませます。朝晩お使いいただけます。',
  'beauty',
  3200, null, 3,
  array['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600'],
  4.8, 134,
  false, true,
  null,
  null,
  array['organic', 'gluten_free', 'vegan', 'no_additives']
),

-- 8. Gut Health Probiotic (Health)
(
  '腸活プロバイオティクス 100億個保証',
  'Gut Health Probiotic — 10 Billion CFU',
  '厳選した10種類の乳酸菌を1カプセルあたり100億個以上配合。プレバイオティクス（イヌリン）との組み合わせで、腸内フローラをしっかり整えます。',
  '10 clinically-studied strains, 10+ billion CFU per capsule with prebiotic inulin for synbiotic effect. Supports gut flora, immunity, and overall wellbeing.',
  'ラクトバチルス・アシドフィルス, ビフィドバクテリウム・ロンガム, 他8種の乳酸菌, イヌリン (プレバイオティクス), セルロース',
  'Lactobacillus Acidophilus, Bifidobacterium Longum, 8 other strains, Inulin (Prebiotic), Cellulose',
  'ラクトバチルス・アシドフィルス, ビフィドバクテリウム・ロンガム, 他8種の乳酸菌, イヌリン (プレバイオティクス), セルロース',
  '1日2カプセルを食前または食後に水でお召し上がりください。',
  'health',
  4800, null, 18,
  array['https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600'],
  4.6, 267,
  true, false,
  '{"calories": 10, "fat_g": 0, "saturated_fat_g": 0, "trans_fat_g": 0, "carbs_g": 2, "fiber_g": 1, "sugars_g": 0, "protein_g": 0, "sodium_mg": 5, "active_compounds": [{"name_en": "Probiotic Cultures", "name_ja": "乳酸菌", "amount": "10", "unit": "Billion CFU", "is_key": true}]}',
  '2カプセル',
  array['gluten_free', 'no_additives']
),

-- 9. Lavender Sleep Mist (Wellness / On Sale)
(
  'ラベンダー&カモミール ピローミスト',
  'Lavender & Chamomile Pillow Mist',
  '有機ラベンダー精油と有機カモミール精油をブレンドしたナチュラルなピローミスト。就寝前に枕にスプレーして、穏やかな眠りへ誘います。',
  'Organic lavender and chamomile essential oil blend in a soothing pillow and room mist. Spray on pillow before bed for a peaceful, restful sleep.',
  '精製水, アルコール (オーガニック), *有機ラベンダー精油, *有機カモミール精油, ポリソルベート20',
  'Purified Water, Organic Alcohol, *Organic Lavender Essential Oil, *Organic Chamomile Essential Oil, Polysorbate 20',
  '精製水, アルコール (オーガニック), *有機ラベンダー精油, *有機カモミール精油, ポリソルベート20',
  '就寝15〜30分前に枕や寝具から20cmほど離して2〜3回スプレーしてください。',
  'wellness',
  1600, 1280, 40,
  array['https://images.unsplash.com/photo-1500081999-de1c9ef5a1a0?w=600'],
  4.4, 78,
  false, false,
  null,
  null,
  array['organic', 'no_additives']
),

-- 10. Black Seed Oil (Supplements / New)
(
  'ブラックシードオイル（ニゲラサティバ）',
  'Black Seed Oil (Nigella Sativa)',
  '古来より「万能の薬」と称されるニゲラサティバを低温圧搾。チモキノンを高濃度に含み、抗酸化・免疫サポートに幅広く活用されています。',
  'Cold-pressed Nigella Sativa, known as the "seed of blessing". High in thymoquinone for powerful antioxidant and immune support.',
  '*有機ニゲラサティバ（ブラックシード）油',
  '*Organic Nigella Sativa (Black Seed) Oil',
  '*有機ニゲラサティバ（ブラックシード）油',
  '1日小さじ1杯（5ml）を目安に、そのままかジュースや蜂蜜に混ぜてお召し上がりください。',
  'supplements',
  3500, null, 25,
  array['https://images.unsplash.com/photo-1604004555489-723a93d6ce74?w=600'],
  4.5, 92,
  false, true,
  '{"calories": 40, "fat_g": 4.5, "saturated_fat_g": 0.5, "trans_fat_g": 0, "carbs_g": 0, "fiber_g": 0, "sugars_g": 0, "protein_g": 0, "sodium_mg": 0, "active_compounds": [{"name_en": "Thymoquinone", "name_ja": "チモキノン", "amount": "1.2", "unit": "%", "is_key": true}]}',
  '5ml（小さじ1杯）',
  array['organic', 'gluten_free', 'vegan', 'no_additives']
),

-- 11. Bamboo Charcoal Face Mask (Beauty)
(
  '竹炭クレイパック 毛穴すっきりマスク',
  'Bamboo Charcoal Clay Face Mask',
  '国産竹炭とフランス産カオリンクレイを配合したデトックスマスク。毛穴の汚れと余分な皮脂を吸着し、つるんとなめらかな素肌へ。',
  'Japanese bamboo charcoal and French kaolin clay detox mask. Draws out impurities, minimizes pores, and leaves skin smooth and mattified.',
  'カオリン, ベントナイト, 竹炭, *有機アロエベラエキス, グリセリン, キサンタンガム',
  'Kaolin, Bentonite, Bamboo Charcoal, *Organic Aloe Vera Extract, Glycerin, Xanthan Gum',
  'カオリン, ベントナイト, 竹炭, *有機アロエベラエキス, グリセリン, キサンタンガム',
  '洗顔後、顔全体（目・口周りを除く）に薄く均一に塗り、10〜15分置いてから洗い流してください。週1〜2回のご使用をお勧めします。',
  'beauty',
  2400, null, 0,
  array['https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600'],
  4.3, 61,
  false, false,
  null,
  null,
  array['gluten_free', 'vegan', 'no_additives']
),

-- 12. Omega-3 Fish Oil (Supplements / Bestseller)
(
  'オメガ3 フィッシュオイル 高濃度EPA/DHA',
  'Omega-3 Fish Oil — High Potency EPA/DHA',
  '北欧産の小型回遊魚から抽出した高濃度オメガ3。EPA 500mg・DHA 250mgを1カプセルに凝縮。心血管・脳・目の健康をトータルサポートします。',
  'Sustainably sourced from small Nordic fish. High-potency EPA 500mg + DHA 250mg per capsule. Supports cardiovascular, cognitive, and ocular health.',
  '精製魚油 (EPA・DHA含有), カプセル (ゼラチン), ビタミンE (抗酸化剤)',
  'Purified Fish Oil (EPA/DHA), Capsule (Gelatin), Vitamin E (Antioxidant)',
  '精製魚油 (EPA・DHA含有), カプセル (ゼラチン), ビタミンE (抗酸化剤)',
  '1日2カプセルを食事と一緒にお召し上がりください。',
  'supplements',
  3200, null, 65,
  array['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600'],
  4.8, 389,
  true, false,
  '{"calories": 20, "fat_g": 2, "saturated_fat_g": 0.5, "trans_fat_g": 0, "carbs_g": 0, "fiber_g": 0, "sugars_g": 0, "protein_g": 0, "sodium_mg": 0, "active_compounds": [{"name_en": "EPA (Eicosapentaenoic Acid)", "name_ja": "EPA（エイコサペンタエン酸）", "amount": "500", "unit": "mg", "is_key": true}, {"name_en": "DHA (Docosahexaenoic Acid)", "name_ja": "DHA（ドコサヘキサエン酸）", "amount": "250", "unit": "mg", "is_key": true}]}',
  '2カプセル',
  array['gluten_free', 'no_additives']
),

-- 13. Organic Herbal Tea Collection (Wellness / New)
(
  '有機ハーブティー コレクション 12種セット',
  'Organic Herbal Tea Collection — 12 Varieties',
  '世界各地から厳選した有機ハーブを12種類詰め合わせた贈り物にもぴったりなコレクション。カフェインフリー・農薬不使用。',
  '12 premium organic herbal teas from around the world, beautifully packaged. Caffeine-free, pesticide-free — perfect for gifting.',
  '*有機カモミール, *有機ペパーミント, *有機ジンジャー, *有機ローズヒップ, *有機レモングラス, 他',
  '*Organic Chamomile, *Organic Peppermint, *Organic Ginger, *Organic Rosehip, *Organic Lemongrass, and others',
  '*有機カモミール, *有機ペパーミント, *有機ジンジャー, *有機ローズヒップ, *有機レモングラス, 他',
  'ティーバッグ1個を熱湯200mlに3〜5分浸してお楽しみください。',
  'wellness',
  3600, null, 30,
  array['https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600'],
  4.7, 145,
  false, true,
  '{"calories": 0, "fat_g": 0, "saturated_fat_g": 0, "trans_fat_g": 0, "carbs_g": 0, "fiber_g": 0, "sugars_g": 0, "protein_g": 0, "sodium_mg": 0}',
  '1ティーバッグ (2g)',
  array['organic', 'gluten_free', 'vegan', 'no_additives']
),

-- 14. Bamboo Diffuser Set (Lifestyle)
(
  '竹製アロマディフューザー エッセンシャルオイルセット',
  'Bamboo Aroma Diffuser & Essential Oil Set',
  '国産竹を使用した天然素材のリードディフューザーセット。有機ラベンダー・有機ユーカリ・有機ベルガモットの3種のエッセンシャルオイル付き。',
  'Natural reed diffuser made from Japanese bamboo with three organic essential oils: lavender, eucalyptus, and bergamot.',
  'リードスティック (竹製), *有機ラベンダー精油, *有機ユーカリ精油, *有機ベルガモット精油, 無水エタノール',
  'Reed Sticks (Bamboo), *Organic Lavender Oil, *Organic Eucalyptus Oil, *Organic Bergamot Oil, Anhydrous Ethanol',
  'リードスティック (竹製), *有機ラベンダー精油, *有機ユーカリ精油, *有機ベルガモット精油, 無水エタノール',
  'ボトルにスティックを差し込み、お好きな場所に置いてください。香りが弱くなったらスティックを上下逆にしてください。',
  'lifestyle',
  4200, null, 15,
  array['https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600'],
  4.6, 53,
  false, false,
  null,
  null,
  array['organic', 'no_additives']
),

-- 15. Fermented Black Garlic (Health / On Sale)
(
  '発酵黒にんにく エキス濃縮カプセル',
  'Fermented Black Garlic Extract Capsules',
  '60日間じっくり発酵熟成させた黒にんにくエキスを高濃度配合。S-アリルシステインとポリフェノールが豊富で、生ニンニクの10倍以上の抗酸化力を発揮します。',
  '60-day fermented black garlic, concentrated in a capsule. Rich in S-allylcysteine and polyphenols — 10x the antioxidant power of raw garlic. No garlic odor.',
  '*有機発酵黒にんにく末, セルロース, ステアリン酸カルシウム',
  '*Organic Fermented Black Garlic Powder, Cellulose, Calcium Stearate',
  '*有機発酵黒にんにく末, セルロース, ステアリン酸カルシウム',
  '1日3カプセルを目安に、食前または食後に水でお召し上がりください。',
  'health',
  3800, 2980, 22,
  array['https://images.unsplash.com/photo-1467453678174-768ec283a940?w=600'],
  4.5, 174,
  false, false,
  '{"calories": 10, "fat_g": 0, "saturated_fat_g": 0, "trans_fat_g": 0, "carbs_g": 1, "fiber_g": 0, "sugars_g": 0, "protein_g": 1, "sodium_mg": 2, "active_compounds": [{"name_en": "S-Allylcysteine (SAC)", "name_ja": "S-アリルシステイン (SAC)", "amount": "1.2", "unit": "mg", "is_key": true}]}',
  '3カプセル',
  array['organic', 'gluten_free', 'vegan', 'no_additives']
);

-- Seed reviews for top products
insert into reviews (product_id, user_name, rating, comment, verified)
select
  p.id,
  names.name,
  ratings.rating,
  comments.comment,
  true
from products p
cross join (values
  ('田中 みき'),
  ('佐藤 健太'),
  ('Yuki S.'),
  ('山田 花子'),
  ('Emma T.')
) as names(name)
cross join (values (5), (4), (5), (5), (4)) as ratings(rating)
cross join (values
  ('毎日飲んでいます。体調が良くなった気がします！'),
  ('品質が高く、効果を実感できました。リピートします。'),
  ('Great quality! Can really feel the difference.'),
  ('パッケージも可愛くて、贈り物にも喜ばれました。'),
  ('Excellent product, will definitely buy again.')
) as comments(comment)
where p.is_bestseller = true
limit 25;
