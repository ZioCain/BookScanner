import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Book, Posizione } from 'src/classes/book';
import { HttpClient } from '@angular/common/http';
import { BookstorageService } from 'src/services/bookstorage.service';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
	disable:boolean = true;
	book:Book=new Book();
	results:Book[]=[];
	output:string="";
	isbn:string="";
	posizione:Posizione=new Posizione();
	selectedBook:number=0;
	constructor(
		private barcodeScanner: BarcodeScanner,
		private http:HttpClient,
		private bs:BookstorageService
	){}
	Scan(){
		this.book = new Book();
		this.disable = true;
		this.output = "";
		this.barcodeScanner.scan().then(barcodeData => {
			this.book = new Book(barcodeData.text);
			this.isbn = barcodeData.text;
			this.retrieveBook();
		}).catch(err => {
			console.log('Error', err);
		});
	}
	Cerca(){
		this.book = new Book(this.isbn);
		this.disable = true;
		this.retrieveBook();
	}

	retrieveBook(){
		if(this.book.isbn==null || this.book.isbn=="") return;
		var URL:string = "https://www.googleapis.com/books/v1/volumes?q=ISBN:"+this.book.isbn+"&key=AIzaSyDplx9akwTd3cTFXRIitgw8fhQKQbLEQKQ&printType=books&maxResults=40";
		this.output = "";
		this.http.get(URL)
		.subscribe(data=>{
			console.log(JSON.stringify(data));
			if(typeof data["totalItems"]==="undefined" || data["totalItems"]<1){
				this.output = "Book was not found";
				return;
			}
			this.results = [];
			this.output = data["totalItems"]+" books found.";
			for(var bi=0; bi<data["items"]["length"]; ++bi){
				var volInfo = data["items"][bi]["volumeInfo"];
				var sep = "", bk:Book=new Book();
				bk.title = volInfo["title"];
				if(typeof volInfo["authors"]!=="undefined")
					for(var k=0; k<volInfo["authors"]["length"]; ++k, sep=' & ')
						bk.authors = sep+volInfo["authors"][k];
				if(typeof volInfo["publisher"]!=="undefined")
					bk.publisher = volInfo["publisher"];
				if(typeof volInfo["publishedDate"]!=="undefined")
					bk.publishedDate = volInfo["publishedDate"].substr(0,4);
				if(typeof volInfo["language"]!=="undefined")
					bk.language = volInfo["language"];
				this.results.push(bk);
			}
			this.selectedBook = 0;
			this.book = this.results[0];
			this.disable = false;
		},
		err=>{
			console.log("ERROR"+JSON.stringify(err));
		});
	}
	AddToList(){
		this.book.position = this.posizione.toString();
		// append data to service
		this.bs.AddBook(this.book);
		this.book = new Book();
		this.disable = true;
	}
	ChangeBook(){
		this.book = this.results[this.selectedBook];
	}
}
