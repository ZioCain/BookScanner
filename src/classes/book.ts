export class Posizione{
	armadio:string="A";
	scaffale:number=1;
	lato:string="SX";
	toString(){
		return this.armadio+"-"+this.scaffale+"-"+this.lato;
	}
}
export class Book{
	isbn:string="";
	title:string="";
	authors:string="";
	publisher:string="";
	publishedDate:string="";
	position:string="";
	constructor(id?:string){
		this.isbn = id || "";
	}
	toCSVEntry(){
		return '"'+this.title+'","'+this.authors+'","'+this.publishedDate+'","'+this.publisher+'","'+this.pageCount+'","'+this.position+'"';
	}
}
