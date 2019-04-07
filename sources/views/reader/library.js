import {JetView} from "webix-jet";

export default class DataView extends JetView{
	config(){
		return {
			view: "datatable",
			localId: "library",
			select: true,
			columns: [
				{ id: "id", header: "id of book" },
				{ id: "title", header: "Title", fillspace: true },
				{ id: "pages", header: "Pages" },
				{ id: "year", header: "Year" },
				{ id: "author", header: "Author", fillspace: true },
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
			url: "http://localhost:3016/books",
			css: "webix_shadow_medium"
		};
	}
	init(){
	}
}
