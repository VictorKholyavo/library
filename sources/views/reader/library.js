import {JetView} from "webix-jet";

export default class DataView extends JetView{
	config(){
		return {
			view: "datatable",
			localId: "library",
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
