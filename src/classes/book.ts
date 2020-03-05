// class to handle position on book shelf
export class Posizione{
	armadio:string="A";
	scaffale:number=1;
	lato:string="SX";
	toString(){ // output data properly
		return this.armadio+"-"+this.scaffale+"-"+this.lato;
	}
}
// class to handle book info
export class Book{
	isbn:string="";
	title:string="";
	authors:string="";
	publisher:string="";
	publishedDate:string="";
	position:string="";
	language:string="";
	constructor(id?:string){
		this.isbn = id || "";
	}
	toCSVEntry(){ // will never be used
		return '"'+this.title+'","'+this.authors+'","'+this.publishedDate+'","'+this.publisher+'","'+this.position+'","'+this.language+'"';
	}
}
