import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/', '/quem-somos/', '/como-se-associar/', '/acolhimento/',
  '/cannabis-medicinal/', '/mr-cultural/', '/mr-cultural/projetos/',
  '/mr-cultural/agenda/', '/mr-cultural/galeria/', '/agenda/', '/blog/',
  '/apoie/', '/perguntas-frequentes/', '/contato/',
  '/politica-de-privacidade/', '/cookies/', '/busca/',
];

async function prepareImages(page: Page) {
  // Also load below-the-fold images so a broken lazy image cannot pass this check.
  await page.locator('img').evaluateAll((images) => {
    images.filter((image): image is HTMLImageElement => image instanceof HTMLImageElement)
      .forEach((image) => { image.loading = 'eager'; });
  });
  await expect.poll(() => page.locator('img').evaluateAll((images) =>
    images.filter((image): image is HTMLImageElement => image instanceof HTMLImageElement)
      .every((image) => image.complete && image.naturalWidth > 0),
  ), { message: 'Todas as imagens devem carregar com dimensões válidas.' }).toBe(true);
  await page.evaluate(() => document.fonts.ready);
}

for (const route of routes) {
  test(`página ${route}: conteúdo acessível e layout sem cortes`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S+/);
    await prepareImages(page);
    const overflow = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(overflow.content, `Rolagem horizontal em ${route}`).toBeLessThanOrEqual(overflow.viewport + 1);
    await expect(page.locator('main')).not.toContainText(/lorem ipsum|estatuto|diretoria|OSCIP|CEBAS|Reino Green Village|Expo Reino Grow/i);
    expect(runtimeErrors).toEqual([]);
  });
}

test('home identifica as ilustrações e preserva o caminho dos associados', async ({ page }, testInfo) => {
  await page.goto('/');
  await prepareImages(page);
  const captions = page.locator('figcaption').filter({ hasText: 'Imagem ilustrativa gerada por IA' });
  await expect(captions).toHaveCount(2);
  for (const caption of await captions.all()) await expect(caption).toBeVisible();
  const memberLinks = page.getByRole('link', { name: 'Área do Associado' });
  expect(await memberLinks.count()).toBeGreaterThan(0);
  for (const link of await memberLinks.all()) {
    await expect(link).toHaveAttribute('href', 'https://acesso.mariadoreino.com.br/');
  }
  await expect(page.locator('main')).toContainText('Cultural como extensão do cuidado');
  await page.screenshot({ path: testInfo.outputPath('home-full.png'), fullPage: true, animations: 'disabled' });
});

test('menu móvel abre, fecha por Escape e permite navegar', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'O menu expansível é utilizado na largura móvel.');
  await page.goto('/');
  const toggle = page.locator('button[aria-controls="mobile-menu"]');
  const menu = page.getByRole('navigation', { name: 'Navegação para celular' });
  await expect(menu).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await menu.getByRole('link', { name: 'Contato', exact: true }).click();
  await expect(page).toHaveURL(/\/contato\/$/);
  await expect(page.locator('h1')).toBeVisible();
});

test('FAQ revela respostas por teclado', async ({ page }) => {
  await page.goto('/perguntas-frequentes/');
  const question = page.locator('summary').filter({ hasText: 'A associação é gratuita?' });
  const details = page.locator('details').filter({ has: question });
  await expect(details).not.toHaveAttribute('open');
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(details.locator('p')).toBeVisible();
  await expect(details).toContainText('Consultas, atendimentos e atividades têm condições próprias');
  await page.keyboard.press('Enter');
  await expect(details).not.toHaveAttribute('open');
});

test('busca encontra associação sem acentos e informa ausência de resultado', async ({ page }) => {
  await page.goto('/busca/');
  const input = page.getByRole('searchbox', { name: 'Buscar no site' });
  const status = page.locator('#search-status');
  await input.fill('associacao');
  await expect(status).toContainText(/resultado/);
  await expect(page.locator('#search-results a[href="/como-se-associar/"]')).toBeVisible();
  await input.fill('MR Cultural');
  await expect(page.locator('#search-results a[href="/mr-cultural/"]')).toBeVisible();
  await input.fill('termo-inexistente-xyz-91827');
  await expect(status).toContainText('Nenhum resultado encontrado');
  await expect(page.locator('#search-results article')).toHaveCount(0);
  await input.clear();
  await expect(status).toContainText('Digite uma palavra');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('agenda, notícias e galeria têm estados honestos sem registros inventados', async ({ page }) => {
  await page.goto('/agenda/');
  await expect(page.locator('[data-event-card]')).toHaveCount(0);
  await expect(page.locator('main')).toContainText('assim que estiver confirmada');
  await page.goto('/mr-cultural/agenda/');
  await expect(page.locator('[data-event-card]')).toHaveCount(0);
  await expect(page.locator('main')).toContainText('assim que estiver confirmada');
  await page.goto('/blog/');
  await expect(page.locator('main article')).toHaveCount(0);
  await expect(page.locator('main')).toContainText('Os conteúdos serão publicados');
  await page.goto('/mr-cultural/galeria/');
  await expect(page.locator('main')).toContainText('Nenhuma imagem ilustrativa representa aqui um evento realizado');
});

test('contato oferece WhatsApp sem simular formulário ainda não integrado', async ({ page }) => {
  await page.goto('/contato/');
  await expect(page.locator('[data-contact-form]')).toHaveCount(0);
  await expect(page.locator('main a[href^="https://wa.me/5547999108994"]').first()).toBeVisible();
  await expect(page.locator('main')).toContainText('Evite enviar documentos ou informações de saúde');
  await expect(page.locator('main')).not.toContainText('Sua mensagem foi recebida');
});

for (const route of ['/', '/quem-somos/', '/contato/']) {
  test(`acessibilidade automatizada WCAG A/AA em ${route}`, async ({ page }, testInfo) => {
    await page.goto(route);
    await prepareImages(page);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    await testInfo.attach('axe-results', { body: JSON.stringify(result, null, 2), contentType: 'application/json' });
    expect(result.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map((node) => node.target) }))).toEqual([]);
  });
}

test('painel carrega o bundle local e a configuração sem indexação', async ({ page, request }) => {
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  const config = await request.get('/admin/config.yml');
  expect(config.status()).toBe(200);
  const yaml = await config.text();
  expect(yaml).toContain('MateusEDL/MR-GPT');
  expect(yaml).toContain('src/content/home.json');
  expect(yaml).toContain('src/content/site.json');
  const response = await page.goto('/admin/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('script[src="/admin/vendor/decap-cms.js"]')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => Boolean((window as unknown as { CMS?: unknown }).CMS))).toBe(true);
  await expect(page.locator('body')).not.toHaveText('');
  expect(runtimeErrors).toEqual([]);
});
