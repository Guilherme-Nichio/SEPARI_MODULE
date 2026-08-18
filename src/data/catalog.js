// ============================================================
// Catálogo de fabricantes, tipos e modelos de centrífugas.
// Base para a "busca da máquina" (fabricante -> tipo -> modelo)
// e para as páginas dinâmicas de modelo e de fabricante.
//
// Dados de modelos baseados em nomenclaturas reais de mercado
// (linhas/famílias dos fabricantes). Para cada modelo, derivamos
// dinamicamente as peças e kits a partir da ARQUITETURA da máquina
// (disc-stack x decanter), reaproveitando o guia de peças.
// ============================================================

export const TYPE_ARCH = {
  'Purificador': 'disc-stack',
  'Clarificador': 'disc-stack',
  'Separadora': 'disc-stack',
  'Decanter': 'decanter'
}

export const slugify = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// helper para expandir família -> modelos
const fam = (family, type, app, numbers) =>
  numbers.map((n) => ({ model: `${family} ${n}`, family, type, app }))

export const MANUFACTURERS = [
  {
    slug: 'alfa-laval',
    name: 'Alfa Laval',
    country: 'Suécia',
    founded: 1883,
    since: 'Pioneira da separação centrífuga',
    blurb: 'Maior base instalada de separadores de discos do mundo. A Separi atende todas as gerações, das séries clássicas (MAB, MAPX, MOPX) às linhas modernas auto-limpantes (séries S e P) e ao decanter NX.',
    strengths: ['Maior cobertura de modelos do mercado', 'Peças OEM e equivalentes homologados', 'Bowls de troca para as linhas mais comuns'],
    generations: [
      { name: 'Linha tradicional', era: 'MAB · MIB · MMB', note: 'Purificadores marítimos clássicos de baixa manutenção.' },
      { name: 'Linha PX', era: 'MAPX · MOPX · MMPX · FOPX · LOPX · WHPX', note: 'Auto-limpantes para óleo lubrificante e combustível.' },
      { name: 'Industrial / Alimentos', era: 'AFPX · BRPX · MRPX · BTPX', note: 'Clarificação e desnate em laticínios, bebidas e indústria.' },
      { name: 'Linha moderna', era: 'Séries S e P · NX', note: 'Separadores herméticos de alta eficiência e decanter NX.' }
    ],
    models: [
      ...fam('MAB', 'Purificador', 'Óleo lubrificante e combustível marítimo', [103, 104, 204, 205, 206, 207, 209]),
      ...fam('MIB', 'Purificador', 'Óleo lubrificante marítimo', [303]),
      ...fam('MMB', 'Purificador', 'Óleo marítimo', [203, 304, 305]),
      ...fam('MAPX', 'Purificador', 'Óleo lubrificante / combustível', [204, 205, 207, 209, 210, 309, 313]),
      ...fam('MOPX', 'Purificador', 'Óleo lubrificante / combustível', [205, 207, 209, 210, 213]),
      ...fam('MMPX', 'Purificador', 'Óleo lubrificante / clarificação', [303, 304, 403, 404]),
      ...fam('FOPX', 'Purificador', 'Combustível pesado (HFO/MDO)', [605, 607, 609, 610, 611, 613, 614]),
      ...fam('LOPX', 'Purificador', 'Óleo lubrificante marítimo', [705, 707, 709, 710, 713, 714]),
      ...fam('WHPX', 'Purificador', 'Combustível e óleo, alta capacidade', [405, 407, 409, 410, 413, 505, 507, 510, 513]),
      ...fam('AFPX', 'Clarificador', 'Clarificação industrial', [207, 213, 313, 413, 513, 517, 610]),
      ...fam('BRPX', 'Separadora', 'Separação / clarificação industrial', [207, 213, 309, 313, 413, 417, 510, 618]),
      ...fam('MRPX', 'Separadora', 'Laticínios: desnate e clarificação', [214, 314, 414, 418, 514, 518, 618, 718]),
      ...fam('BTPX', 'Clarificador', 'Bebidas: cerveja e sucos', [205, 305, 710]),
      { model: 'NX 418', family: 'NX', type: 'Decanter', app: 'Sólido-líquido contínuo (efluentes, alimentos)' }
    ]
  },
  {
    slug: 'gea-westfalia',
    name: 'GEA Westfalia',
    country: 'Alemanha',
    founded: 1893,
    since: 'Referência em séries OS',
    blurb: 'Separadores de discos das gerações OSA à OSF, com sistema hydrostop e softstream. A Separi cobre as séries OS de óleo e alimentos e os decanters da linha ecoforce.',
    strengths: ['Domínio das séries OSA → OSF', 'Conjuntos bowl/hood e drive (50/60 Hz)', 'Placas e unidades de controle novas e exchange'],
    generations: [
      { name: 'OSA', era: 'anos 1970', note: 'Primeira geração auto-limpante de larga escala.' },
      { name: 'OSB', era: 'anos 1980', note: 'Evolução de capacidade e automação.' },
      { name: 'OSC', era: 'anos 1990', note: 'Geração muito difundida em óleo e alimentos.' },
      { name: 'OSD', era: 'anos 2000', note: 'Hydrostop e maior eficiência hidráulica.' },
      { name: 'OSE', era: 'anos 2010', note: 'Eagleclass com softstream para tratamento suave.' },
      { name: 'OSF', era: '2018+', note: 'Geração mais recente, alta eficiência energética.' }
    ],
    models: [
      ...fam('OSA', 'Purificador', 'Óleo lubrificante / combustível', [5, 7, 20, 35]),
      ...fam('OSB', 'Purificador', 'Óleo, alta capacidade', [30, 35]),
      ...fam('OSC', 'Purificador', 'Óleo e alimentos', [4, 5, 15, 25, 30, 40, 50]),
      ...fam('OSD', 'Purificador', 'Óleo e alimentos (hydrostop)', [2, 6, 18, 30, 35, 50, 60]),
      ...fam('OSE', 'Clarificador', 'Clarificação e purificação (eagleclass)', [5, 10, 20, 30, 40, 80, 120]),
      ...fam('OSF', 'Clarificador', 'Alta eficiência energética', [6, 12]),
      ...fam('CF', 'Decanter', 'Desidratação e espessamento (ecoforce)', [3000, 4000, 6000])
    ]
  },
  {
    slug: 'tetra-pak',
    name: 'Tetra Pak',
    country: 'Suécia / Suíça',
    founded: 1951,
    since: 'Linha Tetra Centri',
    blurb: 'Separadores higiênicos Tetra Centri (tecnologia AirTight e Encapt) para laticínios e bebidas. A Separi fornece peças e recondicionamento para modelos novos e antigos.',
    strengths: ['Especialistas em Tetra Centri', 'Padrão sanitário para alimentos e bebidas', 'Painéis integrados atualizados'],
    generations: [
      { name: 'Tetra Centri AirTight', era: 'H / C', note: 'Separadores herméticos para desnate e clarificação.' },
      { name: 'Tetra Centri Encapt', era: 'linha moderna', note: 'Menor consumo de energia e captação de O₂.' }
    ],
    models: [
      { model: 'Tetra Centri H210', family: 'Tetra Centri', type: 'Separadora', app: 'Laticínios: desnate' },
      { model: 'Tetra Centri H214', family: 'Tetra Centri', type: 'Separadora', app: 'Laticínios: desnate e padronização' },
      { model: 'Tetra Centri C214', family: 'Tetra Centri', type: 'Clarificador', app: 'Bebidas: clarificação' },
      { model: 'Tetra Centri H510', family: 'Tetra Centri', type: 'Separadora', app: 'Laticínios: alta capacidade' },
      { model: 'Tetra Centri A610', family: 'Tetra Centri', type: 'Separadora', app: 'Desnate hermético' },
      { model: 'Tetra Centri H610', family: 'Tetra Centri', type: 'Separadora', app: 'Laticínios: alta capacidade' },
      { model: 'Tetra Centri 614HGV', family: 'Tetra Centri', type: 'Clarificador', app: 'Clarificação industrial' }
    ]
  },
  {
    slug: 'seital',
    name: 'Seital (SPX FLOW)',
    country: 'Itália',
    founded: 1980,
    since: 'Separadores SE para bebidas',
    blurb: 'Separadores e clarificadores Seital (grupo SPX FLOW), muito usados em cervejarias, vinhos e sucos. A Separi atende a linha SE com peças e revisão.',
    strengths: ['Forte em cervejaria e bebidas', 'Clarificação de baixa captação de O₂', 'Peças e revisão da linha SE'],
    generations: [
      { name: 'Linha SE', era: 'separadores', note: 'Auto-limpantes para clarificação e recuperação.' }
    ],
    models: [
      ...fam('SE', 'Clarificador', 'Cervejaria e bebidas: clarificação', [20, 40, 60, 100, 150, 200]),
      { model: 'SC 35', family: 'SC', type: 'Separadora', app: 'Recuperação de levedura / fermento' }
    ]
  },
  {
    slug: 'mitsubishi',
    name: 'Mitsubishi (Selfjector)',
    country: 'Japão',
    founded: 1962,
    since: 'Selfjector marítimo',
    blurb: 'Purificadores Selfjector (Mitsubishi Kakoki / Samgong) amplamente usados a bordo de embarcações para tratamento de combustível e óleo lubrificante.',
    strengths: ['Especialistas em Selfjector', 'Peças para tratamento de HFO e lube oil', 'Suporte a frotas e embarcações'],
    generations: [
      { name: 'Série SJ', era: 'Selfjector', note: 'Auto-limpantes de combustível e óleo lubrificante.' },
      { name: 'Série OP / OD', era: 'purificadores', note: 'Modelos de purificação embarcada.' }
    ],
    models: [
      ...fam('SJ', 'Purificador', 'Combustível e óleo lubrificante marítimo', ['700', '2000', '3000', '4000', '6000']),
      ...fam('OP', 'Purificador', 'Purificação embarcada', [1000, 3000, 5000])
    ]
  },
  {
    slug: 'flottweg',
    name: 'Flottweg',
    country: 'Alemanha',
    founded: 1932,
    since: 'Decanters de alta performance',
    blurb: 'Decanters e separadores Flottweg para separação sólido-líquido em alimentos, biocombustíveis, mineração e meio ambiente. A Separi atende a linha de decanters Z e o Sedicanter.',
    strengths: ['Decanters Z de alta performance', 'Rosca e tambor com proteção antidesgaste', 'Separação de 2 e 3 fases'],
    generations: [
      { name: 'Linha Z', era: 'decanters', note: 'Decanters de carga pesada para uso contínuo.' },
      { name: 'Sedicanter', era: 'sólidos finos', note: 'Para lamas de baixa concentração e sólidos finos.' }
    ],
    models: [
      ...fam('Z', 'Decanter', 'Separação sólido-líquido contínua', ['23', '3E', '4E', '6E', '8E']),
      { model: 'Sedicanter', family: 'Sedicanter', type: 'Decanter', app: 'Lamas finas e baixa concentração' },
      { model: 'AC 2500', family: 'AC', type: 'Separadora', app: 'Separação de óleos e clarificação' }
    ]
  },
  {
    slug: 'pieralisi',
    name: 'Pieralisi',
    country: 'Itália',
    founded: 1888,
    since: 'Decanters para óleo e indústria',
    blurb: 'Decanters e separadores Pieralisi, tradicionais em azeite, alimentos e tratamento de resíduos. A Separi fornece peças e recondicionamento para as linhas FP e Jumbo.',
    strengths: ['Tradição em decanters de óleo', 'Linhas FP e Jumbo', 'Separação de 2 e 3 fases'],
    generations: [
      { name: 'Linha FP', era: 'decanters', note: 'Decanters industriais de uso geral.' },
      { name: 'Linha Jumbo', era: 'alta capacidade', note: 'Decanters de grande porte.' }
    ],
    models: [
      ...fam('FP', 'Decanter', 'Óleo vegetal, alimentos e resíduos', ['400', '600', '900']),
      ...fam('Jumbo', 'Decanter', 'Alta capacidade contínua', ['3', '4']),
      { model: 'SPI 444', family: 'SPI', type: 'Separadora', app: 'Clarificação de óleos' }
    ]
  }
]

// notas técnicas por família (qualitativas)
export const FAMILY_NOTES = {
  MAB: 'Purificador marítimo clássico de acionamento por engrenagem helicoidal. Robusto e de manutenção simples, é a base instalada mais antiga ainda em operação a bordo.',
  MIB: 'Purificador compacto da linha tradicional Alfa Laval, voltado a óleo lubrificante em motores marítimos de menor porte.',
  MMB: 'Purificador da linha tradicional, intermediário entre MAB e as séries PX, ainda comum em embarcações.',
  MAPX: 'Auto-limpante da linha PX para óleo lubrificante e combustível. Ejeção de sólidos a plena rotação, ideal para operação contínua a bordo.',
  MOPX: 'Auto-limpante de média capacidade para óleo lubrificante e combustível marítimo, com sistema de água de operação para descarga programada.',
  MMPX: 'Auto-limpante compacto, frequentemente usado em clarificação e purificação de óleo lubrificante.',
  FOPX: 'Purificador de combustível pesado (HFO/MDO) de alta capacidade. Sensível à qualidade do disc stack e do disco de gravidade para o corte água/óleo.',
  LOPX: 'Purificador de óleo lubrificante marítimo. O conjunto de discos e as vedações são os itens de maior desgaste em regime contínuo.',
  WHPX: 'Auto-limpante de alta capacidade para combustível e óleo, comum em motores de grande porte e geração de energia.',
  AFPX: 'Clarificador industrial auto-limpante para remoção de sólidos finos em processos contínuos.',
  BRPX: 'Separador/clarificador industrial versátil, usado em alimentos, amido e recuperação de produto.',
  MRPX: 'Separador de laticínios para desnate e clarificação. Exige padrão sanitário e troca programada de vedações e disc stack.',
  BTPX: 'Clarificador para bebidas (cerveja, sucos), com foco em baixa captação de oxigênio e brilho do produto.',
  NX: 'Decanter solid bowl Alfa Laval para separação sólido-líquido contínua. Rosca transportadora, mancais e proteção antidesgaste são os pontos críticos.',
  OSA: 'Primeira geração auto-limpante GEA de larga escala. Peças ainda disponíveis em OEM e equivalente para manter a base instalada.',
  OSB: 'Geração GEA de maior capacidade, com automação aprimorada em relação à OSA.',
  OSC: 'Uma das gerações GEA mais difundidas em óleo e alimentos. Ampla disponibilidade de conjuntos bowl/hood e drive.',
  OSD: 'Geração GEA com sistema hydrostop para ejeção controlada a plena rotação e maior eficiência hidráulica.',
  OSE: 'Eagleclass com inlet softstream para tratamento suave do produto, alta eficiência de separação.',
  OSF: 'Geração GEA mais recente, com foco em eficiência energética e menor consumo de água de operação.',
  CF: 'Decanter GEA da linha ecoforce para desidratação e espessamento. Rosca, tambor e gearbox concentram o desgaste.',
  'Tetra Centri': 'Separador higiênico Tetra Pak (AirTight/Encapt) para alimentos e bebidas. Vedações sanitárias e disc stack pedem troca programada.',
  SE: 'Separador Seital auto-limpante para clarificação de bebidas, com foco em baixa captação de O₂ e recuperação de produto.',
  SC: 'Separador Seital para recuperação de levedura e clarificação em cervejarias.',
  SJ: 'Purificador Selfjector (Mitsubishi) auto-limpante para combustível e óleo lubrificante a bordo. Pilha de discos e bico de descarga são itens de atenção.',
  OP: 'Purificador embarcado Selfjector, voltado ao tratamento de combustível em motores marítimos.',
  Z: 'Decanter Flottweg da linha Z para separação sólido-líquido contínua de carga pesada. Proteção antidesgaste na rosca é determinante.',
  Sedicanter: 'Decanter Flottweg para lamas finas e baixa concentração de sólidos, onde um decanter comum não atinge a clarificação desejada.',
  AC: 'Separador Flottweg de discos para clarificação e separação de óleos.',
  FP: 'Decanter Pieralisi de uso geral em óleo vegetal, alimentos e resíduos. Gearbox e rosca são os pontos de maior desgaste.',
  Jumbo: 'Decanter Pieralisi de grande porte para alta capacidade contínua.',
  SPI: 'Separador de discos Pieralisi para clarificação de óleos.'
}

export const TYPE_NOTES = {
  'Purificador': 'Purificador de discos: separa líquido-líquido-sólido (ex.: remove água e borra do óleo). O disco de gravidade e o disc stack definem a qualidade do corte.',
  'Clarificador': 'Clarificador de discos: remove sólidos finos em suspensão de um único líquido, deixando o produto límpido.',
  'Separadora': 'Separadora de discos: separa fases por densidade em alta rotação (ex.: desnate, recuperação de produto).',
  'Decanter': 'Decanter (solid bowl): tambor horizontal com rosca transportadora para desidratar e espessar materiais com alto teor de sólidos, em regime contínuo.'
}

// ---- helpers de busca ----
export function getManufacturer(slug) {
  return MANUFACTURERS.find((m) => m.slug === slug) || null
}

export function getManufacturerTypes(slug) {
  const m = getManufacturer(slug)
  if (!m) return []
  return [...new Set(m.models.map((x) => x.type))]
}

export function getModels(slug, type) {
  const m = getManufacturer(slug)
  if (!m) return []
  return m.models.filter((x) => !type || x.type === type)
}

export function findMachine(brandSlug, modelSlug) {
  const m = getManufacturer(brandSlug)
  if (!m) return null
  const model = m.models.find((x) => slugify(x.model) === modelSlug)
  if (!model) return null
  return { manufacturer: m, ...model, arch: TYPE_ARCH[model.type] || 'disc-stack' }
}

export function relatedModels(brandSlug, model) {
  const m = getManufacturer(brandSlug)
  if (!m) return []
  const sameFamily = m.models.filter((x) => x.family === model.family && x.model !== model.model)
  const sameBrand = m.models.filter((x) => x.family !== model.family)
  return [...sameFamily, ...sameBrand].slice(0, 6)
}
