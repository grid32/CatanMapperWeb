function initialise(ctx)
{
	var map = new Map(5, 5);
	map.randomiseResources();
	map.draw(ctx);
	console.log(map.toString());
}