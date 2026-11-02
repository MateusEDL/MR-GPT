import { test, expect, type Locator, type Page, type TestInfo } from '@playwright/test';
import site from '../src/content/site.json' with { type: 'json' };

// Verifica os arquivos realmente servidos e a geometria da apresentação.
// Contagem de pixels não comprova fidelidade gráfica nem recupera detalhes:
// a fidelidade dos originais é conferida por inspeção humana e pelos registros dos arquivos.
const assets = {
  institutional: '/uploads/logo-maria-do-reino.png',
  cultural: '/uploads/logo-mr-cultural.png',
} as const;

async function atProjectWidths(page: Page, info: TestInfo, check: () => Promise<void>) {
  const configured = page.viewportSize();
  const widths = info.project.name === 'mobile' ? [configured?.width || 390, 360] : [configured?.width || 1440];
  for (const width of [...new Set(widths)]) {
    await test.step(`Layout com ${width}px de largura`, async () => {
      await page.setViewportSize({ width, height: configured?.height || 1000 });
      await check();
    });
  }
}

async function expectContainedSource(image: Locator, source: string) {
  await expect(image).toHaveCount(1);
  await image.scrollIntoViewIfNeeded();
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute('src', source);
  await expect.poll(async () => image.evaluate((node) => {
    const img = node as HTMLImageElement;
    return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
  }), { message: 'O arquivo do logo deve carregar sem imagem quebrada.' }).toBe(true);
  await expect(image).toHaveCSS('object-fit', 'contain');
  await expect(image).toHaveCSS('clip-path', 'none');
  await expect(image).toHaveCSS('border-radius', '0px');
  await expect(image.locator('..')).toHaveCSS('overflow', 'visible');

  const dimensions = await image.evaluate((node) => {
    const img = node as HTMLImageElement;
    return { sourceWidth: img.naturalWidth, sourceHeight: img.naturalHeight, displayedWidth: img.getBoundingClientRect().width, displayedHeight: img.getBoundingClientRect().height, maximumWidth: Number.parseFloat(getComputedStyle(img).maxWidth), maximumHeight: Number.parseFloat(getComputedStyle(img).maxHeight) };
  });
  expect(dimensions.displayedWidth).toBeGreaterThan(0);
  expect(dimensions.maximumWidth).toBe(dimensions.sourceWidth / 2);
  expect(dimensions.maximumHeight).toBe(dimensions.sourceHeight / 2);
  expect(dimensions.sourceHeight).toBeGreaterThanOrEqual(dimensions.displayedHeight * 2);
  expect(dimensions.sourceWidth, 'O arquivo deve ter ao menos 2 pixels de origem por pixel CSS de largura.').toBeGreaterThanOrEqual(dimensions.displayedWidth * 2);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport + 1);
}

test('logo institucional carrega sem recorte e a navegação continua acessível', async ({ page }, info) => {
  expect(site.logoInstitutional).toBe(assets.institutional);
  await atProjectWidths(page, info, async () => {
    await page.goto('/');
    const logo = page.locator('.site-header .brand-logo--institutional.brand-logo--header img');
    await expectContainedSource(logo, assets.institutional);
    await expect(logo).toHaveAttribute('loading', 'eager');
    await expect(page.locator('.site-header .brand')).toHaveAccessibleName(/Maria do Reino/);
    await expectNoHorizontalOverflow(page);

    const toggle = page.locator('.menu-toggle');
    if ((page.viewportSize()?.width || 1440) <= 1050) {
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAccessibleName('Abrir menu');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#mobile-menu')).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await page.locator('#mobile-menu').getByRole('link', { name: 'MR Cultural', exact: true }).click();
    } else {
      await page.getByRole('navigation', { name: 'Navegação principal', exact: true }).getByRole('link', { name: 'MR Cultural', exact: true }).click();
    }
    await expect(page).toHaveURL(/\/mr-cultural\/$/);
    await expectNoHorizontalOverflow(page);
  });
});

test('logo MR Cultural aparece na home e no hero cultural sem distorção', async ({ page }, info) => {
  expect(site.logoCultural).toBe(assets.cultural);
  await atProjectWidths(page, info, async () => {
    await page.goto('/');
    const homeLogo = page.locator('.culture-section .brand-logo--cultural.brand-logo--feature img');
    await expectContainedSource(homeLogo, assets.cultural);
    await expect(homeLogo).toHaveAttribute('alt', 'MR Cultural');
    const originalSize = await homeLogo.evaluate((node) => ({ width: (node as HTMLImageElement).naturalWidth, height: (node as HTMLImageElement).naturalHeight }));
    if (originalSize.width === 150 && originalSize.height === 150) {
      await expect(homeLogo.locator('..')).toHaveClass(/brand-logo--compact/);
      expect((await homeLogo.boundingBox())?.width).toBeLessThanOrEqual(75);
    } else {
      await expect(homeLogo.locator('..')).not.toHaveClass(/brand-logo--compact/);
    }
    await expectNoHorizontalOverflow(page);

    await page.goto('/mr-cultural/');
    const culturalLogo = page.locator('.cultural-copy .brand-logo--cultural.brand-logo--feature img');
    await expectContainedSource(culturalLogo, assets.cultural);
    await expect(culturalLogo).toHaveAttribute('alt', 'MR Cultural');
    await expectNoHorizontalOverflow(page);
  });
});

test('rodapé apresenta os dois logos carregados e inteiros', async ({ page }, info) => {
  await atProjectWidths(page, info, async () => {
    for (const path of ['/', '/mr-cultural/']) {
      await page.goto(path);
      const footer = page.locator('.site-footer');
      await footer.scrollIntoViewIfNeeded();
      await expectContainedSource(footer.locator('.brand-logo--institutional.brand-logo--footer img'), assets.institutional);
      const culturalLogo = footer.locator('.brand-logo--cultural.brand-logo--footer img');
      await expectContainedSource(culturalLogo, assets.cultural);
      await expect(culturalLogo).toHaveAttribute('alt', 'MR Cultural');
      await expectNoHorizontalOverflow(page);
    }
  });
});
