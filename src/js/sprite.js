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
	s_desert 	= new Sprite(img, 1, 1, 219, 252);		//0
	s_sheep 	= new Sprite(img, 220, 1, 219, 252);	//1
	s_ore 		= new Sprite(img, 439, 1, 219, 252);	//2
	s_clay	 	= new Sprite(img, 658, 1, 219, 252);	//3
	s_wheat 	= new Sprite(img, 877, 1, 219, 252);	//4
	s_wood	 	= new Sprite(img, 1096, 1, 219, 252);	//5

	s_sea	 	= new Sprite(img, 1, 253, 219, 252);	//6
	s_gold	 	= new Sprite(img, 220, 253, 219, 252);	//7
	s_council 	= new Sprite(img, 440, 253, 219, 252);	//8

	s_moon	 	= new Sprite(img, 690, 273, 60, 60);	//9
	s_sun	 	= new Sprite(img, 776, 277, 60, 60);	//10

	s_noTiles 	= new Sprite(img, 878, 306, 314, 110);
}