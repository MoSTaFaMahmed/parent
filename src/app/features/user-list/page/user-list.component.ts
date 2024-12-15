import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from '@core/services/users.service';
import { User } from '@core/models/user.modal';
import { NgFor, NgIf } from '@angular/common';
import { UserCardComponent } from '../components/user-card/user-card.component';
import { UserDetailModalComponent } from '../components/user-detail-modal/user-detail-modal.component';
import { UserAddEditModalComponent } from '../components/user-add-edit-modal/user-add-edit-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    NgFor,
    NgIf,
    UserCardComponent,
    UserAddEditModalComponent,
    UserDetailModalComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  cachedUsers: User[] = [];
  selectedUser!: User;
  actionMode = '';
  openDetails = false;
  openActionModal = false;
  deleteConfirm = false;
  isLoading = true;
  paginationLoading = false;
  isAllLoaded = false;
  currentPage = 1;
  totalPages = 0;
  usersPerPage: number = 10;
  screenHeight: number = 0;

  constructor(private userService: UsersService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('User Page');
    this.loadMoreUsers();
  }

  loadMoreUsers(): void {
    if (this.paginationLoading || this.isAllLoaded) {
      return;
    }

    this.paginationLoading = true;

    if (this.cachedUsers.length === 0 || this.currentPage <= this.totalPages) {
      this.userService.getUsers(this.currentPage).subscribe({
        next: (response) => {
          this.cachedUsers = [...this.cachedUsers, ...response.data];
          this.totalPages = response.total_pages;
          this.users = this.cachedUsers.slice(
            0,
            this.usersPerPage * this.currentPage
          );
          this.currentPage++;
          this.paginationLoading = false;

          if (this.currentPage > this.totalPages) {
            this.isAllLoaded = true;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.paginationLoading = false;
          this.isLoading = false;
        },
      });
    } else {
      this.users = this.cachedUsers.slice(
        0,
        this.usersPerPage * this.currentPage
      );
      this.currentPage++;
      this.paginationLoading = false;
    }
  }

  onOpenModal(event: any): void {
    this.selectedUser = event.user;
    if (event.type === 'edit') {
      this.openActionModal = true;
      this.actionMode = event.type;
      return;
    }
    if (event.type === 'delete') {
      this.deleteConfirm = true;
    }
    if (event.type === 'info') {
      this.openDetails = true;
    }
  }

  onOpenAddModal() {
    this.actionMode = 'add';
    this.openActionModal = true;
  }

  closeModal(type: string): void {
    if (type === 'info') {
      this.openDetails = false;
    } else if (type != 'info' && type != 'delete') {
      this.openActionModal = false;
    } else if (type === 'delete') {
      this.deleteConfirm = false;
    }
  }

  loadUsers(): void {
    this.cachedUsers = [];
    this.currentPage = 1;
    this.isAllLoaded = false;
    this.isLoading = true;
    this.loadMoreUsers();
  }
}
