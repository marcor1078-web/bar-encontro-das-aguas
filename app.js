const STORAGE_KEY = "barcontrol:v1";
const MP_PENDING_ORDER_KEY = "barcontrol:mercadopago-pending-order";
const MP_SELECTED_TERMINAL_KEY = "barcontrol:mercadopago-selected-terminal";

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
      "reports",
      "team",
      "settings",
      "online",
    ],
  },
  manager: {
    label: "Gerente",
    permissions: ["pos", "tables", "waiter", "kitchen", "sales", "cash", "stock", "suppliers", "clients", "reports"],
  },
  cashier: {
    label: "Caixa",
    permissions: ["pos", "tables", "sales", "cash", "clients"],
  },
  stock: {
    label: "Estoque",
    permissions: ["kitchen", "stock", "suppliers"],
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
  reports: "Relatorios e backup",
  team: "Gerenciar acessos",
  settings: "Dados do bar e operacao",
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
  menu: '<path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path>',
  close: '<path d="M6 6l12 12"></path><path d="M18 6L6 18"></path>',
  logout: '<path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path><path d="M21 4v16"></path>',
  sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M4.93 19.07l1.41-1.41"></path><path d="M17.66 6.34l1.41-1.41"></path>',
  moon: '<path d="M21 13a8 8 0 1 1-10-10 7 7 0 0 0 10 10Z"></path>',
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
    { id: "sup-001", name: "Distribuidora Central", contact: "compras@central.local", phone: "(11) 99999-0101" },
    { id: "sup-002", name: "Hortifruti da Vila", contact: "Joao", phone: "(11) 98888-0202" },
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
  tables: Array.from({ length: 12 }, (_, index) => ({
    id: `table-${index + 1}`,
    name: `Mesa ${index + 1}`,
    customerName: "",
    status: "Livre",
    openedAt: null,
    serverId: null,
    clientId: "cl-001",
    items: [],
  })),
  cancellations: [],
  backupHistory: [],
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
    pwaEnabled: true,
    syncMode: "local",
    barName: "BAR ENCONTRO DAS AGUAS",
    cnpj: "",
    address: "",
    serviceFee: 10,
    receiptFooter: "Obrigado pela preferencia.",
    autoBackup: true,
    lastAutoBackup: null,
    lastAutoBackupAt: null,
    backupIntervalMinutes: 30,
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
let currentModal = null;
let searchTerm = "";
let categoryFilter = "Todos";
let reportFilter = { mode: "24h", start: "", end: "" };
let suppressBroadcast = false;

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
    ...sale,
  }));
  nextState.ingredients = nextState.ingredients || structuredClone(defaultState.ingredients);
  nextState.suppliers = nextState.suppliers || structuredClone(defaultState.suppliers);
  nextState.purchases = nextState.purchases || structuredClone(defaultState.purchases);
  nextState.inventoryCounts = nextState.inventoryCounts || structuredClone(defaultState.inventoryCounts);
  nextState.stockLots = nextState.stockLots || structuredClone(defaultState.stockLots);
  nextState.tables = (nextState.tables || structuredClone(defaultState.tables)).map((table) => ({
    customerName: "",
    ...table,
  }));
  nextState.cancellations = nextState.cancellations || [];
  nextState.backupHistory = nextState.backupHistory || [];
  nextState.expenses = nextState.expenses || [];
  nextState.kitchenOrders = nextState.kitchenOrders || structuredClone(defaultState.kitchenOrders);
  nextState.clients = (nextState.clients || structuredClone(defaultState.clients)).map((client) => ({
    creditLimit: 0,
    transactions: [],
    ...client,
  }));
  nextState.auditLog = nextState.auditLog || structuredClone(defaultState.auditLog);
  nextState.settings = { ...structuredClone(defaultState.settings), ...(nextState.settings || {}) };
  if (nextState.settings.barName === "BarControl") {
    nextState.settings.barName = "BAR ENCONTRO DAS AGUAS";
  }
  nextState.settings.shiftStartView = {
    ...structuredClone(defaultState.settings.shiftStartView),
    ...(nextState.settings.shiftStartView || {}),
  };
  nextState.users = (nextState.users || []).map((user) => ({
    showOnLogin: false,
    ...user,
    permissions: getUserPermissions(user),
  }));
  return nextState;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!suppressBroadcast) {
    syncChannel?.postMessage({ type: "state-updated", at: Date.now() });
  }
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function dateTime(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
  renderApp();
  if (["pos", "waiter"].includes(view) && isOnlineSession() && !mercadoPagoPointStatus.checked) {
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

async function runScheduledBackup() {
  if (!state.settings.autoBackup) return;
  const intervalMs = Number(state.settings.backupIntervalMinutes || 30) * 60 * 1000;
  const lastBackup = Date.parse(state.settings.lastAutoBackupAt || state.settings.lastAutoBackup || "");
  if (lastBackup && Date.now() - lastBackup < intervalMs) return;

  if (isOnlineSession() && (await recordOnlineBackup("automatico"))) {
    logAudit("Backup automatico online", "Snapshot de 30 minutos registrado no Supabase.");
    saveState();
    return;
  }

  state.backupHistory.unshift({
    id: id("backup"),
    date: new Date().toISOString(),
    type: "automatico",
    size: JSON.stringify(state).length,
  });
  state.backupHistory = state.backupHistory.slice(0, 30);
  state.settings.lastAutoBackupAt = new Date().toISOString();
  state.settings.lastAutoBackup = state.settings.lastAutoBackupAt.slice(0, 10);
  logAudit("Backup automatico", "Snapshot local de 30 minutos registrado.");
  saveState();
}

function isSupabaseReady() {
  return Boolean(supabaseClient && supabaseConfig.url && supabaseConfig.publishableKey);
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
      .select("bar_name, service_fee, auto_backup, backup_interval_minutes")
      .eq("id", "main")
      .single();

    if (error) throw error;

    supabaseStatus = {
      checked: true,
      ok: true,
      message: `Conectado ao banco: ${data.bar_name || "BAR ENCONTRO DAS AGUAS"}.`,
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
  return payment === "Pix" || payment === "Debito" || payment === "Credito";
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

function getSelectedMercadoPagoTerminalId() {
  return localStorage.getItem(MP_SELECTED_TERMINAL_KEY) || mercadoPagoPointStatus.terminalId || "";
}

function setSelectedMercadoPagoTerminalId(terminalId) {
  const cleanTerminalId = String(terminalId || "").trim();
  if (cleanTerminalId) localStorage.setItem(MP_SELECTED_TERMINAL_KEY, cleanTerminalId);
}

function mercadoPagoTerminalName(terminal, index = 0) {
  const serial = String(terminal.id || "").split("__").pop() || terminal.id || "Terminal";
  const mode = terminal.operating_mode ? ` - ${terminal.operating_mode}` : "";
  return `Maquininha ${index + 1} - ${serial}${mode}`;
}

function renderMercadoPagoTerminalField() {
  if (!mercadoPagoPointStatus.enabled || !mercadoPagoPointStatus.terminals.length) return "";
  const selectedTerminalId = getSelectedMercadoPagoTerminalId();
  return `
    <label class="field">
      <span>Maquininha Mercado Pago</span>
      <select id="point-terminal-id" data-point-terminal>
        ${mercadoPagoPointStatus.terminals
          .map(
            (terminal, index) =>
              `<option value="${terminal.id}" ${terminal.id === selectedTerminalId ? "selected" : ""}>${mercadoPagoTerminalName(terminal, index)}</option>`,
          )
          .join("")}
      </select>
    </label>
  `;
}

async function loadMercadoPagoPointStatus(force = false) {
  if (mercadoPagoPointStatus.checked && !force) return mercadoPagoPointStatus;

  try {
    const response = await fetch("/api/mercadopago/config");
    if (!response.ok) throw new Error("Endpoint da Vercel ainda nao disponivel.");
    const data = await response.json();
    let terminals = [];
    if (data.enabled) {
      const terminalsResponse = await fetch("/api/mercadopago/terminals");
      const terminalsData = await terminalsResponse.json().catch(() => ({}));
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
  const previous = getMercadoPagoPendingOrder();
  localStorage.setItem(
    MP_PENDING_ORDER_KEY,
    JSON.stringify({
      id: order.id,
      amount: context.amount || 0,
      payment: context.payment || "",
      description: context.description || "",
      createdAt: new Date().toISOString(),
      status: order.status || previous?.status || "created",
      statusDetail: order.status_detail || previous?.statusDetail || "",
      checkedAt: previous?.checkedAt || "",
    }),
  );
}

function getMercadoPagoPendingOrder() {
  try {
    return JSON.parse(localStorage.getItem(MP_PENDING_ORDER_KEY) || "null");
  } catch (error) {
    return null;
  }
}

function clearMercadoPagoPendingOrder(orderId = "") {
  const pending = getMercadoPagoPendingOrder();
  if (!orderId || pending?.id === orderId) localStorage.removeItem(MP_PENDING_ORDER_KEY);
}

function updateMercadoPagoPendingOrderStatus(statusData) {
  if (!statusData?.id) return;
  const pending = getMercadoPagoPendingOrder();
  if (!pending || pending.id !== statusData.id) return;
  localStorage.setItem(
    MP_PENDING_ORDER_KEY,
    JSON.stringify({
      ...pending,
      status: statusData.status || pending.status || "",
      statusDetail: statusData.status_detail || pending.statusDetail || "",
      checkedAt: new Date().toISOString(),
    }),
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

async function checkMercadoPagoPendingOrder() {
  const pending = getMercadoPagoPendingOrder();
  if (!pending?.id) {
    notify("Nao ha cobranca pendente do Mercado Pago salva neste navegador.");
    return;
  }

  try {
    const response = await fetch(`/api/mercadopago/order-status?id=${encodeURIComponent(pending.id)}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(describeMercadoPagoError(data));
    updateMercadoPagoPendingOrderStatus(data);
    if (["processed", "canceled", "expired", "failed"].includes(data.status)) clearMercadoPagoPendingOrder(data.id);
    notify(`Mercado Pago: ${mercadoPagoStatusLabel(data)}`);
  } catch (error) {
    notify(`Erro ao consultar a cobranca Point: ${error.message}`);
  }

  renderApp();
}

async function cancelMercadoPagoPendingOrder() {
  const pending = getMercadoPagoPendingOrder();
  if (!pending?.id) {
    notify("Nao ha cobranca pendente do Mercado Pago salva neste navegador.");
    return;
  }

  notify("Tentando cancelar a cobranca pendente na Point...");
  try {
    const response = await fetch("/api/mercadopago/cancel-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pending.id }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(describeMercadoPagoError(data));
    clearMercadoPagoPendingOrder(pending.id);
    notify("Cobranca pendente cancelada. Agora voce pode tentar novamente.");
  } catch (error) {
    notify(`Nao foi possivel cancelar pelo app: ${error.message}. Se aparecer na maquininha, cancele pela propria Point.`);
  }

  renderApp();
}

async function processMercadoPagoPointPayment({ amount, payment, description }) {
  const config = await loadMercadoPagoPointStatus();
  if (!config.enabled || !isPointPayment(payment)) return { skipped: true };
  const terminalId = getSelectedMercadoPagoTerminalId();

  notify("Enviando cobranca para a maquininha Mercado Pago...");
  const createResponse = await fetch("/api/mercadopago/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      paymentMethod: payment,
      terminalId,
      description,
      externalReference: `sale-${Date.now()}`,
    }),
  });

  const order = await createResponse.json().catch(() => ({}));
  if (!createResponse.ok) {
    const message = describeMercadoPagoError(order);
    if (message.toLowerCase().includes("already a queued order")) {
      return {
        ok: false,
        message:
          "Mercado Pago: ja existe uma cobranca pendente na maquininha. Cancele na Point configurada; se essa cobranca tiver sido criada nesta nova versao, tambem da para usar Internet > Cancelar cobranca Point.",
      };
    }
    return { ok: false, message: `Mercado Pago: ${message}` };
  }

  saveMercadoPagoPendingOrder(order, { amount, payment, description });
  notify("Cobranca enviada. Na Point, abra Inserir valor para concluir.");
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const statusResponse = await fetch(`/api/mercadopago/order-status?id=${encodeURIComponent(order.id)}`);
    const statusData = await statusResponse.json().catch(() => ({}));
    if (!statusResponse.ok) {
      return { ok: false, message: statusData.error || "Falha ao consultar pagamento Mercado Pago." };
    }

    updateMercadoPagoPendingOrderStatus(statusData);
    if (statusData.status === "processed") {
      clearMercadoPagoPendingOrder(order.id);
      return { ok: true, order: statusData };
    }
    if (["failed", "canceled", "expired"].includes(statusData.status)) {
      clearMercadoPagoPendingOrder(order.id);
      return { ok: false, message: `Pagamento nao aprovado: ${statusData.status_detail || statusData.status}.` };
    }
    if (statusData.status === "action_required") {
      return { ok: false, message: "Na Point, abra Inserir valor e confira se o pagamento foi aprovado." };
    }
  }

  const pending = getMercadoPagoPendingOrder();
  return {
    ok: false,
    message: `Pagamento ainda nao confirmado. Ultimo status: ${pending?.status || "created"}. Na Point, abra Inserir valor antes de tentar novamente.`,
  };
}

async function setMercadoPagoTerminalMode(operatingMode = "PDV") {
  try {
    const response = await fetch("/api/mercadopago/set-terminal-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operatingMode }),
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

function localLogin(username, password) {
  const normalizedUsername = username.trim().toLowerCase();
  const user = state.users.find(
    (item) => item.name.trim().toLowerCase() === normalizedUsername && item.password === password && item.active,
  );

  if (!user) {
    notify("Nome de usuario ou senha incorretos.");
    return;
  }

  session = user;
  const preferredView = state.settings.shiftStartView?.[user.role];
  currentView = preferredView && getUserPermissions(user).includes(preferredView) ? preferredView : getUserPermissions(user)[0] || "pos";
  logAudit("Login", `${user.name} acessou o sistema.`);
  saveState();
  renderApp();
}

async function login(username, password) {
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
    await loadOnlineSettings();
    await loadOnlineStockData();
    await loadOnlineClientsData();
    await loadOnlineSalesData();
    await loadOnlineCashData();
    await loadOnlineSupplierData();
    await loadOnlineTableData();
    await loadOnlineProfilesData();
    await loadOnlineBackupHistory();
    const preferredView = state.settings.shiftStartView?.[session.role];
    currentView = preferredView && getUserPermissions(session).includes(preferredView) ? preferredView : getUserPermissions(session)[0] || "pos";
    logAudit("Login online", `${session.name} acessou pelo Supabase.`);
    saveState();
    renderApp();
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
    .select("bar_name, cnpj, address, service_fee, receipt_footer, auto_backup, backup_interval_minutes, last_auto_backup_at, shift_start_view")
    .eq("id", "main")
    .single();

  if (error || !data) return;

  state.settings = {
    ...state.settings,
    syncMode: "supabase",
    barName: data.bar_name || state.settings.barName,
    cnpj: data.cnpj || "",
    address: data.address || "",
    serviceFee: Number(data.service_fee || 0),
    receiptFooter: data.receipt_footer || state.settings.receiptFooter,
    autoBackup: Boolean(data.auto_backup),
    backupIntervalMinutes: Number(data.backup_interval_minutes || 30),
    lastAutoBackupAt: data.last_auto_backup_at || state.settings.lastAutoBackupAt,
    shiftStartView: data.shift_start_view || state.settings.shiftStartView,
  };

  supabaseStatus = {
    checked: true,
    ok: true,
    message: `Conectado ao banco: ${state.settings.barName}.`,
  };
}

function isOnlineSession() {
  return Boolean(session?.online && isSupabaseReady());
}

function mapProductFromDb(row, recipes = []) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    station: row.station || "Bar",
    price: Number(row.price || 0),
    cost: Number(row.cost || 0),
    stock: Number(row.stock || 0),
    minStock: Number(row.min_stock || 0),
    criticalStock: Number(row.critical_stock || 0),
    favorite: Boolean(row.favorite),
    active: row.active !== false,
    recipe: recipes
      .filter((recipe) => recipe.product_id === row.id)
      .map((recipe) => ({ ingredientId: recipe.ingredient_id, qty: Number(recipe.qty || 0) })),
  };
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
  saveState();
}

function mapSaleFromDb(row, items = []) {
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
    payment: row.payment,
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

async function loadOnlineSalesData() {
  if (!isOnlineSession()) return;

  const [salesResult, saleItemsResult, kitchenResult] = await Promise.all([
    supabaseClient.from("sales").select("*").order("created_at", { ascending: true }),
    supabaseClient.from("sale_items").select("*"),
    supabaseClient.from("kitchen_orders").select("*").order("created_at", { ascending: false }),
  ]);

  const error = salesResult.error || saleItemsResult.error || kitchenResult.error;
  if (error) {
    notify(`Falha ao carregar vendas online: ${error.message}`);
    return;
  }

  state.sales = (salesResult.data || []).map((row) => mapSaleFromDb(row, saleItemsResult.data || []));
  state.kitchenOrders = (kitchenResult.data || []).map(mapKitchenOrderFromDb);
  saveState();
}

function mapCashSessionFromDb(row) {
  return {
    id: row.id,
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
  if (!isOnlineSession()) return;

  const [sessionsResult, movementsResult] = await Promise.all([
    supabaseClient.from("cash_sessions").select("*").order("opened_at", { ascending: true }),
    supabaseClient.from("cash_movements").select("*").order("created_at", { ascending: true }),
  ]);

  const error = sessionsResult.error || movementsResult.error;
  if (error) {
    notify(`Falha ao carregar caixa online: ${error.message}`);
    return;
  }

  state.cashSessions = (sessionsResult.data || []).map(mapCashSessionFromDb);
  state.cashMovements = (movementsResult.data || []).map(mapCashMovementFromDb);
  saveState();
}

function mapSupplierFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact || "",
    phone: row.phone || "",
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
  return {
    id: row.id,
    createdAt: row.created_at,
    description: row.description,
    category: row.category || "",
    amount: Number(row.amount || 0),
    dueDate: row.due_date,
    paid: Boolean(row.paid),
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
  };
}

function tableSortValue(table) {
  const number = Number(String(table.name || "").match(/\d+/)?.[0] || 0);
  return number || 9999;
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
  if (currentUser) session = { ...currentUser, online: true };
  saveState();
}

function mapBackupFromDb(row) {
  return {
    id: row.id,
    date: row.created_at,
    type: row.type,
    size: Number(row.size || 0),
  };
}

async function loadOnlineBackupHistory() {
  if (!isOnlineSession()) return;

  const { data, error } = await supabaseClient.from("backup_history").select("*").order("created_at", { ascending: false }).limit(30);
  if (error) {
    notify(`Falha ao carregar backups online: ${error.message}`);
    return;
  }

  state.backupHistory = (data || []).map(mapBackupFromDb);
  saveState();
}

async function recordOnlineBackup(type) {
  if (!isOnlineSession()) return false;

  const now = new Date().toISOString();
  const size = JSON.stringify(state).length;
  const [backupResult, settingsResult] = await Promise.all([
    supabaseClient.from("backup_history").insert({ type, size }),
    supabaseClient.from("app_settings").update({ last_auto_backup_at: now }).eq("id", "main"),
  ]);

  const error = backupResult.error || settingsResult.error;
  if (error) {
    notify(`Erro ao registrar backup online: ${error.message}`);
    return false;
  }

  state.settings.lastAutoBackupAt = now;
  state.settings.lastAutoBackup = now.slice(0, 10);
  await loadOnlineBackupHistory();
  return true;
}

async function logout() {
  if (isSupabaseReady()) {
    await supabaseClient.auth.signOut().catch(() => {});
  }
  session = null;
  cart = [];
  tableCheckout = null;
  currentView = "dashboard";
  renderLogin();
}

function renderLogin() {
  document.body.dataset.theme = state.settings.theme || "light";
  const quickUsers = state.users.filter((user) => user.active && user.showOnLogin);
  app.innerHTML = `
    <main class="login-shell">
      <section class="login-brand">
        <h1>${state.settings.barName || "BAR ENCONTRO DAS AGUAS"}</h1>
        <p>Caixa, estoque, vendas e equipe em uma operacao unica para bares.</p>
      </section>
      <section class="login-panel">
        <h2>Acessar sistema</h2>
        <p class="hint">${isSupabaseReady() ? "Login real conectado ao Supabase." : "Entre com uma conta autorizada."}</p>
        <form id="login-form">
          <label class="field">
            <span>Nome do usuario</span>
            <input name="username" type="text" autocomplete="username" required />
          </label>
          <label class="field">
            <span>Senha</span>
            <input name="password" type="password" autocomplete="current-password" required />
          </label>
          <button class="btn primary" type="submit">Entrar</button>
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
    await login(form.get("username").trim(), form.get("password").trim());
  });

  document.querySelectorAll("[data-fill-login]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector('input[name="username"]').value = button.dataset.fillLogin;
      document.querySelector('input[name="password"]').focus();
    });
  });

}

function renderApp() {
  if (!session) {
    renderLogin();
    return;
  }

  document.body.dataset.theme = state.settings.theme || "light";
  runScheduledBackup();

  if (!hasPermission(currentView)) {
    currentView = visibleNav()[0]?.id || "dashboard";
  }

  const nav = visibleNav();
  const title = navItems.find((item) => item.id === currentView)?.label || "Painel";

  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand-block">
          <div class="brand-mark">B</div>
          <strong>${state.settings.barName || "BAR ENCONTRO DAS AGUAS"}</strong>
          <span>${roles[session.role].label}</span>
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
          <div>
            <h1>${title}</h1>
            <p>${topbarSubtitle(currentView)}</p>
          </div>
          <div class="top-actions">
            <button class="icon-btn" type="button" id="theme-toggle" title="Alternar tema">
              ${icon(state.settings.theme === "dark" ? "sun" : "moon")}
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
    products: "Cadastro de itens vendidos no bar.",
    suppliers: "Compras, entradas e fornecedores.",
    clients: "Controle de fiado e clientes.",
    reports: "Analises, exportacao e backup.",
    team: "Usuarios, senhas e permissoes.",
    settings: "Dados do bar, inicio por cargo e backup.",
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
  document.querySelector("#open-menu")?.addEventListener("click", () => {
    document.querySelector("#sidebar")?.classList.toggle("open");
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });
}

function bindViewEvents() {
  const search = document.querySelector("[data-search]");
  if (search) {
    search.value = searchTerm;
    search.addEventListener("input", (event) => {
      searchTerm = event.target.value;
      renderApp();
    });
  }

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      currentModal = {
        type: button.dataset.openModal,
        id: button.dataset.id || null,
      };
      renderApp();
    });
  });

  document.querySelectorAll("[data-add-product]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.addProduct));
  });

  document.querySelectorAll("[data-add-table-product]").forEach((button) => {
    button.addEventListener("click", () => addProductToTable(button.dataset.tableId, button.dataset.addTableProduct));
  });

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      categoryFilter = button.dataset.category;
      renderApp();
    });
  });

  document.querySelector("[data-point-terminal]")?.addEventListener("change", (event) => {
    setSelectedMercadoPagoTerminalId(event.target.value);
  });

  document.querySelectorAll("[data-cart-minus]").forEach((button) => {
    button.addEventListener("click", () => changeCartQty(button.dataset.cartMinus, -1));
  });

  document.querySelectorAll("[data-cart-plus]").forEach((button) => {
    button.addEventListener("click", () => changeCartQty(button.dataset.cartPlus, 1));
  });

  document.querySelector("[data-clear-cart]")?.addEventListener("click", () => {
    cart = [];
    tableCheckout = null;
    renderApp();
  });

  document.querySelector("[data-finalize-sale]")?.addEventListener("click", finalizeSale);
  document.querySelector("[data-test-supabase]")?.addEventListener("click", testSupabaseConnection);
  document.querySelector("[data-test-mercadopago]")?.addEventListener("click", async () => {
    await loadMercadoPagoPointStatus(true);
    notify(mercadoPagoPointStatus.message);
    renderApp();
  });
  document.querySelector("[data-set-point-pdv]")?.addEventListener("click", () => setMercadoPagoTerminalMode("PDV"));
  document.querySelector("[data-check-point-order]")?.addEventListener("click", checkMercadoPagoPendingOrder);
  document.querySelector("[data-cancel-point-order]")?.addEventListener("click", cancelMercadoPagoPendingOrder);
  document.querySelector("[data-export-backup]")?.addEventListener("click", exportBackup);
  document.querySelector("[data-export-sales]")?.addEventListener("click", exportSalesCsv);
  document.querySelector("[data-print-report]")?.addEventListener("click", () => printReport("complete"));
  document.querySelector("[data-print-cash-report]")?.addEventListener("click", () => printReport("cash"));
  document.querySelector("[data-print-stock-report]")?.addEventListener("click", () => printReport("stock"));
  document.querySelector("[data-print-clients-report]")?.addEventListener("click", () => printReport("clients"));
  document.querySelector("#report-filter-form")?.addEventListener("submit", applyReportFilter);

  document.querySelectorAll("[data-print-sale]").forEach((button) => {
    button.addEventListener("click", () => printSale(button.dataset.printSale));
  });

  document.querySelectorAll("[data-order-status]").forEach((button) => {
    button.addEventListener("click", () => updateKitchenOrder(button.dataset.orderStatus, button.dataset.status));
  });

  document.querySelectorAll("[data-remove-order]").forEach((button) => {
    button.addEventListener("click", () => removeKitchenOrder(button.dataset.removeOrder));
  });

  document.querySelector("[data-clear-sales]")?.addEventListener("click", clearSales);

  document.querySelectorAll("[data-remove-product]").forEach((button) => {
    button.addEventListener("click", () => removeProduct(button.dataset.removeProduct));
  });

  document.querySelectorAll("[data-pay-expense]").forEach((button) => {
    button.addEventListener("click", () => payExpense(button.dataset.payExpense));
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
  const total = today.reduce((sum, sale) => sum + sale.total, 0);
  const profit = today.reduce((sum, sale) => sum + sale.total - sale.cost, 0);
  const lowStock = stockAlerts();
  const openCash = getOpenCash();
  const ticket = today.length ? total / today.length : 0;
  const pendingOrders = state.kitchenOrders.filter((order) => order.status !== "Entregue").length;

  return `
    <div class="hero-admin">
      <div>
        <span>Painel exclusivo do administrador</span>
        <h2>Operacao do bar em tempo real</h2>
        <p>Vendas, caixa, estoque, cozinha, fiado e auditoria em uma unica visao.</p>
      </div>
      <div class="hero-admin-actions">
        <button class="btn secondary" type="button" data-export-backup>${icon("download")} Backup</button>
        <button class="btn secondary" type="button" data-view="reports">Relatorios</button>
      </div>
    </div>

    <div class="grid stats">
      ${metric("Vendas hoje", money(total), `${today.length} vendas registradas`, "R$")}
      ${metric("Lucro estimado", money(profit), "Com base no custo cadastrado", "%")}
      ${metric("Ticket medio", money(ticket), "Media por atendimento", "TM")}
      ${metric("Preparo", pendingOrders, "Pedidos ainda na fila", "PB")}
    </div>

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
  const products = filteredProducts().filter((product) => product.active);
  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const serviceFee = tableCheckout ? tableServiceFee(subtotal) : 0;
  const total = subtotal + serviceFee;
  const categories = ["Todos", ...new Set(state.products.map((product) => product.category))];

  return `
    <div class="section-title">
      <div>
        <h2>Venda de balcao</h2>
        <p>Botoes grandes, categorias visuais e fechamento rapido.</p>
      </div>
      <div class="toolbar">
        <input class="field-input search" data-search type="search" placeholder="Buscar produto" />
      </div>
    </div>

    <div class="pos-layout">
      <section class="card pad">
        <div class="quick-menu-editor">
          <strong>Menu rapido</strong>
          <div>
            <button class="btn compact secondary" type="button" data-open-modal="product">Adicionar item</button>
            <button class="btn compact secondary" type="button" data-view="stock">Editar itens</button>
          </div>
        </div>
        <div class="category-strip">
          ${categories
            .map(
              (category) => `
                <button class="category-pill ${categoryFilter === category ? "active" : ""}" type="button" data-category="${category}">
                  <span>${category === "Todos" ? "TD" : categoryMeta[category]?.icon || category.slice(0, 2).toUpperCase()}</span>
                  ${category}
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="product-grid">
          ${
            products.length
              ? products
                  .map(
                    (product) => `
                      <button class="product-tile ${categoryMeta[product.category]?.tone || ""}" type="button" data-add-product="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>
                        <span class="category-badge">${categoryMeta[product.category]?.icon || "IT"}</span>
                        <div>
                          <strong>${product.name}</strong>
                          <span>${product.category} - ${product.station || "Bar"} - ${product.stock} un.</span>
                        </div>
                        <div class="tile-bottom">
                          <span class="status ${stockStatus(product).className}">${stockStatus(product).label}</span>
                          <span class="price">${money(product.price)}</span>
                        </div>
                      </button>
                    `,
                  )
                  .join("")
              : '<div class="empty">Nenhum produto encontrado.</div>'
          }
        </div>
      </section>

      <aside class="card cart">
        <div class="card-head">
          <h2 class="card-title">${tableCheckout ? `Fechamento - ${tableCheckout.name}` : "Comanda"}</h2>
          <button class="btn compact secondary" type="button" data-clear-cart>Limpar</button>
        </div>
        ${tableCheckout ? `<div class="notice compact">Conta enviada da mesa. Escolha a forma de pagamento para finalizar no caixa.</div>` : ""}
        <div class="cart-list">
          ${
            cart.length
              ? cart
                  .map(
                    (item) => `
                      <div class="cart-item">
                        <div>
                          <strong>${item.name}</strong>
                          <span>${money(item.price)} cada</span>
                        </div>
                        <div class="qty-stepper">
                          <button type="button" data-cart-minus="${item.productId}">-</button>
                          <output>${item.qty}</output>
                          <button type="button" data-cart-plus="${item.productId}">+</button>
                        </div>
                      </div>
                    `,
                  )
                  .join("")
              : '<div class="empty">Nenhum item na comanda.</div>'
          }
        </div>
        <div class="cart-total">
          <label class="field">
            <span>Pagamento</span>
            <select id="payment-method">
              ${paymentMethods.map((method) => `<option>${method}</option>`).join("")}
            </select>
          </label>
          ${renderMercadoPagoTerminalField()}
          <label class="field">
            <span>Cliente para fiado</span>
            <select id="client-id">
              ${state.clients.map((client) => `<option value="${client.id}">${client.name}</option>`).join("")}
            </select>
          </label>
          ${tableCheckout ? `<div class="total-row"><span>Subtotal da mesa</span><strong>${money(subtotal)}</strong></div>` : ""}
          ${tableCheckout ? `<div class="total-row"><span>Servico ${state.settings.serviceFee || 0}%</span><strong>${money(serviceFee)}</strong></div>` : ""}
          <div class="total-row"><span>Total</span><strong>${money(total)}</strong></div>
          <button class="btn primary" type="button" data-finalize-sale ${cart.length ? "" : "disabled"}>Finalizar venda</button>
        </div>
      </aside>
    </div>
  `;
}

function filteredProducts() {
  const term = searchTerm.trim().toLowerCase();
  return state.products.filter((product) => {
    if (categoryFilter !== "Todos" && product.category !== categoryFilter) return false;
    if (!term) return true;
    return `${product.name} ${product.category}`.toLowerCase().includes(term);
  });
}

function renderTables() {
  const selectedTableId = currentModal?.type === "table" ? currentModal.id : state.tables.find((table) => table.status !== "Livre")?.id;
  const selectedTable = state.tables.find((table) => table.id === selectedTableId) || state.tables[0];
  const tableTotal = tableTotalValue(selectedTable);

  return `
    <div class="section-title">
      <div>
        <h2>Mesas e comandas</h2>
        <p>Abra mesa, adicione itens, acompanhe status e feche a conta. ${isOnlineSession() ? "Salvando no Supabase." : "Modo local."}</p>
      </div>
      <div class="toolbar">
        <button class="btn secondary" type="button" data-clear-table="${selectedTable?.id || ""}">Liberar selecionada</button>
      </div>
    </div>
    <div class="tables-layout">
      <section class="card pad">
        <div class="table-map">
          ${state.tables
            .map(
              (table) => `
                <button class="table-tile ${table.status.toLowerCase()} ${table.id === selectedTable?.id ? "active" : ""}" type="button" data-open-modal="table" data-id="${table.id}">
                  <strong>${table.name}</strong>
                  ${table.customerName ? `<em>${escapeHtml(table.customerName)}</em>` : ""}
                  <span>${table.status}</span>
                  <small>${money(tableTotalValue(table))}</small>
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
      <aside class="card">
        <div class="card-head">
          <h2 class="card-title">${selectedTable?.name || "Mesa"}</h2>
          <span class="status ${selectedTable?.status === "Livre" ? "green" : "amber"}">${selectedTable?.status || "Livre"}</span>
        </div>
        ${selectedTable?.customerName ? `<div class="table-customer">Cliente: <strong>${escapeHtml(selectedTable.customerName)}</strong></div>` : ""}
        <div class="cart-list">
          ${
            selectedTable?.items?.length
              ? selectedTable.items
                  .map(
                    (item) => `
                      <div class="cart-item">
                        <div><strong>${item.name}</strong><span>${item.qty} x ${money(item.price)}</span></div>
                        <strong>${money(item.qty * item.price)}</strong>
                      </div>
                    `,
                  )
                  .join("")
              : '<div class="empty">Mesa sem itens.</div>'
          }
        </div>
        <div class="cart-total">
          <div class="total-row"><span>Subtotal</span><strong>${money(tableTotal)}</strong></div>
          <div class="total-row"><span>Servico ${state.settings.serviceFee || 0}%</span><strong>${money(tableServiceFee(tableTotal))}</strong></div>
          <div class="total-row"><span>Total</span><strong>${money(tableTotal + tableServiceFee(tableTotal))}</strong></div>
          <button class="btn primary" type="button" data-close-table="${selectedTable?.id || ""}" ${selectedTable?.items?.length ? "" : "disabled"}>Enviar para balcao</button>
        </div>
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
        <input class="field-input search" data-search type="search" placeholder="Buscar item" />
        <button class="btn secondary" type="button" data-open-modal="lot">Novo lote</button>
      </div>
    </div>
    <div class="waiter-shell">
      <section class="card pad">
        <div class="mobile-product-list">
          ${products
            .map(
              (product) => `
                <button class="mobile-product" type="button" data-add-product="${product.id}">
                  <span class="category-badge">${categoryMeta[product.category]?.icon || "IT"}</span>
                  <span>
                    <strong>${product.name}</strong>
                    <small>${product.category} - ${money(product.price)}</small>
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
          <label class="field">
            <span>Pagamento</span>
            <select id="payment-method">${paymentMethods.map((method) => `<option>${method}</option>`).join("")}</select>
          </label>
          ${renderMercadoPagoTerminalField()}
          <label class="field">
            <span>Cliente para fiado</span>
            <select id="client-id">${state.clients.map((client) => `<option value="${client.id}">${client.name}</option>`).join("")}</select>
          </label>
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
  const product = state.products.find((item) => item.id === productId);
  if (!product || product.stock <= 0) {
    notify("Produto sem estoque disponivel.");
    return;
  }

  const existing = cart.find((item) => item.productId === productId);
  const currentQty = existing ? existing.qty : 0;

  if (currentQty + 1 > product.stock) {
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
  const item = cart.find((entry) => entry.productId === productId);
  const product = state.products.find((entry) => entry.id === productId);
  if (!item || !product) return;

  const next = item.qty + change;
  if (next <= 0) {
    cart = cart.filter((entry) => entry.productId !== productId);
  } else if (next <= product.stock) {
    item.qty = next;
  } else {
    notify("Quantidade maior que o estoque disponivel.");
  }

  renderApp();
}

async function finalizeSale() {
  if (!cart.length) return;

  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const serviceFee = tableCheckout ? tableServiceFee(subtotal) : 0;
  const total = subtotal + serviceFee;
  const cost = cart.reduce((sum, item) => sum + item.qty * item.cost, 0);
  const payment = document.querySelector("#payment-method")?.value || "Pix";
  const clientId = document.querySelector("#client-id")?.value || "cl-001";

  if (payment === "Fiado") {
    const client = state.clients.find((entry) => entry.id === clientId);
    const projectedDebt = Number(client?.debt || 0) + total;
    if (!client || Number(client.creditLimit || 0) <= 0 || projectedDebt > Number(client.creditLimit || 0)) {
      notify("Fiado bloqueado: limite do cliente insuficiente.");
      return;
    }
  }

  const stockCheck = canFulfillCart(cart);
  if (!stockCheck.ok) {
    notify(stockCheck.message);
    return;
  }

  if (isOnlineSession()) {
    if (isPointPayment(payment)) {
      const pointPayment = await processMercadoPagoPointPayment({
        amount: total,
        payment,
        description: tableCheckout ? `Fechamento ${tableCheckout.name}` : "Venda balcao",
      });
      if (!pointPayment.skipped && !pointPayment.ok) {
        notify(pointPayment.message);
        return;
      }
    }

    const checkout = tableCheckout;
    const saleId = await finalizeSaleOnline({
      payment,
      clientId,
      total,
      cost,
      serviceFee,
      tableId: checkout?.id || null,
      clearCart: false,
      renderAfter: false,
    });
    if (!saleId) return;
    if (checkout) await releaseTableAfterCheckout(checkout.id);
    cart = [];
    tableCheckout = null;
    await loadOnlineSalesData();
    notify(checkout ? "Conta da mesa fechada no balcao." : "Venda salva no Supabase.");
    renderApp();
    return;
  }

  applyCartStock(cart);

  const sale = {
    id: id("sale"),
    date: new Date().toISOString(),
    cashierId: session.id,
    payment,
    clientId: payment === "Fiado" ? clientId : null,
    tableId: tableCheckout?.id || null,
    status: "Concluida",
    serviceFee,
    items: structuredClone(cart),
    total,
    cost,
  };

  state.sales.push(sale);
  createKitchenOrders(sale);

  if (payment === "Fiado") {
    state.clients = state.clients.map((client) =>
      client.id === clientId
        ? {
            ...client,
            debt: Number(client.debt || 0) + total,
            transactions: [
              {
                id: id("clienttx"),
                date: sale.date,
                type: "debito",
                description: sale.items.map((item) => `${item.qty}x ${item.name}`).join(", "),
                amount: total,
                saleId: sale.id,
                userId: session.id,
              },
              ...(client.transactions || []),
            ],
          }
        : client,
    );
  }

  logAudit("Venda finalizada", `${money(total)} em ${payment}.`);

  if (tableCheckout) {
    state.tables = state.tables.map((entry) =>
      entry.id === tableCheckout.id
        ? { ...entry, status: "Livre", openedAt: null, serverId: null, clientId: null, customerName: "", items: [] }
        : entry,
    );
    logAudit("Mesa fechada no balcao", `${tableCheckout.name}: ${money(total)}.`);
  }

  cart = [];
  tableCheckout = null;
  saveState();
  notify("Venda finalizada.");
  renderApp();
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

  state.kitchenOrders = state.kitchenOrders.map((order) => (order.id === orderId ? { ...order, status } : order));
  logAudit("Pedido atualizado", `Pedido ${orderId} marcado como ${status}.`);
  saveState();
  renderApp();
}

async function finalizeSaleOnline({
  payment,
  clientId,
  total,
  cost,
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

  const saleResult = await supabaseClient
    .from("sales")
    .insert({
      cashier_id: session.id,
      client_id: payment === "Fiado" ? clientId : null,
      payment,
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

  if (payment === "Fiado") {
    const client = state.clients.find((entry) => entry.id === clientId);
    const nextDebt = Number(client?.debt || 0) + total;
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
        amount: total,
      });
    }
  }

  logAudit("Venda finalizada online", `${money(total)} em ${payment}.`);
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

  state.kitchenOrders = state.kitchenOrders.filter((entry) => entry.id !== orderId);
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

async function saveTableCustomerName(tableId, customerName) {
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

  const item = {
    productId: product.id,
    name: product.name,
    qty: 1,
    price: product.price,
    cost: product.cost,
  };
  const check = canFulfillCart([item]);
  if (!check.ok) {
    notify(check.message);
    return;
  }

  if (isOnlineSession()) {
    const items = structuredClone(table.items || []);
    const existing = items.find((cartItem) => cartItem.productId === productId);
    if (existing) existing.qty += 1;
    else items.push(item);

    const { error } = await supabaseClient
      .from("bar_tables")
      .update({
        status: "Aberta",
        opened_at: table.openedAt || new Date().toISOString(),
        server_id: table.serverId || session.id,
        items,
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

async function closeTable(tableId) {
  const table = state.tables.find((entry) => entry.id === tableId);
  if (!table || !table.items.length) return;

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
    tableCheckout = { id: table.id, name: table.name };
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
  tableCheckout = { id: table.id, name: table.name };
  currentView = "pos";
  currentModal = null;
  logAudit("Mesa enviada ao balcao", `${table.name}: ${money(subtotal)}.`);
  saveState();
  notify("Conta enviada para o balcao. Escolha a forma de pagamento para fechar.");
  renderApp();
}

async function clearTable(tableId) {
  if (isOnlineSession()) {
    const { error } = await supabaseClient
      .from("bar_tables")
      .update({ status: "Livre", opened_at: null, server_id: null, client_id: null, items: [] })
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
    table.id === tableId ? { ...table, status: "Livre", openedAt: null, serverId: null, clientId: null, customerName: "", items: [] } : table,
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
        .update({ status: "Livre", opened_at: null, server_id: null, client_id: null, customer_name: "", items: [] })
        .eq("id", tableId),
    ]);

    const error = updates.find((result) => result.error)?.error;
    if (error) {
      notify(`Erro ao transferir mesa online: ${error.message}`);
      return;
    }

    currentModal = { type: "table", id: targetId };
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
      return { ...table, status: "Livre", openedAt: null, serverId: null, clientId: null, customerName: "", items: [] };
    }
    return table;
  });
  currentModal = { type: "table", id: targetId };
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
  const activeSales = sales.filter((sale) => sale.status !== "Cancelada");
  const total = activeSales.reduce((sum, sale) => sum + sale.total, 0);
  const profit = activeSales.reduce((sum, sale) => sum + sale.total - sale.cost, 0);

  return `
    <div class="section-title">
      <div>
        <h2>Vendas</h2>
        <p>${isOnlineSession() ? "Histórico e novas vendas salvando no Supabase." : "Histórico em modo local."}</p>
      </div>
    </div>
    <div class="grid stats">
      ${metric("Total vendido", money(total), "Todas as vendas registradas", "R$")}
      ${metric("Lucro estimado", money(profit), "Receita menos custo", "%")}
      ${metric("Tickets", activeSales.length, "Vendas concluidas", "N")}
      ${metric("Canceladas", sales.length - activeSales.length, "Com senha e motivo", "C")}
    </div>
    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
        <h2 class="card-title">Historico de vendas</h2>
        <div class="toolbar">
          <button class="btn compact secondary" type="button" data-print-report>${icon("print")} Gerar relatorio</button>
          <button class="btn compact danger" type="button" data-clear-sales>Limpar vendas</button>
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
            <th>Itens</th>
            <th>Pagamento</th>
            <th>Status</th>
            <th>Operador</th>
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
                  <td>${sale.items.reduce((sum, item) => sum + item.qty, 0)} itens</td>
                  <td><span class="status blue">${sale.payment}</span></td>
                  <td><span class="status ${sale.status === "Cancelada" ? "red" : "green"}">${sale.status || "Concluida"}</span></td>
                  <td>${userName(sale.cashierId)}</td>
                  <td>${money(sale.total)}</td>
                  <td>${money(sale.total - sale.cost)}</td>
                  <td>
                    <div class="toolbar">
                      <button class="btn compact secondary" type="button" data-print-sale="${sale.id}">${icon("print")} Recibo</button>
                      ${
                        sale.status === "Cancelada"
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

function renderCash() {
  const openCash = getOpenCash();
  const summary = cashSummary(openCash);
  const todaySales = salesForToday();
  const movements = state.cashMovements.slice().reverse();

  return `
    <div class="section-title">
      <div>
        <h2>Caixa</h2>
        <p>Abertura, movimentos e fechamento. ${isOnlineSession() ? "Salvando no Supabase." : "Modo local."}</p>
      </div>
    </div>

    <div class="grid stats">
      ${metric("Status", openCash ? "Aberto" : "Fechado", openCash ? userName(openCash.userId) : "Sem turno ativo", "CX")}
      ${metric("Abertura", money(openCash?.openingAmount || 0), openCash ? dateTime(openCash.openedAt) : "Aguardando abertura", "AB")}
      ${metric("Esperado", money(summary.expected), "Abertura + vendas + movimentos", "EX")}
      ${metric("Vendas hoje", money(todaySales.reduce((sum, sale) => sum + sale.total, 0)), "Por todas as formas de pagamento", "R$")}
    </div>

    <div class="grid two-col" style="margin-top: 16px;">
      <section class="card pad">
        <h2 class="card-title">${openCash ? "Fechamento detalhado" : "Abrir caixa"}</h2>
        <form id="cash-form" style="margin-top: 14px;">
          ${
            openCash
              ? `<div class="form-grid">
                  ${paymentMethods
                    .map(
                      (method) => `
                        <label class="field">
                          <span>${method} contado</span>
                          <input name="counted-${method}" type="number" min="0" step="0.01" value="${summary.payments[method] || 0}" />
                        </label>
                      `,
                    )
                    .join("")}
                  <label class="field full">
                    <span>Observacao</span>
                    <textarea name="notes"></textarea>
                  </label>
                </div>`
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
        </form>
      </section>

      <section class="card">
        <div class="card-head">
          <h2 class="card-title">Resumo por forma</h2>
        </div>
        <div class="summary-list">
          ${paymentMethods
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
          <h2 class="card-title">Sangrias, suprimentos e despesas</h2>
          <button class="btn compact secondary" type="button" data-open-modal="movement">Adicionar</button>
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
  `;
}

function bindCashForm() {
  document.querySelector("#cash-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));
    const notes = form.get("notes").trim();
    const openCash = getOpenCash();

    if (openCash) {
      const counted = Object.fromEntries(paymentMethods.map((method) => [method, Number(form.get(`counted-${method}`) || 0)]));
      const closingAmount = Object.values(counted).reduce((sum, value) => sum + value, 0);
      const summary = cashSummary(openCash);

      if (isOnlineSession()) {
        const difference = closingAmount - summary.expected;
        const { error } = await supabaseClient
          .from("cash_sessions")
          .update({
            closed_at: new Date().toISOString(),
            closing_amount: closingAmount,
            closing_breakdown: counted,
            expected_amount: summary.expected,
            difference,
            notes,
          })
          .eq("id", openCash.id);

        if (error) {
          notify(`Erro ao fechar caixa online: ${error.message}`);
          return;
        }

        await loadOnlineCashData();
        logAudit("Caixa fechado online", `Diferenca: ${money(difference)}.`);
        notify("Caixa fechado no Supabase.");
        renderApp();
        return;
      }

      openCash.closedAt = new Date().toISOString();
      openCash.closingAmount = closingAmount;
      openCash.closingBreakdown = counted;
      openCash.expectedAmount = summary.expected;
      openCash.difference = closingAmount - summary.expected;
      openCash.notes = notes;
      logAudit("Caixa fechado", `Diferenca: ${money(openCash.difference)}.`);
      notify("Caixa fechado.");
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

      state.cashSessions.push({
        id: id("cash"),
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
      logAudit("Caixa aberto", `Abertura com ${money(amount)}.`);
      notify("Caixa aberto.");
    }

    saveState();
    renderApp();
  });
}

function renderStock() {
  const products = filteredProducts().filter((product) => product.active !== false);
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
      </div>
    </div>
    <section class="card">
      <div class="card-head">
        <h2 class="card-title">Produtos, precos e saldos</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preco</th>
              <th>Custo</th>
              <th>Praca</th>
              <th>Saldo</th>
              <th>Minimo</th>
              <th>Critico</th>
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
                    <td>${product.category}</td>
                    <td>${money(product.price)}</td>
                    <td>${money(product.cost)}</td>
                    <td>${product.station || "Bar"}</td>
                    <td>${product.stock}</td>
                    <td>${product.minStock}</td>
                    <td>${product.criticalStock}</td>
                    <td><span class="status ${stockStatus(product).className}">${stockStatus(product).label}</span></td>
                    <td>
                      <div class="toolbar">
                        <button class="btn compact secondary" type="button" data-open-modal="product" data-id="${product.id}">Editar</button>
                        <button class="btn compact secondary" type="button" data-open-modal="stock" data-id="${product.id}">Ajustar</button>
                        <button class="btn compact danger" type="button" data-remove-product="${product.id}">Remover</button>
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
    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
        <h2 class="card-title">Lotes e validade</h2>
        <button class="btn compact secondary" type="button" data-open-modal="lot">Adicionar lote</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Item</th><th>Lote</th><th>Qtd.</th><th>Validade</th><th>Fornecedor</th><th>Status</th></tr></thead>
          <tbody>
            ${state.stockLots
              .map(
                (lot) => `
                  <tr>
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
    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
        <h2 class="card-title">Insumos de ficha tecnica</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Insumo</th><th>Unidade</th><th>Saldo</th><th>Minimo</th><th>Custo unit.</th><th>Status</th></tr></thead>
          <tbody>
            ${state.ingredients
              .map(
                (ingredient) => `
                  <tr>
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
    <section class="card" style="margin-top: 16px;">
      <div class="card-head">
        <h2 class="card-title">Inventario e divergencias</h2>
        <button class="btn compact secondary" type="button" data-open-modal="inventory">Nova contagem</button>
      </div>
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

function stockStatus(product) {
  if (product.stock <= 0) return { label: "Zerado", className: "red" };
  if (product.stock <= Number(product.criticalStock || 0)) return { label: "Critico", className: "red" };
  if (product.stock <= product.minStock) return { label: "Baixo", className: "amber" };
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
        <input class="field-input search" data-search type="search" placeholder="Buscar produto" />
        <button class="btn secondary" type="button" data-open-modal="product">Novo produto</button>
      </div>
    </div>
    <section class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
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
      </div>
    </div>
    <div class="grid two-col">
      <section class="card">
        <div class="card-head"><h2 class="card-title">Fornecedores</h2></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>Contato</th><th>Telefone</th></tr></thead>
            <tbody>
              ${state.suppliers
                .map(
                  (supplier) => `
                    <tr><td>${supplier.name}</td><td>${supplier.contact}</td><td>${supplier.phone}</td></tr>
                  `,
                )
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
      <div class="card-head"><h2 class="card-title">Despesas do negocio</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Vencimento</th><th>Descricao</th><th>Categoria</th><th>Valor</th><th>Status</th><th>Pago em</th><th>Acoes</th></tr></thead>
          <tbody>
            ${(state.expenses || [])
              .map(
                (expense) => `
                  <tr>
                    <td>${new Date(`${expense.dueDate}T00:00:00`).toLocaleDateString("pt-BR")}</td>
                    <td>${expense.description}</td>
                    <td>${expense.category || "-"}</td>
                    <td>${money(expense.amount)}</td>
                    <td><span class="status ${expense.paid ? "green" : "amber"}">${expense.paid ? "Pago" : "Aberto"}</span></td>
                    <td>${expense.paidAt ? dateTime(expense.paidAt) : "-"}</td>
                    <td>
                      <div class="toolbar">
                        <button class="btn compact secondary" type="button" data-open-modal="expense" data-id="${expense.id}">Editar</button>
                        <button class="btn compact secondary" type="button" data-pay-expense="${expense.id}" ${expense.paid ? "disabled" : ""}>Marcar pago</button>
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
      ${metric("Vendas fiado", state.sales.filter((sale) => sale.payment === "Fiado").length, "Historico registrado", "FD")}
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

function renderReports() {
  const sales = reportSales().slice().reverse();
  const activeSales = sales.filter((sale) => sale.status !== "Cancelada");
  const byPayment = paymentMethods.map((method) => ({
    method,
    total: activeSales.filter((sale) => sale.payment === method).reduce((sum, sale) => sum + sale.total, 0),
  }));
  const byCategory = categoryTotals(reportSales());
  const profitability = productProfitability(reportSales()).slice(0, 8);
  const operatorRows = operatorReport(reportSales());

  return `
    <div class="section-title">
      <div>
        <h2>Relatorios e backup</h2>
        <p>Analise vendas, formas de pagamento, categorias e auditoria.</p>
      </div>
      <div class="toolbar">
        <button class="btn secondary" type="button" data-print-report>${icon("print")} Imprimir/PDF</button>
        <button class="btn secondary" type="button" data-export-sales>${icon("download")} CSV vendas</button>
        <button class="btn secondary" type="button" data-export-backup>${icon("download")} Backup JSON</button>
      </div>
    </div>
    <section class="card pad" style="margin-bottom: 16px;">
      <form id="report-filter-form" class="form-grid">
        <label class="field">
          <span>Periodo do relatorio</span>
          <select name="mode">
            <option value="24h" ${reportFilter.mode === "24h" ? "selected" : ""}>Ultimas 24 horas</option>
            <option value="7d" ${reportFilter.mode === "7d" ? "selected" : ""}>Ultimos 7 dias</option>
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
      <div class="card-head"><h2 class="card-title">Backups automaticos</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Data</th><th>Tipo</th><th>Tamanho</th></tr></thead>
          <tbody>
            ${state.backupHistory
              .map(
                (backup) => `
                  <tr>
                    <td>${dateTime(backup.date)}</td>
                    <td>${backup.type}</td>
                    <td>${Math.round(backup.size / 1024)} KB</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
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
        <h2>Configuracoes do bar</h2>
        <p>Dados do estabelecimento, taxa de servico, recibo e tela inicial por cargo.</p>
      </div>
    </div>
    <section class="card pad">
      <form id="settings-form">
        <div class="form-grid">
          <label class="field">
            <span>Nome do bar</span>
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
          <label class="field">
            <span>Backup automatico a cada 30 minutos</span>
            <select name="autoBackup">
              <option value="true" ${state.settings.autoBackup ? "selected" : ""}>Ativo</option>
              <option value="false" ${!state.settings.autoBackup ? "selected" : ""}>Inativo</option>
            </select>
          </label>
          <label class="field full">
            <span>Mensagem do recibo</span>
            <input name="receiptFooter" value="${state.settings.receiptFooter || ""}" />
          </label>
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
  `;
}

function renderOnline() {
  const safeUrl = supabaseConfig.url || "Nao configurada";
  const keyPreview = supabaseConfig.publishableKey
    ? `${supabaseConfig.publishableKey.slice(0, 18)}...${supabaseConfig.publishableKey.slice(-6)}`
    : "Nao configurada";
  const pendingPointOrder = getMercadoPagoPendingOrder();
  const selectedTerminal = mercadoPagoPointStatus.terminals.find(
    (terminal) => terminal.id === mercadoPagoPointStatus.terminalId,
  );
  const terminalRows = mercadoPagoPointStatus.terminals
    .map((terminal) => {
      const selected = terminal.id === mercadoPagoPointStatus.terminalId;
      return `
        <tr>
          <td>${selected ? "Selecionada" : "Disponivel"}</td>
          <td>${terminal.id}</td>
          <td>${terminal.operating_mode || "Sem modo"}</td>
          <td>${terminal.store_id || "-"}</td>
          <td>${terminal.pos_id || "-"}</td>
        </tr>
      `;
    })
    .join("");
  return `
    <div class="section-title">
      <div>
        <h2>Internet, login real e tempo real</h2>
        <p>Conexao com Supabase, publicacao e proximas etapas para operar online.</p>
      </div>
      <div class="toolbar">
        <button class="btn secondary" type="button" data-test-supabase>Testar conexao Supabase</button>
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
        <p>Login por nome, permissoes, estoque, vendas, clientes, caixa, mesas, fornecedores, despesas, configuracoes e backups ja estao conectados ao Supabase.</p>
      </section>
    </div>
    <div class="grid three-col" style="margin-top: 16px;">
      ${onlineCard("Banco", "Schema criado no Supabase e pronto para receber dados reais.", "Conectado")}
      ${onlineCard("Login real", "Perfis, e-mail vinculado, Auth e permissoes online estao ativos.", "Conectado")}
      ${onlineCard("Dados do app", "Produtos, estoque, vendas, clientes, caixa, mesas e despesas estao conectados para teste.", "Conectado")}
      ${onlineCard("Publicacao", "Proxima etapa: publicar os arquivos estaticos na Vercel com HTTPS.", "Proximo")}
      ${onlineCard("Mercado Pago Point", mercadoPagoPointStatus.message, mercadoPagoPointStatus.enabled ? "Configurado" : "Pendente")}
      ${onlineCard("Uso da Point", "Depois de enviar a cobranca pelo app, abra Inserir valor na maquininha para concluir.", "Operacao")}
      ${onlineCard(
        "Fila da Point",
        pendingPointOrder
          ? `Cobranca pendente salva: ${pendingPointOrder.id}. Status: ${pendingPointOrder.status || "created"}${
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
            </tr>
          </thead>
          <tbody>
            ${
              terminalRows ||
              `<tr><td colspan="5">Clique em Testar Mercado Pago Point para carregar as maquininhas.</td></tr>`
            }
          </tbody>
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
    client: renderClientModal,
    clientPayment: renderClientPaymentModal,
    cancelSale: renderCancelSaleModal,
    lot: renderLotModal,
    table: renderTableModal,
    user: renderUserModal,
    movement: renderMovementModal,
    order: renderOrderModal,
  };
  return `
    <div class="modal-backdrop">
      <section class="modal">
        ${renderers[currentModal.type]()}
      </section>
    </div>
  `;
}

function closeModal() {
  currentModal = null;
  renderApp();
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
            <span>Favorito no balcao</span>
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
          <label class="field full">
            <span>Ficha tecnica</span>
            <textarea name="recipeText" placeholder="Ex.: Cachaca:60, Limao:1">${recipeToText(product?.recipe || [])}</textarea>
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
  return `
    <form id="supplier-form">
      <div class="modal-head">
        <h2>Novo fornecedor</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field full"><span>Nome</span><input name="name" required /></label>
          <label class="field"><span>Contato</span><input name="contact" /></label>
          <label class="field"><span>Telefone</span><input name="phone" /></label>
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
  return `
    <form id="expense-form">
      <div class="modal-head">
        <h2>${expense ? "Editar despesa" : "Nova despesa"}</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field full"><span>Descricao</span><input name="description" required value="${expense?.description || ""}" /></label>
          <label class="field"><span>Categoria</span><input name="category" value="${expense?.category || ""}" /></label>
          <label class="field"><span>Valor</span><input name="amount" type="number" min="0.01" step="0.01" required value="${expense?.amount || ""}" /></label>
          <label class="field"><span>Vencimento</span><input name="dueDate" type="date" required value="${expense?.dueDate || ""}" /></label>
          <label class="field">
            <span>Status</span>
            <select name="paid">
              <option value="false" ${!expense?.paid ? "selected" : ""}>Aberto</option>
              <option value="true" ${expense?.paid ? "selected" : ""}>Pago</option>
            </select>
          </label>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-close-modal>Cancelar</button>
        <button class="btn primary" type="submit">Salvar despesa</button>
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
                    .slice(0, 8)
                    .map((entry) => `<span>${dateTime(entry.date)} - ${entry.description} - ${money(entry.amount)}</span>`)
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

function renderTableModal() {
  const table = state.tables.find((item) => item.id === currentModal.id);
  const products = state.products.filter((product) => product.active);
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
            <div class="mobile-product-list">
              ${products
                .map(
                  (product) => `
                    <button class="mobile-product" type="button" data-table-id="${table.id}" data-add-table-product="${product.id}">
                      <span class="category-badge">${categoryMeta[product.category]?.icon || "IT"}</span>
                      <span><strong>${product.name}</strong><small>${money(product.price)}</small></span>
                      <span>+</span>
                    </button>
                  `,
                )
                .join("")}
            </div>
          </section>
          <section>
            <h3 class="compact-title">Comanda aberta</h3>
            <div class="cart-list compact-cart">
              ${
                table.items.length
                  ? table.items
                      .map(
                        (item) => `
                          <div class="cart-item">
                            <div><strong>${item.name}</strong><span>${item.qty} x ${money(item.price)}</span></div>
                            <strong>${money(item.qty * item.price)}</strong>
                          </div>
                        `,
                      )
                      .join("")
                  : '<div class="empty">Sem itens.</div>'
              }
            </div>
          </section>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" type="button" data-clear-table="${table.id}">Liberar</button>
        <button class="btn primary" type="button" data-close-table="${table.id}" ${table.items.length ? "" : "disabled"}>Enviar para balcao</button>
      </div>
    </div>
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
            isOnlineSession()
              ? `<label class="field">
                  <span>Senha</span>
                  <input name="password" type="password" disabled placeholder="Alterar no Supabase Auth" />
                  <small>
                    A senha real fica no Supabase Auth.
                    <a href="${supabaseAuthUsersUrl()}" target="_blank" rel="noopener noreferrer">Abrir usuarios do Supabase</a>
                  </small>
                </label>`
              : `<label class="field">
                  <span>Senha</span>
                  <input name="password" type="password" required value="${user?.password || ""}" />
                </label>`
          }
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
  return `
    <form id="movement-form">
      <div class="modal-head">
        <h2>Movimentacao de caixa</h2>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <label class="field">
            <span>Tipo</span>
            <select name="type">
              <option value="suprimento">Suprimento</option>
              <option value="sangria">Sangria</option>
              <option value="despesa">Despesa</option>
            </select>
          </label>
          <label class="field">
            <span>Valor</span>
            <input name="amount" type="number" min="0.01" step="0.01" required />
          </label>
          <label class="field full">
            <span>Motivo</span>
            <input name="reason" required />
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

function bindModalForms() {
  document.querySelector("#product-form")?.addEventListener("submit", saveProduct);
  document.querySelector("#stock-form")?.addEventListener("submit", saveStockAdjustment);
  document.querySelector("#ingredient-form")?.addEventListener("submit", saveIngredient);
  document.querySelector("#inventory-form")?.addEventListener("submit", saveInventoryCount);
  document.querySelector("#supplier-form")?.addEventListener("submit", saveSupplier);
  document.querySelector("#purchase-form")?.addEventListener("submit", savePurchase);
  document.querySelector("#expense-form")?.addEventListener("submit", saveExpense);
  document.querySelector("#client-form")?.addEventListener("submit", saveClient);
  document.querySelector("#client-payment-form")?.addEventListener("submit", saveClientPayment);
  document.querySelector("#cancel-sale-form")?.addEventListener("submit", saveCancelSale);
  document.querySelector("#lot-form")?.addEventListener("submit", saveLot);
  document.querySelector("#user-form")?.addEventListener("submit", saveUser);
  document.querySelector("#movement-form")?.addEventListener("submit", saveMovement);
  document.querySelector("#order-form")?.addEventListener("submit", saveOrder);
  bindUserPermissionControls();
}

async function saveProduct(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = {
    name: form.get("name").trim(),
    category: form.get("category").trim(),
    price: Number(form.get("price")),
    cost: Number(form.get("cost")),
    stock: Number(form.get("stock")),
    minStock: Number(form.get("minStock")),
    criticalStock: Number(form.get("criticalStock")),
    station: form.get("station"),
    recipe: parseRecipeText(form.get("recipeText")),
    favorite: form.get("favorite") === "true",
    active: form.get("active") === "true",
  };

  if (isOnlineSession()) {
    await saveProductOnline(payload);
    return;
  }

  if (currentModal.id) {
    state.products = state.products.map((product) =>
      product.id === currentModal.id ? { ...product, ...payload } : product,
    );
  } else {
    state.products.push({ id: id("product"), ...payload });
  }

  currentModal = null;
  logAudit("Produto salvo", payload.name);
  saveState();
  notify("Produto salvo.");
  renderApp();
}

async function saveProductOnline(payload) {
  const dbPayload = {
    name: payload.name,
    category: payload.category,
    station: payload.station,
    price: payload.price,
    cost: payload.cost,
    stock: payload.stock,
    min_stock: payload.minStock,
    critical_stock: payload.criticalStock,
    favorite: payload.favorite,
    active: payload.active,
  };

  const result = currentModal.id
    ? await supabaseClient.from("products").update(dbPayload).eq("id", currentModal.id).select("*").single()
    : await supabaseClient.from("products").insert(dbPayload).select("*").single();

  if (result.error) {
    notify(`Erro ao salvar produto online: ${result.error.message}`);
    return;
  }

  const productId = result.data.id;
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

  currentModal = null;
  await loadOnlineStockData();
  logAudit("Produto salvo online", payload.name);
  notify("Produto salvo no Supabase.");
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
      notify(`Erro ao remover produto online: ${error.message}`);
      return;
    }
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

  state.kitchenOrders = state.kitchenOrders.map((order) =>
    order.id === currentModal.id && order.status !== "Entregue"
      ? { ...order, status: form.get("status"), items }
      : order,
  );
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
  const qty = Number(form.get("qty"));
  const product = state.products.find((entry) => entry.id === currentModal.id);
  if (!product) return;
  const nextStock =
    mode === "add" ? product.stock + qty : mode === "remove" ? Math.max(0, product.stock - qty) : qty;

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("products").update({ stock: nextStock }).eq("id", product.id);
    if (error) {
      notify(`Erro ao ajustar estoque online: ${error.message}`);
      return;
    }
    currentModal = null;
    await loadOnlineStockData();
    logAudit("Estoque ajustado online", `${product.name}: ${nextStock}.`);
    notify("Estoque atualizado no Supabase.");
    renderApp();
    return;
  }

  state.products = state.products.map((product) => {
    if (product.id !== currentModal.id) return product;
    return { ...product, stock: nextStock };
  });

  currentModal = null;
  logAudit("Estoque ajustado", `${currentModal?.id || "produto"} atualizado.`);
  saveState();
  notify("Estoque atualizado.");
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
  const supplier = {
    id: id("supplier"),
    name: form.get("name").trim(),
    contact: form.get("contact").trim(),
    phone: form.get("phone").trim(),
  };

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("suppliers").insert({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
    });

    if (error) {
      notify(`Erro ao salvar fornecedor online: ${error.message}`);
      return;
    }

    currentModal = null;
    await loadOnlineSupplierData();
    logAudit("Fornecedor criado online", supplier.name);
    notify("Fornecedor salvo no Supabase.");
    renderApp();
    return;
  }

  state.suppliers.push(supplier);
  currentModal = null;
  logAudit("Fornecedor criado", supplier.name);
  saveState();
  notify("Fornecedor salvo.");
  renderApp();
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
  const paid = form.get("paid") === "true";
  const payload = {
    description: form.get("description").trim(),
    category: form.get("category").trim(),
    amount: Number(form.get("amount")),
    dueDate: form.get("dueDate"),
    paid,
    paidAt: paid ? new Date().toISOString() : null,
  };

  if (isOnlineSession()) {
    const row = {
      description: payload.description,
      category: payload.category,
      amount: payload.amount,
      due_date: payload.dueDate,
      paid: payload.paid,
      paid_at: payload.paidAt,
    };
    const result = currentModal.id
      ? await supabaseClient.from("expenses").update(row).eq("id", currentModal.id)
      : await supabaseClient.from("expenses").insert(row);

    if (result.error) {
      notify(`Erro ao salvar despesa online: ${result.error.message}`);
      return;
    }

    currentModal = null;
    await loadOnlineSupplierData();
    logAudit("Despesa salva online", `${payload.description}: ${money(payload.amount)}.`);
    notify("Despesa salva no Supabase.");
    renderApp();
    return;
  }

  state.expenses = state.expenses || [];
  if (currentModal.id) {
    state.expenses = state.expenses.map((expense) =>
      expense.id === currentModal.id ? { ...expense, ...payload, paidAt: paid ? expense.paidAt || payload.paidAt : null } : expense,
    );
  } else {
    state.expenses.unshift({ id: id("expense"), createdAt: new Date().toISOString(), ...payload });
  }

  currentModal = null;
  logAudit("Despesa salva", `${payload.description}: ${money(payload.amount)}.`);
  saveState();
  notify("Despesa salva.");
  renderApp();
}

async function payExpense(expenseId) {
  if (isOnlineSession()) {
    const paidAt = new Date().toISOString();
    const { error } = await supabaseClient.from("expenses").update({ paid: true, paid_at: paidAt }).eq("id", expenseId);

    if (error) {
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
    expense.id === expenseId ? { ...expense, paid: true, paidAt: new Date().toISOString() } : expense,
  );
  logAudit("Despesa paga", expenseId);
  saveState();
  notify("Despesa marcada como paga.");
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

function saveCancelSale(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const admin = state.users.find((user) => user.role === "admin" && user.password === form.get("adminPassword") && user.active);
  const sale = state.sales.find((entry) => entry.id === currentModal.id);

  if (!admin) {
    notify("Senha de administrador invalida.");
    return;
  }

  if (!sale || sale.status === "Cancelada") {
    notify("Venda nao encontrada ou ja cancelada.");
    return;
  }

  restoreSaleStock(sale.items);
  if (sale.payment === "Fiado" && sale.clientId) {
    state.clients = state.clients.map((client) =>
      client.id === sale.clientId ? { ...client, debt: Math.max(0, Number(client.debt || 0) - sale.total) } : client,
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

  if (isOnlineSession()) {
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

    currentModal = null;
    await loadOnlineProfilesData();
    logAudit("Usuario salvo online", `${payload.name} - ${payload.role}.`);
    notify("Usuario salvo no Supabase.");
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
  notify("Usuario salvo.");
  renderApp();
}

async function saveMovement(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const type = form.get("type");
  const amount = Number(form.get("amount"));
  const reason = form.get("reason").trim();

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("cash_movements").insert({
      user_id: session.id,
      type,
      amount,
      reason,
    });

    if (error) {
      notify(`Erro ao registrar movimento online: ${error.message}`);
      return;
    }

    currentModal = null;
    await loadOnlineCashData();
    logAudit("Movimento de caixa online", `${type} de ${money(amount)}.`);
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
  logAudit("Movimento de caixa", `${type} de ${money(amount)}.`);
  saveState();
  notify("Movimentacao registrada.");
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
    autoBackup: form.get("autoBackup") === "true",
    backupIntervalMinutes: 30,
    receiptFooter: form.get("receiptFooter").trim(),
    shiftStartView: Object.fromEntries(Object.keys(roles).map((roleKey) => [roleKey, form.get(`start-${roleKey}`)])),
  };

  if (isOnlineSession()) {
    const { error } = await supabaseClient.from("app_settings").upsert({
      id: "main",
      bar_name: payload.barName,
      cnpj: payload.cnpj,
      address: payload.address,
      service_fee: payload.serviceFee,
      receipt_footer: payload.receiptFooter,
      auto_backup: payload.autoBackup,
      backup_interval_minutes: payload.backupIntervalMinutes,
      shift_start_view: payload.shiftStartView,
    });

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
    .filter((product) => product.active && product.stock <= product.minStock)
    .map((product) => ({
      type: product.stock <= Number(product.criticalStock || 0) ? "Produto critico" : "Produto baixo",
      name: product.name,
      stock: product.stock,
      minStock: product.minStock,
    }));
  const ingredientAlerts = state.ingredients
    .filter((ingredient) => ingredient.stock <= ingredient.minStock)
    .map((ingredient) => ({ type: "Insumo baixo", name: ingredient.name, stock: ingredient.stock, minStock: ingredient.minStock }));
  const lotAlerts = state.stockLots
    .filter((lot) => lotStatus(lot).className !== "green")
    .map((lot) => ({ type: "Validade", name: `${inventoryItemName(lot)} (${lot.batch})`, stock: lotStatus(lot).label, minStock: "" }));
  return [...productAlerts, ...ingredientAlerts, ...lotAlerts];
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
  const payments = Object.fromEntries(paymentMethods.map((method) => [method, 0]));
  const since = openCash ? new Date(openCash.openedAt) : startOfToday();
  const sales = state.sales.filter((sale) => new Date(sale.date) >= since && sale.status !== "Cancelada");

  sales.forEach((sale) => {
    const key = sale.payment === "Cartao" ? "Credito" : sale.payment;
    payments[key] = Number(payments[key] || 0) + sale.total;
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
  if (days < 0) return { label: "Vencido", className: "red" };
  if (days <= 7) return { label: `${days} dias`, className: "red" };
  if (days <= 15) return { label: `${days} dias`, className: "amber" };
  return { label: "Ok", className: "green" };
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
  if (reportFilter.mode === "period") {
    return `${reportFilter.start || "inicio"} ate ${reportFilter.end || "agora"}`;
  }
  return "Ultimas 24 horas";
}

function categoryTotals(sales = state.sales) {
  const totals = {};
  sales.forEach((sale) => {
    if (sale.status === "Cancelada") return;
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
    if (sale.status === "Cancelada") return;
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
    const userSales = sales.filter((sale) => sale.cashierId === user.id && sale.status !== "Cancelada");
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
    state.settings.barName || "BAR ENCONTRO DAS AGUAS",
    state.settings.cnpj ? `CNPJ: ${state.settings.cnpj}` : "",
    state.settings.address || "",
    `Venda: ${sale.id}`,
    `Data: ${dateTime(sale.date)}`,
    `Operador: ${userName(sale.cashierId)}`,
    "",
    ...sale.items.map((item) => `${item.qty}x ${item.name} - ${money(item.qty * item.price)}`),
    "",
    `Pagamento: ${sale.payment}`,
    `Total: ${money(sale.total)}`,
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

function printReport(type = "complete") {
  const titleMap = {
    complete: "Relatorio geral",
    cash: "Relatorio de caixa e operadores",
    stock: "Relatorio de estoque e lucratividade",
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
  if (type === "complete" || type === "clients") sections.push(reportClientsSection());
  if (type === "complete") sections.push(reportSalesSection(), reportAuditSection());

  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>${title} - ${state.settings.barName || "BAR ENCONTRO DAS AGUAS"}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #111827; margin: 28px; }
          header { border-bottom: 2px solid #111827; padding-bottom: 14px; margin-bottom: 22px; }
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
          @media print {
            body { margin: 12mm; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <header>
          <h1>${state.settings.barName || "BAR ENCONTRO DAS AGUAS"} - ${title}</h1>
          ${state.settings.cnpj ? `<p>CNPJ: ${state.settings.cnpj}</p>` : ""}
          ${state.settings.address ? `<p>${state.settings.address}</p>` : ""}
          <p>Periodo: ${reportPeriodLabel()}</p>
          <p>Gerado em ${generatedAt} por ${session?.name || "Usuario"}</p>
        </header>
        ${reportMetrics()}
        ${sections.join("")}
      </body>
    </html>
  `;
}

function reportMetrics() {
  const activeSales = reportSales().filter((sale) => sale.status !== "Cancelada");
  const revenue = activeSales.reduce((sum, sale) => sum + sale.total, 0);
  const profit = activeSales.reduce((sum, sale) => sum + sale.total - sale.cost, 0);
  const debt = state.clients.reduce((sum, client) => sum + Number(client.debt || 0), 0);
  return `
    <section class="metrics">
      <div class="metric"><span>Receita</span><strong>${money(revenue)}</strong></div>
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
      ${simpleTable(["Forma", "Total"], paymentMethods.map((method) => [method, money(summary.payments[method] || 0)]))}
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
        ["Data", "Operador", "Pagamento", "Status", "Total", "Lucro"],
        reportSales()
          .slice()
          .reverse()
          .map((sale) => [dateTime(sale.date), userName(sale.cashierId), sale.payment, sale.status || "Concluida", money(sale.total), money(sale.total - sale.cost)]),
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

async function exportBackup() {
  if (isOnlineSession()) {
    await recordOnlineBackup("manual");
  } else {
    state.backupHistory.unshift({
      id: id("backup"),
      date: new Date().toISOString(),
      type: "manual",
      size: JSON.stringify(state).length,
    });
  }

  downloadFile(`bar-encontro-das-aguas-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 2), "application/json");
  logAudit("Backup exportado", "Arquivo JSON gerado.");
  saveState();
}

function exportSalesCsv() {
  const rows = [
    ["id", "data", "operador", "pagamento", "total", "custo", "lucro"],
    ...reportSales().map((sale) => [
      sale.id,
      sale.date,
      userName(sale.cashierId),
      sale.payment,
      sale.total,
      sale.cost,
      sale.total - sale.cost,
    ]),
  ];
  downloadFile("bar-encontro-das-aguas-vendas.csv", rows.map((row) => row.join(";")).join("\n"), "text/csv");
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

function salesForToday() {
  const now = new Date();
  return state.sales.filter((sale) => {
    const date = new Date(sale.date);
    return (
      sale.status !== "Cancelada" &&
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
  return state.suppliers.find((supplier) => supplier.id === supplierId)?.name || "Fornecedor";
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

setInterval(() => {
  if (session) runScheduledBackup();
}, 60 * 1000);

syncChannel?.addEventListener("message", (event) => {
  if (event.data?.type !== "state-updated") return;
  suppressBroadcast = true;
  state = loadState();
  if (session) {
    session = state.users.find((user) => user.id === session.id) || session;
  }
  suppressBroadcast = false;
  renderApp();
});

renderLogin();
