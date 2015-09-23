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

Map.prototype.randomiseResources = function()
{
	for(var y = 0; y < this.rows.length; y++)
	{
		for(var x = 0; x < this.rows[y].len; x++)
		{
			this.rows[y].hexes[x].resource = Math.floor((Math.random() * 5) + 1);
		}
	}
}

Map.prototype.draw = function(ctx)
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
				s_council.draw(ctx, myX, myY);
			}
			else if(currentTile.resource == 9)
			{
				s_sea.draw(ctx, myX, myY);
				s_moon.draw(ctx, myX + s_sea.width/2 - s_moon.width/2, myY + s_sea.height/2 - s_moon.width/2);
			}
			else if(currentTile.resource == 10)
			{
				s_sea.draw(ctx, myX, myY);
				s_sun.draw(ctx, myX + s_sea.width/2 - s_sun.width/2, myY + s_sea.height/2 - s_sun.width/2);
			}
		}
	}
}

Map.prototype.randomise = function(currentTileID, inCounts, currentCounts)
{
	var xY = this.getXY(currentTileID);
	var currentType = this.rows[xY[1]].hexes[xY[0]].resource;

	if(currentType == -1)
	{
		//////////////////////////////////////////////////
		// TODO: Needs work.							//
		//////////////////////////////////////////////////
		//Make list of types remaining to try
		var remainingTypes = {};
		for(var i = 0; i < inCounts.length; i++)
		{
			if(currentCounts[i]+1 <= inCounts[types[i]])
			{
				remainingTypes.push(types[i]);
			}
		}
		

		var ret = false;
		var randomType, random;
		do
		{
			//Pick random type
			do
			{
				random = Math.floor((Math.random() * 11));
				randomType = types[random];
			}
			while(remainingTypes[randomType] == -1 && remainingTypes.size() > 0);
			
			//Check it fits(neighbours, currentCount)
			var possible = true;
			var changeChance = checkNeighbours(xY[0], xY[1], randomType);
			var randChance = Math.floor((Math.random() * 101));
			if(changeChance > randChance)
			{
				possible = false;
			}

			if(currentCounts[random]+1 > inCounts[randomType])
			{
				possible = false;
			}
			/* TODO: */ remainingTypes.removeElement(randomType); //Remove from remaining
			if(possible)
			{
				this.rows[xY[1]].hexes[xY[0]].resource = randomType;
				//Increment currentCount[type]
				if(currentTileID >= getTileCount() - 1)
					return true;
				else
				{
					ret = this.randomise(currentTileID + 1, inCounts, updateCounts(random, currentCounts));
				}
				if(!ret)
				{
					//Decrement currentcount[type]
					this.rows[xY[1]].hexes[xY[0]].resource = -1;
				}
			}
		}
		while(ret == false && remainingTypes.size() > 0);
		return ret;
	}
	else
	{
		if(currentTileID >= getTileCount() - 1)
		{
			return true;
		}
		else
			return this.randomise(currentTileID + 1, inCounts, currentCounts);
	}
}

Map.prototype.getXY = function(inIndex)
	{
		var xy = [0, 0];
		var count = 0;
		for(var y = 0; y < this.rows.length; y++)
		{
			for(var x = 0; x < this.rows[y].length; x++)
			{
				if(count == inIndex)
				{
					xy[0] = x;
					xy[1] = y;
				}
				count++;
			}
		}
		return xy;
	}

	Map.prototype.checkNeighbours = function(inX, inY, myType)
	{
		var chance = 75;

		if(inX > 0)
		{
			if(rows[inY].getHex(inX - 1).getTypeID() == myType) //Check <
			{
				chance *= 1.15;
			}
		}

		if(inY > 0)
		{
			if((height+1)/2 >= inY + 1) //Top half
			{
				if(inX < rows[inY - 1].length)
				{
					if(rows[inY - 1].getHex(inX).getTypeID() == myType) //Check ^>
					{
						chance *= 1.15;
					}
				}
				if(inX > 0)
				{
					if(rows[inY - 1].getHex(inX - 1).getTypeID() == myType) //Check <^
					{
						chance *= 1.15;
					}
				}
			}
			else
			{
				if(rows[inY - 1].getHex(inX).getTypeID() == myType) //Check <^
				{
					chance *= 1.15;
				}
				if(rows[inY - 1].getHex(inX + 1).getTypeID() == myType) //Check ^>
				{
					chance *= 1.15;
				}
			}
		}
		
		if(chance == 75)
			chance = 0;
		else
			chance = 101;
		return (int) chance;
	}