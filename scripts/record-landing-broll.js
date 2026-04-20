/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outputDir = path.join(__dirname, '..', 'docs', 'assets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`🎬 Starting Landing Page B-Roll...`);

  const browser = await chromium.launch({
    headless: true, // Run headlessly to capture clean video
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1280, height: 720 },
    },
    colorScheme: 'dark',
  });

  const page = await context.newPage();

  console.log('🌐 Navigating to http://localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    console.log('📜 Showing off the landing page...');
    await page.evaluate(async () => {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      
      // Find the headers
      const headings = Array.from(document.querySelectorAll('h2'));
      const section1 = headings.find(h => h.textContent.includes('Three assets'));
      const section2 = headings.find(h => h.textContent.includes('Powered by'));

      // Helper to scroll to element center
      const scrollToCenter = (el) => {
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: top - window.innerHeight / 3, behavior: 'smooth' });
        }
      };

      if (section1) {
        scrollToCenter(section1);
        await delay(3000); // 3 seconds at section 1
      }

      if (section2) {
        scrollToCenter(section2);
        await delay(3000); // 3 seconds at section 2
      }
      
      // Scroll to the final CTA area so the "Launch Shipmate" button is visible
      const finalCta = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Stop writing'));
      if (finalCta) {
        scrollToCenter(finalCta);
        await delay(1000);
      }
    });

    await page.waitForTimeout(500);
    console.log('🔗 Clicking link to Dashboard...');
    await page.waitForSelector('a[href="/dashboard"]:has-text("Launch Shipmate")', { state: 'visible', timeout: 10000 });
    await page.click('a[href="/dashboard"]:has-text("Launch Shipmate")');

    console.log('⏳ Transitioning to dashboard...');
    await page.waitForSelector('input[name="repoUrl"]', { state: 'visible', timeout: 30000 });

    // linger for a second so the user can see it arrived
    await page.waitForTimeout(1500);

  } catch (err) {
    console.error('❌ Failed during recording:', err.message);
  }

  await context.close();

  // Find latest webm and rename it to 'landing-to-dashboard-broll.webm'
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
  const latestFile = files.map(f => ({ name: f, time: fs.statSync(path.join(outputDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time)[0]?.name;

  if (latestFile) {
    const finalPath = path.join(outputDir, `landing-to-dashboard-broll.webm`);
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath); // Remove if exists
    }
    fs.renameSync(path.join(outputDir, latestFile), finalPath);
    console.log(`✅ Saved to: ${finalPath}`);
  }

  await browser.close();
  console.log('\n🎉 Landing Page B-Roll recording completed!');
})();
