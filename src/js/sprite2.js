var 

s_desert;

function Sprite(img, x, y, width, height)
{
	this.img = img;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

Sprite.prototype.draw = function(ctx, x, y)
{
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
};

function initSprites(img) 
{
	s_resources =
	[
		new Sprite(img, 0, 188, 156, 188),		//0 Desert
		new Sprite(img, 0, 0, 156, 188),		//1 Sheep
		new Sprite(img, 156, 0, 156, 188),		//2 Ore
		new Sprite(img, 312, 0, 156, 188),		//3 Clay
		new Sprite(img, 468, 0, 156, 188),		//4 Wheat
		new Sprite(img, 624, 0, 156, 188),		//5 Wood

		new Sprite(img, 156, 188, 156, 188),	//6 Sea
		new Sprite(img, 312, 188, 156, 188),	//7 Gold

		new Sprite(img, 156, 188, 156, 188),	//8 Moon
		new Sprite(img, 156, 188, 156, 188),	//9 Sun
		new Sprite(img, 468, 188, 156, 188) 	//10 Council
	];

	s_moon	 	= new Sprite(img, 677, 201, 38, 38);	//8
	s_sun	 	= new Sprite(img, 637, 202, 38, 38);	//9

	s_noTiles 	= new Sprite(img, 637, 259, 302, 93);

	s_rarity =
	[
		new Sprite(img, 794, 0, 38, 38), //2
		new Sprite(img, 832, 0, 38, 38), //3
		new Sprite(img, 870, 0, 38, 38), //4
		new Sprite(img, 908, 0, 38, 38), //5
		new Sprite(img, 946, 0, 38, 38), //6

		new Sprite(img, 0, 0, 0, 0), //Filler (7)

		new Sprite(img, 794, 38, 38, 38), //8
		new Sprite(img, 832, 38, 38, 38), //9
		new Sprite(img, 870, 38, 38, 38), //10
		new Sprite(img, 908, 38, 38, 38), //11
		new Sprite(img, 946, 38, 38, 38) //12
	];
}