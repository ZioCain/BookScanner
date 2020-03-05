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
		// retrieve info
		this.books = this.bs.GetBooks() as Book[];
	}
	delete(index:number){
		// delete book from service
		this.bs.RemoveBook(index);
	}
	export(){
		this.saveIcon = "hourglass";
		this.output = "Exporting to CSV...";
		// setup for saving data to CSV file
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
				// should update info upon end, actually won't do shit
				this.saveIcon = "download";
				this.output = "Exported successfully";
			};
			fw.onerror = function (e) {
				// in case of error will show info (never tested)
				console.log("Failed file write: " + e.toString());
				this.saveIcon = "download";
				this.output = "Error saving: "+e.toString();
			};
			// basic info/header for CSV file
			var data = 'titolo,autore,"data pubblicazione",publisher,posizione,lingua\n';
			// append all of the books data
			for(var k=0; k<this.books.length; ++k){
				data+= this.toCSVEntry(this.books[k])+ "\n";
			}
			// actually write data to file
			fw.write(new Blob([data], {type: "text/csv"}));
			// update status // won't actually work be fuck you
			this.saveIcon = "download";
			this.output = "Exported successfully";
		})
	}
	toCSVEntry(bk:Book){ // function to turn book data to CSV entry to be put in file directly
		return '"'+bk.title+'","'+bk.authors+'","'+bk.publishedDate+'","'+bk.publisher+'","'+bk.position+'","'+bk.language+'"';
	}
}
