import { JetView } from "webix-jet";
import FormforBookView from "./bookEditForm";

export default class LibraryView extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "library",
			// editable: true,
			select: true,
			rowHeight: 80,
			columns: [
				{id: "image", header: "Image", width: 100, template: (obj) => {
					let photo = "";
					if (obj.cover == "") {
						photo = "<img class='defaultPhoto'>";
					}
					else {
						photo = "<img src ="+obj.cover.path+" class='smallPhoto'>";
					}
					return "<div class='columnSettings'>"+ photo +"</div>";
				}},
				{ id: "title", editor: "text", header: "Title", fillspace: true },
				{ id: "pages", editor: "text", header: "Pages" },
				{ id: "year", editor: "text", header: "Year" },
				{ id: "author", editor: "text", header: "Author", fillspace: true },
				{ id: "genres", header: "Genres", fillspace: true, template: (obj) => {
					let genres = " ";
					genres = obj.genres.map(function (genre) {
						return genre.genre;
					});
					return genres;
				}}, 
				{ id: "publisher", editor: "text", header: "Publisher" },
				{ id: "country", editor: "text", header: "Country" },
				{ id: "availableCount", editor: "text", header: "Available count" },
			],
			url: "http://localhost:3016/books",
			save: {
				url: "rest->http://localhost:3016/books",
				updateFromResponse: true
			},
			on: {
				onItemDblClick: (id) => {
					const form = this.FormforBook;
					const datatable = this.$getDatatable();
					const values = datatable.getSelectedItem();
					form.showWindow(values, function (data) {
						console.log(data);
						datatable.updateItem(data.id, data);
						form.hide();
					});
				},
			},
			css: "webix_shadow_medium"
		};
	}
	$getDatatable() {
		return this.$$("library");
	}
	init() {
		this.FormforBook = this.ui(FormforBookView);
	}
}