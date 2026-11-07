import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';
import site from '../src/content/site.json' with { type: 'json' };

const routes = ['/profissionais/', '/mr-cultural/profissionais/', '/tv/', '/tv/programas/'];
const videoProviders = /(^|\.)(youtube(?:-nocookie)?\.com|youtu\.be|vimeo\.com|vimeocdn\.com|ytimg\.com|googlevideo\.com)$/;
const whatsappUrl = `https://wa.me/${site.whatsapp}`;
const professionals = [
  { slug: 'alireza-dargahi', name: 'Dr. Alireza Dargahi', role: 'Atendimento médico', initials: 'AD' },
  { slug: 'leonardo-coelho', name: 'Dr. Leonardo Coelho', role: 'Atendimento médico', initials: 'LC' },
  { slug: 'wellington-medina', name: 'Wellington Medina', role: 'Psicologia', initials: 'WM' },
  { slug: 'thais-simoes', name: 'Thaís Simões', role: 'Assistência farmacêutica', initials: 'TS' },
];
const programs = [
  { slug: 'participacoes-na-tv', title: 'Participações na TV' },
  { slug: 'entrevistas-e-reportagens', title: 'Entrevistas e reportagens' },
  { slug: 'maria-do-reino-talks', title: 'Maria do Reino Talks' },
];

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document, `Documento com rolagem horizontal em ${page.url()}`).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.body, `Conteúdo com rolagem horizontal em ${page.url()}`).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function expectProfessionalCards(scope: Locator) {
  const cards = scope.locator('[data-professional-card]');
  await expect(cards).toHaveCount(professionals.length);
  await expect(cards.getByRole('heading')).toHaveText(professionals.map((person) => person.name));
  for (const person of professionals) {
    const card = scope.locator(`[data-professional-card][data-professional-slug="${person.slug}"]`);
    await expect(card).toHaveCount(1);
    await expect(card).toHaveAttribute('data-areas', 'saude');
    await expect(card).toContainText(person.role);
    const placeholder = card.locator('[data-professional-photo-placeholder]');
    await expect(placeholder).toContainText('Foto em breve');
    await expect(placeholder).toContainText(person.initials);
    await expect(card.locator('img, .professional-credentials, .professional-area--cultural')).toHaveCount(0);
    await expect(card.getByRole('link', { name: person.name, exact: true })).toHaveAttribute('href', `/profissionais/${person.slug}/`);
    const availability = card.locator('[data-professional-availability]');
    await expect(availability).toContainText('Consultar disponibilidade');
    await expect(availability).toHaveAttribute('href', whatsappUrl);
  }
}

async function expectProgramCards(scope: Locator) {
  const cards = scope.locator('[data-program-card]');
  await expect(cards).toHaveCount(programs.length);
  await expect(cards.getByRole('heading')).toHaveText(programs.map((program) => program.title));
  for (const program of programs) {
    const card = scope.locator(`[data-program-card][data-program-slug="${program.slug}"]`);
    await expect(card).toHaveCount(1);
    await expect(card).toHaveAttribute('data-program-status', 'planejamento');
    await expect(card).toContainText('Conteúdo em preparação');
    await expect(card.getByRole('link', { name: program.title, exact: true })).toHaveAttribute('href', `/tv/programas/${program.slug}/`);
    await expect(card.getByRole('link', { name: /Conhecer o espaço/ })).toHaveAttribute('href', `/tv/programas/${program.slug}/`);
    await expect(card.getByRole('button')).toHaveCount(0);
    await expect(card.getByRole('link', { name: /assistir|reproduzir|ao vivo/i })).toHaveCount(0);
    await expect(card.locator('iframe, video, audio, [data-video-load]')).toHaveCount(0);
  }
}

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
    await expectNoHorizontalOverflow(page);
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

test('MR Cultural inclui profissionais da associação sem atribuir atuação artística', async ({ page }) => {
  await page.goto('/mr-cultural/');
  const link = page.locator('main a[href="/mr-cultural/profissionais/"]').first();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/mr-cultural\/profissionais\/$/);
  await expect(page.locator('[data-professionals-tone="cultura"][data-professionals-area="todos"]')).toHaveCount(1);
  await expectProfessionalCards(page.locator('main'));
  await expect(page.locator('main a[href="/profissionais/"]').first()).toBeVisible();
});

test('listas apresentam os quatro perfis autorizados com fotos pendentes e consulta de disponibilidade', async ({ page }) => {
  for (const route of ['/profissionais/', '/mr-cultural/profissionais/']) {
    await page.goto(route);
    await expectProfessionalCards(page.locator('main'));
    await expect(page.locator('[data-professionals-empty], [data-professionals-filter]')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/CRM\s*[:\-]?\s*\d|CRP\s*[:\-]?\s*\d|CREF\s*[:\-]?\s*\d/i);
  }
});

test('home e MR Cultural destacam a equipe; home inclui os três espaços de conteúdo', async ({ page }) => {
  for (const route of ['/', '/mr-cultural/']) {
    await page.goto(route);
    await expectProfessionalCards(page.locator('main'));
    if (route === '/') await expectProgramCards(page.locator('main'));
    await prepareImages(page);
    await expectNoHorizontalOverflow(page);
  }
});

test('TV e catálogo apresentam programas em preparação sem simular vídeos disponíveis', async ({ page }) => {
  const providerRequests: string[] = [];
  page.on('request', (request) => {
    if (videoProviders.test(new URL(request.url()).hostname)) providerRequests.push(request.url());
  });
  // Os títulos foram autorizados no screenshot; não foram fornecidos episódios ou URLs.
  await page.goto('/tv/');
  await expect(page.locator('[data-tv-page]')).toHaveCount(1);
  await expectProgramCards(page.locator('[data-tv-programs]'));
  await expect(page.locator('[data-program-empty]')).toHaveCount(0);
  await expect(page.locator('[data-tv-episodes-empty]')).toBeVisible();
  await expect(page.locator('main iframe, main video, main audio')).toHaveCount(0);
  const catalog = page.locator('main a[href="/tv/programas/"]').first();
  await expect(catalog).toBeVisible();
  await catalog.click();
  await expect(page).toHaveURL(/\/tv\/programas\/$/);
  await expect(page.locator('[data-program-list]')).toHaveCount(1);
  await expectProgramCards(page.locator('main'));
  await expect(page.locator('[data-program-empty]')).toHaveCount(0);
  await expect(page.locator('main iframe, main video, main audio')).toHaveCount(0);
  expect(providerRequests, 'Sem episódios autorizados, a TV não deve requisitar provedores de vídeo.').toEqual([]);
});

test('os quatro perfis abrem seus detalhes sem foto ou registro profissional inventado', async ({ page }) => {
  for (const person of professionals) {
    await page.goto('/profissionais/');
    await page.getByRole('link', { name: person.name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/profissionais/${person.slug}/$`));
    await expect(page.locator('main h1')).toHaveText(person.name);
    await expect(page.locator('main')).toContainText(person.role);
    await expect(page.locator('[data-professional-photo-placeholder]')).toContainText('Foto em breve');
    await expect(page.locator('[data-professional-photo-placeholder]')).toContainText(person.initials);
    await expect(page.locator('.professional-profile-portrait img, .professional-profile-credentials')).toHaveCount(0);
    await expect(page.locator('main [data-professional-availability]')).toHaveAttribute('href', whatsappUrl);
    await expect(page.locator('main [data-professional-availability]')).toContainText('Consultar disponibilidade');
    await expect(page.locator('main')).not.toContainText(/CRM\s*[:\-]?\s*\d|CRP\s*[:\-]?\s*\d|CREF\s*[:\-]?\s*\d/i);
    await prepareImages(page);
    await expectNoHorizontalOverflow(page);
    const back = page.getByRole('link', { name: 'Todos os profissionais', exact: true });
    await expect(back).toHaveAttribute('href', '/profissionais/');
  }
});

test('os três programas abrem detalhes em preparação e oferecem contato sem player', async ({ page }) => {
  const providerRequests: string[] = [];
  page.on('request', (request) => {
    if (videoProviders.test(new URL(request.url()).hostname)) providerRequests.push(request.url());
  });
  for (const program of programs) {
    await page.goto('/tv/programas/');
    await page.getByRole('link', { name: program.title, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/tv/programas/${program.slug}/$`));
    await expect(page.locator('[data-program-detail]')).toHaveAttribute('data-program-status', 'planejamento');
    await expect(page.locator('main h1')).toHaveText(program.title);
    await expect(page.locator('[data-tv-episodes-empty]')).toContainText('Conteúdo em preparação');
    await expect(page.getByRole('link', { name: 'Falar com a associação', exact: true })).toHaveAttribute('href', '/contato/');
    await expect(page.locator('main iframe, main video, main audio, main [data-video-player], main [data-video-load]')).toHaveCount(0);
    await expect(page.locator('main').getByRole('link', { name: /assistir|reproduzir|ao vivo/i })).toHaveCount(0);
    await prepareImages(page);
    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole('link', { name: /^Conhecer outros (espaços|programas)$/ })).toHaveAttribute('href', '/tv/programas/');
  }
  expect(providerRequests).toEqual([]);
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
