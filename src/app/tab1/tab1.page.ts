import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Book } from 'src/classes/book';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
	book:Book=null;
	output:string="";
	constructor(
		private barcodeScanner: BarcodeScanner,
		private http:HttpClient
	){}
	Scan(){
		this.book = null;
		this.barcodeScanner.scan().then(barcodeData => {
			this.book = new Book(barcodeData.text);
			this.retrieveBook();
		}).catch(err => {
			console.log('Error', err);
		});
	}

	retrieveBook(){
		if(this.book.isbn==null || this.book.isbn=="") return;
		var URL:string = "https://www.googleapis.com/books/v1/volumes?q=ISBN:"+this.book.isbn+"&key=AIzaSyCPgyuy7gBqJAZKz-UsMYNx41FJ_BtrrW0"
		console.log("API URL FOR BOOKS "+URL);
		return this.http.get(URL)
		.subscribe(data=>{
			console.log(JSON.stringify(data));
			if(typeof data["totalItems"]==="undefined" || data["totalItems"]<1) return;
			// 9780970672681 // test ISBN
			var volInfo = data["items"][0]["volumeInfo"];
			var sep = "";

			this.book.title = volInfo["title"];
			for(var k=0; k<volInfo["authors"]["length"]; ++k, sep=' & ')
				this.book.authors = sep+volInfo["authors"][k];
			this.book.publisher = volInfo["publisher"];
			this.book.publishedDate = volInfo["publishedDate"];
			this.book.pageCount = volInfo["pageCount"];
			for(var k=0, sep=''; k<volInfo["categories"]["length"]; ++k, sep=' & ')
				this.book.categories = sep+volInfo["categories"][k];
		},
		err=>{
			console.log("ERROR"+JSON.stringify(err));
		});
	}
}
