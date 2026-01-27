-- Fix apartment name typos in apartment_prices table
-- Fixes: "Delux Studio" -> "Deluxe Studio"
-- Fixes: "Superios Studio" -> "Superior Studio"

UPDATE apartment_prices
SET name_en = REPLACE(name_en, 'Delux Studio', 'Deluxe Studio')
WHERE name_en LIKE '%Delux Studio%';

UPDATE apartment_prices
SET name_en = REPLACE(name_en, 'Superios Studio', 'Superior Studio')
WHERE name_en LIKE '%Superios Studio%';

UPDATE apartment_prices
SET name_en = REPLACE(name_en, 'Delux Suite', 'Deluxe Suite')
WHERE name_en LIKE '%Delux Suite%';

UPDATE apartment_prices
SET name_en = REPLACE(name_en, 'Superios Suite', 'Superior Suite')
WHERE name_en LIKE '%Superios Suite%';

-- Also fix apartment_type column if needed
UPDATE apartment_prices
SET apartment_type = REPLACE(apartment_type, 'delux', 'deluxe')
WHERE apartment_type LIKE '%delux%' AND apartment_type NOT LIKE '%deluxe%';

UPDATE apartment_prices
SET apartment_type = REPLACE(apartment_type, 'superios', 'superior')
WHERE apartment_type LIKE '%superios%';
