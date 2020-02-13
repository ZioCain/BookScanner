import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Book } from 'src/classes/book';
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
	output:string="";
	constructor(
		private barcodeScanner: BarcodeScanner,
		private http:HttpClient,
		private bs:BookstorageService
	){}
	Scan(){
		this.book = new Book();
		this.disable = true;
		this.barcodeScanner.scan().then(barcodeData => {
			this.book = new Book(barcodeData.text);
			this.retrieveBook();
		}).catch(err => {
			console.log('Error', err);
		});
	}

	retrieveBook(){
		if(this.book.isbn==null || this.book.isbn=="") return;
		var URL:string = "https://www.googleapis.com/books/v1/volumes?q=ISBN:"+this.book.isbn+"&key=AIzaSyDplx9akwTd3cTFXRIitgw8fhQKQbLEQKQ"
		console.log("API URL FOR BOOKS "+URL);
		this.http.get(URL)
		.subscribe(data=>{
			console.log(JSON.stringify(data));
			if(typeof data["totalItems"]==="undefined" || data["totalItems"]<1){
				this.output = "Book was not found";
				return;
			}
			this.output = "";
			// 9780970672681 // test ISBN
			var volInfo = data["items"][0]["volumeInfo"];
			var sep = "";

			this.book.title = volInfo["title"];
			if(typeof volInfo["authors"]!=="undefined")
				for(var k=0; k<volInfo["authors"]["length"]; ++k, sep=' & ')
					this.book.authors = sep+volInfo["authors"][k];
			if(typeof volInfo["publisher"]!=="undefined")
				this.book.publisher = volInfo["publisher"];
			if(typeof volInfo["publishedDate"]!=="undefined")
				this.book.publishedDate = volInfo["publishedDate"];
			if(typeof volInfo["pageCount"]!=="undefined")
				this.book.pageCount = volInfo["pageCount"];
			if(typeof volInfo["categories"]!=="undefined")
				for(var k=0, sep=''; k<volInfo["categories"]["length"]; ++k, sep=' & ')
					this.book.categories = sep+volInfo["categories"][k];
			this.disable = false;
		},
		err=>{
			console.log("ERROR"+JSON.stringify(err));
		});
	}
	AddToList(){
		// append data to service
		this.bs.AddBook(this.book);
		this.book = new Book();
		this.disable = true;
	}
}
