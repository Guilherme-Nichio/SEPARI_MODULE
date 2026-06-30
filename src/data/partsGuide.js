// Conteúdo de peças — base para a página de Peças e para os guias individuais.
// Referência de estrutura: separatorequipment.com/spare-parts

export const PARTS_BRANDS = ['Alfa Laval', 'GEA Westfalia', 'Tetra Pak', 'Seital', 'Mitsubishi (MKK)', 'Pieralisi', 'Flottweg']

export const PARTS_MODELS = ['MAB 103', 'MAB 104', 'MMB 304', 'MMB 305', 'MRPX 518', 'LOPX 707', 'MOPX 207', 'FOPX 610', 'NX 418', 'SC 50', 'Tetra Centri C214', 'OSE / OSD', 'BRPX 213']

export const PARTS_STATS = [
  { k: '+20.000', v: 'peças em estoque' },
  { k: '7 marcas', v: 'principais fabricantes de centrífugas' },
  { k: 'OEM + equivalente', v: '100% compatíveis com o original' },
  { k: '3 meses', v: 'garantia em itens de não-desgaste' }
]

// Tipos de máquina (subabas)
export const PARTS_MACHINES = [
  {
    key: 'disc-stack',
    name: 'Separadora de discos',
    tag: 'Disc stack · purificador / clarificador',
    desc: 'Bowl com uma pilha de discos cônicos girando em alta rotação. Os discos multiplicam a área de separação, tornando o processo mais rápido e com maior capacidade. É a arquitetura mais comum em laticínios, bebidas, óleo & gás e aplicações marítimas.',
    parts: ['bowl', 'disc-stack', 'gravity-disc', 'lock-ring', 'distributor', 'paring-disc', 'spindle', 'friction-coupling', 'flat-belt', 'bearings', 'seals', 'operating-water']
  },
  {
    key: 'decanter',
    name: 'Decanter (solid bowl)',
    tag: 'Sem disc stack · rosca transportadora',
    desc: 'Tambor horizontal sem pilha de discos. Um transportador de rosca (scroll) remove os sólidos continuamente — ideal para lamas e processos com até 60% de sólidos, como mineração, biocombustíveis e tratamento de efluentes.',
    parts: ['drum', 'scroll', 'gearbox', 'bearings', 'spindle', 'seals', 'wear-protection']
  },
  {
    key: 'chamber-bowl',
    name: 'Bowl de câmaras',
    tag: 'Chamber bowl · clarificação',
    desc: 'Câmaras concêntricas criam uma grande área de clarificação num volume de bowl pequeno. Muito usada na clarificação fina de líquidos onde o teor de sólidos é baixo.',
    parts: ['chambers', 'bowl-lid', 'gasket-kit', 'bearings', 'spindle']
  }
]

// Guias individuais de peça (cada um vira uma página)
export const PARTS_GUIDE = {
  'bowl': {
    name: 'Bowl / Rotor', machine: 'Separadora de discos', icon: 'CircleDot',
    short: 'O coração da centrífuga, onde a separação acontece.',
    body: [
      'O bowl (rotor) é a peça central da separadora: é dentro dele, girando a milhares de rotações por minuto, que a força centrífuga separa as fases por densidade. Toda a precisão da máquina depende da integridade do bowl.',
      'Por trabalhar sob esforço extremo, o bowl precisa estar dentro de tolerância dimensional e perfeitamente balanceado. Erosão, trincas ou desgaste nas superfícies de selagem comprometem o rendimento e geram vibração.',
      'Fornecemos bowls completos e seus componentes, novos ou recondicionados, sempre com balanceamento dinâmico e inspeção por líquido penetrante antes da entrega.'
    ],
    wear: ['Vibração acima do normal', 'Queda de rendimento na separação', 'Erosão nas superfícies de selagem', 'Trincas detectáveis por NDT']
  },
  'disc-stack': {
    name: 'Conjunto de discos (disc stack)', machine: 'Separadora de discos', icon: 'Layers',
    short: 'Discos cônicos empilhados que multiplicam a área de separação.',
    body: [
      'O conjunto de discos é formado por dezenas de discos cônicos empilhados dentro do bowl. Eles dividem o líquido em camadas finas, encurtando a distância que cada partícula precisa percorrer e acelerando muito a separação.',
      'A quantidade, o espaçamento e o estado das superfícies dos discos influenciam diretamente a qualidade da separação. Discos deformados, corroídos ou com caramelização reduzem a eficiência.',
      'Trabalhamos com conjuntos de discos OEM e equivalentes homologados, com a contagem e a geometria corretas para o seu modelo.'
    ],
    wear: ['Separação fora de especificação', 'Discos deformados ou corroídos', 'Acúmulo/caramelização entre discos', 'Altura do conjunto fora de tolerância']
  },
  'gravity-disc': {
    name: 'Disco de gravidade', machine: 'Separadora de discos', icon: 'CircleDashed',
    short: 'Define a posição da interface no modo purificador.',
    body: [
      'No modo purificador, o disco de gravidade (gravity disc / regulating ring) define onde fica a interface entre as duas fases líquidas dentro do bowl. Escolher o diâmetro correto é o que ajusta a separação à densidade do produto.',
      'Um disco de gravidade mal dimensionado faz a máquina "quebrar a vedação de água" ou perder produto pela saída errada. Por isso fornecemos jogos completos para o seu modelo.',
    ],
    wear: ['Perda de produto pela fase errada', 'Quebra da vedação hidráulica', 'Necessidade de mudar a densidade do produto']
  },
  'lock-ring': {
    name: 'Lock ring (anel de trava)', machine: 'Separadora de discos', icon: 'CircleDot',
    short: 'Mantém o bowl fechado sob força centrífuga — item de segurança.',
    body: [
      'O lock ring é o grande anel roscado que mantém o bowl montado e fechado mesmo sob a enorme força centrífuga da operação. É um componente crítico de segurança.',
      'Desgaste ou erosão na rosca do lock ring é uma das inspeções mais importantes em qualquer revisão. Uma rosca comprometida não pode voltar à operação.',
    ],
    wear: ['Erosão ou desgaste na rosca', 'Dificuldade de aperto/torque', 'Marcas de fadiga']
  },
  'distributor': {
    name: 'Distribuidor', machine: 'Separadora de discos', icon: 'Share2',
    short: 'Conduz o líquido de alimentação até a pilha de discos.',
    body: [
      'O distribuidor leva o líquido de entrada do centro do bowl até a base da pilha de discos, distribuindo o fluxo de forma uniforme. Um distribuidor desgastado prejudica a alimentação e a separação.',
    ],
    wear: ['Erosão por abrasão', 'Distribuição desigual de fluxo', 'Queda de capacidade']
  },
  'paring-disc': {
    name: 'Paring disc (disco de bombeio)', machine: 'Separadora de discos', icon: 'Disc3',
    short: 'Bombeia a fase clarificada para fora sob pressão.',
    body: [
      'O paring disc (ou paring chamber) funciona como uma bomba centrípeta interna: ele retira a fase líquida já separada e a envia para fora do bowl sob pressão, sem necessidade de bomba externa.',
      'Desgaste no paring disc reduz a pressão de descarga e pode causar espuma ou aeração do produto.',
    ],
    wear: ['Queda na pressão de descarga', 'Aeração ou espuma no produto', 'Desgaste nas pás']
  },
  'spindle': {
    name: 'Eixo / Spindle', machine: 'Separadora de discos', icon: 'Minus',
    short: 'Transmite a rotação do conjunto motriz ao bowl.',
    body: [
      'O eixo vertical (spindle) sustenta e transmite a rotação ao bowl. É uma peça de altíssima precisão: qualquer empenamento gera vibração e acelera o desgaste de rolamentos e vedações.',
      'Fornecemos eixos novos e recondicionados, com verificação de batimento e retífica quando aplicável.',
    ],
    wear: ['Vibração e ruído', 'Batimento fora de tolerância', 'Desgaste nas sedes de rolamento']
  },
  'friction-coupling': {
    name: 'Acoplamento de fricção (clutch)', machine: 'Separadora de discos', icon: 'Disc3',
    short: 'Garante a partida suave e protege o motor.',
    body: [
      'O acoplamento de fricção (embreagem centrífuga) faz a aceleração do bowl ser gradual na partida, protegendo o motor, a correia e a transmissão do pico de corrente do arranque.',
      'Sapatas de fricção gastas causam partidas lentas, patinagem e aquecimento.',
    ],
    wear: ['Partida lenta ou patinando', 'Cheiro de queimado / superaquecimento', 'Sapatas de fricção desgastadas']
  },
  'flat-belt': {
    name: 'Correia plana', machine: 'Separadora de discos', icon: 'Minus',
    short: 'Transmite a potência do motor ao conjunto rotativo.',
    body: [
      'Em muitos modelos a transmissão é feita por uma correia plana entre o motor e o eixo. É um item de desgaste que deve ser trocado preventivamente para evitar paradas inesperadas.',
    ],
    wear: ['Folga ou patinagem', 'Ressecamento e fissuras', 'Ruído na transmissão']
  },
  'bearings': {
    name: 'Rolamentos', machine: 'Comum a todos os tipos', icon: 'CircleDot',
    short: 'Sustentam os eixos — principal fonte de vibração quando gastos.',
    body: [
      'Os rolamentos sustentam o conjunto rotativo em alta velocidade. São a causa mais comum de vibração e ruído quando entram em fim de vida e devem ser substituídos por itens da especificação correta.',
      'Trabalhamos com rolamentos de marcas reconhecidas, na classe e na pré-carga adequadas a cada modelo.',
    ],
    wear: ['Aumento de vibração e ruído', 'Elevação da temperatura de mancal', 'Folga axial/radial']
  },
  'seals': {
    name: 'Vedações, gaxetas e O-rings', machine: 'Comum a todos os tipos', icon: 'CircleDashed',
    short: 'Itens de desgaste que garantem a estanqueidade do bowl.',
    body: [
      'Gaxetas, retentores e O-rings garantem que cada fase saia pela saída correta e que não haja contaminação. São itens de desgaste e formam o núcleo dos kits de serviço (minor, intermediate, major).',
      'Vedações ressecadas ou deformadas causam vazamento, contaminação e perda de rendimento — daí a importância de respeitar o intervalo de troca.',
    ],
    wear: ['Vazamentos', 'Contaminação entre fases', 'Ressecamento ou deformação do elastômero']
  },
  'operating-water': {
    name: 'Sistema de água de operação', machine: 'Separadora de discos', icon: 'Droplets',
    short: 'Comanda a abertura e o fechamento do bowl autolimpante.',
    body: [
      'Nas máquinas autolimpantes, a água de operação aciona o mecanismo que abre o bowl para ejetar os sólidos e o fecha de novo, sem parar a produção. Válvulas, bicos e vedações desse sistema são itens de manutenção.',
    ],
    wear: ['Ejeções incompletas ou irregulares', 'Vazamento de água de operação', 'Bicos entupidos']
  },
  'drum': {
    name: 'Tambor / Rotor (decanter)', machine: 'Decanter', icon: 'Cylinder',
    short: 'O corpo onde a separação acontece no decanter.',
    body: [
      'No decanter, a separação ocorre dentro do tambor cilíndrico-cônico que gira em alta rotação. Ele precisa estar balanceado e com as superfícies internas íntegras.',
    ],
    wear: ['Vibração', 'Desgaste interno por abrasão', 'Desbalanceamento']
  },
  'scroll': {
    name: 'Transportador de rosca (scroll)', machine: 'Decanter', icon: 'RotateCw',
    short: 'Remove os sólidos continuamente do tambor.',
    body: [
      'O scroll (rosca transportadora) gira a uma velocidade ligeiramente diferente do tambor e empurra os sólidos decantados para a saída. Por estar em contato direto com material abrasivo, é a peça de maior desgaste do decanter.',
      'Recuperamos e reaplicamos proteção antidesgaste (tiles/revestimento) no scroll, prolongando sua vida útil.',
    ],
    wear: ['Perda de eficiência na desidratação', 'Desgaste do revestimento antidesgaste', 'Desbalanceamento']
  },
  'gearbox': {
    name: 'Caixa de engrenagens (gearbox)', machine: 'Decanter', icon: 'Settings',
    short: 'Define a velocidade diferencial entre tambor e scroll.',
    body: [
      'A caixa de engrenagens estabelece a diferença de rotação entre o tambor e o scroll — parâmetro que controla a secura dos sólidos. Fornecemos e recondicionamos gearboxes para as principais marcas de decanter.',
    ],
    wear: ['Ruído ou folga nas engrenagens', 'Vazamento de óleo', 'Diferencial irregular']
  },
  'wear-protection': {
    name: 'Proteções antidesgaste', machine: 'Decanter', icon: 'ShieldCheck',
    short: 'Revestimentos que protegem as áreas de maior abrasão.',
    body: [
      'Tiles de carboneto, revestimentos e buchas de proteção blindam as áreas do decanter expostas à abrasão. Sua reposição periódica é o que mantém o tambor e o scroll dentro de tolerância por muito mais tempo.',
    ],
    wear: ['Abrasão exposta no metal-base', 'Tiles soltos ou quebrados', 'Aumento do desgaste do scroll']
  },
  'chambers': {
    name: 'Conjunto de câmaras', machine: 'Bowl de câmaras', icon: 'Layers',
    short: 'Câmaras concêntricas que ampliam a área de clarificação.',
    body: [
      'No bowl de câmaras, anéis concêntricos criam várias superfícies de sedimentação, ampliando a área útil de clarificação. Fornecemos os conjuntos e seus componentes para os modelos de câmara.',
    ],
    wear: ['Queda de clarificação', 'Acúmulo de sólidos', 'Corrosão das câmaras']
  },
  'bowl-lid': {
    name: 'Tampa e fundo do bowl', machine: 'Bowl de câmaras', icon: 'CircleDot',
    short: 'Fecham e selam o conjunto de câmaras.',
    body: [
      'A tampa e o fundo do bowl fecham o conjunto e garantem a estanqueidade. Suas superfícies de selagem e roscas são pontos de inspeção em cada revisão.',
    ],
    wear: ['Vazamentos', 'Desgaste nas superfícies de selagem', 'Erosão de rosca']
  },
  'gasket-kit': {
    name: 'Kit de juntas e vedações', machine: 'Bowl de câmaras', icon: 'CircleDashed',
    short: 'Conjunto de vedações específico do modelo de câmaras.',
    body: [
      'O kit de juntas reúne todas as vedações necessárias para a manutenção do bowl de câmaras, na geometria exata do modelo. É a base da manutenção preventiva.',
    ],
    wear: ['Vazamentos', 'Contaminação', 'Vedações ressecadas']
  }
}

export const getPartGuide = (slug) => PARTS_GUIDE[slug] || null
export const partName = (slug) => PARTS_GUIDE[slug]?.name || slug

export const PARTS_KITS = [
  { name: 'Minor service kit', desc: 'Gaxetas e vedações para a manutenção preventiva de rotina.' },
  { name: 'Intermediate kit', desc: 'Itens de desgaste intermediários, incluindo elementos do bowl.' },
  { name: 'Major service kit', desc: 'Kit completo para a revisão geral anual do equipamento.' },
  { name: 'Kit de O-rings', desc: 'Anéis, retentores e vedações específicos do seu modelo.' }
]
