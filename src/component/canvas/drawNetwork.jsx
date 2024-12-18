
export const RADIUS = 10;

const drawNetwork = (
    context,
    width,
    height,
    nodes,
    links
) => {
    context.clearRect(0, 0, width, height);

    // Draw the links first
    links.forEach((link) => {
        context.beginPath();
        context.moveTo(link.source.x, link.source.y);
        context.lineTo(link.target.x, link.target.y);
        context.stroke();
    });

    // Draw the nodes
    nodes.forEach((node) => {
        if (!node.x || !node.y) {
            return;
        }

        context.beginPath();
        context.moveTo(node.x + RADIUS, node.y);
        context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
        context.fillStyle = '#cb1dd1';
        context.fill();
    });
};
export default drawNetwork