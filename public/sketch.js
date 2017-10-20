var myFont, sum = 0, average, percentage, button, button2;

function preload() {
    //Load custom font
    myFont = loadFont('mont.otf');
    
    // Load database entries into an array
    var url = 'https://api.mlab.com/api/1/databases/people-counter/collections/roomtotals?apiKey=qh6X9e7stck6kVWdCXSsIpnlAeaX512a';
    data = loadJSON(url);
}

function setup() {
    //Set window/canvas on browser
    createCanvas(windowWidth, windowHeight); // Full width of any device
    console.log(data); // Log data to ensure that array is working
    noLoop();
    textFont(myFont);
}


function draw() {
    // Set default background and stroke
    background(230);
    stroke(255);
    
    // Text for axis
    fill(175);
    textSize(40);
    push();
    translate(50,450);
    rotate(-HALF_PI);
    text("PEOPLE PRESENT -->", 0, 0);
    pop();
    

    // Buttons for interaction
    button = createButton("Hide Live Stats");
    button.position(width - 120, 20);
    button.mousePressed(hideStats);
    
    button2 = createButton("Show Live Stats");
    button2.position(width - 125, 50);
    button2.mousePressed(showStats);
    
    // Draw table in background
    drawTable();
    
    //Title Text
    fill(41, 128, 185);
    noStroke();
    textSize(30);
    text("3 Hillside Avenue", width/2, height/2 - 308);
    textSize(30);
    
    
    // Draw stat circles
    centreCircle();
    leftCircle();
    rightCircle();
}

function drawTable() {
    // Draws table of data
    for (var i = 0; i < data.length; i++) {
        fill(255, random(255), 0);
        var multiplier = height / 9; // extends values to a sensible height
        var rectWidth = width / (data.length); // width of each value depends on how many entries there are in database
        var yPos = data[i].totalInRoom * multiplier;
        
        // Begin drawing data
        rect((rectWidth * i), height, rectWidth, -yPos);
        fill(175);
        textAlign(CENTER);
        textSize(20);
        text(data[i].totalInRoom, (rectWidth * i) + (rectWidth / 2), (height - yPos) - 5);
    }
}

function hideStats() {
    background(230);
    stroke(255);
    
    // Drawer axis title
    fill(175);
    textSize(40);
    push();
    translate(50,450);
    rotate(-HALF_PI);
    text("PEOPLE PRESENT -->", 0, 0);
    console.log("TEXT")
    pop();
    
    // Draws table
    drawTable();
}

function leftCircle() {
    // Drawer circle
    fill(26, 188, 156, 200);
    stroke(22, 160, 133, 255);
    strokeWeight(15);
    ellipse(width/2 - 500, height / 2, 375, 375);
    
    fill(255);
    noStroke();
    
    // Adds text
    textSize(37);
    text("AVERAGE", width/2 - 500, height / 2 - 110);
    text("PEOPLE", width/2 - 500, height / 2 - 70);
    text("PRESENT", width/2 - 500, height / 2 - 30);
    
    //Calculate average number of people in room
    for (var i = 0; i < data.length; i++) {
        sum += int(data[i].totalInRoom);
    }
    average = round(sum / data.length);
    
    // Add the text
    textSize(150);
    text(average, width/2 - 500, height / 2 + 70);
}

function centreCircle() {
    // Drawer circle
    ellipseMode(CENTER);
    fill(52, 152, 219, 200);
    stroke(41, 128, 185, 255);
    strokeWeight(20);
    ellipse(width / 2, height / 2, 500, 500);
    
    // Adds text
    textAlign(CENTER, CENTER);
    noStroke();
    textSize(50);

    fill(255);
    text("CURRENTLY", width / 2, height / 2 - 120);

    textSize(200);
    
    // Draw text of last data entry
    text(data[data.length - 1].totalInRoom, width / 2, height / 2);

    textSize(50);
    text("PEOPLE", width / 2, height / 2 + 120);
    text("PRESENT", width / 2, height / 2 + 160);
    
    // "Last Updated" rectangle
    fill(52, 152, 219, 200);
    stroke(41, 128, 185, 255);
    strokeWeight(10);
    rectMode(CENTER);
    rect(width / 2, height/2 + 325, 600, 80);
    
    fill(255);
    noStroke();
    textSize(30);
    text("LAST UPDATED:", width/2, height/2 + 308);
    textSize(30);
    // Draw text of last data entry date
    text(data[data.length-1].date, width/2, height/2 + 340);
}

function rightCircle() {
    // Drawer circle
    fill(155, 89, 182, 200);
    stroke(142, 68, 173, 255);
    strokeWeight(15);
    ellipse(width/2 + 500, height / 2, 375, 375);
    
    fill(255);
    noStroke();
    
    // Adds text
    textSize(100);
    
    // Calculate the percentage 
    percentage = (data[data.length - 1].totalInRoom / data[data.length-1].maxCapacity) * 100;
    text(percentage + "%", width/2 + 500, height / 2 - 80);
    
    textSize(60);
    text("FULL", width/2 + 500, height / 2 - 10);
    
    textSize(37);
    text("MAX CAPACITY", width/2 + 500, height /2 + 60);
    
    // Pull max capacity from database
    text("OF " + data[data.length-1].maxCapacity, width/2 + 500, height /2 + 100);
}

function showStats() {
    // Draw the central circle
    centreCircle();
    leftCircle();
    rightCircle();
}