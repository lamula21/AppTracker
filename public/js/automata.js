//const puppeteer = require('puppeteer')
// reqired for automata
const trElements = document.querySelectorAll('tr');
const idsArray = [];

/*
for (let i = 0; i < trElements.length; i++) {
  const idValue = trElements[i].getAttribute('id');
  idsArray.push(idValue);
}
console.log(idsArray); // logs ["1", "2", "644b40371db982a384ffd3c7", "4"]

function createObjs(idsArray) {
    idsArray.forEach(elem => {
        link = document.querySelector(`tr[id=“${elem}”] td p#<link>`).textContent;
        title = document.querySelector(`tr[id=“${elem}”] td p#<title>`).textContent;
        map.set(elem,[link,title]);
    });
}
*/

const fetching = async () => {
	try {
		console.log("Calling fetch for automata");
		const response = await fetch('http://localhost:5001/user/api/automata', {
			method: 'POST',
			headers: {'Content-Type': 'applications/json'}
		})
        console.log(response);
		console.log('after');
		//const user_id = req.user._id
		//const table = Table.diffIndexes({user: user_id})

	} catch (error) {
		console.log(error)
	}
}

fetching()
/*
async function automateLogin(username, password) {
    try {
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
          },20000);
          console.log("AUTOMATA WORKED :)))))");
    } 
    catch {
        console.log("AUTOMATA FAILED :((");
    }
    
}

function getStatus(text, positionName, rowID) {
    text = text.trim();
    
    //let count = 0;
    let arr = text.split(" ");
    arr = arr.filter( elem => elem.length > 2 );
    arr.forEach(element => {
       //console.log(`COUNT HERE: ${count++}`);
       console.log(element); 
    });
}

automateLogin("atibrew1","ARUumd17112002!")

*/