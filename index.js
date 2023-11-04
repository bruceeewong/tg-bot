const app = require("./src/app");

function main() {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
  });
}

main();
