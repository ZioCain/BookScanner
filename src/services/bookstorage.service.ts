import { Injectable } from '@angular/core';
import { Book } from 'src/classes/book';

@Injectable({
	providedIn: 'root'
})
export class BookstorageService {
	books:Book[]=[];
	constructor(){}
	AddBook(book:Book){
		this.books.push(book);
	}
	RemoveBook(index:number){
		this.books.splice(index,1);
	}
	GetBooks(){
		return this.books;
	}
}
