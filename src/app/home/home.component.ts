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
  fullName: string = 'Joseph C. Alcantara';
  description: string = 'Senior Software Engineer with 10+ years of experience designing, building, and maintaining enterprise-scale systems, data pipelines, and cloud-based applications across ANZ and SEA markets.';
  experienceData: Experience[] = experiences.experiences;


  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Joseph C. Alcantara - Senior Software Engineer / Senior Full Stack Engineer');

    this.meta.addTags([
      { name: 'description', content: this.description },
      { name: 'keywords', content: 'Senior Software Engineer, Senior Full Stack Engineer, Web Development, C#.NET, Angular, AWS, Azure, Data Pipelines, Enterprise Systems, TypeScript, JavaScript' },
      { name: 'author', content: 'Joseph C. Alcantara' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Joseph C. Alcantara - Senior Software Engineer / Senior Full Stack Engineer' },
      { property: 'og:description', content: this.description },
      { property: 'og:type', content: 'website' }
    ]);

    this.addStructuredData();
  }

  private addStructuredData() {
    const schema = {
      '@context': 'http://schema.org',
      '@type': 'Person',
      'name': 'Joseph C. Alcantara',
      'jobTitle': 'Senior Software Engineer / Senior Full Stack Engineer',
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
