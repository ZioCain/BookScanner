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
	disable:boolean = true; // whether disable or not the inputs for book details
	book:Book=new Book(); // the book record
	results:Book[]=[]; // results retrieved from the google API
	output:string=""; // error/whatever output
	isbn:string=""; // current ISBN
	posizione:Posizione=new Posizione(); // current shelf position
	selectedBook:number=0; // current selected book amoung results
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
			// show total amount of items found / might not be the same amount as those displayed in the select
			this.output = data["totalItems"]+" books found.";
			for(var bi=0; bi<data["items"]["length"]; ++bi){
				// get volume info
				var volInfo = data["items"][bi]["volumeInfo"];
				var sep = "", bk:Book=new Book();
				// setup temporary book with volume info
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
		// apply book position
		this.book.position = this.posizione.toString();
		// append data to service
		this.bs.AddBook(this.book);
		this.book = new Book();
		this.disable = true;
	}
	ChangeBook(){
		// show new data according to selected result
		this.book = this.results[this.selectedBook];
	}
}
