const COMMONS_API_URL = "https://commons.wikimedia.org/w/api.php";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", status === 200 ? "public, s-maxage=1800, stale-while-revalidate=86400" : "no-store");
  res.end(JSON.stringify(data));
}

function queryValue(req, name) {
  if (req.query?.[name] !== undefined) return String(req.query[name] || "");
  try {
    return new URL(req.url || "/", "https://app.local").searchParams.get(name) || "";
  } catch {
    return "";
  }
}

function plainText(value, maxLength = 120) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function selectionUrl(imageUrl, pageId, license, credit) {
  const url = new URL(imageUrl);
  url.hash = new URLSearchParams({
    commons: String(pageId),
    license: plainText(license, 48),
    credit: plainText(credit, 90),
  }).toString();
  return url.href;
}

function simplifiedProductSearch(value) {
  return String(value || "")
    .replace(/\b\d+(?:[.,]\d+)?\s*(?:ml|litros?|l|kg|g|unidades?|un)\b/gi, " ")
    .replace(/\b(?:garrafas?|latas?|latao|lat\u00f5es|pet|long neck|caixas?|pacotes?)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchCommonsPages(search) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: search,
    gsrnamespace: "6",
    gsrlimit: "16",
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "800",
    iiextmetadatalanguage: "pt",
    format: "json",
    formatversion: "2",
    origin: "*",
  });
  const response = await fetch(`${COMMONS_API_URL}?${params}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "DistribuidoraEncontroDasAguas/1.0 (busca de imagens para cadastro de produtos)",
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("A fonte de imagens nao respondeu.");
  return data.query?.pages || [];
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    json(res, 405, { error: "method_not_allowed" });
    return;
  }

  const search = queryValue(req, "q").trim().slice(0, 100);
  if (search.length < 2) {
    json(res, 400, { error: "invalid_search", message: "Digite pelo menos 2 caracteres para pesquisar." });
    return;
  }

  try {
    const fallbackSearch = simplifiedProductSearch(search);
    const attempts = [search];
    if (fallbackSearch.length >= 2 && fallbackSearch.toLocaleLowerCase("pt-BR") !== search.toLocaleLowerCase("pt-BR")) {
      attempts.push(fallbackSearch);
    }
    let pages = [];
    let usedSearch = search;
    for (const attempt of attempts) {
      pages = await fetchCommonsPages(attempt);
      usedSearch = attempt;
      if (pages.some((page) => ALLOWED_IMAGE_TYPES.has(page.imageinfo?.[0]?.mime))) break;
    }

    const results = pages
      .map((page) => {
        const info = page.imageinfo?.[0];
        if (!info || !ALLOWED_IMAGE_TYPES.has(info.mime)) return null;
        const imageUrl = String(info.thumburl || info.url || "");
        if (!imageUrl.startsWith("https://")) return null;
        const metadata = info.extmetadata || {};
        const license = plainText(metadata.LicenseShortName?.value || metadata.UsageTerms?.value || "Ver licenca", 48);
        const credit = plainText(metadata.Artist?.value || metadata.Credit?.value || metadata.Attribution?.value || "Wikimedia Commons", 90);
        const sourceUrl = String(info.descriptionurl || `https://commons.wikimedia.org/?curid=${page.pageid}`);
        return {
          id: page.pageid,
          title: plainText(String(page.title || "Imagem").replace(/^File:/i, ""), 100),
          thumbnailUrl: imageUrl,
          selectionUrl: selectionUrl(imageUrl, page.pageid, license, credit),
          sourceUrl,
          license,
          credit,
        };
      })
      .filter(Boolean)
      .slice(0, 12);

    json(res, 200, { provider: "Wikimedia Commons", search: usedSearch, results });
  } catch (error) {
    json(res, 502, {
      error: "image_search_failed",
      message: error.message || "Nao foi possivel pesquisar imagens agora.",
    });
  }
};
