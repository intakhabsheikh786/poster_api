const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
app.use(express.json());
const path = require('path');
const fs = require('fs');
const POSTER_STRUCTURE_URL = process.env.POSTER_STRUCTURE_URL;
const frame_data = {
  "1": {
    "double": [14, 17, 10],
    "triple": [236, 245, 560]
  },
  "2": {
    "double": [29, 23, 28],
    "triple": [246, 570, 345]
  },
  "3": {
    "double": [36, 39, 34],
    "triple": [689, 238, 256]
  },
  "4": {
    "double": [47, 41, 46],
    "triple": [590, 239, 248]
  },
  "5": {
    "double": [51, 54, 57],
    "triple": [230, 258, 690]
  },
  "6": {
    "double": [69, 62, 67],
    "triple": [367, 259, 240]
  },
  "7": {
    "double": [73, 74, 79],
    "triple": [359, 278, 160]
  },

  "8": {
    "double": [80, 85, 86],
    "triple": [378, 468, 279]
  },
  "9": {
    "double": [91, 93, 98],
    "triple": [478, 450, 270]
  },
  "0": {
    "double": [06, 01, 07],
    "triple": [235, 370, 569]
  },
}

// app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.get("/test", async (req, res) => {
  res.send("Working...");
})

app.post("/download-chart", async (req, res) => {
  console.log(POSTER_STRUCTURE_URL);
  // Get the input text from the request body
  const { date: charTdate, data } = req.body;

  // Launch a headless instance of Chrome
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the page HTML
  await page.setViewport({ width: 1024, height: 768 });
  // await page.goto('https://rad-begonia-d08e07.netlify.app/index.html');
  await page.goto(POSTER_STRUCTURE_URL);
  // await page.goto('http://192.168.0.107:5500/html/index.html');

  // Generate a screenshot of the page
  for (let index0 = 0; index0 < data.length; index0++) {
    const element = data[index0];
    const single_index = `single0`;
    const inputText = { element, name: single_index, index: index0 };
    // console.log(`className ${single_index} ${index0}`);

    await page.evaluate((inputText) => {
      document.getElementsByClassName(inputText["name"])[inputText["index"]].textContent = inputText["element"];
    }, inputText);

    const double = frame_data[element]["double"];

    for (let index1 = 0; index1 < double.length; index1++) {
      const element = double[index1];
      const double_index = `double${index0}`;
      const inputText = { element, name: double_index, index: index1 };
      // console.log(`className ${double_index} ${index1}`);
      await page.evaluate((inputText) => {
        document.getElementsByClassName(inputText["name"])[inputText["index"]].textContent = inputText["element"];
      }, inputText);
    }

    const triple = frame_data[element]["triple"];
    for (let index1 = 0; index1 < triple.length; index1++) {
      const element = triple[index1];
      const triple_index = `triple${index0}`;
      const inputText = { element, name: triple_index, index: index1 };
      // console.log(`className ${triple_index} ${index1}`);
      await page.evaluate((inputText) => {
        document.getElementsByClassName(inputText["name"])[inputText["index"]].textContent = inputText["element"];
      }, inputText);
    }
  }

  await page.evaluate((inputText) => {
    document.getElementById('date').textContent = inputText;
  }, charTdate);

  await page.evaluateHandle("document.fonts.ready");

  const card = await page.$('.instagram-post-4');
  const { x, y, width, height } = await card.boundingBox();



  const screenshot = await card.screenshot({
    type: 'png',
    clip: { x, y, width, height }
  });

  // Close the browser
  await browser.close();

  // Set the response content type to PNG
  res.setHeader("Content-Type", "image/png");

  // Set the content disposition to trigger a download
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=downloadable-card.png`
  );

  res.set({
    'Content-Type': 'image/png',
    'Content-Encoding': 'binary'
  });

  console.log("Before sending the response.");
  // Send the PNG image in the response
  res.send(screenshot);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
