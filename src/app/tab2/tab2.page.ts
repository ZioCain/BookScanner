import { Component } from '@angular/core';
import { Book } from 'src/classes/book';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
	books:Book[]=[];
	constructor(){
		this.books = JSON.parse(localStorage.getItem("books")) as Book[];
	}
	// on view will become visible reload data from service
}
