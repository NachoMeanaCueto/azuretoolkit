import { Component, OnInit } from '@angular/core';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/models/user';
import { AzureToolkitService } from '../../common/services/azureToolkit.service';
import { SavedImage } from '../../common/models/SavedImage';



@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  user: User;
  savedImages: SavedImage[] | null;
  searchResults: SavedImage[] | null;
  searchPersonResults: SavedImage[] | null;

  constructor(private userService: UserService, private azureToolkitService: AzureToolkitService) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.azureToolkitService.getImages(user.userId).subscribe(images => this.savedImages = images )
    });
  }

  search(searchTerm: string) {
    this.searchResults = null;
    this.searchPersonResults = null;
    
    this.azureToolkitService.searchImage(this.user.userId, searchTerm).subscribe(result => {
      this.searchResults = result;
    });
  }

  searchPersons() {
    this.searchResults = null;
    this.searchPersonResults = null;

    this.azureToolkitService.getImagesWithPersons(this.user.userId).subscribe(result => {
      this.searchPersonResults = result;
    });

  }

}
