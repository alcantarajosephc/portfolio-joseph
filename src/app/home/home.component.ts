import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience } from '../interface/experience';
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
