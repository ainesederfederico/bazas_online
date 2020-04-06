import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentComponent } from './components/document/document.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { BoardComponent } from './components/board/board.component';

import { environment } from './../environments/environment';

const config: SocketIoConfig = { url: undefined, options: {} };


@NgModule({
  declarations: [
    AppComponent,
    DocumentListComponent,
    DocumentComponent,
    UserListComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
