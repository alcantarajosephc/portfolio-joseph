import { Component, OnInit } from '@angular/core';
import { Experience } from '../interface/experience';
import { CommonModule } from '@angular/common';
import experiences from "../../assets/experiences.json";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  fullName: string = 'Joseph Alcantara';
  experienceData: Experience[] = experiences.experiences;


  constructor() {}

  ngOnInit(): void {
  }
}
