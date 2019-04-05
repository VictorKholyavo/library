import { JetView } from "webix-jet";

export default class LibraryView extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "library",
			editable: true,
			select: true,
			columns: [
				{ id: "id", header: "id of book" },
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
				{ id: "publisher", header: "Publisher" },
				{ id: "country", header: "Country" },
				{ id: "availableCount", header: "Available count" },
			],
			on: {
				onItemClick: (id) => {
					if (id.column = "genres") {
						console.log('sad');
					}
					// console.log(this.$$("library").getSelectedItem())
				}
			},
			url: "http://localhost:3016/books",
			save: {
				url: "rest->http://localhost:3016/books",
				updateFromResponse: true
			},
			css: "webix_shadow_medium"
		};
	}
	init() {
	}
}