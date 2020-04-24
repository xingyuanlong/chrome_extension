// 所谓content-scripts，其实就是Chrome插件中向页面注入脚本的一种形式（虽然名为script，其实还可以包括css的），
// 借助content-scripts我们可以实现通过配置的方式轻松向指定页面注入JS和CSS，
// 最常见的比如：广告屏蔽、页面CSS定制，等等。
// 权限很大,操作需谨慎

$(document).ready(function () {
  console.log("DOM READY!");
  $(document.documentElement).keydown(function (e) {
    console.log("keydown action!");
    chrome.runtime.sendMessage({ Message: "888" }, function (response) {
      console.log("=======", response);
    });
  });
});

// accept messages from background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("content: " + request);
  if (request.cmd && request.cmd === "changeColor") {
    // 危险的操作  Dangerous operation
    // 仅仅演示
    Array.from(document.querySelectorAll("p")).map((x) => {
      x.style.color = request.value;
    });
    chrome.runtime.sendMessage(
      { cmd: "changeColor", value: request.value },
      function (response) {
        console.log("content : background 回复：" + response);
      }
    );
  }
  sendResponse("我收到了你的消息！");
});
