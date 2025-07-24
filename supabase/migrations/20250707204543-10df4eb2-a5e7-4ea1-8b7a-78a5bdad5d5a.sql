-- Add theme and sharing fields to collections table
ALTER TABLE collections 
ADD COLUMN IF NOT EXISTS theme text DEFAULT 'personal',
ADD COLUMN IF NOT EXISTS share_token text UNIQUE,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS card_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS featured_card_id uuid REFERENCES cards(id);

-- Add display order to collection_cards for drag and drop
ALTER TABLE collection_cards 
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_collections_theme ON collections(theme);
CREATE INDEX IF NOT EXISTS idx_collections_share_token ON collections(share_token);
CREATE INDEX IF NOT EXISTS idx_collection_cards_display_order ON collection_cards(collection_id, display_order);

-- Create function to generate share tokens
CREATE OR REPLACE FUNCTION generate_share_token() RETURNS text AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'base64url');
END;
$$ LANGUAGE plpgsql;

-- Create function to update collection stats
CREATE OR REPLACE FUNCTION update_collection_stats() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE collections 
    SET card_count = card_count + 1 
    WHERE id = NEW.collection_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE collections 
    SET card_count = GREATEST(card_count - 1, 0) 
    WHERE id = OLD.collection_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update collection stats
DROP TRIGGER IF EXISTS collection_card_stats_trigger ON collection_cards;
CREATE TRIGGER collection_card_stats_trigger
  AFTER INSERT OR DELETE ON collection_cards
  FOR EACH ROW EXECUTE FUNCTION update_collection_stats();