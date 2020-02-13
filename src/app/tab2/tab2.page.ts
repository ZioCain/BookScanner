import { Component } from '@angular/core';
import { Book } from 'src/classes/book';
import { BookstorageService } from 'src/services/bookstorage.service';
import { FileSystem } from '@ionic-native/file';
// import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
	books:Book[]=[];
	fileTransfer;
	constructor(
		private bs:BookstorageService,
		private fileSystem: FileSystem
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
		let path = this.fileSystem.root+'/Download/';
		let filename = "books.csv";
		
		file.createWriter();
		var fw:FileWriter;
		this.fileSystem
	}
}
