import { Component, OnInit } from '@angular/core';
import { Remult, ValueConverters } from 'remult';
import { DeliveryFormController, Item } from '../home/delivery-form.controller';

@Component({
  selector: 'app-contact-sign',
  templateUrl: './contact-sign.component.html',
  styleUrls: ['./contact-sign.component.scss']
})
export class ContactSignComponent implements OnInit {

  constructor(private remult: Remult) { }
  form = new DeliveryFormController(this.remult);

  async ngOnInit() {
    let id = new URLSearchParams(window.location.search).get('id')!;
    if (id) {
      id = id.replace(/"/g, "");
    }
    try {
      await this.form.load(+id)
      console.log(this.form.driverSign);
      const expectedItems = this.form.items.filter(x => x.quantity > 0);
      this.sortedItems = [...expectedItems, ...this.form.items.filter(x => !x.quantity)];
    } catch { }

  }
  async sign() {
    let d = new Date();
    await this.form.signByContact(ValueConverters.DateOnly.toJson!(d),
      new Date().toTimeString().substring(0, 8))
  }

  sortedItems: Item[] = [];

}
