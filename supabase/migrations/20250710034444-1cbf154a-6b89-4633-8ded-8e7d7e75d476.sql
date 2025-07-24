-- Insert sample CRD frames for all categories
INSERT INTO crd_frames (
  id, name, category, description, preview_image_url, frame_config, 
  is_public, price_cents, rating_average, rating_count, download_count, tags
) VALUES 
-- Sports Category
('sports-baseball-classic', 'Baseball Classic', 'sports', 'Traditional baseball card with player stats and team colors', null, 
'{"dimensions": {"width": 360, "height": 504}, "regions": [{"id": "player-photo", "type": "photo", "x": 20, "y": 20, "width": 320, "height": 240, "required": true, "aspectRatio": "4:3"}, {"id": "team-logo", "type": "photo", "x": 280, "y": 280, "width": 60, "height": 60, "required": false, "rounded": true}, {"id": "player-name", "type": "text", "x": 20, "y": 280, "width": 250, "height": 40, "placeholder": "Player Name", "style": {"fontSize": 24, "fontWeight": "bold", "color": "#000000"}}, {"id": "position", "type": "text", "x": 20, "y": 320, "width": 100, "height": 30, "placeholder": "Position"}, {"id": "team-name", "type": "text", "x": 20, "y": 350, "width": 200, "height": 30, "placeholder": "Team Name"}], "elements": [{"type": "background", "gradient": "#1a365d to #2d5aa0"}, {"type": "border", "width": 2, "color": "#000000"}]}', 
true, 0, 4.8, 156, 1200, ARRAY['baseball', 'sports', 'classic']),

('sports-basketball-modern', 'Basketball Modern', 'sports', 'Dynamic basketball card with action-oriented layout', null,
'{"dimensions": {"width": 360, "height": 504}, "regions": [{"id": "player-photo", "type": "photo", "x": 0, "y": 0, "width": 360, "height": 280, "required": true}, {"id": "team-logo", "type": "photo", "x": 20, "y": 20, "width": 50, "height": 50, "required": false}, {"id": "player-name", "type": "text", "x": 20, "y": 300, "width": 320, "height": 50, "placeholder": "Player Name", "style": {"fontSize": 28, "fontWeight": "bold", "color": "#ffffff"}}, {"id": "jersey-number", "type": "text", "x": 280, "y": 350, "width": 60, "height": 60, "placeholder": "#23", "style": {"fontSize": 36, "fontWeight": "bold", "textAlign": "center"}}], "elements": [{"type": "overlay", "gradient": "rgba(0,0,0,0.3) to rgba(255,140,0,0.8)"}, {"type": "effect", "name": "glow"}]}',
true, 0, 4.6, 89, 890, ARRAY['basketball', 'sports', 'modern']),

-- Art Category  
('art-watercolor-portrait', 'Watercolor Portrait', 'art', 'Artistic frame with watercolor effects and elegant typography', null,
'{"dimensions": {"width": 360, "height": 504}, "regions": [{"id": "subject-photo", "type": "photo", "x": 30, "y": 40, "width": 300, "height": 300, "required": true, "rounded": true}, {"id": "title", "type": "text", "x": 30, "y": 360, "width": 300, "height": 40, "placeholder": "Artwork Title", "style": {"fontSize": 22, "fontFamily": "serif", "color": "#2c1810"}}, {"id": "artist-name", "type": "text", "x": 30, "y": 400, "width": 200, "height": 30, "placeholder": "Artist Name", "style": {"fontSize": 16, "fontStyle": "italic"}}], "elements": [{"type": "background", "color": "#faf7f2"}, {"type": "texture", "name": "watercolor-paper"}, {"type": "effect", "name": "soft-edges"}]}',
true, 299, 4.9, 234, 2100, ARRAY['art', 'watercolor', 'portrait', 'elegant']),

('art-abstract-geometric', 'Abstract Geometric', 'art', 'Bold geometric patterns with modern art aesthetics', null,
'{"dimensions": {"width": 360, "height": 504}, "regions": [{"id": "main-image", "type": "photo", "x": 60, "y": 80, "width": 240, "height": 240, "required": true}, {"id": "title", "type": "text", "x": 30, "y": 340, "width": 300, "height": 50, "placeholder": "Collection Title", "style": {"fontSize": 24, "fontWeight": "bold", "color": "#000000"}}], "elements": [{"type": "background", "gradient": "#ff6b6b to #4ecdc4"}, {"type": "shapes", "pattern": "triangles"}, {"type": "effect", "name": "geometric-overlay"}]}',
true, 199, 4.5, 67, 450, ARRAY['art', 'abstract', 'geometric', 'modern']),

-- Sci-Fi Category
('scifi-cyberpunk-neon', 'Cyberpunk Neon', 'sci-fi', 'Futuristic cyberpunk design with neon accents and digital effects', null,
'{"dimensions": {"width": 360, "height": 504}, "regions": [{"id": "character-photo", "type": "photo", "x": 20, "y": 20, "width": 320, "height": 300, "required": true}, {"id": "character-name", "type": "text", "x": 20, "y": 340, "width": 320, "height": 40, "placeholder": "Character Name", "style": {"fontSize": 26, "fontWeight": "bold", "color": "#00ffff", "textShadow": "0 0 10px #00ffff"}}, {"id": "class-type", "type": "text", "x": 20, "y": 380, "width": 150, "height": 30, "placeholder": "Class", "style": {"fontSize": 16, "color": "#ff0080"}}], "elements": [{"type": "background", "gradient": "#0a0a0a to #1a1a2e"}, {"type": "effect", "name": "neon-glow"}, {"type": "overlay", "pattern": "circuit-lines"}]}',
true, 399, 4.7, 198, 1800, ARRAY['sci-fi', 'cyberpunk', 'neon', 'futuristic']),

-- Fantasy Category
('fantasy-medieval-scroll', 'Medieval Scroll', 'fantasy', 'Ancient parchment design with medieval decorative elements', null,
'{"dimensions": {"width": 360, "height": 504}, "regions": [{"id": "character-portrait", "type": "photo", "x": 40, "y": 60, "width": 280, "height": 280, "required": true, "rounded": true}, {"id": "character-name", "type": "text", "x": 40, "y": 360, "width": 280, "height": 40, "placeholder": "Character Name", "style": {"fontSize": 24, "fontFamily": "serif", "color": "#8b4513"}}, {"id": "class-level", "type": "text", "x": 40, "y": 400, "width": 200, "height": 30, "placeholder": "Level 1 Warrior", "style": {"fontSize": 16, "color": "#654321"}}], "elements": [{"type": "background", "texture": "old-parchment"}, {"type": "border", "style": "ornate-medieval"}, {"type": "effect", "name": "aged-paper"}]}',
true, 199, 4.8, 145, 950, ARRAY['fantasy', 'medieval', 'parchment', 'rpg']),

-- Gaming Category  
('gaming-retro-arcade', 'Retro Arcade', 'gaming', '8-bit inspired design with pixel art elements', null,
'{"dimensions": {"width": 360, "height": 504}, "regions": [{"id": "game-screenshot", "type": "photo", "x": 30, "y": 40, "width": 300, "height": 200, "required": true}, {"id": "game-title", "type": "text", "x": 30, "y": 260, "width": 300, "height": 40, "placeholder": "Game Title", "style": {"fontSize": 22, "fontFamily": "monospace", "color": "#00ff00"}}, {"id": "high-score", "type": "text", "x": 30, "y": 300, "width": 200, "height": 30, "placeholder": "High Score: 999999", "style": {"fontSize": 16, "fontFamily": "monospace", "color": "#ffff00"}}], "elements": [{"type": "background", "color": "#000000"}, {"type": "border", "style": "pixel-art"}, {"type": "effect", "name": "scanlines"}]}',
true, 99, 4.6, 78, 620, ARRAY['gaming', 'retro', 'arcade', '8-bit']),

-- Retrowave Category
('retrowave-synthwave-grid', 'Synthwave Grid', 'retrowave', 'Classic 80s synthwave aesthetic with neon grid effects', null,
'{"dimensions": {"width": 360, "height": 504}, "regions": [{"id": "main-subject", "type": "photo", "x": 60, "y": 60, "width": 240, "height": 240, "required": true}, {"id": "title", "type": "text", "x": 30, "y": 320, "width": 300, "height": 50, "placeholder": "NEON NIGHTS", "style": {"fontSize": 28, "fontWeight": "bold", "color": "#ff00ff", "textTransform": "uppercase"}}], "elements": [{"type": "background", "gradient": "#2d1b69 to #0f0f23"}, {"type": "overlay", "pattern": "neon-grid"}, {"type": "effect", "name": "glow-lines"}]}',
true, 249, 4.9, 289, 2400, ARRAY['retrowave', 'synthwave', '80s', 'neon']);

-- Update the comprehensive frames data too  
INSERT INTO crd_frames (
  id, name, category, description, preview_image_url, frame_config,
  is_public, price_cents, rating_average, rating_count, download_count, tags
) VALUES
-- More variety
('minimalist-clean-white', 'Clean Minimalist', 'minimalist', 'Pure white minimalist design for clean, professional cards', null,
'{"dimensions": {"width": 360, "height": 504}, "regions": [{"id": "main-photo", "type": "photo", "x": 40, "y": 40, "width": 280, "height": 280, "required": true}, {"id": "title", "type": "text", "x": 40, "y": 340, "width": 280, "height": 40, "placeholder": "Title", "style": {"fontSize": 24, "fontWeight": "300", "color": "#333333"}}], "elements": [{"type": "background", "color": "#ffffff"}, {"type": "border", "width": 1, "color": "#e0e0e0"}]}',
true, 0, 4.4, 234, 1100, ARRAY['minimalist', 'clean', 'white', 'professional']),

('decades-disco-70s', 'Disco 70s', 'decades', 'Groovy 70s disco era with bold colors and patterns', null,
'{"dimensions": {"width": 360, "height": 504}, "regions": [{"id": "disco-photo", "type": "photo", "x": 30, "y": 30, "width": 300, "height": 300, "required": true}, {"id": "groovy-title", "type": "text", "x": 30, "y": 350, "width": 300, "height": 50, "placeholder": "DISCO FEVER", "style": {"fontSize": 26, "fontWeight": "bold", "color": "#ffd700", "textShadow": "2px 2px 4px #8b4513"}}], "elements": [{"type": "background", "gradient": "#ff4500 to #8b4513"}, {"type": "pattern", "name": "disco-ball"}, {"type": "effect", "name": "sparkle"}]}',
true, 149, 4.7, 156, 890, ARRAY['decades', '70s', 'disco', 'groovy', 'retro']);