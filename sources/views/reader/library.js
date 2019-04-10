import { JetView } from "webix-jet";
import WindowInfoView from "./bookFullInfo";

export default class DataView extends JetView {
	config() {
		return {
			rows: [
				// {
					// height: 35,
					// view:"toolbar",
					// elements:[
					// 	{
					// 		view:"text",
					// 		localId:"list_input",
					// 		css:"fltr",
					// 	},
					// 	{
					// 		view: "button",
					// 		localId: "findButton",
					// 		value: "Find by title",
					// 		width: 200,
					// 		click: () => {
					// 			let inputData = this.$$("list_input").data.value;
					// 			this.$$("library").clearAll();
					// 			this.$$("library").load(this.$$("library").config.url);
					// 			// console.log(inputData);
					//
					// 		}
					// 	}
					// ]
				// },
				{
					view: "datatable",
					localId: "library",
					select: true,
					pager:"bottom",
					rowHeight: 80,
					scheme: {
						$change: function (item) {
							if (item.availableCount == 0) {
								item.$css = "highlight";
							}
						}
					},
					columns: [
						{
							id: "image", header: "Image", width: 100, template: (obj) => {
								let photo = "";
								if (obj.cover == "") {
									photo = "<img class='defaultPhoto'>";
								}
								else {
									photo = "<img src =" + obj.cover.path + " class='smallPhoto'>";
								}
								return "<div class='columnSettings'>" + photo + "</div>";
							}
						},
						{ id: "title", header:["Title", { content:"serverFilter"}], fillspace: true },
						{ id: "pages", header: "Pages" },
						{ id: "year", header: "Year" },
						{ id: "author", header: ["Author", { content:"serverFilter"}], fillspace: true, template: (obj) => {
							return obj.authorName + " " + obj.authorSurname + " " + obj.authorPatronymic;
						}
						},
						{
							id: "genres", header: "Genres", fillspace: true, template: (obj) => {
								let genres = " ";
								genres = obj.genres.map(function (genre) {
									return " " + genre.genre;
								});
								return genres;
							}
						},
						{ id: "publisher", header: "Publisher" },
						{ id: "country", header: "Country" },
						{ id: "availableCount", header: "Available count" },
						{ id: "buy", header: "Buy", template: (obj) => {
							if (obj.availableCount > 0) {
								return "<i class='fas fa-shopping-cart'></i>"
							}
							return "Not available";
						} }
					],
					onClick: {
						"fa-shopping-cart": (e, id) => {
							let values = this.$$("library").getItem(id);
							let data = {bookId: values.id};
							webix.ajax().post("http://localhost:3016/order/add", data);
							webix.message({text: "Your order of " + values.title + " is pending. Wait an answer from librarian..."});
						},
					},
					on: {
						onItemDblClick: (id) => {
							if (id.column !== "buy") {
								let values = this.$$("library").getItem(id.row);
								this.windowInfo.showWindow(values);
							}
						},
					},
					// datafetch: 10,
					url: "http://localhost:3016/books",
					save: {
						url: "rest->http://localhost:3016/books/order",
						updateFromResponse: true
					},
					css: "webix_shadow_medium"
				},
				{
					view:"pager",
					id:"bottom",
					size: 10,
				},
			]
		};
	}
	init() {
		// let input = this.$$("list_input")
		// webix.attachEvent("onBeforeAjax",
		// 	function(mode, url, data, request, headers) {
		// 		let inputData = input.data.value;
		//
		// 		console.log(inputData);
		// 		// if (webix.storage.local.get("UserInfo")) {
		// 		// 	let token = webix.storage.local.get("UserInfo").token;
		// 		headers["findByTitle"] = inputData;
		// 		// }
		// 	}
		// );
		this.windowInfo = this.ui(WindowInfoView);
	}
}
