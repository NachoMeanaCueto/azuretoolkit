import { Component, OnInit } from '@angular/core';
import { UserService } from '../common/services/user.service';
import { User } from '../common/models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  user: User

  constructor(private userService: UserService) { }

  ngOnInit(): void {
   this.userService.getUser().subscribe(userReturned => this.user = userReturned);
  }

}
