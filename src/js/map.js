//////////////////////////////////////////////////////////
// Hex 													//
//////////////////////////////////////////////////////////
function Hex(resource, rarity, xPos, yPos)
{
	this.resource = resource;
	this.rarity = rarity;
	this.xPos = xPos;
	this.yPos = yPos;
}

Hex.prototype.setY = function(y)
{
	this.yPos = y;
}

//////////////////////////////////////////////////////////
// HexRow												//
//////////////////////////////////////////////////////////
function HexRow(len)
{
	this.len = len;

	this.hexes = [];
	for(var i = 0; i < len; i++)
	{
		var newHex = new Hex(-1, 0, i, 0);
		this.hexes.push(newHex);
	}
}

HexRow.prototype.setY = function(y)
{
	for(var i = 0; i < this.len; i++)
	{
		this.hexes[i].setY = y;
	}
}

HexRow.prototype.toString = function(width)
{
	var out = "";
	for(var i = 0; i < (width - this.len); i++)
	{
		out += " ";
	}
	for(var i = 0; i < this.len; i++)
	{
		out += this.hexes[i].resource + " ";
	}
	return out;
}

//////////////////////////////////////////////////////////
// Map 													//
//////////////////////////////////////////////////////////
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
				this.splitLand();
				this.fillOcean();
			}

			//Land
			this.randomised = this.randomise(0, this.typeCount, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	}
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
		s_noTiles.draw(ctx, (s_desert.width * this.width)/2 - s_noTiles.width/2, (s_desert.height * this.height)/2 - s_noTiles.height);
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
				myX = (x + (diff / 2)) * s_desert.width;
				myY = y * (s_desert.height - (0.246 * s_desert.height));
				
				if(currentTile.resource == 0)
				{
					s_desert.draw(ctx, myX, myY);
				}
				else if(currentTile.resource == 1)
				{
					s_sheep.draw(ctx, myX, myY);
				}
				else if(currentTile.resource == 2)
				{
					s_ore.draw(ctx, myX, myY);
				}
				else if(currentTile.resource == 3)
				{
					s_clay.draw(ctx, myX, myY);
				}
				else if(currentTile.resource == 4)
				{
					s_wheat.draw(ctx, myX, myY);
				}
				else if(currentTile.resource == 5)
				{
					s_wood.draw(ctx, myX, myY);
				}
				else if(currentTile.resource == 6)
				{
					s_sea.draw(ctx, myX, myY);
				}
				else if(currentTile.resource == 7)
				{
					s_gold.draw(ctx, myX, myY);
				}
				else if(currentTile.resource == 8)
				{
					s_sea.draw(ctx, myX, myY);
					s_moon.draw(ctx, myX + s_sea.width/2 - s_moon.width/2, myY + s_sea.height/2 - s_moon.width/2);	
				}
				else if(currentTile.resource == 9)
				{
					s_sea.draw(ctx, myX, myY);
					s_sun.draw(ctx, myX + s_sea.width/2 - s_sun.width/2, myY + s_sea.height/2 - s_sun.width/2);
				}
				else if(currentTile.resource == 10)
				{
					s_council.draw(ctx, myX, myY);
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
	this.typeCount[10] = 0;
	this.filledCount++;
}

Map.prototype.fillExplorers = function()
{
	var y = Math.floor(Math.random() * this.height),
		x = Math.floor(Math.random() * this.rows[y].len);

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

Map.prototype.randomise = function(currentTileID, inCounts, currentCounts)
{
	//xY = getXY(currentTileID);

	//if currentType == -1
		//Make list of remaining types

		//do
			//Set type to -1 (to reset if failed)
			//Pick a remaining type
			//Remove from remaining types
			//Check its neighbours
			//if Ok
				//Set type
				//if Done
					//Return true
				//else
					//ret = randomise(currentTileID + 1, inCounts, this.updateCounts())
		//while ret == false and there are types remaining
		//return ret
	//else
		//if Done
			//Return true
		//else
			//return randomise(currentTileID + 1, inCounts, currentCounts)

	var xY = this.getXY(currentTileID),
		currentType = this.rows[xY[1]].hexes[xY[0]].resource;

	if(currentType == -1)
	{
		//Make list of remaining types
		var remainingTypes = [];
		for(var i = 0; i < inCounts.length; i++)
		{
			if(inCounts[i] > currentCounts[i])
			{
				remainingTypes.push(i);
			}
		}

		var ret = false;
		while(ret == false && remainingTypes.length > 0)
		{
			this.rows[xY[1]].hexes[xY[0]].resource = -1; //Set type to -1 (to reset if failed)
			
			//Pick a remaining type
			var random = Math.floor(Math.random() * remainingTypes.length),
				randomType = remainingTypes[random];
			
			//Remove from remaining types
			var index = remainingTypes.indexOf(randomType);
			remainingTypes.splice(index, 1);


			var possible = this.checkNeighbours(xY[0], xY[1], randomType); //Check its neighbours
			if(possible)
			{
				this.rows[xY[1]].hexes[xY[0]].resource = randomType; //Set type

				if(currentTileID == this.getTileCount() - 1)
				{
					return true;
				}
				else
				{
					ret = this.randomise(currentTileID + 1, inCounts, this.updateCounts(randomType, currentCounts));
				}
			}
		}
		
		return ret;
	}
	else
	{
		if(currentTileID == this.getTileCount() - 1)
		{
			return true;
		}
		else
		{
			return this.randomise(currentTileID + 1, inCounts, currentCounts);
		}
	}
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

Map.prototype.updateCounts = function(inID, inCounts)
{
	var retCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for(var i = 0; i < inCounts.length; i++)
	{
		retCounts[i] = inCounts[i];
		if(i == inID)
		{
			retCounts[i]++;
		}
	}
	return retCounts;
}

Map.prototype.checkNeighbours = function(inX, inY, myType)
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