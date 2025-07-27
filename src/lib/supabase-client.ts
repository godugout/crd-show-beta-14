
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Environment-based configuration
const getSupabaseConfig = () => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Development environment - use the existing dev project
    return {
      url: "https://wxlwhqlbxyuyujhqeyur.supabase.co",
      key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bHdocWxieHl1eXVqaHFleXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMjAyNTMsImV4cCI6MjA1Mzc5NjI1M30.6TlBEqXOPZRgwhPrHQBYjMMVzmCTmCb-Q1-sNnFhVrc"
    };
  } else {
    // Production environment - use the Lovable project
    return {
      url: "https://kwxsnkckyjkmpdzrsyxi.supabase.co",
      key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eHNua2NreWprbXBkenJzeXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1OTQ3NDQsImV4cCI6MjA2NTE3MDc0NH0.s4nuV8CnLnHhfTFUlMQVg5XFV4VluJtJaxAyc3hWBPU"
    };
  }
};

const config = getSupabaseConfig();

// Create the Supabase client
export const supabase = createClient<Database>(config.url, config.key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export the config for debugging
export const supabaseConfig = config;
