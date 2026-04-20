/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROJECTS = [
  // Edge Case 1: Pure Python CLI / System Script (No web framework)
  'https://github.com/edycutjong/terminalrescue.py',

  // Edge Case 2: Full-Stack Web3 with Solidity Smart Contracts & AI integration
  'https://github.com/edycutjong/clawsearch-darkdesk',

  // Edge Case 3: Offline Multimodal AI (Vector DB, Whisper audio processing, Next.js)
  'https://github.com/edycutjong/RescueNodeZero'
];

(async () => {
  const outputDir = path.join(__dirname, '..', 'docs', 'assets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`🎬 Starting Hero to Dashboard B-Roll for ${PROJECTS.length} projects...`);

  const browser = await chromium.launch({
    headless: true, // Run headlessly to capture clean video
  });

  for (let i = 0; i < PROJECTS.length; i++) {
    const repoUrl = PROJECTS[i];
    const projectName = repoUrl.split('/').pop();
    console.log(`\n===========================================`);
    console.log(`🎥 Project ${i + 1}/${PROJECTS.length}: ${projectName}`);

    // Create new context for each project to get separate video files
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: {
        dir: outputDir,
        size: { width: 1280, height: 720 },
      },
      colorScheme: 'dark',
    });

    const page = await context.newPage();

    console.log('🌐 Navigating directly to http://localhost:3000/dashboard...');
    try {
      await page.goto('http://localhost:3000/dashboard', { waitUntil: 'domcontentloaded', timeout: 30000 });

      console.log('⏳ Transitioning to dashboard...');
      const inputSelector = 'input[name="repoUrl"]';
      await page.waitForSelector(inputSelector, { state: 'visible', timeout: 30000 });

      // Typing the GitHub link just like before
      console.log(`🤖 Typing URL: ${repoUrl}`);
      await page.fill(inputSelector, '');
      await page.type(inputSelector, repoUrl, { delay: 15 });
      await page.waitForTimeout(200);

      console.log('🚀 Clicking Analyze button...');
      const analyzeBtn = await page.$('button[type="submit"]');
      if (analyzeBtn) {
        await analyzeBtn.click();
      } else {
        await page.keyboard.press('Enter');
      }

      console.log('⏳ Waiting for analysis to complete...');
      await page.waitForSelector('text="Analyzed"', { timeout: 30000 });
      await page.waitForTimeout(500);

      // 1. Pause on 'Overview' (the main RepoSummary section)
      console.log('📌 Pausing on Overview for 3s...');
      await page.waitForTimeout(3000);

      // Scroll down slightly so panels are more centered
      await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'smooth' }));
      await page.waitForTimeout(600);

      // Helper function to expand, wait, and minimize a panel
      const viewPanel = async (title) => {
        console.log(`🔍 Opening ${title}...`);
        const panelLoc = page.locator(`.spotlight-card:has(h3:has-text("${title}"))`);
        const expandBtn = panelLoc.locator('button[title="Expand"]');
        const minBtn = panelLoc.locator('button[title="Minimize"]');

        try {
          // Wait briefly in case it's still streaming the first chunk
          await expandBtn.waitFor({ state: 'visible', timeout: 5000 });
          await expandBtn.click();
          await page.waitForTimeout(1000);
          await minBtn.click();
          await page.waitForTimeout(500); // Wait for minimize animation
        } catch (e) {
          console.log(`⚠️ Could not expand/minimize ${title}:`, e.message);
        }
      };

      // 2. Open each section
      await viewPanel('Landing Page');
      await viewPanel('Product Hunt');
      await viewPanel('X/Twitter');

      // Final short pause before recording ends
      await page.waitForTimeout(500);

    } catch (err) {
      console.error('❌ Failed during recording:', err.message);
    }

    await context.close();

    // Find latest webm and rename it to the project name
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
    const latestFile = files.map(f => ({ name: f, time: fs.statSync(path.join(outputDir, f)).mtime.getTime() }))
      .sort((a, b) => b.time - a.time)[0]?.name;

    if (latestFile) {
      const finalPath = path.join(outputDir, `${projectName}-hero-to-dashboard-broll.webm`);
      if (fs.existsSync(finalPath)) {
        fs.unlinkSync(finalPath); // Remove if exists
      }
      fs.renameSync(path.join(outputDir, latestFile), finalPath);
      console.log(`✅ Saved to: ${finalPath}`);
    }
  }

  await browser.close();
  console.log('\n🎉 Hero to Dashboard B-Roll recordings completed!');
})();
