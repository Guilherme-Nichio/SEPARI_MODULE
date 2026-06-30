import {
  Beef, Beer, Wine, Ship, Leaf, FlaskConical,
  Flame, Pickaxe, Lightbulb, Droplets
} from 'lucide-react'

/**
 * Catálogo de APLICAÇÕES / SETORES atendidos.
 *
 * Cada item gera uma landing page própria em /aplicacoes/:slug e também
 * aparece na página de Produtos. Conteúdo estático de marketing/engenharia,
 * sem depender do Supabase.
 *
 * Schema:
 *   slug, name, short, category, icon
 *   eyebrow, heroTitle, heroLead, intro
 *   process[]    -> { title, text }  (como a separação funciona no setor)
 *   challenges[] -> { title, desc }  (dores que resolvemos)
 *   delivers[]   -> { title, desc }  (o que a Separi entrega)
 *   focus[]      -> string           (pontos de atenção na manutenção)
 *   faq[]        -> { q, a }          (dúvidas do setor)
 */

export const APPLICATIONS = [
  {
    slug: 'laticinios',
    name: 'Laticínios e Alimentos',
    short: 'Laticínios',
    category: 'alimentar',
    icon: <Beef size={26} strokeWidth={1.6} />,
    eyebrow: 'Setor alimentar',
    heroTitle: 'Separação higiênica para laticínios',
    heroLead: 'Desnate, padronização, clarificação e recuperação de soro com a eficiência e o rigor sanitário que o processamento de leite exige.',
    intro: 'A separadora centrífuga é o coração do laticínio. Foi para desnatar leite que a separadora de discos moderna nasceu, há mais de um século, e até hoje ela define o rendimento de creme, a padronização da gordura e a segurança sanitária da planta. Quando o bowl perde balanceamento ou as vedações se desgastam, o prejuízo aparece direto no rendimento e na qualidade.',
    process: [
      { title: 'Desnate e padronização', text: 'A separadora divide o leite em creme e leite desnatado pela força centrífuga e permite padronizar o teor de gordura com precisão. O desnate a quente aproveita a maior diferença de densidade entre creme e leite aquecido, enquanto o desnate a frio é mais delicado.' },
      { title: 'Clarificação', text: 'A clarificadora remove o sedimento natural do leite, que reúne células, leucócitos, bactérias e impurezas. Esse material se acumula no espaço de sólidos do bowl e, nas máquinas autolimpantes, é descarregado automaticamente em intervalos programados, sem parar a produção.' },
      { title: 'Recuperação de soro e derivados', text: 'Na queijaria, separadoras recuperam gordura e proteína do soro e viabilizam produtos como iogurte grego, quark e queijo fresco. Tudo opera com limpeza CIP e dentro das normas sanitárias do setor.' }
    ],
    challenges: [
      { title: 'Perda de rendimento de creme', desc: 'Disco fora de tolerância ou bowl desbalanceado reduz a eficiência do desnate e deixa gordura escapar no leite desnatado.' },
      { title: 'Risco sanitário', desc: 'Vedações e gaxetas gastas comprometem a higiene e podem contaminar o produto, em uma indústria que não admite falha.' },
      { title: 'Parada na linha de leite', desc: 'A desnatadeira fica no meio da linha, e leite é perecível. Cada hora parada é produção que não volta.' }
    ],
    delivers: [
      { title: 'Peças para desnatadeiras e clarificadoras', desc: 'Discos, lock ring, distribuidor, gaxetas, bicas e conjuntos de transmissão, originais ou equivalentes homologados.' },
      { title: 'Revisão de bowl com balanceamento', desc: 'Inspeção de discos por trincas e deformação, limpeza, troca do que estiver fora de tolerância e balanceamento dinâmico computadorizado.' },
      { title: 'Recondicionamento completo', desc: 'Restauração da máquina ao padrão de fábrica, com teste contínuo de bancada antes da devolução.' },
      { title: 'Recuperação de soro', desc: 'Suporte às separadoras dedicadas a aproveitar gordura e proteína do soro de queijo.' }
    ],
    focus: [
      'Inspeção de discos e lock ring a cada abertura de bowl',
      'Torque de fechamento conforme o fabricante',
      'Folga e ruído nos rolamentos do eixo',
      'Estado das vedações sanitárias e do sistema de descarga'
    ],
    faq: [
      { q: 'De quanto em quanto tempo abrir o bowl?', a: 'Depende do modelo e do uso, mas a inspeção segue o intervalo do fabricante. Em cada abertura verificamos discos, lock ring, distribuidor e vedações, e medimos as tolerâncias.' },
      { q: 'Atendem desnatadeira e clarificadora das principais marcas?', a: 'Sim. Trabalhamos com Alfa Laval, GEA Westfalia, Tetra Pak e Seital, com peças e serviço de oficina e de campo.' },
      { q: 'Dá para recondicionar mantendo o padrão sanitário?', a: 'Sim. A recuperação respeita os materiais e acabamentos exigidos pela indústria de alimentos, com relatório técnico do serviço.' }
    ]
  },
  {
    slug: 'cervejarias',
    name: 'Cervejarias',
    short: 'Cervejaria',
    category: 'alimentar',
    icon: <Beer size={26} strokeWidth={1.6} />,
    eyebrow: 'Setor alimentar',
    heroTitle: 'Centrífugas para cervejarias',
    heroLead: 'Recuperação de levedura, clarificação de mosto e cerveja verde e polimento antes da filtração, com baixa captação de oxigênio.',
    intro: 'Na cervejaria, a centrífuga decide clareza, estabilidade e quanto produto você perde no caminho. Bem ajustada, ela devolve mais cerveja ao tanque e alivia a filtração. Malcuidada, vira fonte de vibração, perda de vazão e, pior, entrada de oxigênio que mata o aroma.',
    process: [
      { title: 'Clarificação da cerveja verde e do mosto', text: 'A separadora remove levedura e trub da cerveja verde e clarifica o mosto, fazendo o polimento antes da filtração. O ganho é prático: mais cerveja no tanque e menos perda no processo.' },
      { title: 'Recuperação de levedura', text: 'A separação recupera a levedura ativa com qualidade para reuso, o que reduz descarte e custo de fermento ao longo das bateladas.' },
      { title: 'Proteção do aroma', text: 'O ponto sensível é o oxigênio. Vedações herméticas com barreira de gás mantêm a captação de O2 baixíssima, preservando sabor e prazo de validade. Por isso o estado das vedações é decisivo na cervejaria.' }
    ],
    challenges: [
      { title: 'Entrada de oxigênio', desc: 'Vedação gasta eleva o O2 e degrada o sabor e a estabilidade da cerveja.' },
      { title: 'Cerveja perdida com a levedura', desc: 'Separação mal ajustada arrasta produto junto do fermento e do trub.' },
      { title: 'Vibração e queda de vazão', desc: 'Desgaste no bowl e na transmissão derruba a vazão e eleva o consumo de energia ao longo do turno.' }
    ],
    delivers: [
      { title: 'Peças e vedações herméticas', desc: 'Reposição com foco no conjunto de selagem que protege a cerveja do oxigênio.' },
      { title: 'Revisão com balanceamento', desc: 'Bowl inspecionado, dentro de tolerância e balanceado para girar sem vibração.' },
      { title: 'Recondicionamento completo', desc: 'Máquina restaurada ao padrão de fábrica e testada antes de voltar à operação.' },
      { title: 'Ajuste para recuperação de levedura', desc: 'Calibração da separação para maximizar o reaproveitamento do fermento.' }
    ],
    focus: [
      'Conjunto de vedação e barreira de gás',
      'Tolerância e balanceamento do bowl',
      'Vazão e temperatura estáveis',
      'Rolamentos e transmissão'
    ],
    faq: [
      { q: 'A centrífuga ajuda a reduzir perdas na filtração?', a: 'Sim. Ao clarificar antes da filtração, ela tira boa parte da carga de sólidos, o que aumenta o rendimento e prolonga a vida dos filtros.' },
      { q: 'Como vocês cuidam da entrada de oxigênio?', a: 'Cuidamos do conjunto de selagem hermética e da barreira de gás na revisão, que é o que mantém o O2 baixo e protege o aroma.' },
      { q: 'Atendem cervejaria de médio e grande porte?', a: 'Sim, com peças, recondicionamento e serviço de campo para separadoras de cervejaria das principais marcas.' }
    ]
  },
  {
    slug: 'sumos-e-bebidas',
    name: 'Sumos e Bebidas',
    short: 'Sumos e Bebidas',
    category: 'alimentar',
    icon: <Wine size={26} strokeWidth={1.6} />,
    eyebrow: 'Setor alimentar',
    heroTitle: 'Sucos, vinho e bebidas vegetais',
    heroLead: 'Clarificação e extração contínua com máxima retenção de aroma, cor e nutrientes, da fruta à bebida funcional.',
    intro: 'Bebidas naturais pedem separação delicada para preservar aroma, cor e nutrientes. A centrífuga entrega um produto mais estável e de maior valor, e muitas vezes com rendimento melhor que os métodos tradicionais, do suco ao vinho e às bebidas vegetais.',
    process: [
      { title: 'Clarificação de sucos e néctares', text: 'A clarificadora remove polpa e sólidos em suspensão com controle fino de turbidez, mantendo cor e aroma. É comum no preparo de sucos, néctares e bebidas funcionais.' },
      { title: 'Extração de vinho e mostos', text: 'Na vinícola, o decanter extrai o mosto com rendimento superior ao das prensas convencionais, recuperando mais produto da mesma matéria prima.' },
      { title: 'Polimento final', text: 'Separadoras de polimento garantem o brilho e a estabilidade que a bebida precisa antes do envase, removendo os últimos resíduos com cuidado.' }
    ],
    challenges: [
      { title: 'Turbidez e instabilidade', desc: 'Clarificação fora do ponto deixa a bebida turva ou instável na prateleira.' },
      { title: 'Perda de rendimento', desc: 'Extração mal calibrada deixa produto valioso para trás.' },
      { title: 'Higiene em fluxo contínuo', desc: 'Linhas de bebida de alto volume não toleram falha de higiene nem parada.' }
    ],
    delivers: [
      { title: 'Peças para clarificadoras e decanters', desc: 'Componentes de desgaste e selagem para linhas de bebidas.' },
      { title: 'Ajuste de turbidez', desc: 'Calibração da separação para o nível de clareza que o seu produto exige.' },
      { title: 'Revisão e balanceamento', desc: 'Bowl e rotor restaurados e balanceados para operação estável e silenciosa.' },
      { title: 'Recondicionamento', desc: 'Equipamento devolvido ao padrão de fábrica, pronto para linhas contínuas de envase.' }
    ],
    focus: [
      'Discos e superfícies de clarificação',
      'Ajuste de turbidez e de interface',
      'Vedações sanitárias',
      'Balanceamento do conjunto rotativo'
    ],
    faq: [
      { q: 'A centrífuga rende mais que a prensa na extração?', a: 'Em muitos casos sim. Decanters costumam recuperar mais mosto da mesma matéria prima, com produto mais limpo.' },
      { q: 'Serve para bebidas vegetais?', a: 'Sim. A separação contínua e higiênica atende formulações sensíveis e preserva os ingredientes.' },
      { q: 'Vocês ajustam o nível de clareza?', a: 'Sim, calibramos a separação e a interface para a turbidez desejada do seu produto.' }
    ]
  },
  {
    slug: 'marinha-e-naval',
    name: 'Marinha e Naval',
    short: 'Marinha e Naval',
    category: 'maritimo',
    icon: <Ship size={26} strokeWidth={1.6} />,
    eyebrow: 'Setor marítimo',
    heroTitle: 'Separadores marítimos e embarcados',
    heroLead: 'Limpeza de óleo combustível e lubrificante, remoção de cat fines e água, com peças de pronta entrega e suporte embarcado.',
    intro: 'A bordo não existe parada planejada. A Separi nasceu atendendo o setor naval e conhece a fundo os separadores de óleo combustível e lubrificante embarcados, que protegem o motor principal e os geradores contra os contaminantes mais agressivos que existem no mar.',
    process: [
      { title: 'Tratamento do combustível', text: 'O separador purifica o combustível antes do motor, retirando água e partículas. O alvo principal são os cat fines, finos de catalisador que provocam desgaste abrasivo severo e estão entre as maiores causas de falha de motor marítimo.' },
      { title: 'Purificação do lubrificante', text: 'O mesmo equipamento limpa o óleo lubrificante, atuando como purificador ou clarificador, e protege geradores e mancais. Também trata a água de porão acumulada na embarcação.' },
      { title: 'Combustíveis novos', text: 'VLSFO, destilados e misturas com biocombustível exigem separadores prontos para essa realidade. A separação que se ajusta sozinha à densidade do óleo mantém a eficiência sem intervenção constante.' }
    ],
    challenges: [
      { title: 'Cat fines destruindo o motor', desc: 'Finos de catalisador no combustível causam desgaste abrasivo e falhas caríssimas quando não são removidos.' },
      { title: 'Água no óleo', desc: 'Condensação e infiltração contaminam combustível e lubrificante e ameaçam motor e geradores.' },
      { title: 'Sem peça, navio parado', desc: 'Embarcação em rota não espera importação demorada. A peça certa precisa estar disponível.' }
    ],
    delivers: [
      { title: 'Peças com pronta entrega', desc: 'Estoque consolidado para purificadores e clarificadores marítimos, encurtando o tempo de espera.' },
      { title: 'Recondicionamento de purificadores', desc: 'Revisão completa, balanceamento e teste antes do retorno à embarcação.' },
      { title: 'Suporte embarcado', desc: 'Equipe com experiência a bordo e logística pensada para navios em operação.' },
      { title: 'Bowls de troca', desc: 'Programa de troca para manter a operação enquanto o seu bowl é recuperado.' }
    ],
    focus: [
      'Discos e superfícies expostas aos cat fines',
      'Disco de gravidade e selo de água corretos',
      'Vedações e sistema de descarga',
      'Rolamentos e eixo'
    ],
    faq: [
      { q: 'Vocês entendem a urgência de navio parado?', a: 'Sim. Trabalhamos com estoque e logística voltados ao tempo curto da operação naval, justamente porque a Separi começou nesse setor.' },
      { q: 'Atendem purificador e clarificador de combustível e lubrificante?', a: 'Sim, das principais marcas, com peças, recondicionamento e bowls de troca.' },
      { q: 'A máquina serve para os combustíveis novos?', a: 'Sim. Os separadores tratam VLSFO, destilados e misturas com biocombustível, ajustando a separação à densidade do óleo.' }
    ]
  },
  {
    slug: 'oleos',
    name: 'Óleos',
    short: 'Óleos',
    category: 'energia',
    icon: <Leaf size={26} strokeWidth={1.6} />,
    eyebrow: 'Setor de energia',
    heroTitle: 'Biodiesel, óleos vegetais e resíduos',
    heroLead: 'Separação contínua na produção de biodiesel e no aproveitamento de óleos residuais, transformando resíduo em matéria prima.',
    intro: 'A produção de biocombustível castiga o equipamento com meios quimicamente agressivos e operação contínua. A centrífuga é o que separa as fases, ajuda a atingir a especificação e transforma resíduo em matéria prima de valor.',
    process: [
      { title: 'Separação no biodiesel', text: 'A transesterificação de óleos vegetais ou gorduras gera biodiesel com glicerina como subproduto. A centrífuga separa essas fases e a água de lavagem, ajudando o produto a alcançar a especificação exigida para uso em motores.' },
      { title: 'Aproveitamento de resíduos', text: 'Decanters de três fases processam óleo de cozinha usado, sebo e gordura de caixa, separando ao mesmo tempo sólidos, água e óleo. É assim que o resíduo volta para a cadeia como matéria prima.' },
      { title: 'Refino de óleos vegetais', text: 'Em rotas de óleo vegetal, separadoras fazem degomagem, neutralização e lavagem, etapas que costumam ser o coração da linha de refino.' }
    ],
    challenges: [
      { title: 'Emulsão que trava a separação', desc: 'Sabão e água formam uma camada emulsionada difícil de quebrar quando o processo não está afinado.' },
      { title: 'Sólidos abrasivos', desc: 'Resíduos e particulados aceleram o desgaste de bowl e de decanter.' },
      { title: 'Operação sem trégua', desc: 'Plantas de biocombustível rodam de forma contínua, então disponibilidade é tudo.' }
    ],
    delivers: [
      { title: 'Peças para separadoras e decanters', desc: 'Componentes resistentes ao meio do processo.' },
      { title: 'Ajuste para meios agressivos', desc: 'Vedações e materiais adequados à química do biodiesel.' },
      { title: 'Recondicionamento com foco em desgaste', desc: 'Recuperação atenta às partes que mais sofrem nessa aplicação.' },
      { title: 'Plano para operação contínua', desc: 'Manutenção preventiva e bowls de troca pensados para plantas que rodam o tempo todo.' }
    ],
    focus: [
      'Estado das vedações frente à química do processo',
      'Componentes de desgaste do decanter, rosca e bowl',
      'Ajuste de interface e de fases',
      'Balanceamento e rolamentos'
    ],
    faq: [
      { q: 'A centrífuga ajuda a bater a especificação do biodiesel?', a: 'Sim. A separação das fases e da água de lavagem é parte do que leva o produto à especificação para uso em motores.' },
      { q: 'Dá para processar óleo de cozinha usado?', a: 'Sim. Decanters de três fases separam sólidos, água e óleo desse resíduo, recuperando o óleo como matéria prima.' },
      { q: 'Como lidam com a emulsão da lavagem?', a: 'Ajustamos a separação e os parâmetros para quebrar a camada emulsionada e mantemos os componentes em ordem para isso.' }
    ]
  },
  {
    slug: 'farmaceutica',
    name: 'Farmacêutica e Biopharma',
    short: 'Farmacêutica',
    category: 'pharma',
    icon: <FlaskConical size={26} strokeWidth={1.6} />,
    eyebrow: 'Setor farmacêutico',
    heroTitle: 'Farmacêutica e biopharma',
    heroLead: 'Colheita de células, clarificação de caldo e recuperação de proteínas com separação suave e em conformidade com boas práticas.',
    intro: 'No ambiente farmacêutico e de biotecnologia, rastreabilidade, conformidade e integridade do produto não se negociam. A centrífuga participa de etapas em que uma única batelada perdida custa caro, então o equipamento precisa separar com delicadeza e operar dentro dos padrões regulatórios.',
    process: [
      { title: 'Colheita de células', text: 'Separadoras herméticas colhem células de cultura, microbianas ou proteínas precipitadas de forma suave. O cuidado evita a ruptura das células e a captação de ar, o que facilita e barateia as etapas seguintes de purificação.' },
      { title: 'Clarificação do caldo', text: 'A separação clarifica o caldo de fermentação e remove restos celulares, entregando um líquido limpo para o processo a jusante.' },
      { title: 'Conformidade e limpeza', text: 'Materiais e acabamentos atendem às exigências do setor, e os sistemas de limpeza e esterilização no local mantêm a higiene sem desmontagem complicada.' }
    ],
    challenges: [
      { title: 'Ruptura de células e contaminação', desc: 'Separação agressiva rompe células sensíveis e pode comprometer toda a batelada.' },
      { title: 'Conformidade regulatória', desc: 'Equipamento e processo precisam atender às boas práticas e à documentação exigida.' },
      { title: 'Rastreabilidade', desc: 'Cada intervenção precisa ficar documentada para sustentar auditoria.' }
    ],
    delivers: [
      { title: 'Peças e vedações compatíveis', desc: 'Componentes que atendem aos requisitos de higiene e regulatórios do setor.' },
      { title: 'Recondicionamento documentado', desc: 'Revisão com registro fotográfico de cada etapa para sustentar a rastreabilidade.' },
      { title: 'Cuidado com a separação suave', desc: 'Ajuste para preservar a integridade das células e a qualidade do produto.' },
      { title: 'Relatório técnico completo', desc: 'Documentação detalhada do serviço para auditoria e histórico do equipamento.' }
    ],
    focus: [
      'Vedações e materiais em contato com o produto',
      'Integridade do conjunto hermético',
      'Sistemas de limpeza e esterilização',
      'Balanceamento e suavidade da aceleração'
    ],
    faq: [
      { q: 'O recondicionamento atende às boas práticas?', a: 'Sim. Respeitamos materiais, acabamentos e documentação compatíveis com a exigência do setor, com relatório técnico.' },
      { q: 'A separação preserva células sensíveis?', a: 'Esse é o foco. Cuidamos do conjunto hermético e do ajuste para uma separação suave, reduzindo a ruptura celular.' },
      { q: 'Vocês fornecem documentação para auditoria?', a: 'Sim, com registro fotográfico e técnico de cada etapa do serviço.' }
    ]
  },
  {
    slug: 'oleo-e-gas',
    name: 'Óleo e Gás',
    short: 'Óleo e Gás',
    category: 'energia',
    icon: <Flame size={26} strokeWidth={1.6} />,
    eyebrow: 'Setor de energia',
    heroTitle: 'Óleo e gás',
    heroLead: 'Purificação de óleo de turbina, polimento de combustível e tratamento de derivados, com confiabilidade em ambientes críticos.',
    intro: 'Do óleo de turbina ao tratamento de derivados, a separação centrífuga é o que mantém o fluido dentro da especificação e o equipamento protegido. No setor de óleo e gás, confiabilidade e segurança em ambientes críticos definem o jogo.',
    process: [
      { title: 'Purificação do óleo de turbina', text: 'A centrífuga remove água livre e sedimento do óleo de turbina de forma contínua. Água no óleo reduz a vida dos mancais, acelera a oxidação e forma borra, por isso a purificação protege diretamente o equipamento.' },
      { title: 'Tratamento de combustível e derivados', text: 'A máquina faz o polimento do diesel armazenado, que acumula água de condensação e borra de tanque, e trata derivados em etapas de refino.' },
      { title: 'Separação a quente', text: 'Pré aquecer o óleo reduz a viscosidade e melhora a separação, em especial nos óleos mais pesados. É um detalhe que faz diferença no resultado.' }
    ],
    challenges: [
      { title: 'Água e sedimento no óleo de turbina', desc: 'A contaminação degrada o óleo e ataca os mancais de equipamentos caríssimos.' },
      { title: 'Borra e água no diesel', desc: 'Combustível armazenado junta água e borra que precisam sair antes do uso.' },
      { title: 'Ambiente crítico', desc: 'Operações de refino e offshore não toleram falha nem improviso.' }
    ],
    delivers: [
      { title: 'Peças para purificadores', desc: 'Componentes de desgaste e selagem para purificadores de óleo de turbina e combustível.' },
      { title: 'Recondicionamento com teste', desc: 'Revisão completa, balanceamento e teste de bancada antes da devolução.' },
      { title: 'Suporte a operação contínua', desc: 'Atendimento pensado para plantas que não podem parar.' },
      { title: 'Bowls de troca', desc: 'Programa de troca para manter o tratamento do óleo durante a revisão.' }
    ],
    focus: [
      'Disco de gravidade e selo de água',
      'Temperatura de separação estável',
      'Vedações e descarga',
      'Rolamentos e balanceamento'
    ],
    faq: [
      { q: 'A centrífuga remove água emulsionada?', a: 'A separação remove muito bem a água livre e o sedimento. Água fortemente emulsionada pode pedir um tratamento complementar, e orientamos sobre isso.' },
      { q: 'Por que pré aquecer o óleo?', a: 'Aquecer reduz a viscosidade e melhora a separação, principalmente em óleos mais pesados.' },
      { q: 'Atendem purificadores em planta e offshore?', a: 'Sim, com peças, recondicionamento e bowls de troca para manter a operação.' }
    ]
  },
  {
    slug: 'mineracao',
    name: 'Mineração e Metais',
    short: 'Mineração',
    category: 'industrial',
    icon: <Pickaxe size={26} strokeWidth={1.6} />,
    eyebrow: 'Setor industrial',
    heroTitle: 'Mineração e metais',
    heroLead: 'Desidratação de polpas, concentração mineral e tratamento de efluentes com equipamentos preparados para o desgaste.',
    intro: 'Polpa mineral é abrasiva e implacável com o equipamento. O decanter é o cavalo de batalha da separação de sólidos e líquidos no setor, e manter esse equipamento em operação exige componentes resistentes e manutenção que se antecipa à falha.',
    process: [
      { title: 'Desidratação de polpas', text: 'O decanter separa de forma contínua os sólidos do líquido em polpas com alta carga de sólidos, viabilizando concentração e desidratação. O resultado é uma torta mais seca e um líquido clarificado de volta ao processo.' },
      { title: 'Tratamento de efluentes', text: 'O mesmo equipamento clarifica águas de processo e efluentes, recuperando água e reduzindo o volume a ser descartado.' },
      { title: 'Convivência com a abrasão', text: 'Como o meio é muito abrasivo, esses processos pedem componentes resistentes ao desgaste e um plano de manutenção que troque a peça antes que ela falhe.' }
    ],
    challenges: [
      { title: 'Desgaste abrasivo acelerado', desc: 'A polpa consome rapidamente a rosca e as superfícies de trabalho do decanter.' },
      { title: 'Alta carga de sólidos', desc: 'Volumes elevados de sólidos exigem máquina bem dimensionada e ajustada.' },
      { title: 'Exigência ambiental', desc: 'A clarificação de efluentes tem regra cada vez mais rígida a cumprir.' }
    ],
    delivers: [
      { title: 'Peças resistentes ao desgaste', desc: 'Componentes para a rosca e o bowl, que são as partes que mais sofrem.' },
      { title: 'Recondicionamento focado em desgaste', desc: 'Recuperação atenta às superfícies de maior desgaste do decanter.' },
      { title: 'Ajuste para torta mais seca', desc: 'Calibração para a secura de torta e a clareza de líquido que o processo precisa.' },
      { title: 'Suporte a efluentes', desc: 'Apoio aos equipamentos de tratamento de águas de processo.' }
    ],
    focus: [
      'Proteção de desgaste da rosca e do bowl',
      'Ajuste de profundidade de poço e torque',
      'Rolamentos e caixa de redução',
      'Balanceamento do conjunto'
    ],
    faq: [
      { q: 'O decanter aguenta polpa muito abrasiva?', a: 'Sim, com a proteção de desgaste certa nos componentes. Por isso a manutenção preventiva e a troca antecipada de peça são tão importantes nesse setor.' },
      { q: 'Dá para deixar a torta mais seca?', a: 'Sim. Ajustamos parâmetros como profundidade de poço e diferencial para buscar a secura desejada.' },
      { q: 'Vocês recuperam a água do processo?', a: 'A clarificação devolve um líquido mais limpo ao processo, ajudando na recuperação de água e na redução de descarte.' }
    ]
  },
  {
    slug: 'geracao-de-energia',
    name: 'Geração de Energia',
    short: 'Geração de Energia',
    category: 'energia',
    icon: <Lightbulb size={26} strokeWidth={1.6} />,
    eyebrow: 'Setor de energia',
    heroTitle: 'Geração de energia',
    heroLead: 'Ciclo do óleo de turbina, polimento de diesel de emergência e suporte a biomassa e cogeração, com alta disponibilidade.',
    intro: 'Em geração de energia, disponibilidade é tudo. A centrífuga mantém o ciclo do óleo de turbina e os sistemas de separação rodando com confiabilidade, em usinas térmicas, de biomassa e de cogeração.',
    process: [
      { title: 'Ciclo do óleo de turbina', text: 'O purificador mantém o óleo de turbina dentro da especificação, removendo água e sedimento de forma contínua e protegendo os mancais. Isso evita falhas caras e paradas não programadas.' },
      { title: 'Diesel de emergência', text: 'A centrífuga faz o polimento do diesel dos geradores de emergência, que precisa estar limpo no instante em que for acionado.' },
      { title: 'Biomassa e cogeração', text: 'Os mesmos equipamentos apoiam os sistemas de separação de plantas de biomassa e de cogeração, onde a parada também sai caro.' }
    ],
    challenges: [
      { title: 'Contaminação do óleo de turbina', desc: 'Água e sedimento degradam o óleo e ameaçam os mancais.' },
      { title: 'Disponibilidade', desc: 'Geração não pode parar, então o equipamento de separação precisa estar sempre pronto.' },
      { title: 'Revisão longa', desc: 'Revisões demoradas tiram a máquina de operação por tempo demais.' }
    ],
    delivers: [
      { title: 'Peças para purificadores', desc: 'Componentes de desgaste e selagem para purificadores de óleo de turbina e combustível.' },
      { title: 'Bowls de troca', desc: 'Trocamos o bowl por um de estoque enquanto recuperamos o seu, evitando parada longa.' },
      { title: 'Recondicionamento com teste', desc: 'Revisão completa e teste de bancada antes da devolução.' },
      { title: 'Plano preventivo', desc: 'Manutenção programada para manter a alta disponibilidade.' }
    ],
    focus: [
      'Disco de gravidade e selo de água',
      'Temperatura de separação',
      'Vedações e descarga',
      'Rolamentos e balanceamento'
    ],
    faq: [
      { q: 'Como evitar parada longa na revisão?', a: 'Com o programa de bowls de troca. Instalamos um bowl de estoque enquanto recuperamos o seu, e a usina segue operando.' },
      { q: 'O purificador protege os mancais?', a: 'Sim. Ao remover água e sedimento do óleo continuamente, ele protege os mancais e prolonga a vida do óleo.' },
      { q: 'Atendem diesel de geradores de emergência?', a: 'Sim, com o polimento que mantém o diesel pronto para o acionamento.' }
    ]
  },
  {
    slug: 'fluidos-industriais',
    name: 'Fluidos Industriais',
    short: 'Fluidos Industriais',
    category: 'industrial',
    icon: <Droplets size={26} strokeWidth={1.6} />,
    eyebrow: 'Setor industrial',
    heroTitle: 'Fluidos industriais',
    heroLead: 'Recuperação de óleos, remoção de tramp oil e separação química sob condições severas de vazão, pressão e temperatura.',
    intro: 'Muitos processos industriais dependem da separação contínua de fluidos para reaproveitar insumos e proteger equipamentos. Onde filtro e decantação não dão conta, a centrífuga resolve, com força milhares de vezes maior que a gravidade.',
    process: [
      { title: 'Recuperação de óleos e fluidos', text: 'A centrífuga separa fases imiscíveis quase na hora, o que viabiliza recuperar óleos de processo e remover o tramp oil de fluidos de corte e refrigerantes.' },
      { title: 'Separação química contínua', text: 'Onde a decantação levaria tempo demais, a separação centrífuga divide as fases de forma contínua, mantendo o processo fluindo.' },
      { title: 'Sólidos finos sob condição severa', text: 'Decanters lidam com alta vazão, pressão e temperatura e separam sólidos finos que o filtro não segura. É a escolha certa para aplicações fora do padrão.' }
    ],
    challenges: [
      { title: 'Condições severas', desc: 'Alta vazão, pressão e temperatura exigem equipamento robusto e bem mantido.' },
      { title: 'Sólidos finos', desc: 'Partículas que o filtro não retém precisam da força centrífuga para sair.' },
      { title: 'Recuperar em vez de descartar', desc: 'Reaproveitar o fluido de processo reduz custo e passivo ambiental.' }
    ],
    delivers: [
      { title: 'Avaliação de engenharia', desc: 'Análise técnica para aplicações fora do padrão dos demais setores.' },
      { title: 'Peças e recondicionamento', desc: 'Componentes e revisão para separadoras e decanters em serviço pesado.' },
      { title: 'Ajuste a meios severos', desc: 'Materiais e configuração adequados à temperatura e à química do processo.' },
      { title: 'Plano de manutenção', desc: 'Preventiva dimensionada para a severidade da sua operação.' }
    ],
    focus: [
      'Materiais frente à química e à temperatura',
      'Componentes de desgaste',
      'Ajuste de interface e fases',
      'Balanceamento e rolamentos'
    ],
    faq: [
      { q: 'Minha aplicação é fora do comum, vocês avaliam?', a: 'Sim. Fazemos avaliação de engenharia para casos fora do padrão e indicamos o caminho de separação mais adequado.' },
      { q: 'A centrífuga separa sólidos muito finos?', a: 'Sim. A força centrífuga separa partículas finas que filtros não retêm.' },
      { q: 'Dá para recuperar o fluido em vez de descartar?', a: 'Em muitos casos sim, e isso reduz custo e passivo ambiental.' }
    ]
  }
]

// Cores por categoria — PADRONIZADAS na identidade Separi (teal).
// Independente da aplicação, todas usam a mesma paleta da marca.
const SEPARI_CAT = { color: '#006260', bg: 'rgba(0,131,127,0.08)' }
export const CATEGORY_COLORS = {
  alimentar:  SEPARI_CAT,
  maritimo:   SEPARI_CAT,
  energia:    SEPARI_CAT,
  pharma:     SEPARI_CAT,
  industrial: SEPARI_CAT
}

export const CATEGORY_LABELS = {
  alimentar:  'Alimentar',
  maritimo:   'Marítimo',
  energia:    'Energia',
  pharma:     'Farma',
  industrial: 'Industrial'
}

export const getApplicationBySlug = (slug) =>
  APPLICATIONS.find((a) => a.slug === slug) || null

/* =========================================================================
   ENRIQUECIMENTO v50 — mídia real (imagens) + conteúdo técnico aprofundado
   sobre separadoras de discos e centrífugas decanter por setor.
   Mantido como exports separados para não alterar a estrutura acima.
   As imagens usam CDN da Unsplash (uso livre) e degradam para um
   placeholder elegante caso a URL falhe (ver componente AppImage).
   ========================================================================= */

/* Caminhos locais para as imagens de cada setor. São placeholders: enquanto o
   arquivo não existir em /public, a página mostra o caminho indicando onde a
   imagem deve entrar (mesmo padrão da Home e das páginas de produto). Basta
   soltar os arquivos correspondentes em /public/aplicacoes/. */
const APP_GALLERY = (slug) => [
  `/aplicacoes/${slug}-1.jpg`,
  `/aplicacoes/${slug}-2.jpg`
]

export const APP_MEDIA = {
  'laticinios':         { hero: `/aplicacoes/laticinios-hero.jpg`,         gallery: APP_GALLERY('laticinios') },
  'cervejarias':        { hero: `/aplicacoes/cervejarias-hero.jpg`,        gallery: APP_GALLERY('cervejarias') },
  'sumos-e-bebidas':    { hero: `/aplicacoes/sumos-e-bebidas-hero.jpg`,    gallery: APP_GALLERY('sumos-e-bebidas') },
  'marinha-e-naval':    { hero: `/aplicacoes/marinha-e-naval-hero.jpg`,    gallery: APP_GALLERY('marinha-e-naval') },
  'oleos':    { hero: `/aplicacoes/oleos-hero.jpg`,    gallery: APP_GALLERY('oleos') },
  'farmaceutica':       { hero: `/aplicacoes/farmaceutica-hero.jpg`,       gallery: APP_GALLERY('farmaceutica') },
  'oleo-e-gas':         { hero: `/aplicacoes/oleo-e-gas-hero.jpg`,         gallery: APP_GALLERY('oleo-e-gas') },
  'mineracao':          { hero: `/aplicacoes/mineracao-hero.jpg`,          gallery: APP_GALLERY('mineracao') },
  'geracao-de-energia': { hero: `/aplicacoes/geracao-de-energia-hero.jpg`, gallery: APP_GALLERY('geracao-de-energia') },
  'fluidos-industriais':{ hero: `/aplicacoes/fluidos-industriais-hero.jpg`,gallery: APP_GALLERY('fluidos-industriais') }
}

export const getAppMedia = (slug) => APP_MEDIA[slug] || { hero: '', gallery: [] }

// ───────── FOTOS DE SETOR (Pexels — livres, sem marca d'água) ─────────
// Para usar SUA foto: solte /public/aplicacoes/<slug>-hero.jpg (tem prioridade).
const SECTOR_PHOTO_ID = {
  'laticinios': 2889347,
  'cervejarias': 25858432,
  'sumos-e-bebidas': 18631424,
  'marinha-e-naval': 11820859,
  'oleos': 10407689,
  'farmaceutica': 9574573,
  'oleo-e-gas': 15970032,
  'mineracao': 5505961,
  'geracao-de-energia': 18334961,
  'fluidos-industriais': 13974251
}
export const getSectorPhoto = (slug, w = 900) => {
  const id = SECTOR_PHOTO_ID[slug]
  return id
    ? `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`
    : ''
}

// ───────── VÍDEO DE SETOR (banco de vídeos / arquivo local) ─────────
// Hero das aplicações usa um vídeo de fundo. Solte o arquivo em
// /public/aplicacoes/<slug>.mp4 e ele entra automaticamente; enquanto
// não existir, o hero usa a foto do setor com leve animação (poster).
export const getSectorVideo = (slug) => `/aplicacoes/${slug}.mp4`

/* Conteúdo técnico aprofundado: que tipo de separadora/centrífuga atua em
   cada setor, princípio de funcionamento e pontos de desgaste. */
export const APP_EQUIPMENT = {
  'laticinios': {
    lead: 'No laticínio a estrela é a separadora de discos de alta rotação. Foi para desnatar leite que Gustaf de Laval criou a separadora moderna, e até hoje é ela que define rendimento de creme e segurança sanitária.',
    items: [
      { type: 'Separadora de discos', title: 'Desnatadeira / clarificadora autolimpante', desc: 'Pilha de discos cônicos girando em alta rotação separa creme do leite desnatado e remove o sedimento natural. Em máquinas autolimpantes, os sólidos são ejetados sem parar a linha. Atinge clarificação fina, abaixo de 1 micron.' },
      { type: 'Separadora de discos', title: 'Recuperação de soro', desc: 'Separadoras dedicadas recuperam gordura e proteína do soro de queijo, viabilizando iogurte grego, quark e queijo fresco com limpeza CIP integrada.' }
    ]
  },
  'cervejarias': {
    lead: 'Na cervejaria entra a separadora de discos hermética, projetada para clarificar com mínima captação de oxigênio — o fator que mais protege aroma e estabilidade da cerveja.',
    items: [
      { type: 'Separadora de discos', title: 'Clarificadora hermética', desc: 'Remove levedura e trub da cerveja verde e do mosto antes da filtração. A vedação hermética com barreira de gás mantém o O₂ baixíssimo, preservando o sabor.' },
      { type: 'Separadora de discos', title: 'Recuperação de levedura', desc: 'Calibrada para recuperar fermento ativo com qualidade de reuso, reduzindo descarte e custo de levedura entre bateladas.' }
    ]
  },
  'sumos-e-bebidas': {
    lead: 'Sucos, vinhos e bebidas vegetais combinam dois mundos: a separadora de discos para clarificação fina e o decanter para extração de alto rendimento.',
    items: [
      { type: 'Separadora de discos', title: 'Clarificadora / polidora', desc: 'Controla a turbidez de sucos e néctares e dá o polimento final antes do envase, preservando cor e aroma com separação delicada.' },
      { type: 'Centrífuga decanter', title: 'Extração de mosto e vinho', desc: 'O decanter de rosca extrai mosto com rendimento superior às prensas, operando em fluxo contínuo e recuperando mais produto da mesma matéria-prima.' }
    ]
  },
  'marinha-e-naval': {
    lead: 'A bordo, a separadora de discos é equipamento de segurança: purifica combustível e óleo lubrificante antes que cheguem ao motor principal.',
    items: [
      { type: 'Separadora de discos', title: 'Purificador (purifier)', desc: 'Remove água e cat fines (partículas abrasivas de catalisador) do óleo combustível pesado. A operação contínua protege bombas injetoras e o motor principal.' },
      { type: 'Separadora de discos', title: 'Clarificador (clarifier)', desc: 'Estágio final que retira os sólidos remanescentes do óleo lubrificante, prolongando a vida útil do motor e dos mancais.' }
    ]
  },
  'oleos': {
    lead: 'A produção de biodiesel usa duas tecnologias: separadoras de discos para lavar e purificar o éster e decanters para lidar com a carga sólida das gorduras residuais.',
    items: [
      { type: 'Separadora de discos', title: 'Purificação do biodiesel', desc: 'Separa glicerina, água de lavagem e impurezas do éster metílico em fluxo contínuo, entregando combustível dentro de especificação.' },
      { type: 'Centrífuga decanter', title: 'Pré-tratamento de gorduras residuais', desc: 'Decanters de duas e três fases tratam óleos de fritura e gorduras animais com alto teor de sólidos, fazendo a desidratação inicial da matéria-prima.' }
    ]
  },
  'farmaceutica': {
    lead: 'A indústria farmacêutica exige separação estéril e rastreável. Aqui atuam separadoras de discos sanitárias e, para volumes menores e alta pureza, centrífugas tubulares e de câmara.',
    items: [
      { type: 'Separadora de discos', title: 'Clarificação de caldo fermentado', desc: 'Separadoras autolimpantes de projeto sanitário clarificam caldos de fermentação e recuperam biomassa em condições BPF/GMP, com vedações compatíveis com CIP/SIP.' },
      { type: 'Centrífuga tubular', title: 'Concentração de alta pureza', desc: 'Para lotes pequenos e produtos de alto valor, a centrífuga tubular atinge G-force elevadíssima, ideal para concentrar finos e separar fases de difícil quebra.' }
    ]
  },
  'oleo-e-gas': {
    lead: 'No óleo e gás a separação enfrenta vazão, pressão e temperatura altas. Combinam-se purificadores de discos e decanters robustos de três fases.',
    items: [
      { type: 'Separadora de discos', title: 'Tratamento de óleo e desidratação', desc: 'Purificadores de discos removem água e sólidos finos do óleo em refino e operações offshore, protegendo equipamentos a jusante.' },
      { type: 'Centrífuga decanter', title: 'Separação de três fases', desc: 'Decanters separam óleo, água e borra simultaneamente no tratamento de tanques, slop oil e efluentes oleosos, com alta capacidade de sólidos.' }
    ]
  },
  'mineracao': {
    lead: 'A mineração trabalha com alto teor de sólidos e abrasão — terreno do decanter (solid bowl), construído para desidratar polpas continuamente.',
    items: [
      { type: 'Centrífuga decanter', title: 'Desidratação de polpas e concentrados', desc: 'O decanter de tambor horizontal com rosca transportadora lida com até ~50% de sólidos em volume, desaguando concentrados e rejeitos em regime contínuo.' },
      { type: 'Centrífuga decanter', title: 'Tratamento de efluentes', desc: 'Clarifica água de processo e espessa lamas minerais, com componentes resistentes à abrasão (rosca revestida em tungstênio) para prolongar a vida útil.' }
    ]
  },
  'geracao-de-energia': {
    lead: 'Em usinas, a separadora de discos cuida do óleo que mantém turbinas e geradores girando — um trabalho silencioso, mas crítico para a disponibilidade da planta.',
    items: [
      { type: 'Separadora de discos', title: 'Condicionamento de óleo de turbina', desc: 'Purificadores removem água e partículas do óleo lubrificante e hidráulico de turbinas a vapor e gás, evitando verniz e falha de mancais.' },
      { type: 'Separadora de discos', title: 'Tratamento de óleo combustível', desc: 'Em termelétricas e cogeração, clarificadores tratam o óleo combustível pesado antes da queima, garantindo combustão estável.' }
    ]
  },
  'fluidos-industriais': {
    lead: 'Fluidos industriais pedem versatilidade: separadoras de discos para óleos e coolants finos, decanters quando a carga de sólidos é alta.',
    items: [
      { type: 'Separadora de discos', title: 'Recuperação de óleos e coolants', desc: 'Separadoras clarificam fluidos de corte, óleos solúveis e coolants, removendo finos e tramp oil para estender a vida do fluido e reduzir descarte.' },
      { type: 'Centrífuga decanter', title: 'Tratamento de efluentes industriais', desc: 'Decanters desidratam lamas e clarificam efluentes de alto teor de sólidos sob condições de alta vazão, pressão e temperatura.' }
    ]
  }
}

export const getAppEquipment = (slug) => APP_EQUIPMENT[slug] || null

/* =========================================================================
   v65 — MARCAS E MODELOS ATENDIDOS POR SEGMENTO
   Lista enxuta de marcas e modelos efetivamente atendidos em cada setor,
   para exibir em "Segmentos atendidos". Conteúdo estático de marketing.
   ========================================================================= */
export const APP_BRANDS = {
  'laticinios': [
    { brand: 'Alfa Laval',   models: ['MRPX 518 HGV', 'MRPX 418 TGV', 'BRPX 213', 'HMRPX 714', 'Clara 80'] },
    { brand: 'GEA Westfalia', models: ['MSD 300', 'MSE 300', 'OSC 60', 'KDB 30'] },
    { brand: 'Tetra Pak',     models: ['Tetra Centri H214', 'Tetra Centri C214'] },
    { brand: 'Seital',        models: ['SE 40', 'SE 80'] }
  ],
  'cervejarias': [
    { brand: 'Alfa Laval',   models: ['BRPX 213', 'Clara 20', 'Clara 80'] },
    { brand: 'GEA Westfalia', models: ['OSC 60', 'GSC 30', 'CFA 200'] },
    { brand: 'Tetra Pak',     models: ['Tetra Centri H214'] }
  ],
  'sumos-e-bebidas': [
    { brand: 'Alfa Laval',   models: ['Clara 20', 'MRPX 314', 'NX 314'] },
    { brand: 'GEA Westfalia', models: ['SB 14', 'GSE 60', 'CA 226'] },
    { brand: 'Pieralisi',     models: ['FPC 25', 'Jumbo 3'] }
  ],
  'marinha-e-naval': [
    { brand: 'Alfa Laval',   models: ['LOPX 707', 'MOPX 207', 'FOPX 610', 'S 815', 'P 615'] },
    { brand: 'GEA Westfalia', models: ['OSA 7', 'OSD 18', 'OSE 20'] },
    { brand: 'Mitsubishi (MKK)', models: ['SJ 700', 'SJ 1000'] }
  ],
  'oleos': [
    { brand: 'Alfa Laval',   models: ['MOPX 207', 'FOPX 610', 'NX 418'] },
    { brand: 'GEA Westfalia', models: ['OSE 80', 'SC 50', 'UCD 305'] },
    { brand: 'Pieralisi',     models: ['FPC 25', 'Baby 3'] }
  ],
  'farmaceutica': [
    { brand: 'Alfa Laval',   models: ['BTPX 205', 'Culturefuge 100'] },
    { brand: 'GEA Westfalia', models: ['CSC 6', 'CTC 1'] },
    { brand: 'Seital',        models: ['SE 20 BP'] }
  ],
  'oleo-e-gas': [
    { brand: 'Alfa Laval',   models: ['S 946', 'P 626', 'NX 944'] },
    { brand: 'GEA Westfalia', models: ['OSE 220', 'CF 6000', 'UCD 343'] },
    { brand: 'Flottweg',      models: ['Z6E', 'Tricanter Z4E'] }
  ],
  'mineracao': [
    { brand: 'GEA Westfalia', models: ['SC 50', 'CB 505', 'UCD 305'] },
    { brand: 'Flottweg',      models: ['Z8E', 'Z6E', 'C7E'] },
    { brand: 'Alfa Laval',    models: ['NX 944', 'NX 738'] }
  ],
  'geracao-de-energia': [
    { brand: 'Alfa Laval',   models: ['MOPX 207', 'P 605', 'S 815'] },
    { brand: 'GEA Westfalia', models: ['OSA 20', 'OSE 40', 'OTC 3'] },
    { brand: 'Mitsubishi (MKK)', models: ['SJ 700'] }
  ],
  'fluidos-industriais': [
    { brand: 'Alfa Laval',   models: ['MAB 103', 'MAB 104', 'MMB 304', 'NX 314'] },
    { brand: 'GEA Westfalia', models: ['OTC 2', 'CA 226', 'CB 505'] },
    { brand: 'Flottweg',      models: ['Z4E', 'C4E'] }
  ]
}
export const getAppBrands = (slug) => APP_BRANDS[slug] || []

/* Cruza um FABRICANTE (nome do catálogo) com os SETORES atendidos.
   Para a tela do fabricante: lista cada segmento em que a marca aparece,
   com a foto do setor, o link para a página do setor e os modelos
   daquele fabricante naquele segmento. Casamento por token (case-insensitive),
   tolerante a sufixos como "Seital (SPX FLOW)" ou "Mitsubishi (Selfjector)". */
const _norm = (s = '') =>
  s.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function getSectorsForBrand(brandName = '') {
  const token = _norm(brandName).replace(/\(.*?\)/g, '').trim().split(/\s+/)[0] || ''
  if (!token) return []
  const out = []
  APPLICATIONS.forEach((app) => {
    const rows = APP_BRANDS[app.slug] || []
    const hit = rows.find((r) => {
      const b = _norm(r.brand)
      return b.includes(token) || token.includes(b.split(/\s+/)[0])
    })
    if (hit && hit.models?.length) {
      out.push({
        slug: app.slug,
        name: app.name,
        short: app.short || app.name,
        photo: getSectorPhoto(app.slug, 600),
        models: hit.models
      })
    }
  })
  return out
}
