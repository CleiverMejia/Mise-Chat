import { Component, Input, OnInit } from '@angular/core';
import { TypeMessage } from '@enums/typeMessage.enum';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss'],
  standalone: false,
})
export class FileCardComponent  implements OnInit {

  @Input() type!: TypeMessage;
  @Input() file!: File;
  typeMessage = TypeMessage;

  constructor() { }

  ngOnInit() {}

  generateImageUrl(file: File) {
    return URL.createObjectURL(file);
  }
}
