const ADVANCED_SCHEMA_FILE = "SUPABASE_GESTAO_AVANCADA.sql";
let advancedMfaState = { loaded: false, enabled: false, factorId: "", factors: [] };
let advancedMfaEnrollment = null;
let pendingMfaLogin = null;
let advancedDevicesLoaded = false;
let advancedDeviceHeartbeatAt = 0;
let reconciliationRefreshRunning = false;
let reconciliationAutoRefreshAt = 0;

function ensureAdvancedState() {
  state.reconciliationReviews = Array.isArray(state.reconciliationReviews) ? state.reconciliationReviews : [];
  state.onlineDevices = Array.isArray(state.onlineDevices) ? state.onlineDevices : [];
  state.settings.closingDifferenceLimit = Math.max(0, Number(state.settings.closingDifferenceLimit ?? 5));
  state.settings.pricingDefaults = {
    cardFee: 3.5,
    tax: 0,
    targetMargin: 30,
    ...(state.settings.pricingDefaults || {}),
  };
  state.settings.anomalySettings = {
    highDiscountPercent: 15,
    cancellationPercent: 8,
    ...(state.settings.anomalySettings || {}),
  };
}

function advancedDaysAgo(days) {
  const value = new Date();
  value.setDate(value.getDate() - days);
  value.setHours(0, 0, 0, 0);
  return value;
}

function advancedPercent(value, total) {
  return total > 0 ? (Number(value || 0) / total) * 100 : 0;
}

function advancedMissingMigration(error) {
  return /schema cache|does not exist|could not find|column|function|relation/i.test(String(error?.message || error || ""));
}

function advancedMigrationNotice() {
  return `<div class="notice compact advanced-migration-notice">Para sincronizar este recurso entre aparelhos, execute <strong>${ADVANCED_SCHEMA_FILE}</strong> no SQL Editor do Supabase.</div>`;
}

function inventoryIntelligence(days = 30) {
  const start = advancedDaysAgo(days).getTime();
  const totals = new Map();
  state.sales.forEach((sale) => {
    if (!isFinancialSale(sale) || new Date(sale.date).getTime() < start) return;
    (sale.items || []).forEach((item) => {
      if (!item.productId) return;
      const current = totals.get(item.productId) || { qty: 0, revenue: 0 };
      current.qty += Number(item.qty || 0);
      current.revenue += Number(item.qty || 0) * Number(item.price || 0);
      totals.set(item.productId, current);
    });
  });

  const losses = new Map();
  (state.inventoryCounts || []).forEach((count) => {
    if (count.itemType !== "product" || new Date(count.date).getTime() < start || Number(count.difference || 0) >= 0) return;
    losses.set(count.itemId, Number(losses.get(count.itemId) || 0) + Math.abs(Number(count.difference || 0)));
  });

  const activeProducts = state.products.filter((product) => product.active !== false);
  const totalRevenue = activeProducts.reduce((sum, product) => sum + Number(totals.get(product.id)?.revenue || 0), 0);
  let cumulativeRevenue = 0;
  const classes = new Map();
  activeProducts
    .slice()
    .sort((a, b) => Number(totals.get(b.id)?.revenue || 0) - Number(totals.get(a.id)?.revenue || 0))
    .forEach((product) => {
      cumulativeRevenue += Number(totals.get(product.id)?.revenue || 0);
      const share = advancedPercent(cumulativeRevenue, totalRevenue);
      classes.set(product.id, totalRevenue <= 0 ? "C" : share <= 80 ? "A" : share <= 95 ? "B" : "C");
    });

  return activeProducts
    .map((product) => {
      const sold = totals.get(product.id) || { qty: 0, revenue: 0 };
      const stock = Number(productAvailableStock(product) || 0);
      const dailyVelocity = sold.qty / days;
      const coverageDays = dailyVelocity > 0 ? stock / dailyVelocity : null;
      const targetStock = Math.max(Number(product.minStock || 0), dailyVelocity * 14);
      const reorderQty = Math.max(0, Math.ceil(targetStock - stock));
      return {
        product,
        stock,
        soldQty: sold.qty,
        revenue: sold.revenue,
        abc: classes.get(product.id) || "C",
        dailyVelocity,
        coverageDays,
        reorderQty,
        deadStock: stock > 0 && sold.qty === 0,
        loss: Number(losses.get(product.id) || 0),
      };
    })
    .sort((a, b) => {
      const rank = { A: 0, B: 1, C: 2 };
      return rank[a.abc] - rank[b.abc] || b.reorderQty - a.reorderQty || b.revenue - a.revenue;
    });
}

function renderInventoryIntelligencePanel({ includeHeading = true } = {}) {
  const rows = inventoryIntelligence();
  const reorder = rows.filter((row) => row.reorderQty > 0);
  const dead = rows.filter((row) => row.deadStock);
  const losses = rows.reduce((sum, row) => sum + row.loss, 0);
  return `
    <section class="card advanced-panel" style="margin-bottom: 16px;">
      ${includeHeading ? `
        <div class="card-head">
          <div>
            <h2 class="card-title">Inteligencia de estoque</h2>
            <p>Curva ABC, giro dos ultimos 30 dias, cobertura e sugestao para 14 dias.</p>
          </div>
          <div class="advanced-kpis compact">
            <span><strong>${reorder.length}</strong> para repor</span>
            <span><strong>${dead.length}</strong> sem giro</span>
            <span><strong>${qty(losses)}</strong> perda inventariada</span>
          </div>
        </div>
      ` : `
        <div class="advanced-kpis inventory-modal-kpis">
          <span><strong>${reorder.length}</strong> para repor</span>
          <span><strong>${dead.length}</strong> sem giro</span>
          <span><strong>${qty(losses)}</strong> perda inventariada</span>
        </div>
      `}
      <div class="table-wrap">
        <table>
          <thead><tr><th>Classe</th><th>Produto</th><th>Saldo</th><th>Vendido 30d</th><th>Receita</th><th>Cobertura</th><th>Sugestao</th><th>Diagnostico</th></tr></thead>
          <tbody>
            ${rows.slice(0, 40).map((row) => `
              <tr>
                <td><span class="abc-badge abc-${row.abc.toLowerCase()}">${row.abc}</span></td>
                <td><strong>${escapeHtml(row.product.name)}</strong></td>
                <td>${qty(row.stock)}</td>
                <td>${qty(row.soldQty)}</td>
                <td>${money(row.revenue)}</td>
                <td>${row.coverageDays === null ? "Sem giro" : `${row.coverageDays.toFixed(1)} dias`}</td>
                <td>${row.reorderQty > 0 ? `<strong class="text-danger">Comprar ${qty(row.reorderQty)}</strong>` : "Estoque suficiente"}</td>
                <td>${row.deadStock ? '<span class="status amber">Capital parado</span>' : row.loss > 0 ? `<span class="status red">Perda ${qty(row.loss)}</span>` : '<span class="status green">Normal</span>'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderInventoryIntelligenceModal() {
  return `
    <div class="modal-head">
      <div><h2>Inteligencia de estoque</h2><p>Analise gerencial separada da rotina de cadastro e ajustes.</p></div>
      <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
    </div>
    <div class="modal-body inventory-intelligence-body">${renderInventoryIntelligencePanel({ includeHeading: false })}</div>
  `;
}

function cashFlowForecast() {
  const now = new Date();
  const start = advancedDaysAgo(30).getTime();
  const recentSales = state.sales.filter((sale) => isFinancialSale(sale) && new Date(sale.date).getTime() >= start);
  const received = recentSales.reduce((sum, sale) => sum + saleReceivedAmount(sale), 0);
  const dailyRevenue = received / 30;
  const recentCashExpenses = (state.cashMovements || [])
    .filter((movement) => movement.type !== "suprimento" && new Date(movement.date).getTime() >= start)
    .reduce((sum, movement) => sum + Number(movement.amount || 0), 0);
  const dailyCashExpense = recentCashExpenses / 30;
  const openExpenses = (state.expenses || []).filter((expense) => expenseBalance(expense) > 0);
  const clientDebt = state.clients.reduce((sum, client) => sum + Number(client.debt || 0), 0);

  return [30, 60, 90].map((days) => {
    const limit = new Date(now);
    limit.setDate(limit.getDate() + days);
    const dueExpenses = openExpenses
      .filter((expense) => !expense.dueDate || new Date(`${expense.dueDate}T23:59:59`).getTime() <= limit.getTime())
      .reduce((sum, expense) => sum + expenseBalance(expense), 0);
    const projectedRevenue = dailyRevenue * days;
    const projectedCashExpenses = dailyCashExpense * days;
    return {
      days,
      projectedRevenue,
      projectedCashExpenses,
      dueExpenses,
      projectedBalance: projectedRevenue - projectedCashExpenses - dueExpenses,
      clientDebt,
    };
  });
}

function renderCashFlowForecastPanel() {
  const rows = cashFlowForecast();
  return `
    <section class="card advanced-panel" style="margin-top: 16px;">
      <div class="card-head">
        <div><h2 class="card-title">Fluxo de caixa futuro</h2><p>Projecao baseada na media recebida e nas saidas dos ultimos 30 dias. O fiado aparece separado.</p></div>
      </div>
      <div class="forecast-grid">
        ${rows.map((row) => `
          <article class="forecast-card ${row.projectedBalance < 0 ? "negative" : "positive"}">
            <span>Proximos ${row.days} dias</span>
            <strong>${money(row.projectedBalance)}</strong>
            <small>Entradas previstas: ${money(row.projectedRevenue)}</small>
            <small>Despesas e saidas: ${money(row.dueExpenses + row.projectedCashExpenses)}</small>
            <small>Fiado a receber, fora da projecao: ${money(row.clientDebt)}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function reconciliationReviewForSale(saleId) {
  return (state.reconciliationReviews || []).find((review) => review.saleId === saleId) || null;
}

function paymentReconciliationForSale(sale) {
  if (!isFinancialSale(sale)) return { status: "ignored", label: "Ignorada", detail: sale.status || "Venda inativa" };
  const review = reconciliationReviewForSale(sale.id);
  if (review?.status === "confirmed") return { status: "confirmed", label: "Conferida", detail: review.note || "Conferencia manual" };
  if (review?.status === "discrepancy") return { status: "discrepancy", label: "Divergencia", detail: review.note || "Marcada pelo administrador" };

  const parts = salePaymentParts(sale);
  const pointParts = parts.filter((part) => isPointPayment(part.method));
  if (!pointParts.length) return { status: "confirmed", label: "Conferida", detail: "Pagamento interno sem operadora" };

  const partsTotal = parts.reduce((sum, part) => sum + Number(part.amount || 0), 0);
  if (parts.length > 1 && Math.abs(partsTotal - Number(sale.total || 0)) > 0.02) {
    return { status: "discrepancy", label: "Divergencia", detail: `Divisao ${money(partsTotal)} / venda ${money(sale.total)}` };
  }

  const references = normalizeProviderReferences(sale.providerReferences);
  if (!references.length) {
    if (sale.manualReference) return { status: "confirmed", label: "Conferida", detail: `Referencia manual ${sale.manualReference}` };
    return { status: "pending", label: "Revisar", detail: "Venda sem identificador da operadora" };
  }

  const providerTotal = references.reduce((sum, reference) => sum + Number(reference.amount || 0), 0);
  const pointTotal = pointParts.reduce((sum, part) => sum + Number(part.amount || 0), 0);
  if (Math.abs(providerTotal - pointTotal) > 0.02) {
    return { status: "discrepancy", label: "Divergencia", detail: `Operadora ${money(providerTotal)} / cartao e Pix ${money(pointTotal)}` };
  }
  if (references.some((reference) => ["failed", "canceled", "expired"].includes(reference.status))) {
    return { status: "discrepancy", label: "Divergencia", detail: "Operadora informou falha ou cancelamento" };
  }
  if (references.every((reference) => reference.provider === "mercado_pago" && reference.status === "processed")) {
    return { status: "confirmed", label: "Conciliada", detail: "Confirmada automaticamente pelo Mercado Pago" };
  }
  if (references.every((reference) => reference.status === "processed")) {
    return { status: "confirmed", label: "Conciliada", detail: "Confirmada pela operadora" };
  }
  return { status: "pending", label: "Revisar", detail: "Aguardando confirmacao externa" };
}

function reconciliationRows() {
  return state.sales
    .filter((sale) => isFinancialSale(sale) && new Date(sale.date).getTime() >= advancedDaysAgo(90).getTime())
    .map((sale) => ({ sale, reconciliation: paymentReconciliationForSale(sale) }))
    .sort((a, b) => new Date(b.sale.date) - new Date(a.sale.date));
}

function renderPaymentReconciliationPanel() {
  const rows = reconciliationRows();
  const confirmed = rows.filter((row) => row.reconciliation.status === "confirmed");
  const pending = rows.filter((row) => row.reconciliation.status === "pending");
  const discrepancies = rows.filter((row) => row.reconciliation.status === "discrepancy");
  const pendingAmount = [...pending, ...discrepancies].reduce((sum, row) => sum + saleReceivedAmount(row.sale), 0);
  return `
    <section class="card advanced-panel reconciliation-panel" style="margin-top: 16px;">
      <div class="card-head">
        <div><h2 class="card-title">Conciliacao de pagamentos</h2><p>Compara vendas, divisao de valores e retorno das operadoras nos ultimos 90 dias.</p></div>
        <button class="btn compact secondary" type="button" data-refresh-reconciliation>Atualizar operadoras</button>
      </div>
      <div class="advanced-kpis">
        <span><strong>${confirmed.length}</strong> conciliadas</span>
        <span><strong>${pending.length}</strong> para revisar</span>
        <span><strong>${discrepancies.length}</strong> divergencias</span>
        <span><strong>${money(pendingAmount)}</strong> em atencao</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Data</th><th>Venda</th><th>Pagamento</th><th>Operadora</th><th>Valor</th><th>Status</th><th>Acao</th></tr></thead>
          <tbody>
            ${rows.slice(0, 100).map(({ sale, reconciliation }) => `
              <tr>
                <td>${dateTime(sale.date)}</td>
                <td>${escapeHtml(saleItemsDescription(sale) || sale.id)}</td>
                <td>${escapeHtml(paymentDisplay(sale))}</td>
                <td>${escapeHtml((sale.providerReferences || []).map((reference) => reference.provider === "mercado_pago" ? "Mercado Pago" : reference.provider === "stone" ? "Stone" : reference.provider).join(", ") || sale.terminalLabel || "Interno")}</td>
                <td>${money(saleReceivedAmount(sale))}</td>
                <td><span class="status ${reconciliation.status === "confirmed" ? "green" : reconciliation.status === "discrepancy" ? "red" : reconciliation.status === "ignored" ? "blue" : "amber"}">${reconciliation.label}</span><small class="table-detail">${escapeHtml(reconciliation.detail)}</small></td>
                <td>${session?.role === "admin" && reconciliation.status !== "ignored" ? `<button class="btn compact secondary" type="button" data-open-modal="reconciliationReview" data-id="${sale.id}">Conferir</button>` : "-"}</td>
              </tr>
            `).join("") || '<tr><td colspan="7">Nenhuma venda no periodo.</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function businessAnomalies() {
  const anomalies = [];
  const today = salesForToday({ includeInactive: true });
  const todayFinancial = today.filter(isFinancialSale);
  const reconciliation = reconciliationRows();
  const discrepancyRows = reconciliation.filter((row) => row.reconciliation.status === "discrepancy");
  const pendingRows = reconciliation.filter((row) => row.reconciliation.status === "pending");
  if (discrepancyRows.length) anomalies.push({ severity: "high", title: "Pagamentos divergentes", detail: `${discrepancyRows.length} venda(s) precisam de conferencia.`, view: "reports" });
  if (pendingRows.length) anomalies.push({ severity: "medium", title: "Conciliacao pendente", detail: `${pendingRows.length} venda(s) sem confirmacao externa.`, view: "reports" });

  const highDiscountPercent = Number(state.settings.anomalySettings?.highDiscountPercent || 15);
  const highDiscountSales = todayFinancial.filter((sale) => {
    const discount = saleDiscountAmount(sale);
    return discount > 0 && advancedPercent(discount, Number(sale.total || 0) + discount) >= highDiscountPercent;
  });
  if (highDiscountSales.length) anomalies.push({ severity: "medium", title: "Descontos elevados", detail: `${highDiscountSales.length} venda(s) acima de ${highDiscountPercent}% hoje.`, view: "sales" });

  const canceled = today.filter((sale) => sale.status === "Cancelada");
  const cancelRate = advancedPercent(canceled.length, today.length);
  if (today.length >= 3 && cancelRate >= Number(state.settings.anomalySettings?.cancellationPercent || 8)) {
    anomalies.push({ severity: "high", title: "Cancelamentos acima do normal", detail: `${cancelRate.toFixed(1)}% das vendas de hoje foram canceladas.`, view: "sales" });
  }

  const critical = state.products.filter((product) => product.active !== false && productAvailableStock(product) <= Number(product.criticalStock || 0));
  if (critical.length) anomalies.push({ severity: "high", title: "Estoque critico", detail: `${critical.length} produto(s) no nivel critico ou zerado.`, view: "stock" });

  const recentCashDifferences = state.cashSessions.filter((cash) => cash.closedAt && new Date(cash.closedAt).getTime() >= advancedDaysAgo(7).getTime() && Math.abs(Number(cash.difference || 0)) > Number(state.settings.closingDifferenceLimit || 5));
  if (recentCashDifferences.length) anomalies.push({ severity: "high", title: "Diferencas de caixa", detail: `${recentCashDifferences.length} fechamento(s) fora do limite em 7 dias.`, view: "cash" });

  const overdue = (state.expenses || []).filter((expense) => expenseBalance(expense) > 0 && expense.dueDate && new Date(`${expense.dueDate}T23:59:59`) < new Date());
  if (overdue.length) anomalies.push({ severity: "high", title: "Despesas vencidas", detail: `${overdue.length} despesa(s), saldo ${money(overdue.reduce((sum, expense) => sum + expenseBalance(expense), 0))}.`, view: "suppliers" });

  const salesWithoutItems = todayFinancial.filter((sale) => !isManualChargeSale(sale) && !isExternalPaymentSale(sale) && !(sale.items || []).length);
  if (salesWithoutItems.length) anomalies.push({ severity: "medium", title: "Vendas sem produtos", detail: `${salesWithoutItems.length} registro(s) sem itens no historico.`, view: "sales" });
  if (pendingOfflineOperations().length) anomalies.push({ severity: "high", title: "Sincronizacao pendente", detail: `${pendingOfflineOperations().length} venda(s) aguardando envio.`, view: "online" });

  const lastSevenTotals = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - index - 1);
    return buildDailySalesTotal(localDateKey(day)).received;
  });
  const average = lastSevenTotals.reduce((sum, value) => sum + value, 0) / 7;
  const todayReceived = todayFinancial.reduce((sum, sale) => sum + saleReceivedAmount(sale), 0);
  if (average > 0 && todayReceived > average * 2.5) anomalies.push({ severity: "info", title: "Pico de vendas", detail: `Hoje esta ${advancedPercent(todayReceived - average, average).toFixed(0)}% acima da media recente.`, view: "sales" });

  return anomalies;
}

function dailyManagerSummary() {
  const today = buildDailySalesTotal(localDateKey());
  const previous = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - index - 1);
    return buildDailySalesTotal(localDateKey(day));
  });
  const averageReceived = previous.reduce((sum, entry) => sum + Number(entry.received || 0), 0) / 7;
  const variation = averageReceived > 0 ? advancedPercent(today.received - averageReceived, averageReceived) : 0;
  const inventory = inventoryIntelligence();
  const openExpenseBalance = (state.expenses || []).reduce((sum, expense) => sum + expenseBalance(expense), 0);
  const anomalies = businessAnomalies();
  const suggestions = [];
  const topReorder = inventory.filter((row) => row.reorderQty > 0).slice(0, 3);
  if (topReorder.length) suggestions.push(`Priorize a compra de ${topReorder.map((row) => `${row.product.name} (${qty(row.reorderQty)})`).join(", ")}.`);
  if (anomalies.some((item) => item.title.includes("Pagamentos") || item.title.includes("Conciliacao"))) suggestions.push("Confira a conciliacao antes do proximo fechamento.");
  if (openExpenseBalance > 0) suggestions.push(`Reserve caixa para ${money(openExpenseBalance)} em despesas abertas.`);
  if (!suggestions.length) suggestions.push("Operacao sem pendencias criticas detectadas neste momento.");
  return { today, averageReceived, variation, inventory, openExpenseBalance, anomalies, suggestions };
}

function renderDailyManagerPanel() {
  const summary = dailyManagerSummary();
  const high = summary.anomalies.filter((item) => item.severity === "high").length;
  return `
    <section class="card daily-manager-panel">
      <div class="daily-manager-head">
        <div>
          <span class="eyebrow">GERENTE DIARIO IA</span>
          <h2>${high ? `${high} ponto(s) exigem sua atencao` : "Operacao acompanhada e sem alerta critico"}</h2>
          <p>Recebido hoje ${money(summary.today.received)}, ${summary.variation >= 0 ? "+" : ""}${summary.variation.toFixed(1)}% contra a media dos 7 dias anteriores.</p>
        </div>
        <button class="btn primary compact" type="button" data-view="assistant">Conversar com a IA</button>
      </div>
      <div class="manager-actions">
        ${summary.suggestions.slice(0, 3).map((suggestion) => `<span>${escapeHtml(suggestion)}</span>`).join("")}
      </div>
    </section>
  `;
}

function renderAnomalyPanel() {
  const anomalies = businessAnomalies();
  return `
    <section class="card advanced-panel" style="margin-top: 16px;">
      <div class="card-head"><div><h2 class="card-title">Deteccao de problemas</h2><p>Regras automaticas para pagamentos, descontos, cancelamentos, caixa, estoque e despesas.</p></div><span class="status ${anomalies.some((item) => item.severity === "high") ? "red" : anomalies.length ? "amber" : "green"}">${anomalies.length ? `${anomalies.length} alerta(s)` : "Tudo normal"}</span></div>
      <div class="anomaly-list">
        ${anomalies.map((item) => `
          <button type="button" class="anomaly-row severity-${item.severity}" data-view="${item.view}">
            <span></span><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></div>
          </button>
        `).join("") || '<div class="empty">Nenhuma anomalia relevante detectada.</div>'}
      </div>
    </section>
  `;
}

function priceSimulationValues(form) {
  const product = state.products.find((entry) => entry.id === String(form.get("productId") || ""));
  const cost = Math.max(0, Number(form.get("cost") || 0));
  const extraCost = Math.max(0, Number(form.get("extraCost") || 0));
  const cardFee = Math.max(0, Number(form.get("cardFee") || 0));
  const tax = Math.max(0, Number(form.get("tax") || 0));
  const targetMargin = Math.max(0, Number(form.get("targetMargin") || 0));
  const deductions = (cardFee + tax + targetMargin) / 100;
  const suggestedPrice = deductions < 0.95 ? (cost + extraCost) / (1 - deductions) : 0;
  const currentPrice = Math.max(0, Number(form.get("currentPrice") || product?.price || 0));
  const currentMargin = currentPrice > 0 ? ((currentPrice - cost - extraCost - currentPrice * ((cardFee + tax) / 100)) / currentPrice) * 100 : 0;
  return { product, cost, extraCost, cardFee, tax, targetMargin, deductions, suggestedPrice, currentPrice, currentMargin };
}

function renderPriceSimulatorModal() {
  const defaults = state.settings.pricingDefaults || {};
  const selected = state.products.find((product) => product.active !== false) || null;
  return `
    <form id="price-simulator-form">
      <div class="modal-head">
        <div><h2>Produto e simulador de preco</h2><p>Cadastre ou atualize o produto, movimente o saldo e calcule o preco sugerido.</p></div>
        <button class="icon-btn" type="button" data-close-modal title="Fechar">${icon("close")}</button>
      </div>
      <div class="modal-body price-simulator-body">
        <section class="price-simulator-section">
          <div class="price-simulator-section-head">
            <div><h3>Cadastro do produto</h3><p>Escolha um item para editar ou cadastre um produto novo.</p></div>
            <span class="status ${selected ? "green" : "blue"}" data-price-product-status>${selected ? "Produto existente" : "Novo produto"}</span>
          </div>
          <div class="form-grid">
            <label class="field full">
              <span>Produto</span>
              <select name="productId">
                <option value="">+ Cadastrar novo produto</option>
                ${state.products.map((product) => `<option value="${product.id}" ${selected?.id === product.id ? "selected" : ""}>${escapeHtml(product.name)}${product.active === false ? " (inativo)" : ""}</option>`).join("")}
              </select>
            </label>
            <label class="field full"><span>Nome</span><input name="name" required value="${escapeHtml(selected?.name || "")}" /></label>
            <div class="price-simulator-output price-simulator-output-inline full" data-price-simulator-output></div>
            <label class="field"><span>Codigo do produto</span><input name="productCode" value="${escapeHtml(selected?.productCode || "")}" placeholder="Ex.: 789123 ou LT600" /></label>
            ${Array.from({ length: 5 }, (_, index) => `<label class="field"><span>Codigo de barras ${index + 1}</span><input name="barcodeCode${index + 1}" value="${escapeHtml(productBarcodeCodes(selected)[index] || "")}" placeholder="Opcional" /></label>`).join("")}
            <label class="field"><span>Categoria</span><input name="category" required value="${escapeHtml(selected?.category || "")}" /></label>
            <label class="field"><span>Status</span><select name="active"><option value="true" ${selected?.active !== false ? "selected" : ""}>Ativo</option><option value="false" ${selected?.active === false ? "selected" : ""}>Inativo</option></select></label>
            <label class="field"><span>Menu rapido do balcao</span><select name="favorite"><option value="true" ${selected?.favorite ? "selected" : ""}>Sim</option><option value="false" ${!selected?.favorite ? "selected" : ""}>Nao</option></select></label>
            <label class="field"><span>Praca de preparo</span><select name="station"><option value="Bar" ${selected?.station !== "Cozinha" ? "selected" : ""}>Bar</option><option value="Cozinha" ${selected?.station === "Cozinha" ? "selected" : ""}>Cozinha</option></select></label>
            <label class="field"><span>Estoque minimo</span><input name="minStock" type="number" min="0" step="1" required value="${selected?.minStock ?? 0}" /></label>
            <label class="field"><span>Estoque critico</span><input name="criticalStock" type="number" min="0" step="1" required value="${selected?.criticalStock ?? 0}" /></label>
            <label class="field"><span>Data de validade</span><input name="expiresAt" type="date" value="${selected?.expiresAt || ""}" /></label>
            <label class="field full"><span>Ficha tecnica</span><textarea name="recipeText" placeholder="Ex.: Cachaca:60, Limao:1">${recipeToText(selected?.recipe || [])}</textarea><small class="hint">Para venda fracionada, informe o consumo de cada insumo por venda.</small></label>
          </div>
        </section>

        <section class="price-simulator-section">
          <div class="price-simulator-section-head"><div><h3>Movimentacao do estoque</h3><p>O saldo atual e <strong data-price-current-stock>${qty(selected?.stock || 0)}</strong>.</p></div></div>
          <div class="form-grid">
            <label class="field"><span>Operacao</span><select name="stockMode"><option value="keep" ${selected ? "selected" : ""}>Manter saldo atual</option><option value="add">Adicionar ao saldo</option><option value="remove">Retirar do saldo</option><option value="set" ${selected ? "" : "selected"}>Definir novo saldo</option></select></label>
            <label class="field"><span>Quantidade</span><input name="stockQty" type="number" min="0" step="1" value="${selected ? "" : "0"}" placeholder="0" /></label>
            <label class="field full"><span>Motivo da movimentacao</span><input name="stockReason" value="Ajuste pelo simulador de preco" /></label>
          </div>
        </section>

        <section class="price-simulator-section price-simulator-pricing">
          <div class="price-simulator-section-head"><div><h3>Formacao do preco</h3><p>O preco sugerido cobre todos os percentuais informados abaixo.</p></div></div>
          <div class="form-grid">
            <label class="field"><span>Preco atual</span><input name="currentPrice" type="number" min="0" step="0.01" value="${selected?.price || 0}" readonly /></label>
            <label class="field"><span>Custo do produto</span><input name="cost" type="number" min="0" step="0.01" value="${selected?.cost || 0}" required /></label>
            <label class="field"><span>Custo extra por unidade</span><input name="extraCost" type="number" min="0" step="0.01" value="0" /></label>
            <label class="field"><span>Taxa de cartao (%)</span><input name="cardFee" type="number" min="0" max="50" step="0.01" value="${defaults.cardFee ?? 3.5}" /></label>
            <label class="field"><span>Impostos (%)</span><input name="tax" type="number" min="0" max="50" step="0.01" value="${defaults.tax ?? 0}" /></label>
            <label class="field"><span>Margem desejada (%)</span><input name="targetMargin" type="number" min="0" max="90" step="0.1" value="${defaults.targetMargin ?? 30}" /></label>
            <label class="field full"><span>Senha de administrador para salvar</span><input name="adminPassword" type="password" autocomplete="new-password" required /></label>
          </div>
        </section>
      </div>
      <div class="modal-actions"><button class="btn secondary" type="button" data-close-modal>Fechar sem alterar</button><button class="btn primary" type="submit">Salvar produto com preco sugerido</button></div>
    </form>
  `;
}

function setPriceSimulatorField(form, name, value) {
  const field = form.elements.namedItem(name);
  if (field) field.value = value ?? "";
}

function populatePriceSimulatorForm(form, product) {
  setPriceSimulatorField(form, "name", product?.name || "");
  setPriceSimulatorField(form, "productCode", product?.productCode || "");
  const barcodes = productBarcodeCodes(product);
  Array.from({ length: 5 }, (_, index) => setPriceSimulatorField(form, `barcodeCode${index + 1}`, barcodes[index] || ""));
  setPriceSimulatorField(form, "category", product?.category || "");
  setPriceSimulatorField(form, "active", product?.active === false ? "false" : "true");
  setPriceSimulatorField(form, "favorite", product?.favorite ? "true" : "false");
  setPriceSimulatorField(form, "station", product?.station === "Cozinha" ? "Cozinha" : "Bar");
  setPriceSimulatorField(form, "minStock", product?.minStock ?? 0);
  setPriceSimulatorField(form, "criticalStock", product?.criticalStock ?? 0);
  setPriceSimulatorField(form, "expiresAt", product?.expiresAt || "");
  setPriceSimulatorField(form, "recipeText", recipeToText(product?.recipe || []));
  setPriceSimulatorField(form, "stockMode", product ? "keep" : "set");
  setPriceSimulatorField(form, "stockQty", product ? "" : 0);
  setPriceSimulatorField(form, "currentPrice", product?.price || 0);
  setPriceSimulatorField(form, "cost", product?.cost || 0);
  const stock = form.querySelector("[data-price-current-stock]");
  if (stock) stock.textContent = qty(product?.stock || 0);
  const status = form.querySelector("[data-price-product-status]");
  if (status) {
    status.textContent = product ? "Produto existente" : "Novo produto";
    status.className = `status ${product ? "green" : "blue"}`;
  }
  updatePriceSimulatorPreview();
}

function updatePriceSimulatorPreview() {
  const formElement = document.querySelector("#price-simulator-form");
  const output = document.querySelector("[data-price-simulator-output]");
  if (!formElement || !output) return;
  const form = new FormData(formElement);
  const values = priceSimulationValues(form);
  output.innerHTML = values.suggestedPrice > 0
    ? `<span>Preco atual<strong>${money(values.currentPrice)}</strong></span><span>Margem atual estimada<strong>${values.currentMargin.toFixed(1)}%</strong></span><span class="suggested">Preco sugerido<strong>${money(values.suggestedPrice)}</strong></span>`
    : values.deductions >= 0.95
      ? '<div class="notice compact">A soma de taxa, imposto e margem precisa ficar abaixo de 95%.</div>'
      : '<div class="notice compact">Informe o custo do produto para calcular o preco sugerido.</div>';
}

async function submitPriceSimulator(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const values = priceSimulationValues(form);
  if (!Number.isFinite(values.suggestedPrice) || values.suggestedPrice <= 0) {
    notify("Revise os valores do simulador.");
    return;
  }
  const name = String(form.get("name") || "").trim();
  const category = String(form.get("category") || "").trim();
  if (!name || !category) {
    notify("Informe o nome e a categoria do produto.");
    return;
  }
  const stockMode = String(form.get("stockMode") || "keep");
  const stockQty = Number(form.get("stockQty") || 0);
  if (stockMode !== "keep" && (!Number.isFinite(stockQty) || stockQty < 0)) {
    notify("Informe uma quantidade valida para movimentar o estoque.");
    return;
  }
  const previousStock = Number(values.product?.stock || 0);
  const nextStock = stockMode === "add"
    ? previousStock + stockQty
    : stockMode === "remove"
      ? Math.max(0, previousStock - stockQty)
      : stockMode === "set"
        ? stockQty
        : previousStock;
  const admin = await authorizeAdminPassword(form.get("adminPassword"));
  if (!admin) {
    notify("Senha de administrador incorreta.");
    return;
  }
  const newPrice = Number(values.suggestedPrice.toFixed(2));
  const payload = {
    name,
    productCode: String(form.get("productCode") || "").trim(),
    barcodeCodes: normalizeBarcodeCodes(
      form.get("productCode"),
      Array.from({ length: 5 }, (_, index) => form.get(`barcodeCode${index + 1}`)),
    ),
    category,
    price: newPrice,
    cost: values.cost,
    stock: nextStock,
    minStock: Number(form.get("minStock") || 0),
    criticalStock: Number(form.get("criticalStock") || 0),
    expiresAt: form.get("expiresAt") || "",
    station: form.get("station") || "Bar",
    recipe: parseRecipeText(form.get("recipeText")),
    favorite: form.get("favorite") === "true",
    active: form.get("active") === "true",
    imageUrl: values.product?.imageUrl || "",
  };
  const stockAdjustment = values.product && nextStock !== previousStock
    ? {
        previousStock,
        nextStock,
        reason: String(form.get("stockReason") || "Ajuste pelo simulador de preco").trim(),
      }
    : null;

  if (isOnlineSession()) {
    currentModal.id = values.product?.id || null;
    const saved = await saveProductOnline(payload, null, false, "", {
      stockAdjustment,
      auditAction: values.product ? "Produto e preco atualizados online" : "Produto criado com preco calculado online",
      successMessage: `${values.product ? "Produto atualizado" : "Produto criado"} com preco sugerido de ${money(newPrice)}.`,
    });
    if (!saved) return;
    return;
  }

  if (values.product) {
    state.products = state.products.map((product) => product.id === values.product.id ? { ...product, ...payload } : product);
  } else {
    state.products.push({ id: id("product"), ...payload });
  }
  if (stockAdjustment) {
    state.inventoryCounts.unshift({
      id: id("inventory"),
      date: new Date().toISOString(),
      itemType: "product",
      itemId: values.product.id,
      expected: stockAdjustment.previousStock,
      counted: stockAdjustment.nextStock,
      difference: stockAdjustment.nextStock - stockAdjustment.previousStock,
      userId: session.id,
      notes: `Ajuste pelo simulador: ${stockAdjustment.reason}`,
    });
  }
  logAudit(
    values.product ? "Produto e preco atualizados" : "Produto criado com preco calculado",
    `${payload.name}: ${money(values.currentPrice)} para ${money(newPrice)}. Autorizado por ${admin.name}.`,
  );
  saveState();
  currentModal = null;
  notify(`${values.product ? "Produto atualizado" : "Produto criado"} com preco sugerido de ${money(newPrice)}.`);
  renderApp();
}

function cashClosingExpectedByMethod(openCash, summary) {
  return Object.fromEntries(cashPaymentMethods.map((method) => [method, Number(cashCountedValueForMethod(openCash, summary, method) || 0)]));
}

function cashClosingDifferences(openCash, counted) {
  const summary = cashSummary(openCash);
  const expected = cashClosingExpectedByMethod(openCash, summary);
  const methods = Object.fromEntries(cashPaymentMethods.map((method) => [method, {
    expected: Number(expected[method] || 0),
    counted: Number(counted[method] || 0),
    difference: Number((Number(counted[method] || 0) - Number(expected[method] || 0)).toFixed(2)),
  }]));
  const countedTotal = Object.values(methods).reduce((sum, row) => sum + row.counted, 0);
  const expectedTotal = Object.values(methods).reduce((sum, row) => sum + row.expected, 0);
  return {
    methods,
    countedTotal: Number(countedTotal.toFixed(2)),
    expectedTotal: Number(expectedTotal.toFixed(2)),
    totalDifference: Number((countedTotal - expectedTotal).toFixed(2)),
    largestDifference: Math.max(Math.abs(countedTotal - expectedTotal), ...Object.values(methods).map((row) => Math.abs(row.difference))),
  };
}

function renderCashClosingForm(openCash, summary) {
  const expected = cashClosingExpectedByMethod(openCash, summary);
  return `
    <div class="closing-reconciliation">
      <div class="closing-grid closing-grid-head"><span>Forma</span><span>Esperado</span><span>Contado</span><span>Diferenca</span></div>
      ${cashPaymentMethods.map((method) => `
        <label class="closing-grid">
          <strong>${method}</strong>
          <span>${money(expected[method])}</span>
          <input name="counted-${method}" data-cash-counted="${method}" data-expected="${expected[method]}" type="number" min="0" step="0.01" value="${expected[method]}" />
          <span data-cash-difference="${method}" class="closing-difference">${money(0)}</span>
        </label>
      `).join("")}
      <div class="closing-total"><span>Diferenca total</span><strong data-cash-total-difference>${money(0)}</strong></div>
      <div class="notice compact" data-cash-authorization-notice hidden>Diferenca acima de ${money(state.settings.closingDifferenceLimit || 0)}. Informe o motivo e a senha do administrador.</div>
      <div class="form-grid compact-grid">
        <label class="field full"><span>Observacao do fechamento</span><textarea name="notes" data-cash-notes></textarea></label>
        <label class="field full" data-cash-admin-field hidden><span>Senha do administrador</span><input name="adminPassword" type="password" autocomplete="new-password" /></label>
      </div>
    </div>
  `;
}

function updateCashClosingPreview() {
  const openCash = getOpenCash();
  const formElement = document.querySelector("#cash-form");
  if (!openCash || !formElement) return;
  const counted = countedFromCashForm(new FormData(formElement));
  const reconciliation = cashClosingDifferences(openCash, counted);
  Object.entries(reconciliation.methods).forEach(([method, row]) => {
    const element = formElement.querySelector(`[data-cash-difference="${method}"]`);
    if (!element) return;
    element.textContent = money(row.difference);
    element.className = `closing-difference ${Math.abs(row.difference) > 0.009 ? "has-difference" : ""}`;
  });
  const total = formElement.querySelector("[data-cash-total-difference]");
  if (total) {
    total.textContent = money(reconciliation.totalDifference);
    total.className = Math.abs(reconciliation.totalDifference) > 0.009 ? "has-difference" : "";
  }
  const requiresAuthorization = reconciliation.largestDifference > Number(state.settings.closingDifferenceLimit || 0);
  const notice = formElement.querySelector("[data-cash-authorization-notice]");
  const adminField = formElement.querySelector("[data-cash-admin-field]");
  if (notice) notice.hidden = !requiresAuthorization;
  if (adminField) adminField.hidden = !requiresAuthorization;
}

function buildClosingReconciliation(openCash, summary, counted, authorization = null, closedAt = new Date().toISOString()) {
  const reconciliation = cashClosingDifferences(openCash, counted);
  return {
    version: 2,
    expected: Object.fromEntries(Object.entries(reconciliation.methods).map(([method, row]) => [method, row.expected])),
    counted: Object.fromEntries(Object.entries(reconciliation.methods).map(([method, row]) => [method, row.counted])),
    differences: Object.fromEntries(Object.entries(reconciliation.methods).map(([method, row]) => [method, row.difference])),
    expectedTotal: reconciliation.expectedTotal,
    countedTotal: reconciliation.countedTotal,
    totalDifference: reconciliation.totalDifference,
    status: reconciliation.largestDifference <= 0.009 ? "matched" : authorization ? "authorized" : "reviewed",
    authorizedBy: authorization?.id || null,
    authorizedByName: authorization?.name || "",
    reconciledAt: closedAt,
  };
}

async function authorizeCashClosingDifference(openCash, counted, notes, formElement) {
  const reconciliation = cashClosingDifferences(openCash, counted);
  if (reconciliation.largestDifference <= Number(state.settings.closingDifferenceLimit || 0)) return null;
  if (!String(notes || "").trim()) {
    notify("Explique a diferenca de caixa antes de fechar.");
    formElement.querySelector("[name='notes']")?.focus();
    return false;
  }
  const password = new FormData(formElement).get("adminPassword");
  const admin = await authorizeAdminPassword(password);
  if (!admin) {
    notify("A diferenca exige senha valida de administrador.");
    formElement.querySelector("[name='adminPassword']")?.focus();
    return false;
  }
  return { id: admin.id, name: admin.name };
}

function normalizedClosingBreakdown(cash) {
  const value = cash?.closingBreakdown;
  if (!value || typeof value !== "object") return null;
  if (value.version === 2) return value;
  const counted = Object.fromEntries(cashPaymentMethods.map((method) => [method, Number(value[method] || 0)]));
  return { version: 1, counted, status: Math.abs(Number(cash.difference || 0)) <= 0.009 ? "matched" : "reviewed" };
}

function cashClosingStatusMarkup(cash) {
  if (!cash.closedAt) return '<span class="status blue">Em aberto</span>';
  const breakdown = normalizedClosingBreakdown(cash);
  if (!breakdown) return '<span class="status amber">Sem detalhe</span>';
  if (breakdown.status === "matched") return '<span class="status green">Conferido</span>';
  if (breakdown.status === "authorized") return `<span class="status amber">Autorizado</span><small class="table-detail">${escapeHtml(breakdown.authorizedByName || "Administrador")}</small>`;
  return '<span class="status amber">Com diferenca</span>';
}

async function loadOnlineReconciliationReviews() {
  if (!isOnlineSession()) return false;
  const { data, error } = await supabaseClient.from("payment_reconciliation_reviews").select("*").order("reviewed_at", { ascending: false });
  if (error) {
    if (!advancedMissingMigration(error)) notify(`Falha ao carregar conciliacoes: ${error.message}`);
    return false;
  }
  state.reconciliationReviews = (data || []).map((row) => ({
    id: row.id,
    saleId: row.sale_id,
    status: row.status,
    note: row.note || "",
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
  }));
  saveState();
  return true;
}

function encodedPaymentForSale(sale, providerReferences = sale.providerReferences) {
  return encodePaymentDetails({
    payment: sale.payment,
    breakdown: sale.paymentBreakdown,
    cashReceived: sale.cashReceived,
    cashChange: sale.cashChange,
    discount: sale.discount,
    paymentOrigin: sale.paymentOrigin,
    manualReference: sale.manualReference,
    terminalLabel: sale.terminalLabel,
    providerReferences,
  });
}

async function refreshPaymentReconciliation({ silent = false, force = false } = {}) {
  if (reconciliationRefreshRunning) return;
  if (!isOnlineSession()) {
    if (!silent) notify("Entre com uma conta online para consultar as operadoras.");
    return;
  }
  reconciliationRefreshRunning = true;
  let checked = 0;
  let changed = 0;
  try {
    const sales = state.sales.filter((sale) => normalizeProviderReferences(sale.providerReferences).some((reference) => reference.provider === "mercado_pago" && reference.orderId));
    for (const sale of sales.slice(0, 100)) {
      const references = normalizeProviderReferences(sale.providerReferences);
      let saleChanged = false;
      for (const reference of references) {
        if (reference.provider !== "mercado_pago" || !reference.orderId) continue;
        const checkedAt = new Date(reference.checkedAt || 0).getTime();
        const recentlyConfirmed = reference.status === "processed" && Date.now() - checkedAt < 6 * 60 * 60 * 1000;
        if (!force && recentlyConfirmed) continue;
        checked += 1;
        const response = await fetch(`/api/mercadopago/order-status?id=${encodeURIComponent(reference.orderId)}&accountKey=${encodeURIComponent(reference.accountKey || "primary")}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) continue;
        const nextStatus = String(data.status || reference.status || "pending").toLowerCase();
        if (nextStatus !== reference.status || String(data.status_detail || "") !== reference.statusDetail) saleChanged = true;
        reference.status = nextStatus;
        reference.statusDetail = String(data.status_detail || "");
        reference.checkedAt = new Date().toISOString();
      }
      if (!saleChanged) continue;
      const { error } = await supabaseClient.from("sales").update({ payment: encodedPaymentForSale(sale, references) }).eq("id", sale.id);
      if (!error) changed += 1;
    }
    await loadOnlineSalesData();
    await loadOnlineReconciliationReviews();
    logAudit("Conciliacao atualizada", `${checked} cobranca(s) consultada(s), ${changed} venda(s) atualizada(s).`);
    if (!silent) notify(`Conciliacao concluida: ${checked} cobranca(s) consultada(s).`);
  } catch (error) {
    if (!silent) notify(`Falha na conciliacao: ${error.message}`);
  } finally {
    reconciliationRefreshRunning = false;
    if (!silent) renderApp();
  }
}

function renderReconciliationReviewModal() {
  const sale = state.sales.find((entry) => entry.id === currentModal.id);
  if (!sale) return '<div class="modal-head"><h2>Venda nao encontrada</h2><button class="icon-btn" type="button" data-close-modal>Fechar</button></div>';
  const current = reconciliationReviewForSale(sale.id);
  const automatic = paymentReconciliationForSale(sale);
  return `
    <form id="reconciliation-review-form">
      <div class="modal-head"><div><h2>Conferir pagamento</h2><p>${dateTime(sale.date)} - ${money(saleReceivedAmount(sale))}</p></div><button class="icon-btn" type="button" data-close-modal>${icon("close")}</button></div>
      <div class="summary-list compact-summary">
        <div class="summary-row"><span>Produtos</span><strong>${escapeHtml(saleItemsDescription(sale) || "Sem itens")}</strong></div>
        <div class="summary-row"><span>Pagamento</span><strong>${escapeHtml(paymentDisplay(sale))}</strong></div>
        <div class="summary-row"><span>Leitura automatica</span><strong>${escapeHtml(automatic.label)} - ${escapeHtml(automatic.detail)}</strong></div>
        <div class="summary-row"><span>Referencias</span><strong>${escapeHtml(normalizeProviderReferences(sale.providerReferences).map((reference) => `${reference.provider}: ${reference.orderId || reference.reference || "manual"}`).join(" | ") || "Nenhuma")}</strong></div>
      </div>
      <div class="form-grid">
        <label class="field"><span>Resultado da conferencia</span><select name="status"><option value="confirmed" ${current?.status === "confirmed" ? "selected" : ""}>Confirmar valor</option><option value="pending" ${current?.status === "pending" ? "selected" : ""}>Manter pendente</option><option value="discrepancy" ${current?.status === "discrepancy" ? "selected" : ""}>Registrar divergencia</option></select></label>
        <label class="field"><span>Senha do administrador</span><input name="adminPassword" type="password" autocomplete="new-password" required /></label>
        <label class="field full"><span>Observacao</span><textarea name="note" required>${escapeHtml(current?.note || "")}</textarea></label>
      </div>
      <div class="modal-actions"><button class="btn secondary" type="button" data-close-modal>Cancelar</button><button class="btn primary" type="submit">Salvar conferencia</button></div>
    </form>
  `;
}

async function submitReconciliationReview(event) {
  event.preventDefault();
  const sale = state.sales.find((entry) => entry.id === currentModal.id);
  const form = new FormData(event.currentTarget);
  if (!sale) return;
  const admin = await authorizeAdminPassword(form.get("adminPassword"));
  if (!admin) {
    notify("Senha de administrador incorreta.");
    return;
  }
  const review = {
    id: reconciliationReviewForSale(sale.id)?.id || uuid(),
    saleId: sale.id,
    status: String(form.get("status") || "pending"),
    note: String(form.get("note") || "").trim(),
    reviewedBy: admin.id,
    reviewedAt: new Date().toISOString(),
  };
  if (isOnlineSession()) {
    const { data, error } = await supabaseClient.from("payment_reconciliation_reviews").upsert({
      sale_id: sale.id,
      status: review.status,
      note: review.note,
      reviewed_by: admin.id,
      reviewed_at: review.reviewedAt,
    }, { onConflict: "sale_id" }).select("*").single();
    if (error) {
      notify(advancedMissingMigration(error) ? `Execute ${ADVANCED_SCHEMA_FILE} no Supabase antes de salvar a conciliacao online.` : `Erro ao salvar conciliacao: ${error.message}`);
      return;
    }
    review.id = data.id;
  }
  state.reconciliationReviews = [review, ...state.reconciliationReviews.filter((entry) => entry.saleId !== sale.id)];
  logAudit("Pagamento conferido", `${sale.id}: ${review.status}. ${review.note}`);
  saveState();
  currentModal = null;
  notify("Conferencia registrada.");
  renderApp();
}

function advancedDeviceKey() {
  let key = localStorage.getItem(DEVICE_KEY_STORAGE);
  if (!key) {
    key = globalThis.crypto?.randomUUID?.() || uuid();
    localStorage.setItem(DEVICE_KEY_STORAGE, key);
  }
  return key;
}

function advancedDeviceLabel() {
  const platform = navigator.userAgentData?.platform || navigator.platform || "Aparelho";
  const browser = /Edg\//.test(navigator.userAgent) ? "Edge" : /Firefox\//.test(navigator.userAgent) ? "Firefox" : /Chrome\//.test(navigator.userAgent) ? "Chrome" : /Safari\//.test(navigator.userAgent) ? "Safari" : "Navegador";
  return `${platform} - ${browser}`.slice(0, 120);
}

async function touchOnlineDevice({ force = false } = {}) {
  if (!isOnlineSession() || !isUuid(session?.id)) return true;
  if (!force && Date.now() - advancedDeviceHeartbeatAt < 2 * 60 * 1000) return true;
  advancedDeviceHeartbeatAt = Date.now();
  let { data, error } = await supabaseClient.rpc("touch_app_device", {
    p_device_key: advancedDeviceKey(),
    p_label: advancedDeviceLabel(),
    p_user_agent: navigator.userAgent.slice(0, 500),
  });
  if (error && /jwt|token|session|auth/i.test(error.message || "")) {
    const refreshed = await supabaseClient.auth.refreshSession();
    if (!refreshed.error && refreshed.data?.session) {
      ({ data, error } = await supabaseClient.rpc("touch_app_device", {
        p_device_key: advancedDeviceKey(),
        p_label: advancedDeviceLabel(),
        p_user_agent: navigator.userAgent.slice(0, 500),
      }));
    }
  }
  if (error) {
    setCloudReachable(false, error.message || "Nao foi possivel renovar a sessao online.");
    session = { ...session, offlineCached: true };
    cacheOfflineSession(session);
    return true;
  }
  if (data?.allowed === false) {
    notify("Este aparelho foi desconectado pelo administrador.");
    await logout();
    return false;
  }
  return true;
}

async function loadOnlineDevices() {
  if (!isOnlineSession()) return false;
  const { data, error } = await supabaseClient.from("app_devices").select("*").order("last_seen_at", { ascending: false });
  if (error) {
    advancedDevicesLoaded = true;
    return false;
  }
  state.onlineDevices = (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    deviceKey: row.device_key,
    label: row.label || "Aparelho",
    userAgent: row.user_agent || "",
    lastSeenAt: row.last_seen_at,
    revokedAt: row.revoked_at,
    createdAt: row.created_at,
  }));
  advancedDevicesLoaded = true;
  saveState();
  return true;
}

async function setDeviceRevoked(deviceId, revoked) {
  if (session?.role !== "admin") return;
  const password = prompt(`Digite a senha do administrador para ${revoked ? "desconectar" : "reativar"} este aparelho:`);
  const admin = await authorizeAdminPassword(password);
  if (!admin) {
    notify("Senha de administrador incorreta.");
    return;
  }
  const { error } = await supabaseClient.rpc("set_app_device_revoked", { p_device_id: deviceId, p_revoked: revoked });
  if (error) {
    notify(advancedMissingMigration(error) ? `Execute ${ADVANCED_SCHEMA_FILE} no Supabase para usar a central de aparelhos.` : `Erro ao alterar aparelho: ${error.message}`);
    return;
  }
  logAudit(revoked ? "Aparelho desconectado" : "Aparelho reativado", deviceId);
  await loadOnlineDevices();
  notify(revoked ? "Aparelho desconectado." : "Aparelho reativado.");
  renderApp();
}

async function loadMfaStatus() {
  if (!isOnlineSession()) {
    advancedMfaState = { loaded: true, enabled: false, factorId: "", factors: [] };
    return advancedMfaState;
  }
  const { data, error } = await supabaseClient.auth.mfa.listFactors();
  if (error) return advancedMfaState;
  const factors = [...(data?.totp || []), ...(data?.phone || [])];
  const verified = factors.find((factor) => factor.status === "verified");
  advancedMfaState = { loaded: true, enabled: Boolean(verified), factorId: verified?.id || "", factors };
  return advancedMfaState;
}

async function beginMfaEnrollment() {
  if (!isOnlineSession() || session?.role !== "admin") return;
  const password = prompt("Confirme sua senha de administrador para ativar a verificacao em duas etapas:");
  const admin = await authorizeAdminPassword(password);
  if (!admin) {
    notify("Senha de administrador incorreta.");
    return;
  }
  const { data, error } = await supabaseClient.auth.mfa.enroll({ factorType: "totp", friendlyName: `${state.settings.barName} - ${advancedDeviceLabel()}`.slice(0, 60) });
  if (error) {
    notify(`Nao foi possivel iniciar o 2FA: ${error.message}`);
    return;
  }
  advancedMfaEnrollment = data;
  currentModal = { type: "mfaSetup" };
  renderApp();
}

async function disableMfa() {
  if (!isOnlineSession() || !advancedMfaState.factorId) return;
  const password = prompt("Confirme sua senha de administrador para desativar o 2FA:");
  const admin = await authorizeAdminPassword(password);
  if (!admin) {
    notify("Senha de administrador incorreta.");
    return;
  }
  const { error } = await supabaseClient.auth.mfa.unenroll({ factorId: advancedMfaState.factorId });
  if (error) {
    notify(`Nao foi possivel desativar o 2FA: ${error.message}`);
    return;
  }
  await loadMfaStatus();
  logAudit("2FA desativado", session.name);
  notify("Verificacao em duas etapas desativada.");
  renderApp();
}

function renderMfaSetupModal() {
  const enrollment = advancedMfaEnrollment;
  if (!enrollment?.id || !enrollment?.totp) return '<div class="modal-head"><h2>Configuracao indisponivel</h2><button class="icon-btn" type="button" data-close-modal>Fechar</button></div>';
  const qrCode = String(enrollment.totp.qr_code || "");
  return `
    <form id="mfa-setup-form">
      <div class="modal-head"><div><h2>Ativar verificacao em duas etapas</h2><p>Use Google Authenticator, Microsoft Authenticator ou outro app TOTP.</p></div><button class="icon-btn" type="button" data-close-modal>${icon("close")}</button></div>
      <div class="mfa-setup">
        ${qrCode ? `<img src="${escapeHtml(qrCode)}" alt="QR Code para configurar autenticador" />` : ""}
        <div><span>Chave manual</span><code>${escapeHtml(enrollment.totp.secret || "")}</code><small>Guarde esta chave em local seguro. Ela nao sera mostrada novamente.</small></div>
      </div>
      <label class="field"><span>Codigo de 6 digitos</span><input name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" required /></label>
      <div class="modal-actions"><button class="btn secondary" type="button" data-close-modal>Cancelar</button><button class="btn primary" type="submit">Confirmar e ativar</button></div>
    </form>
  `;
}

async function submitMfaSetup(event) {
  event.preventDefault();
  const code = String(new FormData(event.currentTarget).get("code") || "").replace(/\D/g, "");
  const factorId = advancedMfaEnrollment?.id;
  if (!factorId || code.length !== 6) {
    notify("Digite o codigo de 6 digitos.");
    return;
  }
  const { error } = await supabaseClient.auth.mfa.challengeAndVerify({ factorId, code });
  if (error) {
    notify(`Codigo invalido: ${error.message}`);
    return;
  }
  advancedMfaEnrollment = null;
  await loadMfaStatus();
  currentModal = null;
  logAudit("2FA ativado", session.name);
  notify("Verificacao em duas etapas ativada.");
  renderApp();
}

function renderSecurityCenter() {
  const devices = state.onlineDevices || [];
  const currentKey = advancedDeviceKey();
  return `
    <section class="card advanced-panel security-center" style="margin-top: 16px;">
      <div class="card-head"><div><h2 class="card-title">Seguranca e aparelhos</h2><p>2FA, aparelhos autorizados e sessoes online conhecidas.</p></div><span class="status ${advancedMfaState.enabled ? "green" : "amber"}">${advancedMfaState.enabled ? "2FA ativo" : "2FA recomendado"}</span></div>
      <div class="security-actions">
        ${isOnlineSession() && session?.role === "admin" ? advancedMfaState.enabled ? '<button class="btn danger" type="button" data-disable-mfa>Desativar 2FA</button>' : '<button class="btn primary" type="button" data-enable-mfa>Ativar 2FA</button>' : '<span class="notice compact">O 2FA e a central de aparelhos exigem a conta online do administrador.</span>'}
        <button class="btn secondary" type="button" data-refresh-devices ${isOnlineSession() ? "" : "disabled"}>Atualizar aparelhos</button>
      </div>
      ${!advancedDevicesLoaded && isOnlineSession() ? '<div class="empty">Carregando aparelhos...</div>' : `
        <div class="table-wrap"><table><thead><tr><th>Usuario</th><th>Aparelho</th><th>Ultimo acesso</th><th>Status</th><th>Acao</th></tr></thead><tbody>
          ${devices.map((device) => {
            const current = device.deviceKey === currentKey;
            return `<tr><td>${escapeHtml(userName(device.userId))}</td><td><strong>${escapeHtml(device.label)}</strong>${current ? '<small class="table-detail">Este aparelho</small>' : ""}</td><td>${dateTime(device.lastSeenAt)}</td><td><span class="status ${device.revokedAt ? "red" : "green"}">${device.revokedAt ? "Desconectado" : "Ativo"}</span></td><td>${session?.role === "admin" && !current ? `<button class="btn compact ${device.revokedAt ? "secondary" : "danger"}" type="button" data-device-revoke="${device.id}" data-revoked="${device.revokedAt ? "false" : "true"}">${device.revokedAt ? "Reativar" : "Desconectar"}</button>` : "-"}</td></tr>`;
          }).join("") || '<tr><td colspan="5">Nenhum aparelho registrado. Execute a migracao avancada e atualize.</td></tr>'}
        </tbody></table></div>
      `}
      ${isOnlineSession() && !devices.length ? advancedMigrationNotice() : ""}
    </section>
  `;
}

async function startMfaLoginChallenge(profile) {
  const factorsResult = await supabaseClient.auth.mfa.listFactors();
  if (factorsResult.error) return false;
  const verified = (factorsResult.data?.totp || []).find((factor) => factor.status === "verified");
  if (!verified) return false;
  const assurance = await supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance.data?.currentLevel === "aal2" || assurance.data?.nextLevel !== "aal2") return false;
  const challenge = await supabaseClient.auth.mfa.challenge({ factorId: verified.id });
  if (challenge.error) throw challenge.error;
  pendingMfaLogin = { profile, factorId: verified.id, challengeId: challenge.data.id };
  renderMfaLogin();
  return true;
}

function renderMfaLogin() {
  applyAppearance();
  app.innerHTML = `
    <main class="login-shell"><section class="login-brand"><img class="login-logo" src="${BRAND_LOGO_URL}" alt="Logo ${APP_DISPLAY_NAME}" /><h1>${state.settings.barName || APP_DISPLAY_NAME}</h1><p>Protecao adicional da conta administrativa.</p></section>
      <section class="login-panel"><h2>Codigo de seguranca</h2><p class="hint">Abra seu aplicativo autenticador e digite o codigo de 6 digitos.</p>
        <form id="mfa-login-form" autocomplete="off"><label class="field"><span>Codigo</span><input name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" required autofocus /></label><button class="btn primary" type="submit">Confirmar acesso</button><button class="btn secondary" type="button" data-cancel-mfa-login>Voltar</button></form>
      </section></main>`;
  document.querySelector("#mfa-login-form")?.addEventListener("submit", verifyMfaLogin);
  document.querySelector("[data-cancel-mfa-login]")?.addEventListener("click", async () => {
    pendingMfaLogin = null;
    await supabaseClient.auth.signOut({ scope: "local" });
    renderLogin();
  });
}

async function verifyMfaLogin(event) {
  event.preventDefault();
  if (!pendingMfaLogin) return renderLogin();
  const code = String(new FormData(event.currentTarget).get("code") || "").replace(/\D/g, "");
  const { error } = await supabaseClient.auth.mfa.verify({ factorId: pendingMfaLogin.factorId, challengeId: pendingMfaLogin.challengeId, code });
  if (error) {
    notify("Codigo de seguranca incorreto ou expirado.");
    return;
  }
  const profile = pendingMfaLogin.profile;
  pendingMfaLogin = null;
  await completeAdvancedOnlineSession(profile);
}

async function completeAdvancedOnlineSession(profile) {
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
  await loadOnlineReconciliationReviews();
  await loadOnlineAuditLog();
  const deviceAllowed = await touchOnlineDevice({ force: true });
  if (!deviceAllowed) return false;
  await loadOnlineDevices();
  await loadMfaStatus();
  const preferredView = state.settings.shiftStartView?.[session.role];
  currentView = CURRENT_SERVICE_NUMBER > 1 && hasPermission("pos") ? "pos" : preferredView && hasPermission(preferredView) ? preferredView : getUserPermissions(session)[0] || "pos";
  logAudit("Login online", `${session.name} acessou pelo Supabase em ${advancedDeviceLabel()}.`);
  saveState();
  renderApp();
  startRealtimeSync();
  if (pendingOfflineOperations().length) setTimeout(() => syncPendingOfflineSales(), 500);
  return true;
}

const advancedOriginalLoginWithSupabase = loginWithSupabase;
loginWithSupabase = async function advancedLoginWithSupabase(username, password) {
  try {
    const { data: profiles, error: profileError } = await supabaseClient.rpc("lookup_profile_for_login", { username_input: username.trim() });
    if (profileError) throw profileError;
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;
    if (!profile || !profile.active || !profile.email) return false;
    const { error: authError } = await supabaseClient.auth.signInWithPassword({ email: profile.email, password });
    if (authError) {
      notify("Nome de usuario ou senha incorretos.");
      return true;
    }
    if (await startMfaLoginChallenge(profile)) return true;
    await completeAdvancedOnlineSession(profile);
    return true;
  } catch (error) {
    supabaseStatus = { checked: true, ok: false, message: error.message || "Falha no login online." };
    return false;
  }
};

restoreOnlineSession = async function advancedRestoreOnlineSession() {
  if (!isSupabaseReady()) return false;
  try {
    const { data: authData } = await supabaseClient.auth.getSession();
    const authUser = authData?.session?.user;
    if (!authUser) return false;
    const { data: profile, error } = await supabaseClient.from("profiles").select("*").eq("id", authUser.id).single();
    if (error || !profile?.active) return false;
    if (await startMfaLoginChallenge(profile)) return true;
    await completeAdvancedOnlineSession(profile);
    return true;
  } catch (error) {
    return false;
  }
};

async function loadOnlineAuditLog() {
  if (!isOnlineSession()) return false;
  const { data, error } = await supabaseClient.from("audit_log").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) return false;
  state.auditLog = (data || []).map((row) => ({ id: row.id, date: row.created_at, userId: row.user_id || "system", action: row.action, details: row.details || "" }));
  saveState();
  return true;
}

const advancedOriginalLogAudit = logAudit;
logAudit = function advancedLogAudit(action, details = "") {
  advancedOriginalLogAudit(action, details);
  if (isOnlineSession() && isUuid(session?.id)) {
    supabaseClient.from("audit_log").insert({ user_id: session.id, action: String(action).slice(0, 200), details: String(details || "").slice(0, 4000) }).then(({ error }) => {
      if (error && !advancedMissingMigration(error)) console.warn("Falha ao registrar auditoria online", error.message);
    });
  }
};

const advancedOriginalAssistantBusinessContext = assistantBusinessContext;
assistantBusinessContext = function advancedAssistantBusinessContext() {
  const context = advancedOriginalAssistantBusinessContext();
  const manager = dailyManagerSummary();
  return {
    ...context,
    management_briefing: {
      received_today: manager.today.received,
      seven_day_daily_average: manager.averageReceived,
      variation_percent: Number(manager.variation.toFixed(2)),
      open_expenses: manager.openExpenseBalance,
      suggestions: manager.suggestions,
    },
    inventory_intelligence: manager.inventory.slice(0, 80).map((row) => ({
      product_id: row.product.id,
      product: row.product.name,
      abc_class: row.abc,
      stock: row.stock,
      sold_last_30_days: row.soldQty,
      daily_velocity: Number(row.dailyVelocity.toFixed(3)),
      coverage_days: row.coverageDays === null ? null : Number(row.coverageDays.toFixed(1)),
      suggested_reorder: row.reorderQty,
      dead_stock: row.deadStock,
      inventory_loss: row.loss,
    })),
    cash_flow_forecast: cashFlowForecast(),
    anomalies: manager.anomalies,
    payment_reconciliation: reconciliationRows().reduce((summary, row) => {
      summary[row.reconciliation.status] = Number(summary[row.reconciliation.status] || 0) + 1;
      return summary;
    }, {}),
  };
};

const advancedOriginalBindModalForms = bindModalForms;
bindModalForms = function advancedBindModalForms() {
  advancedOriginalBindModalForms();
  const priceForm = document.querySelector("#price-simulator-form");
  priceForm?.addEventListener("submit", submitPriceSimulator);
  priceForm?.addEventListener("input", updatePriceSimulatorPreview);
  priceForm?.querySelector("[name='productId']")?.addEventListener("change", (event) => {
    const product = state.products.find((entry) => entry.id === event.target.value);
    populatePriceSimulatorForm(priceForm, product || null);
  });
  if (priceForm) updatePriceSimulatorPreview();
  document.querySelector("#reconciliation-review-form")?.addEventListener("submit", submitReconciliationReview);
  document.querySelector("#mfa-setup-form")?.addEventListener("submit", submitMfaSetup);
};

const advancedOriginalBindViewEvents = bindViewEvents;
bindViewEvents = function advancedBindViewEvents() {
  advancedOriginalBindViewEvents();
  document.querySelector("[data-refresh-reconciliation]")?.addEventListener("click", () => refreshPaymentReconciliation({ force: true }));
  document.querySelector("[data-enable-mfa]")?.addEventListener("click", beginMfaEnrollment);
  document.querySelector("[data-disable-mfa]")?.addEventListener("click", disableMfa);
  document.querySelector("[data-refresh-devices]")?.addEventListener("click", async () => {
    await touchOnlineDevice({ force: true });
    await loadOnlineDevices();
    notify("Lista de aparelhos atualizada.");
    renderApp();
  });
  document.querySelectorAll("[data-device-revoke]").forEach((button) => {
    button.addEventListener("click", () => setDeviceRevoked(button.dataset.deviceRevoke, button.dataset.revoked === "true"));
  });
  document.querySelectorAll("[data-cash-counted]").forEach((input) => input.addEventListener("input", updateCashClosingPreview));
  if (document.querySelector("[data-cash-counted]")) updateCashClosingPreview();

  if (currentView === "settings" && isOnlineSession()) {
    if (!advancedMfaState.loaded) loadMfaStatus().then(() => renderApp());
    if (!advancedDevicesLoaded) loadOnlineDevices().then(() => renderApp());
  }
};

const advancedOriginalCloseModal = closeModal;
closeModal = function advancedCloseModal() {
  if (currentModal?.type === "mfaSetup" && advancedMfaEnrollment?.id) {
    supabaseClient.auth.mfa.unenroll({ factorId: advancedMfaEnrollment.id }).catch(() => {});
    advancedMfaEnrollment = null;
  }
  advancedOriginalCloseModal();
};

setInterval(async () => {
  if (!session) return;
  if (session.online) {
    const deviceAllowed = await touchOnlineDevice();
    if (!deviceAllowed) return;
    if (Date.now() - reconciliationAutoRefreshAt >= 10 * 60 * 1000) {
      reconciliationAutoRefreshAt = Date.now();
      await refreshPaymentReconciliation({ silent: true });
    }
  }
}, 30 * 1000);

ensureAdvancedState();
if (session) renderApp();
