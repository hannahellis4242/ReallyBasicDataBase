import createApp from "./createApp";

(async () => {
  createApp().then((app) =>
    app.listen(5000, "0.0.0.0", () =>
      console.log("RBDB listening on port 5000")
    )
  );
})();
