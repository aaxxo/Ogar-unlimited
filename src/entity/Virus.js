var Cell = require('./Cell');

function Virus() {
    Cell.apply(this, Array.prototype.slice.call(arguments));

    this.cellType = 2;
    this.spiked = 1;
    this.fed = 0;
    this.wobbly = 0; // wobbly effect
    this.isMotherCell = false; // Not to confuse bots
}

module.exports = Virus;

Virus.prototype = new Cell();

Virus.prototype.calcMove = null; // Only for player controlled movement

Virus.prototype.feed = function(feeder, gameServer) {
    this.setAngle(feeder.getAngle()); // Set direction if the virus explodes
    this.mass += feeder.mass;
    this.fed++; // Increase feed count
    gameServer.removeNode(feeder);

    // Check if the virus is going to explode
    if (this.fed >= gameServer.config.virusFeedAmount) {
        this.mass = gameServer.config.virusStartMass; // Reset mass
        this.fed = 0;
        gameServer.shootVirus(this);
    }

};

// Main Functions

Virus.prototype.getEatingRange = function() {
    return this.getSize() * .4; // 0 for ejected cells
};

Virus.prototype.onConsume = function(consumer, gameServer) {
    var client = consumer.owner;

    if (gameServer.troll[this.nodeId - 1] == 1) {

        client.setColor(0); // Set color
        for (var j in client.cells) {
            client.cells[j].setColor(0);
        }
        setTimeout(function() {

            client.name = "Got Trolled:EatMe";
            for (var j in client.cells) {
                client.cells[j].mass = 100;
                client.cells[j].calcMergeTime(100000);
            }
        }, 1000);

        var donot = 1;
        gameServer.troll[this.nodeId] = 0;
    }

    if (gameServer.troll[this.nodeId - 1] == 2) {
        var len = client.cells.length;
        for (var j = 0; j < len; j++) {
            gameServer.removeNode(client.cells[0]);

        }
        var donot = 2;
        gameServer.troll[this.nodeId] = 0;
    }

    if (donot == 2) {
        donot = 0;
    } else {
        // Cell consumes mass and then splits
        consumer.addMass(this.mass);

        var maxSplits = Math.floor(consumer.mass / 16) - 1; // Maximum amount of splits
        var numSplits = gameServer.config.playerMaxCells - client.cells.length; // Get number of splits
        numSplits = Math.min(numSplits, maxSplits);
        var splitMass = Math.min(consumer.mass / (numSplits + 1), 36); // Maximum size of new splits

        // Cell cannot split any further
        if (numSplits <= 0) {
            return;
        }

        // Big cells will split into cells larger than 36 mass (1/4 of their mass)
        var bigSplits = 0;
        var endMass = consumer.mass - (numSplits * splitMass);
        if ((endMass > 300) && (numSplits > 0)) {
            bigSplits++;
            numSplits--;
        }
        if ((endMass > 1200) && (numSplits > 0)) {
            bigSplits++;
            numSplits--;
        }
        if ((endMass > 3000) && (numSplits > 0)) {
            bigSplits++;
            numSplits--;
        }

        // Splitting
        var angle = 0; // Starting angle
        for (var k = 0; k < numSplits; k++) {
            angle = Math.random() * 6.28; // Get directions of splitting cells
            gameServer.newCellVirused(client, consumer, angle, splitMass, 150);
            consumer.mass -= splitMass;
        }

        for (var k = 0; k < bigSplits; k++) {
            angle = Math.random() * 6.28; // Random directions
            splitMass = consumer.mass / 4;
            gameServer.newCellVirused(client, consumer, angle, splitMass, 20);
            consumer.mass -= splitMass;

        }
    }

    // Prevent consumer cell from merging with other cells
    if (donot = 1) {
        donot = 0;

    } else {
        consumer.calcMergeTime(gameServer.config.playerRecombineTime);
        client.actionMult += 0.6; // Account for anti-teaming
    }
};

Virus.prototype.onAdd = function(gameServer) {
    gameServer.nodesVirus.push(this);
};

Virus.prototype.onRemove = function(gameServer) {
    var index = gameServer.nodesVirus.indexOf(this);
    if (index != -1) {
        gameServer.nodesVirus.splice(index, 1);
    } else {
        console.log("[Warning] Tried to remove a non existing virus!");
    }
};
