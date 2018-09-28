function Circle(x, y, radius) {
    let circle = new Object();
    circle.x = x;
    circle.y = y;
    circle.radius = radius;
    circle.gridX = xToGrid(x);
    circle.gridY = yToGrid(y);
    return circle;
}