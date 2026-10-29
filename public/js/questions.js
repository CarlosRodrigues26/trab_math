const PA_QUESTIONS = [
  {
    id: 1,
    difficulty: "Fácil",
    statement: "Qual das sequências abaixo é uma progressão aritmética (PA)?",
    options: [
      "2, 5, 8, 11, ...",
      "1, 2, 4, 8, ...",
      "3, 3, 6, 9, ...",
      "10, 7, 3, -2, ...",
    ],
    correctIndex: 0,
    explanation:
      "Para ser PA, a diferença entre termos consecutivos deve ser constante.\n" +
      "Na sequência 2, 5, 8, 11:\n" +
      "5 - 2 = 3, 8 - 5 = 3, 11 - 8 = 3.\n" +
      "A razão é constante (r = 3).\n" +
      "Resposta correta: 2, 5, 8, 11, ...",
  },
  {
    id: 2,
    difficulty: "Fácil",
    statement: "Na PA (12, 17, 22, 27, ...), qual é a razão r?",
    options: ["r = 4", "r = 5", "r = 6", "r = -5"],
    correctIndex: 1,
    explanation:
      "A razão é a diferença entre dois termos consecutivos:\n" +
      "r = a2 - a1 = 17 - 12 = 5.\n" +
      "Conferindo: 22 - 17 = 5 e 27 - 22 = 5.\n" +
      "Resposta correta: r = 5.",
  },
  {
    id: 3,
    difficulty: "Fácil",
    statement: "A sequência (30, 24, 18, 12, ...) é classificada como:",
    options: ["PA crescente", "PA decrescente", "PA constante", "Não é PA"],
    correctIndex: 1,
    explanation:
      "Calculando a razão: 24 - 30 = -6, 18 - 24 = -6, 12 - 18 = -6.\n" +
      "A razão é constante e negativa.\n" +
      "Logo, é uma PA decrescente.",
  },
  {
    id: 4,
    difficulty: "Fácil",
    statement: "Qual é o próximo termo da PA (-4, -1, 2, 5, ...)?",
    options: ["6", "7", "8", "9"],
    correctIndex: 2,
    explanation:
      "A razão é r = -1 - (-4) = 3.\n" +
      "Somando 3 ao último termo conhecido:\n" +
      "5 + 3 = 8.\n" +
      "Resposta correta: 8.",
  },
  {
    id: 5,
    difficulty: "Médio",
    statement: "Na PA com a1 = 7 e r = 4, qual é a fórmula do termo geral an?",
    options: ["an = 7 + 4n", "an = 4n + 3", "an = 7n + 4", "an = 3n + 4"],
    correctIndex: 1,
    explanation:
      "Usamos an = a1 + (n - 1)r.\n" +
      "an = 7 + (n - 1)4\n" +
      "an = 7 + 4n - 4\n" +
      "an = 4n + 3.\n" +
      "Resposta correta: an = 4n + 3.",
  },
  {
    id: 6,
    difficulty: "Médio",
    statement: "Na PA (5, 9, 13, 17, ...), qual é o 12º termo?",
    options: ["45", "47", "49", "51"],
    correctIndex: 2,
    explanation:
      "Temos a1 = 5 e r = 4.\n" +
      "an = a1 + (n - 1)r\n" +
      "a12 = 5 + (12 - 1)4\n" +
      "a12 = 5 + 44 = 49.\n" +
      "Resposta correta: 49.",
  },
  {
    id: 7,
    difficulty: "Médio",
    statement:
      "Uma PA tem razão r = 3 e 8º termo igual a 31. Qual é o primeiro termo a1?",
    options: ["8", "9", "10", "11"],
    correctIndex: 2,
    explanation:
      "Usamos a8 = a1 + (8 - 1)3.\n" +
      "31 = a1 + 21\n" +
      "a1 = 31 - 21\n" +
      "a1 = 10.\n" +
      "Resposta correta: 10.",
  },
  {
    id: 8,
    difficulty: "Médio",
    statement:
      "Na PA em que a1 = 2, r = 4 e an = 38, quantos termos essa PA possui?",
    options: ["8 termos", "9 termos", "10 termos", "11 termos"],
    correctIndex: 2,
    explanation:
      "Aplicamos an = a1 + (n - 1)r.\n" +
      "38 = 2 + (n - 1)4\n" +
      "38 = 2 + 4n - 4\n" +
      "38 = 4n - 2\n" +
      "40 = 4n\n" +
      "n = 10.\n" +
      "Resposta correta: 10 termos.",
  },
  {
    id: 9,
    difficulty: "Médio",
    statement:
      "Em um teatro, a primeira fileira tem 18 lugares e cada fileira seguinte tem 2 lugares a mais. Quantos lugares há na 6ª fileira?",
    options: ["26", "27", "28", "30"],
    correctIndex: 2,
    explanation:
      "Temos a1 = 18 e r = 2.\n" +
      "a6 = a1 + (6 - 1)r\n" +
      "a6 = 18 + 5 x 2\n" +
      "a6 = 18 + 10\n" +
      "a6 = 28.\n" +
      "Resposta correta: 28 lugares.",
  },
  {
    id: 10,
    difficulty: "Médio",
    statement:
      "Qual é a soma dos 10 primeiros termos da PA (1, 4, 7, 10, ...)?",
    options: ["135", "140", "145", "150"],
    correctIndex: 2,
    explanation:
      "a1 = 1, r = 3 e n = 10.\n" +
      "Primeiro calculamos a10:\n" +
      "a10 = 1 + (10 - 1)3 = 1 + 27 = 28.\n" +
      "Agora usamos Sn = n(a1 + an)/2:\n" +
      "S10 = 10(1 + 28)/2\n" +
      "S10 = 10 x 29 / 2 = 145.\n" +
      "Resposta correta: 145.",
  },
  {
    id: 11,
    difficulty: "Difícil",
    statement: "A sequência (5, 5, 5, 5, ...) é:",
    options: [
      "PA crescente de razão 5",
      "PA decrescente de razão -5",
      "PA constante de razão 0",
      "Não é progressão aritmética",
    ],
    correctIndex: 2,
    explanation:
      "Diferenças consecutivas:\n" +
      "5 - 5 = 0, 5 - 5 = 0, 5 - 5 = 0.\n" +
      "A razão é constante e igual a zero.\n" +
      "Portanto, é uma PA constante de razão 0.",
  },
  {
    id: 12,
    difficulty: "Difícil",
    statement:
      "Em uma PA, a3 = 14 e a9 = 32. Qual alternativa traz corretamente a1 e r?",
    options: [
      "a1 = 6 e r = 4",
      "a1 = 8 e r = 3",
      "a1 = 10 e r = 2",
      "a1 = 5 e r = 3",
    ],
    correctIndex: 1,
    explanation:
      "Usamos a3 = a1 + 2r e a9 = a1 + 8r.\n" +
      "Subtraindo as equações:\n" +
      "(a1 + 8r) - (a1 + 2r) = 32 - 14\n" +
      "6r = 18 => r = 3.\n" +
      "Agora em a3:\n" +
      "14 = a1 + 2(3) => 14 = a1 + 6 => a1 = 8.\n" +
      "Resposta correta: a1 = 8 e r = 3.",
  },
  {
    id: 13,
    difficulty: "Difícil",
    statement:
      "Uma pessoa guarda R$ 200 no 1º mês e aumenta R$ 50 a cada mês. Qual é o total guardado nos 8 primeiros meses?",
    options: ["R$ 2.600", "R$ 2.800", "R$ 3.000", "R$ 3.200"],
    correctIndex: 2,
    explanation:
      "Os valores mensais formam uma PA com a1 = 200 e r = 50.\n" +
      "a8 = 200 + (8 - 1)50 = 200 + 350 = 550.\n" +
      "S8 = 8(a1 + a8)/2\n" +
      "S8 = 8(200 + 550)/2\n" +
      "S8 = 8 x 750 / 2 = 3000.\n" +
      "Resposta correta: R$ 3.000.",
  },
  {
    id: 14,
    difficulty: "Difícil",
    statement:
      "Na PA com a1 = 40 e r = -3, em que posição n aparece o termo 1?",
    options: ["n = 12", "n = 13", "n = 14", "n = 15"],
    correctIndex: 2,
    explanation:
      "Aplicamos an = a1 + (n - 1)r.\n" +
      "1 = 40 + (n - 1)(-3)\n" +
      "1 = 40 - 3n + 3\n" +
      "1 = 43 - 3n\n" +
      "3n = 42\n" +
      "n = 14.\n" +
      "Resposta correta: n = 14.",
  },
  {
    id: 15,
    difficulty: "Difícil",
    statement:
      "Uma PA possui 25 termos, com a1 = 6 e a25 = 78. Qual é a soma S25?",
    options: ["950", "1000", "1050", "1100"],
    correctIndex: 2,
    explanation:
      "Usamos Sn = n(a1 + an)/2.\n" +
      "S25 = 25(6 + 78)/2\n" +
      "S25 = 25 x 84 / 2\n" +
      "S25 = 25 x 42\n" +
      "S25 = 1050.\n" +
      "Resposta correta: 1050.",
  },
  {
    id: 16,
    difficulty: "Fácil",
    statement: "Qual é o próximo termo da PA (6, 11, 16, 21, ...)?",
    options: ["24", "25", "26", "27"],
    correctIndex: 2,
    explanation: "A razão é 5.\n" + "21 + 5 = 26.\n" + "Resposta correta: 26.",
  },
  {
    id: 17,
    difficulty: "Fácil",
    statement: "Se a1 = 3 e a4 = 15 em uma PA, qual é a razão r?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
    explanation:
      "a4 = a1 + 3r\n" +
      "15 = 3 + 3r\n" +
      "12 = 3r\n" +
      "r = 4.\n" +
      "Resposta correta: r = 4.",
  },
  {
    id: 18,
    difficulty: "Fácil",
    statement: "Qual das sequências abaixo é uma PA?",
    options: [
      "1, 2, 4, 8, ...",
      "1/2, 1, 3/2, 2, ...",
      "2, 4, 8, 16, ...",
      "3, 7, 11, 16, ...",
    ],
    correctIndex: 1,
    explanation:
      "Em 1/2, 1, 3/2, 2, ...:\n" +
      "1 - 1/2 = 1/2, 3/2 - 1 = 1/2, 2 - 3/2 = 1/2.\n" +
      "A razão é constante.\n" +
      "Resposta correta: 1/2, 1, 3/2, 2, ...",
  },
  {
    id: 19,
    difficulty: "Fácil",
    statement: "Na PA (8, 12, 16, 20, ...), qual é o 5º termo?",
    options: ["20", "22", "24", "28"],
    correctIndex: 2,
    explanation:
      "A razão é 4.\n" +
      "a5 = a1 + (5 - 1)r\n" +
      "a5 = 8 + 4 x 4 = 24.\n" +
      "Resposta correta: 24.",
  },
  {
    id: 20,
    difficulty: "Médio",
    statement: "Uma PA tem a1 = 5 e a7 = 29. Qual é a razão?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
    explanation:
      "a7 = a1 + 6r\n" +
      "29 = 5 + 6r\n" +
      "24 = 6r\n" +
      "r = 4.\n" +
      "Resposta correta: r = 4.",
  },
  {
    id: 21,
    difficulty: "Médio",
    statement: "Qual é a soma dos 6 primeiros termos da PA (4, 9, 14, ...)?",
    options: ["90", "95", "99", "105"],
    correctIndex: 2,
    explanation:
      "a1 = 4, r = 5 e a6 = 4 + 5 x 5 = 29.\n" +
      "S6 = 6(4 + 29)/2 = 6 x 33 / 2 = 99.\n" +
      "Resposta correta: 99.",
  },
  {
    id: 22,
    difficulty: "Médio",
    statement: "Na PA (100, 95, 90, 85, ...), qual é o 10º termo?",
    options: ["55", "60", "65", "70"],
    correctIndex: 0,
    explanation:
      "A razão é -5.\n" +
      "a10 = 100 + (10 - 1)(-5) = 100 - 45 = 55.\n" +
      "Resposta correta: 55.",
  },
  {
    id: 23,
    difficulty: "Médio",
    statement: "Na PA com a1 = -7 e r = 2, qual é o 12º termo?",
    options: ["15", "16", "17", "18"],
    correctIndex: 2,
    explanation:
      "a12 = -7 + (12 - 1)2\n" +
      "a12 = -7 + 22 = 15?\n" +
      "Vamos calcular corretamente: 11 x 2 = 22; -7 + 22 = 15.\n" +
      "Resposta correta: 15.",
  },
  {
    id: 24,
    difficulty: "Difícil",
    statement: "Uma PA tem a2 = 9 e a5 = 21. Qual é o primeiro termo a1?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    explanation:
      "a5 = a2 + 3r\n" +
      "21 = 9 + 3r\n" +
      "12 = 3r\n" +
      "r = 4.\n" +
      "a2 = a1 + r => 9 = a1 + 4\n" +
      "a1 = 5.\n" +
      "Resposta correta: 5.",
  },
  {
    id: 25,
    difficulty: "Difícil",
    statement: "Qual das sequências abaixo NÃO é uma PA?",
    options: [
      "2, 5, 8, 11, ...",
      "10, 7, 4, 1, ...",
      "3, 3, 3, 3, ...",
      "2, 4, 7, 11, ...",
    ],
    correctIndex: 3,
    explanation:
      "Nas outras alternativas, a diferença entre termos consecutivos é constante.\n" +
      "Em 2, 4, 7, 11, ... as diferenças são 2, 3, 4.\n" +
      "Não há razão constante.\n" +
      "Resposta correta: 2, 4, 7, 11, ...",
  },
  {
    id: 26,
    difficulty: "Difícil",
    statement: "Em uma PA, a1 = 3 e r = 2. Em que posição o termo 23 aparece?",
    options: ["10", "11", "12", "13"],
    correctIndex: 1,
    explanation:
      "23 = 3 + (n - 1)2\n" +
      "23 = 3 + 2n - 2\n" +
      "23 = 2n + 1\n" +
      "22 = 2n\n" +
      "n = 11.\n" +
      "Resposta correta: 11.",
  },
  {
    id: 27,
    difficulty: "Médio",
    statement:
      "Em um estacionamento, a primeira fileira tem 12 vagas e cada seguinte tem 3 vagas a mais. Quantas vagas há na 8ª fileira?",
    options: ["27", "30", "33", "36"],
    correctIndex: 2,
    explanation:
      "a1 = 12 e r = 3.\n" +
      "a8 = 12 + (8 - 1)3 = 12 + 21 = 33.\n" +
      "Resposta correta: 33.",
  },
  {
    id: 28,
    difficulty: "Médio",
    statement: "Na PA (18, 15, 12, ...), em que posição aparece o termo 0?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
    explanation:
      "A razão é -3.\n" +
      "0 = 18 + (n - 1)(-3)\n" +
      "0 = 18 - 3n + 3\n" +
      "3n = 21\n" +
      "n = 7.\n" +
      "Resposta correta: 7.",
  },
  {
    id: 29,
    difficulty: "Difícil",
    statement:
      "Qual é a soma dos 15 primeiros termos da PA (3, 7, 11, 15, ...)?",
    options: ["430", "450", "465", "480"],
    correctIndex: 2,
    explanation:
      "r = 4.\n" +
      "a15 = 3 + (15 - 1)4 = 3 + 56 = 59.\n" +
      "S15 = 15(3 + 59)/2 = 15 x 62 / 2 = 465.\n" +
      "Resposta correta: 465.",
  },
  {
    id: 30,
    difficulty: "Difícil",
    statement:
      "Uma PA tem 20 termos, a1 = 8 e a20 = 68. Qual é a soma dos 20 termos?",
    options: ["760", "780", "800", "820"],
    correctIndex: 1,
    explanation:
      "Usamos Sn = n(a1 + an)/2.\n" +
      "S20 = 20(8 + 68)/2\n" +
      "S20 = 20 x 76 / 2\n" +
      "S20 = 10 x 76 = 760.\n" +
      "Resposta correta: 760.",
  },
];
