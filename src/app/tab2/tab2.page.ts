import { Component } from '@angular/core';
import { Book } from 'src/classes/book';
import { BookstorageService } from 'src/services/bookstorage.service';
declare let window:any;
@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
	books:Book[]=[];
	saveIcon:string="download";
	output:string="";
	constructor(
		private bs:BookstorageService,
	){
	}
	// on view will become visible reload data from service
	ionViewWillEnter(){
		this.books = this.bs.GetBooks();
	}
	delete(index:number){
		this.bs.RemoveBook(index);
		this.books.splice(index,1);
	}
	export(){
		this.saveIcon = "hourglass";
		this.output = "Exporting to CSV...";
		/*
		let path = this.fileSystem.root+'/Download/';
		let filename = "books.csv";

		file.createWriter();
		var fw:FileWriter;
		this.fileSystem //*/
		window.requestFileSystem(1, 0, (fs)=>{
			window.resolveLocalFileSystemURL(cordova["file"]["externalApplicationStorageDirectory"], async dirEntry => {
				dirEntry.getFile("books.csv", {create:true}, (fe)=>{
					this.writeFile(fe);
				}, (err)=>{
					console.log("ERROR creating file: "+JSON.stringify(err));
					this.saveIcon = "download";
					this.output = "Error saving: "+JSON.stringify(err);
				});
			});
		}, (err)=>{
			console.log(err);
			this.saveIcon = "download";
		});
	}
	writeFile(fileEntry){
		fileEntry.createWriter((fw)=>{
			fw.onwriteend = ()=>{
				this.saveIcon = "download";
				this.output = "Exported successfully";
			};
			fw.onerror = function (e) {
				console.log("Failed file write: " + e.toString());
				this.saveIcon = "download";
				this.output = "Error saving: "+e.toString();
			};
			var data = 'isbn,titolo,autore,"data pubblicazione",publisher,pagine,categorie\n';
			for(var k=0; k<this.books.length; ++k){
				data+= this.toCSVEntry(this.books[k])+ "\n";
			}
			fw.write(new Blob([data], {type: "text/csv"}));
			this.saveIcon = "download";
		})
	}
	toCSVEntry(book:Book){
		return '"'+book.isbn+'","'+book.title+'","'+book.authors+'","'+book.publishedDate+'","'+book.publisher+'","'+book.pageCount+'","'+book.categories+'"';
	}
}
