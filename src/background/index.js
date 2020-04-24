// https://developer.chrome.com/extensions/browserAction
// 后台，是一个常驻的页面，它的生命周期是插件中所有类型页面中最长的，它随着浏览器的打开而打开，随着浏览器的关闭而关闭，
// 所以通常把需要一直运行的、启动就运行的、全局的代码放在background里面。
// background的权限非常高，几乎可以调用所有的Chrome扩展API（除了devtools），而且它可以无限制跨域，也就是可以跨域访问任何网站而无需要求对方设置CORS
console.log("background");
chrome.browserAction.setBadgeText({ text: "hi~" });
chrome.browserAction.setBadgeBackgroundColor({ color: 'pink' });


// 参考: https://developer.chrome.com/extensions/contextMenus
chrome.contextMenus.create({
  title: "测试右键菜单",
  id: "test-command",
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "test-command") {
    chrome.notifications.create(null, {
      type: "basic",
      iconUrl: "../assets/icons/icon_48.png",
      title: "标题",
      message: "您刚才点击了自定义右键菜单！",
    });
  }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("background :", request);
  // debugger;
  if (request.cmd && request.cmd === "changeColor") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { msg: 888 }, function (
        response
      ) {

      });
    });
  }
  return true;
});

// chrome.contextMenus.create({
// 	title: '使用度娘搜索：%s', // %s表示选中的文字
// 	contexts: ['page'], // 只有当选中文字时才会出现此右键菜单
// 	onclick: function(params)
// 	{
//     console.log('biubiu~~');
// 		// 注意不能使用location.href，因为location是属于background的window对象
// 		chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
// 	}
// });

