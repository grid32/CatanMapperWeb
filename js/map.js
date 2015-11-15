var types = ["desert", "sheep", "ore", "clay", "wheat", "wood", "sea", "gold", "moons", "suns", "council"];

function Map(width, height, typeCount)
{
	this.height = height;
	this.width = width;

	this.rows = [];

	var change = (height - 3) / 2;
	for(var i = 0; i < height; i++)
	{
		var myWidth = width;
		if(i < (height - 1) / 2)
		{
			myWidth -= (change - i) + 1;
		}
		else if(i > (height - 1) / 2)
		{
			myWidth += (((height - (2 * i)) + 1) / 2) - 1;
		}
		var newRow = new HexRow(myWidth);
		newRow.setY = i;
		this.rows.push(newRow);
	}

	this.typeCount = typeCount;
	this.filledCount = 0;

	this.landTiles = 0;

	this.randomised = false;

	var possible = this.getTileCount() <= this.countTiles();
	if(possible)
	{
		//Explorers
		if(this.typeCount[10] == 1)
		{
			this.placeCouncil();
			this.fillExplorers();
		}

		//Seafarers
		if(this.typeCount[6] > 0)
		{
			var tempWater = this.typeCount[6];
			this.splitLand();
			this.fillOcean();
			this.typeCount[6] = tempWater;
		}

		var tileCount = this.getTileCount(), //this.landTiles;
			each = tileCount / 18,
			rarityCount = [each, each*2, each*2, each*2, each*2, each*2, each*2, each*2, each*2, each];

		//Land & rarity
		this.randomised = this.randomise(0, this.typeCount, rarityCount);
	}
	console.log("Randomised? " + this.randomised);
}

Map.prototype.toString = function()
{
	var out = "";
	for(var i = 0; i < this.height; i++)
	{
		out += this.rows[i].toString(this.width) + "\n";
	}
	return out;
}

Map.prototype.draw = function(ctx)
{
	if(!this.randomised)
	{
		s_noTiles.draw(ctx, (s_resources[0].width * this.width)/2 - s_noTiles.width/2, (s_resources[0].height * this.height)/2 - s_noTiles.height);
	}
	else
	{
		for(var y = 0; y < this.rows.length; y++)
		{
			for(var x = 0; x < this.rows[y].len; x++)
			{
				var currentTile = this.rows[y].hexes[x];
				var	myX;
				var myY;

				var diff = this.width - this.rows[y].len;
				myX = (x + (diff / 2)) * s_resources[0].width;
				myY = y * (s_resources[0].height - (0.246 * s_resources[0].height));
				
				s_resources[currentTile.resource].draw(ctx, myX, myY);

				if(currentTile.resource == 8)
				{
					s_moon.draw(ctx, myX + s_resources[0].width/2 - s_moon.width/2, myY + s_resources[0].height/2 - s_moon.width/2);	
				}
				else if(currentTile.resource == 9)
				{
					s_sun.draw(ctx, myX + s_resources[0].width/2 - s_sun.width/2, myY + s_resources[0].height/2 - s_sun.width/2);
				}

				if(currentTile.rarity != 0)
				{
					s_rarity[currentTile.rarity - 2].draw(ctx, myX + s_resources[0].width/2 - s_rarity[0].width/2, myY + s_resources[0].height/2 - s_rarity[0].height/2);
				}
			}
		}
	}
}

Map.prototype.placeCouncil = function()
{
	var y = Math.floor(Math.random() * this.height),
		x = Math.floor(Math.random() * this.rows[y].len);
	this.rows[y].hexes[x].resource = 10;
	//this.typeCount[10] = 0;
	this.filledCount++;
}

Map.prototype.fillExplorers = function()
{
	var y = Math.floor(Math.random() * this.height),
		x = Math.floor(Math.random() * this.rows[y].len),
		tempMoon = this.typeCount[8],
		tempSun = this.typeCount[9];

	for(var type = 8; type <= 9; type++)
	{
		while(this.typeCount[type] > 0 && this.filledCount < this.getTileCount())
		{
			if(this.rows[y].hexes[x].resource == -1)
			{
				this.rows[y].hexes[x].resource = type;
				this.filledCount++;
				this.typeCount[type]--;
			}
			y += Math.floor((Math.random() * 3) - 1);
			x += Math.floor((Math.random() * 3) - 1);

			if(y >= this.height) {y = 0;}
			if(y < 0) {y = this.height - 1;}
			if(x >= this.rows[y].len) {x = 0;}
			if(x < 0) {x = this.rows[y].len - 1;}
		}
	}
	this.typeCount[8] = tempMoon;
	this.typeCount[9] = tempSun;
}

Map.prototype.splitLand = function()
{
	var y = 0,
		x = Math.floor(this.rows[y].len / 2);
	
	while(typeCount[6] > 0 && y < this.height && this.filledCount < this.getTileCount())
	{
		//y = i;
		var xMod = Math.floor((Math.random() * 2) - 1);

		if(((this.height + 1) / 2) > y) //Top half
		{
			xMod++;
		}
		
		x += xMod;
		if(x >= this.rows[y].len) {x = 0;}
		if(x < 0) {x = this.rows[y].len - 1;}
		
		if(this.rows[y].hexes[x].resource == -1)
		{
			this.rows[y].hexes[x].resource = 6; //Make tile ocean.
			this.typeCount[6]--;
			this.filledCount++;
		}
		y++;
	}
}

Map.prototype.fillOcean = function()
{
	var y = Math.floor(Math.random() * this.height),
		x = Math.floor(Math.random() * this.rows[y].len);

	
	while(this.typeCount[6] > 0 && this.filledCount < this.getTileCount())
	{
		if(this.rows[y].hexes[x].resource == -1)
		{
			this.rows[y].hexes[x].resource = 6;
			this.filledCount++;
			this.typeCount[6]--;
		}
		y += Math.floor((Math.random() * 3) - 1);
		x += Math.floor((Math.random() * 3) - 1);

		if(y >= this.height) {y = 0;}
		if(y < 0) {y = this.height - 1;}
		if(x >= this.rows[y].len) {x = 0;}
		if(x < 0) {x = this.rows[y].len - 1;}
	}
	
}

Map.prototype.randomise = function(currentTileID, inResourceCount, inRarityCount)
{
	var xY = this.getXY(currentTileID),
		currentHex = this.rows[xY[1]].hexes[xY[0]],
		randomTypeSet = [0, 1, 2, 3, 4, 5, 7],
		landSet = [1, 2, 3, 4, 5, 7];

	if(currentHex.resource == -1) //Do hex
	{
		var raritySet = false,
			randRarity = 0;
		//Set rarity////////////////////////////////////
		
		//Make list of remaining rarities
		var remainingRarities = [];
		for(var i = 0; i < inRarityCount.length; i++)
		{
			var add = 2;
			if(i >= 5)
			{
				add = 3;
			}
			if(inRarityCount[i] > 0)
			{
				remainingRarities.push(i + add);
			}
		}

		while(!raritySet && remainingRarities.length > 0)
		{
			currentHex.rarity = 0; //Reset

			//Pick a random rarity
			var rarityIndex = Math.floor(Math.random() * remainingRarities.length),
				randRarity = remainingRarities[rarityIndex];

			//Remove from remaining rarities
			remainingRarities.splice(rarityIndex, 1);

			//Check neighbours
			var possible = this.checkNeighbourRarity(xY[0], xY[1], randRarity);
			if(possible == 0)
			{
				currentHex.rarity = randRarity;
				raritySet = true;
			}
			else if(possible == -1) //Need smaller
			{
				//Remove all bigger
				while(rarityIndex < remainingRarities.length)
				{
					remainingRarities.splice(rarityIndex, 1);
				}
			}
			else if(possible == 1) //Need larger
			{
				//Remove all smaller
				for(var i = 0; i < rarityIndex; i++)
				{
					remainingRarities.splice(0, 1);
				}
			}
		}
		////////////////////////////////////////////////

		//Make list of remaining types
		var remainingTypes = [];
		for(var i = 0; i < inResourceCount.length; i++)
		{
			if(inResourceCount[i] > 0 && randomTypeSet.indexOf(i) > -1)
			{
				remainingTypes.push(i);
			}
		}

		var nextDone = false;
		if(raritySet)
		{
			while(!nextDone && remainingTypes.length > 0)
			{
				//Set resource

				currentHex.resource = -1; //Reset

				//Pick a random type
				var landIndex = Math.floor(Math.random() * remainingTypes.length),
					randLand = remainingTypes[landIndex];

				//Remove from remaining types
				remainingTypes.splice(landIndex, 1);

				//Check neighbours
				var possible = this.checkNeighbourType(xY[0], xY[1], randLand);
				if(possible)
				{
					//Set hex
					currentHex.resource = randLand;

					this.landTiles++;

					if(currentTileID == this.getTileCount() - 1) //Done
					{
						nextDone = true;
					}
					else
					{
						//Do next
						nextDone = this.randomise(currentTileID + 1, this.updateCount(randLand, inResourceCount), this.updateCount(randRarity, inRarityCount));
					}
				}
			}
		}
		return nextDone;
	}
	else //Skip hex
	{
		if(currentTileID == this.getTileCount() - 1)
		{
			return true;
		}
		else
		{
			return this.randomise(currentTileID + 1, inResourceCount, inRarityCount);
		}
	}
}

Map.prototype.updateCount = function(inIndex, inSet)
{
	var tempSet = [];
	//Copy inSet
	for(var i = 0; i < inSet.length; i++)
	{
		tempSet.push(inSet[i]);
	}
	tempSet[inIndex]--;
	return tempSet;
}

Map.prototype.getTileCount = function()
{
	//Courtesy of Timothy Peskett - http://www.github.com/TimPeskett
	return Math.floor((this.width*(this.height-1) - (Math.pow(this.height-1, 2)/4) - ((this.height-1)/2) + this.width));
}

Map.prototype.countTiles = function()
{
	var count = 0;
	for(var i = 0; i < this.typeCount.length; i++)
	{
		count += this.typeCount[i];
	}
	return count;
}

Map.prototype.getXY = function(inID)
{
	var xy = [0, 0];
	var count = 0;
	for(var y = 0; y < this.rows.length; y++)
	{
		for(var x = 0; x < this.rows[y].hexes.length; x++)
		{
			if(count == inID)
			{
				xy[0] = x;
				xy[1] = y;
			}
			count++;
		}
	}
	return xy;
}

Map.prototype.checkNeighbourType = function(inX, inY, myType)
{
	var possible = true;

	//Check <
	if(inX > 0)
	{
		if(this.rows[inY].hexes[inX - 1].resource == myType)
		{
			possible = false;
		}
	}

	if(inY > 0)
	{
		
		if((this.height + 1) / 2 >= inY + 1)
		{
			//Top Half
			//Check <^
			if(inX > 0)
			{
				if(this.rows[inY - 1].hexes[inX - 1].resource == myType)
				{
					possible = false;
				}
			}

			//Check ^>
			if(inX + 1 <= this.rows[inY - 1].len)
			{
				if(this.rows[inY - 1].hexes[inX].resource == myType)
				{
					possible = false;
				}
			}
		}
		else
		{
			//Bottom Half
			//Check <^
			if(this.rows[inY - 1].hexes[inX].resource == myType)
			{
				possible = false;
			}

			//Check ^>
			if(this.rows[inY - 1].hexes[inX + 1].resource == myType)
			{
				possible = false;
			}
		}
	}

	return possible;
}

Map.prototype.checkNeighbourRarity = function(inX, inY, inRarity)
{
	var noOfNeighbours = 1;
	var totalRarity = inRarity;
	var spotLookup = {2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1};
	var ret = 0;

	//Check <
	if(inX > 0)
	{
		noOfNeighbours++;
		totalRarity += spotLookup[this.rows[inY].hexes[inX - 1].rarity];
		if(inRarity == this.rows[inY].hexes[inX - 1].rarity)
		{
			ret = -2;
		}
		else if(spotLookup[inRarity] == 5 && spotLookup[this.rows[inY].hexes[inX - 1].rarity] == 5)
		{
			ret = -2;
		}
	}

	if(inY > 0)
	{
		
		if((this.height + 1) / 2 >= inY + 1)
		{
			//Top Half
			//Check <^
			if(inX > 0)
			{
				noOfNeighbours++;
				totalRarity += spotLookup[this.rows[inY - 1].hexes[inX - 1].rarity];
				if(inRarity == this.rows[inY - 1].hexes[inX - 1].rarity)
				{
					ret = -2;
				}
				else if(spotLookup[inRarity] == 5 && spotLookup[this.rows[inY - 1].hexes[inX - 1].rarity] == 5)
				{
					ret = -2;
				}
			}

			//Check ^>
			if(inX + 1 <= this.rows[inY - 1].len)
			{
				noOfNeighbours++;
				totalRarity += spotLookup[this.rows[inY - 1].hexes[inX].rarity];
				if(inRarity == this.rows[inY - 1].hexes[inX].rarity)
				{
					ret = -2;
				}
				else if(spotLookup[inRarity] == 5 && spotLookup[this.rows[inY - 1].hexes[inX].rarity] == 5)
				{
					ret = -2;
				}
			}
		}
		else
		{
			//Bottom Half
			//Check <^
			noOfNeighbours++;
			totalRarity += spotLookup[this.rows[inY - 1].hexes[inX].rarity];
			if(inRarity == this.rows[inY - 1].hexes[inX].rarity)
			{
				ret = -2;
			}
			else if(spotLookup[inRarity] == 5 && spotLookup[this.rows[inY - 1].hexes[inX].rarity] == 5)
			{
				ret = -2;
			}

			//Check ^>
			noOfNeighbours++;
			totalRarity += spotLookup[this.rows[inY - 1].hexes[inX + 1].rarity];
			if(inRarity == this.rows[inY - 1].hexes[inX + 1].rarity)
			{
				ret = -2;
			}
			else if(spotLookup[inRarity] == 5 && spotLookup[this.rows[inY - 1].hexes[inX + 1].rarity] == 5)
			{
				ret = -2;
			}
		}
	}

	if(ret == 0)
	{
		if(totalRarity/noOfNeighbours > 4.25)
		{
			ret = -1;
		}
		else if(totalRarity/noOfNeighbours < 1.75)
		{
			ret = 1;
		}
	}
	return ret;
}