// src/app/admin-dashboard/admin-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { Course } from '../course.model';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  courses: Course[] = [];
  newCourse: Course = { title: '', description: '', price: 0, imageUrl: '' };
  selectedFile: File | null = null;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe((courses) => {
      this.courses = courses;
    });
  }

  handleFileInput(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  createCourse(): void {
    if (this.selectedFile) {
      this.courseService.uploadImage(this.selectedFile).subscribe((imageUrl) => {
        this.newCourse.imageUrl = imageUrl;
        this.saveCourse();
      });
    } else {
      this.saveCourse();
    }
  }

  private saveCourse(): void {
    this.courseService.createCourse(this.newCourse).subscribe(() => {
      this.loadCourses();
      this.resetForm();
    });
  }

  updateCourse(course: Course): void {
    this.courseService.updateCourse(course).subscribe((updatedCourse) => {
      // Handle the updated course as needed
      console.log('Course updated:', updatedCourse);
      this.loadCourses();
    });
  }

  deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe(() => {
      console.log('Course deleted:', courseId);
      this.loadCourses();
    });
  }

  private resetForm(): void {
    this.newCourse = { title: '', description: '', price: 0, imageUrl: '' };
    this.selectedFile = null;
  }
}
