const STORAGE_KEY = "barcontrol:v1";
const OFFLINE_SESSION_KEY = "barcontrol:offline-session";
const OFFLINE_SESSION_MAX_AGE_MS = 72 * 60 * 60 * 1000;
const MP_PENDING_ORDER_KEY = "barcontrol:mercadopago-pending-order";
const MP_SELECTED_TERMINAL_KEY = "barcontrol:mercadopago-selected-terminal";
const PAYMENT_TERMINAL_KEY = "barcontrol:selected-payment-terminal";
const DEVICE_KEY_STORAGE = "barcontrol:device-key";
const MP_REQUEST_TIMEOUT_MS = 20 * 1000;
const MP_STATUS_TIMEOUT_MS = 12 * 1000;
const MP_PAYMENT_DEADLINE_MS = 2 * 60 * 1000;
const MP_POLL_INTERVAL_MS = 2500;
const APP_DISPLAY_NAME = "DISTRIBUIDORA ENCONTRO DAS ÁGUAS";
const BRAND_LOGO_URL = "/icons/distribuidora-encontro-das-aguas.jpeg";
const BRAND_ICON_URL = "/icons/icon-192.png";
const FLAMENGO_CREST_URL = "/icons/flamengo-rowing-crest.png";
const CURRENT_SERVICE_NUMBER = Math.max(1, Number(new URLSearchParams(window.location.search).get("atendimento")) || 1);
document.title = `${APP_DISPLAY_NAME} - Atendimento ${CURRENT_SERVICE_NUMBER}`;
const LEGACY_APP_NAMES = [
  "BarControl",
  "BAR ENCONTRO DAS AGUAS",
  "DISTRIBUIDORA AMÉRICA BJ",
  "DISTRIBUIDORA AMERICA BJ",
];
const LOCAL_PASSWORD_RESET_VERSION = 2;
const DEFAULT_LOCAL_PASSWORDS = {
  "u-admin": "admin123",
  "u-manager": "gerente123",
  "u-cashier": "caixa123",
  "u-stock": "estoque123",
};
const MERCADO_PAGO_TERMINAL_REGISTRY = [
  { serial: "N950NCC603875878", number: 1, label: "Atual 1" },
  { serial: "N950NCC503663738", number: 2, label: "Atual 2" },
  { serial: "N95NCC704082234", number: 3, label: "Nova Point 1", expected: true },
  { serial: "N95NCC704084376", number: 4, label: "Nova Point 2", expected: true },
];
const STONE_TERMINAL_REGISTRY = [
  {
    id: "stone:1",
    number: 5,
    model: "Stone",
    serialLabel: "anterior",
    label: "Maquininha 5 - Stone anterior (preservada)",
    enabled: false,
    integrationMode: "pending",
  },
  {
    id: "stone:p2b-73149",
    number: 6,
    model: "Sunmi P2-B",
    serialLabel: "final 73149",
    label: "Maquininha 6 - Stone P2-B - final 73149 (manual)",
    enabled: true,
    integrationMode: "manual",
  },
];

const roles = {
  admin: {
    label: "Administrador",
    permissions: [
      "dashboard",
      "pos",
      "tables",
      "waiter",
      "kitchen",
      "sales",
      "cash",
      "stock",
      "suppliers",
      "clients",
      "catalog",
      "assistant",
      "reports",
      "team",
      "settings",
      "online",
    ],
  },
  manager: {
    label: "Gerente",
    permissions: ["pos", "tables", "waiter", "kitchen", "sales", "cash", "stock", "suppliers", "clients", "catalog", "reports"],
  },
  cashier: {
    label: "Caixa",
    permissions: ["pos", "tables", "sales", "cash", "clients", "catalog"],
  },
  stock: {
    label: "Estoque",
    permissions: ["kitchen", "stock", "suppliers", "catalog"],
  },
};

const navItems = [
  { id: "dashboard", label: "Painel admin", icon: "dashboard" },
  { id: "pos", label: "Balcao", icon: "cart" },
  { id: "tables", label: "Mesas", icon: "tables" },
  { id: "waiter", label: "Garcom", icon: "waiter" },
  { id: "kitchen", label: "Cozinha/Bar", icon: "kitchen" },
  { id: "sales", label: "Vendas", icon: "chart" },
  { id: "cash", label: "Caixa", icon: "cash" },
  { id: "stock", label: "Estoque", icon: "boxes" },
  { id: "suppliers", label: "Fornecedores", icon: "suppliers" },
  { id: "clients", label: "Clientes/Fiado", icon: "clients" },
  { id: "catalog", label: "Catalogo de precos", icon: "tag" },
  { id: "assistant", label: "Assistente IA", icon: "sparkles" },
  { id: "reports", label: "Relatorios", icon: "reports" },
  { id: "team", label: "Equipe", icon: "users" },
  { id: "settings", label: "Configuracoes", icon: "settings" },
  { id: "online", label: "Internet", icon: "online" },
];

const permissionDescriptions = {
  dashboard: "Painel executivo do administrador",
  pos: "Venda rapida de balcao",
  tables: "Mesas e comandas abertas",
  waiter: "Comandas no celular",
  kitchen: "Fila de preparo",
  sales: "Consultar historico",
  cash: "Caixa completo",
  stock: "Estoque, produtos e inventario",
  suppliers: "Compras e fornecedores",
  clients: "Fiado e clientes",
  catalog: "Lista de produtos e precos para clientes",
  assistant: "Assistente inteligente para analises e tarefas",
  reports: "Relatorios e exportacoes",
  team: "Gerenciar acessos",
  settings: "Dados da distribuidora e operacao",
  online: "Publicacao e banco real",
};

const iconPaths = {
  dashboard:
    '<path d="M3 13h8V3H3v10Z"></path><path d="M13 21h8V11h-8v10Z"></path><path d="M13 3v6h8V3h-8Z"></path><path d="M3 21h8v-6H3v6Z"></path>',
  cart:
    '<circle cx="9" cy="20" r="1.5"></circle><circle cx="18" cy="20" r="1.5"></circle><path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H7"></path>',
  chart:
    '<path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M8 16v-5"></path><path d="M12 16V8"></path><path d="M16 16v-3"></path>',
  cash:
    '<rect x="3" y="6" width="18" height="12" rx="2"></rect><circle cx="12" cy="12" r="3"></circle><path d="M6 9h2"></path><path d="M16 15h2"></path>',
  boxes:
    '<path d="M4 9l8-4 8 4-8 4-8-4Z"></path><path d="M4 9v6l8 4 8-4V9"></path><path d="M12 13v6"></path><path d="M8 7l8 4"></path>',
  tag:
    '<path d="M20 13l-7 7L4 11V4h7l9 9Z"></path><circle cx="8" cy="8" r="1.5"></circle>',
  sparkles:
    '<path d="M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z"></path><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z"></path><path d="M5 13l.7 1.8 1.8.7-1.8.7L5 18l-.7-1.8-1.8-.7 1.8-.7L5 13Z"></path>',
  users:
    '<circle cx="9" cy="8" r="3"></circle><path d="M3.5 19a5.5 5.5 0 0 1 11 0"></path><path d="M16 11a2.5 2.5 0 1 0 0-5"></path><path d="M17 15a4.5 4.5 0 0 1 3.5 4"></path>',
  waiter:
    '<path d="M6 20h12"></path><path d="M12 20V9"></path><path d="M8 9a4 4 0 0 1 8 0"></path><path d="M5 12h14"></path><path d="M7 16h10"></path>',
  tables:
    '<rect x="5" y="5" width="14" height="10" rx="2"></rect><path d="M8 15v5"></path><path d="M16 15v5"></path><path d="M3 9h2"></path><path d="M19 9h2"></path>',
  kitchen:
    '<path d="M6 3v7"></path><path d="M10 3v7"></path><path d="M8 10v11"></path><path d="M16 3v18"></path><path d="M14 3h4"></path>',
  inventory:
    '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path><path d="M8 5v14"></path><path d="M16 5v14"></path>',
  suppliers:
    '<path d="M3 16V8l9-5 9 5v8l-9 5-9-5Z"></path><path d="M7 10h10"></path><path d="M7 14h6"></path>',
  clients:
    '<circle cx="8" cy="8" r="3"></circle><path d="M2.5 19a5.5 5.5 0 0 1 11 0"></path><path d="M17 10h4"></path><path d="M19 8v4"></path><path d="M16 17h5"></path>',
  reports:
    '<path d="M5 20V4"></path><path d="M5 20h14"></path><path d="M9 16V9"></path><path d="M13 16V6"></path><path d="M17 16v-4"></path>',
  settings:
    '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3-.2-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-3v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.2.1-2-3 .1-.1A1.7 1.7 0 0 0 5 15a1.7 1.7 0 0 0-1.5-1H3v-4h.5A1.7 1.7 0 0 0 5 9a1.7 1.7 0 0 0-.3-1.9L4.6 7l2-3 .2.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3h3v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.2-.1 2 3-.1.1A1.7 1.7 0 0 0 19 9a1.7 1.7 0 0 0 1.5 1h.5v4h-.5A1.7 1.7 0 0 0 19.4 15Z"></path>',
  online:
    '<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a14 14 0 0 1 0 18"></path><path d="M12 3a14 14 0 0 0 0 18"></path>',
  refresh:
    '<path d="M20 6v5h-5"></path><path d="M4 18v-5h5"></path><path d="M6.1 9a7 7 0 0 1 11.5-2.6L20 11"></path><path d="m4 13 2.4 4.6A7 7 0 0 0 17.9 15"></path>',
  menu: '<path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path>',
  close: '<path d="M6 6l12 12"></path><path d="M18 6L6 18"></path>',
  logout: '<path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path><path d="M21 4v16"></path>',
  sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M4.93 19.07l1.41-1.41"></path><path d="M17.66 6.34l1.41-1.41"></path>',
  moon: '<path d="M21 13a8 8 0 1 1-10-10 7 7 0 0 0 10 10Z"></path>',
  search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
  palette:
    '<path d="M12 3a9 9 0 0 0 0 18h1.2a1.8 1.8 0 0 0 1.2-3.1 1.8 1.8 0 0 1 1.2-3.1H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3Z"></path><circle cx="7.5" cy="10" r="1"></circle><circle cx="10" cy="6.8" r="1"></circle><circle cx="14" cy="6.8" r="1"></circle><circle cx="16.5" cy="10" r="1"></circle>',
  download: '<path d="M12 3v12"></path><path d="M7 10l5 5 5-5"></path><path d="M5 21h14"></path>',
  print: '<path d="M7 8V3h10v5"></path><path d="M7 17H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2"></path><path d="M7 14h10v7H7v-7Z"></path>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z"></path>',
};

const categoryMeta = {
  Cervejas: { icon: "CE", tone: "beer" },
  Drinks: { icon: "DR", tone: "drink" },
  Bebidas: { icon: "BE", tone: "soft" },
  Cozinha: { icon: "CO", tone: "food" },
  Insumos: { icon: "IN", tone: "stock" },
};

const paymentMethods = ["Pix", "Debito", "Credito", "Dinheiro", "Fiado"];
const cashPaymentMethods = paymentMethods.filter((method) => method !== "Fiado");
const checkoutPaymentMethods = [...paymentMethods, "Dividido"];
const pointPaymentMethods = ["Pix", "Debito", "Credito"];
const PAYMENT_DETAILS_PREFIX = "PAYMENT_DETAILS:";
const DAILY_CASH_OPEN_HOUR = 6;
const AUTOMATIC_CASH_CLOUD_REFRESH_MS = 5 * 60 * 1000;

const defaultState = {
  users: [
    {
      id: "u-admin",
      name: "Marcos Admin",
      email: "admin@bar.local",
      password: "admin123",
      role: "admin",
      permissions: roles.admin.permissions,
      active: true,
      showOnLogin: false,
    },
    {
      id: "u-manager",
      name: "Ana Gerente",
      email: "gerente@bar.local",
      password: "gerente123",
      role: "manager",
      permissions: roles.manager.permissions,
      active: true,
      showOnLogin: false,
    },
    {
      id: "u-cashier",
      name: "Leo Caixa",
      email: "caixa@bar.local",
      password: "caixa123",
      role: "cashier",
      permissions: roles.cashier.permissions,
      active: true,
      showOnLogin: true,
    },
    {
      id: "u-stock",
      name: "Bia Estoque",
      email: "estoque@bar.local",
      password: "estoque123",
      role: "stock",
      permissions: roles.stock.permissions,
      active: true,
      showOnLogin: true,
    },
  ],
  products: [
    {
      id: "p-cerveja-pilsen",
      name: "Cerveja Pilsen 600ml",
      category: "Cervejas",
      price: 14,
      cost: 7.2,
      stock: 0,
      minStock: 18,
      criticalStock: 8,
      favorite: true,
      station: "Bar",
      recipe: [],
      active: true,
    },
    {
      id: "p-ipa",
      name: "IPA Long Neck",
      category: "Cervejas",
      price: 16,
      cost: 8.5,
      stock: 0,
      minStock: 12,
      criticalStock: 6,
      favorite: false,
      station: "Bar",
      recipe: [],
      active: true,
    },
    {
      id: "p-caipirinha",
      name: "Caipirinha",
      category: "Drinks",
      price: 22,
      cost: 8,
      stock: 0,
      minStock: 10,
      criticalStock: 4,
      favorite: true,
      station: "Bar",
      recipe: [
        { ingredientId: "i-cachaca", qty: 60 },
        { ingredientId: "i-limao", qty: 1 },
        { ingredientId: "i-acucar", qty: 12 },
        { ingredientId: "i-gelo", qty: 120 },
      ],
      active: true,
    },
    {
      id: "p-gin-tonica",
      name: "Gin Tonica",
      category: "Drinks",
      price: 28,
      cost: 11,
      stock: 0,
      minStock: 8,
      criticalStock: 3,
      favorite: true,
      station: "Bar",
      recipe: [
        { ingredientId: "i-gin", qty: 50 },
        { ingredientId: "i-tonica", qty: 180 },
        { ingredientId: "i-gelo", qty: 120 },
      ],
      active: true,
    },
    {
      id: "p-agua",
      name: "Agua sem gas",
      category: "Bebidas",
      price: 6,
      cost: 2,
      stock: 0,
      minStock: 20,
      criticalStock: 8,
      favorite: false,
      station: "Bar",
      recipe: [],
      active: true,
    },
    {
      id: "p-refrigerante",
      name: "Refrigerante lata",
      category: "Bebidas",
      price: 7,
      cost: 3.1,
      stock: 0,
      minStock: 18,
      criticalStock: 6,
      favorite: true,
      station: "Bar",
      recipe: [],
      active: true,
    },
    {
      id: "p-batata",
      name: "Batata rustica",
      category: "Cozinha",
      price: 25,
      cost: 10,
      stock: 0,
      minStock: 8,
      criticalStock: 3,
      favorite: true,
      station: "Cozinha",
      recipe: [
        { ingredientId: "i-batata", qty: 250 },
        { ingredientId: "i-oleo", qty: 40 },
      ],
      active: true,
    },
    {
      id: "p-burger",
      name: "Burger da casa",
      category: "Cozinha",
      price: 34,
      cost: 15.5,
      stock: 0,
      minStock: 6,
      criticalStock: 2,
      favorite: true,
      station: "Cozinha",
      recipe: [
        { ingredientId: "i-pao", qty: 1 },
        { ingredientId: "i-carne", qty: 180 },
        { ingredientId: "i-queijo", qty: 2 },
      ],
      active: true,
    },
  ],
  ingredients: [
    { id: "i-cachaca", name: "Cachaca", unit: "ml", stock: 0, minStock: 1200, costPerUnit: 0.035 },
    { id: "i-limao", name: "Limao", unit: "un", stock: 0, minStock: 16, costPerUnit: 0.8 },
    { id: "i-acucar", name: "Acucar", unit: "g", stock: 0, minStock: 600, costPerUnit: 0.006 },
    { id: "i-gelo", name: "Gelo", unit: "g", stock: 0, minStock: 5000, costPerUnit: 0.004 },
    { id: "i-gin", name: "Gin", unit: "ml", stock: 0, minStock: 900, costPerUnit: 0.08 },
    { id: "i-tonica", name: "Agua tonica", unit: "ml", stock: 0, minStock: 1800, costPerUnit: 0.018 },
    { id: "i-batata", name: "Batata", unit: "g", stock: 0, minStock: 2500, costPerUnit: 0.015 },
    { id: "i-oleo", name: "Oleo", unit: "ml", stock: 0, minStock: 800, costPerUnit: 0.012 },
    { id: "i-pao", name: "Pao brioche", unit: "un", stock: 0, minStock: 10, costPerUnit: 2.1 },
    { id: "i-carne", name: "Blend bovino", unit: "g", stock: 0, minStock: 1800, costPerUnit: 0.055 },
    { id: "i-queijo", name: "Queijo", unit: "fatias", stock: 0, minStock: 24, costPerUnit: 0.75 },
  ],
  sales: [
    {
      id: "s-001",
      date: "2026-05-28T22:15:00.000Z",
      cashierId: "u-cashier",
      payment: "Pix",
      items: [
        { productId: "p-cerveja-pilsen", name: "Cerveja Pilsen 600ml", qty: 3, price: 14, cost: 7.2 },
        { productId: "p-batata", name: "Batata rustica", qty: 1, price: 25, cost: 10 },
      ],
      total: 67,
      cost: 31.6,
    },
    {
      id: "s-002",
      date: "2026-05-28T23:05:00.000Z",
      cashierId: "u-manager",
      payment: "Cartao",
      items: [
        { productId: "p-gin-tonica", name: "Gin Tonica", qty: 2, price: 28, cost: 11 },
        { productId: "p-agua", name: "Agua sem gas", qty: 2, price: 6, cost: 2 },
      ],
      total: 68,
      cost: 26,
    },
  ],
  offlineQueue: [],
  cachedPaymentTerminals: [],
  cashSessions: [
    {
      id: "c-001",
      openedAt: "2026-05-28T18:00:00.000Z",
      closedAt: "2026-05-29T01:20:00.000Z",
      userId: "u-manager",
      openingAmount: 300,
      closingAmount: 2024,
      notes: "Fechamento do turno de quinta.",
    },
  ],
  cashMovements: [
    {
      id: "m-001",
      date: "2026-05-28T20:30:00.000Z",
      type: "sangria",
      amount: 80,
      reason: "Compra emergencial de gelo",
      userId: "u-manager",
    },
  ],
  suppliers: [
    {
      id: "sup-001",
      name: "Distribuidora Central",
      contact: "Compras",
      phone: "(11) 99999-0101",
      phone2: "",
      phone3: "",
      phone4: "",
      phone5: "",
      email: "compras@central.local",
      cnpj: "",
      address: "",
    },
    {
      id: "sup-002",
      name: "Hortifruti da Vila",
      contact: "Joao",
      phone: "(11) 98888-0202",
      phone2: "",
      phone3: "",
      phone4: "",
      phone5: "",
      email: "",
      cnpj: "",
      address: "",
    },
  ],
  purchases: [
    {
      id: "pur-001",
      date: "2026-05-28T15:20:00.000Z",
      supplierId: "sup-001",
      itemName: "Cerveja Pilsen 600ml",
      qty: 24,
      unitCost: 7.2,
      total: 172.8,
      userId: "u-manager",
    },
  ],
  inventoryCounts: [
    {
      id: "inv-001",
      date: "2026-05-28T17:30:00.000Z",
      itemType: "product",
      itemId: "p-refrigerante",
      expected: 8,
      counted: 8,
      difference: 0,
      userId: "u-stock",
      notes: "Contagem inicial.",
    },
  ],
  stockLots: [
    {
      id: "lot-001",
      itemType: "product",
      itemId: "p-cerveja-pilsen",
      batch: "PIL-0526",
      qty: 0,
      expiresAt: "2026-07-15",
      supplierId: "sup-001",
    },
    {
      id: "lot-002",
      itemType: "ingredient",
      itemId: "i-limao",
      batch: "LIM-0531",
      qty: 0,
      expiresAt: "2026-06-08",
      supplierId: "sup-002",
    },
    {
      id: "lot-003",
      itemType: "ingredient",
      itemId: "i-carne",
      batch: "CAR-0529",
      qty: 0,
      expiresAt: "2026-06-05",
      supplierId: "sup-002",
    },
  ],
  counterSplits: {},
  tables: Array.from({ length: 12 }, (_, index) => ({
    id: `table-${index + 1}`,
    name: `Mesa ${index + 1}`,
    customerName: "",
    status: "Livre",
    openedAt: null,
    serverId: null,
    clientId: "cl-001",
    items: [],
    splitBill: null,
  })),
  cancellations: [],
  reconciliationReviews: [],
  onlineDevices: [],
  dailySalesTotals: [],
  kitchenOrders: [
    {
      id: "ko-001",
      saleId: "s-001",
      date: "2026-05-28T22:15:00.000Z",
      station: "Cozinha",
      status: "Pronto",
      items: [{ name: "Batata rustica", qty: 1 }],
      userId: "u-cashier",
    },
  ],
  clients: [
    { id: "cl-001", name: "Cliente balcão", phone: "", debt: 0, creditLimit: 0, notes: "Cliente avulso." },
    { id: "cl-002", name: "Carlos Mesa 4", phone: "(11) 97777-0303", debt: 84, creditLimit: 250, notes: "Fiado autorizado pelo gerente." },
  ],
  auditLog: [
    {
      id: "aud-001",
      date: "2026-05-28T18:00:00.000Z",
      userId: "u-manager",
      action: "Caixa aberto",
      details: "Turno iniciado com R$ 300,00.",
    },
  ],
  settings: {
    theme: "light",
    palette: "brand",
    pwaEnabled: true,
    syncMode: "local",
    barName: APP_DISPLAY_NAME,
    cnpj: "",
    address: "",
    serviceFee: 10,
    receiptFooter: "Obrigado pela preferencia.",
    closingDifferenceLimit: 5,
    pricingDefaults: {
      cardFee: 3.5,
      tax: 0,
      targetMargin: 30,
    },
    anomalySettings: {
      highDiscountPercent: 15,
      cancellationPercent: 8,
    },
    shiftStartView: {
      admin: "dashboard",
      manager: "pos",
      cashier: "pos",
      stock: "stock",
    },
  },
};

let state = loadState();
let session = null;
let currentView = "dashboard";
let cart = [];
let tableCheckout = null;
let selectedTableId = null;
let lastSaleForTicketsId = null;
let currentModal = null;
let searchTerm = "";
let categoryFilter = "Todos";
let stockSortMode = "default";
let reportFilter = { mode: "24h", start: "", end: "" };
let salesDateFilter = "";
let suppressBroadcast = false;
let deferredInstallPrompt = null;
let searchRenderTimer = null;
let assistantMessages = [
  {
    role: "assistant",
    content: "Ola! Posso analisar seu negocio e preparar tarefas para voce confirmar. O que deseja fazer?",
  },
];
let assistantPendingAction = null;
let assistantBusy = false;
let onlineSalesRefreshInProgress = false;
let automaticCashOpeningInProgress = false;
let automaticCashLastCloudRefreshAt = 0;
let connectionState = {
  browserOnline: navigator.onLine !== false,
  cloudReachable: navigator.onLine !== false,
  syncing: false,
  lastSyncAt: null,
  lastError: "",
};
const REALTIME_TABLE_AREAS = {
  bar_tables: "tables",
  kitchen_orders: "kitchen",
  products: "stock",
  ingredients: "stock",
  product_recipes: "stock",
  product_lots: "stock",
  inventory_counts: "stock",
  clients: "clients",
  client_transactions: "clients",
  sales: "sales",
  sale_items: "sales",
  cancellations: "sales",
  cash_sessions: "cash",
  cash_movements: "cash",
  suppliers: "suppliers",
  purchases: "suppliers",
  expenses: "suppliers",
  app_settings: "settings",
  profiles: "profiles",
};
const REALTIME_VIEW_AREAS = {
  tables: ["tables", "waiter", "pos"],
  kitchen: ["kitchen"],
  stock: ["stock", "catalog", "pos", "waiter", "tables"],
  clients: ["clients", "pos", "tables"],
  sales: ["dashboard", "sales", "reports"],
  cash: ["dashboard", "cash", "sales"],
  suppliers: ["suppliers", "dashboard"],
  settings: ["settings"],
  profiles: ["team", "settings"],
};
let realtimeChannel = null;
let realtimeRefreshTimer = null;
let realtimeReconnectTimer = null;
let realtimeRefreshRunning = false;
let realtimeSubscriptionStatus = "disconnected";
let realtimeLastUpdateAt = null;
const realtimePendingAreas = new Set();

const app = document.querySelector("#app");
const syncChannel = "BroadcastChannel" in window ? new BroadcastChannel("barcontrol-sync") : null;
const supabaseConfig = window.BAR_SUPABASE_CONFIG || {};
const supabaseLibrary = window.supabase || globalThis.supabase;
const supabaseClient =
  supabaseConfig.enabled && supabaseLibrary?.createClient
    ? supabaseLibrary.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
    : null;
let supabaseStatus = {
  checked: false,
  ok: false,
  message: supabaseClient ? "Configurado, aguardando teste." : "Supabase ainda nao configurado.",
};
let mercadoPagoPointStatus = {
  checked: false,
  enabled: false,
  message: "Mercado Pago Point ainda nao testado.",
  terminal: "",
  terminalId: "",
  terminals: [],
};

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = MP_REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const data = await response.json().catch(() => ({}));
    return { response, data };
  } catch (error) {
    if (error?.name === "AbortError") throw new Error("Tempo limite excedido. Verifique a internet e a maquininha.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return migrateState(structuredClone(defaultState));
  }

  try {
    return migrateState({ ...structuredClone(defaultState), ...JSON.parse(saved) });
  } catch {
    return migrateState(structuredClone(defaultState));
  }
}

function migrateState(nextState) {
  nextState.products = (nextState.products || []).map((product) => {
    const base = defaultState.products.find((item) => item.id === product.id) || {};
    return {
      productCode: "",
      barcodeCodes: [],
      imageUrl: "",
      station: "Bar",
      recipe: [],
      criticalStock: Math.max(1, Math.floor(Number(product.minStock || base.minStock || 1) / 2)),
      favorite: false,
      ...base,
      ...product,
    };
  });
  nextState.sales = (nextState.sales || []).map((sale) => ({
    status: "Concluida",
    serviceFee: 0,
    syncStatus: "synced",
    ...sale,
  }));
  nextState.offlineQueue = Array.isArray(nextState.offlineQueue) ? nextState.offlineQueue : [];
  nextState.cachedPaymentTerminals = Array.isArray(nextState.cachedPaymentTerminals) ? nextState.cachedPaymentTerminals : [];
  nextState.ingredients = nextState.ingredients || structuredClone(defaultState.ingredients);
  nextState.suppliers = (nextState.suppliers || structuredClone(defaultState.suppliers)).map((supplier) => ({
    ...supplier,
    phone2: supplier.phone2 || "",
    phone3: supplier.phone3 || "",
    phone4: supplier.phone4 || "",
    phone5: supplier.phone5 || "",
    email: supplier.email || (String(supplier.contact || "").includes("@") ? supplier.contact : ""),
    cnpj: supplier.cnpj || "",
    address: supplier.address || "",
  }));
  nextState.purchases = nextState.purchases || structuredClone(defaultState.purchases);
  nextState.cashSessions = nextState.cashSessions || structuredClone(defaultState.cashSessions);
  nextState.inventoryCounts = nextState.inventoryCounts || structuredClone(defaultState.inventoryCounts);
  nextState.stockLots = nextState.stockLots || structuredClone(defaultState.stockLots);
  nextState.counterSplits = nextState.counterSplits && typeof nextState.counterSplits === "object"
    ? nextState.counterSplits
    : {};
  nextState.tables = (nextState.tables || structuredClone(defaultState.tables)).map((table) => ({
    customerName: "",
    splitBill: null,
    ...table,
  }));
  nextState.cancellations = nextState.cancellations || [];
  nextState.reconciliationReviews = nextState.reconciliationReviews || [];
  nextState.onlineDevices = nextState.onlineDevices || [];
  nextState.dailySalesTotals = nextState.dailySalesTotals || [];
  nextState.expenses = (nextState.expenses || []).map((expense) => {
    const amount = Number(expense.amount || 0);
    const paidAmount = Number(expense.paidAmount ?? (expense.paid ? amount : 0));
    return {
      paymentHistory: [],
      ...expense,
      recurring: Boolean(expense.recurring),
      recurringDay: Number(expense.recurringDay || String(expense.dueDate || "").slice(-2)) || null,
      expenseDate: expense.expenseDate || String(expense.createdAt || new Date().toISOString()).slice(0, 10),
      paidAmount: Math.min(amount, Math.max(0, paidAmount)),
      paid: Boolean(expense.paid || paidAmount >= amount),
      paidAt: expense.paidAt || (expense.paid || paidAmount >= amount ? new Date().toISOString() : null),
    };
  });
  nextState.kitchenOrders = nextState.kitchenOrders || structuredClone(defaultState.kitchenOrders);
  nextState.clients = (nextState.clients || structuredClone(defaultState.clients)).map((client) => ({
    creditLimit: 0,
    transactions: [],
    ...client,
  }));
  nextState.auditLog = nextState.auditLog || structuredClone(defaultState.auditLog);
  nextState.settings = { ...structuredClone(defaultState.settings), ...(nextState.settings || {}) };
  nextState.settings.barName = normalizeBarName(nextState.settings.barName);
  nextState.settings.shiftStartView = {
    ...structuredClone(defaultState.settings.shiftStartView),
    ...(nextState.settings.shiftStartView || {}),
  };
  nextState.users = (nextState.users || []).map((user) => ({
    showOnLogin: false,
    ...user,
    permissions: getUserPermissions(user),
  }));
  if (Number(nextState.localPasswordResetVersion || 0) < LOCAL_PASSWORD_RESET_VERSION) {
    nextState.users = nextState.users.map((user) =>
      DEFAULT_LOCAL_PASSWORDS[user.id] ? { ...user, password: DEFAULT_LOCAL_PASSWORDS[user.id] } : user,
    );
    nextState.localPasswordResetVersion = LOCAL_PASSWORD_RESET_VERSION;
  }
  return nextState;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!suppressBroadcast) {
    syncChannel?.postMessage({ type: "state-updated", at: Date.now() });
  }
}

function activePalette() {
  return ["brand", "rubro", "classic"].includes(state.settings.palette) ? state.settings.palette : "brand";
}

function paletteLabel(palette = activePalette()) {
  if (palette === "rubro") return "Rubro-negro";
  if (palette === "classic") return "Classicas";
  return "Logo";
}

function applyAppearance() {
  const theme = state.settings.theme === "dark" ? "dark" : "light";
  const palette = activePalette();
  document.body.dataset.theme = theme;
  document.body.dataset.palette = palette;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    palette === "rubro"
      ? theme === "dark" ? "#09090b" : "#c41220"
      : palette === "brand"
        ? theme === "dark" ? "#020611" : "#006ad8"
        : theme === "dark" ? "#0b1120" : "#0369a1",
  );
}

function togglePalette() {
  const palettes = ["brand", "rubro", "classic"];
  state.settings.palette = palettes[(palettes.indexOf(activePalette()) + 1) % palettes.length];
  if (session) {
    logAudit("Paleta alterada", `Cores ${paletteLabel(state.settings.palette).toLowerCase()}.`);
  }
  saveState();
  if (session) renderApp();
  else renderLogin();
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function qty(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? String(number) : number.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
}

function dateTime(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function normalizeBarName(value) {
  const name = String(value || "").trim();
  const normalizedName = name.toLocaleLowerCase("pt-BR");
  const isLegacyName = LEGACY_APP_NAMES.some(
    (legacyName) => legacyName.toLocaleLowerCase("pt-BR") === normalizedName,
  );
  if (!name || isLegacyName) return APP_DISPLAY_NAME;
  return name;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function printSafeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[{}]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
}

function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function uuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function pendingOfflineOperations() {
  return (state.offlineQueue || []).filter((operation) => operation?.type === "sale" && operation.status !== "synced");
}

function hasNetworkConnection() {
  return navigator.onLine !== false && connectionState.browserOnline && connectionState.cloudReachable;
}

function cacheOfflineSession(user) {
  if (!user?.online || !isUuid(user.id)) return;
  localStorage.setItem(
    OFFLINE_SESSION_KEY,
    JSON.stringify({
      verifiedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email || "",
        role: user.role,
        permissions: getUserPermissions(user),
        active: user.active !== false,
        showOnLogin: Boolean(user.showOnLogin),
        online: true,
      },
    }),
  );
}

function restoreCachedOfflineSession() {
  try {
    const cached = JSON.parse(localStorage.getItem(OFFLINE_SESSION_KEY) || "null");
    const age = Date.now() - Date.parse(cached?.verifiedAt || "");
    if (!cached?.user?.id || !cached.user.active || !Number.isFinite(age) || age > OFFLINE_SESSION_MAX_AGE_MS) return false;
    session = { ...cached.user, offlineCached: true };
    upsertSessionUser(session);
    const preferredView = state.settings.shiftStartView?.[session.role];
    currentView = CURRENT_SERVICE_NUMBER > 1 && hasPermission("pos")
      ? "pos"
      : preferredView && hasPermission(preferredView)
        ? preferredView
        : getUserPermissions(session)[0] || "pos";
    logAudit("Sessao de contingencia", `${session.name} acessou usando a autorizacao offline deste aparelho.`);
    saveState();
    renderApp();
    return true;
  } catch (error) {
    return false;
  }
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value || "");
}

function supabaseAuthUsersUrl() {
  const projectRef = String(supabaseConfig.url || "").match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  return projectRef ? `https://supabase.com/dashboard/project/${projectRef}/auth/users` : "https://supabase.com/dashboard";
}

function normalizePermissions(permissions) {
  const valid = navItems.map((item) => item.id);
  const normalized = [...new Set((permissions || []).filter((permission) => valid.includes(permission)))].filter(
    (permission) => !["dashboard", "settings", "online"].includes(permission),
  );
  return normalized.length ? normalized : ["pos"];
}

function getUserPermissions(user) {
  if (!user) return [];
  if (user.role === "admin") return [...roles.admin.permissions];
  return normalizePermissions(user.permissions || roles[user.role]?.permissions || roles.cashier.permissions);
}

function icon(name) {
  return `
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      ${iconPaths[name] || iconPaths.dashboard}
    </svg>
  `;
}

function permissionSummary(user) {
  const permissions = getUserPermissions(user);
  return navItems
    .filter((item) => permissions.includes(item.id))
    .map((item) => item.label)
    .join(", ");
}

function hasPermission(view) {
  if (!session) return false;
  if (["dashboard", "settings", "online"].includes(view) && session.role !== "admin") return false;
  return getUserPermissions(session).includes(view);
}

function visibleNav() {
  return navItems.filter((item) => hasPermission(item.id));
}

function setView(view) {
  if (!hasPermission(view)) {
    notify("Seu perfil nao tem acesso a esta area.");
    return;
  }

  currentView = view;
  searchTerm = "";
  categoryFilter = "Todos";
  if (view !== "stock") stockSortMode = "default";
  renderApp();
  if (["sales", "cash"].includes(view) && isOnlineSession()) void refreshSalesFromCloud({ silent: true });
  if (["pos", "waiter", "sales", "cash"].includes(view) && !mercadoPagoPointStatus.checked) {
    loadMercadoPagoPointStatus(true).then(() => renderApp());
  }
}

function notify(message) {
  const old = document.querySelector(".toast");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function isStandaloneApp() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

async function installApp() {
  if (isStandaloneApp()) {
    notify("O aplicativo ja esta instalado neste aparelho.");
    return;
  }

  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return;
  }

  if (isIosDevice()) {
    notify("No Safari, toque em Compartilhar e depois em Adicionar a Tela de Inicio.");
    return;
  }

  notify("Abra o menu do navegador e escolha Instalar aplicativo ou Adicionar a tela inicial.");
}

function logAudit(action, details = "") {
  state.auditLog = state.auditLog || [];
  state.auditLog.unshift({
    id: id("audit"),
    date: new Date().toISOString(),
    userId: session?.id || "system",
    action,
    details,
  });
  state.auditLog = state.auditLog.slice(0, 250);
}

function isSupabaseReady() {
  return Boolean(supabaseClient && supabaseConfig.url && supabaseConfig.publishableKey);
}

function setCloudReachable(reachable, error = "") {
  connectionState.browserOnline = navigator.onLine !== false;
  connectionState.cloudReachable = Boolean(reachable && connectionState.browserOnline);
  connectionState.lastError = connectionState.cloudReachable ? "" : String(error || connectionState.lastError || "Sem conexao.");
  updateConnectionIndicators();
}

async function checkCloudConnection(timeoutMs = 5000) {
  if (navigator.onLine === false) {
    setCloudReachable(false, "O aparelho esta sem internet.");
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`/api/health?at=${Date.now()}`, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`Servidor indisponivel (${response.status}).`);
    setCloudReachable(true);
    return true;
  } catch (error) {
    setCloudReachable(false, error.message || "Servidor indisponivel.");
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function connectionPresentation() {
  const pending = pendingOfflineOperations().length;
  if (connectionState.syncing) return { tone: "syncing", label: `Sincronizando ${pending}`, title: "Enviando vendas pendentes para a nuvem." };
  if (!hasNetworkConnection()) {
    return {
      tone: "offline",
      label: pending ? `Offline - ${pending} pendente${pending === 1 ? "" : "s"}` : "Modo offline",
      title: "As vendas serao guardadas neste aparelho ate a internet voltar.",
    };
  }
  if (pending) {
    return {
      tone: "pending",
      label: `${pending} pendente${pending === 1 ? "" : "s"}`,
      title: "Clique para sincronizar as vendas salvas neste aparelho.",
    };
  }
  return realtimeSubscriptionStatus === "connected"
    ? { tone: "online", label: "Online ao vivo", title: "Conectado e recebendo atualizacoes dos outros computadores." }
    : { tone: "online", label: "Online", title: "Conectado e sem vendas pendentes." };
}

function updateConnectionIndicators() {
  const presentation = connectionPresentation();
  document.querySelectorAll("[data-connection-chip]").forEach((element) => {
    element.className = `connection-chip ${presentation.tone}`;
    const label = element.querySelector("[data-connection-label]");
    if (label) label.textContent = presentation.label;
    else element.textContent = presentation.label;
    element.title = presentation.title;
  });
}

function realtimeInteractionLocked() {
  return Boolean(
    currentModal ||
      assistantBusy ||
      connectionState.syncing ||
      cart.length ||
      tableCheckout ||
      document.querySelector('form[data-submitting="true"], [aria-busy="true"]'),
  );
}

function realtimeCanRender(areas) {
  if (realtimeInteractionLocked()) return false;
  const activeElement = document.activeElement;
  if (activeElement?.matches?.("input, textarea, select, [contenteditable='true']")) return false;
  return [...areas].some((area) => REALTIME_VIEW_AREAS[area]?.includes(currentView));
}

function scheduleRealtimeRefresh(delay = 650) {
  if (realtimeRefreshTimer) clearTimeout(realtimeRefreshTimer);
  realtimeRefreshTimer = setTimeout(() => {
    realtimeRefreshTimer = null;
    void flushRealtimeUpdates();
  }, delay);
}

function queueRealtimeArea(area) {
  if (!area || !session?.online) return;
  realtimePendingAreas.add(area);
  scheduleRealtimeRefresh();
}

function queueFullRealtimeRefresh() {
  if (!session?.online) return;
  Object.values(REALTIME_TABLE_AREAS).forEach((area) => realtimePendingAreas.add(area));
  scheduleRealtimeRefresh(250);
}

async function flushRealtimeUpdates() {
  if (!realtimePendingAreas.size || !isOnlineSession()) return;
  if (realtimeRefreshRunning || realtimeInteractionLocked()) {
    scheduleRealtimeRefresh(900);
    return;
  }

  const areas = new Set(realtimePendingAreas);
  realtimePendingAreas.clear();
  realtimeRefreshRunning = true;
  try {
    if (areas.has("settings")) await loadOnlineSettings();
    if (areas.has("profiles")) await loadOnlineProfilesData();
    if (areas.has("tables")) await loadOnlineTableData();
    if (areas.has("stock")) await loadOnlineStockData();
    if (areas.has("clients")) await loadOnlineClientsData();
    if (areas.has("sales")) await loadOnlineSalesData();
    else if (areas.has("kitchen")) await loadOnlineKitchenData();
    if (areas.has("cash")) await loadOnlineCashData();
    if (areas.has("suppliers")) await loadOnlineSupplierData();
    realtimeLastUpdateAt = new Date().toISOString();
    saveState();
    if (session && realtimeCanRender(areas)) renderApp();
  } catch (error) {
    console.warn("Falha ao aplicar atualizacao em tempo real", error);
  } finally {
    realtimeRefreshRunning = false;
    if (realtimePendingAreas.size) scheduleRealtimeRefresh(900);
  }
}

function stopRealtimeSync() {
  if (realtimeRefreshTimer) clearTimeout(realtimeRefreshTimer);
  if (realtimeReconnectTimer) clearTimeout(realtimeReconnectTimer);
  realtimeRefreshTimer = null;
  realtimeReconnectTimer = null;
  realtimePendingAreas.clear();
  const channel = realtimeChannel;
  realtimeChannel = null;
  realtimeSubscriptionStatus = "disconnected";
  if (channel && supabaseClient) void supabaseClient.removeChannel(channel).catch(() => {});
  updateConnectionIndicators();
}

function startRealtimeSync() {
  if (!session?.online || !isSupabaseReady() || !hasNetworkConnection() || realtimeChannel) return;
  realtimeSubscriptionStatus = "connecting";
  const channel = supabaseClient.channel(`barcontrol-live-${uuid()}`);
  Object.entries(REALTIME_TABLE_AREAS).forEach(([table, area]) => {
    channel.on("postgres_changes", { event: "*", schema: "public", table }, () => queueRealtimeArea(area));
  });
  realtimeChannel = channel;
  channel.subscribe((status) => {
    if (realtimeChannel !== channel) return;
    if (status === "SUBSCRIBED") {
      realtimeSubscriptionStatus = "connected";
      if (realtimeReconnectTimer) clearTimeout(realtimeReconnectTimer);
      realtimeReconnectTimer = null;
    } else if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
      realtimeSubscriptionStatus = "disconnected";
      realtimeChannel = null;
      void supabaseClient.removeChannel(channel).catch(() => {});
      realtimeReconnectTimer = setTimeout(() => {
        realtimeReconnectTimer = null;
        startRealtimeSync();
      }, 5000);
    }
    updateConnectionIndicators();
    if (session && currentView === "online" && !realtimeInteractionLocked()) renderApp();
  });
  updateConnectionIndicators();
}

async function testSupabaseConnection() {
  if (!isSupabaseReady()) {
    supabaseStatus = {
      checked: true,
      ok: false,
      message: "Configuração do Supabase ausente.",
    };
    notify("Supabase ainda nao configurado.");
    renderApp();
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("app_settings")
      .select("bar_name, service_fee")
      .eq("id", "main")
      .single();

    if (error) throw error;

    supabaseStatus = {
      checked: true,
      ok: true,
      message: `Conectado ao banco: ${normalizeBarName(data.bar_name)}.`,
    };
    notify("Conexao com Supabase funcionando.");
  } catch (error) {
    supabaseStatus = {
      checked: true,
      ok: false,
      message: error.message || "Nao foi possivel conectar ao Supabase.",
    };
    notify("Falha ao testar Supabase.");
  }

  renderApp();
}

function isPointPayment(payment) {
  return pointPaymentMethods.includes(normalizePaymentMethod(payment));
}

function normalizePaymentMethod(method) {
  if (method === "Cartao") return "Credito";
  return String(method || "").trim();
}

function normalizePaymentBreakdown(breakdown = []) {
  return (Array.isArray(breakdown) ? breakdown : [])
    .map((part) => ({
      method: normalizePaymentMethod(part.method),
      amount: Number(part.amount || 0),
      installments:
        normalizePaymentMethod(part.method) === "Credito"
          ? Math.min(12, Math.max(1, Math.trunc(Number(part.installments || 1))))
          : 1,
    }))
    .filter((part) => paymentMethods.includes(part.method) && part.amount > 0)
    .map((part) => ({ ...part, amount: Number(part.amount.toFixed(2)) }));
}

function pointPaymentPartsForSale({ payment = "", paymentBreakdown = [], total = 0 } = {}) {
  const parts = normalizePaymentBreakdown(paymentBreakdown);
  if (parts.length) return parts.filter((part) => isPointPayment(part.method));
  const method = normalizePaymentMethod(payment);
  return isPointPayment(method) ? [{ method, amount: Number(total || 0) }] : [];
}

function normalizeDiscount(discount = {}) {
  const type = discount.type === "percent" ? "percent" : discount.type === "amount" ? "amount" : "none";
  const value = Math.max(0, Number(discount.value || 0));
  const amount = Math.max(0, Number(discount.amount || 0));
  return {
    type: value > 0 && type !== "none" ? type : "none",
    value: value > 0 && type !== "none" ? value : 0,
    amount,
  };
}

function normalizeProviderReferences(references = []) {
  return (Array.isArray(references) ? references : [])
    .map((reference) => ({
      provider: String(reference?.provider || "").trim().toLowerCase(),
      reference: String(reference?.reference || reference?.orderId || "").trim(),
      orderId: String(reference?.orderId || reference?.reference || "").trim(),
      accountKey: String(reference?.accountKey || "primary").trim(),
      terminalId: String(reference?.terminalId || "").trim(),
      terminalLabel: String(reference?.terminalLabel || "").trim(),
      method: normalizePaymentMethod(reference?.method),
      amount: Number(reference?.amount || 0),
      status: String(reference?.status || "pending").trim().toLowerCase(),
      statusDetail: String(reference?.statusDetail || "").trim(),
      checkedAt: reference?.checkedAt || new Date().toISOString(),
    }))
    .filter((reference) => reference.provider && reference.amount > 0);
}

function discountFromForm(form) {
  const type = String(form.get("discountType") || "none");
  const value = Number(form.get("discountValue") || 0);
  return normalizeDiscount({ type, value });
}

function saleTotalsForItems(items = cart, discountInput = {}) {
  const itemSubtotal = items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0);
  const isSplitShare = Boolean(tableCheckout?.splitPersonId);
  const subtotal = isSplitShare ? Number(tableCheckout.splitSubtotal || 0) : itemSubtotal;
  const serviceFee = isSplitShare
    ? Number(tableCheckout.splitServiceFee || 0)
    : tableCheckout
      ? tableServiceFee(subtotal)
      : 0;
  const grossTotal = subtotal + serviceFee;
  const discount = isSplitShare ? normalizeDiscount({ type: "none", value: 0 }) : normalizeDiscount(discountInput);
  const rawDiscount = discount.type === "percent" ? grossTotal * (discount.value / 100) : discount.type === "amount" ? discount.value : 0;
  const discountAmount = Math.min(grossTotal, Math.max(0, rawDiscount));
  return {
    subtotal,
    serviceFee,
    grossTotal,
    discount: {
      ...discount,
      amount: Number(discountAmount.toFixed(2)),
    },
    total: Number(Math.max(0, grossTotal - discountAmount).toFixed(2)),
  };
}

function encodePaymentDetails({
  payment = "",
  breakdown = [],
  cashReceived = 0,
  cashChange = 0,
  discount = {},
  paymentOrigin = "",
  manualReference = "",
  terminalLabel = "",
  providerReferences = [],
  splitPersonName = "",
  splitMode = "",
} = {}) {
  const parts = normalizePaymentBreakdown(breakdown);
  const normalizedDiscount = normalizeDiscount(discount);
  const normalizedProviderReferences = normalizeProviderReferences(providerReferences);
  const shouldEncode =
    parts.length > 1 ||
    payment === "Dividido" ||
    Number(cashReceived || 0) > 0 ||
    Number(cashChange || 0) > 0 ||
    parts.some((part) => part.method === "Credito") ||
    normalizedDiscount.amount > 0 ||
    Boolean(paymentOrigin || manualReference || terminalLabel) ||
    normalizedProviderReferences.length > 0 ||
    Boolean(splitPersonName || splitMode);
  if (!shouldEncode) return normalizePaymentMethod(payment);
  return `${PAYMENT_DETAILS_PREFIX}${JSON.stringify({
    payment: payment || (parts.length > 1 ? "Dividido" : parts[0]?.method || ""),
    breakdown: parts,
    cashReceived: Number(cashReceived || 0),
    cashChange: Number(cashChange || 0),
    discount: normalizedDiscount,
    paymentOrigin: String(paymentOrigin || ""),
    manualReference: String(manualReference || ""),
    terminalLabel: String(terminalLabel || ""),
    providerReferences: normalizedProviderReferences,
    splitPersonName: String(splitPersonName || ""),
    splitMode: String(splitMode || ""),
  })}`;
}

function parsePaymentDetails(value) {
  const text = String(value || "");
  if (!text.startsWith(PAYMENT_DETAILS_PREFIX)) {
    const payment = normalizePaymentMethod(text);
    return {
      payment,
      paymentBreakdown: payment && payment !== "Dividido" ? [{ method: payment, amount: 0 }] : [],
      cashReceived: 0,
      cashChange: 0,
      discount: { type: "none", value: 0, amount: 0 },
      paymentOrigin: "",
      manualReference: "",
      terminalLabel: "",
      providerReferences: [],
      splitPersonName: "",
      splitMode: "",
    };
  }

  try {
    const payload = JSON.parse(text.slice(PAYMENT_DETAILS_PREFIX.length));
    const parts = normalizePaymentBreakdown(payload.breakdown);
    return {
      payment: normalizePaymentMethod(payload.payment) || (parts.length > 1 ? "Dividido" : parts[0]?.method || ""),
      paymentBreakdown: parts,
      cashReceived: Number(payload.cashReceived || 0),
      cashChange: Number(payload.cashChange || 0),
      discount: normalizeDiscount(payload.discount),
      paymentOrigin: String(payload.paymentOrigin || ""),
      manualReference: String(payload.manualReference || ""),
      terminalLabel: String(payload.terminalLabel || ""),
      providerReferences: normalizeProviderReferences(payload.providerReferences),
      splitPersonName: String(payload.splitPersonName || ""),
      splitMode: String(payload.splitMode || ""),
    };
  } catch (error) {
    return {
      payment: "Indefinido",
      paymentBreakdown: [],
      cashReceived: 0,
      cashChange: 0,
      discount: { type: "none", value: 0, amount: 0 },
      paymentOrigin: "",
      manualReference: "",
      terminalLabel: "",
      providerReferences: [],
      splitPersonName: "",
      splitMode: "",
    };
  }
}

function salePaymentParts(sale) {
  const parts = normalizePaymentBreakdown(sale?.paymentBreakdown || []);
  if (parts.length) return parts;
  const method = normalizePaymentMethod(sale?.payment);
  if (!method || method === "Dividido") return [];
  return [{ method, amount: Number(sale?.total || 0) }];
}

function saleReceivedAmount(sale) {
  if (!isFinancialSale(sale)) return 0;
  return salePaymentParts(sale)
    .filter((part) => part.method !== "Fiado")
    .reduce((sum, part) => sum + Number(part.amount || 0), 0);
}

function saleFiadoAmount(sale) {
  if (!isFinancialSale(sale)) return 0;
  return salePaymentParts(sale)
    .filter((part) => part.method === "Fiado")
    .reduce((sum, part) => sum + Number(part.amount || 0), 0);
}

function saleReceivedProfit(sale) {
  if (!isFinancialSale(sale)) return 0;
  const total = Number(sale?.total || 0);
  const received = saleReceivedAmount(sale);
  if (!total || !received) return 0;
  return received - Number(sale?.cost || 0) * (received / total);
}

function saleStoredReceivedAmount(sale) {
  if (!isFinancialSale(sale)) return 0;
  return salePaymentParts(sale)
    .filter((part) => part.method !== "Fiado")
    .reduce((sum, part) => sum + Number(part.amount || 0), 0);
}

function saleStoredFiadoAmount(sale) {
  if (!isFinancialSale(sale)) return 0;
  return salePaymentParts(sale)
    .filter((part) => part.method === "Fiado")
    .reduce((sum, part) => sum + Number(part.amount || 0), 0);
}

function saleStoredProfit(sale) {
  if (!isFinancialSale(sale)) return 0;
  const total = Number(sale?.total || 0);
  const received = saleStoredReceivedAmount(sale);
  if (!total || !received) return 0;
  return received - Number(sale?.cost || 0) * (received / total);
}

function paymentDisplay(sale) {
  const parts = salePaymentParts(sale);
  const partLabel = (part) =>
    part.method === "Credito"
      ? `Credito ${Number(part.installments || 1) === 1 ? "a vista" : `${Number(part.installments)}x`}`
      : part.method;
  const label =
    parts.length > 1 || sale?.payment === "Dividido"
      ? parts.map((part) => `${partLabel(part)} ${money(part.amount)}`).join(" + ")
      : parts[0]
        ? partLabel(parts[0])
        : normalizePaymentMethod(sale?.payment) || "-";
  if (sale?.paymentOrigin === "manual_offline") return `${label} (manual offline)`;
  if (sale?.paymentOrigin === "manual_terminal") return `${label} (manual Stone)`;
  return label;
}

function describeMercadoPagoError(payload) {
  const details = payload?.details || payload || {};
  const raw = details.errors || details.message || details.error || details.cause || details;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw.map((entry) => entry.message || entry.description || entry.code || JSON.stringify(entry)).join(" | ");
  if (raw?.message) return raw.message;
  if (raw?.description) return raw.description;
  if (details?.message) return details.message;
  if (details?.error) return details.error;
  return JSON.stringify(details).slice(0, 300);
}

function paymentTerminalOptions() {
  const availableTerminals = mercadoPagoPointStatus.terminals.length
    ? mercadoPagoPointStatus.terminals
    : state.cachedPaymentTerminals || [];
  const connectedSerials = new Set(availableTerminals.map(mercadoPagoTerminalSerial));
  const mpTerminals = availableTerminals
    .map((terminal, index) => ({ terminal, number: mercadoPagoTerminalNumber(terminal, index) }))
    .sort((a, b) => a.number - b.number || String(a.terminal.id).localeCompare(String(b.terminal.id)))
    .map(({ terminal, number }) => ({
      id: `mp:${terminal.id}`,
      provider: "mercado_pago",
      terminalId: terminal.id,
      accountKey: terminal.account_key || "primary",
      label: `${mercadoPagoTerminalName(terminal, number)}${terminal.operating_mode === "PDV" ? "" : " (ativar PDV)"}`,
      enabled: terminal.operating_mode === "PDV",
    }));
  const expectedTerminals = MERCADO_PAGO_TERMINAL_REGISTRY
    .filter((entry) => entry.expected && !connectedSerials.has(normalizeMercadoPagoSerial(entry.serial)))
    .map((entry) => ({
      id: `mp-expected:${entry.serial}`,
      provider: "mercado_pago",
      terminalId: "",
      accountKey: "secondary",
      label: `Maquininha ${entry.number} - ${entry.label} - ${entry.serial} (aguardando vinculacao)`,
      enabled: false,
    }));

  return [
    ...mpTerminals,
    ...expectedTerminals,
    ...STONE_TERMINAL_REGISTRY.map((terminal) => ({
      ...terminal,
      provider: "stone",
      terminalId: terminal.id,
    })),
  ];
}

function getSelectedPaymentTerminal() {
  const terminals = paymentTerminalOptions();
  const saved = localStorage.getItem(PAYMENT_TERMINAL_KEY);
  return terminals.find((terminal) => terminal.id === saved && terminal.enabled) || terminals.find((terminal) => terminal.enabled) || null;
}

function ticketTerminalLabel(terminal) {
  if (!terminal) return "";
  return String(terminal.label || "")
    .replace(" (ativar PDV)", "")
    .replace(/\s+-\s+(PDV|STANDALONE)$/i, "");
}

function setSelectedPaymentTerminal(terminalKey) {
  const terminal = paymentTerminalOptions().find((entry) => entry.id === terminalKey);
  if (!terminal) return;
  localStorage.setItem(PAYMENT_TERMINAL_KEY, terminal.id);
  if (terminal.provider === "mercado_pago") {
    localStorage.setItem(MP_SELECTED_TERMINAL_KEY, terminal.terminalId);
  }
}

function normalizeMercadoPagoSerial(value) {
  const serial = String(value || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return serial.replace(/^N95NCC/, "N950NCC");
}

function mercadoPagoTerminalSerial(terminal) {
  return normalizeMercadoPagoSerial(String(terminal?.id || "").split("__").pop());
}

function mercadoPagoTerminalRegistry(terminal) {
  const serial = mercadoPagoTerminalSerial(terminal);
  return MERCADO_PAGO_TERMINAL_REGISTRY.find((entry) => normalizeMercadoPagoSerial(entry.serial) === serial) || null;
}

function mercadoPagoTerminalNumber(terminal, fallbackIndex = 0) {
  return mercadoPagoTerminalRegistry(terminal)?.number || fallbackIndex + 7;
}

function mercadoPagoTerminalName(terminal, number = 1) {
  const serial = String(terminal.id || "").split("__").pop() || terminal.id || "Terminal";
  const registry = mercadoPagoTerminalRegistry(terminal);
  const label = registry?.label ? ` - ${registry.label}` : "";
  const mode = terminal.operating_mode ? ` - ${terminal.operating_mode}` : "";
  return `Maquininha ${number}${label} - ${serial}${mode}`;
}

function renderPaymentTerminalField({ inputId = "payment-terminal-id", inputName = "" } = {}) {
  const terminals = paymentTerminalOptions();
  const selectedTerminal = getSelectedPaymentTerminal();
  const enabledTerminals = terminals.filter((terminal) => terminal.enabled);
  return `
    <label class="field">
      <span>Maquininha</span>
      <select id="${inputId}" ${inputName ? `name="${inputName}"` : ""} data-payment-terminal>
        ${enabledTerminals.length ? "" : '<option value="">Nenhuma maquininha ativa encontrada</option>'}
        ${terminals
          .map(
            (terminal) =>
              `<option value="${terminal.id}" ${terminal.id === selectedTerminal?.id ? "selected" : ""} ${terminal.enabled ? "" : "disabled"}>${terminal.label}</option>`,
          )
          .join("")}
      </select>
    </label>
  `;
}

async function loadMercadoPagoPointStatus(force = false) {
  if (mercadoPagoPointStatus.checked && !force) return mercadoPagoPointStatus;

  try {
    const { response, data } = await fetchJsonWithTimeout("/api/mercadopago/config");
    if (!response.ok) throw new Error("Endpoint da Vercel ainda nao disponivel.");
    let terminals = [];
    if (data.enabled) {
      const { response: terminalsResponse, data: terminalsData } = await fetchJsonWithTimeout("/api/mercadopago/terminals");
      if (terminalsResponse.ok) terminals = terminalsData?.data?.terminals || [];
    }
    const selectedTerminal = terminals.find((terminal) => terminal.id === data.terminalId);
    mercadoPagoPointStatus = {
      checked: true,
      enabled: Boolean(data.enabled),
      terminal: data.terminal || "",
      terminalId: data.terminalId || "",
      terminals,
      message: data.enabled
        ? `Point configurado no terminal ${data.terminalId || data.terminal || "informado"}${
            selectedTerminal?.operating_mode ? ` em modo ${selectedTerminal.operating_mode}` : ""
          }.`
        : "Configure MP_ACCESS_TOKEN e MP_TERMINAL_ID na Vercel para ativar.",
    };
    if (terminals.length) {
      state.cachedPaymentTerminals = terminals;
      saveState();
    }
  } catch (error) {
    mercadoPagoPointStatus = {
      checked: true,
      enabled: false,
      terminal: "",
      terminalId: "",
      terminals: [],
      message: "Integracao Point indisponivel neste ambiente.",
    };
  }

  return mercadoPagoPointStatus;
}

function saveMercadoPagoPendingOrder(order, context = {}) {
  if (!order?.id) return;
  const orders = getMercadoPagoPendingOrders();
  const previous = orders.find((entry) => entry.id === order.id);
  const next = {
    id: order.id,
    terminalId: context.terminalId || previous?.terminalId || "",
    terminalLabel: context.terminalLabel || previous?.terminalLabel || "",
    accountKey: context.accountKey || previous?.accountKey || "primary",
    amount: context.amount || 0,
    payment: context.payment || "",
    description: context.description || "",
    createdAt: previous?.createdAt || new Date().toISOString(),
    status: order.status || previous?.status || "created",
    statusDetail: order.status_detail || previous?.statusDetail || "",
    checkedAt: previous?.checkedAt || "",
  };
  localStorage.setItem(
    MP_PENDING_ORDER_KEY,
    JSON.stringify([next, ...orders.filter((entry) => entry.id !== order.id)].slice(0, 20)),
  );
}

function getMercadoPagoPendingOrders() {
  try {
    const stored = JSON.parse(localStorage.getItem(MP_PENDING_ORDER_KEY) || "[]");
    if (Array.isArray(stored)) return stored.filter((entry) => entry?.id);
    return stored?.id ? [stored] : [];
  } catch (error) {
    return [];
  }
}

function getMercadoPagoPendingOrder(orderId = "") {
  const orders = getMercadoPagoPendingOrders();
  return (orderId && orders.find((entry) => entry.id === orderId)) || orders[0] || null;
}

function clearMercadoPagoPendingOrder(orderId = "") {
  if (!orderId) {
    localStorage.removeItem(MP_PENDING_ORDER_KEY);
    return;
  }
  const remaining = getMercadoPagoPendingOrders().filter((entry) => entry.id !== orderId);
  if (remaining.length) localStorage.setItem(MP_PENDING_ORDER_KEY, JSON.stringify(remaining));
  else localStorage.removeItem(MP_PENDING_ORDER_KEY);
}

function updateMercadoPagoPendingOrderStatus(statusData) {
  if (!statusData?.id) return;
  const orders = getMercadoPagoPendingOrders();
  const pending = orders.find((entry) => entry.id === statusData.id);
  if (!pending) return;
  localStorage.setItem(
    MP_PENDING_ORDER_KEY,
    JSON.stringify(orders.map((entry) => entry.id === statusData.id ? {
      ...entry,
      status: statusData.status || entry.status || "",
      statusDetail: statusData.status_detail || entry.statusDetail || "",
      checkedAt: new Date().toISOString(),
    } : entry)),
  );
}

function mercadoPagoStatusLabel(statusData) {
  const status = statusData?.status || "sem status";
  const detail = statusData?.status_detail ? ` (${statusData.status_detail})` : "";
  if (status === "created") return `created${detail}: criada no Mercado Pago; abra Inserir valor na Point para puxar a cobranca.`;
  if (status === "at_terminal") return `at_terminal${detail}: a Point recebeu a cobranca; conclua pela tela Inserir valor.`;
  if (status === "processed") return `processed${detail}: pagamento aprovado.`;
  if (status === "canceled") return `canceled${detail}: cobranca cancelada.`;
  if (status === "expired") return `expired${detail}: cobranca expirou.`;
  if (status === "failed") return `failed${detail}: pagamento recusado ou falhou.`;
  if (status === "action_required") return `action_required${detail}: confira a maquininha.`;
  return `${status}${detail}`;
}

async function fetchMercadoPagoOrderStatus(orderId, accountKey = "primary") {
  const { response, data } = await fetchJsonWithTimeout(
    `/api/mercadopago/order-status?id=${encodeURIComponent(orderId)}&accountKey=${encodeURIComponent(accountKey)}`,
    {},
    MP_STATUS_TIMEOUT_MS,
  );
  if (!response.ok) throw new Error(describeMercadoPagoError(data));
  updateMercadoPagoPendingOrderStatus(data);
  return data;
}

async function cancelMercadoPagoOrderById(orderId, accountKey = "primary") {
  const { response, data } = await fetchJsonWithTimeout(
    "/api/mercadopago/cancel-order",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, accountKey }),
    },
  );
  if (!response.ok) throw new Error(describeMercadoPagoError(data));
  clearMercadoPagoPendingOrder(orderId);
  return data;
}

async function releaseStaleMercadoPagoOrders(terminalId, accountKey = "primary") {
  const matchingOrders = getMercadoPagoPendingOrders().filter(
    (entry) => entry.terminalId === terminalId && (entry.accountKey || "primary") === accountKey,
  );
  for (const pending of matchingOrders) {
    try {
      const statusData = await fetchMercadoPagoOrderStatus(pending.id, accountKey);
      if (["processed", "failed", "canceled", "expired", "refunded"].includes(statusData.status)) {
        clearMercadoPagoPendingOrder(pending.id);
        continue;
      }
      const age = Date.now() - Date.parse(pending.createdAt || "");
      if (Number.isFinite(age) && age > 3 * 60 * 1000 && ["created", "at_terminal", "action_required"].includes(statusData.status)) {
        await cancelMercadoPagoOrderById(pending.id, accountKey);
      }
    } catch (error) {
      // A criacao da nova order dara a resposta definitiva caso a fila ainda esteja ocupada.
    }
  }
}

async function checkMercadoPagoPendingOrder(orderId = "") {
  const pending = getMercadoPagoPendingOrder(orderId);
  if (!pending?.id) {
    notify("Nao ha cobranca pendente do Mercado Pago salva neste navegador.");
    return;
  }

  try {
    const data = await fetchMercadoPagoOrderStatus(pending.id, pending.accountKey || "primary");
    if (["processed", "canceled", "expired", "failed", "refunded"].includes(data.status)) clearMercadoPagoPendingOrder(data.id);
    notify(`Mercado Pago: ${mercadoPagoStatusLabel(data)}`);
  } catch (error) {
    notify(`Erro ao consultar a cobranca Point: ${error.message}`);
  }

  renderApp();
}

async function cancelMercadoPagoPendingOrder(orderId = "") {
  const pending = getMercadoPagoPendingOrder(orderId);
  if (!pending?.id) {
    notify("Nao ha cobranca pendente do Mercado Pago salva neste navegador.");
    return;
  }

  notify("Tentando cancelar a cobranca pendente na Point...");
  try {
    await cancelMercadoPagoOrderById(pending.id, pending.accountKey || "primary");
    notify("Cobranca pendente cancelada. Agora voce pode tentar novamente.");
  } catch (error) {
    notify(`Nao foi possivel cancelar pelo app: ${error.message}. Se aparecer na maquininha, cancele pela propria Point.`);
  }

  renderApp();
}

function buildMercadoPagoCustomTicket({ amount, payment, description, items }) {
  const barName = printSafeText(state.settings.barName || APP_DISPLAY_NAME).slice(0, 32);
  const orderDescription = printSafeText(description || "Venda balcao").slice(0, 32);
  const operator = printSafeText(session?.name || "Operador").slice(0, 24);
  const lines = [
    "{br}",
    "--------------------------------",
    `{center}{w}${barName}{/w}{/center}`,
    "{center}{b}FICHA DE CONSUMO{/b}{/center}",
    "--------------------------------",
    `{s}Data: ${printSafeText(dateTime(new Date()))}{/s}`,
    `{s}Operador: ${operator}{/s}`,
    `{s}Origem: ${orderDescription}{/s}`,
    `{s}Pagamento: ${printSafeText(payment)}{/s}`,
    "--------------------------------",
    "{b}ITENS{/b}",
    ...items.map((item) => `{s}${item.qty}x ${printSafeText(item.name).slice(0, 28)} - ${money(item.qty * item.price)}{/s}`),
    "--------------------------------",
    `{center}{w}TOTAL ${money(amount)}{/w}{/center}`,
    "{br}",
    "{center}ENTREGAR MEDIANTE ESTA FICHA{/center}",
    "{br}",
  ];
  const content = lines.join("{br}");
  return content.length < 100 ? `${content}{br}${"-".repeat(100 - content.length)}` : content.slice(0, 4096);
}

async function printMercadoPagoCustomTicket({ terminalId, accountKey = "primary", amount, payment, description, items, orderId }) {
  const response = await fetch("/api/mercadopago/print-ticket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      terminalId,
      accountKey,
      externalReference: `ticket-${orderId || Date.now()}`,
      content: buildMercadoPagoCustomTicket({ amount, payment, description, items }),
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(describeMercadoPagoError(data));
  return data;
}

async function processMercadoPagoPointPayment({ amount, payment, installments = 1, description, terminalId, accountKey = "primary", items = [] }) {
  const config = await loadMercadoPagoPointStatus();
  if (!config.enabled || !isPointPayment(payment)) return { skipped: true };
  const selectedTerminalId = terminalId || getSelectedPaymentTerminal()?.terminalId || "";
  const attemptId = uuid();
  const requestBody = {
    amount,
    paymentMethod: payment,
    installments,
    terminalId: selectedTerminalId,
    accountKey,
    description,
    externalReference: `sale-${attemptId}`,
    idempotencyKey: attemptId,
  };

  notify("Enviando cobranca para a maquininha Mercado Pago...");
  await releaseStaleMercadoPagoOrders(selectedTerminalId, accountKey);
  let createResponse;
  let order;
  let createError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await fetchJsonWithTimeout("/api/mercadopago/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      createResponse = result.response;
      order = result.data;
      createError = null;
      break;
    } catch (error) {
      createError = error;
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  }
  if (!createResponse) {
    return {
      ok: false,
      message: `Mercado Pago nao respondeu: ${createError?.message || "falha de comunicacao"}. A mesma tentativa foi repetida com seguranca; confira a Point antes de enviar outra cobranca.`,
    };
  }
  if (!createResponse.ok) {
    const message = describeMercadoPagoError(order);
    if (/already.*queued|already_queued_order_for_terminal|cobranca.*pendente/i.test(message)) {
      return {
        ok: false,
        message:
          "Mercado Pago: ja existe uma cobranca pendente na maquininha. Cancele na Point configurada; se essa cobranca tiver sido criada nesta nova versao, tambem da para usar Internet > Cancelar cobranca Point.",
      };
    }
    return { ok: false, message: `Mercado Pago: ${message}` };
  }

  saveMercadoPagoPendingOrder(order, { amount, payment, description, terminalId: selectedTerminalId, accountKey });
  notify("Cobranca enviada. Na Point, abra Inserir valor para concluir.");
  const deadline = Date.now() + MP_PAYMENT_DEADLINE_MS;
  let lastStatus = order.status || "created";
  let consecutiveErrors = 0;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, MP_POLL_INTERVAL_MS));
    let statusData;
    try {
      statusData = await fetchMercadoPagoOrderStatus(order.id, accountKey);
      consecutiveErrors = 0;
    } catch (error) {
      consecutiveErrors += 1;
      if (consecutiveErrors < 3) continue;
      return {
        ok: false,
        message: `A cobranca foi enviada, mas a confirmacao online falhou: ${error.message}. Consulte a cobranca antes de tentar novamente.`,
      };
    }
    if (statusData.status !== lastStatus) {
      lastStatus = statusData.status;
      notify(`Point: ${mercadoPagoStatusLabel(statusData)}`);
    }
    if (statusData.status === "processed") {
      clearMercadoPagoPendingOrder(order.id);
      notify("Pagamento aprovado.");
      return { ok: true, order: statusData };
    }
    if (["failed", "canceled", "expired", "refunded"].includes(statusData.status)) {
      clearMercadoPagoPendingOrder(order.id);
      return { ok: false, message: `Pagamento nao aprovado: ${statusData.status_detail || statusData.status}.` };
    }
    if (statusData.status === "action_required") {
      const approved = confirm(
        "A Point pediu conferencia manual e esse status nao sera atualizado pelo Mercado Pago.\n\nO comprovante ou a tela da maquininha mostra PAGAMENTO APROVADO?\n\nClique em OK somente se estiver aprovado. Clique em Cancelar se nao estiver.",
      );
      if (approved) {
        clearMercadoPagoPendingOrder(order.id);
        return {
          ok: true,
          order: { ...statusData, status: "operator_confirmed", status_detail: statusData.status_detail || "check_on_terminal" },
        };
      }
      try {
        await cancelMercadoPagoOrderById(order.id, accountKey);
      } catch (error) {
        return { ok: false, message: `Pagamento nao confirmado. Cancele ou confira a cobranca na Point: ${error.message}` };
      }
      return { ok: false, message: "Cobranca cancelada porque o pagamento nao foi confirmado." };
    }
  }

  try {
    const finalStatus = await fetchMercadoPagoOrderStatus(order.id, accountKey);
    if (finalStatus.status === "processed") {
      clearMercadoPagoPendingOrder(order.id);
      return { ok: true, order: finalStatus };
    }
    if (["created", "at_terminal"].includes(finalStatus.status)) {
      await cancelMercadoPagoOrderById(order.id, accountKey);
      return { ok: false, message: "A Point nao concluiu no tempo limite. A cobranca pendente foi cancelada e o app esta liberado para tentar novamente." };
    }
  } catch (error) {
    return { ok: false, message: `Tempo limite atingido. Confira a Point e use Internet > Consultar ultima cobranca antes de tentar novamente: ${error.message}` };
  }

  const pending = getMercadoPagoPendingOrder(order.id);
  return {
    ok: false,
    message: `Pagamento ainda nao confirmado. Ultimo status: ${pending?.status || lastStatus}. Consulte ou cancele a cobranca antes de tentar novamente.`,
  };
}

async function processPointPaymentBeforeSale({ amount, payment, installments = 1, description, items = [], terminalKey = "" }) {
  if (!isPointPayment(payment)) return { ok: true, terminal: null };

  const selectedTerminal = terminalKey
    ? paymentTerminalOptions().find((terminal) => terminal.id === terminalKey)
    : getSelectedPaymentTerminal();
  if (!selectedTerminal?.enabled) {
    notify("Selecione uma maquininha ativa antes de finalizar.");
    return { ok: false };
  }
  setSelectedPaymentTerminal(selectedTerminal.id);

  if (selectedTerminal.provider === "stone") {
    const installmentLabel = payment === "Credito" ? (Number(installments) === 1 ? " a vista" : ` em ${Number(installments)}x`) : "";
    const approved = confirm(
      `${selectedTerminal.label}\n\nCobre ${money(amount)} em ${payment}${installmentLabel} diretamente na Stone.\n\nClique em OK somente depois que a maquininha mostrar PAGAMENTO APROVADO.`,
    );
    if (!approved) {
      notify("Pagamento Stone nao confirmado. A venda continua aberta.");
      return { ok: false };
    }
    notify("Pagamento Stone confirmado pelo operador.");
    return {
      ok: true,
      terminal: selectedTerminal,
      manual: true,
      paymentReference: {
        provider: "stone",
        reference: "",
        terminalId: selectedTerminal.terminalId || selectedTerminal.id,
        terminalLabel: selectedTerminal.label,
        amount,
        method: payment,
        status: "operator_confirmed",
        checkedAt: new Date().toISOString(),
      },
    };
  }

  await loadMercadoPagoPointStatus(true);
  if (!mercadoPagoPointStatus.enabled) {
    notify("Mercado Pago Point indisponivel. Abra pelo link online da Vercel e confira as variaveis MP_ACCESS_TOKEN e MP_TERMINAL_ID.");
    return { ok: false };
  }

  const pointPayment = await processMercadoPagoPointPayment({
    amount,
    payment,
    installments,
    terminalId: selectedTerminal.terminalId,
    accountKey: selectedTerminal.accountKey || "primary",
    items,
    description,
  });

  if (pointPayment.skipped || !pointPayment.ok) {
    notify(pointPayment.message || "Nao foi possivel enviar a cobranca para a maquininha.");
    return { ok: false };
  }

  return {
    ok: true,
    terminal: selectedTerminal,
    paymentReference: {
      provider: "mercado_pago",
      reference: pointPayment.order?.id || "",
      orderId: pointPayment.order?.id || "",
      accountKey: selectedTerminal.accountKey || "primary",
      terminalId: selectedTerminal.terminalId,
      terminalLabel: selectedTerminal.label,
      amount,
      method: payment,
      status: pointPayment.order?.status || "processed",
      statusDetail: pointPayment.order?.status_detail || "",
      checkedAt: new Date().toISOString(),
    },
  };
}

async function processPointPaymentsBeforeSale({ payment, paymentBreakdown = [], total = 0, terminalKey = "", items = [], description = "" }) {
  const pointParts = pointPaymentPartsForSale({ payment, paymentBreakdown, total });
  let selectedTerminal = null;
  const providerReferences = [];

  for (const part of pointParts) {
    const result = await processPointPaymentBeforeSale({
      amount: part.amount,
      payment: part.method,
      installments: part.installments,
      terminalKey,
      items,
      description: pointParts.length > 1 ? `${description} - ${part.method}` : description,
    });
    if (!result.ok) return { ok: false };
    selectedTerminal = result.terminal || selectedTerminal;
    if (result.paymentReference) providerReferences.push(result.paymentReference);
  }

  return { ok: true, terminal: selectedTerminal, providerReferences };
}

async function setMercadoPagoTerminalMode(operatingMode = "PDV", terminalId = "") {
  if (
    operatingMode === "STANDALONE" &&
    !confirm("Voltar esta maquininha para modo comum? Ela deixara de receber cobrancas enviadas pelo app enquanto estiver fora do modo PDV.")
  ) {
    return;
  }

  try {
    const terminal = mercadoPagoPointStatus.terminals.find((entry) => entry.id === terminalId);
    const response = await fetch("/api/mercadopago/set-terminal-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operatingMode, terminalId, accountKey: terminal?.account_key || "primary" }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(describeMercadoPagoError(data));
    notify(`Modo da maquininha alterado para ${operatingMode}. Reinicie a Point se ela nao atualizar.`);
    await loadMercadoPagoPointStatus(true);
  } catch (error) {
    notify(`Erro ao alterar modo da Point: ${error.message}`);
  }
  renderApp();
}

function usernameMatchesUser(user, normalizedUsername) {
  const names = [user.name, user.email];
  if (user.id === "u-admin") names.push("admin", "administrador");
  return names.some((name) => String(name || "").trim().toLowerCase() === normalizedUsername);
}

function findLocalUser(username, password) {
  const normalizedUsername = username.trim().toLowerCase();
  return state.users.find(
    (item) => !isUuid(item.id) && usernameMatchesUser(item, normalizedUsername) && item.password === password && item.active,
  );
}

async function authorizeAdminPassword(password) {
  const typedPassword = String(password || "");
  if (!typedPassword) return null;

  if (!isOnlineSession()) {
    return state.users.find((user) => user.role === "admin" && user.password === typedPassword && user.active) || null;
  }

  const admins = state.users.filter((user) => user.role === "admin" && user.active && user.email);
  for (const admin of admins) {
    const verifier = supabaseLibrary.createClient(supabaseConfig.url, supabaseConfig.publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { error } = await verifier.auth.signInWithPassword({ email: admin.email, password: typedPassword });
    if (!error) {
      await verifier.auth.signOut({ scope: "local" });
      return admin;
    }
  }
  return null;
}

function localLogin(username, password) {
  const user = findLocalUser(username, password);

  if (!user) {
    notify("Nome de usuario ou senha incorretos.");
    return;
  }

  session = user;
  const preferredView = state.settings.shiftStartView?.[user.role];
  currentView = preferredView && getUserPermissions(user).includes(preferredView) ? preferredView : getUserPermissions(user)[0] || "pos";
  logAudit("Login", `${user.name} acessou o sistema.`);
  saveState();
  void ensureDailyCashOpen({ notifyUser: true });
  renderApp();
}

async function login(username, password) {
  const localUser = findLocalUser(username, password);
  if (localUser?.id === "u-admin") {
    localLogin(username, password);
    return;
  }

  if (isSupabaseReady()) {
    const onlineLoginDone = await loginWithSupabase(username, password);
    if (onlineLoginDone) return;
  }

  localLogin(username, password);
}

async function loginWithSupabase(username, password) {
  try {
    const { data: profiles, error: profileError } = await supabaseClient.rpc("lookup_profile_for_login", {
      username_input: username.trim(),
    });

    if (profileError) throw profileError;
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;
    if (!profile || !profile.active || !profile.email) return false;

    const { error: authError } = await supabaseClient.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (authError) {
      notify("Nome de usuario ou senha incorretos.");
      return true;
    }

    const onlineUser = mapProfileToUser(profile);
    upsertSessionUser(onlineUser);
    session = onlineUser;
    cacheOfflineSession(session);
    await loadOnlineSettings();
    await loadOnlineStockData();
    await loadOnlineClientsData();
    await loadOnlineSalesData();
    await loadOnlineCashData();
    await ensureDailyCashOpen({ notifyUser: true });
    await loadOnlineSupplierData();
    await loadOnlineTableData();
    await loadOnlineProfilesData();
    const preferredView = state.settings.shiftStartView?.[session.role];
    currentView = preferredView && getUserPermissions(session).includes(preferredView) ? preferredView : getUserPermissions(session)[0] || "pos";
    logAudit("Login online", `${session.name} acessou pelo Supabase.`);
    saveState();
    renderApp();
    startRealtimeSync();
    if (pendingOfflineOperations().length) setTimeout(() => syncPendingOfflineSales(), 500);
    return true;
  } catch (error) {
    supabaseStatus = {
      checked: true,
      ok: false,
      message: error.message || "Falha no login online.",
    };
    return false;
  }
}

function mapProfileToUser(profile) {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email || "",
    password: "",
    role: profile.role,
    permissions: profile.role === "admin" ? roles.admin.permissions : normalizePermissions(profile.permissions || []),
    active: profile.active !== false,
    showOnLogin: Boolean(profile.show_on_login),
    online: true,
  };
}

function upsertSessionUser(user) {
  const exists = state.users.some((entry) => entry.id === user.id);
  state.users = exists
    ? state.users.map((entry) => (entry.id === user.id ? { ...entry, ...user } : entry))
    : [...state.users, user];
}

async function loadOnlineSettings() {
  if (!isSupabaseReady()) return;
  const { data, error } = await supabaseClient
    .from("app_settings")
    .select("bar_name, cnpj, address, service_fee, receipt_footer, shift_start_view")
    .eq("id", "main")
    .single();

  if (error || !data) return;
  const advancedResult = await supabaseClient.from("app_settings").select("advanced_settings").eq("id", "main").maybeSingle();
  const advancedSettings = advancedResult.error ? {} : advancedResult.data?.advanced_settings || {};

  const normalizedBarName = normalizeBarName(data.bar_name || state.settings.barName);
  state.settings = {
    ...state.settings,
    syncMode: "supabase",
    barName: normalizedBarName,
    cnpj: data.cnpj || "",
    address: data.address || "",
    serviceFee: Number(data.service_fee || 0),
    receiptFooter: data.receipt_footer || state.settings.receiptFooter,
    shiftStartView: data.shift_start_view || state.settings.shiftStartView,
    ...advancedSettings,
  };

  supabaseStatus = {
    checked: true,
    ok: true,
    message: `Conectado ao banco: ${state.settings.barName}.`,
  };

  if (session?.role === "admin" && data.bar_name !== normalizedBarName) {
    await supabaseClient.from("app_settings").update({ bar_name: normalizedBarName }).eq("id", "main");
  }
}

function isOnlineSession() {
  return Boolean(session?.online && isSupabaseReady() && hasNetworkConnection());
}

function pendingOfflineSalePayloads() {
  return pendingOfflineOperations().map((operation) => operation.payload).filter(Boolean);
}

function buildOfflineKitchenOrders(sale) {
  const grouped = {};
  for (const item of sale.items || []) {
    const product = state.products.find((entry) => entry.id === item.productId);
    const station = product?.station || "Bar";
    if (station !== "Cozinha") continue;
    if (!grouped[station]) grouped[station] = [];
    grouped[station].push({ name: item.name, qty: item.qty });
  }
  return Object.entries(grouped).map(([station, items]) => ({
    id: uuid(),
    saleId: sale.id,
    date: sale.date,
    station,
    status: "Novo",
    items,
    userId: sale.cashierId,
    syncStatus: "pending",
  }));
}

function queueOfflineSale(sale, fiadoAmount = 0, { releaseTable = true, splitBill = null } = {}) {
  const kitchenOrders = buildOfflineKitchenOrders(sale);
  const clientTransaction = fiadoAmount > 0 && sale.clientId
    ? {
        id: uuid(),
        clientId: sale.clientId,
        saleId: sale.id,
        userId: sale.cashierId,
        date: sale.date,
        type: "debito",
        description: sale.items.map((item) => `${item.qty}x ${item.name}`).join(", "),
        amount: fiadoAmount,
      }
    : null;
  const payload = {
    saleId: sale.id,
    date: sale.date,
    cashierId: isUuid(sale.cashierId) ? sale.cashierId : "",
    clientId: isUuid(sale.clientId) ? sale.clientId : "",
    tableId: isUuid(sale.tableId) ? sale.tableId : "",
    releaseTable: Boolean(releaseTable),
    splitBill,
    splitBillId: sale.splitBillId || "",
    splitPersonId: sale.splitPersonId || "",
    splitClaimId: sale.splitClaimId || "",
    payment: encodePaymentDetails({
      payment: sale.payment,
      breakdown: sale.paymentBreakdown,
      cashReceived: sale.cashReceived,
      cashChange: sale.cashChange,
      discount: sale.discount,
      paymentOrigin: sale.paymentOrigin,
      manualReference: sale.manualReference,
      terminalLabel: sale.terminalLabel,
      providerReferences: sale.providerReferences,
      splitPersonName: sale.splitPersonName,
      splitMode: sale.splitMode,
    }),
    serviceFee: Number(sale.serviceFee || 0),
    total: Number(sale.total || 0),
    cost: Number(sale.cost || 0),
    fiadoAmount: Number(fiadoAmount || 0),
    items: (sale.items || []).map((item) => ({
      syncId: uuid(),
      productId: isUuid(item.productId) ? item.productId : "",
      name: item.name,
      qty: Number(item.qty || 0),
      price: Number(item.price || 0),
      cost: Number(item.cost || 0),
    })),
    kitchenOrders,
    clientTransaction,
  };
  state.offlineQueue.push({
    id: sale.id,
    type: "sale",
    status: "pending",
    createdAt: sale.date,
    attempts: 0,
    lastError: "",
    payload,
  });
  state.kitchenOrders.unshift(...kitchenOrders);
  return { kitchenOrders, clientTransaction };
}

function applyPendingOfflineOverlays() {
  pendingOfflineSalePayloads().forEach((payload) => applyCartStock(payload.items || []));
}

function mutatePendingKitchenOrder(orderId, updater) {
  for (const operation of pendingOfflineOperations()) {
    const orders = operation.payload?.kitchenOrders || [];
    const index = orders.findIndex((order) => order.id === orderId);
    if (index < 0) continue;
    const nextOrder = updater(orders[index]);
    if (nextOrder) orders[index] = nextOrder;
    else orders.splice(index, 1);
    return true;
  }
  return false;
}

async function syncPendingOfflineSales({ manual = false, silent = false } = {}) {
  const operations = pendingOfflineOperations();
  if (!operations.length || connectionState.syncing) {
    if (manual && !operations.length) notify("Nao ha vendas offline pendentes.");
    return;
  }
  if (!session?.online || !isSupabaseReady()) {
    if (manual) notify("Entre com um usuario online para sincronizar as vendas pendentes.");
    return;
  }
  if (!(await checkCloudConnection())) {
    if (manual) notify("Ainda estamos sem internet. As vendas continuam protegidas neste aparelho.");
    return;
  }

  connectionState.syncing = true;
  connectionState.lastError = "";
  updateConnectionIndicators();
  let synced = 0;

  for (const operation of [...operations]) {
    operation.attempts = Number(operation.attempts || 0) + 1;
    operation.lastAttemptAt = new Date().toISOString();
    saveState();
    try {
      const { error } = await supabaseClient.rpc("sync_offline_sale", { payload: operation.payload });
      if (error) throw error;
      state.offlineQueue = state.offlineQueue.filter((entry) => entry.id !== operation.id);
      state.sales = state.sales.map((sale) =>
        sale.id === operation.id ? { ...sale, syncStatus: "synced", syncedAt: new Date().toISOString() } : sale,
      );
      synced += 1;
      saveState();
    } catch (error) {
      operation.lastError = error.message || "Falha desconhecida ao sincronizar.";
      connectionState.lastError = operation.lastError;
      if (/failed to fetch|network|load failed/i.test(operation.lastError)) setCloudReachable(false, operation.lastError);
      saveState();
      break;
    }
  }

  connectionState.syncing = false;
  if (synced) {
    connectionState.lastSyncAt = new Date().toISOString();
    await loadOnlineStockData();
    await loadOnlineClientsData();
    await loadOnlineSalesData();
    await loadOnlineTableData();
    logAudit("Contingencia sincronizada", `${synced} venda(s) offline enviada(s) ao Supabase.`);
    saveState();
    if (!silent) notify(`${synced} venda(s) offline sincronizada(s).`);
  } else if (manual) {
    const missingMigration = /sync_offline_sale|schema cache|function/i.test(connectionState.lastError);
    notify(missingMigration ? "Falta executar a migracao do modo offline no Supabase." : `Sincronizacao pendente: ${connectionState.lastError}`);
  }
  if (!currentModal) renderApp();
  else updateConnectionIndicators();
}

function mapProductFromDb(row, recipes = []) {
  return {
    id: row.id,
    createdAt: row.created_at || "",
    name: row.name,
    productCode: row.product_code || "",
    barcodeCodes: Array.isArray(row.barcode_codes) ? row.barcode_codes.filter(Boolean) : [],
    imageUrl: row.image_url || "",
    category: row.category,
    station: row.station || "Bar",
    price: Number(row.price || 0),
    cost: Number(row.cost || 0),
    stock: Number(row.stock || 0),
    minStock: Number(row.min_stock || 0),
    criticalStock: Number(row.critical_stock || 0),
    expiresAt: row.expires_at || "",
    favorite: Boolean(row.favorite),
    active: row.active !== false,
    recipe: recipes
      .filter((recipe) => recipe.product_id === row.id)
      .map((recipe) => ({ ingredientId: recipe.ingredient_id, qty: Number(recipe.qty || 0) })),
  };
}

async function restoreOnlineSession() {
  if (!isSupabaseReady()) return false;
  try {
    const { data: authData } = await supabaseClient.auth.getSession();
    const authUser = authData?.session?.user;
    if (!authUser) return false;

    const { data: profile, error } = await supabaseClient.from("profiles").select("*").eq("id", authUser.id).single();
    if (error || !profile?.active) return false;

    session = mapProfileToUser(profile);
    upsertSessionUser(session);
    cacheOfflineSession(session);
    await loadOnlineSettings();
    await loadOnlineStockData();
    await loadOnlineClientsData();
    await loadOnlineSalesData();
    await loadOnlineCashData();
    await ensureDailyCashOpen({ notifyUser: true });
    await loadOnlineSupplierData();
    await loadOnlineTableData();
    await loadOnlineProfilesData();
    const preferredView = state.settings.shiftStartView?.[session.role];
    currentView = CURRENT_SERVICE_NUMBER > 1 && hasPermission("pos")
      ? "pos"
      : preferredView && hasPermission(preferredView)
        ? preferredView
        : getUserPermissions(session)[0] || "pos";
    if (["pos", "waiter", "sales", "cash"].includes(currentView)) await loadMercadoPagoPointStatus(true);
    renderApp();
    startRealtimeSync();
    return true;
  } catch (error) {
    return false;
  }
}

function normalizeBarcodeCodes(primaryCode, codes = []) {
  const normalizedPrimary = String(primaryCode || "").trim().toLowerCase();
  const seen = new Set(normalizedPrimary ? [normalizedPrimary] : []);
  return codes
    .map((code) => String(code || "").trim())
    .filter((code) => {
      const key = code.toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 5);
}

function productBarcodeCodes(product) {
  return Array.isArray(product?.barcodeCodes) ? product.barcodeCodes.filter(Boolean) : [];
}

function productCodeDisplay(product) {
  const extraCodes = productBarcodeCodes(product);
  if (!product.productCode && !extraCodes.length) return "-";
  return `
    <strong class="product-code-main">${product.productCode || "-"}</strong>
    ${extraCodes.length ? `<small class="product-code-extra">${extraCodes.join(", ")}</small>` : ""}
  `;
}

function productSearchOptionValue(product) {
  const code = product.productCode || productBarcodeCodes(product)[0] || "";
  return [product.name, code].filter(Boolean).join(" | ");
}

function productImageUrl(product) {
  const value = String(product?.imageUrl || "").trim();
  if (!value) return "";
  if (value.startsWith("data:image/")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function productImageAttribution(product) {
  const value = productImageUrl(product);
  if (!value) return null;
  try {
    const url = new URL(value);
    const params = new URLSearchParams(url.hash.slice(1));
    const pageId = params.get("commons");
    if (!pageId || !/^\d+$/.test(pageId)) return null;
    return {
      sourceUrl: `https://commons.wikimedia.org/?curid=${pageId}`,
      license: params.get("license") || "Ver licenca",
      credit: params.get("credit") || "Wikimedia Commons",
    };
  } catch {
    return null;
  }
}

function productImageMarkup(product, className = "product-photo") {
  const url = productImageUrl(product);
  const attribution = productImageAttribution(product);
  return url
    ? `<img class="${className}" src="${escapeHtml(url)}" alt="Foto de ${escapeHtml(product.name || "produto")}"${attribution ? ` title="Imagem: ${escapeHtml(attribution.credit)} - ${escapeHtml(attribution.license)}"` : ""} loading="lazy" />`
    : `<span class="${className} product-photo-empty" aria-hidden="true">${escapeHtml(String(product?.name || "P").slice(0, 1).toUpperCase())}</span>`;
}

function findProductBySearchValue(value) {
  const term = String(value || "").trim().toLowerCase();
  if (!term) return null;
  return (
    state.products.find((product) => product.id === value) ||
    state.products.find((product) => productSearchOptionValue(product).toLowerCase() === term) ||
    state.products.find((product) => product.productCode?.toLowerCase() === term || productBarcodeCodes(product).some((code) => code.toLowerCase() === term)) ||
    state.products.find((product) => product.name.toLowerCase() === term) ||
    null
  );
}

function productAvailableStock(product) {
  if (!product?.recipe?.length) return Number(product?.stock || 0);
  const availableByIngredient = product.recipe.map((recipeItem) => {
    const ingredient = state.ingredients.find((entry) => entry.id === recipeItem.ingredientId);
    const required = Number(recipeItem.qty || 0);
    if (!ingredient || required <= 0) return 0;
    return Math.floor(Number(ingredient.stock || 0) / required);
  });
  return Math.max(0, Math.min(...availableByIngredient));
}

function productStockText(product) {
  const available = productAvailableStock(product);
  return `${qty(available)} un.${product?.recipe?.length ? " por ficha" : ""}`;
}

function productExpiryStatus(product) {
  if (!product.expiresAt) return { label: "Sem validade", className: "muted", days: null };
  const today = startOfToday();
  const expires = new Date(`${product.expiresAt}T00:00:00`);
  const days = Math.ceil((expires - today) / 86400000);
  if (days < 0) return { label: "Vencido", className: "red", days };
  if (days === 0) return { label: "Vence hoje", className: "red", days };
  if (days <= 7) return { label: `${days} dias`, className: "red", days };
  if (days <= 30) return { label: `${days} dias`, className: "amber", days };
  return { label: "Ok", className: "green", days };
}

function formatDateBr(value) {
  if (!value) return "-";
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

function mapIngredientFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    unit: row.unit,
    stock: Number(row.stock || 0),
    minStock: Number(row.min_stock || 0),
    costPerUnit: Number(row.cost_per_unit || 0),
  };
}

function mapLotFromDb(row) {
  return {
    id: row.id,
    createdAt: row.created_at || "",
    itemType: row.item_type,
    itemId: row.item_id,
    batch: row.batch,
    qty: Number(row.qty || 0),
    expiresAt: row.expires_at,
    supplierId: row.supplier_id || "",
  };
}

function mapInventoryFromDb(row) {
  return {
    id: row.id,
    date: row.created_at,
    itemType: row.item_type,
    itemId: row.item_id,
    expected: Number(row.expected || 0),
    counted: Number(row.counted || 0),
    difference: Number(row.difference || 0),
    userId: row.user_id,
    notes: row.notes || "",
  };
}

async function loadOnlineStockData() {
  if (!isOnlineSession()) return;

  const [productsResult, ingredientsResult, recipesResult, lotsResult, inventoryResult] = await Promise.all([
    supabaseClient.from("products").select("*").order("name"),
    supabaseClient.from("ingredients").select("*").order("name"),
    supabaseClient.from("product_recipes").select("*"),
    supabaseClient.from("product_lots").select("*").order("expires_at"),
    supabaseClient.from("inventory_counts").select("*").order("created_at", { ascending: false }),
  ]);

  const error = productsResult.error || ingredientsResult.error || recipesResult.error || lotsResult.error || inventoryResult.error;
  if (error) {
    notify(`Falha ao carregar estoque online: ${error.message}`);
    return;
  }

  const recipes = recipesResult.data || [];
  state.products = (productsResult.data || []).map((row) => mapProductFromDb(row, recipes));
  state.ingredients = (ingredientsResult.data || []).map(mapIngredientFromDb);
  state.stockLots = (lotsResult.data || []).map(mapLotFromDb);
  state.inventoryCounts = (inventoryResult.data || []).map(mapInventoryFromDb);
  applyPendingOfflineOverlays();
  saveState();
}

function mapClientFromDb(row, transactions = []) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone || "",
    debt: Number(row.debt || 0),
    creditLimit: Number(row.credit_limit || 0),
    notes: row.notes || "",
    transactions: transactions
      .filter((transaction) => transaction.client_id === row.id)
      .map((transaction) => ({
        id: transaction.id,
        date: transaction.created_at,
        type: transaction.type,
        description: transaction.description,
        amount: Number(transaction.amount || 0),
        saleId: transaction.sale_id,
        userId: transaction.user_id,
      })),
  };
}

async function loadOnlineClientsData() {
  if (!isOnlineSession()) return;

  const [clientsResult, transactionsResult] = await Promise.all([
    supabaseClient.from("clients").select("*").order("name"),
    supabaseClient.from("client_transactions").select("*").order("created_at", { ascending: false }),
  ]);

  const error = clientsResult.error || transactionsResult.error;
  if (error) {
    notify(`Falha ao carregar clientes online: ${error.message}`);
    return;
  }

  state.clients = (clientsResult.data || []).map((row) => mapClientFromDb(row, transactionsResult.data || []));
  pendingOfflineSalePayloads().forEach((payload) => {
    if (!payload.clientId || Number(payload.fiadoAmount || 0) <= 0) return;
    state.clients = state.clients.map((client) =>
      client.id === payload.clientId
        ? {
            ...client,
            debt: Number(client.debt || 0) + Number(payload.fiadoAmount || 0),
            transactions: payload.clientTransaction
              ? [payload.clientTransaction, ...(client.transactions || [])]
              : client.transactions || [],
          }
        : client,
    );
  });
  saveState();
}

function mapSaleFromDb(row, items = []) {
  const paymentDetails = parsePaymentDetails(row.payment);
  const saleItems = items
    .filter((item) => item.sale_id === row.id)
    .map((item) => ({
      productId: item.product_id,
      name: item.name,
      qty: Number(item.qty || 0),
      price: Number(item.price || 0),
      cost: Number(item.cost || 0),
    }));

  return {
    id: row.id,
    date: row.created_at,
    cashierId: row.cashier_id,
    clientId: row.client_id,
    tableId: row.table_id,
    payment: paymentDetails.payment,
    paymentBreakdown: paymentDetails.paymentBreakdown,
    cashReceived: paymentDetails.cashReceived,
    cashChange: paymentDetails.cashChange,
    discount: paymentDetails.discount,
    paymentOrigin: paymentDetails.paymentOrigin,
    manualReference: paymentDetails.manualReference,
    terminalLabel: paymentDetails.terminalLabel,
    providerReferences: paymentDetails.providerReferences,
    splitPersonName: paymentDetails.splitPersonName,
    splitMode: paymentDetails.splitMode,
    discountAmount: Number(paymentDetails.discount?.amount || 0),
    syncStatus: "synced",
    status: row.status || "Concluida",
    serviceFee: Number(row.service_fee || 0),
    cancelledAt: row.cancelled_at,
    cancelledBy: row.cancelled_by,
    cancelReason: row.cancel_reason,
    total: Number(row.total || 0),
    cost: Number(row.cost || 0),
    items: saleItems,
  };
}

function mapKitchenOrderFromDb(row) {
  return {
    id: row.id,
    saleId: row.sale_id,
    date: row.created_at,
    station: row.station,
    status: row.status || "Novo",
    items: Array.isArray(row.items) ? row.items : [],
    userId: row.user_id,
  };
}

async function loadOnlineKitchenData() {
  if (!isOnlineSession()) return false;
  const result = await supabaseClient.from("kitchen_orders").select("*").order("created_at", { ascending: false });
  if (result.error) {
    console.warn("Falha ao atualizar cozinha em tempo real", result.error.message);
    return false;
  }
  const onlineKitchenOrders = (result.data || []).map(mapKitchenOrderFromDb);
  const onlineKitchenIds = new Set(onlineKitchenOrders.map((order) => order.id));
  const pendingKitchenOrders = pendingOfflineSalePayloads()
    .flatMap((payload) => payload.kitchenOrders || [])
    .filter((order) => !onlineKitchenIds.has(order.id));
  state.kitchenOrders = [...onlineKitchenOrders, ...pendingKitchenOrders];
  saveState();
  return true;
}

async function loadAllOnlineRows(table, orderColumn = "id") {
  const pageSize = 500;
  const rows = [];

  for (let offset = 0; ; offset += pageSize) {
    let query = supabaseClient.from(table).select("*").order(orderColumn, { ascending: true });
    if (orderColumn !== "id") query = query.order("id", { ascending: true });
    const result = await query.range(offset, offset + pageSize - 1);
    if (result.error) return result;
    rows.push(...(result.data || []));
    if ((result.data || []).length < pageSize) return { data: rows, error: null };
  }
}

async function loadOnlineSalesData() {
  if (!isOnlineSession()) return false;
  const pendingLocalSales = state.sales.filter((sale) => sale.syncStatus === "pending");

  const [salesResult, saleItemsResult, kitchenResult] = await Promise.all([
    loadAllOnlineRows("sales", "created_at"),
    loadAllOnlineRows("sale_items"),
    supabaseClient.from("kitchen_orders").select("*").order("created_at", { ascending: false }),
  ]);

  const error = salesResult.error || saleItemsResult.error || kitchenResult.error;
  if (error) {
    notify(`Falha ao carregar vendas online: ${error.message}`);
    return false;
  }

  const itemsBySale = new Map();
  (saleItemsResult.data || []).forEach((item) => {
    if (!itemsBySale.has(item.sale_id)) itemsBySale.set(item.sale_id, []);
    itemsBySale.get(item.sale_id).push(item);
  });
  const onlineSales = (salesResult.data || []).map((row) => mapSaleFromDb(row, itemsBySale.get(row.id) || []));
  const onlineSaleIds = new Set(onlineSales.map((sale) => sale.id));
  state.sales = [...onlineSales, ...pendingLocalSales.filter((sale) => !onlineSaleIds.has(sale.id))];
  const onlineKitchenOrders = (kitchenResult.data || []).map(mapKitchenOrderFromDb);
  const onlineKitchenIds = new Set(onlineKitchenOrders.map((order) => order.id));
  const pendingKitchenOrders = pendingOfflineSalePayloads()
    .flatMap((payload) => payload.kitchenOrders || [])
    .filter((order) => !onlineKitchenIds.has(order.id));
  state.kitchenOrders = [...onlineKitchenOrders, ...pendingKitchenOrders];
  rebuildDailySalesTotalsFromSales("sincronizacao Supabase");
  saveState();
  return true;
}

async function refreshSalesFromCloud({ silent = false } = {}) {
  if (!isOnlineSession()) {
    if (!silent) notify("Conecte-se ao Supabase para atualizar as vendas.");
    return false;
  }
  if (onlineSalesRefreshInProgress) return false;

  onlineSalesRefreshInProgress = true;
  try {
    const loaded = await loadOnlineSalesData();
    if (!loaded) return false;
    await loadOnlineCashData();
    rebuildDailySalesTotalsFromSales("sincronizacao Supabase");
    saveState();
    if (!silent) notify(`${state.sales.length} venda(s) atualizada(s) pelo Supabase.`);
    renderApp();
    return true;
  } finally {
    onlineSalesRefreshInProgress = false;
  }
}

function mapCashSessionFromDb(row) {
  return {
    id: row.id,
    cashCode: row.cash_code || "",
    openedAt: row.opened_at,
    closedAt: row.closed_at,
    userId: row.user_id,
    openingAmount: Number(row.opening_amount || 0),
    closingAmount: row.closing_amount === null ? null : Number(row.closing_amount || 0),
    closingBreakdown: row.closing_breakdown || null,
    expectedAmount: row.expected_amount === null ? null : Number(row.expected_amount || 0),
    difference: row.difference === null ? null : Number(row.difference || 0),
    notes: row.notes || "",
  };
}

function mapCashMovementFromDb(row) {
  return {
    id: row.id,
    date: row.created_at,
    type: row.type,
    amount: Number(row.amount || 0),
    reason: row.reason || "",
    userId: row.user_id,
  };
}

async function loadOnlineCashData() {
  if (!isOnlineSession()) return false;

  const [sessionsResult, movementsResult] = await Promise.all([
    supabaseClient.from("cash_sessions").select("*").order("opened_at", { ascending: true }),
    supabaseClient.from("cash_movements").select("*").order("created_at", { ascending: true }),
  ]);

  const error = sessionsResult.error || movementsResult.error;
  if (error) {
    notify(`Falha ao carregar caixa online: ${error.message}`);
    return false;
  }

  state.cashSessions = (sessionsResult.data || []).map(mapCashSessionFromDb);
  state.cashMovements = (movementsResult.data || []).map(mapCashMovementFromDb);
  automaticCashLastCloudRefreshAt = Date.now();
  saveState();
  return true;
}

function mapSupplierFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact || "",
    phone: row.phone || "",
    phone2: row.phone_2 || "",
    phone3: row.phone_3 || "",
    phone4: row.phone_4 || "",
    phone5: row.phone_5 || "",
    email: row.email || "",
    cnpj: row.cnpj || "",
    address: row.address || "",
  };
}

function mapPurchaseFromDb(row) {
  return {
    id: row.id,
    date: row.created_at,
    supplierId: row.supplier_id || "",
    itemName: row.item_name,
    qty: Number(row.qty || 0),
    unitCost: Number(row.unit_cost || 0),
    total: Number(row.total || 0),
    userId: session?.id || "",
  };
}

function mapExpenseFromDb(row) {
  const amount = Number(row.amount || 0);
  const paidAmount = Number(row.paid_amount ?? (row.paid ? amount : 0));
  return {
    id: row.id,
    createdAt: row.created_at,
    description: row.description,
    category: row.category || "",
    amount,
    expenseDate: row.expense_date || String(row.created_at || "").slice(0, 10),
    dueDate: row.due_date,
    paidAmount: Math.min(amount, Math.max(0, paidAmount)),
    paymentHistory: Array.isArray(row.payment_history) ? row.payment_history : [],
    recurring: Boolean(row.recurring),
    recurringDay: Number(row.recurring_day || String(row.due_date || "").slice(-2)) || null,
    recurringFrom: row.recurring_from || null,
    paid: Boolean(row.paid || paidAmount >= amount),
    paidAt: row.paid_at || null,
  };
}

async function loadOnlineSupplierData() {
  if (!isOnlineSession()) return;

  const [suppliersResult, purchasesResult, expensesResult] = await Promise.all([
    supabaseClient.from("suppliers").select("*").order("name", { ascending: true }),
    supabaseClient.from("purchases").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("expenses").select("*").order("due_date", { ascending: true }),
  ]);

  const error = suppliersResult.error || purchasesResult.error || expensesResult.error;
  if (error) {
    notify(`Falha ao carregar fornecedores online: ${error.message}`);
    return;
  }

  state.suppliers = (suppliersResult.data || []).map(mapSupplierFromDb);
  state.purchases = (purchasesResult.data || []).map(mapPurchaseFromDb);
  state.expenses = (expensesResult.data || []).map(mapExpenseFromDb);
  saveState();
}

function mapTableFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    customerName: row.customer_name || "",
    status: row.status || "Livre",
    openedAt: row.opened_at || null,
    serverId: row.server_id || null,
    clientId: row.client_id || null,
    items: Array.isArray(row.items) ? row.items : [],
    splitBill: row.split_bill && typeof row.split_bill === "object" ? row.split_bill : null,
  };
}

function tableSortValue(table) {
  const number = Number(String(table.name || "").match(/\d+/)?.[0] || 0);
  return number || 9999;
}

function nextTableNumber() {
  const highestNumber = state.tables.reduce((highest, table) => {
    const number = Number(String(table.name || "").match(/\d+/)?.[0] || 0);
    return Math.max(highest, number);
  }, 0);
  return highestNumber + 1;
}

function tableCreationPreview(count) {
  const amount = Math.max(1, Math.min(30, Number(count) || 1));
  const firstNumber = nextTableNumber();
  const lastNumber = firstNumber + amount - 1;
  return amount === 1
    ? `Sera criada a Mesa ${firstNumber}.`
    : `Serao criadas as mesas ${firstNumber} a ${lastNumber}.`;
}

async function loadOnlineTableData() {
  if (!isOnlineSession()) return;

  const result = await supabaseClient.from("bar_tables").select("*").order("name", { ascending: true });
  if (result.error) {
    notify(`Falha ao carregar mesas online: ${result.error.message}`);
    return;
  }

  if (!result.data?.length) {
    const rows = Array.from({ length: 12 }, (_, index) => ({ name: `Mesa ${index + 1}`, customer_name: "" }));
    const seedResult = await supabaseClient.from("bar_tables").insert(rows);
    if (seedResult.error) {
      notify(`Falha ao criar mesas online: ${seedResult.error.message}`);
      return;
    }
    await loadOnlineTableData();
    return;
  }

  state.tables = result.data.map(mapTableFromDb).sort((a, b) => tableSortValue(a) - tableSortValue(b));
  const pendingTables = new Map();
  pendingOfflineSalePayloads().forEach((payload) => {
    if (payload.tableId) pendingTables.set(payload.tableId, payload);
  });
  state.tables = state.tables.map((table) =>
    pendingTables.has(table.id)
      ? pendingTables.get(table.id).releaseTable !== false
        ? { ...table, status: "Livre", openedAt: null, serverId: null, clientId: null, customerName: "", items: [], splitBill: null }
        : { ...table, status: "Fechamento", serverId: session?.id || table.serverId, splitBill: pendingTables.get(table.id).splitBill || table.splitBill }
      : table,
  );
  saveState();
}

async function loadOnlineProfilesData() {
  if (!isOnlineSession()) return;

  const { data, error } = await supabaseClient.from("profiles").select("*").order("name", { ascending: true });
  if (error) {
    notify(`Falha ao carregar usuarios online: ${error.message}`);
    return;
  }

  const onlineUsers = (data || []).map(mapProfileToUser);
  const localOnlyUsers = state.users.filter((user) => !isUuid(user.id));
  state.users = [...onlineUsers, ...localOnlyUsers];
  const currentUser = state.users.find((user) => user.id === session.id);
  if (currentUser) {
    session = { ...currentUser, online: true };
    cacheOfflineSession(session);
  }
  saveState();
}

async function logout() {
  stopRealtimeSync();
  if (isSupabaseReady()) {
    await supabaseClient.auth.signOut({ scope: "local" }).catch(() => {});
  }
  session = null;
  localStorage.removeItem(OFFLINE_SESSION_KEY);
  cart = [];
  tableCheckout = null;
  currentView = "dashboard";
  renderLogin();
}

function renderLogin() {
  applyAppearance();
  const quickUsers = state.users.filter((user) => user.active && user.showOnLogin);
  app.innerHTML = `
    <main class="login-shell">
      <section class="login-brand">
        <img class="login-logo" src="${BRAND_LOGO_URL}" alt="Logo ${APP_DISPLAY_NAME}" />
        <div class="rubro-login-badge" aria-label="Tema Flamengo rubro-negro">
          <img src="${FLAMENGO_CREST_URL}" alt="Escudo do Clube de Regatas do Flamengo" />
          <span><strong>FLAMENGO</strong><small>NAÇÃO RUBRO-NEGRA</small></span>
        </div>
        <h1>${state.settings.barName || APP_DISPLAY_NAME}</h1>
        <p>Caixa, estoque, vendas e equipe em uma operacao unica para a distribuidora.</p>
      </section>
      <section class="login-panel">
        <h2>Acessar sistema</h2>
        <p class="hint">${isSupabaseReady() ? "Login real conectado ao Supabase." : "Entre com uma conta autorizada."}</p>
        <form id="login-form" autocomplete="off">
          <label class="field">
            <span>Nome do usuario</span>
            <input name="username" type="text" autocomplete="off" required />
          </label>
          <label class="field">
            <span>Senha</span>
            <input name="password" type="password" autocomplete="off" data-lpignore="true" data-1p-ignore required />
          </label>
          <button class="btn primary" type="submit">Entrar</button>
          ${
            isStandaloneApp()
              ? ""
              : `<button class="btn secondary install-app-btn" type="button" data-install-app>${icon("download")} Instalar no celular ou computador</button>`
          }
          <button class="btn secondary login-palette-toggle" type="button" data-login-palette-toggle>
            ${icon("palette")} Cores: ${paletteLabel()}
          </button>
        </form>
        ${
          quickUsers.length
            ? `<div class="quick-login">
                <strong>Acesso rapido</strong>
                <div class="quick-login-grid">
                  ${quickUsers
                    .map(
                      (user) => `
                        <button class="quick-login-btn" type="button" data-fill-login="${user.name}">
                          <span>${user.name}</span>
                          <small>${roles[user.role]?.label || "Usuario"}</small>
                        </button>
                      `,
                    )
                    .join("")}
                </div>
              </div>`
            : ""
        }
      </section>
    </main>
  `;

  document.querySelector("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = form.get("username").trim();
    const password = form.get("password").trim();
    event.currentTarget.querySelector('input[name="password"]').value = "";
    await login(username, password);
  });

  document.querySelectorAll("[data-fill-login]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector('input[name="username"]').value = button.dataset.fillLogin;
      const passwordInput = document.querySelector('input[name="password"]');
      passwordInput.value = "";
      passwordInput.focus();
    });
  });
  document.querySelector("[data-install-app]")?.addEventListener("click", installApp);
  document.querySelector("[data-login-palette-toggle]")?.addEventListener("click", togglePalette);

}

function renderApp() {
  if (!session) {
    renderLogin();
    return;
  }

  applyAppearance();
  if (!hasPermission(currentView)) {
    currentView = visibleNav()[0]?.id || "dashboard";
  }

  const nav = visibleNav();
  const title = navItems.find((item) => item.id === currentView)?.label || "Painel";
  const connection = connectionPresentation();

  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand-block">
          <div class="brand-emblems">
            <img class="brand-mark" src="${BRAND_ICON_URL}" alt="Logo ${APP_DISPLAY_NAME}" />
            <img class="rubro-sidebar-crest" src="${FLAMENGO_CREST_URL}" alt="Escudo do Clube de Regatas do Flamengo" />
          </div>
          <strong>${state.settings.barName || APP_DISPLAY_NAME}</strong>
          <span>${roles[session.role].label}</span>
          <div class="rubro-sidebar-ribbon"><b>FLAMENGO</b><small>TEMA RUBRO-NEGRO</small></div>
        </div>
        <nav class="nav">
          ${nav
            .map(
              (item) => `
                <button type="button" class="${item.id === currentView ? "active" : ""}" data-view="${item.id}">
                  <span class="nav-icon">${icon(item.icon)}</span>
                  <span>${item.label}</span>
                </button>
              `,
            )
            .join("")}
        </nav>
        <div class="sidebar-footer">
          <div class="user-chip">
            <span class="avatar">${session.name.slice(0, 1)}</span>
            <div>
              <strong>${session.name}</strong>
              <span>${session.email}</span>
            </div>
          </div>
        </div>
      </aside>

      <main class="main">
        <header class="topbar">
          <button class="icon-btn mobile-menu" type="button" id="open-menu" title="Menu">${icon("menu")}</button>
          <div class="topbar-heading">
            <img class="rubro-topbar-crest" src="${FLAMENGO_CREST_URL}" alt="" />
            <div>
              <h1>${title}</h1>
              <p>${topbarSubtitle(currentView)}</p>
            </div>
          </div>
          <div class="top-actions">
            <button class="connection-chip ${connection.tone}" type="button" data-connection-chip data-sync-pending title="${connection.title}">
              ${icon("online")} <span data-connection-label>${connection.label}</span>
            </button>
            <button
              class="icon-btn live-refresh"
              type="button"
              data-refresh-realtime
              title="Atualizar dados dos outros computadores"
              aria-label="Atualizar dados dos outros computadores"
            >
              ${icon("refresh")}
            </button>
            ${
              isStandaloneApp()
                ? ""
                : `<button class="btn secondary compact install-topbar" type="button" data-install-app>${icon("download")} Instalar app</button>`
            }
            <button class="icon-btn" type="button" id="theme-toggle" title="Alternar tema">
              ${icon(state.settings.theme === "dark" ? "sun" : "moon")}
            </button>
            <button
              class="btn secondary compact palette-toggle ${activePalette()}-active"
              type="button"
              id="palette-toggle"
              title="Alternar paleta. Atual: ${paletteLabel()}"
              aria-label="Alternar paleta. Atual: ${paletteLabel()}"
            >
              ${icon("palette")} <span>Cores</span>
            </button>
            <button class="btn secondary compact" type="button" id="logout">${icon("logout")} Sair</button>
          </div>
        </header>
        <section class="content" id="content">${renderView()}</section>
      </main>
    </div>
    ${currentModal ? renderModal() : ""}
  `;

  bindAppEvents();
  bindViewEvents();
}

function topbarSubtitle(view) {
  const subtitles = {
    dashboard: "Resumo do turno e alertas importantes.",
    pos: "Venda de balcao com botoes grandes e categorias.",
    tables: "Mapa de mesas, comandas abertas e fechamento.",
    waiter: "Comanda rapida para usar no celular.",
    kitchen: "Fila de preparo para cozinha e bar.",
    sales: "Historico de vendas e formas de pagamento.",
    cash: "Abertura, movimentacoes e fechamento do caixa.",
    stock: "Controle de saldo e reposicao.",
    inventory: "Contagem fisica e divergencias.",
    products: "Cadastro de itens vendidos pela distribuidora.",
    suppliers: "Compras, entradas e fornecedores.",
    clients: "Controle de fiado e clientes.",
    catalog: "Lista de produtos e precos para apresentar aos clientes.",
    assistant: "Converse com a IA e confirme tarefas no sistema.",
    reports: "Analises e exportacao de relatorios.",
    team: "Usuarios, senhas e permissoes.",
    settings: "Dados da distribuidora e inicio por cargo.",
    online: "Checklist para login real, internet e tempo real.",
  };
  return subtitles[view] || "";
}

function renderView() {
  const views = {
    dashboard: renderDashboard,
    pos: renderPos,
    tables: renderTables,
    waiter: renderWaiter,
    kitchen: renderKitchen,
    sales: renderSales,
    cash: renderCash,
    stock: renderStock,
    inventory: renderInventory,
    products: renderProducts,
    suppliers: renderSuppliers,
    clients: renderClients,
    catalog: renderPriceCatalog,
    assistant: renderAssistant,
    reports: renderReports,
    team: renderTeam,
    settings: renderSettings,
    online: renderOnline,
  };
  return views[currentView]();
}

function bindAppEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#sidebar")?.classList.remove("open");
      setView(button.dataset.view);
    });
  });

  document.querySelector("#logout").addEventListener("click", logout);
  document.querySelector("#theme-toggle")?.addEventListener("click", () => {
    state.settings.theme = state.settings.theme === "dark" ? "light" : "dark";
    logAudit("Tema alterado", `Tema ${state.settings.theme}.`);
    saveState();
    renderApp();
  });
  document.querySelector("#palette-toggle")?.addEventListener("click", togglePalette);
  document.querySelector("#open-menu")?.addEventListener("click", () => {
    document.querySelector("#sidebar")?.classList.toggle("open");
  });
  document.querySelector("[data-install-app]")?.addEventListener("click", installApp);
  document.querySelectorAll("[data-sync-pending]").forEach((button) => {
    button.addEventListener("click", () => syncPendingOfflineSales({ manual: true }));
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });
}

function bindViewEvents() {
  document.querySelector("#assistant-form")?.addEventListener("submit", sendAssistantMessage);
  document.querySelectorAll("[data-assistant-prompt]").forEach((button) => {
    button.addEventListener("click", () => askAssistant(button.dataset.assistantPrompt));
  });
  document.querySelector("[data-confirm-assistant-action]")?.addEventListener("click", executeAssistantAction);
  document.querySelector("[data-cancel-assistant-action]")?.addEventListener("click", () => {
    assistantPendingAction = null;
    assistantMessages.push({ role: "assistant", content: "Acao cancelada. Nenhum dado foi alterado." });
    renderApp();
  });
  const search = document.querySelector("[data-search]");
  if (search) {
    search.value = searchTerm;
    search.addEventListener("input", (event) => {
      searchTerm = event.target.value;
      const cursor = event.target.selectionStart || searchTerm.length;
      clearTimeout(searchRenderTimer);
      searchRenderTimer = setTimeout(() => {
        renderApp();
        const nextSearch = document.querySelector("[data-search]");
        if (nextSearch) {
          nextSearch.focus();
          nextSearch.setSelectionRange(cursor, cursor);
        }
      }, 120);
    });
  }

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      currentModal = {
        type: button.dataset.openModal,
        id: button.dataset.id || null,
        invoiceId: button.dataset.invoiceId || null,
        recurring: button.dataset.recurring === "true",
        movementType: button.dataset.movementType || null,
      };
      if (button.dataset.openModal === "table" && button.dataset.id) selectedTableId = button.dataset.id;
      renderApp();
      if (["externalPayment", "manualCharge"].includes(button.dataset.openModal) && !mercadoPagoPointStatus.checked) {
        loadMercadoPagoPointStatus(true).then(() => renderApp());
      }
    });
  });

  document.querySelectorAll("[data-add-product]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.addProduct));
  });

  document.querySelectorAll("[data-add-table-product]").forEach((button) => {
    button.addEventListener("click", () => addProductToTable(button.dataset.tableId, button.dataset.addTableProduct));
  });

  document.querySelectorAll("[data-select-table]").forEach((button) => {
    button.addEventListener("click", () => selectTable(button.dataset.selectTable));
  });

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      categoryFilter = button.dataset.category;
      renderApp();
    });
  });

  document.querySelectorAll("[data-stock-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      stockSortMode = button.dataset.stockSort;
      renderApp();
    });
  });
  document.querySelector("[data-recover-stock-history]")?.addEventListener("click", recoverRecentStockHistory);

  document.querySelector("[data-payment-terminal]")?.addEventListener("change", (event) => {
    setSelectedPaymentTerminal(event.target.value);
  });

  document.querySelectorAll("[data-cart-minus]").forEach((button) => {
    button.addEventListener("click", () => changeCartQty(button.dataset.cartMinus, -1));
  });

  document.querySelectorAll("[data-cart-plus]").forEach((button) => {
    button.addEventListener("click", () => changeCartQty(button.dataset.cartPlus, 1));
  });

  document.querySelector("[data-clear-cart]")?.addEventListener("click", async () => {
    await releaseTableSplitPaymentClaim(tableCheckout);
    cart = [];
    tableCheckout = null;
    renderApp();
  });

  document.querySelectorAll("[data-finalize-sale]").forEach((button) => {
    button.addEventListener("click", openSalePaymentModal);
  });
  document.querySelector("[data-new-service]")?.addEventListener("click", () => {
    const url = new URL(window.location.href);
    const nextNumber = Math.max(CURRENT_SERVICE_NUMBER + 1, Number(localStorage.getItem("barcontrol:service-counter") || 1) + 1);
    localStorage.setItem("barcontrol:service-counter", String(nextNumber));
    url.searchParams.set("atendimento", String(nextNumber));
    const opened = window.open(url.href, "_blank", "noopener");
    if (!opened) notify("O navegador bloqueou a nova aba. Libere pop-ups para abrir outro atendimento.");
  });
  document.querySelector("[data-test-supabase]")?.addEventListener("click", testSupabaseConnection);
  document.querySelectorAll("[data-refresh-realtime]").forEach((button) => button.addEventListener("click", () => {
    if (!isOnlineSession()) {
      notify("A atualizacao entre computadores precisa de uma sessao online.");
      return;
    }
    queueFullRealtimeRefresh();
    notify(realtimeInteractionLocked() ? "Atualizacao programada para depois da operacao atual." : "Atualizando dados dos outros computadores...");
  }));
  document.querySelector("[data-test-mercadopago]")?.addEventListener("click", async () => {
    await loadMercadoPagoPointStatus(true);
    notify(mercadoPagoPointStatus.message);
    renderApp();
  });
  document.querySelector("[data-set-point-pdv]")?.addEventListener("click", () => setMercadoPagoTerminalMode("PDV"));
  document.querySelectorAll("[data-set-point-terminal-pdv]").forEach((button) => {
    button.addEventListener("click", () => setMercadoPagoTerminalMode("PDV", button.dataset.setPointTerminalPdv));
  });
  document.querySelectorAll("[data-set-point-terminal-standalone]").forEach((button) => {
    button.addEventListener("click", () => setMercadoPagoTerminalMode("STANDALONE", button.dataset.setPointTerminalStandalone));
  });
  document.querySelector("[data-check-point-order]")?.addEventListener("click", () => checkMercadoPagoPendingOrder());
  document.querySelector("[data-cancel-point-order]")?.addEventListener("click", () => cancelMercadoPagoPendingOrder());
  document.querySelector("[data-export-sales]")?.addEventListener("click", exportSalesCsv);
  document.querySelector("[data-refresh-sales]")?.addEventListener("click", () => refreshSalesFromCloud());
  document.querySelector("[data-print-report]")?.addEventListener("click", () => printReport("complete"));
  document.querySelectorAll("[data-print-daily-sales-report]").forEach((button) => {
    button.addEventListener("click", downloadDailySalesReportPdf);
  });
  document.querySelectorAll("[data-print-sales-period-report]").forEach((button) => {
    button.addEventListener("click", () => downloadSalesPeriodReportPdf(button.dataset.printSalesPeriodReport));
  });
  document.querySelectorAll("[data-store-daily-sales-total]").forEach((button) => {
    button.addEventListener("click", () => {
      const summary = storeDailySalesTotal(localDateKey(), "manual");
      saveState();
      notify(summary ? `Total de hoje armazenado: ${money(summary.totalSold)} vendido.` : "Nao ha vendas de hoje para armazenar.");
      renderApp();
    });
  });
  document.querySelector("[data-print-cash-report]")?.addEventListener("click", () => printReport("cash"));
  document.querySelector("[data-print-stock-report]")?.addEventListener("click", () => printReport("stock"));
  document.querySelector("[data-print-inventory-report]")?.addEventListener("click", downloadInventoryPdf);
  document.querySelector("[data-download-price-catalog]")?.addEventListener("click", downloadPriceCatalogPdf);
  document.querySelector("[data-print-clients-report]")?.addEventListener("click", () => printReport("clients"));
  document.querySelector("#report-filter-form")?.addEventListener("submit", applyReportFilter);

  document.querySelectorAll("[data-print-sale]").forEach((button) => {
    button.addEventListener("click", () => printSale(button.dataset.printSale));
  });
  document.querySelectorAll("[data-print-ticket]").forEach((button) => {
    button.addEventListener("click", () => printSaleTicketsIndividual(button.dataset.printTicket));
  });
  document.querySelectorAll("[data-print-last-tickets]").forEach((button) => {
    button.addEventListener("click", () => printSaleTicketsIndividual(button.dataset.printLastTickets));
  });

  document.querySelectorAll("[data-order-status]").forEach((button) => {
    button.addEventListener("click", () => updateKitchenOrder(button.dataset.orderStatus, button.dataset.status));
  });

  document.querySelectorAll("[data-remove-order]").forEach((button) => {
    button.addEventListener("click", () => removeKitchenOrder(button.dataset.removeOrder));
  });

  document.querySelector("[data-clear-sales]")?.addEventListener("click", clearSales);
  document.querySelectorAll("[data-zero-today-sales]").forEach((button) => {
    button.addEventListener("click", zeroTodaySales);
  });
  document.querySelector("#sales-date-filter-form")?.addEventListener("submit", applySalesDateFilter);
  document.querySelector("[data-clear-sales-date-filter]")?.addEventListener("click", clearSalesDateFilter);
  document.querySelector("[data-restore-zeroed-sales-date]")?.addEventListener("click", restoreZeroedSalesForSelectedDate);
  document.querySelectorAll("[data-close-cash-sales-report]").forEach((button) => {
    button.addEventListener("click", () => closeCashAndDownloadSalesReport(button.dataset.closeCashSalesReport === "form"));
  });

  document.querySelectorAll("[data-remove-product]").forEach((button) => {
    button.addEventListener("click", () => removeProduct(button.dataset.removeProduct));
  });

  document.querySelectorAll("[data-pay-expense]").forEach((button) => {
    button.addEventListener("click", () => payExpense(button.dataset.payExpense));
  });
  document.querySelectorAll("[data-remove-supplier]").forEach((button) => {
    button.addEventListener("click", () => removeSupplier(button.dataset.removeSupplier));
  });
  document.querySelectorAll("[data-remove-expense]").forEach((button) => {
    button.addEventListener("click", () => removeExpense(button.dataset.removeExpense));
  });
  document.querySelectorAll("[data-remove-paid-expense-invoice]").forEach((button) => {
    button.addEventListener("click", () =>
      removePaidExpenseInvoice(button.dataset.expenseId, button.dataset.removePaidExpenseInvoice),
    );
  });

  document.querySelectorAll("[data-pay-client]").forEach((button) => {
    button.addEventListener("click", () => payClient(button.dataset.payClient));
  });

  document.querySelectorAll("[data-open-table]").forEach((button) => {
    button.addEventListener("click", () => openTable(button.dataset.openTable));
  });

  document.querySelectorAll("[data-close-table]").forEach((button) => {
    button.addEventListener("click", () => closeTable(button.dataset.closeTable));
  });

  document.querySelectorAll("[data-pay-table-share]").forEach((button) => {
    button.addEventListener("click", () => startTableSplitPayment(button.dataset.tableId, button.dataset.payTableShare));
  });

  document.querySelectorAll("[data-cancel-table-split]").forEach((button) => {
    button.addEventListener("click", () => cancelTableSplit(button.dataset.cancelTableSplit));
  });

  document.querySelectorAll("[data-pay-counter-share]").forEach((button) => {
    button.addEventListener("click", () => startCounterSplitPayment(button.dataset.payCounterShare));
  });

  document.querySelector("[data-cancel-counter-split]")?.addEventListener("click", cancelCounterSplit);

  document.querySelectorAll("[data-table-item-minus]").forEach((button) => {
    button.addEventListener("click", () =>
      changeTableItemQty(button.dataset.tableId, button.dataset.tableItemMinus, -1),
    );
  });

  document.querySelectorAll("[data-table-item-plus]").forEach((button) => {
    button.addEventListener("click", () =>
      changeTableItemQty(button.dataset.tableId, button.dataset.tableItemPlus, 1),
    );
  });

  document.querySelectorAll("[data-remove-table-item]").forEach((button) => {
    button.addEventListener("click", () => removeTableItem(button.dataset.tableId, button.dataset.removeTableItem));
  });

  document.querySelectorAll("[data-table-customer]").forEach((input) => {
    input.addEventListener("change", () => saveTableCustomerName(input.dataset.tableCustomer, input.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        input.blur();
      }
    });
  });

  document.querySelectorAll("[data-clear-table]").forEach((button) => {
    button.addEventListener("click", () => clearTable(button.dataset.clearTable));
  });

  document.querySelectorAll("[data-transfer-table]").forEach((button) => {
    button.addEventListener("click", () => transferTable(button.dataset.transferTable));
  });

  document.querySelectorAll("[data-merge-table]").forEach((button) => {
    button.addEventListener("click", () => mergeTable(button.dataset.mergeTable));
  });

  document.querySelectorAll("[data-cancel-sale]").forEach((button) => {
    button.addEventListener("click", () => {
      currentModal = { type: "cancelSale", id: button.dataset.cancelSale };
      renderApp();
    });
  });

  document.querySelector("[data-reset-demo]")?.addEventListener("click", () => {
    state = migrateState(structuredClone(defaultState));
    saveState();
    cart = [];
    notify("Dados de exemplo restaurados.");
    renderApp();
  });

  document.querySelector("#settings-form")?.addEventListener("submit", saveSettings);
}

function renderDashboard() {
  const today = salesForToday();
  const receivedToday = today.filter(isReceivedSale);
  const fiadoToday = today.filter((sale) => saleFiadoAmount(sale) > 0);
  const total = receivedToday.reduce((sum, sale) => sum + saleReceivedAmount(sale), 0);
  const profit = receivedToday.reduce((sum, sale) => sum + saleReceivedProfit(sale), 0);
  const fiadoTotal = fiadoToday.reduce((sum, sale) => sum + saleFiadoAmount(sale), 0);
  const lowStock = stockAlerts();
  const openCash = getOpenCash();
  const ticket = receivedToday.length ? total / receivedToday.length : 0;

  return `
    <div class="hero-admin">
      <div>
        <span>Painel exclusivo do administrador</span>
        <h2>Operacao da distribuidora em tempo real</h2>
        <p>Vendas, caixa, estoque, cozinha, fiado e auditoria em uma unica visao.</p>
      </div>
      <div class="hero-admin-actions">
        <button class="btn secondary" type="button" data-view="reports">Relatorios</button>
      </div>
    </div>

    <div class="grid stats">
      ${metric("Recebido hoje", money(total), `${receivedToday.length} venda(s) paga(s)`, "R$")}
      ${metric("Lucro estimado", money(profit), "Com base no custo cadastrado", "%")}
      ${metric("Ticket medio", money(ticket), "Media por atendimento", "TM")}
      ${metric("Fiado hoje", money(fiadoTotal), `${fiadoToday.length} venda(s) a receber`, "FD")}
    </div>

    ${typeof renderDailyManagerPanel === "function" ? renderDailyManagerPanel() : ""}

    <div class="grid two-col" style="margin-top: 16px;">
      <section class="card">
        <div class="card-head">
          <h2 class="card-title">Alertas inteligentes</h2>
          <button class="btn compact secondary" data-view="stock" type="button">Ver estoque</button>
        </div>
        ${alertsList()}
      </section>

      <section class="card">
        <div class="card-head">
          <h2 class="card-title">Caixa do turno</h2>
          <button class="btn compact secondary" data-view="cash" type="button">Detalhar</button>
        </div>
        ${cashSummaryPanel(openCash)}
      </section>
    </div>

    <div class="grid two-col" style="margin-top: 16px;">
      <section class="card">
        <div class="card-head">
          <h2 class="card-title">Ultimas vendas</h2>
          ${hasPermission("pos") ? '<button class="btn compact secondary" data-view="pos" type="button">Nova venda</button>' : ""}
        </div>
        ${salesTable(state.sales.slice(-6).reverse())}
      </section>

      <section class="card">
        <div class="card-head">
          <h2 class="card-title">Auditoria recente</h2>
          <button class="btn compact secondary" data-view="reports" type="button">Ver tudo</button>
        </div>
        ${auditList(state.auditLog.slice(0, 7))}
      </section>
    </div>
  `;
}

function metric(label, value, help, icon) {
  return `
    <section class="card metric">
      <div>
        <span>${label}</span>
        <strong>${value}</strong>
        <small>${help}</small>
      </div>
      <div class="metric-icon">${icon}</div>
    </section>
  `;
}

function renderPos() {
  const counterSplitBill = currentCounterSplitBill();
  const term = searchTerm.trim().toLowerCase();
  const quickProductsBase = state.products.filter((product) => product.active && product.favorite);
  const visibleProductsBase = term ? state.products.filter((product) => product.active) : quickProductsBase;
  const categories = ["Todos", ...new Set(visibleProductsBase.map((product) => product.category))];
  const activeCategoryFilter = categories.includes(categoryFilter) ? categoryFilter : "Todos";
  const products = visibleProductsBase.filter((product) => {
    if (activeCategoryFilter !== "Todos" && product.category !== activeCategoryFilter) return false;
    if (!term) return true;
    return `${product.name} ${product.productCode || ""} ${productBarcodeCodes(product).join(" ")} ${product.category}`
      .toLowerCase()
      .includes(term);
  });
  const { subtotal, serviceFee, total } = saleTotalsForItems(cart);
  const lastSaleForTickets = lastSaleForTicketsId ? state.sales.find((sale) => sale.id === lastSaleForTicketsId) : null;
  const lastSaleTicketCount = lastSaleForTickets ? ticketUnitList(lastSaleForTickets).length : 0;

  return `
    <div class="section-title">
      <div>
        <h2>Venda de balcao</h2>
        <p>Atendimento ${CURRENT_SERVICE_NUMBER}. Selecione uma maquininha diferente em cada atendimento simultaneo.</p>
      </div>
      <div class="toolbar">
        <input class="field-input search" data-search type="search" placeholder="Buscar produto" />
        <button class="btn secondary" type="button" data-open-modal="manualCharge" ${counterSplitBill ? "disabled" : ""}>${icon("cash")} Cobranca avulsa</button>
        <button class="btn primary" type="button" data-new-service>Novo atendimento</button>
      </div>
    </div>
    ${
      lastSaleForTickets
        ? `<section class="card pad post-sale-ticket">
            <div>
              <strong>Venda finalizada: ${money(lastSaleForTickets.total)}</strong>
              <span>${lastSaleTicketCount ? `${lastSaleTicketCount} ficha(s) individuais disponiveis para impressao.` : "Recibo individual disponivel para esta parte da conta."}</span>
            </div>
            <button class="btn primary" type="button" ${lastSaleTicketCount ? `data-print-last-tickets="${lastSaleForTickets.id}"` : `data-print-sale="${lastSaleForTickets.id}"`}>${icon("print")} ${lastSaleTicketCount ? "Imprimir fichas" : "Imprimir recibo"}</button>
          </section>`
        : ""
    }

    ${counterSplitBill ? renderCounterSplitStatus(counterSplitBill) : ""}

    <div class="pos-layout">
      <section class="card pad">
        <div class="quick-menu-editor">
          <strong>${term ? "Resultado da busca" : "Menu rapido"}</strong>
          <div>
            <button class="btn compact secondary" type="button" data-open-modal="product">Adicionar item</button>
            <button class="btn compact secondary" type="button" data-view="stock">Editar itens</button>
          </div>
        </div>
        <div class="category-strip">
          ${categories
            .map(
              (category) => `
                <button class="category-pill ${activeCategoryFilter === category ? "active" : ""}" type="button" data-category="${category}">
                  <span>${category === "Todos" ? "TD" : categoryMeta[category]?.icon || category.slice(0, 2).toUpperCase()}</span>
                  ${category}
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="quick-product-grid">
          ${
            products.length
              ? products
                  .map(
                    (product) => `
                      <button class="quick-product-tile" type="button" data-add-product="${product.id}" ${counterSplitBill || productAvailableStock(product) <= 0 ? "disabled" : ""}>
                        ${productImageMarkup(product, "quick-product-photo")}
                        <span class="quick-product-copy">
                          <strong>${escapeHtml(product.name)}</strong>
                          <span class="price">${money(product.price)}</span>
                        </span>
                      </button>
                    `,
                  )
                  .join("")
              : `<div class="empty">${term ? "Nenhum produto encontrado na busca." : quickProductsBase.length ? "Nenhum item do menu rapido encontrado." : "Nenhum produto selecionado para o menu rapido. Edite um produto e marque Menu rapido do balcao: Sim."}</div>`
          }
        </div>
      </section>

      <aside class="card cart">
        <div class="card-head">
          <h2 class="card-title">${tableCheckout ? `Fechamento - ${tableCheckout.name}${tableCheckout.splitPersonName ? ` / ${escapeHtml(tableCheckout.splitPersonName)}` : ""}` : "Comanda"}</h2>
          <button class="btn compact secondary" type="button" data-clear-cart ${counterSplitBill && !tableCheckout ? "disabled" : ""}>Limpar</button>
        </div>
        ${
          tableCheckout
            ? `<div class="notice compact">${
                tableCheckout.splitPersonName
                  ? `Recebendo a parte de <strong>${escapeHtml(tableCheckout.splitPersonName)}</strong>. Os itens desta parte ficam travados para evitar baixa duplicada.`
                  : "Conta enviada da mesa. Escolha a forma de pagamento para finalizar no caixa."
              }</div>`
            : ""
        }
        <div class="cart-list">
          ${
            cart.length
              ? cart
                  .map(
                    (item) => `
                      <div class="cart-item">
                        <div>
                          <strong>${item.name}</strong>
                          <span>${tableCheckout?.splitPersonId ? "Incluido proporcionalmente nesta parte" : `${money(item.price)} cada`}</span>
                        </div>
                        ${
                          tableCheckout?.splitPersonId
                            ? '<span class="status blue">Rateado</span>'
                            : `<div class="qty-stepper">
                                <button type="button" data-cart-minus="${item.productId}">-</button>
                                <output>${item.qty}</output>
                                <button type="button" data-cart-plus="${item.productId}">+</button>
                              </div>`
                        }
                      </div>
                    `,
                  )
                  .join("")
              : '<div class="empty">Nenhum item na comanda.</div>'
          }
        </div>
        <div class="cart-total">
          <div class="notice compact">A forma de pagamento sera escolhida ao finalizar.</div>
          ${tableCheckout ? `<div class="total-row"><span>Subtotal da mesa</span><strong>${money(subtotal)}</strong></div>` : ""}
          ${tableCheckout ? `<div class="total-row"><span>Servico ${state.settings.serviceFee || 0}%</span><strong>${money(serviceFee)}</strong></div>` : ""}
          <div class="total-row"><span>Total</span><strong>${money(total)}</strong></div>
          <button class="btn primary" type="button" data-finalize-sale ${cart.length ? "" : "disabled"}>Finalizar venda</button>
        </div>
      </aside>
    </div>
    <div class="checkout-dock" aria-live="polite">
      <div>
        <span>${cart.length ? "Total da venda" : lastSaleForTickets ? "Ultima venda" : "Total da venda"}</span>
        <strong>${cart.length ? money(total) : lastSaleForTickets ? money(lastSaleForTickets.total) : money(0)}</strong>
      </div>
      ${
        cart.length
          ? `<button class="btn primary" type="button" data-finalize-sale>Finalizar venda</button>`
          : lastSaleForTickets
            ? `<button class="btn primary" type="button" ${lastSaleTicketCount ? `data-print-last-tickets="${lastSaleForTickets.id}"` : `data-print-sale="${lastSaleForTickets.id}"`}>${lastSaleTicketCount ? "Imprimir fichas" : "Imprimir recibo"}</button>`
            : `<button class="btn primary" type="button" data-finalize-sale disabled>Finalizar venda</button>`
      }
    </div>
  `;
}

function filteredProducts() {
  const term = searchTerm.trim().toLowerCase();
  return state.products.filter((product) => {
    if (categoryFilter !== "Todos" && product.category !== categoryFilter) return false;
    if (!term) return true;
    return `${product.name} ${product.productCode || ""} ${productBarcodeCodes(product).join(" ")} ${product.category}`
      .toLowerCase()
      .includes(term);
  });
}

function selectedTableForView() {
  const selected = state.tables.find((table) => table.id === selectedTableId);
  if (selected) return selected;
  return state.tables.find((table) => table.status !== "Livre") || null;
}

function selectTable(tableId) {
  selectedTableId = tableId || null;
  currentModal = null;
  renderApp();
}

function renderTableItems(table) {
  if (!table?.items?.length) return '<div class="cart-list"><div class="empty">Mesa sem itens.</div></div>';
  const locked = Boolean(table.splitBill);

  return `
    <div class="cart-list compact-cart">
      ${table.items
        .map(
          (item) => `
            <div class="cart-item table-order-item">
              <div>
                <strong>${escapeHtml(item.name)}</strong>
                <span>${qty(item.qty)} x ${money(item.price)} = ${money(item.qty * item.price)}</span>
              </div>
              ${
                locked
                  ? '<span class="status amber">Em divisao</span>'
                  : `<div class="table-item-actions">
                      <div class="qty-stepper">
                        <button type="button" data-table-id="${table.id}" data-table-item-minus="${item.productId}">-</button>
                        <output>${qty(item.qty)}</output>
                        <button type="button" data-table-id="${table.id}" data-table-item-plus="${item.productId}">+</button>
                      </div>
                      <button class="btn compact danger" type="button" data-table-id="${table.id}" data-remove-table-item="${item.productId}">Remover</button>
                    </div>`
              }
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderTableSplitStatus(table) {
  const people = tableSplitPeople(table);
  if (!people.length) return "";
  const paidCount = tableSplitPaidPeople(table).length;
  return `
    <section class="table-split-status">
      <div class="table-split-heading">
        <div>
          <strong>Conta dividida: ${tableSplitModeLabel(table.splitBill.mode)}</strong>
          <span>${paidCount} de ${people.length} pagamento(s) concluido(s)</span>
        </div>
        <span class="status ${paidCount === people.length ? "green" : "amber"}">${money(tableSplitPendingTotal(table))} restante</span>
      </div>
      <div class="table-split-people">
        ${people
          .map(
            (person, index) => `
              <article class="table-split-person ${person.status === "paid" ? "paid" : "pending"}">
                <div>
                  <small>Parte ${index + 1}</small>
                  <strong>${escapeHtml(person.name)}</strong>
                  <span>${money(person.amount)}</span>
                </div>
                ${
                  person.status === "paid"
                    ? `<span class="status green">Pago${person.payment ? ` - ${escapeHtml(person.payment)}` : ""}</span>`
                    : person.status === "processing"
                      ? '<span class="status blue">Em atendimento</span>'
                    : `<button class="btn compact primary" type="button" data-pay-table-share="${person.id}" data-table-id="${table.id}">Receber no balcao</button>`
                }
              </article>
            `,
          )
          .join("")}
      </div>
      ${paidCount ? "" : `<button class="btn compact secondary" type="button" data-cancel-table-split="${table.id}">Cancelar divisao</button>`}
    </section>
  `;
}

function renderCounterSplitStatus(splitBill) {
  const people = splitBillPeople(splitBill);
  if (!people.length) return "";
  const paidCount = people.filter((person) => person.status === "paid").length;
  return `
    <section class="table-split-status counter-split-status">
      <div class="table-split-heading">
        <div>
          <strong>Venda dividida: ${tableSplitModeLabel(splitBill.mode)}</strong>
          <span>Atendimento ${CURRENT_SERVICE_NUMBER} - ${paidCount} de ${people.length} pagamento(s) concluido(s)</span>
        </div>
        <span class="status ${paidCount === people.length ? "green" : "amber"}">${money(splitBillPendingTotal(splitBill))} restante</span>
      </div>
      <div class="table-split-people">
        ${people
          .map(
            (person, index) => `
              <article class="table-split-person ${person.status === "paid" ? "paid" : "pending"}">
                <div>
                  <small>Parte ${index + 1}</small>
                  <strong>${escapeHtml(person.name)}</strong>
                  <span>${money(person.amount)}</span>
                </div>
                ${
                  person.status === "paid"
                    ? `<span class="status green">Pago${person.payment ? ` - ${escapeHtml(person.payment)}` : ""}</span>`
                    : person.status === "processing"
                      ? `<button class="btn compact secondary" type="button" data-pay-counter-share="${person.id}">Retomar pagamento</button>`
                      : `<button class="btn compact primary" type="button" data-pay-counter-share="${person.id}">Receber no balcao</button>`
                }
              </article>
            `,
          )
          .join("")}
      </div>
      ${paidCount ? "" : '<button class="btn compact secondary" type="button" data-cancel-counter-split>Cancelar divisao</button>'}
    </section>
  `;
}

function renderTables() {
  const selectedTable = selectedTableForView();
  const tableTotal = tableTotalValue(selectedTable);

  return `
    <div class="section-title">
      <div>
        <h2>Mesas e comandas</h2>
        <p>Abra mesa, adicione itens, acompanhe status e feche a conta. ${isOnlineSession() ? "Salvando no Supabase." : "Modo local."}</p>
      </div>
      <div class="toolbar">
        <span class="status blue">${state.tables.length} mesas</span>
        <button class="btn primary" type="button" data-open-modal="addTables">Adicionar mesas</button>
        <button class="btn secondary" type="button" data-clear-table="${selectedTable?.id || ""}" ${selectedTable ? "" : "disabled"}>Liberar selecionada</button>
      </div>
    </div>
    <div class="tables-layout">
      <section class="card pad">
        <div class="table-map">
          ${state.tables
            .map(
              (table) => `
                <button class="table-tile ${table.status.toLowerCase()} ${table.id === selectedTable?.id ? "active" : ""}" type="button" data-select-table="${table.id}">
                  <strong>${table.name}</strong>
                  ${table.customerName ? `<em>${escapeHtml(table.customerName)}</em>` : ""}
                  <span>${table.status}</span>
                  <small>${table.splitBill ? `${money(tableSplitPendingTotal(table))} restante` : money(tableTotalValue(table))}</small>
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
      <aside class="card">
        <div class="card-head">
          <h2 class="card-title">${selectedTable?.name || "Selecione uma mesa"}</h2>
          <span class="status ${selectedTable?.status === "Livre" ? "green" : selectedTable ? "amber" : "blue"}">${selectedTable?.status || "Aguardando"}</span>
        </div>
        ${
          selectedTable
            ? `
              ${selectedTable.customerName ? `<div class="table-customer">Cliente: <strong>${escapeHtml(selectedTable.customerName)}</strong></div>` : ""}
              ${renderTableItems(selectedTable)}
              ${renderTableSplitStatus(selectedTable)}
              <div class="cart-total">
                <div class="total-row"><span>Subtotal</span><strong>${money(tableTotal)}</strong></div>
                <div class="total-row"><span>Servico ${state.settings.serviceFee || 0}%</span><strong>${money(tableServiceFee(tableTotal))}</strong></div>
                <div class="total-row"><span>Total</span><strong>${money(tableTotal + tableServiceFee(tableTotal))}</strong></div>
                ${
                  selectedTable.splitBill
                    ? '<div class="notice compact">A mesa sera liberada automaticamente depois que todas as partes forem pagas.</div>'
                    : `<button class="btn secondary" type="button" data-open-modal="table" data-id="${selectedTable.id}">Editar pedido</button>
                       <button class="btn secondary" type="button" data-open-modal="tableSplit" data-id="${selectedTable.id}" ${selectedTable.items?.length ? "" : "disabled"}>Dividir conta</button>
                       <button class="btn primary" type="button" data-close-table="${selectedTable.id}" ${selectedTable.items?.length ? "" : "disabled"}>Enviar para balcao</button>`
                }
              </div>
            `
            : '<div class="empty">Escolha uma mesa no mapa para abrir, editar ou enviar para o balcao.</div>'
        }
      </aside>
    </div>
  `;
}

function renderWaiter() {
  const products = filteredProducts().filter((product) => product.active);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  return `
    <div class="section-title">
      <div>
        <h2>Modo garcom</h2>
        <p>Fluxo compacto para celular: selecionar item, revisar comanda e enviar.</p>
      </div>
      <div class="toolbar">
        <input class="field-input search" data-search type="search" placeholder="Buscar item por nome ou codigo" />
        <button class="btn secondary" type="button" data-open-modal="lot">Novo lote</button>
      </div>
    </div>
    <div class="waiter-shell">
      <section class="card pad">
        <div class="mobile-product-list">
          ${products
            .map(
              (product) => `
                <button class="mobile-product" type="button" data-add-product="${product.id}" ${productAvailableStock(product) <= 0 ? "disabled" : ""}>
                  <span class="category-badge">${categoryMeta[product.category]?.icon || "IT"}</span>
                  <span>
                    <strong>${product.name}</strong>
                    <small>${product.category} - ${money(product.price)} - ${productStockText(product)}</small>
                  </span>
                  <span>+</span>
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
      <aside class="card cart">
        <div class="card-head">
          <h2 class="card-title">Comanda mobile</h2>
          <button class="btn compact secondary" type="button" data-clear-cart>Limpar</button>
        </div>
        <div class="cart-list">
          ${
            cart.length
              ? cart
                  .map(
                    (item) => `
                      <div class="cart-item">
                        <div><strong>${item.name}</strong><span>${item.qty} x ${money(item.price)}</span></div>
                        <div class="qty-stepper">
                          <button type="button" data-cart-minus="${item.productId}">-</button>
                          <output>${item.qty}</output>
                          <button type="button" data-cart-plus="${item.productId}">+</button>
                        </div>
                      </div>
                    `,
                  )
                  .join("")
              : '<div class="empty">Nenhum item selecionado.</div>'
          }
        </div>
        <div class="cart-total">
          <div class="notice compact">A forma de pagamento sera escolhida ao finalizar.</div>
          <div class="total-row"><span>Total</span><strong>${money(total)}</strong></div>
          <button class="btn primary" type="button" data-finalize-sale ${cart.length ? "" : "disabled"}>Enviar e fechar</button>
        </div>
      </aside>
    </div>
  `;
}

function renderKitchen() {
  const groups = ["Novo", "Preparando", "Pronto", "Entregue"];
  return `
    <div class="section-title">
      <div>
        <h2>Fila cozinha/bar</h2>
        <p>Pedidos criados automaticamente nas vendas e comandas.</p>
      </div>
    </div>
    <div class="kitchen-board">
      ${groups
        .map((status) => {
          const orders = state.kitchenOrders.filter((order) => order.status === status);
          return `
            <section class="card kitchen-column">
              <div class="card-head"><h2 class="card-title">${status}</h2><span class="status blue">${orders.length}</span></div>
              <div class="order-list">
                ${
                  orders.length
                    ? orders
                        .map(
                          (order) => `
                            <article class="order-card">
                              <div class="order-head">
                                <strong>${order.station}</strong>
                                <span>${dateTime(order.date)}</span>
                              </div>
                              <ul>
                                ${order.items.map((item) => `<li>${item.qty}x ${item.name}</li>`).join("")}
                              </ul>
                              <div class="toolbar">
                                ${status !== "Preparando" ? `<button class="btn compact secondary" data-order-status="${order.id}" data-status="Preparando" type="button">Preparar</button>` : ""}
                                ${status !== "Pronto" ? `<button class="btn compact secondary" data-order-status="${order.id}" data-status="Pronto" type="button">Pronto</button>` : ""}
                                ${
                                  status !== "Entregue"
                                    ? `<button class="btn compact secondary" data-order-status="${order.id}" data-status="Entregue" type="button">Entregue</button>
                                       <button class="btn compact secondary" data-open-modal="order" data-id="${order.id}" type="button">Editar</button>
                                       <button class="btn compact danger" data-remove-order="${order.id}" type="button">Remover</button>`
                                    : '<span class="status green">Finalizado</span>'
                                }
                              </div>
                            </article>
                          `,
                        )
                        .join("")
                    : '<div class="empty">Sem pedidos.</div>'
                }
              </div>
            </section>
          `;
        })
        .join("")}
    </div>
  `;
}

function addToCart(productId) {
  if (tableCheckout?.splitPersonId) {
    notify("Finalize ou cancele esta parte da conta antes de alterar os produtos.");
    return;
  }
  if (currentCounterSplitBill()) {
    notify("Conclua ou cancele a divisao deste atendimento antes de incluir outros produtos.");
    return;
  }
  const product = state.products.find((item) => item.id === productId);
  const availableStock = productAvailableStock(product);
  if (!product || availableStock <= 0) {
    notify("Produto sem estoque disponivel.");
    return;
  }

  const existing = cart.find((item) => item.productId === productId);
  const currentQty = existing ? existing.qty : 0;

  if (currentQty + 1 > availableStock) {
    notify("Quantidade maior que o estoque disponivel.");
    return;
  }

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      qty: 1,
      price: product.price,
      cost: product.cost,
    });
  }

  renderApp();
}

function changeCartQty(productId, change) {
  if (tableCheckout?.splitPersonId) {
    notify("Os itens desta parte estao travados para evitar baixa duplicada no estoque.");
    return;
  }
  const item = cart.find((entry) => entry.productId === productId);
  const product = state.products.find((entry) => entry.id === productId);
  if (!item || !product) return;

  const availableStock = productAvailableStock(product);
  const next = item.qty + change;
  if (next <= 0) {
    cart = cart.filter((entry) => entry.productId !== productId);
  } else if (next <= availableStock) {
    item.qty = next;
  } else {
    notify("Quantidade maior que o estoque disponivel.");
  }

  renderApp();
}

async function openSalePaymentModal() {
  if (!cart.length) return;
  if (!mercadoPagoPointStatus.checked || !mercadoPagoPointStatus.terminals.length) {
    notify("Carregando maquininhas...");
    await loadMercadoPagoPointStatus(true);
  }
  currentModal = { type: "salePayment" };
  renderApp();
}

async function confirmSalePayment(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  if (formElement.dataset.submitting === "true") return;
  const form = new FormData(formElement);
  const payment = String(form.get("payment") || "");
  const discount = discountFromForm(form);
  const total = salePaymentTotal(discount);
  const cashExact = form.get("cashExact") === "true";
  const cashReceivedText = String(form.get("cashReceived") || "").trim();
  let cashReceived = payment === "Dinheiro" && (cashExact || !cashReceivedText) ? total : payment === "Dinheiro" ? Number(cashReceivedText) : 0;
  let cashChange = payment === "Dinheiro" && (cashExact || !cashReceivedText) ? 0 : payment === "Dinheiro" ? Math.max(0, cashReceived - total) : 0;
  let paymentBreakdown = [];
  const creditInstallments = Math.min(12, Math.max(1, Number(form.get("creditInstallments") || 1)));
  if (!payment) {
    notify("Escolha a forma de pagamento para finalizar.");
    return;
  }
  if (payment === "Dinheiro" && !cashExact && cashReceivedText && cashReceived < total) {
    notify("Informe um valor recebido igual ou maior que o total da venda.");
    delete formElement.dataset.submitting;
    return;
  }
  if (payment === "Dividido") {
    paymentBreakdown = paymentMethods
      .map((method) => ({
        method,
        amount: Number(form.get(`split-${method}`) || 0),
        installments: method === "Credito" ? Math.min(12, Math.max(1, Number(form.get("splitCreditInstallments") || 1))) : 1,
      }))
      .filter((part) => part.amount > 0);
    const paid = paymentBreakdown.reduce((sum, part) => sum + part.amount, 0);
    const cashPart = paymentBreakdown.find((part) => part.method === "Dinheiro")?.amount || 0;
    const splitCashReceivedText = String(form.get("splitCashReceived") || "").trim();
    cashReceived = cashPart > 0 ? (splitCashReceivedText ? Number(splitCashReceivedText) : cashPart) : 0;
    cashChange = cashPart > 0 ? Math.max(0, cashReceived - cashPart) : 0;

    if (paymentBreakdown.length < 2) {
      notify("Informe pelo menos duas formas de pagamento para dividir a venda.");
      delete formElement.dataset.submitting;
      return;
    }
    if (Math.abs(paid - total) > 0.009) {
      notify(`A soma dos pagamentos precisa fechar ${money(total)}. Agora esta em ${money(paid)}.`);
      delete formElement.dataset.submitting;
      return;
    }
    if (cashPart > 0 && splitCashReceivedText && cashReceived < cashPart) {
      notify("Informe o valor recebido em dinheiro para calcular o troco.");
      delete formElement.dataset.submitting;
      return;
    }
  }
  if (payment !== "Dividido") {
    paymentBreakdown = [{ method: payment, amount: total, installments: payment === "Credito" ? creditInstallments : 1 }];
  }
  const fiadoAmount = payment === "Fiado" ? total : paymentBreakdown.find((part) => part.method === "Fiado")?.amount || 0;
  if (fiadoAmount > 0) {
    const clientId = String(form.get("clientId") || "");
    const client = state.clients.find((entry) => entry.id === clientId);
    if (!client) {
      notify("Selecione o cliente que recebera o fiado.");
      delete formElement.dataset.submitting;
      return;
    }
    if (form.get("confirmFiadoClient") !== "on") {
      notify(`Confirme que o fiado sera lancado para ${client.name}.`);
      delete formElement.dataset.submitting;
      return;
    }
    const admin = await authorizeAdminPassword(form.get("adminPassword"));
    if (!admin) {
      notify("Senha de administrador invalida.");
      delete formElement.dataset.submitting;
      return;
    }
  }
  formElement.dataset.submitting = "true";
  formElement.setAttribute("aria-busy", "true");
  const controls = [...formElement.elements].map((element) => ({ element, wasDisabled: element.disabled }));
  controls.forEach(({ element }) => {
    element.disabled = true;
  });
  const progress = formElement.querySelector("[data-payment-progress]");
  if (progress) {
    progress.hidden = false;
    progress.textContent = isPointPayment(payment) || payment === "Dividido"
      ? "Aguardando a confirmacao da maquininha. Nao feche esta tela."
      : "Finalizando e salvando a venda...";
  }

  let finalized = false;
  try {
    finalized = await finalizeSale({
      payment,
      clientId: String(form.get("clientId") || ""),
      terminalKey: String(form.get("terminalKey") || ""),
      cashReceived,
      cashChange,
      paymentBreakdown,
      discount,
      manualReference: String(form.get("manualReference") || "").trim(),
    });
  } catch (error) {
    notify(`Nao foi possivel finalizar: ${error.message || "erro inesperado"}. A venda continua aberta.`);
  } finally {
    if (!finalized && document.body.contains(formElement)) {
      formElement.removeAttribute("aria-busy");
      controls.forEach(({ element, wasDisabled }) => {
        element.disabled = wasDisabled;
      });
      if (progress) progress.hidden = true;
    }
    delete formElement.dataset.submitting;
  }
}

function salePaymentTotal(discount = {}) {
  return saleTotalsForItems(cart, discount).total;
}

function updateSalePaymentTotalPreview(form) {
  const discount = discountFromForm(new FormData(form));
  const totals = saleTotalsForItems(cart, discount);
  const totalOutput = form.querySelector("[data-sale-total]");
  const discountOutput = form.querySelector("[data-sale-discount]");
  const discountRow = form.querySelector("[data-discount-summary-row]");
  const discountValueInput = form.querySelector("[data-discount-value]");
  const discountType = form.querySelector("[data-discount-type]")?.value || "none";

  if (totalOutput) totalOutput.textContent = money(totals.total);
  if (discountOutput) discountOutput.textContent = money(totals.discount.amount);
  if (discountRow) discountRow.hidden = totals.discount.amount <= 0;
  if (discountValueInput) {
    discountValueInput.disabled = discountType === "none";
    if (discountType === "none") discountValueInput.value = "";
    discountValueInput.placeholder = discountType === "percent" ? "Ex.: 10" : "Ex.: 5,00";
  }
}

function updateCashChangePreview(form) {
  const panel = form.querySelector("[data-cash-change-panel]");
  const input = form.querySelector("[data-cash-received]");
  const output = form.querySelector("[data-cash-change]");
  if (!panel || !input || !output) return;

  const payment = form.querySelector('input[name="payment"]:checked')?.value || "";
  const showCash = payment === "Dinheiro";
  panel.hidden = !showCash;
  if (!showCash) {
    input.value = "";
    output.textContent = money(0);
    return;
  }

  const total = salePaymentTotal(discountFromForm(new FormData(form)));
  const received = input.value.trim() ? Number(input.value || 0) : total;
  output.textContent = money(Math.max(0, received - total));
}

function updateSplitPaymentPreview(form) {
  const panel = form.querySelector("[data-split-payment-panel]");
  if (!panel) return;

  const payment = form.querySelector('input[name="payment"]:checked')?.value || "";
  const showSplit = payment === "Dividido";
  panel.hidden = !showSplit;
  if (!showSplit) return;

  const total = salePaymentTotal(discountFromForm(new FormData(form)));
  const paid = paymentMethods.reduce((sum, method) => {
    const input = form.querySelector(`[data-split-amount="${method}"]`);
    return sum + Number(input?.value || 0);
  }, 0);
  const cashPart = Number(form.querySelector('[data-split-amount="Dinheiro"]')?.value || 0);
  const cashReceivedInput = form.querySelector("[data-split-cash-received]");
  const cashReceived = cashReceivedInput?.value.trim() ? Number(cashReceivedInput.value || 0) : cashPart;
  const remaining = total - paid;
  const paidOutput = form.querySelector("[data-split-paid]");
  const remainingOutput = form.querySelector("[data-split-remaining]");
  const cashChangeOutput = form.querySelector("[data-split-cash-change]");
  const cashReceivedField = form.querySelector("[data-split-cash-field]");
  const creditInstallmentsField = form.querySelector("[data-split-credit-installments]");
  const creditPart = Number(form.querySelector('[data-split-amount="Credito"]')?.value || 0);
  if (cashReceivedField) cashReceivedField.hidden = cashPart <= 0;
  if (creditInstallmentsField) creditInstallmentsField.hidden = creditPart <= 0;
  if (cashReceivedInput && cashPart <= 0) cashReceivedInput.value = "";
  if (paidOutput) paidOutput.textContent = money(paid);
  if (remainingOutput) {
    remainingOutput.textContent = Math.abs(remaining) <= 0.009 ? "Fechado" : money(remaining);
    remainingOutput.className = Math.abs(remaining) <= 0.009 ? "ok" : remaining > 0 ? "warn" : "bad";
  }
  if (cashChangeOutput) cashChangeOutput.textContent = money(Math.max(0, cashReceived - cashPart));
  updateFiadoAuthorizationPanel(form);
}

function updateFiadoAuthorizationPanel(form) {
  const panel = form.querySelector("[data-fiado-authorization]");
  if (!panel) return;
  const payment = form.querySelector('input[name="payment"]:checked')?.value || "";
  const splitFiado = Number(form.querySelector('[data-split-amount="Fiado"]')?.value || 0);
  const needsAuthorization = payment === "Fiado" || (payment === "Dividido" && splitFiado > 0);
  panel.hidden = !needsAuthorization;
  const clientSelect = form.querySelector('[name="clientId"]');
  const clientName = clientSelect?.selectedOptions?.[0]?.textContent || "cliente selecionado";
  const confirmation = panel.querySelector("[data-fiado-client-confirmation]");
  if (confirmation) confirmation.textContent = `Confirmo que o fiado sera lancado para ${clientName}.`;
}

function bindSalePaymentChoice() {
  const form = document.querySelector("#sale-payment-form");
  if (!form) return;
  const cashInput = form.querySelector("[data-cash-received]");
  const discountInputs = form.querySelectorAll("[data-discount-type], [data-discount-value]");
  const splitInputs = form.querySelectorAll("[data-split-amount], [data-split-cash-received]");
  const updateOfflinePaymentPanel = () => {
    const panel = form.querySelector("[data-offline-payment-panel]");
    if (!panel) return;
    const payment = form.querySelector('input[name="payment"]:checked')?.value || "";
    const splitHasPoint = pointPaymentMethods.some(
      (method) => Number(form.querySelector(`[data-split-amount="${method}"]`)?.value || 0) > 0,
    );
    panel.hidden = hasNetworkConnection() || !(isPointPayment(payment) || (payment === "Dividido" && splitHasPoint));
  };
  updateSalePaymentTotalPreview(form);
  updateCashChangePreview(form);
  updateSplitPaymentPreview(form);
  const updateCreditInstallments = () => {
    const payment = form.querySelector('input[name="payment"]:checked')?.value || "";
    const panel = form.querySelector("[data-credit-installments]");
    if (panel) panel.hidden = payment !== "Credito";
  };
  updateCreditInstallments();
  updateFiadoAuthorizationPanel(form);
  updateOfflinePaymentPanel();
  cashInput?.addEventListener("input", () => updateCashChangePreview(form));
  discountInputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateSalePaymentTotalPreview(form);
      updateCashChangePreview(form);
      updateSplitPaymentPreview(form);
      updateCreditInstallments();
    });
    input.addEventListener("change", () => {
      updateSalePaymentTotalPreview(form);
      updateCashChangePreview(form);
      updateSplitPaymentPreview(form);
    });
  });
  splitInputs.forEach((input) =>
    input.addEventListener("input", () => {
      updateSplitPaymentPreview(form);
      updateOfflinePaymentPanel();
    }),
  );
  form.querySelector('[name="clientId"]')?.addEventListener("change", () => updateFiadoAuthorizationPanel(form));

  form.querySelectorAll('input[name="payment"]').forEach((input) => {
    input.addEventListener("change", () => {
      updateCashChangePreview(form);
      updateSplitPaymentPreview(form);
      updateCreditInstallments();
      updateOfflinePaymentPanel();
      if (input.value === "Dinheiro") {
        cashInput?.focus();
        return;
      }
      if (input.value === "Dividido") {
        form.querySelector("[data-split-amount]")?.focus();
        return;
      }
      if (input.value === "Credito") {
        form.querySelector('input[name="creditInstallments"]:checked')?.focus();
        return;
      }
      if (input.value === "Fiado") {
        updateFiadoAuthorizationPanel(form);
        form.querySelector('[name="adminPassword"]')?.focus();
        return;
      }
      if (form.dataset.submitting === "true") return;
      if (!hasNetworkConnection() && isPointPayment(input.value)) {
        form.querySelector('[name="manualReference"]')?.focus();
        return;
      }
      form.requestSubmit();
    });
  });
}

async function finalizeSale({
  payment = "",
  clientId = "",
  terminalKey = "",
  cashReceived = 0,
  cashChange = 0,
  paymentBreakdown = [],
  discount = {},
  manualReference = "",
} = {}) {
  if (!cart.length) return false;
  if (!payment) {
    openSalePaymentModal();
    notify("Escolha a forma de pagamento para finalizar.");
    return false;
  }

  const checkout = tableCheckout;
  const counterSplitBill = checkout?.splitSource === "counter" ? currentCounterSplitBill() : null;
  const splitTable = checkout?.splitPersonId && checkout?.splitSource !== "counter"
    ? state.tables.find((entry) => entry.id === checkout.id)
    : null;
  const activeSplitBill = counterSplitBill || splitTable?.splitBill || null;
  const splitPerson = checkout?.splitPersonId
    ? splitBillPeople(activeSplitBill).find((entry) => entry.id === checkout.splitPersonId)
    : null;
  if (checkout?.splitPersonId && (!activeSplitBill || !splitPerson || splitPerson.status === "paid")) {
    notify("Esta parte da conta nao esta mais disponivel. Atualize a mesa e confira os pagamentos.");
    return false;
  }
  if (checkout?.splitPersonId && splitPerson.claimId && splitPerson.claimId !== checkout.splitClaimId) {
    notify("Esta parte esta reservada em outro atendimento.");
    return false;
  }
  const totals = saleTotalsForItems(cart, discount);
  const { serviceFee, total } = totals;
  const cost = cart.reduce((sum, item) => sum + item.qty * item.cost, 0);
  const selectedClientId = clientId || state.clients[0]?.id || "";
  let selectedTerminal = null;
  let providerReferences = [];
  const paymentParts = normalizePaymentBreakdown(paymentBreakdown);
  const fiadoAmount = payment === "Fiado" ? total : paymentParts.find((part) => part.method === "Fiado")?.amount || 0;
  const pointParts = pointPaymentPartsForSale({ payment, paymentBreakdown: paymentParts, total });

  if (fiadoAmount > 0) {
    const client = state.clients.find((entry) => entry.id === selectedClientId);
    const projectedDebt = Number(client?.debt || 0) + fiadoAmount;
    if (!client || Number(client.creditLimit || 0) <= 0 || projectedDebt > Number(client.creditLimit || 0)) {
      notify("Fiado bloqueado: limite do cliente insuficiente.");
      return false;
    }
  }

  const stockCheck = canFulfillCart(cart);
  if (!stockCheck.ok) {
    notify(stockCheck.message);
    return false;
  }

  const cloudAvailable = await checkCloudConnection();
  const manualPointPayment = pointParts.length > 0 && !cloudAvailable;
  if (manualPointPayment) {
    selectedTerminal = paymentTerminalOptions().find((terminal) => terminal.id === terminalKey) || getSelectedPaymentTerminal();
    if (selectedTerminal) setSelectedPaymentTerminal(selectedTerminal.id);
    if (
      !confirm(
        "Sem internet para enviar a cobranca. Confirme somente se o pagamento ja foi aprovado diretamente na maquininha. Deseja registrar a venda em modo de contingencia?",
      )
    ) {
      return false;
    }
    providerReferences = pointParts.map((part) => ({
      provider: selectedTerminal?.provider || "manual",
      reference: manualReference,
      terminalId: selectedTerminal?.terminalId || selectedTerminal?.id || "",
      terminalLabel: selectedTerminal?.label || "",
      amount: part.amount,
      method: part.method,
      status: "operator_confirmed",
      checkedAt: new Date().toISOString(),
    }));
  } else {
    try {
      const pointPayment = await processPointPaymentsBeforeSale({
        total,
        payment,
        paymentBreakdown: paymentParts,
        terminalKey,
        items: structuredClone(cart),
        description: checkout
          ? `Fechamento ${checkout.name}${checkout.splitPersonName ? ` - ${checkout.splitPersonName}` : ""}`
          : "Venda balcao",
      });
      if (!pointPayment.ok) return false;
      selectedTerminal = pointPayment.terminal;
      providerReferences = normalizeProviderReferences(pointPayment.providerReferences);
    } catch (error) {
      notify("A conexao caiu durante o envio. Confira a maquininha antes de tentar novamente para evitar cobranca duplicada.");
      setCloudReachable(false, error.message || "Falha de rede durante o pagamento.");
      return false;
    }
  }

  const printDetails = {
    tableName: checkout?.splitSource === "counter" ? "" : checkout?.name || "",
    customerName: [checkout?.customerName, checkout?.splitPersonName].filter(Boolean).join(" / "),
    terminalLabel: ticketTerminalLabel(selectedTerminal),
    cashReceived,
    cashChange,
  };

  const shouldQueueForCloud = Boolean(session?.online && isSupabaseReady());

  const sale = {
    id: shouldQueueForCloud ? uuid() : id("sale"),
    date: new Date().toISOString(),
    cashierId: session.id,
    payment,
    paymentBreakdown: paymentParts,
    clientId: fiadoAmount > 0 ? selectedClientId : null,
    tableId: checkout?.splitSource === "counter" ? null : checkout?.id || null,
    splitBillId: checkout?.splitBillId || "",
    splitPersonId: checkout?.splitPersonId || "",
    splitPersonName: checkout?.splitPersonName || "",
    splitMode: activeSplitBill?.mode || "",
    splitClaimId: checkout?.splitClaimId || "",
    tableName: printDetails.tableName,
    customerName: printDetails.customerName,
    terminalLabel: printDetails.terminalLabel,
    paymentOrigin:
      selectedTerminal?.integrationMode === "manual"
        ? "manual_terminal"
        : manualPointPayment
          ? "manual_offline"
          : !cloudAvailable
            ? "offline"
            : "",
    manualReference,
    providerReferences,
    cashReceived: printDetails.cashReceived,
    cashChange: printDetails.cashChange,
    discount: totals.discount,
    discountAmount: totals.discount.amount,
    status: "Concluida",
    syncStatus: shouldQueueForCloud ? "pending" : "local",
    serviceFee,
    items: structuredClone(cart),
    total,
    cost,
  };

  const splitCompletion = completedSplitBill(activeSplitBill, checkout, sale);
  if (checkout?.splitPersonId && !splitCompletion) {
    notify("Nao foi possivel confirmar esta parte da divisao. A venda continua aberta.");
    return false;
  }
  const releaseTable = !splitCompletion || splitCompletion.complete;

  applyCartStock(cart);
  state.sales.push(sale);
  const queuedRelations = shouldQueueForCloud
    ? queueOfflineSale(sale, fiadoAmount, {
        releaseTable,
        splitBill: splitCompletion && checkout?.splitSource !== "counter" ? splitCompletion.splitBill : null,
      })
    : null;
  if (!shouldQueueForCloud) createKitchenOrders(sale);
  storeDailySalesTotal(localDateKey(sale.date), "automatico");

  if (fiadoAmount > 0) {
    state.clients = state.clients.map((client) =>
      client.id === selectedClientId
        ? {
            ...client,
            debt: Number(client.debt || 0) + fiadoAmount,
            transactions: [
              queuedRelations?.clientTransaction || {
                id: id("clienttx"),
                date: sale.date,
                type: "debito",
                description: sale.items.map((item) => `${item.qty}x ${item.name}`).join(", "),
                amount: fiadoAmount,
                saleId: sale.id,
                userId: session.id,
              },
              ...(client.transactions || []),
            ],
          }
        : client,
    );
  }

  logAudit("Venda finalizada", `${money(total)} em ${paymentDisplay(sale)}${totals.discount.amount > 0 ? ` com desconto de ${money(totals.discount.amount)}` : ""}.`);

  if (checkout && checkout.splitSource !== "counter") {
    state.tables = state.tables.map((entry) =>
      entry.id === checkout.id
        ? releaseTable
          ? { ...entry, status: "Livre", openedAt: null, serverId: null, clientId: null, customerName: "", items: [], splitBill: null }
          : { ...entry, status: "Fechamento", serverId: session.id, splitBill: splitCompletion.splitBill }
        : entry,
    );
    logAudit(
      splitCompletion ? "Parte da mesa recebida" : "Mesa fechada no balcao",
      splitCompletion
        ? `${checkout.name} / ${splitCompletion.person.name}: ${money(total)}. ${splitCompletion.complete ? "Conta concluida." : `${money(tableSplitPendingTotal({ splitBill: splitCompletion.splitBill }))} restante.`}`
        : `${checkout.name}: ${money(total)}.`,
    );
  }

  if (checkout?.splitSource === "counter" && splitCompletion) {
    saveCurrentCounterSplitBill(splitCompletion.complete ? null : splitCompletion.splitBill);
    logAudit(
      "Parte do balcao recebida",
      `Atendimento ${CURRENT_SERVICE_NUMBER} / ${splitCompletion.person.name}: ${money(total)}. ${
        splitCompletion.complete
          ? "Venda dividida concluida."
          : `${money(splitBillPendingTotal(splitCompletion.splitBill))} restante.`
      }`,
    );
  }

  cart = [];
  tableCheckout = null;
  saveState();
  if (shouldQueueForCloud && cloudAvailable) {
    await syncPendingOfflineSales({ silent: true });
  }
  attachSalePrintDetails(sale.id, printDetails);
  lastSaleForTicketsId = sale.id;
  currentModal = { type: "printTickets", id: sale.id };
  const stillPending = pendingOfflineOperations().some((operation) => operation.id === sale.id);
  notify(
    shouldQueueForCloud
      ? stillPending
        ? "Venda concluida e protegida neste computador. Ela sera sincronizada automaticamente quando a conexao estabilizar."
        : checkout
          ? splitCompletion && !splitCompletion.complete
            ? checkout.splitSource === "counter"
              ? `Parte de ${splitCompletion.person.name} recebida. As demais partes continuam pendentes no balcao.`
              : `Parte de ${splitCompletion.person.name} recebida. A mesa continua aberta para os demais pagamentos.`
            : checkout.splitSource === "counter"
              ? "Venda dividida do balcao concluida e sincronizada."
              : "Conta da mesa fechada e sincronizada."
          : "Venda finalizada e sincronizada."
      : splitCompletion && !splitCompletion.complete
        ? checkout?.splitSource === "counter"
          ? `Parte de ${splitCompletion.person.name} recebida. As demais partes continuam pendentes no balcao.`
          : `Parte de ${splitCompletion.person.name} recebida. A mesa continua aberta.`
        : "Venda finalizada.",
  );
  renderApp();
  return true;
}

function canFulfillCart(items) {
  for (const item of items) {
    const product = state.products.find((entry) => entry.id === item.productId);
    if (!product) return { ok: false, message: `Produto nao encontrado: ${item.name}.` };

    if (!product.recipe?.length && product.stock < item.qty) {
      return { ok: false, message: `Estoque insuficiente para ${item.name}.` };
    }

    for (const recipeItem of product.recipe || []) {
      const ingredient = state.ingredients.find((entry) => entry.id === recipeItem.ingredientId);
      const required = recipeItem.qty * item.qty;
      if (!ingredient || ingredient.stock < required) {
        return { ok: false, message: `Insumo insuficiente para ${item.name}: ${ingredient?.name || "item"}.` };
      }
    }
  }

  return { ok: true };
}

function applyCartStock(items) {
  for (const item of items) {
    const product = state.products.find((entry) => entry.id === item.productId);
    if (!product) continue;

    if (product.recipe?.length) {
      state.ingredients = state.ingredients.map((ingredient) => {
        const recipeItem = product.recipe.find((entry) => entry.ingredientId === ingredient.id);
        if (!recipeItem) return ingredient;
        return { ...ingredient, stock: Math.max(0, ingredient.stock - recipeItem.qty * item.qty) };
      });
    } else {
      state.products = state.products.map((entry) =>
        entry.id === product.id ? { ...entry, stock: Math.max(0, entry.stock - item.qty) } : entry,
      );
    }
  }
}

function restoreSaleStock(items) {
  for (const item of items) {
    const product = state.products.find((entry) => entry.id === item.productId);
    if (!product) continue;

    if (product.recipe?.length) {
      state.ingredients = state.ingredients.map((ingredient) => {
        const recipeItem = product.recipe.find((entry) => entry.ingredientId === ingredient.id);
        if (!recipeItem) return ingredient;
        return { ...ingredient, stock: ingredient.stock + recipeItem.qty * item.qty };
      });
    } else {
      state.products = state.products.map((entry) =>
        entry.id === product.id ? { ...entry, stock: entry.stock + item.qty } : entry,
      );
    }
  }
}

function createKitchenOrders(sale) {
  const grouped = {};
  for (const item of sale.items) {
    const product = state.products.find((entry) => entry.id === item.productId);
    const station = product?.station || "Bar";
    if (station !== "Cozinha") continue;
    if (!grouped[station]) grouped[station] = [];
    grouped[station].push({ name: item.name, qty: item.qty });
  }

  Object.entries(grouped).forEach(([station, items]) => {
    state.kitchenOrders.unshift({
      id: id("order"),
      saleId: sale.id,
      date: sale.date,
      station,
      status: "Novo",
      items,
      userId: session.id,
    });
  });
}

async function updateKitchenOrder(orderId, status) {
  const order = state.kitchenOrders.find((entry) => entry.id === orderId);
  if (!order || order.status === "Entregue") return;
  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("kitchen_orders").update({ status }).eq("id", orderId);
    if (error) {
      notify(`Erro ao atualizar cozinha online: ${error.message}`);
      return;
    }
    await loadOnlineSalesData();
    logAudit("Pedido atualizado online", `Pedido ${orderId} marcado como ${status}.`);
    renderApp();
    return;
  }

  if (session?.online && order.syncStatus !== "pending") {
    notify("Este pedido ja esta online. Aguarde a internet voltar para alterar o status.");
    return;
  }
  state.kitchenOrders = state.kitchenOrders.map((order) => (order.id === orderId ? { ...order, status } : order));
  mutatePendingKitchenOrder(orderId, (pendingOrder) => ({ ...pendingOrder, status }));
  logAudit("Pedido atualizado", `Pedido ${orderId} marcado como ${status}.`);
  saveState();
  renderApp();
}

async function finalizeSaleOnline({
  payment,
  clientId,
  total,
  cost,
  paymentBreakdown = [],
  cashReceived = 0,
  cashChange = 0,
  discount = {},
  paymentOrigin = "",
  manualReference = "",
  terminalLabel = "",
  providerReferences = [],
  saleItems = structuredClone(cart),
  serviceFee = 0,
  tableId = null,
  clearCart = true,
  renderAfter = true,
}) {
  const stockResult = await applyCartStockOnline(saleItems);
  if (!stockResult.ok) {
    notify(stockResult.message);
    return;
  }

  const paymentParts = normalizePaymentBreakdown(paymentBreakdown);
  const normalizedDiscount = normalizeDiscount(discount);
  const fiadoAmount = payment === "Fiado" ? total : paymentParts.find((part) => part.method === "Fiado")?.amount || 0;
  const encodedPayment = encodePaymentDetails({
    payment,
    breakdown: paymentParts,
    cashReceived,
    cashChange,
    discount: normalizedDiscount,
    paymentOrigin,
    manualReference,
    terminalLabel,
    providerReferences,
  });
  const saleResult = await supabaseClient
    .from("sales")
    .insert({
      cashier_id: session.id,
      client_id: fiadoAmount > 0 ? clientId : null,
      payment: encodedPayment,
      status: "Concluida",
      service_fee: serviceFee,
      table_id: tableId,
      total,
      cost,
    })
    .select("*")
    .single();

  if (saleResult.error) {
    notify(`Erro ao salvar venda online: ${saleResult.error.message}`);
    await loadOnlineStockData();
    return;
  }

  const saleId = saleResult.data.id;
  const itemsResult = await supabaseClient.from("sale_items").insert(
    saleItems.map((item) => ({
      sale_id: saleId,
      product_id: item.productId,
      name: item.name,
      qty: item.qty,
      price: item.price,
      cost: item.cost,
    })),
  );

  if (itemsResult.error) {
    notify(`Venda criada, mas falhou ao salvar itens: ${itemsResult.error.message}`);
    await loadOnlineSalesData();
    return;
  }

  await createKitchenOrdersOnline({ id: saleId, items: saleItems });

  if (fiadoAmount > 0) {
    const client = state.clients.find((entry) => entry.id === clientId);
    const nextDebt = Number(client?.debt || 0) + fiadoAmount;
    const clientResult = await supabaseClient.from("clients").update({ debt: nextDebt }).eq("id", clientId);
    if (clientResult.error) {
      notify(`Venda salva, mas falhou ao atualizar fiado: ${clientResult.error.message}`);
    } else {
      await supabaseClient.from("client_transactions").insert({
        client_id: clientId,
        sale_id: saleId,
        user_id: session.id,
        type: "debito",
        description: saleItems.map((item) => `${item.qty}x ${item.name}`).join(", "),
        amount: fiadoAmount,
      });
    }
  }

  logAudit(
    "Venda finalizada online",
    `${money(total)} em ${paymentDisplay({ payment, paymentBreakdown: paymentParts, total })}${normalizedDiscount.amount > 0 ? ` com desconto de ${money(normalizedDiscount.amount)}` : ""}.`,
  );
  if (clearCart) cart = [];
  await loadOnlineStockData();
  await loadOnlineClientsData();
  await loadOnlineSalesData();
  notify("Venda salva no Supabase.");
  if (renderAfter) renderApp();
  return saleId;
}

async function releaseTableAfterCheckout(tableId) {
  if (!isOnlineSession() || !tableId) return;
  const { error } = await supabaseClient
    .from("bar_tables")
    .update({ status: "Livre", opened_at: null, server_id: null, client_id: null, customer_name: "", items: [] })
    .eq("id", tableId);

  if (error) {
    notify(`Venda salva, mas falhou ao liberar mesa: ${error.message}`);
    return;
  }

  await loadOnlineTableData();
}

async function applyCartStockOnline(items) {
  for (const item of items) {
    const product = state.products.find((entry) => entry.id === item.productId);
    if (!product) return { ok: false, message: `Produto nao encontrado: ${item.name}.` };

    if (product.recipe?.length) {
      for (const recipeItem of product.recipe) {
        const ingredient = state.ingredients.find((entry) => entry.id === recipeItem.ingredientId);
        if (!ingredient) return { ok: false, message: `Insumo nao encontrado para ${item.name}.` };
        const nextStock = Math.max(0, Number(ingredient.stock || 0) - recipeItem.qty * item.qty);
        const result = await supabaseClient.from("ingredients").update({ stock: nextStock }).eq("id", ingredient.id);
        if (result.error) return { ok: false, message: `Erro ao baixar insumo: ${result.error.message}` };
      }
    } else {
      const nextStock = Math.max(0, Number(product.stock || 0) - item.qty);
      const result = await supabaseClient.from("products").update({ stock: nextStock }).eq("id", product.id);
      if (result.error) return { ok: false, message: `Erro ao baixar estoque: ${result.error.message}` };
    }
  }

  return { ok: true };
}

async function createKitchenOrdersOnline(sale) {
  const grouped = {};
  for (const item of sale.items) {
    const product = state.products.find((entry) => entry.id === item.productId);
    const station = product?.station || "Bar";
    if (station !== "Cozinha") continue;
    if (!grouped[station]) grouped[station] = [];
    grouped[station].push({ name: item.name, qty: item.qty });
  }

  const rows = Object.entries(grouped).map(([station, items]) => ({
    sale_id: sale.id,
    station,
    status: "Novo",
    items,
    user_id: session.id,
  }));

  if (rows.length) {
    const { error } = await supabaseClient.from("kitchen_orders").insert(rows);
    if (error) notify(`Venda salva, mas falhou ao enviar para cozinha: ${error.message}`);
  }
}

async function removeKitchenOrder(orderId) {
  const order = state.kitchenOrders.find((entry) => entry.id === orderId);
  if (!order || order.status === "Entregue") return;

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("kitchen_orders").delete().eq("id", orderId);
    if (error) {
      notify(`Erro ao remover pedido online: ${error.message}`);
      return;
    }
    await loadOnlineSalesData();
    logAudit("Pedido removido online", order.items.map((item) => item.name).join(", "));
    notify("Pedido removido da cozinha.");
    renderApp();
    return;
  }

  if (session?.online && order.syncStatus !== "pending") {
    notify("Este pedido ja esta online. Aguarde a internet voltar para remove-lo.");
    return;
  }
  state.kitchenOrders = state.kitchenOrders.filter((entry) => entry.id !== orderId);
  mutatePendingKitchenOrder(orderId, () => null);
  logAudit("Pedido removido", order.items.map((item) => item.name).join(", "));
  saveState();
  notify("Pedido removido da cozinha.");
  renderApp();
}

function tableTotalValue(table) {
  return (table?.items || []).reduce((sum, item) => sum + item.qty * item.price, 0);
}

function tableServiceFee(subtotal) {
  return subtotal * (Number(state.settings.serviceFee || 0) / 100);
}

const MAX_TABLE_SPLIT_PEOPLE = 8;

function splitWeightedValue(total, weights, precision = 2) {
  const factor = 10 ** precision;
  const totalUnits = Math.round(Math.max(0, Number(total || 0)) * factor);
  const safeWeights = weights.map((weight) => Math.max(0, Number(weight || 0)));
  const weightTotal = safeWeights.reduce((sum, weight) => sum + weight, 0);
  if (!safeWeights.length || weightTotal <= 0) return safeWeights.map(() => 0);
  const raw = safeWeights.map((weight) => (totalUnits * weight) / weightTotal);
  const units = raw.map(Math.floor);
  let remaining = totalUnits - units.reduce((sum, value) => sum + value, 0);
  raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index)
    .forEach(({ index }) => {
      if (remaining <= 0) return;
      units[index] += 1;
      remaining -= 1;
    });
  return units.map((value) => value / factor);
}

function tableSplitPeople(table) {
  return Array.isArray(table?.splitBill?.people) ? table.splitBill.people : [];
}

function tableSplitPaidPeople(table) {
  return tableSplitPeople(table).filter((person) => person.status === "paid");
}

function tableSplitPendingPeople(table) {
  return tableSplitPeople(table).filter((person) => person.status !== "paid");
}

function tableSplitPendingTotal(table) {
  if (!table?.splitBill) return tableTotalValue(table) + tableServiceFee(tableTotalValue(table));
  return Number(tableSplitPendingPeople(table).reduce((sum, person) => sum + Number(person.amount || 0), 0).toFixed(2));
}

function currentCounterSplitBill() {
  return state.counterSplits?.[String(CURRENT_SERVICE_NUMBER)] || null;
}

function saveCurrentCounterSplitBill(splitBill) {
  const next = { ...(state.counterSplits || {}) };
  if (splitBill) next[String(CURRENT_SERVICE_NUMBER)] = splitBill;
  else delete next[String(CURRENT_SERVICE_NUMBER)];
  state.counterSplits = next;
  saveState();
}

function splitBillPeople(splitBill) {
  return Array.isArray(splitBill?.people) ? splitBill.people : [];
}

function splitBillPendingTotal(splitBill) {
  return Number(
    splitBillPeople(splitBill)
      .filter((person) => person.status !== "paid")
      .reduce((sum, person) => sum + Number(person.amount || 0), 0)
      .toFixed(2),
  );
}

function allocateItemsByWeights(items, weights) {
  const allocations = weights.map(() => []);
  (items || []).forEach((item) => {
    splitWeightedValue(item.qty, weights, 3).forEach((quantity, index) => {
      if (quantity <= 0) return;
      allocations[index].push({ ...item, qty: quantity });
    });
  });
  return allocations;
}

function tableSplitModeLabel(mode) {
  if (mode === "items") return "Por produtos";
  if (mode === "custom") return "Valores personalizados";
  return "Partes iguais";
}

function completedSplitBill(sourceSplitBill, checkout, sale) {
  if (!sourceSplitBill || !checkout?.splitPersonId) return null;
  const splitBill = structuredClone(sourceSplitBill);
  const person = splitBill.people.find((entry) => entry.id === checkout.splitPersonId);
  if (!person || person.status === "paid") return null;
  if (person.claimId && checkout.splitClaimId && person.claimId !== checkout.splitClaimId) return null;
  Object.assign(person, {
    status: "paid",
    paidAt: sale.date,
    saleId: sale.id,
    payment: paymentDisplay(sale),
    paymentBreakdown: sale.paymentBreakdown,
    terminalLabel: sale.terminalLabel || "",
    claimId: null,
    claimedAt: null,
  });
  splitBill.updatedAt = sale.date;
  const complete = splitBill.people.every((entry) => entry.status === "paid");
  return { splitBill, complete, person };
}

function completedTableSplit(table, checkout, sale) {
  return completedSplitBill(table?.splitBill, checkout, sale);
}

async function ensureTableSplitSchema() {
  if (!isOnlineSession()) return true;
  const { error } = await supabaseClient.from("bar_tables").select("split_bill").limit(1);
  if (!error) return true;
  notify("Execute SUPABASE_DIVISAO_CONTAS.sql no Supabase antes de dividir contas online.");
  return false;
}

function buildTableSplitPlan(form, table) {
  const count = Math.min(MAX_TABLE_SPLIT_PEOPLE, Math.max(2, Math.trunc(Number(form.get("peopleCount") || 2))));
  const mode = ["equal", "items", "custom"].includes(String(form.get("splitMode"))) ? String(form.get("splitMode")) : "equal";
  const subtotal = Number(tableTotalValue(table).toFixed(2));
  const serviceFee = table.isCounter ? 0 : Number(tableServiceFee(subtotal).toFixed(2));
  const total = Number((subtotal + serviceFee).toFixed(2));
  const names = Array.from({ length: count }, (_, index) => String(form.get(`personName-${index}`) || "").trim() || `Pessoa ${index + 1}`);
  let personTotals = [];
  let personSubtotals = [];
  let serviceShares = [];
  let itemAllocations = [];

  if (mode === "items") {
    itemAllocations = Array.from({ length: count }, () => []);
    for (let itemIndex = 0; itemIndex < table.items.length; itemIndex += 1) {
      const item = table.items[itemIndex];
      const quantities = Array.from({ length: count }, (_, personIndex) =>
        Math.max(0, Number(form.get(`item-${itemIndex}-person-${personIndex}`) || 0)),
      );
      const assigned = quantities.reduce((sum, value) => sum + value, 0);
      if (Math.abs(assigned - Number(item.qty || 0)) > 0.0009) {
        throw new Error(`${item.name}: distribua exatamente ${qty(item.qty)} unidade(s).`);
      }
      quantities.forEach((quantity, personIndex) => {
        if (quantity > 0) itemAllocations[personIndex].push({ ...item, qty: quantity });
      });
    }
    personSubtotals = itemAllocations.map((items) => Number(items.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2)));
    if (personSubtotals.some((value) => value <= 0)) throw new Error("Cada pessoa precisa receber ao menos um produto.");
    serviceShares = splitWeightedValue(serviceFee, personSubtotals, 2);
    personTotals = personSubtotals.map((value, index) => Number((value + serviceShares[index]).toFixed(2)));
  } else {
    const weights = mode === "custom"
      ? Array.from({ length: count }, (_, index) => Math.max(0, Number(form.get(`customAmount-${index}`) || 0)))
      : Array.from({ length: count }, () => 1);
    if (mode === "custom") {
      if (weights.some((value) => value <= 0)) throw new Error("Informe um valor maior que zero para todas as pessoas.");
      const informedTotal = weights.reduce((sum, value) => sum + value, 0);
      if (Math.abs(informedTotal - total) > 0.009) {
        throw new Error(`Os valores precisam somar ${money(total)}. Agora somam ${money(informedTotal)}.`);
      }
      personTotals = weights.map((value) => Number(value.toFixed(2)));
    } else {
      personTotals = splitWeightedValue(total, weights, 2);
    }
    personSubtotals = splitWeightedValue(subtotal, personTotals, 2);
    serviceShares = personTotals.map((value, index) => Number((value - personSubtotals[index]).toFixed(2)));
    itemAllocations = allocateItemsByWeights(table.items, personTotals);
  }

  const people = names.map((name, index) => ({
    id: uuid(),
    name,
    status: "pending",
    amount: personTotals[index],
    subtotal: personSubtotals[index],
    serviceFee: serviceShares[index],
    items: itemAllocations[index],
    paidAt: null,
    saleId: null,
    payment: null,
  }));

  return {
    id: uuid(),
    source: table.isCounter ? "counter" : "table",
    serviceNumber: table.isCounter ? CURRENT_SERVICE_NUMBER : null,
    mode,
    createdAt: new Date().toISOString(),
    createdBy: session.id,
    subtotal,
    serviceFee,
    total,
    originalItems: table.isCounter ? structuredClone(table.items) : [],
    people,
  };
}

async function saveTableSplitPlan(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const isCounter = String(form.get("splitSource") || "") === "counter";
  const table = isCounter
    ? { id: `counter-${CURRENT_SERVICE_NUMBER}`, name: "Venda do balcao", customerName: "", items: structuredClone(cart), isCounter: true }
    : state.tables.find((entry) => entry.id === String(form.get("tableId") || ""));
  if (!table || !table.items?.length) return;
  if (!isCounter && !(await ensureTableSplitSchema())) return;
  const openedFromCheckout = tableCheckout?.id === table.id;
  let splitBill;
  try {
    splitBill = buildTableSplitPlan(form, table);
  } catch (error) {
    notify(error.message || "Revise a divisao da conta.");
    return;
  }

  if (isCounter) {
    saveCurrentCounterSplitBill(splitBill);
    cart = [];
    tableCheckout = null;
    currentModal = null;
    currentView = "pos";
    logAudit("Venda de balcao dividida", `Atendimento ${CURRENT_SERVICE_NUMBER}: ${splitBill.people.length} pessoa(s), ${tableSplitModeLabel(splitBill.mode)}.`);
    notify("Divisao salva. Escolha uma pessoa para receber no balcao.");
    saveState();
    renderApp();
    return;
  }

  if (isOnlineSession()) {
    const { error } = await supabaseClient
      .from("bar_tables")
      .update({ status: "Fechamento", server_id: session.id, split_bill: splitBill })
      .eq("id", table.id);
    if (error) {
      notify(`Erro ao salvar divisao online: ${error.message}`);
      return;
    }
    await loadOnlineTableData();
  } else {
    state.tables = state.tables.map((entry) =>
      entry.id === table.id ? { ...entry, status: "Fechamento", serverId: session.id, splitBill } : entry,
    );
    saveState();
  }
  selectedTableId = table.id;
  if (openedFromCheckout) {
    cart = [];
    tableCheckout = null;
    currentView = "tables";
  }
  currentModal = null;
  logAudit("Conta dividida", `${table.name}: ${splitBill.people.length} pessoa(s), ${tableSplitModeLabel(splitBill.mode)}.`);
  notify("Divisao salva. Escolha uma pessoa para receber no balcao.");
  renderApp();
}

async function startTableSplitPayment(tableId, personId) {
  let table = state.tables.find((entry) => entry.id === tableId);
  let person = tableSplitPeople(table).find((entry) => entry.id === personId);
  if (!table || !person || person.status === "paid") return;
  if (person.status === "processing") {
    notify("Esta parte ja esta sendo recebida em outro atendimento.");
    return;
  }
  const claimId = uuid();
  if (isOnlineSession()) {
    const { data, error } = await supabaseClient.rpc("claim_table_split_payment", {
      p_table_id: table.id,
      p_split_bill_id: table.splitBill.id,
      p_person_id: person.id,
      p_claim_id: claimId,
    });
    if (error) {
      notify(/claim_table_split_payment|schema cache|function/i.test(error.message || "")
        ? "Execute SUPABASE_DIVISAO_CONTAS.sql no Supabase para ativar o pagamento dividido."
        : `Nao foi possivel reservar esta parte: ${error.message}`);
      return;
    }
    if (data?.split_bill) {
      state.tables = state.tables.map((entry) => entry.id === table.id ? { ...entry, splitBill: data.split_bill } : entry);
      table = state.tables.find((entry) => entry.id === tableId);
      person = tableSplitPeople(table).find((entry) => entry.id === personId);
    }
  } else {
    const claimedAt = new Date().toISOString();
    state.tables = state.tables.map((entry) => entry.id === table.id
      ? {
          ...entry,
          splitBill: {
            ...entry.splitBill,
            people: tableSplitPeople(entry).map((candidate) => candidate.id === person.id
              ? { ...candidate, status: "processing", claimId, claimedAt }
              : candidate),
          },
        }
      : entry);
    table = state.tables.find((entry) => entry.id === tableId);
    person = tableSplitPeople(table).find((entry) => entry.id === personId);
    saveState();
  }
  cart = structuredClone(person.items || []);
  tableCheckout = {
    id: table.id,
    name: table.name,
    customerName: table.customerName || "",
    splitBillId: table.splitBill.id,
    splitPersonId: person.id,
    splitPersonName: person.name,
    splitClaimId: claimId,
    splitSubtotal: Number(person.subtotal || 0),
    splitServiceFee: Number(person.serviceFee || 0),
    splitTotal: Number(person.amount || 0),
  };
  currentModal = null;
  currentView = "pos";
  notify(`${person.name}: parte de ${money(person.amount)} carregada no balcao.`);
  renderApp();
}

function startCounterSplitPayment(personId) {
  const splitBill = currentCounterSplitBill();
  const person = splitBillPeople(splitBill).find((entry) => entry.id === personId);
  if (!splitBill || !person || person.status === "paid") return;
  const resuming = person.status === "processing";
  const claimId = resuming && person.claimId ? person.claimId : uuid();
  const claimedAt = new Date().toISOString();
  const nextSplitBill = structuredClone(splitBill);
  const claimedPerson = nextSplitBill.people.find((entry) => entry.id === personId);
  Object.assign(claimedPerson, { status: "processing", claimId, claimedAt, claimedBy: session.id });
  saveCurrentCounterSplitBill(nextSplitBill);
  cart = structuredClone(claimedPerson.items || []);
  tableCheckout = {
    id: null,
    name: "Balcao",
    customerName: "",
    splitSource: "counter",
    splitBillId: nextSplitBill.id,
    splitPersonId: claimedPerson.id,
    splitPersonName: claimedPerson.name,
    splitClaimId: claimId,
    splitSubtotal: Number(claimedPerson.subtotal || 0),
    splitServiceFee: 0,
    splitTotal: Number(claimedPerson.amount || 0),
  };
  currentModal = null;
  currentView = "pos";
  notify(`${claimedPerson.name}: pagamento ${resuming ? "retomado" : "carregado"} no balcao por ${money(claimedPerson.amount)}.`);
  renderApp();
}

async function releaseTableSplitPaymentClaim(checkout = tableCheckout) {
  if (!checkout?.splitPersonId || !checkout?.splitClaimId) return;
  if (checkout.splitSource === "counter") {
    const splitBill = currentCounterSplitBill();
    if (!splitBill || splitBill.id !== checkout.splitBillId) return;
    const nextSplitBill = structuredClone(splitBill);
    const person = nextSplitBill.people.find((entry) => entry.id === checkout.splitPersonId);
    if (person?.status === "processing" && person.claimId === checkout.splitClaimId) {
      Object.assign(person, { status: "pending", claimId: null, claimedAt: null, claimedBy: null });
      saveCurrentCounterSplitBill(nextSplitBill);
    }
    return;
  }
  if (isOnlineSession()) {
    const { error } = await supabaseClient.rpc("release_table_split_payment", {
      p_table_id: checkout.id,
      p_split_bill_id: checkout.splitBillId,
      p_person_id: checkout.splitPersonId,
      p_claim_id: checkout.splitClaimId,
    });
    if (!error) await loadOnlineTableData();
  } else {
    state.tables = state.tables.map((entry) => entry.id === checkout.id
      ? {
          ...entry,
          splitBill: {
            ...entry.splitBill,
            people: tableSplitPeople(entry).map((person) => person.id === checkout.splitPersonId && person.claimId === checkout.splitClaimId
              ? { ...person, status: "pending", claimId: null, claimedAt: null }
              : person),
          },
        }
      : entry);
    saveState();
  }
}

function cancelCounterSplit() {
  const splitBill = currentCounterSplitBill();
  if (!splitBill) return;
  if (splitBillPeople(splitBill).some((person) => person.status === "paid")) {
    notify("A divisao nao pode ser cancelada porque ja existe pagamento concluido.");
    return;
  }
  if (splitBillPeople(splitBill).some((person) => person.status === "processing")) {
    notify("Limpe o atendimento em andamento antes de cancelar a divisao.");
    return;
  }
  if (!confirm("Cancelar esta divisao e restaurar a venda completa no balcao?")) return;
  cart = structuredClone(splitBill.originalItems || []);
  tableCheckout = null;
  saveCurrentCounterSplitBill(null);
  logAudit("Divisao do balcao cancelada", `Atendimento ${CURRENT_SERVICE_NUMBER}.`);
  saveState();
  notify("Divisao cancelada. A venda completa voltou para a comanda.");
  renderApp();
}

async function cancelTableSplit(tableId) {
  const table = state.tables.find((entry) => entry.id === tableId);
  if (!table?.splitBill) return;
  if (tableSplitPaidPeople(table).length) {
    notify("A divisao nao pode ser cancelada porque ja existe pagamento concluido.");
    return;
  }
  if (tableSplitPeople(table).some((person) => person.status === "processing")) {
    notify("Cancele o atendimento em andamento no balcao antes de cancelar a divisao.");
    return;
  }
  if (!confirm("Cancelar esta divisao e voltar a conta para uma comanda unica?")) return;
  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("bar_tables").update({ status: "Aberta", split_bill: null }).eq("id", table.id);
    if (error) {
      notify(`Erro ao cancelar divisao: ${error.message}`);
      return;
    }
    await loadOnlineTableData();
  } else {
    state.tables = state.tables.map((entry) => entry.id === table.id ? { ...entry, status: "Aberta", splitBill: null } : entry);
    saveState();
  }
  logAudit("Divisao cancelada", table.name);
  notify("Divisao cancelada. A comanda voltou a ser unica.");
  renderApp();
}

async function createTables(count) {
  const amount = Math.trunc(Number(count));
  if (!Number.isInteger(amount) || amount < 1 || amount > 30) {
    notify("Informe uma quantidade entre 1 e 30 mesas.");
    return false;
  }

  if (session?.online && !isOnlineSession()) {
    notify("Conecte a internet para cadastrar novas mesas online.");
    return false;
  }

  const firstNumber = nextTableNumber();
  const names = Array.from({ length: amount }, (_, index) => `Mesa ${firstNumber + index}`);

  if (isOnlineSession()) {
    const rows = names.map((name) => ({ name, customer_name: "" }));
    const { error } = await supabaseClient.from("bar_tables").insert(rows);
    if (error) {
      notify(`Erro ao criar mesas online: ${error.message}`);
      return false;
    }

    await loadOnlineTableData();
    selectedTableId = state.tables.find((table) => table.name === names[0])?.id || selectedTableId;
    currentModal = null;
    logAudit("Mesas criadas online", names.join(", "));
    saveState();
    notify(`${amount} ${amount === 1 ? "mesa criada" : "mesas criadas"} com sucesso.`);
    renderApp();
    return true;
  }

  const newTables = names.map((name) => ({
    id: id("table"),
    name,
    customerName: "",
    status: "Livre",
    openedAt: null,
    serverId: null,
    clientId: null,
    items: [],
    splitBill: null,
  }));
  state.tables = [...state.tables, ...newTables].sort((a, b) => tableSortValue(a) - tableSortValue(b));
  selectedTableId = newTables[0].id;
  currentModal = null;
  logAudit("Mesas criadas", names.join(", "));
  saveState();
  notify(`${amount} ${amount === 1 ? "mesa criada" : "mesas criadas"} com sucesso.`);
  renderApp();
  return true;
}

async function saveTableCustomerName(tableId, customerName) {
  const table = state.tables.find((entry) => entry.id === tableId);
  if (table?.splitBill) {
    notify("Finalize a divisao antes de alterar o cliente da mesa.");
    return;
  }
  const nextName = customerName.trim();

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("bar_tables").update({ customer_name: nextName }).eq("id", tableId);
    if (error) {
      notify(`Erro ao salvar nome do cliente: ${error.message}`);
      return;
    }
    await loadOnlineTableData();
    logAudit("Nome do cliente na mesa", `${tableId}: ${nextName || "removido"}.`);
    renderApp();
    return;
  }

  state.tables = state.tables.map((table) => (table.id === tableId ? { ...table, customerName: nextName } : table));
  logAudit("Nome do cliente na mesa", `${tableId}: ${nextName || "removido"}.`);
  saveState();
  renderApp();
}

async function openTable(tableId) {
  selectedTableId = tableId;
  if (isOnlineSession()) {
    const table = state.tables.find((entry) => entry.id === tableId);
    if (!table || table.status !== "Livre") return;
    const { error } = await supabaseClient
      .from("bar_tables")
      .update({ status: "Aberta", opened_at: new Date().toISOString(), server_id: session.id })
      .eq("id", tableId);

    if (error) {
      notify(`Erro ao abrir mesa online: ${error.message}`);
      return;
    }

    await loadOnlineTableData();
    logAudit("Mesa aberta online", table.name);
    renderApp();
    return;
  }

  state.tables = state.tables.map((table) =>
    table.id === tableId && table.status === "Livre"
      ? { ...table, status: "Aberta", openedAt: new Date().toISOString(), serverId: session.id }
      : table,
  );
  logAudit("Mesa aberta", tableId);
  saveState();
  renderApp();
}

async function addProductToTable(tableId, productId) {
  const table = state.tables.find((item) => item.id === tableId);
  const product = state.products.find((item) => item.id === productId);
  if (!table || !product) return;
  if (table.splitBill) {
    notify("Finalize a divisao antes de alterar os produtos desta mesa.");
    return;
  }
  selectedTableId = tableId;

  const item = {
    productId: product.id,
    name: product.name,
    qty: 1,
    price: product.price,
    cost: product.cost,
  };
  const nextItems = structuredClone(table.items || []);
  const existingNextItem = nextItems.find((cartItem) => cartItem.productId === productId);
  if (existingNextItem) existingNextItem.qty += 1;
  else nextItems.push(item);

  const check = canFulfillCart(nextItems);
  if (!check.ok) {
    notify(check.message);
    return;
  }

  if (isOnlineSession()) {
    const { error } = await supabaseClient
      .from("bar_tables")
      .update({
        status: "Aberta",
        opened_at: table.openedAt || new Date().toISOString(),
        server_id: table.serverId || session.id,
        items: nextItems,
      })
      .eq("id", tableId);

    if (error) {
      notify(`Erro ao adicionar item na mesa online: ${error.message}`);
      return;
    }

    await loadOnlineTableData();
    logAudit("Item em mesa online", `${product.name} em ${table.name}.`);
    renderApp();
    return;
  }

  state.tables = state.tables.map((entry) => {
    if (entry.id !== tableId) return entry;
    const items = [...entry.items];
    const existing = items.find((cartItem) => cartItem.productId === productId);
    if (existing) existing.qty += 1;
    else items.push(item);
    return {
      ...entry,
      status: "Aberta",
      openedAt: entry.openedAt || new Date().toISOString(),
      serverId: entry.serverId || session.id,
      items,
    };
  });
  logAudit("Item em mesa", `${product.name} em ${table.name}.`);
  saveState();
  renderApp();
}

async function saveTableItems(tableId, nextItems, actionLabel) {
  const table = state.tables.find((entry) => entry.id === tableId);
  if (!table) return;
  if (table.splitBill) {
    notify("Finalize a divisao antes de editar esta comanda.");
    return;
  }
  const status = table.status === "Livre" ? "Aberta" : table.status;
  const openedAt = table.openedAt || new Date().toISOString();
  selectedTableId = tableId;

  if (isOnlineSession()) {
    const { error } = await supabaseClient
      .from("bar_tables")
      .update({
        status,
        opened_at: openedAt,
        server_id: table.serverId || session.id,
        items: nextItems,
      })
      .eq("id", tableId);

    if (error) {
      notify(`Erro ao editar pedido da mesa: ${error.message}`);
      return;
    }

    await loadOnlineTableData();
    logAudit("Pedido da mesa editado online", `${table.name}: ${actionLabel}.`);
    notify("Pedido da mesa atualizado.");
    renderApp();
    return;
  }

  state.tables = state.tables.map((entry) =>
    entry.id === tableId
      ? {
          ...entry,
          status,
          openedAt,
          serverId: entry.serverId || session.id,
          items: nextItems,
        }
      : entry,
  );
  logAudit("Pedido da mesa editado", `${table.name}: ${actionLabel}.`);
  saveState();
  notify("Pedido da mesa atualizado.");
  renderApp();
}

async function changeTableItemQty(tableId, productId, change) {
  const table = state.tables.find((entry) => entry.id === tableId);
  if (!table) return;
  const nextItems = structuredClone(table.items || []);
  const item = nextItems.find((entry) => entry.productId === productId);
  if (!item) return;

  const nextQty = Number(item.qty || 0) + change;
  if (nextQty <= 0) {
    await removeTableItem(tableId, productId);
    return;
  }

  item.qty = nextQty;
  const check = canFulfillCart(nextItems);
  if (!check.ok) {
    notify(check.message);
    return;
  }

  await saveTableItems(tableId, nextItems, `${item.name} ajustado para ${qty(nextQty)}.`);
}

async function removeTableItem(tableId, productId) {
  const table = state.tables.find((entry) => entry.id === tableId);
  if (!table) return;
  const removed = (table.items || []).find((entry) => entry.productId === productId);
  const nextItems = (table.items || []).filter((entry) => entry.productId !== productId);
  await saveTableItems(tableId, nextItems, `${removed?.name || "Item"} removido.`);
}

async function closeTable(tableId) {
  const table = state.tables.find((entry) => entry.id === tableId);
  if (!table || !table.items.length) return;
  if (table.splitBill) {
    selectedTableId = tableId;
    currentModal = null;
    currentView = "tables";
    notify("A conta ja esta dividida. Escolha uma pessoa para receber.");
    renderApp();
    return;
  }
  selectedTableId = tableId;

  const subtotal = tableTotalValue(table);
  const saleItems = table.items.map((item) => ({ ...item }));
  const check = canFulfillCart(saleItems);
  if (!check.ok) {
    notify(check.message);
    return;
  }

  if (isOnlineSession()) {
    const { error } = await supabaseClient
      .from("bar_tables")
      .update({ status: "Fechamento", server_id: session.id })
      .eq("id", tableId);

    if (error) {
      notify(`Erro ao enviar mesa para o balcao: ${error.message}`);
      return;
    }

    cart = structuredClone(saleItems);
    tableCheckout = { id: table.id, name: table.name, customerName: table.customerName || "" };
    currentModal = null;
    currentView = "pos";
    await loadOnlineTableData();
    logAudit("Mesa enviada ao balcao", `${table.name}: ${money(subtotal)}.`);
    notify("Conta enviada para o balcao. Escolha a forma de pagamento para fechar.");
    renderApp();
    return;
  }

  state.tables = state.tables.map((entry) =>
    entry.id === tableId ? { ...entry, status: "Fechamento", serverId: session.id } : entry,
  );
  cart = structuredClone(saleItems);
  tableCheckout = { id: table.id, name: table.name, customerName: table.customerName || "" };
  currentView = "pos";
  currentModal = null;
  logAudit("Mesa enviada ao balcao", `${table.name}: ${money(subtotal)}.`);
  saveState();
  notify("Conta enviada para o balcao. Escolha a forma de pagamento para fechar.");
  renderApp();
}

async function clearTable(tableId) {
  const tableToClear = state.tables.find((entry) => entry.id === tableId);
  if (tableToClear?.splitBill && tableSplitPaidPeople(tableToClear).length) {
    notify("Esta mesa possui pagamentos da divisao. Conclua as partes restantes para libera-la.");
    return;
  }
  selectedTableId = tableId;
  if (isOnlineSession()) {
    const { error } = await supabaseClient
      .from("bar_tables")
      .update({ status: "Livre", opened_at: null, server_id: null, client_id: null, customer_name: "", items: [], split_bill: null })
      .eq("id", tableId);

    if (error) {
      notify(`Erro ao liberar mesa online: ${error.message}`);
      return;
    }

    currentModal = null;
    await loadOnlineTableData();
    logAudit("Mesa liberada online", tableId);
    renderApp();
    return;
  }

  state.tables = state.tables.map((table) =>
    table.id === tableId ? { ...table, status: "Livre", openedAt: null, serverId: null, clientId: null, customerName: "", items: [], splitBill: null } : table,
  );
  currentModal = null;
  logAudit("Mesa liberada", tableId);
  saveState();
  renderApp();
}

async function transferTable(tableId) {
  const targetId = document.querySelector("#target-table-id")?.value;
  const source = state.tables.find((table) => table.id === tableId);
  const target = state.tables.find((table) => table.id === targetId);
  if (!source || !targetId || !source.items.length) return;
  if (source.splitBill || target?.splitBill) {
    notify("Nao e possivel transferir ou juntar mesas com uma divisao em andamento.");
    return;
  }

  if (isOnlineSession()) {
    const targetItems = combineItems(target?.items || [], source.items || []);
    const updates = await Promise.all([
      supabaseClient
        .from("bar_tables")
        .update({
          status: "Aberta",
          opened_at: target?.openedAt || new Date().toISOString(),
          server_id: target?.serverId || session.id,
          customer_name: target?.customerName || source.customerName || "",
          items: targetItems,
        })
        .eq("id", targetId),
      supabaseClient
        .from("bar_tables")
        .update({ status: "Livre", opened_at: null, server_id: null, client_id: null, customer_name: "", items: [], split_bill: null })
        .eq("id", tableId),
    ]);

    const error = updates.find((result) => result.error)?.error;
    if (error) {
      notify(`Erro ao transferir mesa online: ${error.message}`);
      return;
    }

    currentModal = { type: "table", id: targetId };
    selectedTableId = targetId;
    await loadOnlineTableData();
    logAudit("Mesa transferida online", `${source.name} para ${target?.name || targetId}.`);
    renderApp();
    return;
  }

  state.tables = state.tables.map((table) => {
    if (table.id === targetId) {
      return {
        ...table,
        status: "Aberta",
        openedAt: table.openedAt || new Date().toISOString(),
        serverId: table.serverId || session.id,
        customerName: table.customerName || source.customerName || "",
        items: combineItems(table.items, source.items),
      };
    }
    if (table.id === tableId) {
      return { ...table, status: "Livre", openedAt: null, serverId: null, clientId: null, customerName: "", items: [], splitBill: null };
    }
    return table;
  });
  currentModal = { type: "table", id: targetId };
  selectedTableId = targetId;
  logAudit("Mesa transferida", `${source.name} para ${state.tables.find((table) => table.id === targetId)?.name}.`);
  saveState();
  renderApp();
}

async function mergeTable(tableId) {
  const targetId = document.querySelector("#target-table-id")?.value;
  if (!targetId) return;
  await transferTable(tableId);
  logAudit("Mesas juntadas", `${tableId} em ${targetId}.`);
}

function combineItems(baseItems, extraItems) {
  const next = structuredClone(baseItems || []);
  extraItems.forEach((item) => {
    const existing = next.find((entry) => entry.productId === item.productId);
    if (existing) existing.qty += item.qty;
    else next.push({ ...item });
  });
  return next;
}

function renderSales() {
  const sales = state.sales.slice().reverse();
  const openCash = getOpenCash();
  const cashDaySales = salesForOpenCashDay();
  const cashDayReceivedSales = cashDaySales.filter(isReceivedSale);
  const cashDayFiadoSales = cashDaySales.filter((sale) => saleFiadoAmount(sale) > 0);
  const cashDayTotal = cashDayReceivedSales.reduce((sum, sale) => sum + saleReceivedAmount(sale), 0);
  const cashDayProfit = cashDayReceivedSales.reduce((sum, sale) => sum + saleReceivedProfit(sale), 0);
  const cashDayFiadoTotal = cashDayFiadoSales.reduce((sum, sale) => sum + saleFiadoAmount(sale), 0);
  const weeklyRange = salesReportPeriodRange("weekly");
  const weeklySales = salesForRange(weeklyRange.start, weeklyRange.end);
  const weeklyReceivedTotal = weeklySales.filter(isReceivedSale).reduce((sum, sale) => sum + saleReceivedAmount(sale), 0);
  const weeklyTopProducts = topProductsForPeriod(7, 10);
  const todaySales = salesForToday({ includeInactive: true }).slice().reverse();
  const todayFinancialSales = todaySales.filter(isFinancialSale);
  const todayReceivedSales = todayFinancialSales.filter(isReceivedSale);
  const todayFiadoSales = todayFinancialSales.filter((sale) => saleFiadoAmount(sale) > 0);
  const todayZeroedSales = todaySales.filter(isZeroedSale);
  const todayTotal = todayReceivedSales.reduce((sum, sale) => sum + saleReceivedAmount(sale), 0);
  const todayProfit = todayReceivedSales.reduce((sum, sale) => sum + saleReceivedProfit(sale), 0);
  const todayFiadoTotal = todayFiadoSales.reduce((sum, sale) => sum + saleFiadoAmount(sale), 0);
  const filteredDateSales = salesDateFilter ? salesForDateKey(salesDateFilter, { includeCanceled: true }).slice().reverse() : [];
  const filteredZeroedSales = filteredDateSales.filter(isZeroedSale);
  const pendingOffline = pendingOfflineOperations();

  return `
    <div class="section-title">
      <div>
        <h2>Vendas</h2>
        <p>${isOnlineSession() ? "Historico e novas vendas salvando no Supabase." : "Modo de contingencia: vendas protegidas neste aparelho."}</p>
      </div>
      <div class="toolbar">
        <button class="btn secondary" type="button" data-refresh-sales ${isOnlineSession() ? "" : "disabled"}>${icon("download")} Atualizar vendas</button>
        <button class="btn secondary" type="button" data-print-sales-period-report="daily">${icon("print")} Diario</button>
        <button class="btn secondary" type="button" data-print-sales-period-report="weekly">${icon("print")} Semanal</button>
        <button class="btn secondary" type="button" data-print-sales-period-report="monthly">${icon("print")} Mensal</button>
        <button class="btn secondary" type="button" data-print-sales-period-report="semester">${icon("print")} Semestral</button>
        <button class="btn secondary" type="button" data-print-sales-period-report="annual">${icon("print")} Anual</button>
        <button class="btn danger" type="button" data-zero-today-sales ${todayReceivedSales.length ? "" : "disabled"}>Zerar vendas do dia</button>
      </div>
    </div>
    ${
      pendingOffline.length
        ? `<section class="offline-sync-panel">
            <div>
              <strong>${pendingOffline.length} venda${pendingOffline.length === 1 ? "" : "s"} aguardando sincronizacao</strong>
              <span>${hasNetworkConnection() ? "A conexao voltou. Envie agora para o Supabase." : "Elas permanecem salvas neste aparelho ate a internet voltar."}</span>
              ${connectionState.lastError ? `<small>${escapeHtml(connectionState.lastError)}</small>` : ""}
            </div>
            <button class="btn ${hasNetworkConnection() ? "primary" : "secondary"}" type="button" data-sync-pending ${hasNetworkConnection() ? "" : "disabled"}>Sincronizar agora</button>
          </section>`
        : ""
    }
    <div class="grid stats">
      ${metric("Total recebido do dia", money(cashDayTotal), openCash ? "Caixa atual; zera ao fechar ou virar o dia" : "Caixa fechado; abre um caixa para iniciar", "R$")}
      ${metric("Total semanal", money(weeklyReceivedTotal), "Ultimos 7 dias, sem contar fiado", "7D")}
      ${metric("Lucro recebido", money(cashDayProfit), "Receita recebida menos custo", "%")}
      ${metric("Fiado do dia", money(cashDayFiadoTotal), `${cashDayFiadoSales.length} venda(s) a receber`, "FD")}
    </div>
    <section class="card pad" style="margin-top: 16px;">
      <form id="sales-date-filter-form" class="form-grid">
        <label class="field">
          <span>Buscar vendas por data</span>
          <input name="salesDate" type="date" value="${salesDateFilter}" />
        </label>
        <div class="field-actions">
          <button class="btn primary" type="submit">Buscar</button>
          <button class="btn secondary" type="button" data-clear-sales-date-filter ${salesDateFilter ? "" : "disabled"}>Limpar</button>
          ${
            filteredZeroedSales.length
              ? `<button class="btn secondary" type="button" data-restore-zeroed-sales-date>Restaurar zeradas deste dia</button>`
              : ""
          }
        </div>
      </form>
      ${
        salesDateFilter
          ? `<div style="margin-top: 14px;">
              <div class="card-head">
                <div>
                  <h2 class="card-title">Resultado de ${formatDateKeyBr(salesDateFilter)}</h2>
                  <p>${filteredDateSales.length} venda(s) encontrada(s), incluindo zeradas e canceladas.</p>
                </div>
              </div>
              ${salesTable(filteredDateSales)}
            </div>`
          : ""
      }
    </section>
    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
        <div>
          <h2 class="card-title">Resumo diario</h2>
          <p>Vendas de hoje, sem contar fiado, canceladas ou zeradas.</p>
        </div>
        <div class="toolbar">
          <button class="btn compact secondary" type="button" data-print-daily-sales-report>${icon("print")} PDF diario</button>
          <button class="btn compact secondary" type="button" data-store-daily-sales-total>Salvar total de hoje</button>
          <button class="btn compact danger" type="button" data-zero-today-sales ${todayReceivedSales.length ? "" : "disabled"}>Zerar dia</button>
        </div>
      </div>
      <div class="summary-list">
        <div class="summary-row total"><span>Recebido hoje</span><strong>${money(todayTotal)}</strong></div>
        <div class="summary-row"><span>Fiado separado hoje</span><strong>${money(todayFiadoTotal)}</strong></div>
        <div class="summary-row"><span>Lucro estimado hoje</span><strong>${money(todayProfit)}</strong></div>
        <div class="summary-row"><span>Vendas recebidas</span><strong>${todayReceivedSales.length}</strong></div>
        <div class="summary-row"><span>Fiado hoje</span><strong>${todayFiadoSales.length}</strong></div>
        <div class="summary-row"><span>Vendas zeradas</span><strong>${todayZeroedSales.length}</strong></div>
      </div>
    </section>
    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
        <div>
          <h2 class="card-title">Top 10 produtos da semana</h2>
          <p>Mais vendidos nos ultimos 7 dias, incluindo pagamentos externos com produtos.</p>
        </div>
      </div>
      ${topProductsTable(weeklyTopProducts)}
    </section>
    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
        <h2 class="card-title">Historico do dia</h2>
      </div>
      ${salesTable(todaySales)}
    </section>
    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
        <div>
          <h2 class="card-title">Totais diarios armazenados</h2>
          <p>Memoria diaria do quanto foi vendido, recebido e deixado em fiado.</p>
        </div>
        <button class="btn compact secondary" type="button" data-store-daily-sales-total>Atualizar hoje</button>
      </div>
      ${renderDailySalesTotalsTable()}
    </section>
    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
        <h2 class="card-title">Historico completo de vendas</h2>
        <div class="toolbar">
          <button class="btn compact secondary" type="button" data-print-report>${icon("print")} Gerar relatorio</button>
          <button class="btn compact secondary" type="button" data-open-modal="externalPayment">Registrar pagamento externo</button>
          ${
            openCash && hasPermission("cash")
              ? `<button class="btn compact secondary" type="button" data-close-cash-sales-report="auto">${icon("print")} Fechar caixa + relatorio</button>`
              : ""
          }
          <button class="btn compact danger" type="button" data-zero-today-sales ${todayReceivedSales.length ? "" : "disabled"}>Zerar vendas do dia</button>
        </div>
      </div>
      ${salesTable(sales)}
    </section>
  `;
}

function salesTable(sales) {
  if (!sales.length) return '<div class="empty">Nenhuma venda registrada.</div>';

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Produtos vendidos</th>
            <th>Pagamento</th>
            <th>Status</th>
            <th>Operador</th>
            <th>Desc.</th>
            <th>Total</th>
            <th>Lucro</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          ${sales
            .map(
              (sale) => `
                <tr>
                  <td>${dateTime(sale.date)}</td>
                  <td>${saleItemsSummary(sale)}</td>
                  <td><span class="status blue">${paymentDisplay(sale)}</span></td>
                  <td>
                    <span class="status ${saleStatusClass(sale)}">${sale.status || "Concluida"}</span>
                    ${sale.syncStatus === "pending" ? '<span class="status amber sync-sale-status">Aguardando nuvem</span>' : ""}
                  </td>
                  <td>${userName(sale.cashierId)}</td>
                  <td>${saleDiscountAmount(sale) ? money(saleDiscountAmount(sale)) : "-"}</td>
                  <td>${money(saleDisplayTotal(sale))}</td>
                  <td>${money(saleDisplayProfit(sale))}</td>
                  <td>
                    <div class="toolbar">
                      <button class="btn compact secondary" type="button" data-print-sale="${sale.id}">${icon("print")} Recibo</button>
                      ${(sale.items || []).length && !isManualChargeSale(sale) ? `<button class="btn compact secondary" type="button" data-print-ticket="${sale.id}">${icon("print")} Ficha</button>` : ""}
                      ${
                        !isFinancialSale(sale)
                          ? ""
                          : `<button class="btn compact danger" type="button" data-cancel-sale="${sale.id}">Cancelar</button>`
                      }
                    </div>
                  </td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function clearSales() {
  if (!confirm("Limpar todo o historico de vendas? Esta acao nao apaga produtos, clientes nem estoque.")) return;
  const cleared = state.sales.length;

  if (isOnlineSession()) {
    await supabaseClient.from("sale_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseClient.from("kitchen_orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabaseClient.from("cancellations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error } = await supabaseClient.from("sales").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      notify(`Erro ao limpar vendas online: ${error.message}`);
      return;
    }
    await loadOnlineSalesData();
    logAudit("Vendas limpas online", `${cleared} venda(s) removida(s) do historico.`);
    notify("Historico de vendas online limpo.");
    renderApp();
    return;
  }

  state.sales = [];
  state.kitchenOrders = [];
  state.cancellations = [];
  logAudit("Vendas limpas", `${cleared} venda(s) removida(s) do historico.`);
  saveState();
  notify("Historico de vendas limpo.");
  renderApp();
}

async function zeroTodaySales() {
  const todayReceivedSales = salesForToday({ includeInactive: true }).filter(isReceivedSale);
  if (!todayReceivedSales.length) {
    notify("Nao ha vendas recebidas de hoje para zerar.");
    return;
  }

  if (
    !confirm(
      `Zerar o valor de ${todayReceivedSales.length} venda(s) recebida(s) de hoje? Os produtos vendidos continuarao no historico.`,
    )
  ) {
    return;
  }

  const saleIds = todayReceivedSales.map((sale) => sale.id);

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("sales").update({ status: "Zerada" }).in("id", saleIds);
    if (error) {
      notify(`Erro ao zerar vendas online: ${error.message}`);
      return;
    }

    await loadOnlineSalesData();
    storeDailySalesTotal(localDateKey(), "zerar dia");
    saveState();
    logAudit("Vendas do dia zeradas online", `${todayReceivedSales.length} venda(s) mantida(s) no historico.`);
    notify("Vendas recebidas de hoje foram zeradas, sem apagar produtos do historico.");
    renderApp();
    return;
  }

  state.sales = state.sales.map((sale) => (saleIds.includes(sale.id) ? { ...sale, status: "Zerada" } : sale));
  storeDailySalesTotal(localDateKey(), "zerar dia");
  logAudit("Vendas do dia zeradas", `${todayReceivedSales.length} venda(s) mantida(s) no historico.`);
  saveState();
  notify("Vendas recebidas de hoje foram zeradas, sem apagar produtos do historico.");
  renderApp();
}

function applySalesDateFilter(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  salesDateFilter = String(form.get("salesDate") || "");
  renderApp();
}

function clearSalesDateFilter() {
  salesDateFilter = "";
  renderApp();
}

async function restoreZeroedSalesForSelectedDate() {
  if (!salesDateFilter) return;
  const zeroedSales = salesForDateKey(salesDateFilter, { includeCanceled: true }).filter(isZeroedSale);
  if (!zeroedSales.length) {
    notify("Nao ha vendas zeradas nessa data para restaurar.");
    return;
  }

  if (
    !confirm(
      `Restaurar ${zeroedSales.length} venda(s) zerada(s) de ${formatDateKeyBr(salesDateFilter)}? Elas voltarao a contar nos totais e relatorios.`,
    )
  ) {
    return;
  }

  const saleIds = zeroedSales.map((sale) => sale.id);

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("sales").update({ status: "Concluida" }).in("id", saleIds);
    if (error) {
      notify(`Erro ao restaurar vendas online: ${error.message}`);
      return;
    }
    await loadOnlineSalesData();
  } else {
    state.sales = state.sales.map((sale) => (saleIds.includes(sale.id) ? { ...sale, status: "Concluida" } : sale));
  }

  storeDailySalesTotal(salesDateFilter, "restauracao");
  logAudit("Vendas zeradas restauradas", `${zeroedSales.length} venda(s) de ${formatDateKeyBr(salesDateFilter)}.`);
  saveState();
  notify("Vendas restauradas e totais recalculados.");
  renderApp();
}

function renderCash() {
  const openCash = getOpenCash();
  const summary = cashSummary(openCash);
  const todaySales = salesForToday();
  const receivedToday = todaySales.filter(isReceivedSale);
  const movements = state.cashMovements.slice().reverse();
  const cashHistory = state.cashSessions.slice().reverse();
  const externalPayments = state.sales.filter(isExternalPaymentSale).slice().reverse().slice(0, 20);

  return `
    <div class="section-title">
      <div>
        <h2>Caixa</h2>
        <p>Abertura automatica diaria as 06:00 com saldo inicial zero. ${isOnlineSession() ? "Salvando no Supabase." : "Modo local."}</p>
      </div>
      <div class="toolbar">
        <button class="btn secondary" type="button" data-open-modal="externalPayment">Registrar pagamento externo</button>
        <button class="btn danger" type="button" data-open-modal="movement" data-movement-type="despesa" ${openCash ? "" : "disabled"}>Saida para despesa</button>
      </div>
    </div>

    <div class="grid stats">
      ${metric("Status", openCash ? "Aberto" : "Fechado", openCash ? userName(openCash.userId) : "Sem turno ativo", "CX")}
      ${metric("Caixa", openCash ? cashSessionCode(openCash) : nextCashSessionCode(), openCash ? "Turno atual" : "Proximo turno", "N")}
      ${metric("Abertura", money(openCash?.openingAmount || 0), openCash ? dateTime(openCash.openedAt) : "Aguardando abertura", "AB")}
      ${metric("Esperado", money(summary.expected), "Abertura + vendas + movimentos", "EX")}
      ${metric("Recebido hoje", money(receivedToday.reduce((sum, sale) => sum + saleReceivedAmount(sale), 0)), "Sem contar vendas em fiado", "R$")}
    </div>

    <div class="grid two-col" style="margin-top: 16px;">
      <section class="card pad">
        <h2 class="card-title">${openCash ? "Fechamento detalhado" : "Abrir caixa"}</h2>
        <form id="cash-form" style="margin-top: 14px;">
          ${
            openCash
              ? renderCashClosingForm(openCash, summary)
              : `<div class="form-grid">
                  <label class="field">
                    <span>Valor inicial</span>
                    <input name="amount" type="number" min="0" step="0.01" required />
                  </label>
                  <label class="field full">
                    <span>Observacao</span>
                    <textarea name="notes"></textarea>
                  </label>
                </div>`
          }
          <button class="btn primary" type="submit">${openCash ? "Fechar caixa" : "Abrir caixa"}</button>
          ${
            openCash
              ? `<button class="btn secondary" style="width: 100%; margin-top: 10px;" type="button" data-close-cash-sales-report="form">${icon("print")} Fechar caixa e baixar relatorio de vendas</button>`
              : ""
          }
        </form>
      </section>

      <section class="card">
        <div class="card-head">
          <h2 class="card-title">Resumo por forma</h2>
        </div>
        <div class="summary-list">
          ${cashPaymentMethods
            .map(
              (method) => `
                <div class="summary-row">
                  <span>${method}</span>
                  <strong>${money(summary.payments[method] || 0)}</strong>
                </div>
              `,
            )
            .join("")}
          <div class="summary-row total"><span>Movimentos</span><strong>${money(summary.movements)}</strong></div>
          <div class="summary-row total"><span>Esperado</span><strong>${money(summary.expected)}</strong></div>
        </div>
      </section>
    </div>

    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
        <div>
          <h2 class="card-title">Pagamentos externos da maquininha</h2>
          <p>Use quando a venda foi feita direto na Point. Entra no caixa, sem baixar estoque.</p>
        </div>
        <button class="btn compact secondary" type="button" data-open-modal="externalPayment">Adicionar</button>
      </div>
      ${
        externalPayments.length
          ? `<div class="table-wrap">
              <table>
                <thead><tr><th>Data</th><th>Forma</th><th>Maquininha</th><th>Valor</th><th>Operador</th><th>Status</th></tr></thead>
                <tbody>
                  ${externalPayments
                    .map(
                      (sale) => `
                        <tr>
                          <td>${dateTime(sale.date)}</td>
                          <td><span class="status blue">${paymentDisplay(sale)}</span></td>
                          <td>${sale.terminalLabel ? escapeHtml(ticketTerminalLabel({ label: sale.terminalLabel })) : "-"}</td>
                          <td>${money(sale.total)}</td>
                          <td>${userName(sale.cashierId)}</td>
                          <td><span class="status ${saleStatusClass(sale)}">${sale.status || "Concluida"}</span></td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>`
          : '<div class="empty">Nenhum pagamento externo registrado.</div>'
      }
    </section>

    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
          <h2 class="card-title">Sangrias, suprimentos e despesas</h2>
          <div class="toolbar">
            <button class="btn compact danger" type="button" data-open-modal="movement" data-movement-type="despesa" ${openCash ? "" : "disabled"}>Despesa do dia</button>
            <button class="btn compact secondary" type="button" data-open-modal="movement" ${openCash ? "" : "disabled"}>Adicionar</button>
          </div>
      </div>
      ${
        movements.length
          ? `<div class="table-wrap">
              <table>
                <thead><tr><th>Data</th><th>Tipo</th><th>Valor</th><th>Motivo</th><th>Usuario</th></tr></thead>
                <tbody>
                  ${movements
                    .map(
                      (movement) => `
                        <tr>
                          <td>${dateTime(movement.date)}</td>
                          <td><span class="status ${movement.type === "suprimento" ? "green" : "red"}">${movement.type}</span></td>
                          <td>${money(movement.amount)}</td>
                          <td>${movement.reason}</td>
                          <td>${userName(movement.userId)}</td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>`
          : '<div class="empty">Nenhuma movimentacao manual.</div>'
      }
    </section>
    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
        <h2 class="card-title">Historico de caixas</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Caixa</th><th>Abertura</th><th>Fechamento</th><th>Operador</th><th>Esperado</th><th>Contado</th><th>Diferenca</th><th>Conferencia</th><th>Obs.</th></tr></thead>
          <tbody>
            ${cashHistory
              .map(
                (cash) => `
                  <tr>
                    <td><strong>${cashSessionCode(cash)}</strong></td>
                    <td>${dateTime(cash.openedAt)}</td>
                    <td>${cash.closedAt ? dateTime(cash.closedAt) : '<span class="status green">Aberto</span>'}</td>
                    <td>${userName(cash.userId)}</td>
                    <td>${cash.expectedAmount === null ? "-" : money(cash.expectedAmount)}</td>
                    <td>${cash.closingAmount === null ? "-" : money(cash.closingAmount)}</td>
                    <td>${cash.difference === null ? "-" : money(cash.difference)}</td>
                    <td>${cashClosingStatusMarkup(cash)}</td>
                    <td>${cash.notes || ""}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function countedFromCashForm(form) {
  return Object.fromEntries(cashPaymentMethods.map((method) => [method, Number(form.get(`counted-${method}`) || 0)]));
}

function expectedCountedForCash(openCash) {
  const summary = cashSummary(openCash);
  return Object.fromEntries(cashPaymentMethods.map((method) => [method, cashCountedValueForMethod(openCash, summary, method)]));
}

function cashCountedValueForMethod(openCash, summary, method) {
  const paymentValue = Number(summary.payments[method] || 0);
  if (method !== "Dinheiro") return paymentValue;
  return paymentValue + Number(openCash?.openingAmount || 0) + Number(summary.movements || 0);
}

async function closeOpenCash({ counted, notes = "", authorization = null } = {}) {
  const openCash = getOpenCash();
  if (!openCash) {
    notify("Nao ha caixa aberto para fechar.");
    return null;
  }

  const finalCounted = counted || expectedCountedForCash(openCash);
  const closingAmount = Object.values(finalCounted).reduce((sum, value) => sum + Number(value || 0), 0);
  const summary = cashSummary(openCash);
  const closedAt = new Date().toISOString();
  const closingReconciliation = buildClosingReconciliation(openCash, summary, finalCounted, authorization, closedAt);
  const closedCash = {
    ...openCash,
    cashCode: openCash.cashCode || cashSessionCode(openCash),
    closedAt,
    closingAmount,
    closingBreakdown: closingReconciliation,
    expectedAmount: summary.expected,
    difference: closingReconciliation.totalDifference,
    notes,
  };
  storeDailySalesTotal(localDateKey(closedAt), "fechamento caixa");

  if (isOnlineSession()) {
    const { error } = await supabaseClient
      .from("cash_sessions")
      .update({
        closed_at: closedAt,
        closing_amount: closingAmount,
        closing_breakdown: closingReconciliation,
        expected_amount: summary.expected,
        difference: closedCash.difference,
        notes,
      })
      .eq("id", openCash.id);

    if (error) {
      notify(`Erro ao fechar caixa online: ${error.message}`);
      return null;
    }

    await loadOnlineCashData();
    saveState();
    logAudit("Caixa fechado online", `${closedCash.cashCode}: diferenca ${money(closedCash.difference)}.`);
    notify("Caixa fechado no Supabase.");
    return closedCash;
  }

  Object.assign(openCash, closedCash);
  logAudit("Caixa fechado", `${closedCash.cashCode}: diferenca ${money(openCash.difference)}.`);
  saveState();
  notify("Caixa fechado.");
  return closedCash;
}

function salesForCashPeriod(cash) {
  if (!cash?.openedAt) return [];
  const start = new Date(cash.openedAt).getTime();
  const end = cash.closedAt ? new Date(cash.closedAt).getTime() : Date.now();
  return state.sales.filter((sale) => {
    const date = new Date(sale.date).getTime();
    return isFinancialSale(sale) && date >= start && date <= end;
  });
}

function salesForRange(start, end, { includeInactive = false } = {}) {
  const startTime = start instanceof Date ? start.getTime() : new Date(start).getTime();
  const endTime = end instanceof Date ? end.getTime() : new Date(end).getTime();
  return state.sales.filter((sale) => {
    const date = new Date(sale.date).getTime();
    return (includeInactive || isFinancialSale(sale)) && date >= startTime && date <= endTime;
  });
}

function salesForOpenCashDay() {
  const openCash = getOpenCash();
  if (!openCash?.openedAt) return [];
  const start = new Date(Math.max(new Date(openCash.openedAt).getTime(), startOfToday().getTime()));
  return salesForRange(start, new Date());
}

function salesReportPeriodRange(period = "daily") {
  const now = new Date();
  const start = new Date(now);
  let title = "Relatorio diario de vendas";
  let label = "Hoje";
  let filePart = "diario";

  if (period === "weekly" || period === "7d") {
    start.setDate(now.getDate() - 6);
    title = "Relatorio semanal de vendas";
    label = "Ultimos 7 dias";
    filePart = "semanal";
  } else if (period === "monthly") {
    start.setDate(1);
    title = "Relatorio mensal de vendas";
    label = "Mes atual";
    filePart = "mensal";
  } else if (period === "semester") {
    start.setMonth(now.getMonth() < 6 ? 0 : 6, 1);
    title = "Relatorio semestral de vendas";
    label = now.getMonth() < 6 ? "1o semestre do ano" : "2o semestre do ano";
    filePart = "semestral";
  } else if (period === "annual") {
    start.setMonth(0, 1);
    title = "Relatorio anual de vendas";
    label = "Ano atual";
    filePart = "anual";
  } else {
    start.setHours(0, 0, 0, 0);
  }

  start.setHours(0, 0, 0, 0);
  return { start, end: now, title, label, filePart };
}

function cashSalesPaymentTotals(sales) {
  const totals = Object.fromEntries(cashPaymentMethods.map((method) => [method, 0]));
  sales.forEach((sale) => {
    if (!isReceivedSale(sale)) return;
    salePaymentParts(sale).forEach((part) => {
      if (part.method === "Fiado") return;
      const key = normalizePaymentMethod(part.method);
      totals[key] = Number(totals[key] || 0) + Number(part.amount || 0);
    });
  });
  return totals;
}

function isExternalPaymentSale(sale) {
  return sale?.status === "Pagamento externo";
}

function isManualChargeSale(sale) {
  return sale?.status === "Cobranca avulsa" || sale?.paymentOrigin === "manual_charge";
}

function isZeroedSale(sale) {
  return sale?.status === "Zerada";
}

function isFinancialSale(sale) {
  return sale?.status !== "Cancelada" && !isZeroedSale(sale);
}

function isReceivedSale(sale) {
  return isFinancialSale(sale) && saleReceivedAmount(sale) > 0;
}

function saleDisplayTotal(sale) {
  return isZeroedSale(sale) ? 0 : Number(sale?.total || 0);
}

function saleDiscountAmount(sale) {
  return Number(sale?.discountAmount || sale?.discount?.amount || 0);
}

function saleDisplayProfit(sale) {
  return isZeroedSale(sale) ? 0 : Number(sale?.total || 0) - Number(sale?.cost || 0);
}

function saleItemsLabel(sale) {
  const count = (sale.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);
  if (isManualChargeSale(sale)) return "Cobranca avulsa";
  if (isExternalPaymentSale(sale) && count > 0) return `${qty(count)} ${count === 1 ? "item" : "itens"} (externo)`;
  if (isExternalPaymentSale(sale)) return "Pagamento externo da maquininha";
  return `${qty(count)} ${count === 1 ? "item" : "itens"}`;
}

function saleItemsDescription(sale) {
  if (sale?.splitPersonName && sale.splitMode !== "items") {
    const names = [...new Set((sale.items || []).map((item) => item.name).filter(Boolean))].join(", ");
    return `${names || "Parte da conta"} (rateio de ${sale.splitPersonName})`;
  }
  const itemsText = (sale.items || []).map((item) => `${qty(item.qty)}x ${item.name}`).join(", ");
  if (isManualChargeSale(sale)) return itemsText || sale.manualReference || "Cobranca avulsa";
  if (isExternalPaymentSale(sale) && itemsText) return `${itemsText} (pagamento externo)`;
  if (isExternalPaymentSale(sale)) return "Pagamento externo da maquininha";
  return itemsText;
}

function saleItemsSummary(sale) {
  return escapeHtml(saleItemsDescription(sale) || saleItemsLabel(sale));
}

function saleStatusClass(sale) {
  if (sale.status === "Cancelada") return "red";
  if (isZeroedSale(sale)) return "amber";
  if (isExternalPaymentSale(sale) || isManualChargeSale(sale)) return "blue";
  return "green";
}

function topProductsForPeriod(days = 7, limit = 10) {
  const start = Date.now() - days * 24 * 60 * 60 * 1000;
  const totals = new Map();

  state.sales.forEach((sale) => {
    if (!isFinancialSale(sale) || new Date(sale.date).getTime() < start) return;

    (sale.items || []).forEach((item) => {
      if (!item.productId) return;
      const product = state.products.find((entry) => entry.id === item.productId);
      const key = item.productId || item.name;
      const current = totals.get(key) || {
        name: item.name,
        category: product?.category || "Sem categoria",
        qty: 0,
        revenue: 0,
      };

      current.qty += Number(item.qty || 0);
      current.revenue += Number(item.qty || 0) * Number(item.price || 0);
      totals.set(key, current);
    });
  });

  return [...totals.values()]
    .sort((a, b) => b.qty - a.qty || b.revenue - a.revenue || a.name.localeCompare(b.name, "pt-BR"))
    .slice(0, limit);
}

function topProductsTable(products) {
  if (!products.length) return '<div class="empty">Nenhum produto vendido nos ultimos 7 dias.</div>';

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Produto</th><th>Categoria</th><th>Qtd.</th><th>Total vendido</th></tr>
        </thead>
        <tbody>
          ${products
            .map(
              (product, index) => `
                <tr>
                  <td><strong>${index + 1}</strong></td>
                  <td>${escapeHtml(product.name)}</td>
                  <td>${escapeHtml(product.category)}</td>
                  <td>${qty(product.qty)}</td>
                  <td>${money(product.revenue)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function closeCashAndDownloadSalesReport(useFormValues = false) {
  const openCash = getOpenCash();
  if (!openCash) {
    notify("Nao ha caixa aberto para fechar.");
    return;
  }
  if (!confirm("Fechar o caixa agora e baixar o relatorio de vendas?")) return;

  const formElement = document.querySelector("#cash-form");
  const form = formElement ? new FormData(formElement) : null;
  const counted = useFormValues && form ? countedFromCashForm(form) : expectedCountedForCash(openCash);
  const notes =
    useFormValues && form
      ? form.get("notes").trim()
      : "Fechamento automatico com relatorio de vendas gerado pelo app.";
  const closedCash = await closeOpenCash({ counted, notes });
  if (!closedCash) return;

  await downloadSalesReportPdf(closedCash);
  renderApp();
}

async function downloadSalesReportPdf(cash) {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    notify("Gerador de PDF ainda nao carregou. Atualize a pagina e tente novamente.");
    return;
  }

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  if (typeof doc.autoTable !== "function") {
    notify("Tabela do PDF ainda nao carregou. Atualize a pagina e tente novamente.");
    return;
  }
  const brandIconData = await getBrandIconDataUrl();

  const sales = salesForCashPeriod(cash);
  const activeSales = sales.filter(isReceivedSale);
  const fiadoSales = sales.filter((sale) => saleFiadoAmount(sale) > 0);
  const total = activeSales.reduce((sum, sale) => sum + saleReceivedAmount(sale), 0);
  const profit = activeSales.reduce((sum, sale) => sum + saleReceivedProfit(sale), 0);
  const fiadoTotal = fiadoSales.reduce((sum, sale) => sum + saleFiadoAmount(sale), 0);
  const paymentTotals = cashSalesPaymentTotals(activeSales);
  const businessName = state.settings.barName || APP_DISPLAY_NAME;
  const generatedAt = dateTime(new Date().toISOString());
  const title = "Relatorio de vendas do caixa";

  doc.setProperties({
    title: `${businessName} - ${title}`,
    subject: "Fechamento de caixa e vendas",
    author: session?.name || "Usuario",
  });

  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  doc.text(businessName, 40, 42);
  doc.setFontSize(12);
  doc.text(title, 40, 62);
  addPdfBrandIcon(doc, brandIconData);
  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99);
  [
    state.settings.cnpj ? `CNPJ: ${state.settings.cnpj}` : "",
    state.settings.address || "",
    `Caixa: ${cashSessionCode(cash)} | ${dateTime(cash.openedAt)} ate ${dateTime(cash.closedAt || new Date().toISOString())}`,
    `Operador: ${userName(cash.userId)} | Gerado em ${generatedAt} por ${session?.name || "Usuario"}`,
  ]
    .filter(Boolean)
    .forEach((line, index) => doc.text(line, 40, 80 + index * 12));

  doc.autoTable({
    body: [
      ["Total vendido", money(total), "Lucro estimado", money(profit)],
      ["Vendas recebidas", activeSales.length, "Valor esperado", money(cash.expectedAmount)],
      ["Valor contado", money(cash.closingAmount), "Diferenca", money(cash.difference)],
      ["Fiado no periodo", money(fiadoTotal), "Vendas fiado", fiadoSales.length],
    ],
    startY: 138,
    margin: { left: 40, right: 40 },
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: "bold", fillColor: [241, 245, 249] },
      2: { fontStyle: "bold", fillColor: [241, 245, 249] },
    },
  });

  doc.autoTable({
    head: [["Forma de pagamento", "Total"]],
    body: cashPaymentMethods.map((method) => [method, money(paymentTotals[method] || 0)]),
    startY: (doc.lastAutoTable?.finalY || 138) + 18,
    margin: { left: 40, right: 520 },
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [15, 118, 110], textColor: [255, 255, 255] },
  });

  doc.autoTable({
    head: [["Data", "Itens", "Pagamento", "Operador", "Desc.", "Total", "Lucro"]],
    body: activeSales.length
      ? activeSales.map((sale) => [
          dateTime(sale.date),
          saleItemsDescription(sale),
          paymentDisplay(sale),
          userName(sale.cashierId),
          saleDiscountAmount(sale) ? money(saleDiscountAmount(sale)) : "-",
          money(saleReceivedAmount(sale)),
          money(saleReceivedProfit(sale)),
        ])
      : [["Nenhuma venda concluida no periodo.", "", "", "", "", "", ""]],
    startY: (doc.lastAutoTable?.finalY || 190) + 24,
    margin: { left: 40, right: 40 },
    theme: "grid",
    styles: { fontSize: 7, cellPadding: 3, overflow: "linebreak", valign: "middle" },
    headStyles: { fillColor: [15, 118, 110], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      1: { cellWidth: 285 },
    },
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Pagina ${page} de ${pageCount}`, doc.internal.pageSize.getWidth() - 88, doc.internal.pageSize.getHeight() - 24);
  }

  const date = new Date().toISOString().slice(0, 10);
  doc.save(`vendas-caixa-${safeFileName(businessName)}-${date}.pdf`);
  logAudit("Relatorio de vendas baixado", `Caixa fechado em ${dateTime(cash.closedAt || new Date().toISOString())}.`);
  saveState();
  notify("Caixa fechado e relatorio de vendas baixado.");
}

function dailySales() {
  return salesForToday({ includeInactive: true }).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
}

function topProductsFromSales(sales, limit = 10) {
  const totals = new Map();
  sales.forEach((sale) => {
    if (sale.status === "Cancelada") return;
    (sale.items || []).forEach((item) => {
      const key = item.productId || item.name;
      const current = totals.get(key) || { name: item.name, qty: 0, revenue: 0 };
      current.qty += Number(item.qty || 0);
      current.revenue += isZeroedSale(sale) ? 0 : Number(item.qty || 0) * Number(item.price || 0);
      totals.set(key, current);
    });
  });
  return [...totals.values()].sort((a, b) => b.qty - a.qty || b.revenue - a.revenue).slice(0, limit);
}

function downloadDailySalesReportPdf() {
  return downloadSalesPeriodReportPdf("daily");
}

async function downloadSalesPeriodReportPdf(period = "daily") {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    notify("Gerador de PDF ainda nao carregou. Atualize a pagina e tente novamente.");
    return;
  }

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  if (typeof doc.autoTable !== "function") {
    notify("Tabela do PDF ainda nao carregou. Atualize a pagina e tente novamente.");
    return;
  }
  const brandIconData = await getBrandIconDataUrl();

  const periodInfo = salesReportPeriodRange(period);
  const sales = salesForRange(periodInfo.start, periodInfo.end, { includeInactive: true }).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  const financialSales = sales.filter(isFinancialSale);
  const receivedSales = financialSales.filter(isReceivedSale);
  const fiadoSales = financialSales.filter((sale) => saleFiadoAmount(sale) > 0);
  const zeroedSales = sales.filter(isZeroedSale);
  const cancelledSales = sales.filter((sale) => sale.status === "Cancelada");
  const total = receivedSales.reduce((sum, sale) => sum + saleReceivedAmount(sale), 0);
  const profit = receivedSales.reduce((sum, sale) => sum + saleReceivedProfit(sale), 0);
  const fiadoTotal = fiadoSales.reduce((sum, sale) => sum + saleFiadoAmount(sale), 0);
  const totalLaunched = total + fiadoTotal;
  const paymentTotals = cashSalesPaymentTotals(receivedSales);
  const topProducts = topProductsFromSales(sales);
  const businessName = state.settings.barName || APP_DISPLAY_NAME;
  const generatedAt = dateTime(new Date().toISOString());

  doc.setProperties({
    title: `${businessName} - ${periodInfo.title}`,
    subject: periodInfo.title,
    author: session?.name || "Usuario",
  });

  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  doc.text(businessName, 40, 42);
  doc.setFontSize(12);
  doc.text(`${periodInfo.title} - ${periodInfo.label}`, 40, 62);
  addPdfBrandIcon(doc, brandIconData);
  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99);
  [
    state.settings.cnpj ? `CNPJ: ${state.settings.cnpj}` : "",
    state.settings.address || "",
    `Periodo: ${dateTime(periodInfo.start.toISOString())} ate ${dateTime(periodInfo.end.toISOString())}`,
    `Gerado em ${generatedAt} por ${session?.name || "Usuario"}`,
  ]
    .filter(Boolean)
    .forEach((line, index) => doc.text(line, 40, 80 + index * 12));

  doc.autoTable({
    body: [
      ["Vendas brutas recebidas", money(total), "Fiado separado", money(fiadoTotal)],
      ["Total geral lancado", money(totalLaunched), "Lucro recebido", money(profit)],
      ["Vendas recebidas", receivedSales.length, "Vendas fiado", fiadoSales.length],
      ["Vendas zeradas", zeroedSales.length, "Canceladas", cancelledSales.length],
    ],
    startY: 126,
    margin: { left: 40, right: 40 },
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: "bold", fillColor: [241, 245, 249] },
      2: { fontStyle: "bold", fillColor: [241, 245, 249] },
    },
  });

  doc.autoTable({
    head: [["Forma de pagamento", "Total recebido"]],
    body: cashPaymentMethods.map((method) => [method, money(paymentTotals[method] || 0)]),
    startY: (doc.lastAutoTable?.finalY || 126) + 18,
    margin: { left: 40, right: 520 },
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [15, 118, 110], textColor: [255, 255, 255] },
  });

  doc.autoTable({
    head: [["Produto", "Qtd.", "Valor vendido"]],
    body: topProducts.length
      ? topProducts.map((item) => [item.name, qty(item.qty), money(item.revenue)])
      : [["Nenhum produto vendido no periodo.", "", ""]],
    startY: (doc.lastAutoTable?.finalY || 190) + 18,
    margin: { left: 40, right: 520 },
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [15, 118, 110], textColor: [255, 255, 255] },
  });

  doc.autoTable({
    head: [["Data", "Produtos", "Pagamento", "Status", "Operador", "Desc.", "Recebido", "Fiado", "Total geral", "Lucro recebido"]],
    body: sales.length
      ? sales.map((sale) => [
          dateTime(sale.date),
          saleItemsDescription(sale),
          paymentDisplay(sale),
          sale.status || "Concluida",
          userName(sale.cashierId),
          saleDiscountAmount(sale) ? money(saleDiscountAmount(sale)) : "-",
          money(saleReceivedAmount(sale)),
          money(saleFiadoAmount(sale)),
          money(saleDisplayTotal(sale)),
          money(saleReceivedProfit(sale)),
        ])
      : [["Nenhuma venda registrada no periodo.", "", "", "", "", "", "", "", "", ""]],
    startY: (doc.lastAutoTable?.finalY || 248) + 24,
    margin: { left: 40, right: 40 },
    theme: "grid",
    styles: { fontSize: 7, cellPadding: 3, overflow: "linebreak", valign: "middle" },
    headStyles: { fillColor: [15, 118, 110], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      1: { cellWidth: 230 },
    },
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Pagina ${page} de ${pageCount}`, doc.internal.pageSize.getWidth() - 88, doc.internal.pageSize.getHeight() - 24);
  }

  const date = new Date().toISOString().slice(0, 10);
  doc.save(`vendas-${periodInfo.filePart}-${safeFileName(businessName)}-${date}.pdf`);
  logAudit("Relatorio de vendas baixado", `${periodInfo.title} - ${periodInfo.label}.`);
  saveState();
}

async function bindCashForm() {
  document.querySelector("#cash-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));
    const notes = form.get("notes").trim();
    const openCash = getOpenCash();

    if (openCash) {
      const counted = countedFromCashForm(form);
      const authorization = await authorizeCashClosingDifference(openCash, counted, notes, form);
      if (authorization === false) return;
      const closedCash = await closeOpenCash({ counted, notes, authorization });
      if (closedCash) renderApp();
    } else {
      if (isOnlineSession()) {
        const { error } = await supabaseClient.from("cash_sessions").insert({
          user_id: session.id,
          opening_amount: amount,
          notes,
        });

        if (error) {
          notify(`Erro ao abrir caixa online: ${error.message}`);
          return;
        }

        await loadOnlineCashData();
        logAudit("Caixa aberto online", `Abertura com ${money(amount)}.`);
        notify("Caixa aberto no Supabase.");
        renderApp();
        return;
      }

      const cashCode = nextCashSessionCode();
      state.cashSessions.push({
        id: id("cash"),
        cashCode,
        openedAt: new Date().toISOString(),
        closedAt: null,
        userId: session.id,
        openingAmount: amount,
        closingAmount: null,
        closingBreakdown: null,
        expectedAmount: null,
        difference: null,
        notes,
      });
      logAudit("Caixa aberto", `${cashCode}: abertura com ${money(amount)}.`);
      notify("Caixa aberto.");
      saveState();
      renderApp();
    }
  });
}

function renderStock() {
  const products = stockSortedProducts(filteredProducts().filter((product) => product.active !== false));
  return `
    <div class="section-title">
      <div>
        <h2>Estoque</h2>
        <p>Saldos atuais, estoque minimo e reposicao. ${isOnlineSession() ? "Salvando no Supabase." : "Modo local."}</p>
      </div>
      <div class="toolbar">
        <input class="field-input search" data-search type="search" placeholder="Buscar item" />
        <button class="btn secondary" type="button" data-open-modal="product">Novo produto</button>
        <button class="btn secondary" type="button" data-open-modal="ingredient">Novo insumo</button>
        <button class="btn secondary" type="button" data-open-modal="inventory">Nova contagem</button>
        <button class="btn secondary" type="button" data-open-modal="priceSimulator">Simular preco</button>
        <button class="btn secondary" type="button" data-open-modal="inventoryIntelligence">Inteligencia de estoque</button>
        <button class="btn secondary" type="button" data-open-modal="stockExpiry">Vencimentos</button>
        ${session?.role === "admin" ? '<button class="btn secondary" type="button" data-recover-stock-history>Recuperar historico recente</button>' : ""}
        <button class="btn secondary ${stockSortMode === "stock-asc" ? "active" : ""}" type="button" data-stock-sort="stock-asc">Menor saldo primeiro</button>
        <button class="btn secondary ${stockSortMode === "default" ? "active" : ""}" type="button" data-stock-sort="default">Ordem normal</button>
      </div>
    </div>
    ${renderStockReportPanel()}
    <section class="card stock-card">
      <div class="card-head">
        <h2 class="card-title">Produtos, precos e saldos</h2>
      </div>
      <div class="table-wrap stock-table stock-products-table">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Saldo</th>
              <th>Codigo</th>
              <th>Acoes</th>
              <th>Categoria</th>
              <th>Preco</th>
              <th>Custo</th>
              <th>Praca</th>
              <th>Minimo</th>
              <th>Critico</th>
              <th>Validade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) => `
                  <tr class="stock-row ${stockStatus(product).className} expiry-${productExpiryStatus(product).className}">
                    <td data-label="Produto"><span class="stock-product-name">${productImageMarkup(product, "stock-product-photo")}<strong>${escapeHtml(product.name)}</strong></span></td>
                    <td data-label="Saldo">${productStockText(product)}</td>
                    <td data-label="Codigo">${productCodeDisplay(product)}</td>
                    <td data-label="Acoes">
                      <div class="toolbar stock-actions">
                        <button class="btn compact secondary" type="button" data-open-modal="product" data-id="${product.id}">Editar</button>
                        <button class="btn compact secondary" type="button" data-open-modal="stock" data-id="${product.id}">Ajustar</button>
                        <button class="btn compact secondary" type="button" data-open-modal="productHistory" data-id="${product.id}">Historico</button>
                        <button class="btn compact danger" type="button" data-remove-product="${product.id}">Remover</button>
                      </div>
                    </td>
                    <td data-label="Categoria">${product.category}</td>
                    <td data-label="Preco">${money(product.price)}</td>
                    <td data-label="Custo">${money(product.cost)}</td>
                    <td data-label="Praca">${product.station || "Bar"}</td>
                    <td data-label="Minimo">${product.minStock}</td>
                    <td data-label="Critico">${product.criticalStock}</td>
                    <td data-label="Validade">${product.expiresAt ? `${formatDateBr(product.expiresAt)} <span class="status ${productExpiryStatus(product).className}">${productExpiryStatus(product).label}</span>` : "-"}</td>
                    <td data-label="Status"><span class="status ${stockStatus(product).className}">${stockStatus(product).label}</span></td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
    <section class="card stock-card" style="margin-top: 16px;">
      <div class="card-head">
        <h2 class="card-title">Lotes e validade</h2>
        <button class="btn compact secondary" type="button" data-open-modal="lot">Adicionar lote</button>
      </div>
      <div class="table-wrap stock-table">
        <table>
          <thead><tr><th>Item</th><th>Lote</th><th>Qtd.</th><th>Validade</th><th>Fornecedor</th><th>Status</th></tr></thead>
          <tbody>
            ${state.stockLots
              .map(
                (lot) => `
                  <tr class="stock-row ${lotStatus(lot).className}">
                    <td>${inventoryItemName(lot)}</td>
                    <td>${lot.batch}</td>
                    <td>${lot.qty}</td>
                    <td>${new Date(lot.expiresAt).toLocaleDateString("pt-BR")}</td>
                    <td>${supplierName(lot.supplierId)}</td>
                    <td><span class="status ${lotStatus(lot).className}">${lotStatus(lot).label}</span></td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
    <section class="card stock-card" style="margin-top: 16px;">
      <div class="card-head">
        <h2 class="card-title">Insumos de ficha tecnica</h2>
      </div>
      <div class="table-wrap stock-table">
        <table>
          <thead><tr><th>Insumo</th><th>Unidade</th><th>Saldo</th><th>Minimo</th><th>Custo unit.</th><th>Status</th></tr></thead>
          <tbody>
            ${state.ingredients
              .map(
                (ingredient) => `
                  <tr class="stock-row ${ingredient.stock <= ingredient.minStock ? "amber" : "green"}">
                    <td>${ingredient.name}</td>
                    <td>${ingredient.unit}</td>
                    <td>${ingredient.stock}</td>
                    <td>${ingredient.minStock}</td>
                    <td>${money(ingredient.costPerUnit)}</td>
                    <td><span class="status ${ingredient.stock <= ingredient.minStock ? "amber" : "green"}">${ingredient.stock <= ingredient.minStock ? "Baixo" : "Ok"}</span></td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
    <section class="card stock-card" style="margin-top: 16px;">
      <div class="card-head">
        <h2 class="card-title">Inventario e divergencias</h2>
        <button class="btn compact secondary" type="button" data-open-modal="inventory">Nova contagem</button>
      </div>
      <div class="table-wrap stock-table">
        <table>
          <thead><tr><th>Data</th><th>Item</th><th>Esperado</th><th>Contado</th><th>Diferenca</th><th>Usuario</th><th>Obs.</th></tr></thead>
          <tbody>
            ${state.inventoryCounts
              .map(
                (count) => `
                  <tr class="stock-row ${count.difference === 0 ? "green" : "amber"}">
                    <td>${dateTime(count.date)}</td>
                    <td>${inventoryItemName(count)}</td>
                    <td>${count.expected}</td>
                    <td>${count.counted}</td>
                    <td><span class="status ${count.difference === 0 ? "green" : "amber"}">${count.difference}</span></td>
                    <td>${userName(count.userId)}</td>
                    <td>${count.notes || ""}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function stockSortedProducts(products) {
  if (stockSortMode !== "stock-asc") return products;
  return products
    .slice()
    .sort(
      (a, b) =>
        productAvailableStock(a) - productAvailableStock(b) ||
        Number(a.minStock || 0) - Number(b.minStock || 0) ||
        a.name.localeCompare(b.name, "pt-BR"),
    );
}

function expiryUrgencyLabel(days) {
  if (days === null || days === undefined) return "Sem validade";
  if (days < 0) return "Vencido";
  if (days === 0) return "Vence hoje";
  if (days <= 7) return "Ate 7 dias";
  if (days <= 15) return "Ate 15 dias";
  return "Ate 30 dias";
}

function stockExpiryRows() {
  const productRows = state.products
    .filter((product) => product.active !== false && product.expiresAt)
    .map((product) => {
      const status = productExpiryStatus(product);
      return {
        type: "Produto",
        name: product.name,
        batch: "-",
        qty: productAvailableStock(product),
        expiresAt: product.expiresAt,
        status,
      };
    });
  const lotRows = state.stockLots.map((lot) => ({
    type: lot.itemType === "ingredient" ? "Lote de insumo" : "Lote de produto",
    name: inventoryItemName(lot),
    batch: lot.batch,
    qty: lot.qty,
    expiresAt: lot.expiresAt,
    status: lotStatus(lot),
  }));

  return [...productRows, ...lotRows]
    .filter((row) => row.status.days !== null && row.status.days <= 30)
    .sort((a, b) => a.status.days - b.status.days || a.name.localeCompare(b.name, "pt-BR"));
}

function renderStockExpiryTable() {
  const rows = stockExpiryRows();
  return `
    ${
      rows.length
        ? `<div class="table-wrap stock-table modal-table-wrap">
            <table>
              <thead><tr><th>Prazo</th><th>Tipo</th><th>Item</th><th>Lote</th><th>Saldo</th><th>Validade</th><th>Status</th></tr></thead>
              <tbody>
                ${rows
                  .map(
                    (row) => `
                      <tr class="stock-row ${row.status.className}">
                        <td><strong>${expiryUrgencyLabel(row.status.days)}</strong></td>
                        <td>${row.type}</td>
                        <td>${row.name}</td>
                        <td>${row.batch}</td>
                        <td>${qty(row.qty)}</td>
                        <td>${formatDateBr(row.expiresAt)}</td>
                        <td><span class="status ${row.status.className}">${row.status.label}</span></td>
                      </tr>
                    `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>`
        : '<div class="empty">Nenhum produto ou lote vencendo nos proximos 30 dias.</div>'
    }
  `;
}

function productStockHistory(productId) {
  const product = state.products.find((entry) => entry.id === productId);
  if (!product) return [];
  const productNameKey = product.name.trim().toLowerCase();
  const entries = [];

  state.sales.forEach((sale) => {
    (sale.items || [])
      .filter((item) => item.productId === productId)
      .forEach((item) => {
        entries.push({
          date: sale.date,
          type: sale.status === "Cancelada" ? "Venda cancelada" : isZeroedSale(sale) ? "Venda zerada" : "Venda",
          qty: sale.status === "Cancelada" ? 0 : -Number(item.qty || 0),
          balance: "",
          userId: sale.cashierId,
          details: `${qty(item.qty)}x ${item.name} - ${paymentDisplay(sale)} - ${money(Number(item.qty || 0) * Number(item.price || 0))}`,
        });
      });
  });

  state.stockLots
    .filter((lot) => lot.itemType === "product" && lot.itemId === productId)
    .forEach((lot) => {
      entries.push({
        date: lot.createdAt || lot.expiresAt,
        type: "Lote",
        qty: Number(lot.qty || 0),
        balance: "",
        userId: "",
        details: `${lot.batch} - validade ${formatDateBr(lot.expiresAt)} - fornecedor ${supplierName(lot.supplierId)}`,
      });
    });

  state.purchases
    .filter((purchase) => String(purchase.itemName || "").trim().toLowerCase() === productNameKey)
    .forEach((purchase) => {
      entries.push({
        date: purchase.date,
        type: "Compra",
        qty: Number(purchase.qty || 0),
        balance: "",
        userId: purchase.userId,
        details: `${purchase.itemName} - ${money(purchase.total)} (${money(purchase.unitCost)} un.)`,
      });
    });

  state.inventoryCounts
    .filter((count) => count.itemType === "product" && count.itemId === productId)
    .forEach((count) => {
      const notes = String(count.notes || "").toLowerCase();
      const movementType = notes.includes("recuperacao automatica")
        ? Number(count.difference || 0) > 0
          ? "Entrada recuperada"
          : Number(count.difference || 0) < 0
            ? "Retirada recuperada"
            : "Saldo recuperado"
        : notes.includes("estoque inicial")
          ? "Estoque inicial"
          : notes.includes("ajuste")
            ? Number(count.difference || 0) > 0
              ? "Entrada manual"
              : Number(count.difference || 0) < 0
                ? "Retirada manual"
                : "Ajuste manual"
            : "Contagem";
      entries.push({
        date: count.date,
        type: movementType,
        qty: Number(count.difference || 0),
        balance: Number(count.counted || 0),
        userId: count.userId,
        details: `Esperado ${qty(count.expected)} | contado ${qty(count.counted)} | diferenca ${qty(count.difference)}${count.notes ? ` | ${count.notes}` : ""}`,
      });
    });

  return entries.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

function stockInventorySummary() {
  const activeProducts = state.products.filter((product) => product.active !== false);
  const productUnits = activeProducts.reduce((sum, product) => sum + productAvailableStock(product), 0);
  const productCostValue = activeProducts.reduce((sum, product) => sum + productAvailableStock(product) * Number(product.cost || 0), 0);
  const productSaleValue = activeProducts.reduce((sum, product) => sum + productAvailableStock(product) * Number(product.price || 0), 0);
  const ingredientCostValue = state.ingredients.reduce(
    (sum, ingredient) => sum + Number(ingredient.stock || 0) * Number(ingredient.costPerUnit || 0),
    0,
  );
  return {
    activeProducts,
    productUnits,
    productCostValue,
    productSaleValue,
    ingredientCostValue,
    alerts: stockAlerts(),
  };
}

function renderStockReportPanel() {
  const summary = stockInventorySummary();
  return `
    <section class="card pad stock-report-panel">
      <div class="card-head inline-card-head">
        <div>
          <h2 class="card-title">Relatorio de inventario</h2>
          <p>Visao completa para conferir saldos, codigos, validade, lotes e divergencias.</p>
        </div>
        <button class="btn secondary" type="button" data-print-inventory-report>${icon("print")} Salvar PDF do inventario</button>
      </div>
      <div class="metrics compact-metrics">
        <div class="metric"><span>Produtos ativos</span><strong>${summary.activeProducts.length}</strong></div>
        <div class="metric"><span>Unidades em estoque</span><strong>${qty(summary.productUnits)}</strong></div>
        <div class="metric"><span>Custo estimado</span><strong>${money(summary.productCostValue + summary.ingredientCostValue)}</strong></div>
        <div class="metric"><span>Alertas</span><strong>${summary.alerts.length}</strong></div>
      </div>
    </section>
  `;
}

function stockStatus(product) {
  const availableStock = productAvailableStock(product);
  if (availableStock <= 0) return { label: "Zerado", className: "red" };
  if (availableStock <= Number(product.criticalStock || 0)) return { label: "Critico", className: "red" };
  if (availableStock <= product.minStock) return { label: "Baixo", className: "amber" };
  return { label: "Ok", className: "green" };
}

function renderInventory() {
  return `
    <div class="section-title">
      <div>
        <h2>Inventario</h2>
        <p>Contagem fisica, divergencias e ajustes rastreados.</p>
      </div>
      <div class="toolbar">
        <button class="btn secondary" type="button" data-open-modal="inventory">Nova contagem</button>
      </div>
    </div>
    <section class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Data</th><th>Item</th><th>Esperado</th><th>Contado</th><th>Diferenca</th><th>Usuario</th><th>Obs.</th></tr></thead>
          <tbody>
            ${state.inventoryCounts
              .map(
                (count) => `
                  <tr>
                    <td>${dateTime(count.date)}</td>
                    <td>${inventoryItemName(count)}</td>
                    <td>${count.expected}</td>
                    <td>${count.counted}</td>
                    <td><span class="status ${count.difference === 0 ? "green" : "amber"}">${count.difference}</span></td>
                    <td>${userName(count.userId)}</td>
                    <td>${count.notes || ""}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderProducts() {
  const products = filteredProducts();
  return `
    <div class="section-title">
      <div>
        <h2>Produtos</h2>
        <p>Preco, custo, categoria e disponibilidade.</p>
      </div>
      <div class="toolbar">
        <input class="field-input search" data-search type="search" placeholder="Buscar produto por nome ou codigo" />
        <button class="btn secondary" type="button" data-open-modal="product">Novo produto</button>
      </div>
    </div>
    <section class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Codigo</th>
              <th>Categoria</th>
              <th>Preco</th>
              <th>Custo</th>
              <th>Praca</th>
              <th>Ficha tecnica</th>
              <th>Favorito</th>
              <th>Margem</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) => `
                  <tr>
                    <td>${product.name}</td>
                    <td>${productCodeDisplay(product)}</td>
                    <td>${product.category}</td>
                    <td>${money(product.price)}</td>
                    <td>${money(product.cost)}</td>
                    <td>${product.station || "Bar"}</td>
                    <td>${product.recipe?.length ? `${product.recipe.length} insumos` : "Baixa direta"}</td>
                    <td>${product.favorite ? "Sim" : "Nao"}</td>
                    <td>${money(product.price - product.cost)}</td>
                    <td><span class="status ${product.active ? "green" : "red"}">${product.active ? "Ativo" : "Inativo"}</span></td>
                    <td><button class="btn compact secondary" type="button" data-open-modal="product" data-id="${product.id}">Editar</button></td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function expensePaidAmount(expense) {
  const amount = Number(expense?.amount || 0);
  const paidAmount = Number(expense?.paidAmount ?? (expense?.paid ? amount : 0));
  return Math.min(amount, Math.max(0, paidAmount));
}

function expenseBalance(expense) {
  return Math.max(0, Number(expense?.amount || 0) - expensePaidAmount(expense));
}

function expenseStatus(expense) {
  if (expenseBalance(expense) <= 0 && Number(expense?.amount || 0) > 0) return { label: "Pago", className: "green" };
  if (expensePaidAmount(expense) > 0) return { label: "Parcial", className: "blue" };
  return { label: "Aberto", className: "amber" };
}

function expensePaymentHistory(expense) {
  return expenseMovementHistory(expense).filter((entry) => entry.type !== "charge");
}

function expenseMovementHistory(expense) {
  return Array.isArray(expense?.paymentHistory) ? expense.paymentHistory : [];
}

function expenseChargeHistory(expense) {
  return expenseMovementHistory(expense).filter((entry) => entry.type === "charge");
}

function expenseInitialInvoiceId(expense) {
  return `initial:${expense?.id || "expense"}`;
}

function expenseInitialInvoiceAmount(expense) {
  const addedInvoicesTotal = expenseChargeHistory(expense).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  return Number(Math.max(0, Number(expense?.amount || 0) - addedInvoicesTotal).toFixed(2));
}

function expenseInvoiceSortKey(invoice) {
  return `${String(invoice?.date || "9999-12-31").slice(0, 10)}|${invoice?.dueDate || "9999-12-31"}`;
}

function expenseInvoices(expense) {
  if (!expense) return [];
  const initialAmount = expenseInitialInvoiceAmount(expense);
  const invoices = [];
  if (initialAmount > 0 || !expenseChargeHistory(expense).length) {
    invoices.push({
      id: expenseInitialInvoiceId(expense),
      date: expense.expenseDate || String(expense.createdAt || "").slice(0, 10),
      dueDate: expense.dueDate || "",
      note: "Fatura inicial",
      amount: initialAmount,
      initial: true,
    });
  }
  expenseChargeHistory(expense).forEach((entry) => {
    invoices.push({
      id: entry.id,
      date: entry.date,
      dueDate: entry.dueDate || expense.dueDate || "",
      note: entry.note || "Nova fatura",
      amount: Number(entry.amount || 0),
      initial: false,
    });
  });

  const paidByInvoice = new Map(invoices.map((invoice) => [invoice.id, 0]));
  let paidBudget = expensePaidAmount(expense);
  expensePaymentHistory(expense)
    .filter((payment) => payment.invoiceId && paidByInvoice.has(payment.invoiceId))
    .forEach((payment) => {
      if (paidBudget <= 0) return;
      const invoice = invoices.find((entry) => entry.id === payment.invoiceId);
      const currentPaid = paidByInvoice.get(invoice.id) || 0;
      const allocated = Math.min(Number(payment.amount || 0), paidBudget, Math.max(0, invoice.amount - currentPaid));
      paidByInvoice.set(invoice.id, currentPaid + allocated);
      paidBudget -= allocated;
    });

  [...invoices]
    .sort((a, b) => expenseInvoiceSortKey(a).localeCompare(expenseInvoiceSortKey(b)))
    .forEach((invoice) => {
      if (paidBudget <= 0) return;
      const currentPaid = paidByInvoice.get(invoice.id) || 0;
      const allocated = Math.min(paidBudget, Math.max(0, invoice.amount - currentPaid));
      paidByInvoice.set(invoice.id, currentPaid + allocated);
      paidBudget -= allocated;
    });

  return invoices
    .map((invoice) => {
      const paidAmount = Number((paidByInvoice.get(invoice.id) || 0).toFixed(2));
      const balance = Number(Math.max(0, invoice.amount - paidAmount).toFixed(2));
      return {
        ...invoice,
        paidAmount,
        balance,
        status: balance <= 0 && invoice.amount > 0 ? "Pago" : paidAmount > 0 ? "Parcial" : "Aberto",
      };
    })
    .sort((a, b) => expenseInvoiceSortKey(a).localeCompare(expenseInvoiceSortKey(b)));
}

function expenseInvoiceLabel(invoice) {
  if (!invoice) return "Fatura";
  return invoice.initial ? "Fatura inicial" : invoice.note || "Nova fatura";
}

function nextRecurringDueDate(dueDate, day) {
  const [year, month] = String(dueDate).split("-").map(Number);
  const nextMonth = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(nextMonth.getUTCFullYear(), nextMonth.getUTCMonth() + 1, 0)).getUTCDate();
  nextMonth.setUTCDate(Math.min(Number(day), daysInMonth));
  return nextMonth.toISOString().slice(0, 10);
}

function renewLocalExpense(expense) {
  if (!expense?.recurring || !expense.paid || state.expenses.some((entry) => entry.recurringFrom === expense.id)) return;
  const dueDate = nextRecurringDueDate(expense.dueDate, expense.recurringDay);
  state.expenses.unshift({
    id: id("expense"),
    createdAt: new Date().toISOString(),
    description: expense.description,
    category: expense.category,
    amount: expense.amount,
    expenseDate: dueDate,
    dueDate,
    recurring: true,
    recurringDay: expense.recurringDay,
    recurringFrom: expense.id,
    paid: false,
    paidAt: null,
    paidAmount: 0,
    paymentHistory: [],
  });
}

function expensePaymentMethodLabel(method) {
  return (
    {
      cash: "Dinheiro",
      pix: "Pix",
      debit: "Debito",
      credit: "Credito",
      bank: "Banco",
      other: "Outro",
    }[method] || "Outro"
  );
}

function supplierPhones(supplier) {
  return [supplier?.phone, supplier?.phone2, supplier?.phone3, supplier?.phone4, supplier?.phone5]
    .map((phone) => String(phone || "").trim())
    .filter(Boolean);
}

function renderSuppliers() {
  return `
    <div class="section-title">
      <div>
        <h2>Fornecedores e compras</h2>
        <p>Registro de entradas, custos e origem dos produtos. ${isOnlineSession() ? "Salvando no Supabase." : "Modo local."}</p>
      </div>
      <div class="toolbar">
        <button class="btn secondary" type="button" data-open-modal="supplier">Novo fornecedor</button>
        <button class="btn secondary" type="button" data-open-modal="purchase">Registrar compra</button>
        <button class="btn secondary" type="button" data-open-modal="expense">Nova despesa</button>
        <button class="btn secondary" type="button" data-open-modal="expense" data-recurring="true">Nova recorrente</button>
      </div>
    </div>
    <div class="grid two-col">
      <section class="card">
        <div class="card-head"><h2 class="card-title">Fornecedores</h2></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>CNPJ</th><th>Contato</th><th>Email</th><th>Telefones</th><th>Endereco</th><th>Acoes</th></tr></thead>
            <tbody>
              ${state.suppliers
                .map((supplier) => {
                  const phones = supplierPhones(supplier);
                  return `
                    <tr>
                      <td>${escapeHtml(supplier.name)}</td>
                      <td>${escapeHtml(supplier.cnpj || "-")}</td>
                      <td>${escapeHtml(supplier.contact || "-")}</td>
                      <td>${escapeHtml(supplier.email || "-")}</td>
                      <td>${phones.length ? phones.map(escapeHtml).join("<br>") : "-"}</td>
                      <td>${escapeHtml(supplier.address || "-")}</td>
                      <td>
                        <div class="toolbar">
                          <button class="btn compact secondary" type="button" data-open-modal="supplier" data-id="${supplier.id}">Editar</button>
                          <button class="btn compact danger" type="button" data-remove-supplier="${supplier.id}">Remover</button>
                        </div>
                      </td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
      <section class="card">
        <div class="card-head"><h2 class="card-title">Ultimas compras</h2></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Data</th><th>Item</th><th>Fornecedor</th><th>Total</th></tr></thead>
            <tbody>
              ${state.purchases
                .map(
                  (purchase) => `
                    <tr>
                      <td>${dateTime(purchase.date)}</td>
                      <td>${purchase.itemName} (${purchase.qty})</td>
                      <td>${supplierName(purchase.supplierId)}</td>
                      <td>${money(purchase.total)}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>
    <section class="card" style="margin-top: 16px;">
      <div class="card-head"><h2 class="card-title">Despesas recorrentes em aberto</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Descricao</th><th>Vencimento</th><th>Valor fixo</th><th>Saldo</th><th>Dia do mes</th><th>Acoes</th></tr></thead>
          <tbody>
            ${(state.expenses || []).filter((expense) => expense.recurring && expenseBalance(expense) > 0)
              .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
              .map((expense) => `<tr>
                <td>${escapeHtml(expense.description)}</td>
                <td>${formatDateBr(expense.dueDate)}</td>
                <td>${money(expense.amount)}</td>
                <td>${money(expenseBalance(expense))}</td>
                <td>${expense.recurringDay}</td>
                <td><div class="toolbar">
                  <button class="btn compact secondary" type="button" data-open-modal="expense" data-id="${expense.id}">Editar</button>
                  <button class="btn compact primary" type="button" data-open-modal="expensePayment" data-id="${expense.id}">Pagar</button>
                </div></td>
              </tr>`).join("") || '<tr><td colspan="6">Nenhuma despesa recorrente em aberto.</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
    <section class="card" style="margin-top: 16px;">
      <div class="card-head"><h2 class="card-title">Despesas do negocio</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Empresa / despesa</th><th>Data da fatura</th><th>Vencimento</th><th>Fatura</th><th>Categoria</th><th>Valor</th><th>Pago</th><th>Saldo</th><th>Status</th><th>Acoes</th></tr></thead>
          <tbody>
            ${(state.expenses || [])
              .slice()
              .sort((a, b) => String(b.expenseDate || "").localeCompare(String(a.expenseDate || "")))
              .map((expense) => {
                const invoices = expenseInvoices(expense);
                return invoices
                  .map((invoice, index) => {
                    const statusClass = invoice.status === "Pago" ? "green" : invoice.status === "Parcial" ? "blue" : "amber";
                    return `
                      <tr class="${index === 0 ? "expense-group-start" : ""}">
                        <td>
                          <strong>${escapeHtml(expense.description)}</strong>
                          ${index === 0 ? `<small>${expense.recurring ? "Mensal" : `${invoices.length} fatura(s)`}<br>Saldo total: ${money(expenseBalance(expense))}</small>` : ""}
                        </td>
                        <td>${formatDateBr(String(invoice.date || "").slice(0, 10))}</td>
                        <td>${formatDateBr(invoice.dueDate)}</td>
                        <td>${escapeHtml(expenseInvoiceLabel(invoice))}</td>
                        <td>${escapeHtml(expense.category || "-")}</td>
                        <td>${money(invoice.amount)}</td>
                        <td>${money(invoice.paidAmount)}</td>
                        <td>${money(invoice.balance)}</td>
                        <td><span class="status ${statusClass}">${invoice.status}</span></td>
                        <td>
                          <div class="toolbar">
                            <button class="btn compact primary" type="button" data-open-modal="expensePayment" data-id="${expense.id}" data-invoice-id="${invoice.id}" ${invoice.balance <= 0 ? "disabled" : ""}>Pagar esta</button>
                            ${
                              invoice.status === "Pago"
                                ? `<button class="btn compact danger" type="button" data-remove-paid-expense-invoice="${invoice.id}" data-expense-id="${expense.id}">Remover paga</button>`
                                : ""
                            }
                            ${
                              index === 0
                                ? `${expense.recurring ? "" : `<button class="btn compact secondary" type="button" data-open-modal="expenseCharge" data-id="${expense.id}">Nova fatura</button>`}
                                  <button class="btn compact secondary" type="button" data-open-modal="expense" data-id="${expense.id}">Editar</button>
                                  <button class="btn compact danger" type="button" data-remove-expense="${expense.id}">Remover conta</button>`
                                : ""
                            }
                          </div>
                        </td>
                      </tr>
                    `;
                  })
                  .join("");
              })
              .join("") || '<tr><td colspan="10">Nenhuma despesa cadastrada.</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderClients() {
  const totalDebt = state.clients.reduce((sum, client) => sum + Number(client.debt || 0), 0);
  const term = searchTerm.trim().toLowerCase();
  const clients = state.clients.filter((client) => `${client.name} ${client.phone}`.toLowerCase().includes(term));
  return `
    <div class="section-title">
      <div>
        <h2>Clientes e fiado</h2>
        <p>Controle de dividas, pagamentos parciais e historico de cliente. ${isOnlineSession() ? "Salvando no Supabase." : "Modo local."}</p>
      </div>
      <div class="toolbar">
        <input class="field-input search" data-search type="search" placeholder="Buscar cliente" />
        <button class="btn secondary" type="button" data-open-modal="client">Novo cliente</button>
      </div>
    </div>
    <div class="grid stats">
      ${metric("Fiado aberto", money(totalDebt), "Saldo total a receber", "CR")}
      ${metric("Clientes", state.clients.length, "Cadastros ativos", "CL")}
      ${metric("Maior saldo", money(Math.max(0, ...state.clients.map((client) => Number(client.debt || 0)))), "Cliente com mais fiado", "MS")}
      ${metric("Vendas fiado", state.sales.filter((sale) => saleFiadoAmount(sale) > 0).length, "Historico registrado", "FD")}
    </div>
    <section class="card" style="margin-top: 16px;">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Cliente</th><th>Telefone</th><th>Saldo fiado</th><th>Limite</th><th>Status</th><th>Observacoes</th><th>Acoes</th></tr></thead>
          <tbody>
            ${clients
              .map(
                (client) => `
                  <tr>
                    <td>${client.name}</td>
                    <td>${client.phone || "-"}</td>
                    <td>${money(client.debt)}</td>
                    <td>${money(client.creditLimit)}</td>
                    <td><span class="status ${Number(client.debt || 0) > Number(client.creditLimit || 0) ? "red" : "green"}">${Number(client.debt || 0) > Number(client.creditLimit || 0) ? "Acima" : "Ok"}</span></td>
                    <td>
                      <div>${client.notes || ""}</div>
                      <small>${(client.transactions || []).slice(0, 2).map((entry) => `${dateTime(entry.date)} - ${entry.description} ${money(entry.amount)}`).join("<br>")}</small>
                    </td>
                    <td>
                      <div class="toolbar">
                        <button class="btn compact secondary" type="button" data-open-modal="client" data-id="${client.id}">Editar</button>
                        <button class="btn compact secondary" type="button" data-open-modal="clientPayment" data-id="${client.id}" ${client.debt <= 0 ? "disabled" : ""}>Pagar parcial</button>
                        <button class="btn compact secondary" type="button" data-pay-client="${client.id}" ${client.debt <= 0 ? "disabled" : ""}>Quitar</button>
                      </div>
                    </td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function priceCatalogProducts() {
  return state.products
    .filter((product) => product.active !== false)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

function renderPriceCatalog() {
  const products = priceCatalogProducts();
  return `
    <div class="section-title">
      <div>
        <h2>Catalogo de precos</h2>
        <p>Produtos ativos com o valor final de venda.</p>
      </div>
      <button class="btn primary" type="button" data-download-price-catalog>${icon("download")} Baixar catalogo em PDF</button>
    </div>
    <section class="price-catalog-sheet">
      <div class="price-catalog-heading">
        <strong>${escapeHtml(state.settings.barName || APP_DISPLAY_NAME)}</strong>
        <span>${products.length} produtos</span>
      </div>
      <div class="price-catalog-grid">
        ${
          products.length
            ? products
                .map(
                  (product) => `
                    <article class="price-catalog-item">
                      ${productImageMarkup(product, "price-catalog-photo")}
                      <div>
                        <strong>${escapeHtml(product.name)}</strong>
                        <span>${money(product.price)}</span>
                      </div>
                    </article>
                  `,
                )
                .join("")
            : '<div class="empty-state">Nenhum produto ativo cadastrado.</div>'
        }
      </div>
    </section>
  `;
}

function assistantMessageMarkup(message) {
  const content = escapeHtml(message.content || "").replace(/\n/g, "<br>");
  return `
    <div class="assistant-message ${message.role === "user" ? "user" : "ai"}">
      <span>${message.role === "user" ? escapeHtml(session?.name || "Voce") : "IA"}</span>
      <div>${content}</div>
    </div>
  `;
}

function assistantActionDetails(action) {
  if (!action) return "";
  const payload = action.payload || {};
  if (action.type === "update_stock") {
    const product = state.products.find((item) => item.id === payload.product_id);
    const modes = { add: "Adicionar", remove: "Retirar", set: "Definir saldo" };
    return `${modes[payload.mode] || "Ajustar"} ${qty(payload.quantity)} de ${product?.name || "produto"}`;
  }
  if (action.type === "update_price") {
    const product = state.products.find((item) => item.id === payload.product_id);
    return `${product?.name || "Produto"}: novo preco ${money(payload.new_price)}`;
  }
  if (action.type === "create_expense") {
    return `${payload.description || "Despesa"}: ${money(payload.amount)} em ${formatDateKeyBr(payload.expense_date)}`;
  }
  if (action.type === "create_cash_expense") {
    return `${payload.reason || "Saida do caixa"}: ${money(payload.amount)} em ${formatDateKeyBr(payload.date)}`;
  }
  if (action.type === "navigate") {
    return `Abrir ${navItems.find((item) => item.id === payload.view)?.label || payload.view || "area"}`;
  }
  return action.summary || "Confira os dados.";
}

function renderAssistant() {
  const onlineReady = isOnlineSession();
  return `
    <div class="section-title assistant-title">
      <div>
        <h2>Assistente IA</h2>
        <p>Analisa os dados do negocio e prepara tarefas para sua confirmacao.</p>
      </div>
      <span class="status ${onlineReady ? "green" : "yellow"}">${onlineReady ? "Conta online conectada" : "Requer login online"}</span>
    </div>

    <div class="assistant-layout">
      <aside class="assistant-suggestions">
        <strong>Sugestoes</strong>
        <button type="button" data-assistant-prompt="Como estao minhas vendas de hoje?">Vendas de hoje</button>
        <button type="button" data-assistant-prompt="Quais produtos precisam de reposicao primeiro?">Reposicao de estoque</button>
        <button type="button" data-assistant-prompt="Quais sao os produtos mais vendidos nos ultimos 7 dias?">Mais vendidos</button>
        <button type="button" data-assistant-prompt="Resuma as despesas em aberto e os proximos vencimentos.">Despesas em aberto</button>
        <button type="button" data-assistant-prompt="Prepare meu resumo executivo de hoje e destaque os problemas que precisam de acao.">Gerente diario</button>
        <small>A IA le um resumo atualizado. Qualquer alteracao exige sua confirmacao.</small>
      </aside>

      <section class="assistant-chat" aria-label="Conversa com o assistente">
        <div class="assistant-messages" data-assistant-messages>
          ${assistantMessages.map(assistantMessageMarkup).join("")}
          ${assistantBusy ? '<div class="assistant-message ai loading"><span>IA</span><div>Analisando os dados...</div></div>' : ""}
        </div>
        ${
          assistantPendingAction
            ? `<div class="assistant-action">
                <div class="assistant-action-icon">${icon("sparkles")}</div>
                <div>
                  <small>ACAO AGUARDANDO CONFIRMACAO</small>
                  <strong>${escapeHtml(assistantPendingAction.title)}</strong>
                  <p>${escapeHtml(assistantPendingAction.summary)}</p>
                  <span>${escapeHtml(assistantActionDetails(assistantPendingAction))}</span>
                </div>
                <div class="assistant-action-buttons">
                  <button class="btn secondary" type="button" data-cancel-assistant-action>Cancelar</button>
                  <button class="btn primary" type="button" data-confirm-assistant-action>Confirmar execucao</button>
                </div>
              </div>`
            : ""
        }
        <form class="assistant-composer" id="assistant-form">
          <textarea name="message" rows="2" maxlength="4000" placeholder="Ex.: coloque 24 unidades de Cerveja Pilsen no estoque" ${onlineReady && !assistantBusy ? "" : "disabled"}></textarea>
          <button class="btn primary" type="submit" ${onlineReady && !assistantBusy ? "" : "disabled"}>Enviar</button>
        </form>
        ${!onlineReady ? '<div class="notice compact">Entre com um usuario online do Supabase para usar a IA com seguranca.</div>' : ""}
      </section>
    </div>
  `;
}

function assistantBusinessContext() {
  const now = new Date();
  const todayKey = localDateKey(now);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const todaySales = state.sales.filter((sale) => localDateKey(sale.date) === todayKey && isFinancialSale(sale));
  const recentSales = state.sales.filter((sale) => new Date(sale.date) >= sevenDaysAgo && isFinancialSale(sale));
  const productTotals = new Map();
  recentSales.forEach((sale) => {
    (sale.items || []).forEach((item) => {
      const current = productTotals.get(item.productId) || { name: item.name, quantity: 0, revenue: 0 };
      current.quantity += Number(item.qty || 0);
      current.revenue += Number(item.qty || 0) * Number(item.price || 0);
      productTotals.set(item.productId, current);
    });
  });
  const openCash = getOpenCash();
  const cash = cashSummary(openCash);

  return {
    generated_at: now.toISOString(),
    business_name: state.settings.barName || APP_DISPLAY_NAME,
    user: { id: session?.id, name: session?.name, role: session?.role, permissions: getUserPermissions(session) },
    sales_today: {
      count: todaySales.length,
      total: todaySales.reduce((sum, sale) => sum + Number(sale.total || 0), 0),
      received: todaySales.reduce((sum, sale) => sum + saleStoredReceivedAmount(sale), 0),
      credit: todaySales.reduce((sum, sale) => sum + saleStoredFiadoAmount(sale), 0),
    },
    sales_last_7_days: {
      count: recentSales.length,
      total: recentSales.reduce((sum, sale) => sum + Number(sale.total || 0), 0),
      top_products: [...productTotals.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 10),
    },
    products: state.products
      .filter((product) => product.active !== false)
      .slice(0, 300)
      .map((product) => ({
        id: product.id,
        name: product.name,
        code: product.productCode || "",
        category: product.category,
        price: Number(product.price || 0),
        cost: Number(product.cost || 0),
        stock: Number(product.stock || 0),
        minimum_stock: Number(product.minStock || 0),
        critical_stock: Number(product.criticalStock || 0),
        expiration_date: product.expiresAt || null,
      })),
    cash: {
      open: Boolean(openCash),
      code: openCash ? cashSessionCode(openCash) : null,
      opening_amount: Number(openCash?.openingAmount || 0),
      movements: cash.movements,
      expected: cash.expected,
    },
    open_expenses: (state.expenses || [])
      .filter((expense) => expenseBalance(expense) > 0)
      .slice(0, 100)
      .map((expense) => ({
        id: expense.id,
        description: expense.description,
        category: expense.category,
        amount: Number(expense.amount || 0),
        balance: expenseBalance(expense),
        expense_date: expense.expenseDate,
        due_date: expense.dueDate,
      })),
    clients_with_debt: state.clients
      .filter((client) => Number(client.debt || 0) > 0)
      .slice(0, 50)
      .map((client) => ({ id: client.id, name: client.name, debt: Number(client.debt || 0) })),
  };
}

function scrollAssistantToBottom() {
  requestAnimationFrame(() => {
    const messages = document.querySelector("[data-assistant-messages]");
    if (messages) messages.scrollTop = messages.scrollHeight;
    document.querySelector("#assistant-form textarea")?.focus();
  });
}

async function sendAssistantMessage(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  await askAssistant(String(form.get("message") || "").trim());
}

async function askAssistant(message) {
  if (!message || assistantBusy) return;
  if (!isOnlineSession()) {
    notify("Entre com uma conta online para usar o assistente.");
    return;
  }

  const history = assistantMessages.slice(-10).map((item) => ({ role: item.role, content: item.content }));
  assistantMessages.push({ role: "user", content: message });
  assistantPendingAction = null;
  assistantBusy = true;
  renderApp();
  scrollAssistantToBottom();

  try {
    const { data } = await supabaseClient.auth.getSession();
    const accessToken = data?.session?.access_token;
    if (!accessToken) throw new Error("Sessao online ausente. Entre novamente no app.");

    const response = await fetch("/api/ai/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ message, history, context: assistantBusinessContext() }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Nao foi possivel consultar a IA.");

    assistantMessages.push({ role: "assistant", content: result.answer || "Resposta recebida." });
    assistantPendingAction = result.action || null;
  } catch (error) {
    assistantMessages.push({ role: "assistant", content: `Nao consegui concluir: ${error.message}` });
  } finally {
    assistantBusy = false;
    renderApp();
    scrollAssistantToBottom();
  }
}

function requireAssistantPermission(permission) {
  if (hasPermission(permission)) return true;
  throw new Error(`Seu usuario nao possui permissao para a area ${navItems.find((item) => item.id === permission)?.label || permission}.`);
}

function assistantDateTime(dateKey) {
  const now = new Date();
  const [year, month, day] = String(dateKey || "").split("-").map(Number);
  const result = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds());
  if (Number.isNaN(result.getTime())) throw new Error("A IA informou uma data invalida.");
  return result.toISOString();
}

async function executeAssistantAction() {
  const action = assistantPendingAction;
  if (!action || assistantBusy) return;
  if (!isOnlineSession()) {
    notify("Entre com uma conta online para executar a tarefa.");
    return;
  }

  assistantBusy = true;
  renderApp();
  try {
    const payload = action.payload || {};
    if (action.type === "navigate") {
      requireAssistantPermission(payload.view);
      assistantPendingAction = null;
      assistantBusy = false;
      assistantMessages.push({ role: "assistant", content: `Area ${navItems.find((item) => item.id === payload.view)?.label || payload.view} aberta.` });
      setView(payload.view);
      return;
    }

    if (action.type === "update_stock") {
      requireAssistantPermission("stock");
      const product = state.products.find((item) => item.id === payload.product_id);
      const quantity = Number(payload.quantity);
      if (!product || !Number.isFinite(quantity) || quantity < 0 || !["add", "remove", "set"].includes(payload.mode)) {
        throw new Error("Dados de ajuste de estoque invalidos.");
      }
      const nextStock = payload.mode === "set" ? quantity : payload.mode === "add" ? Number(product.stock || 0) + quantity : Number(product.stock || 0) - quantity;
      if (nextStock < 0) throw new Error("A retirada deixaria o estoque negativo.");
      const result = await supabaseClient.from("products").update({ stock: nextStock }).eq("id", product.id);
      if (result.error) throw result.error;
      const historyResult = await supabaseClient.from("inventory_counts").insert({
        user_id: session.id,
        item_type: "product",
        item_id: product.id,
        expected: Number(product.stock || 0),
        counted: nextStock,
        difference: nextStock - Number(product.stock || 0),
        notes: `Ajuste pela IA: ${payload.mode}`,
      });
      if (historyResult.error) throw new Error(`Estoque atualizado, mas o historico falhou: ${historyResult.error.message}`);
      await loadOnlineStockData();
      logAudit("IA ajustou estoque", `${product.name}: ${product.stock} para ${nextStock}.`);
    } else if (action.type === "update_price") {
      requireAssistantPermission("stock");
      const product = state.products.find((item) => item.id === payload.product_id);
      const price = Number(payload.new_price);
      if (!product || !Number.isFinite(price) || price < 0) throw new Error("Produto ou preco invalido.");
      const result = await supabaseClient.from("products").update({ price }).eq("id", product.id);
      if (result.error) throw result.error;
      await loadOnlineStockData();
      logAudit("IA alterou preco", `${product.name}: ${money(product.price)} para ${money(price)}.`);
    } else if (action.type === "create_expense") {
      requireAssistantPermission("suppliers");
      const amount = Number(payload.amount);
      if (!payload.description || !Number.isFinite(amount) || amount <= 0 || !payload.expense_date || !payload.due_date) {
        throw new Error("Dados da despesa invalidos.");
      }
      const result = await supabaseClient.from("expenses").insert({
        description: String(payload.description).slice(0, 200),
        category: String(payload.category || "IA").slice(0, 100),
        amount,
        expense_date: payload.expense_date,
        due_date: payload.due_date,
        paid: false,
        paid_amount: 0,
        payment_history: [],
      });
      if (result.error) throw result.error;
      await loadOnlineSupplierData();
      logAudit("IA cadastrou despesa", `${payload.description}: ${money(amount)}.`);
    } else if (action.type === "create_cash_expense") {
      requireAssistantPermission("cash");
      const amount = Number(payload.amount);
      if (!getOpenCash()) throw new Error("Abra o caixa antes de registrar a saida.");
      if (!payload.reason || !Number.isFinite(amount) || amount <= 0 || !payload.date || payload.date > localDateKey()) {
        throw new Error("Dados da saida de caixa invalidos.");
      }
      const result = await supabaseClient.from("cash_movements").insert({
        user_id: session.id,
        type: "despesa",
        amount,
        reason: String(payload.reason).slice(0, 200),
        created_at: assistantDateTime(payload.date),
      });
      if (result.error) throw result.error;
      await loadOnlineCashData();
      logAudit("IA registrou saida do caixa", `${payload.reason}: ${money(amount)}.`);
    } else {
      throw new Error("Esta tarefa ainda nao e permitida pelo assistente.");
    }

    assistantPendingAction = null;
    assistantMessages.push({ role: "assistant", content: "Tarefa executada com sucesso e dados atualizados." });
    saveState();
    notify("Tarefa da IA executada.");
  } catch (error) {
    assistantMessages.push({ role: "assistant", content: `Nao foi possivel executar: ${error.message}` });
    notify(`Falha na tarefa da IA: ${error.message}`);
  } finally {
    assistantBusy = false;
    renderApp();
    scrollAssistantToBottom();
  }
}

function renderReports() {
  const sales = reportSales().slice().reverse();
  const activeSales = sales.filter(isFinancialSale);
  const byPayment = paymentMethods.map((method) => ({
    method,
    total: activeSales.reduce(
      (sum, sale) =>
        sum +
        salePaymentParts(sale)
          .filter((part) => part.method === method)
          .reduce((partSum, part) => partSum + Number(part.amount || 0), 0),
      0,
    ),
  }));
  const byCategory = categoryTotals(reportSales());
  const profitability = productProfitability(reportSales()).slice(0, 8);
  const operatorRows = operatorReport(reportSales());

  return `
    <div class="section-title">
      <div>
        <h2>Relatorios</h2>
        <p>Analise vendas, formas de pagamento, categorias e auditoria.</p>
      </div>
      <div class="toolbar">
        <button class="btn secondary" type="button" data-print-report>${icon("print")} Imprimir/PDF</button>
        <button class="btn secondary" type="button" data-export-sales>${icon("download")} CSV vendas</button>
      </div>
    </div>
    <section class="card pad" style="margin-bottom: 16px;">
      <form id="report-filter-form" class="form-grid">
        <label class="field">
          <span>Periodo do relatorio</span>
          <select name="mode">
            <option value="24h" ${reportFilter.mode === "24h" ? "selected" : ""}>Ultimas 24 horas</option>
            <option value="7d" ${reportFilter.mode === "7d" ? "selected" : ""}>Ultimos 7 dias</option>
            <option value="monthly" ${reportFilter.mode === "monthly" ? "selected" : ""}>Mes atual</option>
            <option value="semester" ${reportFilter.mode === "semester" ? "selected" : ""}>Semestre atual</option>
            <option value="annual" ${reportFilter.mode === "annual" ? "selected" : ""}>Ano atual</option>
            <option value="period" ${reportFilter.mode === "period" ? "selected" : ""}>Periodo personalizado</option>
          </select>
        </label>
        <label class="field">
          <span>Inicio</span>
          <input name="start" type="datetime-local" value="${reportFilter.start || ""}" />
        </label>
        <label class="field">
          <span>Fim</span>
          <input name="end" type="datetime-local" value="${reportFilter.end || ""}" />
        </label>
        <div class="field-actions">
          <button class="btn primary" type="submit">Aplicar filtro</button>
        </div>
      </form>
    </section>
    ${typeof renderPaymentReconciliationPanel === "function" ? renderPaymentReconciliationPanel() : ""}
    ${typeof renderCashFlowForecastPanel === "function" ? renderCashFlowForecastPanel() : ""}
    ${typeof renderAnomalyPanel === "function" ? renderAnomalyPanel() : ""}
    <div class="grid two-col">
      <section class="card">
        <div class="card-head">
          <h2 class="card-title">Por pagamento</h2>
          <button class="btn compact secondary" type="button" data-print-cash-report>${icon("print")} PDF</button>
        </div>
        <div class="summary-list">
          ${byPayment.map((entry) => `<div class="summary-row"><span>${entry.method}</span><strong>${money(entry.total)}</strong></div>`).join("")}
        </div>
      </section>
      <section class="card">
        <div class="card-head">
          <h2 class="card-title">Por categoria</h2>
          <button class="btn compact secondary" type="button" data-print-stock-report>${icon("print")} PDF</button>
        </div>
        <div class="summary-list">
          ${byCategory.map((entry) => `<div class="summary-row"><span>${entry.category}</span><strong>${money(entry.total)}</strong></div>`).join("")}
        </div>
      </section>
    </div>
    <div class="grid two-col" style="margin-top: 16px;">
      <section class="card">
        <div class="card-head">
          <h2 class="card-title">Lucratividade por produto</h2>
          <button class="btn compact secondary" type="button" data-print-stock-report>${icon("print")} PDF</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Produto</th><th>Qtd.</th><th>Receita</th><th>Lucro</th><th>Margem</th></tr></thead>
            <tbody>
              ${profitability
                .map(
                  (entry) => `
                    <tr>
                      <td>${entry.name}</td>
                      <td>${entry.qty}</td>
                      <td>${money(entry.revenue)}</td>
                      <td>${money(entry.profit)}</td>
                      <td>${entry.margin.toFixed(1)}%</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
      <section class="card">
        <div class="card-head">
          <h2 class="card-title">Turnos por operador</h2>
          <button class="btn compact secondary" type="button" data-print-cash-report>${icon("print")} PDF</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Operador</th><th>Vendas</th><th>Total</th><th>Cancelamentos</th><th>Caixas</th></tr></thead>
            <tbody>
              ${operatorRows
                .map(
                  (entry) => `
                    <tr>
                      <td>${entry.name}</td>
                      <td>${entry.sales}</td>
                      <td>${money(entry.total)}</td>
                      <td>${entry.cancellations}</td>
                      <td>${entry.cashSessions}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>
    <section class="card" style="margin-top: 16px;">
      <div class="card-head"><h2 class="card-title">Auditoria</h2></div>
      ${auditList(state.auditLog)}
    </section>
  `;
}

function renderSettings() {
  return `
    <div class="section-title">
      <div>
        <h2>Configuracoes da distribuidora</h2>
        <p>Dados do estabelecimento, taxa de servico, recibo e tela inicial por cargo.</p>
      </div>
    </div>
    <section class="card pad">
      <form id="settings-form">
        <div class="form-grid">
          <label class="field">
            <span>Nome da distribuidora</span>
            <input name="barName" value="${state.settings.barName || ""}" required />
          </label>
          <label class="field">
            <span>CNPJ</span>
            <input name="cnpj" value="${state.settings.cnpj || ""}" />
          </label>
          <label class="field full">
            <span>Endereco</span>
            <input name="address" value="${state.settings.address || ""}" />
          </label>
          <label class="field">
            <span>Taxa de servico (%)</span>
            <input name="serviceFee" type="number" min="0" max="30" step="0.1" value="${state.settings.serviceFee || 0}" />
          </label>
          <label class="field full">
            <span>Mensagem do recibo</span>
            <input name="receiptFooter" value="${state.settings.receiptFooter || ""}" />
          </label>
          <label class="field">
            <span>Diferenca de caixa que exige autorizacao</span>
            <input name="closingDifferenceLimit" type="number" min="0" step="0.01" value="${state.settings.closingDifferenceLimit ?? 5}" />
          </label>
          <label class="field">
            <span>Taxa de cartao padrao (%)</span>
            <input name="pricingCardFee" type="number" min="0" max="50" step="0.01" value="${state.settings.pricingDefaults?.cardFee ?? 3.5}" />
          </label>
          <label class="field">
            <span>Impostos padrao (%)</span>
            <input name="pricingTax" type="number" min="0" max="50" step="0.01" value="${state.settings.pricingDefaults?.tax ?? 0}" />
          </label>
          <label class="field">
            <span>Margem desejada padrao (%)</span>
            <input name="pricingTargetMargin" type="number" min="0" max="90" step="0.1" value="${state.settings.pricingDefaults?.targetMargin ?? 30}" />
          </label>
          <label class="field">
            <span>Desconto alto para alerta (%)</span>
            <input name="highDiscountPercent" type="number" min="0" max="100" step="1" value="${state.settings.anomalySettings?.highDiscountPercent ?? 15}" />
          </label>
          <label class="field">
            <span>Taxa de cancelamento para alerta (%)</span>
            <input name="cancellationPercent" type="number" min="0" max="100" step="1" value="${state.settings.anomalySettings?.cancellationPercent ?? 8}" />
          </label>
          <fieldset class="appearance-setting full">
            <legend>Paleta de cores neste aparelho</legend>
            <p>Escolha entre a identidade da distribuidora, o tema rubro-negro ou o visual classico.</p>
            <div class="palette-picker">
              <label class="palette-option">
                <input type="radio" name="palette" value="brand" ${activePalette() === "brand" ? "checked" : ""} />
                <span class="palette-option-content">
                  <span class="palette-preview brand-preview" aria-hidden="true">
                    <i></i><i></i><i></i><i></i>
                  </span>
                  <strong>Cores da logo</strong>
                  <small>Azul eletrico, vermelho e fundo azul-escuro.</small>
                </span>
              </label>
              <label class="palette-option">
                <input type="radio" name="palette" value="rubro" ${activePalette() === "rubro" ? "checked" : ""} />
                <span class="palette-option-content">
                  <span class="palette-preview rubro-preview" aria-hidden="true">
                    <i></i><i></i><i></i><i></i>
                  </span>
                  <strong>Rubro-negro</strong>
                  <small>Vermelho, preto e branco com clima de arquibancada.</small>
                </span>
              </label>
              <label class="palette-option">
                <input type="radio" name="palette" value="classic" ${activePalette() === "classic" ? "checked" : ""} />
                <span class="palette-option-content">
                  <span class="palette-preview classic-preview" aria-hidden="true">
                    <i></i><i></i><i></i><i></i>
                  </span>
                  <strong>Visual classico</strong>
                  <small>Mantem as cores usadas anteriormente no sistema.</small>
                </span>
              </label>
            </div>
          </fieldset>
          ${Object.entries(roles)
            .map(
              ([roleKey, role]) => `
                <label class="field">
                  <span>Tela inicial - ${role.label}</span>
                  <select name="start-${roleKey}">
                    ${navItems
                      .filter((item) => role.permissions.includes(item.id))
                      .map(
                        (item) =>
                          `<option value="${item.id}" ${state.settings.shiftStartView?.[roleKey] === item.id ? "selected" : ""}>${item.label}</option>`,
                      )
                      .join("")}
                  </select>
                </label>
              `,
            )
            .join("")}
        </div>
        <button class="btn primary" type="submit">Salvar configuracoes</button>
      </form>
    </section>
    ${typeof renderSecurityCenter === "function" ? renderSecurityCenter() : ""}
  `;
}

function renderOnline() {
  const safeUrl = supabaseConfig.url || "Nao configurada";
  const realtimeConnected = realtimeSubscriptionStatus === "connected";
  const realtimeDescription = realtimeConnected
    ? `Canal conectado${realtimeLastUpdateAt ? `. Ultima atualizacao: ${dateTime(realtimeLastUpdateAt)}.` : "."} O SQL de tempo real precisa estar ativo no Supabase.`
    : "Execute SUPABASE_TEMPO_REAL.sql e mantenha esta pagina conectada ao Supabase.";
  const keyPreview = supabaseConfig.publishableKey
    ? `${supabaseConfig.publishableKey.slice(0, 18)}...${supabaseConfig.publishableKey.slice(-6)}`
    : "Nao configurada";
  const pendingPointOrders = getMercadoPagoPendingOrders();
  const pendingPointOrder = pendingPointOrders[0] || null;
  const selectedTerminal = mercadoPagoPointStatus.terminals.find(
    (terminal) => terminal.id === mercadoPagoPointStatus.terminalId,
  );
  const terminalRows = mercadoPagoPointStatus.terminals
    .map((terminal, index) => ({ terminal, number: mercadoPagoTerminalNumber(terminal, index) }))
    .sort((a, b) => a.number - b.number || String(a.terminal.id).localeCompare(String(b.terminal.id)))
    .map(({ terminal, number }) => {
      const selected = terminal.id === mercadoPagoPointStatus.terminalId;
      return `
        <tr>
          <td>Maquininha ${number}${selected ? " / Principal" : ""}</td>
          <td>${terminal.id}</td>
          <td>${terminal.operating_mode || "Sem modo"}</td>
          <td>${terminal.store_id || "-"}</td>
          <td>${terminal.pos_id || "-"}</td>
          <td>
            ${
              terminal.operating_mode === "PDV"
                ? `<div class="toolbar"><span class="status green">Ativa no app</span><button class="btn compact secondary" type="button" data-set-point-terminal-standalone="${terminal.id}">Voltar modo comum</button></div>`
                : `<button class="btn compact secondary" type="button" data-set-point-terminal-pdv="${terminal.id}">Ativar PDV</button>`
            }
          </td>
        </tr>
      `;
    })
    .join("");
  const connectedTerminalSerials = new Set(mercadoPagoPointStatus.terminals.map(mercadoPagoTerminalSerial));
  const expectedTerminalRows = MERCADO_PAGO_TERMINAL_REGISTRY
    .filter((entry) => entry.expected && !connectedTerminalSerials.has(normalizeMercadoPagoSerial(entry.serial)))
    .map((entry) => `
      <tr>
        <td>Maquininha ${entry.number} / ${entry.label}</td>
        <td>${entry.serial}</td>
        <td>AGUARDANDO</td>
        <td>-</td>
        <td>-</td>
        <td><span class="status amber">Vincular na conta Mercado Pago</span></td>
      </tr>
    `)
    .join("");
  const stoneTerminalRows = STONE_TERMINAL_REGISTRY.map(
    (terminal) => `
      <tr>
        <td>Maquininha ${terminal.number}</td>
        <td>${escapeHtml(terminal.model)}</td>
        <td>${escapeHtml(terminal.serialLabel)}</td>
        <td>${terminal.integrationMode === "manual" ? "Confirmacao no app" : "Aguardando configuracao"}</td>
        <td><span class="status ${terminal.enabled ? "green" : "amber"}">${terminal.enabled ? "Disponivel" : "Preservada"}</span></td>
      </tr>
    `,
  ).join("");
  return `
    <div class="section-title">
      <div>
        <h2>Internet, login real e tempo real</h2>
        <p>Conexao com Supabase, publicacao e proximas etapas para operar online.</p>
      </div>
      <div class="toolbar">
        <button class="btn secondary" type="button" data-test-supabase>Testar conexao Supabase</button>
        <button class="btn secondary" type="button" data-refresh-realtime>Atualizar dados agora</button>
        <button class="btn secondary" type="button" data-test-mercadopago>Testar Mercado Pago Point</button>
        <button class="btn secondary" type="button" data-set-point-pdv>Ativar modo PDV Point</button>
        <button class="btn secondary" type="button" data-check-point-order>Consultar ultima cobranca Point</button>
        <button class="btn danger" type="button" data-cancel-point-order>Cancelar cobranca Point</button>
      </div>
    </div>
    <div class="grid two-col">
      <section class="card pad online-card">
        <span class="status ${supabaseStatus.ok ? "green" : "amber"}">${supabaseStatus.ok ? "Conectado" : "Aguardando teste"}</span>
        <h3>Supabase</h3>
        <div class="summary-list">
          <div class="summary-row"><span>Project URL</span><strong>${safeUrl}</strong></div>
          <div class="summary-row"><span>Publishable key</span><strong>${keyPreview}</strong></div>
          <div class="summary-row"><span>Status</span><strong>${supabaseStatus.message}</strong></div>
        </div>
      </section>
      <section class="card pad online-card">
        <span class="status green">Pronto para teste online</span>
        <h3>Login real e dados online</h3>
        <p>Login por nome, permissoes, estoque, vendas, clientes, caixa, mesas, fornecedores, despesas e configuracoes ja estao conectados ao Supabase.</p>
      </section>
    </div>
    <div class="grid three-col" style="margin-top: 16px;">
      ${onlineCard("Banco", "Schema criado no Supabase e pronto para receber dados reais.", "Conectado")}
      ${onlineCard("Login real", "Perfis, e-mail vinculado, Auth e permissoes online estao ativos.", "Conectado")}
      ${onlineCard("Dados do app", "Produtos, estoque, vendas, clientes, caixa, mesas e despesas estao conectados para teste.", "Conectado")}
      ${onlineCard("Tempo real entre computadores", realtimeDescription, realtimeConnected ? "Ao vivo" : "Configurar")}
      ${onlineCard("Publicacao", "Proxima etapa: publicar os arquivos estaticos na Vercel com HTTPS.", "Proximo")}
      ${onlineCard("Mercado Pago Point", mercadoPagoPointStatus.message, mercadoPagoPointStatus.enabled ? "Configurado" : "Pendente")}
      ${onlineCard("Uso da Point", "Depois de enviar a cobranca pelo app, abra Inserir valor na maquininha para concluir.", "Operacao")}
      ${onlineCard("Impressao", "A Point imprime comprovante simples. As fichas individuais saem pelo app no Balcao ou em Vendas > Ficha.", "Ativa")}
      ${onlineCard(
        "Stone",
        "Maquininha 6 Sunmi P2-B, final 73149, cadastrada para cobranca manual com confirmacao do operador. A Maquininha 5 permanece preservada.",
        "Disponivel",
      )}
      ${onlineCard(
        "Fila da Point",
        pendingPointOrder
          ? `${pendingPointOrders.length} cobranca(s) acompanhada(s). Ultima: ${pendingPointOrder.id}. Status: ${pendingPointOrder.status || "created"}${
              pendingPointOrder.statusDetail ? ` (${pendingPointOrder.statusDetail})` : ""
            }.`
          : "Nenhuma cobranca pendente salva neste navegador.",
        pendingPointOrder ? "Pendente" : "Livre",
      )}
      ${onlineCard("Seguranca", "A chave secreta do Supabase continua fora do navegador. Senhas reais ficam no Supabase Auth.", "Protegido")}
    </div>
    <section class="card" style="margin-top: 16px;">
      <div class="section-title compact">
        <div>
          <h3>Maquininhas Mercado Pago</h3>
          <p>${
            selectedTerminal?.operating_mode === "PDV"
              ? "A maquininha selecionada esta em modo PDV."
              : "A maquininha selecionada precisa estar em modo PDV e ser reiniciada para receber cobrancas do app."
          }</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Terminal</th>
              <th>Modo</th>
              <th>Loja</th>
              <th>Caixa</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            ${
              `${terminalRows}${expectedTerminalRows}` ||
              `<tr><td colspan="6">Clique em Testar Mercado Pago Point para carregar as maquininhas.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
    <section class="card" style="margin-top: 16px;">
      <div class="section-title compact">
        <div>
          <h3>Maquininhas Stone</h3>
          <p>A P2-B final 73149 ja pode ser selecionada no Balcao. A cobranca e feita na Stone e confirmada no app apos a aprovacao.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Numero</th>
              <th>Modelo</th>
              <th>Identificacao</th>
              <th>Operacao</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${stoneTerminalRows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderTeam() {
  return `
    <div class="section-title">
      <div>
        <h2>Equipe</h2>
        <p>Controle de acesso por usuario, cargo e permissao.</p>
      </div>
      <div class="toolbar">
        <button class="btn secondary" type="button" data-reset-demo>Restaurar exemplo</button>
        <button class="btn secondary" type="button" data-open-modal="user">Novo usuario</button>
      </div>
    </div>
    <section class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Permissoes</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            ${state.users
              .map(
                (user) => `
                  <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${roles[user.role].label}</td>
                    <td>
                      <div class="permission-summary">
                        <strong>${getUserPermissions(user).length} areas</strong>
                        <span>${permissionSummary(user)}</span>
                      </div>
                    </td>
                    <td><span class="status ${user.active ? "green" : "red"}">${user.active ? "Ativo" : "Inativo"}</span></td>
                    <td><button class="btn compact secondary" type="button" data-open-modal="user" data-id="${user.id}">Editar</button></td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderModal() {
  const renderers = {
    product: renderProductModal,
    stock: renderStockModal,
    ingredient: renderIngredientModal,
    inventory: renderInventoryModal,
    supplier: renderSupplierModal,
    purchase: renderPurchaseModal,
    expense: renderExpenseModal,
    expenseCharge: renderExpenseChargeModal,
    expensePayment: renderExpensePaymentModal,
    client: renderClientModal,
    clientPayment: renderClientPaymentModal,
    clientTransactionRemoval: renderClientTransactionRemovalModal,
    cancelSale: renderCancelSaleModal,
    lot: renderLotModal,
    table: renderTableModal,
    tableSplit: renderTableSplitModal,
    counterSplit: renderTableSplitModal,
    addTables: renderAddTablesModal,
    user: renderUserModal,
    movement: renderMovementModal,
    manualCharge: renderManualChargeModal,
    externalPayment: renderExternalPaymentModal,
    order: renderOrderModal,
    salePayment: renderSalePaymentModal,
    printTickets: renderPrintTicketsModal,
    productHistory: renderProductHistoryModal,
    stockExpiry: renderStockExpiryModal,
    priceSimulator: renderPriceSimulatorModal,
    reconciliationReview: renderReconciliationReviewModal,
    mfaSetup: renderMfaSetupModal,
    inventoryIntelligence: renderInventoryIntelligenceModal,
  };
  const modalClass = currentModal.type === "salePayment"
    ? "modal sale-payment-modal"
    : ["tableSplit", "counterSplit"].includes(currentModal.type)
      ? "modal table-split-modal"
    : currentModal.type === "inventoryIntelligence"
      ? "modal inventory-intelligence-modal"
      : currentModal.type === "priceSimulator"
        ? "modal price-simulator-modal"
      : "modal";
  return `
    <div class="modal-backdrop">
      <section class="${modalClass}">
        ${renderers[currentModal.type]()}
      </section>
    </div>
  `;
}

function renderSalePaymentModal() {
  const totals = saleTotalsForItems(cart);
  const { subtotal, serviceFee, total } = totals;
  const splitPersonName = tableCheckout?.splitPersonName || "";
  const checkoutTable = tableCheckout?.id ? state.tables.find((table) => table.id === tableCheckout.id) : null;
  const canSplitTableAtCheckout = Boolean(checkoutTable?.items?.length && !tableCheckout?.splitPersonId && !checkoutTable.splitBill);
  const canSplitCounterAtCheckout = Boolean(!tableCheckout && cart.length && !currentCounterSplitBill());
  const canSplitAtCheckout = canSplitTableAtCheckout || canSplitCounterAtCheckout;
  return `
    <form id="sale-payment-form">
      <div class="modal-head">
        <h2>Finalizar venda</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body sale-payment-body">
        <div class="summary-list sale-payment-summary">
          ${tableCheckout ? `<div class="summary-row"><span>Mesa</span><strong>${tableCheckout.name}</strong></div>` : ""}
          ${splitPersonName ? `<div class="summary-row"><span>Parte</span><strong>${escapeHtml(splitPersonName)}</strong></div>` : ""}
          ${tableCheckout?.customerName ? `<div class="summary-row"><span>Cliente</span><strong>${escapeHtml(tableCheckout.customerName)}</strong></div>` : ""}
          <div class="summary-row"><span>${splitPersonName ? "Produtos rateados" : "Itens"}</span><strong>${splitPersonName ? cart.length : cart.reduce((sum, item) => sum + item.qty, 0)}</strong></div>
          ${tableCheckout ? `<div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>` : ""}
          ${tableCheckout ? `<div class="summary-row"><span>Servico</span><strong>${money(serviceFee)}</strong></div>` : ""}
          <div class="summary-row" data-discount-summary-row hidden><span>Desconto</span><strong data-sale-discount>${money(0)}</strong></div>
          <div class="summary-row total"><span>Total a pagar</span><strong data-sale-total>${money(total)}</strong></div>
        </div>
        ${
          canSplitAtCheckout
            ? `<div class="table-split-entry">
                <div><strong>Conta para duas ou mais pessoas?</strong><span>Divida igualmente, por produtos ou informe valores diferentes.</span></div>
                <button class="btn secondary" type="button" data-open-modal="${canSplitTableAtCheckout ? "tableSplit" : "counterSplit"}" ${canSplitTableAtCheckout ? `data-id="${checkoutTable.id}"` : ""}>Dividir entre pessoas</button>
              </div>`
            : ""
        }
        ${
          splitPersonName
            ? '<div class="notice compact">O desconto deve ser aplicado antes de dividir a conta. Esta parte sera recebida pelo valor salvo.</div><input name="discountType" type="hidden" value="none" />'
            : `<div class="discount-panel">
                <label class="field">
                  <span>Desconto</span>
                  <select name="discountType" data-discount-type>
                    <option value="none">Sem desconto</option>
                    <option value="amount">Valor em R$</option>
                    <option value="percent">Percentual %</option>
                  </select>
                </label>
                <label class="field">
                  <span>Valor do desconto</span>
                  <input name="discountValue" data-discount-value type="number" min="0" step="0.01" placeholder="0,00" />
                </label>
              </div>`
        }
        <div class="sale-payment-meta-grid">
          ${renderPaymentTerminalField({ inputId: "sale-payment-terminal-id", inputName: "terminalKey" })}
          <label class="field">
            <span>Cliente para fiado</span>
            <select name="clientId">
              ${state.clients.length
                ? state.clients.map((client) => `<option value="${client.id}">${client.name}</option>`).join("")
                : '<option value="">Cadastre um cliente antes de vender fiado</option>'}
            </select>
          </label>
        </div>
        <div class="field">
          <span>Toque na forma de pagamento</span>
          <div class="payment-choice-grid">
            ${checkoutPaymentMethods
              .map(
                (method) => `
                  <label class="payment-choice">
                    <input type="radio" name="payment" value="${method}" required />
                    <span>${method}</span>
                  </label>
                `,
              )
              .join("")}
          </div>
        </div>
        ${
          hasNetworkConnection()
            ? ""
            : '<div class="offline-sale-alert"><strong>Modo de contingencia</strong><span>Cartao e Pix devem ser cobrados diretamente na maquininha. Confirme no app somente depois da aprovacao.</span></div>'
        }
        <div class="notice offline-payment-panel" data-offline-payment-panel hidden>
          <strong>Pagamento manual na maquininha</strong>
          <div class="form-grid" style="margin-top: 12px;">
            <label class="field full">
              <span>NSU, autorizacao ou referencia (opcional)</span>
              <input name="manualReference" type="text" maxlength="80" placeholder="Numero mostrado no comprovante" />
            </label>
          </div>
          <button class="btn primary" type="submit">Confirmar que o pagamento foi aprovado</button>
        </div>
        <div class="notice" data-fiado-authorization hidden>
          <strong>Autorizacao para venda fiado</strong>
          <div class="form-grid" style="margin-top: 12px;">
            <label class="field">
              <span>Senha de administrador</span>
              <input name="adminPassword" type="password" autocomplete="off" />
            </label>
            <label class="field fiado-confirmation">
              <span>Confirmacao do cliente</span>
              <span class="check-line"><input name="confirmFiadoClient" type="checkbox" /><span data-fiado-client-confirmation>Confirmo o cliente selecionado.</span></span>
            </label>
          </div>
        </div>
        <div class="cash-change-panel" data-cash-change-panel hidden>
          <label class="field">
            <span>Valor recebido em dinheiro, se tiver troco</span>
            <input name="cashReceived" data-cash-received type="number" min="0" step="0.01" placeholder="Ex.: ${(Math.ceil(total / 10) * 10).toFixed(2)}" />
          </label>
          <div class="summary-row total">
            <span>Troco</span>
            <strong data-cash-change>${money(0)}</strong>
          </div>
          <div class="cash-action-grid">
            <button class="btn primary" type="submit" name="cashExact" value="true">Valor exato</button>
            <button class="btn secondary" type="submit">Finalizar com troco</button>
          </div>
        </div>
        <div class="credit-installments-panel" data-credit-installments hidden>
          <div class="field">
            <span>Parcelas do credito</span>
            <div class="installment-choice-grid">
              ${Array.from({ length: 12 }, (_, index) => index + 1)
                .map(
                  (installments) => `
                    <label class="payment-choice installment-choice">
                      <input type="radio" name="creditInstallments" value="${installments}" ${installments === 1 ? "checked" : ""} />
                      <span>${installments === 1 ? "A vista" : `${installments}x`}</span>
                    </label>
                  `,
                )
                .join("")}
            </div>
          </div>
          <button class="btn primary" type="submit">${hasNetworkConnection() ? "Enviar credito para a maquininha" : "Registrar credito aprovado na maquininha"}</button>
        </div>
        <div class="split-payment-panel" data-split-payment-panel hidden>
          <div class="split-payment-grid">
            ${paymentMethods
              .map(
                (method) => `
                  <label class="field">
                    <span>${method}</span>
                    <input name="split-${method}" data-split-amount="${method}" type="number" min="0" step="0.01" placeholder="0,00" />
                  </label>
                `,
              )
              .join("")}
          </div>
          <div class="field" data-split-credit-installments hidden>
            <span>Parcelas da parte paga no credito</span>
            <select name="splitCreditInstallments">
              ${Array.from({ length: 12 }, (_, index) => index + 1)
                .map((installments) => `<option value="${installments}">${installments === 1 ? "A vista" : `${installments}x`}</option>`)
                .join("")}
            </select>
          </div>
          <label class="field" data-split-cash-field hidden>
            <span>Valor recebido em dinheiro, se tiver troco</span>
            <input name="splitCashReceived" data-split-cash-received type="number" min="0" step="0.01" placeholder="Ex.: ${Math.ceil(total).toFixed(2)}" />
          </label>
          <div class="summary-list compact">
            <div class="summary-row"><span>Pago</span><strong data-split-paid>${money(0)}</strong></div>
            <div class="summary-row"><span>Falta/Excesso</span><strong data-split-remaining>${money(total)}</strong></div>
            <div class="summary-row total"><span>Troco dinheiro</span><strong data-split-cash-change>${money(0)}</strong></div>
          </div>
          <button class="btn primary" type="submit">Finalizar pagamento dividido</button>
        </div>
        <div class="notice compact">${
          hasNetworkConnection()
            ? "Pix e Debito enviam a cobranca imediatamente. No Credito, escolha de a vista ate 12x antes do envio."
            : "Sem internet, Pix, Debito e Credito sao registrados como pagamentos manuais depois da aprovacao na maquininha."
        } Dinheiro calcula o troco. Dividido permite mais de uma forma. Fiado exige cliente com limite disponivel.</div>
        <div class="notice payment-progress" data-payment-progress hidden></div>
      </div>
    </form>
  `;
}

function renderPrintTicketsModal() {
  const sale = state.sales.find((item) => item.id === currentModal.id);
  if (!sale) {
    return `
      <div class="modal-head">
        <h2>Fichas da venda</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body"><p>Venda nao encontrada para impressao.</p></div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Fechar</button>
      </div>
    `;
  }
  const ticketCount = ticketUnitList(sale).length;
  return `
    <div class="modal-head">
      <h2>Imprimir fichas</h2>
      <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
    </div>
    <div class="modal-body">
      <div class="summary-list">
        <div class="summary-row"><span>Venda</span><strong>${sale.id.slice(-8)}</strong></div>
        <div class="summary-row"><span>Total</span><strong>${money(sale.total)}</strong></div>
        <div class="summary-row"><span>Pagamento</span><strong>${paymentDisplay(sale)}</strong></div>
        <div class="summary-row total"><span>Fichas</span><strong>${ticketCount}</strong></div>
      </div>
      <p>${
        ticketCount
          ? "As fichas saem pelo navegador, uma impressao por unidade vendida, no tamanho de bobina 58mm."
          : "Este rateio nao possui uma ficha individual de produto. Use o recibo para entregar o comprovante desta pessoa."
      }</p>
    </div>
    <div class="modal-actions">
      <button class="btn secondary" type="button" data-close-modal>Fechar</button>
      <button class="btn secondary" type="button" data-print-sale="${sale.id}">${icon("print")} Recibo</button>
      <button class="btn primary" type="button" data-print-last-tickets="${sale.id}" ${ticketCount ? "" : "disabled"}>${icon("print")} Imprimir fichas</button>
    </div>
  `;
}

function renderProductHistoryModal() {
  const product = state.products.find((item) => item.id === currentModal.id);
  if (!product) {
    return `
      <div class="modal-head">
        <h2>Historico do produto</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body"><p>Produto nao encontrado.</p></div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Fechar</button>
      </div>
    `;
  }
  const rows = productStockHistory(product.id);
  return `
    <div class="modal-head">
      <h2>Historico do produto</h2>
      <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
    </div>
    <div class="modal-body">
      <div class="summary-list">
        <div class="summary-row"><span>Produto</span><strong>${escapeHtml(product.name)}</strong></div>
        <div class="summary-row"><span>Codigo</span><strong>${escapeHtml(product.productCode || productBarcodeCodes(product)[0] || "-")}</strong></div>
        <div class="summary-row total"><span>Saldo atual</span><strong>${productStockText(product)}</strong></div>
      </div>
      ${
        rows.length
          ? `<div class="table-wrap modal-table-wrap">
              <table>
                <thead><tr><th>Data</th><th>Tipo</th><th>Qtd.</th><th>Saldo</th><th>Usuario</th><th>Detalhes</th></tr></thead>
                <tbody>
                  ${rows
                    .map(
                      (row) => `
                        <tr>
                          <td>${dateTime(row.date)}</td>
                          <td><span class="status ${row.qty < 0 ? "red" : row.qty > 0 ? "green" : "blue"}">${row.type}</span></td>
                          <td>${row.qty === "" ? "-" : qty(row.qty)}</td>
                          <td>${row.balance === "" ? "-" : qty(row.balance)}</td>
                          <td>${row.userId ? userName(row.userId) : "-"}</td>
                          <td>${escapeHtml(row.details)}</td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>`
          : '<div class="empty">Nenhuma venda, lote, compra ou contagem registrada para este produto.</div>'
      }
    </div>
    <div class="modal-actions">
      <button class="btn secondary" type="button" data-close-modal>Fechar</button>
    </div>
  `;
}

function renderStockExpiryModal() {
  return `
    <div class="modal-head">
      <h2>Vencimentos</h2>
      <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
    </div>
    <div class="modal-body">
      <p>Produtos e lotes vencidos ou a vencer nos proximos 30 dias.</p>
      ${renderStockExpiryTable()}
    </div>
    <div class="modal-actions">
      <button class="btn secondary" type="button" data-close-modal>Fechar</button>
    </div>
  `;
}

function closeModal() {
  currentModal = null;
  renderApp();
  if (realtimePendingAreas.size) scheduleRealtimeRefresh(80);
}

function renderOrderModal() {
  const order = state.kitchenOrders.find((item) => item.id === currentModal.id);
  if (!order || order.status === "Entregue") {
    return `
      <div class="modal-head">
        <h2>Pedido finalizado</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body"><p>Pedidos entregues ficam bloqueados para edicao.</p></div>
    `;
  }

  return `
    <form id="order-form">
      <div class="modal-head">
        <h2>Editar pedido</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field">
            <span>Status</span>
            <select name="status">
              ${["Novo", "Preparando", "Pronto"].map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </label>
          <label class="field full">
            <span>Itens do pedido</span>
            <textarea name="itemsText" required>${order.items.map((item) => `${item.qty}x ${item.name}`).join("\n")}</textarea>
          </label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar pedido</button>
      </div>
    </form>
  `;
}

function renderProductModal() {
  const product = state.products.find((item) => item.id === currentModal.id);
  const imageAttribution = productImageAttribution(product);
  return `
    <form id="product-form">
      <div class="modal-head">
        <h2>${product ? "Editar produto" : "Novo produto"}</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field full">
            <span>Nome</span>
            <input name="name" required value="${product?.name || ""}" />
          </label>
          <div class="field full product-image-field">
            <span>Foto do produto (opcional)</span>
            <div class="product-image-picker">
              ${productImageMarkup(product, "product-image-preview")}
              <div>
                <div class="product-image-actions">
                  <label class="btn secondary product-image-button">
                    Escolher foto
                    <input name="imageFile" data-product-image-input type="file" accept="image/jpeg,image/png,image/webp" />
                  </label>
                  <button class="btn secondary" type="button" data-toggle-product-image-search>
                    ${icon("search")} Buscar na internet
                  </button>
                </div>
                <small class="hint">Use a camera ou escolha uma imagem. Ela sera reduzida automaticamente.</small>
                <small class="product-image-credit" data-product-image-credit ${imageAttribution ? "" : "hidden"}>
                  ${
                    imageAttribution
                      ? `<a href="${escapeHtml(imageAttribution.sourceUrl)}" target="_blank" rel="noopener noreferrer">Fonte: ${escapeHtml(imageAttribution.credit)} - ${escapeHtml(imageAttribution.license)}</a>`
                      : ""
                  }
                </small>
                ${productImageUrl(product) ? '<label class="check-line"><input name="removeImage" type="checkbox" /> Remover foto atual</label>' : ""}
              </div>
            </div>
            <input name="internetImageUrl" data-product-internet-image-url type="hidden" value="" />
            <div class="product-image-search-panel" data-product-image-search-panel hidden>
              <div class="product-image-search-bar">
                <input type="search" data-product-image-search-input value="${escapeHtml(product?.name || "")}" placeholder="Ex.: Coca-Cola 2 litros" autocomplete="off" />
                <button class="btn primary compact" type="button" data-search-product-images>${icon("search")} Pesquisar</button>
              </div>
              <small class="hint" data-product-image-search-status>As imagens sao fornecidas pelo Wikimedia Commons. Confira a fonte e a licenca.</small>
              <div class="internet-image-results" data-product-image-results></div>
            </div>
          </div>
          <label class="field">
            <span>Codigo do produto</span>
            <input name="productCode" value="${product?.productCode || ""}" placeholder="Ex.: 789123 ou LT600" />
          </label>
          ${Array.from({ length: 5 }, (_, index) => {
            const code = productBarcodeCodes(product)[index] || "";
            return `
              <label class="field">
                <span>Codigo de barras ${index + 1}</span>
                <input name="barcodeCode${index + 1}" value="${code}" placeholder="Opcional" />
              </label>
            `;
          }).join("")}
          <label class="field">
            <span>Categoria</span>
            <input name="category" required value="${product?.category || ""}" />
          </label>
          <label class="field">
            <span>Status</span>
            <select name="active">
              <option value="true" ${product?.active !== false ? "selected" : ""}>Ativo</option>
              <option value="false" ${product?.active === false ? "selected" : ""}>Inativo</option>
            </select>
          </label>
          <label class="field">
            <span>Menu rapido do balcao</span>
            <select name="favorite">
              <option value="true" ${product?.favorite ? "selected" : ""}>Sim</option>
              <option value="false" ${!product?.favorite ? "selected" : ""}>Nao</option>
            </select>
          </label>
          <label class="field">
            <span>Praca de preparo</span>
            <select name="station">
              <option ${product?.station === "Bar" ? "selected" : ""}>Bar</option>
              <option ${product?.station === "Cozinha" ? "selected" : ""}>Cozinha</option>
            </select>
          </label>
          <label class="field">
            <span>Preco</span>
            <input name="price" type="number" min="0" step="0.01" required value="${product?.price || ""}" />
          </label>
          <label class="field">
            <span>Custo</span>
            <input name="cost" type="number" min="0" step="0.01" required value="${product?.cost || ""}" />
          </label>
          <label class="field">
            <span>Estoque atual</span>
            <input name="stock" type="number" min="0" step="1" required value="${product?.stock ?? 0}" />
          </label>
          <label class="field">
            <span>Estoque minimo</span>
            <input name="minStock" type="number" min="0" step="1" required value="${product?.minStock ?? 0}" />
          </label>
          <label class="field">
            <span>Estoque critico</span>
            <input name="criticalStock" type="number" min="0" step="1" required value="${product?.criticalStock ?? 0}" />
          </label>
          <label class="field">
            <span>Data de validade</span>
            <input name="expiresAt" type="date" value="${product?.expiresAt || ""}" />
          </label>
          <label class="field full">
            <span>Ficha tecnica</span>
            <textarea name="recipeText" placeholder="Ex.: Cachaca:60, Limao:1">${recipeToText(product?.recipe || [])}</textarea>
            <small class="hint">Para venda fracionada, cadastre o estoque real como insumo e informe o consumo por venda. Ex.: Cigarro Marlboro:1 ou Whisky 1L:50.</small>
          </label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar</button>
      </div>
    </form>
  `;
}

function renderStockModal() {
  const product = state.products.find((item) => item.id === currentModal.id);
  return `
    <form id="stock-form">
      <div class="modal-head">
        <h2>Ajustar estoque</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <p><strong>${product.name}</strong></p>
        <p class="hint">Saldo atual: <strong>${productStockText(product)}</strong>. Toda alteracao feita aqui sera registrada no historico do produto.</p>
        <div class="form-grid">
          <label class="field">
            <span>Tipo</span>
            <select name="mode">
              <option value="add">Adicionar</option>
              <option value="remove">Remover</option>
              <option value="set">Definir saldo</option>
            </select>
          </label>
          <label class="field">
            <span>Quantidade</span>
            <input name="qty" type="number" min="0" step="1" required />
          </label>
          <label class="field full">
            <span>Motivo</span>
            <input name="reason" value="Reposicao manual" />
          </label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar</button>
      </div>
    </form>
  `;
}

function renderIngredientModal() {
  return `
    <form id="ingredient-form">
      <div class="modal-head">
        <h2>Novo insumo</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field"><span>Nome</span><input name="name" required /></label>
          <label class="field"><span>Unidade</span><input name="unit" required placeholder="ml, g, un" /></label>
          <label class="field"><span>Saldo</span><input name="stock" type="number" min="0" step="0.01" required /></label>
          <label class="field"><span>Minimo</span><input name="minStock" type="number" min="0" step="0.01" required /></label>
          <label class="field"><span>Custo unitario</span><input name="costPerUnit" type="number" min="0" step="0.001" required /></label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar</button>
      </div>
    </form>
  `;
}

function renderInventoryModal() {
  const productOptions = state.products.map((product) => `<option value="product:${product.id}">${product.name}</option>`).join("");
  const ingredientOptions = state.ingredients.map((ingredient) => `<option value="ingredient:${ingredient.id}">${ingredient.name}</option>`).join("");
  return `
    <form id="inventory-form">
      <div class="modal-head">
        <h2>Nova contagem</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field full"><span>Item</span><select name="itemKey">${productOptions}${ingredientOptions}</select></label>
          <label class="field"><span>Quantidade contada</span><input name="counted" type="number" min="0" step="0.01" required /></label>
          <label class="field full"><span>Observacao</span><input name="notes" /></label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar contagem</button>
      </div>
    </form>
  `;
}

function renderSupplierModal() {
  const supplier = state.suppliers.find((item) => item.id === currentModal.id);
  return `
    <form id="supplier-form">
      <div class="modal-head">
        <h2>${supplier ? "Editar fornecedor" : "Novo fornecedor"}</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field full"><span>Nome</span><input name="name" required value="${escapeHtml(supplier?.name || "")}" /></label>
          <label class="field"><span>Contato</span><input name="contact" value="${escapeHtml(supplier?.contact || "")}" /></label>
          <label class="field"><span>CNPJ</span><input name="cnpj" value="${escapeHtml(supplier?.cnpj || "")}" placeholder="00.000.000/0000-00" /></label>
          <label class="field full"><span>Email</span><input name="email" type="email" value="${escapeHtml(supplier?.email || "")}" /></label>
          <label class="field"><span>Telefone 1</span><input name="phone" value="${escapeHtml(supplier?.phone || "")}" /></label>
          <label class="field"><span>Telefone 2</span><input name="phone2" value="${escapeHtml(supplier?.phone2 || "")}" /></label>
          <label class="field"><span>Telefone 3</span><input name="phone3" value="${escapeHtml(supplier?.phone3 || "")}" /></label>
          <label class="field"><span>Telefone 4</span><input name="phone4" value="${escapeHtml(supplier?.phone4 || "")}" /></label>
          <label class="field"><span>Telefone 5</span><input name="phone5" value="${escapeHtml(supplier?.phone5 || "")}" /></label>
          <label class="field full"><span>Endereco</span><input name="address" value="${escapeHtml(supplier?.address || "")}" placeholder="Rua, numero, bairro, cidade" /></label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar</button>
      </div>
    </form>
  `;
}

function renderPurchaseModal() {
  return `
    <form id="purchase-form">
      <div class="modal-head">
        <h2>Registrar compra</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field full">
            <span>Fornecedor</span>
            <select name="supplierId">${state.suppliers.map((supplier) => `<option value="${supplier.id}">${supplier.name}</option>`).join("")}</select>
          </label>
          <label class="field"><span>Item comprado</span><input name="itemName" required /></label>
          <label class="field"><span>Quantidade</span><input name="qty" type="number" min="0.01" step="0.01" required /></label>
          <label class="field"><span>Custo unitario</span><input name="unitCost" type="number" min="0" step="0.01" required /></label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Registrar</button>
      </div>
    </form>
  `;
}

function renderExpenseModal() {
  const expense = (state.expenses || []).find((item) => item.id === currentModal.id);
  const defaultExpenseDate = expense?.expenseDate || String(expense?.createdAt || new Date().toISOString()).slice(0, 10);
  const recurring = expense?.recurring ?? currentModal.recurring;
  const initialInvoiceAmount = expense ? expenseInitialInvoiceAmount(expense) : "";
  return `
    <form id="expense-form">
      <div class="modal-head">
        <h2>${expense ? "Editar despesa" : recurring ? "Nova despesa recorrente" : "Nova despesa"}</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field full"><span>Descricao</span><input name="description" required value="${escapeHtml(expense?.description || "")}" /></label>
          <label class="field"><span>Categoria</span><input name="category" value="${escapeHtml(expense?.category || "")}" /></label>
          <label class="field"><span>Valor da fatura inicial</span><input name="amount" type="number" min="0.01" step="0.01" required value="${initialInvoiceAmount}" /></label>
          <label class="field"><span>Data da despesa</span><input name="expenseDate" type="date" required value="${defaultExpenseDate}" /></label>
          <label class="field"><span>Vencimento</span><input name="dueDate" type="date" required value="${expense?.dueDate || ""}" /></label>
          <label class="field expense-recurrence"><span>Repetir mensalmente</span><input name="recurring" type="checkbox" ${recurring ? "checked" : ""} /></label>
          <label class="field"><span>Dia fixo do vencimento</span><input name="recurringDay" type="number" min="1" max="31" value="${expense?.recurringDay || ""}" placeholder="Dia do vencimento" /></label>
          <label class="field">
            <span>Status</span>
            <select name="paid">
              <option value="false" ${!expense?.paid ? "selected" : ""}>Aberto</option>
              <option value="true" ${expense?.paid ? "selected" : ""}>Pago</option>
            </select>
          </label>
        </div>
        ${expenseChargeHistory(expense).length ? '<div class="notice compact">As demais faturas permanecem separadas e nao serao alteradas por este formulario.</div>' : ""}
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar despesa</button>
      </div>
    </form>
  `;
}

function renderExpenseChargeModal() {
  const expense = (state.expenses || []).find((item) => item.id === currentModal.id);
  if (!expense) {
    return `
      <div class="modal-head">
        <h2>Adicionar nova fatura</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body"><p>Despesa nao encontrada.</p></div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Fechar</button>
      </div>
    `;
  }

  return `
    <form id="expense-charge-form">
      <div class="modal-head">
        <h2>Adicionar nova fatura</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="summary-list">
          <div class="summary-row"><span>Empresa ou despesa</span><strong>${escapeHtml(expense.description)}</strong></div>
          <div class="summary-row"><span>Valor acumulado</span><strong>${money(expense.amount)}</strong></div>
          <div class="summary-row"><span>Ja pago</span><strong>${money(expensePaidAmount(expense))}</strong></div>
          <div class="summary-row total"><span>Saldo atual</span><strong>${money(expenseBalance(expense))}</strong></div>
        </div>
        <div class="form-grid">
          <label class="field">
            <span>Valor da nova fatura</span>
            <input name="amount" type="number" min="0.01" step="0.01" required />
          </label>
          <label class="field">
            <span>Data e hora da fatura</span>
            <input name="date" type="datetime-local" required value="${datetimeLocalValue()}" />
          </label>
          <label class="field">
            <span>Novo vencimento (opcional)</span>
            <input name="dueDate" type="date" value="${expense.dueDate || ""}" />
          </label>
          <label class="field full">
            <span>Descricao ou numero da fatura</span>
            <input name="note" required placeholder="Ex.: NF 1234, novo pedido de bebidas..." />
          </label>
        </div>
        <div class="notice compact">A nova fatura ficara em uma linha separada por data e vencimento. O saldo total da conta tambem sera atualizado.</div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Criar fatura separada</button>
      </div>
    </form>
  `;
}

function renderExpensePaymentModal() {
  const expense = (state.expenses || []).find((item) => item.id === currentModal.id);
  if (!expense) {
    return `
      <div class="modal-head">
        <h2>Pagar despesa</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body"><p>Despesa nao encontrada.</p></div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Fechar</button>
      </div>
    `;
  }

  const invoices = expenseInvoices(expense);
  const invoice = invoices.find((entry) => entry.id === currentModal.invoiceId) || invoices.find((entry) => entry.balance > 0) || invoices[0];
  if (!invoice) {
    return `
      <div class="modal-head">
        <h2>Pagar fatura</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body"><p>Nenhuma fatura encontrada para esta despesa.</p></div>
      <div class="modal-actions"><button class="btn secondary" type="button" data-close-modal>Fechar</button></div>
    `;
  }

  const balance = invoice.balance;
  const history = expenseMovementHistory(expense);
  return `
    <form id="expense-payment-form">
      <div class="modal-head">
        <h2>Pagar fatura</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="summary-list">
          <div class="summary-row"><span>Empresa ou despesa</span><strong>${escapeHtml(expense.description)}</strong></div>
          <div class="summary-row"><span>Fatura escolhida</span><strong>${escapeHtml(expenseInvoiceLabel(invoice))}</strong></div>
          <div class="summary-row"><span>Data / vencimento</span><strong>${formatDateBr(String(invoice.date || "").slice(0, 10))} / ${formatDateBr(invoice.dueDate)}</strong></div>
          <div class="summary-row"><span>Valor da fatura</span><strong>${money(invoice.amount)}</strong></div>
          <div class="summary-row"><span>Pago nesta fatura</span><strong>${money(invoice.paidAmount)}</strong></div>
          <div class="summary-row total"><span>Saldo desta fatura</span><strong>${money(balance)}</strong></div>
          <div class="summary-row"><span>Saldo total da conta</span><strong>${money(expenseBalance(expense))}</strong></div>
        </div>
        <div class="form-grid">
          <input name="invoiceId" type="hidden" value="${invoice.id}" />
          <label class="field">
            <span>Valor pago agora</span>
            <input name="amount" type="number" min="0.01" max="${balance}" step="0.01" required value="${balance || ""}" />
          </label>
          <label class="field">
            <span>Forma</span>
            <select name="method">
              <option value="cash">Dinheiro</option>
              <option value="pix">Pix</option>
              <option value="debit">Debito</option>
              <option value="credit">Credito</option>
              <option value="bank">Banco</option>
              <option value="other">Outro</option>
            </select>
          </label>
          <label class="field">
            <span>Data do pagamento</span>
            <input name="date" type="datetime-local" required value="${datetimeLocalValue()}" />
          </label>
          <label class="field full">
            <span>Observacao</span>
            <input name="note" placeholder="Ex.: parcela 1/10, pagamento em dinheiro, Pix..." />
          </label>
        </div>
        ${
          history.length
            ? `<div class="table-wrap modal-table-wrap">
                <table>
                  <thead><tr><th>Data/hora</th><th>Movimento</th><th>Fatura</th><th>Valor</th><th>Forma</th><th>Usuario</th><th>Obs.</th></tr></thead>
                  <tbody>
                    ${history
                      .map((entry) => {
                        const historyInvoice = invoices.find((item) => item.id === (entry.type === "charge" ? entry.id : entry.invoiceId));
                        return `
                          <tr>
                            <td>${dateTime(entry.date)}</td>
                            <td>${entry.type === "charge" ? "Nova fatura" : "Pagamento"}</td>
                            <td>${historyInvoice ? escapeHtml(expenseInvoiceLabel(historyInvoice)) : entry.type === "charge" ? escapeHtml(entry.note || "Nova fatura") : "Distribuido automaticamente"}</td>
                            <td>${entry.type === "charge" ? "+ " : "- "}${money(entry.amount)}</td>
                            <td>${entry.type === "charge" ? "-" : expensePaymentMethodLabel(entry.method)}</td>
                            <td>${entry.userId ? userName(entry.userId) : "-"}</td>
                            <td>${escapeHtml(entry.note || "")}</td>
                          </tr>
                        `;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>`
            : '<div class="empty">Nenhuma movimentacao registrada ainda.</div>'
        }
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Registrar pagamento</button>
      </div>
    </form>
  `;
}

function renderClientModal() {
  const client = state.clients.find((item) => item.id === currentModal.id);
  return `
    <form id="client-form">
      <div class="modal-head">
        <h2>${client ? "Editar cliente" : "Novo cliente"}</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field full"><span>Nome</span><input name="name" required value="${client?.name || ""}" /></label>
          <label class="field"><span>Telefone</span><input name="phone" value="${client?.phone || ""}" /></label>
          <label class="field"><span>Saldo fiado</span><input name="debt" type="number" min="0" step="0.01" value="${client?.debt || 0}" /></label>
          <label class="field"><span>Limite de fiado</span><input name="creditLimit" type="number" min="0" step="0.01" value="${client?.creditLimit || 0}" /></label>
          <label class="field full"><span>Observacoes</span><input name="notes" value="${client?.notes || ""}" /></label>
          <label class="field">
            <span>Adicionar produto ao fiado</span>
            <select name="chargeProductId">
              <option value="">Nenhum</option>
              ${state.products.map((product) => `<option value="${product.id}">${product.name}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Valor do novo produto</span>
            <input name="chargeAmount" type="number" min="0" step="0.01" value="0" />
          </label>
          ${
            client?.transactions?.length
              ? `<div class="full transaction-log">
                  <strong>Historico</strong>
                  ${client.transactions
                    .map((entry) => `<span class="transaction-entry">
                      <span>${dateTime(entry.date)} - ${escapeHtml(entry.description)} - ${money(entry.amount)}</span>
                      ${entry.type === "debito" && Number(entry.amount) > 0
                        ? `<button class="btn compact danger" type="button" data-open-modal="clientTransactionRemoval" data-id="${entry.id}">Remover</button>`
                        : ""}
                    </span>`)
                    .join("")}
                </div>`
              : ""
          }
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar</button>
      </div>
    </form>
  `;
}

function renderClientPaymentModal() {
  const client = state.clients.find((item) => item.id === currentModal.id);
  return `
    <form id="client-payment-form">
      <div class="modal-head">
        <h2>Pagamento parcial</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <p><strong>${client?.name || "Cliente"}</strong> - saldo ${money(client?.debt || 0)}</p>
        <div class="form-grid">
          <label class="field"><span>Valor pago</span><input name="amount" type="number" min="0.01" step="0.01" max="${client?.debt || 0}" required /></label>
          <label class="field full"><span>Observacao</span><input name="notes" placeholder="Ex.: pagamento em dinheiro" /></label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Baixar valor</button>
      </div>
    </form>
  `;
}

function renderAddTablesModal() {
  const defaultCount = 4;
  return `
    <form id="add-tables-form">
      <div class="modal-head">
        <h2>Adicionar mesas</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <p>O sistema tem <strong>${state.tables.length} mesas</strong>. As novas mesas entram livres e nao alteram as comandas existentes.</p>
        <div class="form-grid">
          <label class="field full">
            <span>Quantidade de novas mesas</span>
            <input name="count" data-table-count type="number" min="1" max="30" step="1" value="${defaultCount}" required />
            <small data-table-preview>${tableCreationPreview(defaultCount)}</small>
          </label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Criar mesas</button>
      </div>
    </form>
  `;
}

function renderTableModal() {
  const table = state.tables.find((item) => item.id === currentModal.id);
  if (!table) return '<div class="modal-body"><p>Mesa nao encontrada.</p></div>';
  const products = filteredProducts().filter((product) => product.active);
  if (table.splitBill) {
    return `
      <div class="modal-head">
        <h2>${escapeHtml(table.name)}</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="notice">Esta comanda esta dividida e fica bloqueada para edicao ate todos os pagamentos terminarem.</div>
        ${renderTableSplitStatus(table)}
      </div>
      <div class="modal-actions"><button class="btn secondary" type="button" data-close-modal>Fechar</button></div>
    `;
  }
  return `
    <div>
      <div class="modal-head">
        <h2>${table?.name || "Mesa"}</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <label class="field full">
          <span>Nome do cliente na mesa (opcional)</span>
          <input name="customerName" data-table-customer="${table.id}" value="${escapeHtml(table.customerName || "")}" placeholder="Ex.: Joao, familia Silva, aniversario" />
        </label>
        <div class="table-tools">
          <label class="field">
            <span>Mesa destino</span>
            <select id="target-table-id">
              ${state.tables
                .filter((entry) => entry.id !== table.id)
                .map((entry) => `<option value="${entry.id}">${entry.name} - ${entry.status}</option>`)
                .join("")}
            </select>
          </label>
          <button class="btn secondary" type="button" data-transfer-table="${table.id}">Transferir</button>
          <button class="btn secondary" type="button" data-merge-table="${table.id}">Juntar</button>
        </div>
        <div class="grid two-col">
          <section>
            <h3 class="compact-title">Adicionar item</h3>
            <input class="field-input search table-product-search" data-search type="search" placeholder="Buscar produto por nome, codigo ou barra" />
            <div class="mobile-product-list">
              ${
                products.length
                  ? products
                      .map(
                        (product) => `
                          <button class="mobile-product" type="button" data-table-id="${table.id}" data-add-table-product="${product.id}" ${productAvailableStock(product) <= 0 ? "disabled" : ""}>
                            <span class="category-badge">${categoryMeta[product.category]?.icon || "IT"}</span>
                            <span><strong>${product.name}</strong><small>${money(product.price)} - ${productStockText(product)}</small></span>
                            <span>+</span>
                          </button>
                        `,
                      )
                      .join("")
                  : '<div class="empty">Nenhum produto encontrado.</div>'
              }
            </div>
          </section>
          <section>
            <h3 class="compact-title">Comanda aberta</h3>
            ${renderTableItems(table)}
          </section>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-clear-table="${table.id}">Liberar</button>
        <button class="btn secondary" type="button" data-open-modal="tableSplit" data-id="${table.id}" ${table.items.length ? "" : "disabled"}>Dividir conta</button>
        <button class="btn primary" type="button" data-close-table="${table.id}" ${table.items.length ? "" : "disabled"}>Enviar para balcao</button>
      </div>
    </div>
  `;
}

function renderTableSplitModal() {
  const isCounter = currentModal.type === "counterSplit";
  const table = isCounter
    ? { id: `counter-${CURRENT_SERVICE_NUMBER}`, name: "Venda do balcao", customerName: "", items: structuredClone(cart), isCounter: true }
    : state.tables.find((item) => item.id === currentModal.id);
  if (!table?.items?.length) {
    return `
      <div class="modal-head">
        <h2>Dividir conta</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body"><p>Adicione produtos a mesa antes de dividir a conta.</p></div>
      <div class="modal-actions"><button class="btn secondary" type="button" data-close-modal>Fechar</button></div>
    `;
  }
  const subtotal = Number(tableTotalValue(table).toFixed(2));
  const serviceFee = table.isCounter ? 0 : Number(tableServiceFee(subtotal).toFixed(2));
  const total = Number((subtotal + serviceFee).toFixed(2));
  return `
    <form id="table-split-form">
      <input name="tableId" type="hidden" value="${table.id}" />
      <input name="splitSource" type="hidden" value="${isCounter ? "counter" : "table"}" />
      <div class="modal-head">
        <div><h2>${isCounter ? "Dividir venda do balcao" : `Dividir ${escapeHtml(table.name)}`}</h2><p>${isCounter ? `Atendimento ${CURRENT_SERVICE_NUMBER}` : table.customerName ? escapeHtml(table.customerName) : "Conta da mesa"}</p></div>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body table-split-body">
        <div class="summary-list compact table-split-total">
          <div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
          <div class="summary-row"><span>Servico</span><strong>${money(serviceFee)}</strong></div>
          <div class="summary-row total"><span>Total da conta</span><strong data-table-split-total data-value="${total}">${money(total)}</strong></div>
        </div>
        <div class="table-split-controls">
          <label class="field">
            <span>Quantidade de pessoas</span>
            <select name="peopleCount" data-split-people-count>
              ${Array.from({ length: MAX_TABLE_SPLIT_PEOPLE - 1 }, (_, index) => index + 2)
                .map((count) => `<option value="${count}">${count} pessoas</option>`)
                .join("")}
            </select>
          </label>
          <fieldset class="field full">
            <legend>Como deseja dividir?</legend>
            <div class="split-mode-grid">
              <label class="payment-choice"><input type="radio" name="splitMode" value="equal" checked /><span>Partes iguais</span></label>
              <label class="payment-choice"><input type="radio" name="splitMode" value="items" /><span>Por produtos</span></label>
              <label class="payment-choice"><input type="radio" name="splitMode" value="custom" /><span>Valores personalizados</span></label>
            </div>
          </fieldset>
        </div>
        <section class="split-person-section">
          <h3>Identificacao das pessoas</h3>
          <p>Os nomes sao opcionais. Sem nome, o app usa Pessoa 1, Pessoa 2 e assim por diante.</p>
          <div class="split-person-grid">
            ${Array.from({ length: MAX_TABLE_SPLIT_PEOPLE }, (_, index) => `
              <label class="field split-person-field" data-split-person-field="${index}" ${index >= 2 ? "hidden" : ""}>
                <span>Pessoa ${index + 1}</span>
                <input name="personName-${index}" placeholder="Nome opcional" autocomplete="off" />
              </label>
            `).join("")}
          </div>
        </section>
        <section class="split-custom-section" data-split-custom-panel hidden>
          <h3>Valor de cada pessoa</h3>
          <div class="split-person-grid">
            ${Array.from({ length: MAX_TABLE_SPLIT_PEOPLE }, (_, index) => `
              <label class="field split-custom-field" data-split-custom-field="${index}" ${index >= 2 ? "hidden" : ""}>
                <span>Pessoa ${index + 1}</span>
                <input name="customAmount-${index}" data-split-custom-amount="${index}" type="number" min="0" step="0.01" placeholder="0,00" />
              </label>
            `).join("")}
          </div>
          <div class="summary-row total"><span>Soma informada</span><strong data-split-custom-sum>${money(0)} de ${money(total)}</strong></div>
        </section>
        <section class="split-items-section" data-split-items-panel hidden>
          <div class="table-split-section-head">
            <div><h3>Produtos de cada pessoa</h3><p>Distribua toda a quantidade de cada item.</p></div>
            <button class="btn compact secondary" type="button" data-auto-split-items>Distribuir automaticamente</button>
          </div>
          <div class="split-item-list">
            ${table.items.map((item, itemIndex) => `
              <article class="split-item-card" data-split-item-row data-item-qty="${Number(item.qty || 0)}">
                <div class="split-item-title"><strong>${escapeHtml(item.name)}</strong><span>${qty(item.qty)} un. / ${money(item.qty * item.price)}</span></div>
                <div class="split-item-allocation-grid">
                  ${Array.from({ length: MAX_TABLE_SPLIT_PEOPLE }, (_, personIndex) => `
                    <label data-split-item-person="${personIndex}" ${personIndex >= 2 ? "hidden" : ""}>
                      <span>P${personIndex + 1}</span>
                      <input name="item-${itemIndex}-person-${personIndex}" data-split-item-allocation type="number" min="0" max="${Number(item.qty || 0)}" step="${Number.isInteger(Number(item.qty || 0)) ? 1 : 0.001}" value="0" />
                    </label>
                  `).join("")}
                </div>
                <small data-split-item-balance>Falta distribuir: ${qty(item.qty)}</small>
              </article>
            `).join("")}
          </div>
        </section>
        <div class="notice compact" data-table-split-preview>Em partes iguais: ${money(total / 2)} por pessoa, com ajuste automatico dos centavos.</div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar divisao</button>
      </div>
    </form>
  `;
}

function renderCancelSaleModal() {
  const sale = state.sales.find((item) => item.id === currentModal.id);
  return `
    <form id="cancel-sale-form">
      <div class="modal-head">
        <h2>Cancelar venda</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <p><strong>${sale?.id || "Venda"}</strong> - ${money(sale?.total || 0)}</p>
        <div class="form-grid">
          <label class="field full">
            <span>Senha de administrador</span>
            <input name="adminPassword" type="password" required />
          </label>
          <label class="field full">
            <span>Motivo do cancelamento</span>
            <textarea name="reason" required placeholder="Ex.: venda lancada por engano"></textarea>
          </label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Voltar</button>
        <button class="btn danger" type="submit">Cancelar venda</button>
      </div>
    </form>
  `;
}

function renderLotModal() {
  const productOptions = state.products.map((product) => `<option value="product:${product.id}">${product.name}</option>`).join("");
  const ingredientOptions = state.ingredients.map((ingredient) => `<option value="ingredient:${ingredient.id}">${ingredient.name}</option>`).join("");
  return `
    <form id="lot-form">
      <div class="modal-head">
        <h2>Novo lote</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field full"><span>Item</span><select name="itemKey">${productOptions}${ingredientOptions}</select></label>
          <label class="field"><span>Lote</span><input name="batch" required /></label>
          <label class="field"><span>Quantidade</span><input name="qty" type="number" min="0" step="0.01" required /></label>
          <label class="field"><span>Validade</span><input name="expiresAt" type="date" required /></label>
          <label class="field"><span>Fornecedor</span><select name="supplierId">${state.suppliers.map((supplier) => `<option value="${supplier.id}">${supplier.name}</option>`).join("")}</select></label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar lote</button>
      </div>
    </form>
  `;
}

function renderUserModal() {
  const user = state.users.find((item) => item.id === currentModal.id);
  const selectedRole = user?.role || "cashier";
  const selectedPermissions = user ? getUserPermissions(user) : roles[selectedRole].permissions;
  const isAdminRole = selectedRole === "admin";
  const isLocalUser = Boolean(user && !isUuid(user.id));
  const canResetOnlinePassword = isOnlineSession() && session?.role === "admin" && user && isUuid(user.id);
  return `
    <form id="user-form">
      <div class="modal-head">
        <h2>${user ? "Editar usuario" : "Novo usuario"}</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field full">
            <span>Nome</span>
            <input name="name" required value="${user?.name || ""}" />
          </label>
          <label class="field full">
            <span>Email</span>
            <input name="email" type="email" required value="${user?.email || ""}" />
          </label>
          ${
            isOnlineSession() && !isLocalUser
              ? `<label class="field full">
                  <span>Nova senha online</span>
                  <input name="password" type="password" minlength="6" ${canResetOnlinePassword ? "" : "disabled"} placeholder="${canResetOnlinePassword ? "Deixe em branco para manter a senha atual" : "Disponivel apenas para usuario online existente"}" />
                  <small>
                    A senha real fica no Supabase Auth. Preencha aqui apenas quando quiser trocar.
                    <a href="${supabaseAuthUsersUrl()}" target="_blank" rel="noopener noreferrer">Abrir usuarios do Supabase</a>
                  </small>
                </label>`
              : `<label class="field">
                  <span>Senha ${isLocalUser ? "offline" : ""}</span>
                  <input name="password" type="password" required value="${user?.password || ""}" />
                </label>`
          }
          ${isOnlineSession() && isLocalUser ? '<div class="notice compact full">Esta e uma conta offline. As alteracoes ficam somente neste navegador e nao sao enviadas ao Supabase.</div>' : ""}
          <label class="field">
            <span>Cargo</span>
            <select name="role" id="user-role">
              ${Object.entries(roles)
                .map(
                  ([key, role]) => `<option value="${key}" ${selectedRole === key ? "selected" : ""}>${role.label}</option>`,
                )
                .join("")}
            </select>
          </label>
          <label class="field">
            <span>Status</span>
            <select name="active">
              <option value="true" ${user?.active !== false ? "selected" : ""}>Ativo</option>
              <option value="false" ${user?.active === false ? "selected" : ""}>Inativo</option>
            </select>
          </label>
          <label class="field">
            <span>Aparecer na tela inicial</span>
            <select name="showOnLogin">
              <option value="true" ${user?.showOnLogin ? "selected" : ""}>Sim</option>
              <option value="false" ${!user?.showOnLogin ? "selected" : ""}>Nao</option>
            </select>
          </label>
          <section class="permission-panel full">
            <div class="permission-head">
              <div>
                <strong>Permissoes do usuario</strong>
                <span>O cargo sugere um padrao, mas o administrador decide o acesso final.</span>
              </div>
              <button class="btn compact secondary" type="button" data-apply-role>Aplicar padrao</button>
            </div>
            <div class="permission-grid">
              ${navItems
                .map(
                  (item) => `
                    <label class="check-tile ${isAdminRole ? "locked" : ""}">
                      <input
                        type="checkbox"
                        name="permissions"
                        value="${item.id}"
                        ${selectedPermissions.includes(item.id) ? "checked" : ""}
                        ${isAdminRole ? "disabled" : ""}
                      />
                      <span class="check-icon">${icon(item.icon)}</span>
                      <span>
                        <strong>${item.label}</strong>
                        <small>${permissionDescriptions[item.id]}</small>
                      </span>
                    </label>
                  `,
                )
                .join("")}
            </div>
          </section>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar</button>
      </div>
    </form>
  `;
}

function renderMovementModal() {
  const selectedType = currentModal?.movementType || "suprimento";
  const fixedExpense = selectedType === "despesa";
  const today = localDateKey();
  return `
    <form id="movement-form">
      <div class="modal-head">
        <h2>${fixedExpense ? "Saida para despesa do dia" : "Movimentacao de caixa"}</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        ${fixedExpense ? '<div class="notice compact">Essa despesa sera abatida do dinheiro esperado no caixa aberto.</div>' : ""}
        <div class="form-grid">
          <label class="field">
            <span>Tipo</span>
            <select name="type" ${fixedExpense ? "disabled" : ""}>
              <option value="suprimento" ${selectedType === "suprimento" ? "selected" : ""}>Suprimento</option>
              <option value="sangria" ${selectedType === "sangria" ? "selected" : ""}>Sangria</option>
              <option value="despesa" ${selectedType === "despesa" ? "selected" : ""}>Despesa</option>
            </select>
            ${fixedExpense ? '<input type="hidden" name="type" value="despesa" />' : ""}
          </label>
          <label class="field">
            <span>Valor</span>
            <input name="amount" type="number" min="0.01" step="0.01" required />
          </label>
          ${
            fixedExpense
              ? `<label class="field">
                  <span>Data da saida</span>
                  <input name="movementDate" type="date" max="${today}" required value="${today}" />
                  <small class="hint">Use uma data anterior para registrar uma retirada esquecida.</small>
                </label>`
              : ""
          }
          <label class="field full">
            <span>${fixedExpense ? "Descricao da despesa" : "Motivo"}</span>
            <input name="reason" required placeholder="${fixedExpense ? "Ex.: compra de gelo, entrega, limpeza" : ""}" />
          </label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar</button>
      </div>
    </form>
  `;
}

function clientTransactionById(transactionId) {
  for (const client of state.clients) {
    const transaction = (client.transactions || []).find((entry) => entry.id === transactionId);
    if (transaction) return { client, transaction };
  }
  return null;
}

function renderClientTransactionRemovalModal() {
  const match = clientTransactionById(currentModal.id);
  return `
    <form id="client-transaction-removal-form">
      <div class="modal-head">
        <h2>Remover produto do fiado</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        ${match ? `<div class="summary-list">
          <div class="summary-row"><span>Cliente</span><strong>${escapeHtml(match.client.name)}</strong></div>
          <div class="summary-row"><span>Produto</span><strong>${escapeHtml(match.transaction.description)}</strong></div>
          <div class="summary-row total"><span>Retirar do saldo</span><strong>${money(match.transaction.amount)}</strong></div>
        </div>` : '<div class="empty">Lancamento nao encontrado.</div>'}
        ${match?.transaction.saleId ? '<div class="notice compact">O debito sera removido do cliente. A venda original permanecera preservada no historico de vendas.</div>' : ""}
        <label class="field"><span>Senha de administrador</span><input name="adminPassword" type="password" autocomplete="off" required /></label>
        <label class="field"><span>Motivo da remocao</span><input name="reason" required placeholder="Ex.: produto lancado por engano" /></label>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Voltar</button>
        <button class="btn danger" type="submit" ${match ? "" : "disabled"}>Remover produto</button>
      </div>
    </form>
  `;
}

function renderManualChargeModal() {
  const hasActiveTerminal = paymentTerminalOptions().some((terminal) => terminal.enabled);
  const selectedTerminal = getSelectedPaymentTerminal();
  const selectedStoneManual = selectedTerminal?.provider === "stone" && selectedTerminal.integrationMode === "manual";
  return `
    <form id="manual-charge-form">
      <div class="modal-head">
        <h2>Cobranca avulsa</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="notice compact">
          Use para receber um valor que nao corresponde a um produto cadastrado. O lancamento entra em Vendas, mas nao altera o estoque.
        </div>
        <div class="form-grid manual-charge-grid">
          <label class="field full">
            <span>Descricao do que esta sendo recebido</span>
            <input name="description" type="text" maxlength="120" placeholder="Ex.: taxa, encomenda ou item especial" required autofocus />
          </label>
          <label class="field">
            <span>Valor</span>
            <input name="amount" data-manual-charge-amount type="number" min="0.01" step="0.01" placeholder="0,00" required />
          </label>
          ${renderPaymentTerminalField({ inputId: "manual-charge-terminal-id", inputName: "terminalKey" })}
          <div class="field full">
            <span>Forma de pagamento</span>
            <div class="payment-choice-grid manual-charge-payment-grid">
              ${pointPaymentMethods
                .map(
                  (method) => `
                    <label class="payment-choice">
                      <input type="radio" name="payment" value="${method}" required />
                      <span>${method}</span>
                    </label>
                  `,
                )
                .join("")}
            </div>
          </div>
          <label class="field full" data-manual-charge-installments hidden>
            <span>Parcelas do credito</span>
            <select name="creditInstallments">
              ${Array.from({ length: 12 }, (_, index) => index + 1)
                .map((installments) => `<option value="${installments}">${installments === 1 ? "A vista" : `${installments}x`}</option>`)
                .join("")}
            </select>
          </label>
          <label class="field full">
            <span>Senha de administrador</span>
            <input name="adminPassword" type="password" autocomplete="off" required />
            <small data-manual-charge-terminal-help>${
              selectedStoneManual
                ? "Na Stone, cobre o valor informado e confirme no app somente depois da aprovacao."
                : "A cobranca so sera enviada depois da autorizacao."
            }
            </small>
          </label>
        </div>
        <div class="summary-list compact manual-charge-summary">
          <div class="summary-row total"><span>Valor a cobrar</span><strong data-manual-charge-total>${money(0)}</strong></div>
        </div>
        ${
          hasNetworkConnection()
            ? ""
            : '<div class="offline-sale-alert"><strong>Internet necessaria</strong><span>A cobranca avulsa integrada nao pode ser enviada enquanto o app estiver offline.</span></div>'
        }
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" data-manual-charge-submit type="submit" ${hasActiveTerminal && hasNetworkConnection() ? "" : "disabled"}>${
          selectedStoneManual ? "Confirmar pagamento na Stone" : "Enviar para maquininha"
        }</button>
      </div>
    </form>
  `;
}

function renderExternalPaymentModal() {
  const terminals = paymentTerminalOptions();
  const selectedTerminal = getSelectedPaymentTerminal();
  const productOptions = state.products
    .filter((product) => product.active !== false)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    .map(
      (product) =>
        `<option value="${escapeHtml(productSearchOptionValue(product))}">${escapeHtml(product.category)} - ${money(product.price)} - estoque ${escapeHtml(productStockText(product))}</option>`,
    )
    .join("");
  const terminalOptions = [
    `<option value="">Nao informada</option>`,
    ...terminals.map(
      (terminal) =>
        `<option value="${escapeHtml(terminal.label)}" ${terminal.id === selectedTerminal?.id ? "selected" : ""}>${escapeHtml(
          ticketTerminalLabel(terminal) || terminal.label,
        )}</option>`,
    ),
  ].join("");

  return `
    <form id="external-payment-form">
      <div class="modal-head">
        <h2>Pagamento externo</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="notice compact">Use para pagamento feito direto na maquininha. Se informar produtos, o estoque sera baixado.</div>
        <div class="form-grid">
          <label class="field">
            <span>Forma</span>
            <select name="payment">
              <option>Pix</option>
              <option>Debito</option>
              <option>Credito</option>
              <option>Dinheiro</option>
            </select>
          </label>
          <label class="field">
            <span>Valor pago</span>
            <input name="amount" data-external-amount type="number" min="0.01" step="0.01" placeholder="Calculado pelos produtos" />
          </label>
          <label class="field">
            <span>Maquininha</span>
            <select name="terminalLabel">${terminalOptions}</select>
          </label>
          <label class="field">
            <span>Data da venda</span>
            <input name="date" type="datetime-local" />
          </label>
          <label class="field full">
            <span>Observacao</span>
            <input name="note" placeholder="Ex.: venda feita direto na Point" />
          </label>
        </div>
        <h3 class="compact-title">Produtos vendidos</h3>
        <datalist id="external-product-options">${productOptions}</datalist>
        <div class="external-products-total">
          <span>Total dos produtos</span>
          <strong data-external-products-total>${money(0)}</strong>
        </div>
        <div class="external-products-grid">
          ${Array.from({ length: 8 }, (_, index) => {
            const number = index + 1;
            return `
              <label class="field">
                <span>Produto ${number}</span>
                <input name="externalProductSearch-${number}" data-external-product-search list="external-product-options" placeholder="Digite nome ou codigo" autocomplete="off" />
              </label>
              <label class="field">
                <span>Qtd.</span>
                <input name="externalQty-${number}" data-external-product-qty type="number" min="0" step="0.001" />
              </label>
            `;
          }).join("")}
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Registrar</button>
      </div>
    </form>
  `;
}

async function saveNewTables(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  const created = await createTables(new FormData(form).get("count"));
  if (!created && document.body.contains(submitButton)) submitButton.disabled = false;
}

function bindModalForms() {
  document.querySelector("#add-tables-form")?.addEventListener("submit", saveNewTables);
  document.querySelector("#table-split-form")?.addEventListener("submit", saveTableSplitPlan);
  document.querySelector("#product-form")?.addEventListener("submit", saveProduct);
  document.querySelector("#stock-form")?.addEventListener("submit", saveStockAdjustment);
  document.querySelector("#ingredient-form")?.addEventListener("submit", saveIngredient);
  document.querySelector("#inventory-form")?.addEventListener("submit", saveInventoryCount);
  document.querySelector("#supplier-form")?.addEventListener("submit", saveSupplier);
  document.querySelector("#purchase-form")?.addEventListener("submit", savePurchase);
  document.querySelector("#expense-form")?.addEventListener("submit", saveExpense);
  document.querySelector("#expense-charge-form")?.addEventListener("submit", saveExpenseCharge);
  document.querySelector("#expense-payment-form")?.addEventListener("submit", saveExpensePayment);
  document.querySelector("#client-form")?.addEventListener("submit", saveClient);
  document.querySelector("#client-payment-form")?.addEventListener("submit", saveClientPayment);
  document.querySelector("#client-transaction-removal-form")?.addEventListener("submit", removeClientTransaction);
  document.querySelector("#cancel-sale-form")?.addEventListener("submit", saveCancelSale);
  document.querySelector("#lot-form")?.addEventListener("submit", saveLot);
  document.querySelector("#user-form")?.addEventListener("submit", saveUser);
  document.querySelector("#movement-form")?.addEventListener("submit", saveMovement);
  document.querySelector("#manual-charge-form")?.addEventListener("submit", saveManualCharge);
  document.querySelector("#external-payment-form")?.addEventListener("submit", saveExternalPayment);
  document.querySelector("#order-form")?.addEventListener("submit", saveOrder);
  document.querySelector("#sale-payment-form")?.addEventListener("submit", confirmSalePayment);
  const tableCountInput = document.querySelector("[data-table-count]");
  tableCountInput?.addEventListener("input", () => {
    const preview = document.querySelector("[data-table-preview]");
    if (preview) preview.textContent = tableCreationPreview(tableCountInput.value);
  });
  bindSalePaymentChoice();
  bindTableSplitBuilder();
  bindManualChargeControls();
  bindExternalPaymentTotal();
  bindUserPermissionControls();
  bindProductImagePreview();
  bindProductImageSearch();
}

function bindTableSplitBuilder() {
  const form = document.querySelector("#table-split-form");
  if (!form) return;
  const countInput = form.querySelector("[data-split-people-count]");
  const customPanel = form.querySelector("[data-split-custom-panel]");
  const itemsPanel = form.querySelector("[data-split-items-panel]");
  const customSum = form.querySelector("[data-split-custom-sum]");
  const preview = form.querySelector("[data-table-split-preview]");
  const total = Number(form.querySelector("[data-table-split-total]")?.dataset.value || 0);

  const count = () => Math.min(MAX_TABLE_SPLIT_PEOPLE, Math.max(2, Number(countInput?.value || 2)));
  const mode = () => form.querySelector('input[name="splitMode"]:checked')?.value || "equal";

  const updateItemBalances = () => {
    form.querySelectorAll("[data-split-item-row]").forEach((row) => {
      const expected = Number(row.dataset.itemQty || 0);
      const assigned = [...row.querySelectorAll("[data-split-item-allocation]")]
        .slice(0, count())
        .reduce((sum, input) => sum + Number(input.value || 0), 0);
      const remaining = Number((expected - assigned).toFixed(3));
      const output = row.querySelector("[data-split-item-balance]");
      if (!output) return;
      output.textContent = Math.abs(remaining) < 0.0009
        ? "Quantidade totalmente distribuida"
        : remaining > 0
          ? `Falta distribuir: ${qty(remaining)}`
          : `Excesso: ${qty(Math.abs(remaining))}`;
      output.classList.toggle("ok", Math.abs(remaining) < 0.0009);
      output.classList.toggle("error", remaining < -0.0009);
    });
  };

  const update = () => {
    const activeCount = count();
    form.querySelectorAll("[data-split-person-field]").forEach((field) => {
      field.hidden = Number(field.dataset.splitPersonField) >= activeCount;
    });
    form.querySelectorAll("[data-split-custom-field]").forEach((field) => {
      field.hidden = Number(field.dataset.splitCustomField) >= activeCount;
    });
    form.querySelectorAll("[data-split-item-person]").forEach((field) => {
      field.hidden = Number(field.dataset.splitItemPerson) >= activeCount;
    });

    const activeMode = mode();
    customPanel.hidden = activeMode !== "custom";
    itemsPanel.hidden = activeMode !== "items";
    const informed = [...form.querySelectorAll("[data-split-custom-amount]")]
      .slice(0, activeCount)
      .reduce((sum, input) => sum + Number(input.value || 0), 0);
    if (customSum) customSum.textContent = `${money(informed)} de ${money(total)}`;
    if (preview) {
      if (activeMode === "equal") {
        const parts = splitWeightedValue(total, Array.from({ length: activeCount }, () => 1), 2);
        preview.textContent = `Partes iguais: ${parts.map((value, index) => `P${index + 1} ${money(value)}`).join(" | ")}.`;
      } else if (activeMode === "custom") {
        preview.textContent = Math.abs(informed - total) < 0.009
          ? "Os valores fecham o total da conta."
          : `Ainda falta distribuir ${money(total - informed)}.`;
      } else {
        preview.textContent = "Cada produto deve ser totalmente distribuido entre as pessoas.";
      }
    }
    updateItemBalances();
  };

  form.querySelectorAll('input[name="splitMode"]').forEach((input) => input.addEventListener("change", update));
  countInput?.addEventListener("change", update);
  form.querySelectorAll("[data-split-custom-amount], [data-split-item-allocation]").forEach((input) => input.addEventListener("input", update));
  form.querySelector("[data-auto-split-items]")?.addEventListener("click", () => {
    const activeCount = count();
    form.querySelectorAll("[data-split-item-row]").forEach((row) => {
      const quantity = Number(row.dataset.itemQty || 0);
      const precision = Number.isInteger(quantity) ? 0 : 3;
      const allocations = splitWeightedValue(quantity, Array.from({ length: activeCount }, () => 1), precision);
      [...row.querySelectorAll("[data-split-item-allocation]")].forEach((input, index) => {
        input.value = index < activeCount ? allocations[index] : 0;
      });
    });
    update();
  });
  update();
}

function bindManualChargeControls() {
  const form = document.querySelector("#manual-charge-form");
  if (!form) return;

  const amountInput = form.querySelector("[data-manual-charge-amount]");
  const totalOutput = form.querySelector("[data-manual-charge-total]");
  const installmentsPanel = form.querySelector("[data-manual-charge-installments]");
  const terminalSelect = form.querySelector("[data-payment-terminal]");
  const terminalHelp = form.querySelector("[data-manual-charge-terminal-help]");
  const submitButton = form.querySelector("[data-manual-charge-submit]");
  const update = () => {
    const payment = form.querySelector('input[name="payment"]:checked')?.value || "";
    const terminal = paymentTerminalOptions().find((entry) => entry.id === terminalSelect?.value);
    const stoneManual = terminal?.provider === "stone" && terminal.integrationMode === "manual";
    if (installmentsPanel) installmentsPanel.hidden = payment !== "Credito";
    if (totalOutput) totalOutput.textContent = money(Math.max(0, Number(amountInput?.value || 0)));
    if (terminalHelp) {
      terminalHelp.textContent = stoneManual
        ? "Na Stone, cobre o valor informado e confirme no app somente depois da aprovacao."
        : "A cobranca so sera enviada depois da autorizacao.";
    }
    if (submitButton) submitButton.textContent = stoneManual ? "Confirmar pagamento na Stone" : "Enviar para maquininha";
  };

  amountInput?.addEventListener("input", update);
  terminalSelect?.addEventListener("change", update);
  form.querySelectorAll('input[name="payment"]').forEach((input) => input.addEventListener("change", update));
  update();
}

function bindProductImagePreview() {
  const input = document.querySelector("[data-product-image-input]");
  const preview = document.querySelector(".product-image-preview");
  if (!input || !preview) return;
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      input.value = "";
      notify("Escolha um arquivo de imagem.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      input.value = "";
      notify("A foto deve ter no maximo 8 MB.");
      return;
    }
    const internetImageInput = document.querySelector("[data-product-internet-image-url]");
    if (internetImageInput) internetImageInput.value = "";
    const removeImage = document.querySelector('#product-form input[name="removeImage"]');
    if (removeImage) removeImage.checked = false;
    const objectUrl = URL.createObjectURL(file);
    if (preview.tagName === "IMG") {
      preview.src = objectUrl;
    } else {
      const image = document.createElement("img");
      image.className = preview.className.replace("product-photo-empty", "").trim();
      image.alt = "Pre-visualizacao da foto do produto";
      image.src = objectUrl;
      preview.replaceWith(image);
    }
  });
}

function setProductImagePreview(url, alt = "Pre-visualizacao da foto do produto") {
  const preview = document.querySelector(".product-image-preview");
  if (!preview) return;
  if (preview.tagName === "IMG") {
    preview.src = url;
    preview.alt = alt;
    return;
  }
  const image = document.createElement("img");
  image.className = preview.className.replace("product-photo-empty", "").trim();
  image.alt = alt;
  image.src = url;
  preview.replaceWith(image);
}

function bindProductImageSearch() {
  const panel = document.querySelector("[data-product-image-search-panel]");
  const toggle = document.querySelector("[data-toggle-product-image-search]");
  const searchInput = document.querySelector("[data-product-image-search-input]");
  const searchButton = document.querySelector("[data-search-product-images]");
  const results = document.querySelector("[data-product-image-results]");
  const status = document.querySelector("[data-product-image-search-status]");
  const selectedUrl = document.querySelector("[data-product-internet-image-url]");
  if (!panel || !toggle || !searchInput || !searchButton || !results || !status || !selectedUrl) return;

  const selectImage = (button) => {
    let imageUrl = "";
    try {
      imageUrl = decodeURIComponent(button.dataset.imageUrl || "");
    } catch {
      imageUrl = "";
    }
    if (!productImageUrl({ imageUrl })) {
      notify("A imagem escolhida nao possui um endereco valido.");
      return;
    }
    selectedUrl.value = imageUrl;
    const fileInput = document.querySelector("[data-product-image-input]");
    if (fileInput) fileInput.value = "";
    const removeImage = document.querySelector('#product-form input[name="removeImage"]');
    if (removeImage) removeImage.checked = false;
    setProductImagePreview(imageUrl, button.dataset.imageTitle || "Foto encontrada na internet");
    results.querySelectorAll("[data-select-product-image]").forEach((entry) => entry.classList.toggle("selected", entry === button));

    const credit = document.querySelector("[data-product-image-credit]");
    if (credit) {
      const sourceUrl = button.dataset.sourceUrl || "https://commons.wikimedia.org/";
      credit.hidden = false;
      credit.innerHTML = `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">Fonte: ${escapeHtml(button.dataset.credit || "Wikimedia Commons")} - ${escapeHtml(button.dataset.license || "Ver licenca")}</a>`;
    }
    status.textContent = "Imagem selecionada. Agora salve o produto.";
  };

  const search = async () => {
    const query = searchInput.value.trim();
    if (query.length < 2) {
      notify("Digite pelo menos 2 caracteres para pesquisar a foto.");
      searchInput.focus();
      return;
    }
    searchButton.disabled = true;
    results.innerHTML = "";
    status.textContent = "Pesquisando imagens...";
    try {
      const response = await fetch(`/api/images/search?q=${encodeURIComponent(query)}`, {
        headers: { Accept: "application/json" },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Nao foi possivel pesquisar imagens.");
      const images = Array.isArray(data.results) ? data.results : [];
      if (!images.length) {
        status.textContent = "Nenhuma imagem encontrada. Tente o nome da marca, volume ou outro termo.";
        return;
      }
      status.textContent = `${images.length} imagem(ns) encontrada(s). Clique na que deseja usar.`;
      results.innerHTML = images
        .map(
          (image) => `
            <article class="internet-image-result">
              <button
                type="button"
                data-select-product-image
                data-image-url="${escapeHtml(encodeURIComponent(image.selectionUrl || image.thumbnailUrl || ""))}"
                data-image-title="${escapeHtml(image.title || "Imagem do produto")}"
                data-source-url="${escapeHtml(image.sourceUrl || "https://commons.wikimedia.org/")}"
                data-credit="${escapeHtml(image.credit || "Wikimedia Commons")}"
                data-license="${escapeHtml(image.license || "Ver licenca")}"
                title="Usar esta imagem"
              >
                <img src="${escapeHtml(image.thumbnailUrl || "")}" alt="${escapeHtml(image.title || "Resultado da pesquisa")}" loading="lazy" />
                <span><strong>${escapeHtml(image.title || "Imagem")}</strong><small>${escapeHtml(image.license || "Ver licenca")}</small></span>
              </button>
              <a href="${escapeHtml(image.sourceUrl || "https://commons.wikimedia.org/")}" target="_blank" rel="noopener noreferrer">Ver fonte</a>
            </article>
          `,
        )
        .join("");
      results.querySelectorAll("[data-select-product-image]").forEach((button) => {
        button.addEventListener("click", () => selectImage(button));
      });
    } catch (error) {
      status.textContent = error.message || "Nao foi possivel pesquisar imagens agora.";
    } finally {
      searchButton.disabled = false;
    }
  };

  toggle.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    toggle.classList.toggle("active", !panel.hidden);
    if (!panel.hidden) {
      searchInput.focus();
      if (!results.children.length && searchInput.value.trim().length >= 2) search();
    }
  });
  searchButton.addEventListener("click", search);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    search();
  });
}

async function saveProduct(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const imageFile = form.get("imageFile");
  const removeImage = form.get("removeImage") === "on";
  const internetImageUrl = productImageUrl({ imageUrl: form.get("internetImageUrl") });
  const currentProduct = state.products.find((product) => product.id === currentModal.id);
  const payload = {
    name: form.get("name").trim(),
    productCode: form.get("productCode").trim(),
    barcodeCodes: normalizeBarcodeCodes(
      form.get("productCode"),
      Array.from({ length: 5 }, (_, index) => form.get(`barcodeCode${index + 1}`)),
    ),
    category: form.get("category").trim(),
    price: Number(form.get("price")),
    cost: Number(form.get("cost")),
    stock: Number(form.get("stock")),
    minStock: Number(form.get("minStock")),
    criticalStock: Number(form.get("criticalStock")),
    expiresAt: form.get("expiresAt") || "",
    station: form.get("station"),
    recipe: parseRecipeText(form.get("recipeText")),
    favorite: form.get("favorite") === "true",
    active: form.get("active") === "true",
    imageUrl: removeImage ? "" : internetImageUrl || currentProduct?.imageUrl || "",
  };

  if (isOnlineSession()) {
    await saveProductOnline(payload, imageFile?.size ? imageFile : null, removeImage, internetImageUrl);
    return;
  }

  if (imageFile?.size) {
    try {
      payload.imageUrl = await resizeProductImage(imageFile, "data-url");
    } catch (error) {
      notify(`Nao foi possivel preparar a foto: ${error.message}`);
      return;
    }
  }

  const savedAt = new Date().toISOString();
  const productId = currentProduct?.id || id("product");
  const previousStock = Number(currentProduct?.stock || 0);
  if (currentProduct) {
    state.products = state.products.map((product) =>
      product.id === currentModal.id ? { ...product, ...payload } : product,
    );
  } else {
    state.products.push({ id: productId, createdAt: savedAt, ...payload });
  }

  if (payload.stock !== previousStock) {
    state.inventoryCounts.unshift({
      id: id("inventory"),
      date: savedAt,
      itemType: "product",
      itemId: productId,
      expected: previousStock,
      counted: payload.stock,
      difference: payload.stock - previousStock,
      userId: session.id,
      notes: currentProduct ? "Ajuste pela edicao do produto" : "Estoque inicial do produto",
    });
  }

  currentModal = null;
  logAudit("Produto salvo", payload.name);
  saveState();
  notify("Produto salvo.");
  renderApp();
}

async function resizeProductImage(file, output = "blob") {
  if (!file?.type?.startsWith("image/")) throw new Error("arquivo invalido");
  if (file.size > 8 * 1024 * 1024) throw new Error("a foto deve ter no maximo 8 MB");

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("imagem nao reconhecida"));
      element.src = objectUrl;
    });
    const maxSide = 1200;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    if (output === "data-url") return canvas.toDataURL("image/jpeg", 0.84);
    return await new Promise((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("falha ao reduzir imagem"))), "image/jpeg", 0.84),
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function productImageStoragePath(url) {
  const marker = "/storage/v1/object/public/product-images/";
  const index = String(url || "").indexOf(marker);
  return index >= 0 ? decodeURIComponent(String(url).slice(index + marker.length)) : "";
}

async function uploadProductImage(productId, file) {
  const blob = await resizeProductImage(file);
  const suffix = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const path = `${productId}/${suffix}.jpg`;
  const upload = await supabaseClient.storage.from("product-images").upload(path, blob, {
    contentType: "image/jpeg",
    cacheControl: "31536000",
    upsert: false,
  });
  if (upload.error) throw upload.error;
  const publicUrl = supabaseClient.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  return { path, publicUrl };
}

async function deleteStoredProductImage(url) {
  const path = productImageStoragePath(url);
  if (!path) return;
  await supabaseClient.storage.from("product-images").remove([path]);
}

async function saveProductOnline(payload, imageFile = null, removeImage = false, internetImageUrl = "", options = {}) {
  const previousProduct = state.products.find((product) => product.id === currentModal.id);
  const previousImageUrl = previousProduct?.imageUrl || "";
  const dbPayload = {
    name: payload.name,
    product_code: payload.productCode || null,
    barcode_codes: payload.barcodeCodes,
    category: payload.category,
    station: payload.station,
    price: payload.price,
    cost: payload.cost,
    stock: payload.stock,
    min_stock: payload.minStock,
    critical_stock: payload.criticalStock,
    expires_at: payload.expiresAt || null,
    favorite: payload.favorite,
    active: payload.active,
  };

  let result = currentModal.id
    ? await supabaseClient.from("products").update(dbPayload).eq("id", currentModal.id).select("*").single()
    : await supabaseClient.from("products").insert(dbPayload).select("*").single();

  const fallbackPayload = { ...dbPayload };
  const removedOptionalColumns = [];
  for (const column of ["product_code", "barcode_codes", "expires_at"]) {
    if (!result.error || !String(result.error.message || "").includes(column)) continue;
    delete fallbackPayload[column];
    removedOptionalColumns.push(column);
    result = currentModal.id
      ? await supabaseClient.from("products").update(fallbackPayload).eq("id", currentModal.id).select("*").single()
      : await supabaseClient.from("products").insert(fallbackPayload).select("*").single();
  }

  if (!result.error && removedOptionalColumns.length) {
    const labels = removedOptionalColumns.map((column) => {
      if (column === "product_code") return "codigo";
      if (column === "barcode_codes") return "codigos de barras";
      return "validade";
    });
    notify(`Produto salvo. Para gravar ${labels.join(" e ")} online, rode a migracao no Supabase.`);
  }

  if (result.error) {
    notify(`Erro ao salvar produto online: ${result.error.message}`);
    return;
  }

  const productId = result.data.id;
  if (imageFile) {
    try {
      const uploaded = await uploadProductImage(productId, imageFile);
      const imageUpdate = await supabaseClient.from("products").update({ image_url: uploaded.publicUrl }).eq("id", productId);
      if (imageUpdate.error) {
        await supabaseClient.storage.from("product-images").remove([uploaded.path]);
        throw imageUpdate.error;
      }
      await deleteStoredProductImage(previousImageUrl);
    } catch (error) {
      notify(`Produto salvo, mas a foto falhou: ${error.message}. Execute a migracao de imagens no Supabase.`);
    }
  } else if (internetImageUrl) {
    const imageUpdate = await supabaseClient.from("products").update({ image_url: internetImageUrl }).eq("id", productId);
    if (imageUpdate.error) {
      notify(`Produto salvo, mas nao foi possivel usar a imagem da internet: ${imageUpdate.error.message}`);
    } else if (previousImageUrl !== internetImageUrl) {
      await deleteStoredProductImage(previousImageUrl);
    }
  } else if (removeImage && previousImageUrl) {
    const imageUpdate = await supabaseClient.from("products").update({ image_url: null }).eq("id", productId);
    if (imageUpdate.error) {
      notify(`Produto salvo, mas nao foi possivel remover a foto: ${imageUpdate.error.message}`);
    } else {
      await deleteStoredProductImage(previousImageUrl);
    }
  }
  const deleteRecipe = await supabaseClient.from("product_recipes").delete().eq("product_id", productId);
  if (deleteRecipe.error) {
    notify(`Produto salvo, mas falhou ao limpar ficha tecnica: ${deleteRecipe.error.message}`);
    return;
  }

  if (payload.recipe.length) {
    const rows = payload.recipe.map((recipe) => ({
      product_id: productId,
      ingredient_id: recipe.ingredientId,
      qty: recipe.qty,
    }));
    const insertRecipe = await supabaseClient.from("product_recipes").insert(rows);
    if (insertRecipe.error) {
      notify(`Produto salvo, mas falhou na ficha tecnica: ${insertRecipe.error.message}`);
      return;
    }
  }

  const previousStock = Number(previousProduct?.stock || 0);
  const automaticStockAdjustment = payload.stock !== previousStock
    ? {
        previousStock,
        nextStock: payload.stock,
        notes: previousProduct ? "Ajuste pela edicao do produto" : "Estoque inicial do produto",
      }
    : null;
  const stockAdjustment = options.stockAdjustment ?? automaticStockAdjustment;
  if (stockAdjustment) {
    const adjustment = stockAdjustment;
    const insertAdjustment = await supabaseClient.from("inventory_counts").insert({
      user_id: session.id,
      item_type: "product",
      item_id: productId,
      expected: adjustment.previousStock,
      counted: adjustment.nextStock,
      difference: adjustment.nextStock - adjustment.previousStock,
      notes: adjustment.notes || `Ajuste pelo simulador: ${adjustment.reason}`,
    });
    if (insertAdjustment.error) {
      notify(`Produto atualizado, mas falhou ao registrar a movimentacao: ${insertAdjustment.error.message}`);
    }
  }

  currentModal = null;
  await loadOnlineStockData();
  logAudit(options.auditAction || "Produto salvo online", payload.name);
  notify(options.successMessage || "Produto salvo no Supabase.");
  renderApp();
  return result.data;
}

function activeProductSalesQuantitySince(productId, since) {
  const sinceTime = new Date(since || 0).getTime();
  return state.sales
    .filter((sale) => sale?.status !== "Cancelada" && new Date(sale.date || 0).getTime() >= sinceTime)
    .flatMap((sale) => sale.items || [])
    .filter((item) => item.productId === productId)
    .reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function recentStockHistoryRecoveryPlan() {
  return state.products
    .filter((product) => product.active !== false && !product.recipe?.length)
    .map((product) => {
      const currentStock = Number(product.stock || 0);
      const counts = state.inventoryCounts
        .filter((count) => count.itemType === "product" && count.itemId === product.id)
        .slice()
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      const latest = counts[0];
      if (latest) {
        const salesAfterCount = activeProductSalesQuantitySince(product.id, latest.date);
        const expectedCurrentStock = Number(latest.counted || 0) - salesAfterCount;
        const difference = Number((currentStock - expectedCurrentStock).toFixed(3));
        if (Math.abs(difference) < 0.001) return null;
        return {
          product,
          date: new Date().toISOString(),
          expected: Number(expectedCurrentStock.toFixed(3)),
          counted: currentStock,
          difference,
          notes: `Recuperacao automatica do historico: ajuste liquido desde ${formatDateBr(String(latest.date || "").slice(0, 10))}`,
        };
      }

      const createdAt = product.createdAt || new Date().toISOString();
      const soldSinceCreation = activeProductSalesQuantitySince(product.id, createdAt);
      const recoveredOpeningStock = Number((currentStock + soldSinceCreation).toFixed(3));
      if (Math.abs(recoveredOpeningStock) < 0.001) return null;
      return {
        product,
        date: createdAt,
        expected: 0,
        counted: recoveredOpeningStock,
        difference: recoveredOpeningStock,
        notes: "Recuperacao automatica do historico: estoque inicial e entradas liquidas reconstruidos pelo saldo atual e pelas vendas registradas",
      };
    })
    .filter(Boolean);
}

async function recoverRecentStockHistory() {
  if (session?.role !== "admin") {
    notify("A recuperacao do historico exige acesso de administrador.");
    return;
  }
  const plan = recentStockHistoryRecoveryPlan();
  if (!plan.length) {
    notify("O historico recente ja esta coerente com os saldos e as vendas registradas.");
    return;
  }
  if (!confirm(`Recuperar o historico de ${plan.length} produto(s)? Os registros reconstruidos ficarao identificados e nao alterarao os saldos atuais.`)) return;

  if (isOnlineSession()) {
    const rows = plan.map((entry) => ({
      user_id: session.id,
      item_type: "product",
      item_id: entry.product.id,
      expected: entry.expected,
      counted: entry.counted,
      difference: entry.difference,
      notes: entry.notes,
      created_at: entry.date,
    }));
    const { error } = await supabaseClient.from("inventory_counts").insert(rows);
    if (error) {
      notify(`Erro ao recuperar historico online: ${error.message}`);
      return;
    }
    await loadOnlineStockData();
    logAudit("Historico de estoque recuperado online", `${plan.length} produto(s) reconstruido(s) a partir dos saldos e vendas existentes.`);
  } else {
    const recovered = plan.map((entry) => ({
      id: id("inventory"),
      date: entry.date,
      itemType: "product",
      itemId: entry.product.id,
      expected: entry.expected,
      counted: entry.counted,
      difference: entry.difference,
      userId: session.id,
      notes: entry.notes,
    }));
    state.inventoryCounts = [...recovered, ...state.inventoryCounts];
    logAudit("Historico de estoque recuperado", `${plan.length} produto(s) reconstruido(s) a partir dos saldos e vendas existentes.`);
    saveState();
  }
  notify(`Historico recente recuperado para ${plan.length} produto(s). Os saldos atuais foram preservados.`);
  renderApp();
}

async function removeProduct(productId) {
  const product = state.products.find((entry) => entry.id === productId);
  if (!product) return;
  if (!confirm(`Remover ${product.name} do cadastro e do menu de venda?`)) return;

  if (isOnlineSession()) {
    await supabaseClient.from("product_lots").delete().eq("item_type", "product").eq("item_id", productId);
    await supabaseClient.from("inventory_counts").delete().eq("item_type", "product").eq("item_id", productId);
    await supabaseClient.from("product_recipes").delete().eq("product_id", productId);
    const { error } = await supabaseClient.from("products").delete().eq("id", productId);
    if (error) {
      if (isProductLinkedToSalesError(error)) {
        const archiveResult = await supabaseClient
          .from("products")
          .update({ active: false, favorite: false, stock: 0 })
          .eq("id", productId);
        if (archiveResult.error) {
          notify(`Erro ao desativar produto online: ${archiveResult.error.message}`);
          return;
        }
        cart = cart.filter((item) => item.productId !== productId);
        await loadOnlineStockData();
        logAudit("Produto desativado online", `${product.name} ja tinha historico de vendas.`);
        notify("Produto tinha vendas vinculadas, entao foi desativado e removido do menu/estoque.");
        renderApp();
        return;
      }
      notify(`Erro ao remover produto online: ${error.message}`);
      return;
    }
    await deleteStoredProductImage(product.imageUrl);
    cart = cart.filter((item) => item.productId !== productId);
    await loadOnlineStockData();
    logAudit("Produto removido online", product.name);
    notify("Produto removido do Supabase.");
    renderApp();
    return;
  }

  state.products = state.products.filter((entry) => entry.id !== productId);
  state.stockLots = state.stockLots.filter((lot) => !(lot.itemType === "product" && lot.itemId === productId));
  state.inventoryCounts = state.inventoryCounts.filter((count) => !(count.itemType === "product" && count.itemId === productId));
  cart = cart.filter((item) => item.productId !== productId);
  logAudit("Produto removido", product.name);
  saveState();
  notify("Produto removido do cadastro.");
  renderApp();
}

function isProductLinkedToSalesError(error) {
  const message = `${error?.code || ""} ${error?.message || ""} ${error?.details || ""}`.toLowerCase();
  return message.includes("23503") || message.includes("sale_items") || message.includes("foreign key");
}

async function saveOrder(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const items = form
    .get("itemsText")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\d+(?:[.,]\d+)?)x?\s+(.+)$/i);
      return match
        ? { qty: Number(match[1].replace(",", ".")), name: match[2].trim() }
        : { qty: 1, name: line };
    });

  if (isOnlineSession()) {
    const { error } = await supabaseClient
      .from("kitchen_orders")
      .update({ status: form.get("status"), items })
      .eq("id", currentModal.id);
    if (error) {
      notify(`Erro ao editar pedido online: ${error.message}`);
      return;
    }
    currentModal = null;
    await loadOnlineSalesData();
    logAudit("Pedido editado online", "Itens/status da cozinha atualizados.");
    notify("Pedido atualizado no Supabase.");
    renderApp();
    return;
  }

  const pendingOrder = state.kitchenOrders.find((order) => order.id === currentModal.id);
  if (session?.online && pendingOrder?.syncStatus !== "pending") {
    notify("Este pedido ja esta online. Aguarde a internet voltar para edita-lo.");
    return;
  }
  state.kitchenOrders = state.kitchenOrders.map((order) =>
    order.id === currentModal.id && order.status !== "Entregue"
      ? { ...order, status: form.get("status"), items }
      : order,
  );
  mutatePendingKitchenOrder(currentModal.id, (order) => ({ ...order, status: form.get("status"), items }));
  currentModal = null;
  logAudit("Pedido editado", "Itens/status da cozinha atualizados.");
  saveState();
  notify("Pedido atualizado.");
  renderApp();
}

async function saveStockAdjustment(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const mode = form.get("mode");
  const adjustmentQty = Number(form.get("qty"));
  const product = state.products.find((entry) => entry.id === currentModal.id);
  if (!product) return;
  if (!Number.isFinite(adjustmentQty) || adjustmentQty < 0 || (mode !== "set" && adjustmentQty <= 0)) {
    notify("Informe uma quantidade maior que zero para ajustar o estoque.");
    return;
  }
  const previousStock = Number(product.stock || 0);
  const nextStock =
    mode === "add"
      ? previousStock + adjustmentQty
      : mode === "remove"
        ? Math.max(0, previousStock - adjustmentQty)
        : adjustmentQty;
  const difference = nextStock - previousStock;
  const reason = String(form.get("reason") || "Reposicao manual").trim() || "Reposicao manual";
  const movementLabel = difference > 0 ? "Entrada manual" : difference < 0 ? "Retirada manual" : "Ajuste manual";

  if (session?.online) {
    if (!isSupabaseReady() || navigator.onLine === false) {
      notify("Sem conexao com o Supabase. O ajuste online nao foi realizado para evitar perda do historico.");
      return;
    }

    const updateResult = await supabaseClient
      .from("products")
      .update({ stock: nextStock })
      .eq("id", product.id)
      .eq("stock", previousStock)
      .select("id, stock")
      .maybeSingle();
    if (updateResult.error) {
      notify(`Erro ao ajustar estoque online: ${updateResult.error.message}`);
      return;
    }
    if (!updateResult.data) {
      await loadOnlineStockData();
      notify("O saldo deste produto mudou em outro computador. Confira o novo saldo e tente novamente.");
      renderApp();
      return;
    }

    const adjustmentDate = new Date().toISOString();
    const insertAdjustment = await supabaseClient
      .from("inventory_counts")
      .insert({
        user_id: session.id,
        item_type: "product",
        item_id: product.id,
        expected: previousStock,
        counted: nextStock,
        difference,
        notes: `Ajuste manual: ${reason}`,
        created_at: adjustmentDate,
      })
      .select("*")
      .single();
    if (insertAdjustment.error) {
      const rollback = await supabaseClient
        .from("products")
        .update({ stock: previousStock })
        .eq("id", product.id)
        .eq("stock", nextStock);
      if (rollback.error) {
        notify(`Falha ao registrar o historico e ao restaurar o saldo: ${insertAdjustment.error.message}`);
      } else {
        notify(`O ajuste foi cancelado porque o historico nao pode ser registrado: ${insertAdjustment.error.message}`);
      }
      await loadOnlineStockData();
      renderApp();
      return;
    }

    state.products = state.products.map((entry) => (entry.id === product.id ? { ...entry, stock: nextStock } : entry));
    state.inventoryCounts = [
      mapInventoryFromDb(insertAdjustment.data),
      ...state.inventoryCounts.filter((entry) => entry.id !== insertAdjustment.data.id),
    ];
    saveState();
    currentModal = null;
    await loadOnlineStockData();
    logAudit("Estoque ajustado online", `${product.name}: ${movementLabel} de ${qty(Math.abs(difference))}. Saldo ${previousStock} para ${nextStock}. Motivo: ${reason}.`);
    notify(`${movementLabel} registrada. Novo saldo: ${qty(nextStock)}.`);
    renderApp();
    return;
  }

  state.products = state.products.map((product) => {
    if (product.id !== currentModal.id) return product;
    return { ...product, stock: nextStock };
  });

  state.inventoryCounts.unshift({
    id: id("inventory"),
    date: new Date().toISOString(),
    itemType: "product",
    itemId: product.id,
    expected: previousStock,
    counted: nextStock,
    difference,
    userId: session.id,
    notes: `Ajuste manual: ${reason}`,
  });

  currentModal = null;
  logAudit("Estoque ajustado", `${product.name}: ${movementLabel} de ${qty(Math.abs(difference))}. Saldo ${previousStock} para ${nextStock}. Motivo: ${reason}.`);
  saveState();
  notify(`${movementLabel} registrada. Novo saldo: ${qty(nextStock)}.`);
  renderApp();
}

async function saveIngredient(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const ingredient = {
    id: id("ingredient"),
    name: form.get("name").trim(),
    unit: form.get("unit").trim(),
    stock: Number(form.get("stock")),
    minStock: Number(form.get("minStock")),
    costPerUnit: Number(form.get("costPerUnit")),
  };

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("ingredients").insert({
      name: ingredient.name,
      unit: ingredient.unit,
      stock: ingredient.stock,
      min_stock: ingredient.minStock,
      cost_per_unit: ingredient.costPerUnit,
    });
    if (error) {
      notify(`Erro ao salvar insumo online: ${error.message}`);
      return;
    }
    currentModal = null;
    await loadOnlineStockData();
    logAudit("Insumo criado online", ingredient.name);
    notify("Insumo salvo no Supabase.");
    renderApp();
    return;
  }

  state.ingredients.push(ingredient);
  currentModal = null;
  logAudit("Insumo criado", ingredient.name);
  saveState();
  notify("Insumo salvo.");
  renderApp();
}

async function saveInventoryCount(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const [itemType, itemId] = form.get("itemKey").split(":");
  const item = itemType === "product" ? state.products.find((entry) => entry.id === itemId) : state.ingredients.find((entry) => entry.id === itemId);
  const expected = Number(item?.stock || 0);
  const counted = Number(form.get("counted"));
  const difference = counted - expected;

  if (isOnlineSession()) {
    const table = itemType === "product" ? "products" : "ingredients";
    const updateStock = await supabaseClient.from(table).update({ stock: counted }).eq("id", itemId);
    if (updateStock.error) {
      notify(`Erro ao atualizar saldo online: ${updateStock.error.message}`);
      return;
    }
    const insertCount = await supabaseClient.from("inventory_counts").insert({
      user_id: session.id,
      item_type: itemType,
      item_id: itemId,
      expected,
      counted,
      difference,
      notes: form.get("notes").trim(),
    });
    if (insertCount.error) {
      notify(`Erro ao salvar inventario online: ${insertCount.error.message}`);
      return;
    }
    currentModal = null;
    await loadOnlineStockData();
    logAudit("Inventario contado online", `${inventoryItemName({ itemType, itemId })}: ${counted}.`);
    notify("Contagem registrada no Supabase.");
    renderApp();
    return;
  }

  if (itemType === "product") {
    state.products = state.products.map((entry) => (entry.id === itemId ? { ...entry, stock: counted } : entry));
  } else {
    state.ingredients = state.ingredients.map((entry) => (entry.id === itemId ? { ...entry, stock: counted } : entry));
  }

  state.inventoryCounts.unshift({
    id: id("inventory"),
    date: new Date().toISOString(),
    itemType,
    itemId,
    expected,
    counted,
    difference,
    userId: session.id,
    notes: form.get("notes").trim(),
  });

  currentModal = null;
  logAudit("Inventario contado", `${inventoryItemName({ itemType, itemId })}: ${counted}.`);
  saveState();
  notify("Contagem registrada.");
  renderApp();
}

async function saveSupplier(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const isEditing = Boolean(currentModal.id);
  const supplier = {
    id: currentModal.id || id("supplier"),
    name: form.get("name").trim(),
    contact: form.get("contact").trim(),
    phone: form.get("phone").trim(),
    phone2: form.get("phone2").trim(),
    phone3: form.get("phone3").trim(),
    phone4: form.get("phone4").trim(),
    phone5: form.get("phone5").trim(),
    email: form.get("email").trim(),
    cnpj: form.get("cnpj").trim(),
    address: form.get("address").trim(),
  };

  if (isOnlineSession()) {
    const row = {
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
      phone_2: supplier.phone2,
      phone_3: supplier.phone3,
      phone_4: supplier.phone4,
      phone_5: supplier.phone5,
      email: supplier.email,
      cnpj: supplier.cnpj,
      address: supplier.address,
    };
    const result = isEditing
      ? await supabaseClient.from("suppliers").update(row).eq("id", currentModal.id)
      : await supabaseClient.from("suppliers").insert(row);

    if (result.error) {
      if (isSupplierSchemaMissing(result.error)) {
        notify("Rode a migracao de cadastro completo de fornecedores no Supabase antes de salvar online.");
        return;
      }
      notify(`Erro ao salvar fornecedor online: ${result.error.message}`);
      return;
    }

    currentModal = null;
    await loadOnlineSupplierData();
    logAudit(isEditing ? "Fornecedor editado online" : "Fornecedor criado online", supplier.name);
    notify("Fornecedor salvo no Supabase.");
    renderApp();
    return;
  }

  if (isEditing) {
    state.suppliers = state.suppliers.map((entry) => (entry.id === supplier.id ? supplier : entry));
  } else {
    state.suppliers.push(supplier);
  }
  currentModal = null;
  logAudit(isEditing ? "Fornecedor editado" : "Fornecedor criado", supplier.name);
  saveState();
  notify("Fornecedor salvo.");
  renderApp();
}

function isSupplierSchemaMissing(error) {
  const message = String(error?.message || "");
  return ["phone_2", "phone_3", "phone_4", "phone_5", "email", "cnpj", "address"].some((field) => message.includes(field));
}

async function savePurchase(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const qty = Number(form.get("qty"));
  const unitCost = Number(form.get("unitCost"));
  const purchase = {
    id: id("purchase"),
    date: new Date().toISOString(),
    supplierId: form.get("supplierId"),
    itemName: form.get("itemName").trim(),
    qty,
    unitCost,
    total: qty * unitCost,
    userId: session.id,
  };

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("purchases").insert({
      supplier_id: isUuid(purchase.supplierId) ? purchase.supplierId : null,
      item_name: purchase.itemName,
      qty: purchase.qty,
      unit_cost: purchase.unitCost,
      total: purchase.total,
    });

    if (error) {
      notify(`Erro ao registrar compra online: ${error.message}`);
      return;
    }

    currentModal = null;
    await loadOnlineSupplierData();
    logAudit("Compra registrada online", `${purchase.itemName}: ${money(purchase.total)}.`);
    notify("Compra registrada no Supabase.");
    renderApp();
    return;
  }

  state.purchases.unshift(purchase);
  currentModal = null;
  logAudit("Compra registrada", `${purchase.itemName}: ${money(purchase.total)}.`);
  saveState();
  notify("Compra registrada.");
  renderApp();
}

async function saveExpense(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const now = new Date().toISOString();
  const paid = form.get("paid") === "true";
  const existing = (state.expenses || []).find((expense) => expense.id === currentModal.id);
  const isEditing = Boolean(currentModal.id);
  const initialInvoiceAmount = Number(form.get("amount"));
  const addedInvoicesTotal = existing
    ? expenseChargeHistory(existing).reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
    : 0;
  const amount = Number((initialInvoiceAmount + addedInvoicesTotal).toFixed(2));
  const recurring = form.get("recurring") === "on";
  const recurringDay = Number(form.get("recurringDay") || String(form.get("dueDate") || "").slice(-2));
  if (recurring && (!Number.isInteger(recurringDay) || recurringDay < 1 || recurringDay > 31)) {
    notify("Informe um dia fixo de vencimento entre 1 e 31.");
    return;
  }
  const currentPaid = existing ? expensePaidAmount(existing) : 0;
  const paymentHistory = [...expenseMovementHistory(existing)];
  let paidAmount = paid ? amount : Math.min(amount, currentPaid);
  if (paid && paidAmount > currentPaid) {
    paymentHistory.unshift({
      id: id("expensepay"),
      type: "payment",
      date: now,
      amount: Number((paidAmount - currentPaid).toFixed(2)),
      method: "other",
      userId: session?.id || "",
      note: "Quitacao pela edicao da despesa",
    });
  }
  const payload = {
    description: form.get("description").trim(),
    category: form.get("category").trim(),
    amount,
    expenseDate: form.get("expenseDate"),
    dueDate: form.get("dueDate"),
    recurring,
    recurringDay: recurring ? recurringDay : null,
    paidAmount,
    paymentHistory,
    paid: paidAmount >= amount,
    paidAt: paidAmount >= amount ? existing?.paidAt || now : null,
  };

  if (isOnlineSession()) {
    const row = {
      description: payload.description,
      category: payload.category,
      amount: payload.amount,
      expense_date: payload.expenseDate,
      due_date: payload.dueDate,
      paid: payload.paid,
      paid_at: payload.paidAt,
      paid_amount: payload.paidAmount,
      payment_history: payload.paymentHistory,
    };
    if (payload.recurring || existing?.recurring) {
      row.recurring = payload.recurring;
      row.recurring_day = payload.recurringDay;
    }
    const saveOnlineExpenseRow = (data) =>
      isEditing
        ? supabaseClient.from("expenses").update(data).eq("id", currentModal.id)
        : supabaseClient.from("expenses").insert(data);
    let result = await saveOnlineExpenseRow(row);

    const missingOptionalExpenseColumns =
      result.error &&
      (isExpensePaymentSchemaMissing(result.error) || String(result.error.message || "").includes("expense_date"));
    if (missingOptionalExpenseColumns && !payload.recurring && !existing?.recurring) {
      result = await saveOnlineExpenseRow({
        description: payload.description,
        category: payload.category,
        amount: payload.amount,
        due_date: payload.dueDate,
        paid: payload.paid,
        paid_at: payload.paidAt,
      });
    }

    if (result.error) {
      if (isRecurringExpenseSchemaMissing(result.error) || isExpensePaymentSchemaMissing(result.error) ||
          String(result.error.message || "").includes("expense_date")) {
        notify(`Execute SUPABASE_DESPESAS_RECORRENTES.sql no SQL Editor do Supabase. Detalhe: ${result.error.message}`);
        return;
      }
      notify(`Erro ao salvar despesa online: ${result.error.message}`);
      return;
    }

    currentModal = null;
    await loadOnlineSupplierData();
    logAudit("Despesa salva online", `${payload.description}: ${money(payload.amount)}.`);
    notify(missingOptionalExpenseColumns ? "Despesa comum salva. Execute a migracao para liberar datas e recorrencia." : "Despesa salva no Supabase.");
    renderApp();
    return;
  }

  state.expenses = state.expenses || [];
  if (isEditing) {
    state.expenses = state.expenses.map((expense) =>
      expense.id === currentModal.id ? { ...expense, ...payload } : expense,
    );
  } else {
    state.expenses.unshift({ id: id("expense"), createdAt: new Date().toISOString(), ...payload });
  }
  renewLocalExpense(isEditing ? state.expenses.find((expense) => expense.id === currentModal.id) : state.expenses[0]);

  currentModal = null;
  logAudit("Despesa salva", `${payload.description}: ${money(payload.amount)}.`);
  saveState();
  notify("Despesa salva.");
  renderApp();
}

function isExpensePaymentSchemaMissing(error) {
  const message = String(error?.message || "");
  return message.includes("paid_amount") || message.includes("payment_history");
}

function isRecurringExpenseSchemaMissing(error) {
  return /recurring(_day|_from)?/.test(String(error?.message || ""));
}

async function payExpense(expenseId) {
  if (isOnlineSession()) {
    const paidAt = new Date().toISOString();
    const expense = (state.expenses || []).find((entry) => entry.id === expenseId);
    const balance = expenseBalance(expense);
    const history = [
      {
        id: id("expensepay"),
        type: "payment",
        date: paidAt,
        amount: balance,
        method: "other",
        userId: session?.id || "",
        note: "Quitacao total",
      },
      ...expenseMovementHistory(expense),
    ];
    const { error } = await supabaseClient
      .from("expenses")
      .update({ paid: true, paid_at: paidAt, paid_amount: Number(expense?.amount || 0), payment_history: history })
      .eq("id", expenseId);

    if (error) {
      if (isExpensePaymentSchemaMissing(error)) {
        notify("Rode a migracao de pagamentos parciais de despesas no Supabase antes de pagar online.");
        return;
      }
      notify(`Erro ao pagar despesa online: ${error.message}`);
      return;
    }

    await loadOnlineSupplierData();
    logAudit("Despesa paga online", expenseId);
    notify("Despesa marcada como paga no Supabase.");
    renderApp();
    return;
  }

  state.expenses = (state.expenses || []).map((expense) =>
    expense.id === expenseId
      ? {
          ...expense,
          paid: true,
          paidAmount: Number(expense.amount || 0),
          paidAt: new Date().toISOString(),
          paymentHistory: [
            {
              id: id("expensepay"),
              type: "payment",
              date: new Date().toISOString(),
              amount: expenseBalance(expense),
              method: "other",
              userId: session?.id || "",
              note: "Quitacao total",
            },
            ...expenseMovementHistory(expense),
          ],
        }
      : expense,
  );
  renewLocalExpense(state.expenses.find((expense) => expense.id === expenseId));
  logAudit("Despesa paga", expenseId);
  saveState();
  notify("Despesa marcada como paga.");
  renderApp();
}

async function saveExpenseCharge(event) {
  event.preventDefault();
  const expense = (state.expenses || []).find((entry) => entry.id === currentModal.id);
  if (!expense) return;
  if (expense.recurring) {
    notify("Despesas recorrentes devem manter o valor fixo mensal.");
    return;
  }
  if (session?.online && !isOnlineSession()) {
    notify("Conecte a internet para somar a nova fatura na despesa online.");
    return;
  }

  const form = new FormData(event.currentTarget);
  const amount = Number(form.get("amount") || 0);
  const rawDate = form.get("date");
  const chargeDate = rawDate ? new Date(rawDate) : new Date();
  const note = String(form.get("note") || "").trim();
  if (!Number.isFinite(amount) || amount <= 0) {
    notify("Informe um valor maior que zero para a nova fatura.");
    return;
  }
  if (Number.isNaN(chargeDate.getTime())) {
    notify("Informe uma data valida para a nova fatura.");
    return;
  }
  if (!note) {
    notify("Informe a descricao ou o numero da nova fatura.");
    return;
  }

  const chargeAmount = Number(amount.toFixed(2));
  const totalAmount = Number((Number(expense.amount || 0) + chargeAmount).toFixed(2));
  const paidAmount = Number(expensePaidAmount(expense).toFixed(2));
  const dueDate = String(form.get("dueDate") || expense.dueDate || "");
  const movement = {
    id: id("expensecharge"),
    type: "charge",
    date: chargeDate.toISOString(),
    amount: chargeAmount,
    dueDate,
    userId: session?.id || "",
    note,
  };
  const paymentHistory = [movement, ...expenseMovementHistory(expense)];
  const paid = paidAmount >= totalAmount;
  const paidAt = paid ? expense.paidAt : null;

  if (isOnlineSession()) {
    const { error } = await supabaseClient
      .from("expenses")
      .update({
        amount: totalAmount,
        paid_amount: paidAmount,
        payment_history: paymentHistory,
        paid,
        paid_at: paidAt,
      })
      .eq("id", expense.id);

    if (error) {
      if (isExpensePaymentSchemaMissing(error)) {
        notify("Rode a migracao de pagamentos parciais de despesas no Supabase antes de adicionar novas faturas.");
        return;
      }
      notify(`Erro ao adicionar a nova fatura online: ${error.message}`);
      return;
    }

    currentModal = null;
    await loadOnlineSupplierData();
    logAudit("Nova fatura adicionada online", `${expense.description}: +${money(chargeAmount)}.`);
    notify(`Nova fatura criada separadamente. Saldo total pendente: ${money(totalAmount - paidAmount)}.`);
    renderApp();
    return;
  }

  state.expenses = (state.expenses || []).map((entry) =>
    entry.id === expense.id
      ? {
          ...entry,
          amount: totalAmount,
          paidAmount,
          paymentHistory,
          paid,
          paidAt,
        }
      : entry,
  );
  currentModal = null;
  logAudit("Nova fatura adicionada", `${expense.description}: +${money(chargeAmount)}.`);
  saveState();
  notify(`Nova fatura criada separadamente. Saldo total pendente: ${money(totalAmount - paidAmount)}.`);
  renderApp();
}

async function saveExpensePayment(event) {
  event.preventDefault();
  const expense = (state.expenses || []).find((entry) => entry.id === currentModal.id);
  if (!expense) return;

  const form = new FormData(event.currentTarget);
  const invoiceId = String(form.get("invoiceId") || "");
  const invoice = expenseInvoices(expense).find((entry) => entry.id === invoiceId);
  if (!invoice) {
    notify("A fatura escolhida nao foi encontrada.");
    return;
  }
  const amount = Number(form.get("amount") || 0);
  const balance = invoice.balance;
  const rawDate = form.get("date");
  const paymentDate = rawDate ? new Date(rawDate) : new Date();
  if (Number.isNaN(paymentDate.getTime())) {
    notify("Informe uma data valida para o pagamento.");
    return;
  }
  const paymentDateIso = paymentDate.toISOString();
  if (amount <= 0 || amount > balance) {
    notify(`Informe um valor entre R$ 0,01 e ${money(balance)}.`);
    return;
  }

  const payment = {
    id: id("expensepay"),
    type: "payment",
    invoiceId: invoice.id,
    date: paymentDateIso,
    amount: Number(amount.toFixed(2)),
    method: form.get("method") || "other",
    userId: session?.id || "",
    note: String(form.get("note") || "").trim(),
  };
  const paidAmount = Number(Math.min(Number(expense.amount || 0), expensePaidAmount(expense) + amount).toFixed(2));
  const paid = paidAmount >= Number(expense.amount || 0);
  const paidAt = paid ? paymentDateIso : null;
  const paymentHistory = [payment, ...expenseMovementHistory(expense)];

  if (isOnlineSession()) {
    const { error } = await supabaseClient
      .from("expenses")
      .update({
        paid_amount: paidAmount,
        payment_history: paymentHistory,
        paid,
        paid_at: paidAt,
      })
      .eq("id", expense.id);

    if (error) {
      if (isExpensePaymentSchemaMissing(error)) {
        notify("Rode a migracao de pagamentos parciais de despesas no Supabase antes de registrar pagamento online.");
        return;
      }
      notify(`Erro ao registrar pagamento da despesa online: ${error.message}`);
      return;
    }

    currentModal = null;
    await loadOnlineSupplierData();
    logAudit("Pagamento de fatura online", `${expense.description} / ${expenseInvoiceLabel(invoice)}: ${money(amount)}.`);
    notify(paid ? "Todas as faturas foram quitadas no Supabase." : "Pagamento registrado na fatura escolhida.");
    renderApp();
    return;
  }

  state.expenses = (state.expenses || []).map((entry) =>
    entry.id === expense.id
      ? {
          ...entry,
          paidAmount,
          paymentHistory,
          paid,
          paidAt,
        }
      : entry,
  );
  if (paid) renewLocalExpense(state.expenses.find((entry) => entry.id === expense.id));
  currentModal = null;
  logAudit("Pagamento de fatura", `${expense.description} / ${expenseInvoiceLabel(invoice)}: ${money(amount)}.`);
  saveState();
  notify(paid ? "Todas as faturas foram quitadas." : "Pagamento registrado na fatura escolhida.");
  renderApp();
}

async function removeSupplier(supplierId) {
  const supplier = state.suppliers.find((entry) => entry.id === supplierId);
  if (!supplier) return;

  const linkedPurchases = state.purchases.filter((purchase) => purchase.supplierId === supplierId).length;
  const linkedLots = state.stockLots.filter((lot) => lot.supplierId === supplierId).length;
  const linkedMessage =
    linkedPurchases || linkedLots
      ? `\n\nEste fornecedor esta ligado a ${linkedPurchases} compra(s) e ${linkedLots} lote(s). Esses registros continuarao no historico, mas ficarao sem fornecedor vinculado.`
      : "";

  if (!confirm(`Remover o fornecedor "${supplier.name}"?${linkedMessage}`)) return;

  if (isOnlineSession()) {
    const purchasesUpdate = await supabaseClient.from("purchases").update({ supplier_id: null }).eq("supplier_id", supplierId);
    if (purchasesUpdate.error) {
      notify(`Erro ao soltar compras do fornecedor: ${purchasesUpdate.error.message}`);
      return;
    }
    const lotsUpdate = await supabaseClient.from("product_lots").update({ supplier_id: null }).eq("supplier_id", supplierId);
    if (lotsUpdate.error) {
      notify(`Erro ao soltar lotes do fornecedor: ${lotsUpdate.error.message}`);
      return;
    }
    const { error } = await supabaseClient.from("suppliers").delete().eq("id", supplierId);
    if (error) {
      notify(`Erro ao remover fornecedor online: ${error.message}`);
      return;
    }

    await loadOnlineSupplierData();
    await loadOnlineStockData();
    logAudit("Fornecedor removido online", supplier.name);
    notify("Fornecedor removido do Supabase.");
    renderApp();
    return;
  }

  state.suppliers = state.suppliers.filter((entry) => entry.id !== supplierId);
  state.purchases = state.purchases.map((purchase) =>
    purchase.supplierId === supplierId ? { ...purchase, supplierId: "" } : purchase,
  );
  state.stockLots = state.stockLots.map((lot) =>
    lot.supplierId === supplierId ? { ...lot, supplierId: "" } : lot,
  );
  logAudit("Fornecedor removido", supplier.name);
  saveState();
  notify("Fornecedor removido.");
  renderApp();
}

async function removeExpense(expenseId) {
  const expense = (state.expenses || []).find((entry) => entry.id === expenseId);
  if (!expense) return;
  const invoiceCount = expenseInvoices(expense).length;
  if (!confirm(`Remover a conta "${expense.description}" e suas ${invoiceCount} fatura(s), no total de ${money(expense.amount)}?`)) return;

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("expenses").delete().eq("id", expenseId);
    if (error) {
      notify(`Erro ao remover despesa online: ${error.message}`);
      return;
    }
    await loadOnlineSupplierData();
    logAudit("Despesa removida online", `${expense.description}: ${money(expense.amount)}.`);
    notify("Despesa removida do Supabase.");
    renderApp();
    return;
  }

  state.expenses = (state.expenses || []).filter((entry) => entry.id !== expenseId);
  logAudit("Despesa removida", `${expense.description}: ${money(expense.amount)}.`);
  saveState();
  notify("Despesa removida.");
  renderApp();
}

function expenseAfterRemovingPaidInvoice(expense, invoice) {
  const invoices = expenseInvoices(expense);
  const remainingInvoices = invoices.filter((entry) => entry.id !== invoice.id);
  const nextAmount = Number(Math.max(0, Number(expense.amount || 0) - Number(invoice.amount || 0)).toFixed(2));
  const nextPaidAmount = Number(Math.max(0, expensePaidAmount(expense) - Number(invoice.paidAmount || 0)).toFixed(2));
  let paidToRemove = Number(invoice.paidAmount || 0);
  let paymentHistory = [];

  expenseMovementHistory(expense).forEach((movement) => {
    if (movement.type === "charge" && movement.id === invoice.id) return;
    if (movement.type !== "charge" && movement.invoiceId === invoice.id) {
      paidToRemove = Math.max(0, paidToRemove - Number(movement.amount || 0));
      return;
    }
    paymentHistory.push({ ...movement });
  });

  if (paidToRemove > 0.005) {
    paymentHistory = paymentHistory.reduce((result, movement) => {
      if (paidToRemove <= 0.005 || movement.type === "charge" || movement.invoiceId) {
        result.push(movement);
        return result;
      }
      const movementAmount = Number(movement.amount || 0);
      const removedAmount = Math.min(movementAmount, paidToRemove);
      paidToRemove = Number(Math.max(0, paidToRemove - removedAmount).toFixed(2));
      const remainingAmount = Number(Math.max(0, movementAmount - removedAmount).toFixed(2));
      if (remainingAmount > 0) result.push({ ...movement, amount: remainingAmount });
      return result;
    }, []);
  }

  let expenseDate = expense.expenseDate;
  let dueDate = expense.dueDate;
  if (invoice.initial && remainingInvoices.length) {
    const promotedInvoice = remainingInvoices[0];
    const promotedInvoiceId = expenseInitialInvoiceId(expense);
    expenseDate = String(promotedInvoice.date || expenseDate || "").slice(0, 10);
    dueDate = promotedInvoice.dueDate || dueDate;
    paymentHistory = paymentHistory
      .filter((movement) => !(movement.type === "charge" && movement.id === promotedInvoice.id))
      .map((movement) =>
        movement.type !== "charge" && movement.invoiceId === promotedInvoice.id
          ? { ...movement, invoiceId: promotedInvoiceId }
          : movement,
      );
  }

  const paid = nextAmount > 0 && nextPaidAmount >= nextAmount;
  return {
    ...expense,
    amount: nextAmount,
    expenseDate,
    dueDate,
    paidAmount: Math.min(nextAmount, nextPaidAmount),
    paymentHistory,
    paid,
    paidAt: paid ? expense.paidAt : null,
  };
}

async function removePaidExpenseInvoice(expenseId, invoiceId) {
  const expense = (state.expenses || []).find((entry) => entry.id === expenseId);
  const invoice = expenseInvoices(expense).find((entry) => entry.id === invoiceId);
  if (!expense || !invoice) {
    notify("A conta paga nao foi encontrada.");
    return;
  }
  if (invoice.status !== "Pago") {
    notify("Somente contas totalmente pagas podem ser removidas por esta opcao.");
    return;
  }
  if (!confirm(`Remover a fatura paga "${expenseInvoiceLabel(invoice)}" de ${expense.description}, no valor de ${money(invoice.amount)}?`)) return;

  const invoices = expenseInvoices(expense);
  if (invoices.length === 1) {
    if (isOnlineSession()) {
      const { error } = await supabaseClient.from("expenses").delete().eq("id", expense.id);
      if (error) {
        notify(`Erro ao remover conta paga online: ${error.message}`);
        return;
      }
      await loadOnlineSupplierData();
      logAudit("Conta paga removida online", `${expense.description}: ${money(invoice.amount)}.`);
    } else {
      state.expenses = (state.expenses || []).filter((entry) => entry.id !== expense.id);
      logAudit("Conta paga removida", `${expense.description}: ${money(invoice.amount)}.`);
      saveState();
    }
    notify("Conta paga removida.");
    renderApp();
    return;
  }

  const updatedExpense = expenseAfterRemovingPaidInvoice(expense, invoice);
  if (isOnlineSession()) {
    const { error } = await supabaseClient
      .from("expenses")
      .update({
        amount: updatedExpense.amount,
        expense_date: updatedExpense.expenseDate,
        due_date: updatedExpense.dueDate,
        paid_amount: updatedExpense.paidAmount,
        payment_history: updatedExpense.paymentHistory,
        paid: updatedExpense.paid,
        paid_at: updatedExpense.paidAt,
      })
      .eq("id", expense.id);
    if (error) {
      notify(`Erro ao remover fatura paga online: ${error.message}`);
      return;
    }
    await loadOnlineSupplierData();
    logAudit(
      "Fatura paga removida online",
      `${expense.description} / ${expenseInvoiceLabel(invoice)}: ${money(invoice.amount)}.`,
    );
  } else {
    state.expenses = (state.expenses || []).map((entry) => (entry.id === expense.id ? updatedExpense : entry));
    logAudit(
      "Fatura paga removida",
      `${expense.description} / ${expenseInvoiceLabel(invoice)}: ${money(invoice.amount)}.`,
    );
    saveState();
  }
  notify(`Fatura paga removida. Saldo restante da conta: ${money(expenseBalance(updatedExpense))}.`);
  renderApp();
}

async function saveClient(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const existing = state.clients.find((entry) => entry.id === currentModal.id);
  const product = state.products.find((entry) => entry.id === form.get("chargeProductId"));
  const chargeAmount = Number(form.get("chargeAmount") || 0);
  const transactions = [...(existing?.transactions || [])];
  if (product && chargeAmount > 0) {
    transactions.unshift({
      id: id("clienttx"),
      date: new Date().toISOString(),
      type: "debito",
      description: product.name,
      amount: chargeAmount,
      userId: session.id,
    });
  }

  const payload = {
    name: form.get("name").trim(),
    phone: form.get("phone").trim(),
    debt: Number(form.get("debt") || 0) + (product && chargeAmount > 0 ? chargeAmount : 0),
    creditLimit: Number(form.get("creditLimit") || 0),
    notes: form.get("notes").trim(),
    transactions,
  };

  if (isOnlineSession()) {
    await saveClientOnline(payload, product && chargeAmount > 0 ? { productName: product.name, amount: chargeAmount } : null);
    return;
  }

  if (currentModal.id) {
    state.clients = state.clients.map((client) => (client.id === currentModal.id ? { ...client, ...payload } : client));
  } else {
    state.clients.push({ id: id("client"), ...payload });
  }
  currentModal = null;
  logAudit("Cliente salvo", payload.name);
  saveState();
  notify("Cliente salvo.");
  renderApp();
}

async function saveClientOnline(payload, charge = null) {
  const dbPayload = {
    name: payload.name,
    phone: payload.phone || null,
    debt: payload.debt,
    credit_limit: payload.creditLimit,
    notes: payload.notes || null,
  };

  const result = currentModal.id
    ? await supabaseClient.from("clients").update(dbPayload).eq("id", currentModal.id).select("*").single()
    : await supabaseClient.from("clients").insert(dbPayload).select("*").single();

  if (result.error) {
    notify(`Erro ao salvar cliente online: ${result.error.message}`);
    return;
  }

  if (charge) {
    const tx = await supabaseClient.from("client_transactions").insert({
      client_id: result.data.id,
      user_id: session.id,
      type: "debito",
      description: charge.productName,
      amount: charge.amount,
    });
    if (tx.error) {
      notify(`Cliente salvo, mas falhou ao registrar historico: ${tx.error.message}`);
      return;
    }
  }

  currentModal = null;
  await loadOnlineClientsData();
  logAudit("Cliente salvo online", payload.name);
  notify("Cliente salvo no Supabase.");
  renderApp();
}

async function saveClientPayment(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const amount = Number(form.get("amount"));

  if (isOnlineSession()) {
    const client = state.clients.find((entry) => entry.id === currentModal.id);
    if (!client) return;
    const nextDebt = Math.max(0, Number(client.debt || 0) - amount);
    const update = await supabaseClient.from("clients").update({ debt: nextDebt }).eq("id", client.id);
    if (update.error) {
      notify(`Erro ao baixar fiado online: ${update.error.message}`);
      return;
    }
    const tx = await supabaseClient.from("client_transactions").insert({
      client_id: client.id,
      user_id: session.id,
      type: "pagamento",
      description: form.get("notes").trim() || "Pagamento parcial",
      amount: -amount,
    });
    if (tx.error) {
      notify(`Pagamento baixado, mas falhou no historico: ${tx.error.message}`);
      return;
    }
    currentModal = null;
    await loadOnlineClientsData();
    logAudit("Pagamento parcial online", money(amount));
    notify("Pagamento registrado no Supabase.");
    renderApp();
    return;
  }

  state.clients = state.clients.map((client) => {
    if (client.id !== currentModal.id) return client;
    return {
      ...client,
      debt: Math.max(0, Number(client.debt || 0) - amount),
      transactions: [
        {
          id: id("clienttx"),
          date: new Date().toISOString(),
          type: "pagamento",
          description: form.get("notes").trim() || "Pagamento parcial",
          amount: -amount,
          userId: session.id,
        },
        ...(client.transactions || []),
      ],
    };
  });
  currentModal = null;
  logAudit("Pagamento parcial", money(amount));
  saveState();
  notify("Pagamento registrado.");
  renderApp();
}

async function removeClientTransaction(event) {
  event.preventDefault();
  const match = clientTransactionById(currentModal.id);
  if (!match || match.transaction.type !== "debito") {
    notify("Lancamento de fiado nao encontrado.");
    return;
  }

  const form = new FormData(event.currentTarget);
  const admin = await authorizeAdminPassword(form.get("adminPassword"));
  if (!admin) {
    notify("Senha de administrador invalida.");
    return;
  }

  const previousDebt = Number(match.client.debt || 0);
  const nextDebt = Math.max(0, previousDebt - Number(match.transaction.amount || 0));
  const reason = String(form.get("reason") || "").trim();

  if (isOnlineSession()) {
    const update = await supabaseClient.from("clients").update({ debt: nextDebt }).eq("id", match.client.id);
    if (update.error) {
      notify(`Erro ao corrigir saldo fiado: ${update.error.message}`);
      return;
    }
    const removal = await supabaseClient.from("client_transactions").delete().eq("id", match.transaction.id);
    if (removal.error) {
      await supabaseClient.from("clients").update({ debt: previousDebt }).eq("id", match.client.id);
      notify(`Erro ao remover produto do fiado: ${removal.error.message}`);
      return;
    }
    currentModal = null;
    await loadOnlineClientsData();
  } else {
    state.clients = state.clients.map((client) =>
      client.id === match.client.id
        ? { ...client, debt: nextDebt, transactions: client.transactions.filter((entry) => entry.id !== match.transaction.id) }
        : client,
    );
    currentModal = null;
    saveState();
  }

  logAudit(
    "Produto removido do fiado",
    `${match.client.name}: ${match.transaction.description}, ${money(match.transaction.amount)}. Autorizado por ${admin.name}. Motivo: ${reason}`,
  );
  notify("Produto removido e saldo fiado corrigido.");
  renderApp();
}

function saveCancelSale(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const admin = state.users.find((user) => user.role === "admin" && user.password === form.get("adminPassword") && user.active);
  const sale = state.sales.find((entry) => entry.id === currentModal.id);

  if (!admin) {
    notify("Senha de administrador invalida.");
    return;
  }

  if (!sale || !isFinancialSale(sale)) {
    notify("Venda nao encontrada, ja cancelada ou ja zerada.");
    return;
  }

  restoreSaleStock(sale.items);
  const fiadoAmount = saleFiadoAmount(sale);
  if (fiadoAmount > 0 && sale.clientId) {
    state.clients = state.clients.map((client) =>
      client.id === sale.clientId ? { ...client, debt: Math.max(0, Number(client.debt || 0) - fiadoAmount) } : client,
    );
  }

  sale.status = "Cancelada";
  sale.cancelledAt = new Date().toISOString();
  sale.cancelledBy = session.id;
  sale.cancelReason = form.get("reason").trim();
  state.cancellations.unshift({
    id: id("cancel"),
    saleId: sale.id,
    date: sale.cancelledAt,
    userId: session.id,
    authorizedBy: admin.id,
    reason: sale.cancelReason,
    total: sale.total,
  });
  storeDailySalesTotal(localDateKey(sale.date), "cancelamento");

  currentModal = null;
  logAudit("Venda cancelada", `${sale.id}: ${sale.cancelReason}`);
  saveState();
  notify("Venda cancelada.");
  renderApp();
}

async function saveLot(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const [itemType, itemId] = form.get("itemKey").split(":");
  const lotPayload = {
    itemType,
    itemId,
    batch: form.get("batch").trim(),
    qty: Number(form.get("qty")),
    expiresAt: form.get("expiresAt"),
    supplierId: form.get("supplierId"),
  };

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("product_lots").insert({
      item_type: lotPayload.itemType,
      item_id: lotPayload.itemId,
      batch: lotPayload.batch,
      qty: lotPayload.qty,
      expires_at: lotPayload.expiresAt,
      supplier_id: isUuid(lotPayload.supplierId) ? lotPayload.supplierId : null,
    });
    if (error) {
      notify(`Erro ao cadastrar lote online: ${error.message}`);
      return;
    }
    currentModal = null;
    await loadOnlineStockData();
    logAudit("Lote cadastrado online", `${inventoryItemName({ itemType, itemId })} - ${lotPayload.batch}.`);
    notify("Lote cadastrado no Supabase.");
    renderApp();
    return;
  }

  state.stockLots.unshift({
    id: id("lot"),
    createdAt: new Date().toISOString(),
    ...lotPayload,
  });
  currentModal = null;
  logAudit("Lote cadastrado", `${inventoryItemName({ itemType, itemId })} - ${form.get("batch")}.`);
  saveState();
  notify("Lote cadastrado.");
  renderApp();
}

function bindUserPermissionControls() {
  const roleSelect = document.querySelector("#user-role");
  const applyButton = document.querySelector("[data-apply-role]");
  const checkboxes = [...document.querySelectorAll('input[name="permissions"]')];
  if (!roleSelect || !checkboxes.length) return;

  const applyRoleDefaults = () => {
    const selectedRole = roleSelect.value;
    const defaults = roles[selectedRole]?.permissions || [];
    const adminRole = selectedRole === "admin";

    checkboxes.forEach((checkbox) => {
      checkbox.checked = defaults.includes(checkbox.value);
      checkbox.disabled = adminRole;
      checkbox.closest(".check-tile")?.classList.toggle("locked", adminRole);
    });
  };

  roleSelect.addEventListener("change", applyRoleDefaults);
  applyButton?.addEventListener("click", applyRoleDefaults);
}

async function resetOnlineUserPassword(userId, password) {
  const { data } = await supabaseClient.auth.getSession();
  const accessToken = data?.session?.access_token;
  if (!accessToken) throw new Error("Sessao expirada. Entre novamente no app.");

  const response = await fetch("/api/supabase/reset-user-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ userId, password }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || result.error || "Nao foi possivel trocar a senha online.");
  }
}

async function saveUser(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const selectedRole = form.get("role");
  const selectedPermissions =
    selectedRole === "admin" ? roles.admin.permissions : normalizePermissions(form.getAll("permissions"));

  if (currentModal.id === session.id && selectedRole !== "admin") {
    notify("Mantenha sua conta como Administrador para nao perder o controle do sistema.");
    return;
  }

  const payload = {
    name: form.get("name").trim(),
    email: form.get("email").trim(),
    password: form.get("password").trim(),
    role: selectedRole,
    permissions: selectedPermissions,
    active: form.get("active") === "true",
    showOnLogin: form.get("showOnLogin") === "true",
  };

  const emailExists = state.users.some(
    (user) => user.email.toLowerCase() === payload.email.toLowerCase() && user.id !== currentModal.id,
  );
  const nameExists = state.users.some(
    (user) => user.name.trim().toLowerCase() === payload.name.toLowerCase() && user.id !== currentModal.id,
  );

  if (emailExists) {
    notify("Ja existe um usuario com este email.");
    return;
  }

  if (nameExists) {
    notify("Ja existe um usuario com este nome.");
    return;
  }

  const editingLocalUser = Boolean(currentModal.id && !isUuid(currentModal.id));

  if (isOnlineSession() && !editingLocalUser) {
    if (!currentModal.id || !isUuid(currentModal.id)) {
      notify("Para criar login real, crie primeiro o usuario em Supabase > Authentication > Users e depois o perfil em profiles.");
      return;
    }

    const { error } = await supabaseClient
      .from("profiles")
      .update({
        name: payload.name,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions,
        active: payload.active,
        show_on_login: payload.showOnLogin,
      })
      .eq("id", currentModal.id);

    if (error) {
      notify(`Erro ao salvar usuario online: ${error.message}`);
      return;
    }

    if (payload.password) {
      try {
        await resetOnlineUserPassword(currentModal.id, payload.password);
      } catch (passwordError) {
        notify(`Usuario salvo, mas a senha nao foi alterada: ${passwordError.message}`);
        return;
      }
    }

    currentModal = null;
    await loadOnlineProfilesData();
    logAudit("Usuario salvo online", `${payload.name} - ${payload.role}.`);
    notify(payload.password ? "Usuario salvo e senha online alterada." : "Usuario salvo no Supabase.");
    renderApp();
    return;
  }

  if (currentModal.id) {
    state.users = state.users.map((user) => (user.id === currentModal.id ? { ...user, ...payload } : user));
    if (session.id === currentModal.id) {
      session = state.users.find((user) => user.id === currentModal.id);
    }
  } else {
    state.users.push({ id: id("user"), ...payload });
  }

  currentModal = null;
  logAudit("Usuario salvo", `${payload.name} - ${payload.role}.`);
  saveState();
  notify(editingLocalUser ? "Conta offline atualizada neste navegador." : "Usuario salvo.");
  renderApp();
}

async function saveMovement(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const type = form.get("type");
  const amount = Number(form.get("amount"));
  const reason = form.get("reason").trim();
  const movementDateKey = String(form.get("movementDate") || localDateKey());
  const now = new Date();
  const [movementYear, movementMonth, movementDay] = movementDateKey.split("-").map(Number);
  const movementDate = new Date(
    movementYear,
    movementMonth - 1,
    movementDay,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  );
  const openCash = getOpenCash();

  if (Number.isNaN(movementDate.getTime()) || movementDateKey > localDateKey()) {
    notify("Informe uma data valida, igual ou anterior a hoje.");
    return;
  }

  if (!openCash) {
    notify("Abra o caixa antes de registrar saida, despesa ou suprimento.");
    return;
  }

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("cash_movements").insert({
      user_id: session.id,
      type,
      amount,
      reason,
      created_at: movementDate.toISOString(),
    });

    if (error) {
      notify(`Erro ao registrar movimento online: ${error.message}`);
      return;
    }

    currentModal = null;
    await loadOnlineCashData();
    logAudit("Movimento de caixa online", `${type} de ${money(amount)} em ${formatDateKeyBr(movementDateKey)}.`);
    notify("Movimentacao registrada no Supabase.");
    renderApp();
    return;
  }

  state.cashMovements.push({
    id: id("movement"),
    date: new Date().toISOString(),
    type,
    amount,
    reason,
    userId: session.id,
  });

  currentModal = null;
  logAudit("Movimento de caixa", `${type} de ${money(amount)} em ${formatDateKeyBr(movementDateKey)}.`);
  saveState();
  notify("Movimentacao registrada.");
  renderApp();
}

function externalPaymentItemsFromForm(form) {
  const grouped = new Map();

  for (let index = 1; index <= 8; index += 1) {
    const productSearch = String(form.get(`externalProductSearch-${index}`) || "").trim();
    if (!productSearch) continue;

    const product = findProductBySearchValue(productSearch);
    if (!product) return { error: `Produto nao encontrado: ${productSearch}. Escolha uma opcao da lista.` };

    const quantityValue = form.get(`externalQty-${index}`);
    const quantity = quantityValue ? Number(quantityValue) : 1;
    if (!quantity || quantity <= 0) return { error: `Informe uma quantidade valida para ${product.name}.` };

    const previous = grouped.get(product.id);
    if (previous) {
      previous.qty += quantity;
    } else {
      grouped.set(product.id, {
        productId: product.id,
        name: product.name,
        qty: quantity,
        price: Number(product.price || 0),
        cost: Number(product.cost || 0),
      });
    }
  }

  return { items: [...grouped.values()] };
}

function externalPaymentPreviewItemsFromForm(form) {
  const items = [];
  for (let index = 1; index <= 8; index += 1) {
    const productSearch = String(form.get(`externalProductSearch-${index}`) || "").trim();
    if (!productSearch) continue;

    const product = findProductBySearchValue(productSearch);
    if (!product) continue;

    const quantityValue = form.get(`externalQty-${index}`);
    const quantity = quantityValue ? Number(quantityValue) : 1;
    if (!quantity || quantity <= 0) continue;

    items.push({
      productId: product.id,
      qty: quantity,
      price: Number(product.price || 0),
    });
  }
  return items;
}

function externalPaymentProductsTotal(items) {
  return items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0);
}

function bindExternalPaymentTotal() {
  const formElement = document.querySelector("#external-payment-form");
  if (!formElement) return;

  const amountInput = formElement.querySelector("[data-external-amount]");
  const totalOutput = formElement.querySelector("[data-external-products-total]");
  const updateTotal = () => {
    const previewItems = externalPaymentPreviewItemsFromForm(new FormData(formElement));
    const total = externalPaymentProductsTotal(previewItems);
    if (totalOutput) totalOutput.textContent = money(total);
    if (amountInput && total > 0) amountInput.value = total.toFixed(2);
    if (amountInput && total <= 0 && amountInput.dataset.autoFilled === "true") amountInput.value = "";
    if (amountInput) amountInput.dataset.autoFilled = total > 0 ? "true" : "false";
  };

  formElement.querySelectorAll("[data-external-product-search], [data-external-product-qty]").forEach((input) => {
    input.addEventListener("input", updateTotal);
    input.addEventListener("change", updateTotal);
  });

  updateTotal();
}

function buildManualChargeSale({ description, amount, payment, installments, terminalLabel, providerReferences = [], syncStatus }) {
  const date = new Date().toISOString();
  return {
    id: uuid(),
    date,
    cashierId: session.id,
    clientId: null,
    tableId: null,
    payment,
    paymentBreakdown: [{ method: payment, amount, installments }],
    paymentOrigin: "manual_charge",
    manualReference: description,
    terminalLabel,
    providerReferences: normalizeProviderReferences(providerReferences),
    status: "Cobranca avulsa",
    syncStatus,
    serviceFee: 0,
    total: amount,
    cost: 0,
    items: [
      {
        productId: null,
        name: description,
        qty: 1,
        price: amount,
        cost: 0,
      },
    ],
  };
}

function storeManualChargeLocally(sale, queueForSync = false) {
  state.sales.push(sale);
  if (queueForSync) queueOfflineSale(sale, 0);
  storeDailySalesTotal(localDateKey(sale.date), "automatico");
  saveState();
}

async function recordManualCharge({ description, amount, payment, installments, terminal, providerReferences = [] }) {
  const terminalLabel = ticketTerminalLabel(terminal);
  const shouldSyncLater = Boolean(session?.online && isSupabaseReady());
  const sale = buildManualChargeSale({
    description,
    amount,
    payment,
    installments,
    terminalLabel,
    providerReferences,
    syncStatus: shouldSyncLater ? "pending" : "local",
  });

  if (!isOnlineSession()) {
    storeManualChargeLocally(sale, shouldSyncLater);
    return { ok: true, saleId: sale.id, pending: shouldSyncLater };
  }

  const encodedPayment = encodePaymentDetails({
    payment,
    breakdown: sale.paymentBreakdown,
    paymentOrigin: sale.paymentOrigin,
    manualReference: description,
    terminalLabel,
    providerReferences: sale.providerReferences,
  });
  const saleResult = await supabaseClient
    .from("sales")
    .insert({
      id: sale.id,
      cashier_id: session.id,
      client_id: null,
      payment: encodedPayment,
      status: sale.status,
      service_fee: 0,
      total: amount,
      cost: 0,
      created_at: sale.date,
    })
    .select("*")
    .single();

  if (saleResult.error) {
    storeManualChargeLocally(sale, true);
    return { ok: true, saleId: sale.id, pending: true, error: saleResult.error.message };
  }

  const itemResult = await supabaseClient.from("sale_items").insert({
    sale_id: sale.id,
    product_id: null,
    name: description,
    qty: 1,
    price: amount,
    cost: 0,
  });

  await loadOnlineSalesData();
  attachSalePrintDetails(sale.id, { terminalLabel });
  storeDailySalesTotal(localDateKey(sale.date), "automatico");
  saveState();
  return { ok: true, saleId: sale.id, itemWarning: itemResult.error?.message || "" };
}

async function saveManualCharge(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  if (formElement.dataset.submitting === "true") return;

  const form = new FormData(formElement);
  const description = String(form.get("description") || "").trim();
  const amount = Number(form.get("amount") || 0);
  const payment = normalizePaymentMethod(form.get("payment"));
  const installments = payment === "Credito" ? Math.min(12, Math.max(1, Number(form.get("creditInstallments") || 1))) : 1;
  const terminalKey = String(form.get("terminalKey") || "");
  const terminal = paymentTerminalOptions().find((entry) => entry.id === terminalKey);

  if (!description) {
    notify("Informe a descricao da cobranca.");
    return;
  }
  if (!amount || amount <= 0) {
    notify("Informe um valor maior que zero.");
    return;
  }
  if (!pointPaymentMethods.includes(payment)) {
    notify("Escolha Pix, Debito ou Credito.");
    return;
  }
  if (!terminal?.enabled) {
    notify("Selecione uma maquininha ativa.");
    return;
  }
  if (!hasNetworkConnection()) {
    notify("A cobranca avulsa na maquininha precisa de internet.");
    return;
  }

  formElement.dataset.submitting = "true";
  const submitButton = formElement.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Autorizando...";
  }

  try {
    const admin = await authorizeAdminPassword(form.get("adminPassword"));
    if (!admin) {
      notify("Senha de administrador invalida.");
      return;
    }

    if (submitButton) submitButton.textContent = "Aguardando maquininha...";
    const pointPayment = await processPointPaymentBeforeSale({
      amount,
      payment,
      installments,
      terminalKey,
      items: [],
      description: `Cobranca avulsa - ${description}`,
    });
    if (!pointPayment.ok) return;

    if (submitButton) submitButton.textContent = "Registrando...";
    const result = await recordManualCharge({
      description,
      amount,
      payment,
      installments,
      terminal: pointPayment.terminal || terminal,
      providerReferences: pointPayment.paymentReference ? [pointPayment.paymentReference] : [],
    });
    if (!result.ok) return;

    currentModal = null;
    logAudit(
      result.pending ? "Cobranca avulsa aguardando nuvem" : "Cobranca avulsa online",
      `${money(amount)} em ${payment}${payment === "Credito" ? ` ${installments}x` : ""} na ${ticketTerminalLabel(
        pointPayment.terminal || terminal,
      )}. Autorizado por ${admin.name}. Descricao: ${description}.`,
    );
    saveState();
    if (result.pending) {
      notify("Pagamento aprovado e salvo neste aparelho. O registro aguardara sincronizacao.");
    } else if (result.itemWarning) {
      notify("Pagamento aprovado e valor registrado, mas a descricao nao foi salva como item.");
    } else {
      notify("Cobranca avulsa aprovada e registrada em Vendas.");
    }
    renderApp();
  } catch (error) {
    notify(`Falha na cobranca avulsa: ${error.message || "erro inesperado"}. Confira a maquininha antes de tentar novamente.`);
  } finally {
    if (currentModal?.type === "manualCharge" && document.body.contains(formElement)) {
      delete formElement.dataset.submitting;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar para maquininha";
      }
    }
  }
}

async function saveExternalPayment(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payment = form.get("payment");
  const amount = Number(form.get("amount") || 0);
  const terminalLabel = form.get("terminalLabel") || "";
  const note = form.get("note").trim();
  const rawDate = form.get("date");
  const date = rawDate ? new Date(rawDate).toISOString() : new Date().toISOString();
  const parsedItems = externalPaymentItemsFromForm(form);

  if (parsedItems.error) {
    notify(parsedItems.error);
    return;
  }

  const saleItems = parsedItems.items || [];
  const productsTotal = saleItems.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0);
  const saleTotal = amount > 0 ? amount : productsTotal;
  const saleCost = saleItems.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.cost || 0), 0);
  const externalProvider = /stone/i.test(terminalLabel) ? "stone" : /mercado|point/i.test(terminalLabel) ? "mercado_pago" : "external";
  const externalReferences = isPointPayment(payment)
    ? [{ provider: externalProvider, reference: note, terminalLabel, amount: saleTotal, method: payment, status: "operator_confirmed", checkedAt: new Date().toISOString() }]
    : [];
  const encodedExternalPayment = encodePaymentDetails({
    payment,
    breakdown: [{ method: payment, amount: saleTotal }],
    paymentOrigin: "external_terminal",
    manualReference: note,
    terminalLabel,
    providerReferences: externalReferences,
  });

  if (!saleTotal || saleTotal <= 0) {
    notify("Informe o valor pago ou selecione produtos vendidos.");
    return;
  }

  if (saleItems.length) {
    const stockCheck = canFulfillCart(saleItems);
    if (!stockCheck.ok) {
      notify(stockCheck.message);
      return;
    }
  }

  if (isOnlineSession()) {
    const saleResult = await supabaseClient
      .from("sales")
      .insert({
        cashier_id: session.id,
        client_id: null,
        payment: encodedExternalPayment,
        status: "Pagamento externo",
        service_fee: 0,
        total: saleTotal,
        cost: saleCost,
        created_at: date,
      })
      .select("*")
      .single();

    if (saleResult.error) {
      notify(`Erro ao registrar pagamento externo online: ${saleResult.error.message}`);
      return;
    }

    if (saleItems.length) {
      const itemsResult = await supabaseClient.from("sale_items").insert(
        saleItems.map((item) => ({
          sale_id: saleResult.data.id,
          product_id: item.productId,
          name: item.name,
          qty: item.qty,
          price: item.price,
          cost: item.cost,
        })),
      );

      if (itemsResult.error) {
        notify(`Pagamento registrado, mas falhou ao salvar produtos: ${itemsResult.error.message}`);
        await loadOnlineSalesData();
        await loadOnlineStockData();
        renderApp();
        return;
      }
    }

    if (saleItems.length) {
      const stockResult = await applyCartStockOnline(saleItems);
      if (!stockResult.ok) {
        notify(`Pagamento registrado, mas falhou ao baixar estoque: ${stockResult.message}`);
        await loadOnlineSalesData();
        await loadOnlineStockData();
        renderApp();
        return;
      }
    }

    currentModal = null;
    await loadOnlineStockData();
    await loadOnlineSalesData();
    attachSalePrintDetails(saleResult.data.id, { terminalLabel });
    storeDailySalesTotal(localDateKey(date), "automatico");
    saveState();
    logAudit(
      "Pagamento externo online",
      `${money(saleTotal)} em ${payment}${terminalLabel ? ` - ${ticketTerminalLabel({ label: terminalLabel })}` : ""}. ${
        saleItems.length ? saleItemsDescription({ items: saleItems }) : "Sem produtos."
      } ${note}`,
    );
    notify(saleItems.length ? "Pagamento externo registrado e estoque baixado." : "Pagamento externo registrado no Supabase.");
    renderApp();
    return;
  }

  if (saleItems.length) applyCartStock(saleItems);

  const externalSale = {
    id: id("sale"),
    date,
    cashierId: session.id,
    clientId: null,
    tableId: null,
    payment,
    paymentBreakdown: [{ method: payment, amount: saleTotal }],
    paymentOrigin: "external_terminal",
    manualReference: note,
    providerReferences: externalReferences,
    status: "Pagamento externo",
    serviceFee: 0,
    total: saleTotal,
    cost: saleCost,
    items: saleItems,
    terminalLabel,
    externalNote: note,
  };
  state.sales.push(externalSale);
  storeDailySalesTotal(localDateKey(externalSale.date), "automatico");

  currentModal = null;
  logAudit(
    "Pagamento externo",
    `${money(saleTotal)} em ${payment}${terminalLabel ? ` - ${ticketTerminalLabel({ label: terminalLabel })}` : ""}. ${
      saleItems.length ? saleItemsDescription({ items: saleItems }) : "Sem produtos."
    } ${note}`,
  );
  saveState();
  notify(saleItems.length ? "Pagamento externo registrado e estoque baixado." : "Pagamento externo registrado.");
  renderApp();
}

async function saveSettings(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = {
    ...state.settings,
    barName: form.get("barName").trim(),
    cnpj: form.get("cnpj").trim(),
    address: form.get("address").trim(),
    serviceFee: Number(form.get("serviceFee") || 0),
    palette: ["brand", "rubro", "classic"].includes(form.get("palette")) ? form.get("palette") : "brand",
    receiptFooter: form.get("receiptFooter").trim(),
    closingDifferenceLimit: Math.max(0, Number(form.get("closingDifferenceLimit") || 5)),
    pricingDefaults: {
      cardFee: Math.max(0, Number(form.get("pricingCardFee") || 0)),
      tax: Math.max(0, Number(form.get("pricingTax") || 0)),
      targetMargin: Math.max(0, Number(form.get("pricingTargetMargin") || 0)),
    },
    anomalySettings: {
      highDiscountPercent: Math.max(0, Number(form.get("highDiscountPercent") || 15)),
      cancellationPercent: Math.max(0, Number(form.get("cancellationPercent") || 8)),
    },
    shiftStartView: Object.fromEntries(Object.keys(roles).map((roleKey) => [roleKey, form.get(`start-${roleKey}`)])),
  };

  if (isOnlineSession()) {
    const settingsRow = {
      id: "main",
      bar_name: payload.barName,
      cnpj: payload.cnpj,
      address: payload.address,
      service_fee: payload.serviceFee,
      receipt_footer: payload.receiptFooter,
      shift_start_view: payload.shiftStartView,
      advanced_settings: {
        closingDifferenceLimit: payload.closingDifferenceLimit,
        pricingDefaults: payload.pricingDefaults,
        anomalySettings: payload.anomalySettings,
      },
    };
    let { error } = await supabaseClient.from("app_settings").upsert(settingsRow);

    if (error && /advanced_settings|schema cache|column/i.test(error.message || "")) {
      const { advanced_settings: ignoredAdvancedSettings, ...legacySettingsRow } = settingsRow;
      ({ error } = await supabaseClient.from("app_settings").upsert(legacySettingsRow));
      if (!error) notify("Configuracoes basicas salvas. Execute a migracao de gestao avancada para sincronizar a seguranca e os limites.");
    }

    if (error) {
      notify(`Erro ao salvar configuracoes online: ${error.message}`);
      return;
    }

    state.settings = payload;
    await loadOnlineSettings();
    logAudit("Configuracoes salvas online", state.settings.barName);
    saveState();
    notify("Configuracoes salvas no Supabase.");
    renderApp();
    return;
  }

  state.settings = payload;
  logAudit("Configuracoes salvas", state.settings.barName);
  saveState();
  notify("Configuracoes salvas.");
  renderApp();
}

function stockAlerts() {
  const productAlerts = state.products
    .filter((product) => product.active && productAvailableStock(product) <= product.minStock)
    .map((product) => ({
      type: productAvailableStock(product) <= Number(product.criticalStock || 0) ? "Produto critico" : "Produto baixo",
      name: product.name,
      stock: productStockText(product),
      minStock: product.minStock,
    }));
  const ingredientAlerts = state.ingredients
    .filter((ingredient) => ingredient.stock <= ingredient.minStock)
    .map((ingredient) => ({ type: "Insumo baixo", name: ingredient.name, stock: ingredient.stock, minStock: ingredient.minStock }));
  const productExpiryAlerts = state.products
    .filter((product) => product.active && product.expiresAt && productExpiryStatus(product).className !== "green")
    .map((product) => ({ type: "Validade produto", name: product.name, stock: productExpiryStatus(product).label, minStock: "" }));
  const lotAlerts = state.stockLots
    .filter((lot) => lotStatus(lot).className !== "green")
    .map((lot) => ({ type: "Validade", name: `${inventoryItemName(lot)} (${lot.batch})`, stock: lotStatus(lot).label, minStock: "" }));
  return [...productAlerts, ...ingredientAlerts, ...productExpiryAlerts, ...lotAlerts];
}

function alertsList() {
  const alerts = stockAlerts();
  const pendingFiado = state.clients.filter((client) => Number(client.debt || 0) > 0);
  const pendingOrders = state.kitchenOrders.filter((order) => order.status !== "Entregue");
  const rows = [
    ...alerts.map((alert) => `${alert.type}: ${alert.name} ${alert.minStock !== "" ? `(${alert.stock}/${alert.minStock})` : `- ${alert.stock}`}`),
    ...pendingFiado.slice(0, 3).map((client) => `Fiado em aberto: ${client.name} - ${money(client.debt)}`),
    ...(pendingOrders.length ? [`Pedidos na fila: ${pendingOrders.length}`] : []),
  ];

  if (!rows.length) return '<div class="empty">Nenhum alerta importante agora.</div>';
  return `<div class="alert-list">${rows.map((row) => `<div class="alert-item"><span>!</span><strong>${row}</strong></div>`).join("")}</div>`;
}

function cashSummary(openCash = getOpenCash()) {
  const payments = Object.fromEntries(cashPaymentMethods.map((method) => [method, 0]));
  const since = openCash ? new Date(openCash.openedAt) : startOfToday();
  const sales = state.sales.filter((sale) => new Date(sale.date) >= since && isReceivedSale(sale));

  sales.forEach((sale) => {
    salePaymentParts(sale).forEach((part) => {
      if (part.method === "Fiado") return;
      const key = normalizePaymentMethod(part.method);
      payments[key] = Number(payments[key] || 0) + Number(part.amount || 0);
    });
  });

  const movements = state.cashMovements
    .filter((movement) => new Date(movement.date) >= since)
    .reduce((sum, movement) => {
      if (movement.type === "suprimento" || movement.type === "entrada") return sum + movement.amount;
      return sum - movement.amount;
    }, 0);

  const expected = Number(openCash?.openingAmount || 0) + Object.values(payments).reduce((sum, value) => sum + value, 0) + movements;
  return { payments, movements, expected };
}

function cashSummaryPanel(openCash) {
  const summary = cashSummary(openCash);
  return `
    <div class="summary-list">
      <div class="summary-row"><span>Status</span><strong>${openCash ? "Aberto" : "Fechado"}</strong></div>
      <div class="summary-row"><span>Abertura</span><strong>${money(openCash?.openingAmount || 0)}</strong></div>
      <div class="summary-row"><span>Movimentos</span><strong>${money(summary.movements)}</strong></div>
      <div class="summary-row total"><span>Esperado</span><strong>${money(summary.expected)}</strong></div>
    </div>
  `;
}

function lotStatus(lot) {
  const today = startOfToday();
  const expires = new Date(`${lot.expiresAt}T00:00:00`);
  const days = Math.ceil((expires - today) / 86400000);
  if (days < 0) return { label: "Vencido", className: "red", days };
  if (days === 0) return { label: "Vence hoje", className: "red", days };
  if (days <= 7) return { label: `${days} dias`, className: "red", days };
  if (days <= 30) return { label: `${days} dias`, className: "amber", days };
  return { label: "Ok", className: "green", days };
}

function auditList(logs) {
  if (!logs.length) return '<div class="empty">Nenhum registro de auditoria.</div>';
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Data</th><th>Usuario</th><th>Acao</th><th>Detalhes</th></tr></thead>
        <tbody>
          ${logs
            .map(
              (entry) => `
                <tr>
                  <td>${dateTime(entry.date)}</td>
                  <td>${userName(entry.userId)}</td>
                  <td>${entry.action}</td>
                  <td>${entry.details || ""}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function recipeToText(recipe) {
  return (recipe || [])
    .map((item) => `${ingredientName(item.ingredientId)}:${item.qty}`)
    .join(", ");
}

function parseRecipeText(text) {
  if (!text?.trim()) return [];
  return text
    .split(",")
    .map((chunk) => chunk.trim())
    .map((chunk) => {
      const [name, qty] = chunk.split(":").map((part) => part.trim());
      const ingredient = state.ingredients.find((item) => item.name.toLowerCase() === name.toLowerCase());
      if (!ingredient || !Number(qty)) return null;
      return { ingredientId: ingredient.id, qty: Number(qty) };
    })
    .filter(Boolean);
}

function applyReportFilter(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  reportFilter = {
    mode: form.get("mode"),
    start: form.get("start"),
    end: form.get("end"),
  };
  renderApp();
}

function reportSales() {
  const now = Date.now();
  let start = now - 24 * 60 * 60 * 1000;
  let end = now;
  if (reportFilter.mode === "7d") {
    start = now - 7 * 24 * 60 * 60 * 1000;
  }
  if (["monthly", "semester", "annual"].includes(reportFilter.mode)) {
    const range = salesReportPeriodRange(reportFilter.mode);
    start = range.start.getTime();
    end = range.end.getTime();
  }
  if (reportFilter.mode === "period") {
    start = reportFilter.start ? new Date(reportFilter.start).getTime() : 0;
    end = reportFilter.end ? new Date(reportFilter.end).getTime() : now;
  }

  return state.sales.filter((sale) => {
    const saleTime = new Date(sale.date).getTime();
    return saleTime >= start && saleTime <= end;
  });
}

function reportPeriodLabel() {
  if (reportFilter.mode === "7d") return "Ultimos 7 dias";
  if (["monthly", "semester", "annual"].includes(reportFilter.mode)) return salesReportPeriodRange(reportFilter.mode).label;
  if (reportFilter.mode === "period") {
    return `${reportFilter.start || "inicio"} ate ${reportFilter.end || "agora"}`;
  }
  return "Ultimas 24 horas";
}

function categoryTotals(sales = state.sales) {
  const totals = {};
  sales.forEach((sale) => {
    if (!isFinancialSale(sale)) return;
    sale.items.forEach((item) => {
      const product = state.products.find((entry) => entry.id === item.productId);
      const category = product?.category || "Sem categoria";
      totals[category] = Number(totals[category] || 0) + item.qty * item.price;
    });
  });
  return Object.entries(totals).map(([category, total]) => ({ category, total }));
}

function productProfitability(sales = state.sales) {
  const totals = {};
  sales.forEach((sale) => {
    if (!isFinancialSale(sale)) return;
    sale.items.forEach((item) => {
      if (!totals[item.productId]) {
        totals[item.productId] = { name: item.name, qty: 0, revenue: 0, cost: 0, profit: 0, margin: 0 };
      }
      totals[item.productId].qty += item.qty;
      totals[item.productId].revenue += item.qty * item.price;
      totals[item.productId].cost += item.qty * item.cost;
      totals[item.productId].profit = totals[item.productId].revenue - totals[item.productId].cost;
      totals[item.productId].margin = totals[item.productId].revenue
        ? (totals[item.productId].profit / totals[item.productId].revenue) * 100
        : 0;
    });
  });
  return Object.values(totals).sort((a, b) => b.profit - a.profit);
}

function operatorReport(sales = state.sales) {
  return state.users.map((user) => {
    const userSales = sales.filter((sale) => sale.cashierId === user.id && isFinancialSale(sale));
    return {
      name: user.name,
      sales: userSales.length,
      total: userSales.reduce((sum, sale) => sum + sale.total, 0),
      cancellations: state.cancellations.filter((cancel) => cancel.userId === user.id).length,
      cashSessions: state.cashSessions.filter((cash) => cash.userId === user.id).length,
    };
  });
}

async function payClient(clientId) {
  const client = state.clients.find((entry) => entry.id === clientId);
  if (!client || client.debt <= 0) return;

  if (isOnlineSession()) {
    const debt = Number(client.debt || 0);
    const update = await supabaseClient.from("clients").update({ debt: 0 }).eq("id", clientId);
    if (update.error) {
      notify(`Erro ao quitar fiado online: ${update.error.message}`);
      return;
    }
    const tx = await supabaseClient.from("client_transactions").insert({
      client_id: clientId,
      user_id: session.id,
      type: "pagamento",
      description: "Quitacao total",
      amount: -debt,
    });
    if (tx.error) {
      notify(`Fiado quitado, mas falhou no historico: ${tx.error.message}`);
      return;
    }
    await loadOnlineClientsData();
    logAudit("Fiado quitado online", `${client.name}: ${money(debt)}.`);
    notify("Fiado quitado no Supabase.");
    renderApp();
    return;
  }

  state.clients = state.clients.map((entry) =>
    entry.id === clientId
      ? {
          ...entry,
          debt: 0,
          transactions: [
            {
              id: id("clienttx"),
              date: new Date().toISOString(),
              type: "pagamento",
              description: "Quitacao total",
              amount: -Number(client.debt || 0),
              userId: session.id,
            },
            ...(entry.transactions || []),
          ],
        }
      : entry,
  );
  logAudit("Fiado quitado", `${client.name}: ${money(client.debt)}.`);
  saveState();
  notify("Fiado quitado.");
  renderApp();
}

function printSale(saleId) {
  const sale = state.sales.find((entry) => entry.id === saleId);
  if (!sale) return;
  const receipt = [
    state.settings.barName || APP_DISPLAY_NAME,
    state.settings.cnpj ? `CNPJ: ${state.settings.cnpj}` : "",
    state.settings.address || "",
    `Venda: ${sale.id}`,
    `Data: ${dateTime(sale.date)}`,
    `Operador: ${userName(sale.cashierId)}`,
    sale.tableName ? `Mesa: ${sale.tableName}` : "",
    sale.splitPersonName ? `Parte da conta: ${sale.splitPersonName}` : "",
    sale.splitMode ? `Divisao: ${tableSplitModeLabel(sale.splitMode)}` : "",
    "",
    ...(isExternalPaymentSale(sale) && sale.items?.length
      ? ["Pagamento externo da maquininha", ...sale.items.map((item) => `${item.qty}x ${item.name} - ${money(item.qty * item.price)}`)]
      : isExternalPaymentSale(sale)
        ? ["Pagamento externo da maquininha"]
        : sale.splitPersonName && sale.splitMode !== "items"
          ? [...new Set(sale.items.map((item) => item.name))].map((name) => `${name} - item compartilhado no rateio`)
          : sale.items.map((item) => `${item.qty}x ${item.name} - ${money(item.qty * item.price)}`)),
    "",
    `Pagamento: ${paymentDisplay(sale)}`,
    saleDiscountAmount(sale) ? `Desconto: ${money(saleDiscountAmount(sale))}` : "",
    `Total: ${money(sale.total)}`,
    Number(sale.cashReceived || 0) ? `Recebido em dinheiro: ${money(sale.cashReceived)}` : "",
    Number(sale.cashReceived || 0) ? `Troco: ${money(sale.cashChange || 0)}` : "",
    "",
    state.settings.receiptFooter || "",
  ].filter(Boolean).join("\n");
  const win = window.open("", "_blank", "width=420,height=640");
  if (!win) {
    notify("Nao foi possivel abrir a janela de impressao.");
    return;
  }
  win.document.write(`<pre style="font: 14px monospace; white-space: pre-wrap;">${receipt}</pre>`);
  win.document.close();
  win.print();
}

function ticketUnitList(sale) {
  return sale.items.flatMap((item) =>
    Array.from({ length: Number(item.qty || 0) }, (_, index) => ({
      ...item,
      unitIndex: index + 1,
      unitTotal: Number(item.price || 0),
    })),
  );
}

function attachSalePrintDetails(saleId, details = {}) {
  state.sales = state.sales.map((sale) =>
    sale.id === saleId
      ? {
          ...sale,
          tableName: details.tableName || sale.tableName || "",
          customerName: details.customerName || sale.customerName || "",
          terminalLabel: details.terminalLabel || sale.terminalLabel || "",
          cashReceived: Number(details.cashReceived || sale.cashReceived || 0),
          cashChange: Number(details.cashChange || sale.cashChange || 0),
        }
      : sale,
  );
  saveState();
}

function printSaleTicketsIndividual(saleId) {
  const sale = state.sales.find((entry) => entry.id === saleId);
  if (!sale) return;
  const units = ticketUnitList(sale);
  if (!units.length) return;
  const optionalRows = [
    sale.tableName ? ["Mesa", sale.tableName] : null,
    sale.customerName ? ["Cliente", sale.customerName] : null,
    sale.terminalLabel ? ["Maquininha", sale.terminalLabel] : null,
  ].filter(Boolean);
  const tickets = units
    .map(
      (item, index) => `
        <section class="ticket">
          <img class="ticket-logo" src="${BRAND_ICON_URL}" alt="" />
          <h1>${escapeHtml(state.settings.barName || APP_DISPLAY_NAME)}</h1>
          ${state.settings.cnpj ? `<div class="cnpj">CNPJ: ${escapeHtml(state.settings.cnpj)}</div>` : ""}
          <h2>FICHA ${index + 1} DE ${units.length}</h2>
          <div class="line"></div>
          <div class="item-name">${escapeHtml(item.name)}</div>
          <div class="item-meta">Unidade ${item.unitIndex} de ${item.qty}</div>
          <div class="line"></div>
          <div class="meta">
            <span>Venda</span><strong>${escapeHtml(sale.id.slice(-8))}</strong>
            <span>Data</span><strong>${dateTime(sale.date)}</strong>
            <span>Operador</span><strong>${escapeHtml(userName(sale.cashierId))}</strong>
            <span>Pagamento</span><strong>${escapeHtml(paymentDisplay(sale))}</strong>
            ${optionalRows.map(([label, value]) => `<span>${label}</span><strong>${escapeHtml(value)}</strong>`).join("")}
          </div>
          <div class="price">${money(item.unitTotal)}</div>
          <div class="footer">ENTREGAR MEDIANTE ESTA FICHA</div>
          <div class="fiscal-note">Ficha sem valor fiscal</div>
          <div class="count">Ficha ${index + 1} de ${units.length}</div>
        </section>
      `,
    )
    .join("");
  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Ficha ${escapeHtml(sale.id)}</title>
        <style>
          * { box-sizing: border-box; }
          @page { size: 58mm auto; margin: 0; }
          body { width: 58mm; margin: 0; background: #fff; color: #000; font-family: Arial, sans-serif; }
          .ticket { width: 58mm; min-height: 82mm; padding: 4mm 3mm; page-break-after: always; break-after: page; }
          .ticket:last-child { page-break-after: auto; break-after: auto; }
          .ticket-logo { display: block; width: 14mm; height: 14mm; margin: 0 auto 2mm; border-radius: 2mm; object-fit: cover; filter: grayscale(1) contrast(1.25); }
          h1 { margin: 0 0 2mm; text-align: center; font-size: 13px; font-weight: 800; }
          .cnpj { margin: 0 0 2mm; text-align: center; font-size: 10px; font-weight: 700; }
          h2 { margin: 0 0 3mm; text-align: center; font-size: 16px; letter-spacing: 1px; }
          .line { border-top: 1px dashed #000; margin: 3mm 0; }
          .item-name { text-align: center; font-size: 18px; font-weight: 900; text-transform: uppercase; line-height: 1.15; }
          .item-meta { margin-top: 2mm; text-align: center; font-size: 12px; font-weight: 700; }
          .meta { display: grid; grid-template-columns: 19mm 1fr; gap: 1mm; font-size: 10px; }
          .meta strong { text-align: right; }
          .price { margin-top: 4mm; text-align: center; font-size: 18px; font-weight: 900; }
          .footer { margin-top: 5mm; text-align: center; font-size: 10px; font-weight: 800; }
          .fiscal-note { margin-top: 2mm; text-align: center; font-size: 9px; font-weight: 700; }
          .count { margin-top: 2mm; text-align: center; font-size: 9px; }
          @media print {
            body { width: 58mm; }
          }
        </style>
      </head>
      <body>
        ${tickets}
      </body>
    </html>
  `;
  const win = window.open("", "_blank", "width=320,height=720");
  if (!win) {
    notify("Nao foi possivel abrir a janela de impressao da ficha.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 250);
}

function printReport(type = "complete") {
  const titleMap = {
    complete: "Relatorio geral",
    cash: "Relatorio de caixa e operadores",
    stock: "Relatorio de estoque e lucratividade",
    inventory: "Relatorio completo de inventario",
    clients: "Relatorio de clientes e fiado",
  };
  const html = buildReportHtml(type, titleMap[type] || titleMap.complete);
  const win = window.open("", "_blank", "width=980,height=720");
  if (!win) {
    notify("Nao foi possivel abrir a janela de impressao.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  logAudit("Relatorio impresso", titleMap[type] || titleMap.complete);
  saveState();
  setTimeout(() => win.print(), 250);
}

function buildReportHtml(type, title) {
  const generatedAt = dateTime(new Date().toISOString());
  const sections = [];
  if (type === "complete" || type === "cash") sections.push(reportCashSection(), reportOperatorSection());
  if (type === "complete" || type === "stock") sections.push(reportStockSection(), reportProfitabilitySection());
  if (type === "inventory") sections.push(reportFullInventorySection());
  if (type === "complete" || type === "clients") sections.push(reportClientsSection());
  if (type === "complete") sections.push(reportSalesSection(), reportAuditSection());
  const metrics = type === "inventory" ? reportInventoryPrintMetrics() : reportMetrics();

  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>${title} - ${state.settings.barName || APP_DISPLAY_NAME}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #111827; margin: 28px; }
          header { position: relative; border-bottom: 2px solid #111827; padding: 0 82px 14px 0; margin-bottom: 22px; min-height: 70px; }
          .report-logo { position: absolute; top: 0; right: 0; width: 64px; height: 64px; border-radius: 6px; object-fit: cover; }
          h1 { margin: 0; font-size: 26px; }
          h2 { margin: 24px 0 10px; font-size: 18px; }
          p { margin: 4px 0; color: #4b5563; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 18px; page-break-inside: avoid; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #f3f4f6; }
          .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 18px 0; }
          .metric { border: 1px solid #d1d5db; padding: 10px; }
          .metric span { display: block; color: #6b7280; font-size: 11px; }
          .metric strong { display: block; margin-top: 4px; font-size: 18px; }
          .muted { color: #6b7280; font-size: 11px; }
          @media print {
            body { margin: 12mm; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <header>
          <img class="report-logo" src="${BRAND_ICON_URL}" alt="" />
          <h1>${state.settings.barName || APP_DISPLAY_NAME} - ${title}</h1>
          ${state.settings.cnpj ? `<p>CNPJ: ${state.settings.cnpj}</p>` : ""}
          ${state.settings.address ? `<p>${state.settings.address}</p>` : ""}
          <p>Periodo: ${reportPeriodLabel()}</p>
          <p>Gerado em ${generatedAt} por ${session?.name || "Usuario"}</p>
        </header>
        ${metrics}
        ${sections.join("")}
      </body>
    </html>
  `;
}

function reportInventoryPrintMetrics() {
  const summary = stockInventorySummary();
  return `
    <section class="metrics">
      <div class="metric"><span>Produtos ativos</span><strong>${summary.activeProducts.length}</strong></div>
      <div class="metric"><span>Unidades em estoque</span><strong>${qty(summary.productUnits)}</strong></div>
      <div class="metric"><span>Custo estimado</span><strong>${money(summary.productCostValue + summary.ingredientCostValue)}</strong></div>
      <div class="metric"><span>Valor de venda</span><strong>${money(summary.productSaleValue)}</strong></div>
    </section>
  `;
}

function reportMetrics() {
  const activeSales = reportSales().filter(isFinancialSale);
  const receivedSales = activeSales.filter(isReceivedSale);
  const revenue = receivedSales.reduce((sum, sale) => sum + saleReceivedAmount(sale), 0);
  const profit = receivedSales.reduce((sum, sale) => sum + saleReceivedProfit(sale), 0);
  const debt = state.clients.reduce((sum, client) => sum + Number(client.debt || 0), 0);
  return `
    <section class="metrics">
      <div class="metric"><span>Receita recebida</span><strong>${money(revenue)}</strong></div>
      <div class="metric"><span>Lucro estimado</span><strong>${money(profit)}</strong></div>
      <div class="metric"><span>Vendas</span><strong>${activeSales.length}</strong></div>
      <div class="metric"><span>Fiado aberto</span><strong>${money(debt)}</strong></div>
    </section>
  `;
}

function reportCashSection() {
  const summary = cashSummary();
  return `
    <section>
      <h2>Caixa por forma de pagamento</h2>
      ${simpleTable(["Forma", "Total"], cashPaymentMethods.map((method) => [method, money(summary.payments[method] || 0)]))}
      <p><strong>Movimentos:</strong> ${money(summary.movements)} | <strong>Esperado:</strong> ${money(summary.expected)}</p>
    </section>
  `;
}

function reportOperatorSection() {
  return `
    <section>
      <h2>Turnos por operador</h2>
      ${simpleTable(
        ["Operador", "Vendas", "Total", "Cancelamentos", "Caixas"],
        operatorReport(reportSales()).map((entry) => [entry.name, entry.sales, money(entry.total), entry.cancellations, entry.cashSessions]),
      )}
    </section>
  `;
}

function reportStockSection() {
  return `
    <section>
      <h2>Estoque e alertas</h2>
      ${simpleTable(
        ["Item", "Tipo", "Saldo", "Minimo"],
        stockAlerts().map((entry) => [entry.name, entry.type, entry.stock, entry.minStock]),
      )}
      <h2>Lotes e validade</h2>
      ${simpleTable(
        ["Item", "Lote", "Qtd.", "Validade", "Status"],
        state.stockLots.map((lot) => [inventoryItemName(lot), lot.batch, lot.qty, new Date(lot.expiresAt).toLocaleDateString("pt-BR"), lotStatus(lot).label]),
      )}
    </section>
  `;
}

function productInventoryCodesText(product) {
  return [product.productCode, ...productBarcodeCodes(product)].filter(Boolean).join(" / ") || "-";
}

function reportFullInventorySection() {
  return `
    <section>
      <h2>Produtos cadastrados</h2>
      ${simpleTable(
        ["Produto", "Codigos", "Categoria", "Praca", "Saldo", "Minimo", "Critico", "Custo un.", "Valor custo", "Valor venda", "Validade", "Status"],
        state.products
          .filter((product) => product.active !== false)
          .map((product) => [
            product.name,
            productInventoryCodesText(product),
            product.category,
            product.station || "Bar",
            productStockText(product),
            qty(product.minStock),
            qty(product.criticalStock),
            money(product.cost),
            money(productAvailableStock(product) * Number(product.cost || 0)),
            money(productAvailableStock(product) * Number(product.price || 0)),
            product.expiresAt ? `${formatDateBr(product.expiresAt)} - ${productExpiryStatus(product).label}` : "-",
            stockStatus(product).label,
          ]),
      )}
      <h2>Insumos de ficha tecnica</h2>
      ${simpleTable(
        ["Insumo", "Unidade", "Saldo", "Minimo", "Custo unit.", "Valor custo", "Status"],
        state.ingredients.map((ingredient) => [
          ingredient.name,
          ingredient.unit,
          qty(ingredient.stock),
          qty(ingredient.minStock),
          money(ingredient.costPerUnit),
          money(Number(ingredient.stock || 0) * Number(ingredient.costPerUnit || 0)),
          ingredient.stock <= ingredient.minStock ? "Baixo" : "Ok",
        ]),
      )}
      <h2>Lotes e validade</h2>
      ${simpleTable(
        ["Item", "Lote", "Qtd.", "Validade", "Fornecedor", "Status"],
        state.stockLots.map((lot) => [
          inventoryItemName(lot),
          lot.batch,
          qty(lot.qty),
          new Date(lot.expiresAt).toLocaleDateString("pt-BR"),
          supplierName(lot.supplierId),
          lotStatus(lot).label,
        ]),
      )}
      <h2>Ultimas contagens fisicas</h2>
      ${simpleTable(
        ["Data", "Item", "Esperado", "Contado", "Diferenca", "Usuario", "Observacao"],
        state.inventoryCounts.slice(0, 80).map((count) => [
          dateTime(count.date),
          inventoryItemName(count),
          qty(count.expected),
          qty(count.counted),
          qty(count.difference),
          userName(count.userId),
          count.notes || "",
        ]),
      )}
      <h2>Alertas do estoque</h2>
      ${simpleTable(
        ["Tipo", "Item", "Saldo/Status", "Minimo"],
        stockAlerts().map((entry) => [entry.type, entry.name, entry.stock, entry.minStock || "-"]),
      )}
    </section>
  `;
}

function safeFileName(value) {
  return String(value || "arquivo")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function imageUrlToDataUrl(url) {
  if (!url) return "";
  if (url.startsWith("data:image/")) return url;
  const response = await fetch(url);
  if (!response.ok) throw new Error("imagem indisponivel");
  const blob = await response.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("falha ao ler imagem"));
    reader.readAsDataURL(blob);
  });
}

let brandIconDataUrlPromise = null;

async function getBrandIconDataUrl() {
  if (!brandIconDataUrlPromise) {
    brandIconDataUrlPromise = imageUrlToDataUrl(BRAND_ICON_URL).catch(() => "");
  }
  return brandIconDataUrlPromise;
}

function addPdfBrandIcon(doc, imageData, size = 50) {
  if (!imageData) return;
  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage(imageData, "PNG", pageWidth - 40 - size, 22, size, size, undefined, "FAST");
  } catch {
    // O relatorio continua disponivel mesmo se o navegador nao conseguir incorporar a logo.
  }
}

async function downloadPriceCatalogPdf() {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    notify("Gerador de PDF ainda nao carregou. Atualize a pagina e tente novamente.");
    return;
  }

  const products = priceCatalogProducts();
  if (!products.length) {
    notify("Cadastre pelo menos um produto ativo para gerar o catalogo.");
    return;
  }

  notify("Preparando o catalogo em PDF...");
  const productImages = await Promise.all(
    products.map(async (product) => {
      try {
        return await imageUrlToDataUrl(productImageUrl(product));
      } catch {
        return "";
      }
    }),
  );
  const brandIconData = await getBrandIconDataUrl();

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const businessName = state.settings.barName || APP_DISPLAY_NAME;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const columnGap = 10;
  const rowGap = 10;
  const cardWidth = (pageWidth - margin * 2 - columnGap * 2) / 3;
  const cardHeight = 86;
  const contentTop = 104;
  const contentBottom = pageHeight - 44;
  const rowsPerPage = Math.max(1, Math.floor((contentBottom - contentTop + rowGap) / (cardHeight + rowGap)));
  const productsPerPage = rowsPerPage * 3;
  const pageCount = Math.ceil(products.length / productsPerPage);

  doc.setProperties({
    title: `${businessName} - Catalogo de precos`,
    subject: "Catalogo de produtos e precos",
    author: session?.name || "Usuario",
  });

  for (let page = 0; page < pageCount; page += 1) {
    if (page > 0) doc.addPage();

    doc.setFillColor(15, 118, 110);
    doc.rect(0, 0, pageWidth, 72, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(businessName, margin, 34);
    doc.setFontSize(11);
    doc.text("CATALOGO DE PRECOS", margin, 54);
    addPdfBrandIcon(doc, brandIconData, 46);

    const pageProducts = products.slice(page * productsPerPage, (page + 1) * productsPerPage);
    pageProducts.forEach((product, index) => {
      const column = index % 3;
      const row = Math.floor(index / 3);
      const x = margin + column * (cardWidth + columnGap);
      const y = contentTop + row * (cardHeight + rowGap);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(x, y, cardWidth, cardHeight, 4, 4, "FD");
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const imageData = productImages[page * productsPerPage + index];
      const textX = imageData ? x + 62 : x + 9;
      if (imageData) {
        const format = imageData.startsWith("data:image/png") ? "PNG" : "JPEG";
        try {
          doc.addImage(imageData, format, x + 9, y + 9, 44, 44, undefined, "FAST");
        } catch {
          // O catalogo continua mesmo quando uma imagem especifica nao pode ser processada.
        }
      }
      const nameLines = doc.splitTextToSize(String(product.name || "Produto"), cardWidth - (textX - x) - 9).slice(0, 3);
      doc.text(nameLines, textX, y + 18);
      doc.setTextColor(15, 118, 110);
      doc.setFontSize(15);
      doc.text(money(product.price), x + 9, y + 75);
    });

    doc.setTextColor(107, 114, 128);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Pagina ${page + 1} de ${pageCount}`, pageWidth - margin, pageHeight - 22, { align: "right" });
  }

  const date = new Date().toISOString().slice(0, 10);
  doc.save(`catalogo-de-precos-${safeFileName(businessName)}-${date}.pdf`);
  logAudit("Catalogo de precos baixado", `${products.length} produtos.`);
  saveState();
  notify("Catalogo de precos baixado em PDF.");
}

function addInventoryPdfTable(doc, title, headers, rows, startY) {
  let y = startY;
  if (y > doc.internal.pageSize.getHeight() - 90) {
    doc.addPage();
    y = 40;
  }
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text(title, 40, y);
  doc.autoTable({
    head: [headers],
    body: rows.length ? rows : [["Nenhum dado para exibir."]],
    startY: y + 8,
    margin: { left: 40, right: 40 },
    theme: "grid",
    styles: {
      fontSize: 7,
      cellPadding: 3,
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [15, 118, 110],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });
  return (doc.lastAutoTable?.finalY || y) + 22;
}

async function downloadInventoryPdf() {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    notify("Gerador de PDF ainda nao carregou. Atualize a pagina e tente novamente.");
    return;
  }

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  if (typeof doc.autoTable !== "function") {
    notify("Tabela do PDF ainda nao carregou. Atualize a pagina e tente novamente.");
    return;
  }
  const brandIconData = await getBrandIconDataUrl();

  const summary = stockInventorySummary();
  const title = "Relatorio completo de inventario";
  const businessName = state.settings.barName || APP_DISPLAY_NAME;
  const generatedAt = dateTime(new Date().toISOString());

  doc.setProperties({
    title: `${businessName} - ${title}`,
    subject: "Inventario de estoque",
    author: session?.name || "Usuario",
  });

  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  doc.text(businessName, 40, 42);
  doc.setFontSize(12);
  doc.text(title, 40, 62);
  addPdfBrandIcon(doc, brandIconData);
  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99);
  const headerLines = [
    state.settings.cnpj ? `CNPJ: ${state.settings.cnpj}` : "",
    state.settings.address || "",
    `Gerado em ${generatedAt} por ${session?.name || "Usuario"}`,
  ].filter(Boolean);
  headerLines.forEach((line, index) => doc.text(line, 40, 80 + index * 12));

  doc.autoTable({
    body: [
      ["Produtos ativos", summary.activeProducts.length, "Unidades em estoque", qty(summary.productUnits)],
      ["Custo estimado", money(summary.productCostValue + summary.ingredientCostValue), "Valor de venda", money(summary.productSaleValue)],
      ["Alertas do estoque", summary.alerts.length, "Contagens registradas", state.inventoryCounts.length],
    ],
    startY: 122,
    margin: { left: 40, right: 40 },
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: "bold", fillColor: [241, 245, 249] },
      2: { fontStyle: "bold", fillColor: [241, 245, 249] },
    },
  });

  let y = (doc.lastAutoTable?.finalY || 122) + 24;
  y = addInventoryPdfTable(
    doc,
    "Produtos cadastrados",
    ["Produto", "Codigos", "Categoria", "Praca", "Saldo", "Min.", "Crit.", "Custo un.", "Valor custo", "Valor venda", "Validade", "Status"],
    state.products
      .filter((product) => product.active !== false)
      .map((product) => [
        product.name,
        productInventoryCodesText(product),
        product.category,
        product.station || "Bar",
        productStockText(product),
        qty(product.minStock),
        qty(product.criticalStock),
        money(product.cost),
        money(productAvailableStock(product) * Number(product.cost || 0)),
        money(productAvailableStock(product) * Number(product.price || 0)),
        product.expiresAt ? `${formatDateBr(product.expiresAt)} - ${productExpiryStatus(product).label}` : "-",
        stockStatus(product).label,
      ]),
    y,
  );
  y = addInventoryPdfTable(
    doc,
    "Insumos de ficha tecnica",
    ["Insumo", "Unidade", "Saldo", "Minimo", "Custo unit.", "Valor custo", "Status"],
    state.ingredients.map((ingredient) => [
      ingredient.name,
      ingredient.unit,
      qty(ingredient.stock),
      qty(ingredient.minStock),
      money(ingredient.costPerUnit),
      money(Number(ingredient.stock || 0) * Number(ingredient.costPerUnit || 0)),
      ingredient.stock <= ingredient.minStock ? "Baixo" : "Ok",
    ]),
    y,
  );
  y = addInventoryPdfTable(
    doc,
    "Lotes e validade",
    ["Item", "Lote", "Qtd.", "Validade", "Fornecedor", "Status"],
    state.stockLots.map((lot) => [
      inventoryItemName(lot),
      lot.batch,
      qty(lot.qty),
      new Date(lot.expiresAt).toLocaleDateString("pt-BR"),
      supplierName(lot.supplierId),
      lotStatus(lot).label,
    ]),
    y,
  );
  y = addInventoryPdfTable(
    doc,
    "Ultimas contagens fisicas",
    ["Data", "Item", "Esperado", "Contado", "Diferenca", "Usuario", "Observacao"],
    state.inventoryCounts.slice(0, 80).map((count) => [
      dateTime(count.date),
      inventoryItemName(count),
      qty(count.expected),
      qty(count.counted),
      qty(count.difference),
      userName(count.userId),
      count.notes || "",
    ]),
    y,
  );
  addInventoryPdfTable(
    doc,
    "Alertas do estoque",
    ["Tipo", "Item", "Saldo/Status", "Minimo"],
    stockAlerts().map((entry) => [entry.type, entry.name, entry.stock, entry.minStock || "-"]),
    y,
  );

  const pageCount = doc.internal.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Pagina ${page} de ${pageCount}`, doc.internal.pageSize.getWidth() - 88, doc.internal.pageSize.getHeight() - 24);
  }

  const date = new Date().toISOString().slice(0, 10);
  doc.save(`inventario-${safeFileName(businessName)}-${date}.pdf`);
  logAudit("PDF de inventario baixado", title);
  saveState();
  notify("PDF do inventario baixado.");
}

function reportProfitabilitySection() {
  return `
    <section>
      <h2>Lucratividade por produto</h2>
      ${simpleTable(
        ["Produto", "Qtd.", "Receita", "Lucro", "Margem"],
        productProfitability(reportSales()).map((entry) => [entry.name, entry.qty, money(entry.revenue), money(entry.profit), `${entry.margin.toFixed(1)}%`]),
      )}
    </section>
  `;
}

function reportClientsSection() {
  return `
    <section>
      <h2>Clientes e fiado</h2>
      ${simpleTable(
        ["Cliente", "Telefone", "Saldo", "Limite", "Status"],
        state.clients.map((client) => [
          client.name,
          client.phone || "-",
          money(client.debt),
          money(client.creditLimit),
          Number(client.debt || 0) > Number(client.creditLimit || 0) ? "Acima do limite" : "Ok",
        ]),
      )}
    </section>
  `;
}

function reportSalesSection() {
  return `
    <section>
      <h2>Vendas</h2>
      ${simpleTable(
        ["Data", "Operador", "Origem/itens", "Pagamento", "Status", "Desc.", "Total", "Lucro"],
        reportSales()
          .slice()
          .reverse()
          .map((sale) => [
            dateTime(sale.date),
            userName(sale.cashierId),
            saleItemsDescription(sale),
            paymentDisplay(sale),
            sale.status || "Concluida",
            saleDiscountAmount(sale) ? money(saleDiscountAmount(sale)) : "-",
            money(saleDisplayTotal(sale)),
            money(saleDisplayProfit(sale)),
          ]),
      )}
    </section>
  `;
}

function reportAuditSection() {
  return `
    <section>
      <h2>Auditoria</h2>
      ${simpleTable(
        ["Data", "Usuario", "Acao", "Detalhes"],
        state.auditLog.slice(0, 80).map((entry) => [dateTime(entry.date), userName(entry.userId), entry.action, entry.details || ""]),
      )}
    </section>
  `;
}

function simpleTable(headers, rows) {
  if (!rows.length) return "<p>Nenhum dado para exibir.</p>";
  return `
    <table>
      <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
}

function exportSalesCsv() {
  const rows = [
    ["id", "data", "operador", "origem_itens", "pagamento", "status", "desconto", "total", "custo", "lucro"],
    ...reportSales().map((sale) => [
      sale.id,
      sale.date,
      userName(sale.cashierId),
      saleItemsDescription(sale),
      paymentDisplay(sale),
      sale.status || "Concluida",
      saleDiscountAmount(sale),
      saleDisplayTotal(sale),
      sale.cost,
      saleDisplayProfit(sale),
    ]),
  ];
  downloadFile("distribuidora-america-bj-vendas.csv", rows.map((row) => row.join(";")).join("\n"), "text/csv");
  logAudit("CSV exportado", "Relatorio de vendas gerado.");
  saveState();
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function onlineCard(title, text, status) {
  return `
    <section class="card pad online-card">
      <span class="status blue">${status}</span>
      <h3>${title}</h3>
      <p>${text}</p>
    </section>
  `;
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function getOpenCash() {
  return state.cashSessions.find((cash) => !cash.closedAt);
}

function cashSessionCode(cash) {
  if (cash?.cashCode) return cash.cashCode;
  const ordered = state.cashSessions
    .slice()
    .sort((a, b) => new Date(a.openedAt || 0) - new Date(b.openedAt || 0));
  const index = ordered.findIndex((entry) => entry.id === cash?.id);
  return `CAIXA-${String(index + 1 || 1).padStart(4, "0")}`;
}

function nextCashSessionCode() {
  return `CAIXA-${String((state.cashSessions || []).length + 1).padStart(4, "0")}`;
}

function localDateKey(value = new Date()) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function automaticCashOpenAt(dateKey) {
  const [year, month, day] = String(dateKey || "").split("-").map(Number);
  return new Date(year, month - 1, day, DAILY_CASH_OPEN_HOUR, 0, 0, 0);
}

function automaticCashSessionId(dateKey) {
  const dateDigits = String(dateKey || "").replace(/\D/g, "").padEnd(12, "0").slice(0, 12);
  return `a0600000-0000-4000-8000-${dateDigits}`;
}

function hasCashSessionForAutomaticDate(dateKey) {
  return state.cashSessions.some((cash) => {
    const openedAt = new Date(cash.openedAt);
    return localDateKey(openedAt) === dateKey && openedAt.getHours() >= DAILY_CASH_OPEN_HOUR;
  });
}

async function ensureDailyCashOpen({ notifyUser = false } = {}) {
  if (!session || automaticCashOpeningInProgress) return false;

  const now = new Date();
  if (now.getHours() < DAILY_CASH_OPEN_HOUR) return false;
  if (session.online && !isOnlineSession()) return false;

  const dateKey = localDateKey(now);
  const openedAt = automaticCashOpenAt(dateKey).toISOString();
  const notes = "Abertura automatica diaria as 06:00.";
  automaticCashOpeningInProgress = true;

  try {
    if (
      isOnlineSession() &&
      !hasCashSessionForAutomaticDate(dateKey) &&
      Date.now() - automaticCashLastCloudRefreshAt >= AUTOMATIC_CASH_CLOUD_REFRESH_MS
    ) {
      await loadOnlineCashData();
    }

    if (getOpenCash() || hasCashSessionForAutomaticDate(dateKey)) return false;

    if (isOnlineSession()) {
      const { error } = await supabaseClient.from("cash_sessions").upsert(
        {
          id: automaticCashSessionId(dateKey),
          user_id: session.id,
          opened_at: openedAt,
          opening_amount: 0,
          notes,
        },
        { onConflict: "id", ignoreDuplicates: true },
      );

      if (error) {
        if (notifyUser) notify(`Erro na abertura automatica do caixa: ${error.message}`);
        return false;
      }

      await loadOnlineCashData();
      logAudit("Caixa aberto automaticamente", `${formatDateKeyBr(dateKey)} as 06:00, com ${money(0)}.`);
      saveState();
    } else {
      const cashCode = nextCashSessionCode();
      state.cashSessions.push({
        id: automaticCashSessionId(dateKey),
        cashCode,
        openedAt,
        closedAt: null,
        userId: session.id,
        openingAmount: 0,
        closingAmount: null,
        closingBreakdown: null,
        expectedAmount: null,
        difference: null,
        notes,
      });
      logAudit("Caixa aberto automaticamente", `${cashCode}: ${formatDateKeyBr(dateKey)} as 06:00, com ${money(0)}.`);
      saveState();
    }

    if (notifyUser) notify("Caixa do dia aberto automaticamente com saldo inicial de R$ 0,00.");
    return true;
  } finally {
    automaticCashOpeningInProgress = false;
  }
}

function datetimeLocalValue(value = new Date()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${localDateKey(date)}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatDateKeyBr(dateKey) {
  const [year, month, day] = String(dateKey || "").split("-");
  if (!year || !month || !day) return "-";
  return `${day}/${month}/${year}`;
}

function salesForDateKey(dateKey, { includeCanceled = false } = {}) {
  return state.sales.filter((sale) => {
    if (!includeCanceled && sale.status === "Cancelada") return false;
    return localDateKey(sale.date) === dateKey;
  });
}

function buildDailySalesTotal(dateKey, source = "automatico") {
  const sales = salesForDateKey(dateKey, { includeCanceled: false });
  const financialSales = sales.filter(isFinancialSale);
  const payments = Object.fromEntries(paymentMethods.map((method) => [method, 0]));
  financialSales.forEach((sale) => {
    salePaymentParts(sale).forEach((part) => {
      payments[part.method] = Number(payments[part.method] || 0) + Number(part.amount || 0);
    });
  });

  return {
    id: dateKey,
    date: dateKey,
    updatedAt: new Date().toISOString(),
    source,
    salesCount: sales.length,
    receivedCount: financialSales.filter((sale) => saleStoredReceivedAmount(sale) > 0).length,
    fiadoCount: financialSales.filter((sale) => saleStoredFiadoAmount(sale) > 0).length,
    itemCount: sales.reduce((sum, sale) => sum + (sale.items || []).reduce((itemSum, item) => itemSum + Number(item.qty || 0), 0), 0),
    totalSold: financialSales.reduce((sum, sale) => sum + Number(sale.total || 0), 0),
    received: financialSales.reduce((sum, sale) => sum + saleStoredReceivedAmount(sale), 0),
    fiado: financialSales.reduce((sum, sale) => sum + saleStoredFiadoAmount(sale), 0),
    profit: financialSales.reduce((sum, sale) => sum + saleStoredProfit(sale), 0),
    payments,
  };
}

function storeDailySalesTotal(dateKey = localDateKey(), source = "automatico") {
  const summary = buildDailySalesTotal(dateKey, source);
  if (!summary.salesCount && !(state.dailySalesTotals || []).some((entry) => entry.date === dateKey)) return null;
  state.dailySalesTotals = [
    summary,
    ...(state.dailySalesTotals || []).filter((entry) => entry.date !== dateKey),
  ].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return summary;
}

function rebuildDailySalesTotalsFromSales(source = "recalculado") {
  const dateKeys = [...new Set((state.sales || []).map((sale) => localDateKey(sale.date)).filter(Boolean))];
  dateKeys.forEach((dateKey) => storeDailySalesTotal(dateKey, source));
  return dateKeys.length;
}

function dailySalesTotalsForDisplay() {
  const keys = new Set([
    ...(state.dailySalesTotals || []).map((entry) => entry.date),
    ...state.sales.map((sale) => localDateKey(sale.date)),
  ]);
  return [...keys]
    .map((dateKey) => {
      const stored = (state.dailySalesTotals || []).find((entry) => entry.date === dateKey);
      const computed = buildDailySalesTotal(dateKey, stored?.source || "calculado");
      return computed.salesCount ? { ...stored, ...computed, updatedAt: stored?.updatedAt || computed.updatedAt } : stored;
    })
    .filter(Boolean)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function renderDailySalesTotalsTable() {
  const totals = dailySalesTotalsForDisplay().slice(0, 60);
  if (!totals.length) return '<div class="empty">Nenhum total diario armazenado ainda.</div>';
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Dia</th>
            <th>Venda bruta recebida</th>
            <th>Fiado separado</th>
            <th>Total geral</th>
            <th>Lucro</th>
            <th>Vendas</th>
            <th>Itens</th>
            <th>Pix</th>
            <th>Debito</th>
            <th>Credito</th>
            <th>Dinheiro</th>
            <th>Atualizado</th>
          </tr>
        </thead>
        <tbody>
          ${totals
            .map(
              (entry) => `
                <tr>
                  <td><strong>${formatDateKeyBr(entry.date)}</strong></td>
                  <td>${money(entry.received)}</td>
                  <td>${money(entry.fiado)}</td>
                  <td>${money(entry.totalSold)}</td>
                  <td>${money(entry.profit)}</td>
                  <td>${entry.salesCount}</td>
                  <td>${qty(entry.itemCount)}</td>
                  <td>${money(entry.payments?.Pix || 0)}</td>
                  <td>${money(entry.payments?.Debito || 0)}</td>
                  <td>${money(entry.payments?.Credito || 0)}</td>
                  <td>${money(entry.payments?.Dinheiro || 0)}</td>
                  <td>${entry.updatedAt ? dateTime(entry.updatedAt) : "-"}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function salesForToday({ includeInactive = false } = {}) {
  const now = new Date();
  return state.sales.filter((sale) => {
    const date = new Date(sale.date);
    return (
      (includeInactive || isFinancialSale(sale)) &&
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  });
}

function userName(userId) {
  return state.users.find((user) => user.id === userId)?.name || "Usuario";
}

function supplierName(supplierId) {
  return state.suppliers.find((supplier) => supplier.id === supplierId)?.name || "Sem fornecedor";
}

function ingredientName(ingredientId) {
  return state.ingredients.find((ingredient) => ingredient.id === ingredientId)?.name || "Insumo";
}

function inventoryItemName(count) {
  if (count.itemType === "ingredient") return ingredientName(count.itemId);
  return state.products.find((product) => product.id === count.itemId)?.name || "Item";
}

const originalBindViewEvents = bindViewEvents;
bindViewEvents = function patchedBindViewEvents() {
  originalBindViewEvents();
  bindCashForm();
  bindModalForms();
};

setInterval(async () => {
  if (session && (await ensureDailyCashOpen({ notifyUser: true }))) renderApp();
  if (session?.online && pendingOfflineOperations().length && navigator.onLine !== false && !connectionState.syncing) {
    await syncPendingOfflineSales();
  } else if (navigator.onLine !== false && !connectionState.cloudReachable) {
    await checkCloudConnection(3000);
  }
}, 60 * 1000);

syncChannel?.addEventListener("message", (event) => {
  if (event.data?.type !== "state-updated") return;
  if (realtimeInteractionLocked()) return;
  suppressBroadcast = true;
  state = loadState();
  if (session) {
    session = state.users.find((user) => user.id === session.id) || session;
  }
  suppressBroadcast = false;
  renderApp();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  notify("Aplicativo instalado com sucesso.");
  if (session) renderApp();
  else renderLogin();
});

window.addEventListener("offline", () => {
  connectionState.browserOnline = false;
  setCloudReachable(false, "O aparelho esta sem internet.");
  stopRealtimeSync();
  if (session) notify("Modo offline ativado. As proximas vendas ficarao guardadas neste aparelho.");
});

window.addEventListener("online", async () => {
  connectionState.browserOnline = true;
  updateConnectionIndicators();
  const reachable = await checkCloudConnection();
  if (!reachable) return;
  if (session?.offlineCached) await restoreOnlineSession();
  if (session && (await ensureDailyCashOpen({ notifyUser: true }))) renderApp();
  if (session && pendingOfflineOperations().length) await syncPendingOfflineSales();
  else if (session) notify("Conexao restabelecida.");
  startRealtimeSync();
  queueFullRealtimeRefresh();
});

async function bootstrapApp() {
  renderLogin();
  connectionState.browserOnline = navigator.onLine !== false;
  let restored = false;
  if (connectionState.browserOnline && (await checkCloudConnection())) {
    restored = await restoreOnlineSession();
  }
  if (!restored) restoreCachedOfflineSession();
  if (session?.online && pendingOfflineOperations().length && hasNetworkConnection()) {
    setTimeout(() => syncPendingOfflineSales(), 800);
  }
}

bootstrapApp();
