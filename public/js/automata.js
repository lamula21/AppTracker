// Arushi

const puppeteer = require('puppeteer');

//Certain functions here are not up-to-date yet. Need to code a generic method that will navigate to applications
/*
async function extractVisibleText() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://umd-csm.symplicity.com/students/index.php?s=jobs&ss=applied&mode=list&subtab=nocr';
    await page.goto(url);
  
    const visibleText = await page.evaluate(() => {
      // This function extracts the text content of all visible nodes in the DOM
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      let node;
      let text = '';
      while ((node = walker.nextNode())) {
        if (node.parentElement.offsetWidth > 0 && node.parentElement.offsetHeight > 0) {
          text += node.textContent.trim() + ' ';
        }
      }
      return text.trim();
    });
  
    console.log(visibleText);
    
    await browser.close();
}

async function findLoginElements() { //DOES NOT WORK
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://umd-csm.symplicity.com/sso/students/login');
    
    // Find the login elements by attribute or CSS selector
    const usernameInput = await page.$('input[type="text"]');
    const passwordInput = await page.$('input[type="password"]');
    const loginButton = await page.$('button[type="submit"]');
    
    // Log the login elements to the console
    console.log('Username input:', await usernameInput.evaluate(el => el.outerHTML));
    console.log('Password input:', await passwordInput.evaluate(el => el.outerHTML));
    console.log('Login button:', await loginButton.evaluate(el => el.outerHTML));
    
    await browser.close();
}

*/

async function automateLogin(username, password) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    await page.goto('https://umd-csm.symplicity.com/sso/students/login');
    
    // Find the login elements by attribute
    const usernameInput = await page.$('input[type="text"]');
    const passwordInput = await page.$('input[type="password"]');
    const loginButton = await page.$('button[type="submit"]');
    
    // Fill in the login form and submit
    await usernameInput.type(username);
    await passwordInput.type(password);
    await loginButton.click();
    
    // Wait for the login to complete
    await page.waitForNavigation();

    //Since login uses DUO Mobile, seeting a timeout so that user can approve login from duo
    setTimeout(async () => {

        //extracting text from page
        const url = 'https://umd-csm.symplicity.com/students/index.php?s=jobs&ss=applied&mode=list&subtab=nocr';
        await page.goto(url);
      
        const visibleText = await page.evaluate(() => {
          // This function extracts the text content of all visible nodes in the DOM
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          let node;
          let text = '';
          while ((node = walker.nextNode())) {
            if (node.parentElement.offsetWidth > 0 && node.parentElement.offsetHeight > 0) {
              text += node.textContent.trim() + ' ';
            }
          }
          return text.trim();
        });
        console.log(visibleText);
        getStatus(visibleText);
      
        await browser.close();
      }, 10000);
}

function getStatus(text) {
    text = text.trim();
    
    let count=0;
    let arr = text.split(" ");
    arr = arr.filter( elem => elem.length > 2 );
    arr.forEach(element => {
       //console.log(`COUNT HERE: ${count++}`);
       console.log(element); 
    });
}

automateLogin("atibrew1", "ARUumd17112002!");
