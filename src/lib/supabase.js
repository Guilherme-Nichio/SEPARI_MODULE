import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Separi] Variáveis de ambiente do Supabase não configuradas. ' +
    'Crie um arquivo .env baseado em .env.example'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // PKCE flow é mais seguro que implicit
  },
  global: {
    headers: { 'x-application': 'separi-v3.11' }
  }
})

// ─── Constantes de segurança para upload ─────────────────────────────
const BUCKET_RULES = {
  'machine-photos':  { exts: ['jpg', 'jpeg', 'png', 'webp', 'heic'], maxBytes: 5  * 1024 * 1024 },
  'machine-manuals': { exts: ['pdf'],                                maxBytes: 20 * 1024 * 1024 },
  'part-images':     { exts: ['jpg', 'jpeg', 'png', 'webp'],         maxBytes: 5  * 1024 * 1024 }
}

const MIME_BY_EXT = {
  jpg:  'image/jpeg', jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  pdf:  'application/pdf'
}

// Sanitiza extensão (lowercase, sem caracteres especiais)
const sanitizeExt = (ext) => (ext || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6)

/**
 * Helper seguro para upload de arquivos.
 * - Valida extensão contra whitelist por bucket
 * - Valida tamanho contra limite por bucket
 * - Valida MIME type quando possível
 * - Gera nome sanitizado e único (sem usar nome original do cliente)
 */
export const uploadFile = async (bucket, file, pathPrefix = '') => {
  if (!file) throw new Error('Arquivo obrigatório')

  const rules = BUCKET_RULES[bucket]
  if (!rules) throw new Error(`Bucket "${bucket}" não permitido`)

  // Tamanho
  if (file.size > rules.maxBytes) {
    const mb = (rules.maxBytes / 1024 / 1024).toFixed(0)
    throw new Error(`Arquivo excede o limite de ${mb} MB`)
  }

  // Extensão
  const ext = sanitizeExt(file.name.split('.').pop())
  if (!rules.exts.includes(ext)) {
    throw new Error(`Tipo de arquivo .${ext || '?'} não permitido. Use: ${rules.exts.join(', ')}`)
  }

  // MIME (defesa em profundidade — alguns navegadores não preenchem)
  const expectedMime = MIME_BY_EXT[ext]
  if (file.type && expectedMime && !file.type.startsWith(expectedMime.split('/')[0])) {
    throw new Error(`Tipo MIME inconsistente com a extensão`)
  }

  // Nome sanitizado e único — NÃO usar o nome original
  const safePrefix = (pathPrefix || '').replace(/[^a-zA-Z0-9_\-\/]/g, '')
  const fileName = `${safePrefix}${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: expectedMime || file.type || undefined
    })

  if (error) throw error

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return { path: data.path, url: urlData.publicUrl }
}

/**
 * Helper para deletar arquivo (admin-only via RLS)
 */
export const deleteFile = async (bucket, path) => {
  if (!BUCKET_RULES[bucket]) throw new Error(`Bucket "${bucket}" não permitido`)
  return supabase.storage.from(bucket).remove([path])
}
