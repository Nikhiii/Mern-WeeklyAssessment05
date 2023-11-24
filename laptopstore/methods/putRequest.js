const requestBodyparser = require("../util/bodyParser");
const writeToFile = require("../util/writeToFile");
module.exports = async (req, res) => {
  let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
  let id = req.url.split("/")[3];
  const regexV4 = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );
  if (!regexV4.test(id)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        title: "Validation Failed",
        message: "UUID is not valid",
      })
    );
  } else if (baseUrl === "/api/laptops/" && regexV4.test(id)) {
    try {
      let body = await requestBodyparser(req);
      const index = req.laptops.findIndex((laptop) => {
        return laptop.id === id;
      });
      if (index === -1) {
        res.statusCode = 404;
        res.write(
          JSON.stringify({ title: "Not Found", message: "Laptop not found" })
        );
        res.end();
      } else {
        req.laptops[index] = { id, ...body };
        writeToFile(req.laptops);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(req.laptops[index]));
      }
    } catch (err) {
      console.log(err);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          title: "Validation Failed",
          message: "Request body is not valid",
        })
      );
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found", message: "Route not found" }));
  }
};
