import { Component, OnInit } from '@angular/core';
import { Experience } from '../interface/experience';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  fullName: string = 'Joseph Alcantara';

  constructor() {}

  ngOnInit(): void {
  }

  experience1: Experience = {
    id: 0,
    date: '2024 — present',
    position: 'Software Engineer',
    company: 'Isentia',
    description: 'test desc',
    skills: ['javascript', 'c#']
  };
}
