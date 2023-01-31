const delay = require('delay');
const puppeteer = require('puppeteer-extra')
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var humanNames = require('human-names');


puppeteer.use(StealthPlugin());
puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: '',
            token: ''
        },
        solveInactiveChallenges: true,
        solveScoreBased: true,
        throwOnError: true,
        visualFeedback: true
    })
)

async function getRandomString(length) {
    var randomChars = 'abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
async function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
async function SpecialChar(length) {
    var randomSpe = '!@#$%&';
    var result1 = '';
    for (var i = 0; i < length; i++) {
        result1 += randomSpe.charAt(Math.floor(Math.random() * randomSpe.length));
    }
    return result1;

}


async function Domain_generator() {
    try {

        const browserP = await puppeteer.launch({
            headless: false,
            args: ['--ignore-certificate-errors']
        });

        var page1 = await browserP.newPage();
        await page1.goto('');
        await page1.type('#user', '');
        await page1.type('#pass', '');
        await Promise.all([
            page1.click('#login_submit'),
            page1.waitForNavigation()
        ]);

        for (var i = 0; i <= 1000; i++) {
            try {
                var subDomainString = await getRandomString(4);
                var subdomainURL = subDomainString + '.' + 'mymsn.co.uk';
                var logger = fs.createWriteStream('domain.txt', {
                    flags: 'a' // 'a' means appending (old data will be preserved)
                })

                logger.write(', ' + subdomainURL); // append string to your file
                // again
                //     const csvWriter = createCsvWriter({
                //         path: 'subdomain.csv',
                //         header: [
                //             { id: 'domain', title: 'Subdomain' },

                //         ]
                //     });
                //     const data = [{
                //         domain: subdomainURL
                //     }
                // ];
                //     await csvWriter.writeRecords(data);

                await page1.type('#domain', subDomainString);
                await page1.click('#dir');
                await Promise.all([
                    page1.click('#subdomain_submit'),
                    page1.waitForNavigation()

                ]);

                await Promise.all([
                    page1.click('#lnkReturn'),
                    page1.waitForNavigation()

                ]);


            } catch (err) {
                console.log(err);
            }


        }
        await browserP.close();
    } catch (err) {
        console.log(err);
    }
}

async function Mail_generator() {
    try {
        const fs = require("fs");
        var data = fs.readFileSync("domain.txt");
        var dataArr = data.toString('utf8').split(', ');

        const browserQ = await puppeteer.launch({
            headless: false,
            args: ['--ignore-certificate-errors']
        });
        const page3 = await browserQ.newPage(); // open new tab

        await page3.goto('');
        await delay(1000);
        await page3.type('#user', '');
        await delay(1000);
        await page3.type('#pass', '');
        await Promise.all([
            page3.click('#login_submit'),
            page3.waitForNavigation()

        ]);
        await delay(2000);
        page3.click('#stay');

        for (var i = 0; i <= 480; i++) {

            try {
                await page3.click('#ddlDomain_chosen');
                await page3.type('[aria-labelledby="lbllblDomain5"]', dataArr[i]);
                await page3.keyboard.press("Enter");
                await delay(2000);
                var EmailUser = await humanNames.allRandom();
                var integers = (await getRandomInt(10)) + (await getRandomInt(10)) + (await getRandomInt(10));
                await page3.type('#txtUserName', EmailUser + integers);
                await delay(2000);
                var password = ''
                await page3.type('#txtEmailPassword', password);

                const SubdomainAddress = EmailUser + integers + '@' + dataArr[i];
                var logger = fs.createWriteStream('details.txt', {
                    flags: 'a' // 'a' means appending (old data will be preserved)
                })

                logger.write(', ' + SubdomainAddress);



                await delay(1000);
                await Promise.all([
                    page3.click('#btnCreateEmailAccount'),


                ]);
            } catch (err) {
                console.log(err);
            }
        }

        await browserQ.close();



    } catch (err) {
        console.log(err);
    }
}



Domain_generator();