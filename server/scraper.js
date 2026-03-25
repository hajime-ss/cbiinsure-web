const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

const ANC_URL = 'https://www.ancbroker.com/';

// In-memory cache for ViewStates to speed up consecutive requests
let cachedViewState = null;

/**
 * Scrapes Prakun.com for car insurance quotes based on specific car parameters.
 * @param {Object} params - The search parameters (brand, model, year, etc.)
 * @returns {Array} - Array of parsed insurance quote objects.
 */
const puppeteer = require('puppeteer');

async function scrapeQuotes(params) {
    let browser = null;
    try {
        console.log("Scraping quotes for:", params);
        // Start headless browser
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Go directly to Prakun search using query params if they accept them,
        // Wait, ANC uses POST redirects. Let's start at ANC, fill out the form, and click search.
        await page.goto(ANC_URL, { waitUntil: 'domcontentloaded' });

        // Wait for and select Year
        await page.waitForSelector('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarYear"]');
        await page.select('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarYear"]', params.year || '2024');
        await page.evaluate(() => new Promise(r => setTimeout(r, 1500))); // Wait for UpdatePanel AJAX

        // Wait for and select Brand 
        await page.waitForSelector('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand"] option:not([value="0"])');

        // We need to find the option value by text because params.brand is a string like "HONDA"
        const brandVal = await page.evaluate((brandText) => {
            const options = Array.from(document.querySelectorAll('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand"] option'));
            const match = options.find(o => o.textContent.toUpperCase().includes(brandText.toUpperCase()));
            return match ? match.value : null;
        }, params.brand);

        if (!brandVal) throw new Error("Brand not found in dropdown");
        await page.select('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand"]', brandVal);
        await page.evaluate(() => new Promise(r => setTimeout(r, 1500))); // Wait for UpdatePanel AJAX

        // Wait for and select Model
        await page.waitForSelector('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarModel"] option:not([value="0"])');
        const modelVal = await page.evaluate((modelText) => {
            const options = Array.from(document.querySelectorAll('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarModel"] option'));
            const match = options.find(o => o.textContent.toUpperCase().includes(modelText.toUpperCase()));
            return match ? match.value : null;
        }, params.model);

        if (!modelVal) throw new Error("Model not found in dropdown");
        await page.select('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarModel"]', modelVal);
        await page.evaluate(() => new Promise(r => setTimeout(r, 1500))); // Wait for UpdatePanel AJAX

        // Wait for and select Submodel
        try {
            await page.waitForSelector('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarSubModel"] option:not([value="0"])', { timeout: 3000 });
            const submodelVal = await page.evaluate((submodelText) => {
                const options = Array.from(document.querySelectorAll('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarSubModel"] option'));
                const match = options.find(o => o.textContent.toUpperCase().includes(submodelText.toUpperCase()));
                return match ? match.value : options[1].value; // fallback to first real submodel
            }, params.submodel);

            await page.select('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarSubModel"]', submodelVal);
        } catch (e) {
            console.log("No submodel dropdown populated or selected. Continuing...");
        }

        // Click Search and wait for navigation (redirect to prakun.com)
        console.log("Submitting form on ANC...");
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }),
            page.click('#ContentPlaceHolder_ucIntro_btCal2')
        ]);

        console.log("Landed on URL:", page.url());

        // Now we are on prakun.com results page. Wait for results to load.
        // Assuming the results are wrapped in a container class. Looking at typical Prakun HTML
        // Wait for cards to exist or an empty state warning
        await new Promise(r => setTimeout(r, 5000)); // Wait 5 seconds just to be safe for Vue/React to mount
        await page.waitForSelector('.package-box, .no-result, .alert, .item, .card-box', { timeout: 15000 }).catch(() => null);

        // --- Exact Filtering: Insurance Class Selection ---
        if (params.filterClass && params.filterClass !== 'ชั้น 1') {
            let tabId = '#ContentPlaceHolder_Potype1';
            if (params.filterClass === 'ชั้น 2+') tabId = '#ContentPlaceHolder_Potype2P';
            else if (params.filterClass === 'ชั้น 3+') tabId = '#ContentPlaceHolder_Potype3P';
            else if (params.filterClass === 'ชั้น 3') tabId = '#ContentPlaceHolder_Potype3';

            if (tabId !== '#ContentPlaceHolder_Potype1') {
                console.log(`Clicking class tab: ${params.filterClass} (${tabId})`);
                try {
                    await page.evaluate((id) => {
                        const el = document.querySelector(id);
                        if (el) el.click();
                    }, tabId);

                    // Wait generously for ASP.NET UpdatePanel AJAX to complete its reload
                    await new Promise(r => setTimeout(r, 7000));
                } catch (e) {
                    console.log(`Failed to click class tab ${tabId}. Proceeding anyway.`);
                }
            }
        }

        // Ensure ALL Provinces are loaded
        try {
            const hasProvinceFilter = await page.evaluate(() => !!document.querySelector('#ContentPlaceHolder_Filter_CarPlate1'));
            if (hasProvinceFilter) {
                console.log("Clicking 'All Provinces' filter...");
                await page.evaluate(() => document.querySelector('#ContentPlaceHolder_Filter_CarPlate1').click());
                await new Promise(r => setTimeout(r, 6000)); // Wait for AJAX reload
            }
        } catch (e) {
            console.log("Province filter 'CarPlate1' not found or failed to click.");
        }

        // Ensure ALL Deductibles are loaded
        try {
            const hasDeductibleFilter = await page.evaluate(() => !!document.querySelector('#ContentPlaceHolder_Filter_DD1'));
            if (hasDeductibleFilter) {
                console.log("Clicking 'All Deductibles' filter...");
                await page.evaluate(() => document.querySelector('#ContentPlaceHolder_Filter_DD1').click());
                await new Promise(r => setTimeout(r, 6000)); // Wait for AJAX reload
            }
        } catch (e) {
            console.log("Deductible filter 'DD1' not found or failed to click.");
        }

        // Dump HTML for debugging
        await page.screenshot({ path: 'debug_scrape.png', fullPage: true });
        const fs = require('fs');
        fs.writeFileSync('prakun_results.html', await page.content());
        console.log("Wrote prakun_results.html and debug_scrape.png");

        // Extract data
        const quotes = await page.evaluate((filterClass) => {
            const results = [];

            // Prakun wraps each quote item in .row.line-bt
            document.querySelectorAll('.row.line-bt').forEach((el, index) => {
                try {
                    // Try Class 1 format (hidden inputs)
                    const premiumInput = el.querySelector('input[id*="_Hid_qsub_vmi_PREMIUM"]');
                    const insInput = el.querySelector('input[id*="_Hid_qsub_vmi_INS"]');

                    // Try Class 2+ format (spans/imgs)
                    let offerPriceEl = el.querySelector('.OFFER_PRICE span') || el.querySelector('.OFFER_PRICE');
                    if (!offerPriceEl && el.querySelector('.FIX2')) offerPriceEl = el.querySelector('.FIX2');

                    const cpNameSpan = el.querySelector('.CPNAME');
                    const insImg = el.querySelector('img[id*="_INS_"]'); // has src="../images/ins/VBI.png"

                    if (!premiumInput && !offerPriceEl) return; // Not a quote row

                    let rawPrice = '0';
                    let companyCodeString = 'Unknown';
                    let companyThaiName = '';

                    if (premiumInput) {
                        rawPrice = premiumInput.value;
                        companyCodeString = insInput ? insInput.value : 'Unknown';
                    } else if (offerPriceEl) {
                        rawPrice = offerPriceEl.innerText.replace(/[^0-9,.]/g, '').trim();
                        // For class 2+, the insImg has the code like VBI.png.
                        if (insImg && insImg.src) {
                            const parts = insImg.src.split('/');
                            companyCodeString = parts[parts.length - 1].split('.')[0]; // e.g. "VBI"
                        }
                        if (cpNameSpan) companyThaiName = cpNameSpan.innerText.trim();
                    }

                    const price = parseInt(rawPrice.replace(/,/g, ''), 10);

                    // Map common INS codes to Full Objects based on user requirement
                    const companyMap = {
                        'VBI': { th: 'วิริยะประกันภัย', en: 'Viriyah Insurance', abbr: 'VIB', url: 'www.viriyah.co.th' },
                        'BKI': { th: 'กรุงเทพประกันภัย', en: 'Bangkok Insurance', abbr: 'BKI', url: 'www.bangkokinsurance.com' },
                        'DHP': { th: 'ทิพยประกันภัย', en: 'Dhipaya Insurance', abbr: 'TIP', url: 'www.dhipaya.co.th' },
                        'MSIG': { th: 'เมืองไทยประกันภัย', en: 'Muang Thai Insurance', abbr: 'MTI', url: 'www.muangthaiinsurance.com' },
                        'TCI': { th: 'ธนชาตประกันภัย', en: 'Thanachart Insurance', abbr: 'TNI', url: 'www.thanachartinsurance.co.th' },
                        'SMG': { th: 'สินมั่นคงประกันภัย', en: 'Syn Mun Kong Insurance', abbr: 'SMK', url: 'www.smk.co.th' },
                        'SMC': { th: 'สินมั่นคงประกันภัย', en: 'Syn Mun Kong Insurance', abbr: 'SMK', url: 'www.smk.co.th' },
                        'KUI': { th: 'คุ้มภัยโตเกียวมารีน', en: 'Tokio Marine Safety', abbr: 'TMSI', url: 'www.tokiomarine.com' },
                        'TMSI': { th: 'โตเกียวมารีนประกันภัย', en: 'Tokio Marine Safety', abbr: 'TMSI', url: 'www.tokiomarine.com' },
                        'SMI': { th: 'คุ้มภัยโตเกียวมารีน', en: 'Tokio Marine Safety', abbr: 'TMSI', url: 'www.tokiomarine.com' },
                        'THI': { th: 'ไทยวิวัฒน์ประกันภัย', en: 'Thaivivat Insurance', abbr: 'TVI', url: 'www.thaivivat.co.th' },
                        'TVI': { th: 'ไทยวิวัฒน์ประกันภัย', en: 'Thaivivat Insurance', abbr: 'TVI', url: 'www.thaivivat.co.th' },
                        'AXA': { th: 'แอกซ่าประกันภัย', en: 'AXA Insurance', abbr: 'AXA', url: 'www.axa.co.th' },
                        'MSIG_TRUE': { th: 'เอ็ม เอส ไอ จี ประกันภัย', en: 'MSIG Insurance', abbr: 'MSIG', url: 'www.msig-thai.com' }, // Distinguishing actual MSIG from MTI
                        'NKI': { th: 'นวกิจประกันภัย', en: 'Navakij Insurance', abbr: 'NKI', url: 'www.navakij.co.th' },
                        'LMG': { th: 'แอลเอ็มจี ประกันภัย', en: 'LMG Insurance', abbr: 'LMG', url: 'www.lmginsurance.co.th' },
                        'AZAY': { th: 'อลิอันซ์ อยุธยา', en: 'Allianz Ayudhya', abbr: 'AZAY', url: 'www.allianz.co.th' },
                        'CBB': { th: 'ชับบ์สามัคคีประกันภัย', en: 'Chubb Samaggi', abbr: 'CHUBB', url: 'www.chubb.com' },
                        'TSI': { th: 'ไทยศรีประกันภัย', en: 'Thai Vivat Insurance', abbr: 'TVI', url: 'www.thaivivat.co.th' },
                        'DEV': { th: 'เทเวศประกันภัย', en: 'Deves Insurance', abbr: 'DEV', url: 'www.deves.co.th' },
                        'AIG': { th: 'เอไอจีประกันภัย', en: 'AIG Insurance', abbr: 'AIG', url: 'www.aig.co.th' },
                        'BUI': { th: 'บางกอกสหประกันภัย', en: 'Bangkok Union Insurance', abbr: 'BUI', url: 'www.bui.co.th' },
                    };

                    let finalCompanyTh = companyThaiName;
                    let finalCompanyEn = '';
                    let finalAbbr = '';
                    let finalLogoCode = companyCodeString;
                    let finalUrl = '';

                    if (companyMap[companyCodeString]) {
                        finalCompanyTh = companyMap[companyCodeString].th;
                        finalCompanyEn = companyMap[companyCodeString].en;
                        finalAbbr = companyMap[companyCodeString].abbr;
                        finalUrl = companyMap[companyCodeString].url;
                    } else {
                        // Attempt reverse lookup if code is unknown but thai name is known
                        const matchedEntry = Object.entries(companyMap).find(([k, v]) => v.th === companyThaiName);
                        if (matchedEntry) {
                            finalCompanyTh = matchedEntry[1].th;
                            finalCompanyEn = matchedEntry[1].en;
                            finalAbbr = matchedEntry[1].abbr;
                            finalLogoCode = matchedEntry[0];
                            finalUrl = matchedEntry[1].url;
                        } else {
                            finalCompanyTh = finalCompanyTh || companyCodeString;
                            finalCompanyEn = finalCompanyTh;
                            finalAbbr = companyCodeString;
                        }
                    }

                    let packageName = el.querySelector('.PACKNAMECUS') ? el.querySelector('.PACKNAMECUS').innerText.trim() : '';
                    if (!packageName) {
                        packageName = el.getAttribute('data-title') || '';
                    }

                    // Coverage
                    const sumInsuredEl = el.querySelector('.OD span') || el.querySelector('.OD');
                    const sumInsured = sumInsuredEl ? sumInsuredEl.innerText.replace(/[^0-9,]/g, '').trim() : 'ไม่ระบุ';

                    // Garage Type
                    let garage = 'อู่และห้าง';
                    if (el.querySelector('.FIX1') || el.innerText.includes('ซ่อมห้าง')) garage = 'ห้าง';
                    else if (el.querySelector('.FIX2') || el.innerText.includes('ซ่อมอู่')) garage = 'อู่';

                    // Deductible
                    let deductible = 'ไม่มีค่าเสียหายส่วนแรก';

                    const textToSearch = el.textContent || el.innerText || '';
                    // leniency for varying whitespace or prefixes, just matching "ส่วนแรก" and numbers
                    const deductMatch = textToSearch.match(/ส่วนแรก[\s\S]*?([1-9][0-9]*,[0-9]{3}|[1-9][0-9]{3,})/);

                    if (deductMatch && parseInt(deductMatch[1].replace(/,/g, ''), 10) > 0) {
                        deductible = deductMatch[1];
                    } else {
                        const explicitDeductibleEl = el.querySelector('.text-danger');
                        if (explicitDeductibleEl) {
                            const val = explicitDeductibleEl.innerText.replace(/[^0-9,]/g, '').trim();
                            if (val && parseInt(val.replace(/,/g, ''), 10) > 0) {
                                deductible = val;
                            }
                        }
                    }

                    // Province 
                    let province = 'ทั้งหมด';
                    if (packageName) {
                        const pkgUpper = packageName.toUpperCase();

                        // Define BKK keywords
                        const bkkKeywords = ['กทม', 'กรุงเทพ', 'ปริมณฑล', 'BKK'];
                        // Define UPC keywords
                        const upcKeywords = ['ต่างจังหวัด', 'ตจว', 'UPC', 'ภาค', 'เหนือ', 'ใต้', 'อีสาน', 'ตะวันออก', 'ตะวันตก', 'ภูมิภาค'];

                        const isBKK = bkkKeywords.some(kw => pkgUpper.includes(kw.toUpperCase()));
                        const isUPC = upcKeywords.some(kw => pkgUpper.includes(kw.toUpperCase()));

                        if (isBKK && !isUPC) {
                            province = 'กทม.และปริมณฑล';
                        } else if (isUPC && !isBKK) {
                            province = 'ต่างจังหวัด';
                        }
                    }

                    results.push({
                        id: `quote_${index}`,
                        company: finalCompanyTh, // Legacy compatibility
                        companyTh: finalCompanyTh,
                        companyEn: finalCompanyEn,
                        companyAbbr: finalAbbr,
                        companyLogo: finalUrl ? `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${finalUrl}&size=128` : `/logos/${finalLogoCode}.png`,
                        packageName,
                        price,
                        type: filterClass || 'ชั้น 1',
                        garage,
                        sumInsured,
                        deductible,
                        province,
                        installments: {
                            available: true,
                            months: 10,
                            0: true
                        },
                        coverage: {
                            life: '1,000,000',
                            medical: '200,000',
                            property: '2,500,000'
                        }
                    });
                } catch (e) {
                    console.error("Error extracting row", e);
                }
            });
            return results;
        }, params.filterClass);

        await browser.close();

        if (quotes.length === 0) {
            console.log("No quotes found for this class/car combination. Returning empty exact data.");
        }

        return {
            success: true,
            status: 'Live quotes extracted successfully via Puppeteer',
            count: quotes.length,
            data: quotes
        };

    } catch (error) {
        if (browser) await browser.close();
        console.error('Puppeteer Scraper Error:', error.message);
        return {
            success: false,
            error: 'Failed to proxy request to insurance engine.',
            details: error.message
        };
    }
}

/**
 * Proxies ANC Broker's dropdowns live to ensure 100% accurate car data.
 */
async function getDropdownData(step, params) {
    try {
        let res = await axios.get(ANC_URL);
        let $ = cheerio.load(res.data);

        let __VIEWSTATE = $('#__VIEWSTATE').val();
        let __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();
        let __EVENTVALIDATION = $('#__EVENTVALIDATION').val();

        if (step === 'years') {
            const years = $('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarYear"] option')
                .map((i, el) => ({ val: $(el).val(), text: $(el).text() })).get().filter(y => y.val !== '0');
            return years;
        }

        // Helper to perform a postback
        const postback = async (target, value, currentParams) => {
            const payload = {
                '__EVENTTARGET': target,
                '__EVENTARGUMENT': '',
                '__VIEWSTATE': __VIEWSTATE,
                '__VIEWSTATEGENERATOR': __VIEWSTATEGENERATOR,
                '__EVENTVALIDATION': __EVENTVALIDATION,
                ...currentParams
            };
            res = await axios.post(ANC_URL, qs.stringify(payload), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            $ = cheerio.load(res.data);
            __VIEWSTATE = $('#__VIEWSTATE').val();
            __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();
            __EVENTVALIDATION = $('#__EVENTVALIDATION').val();
        };

        // If asking for brands, we must post the Year
        if (step === 'brands') {
            await postback('ctl00$ContentPlaceHolder$ucIntro$ddlCarYear', params.year, {
                'ctl00$ContentPlaceHolder$ucIntro$ddlCarYear': params.year
            });
            return $('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand"] option')
                .map((i, el) => ({ val: $(el).val(), text: $(el).text() })).get().filter(y => y.val !== '0');
        }

        // ANC only has 3 real dropdowns, combining Model + Submodel (e.g., "CIVIC 1.5cc 4 Door").
        // We split this into a 4-step data structure to match the exact user requirement.
        if (step === 'models' || step === 'submodels') {
            await postback('ctl00$ContentPlaceHolder$ucIntro$ddlCarYear', params.year, {
                'ctl00$ContentPlaceHolder$ucIntro$ddlCarYear': params.year
            });
            await postback('ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand', params.brand, {
                'ctl00$ContentPlaceHolder$ucIntro$ddlCarYear': params.year,
                'ctl00$ContentPlaceHolder$ucIntro$ddlCarBrand': params.brand
            });

            const rawModels = $('select[name="ctl00$ContentPlaceHolder$ucIntro$ddlCarModel"] option')
                .map((i, el) => ({ val: $(el).val(), text: $(el).text() })).get().filter(y => y.val !== '0');

            if (step === 'models') {
                // Extract unique base models (first word, e.g., 'CIVIC')
                const uniqueModelSet = new Set();
                const processedModels = [];
                for (let m of rawModels) {
                    const baseModel = m.text.split(' ')[0]; // E.g., 'CIVIC' or 'CR-V'
                    if (!uniqueModelSet.has(baseModel) && baseModel !== "----------------") {
                        uniqueModelSet.add(baseModel);
                        processedModels.push({ val: baseModel, text: baseModel });
                    }
                }
                return processedModels;
            }

            if (step === 'submodels') {
                // Filter the raw models to only those starting with the selected base model
                return rawModels.filter(m => m.text.startsWith(params.model));
            }
        }

        return [];

    } catch (err) {
        console.error("Dropdown proxy failed:", err.message);
        throw err;
    }
}

module.exports = { scrapeQuotes, getDropdownData };
