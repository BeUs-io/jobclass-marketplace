import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-project',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-8">Post a Project</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
          <form>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
              <input type="text" class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea rows="5" class="w-full px-4 py-2 border rounded-lg"></textarea>
            </div>
            <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Post Project
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PostProjectComponent {}
