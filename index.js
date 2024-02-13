const inquirer = require("inquirer");
const fs = require("fs");
// Importing the shapes
const { Triangle, Square, Circle } = require("./lib/shapes");

promptUser();
function promptUser() {
  inquirer
    .prompt([
      // Text prompt
      {
        type: "input",
        message:
          "What text would you like you logo to display? (Enter up to three characters)",
        name: "text", // name of text being entered
      },
      // Text color prompt
      {
        type: "input",
        message:
          "Choose text color (Enter color keyword OR a hexadecimal number)",
        name: "textColor", // name of color being entered
      },
      // Shape choice prompt
      {
        type: "list",
        message: "What shape would you like the logo to render?",
        choices: ["Triangle", "Square", "Circle"],
        name: "shape", // name of shape being chosen
      },
      // Shape color prompt
      {
        type: "input",
        message:
          "Choose shapes color (Enter color keyword OR a hexadecimal number)",
        name: "shapeBackgroundColor", //  name of background color being entered
      },
    ])
    .then((ans) => {
      // Error handling for text prompt (user must enter 3 characters or less for logo to generate)
      if (ans.text.length > 3) {
        console.log("Must enter a value of no more than 3 characters");
        promptUser();
      } else {
        // Calling write file function to generate SVG file
        writeToFile("logo.svg", ans);
      }
    });
}
// Function writes the SVG file using user answers from inquirer prompts
function writeToFile(fileName, ans) {
  // File starts as an empty string
  let svgFile = "";
  // Sets width and height of logo container
  svgFile =
      '<svg version="1.1" width="300" height="200" xmlns="http://www.w3.org/2000/svg">';
 

  // info from w3.org for why why we do the following
  // <g> tag wraps <text> tag so that user font input layers on top of polygon -> not behind
  svgFile += "<g>";
  // user input for SVG file
  svgFile += `${ans.shape}`;

  // Conditional check takes users input from choices array and then adds polygon properties and shape color to SVG string
  let shapeChoice;
  if (ans.shape === "Triangle") {
    shapeChoice = new Triangle();
    svgFile += `<polygon points="150, 18 244, 182 56, 182" fill="${ans.shapeBackgroundColor}"/>`;
  } else if (ans.shape === "Square") {
    shapeChoice = new Square();
    svgFile += `<rect x="73" y="40" width="160" height="160" fill="${ans.shapeBackgroundColor}"/>`;
  } else {
    shapeChoice = new Circle();
    svgFile += `<circle cx="150" cy="115" r="80" fill="${ans.shapeBackgroundColor}"/>`;
  }

  // <text> tag gives rise to text alignment, text-content/text-color taken in from user prompt and gives default font size of "40"
  svgFile += `<text x="150" y="130" text-anchor="middle" font-size="40" fill="${ans.textColor}">${ans.text}</text>`;
  // Closing </g> tag
  svgFile += "</g>";
  // Closing </svg> tag
  svgFile += "</svg>";

  // Using system module to generate svg, takes in file name given in the promptUser function, the svg string, and a ternary operator which handles logging any errors, or a "Generated logo.svg" message to the console  
  fs.writeFile(fileName, svgFile, (err) => {
    err ? console.log(err) : console.log("Generated logo.svg");
  });
}