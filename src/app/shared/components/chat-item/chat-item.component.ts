import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
  standalone: false,
})
export class ChatItemComponent  implements OnInit {
  @Input() cid!: string;
  @Input() url!: string;
  @Input() nickname!: string;

  constructor() { }

  ngOnInit() {}

}
