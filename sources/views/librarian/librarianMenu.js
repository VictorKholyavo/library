import { JetView, plugins } from "webix-jet";

export default class TopView extends JetView {
	config() {
		var header = {
			type: "header", 
			template: "Librarian Menu", 
			css: "webix_header app_header"
		};

		var menu = {
			view: "menu", 
			localId: "top:librarianmenu",
			css: "app_menu",
			width: 180,
			layout: "y", 
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{ value: "Add Book", id: "librarian.addBook", icon: "wxi-columns" }
			]
		};

		var ui = {
			type: "clean", 
			paddingX: 5, 
			css: "app_layout", 
			rows: [
				{ 
					paddingX: 5, 
					paddingY: 10, 
					rows: [
						{ 
							type: "toolbar",
							localId: "toolbar",
							margin: 20,
							paddingX: 10,
							cols: [
								{ view: "template", localId: "helloTemplate", template: " ", width: 240},
								{},
								{ view: "button", value: "Logout", width: 150, click: () => {this.do_logout(); window.location.reload(true); }}
							],
							css: "webix_dark"
						},
						{
							css: "webix_shadow_medium",
							cols: [
								menu,								 
								{
									$subview: true
								}
							]
						}
					] 
				},
				{
					type: "wide", 
					paddingY: 10, 
					paddingX: 5, 
					rows: []
				}
			]
		};

		return ui;
	}
	$getHelloTemplate() {
		return this.$$("helloTemplate");
	}
	do_logout() {
		const user = this.app.getService("user");
		user.logout().catch(function () {
			//error handler
		});
	}
	init() {
		let username = webix.storage.local.get("UserInfo").email;
		this.$getHelloTemplate().define({template: "Hi, " + username + ". You are librarian"});
		this.$getHelloTemplate().refresh();
		this.use(plugins.Menu, this.$$("top:librarianmenu"));
	}
}