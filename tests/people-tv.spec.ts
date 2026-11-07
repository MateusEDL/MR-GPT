import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const routes = ['/profissionais/', '/mr-cultural/profissionais/', '/tv/', '/tv/programas/'];
const videoProviders = /(^|\.)(youtube(?:-nocookie)?\.com|youtu\.be|vimeo\.com|vimeocdn\.com|ytimg\.com|googlevideo\.com)$/;

async function prepareImages(page: Page) {
  await page.locator('img').evaluateAll((images) => {
    for (const image of images) if (image instanceof HTMLImageElement) image.loading = 'eager';
  });
  await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((image) =>
    image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
  )), { message: 'Inclusive os logos e as imagens abaixo da dobra devem carregar.' }).toBe(true);
  await page.evaluate(() => document.fonts.ready);
}

async function revealFullPage(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let top = 0; top < height; top += 650) {
    await page.evaluate((position) => window.scrollTo({ top: position, behavior: 'instant' }), top);
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
}

for (const route of routes) {
  test(`nova página ${route}: resposta, conteúdo e layout`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S+/);
    await prepareImages(page);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(dimensions.document, `Documento com rolagem horizontal em ${route}`).toBeLessThanOrEqual(dimensions.viewport + 1);
    expect(dimensions.body, `Conteúdo com rolagem horizontal em ${route}`).toBeLessThanOrEqual(dimensions.viewport + 1);
    await expect(page.locator('main')).not.toContainText(/lorem ipsum|nome do profissional|título do programa|programa exemplo/i);
    expect(runtimeErrors).toEqual([]);
  });
}

test('navegação principal leva a profissionais e TV no desktop e no celular', async ({ page }, info) => {
  for (const destination of [
    { name: 'Profissionais', href: '/profissionais/' },
    { name: 'TV e programas', href: '/tv/' },
  ]) {
    await page.goto('/');
    const mobile = info.project.name === 'mobile';
    if (mobile) await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
    const navigation = page.getByRole('navigation', {
      name: mobile ? 'Navegação para celular' : 'Navegação principal', exact: true,
    });
    const link = navigation.getByRole('link', { name: destination.name, exact: true });
    await expect(link).toHaveCount(1);
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', destination.href);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${destination.href}$`));
    await expect(page.locator('main h1')).toBeVisible();
    if (mobile) await expect(page.getByRole('navigation', { name: 'Navegação para celular', exact: true })).toBeHidden();
  }
});

test('MR Cultural inclui um caminho para seus profissionais', async ({ page }) => {
  await page.goto('/mr-cultural/');
  const link = page.locator('main a[href="/mr-cultural/profissionais/"]').first();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/mr-cultural\/profissionais\/$/);
  await expect(page.locator('[data-professionals-area="cultura"]')).toHaveCount(1);
  await expect(page.locator('main a[href="/profissionais/"]').first()).toBeVisible();
});

test('listas de profissionais aguardam conteúdo validado com contato disponível', async ({ page }) => {
  // O acervo desta entrega está vazio. Atualizar este cenário quando perfis reais forem aprovados.
  for (const route of ['/profissionais/', '/mr-cultural/profissionais/']) {
    await page.goto(route);
    await expect(page.locator('[data-professional-card]')).toHaveCount(0);
    const empty = page.locator('[data-professionals-empty]');
    await expect(empty).toHaveCount(1);
    await expect(empty).toBeVisible();
    await expect(empty).toContainText(/profissionais|equipe|participação/i);
    await expect(page.locator('[data-professionals] a[href="/contato/"], [data-professionals] a[href^="https://wa.me/"]').first()).toBeVisible();
    await expect(page.locator('main')).not.toContainText(/CRM\s*[:\-]?\s*\d|CRP\s*[:\-]?\s*\d|CREF\s*[:\-]?\s*\d/i);
  }
});

test('TV e catálogo apresentam ausência de acervo sem conectar provedores de vídeo', async ({ page }) => {
  const providerRequests: string[] = [];
  page.on('request', (request) => {
    if (videoProviders.test(new URL(request.url()).hostname)) providerRequests.push(request.url());
  });
  // Não há programas ou episódios confirmados nesta entrega.
  await page.goto('/tv/');
  await expect(page.locator('[data-tv-page]')).toHaveCount(1);
  await expect(page.locator('[data-tv-programs] [data-program-card]')).toHaveCount(0);
  await expect(page.locator('[data-tv-programs] [data-program-empty]')).toBeVisible();
  await expect(page.locator('[data-tv-episodes-empty]')).toBeVisible();
  await expect(page.locator('main iframe, main video, main audio')).toHaveCount(0);
  const catalog = page.locator('main a[href="/tv/programas/"]').first();
  await expect(catalog).toBeVisible();
  await catalog.click();
  await expect(page).toHaveURL(/\/tv\/programas\/$/);
  await expect(page.locator('[data-program-list]')).toHaveCount(1);
  await expect(page.locator('[data-program-card]')).toHaveCount(0);
  await expect(page.locator('[data-program-empty]')).toBeVisible();
  await expect(page.locator('main iframe, main video, main audio')).toHaveCount(0);
  expect(providerRequests, 'Sem acervo e sem ação do usuário, a TV não deve requisitar provedores de vídeo.').toEqual([]);
});

for (const route of routes) {
  test(`acessibilidade WCAG A/AA das novas áreas em ${route}`, async ({ page }, info) => {
    await page.goto(route);
    await prepareImages(page);
    await revealFullPage(page);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    await info.attach('axe-people-tv', { body: JSON.stringify(result, null, 2), contentType: 'application/json' });
    expect(result.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map((node) => node.target) }))).toEqual([]);
  });
}
