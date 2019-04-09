import { JetView } from "webix-jet";
import WindowInfoView from "./bookFullInfo";

export default class DataView extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "library",
			select: true,
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
				{ id: "title", header: "Title", fillspace: true },
				{ id: "pages", header: "Pages" },
				{ id: "year", header: "Year" },
				{ id: "author", header: "Author", fillspace: true },
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
					// this.$$("library").updateItem(values.id, data);
					webix.message({text: "your order of " + values.title + " is pending. Wait..."});
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
			url: "http://localhost:3016/books",
			save: {
				url: "rest->http://localhost:3016/books/order",
				updateFromResponse: true
			},
			css: "webix_shadow_medium"
		};
	}
	init() {
		this.windowInfo = this.ui(WindowInfoView);
	}
}
