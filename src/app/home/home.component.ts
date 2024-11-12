import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Experience } from '../interface/experience';
import experiences from "../../../public/assets/experiences.json";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  providers: [Title, Meta],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  fullName: string = 'Joseph Alcantara';
  description: string = 'Software Engineer with 9 years of expertise in web applications, cloud ERP solutions, and various programming languages.';
  experienceData: Experience[] = experiences.experiences;


  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Joseph Alcantara - Software Engineer');

    this.meta.addTags([
      { name: 'description', content: this.description },
      { name: 'keywords', content: 'Software Engineer, Web Development, C#.NET, Python, PHP, TypeScript, JavaScript, Angular' },
      { name: 'author', content: 'Joseph Alcantara' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Joseph Alcantara - Software Engineer' },
      { property: 'og:description', content: this.description },
      { property: 'og:type', content: 'website' }
    ]);

    this.addStructuredData();
  }

  private addStructuredData() {
    const schema = {
      '@context': 'http://schema.org',
      '@type': 'Person',
      'name': 'Joseph Alcantara',
      'jobTitle': 'Software Engineer',
      'description': this.description,
      'sameAs': [
        'https://github.com/kontrasenyas',
        'https://linkedin.com/in/alcantarajosephc'
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

  }
}
