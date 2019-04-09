import {JetView} from "webix-jet";

export default class WindowInfoView extends JetView {
	config() {
		return {
			view: "window",
			localId: "window",
			width: 600,
			height: 400,
			position: "center",
			modal: true,
			borderless: true,
			head: {
				view:"toolbar", margin:-4, cols:[
					{ view:"label", label: "", localId: "titleOfBook", template: " " },
					{ view:"icon", icon:"wxi-close", click: () => {
						this.$$("window").hide();
					}
					}
				]
			},
			body: {
				borderless: true,
				cols: [
					{
						template: " ",
						width: 200,
						localId: "cover"
					},
					{
						template: " ",
						width: 300,
						localId: "info"
					},
					// {
					// 	width: 200,
					// 	cols: [
					// 		{
					// 			rows: [
					// 				{
					// 					cols: [
					// 						{ view: "template", localId: "rating",height: 100,  template: " "},
					// 						{ view:"icon", align: "left", localId: "addRating",width: 80, icon:"fas fa-star"},
					// 					]
					// 				},
					// 				{}
					// 			]
					// 		}
					// 	]
					// }
				]
			}
		};
	}
	showWindow(values) {
		this.$windowInfo().show();
		console.log(values);
		let genres = values.genres.map(function (genre) {
			return " " + genre.genre;
		});
        console.log(genres);
        
		// let rating = this.$$("rating");
		// let refreshDatatable = this.app;
		let image = "<img class='photo' src="+values.cover.path+">";
		this.$$("cover").define({template: "<div class='columnSettings'>"+ image +"</div>"});
		this.$$("info").define({template: "<div class='columnSettings'><div class='rowSettings'><span class='infoBodyHeader'>Title: </span>"+ values.title +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Author: </span>"+ values.author +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Pages: </span>"+ values.pages +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Year: </span>"+ values.year +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Genres: </span>"+ genres +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Publisher: </span>"+ values.publisher +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Country: </span>"+ values.country +"</div></div>"});
		this.$$("info").refresh();



		// this.$$("rating").define({template: "<div class='rowSettings'><span class='infoProductHeader'>Rating: </span>"+ values.rating +"</div>"});
		this.$$("titleOfBook").define({template: "<div class='headerInfo'>"+ values.title +"</div>"});
		// this.$$("rating").refresh();
		this.$$("titleOfBook").refresh();
		this.$$("cover").refresh();
		// this.$$("addRating").attachEvent("onItemClick", function() {
		// 	webix.ajax().post("http://localhost:3014/products/product", {productId: values.id}).then(function (response) {
		// 		response = response.json();
		// 		webix.ajax().put("http://localhost:3014/products/:id", {productId: response.id, rating: response.rating}).then(function (newData) {
		// 			newData = newData.json();
		// 			return newData;
		// 		}).then(function (newData) {
		// 			rating.define({template: "<div class='rowSettings'><span class='infoProductHeader'>Rating: </span>"+ newData.rating +"</div>"});
		// 			rating.refresh();
		// 			refreshDatatable.callEvent("refreshDatatable", [newData]);
		// 		});
		// 	});
		// });
	}
	init() {
	}
	$windowInfo() {
		return this.$$("window");
	}
	hideForm() {
		this.getRoot().hide();
	}
}
