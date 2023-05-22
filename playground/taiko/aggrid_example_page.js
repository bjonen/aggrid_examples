const {
  openBrowser,
  goto,
  click,
  toLeftOf,
  checkBox,
  textBox,
  button,
  dropDown,
  link,
  $,
  below,
  text,
  above,
  highlight,
  rightClick,
  near,
  within,
  dragAndDrop,
  closeBrowser,
} = require("taiko");
(async () => {
  try {
    await openBrowser();
    await goto("https://www.ag-grid.com/example/");
    await click("Reject All");
    await click("Columns");
    await checkBox(toLeftOf("Search..."));
    await click(dropDown(toLeftOf(textBox("Search..."))));
    await click(link(toLeftOf(textBox("Search..."))));
    await click($(".ag-icon", toLeftOf(textBox("Search..."))));
    await $(".ag-column-select-column-label").text();
    await text("Rating", below("Performance"), above("Total Winnings"));
    await text(
      "Rating",
      below("Performance"),
      below("Total Winnings")
    ).exists();
    await rightClick($(".ag-icon-grip"), toLeftOf("Rating"));
    await rightClick($(".ag-icon-grip"), toLeftOf("Performance"));
    await rightClick($(".ag-icon-grip"), near("Participant"));
    await highlight($(".ag-icon-grip"), near("Rating"));
    await highlight($('[col-id="language"]'), within($('[row-id="0"]')));
    await $('[col-id="language"]', within($('[row-index="0"]'))).text();
    await highlight(text("language"));
    // left in pixels
    await dragAndDrop(text("language"), { left: 150 });
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();
