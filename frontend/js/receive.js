window.onload = function() {
	// URLを取得
	const url = new URL(window.location.href);

	// URLSearchParamsオブジェクトを取得
	const params = url.searchParams;

	// consoleに受け取ったパラメータを出力
	console.log(params);

	// パラメータから「username」を取得
	const username = params.get("username");

	// IDを使ってspan要素を取得する
	const span = document.getElementById("receivedName");
	// 取得したspan要素に受け取ったパラメータを代入
	span.innerText = username;
}