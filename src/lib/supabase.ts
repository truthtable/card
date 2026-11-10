import { createClient } from '@supabase/supabase-js';

// Soft encryption / XOR cipher to stop regex scrapers
const decrypt = (cipher: string, pass: string): string => {
  const binary = atob(cipher);
  let res = '';
  for (let i = 0; i < binary.length; i++) {
    res += String.fromCharCode(binary.charCodeAt(i) ^ pass.charCodeAt(i % pass.length));
  }
  return res;
};

const SECRET_PASS = import.meta.env.VITE_SUPABASE_PASS || 'card_vault_pass_99';
const ENC_URL = 'CxUGFCxMTloVBzYZFQkEPlJKEA4ZEC0aCAYEAXEDFAMSPVhKBk8RCw==';
const ENC_KEY = 'EAMtFCoUDRwfHD4SDRYsKVpfAgc9PRo8OT9UQgYWBxEDLA9LIj42Ey0iJgUJLA==';

export const supabase = createClient(
  decrypt(ENC_URL, SECRET_PASS),
  decrypt(ENC_KEY, SECRET_PASS)
);
