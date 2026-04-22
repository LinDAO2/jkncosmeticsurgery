-- =====================================================
-- JKN Content Tables — run in Supabase SQL Editor
-- =====================================================

-- 1. Site-wide key/value text blocks
CREATE TABLE IF NOT EXISTS site_content (
  section text NOT NULL,
  key     text NOT NULL,
  value   text NOT NULL DEFAULT '',
  PRIMARY KEY (section, key)
);

-- 2. Services list
CREATE TABLE IF NOT EXISTS services (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  price         text NOT NULL DEFAULT '',
  description   text NOT NULL DEFAULT '',
  display_order int  NOT NULL DEFAULT 0
);

-- 3. About page structured items
CREATE TABLE IF NOT EXISTS about_items (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type          text NOT NULL CHECK (type IN ('bio','credential','cert','recognition','tag')),
  content       text NOT NULL DEFAULT '',
  url           text,
  display_order int  NOT NULL DEFAULT 0
);

-- =====================================================
-- Seed site_content
-- =====================================================
INSERT INTO site_content (section, key, value) VALUES
('philosophy','heading','True excellence lies not in transformation, but in restoration.'),
('philosophy','body','Dr. John K. Nia approaches every procedure with a singular conviction: that the most refined aesthetic result is one that restores rather than reinvents. His practice is built on structural refinement, balance, and longevity — delivering results that are intentionally understated, enhancing each patient''s natural identity without the tell-tale signs of intervention.'),
('quote','text','The goal is never to look different — it is to look entirely, unmistakably yourself.'),
('quote','attribution','— Dr. John K. Nia, MD'),
('contact','body1','Every patient relationship begins with a private, unhurried consultation. Dr. Nia takes the time to understand your goals, assess your anatomy, and present the most appropriate path forward — without pressure, without templates.'),
('contact','body2','All enquiries are handled with complete discretion.'),
('contact','availability','Accepting new consultations'),
('contact','instagram_handle','@jknmd'),
('contact','instagram_url','https://www.instagram.com/jknmd'),
('contact','email','info@jkncosmeticsurgery.com'),
('about','name','Dr. John K. Nia'),
('about','title','Fellowship-Trained Cosmetic and Reconstructive Surgeon')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Seed services
-- =====================================================
INSERT INTO services (name, price, description, display_order) VALUES
('Face and Neck Lift','$25,000 – $50,000','A face and neck lift addresses the deep sinking and deflated tissues of the face that have aged with gravity over time. Dr. Nia employs a preservation-style, extended deep plane face and neck lift to address jowling, a heavy midface, and heavy necks — his firm belief that this is the best approach to an aging face.',0),
('Invisible Access Mid Facelift','$15,000 – $25,000','Best suited for younger patients with a slightly heavy midface. An incision made a few centimetres behind the hairline allows Dr. Nia to release and suspend the deep soft tissues of the midface upward. This is not a thread lift — true soft-tissue release is performed to achieve lasting results.',10),
('Eyelid and Brow Rejuvenation','Brow lift $10,000–$20,000 · Upper bleph $7,000–$15,000 · Lower bleph $8,000–$20,000 · Ptosis repair $5,000–$10,000','Treats drooping eyelids, under-eye bags, and sagging brows. Dr. Nia focuses on volume preservation in his approach, producing brighter, more open eyes and a well-rested appearance. Procedures include brow lift, upper and lower blepharoplasty, and ptosis repair.',20),
('Lip Lifting','$7,000 – $15,000','Over time the lip elongates with age, often covering the front teeth when the mouth is at rest. Dr. Nia employs a subnasal lip lift to restore youthful lip proportion and its natural relationship to the teeth.',30),
('Facial Contouring','$6,000 – $12,000','Whether through fat transfer or buccal fat contouring, adding or subtracting volume from precise areas of the face restores balance and harmony. Dr. Nia tailors each approach to the individual anatomy and aesthetic goal.',40),
('Scar Revision','$1,000 – $5,000','Using both surgical and non-surgical modalities — including stem cell therapies and laser treatments — Dr. Nia improves the appearance of scars with precision and discretion.',50),
('Skin Cancer Reconstruction','Consultation required','Having performed over 7,000 skin cancer reconstructions — particularly following Mohs surgery — Dr. Nia is a world expert in facial soft-tissue reconstruction. This is where he forged his surgical mastery and deep understanding of the face.',60),
('Hair Restoration','$8,000 – $20,000','Dr. Nia offers follicular unit extraction (FUE) for hair restoration in both men and women — a minimally invasive technique that transplants individual follicles for natural, permanent results without a linear donor scar.',70)
ON CONFLICT DO NOTHING;

-- =====================================================
-- Seed about_items
-- =====================================================
INSERT INTO about_items (type, content, url, display_order) VALUES
('bio','Dr. John Nia is a fellowship-trained cosmetic and reconstructive surgeon renowned for his refined, natural approach to facial aesthetics. With advanced training spanning facial plastic surgery, oculoplastic surgery, dermatologic surgery, cutaneous oncology, and skin cancer reconstruction, he brings a rare level of precision and artistry to every procedure.',NULL,0),
('bio','A native New Yorker, Dr. Nia graduated with honors from an accelerated 7-year program at the City University of New York, earning both his undergraduate and medical degrees. He completed his internship at Lenox Hill Hospital and went on to train in dermatology at Mount Sinai, where he was selected as Chief Resident — an early distinction reflecting both his technical excellence and leadership.',NULL,10),
('bio','Dr. Nia further honed his expertise through an elite fellowship at Clinic 5C under the mentorship of Dr. Cameron Chesnut, where he mastered a sophisticated integration of facial plastic, oculoplastic, and dermatologic surgery. This multidisciplinary foundation allows him to approach the face with a comprehensive and highly nuanced perspective.',NULL,20),
('bio','A faculty of the American Academy of Dermatology, Dr. Nia recognised the limitations of trend-driven cosmetic treatments during his residency — overfilled features and repetitive, non-surgical interventions — and opted for a more elevated and surgically integrated path. His philosophy moves beyond temporary fixes, focusing instead on structural refinement, balance, and longevity.',NULL,30),
('bio','Committed to continual refinement, Dr. Nia has studied alongside leading plastic and oculoplastic surgeons worldwide. His work reflects a discerning eye, meticulous technique, and a deep respect for facial harmony.',NULL,40),
('credential','Fellowship, Mohs Surgery, Dermatologic Oncology and Facial Cosmetic Surgery — Clinic 5C (2020–2021)',NULL,0),
('credential','Chief Resident, Dermatology — Icahn School of Medicine at Mount Sinai (2019–2020)',NULL,10),
('credential','Dermatology Residency — Icahn School of Medicine at Mount Sinai (2017–2019)',NULL,20),
('credential','Dermatopharmacology Research Fellowship — Mount Sinai (2015–2017)',NULL,30),
('credential','Internship, Medicine — Lenox Hill Hospital, New York (2014–2015)',NULL,40),
('credential','MD — New York Medical College (2014)',NULL,50),
('cert','American Board of Dermatology (2020)',NULL,0),
('cert','Mohs Micrographic Surgery and Dermatologic Oncology (2021)',NULL,10),
('cert','Faculty, American Academy of Dermatology (Active)',NULL,20),
('cert','Author, 20+ peer-reviewed publications and textbook chapters (Ongoing)',NULL,30),
('recognition','Featured in New York Magazine — Best Doctors','https://nymag.com/bestdoctors/',0),
('recognition','Castle Connolly Top Doctor, New York','https://www.castleconnolly.com/doctors/',10),
('recognition','Author of 20+ peer-reviewed publications and textbook chapters','https://pubmed.ncbi.nlm.nih.gov/?term=John+K+Nia',20),
('recognition','Faculty, American Academy of Dermatology','https://www.aad.org/',30),
('recognition','Certified in two surgical specialties','https://www.certificationmatters.org/',40),
('tag','Face and Neck Lift',NULL,0),
('tag','Eyelid Surgery',NULL,10),
('tag','Mohs Surgery',NULL,20),
('tag','Scar Revision',NULL,30),
('tag','Skin Reconstruction',NULL,40),
('tag','Hair Restoration',NULL,50),
('tag','Facial Contouring',NULL,60),
('tag','Lip Lifting',NULL,70)
ON CONFLICT DO NOTHING;
