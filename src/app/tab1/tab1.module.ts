import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		RouterModule.forChild([{ path: '', component: Tab1Page }])
	],
	declarations: [Tab1Page],
	providers:[
		BarcodeScanner,
	]
})
export class Tab1PageModule {}
