import { Component, OnInit } from '@angular/core';
import { CognitiveService } from '../../common/services/cognitive.service';
import { ImageResult } from '../../common/models/bingSearchResponse';
import { ComputerVisionRequest, ComputerVisionResponse } from '../../common/models/computerVisionResponse';
import { AzureToolkitService } from '../../common/services/azureToolkit.service';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/models/User';
import { ImagePostRequest } from '../../common/models/ImagePostRequest';

  @Component({
    selector: 'search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
  })
  export class SearchComponent implements OnInit {

    searchResults: ImageResult[] | null;
    isSearching = false;
    isSaving = false;
    currentAnalytics: ComputerVisionResponse | null;
    currentItem: ImageResult | null;
    isAnalyzing = false;
    currentItemSaved: boolean;
    user: User;

    constructor(private cognitiveService: CognitiveService, private azureToolkitService: AzureToolkitService, private userSvc: UserService)
    {
    }

    ngOnInit(): void {
      this.userSvc.getUser().subscribe(userResponse => this.user = userResponse);
    }


    search(searchTerm: string) {

      this.searchResults = null;
      this.currentAnalytics = null;
      this.isSearching = true;

      this.cognitiveService.searchImages(searchTerm).subscribe(result => {
        this.searchResults = result.value;
        this.isSearching = false;
      });
    }


    analyze(result: ImageResult) {

      this.currentItem = result;
      this.currentAnalytics = null;
      this.isAnalyzing = true;
      this.currentItemSaved = false;

      this.cognitiveService.analyzeImage({ url: result.thumbnailUrl } as ComputerVisionRequest).subscribe(result => {
        this.currentAnalytics = result;
        this.isAnalyzing = false;
      });
      window.scroll(0, 0);
    }


    saveImage() {

      this.isSaving = true;

      let transferObject: ImagePostRequest = {
        userId: this.user.userId,
        url: this.currentItem.thumbnailUrl,
        encodingFormat: this.currentItem.encodingFormat,
        id: this.currentItem.imageId,
        description: this.currentAnalytics.description.captions[0].text,
        tags: this.currentAnalytics.tags.map(tag => tag.name)
      }
      
      this.azureToolkitService.saveImage(transferObject).subscribe(saveSuccessful => {
        this.currentItemSaved = saveSuccessful;
      });

      this.isSaving = false;
    }


  }
