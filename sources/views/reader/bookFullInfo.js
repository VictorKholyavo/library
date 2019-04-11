import {JetView} from "webix-jet";

export default class WindowInfoView extends JetView {
	config() {
		webix.protoUI({
		    name:"clearComments"
		}, webix.EditAbility, webix.ui.comments);
		return {
			view: "window",
			localId: "window",
			width: 1200,
			height: 600,
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
						cols: [
							{
								rows: [
									{
										template: " ",
										width: 200,
										localId: "cover"
									},
									{
										view: "button",
										value: "Print Cover",
										click: () => {
											webix.print(this.$$("cover"));
										}
									}
								]
							},
							{
								rows: [
									{
										template: " ",
										width: 300,
										localId: "info"
									},
									{
										view: "template",
										localId: "likes",
										template: "<div class='columnSettings'><div class='rowSettings'><span class='infoBodyHeader'>Likes: </span></div></div>",
										height: 60
									},
									{
										view: "button",
										value: "Like",
										click: () => {
											let bookId = webix.storage.local.get("bookId");
											let likes = this.$$("likes");
											webix.ajax().post("http://localhost:3016/books/like", {bookId: bookId}).then((response) => {
												response = response.json();
												likes.define({template: "<div class='columnSettings'><div class='rowSettings'><span class='infoBodyHeader'>Likes: "+ response +"</span></div></div>"});
												likes.refresh();
												console.log(response);
												info.refresh();
											}, function (err) {
												console.log(err);
												webix.message({type: "error", text: err.responseText});
											})
										}
									}
								]
							},
						]
					},
					{
						view: "comments",
						localId: "commentsView",
						users: "http://localhost:3016/users/comments",
						scheme:{
			        $init:(obj) => {
		            if(obj.date)
		                obj.date = webix.i18n.parseFormatDate(obj.date);
			        }
				    },
						save: {
							url: (id, e, body) => {;
								let bookId = webix.storage.local.get("bookId");
								return webix.ajax().post("http://localhost:3016/comments/addcomment", {text: body.text, date: body.date, bookId: bookId})
							},
							updateFromResponse: true
						}
					}
				]
			},
			on: {
				onHide: () => {
					this.$$("commentsView").clearAll();
				}
			}
		};
	}
	showWindow(values) {
		this.$windowInfo().show();
		let genres = values.genres.map(function (genre) {
			return " " + genre.genre;
		});
		let comments = this.$$("commentsView");

		webix.storage.local.put("bookId", values.id);
		webix.ajax().get("http://localhost:3016/comments/" + values.id).then(function(data) {
			data = data.json();
			comments.parse(data);
		})

		let image = "<img class='photo' src="+values.cover.path+">";
		this.$$("likes").define({template: "<div class='columnSettings'><div class='rowSettings'><span class='infoBodyHeader'>Likes: "+ values.likes +"</span></div></div>"})
		this.$$("cover").define({template: "<div class='columnSettings'>"+ image +"</div>"});
		this.$$("info").define({template: "<div class='columnSettings'><div class='rowSettings'><span class='infoBodyHeader'>Title: </span>"+ values.title +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Author: </span>"+ values.authorName + " " + values.authorSurname + " " + values.authorPatronymic +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Pages: </span>"+ values.pages +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Year: </span>"+ values.year +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Genres: </span>"+ genres +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Publisher: </span>"+ values.publisher +
        "</div><div class='rowSettings'><span class='infoBodyHeader'>Country: </span>"+ values.country +"</div></div>"});
		this.$$("info").refresh();
		this.$$("likes").refresh();
		this.$$("titleOfBook").define({template: "<div class='headerInfo'>"+ values.title +"</div>"});
		this.$$("titleOfBook").refresh();
		this.$$("cover").refresh();
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
