

/**
 * If the thing is a string, split it on slashes. If the thing is a regular expression, return an empty
 * string. If the thing is a complex regular expression, return a string representation of the regular
 * expression
 * @param thing - The route to be split.
 * @returns the pathname split into an array of strings.
 */
function split(thing) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return "";
  } else {
    var match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">";
  }
}

/**
 * It takes a path and a layer, and if the layer is a route, it calls itself on each of the route's
 * stack, passing in the path concatenated with the route's path. If the layer is a router, it calls
 * itself on each of the router's stack, passing in the path concatenated with the router's regexp. If
 * the layer is a method, it adds the method and the path to the list
 * @param path - The path of the route.
 * @param layer - The layer object
 */
var list = [];

function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(
      print.bind(null, path.concat(split(layer.route.path)))
    );
  } else if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach(
      print.bind(null, path.concat(split(layer.regexp)))
    );
  } else if (layer.method) {
    list.push({
      method: layer.method.toUpperCase(),
      url: path.concat(split(layer.regexp)).filter(Boolean).join("/"),
    });
  }
}

/* Exporting the function ListExpressURLs. */
module.exports = function ExpressUrlList(app) {
  app._router.stack.forEach(print.bind(null, []));
  console.table(list);
};
