import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="p-8"><h1 class="text-2xl font-bold">Create Service</h1></div>'
})
export class CreateServiceComponent {}
