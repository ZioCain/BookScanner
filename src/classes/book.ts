export class Book{
	isbn:string="";
	title:string="";
	authors:string="";
	publisher:string="";
	publishedDate:string="";
	pageCount:number=0;
	categories:string="";
	constructor(id?:string){
		this.isbn = id || "";
	}
}
