import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { TextAreaInputComponent } from './text-area-input/text-area-input.component';
import { RichTextEditorComponent } from './rich-text-editor/rich-text-editor.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { ButtonComponent } from './button/button.component';
import { ButtonRightAreaComponent } from './button-right-area/button-right-area.component';
import { EinsteinWriterComponent } from './einstein-writer/einstein-writer.component';
import { EinsteinChatComponent } from './einstein-chat/einstein-chat.component';
import { RouterModule } from '@angular/router';
import { ChatOptionsComponent } from './chat-options/chat-options.component';
import { ChatOptionComponent } from './chat-option/chat-option.component';
import { ChatlogsComponent } from './chatlogs/chatlogs.component';
import { LandingBannerComponent } from './landing-banner/landing-banner.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { ButtonBottomRowComponent } from './button-bottom-row/button-bottom-row.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PremiumModalComponent } from './premium-modal/premium-modal/premium-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    ChatboxComponent,
    TextAreaInputComponent,
    RichTextEditorComponent,
    ButtonComponent,
    ButtonRightAreaComponent,
    EinsteinWriterComponent,
    EinsteinChatComponent,
    ChatOptionsComponent,
    ChatOptionComponent,
    ChatlogsComponent,
    LandingBannerComponent,
    LoginPageComponent,
    SignupPageComponent,
    ButtonBottomRowComponent,
    PremiumModalComponent

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EditorModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [
    TextAreaInputComponent,
    {
      provide: MatDialogRef,
      useValue: {}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
