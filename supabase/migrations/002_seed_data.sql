-- Seed some initial metaphors for testing
-- These are auto-approved (status = 'published')

INSERT INTO metaphors (slug, nazev, definice, priklad, status, approved_at) VALUES
(
  'mit-maslo-na-hlave',
  'Mít máslo na hlavě',
  'Mít máslo na hlavě znamená být sám provinilý a proto se nechovat příliš sebevědomě.',
  'Přestaň kritizovat druhé, když máš sám máslo na hlavě.',
  'published',
  NOW()
),
(
  'delat-z-komara-velblouda',
  'Dělat z komára velblouda',
  'Přehánět, vytvářet z malého problému velký problém.',
  'Nemá cenu dělat z komára velblouda, je to jen malá šrámec.',
  'published',
  NOW()
),
(
  'hodit-flintu-do-zita',
  'Hodit flintu do žita',
  'Vzdát se, rezignovat, přestat se snažit.',
  'Po třetím neúspěchu hodil flintu do žita a už to dál nezkoušel.',
  'published',
  NOW()
);

-- Add some votes to test vote counting
DO $$
DECLARE
  metaphor_id_1 UUID;
  metaphor_id_2 UUID;
BEGIN
  -- Get metaphor IDs
  SELECT id INTO metaphor_id_1 FROM metaphors WHERE slug = 'mit-maslo-na-hlave';
  SELECT id INTO metaphor_id_2 FROM metaphors WHERE slug = 'delat-z-komara-velblouda';

  -- Add some test votes
  INSERT INTO votes (metaphor_id, vote_type, ip_address, cookie_id) VALUES
  (metaphor_id_1, 'like', '192.168.1.1', 'test-cookie-1'),
  (metaphor_id_1, 'like', '192.168.1.2', 'test-cookie-2'),
  (metaphor_id_1, 'dislike', '192.168.1.3', 'test-cookie-3'),
  (metaphor_id_2, 'like', '192.168.1.1', 'test-cookie-1'),
  (metaphor_id_2, 'like', '192.168.1.2', 'test-cookie-2');
END $$;
