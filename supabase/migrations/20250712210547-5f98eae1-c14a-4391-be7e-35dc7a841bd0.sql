-- Create the copyright-safe CRD:DNA tables

-- Cities table for location-based identity
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_code VARCHAR(10) UNIQUE NOT NULL,
  city_name VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  state_code VARCHAR(10),
  country VARCHAR(100) NOT NULL DEFAULT 'USA',
  region VARCHAR(50),
  coordinates POINT,
  area_codes TEXT[],
  nicknames TEXT[],
  landmarks TEXT[],
  cuisine TEXT[],
  established_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Color schemes table for visual identity
CREATE TABLE public.color_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  color_code VARCHAR(10) UNIQUE NOT NULL,
  primary_color VARCHAR(7) NOT NULL,
  secondary_color VARCHAR(7) NOT NULL,
  tertiary_color VARCHAR(7),
  accent_color VARCHAR(7),
  color_names TEXT[] NOT NULL,
  combo_name VARCHAR(100),
  pattern VARCHAR(20) DEFAULT 'solid',
  contrast VARCHAR(10) DEFAULT 'high',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Style definitions table
CREATE TABLE public.style_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  style_code VARCHAR(20) UNIQUE NOT NULL,
  style_name VARCHAR(50) NOT NULL,
  era VARCHAR(20),
  typography_style VARCHAR(20) DEFAULT 'sans',
  typography_weight VARCHAR(20) DEFAULT 'regular',
  typography_transform VARCHAR(20),
  has_borders BOOLEAN DEFAULT false,
  has_shadows BOOLEAN DEFAULT false,
  has_gradients BOOLEAN DEFAULT false,
  textures TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cities_name ON public.cities(city_name);
CREATE INDEX idx_cities_country ON public.cities(country);
CREATE INDEX idx_cities_region ON public.cities(region);
CREATE INDEX idx_colors_code ON public.color_schemes(color_code);