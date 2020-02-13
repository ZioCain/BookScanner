import { Injectable } from '@angular/core';
import { Book } from 'src/classes/book';

@Injectable({
	providedIn: 'root'
})
export class BookstorageService {
	books:Book[]=[];
	constructor(){
		if(localStorage.getItem("books")==null) localStorage.setItem("books","[]");
		this.Load();
	}
	AddBook(book:Book){
		this.books.push(book);
		this.Save();
	}
	RemoveBook(index:number){
		this.books.splice(index,1);
		this.Save();
	}
	GetBooks(){
		return this.books;
	}
	Save(){
		localStorage.setItem("books", JSON.stringify(this.books));
	}
	Load(){
		this.books = JSON.parse(localStorage.getItem("books")) as Book[];
	}
}
