import { gsap } from 'gsap';
import { For, createSignal, onMount, createEffect } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import { CATEGORIES, PROJECTS } from '../constants/projects';
import { SKILLS } from '../constants/skills';
import { Project } from '../types/interfaces';

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSkillParam = searchParams.skill;
  const initialCategoryParam = searchParams.category;

  let initialSkill: string | null = null;
  if (Array.isArray(initialSkillParam)) {
    initialSkill = initialSkillParam[0] || null;
  } else {
    initialSkill = initialSkillParam || null;
  }

  let initialCategory: string | null = null;
  if (!initialSkill) {
      if (Array.isArray(initialCategoryParam)) {
        initialCategory = initialCategoryParam[0] || null;
      } else {
        initialCategory = initialCategoryParam || null;
      }
  }
  
  const [selectedCategory, setSelectedCategory] = createSignal<string | null>(initialCategory);
  const [selectedSkill, setSelectedSkill] = createSignal<string | null>(initialSkill);
  const [hoveredProject, setHoveredProject] = createSignal<string | null>(null);

  let containerRef: HTMLDivElement | undefined;

  const filteredProjects = () => {
    const skill = selectedSkill();
    const category = selectedCategory();

    if (skill) {
      return PROJECTS.filter((project) => project.technologies.includes(skill));
    }
    if (category && category !== 'All') {
       if (CATEGORIES.includes(category) && category !== 'All') {
           return PROJECTS.filter((project) => project.category === category);
       } 
    }
    return PROJECTS;
  };

  onMount(() => {
    if (!containerRef) return;
    if (!initialCategory && !initialSkill) {
      gsap.fromTo(
        '.project-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        },
      );
    }
  });

  const animateFilteredProjects = () => {
     if (!containerRef) return;
    gsap.fromTo(
      '.project-card',
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out',
      },
    );
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = category === 'All' ? null : category;
    setSelectedCategory(newCategory);
    setSelectedSkill(null);
    setSearchParams({ category: newCategory || undefined, skill: undefined });
    setTimeout(animateFilteredProjects, 50);
  };

  const handleSkillChange = (skill: string | null) => {
    setSelectedSkill(skill);
    setSelectedCategory(null);
    setSearchParams({ skill: skill || undefined, category: undefined });
    const dropdownElement = document.getElementById('skill-dropdown');
    if (dropdownElement instanceof HTMLElement && dropdownElement.hasAttribute('open')) {
         dropdownElement.removeAttribute('open'); 
    }
     setTimeout(() => {
        animateFilteredProjects(); 
        (document.activeElement as HTMLElement)?.blur();
     }, 50);
  };

  createEffect(() => {
    const skillParamValue = searchParams.skill;
    const categoryParamValue = searchParams.category;
    
    let skillFromUrl: string | null = null;
    if (Array.isArray(skillParamValue)) {
      skillFromUrl = skillParamValue[0] || null;
    } else {
      skillFromUrl = skillParamValue || null;
    }

    let categoryFromUrl: string | null = null;
    if (!skillFromUrl) {
        if (Array.isArray(categoryParamValue)) {
          categoryFromUrl = categoryParamValue[0] || null;
        } else {
          categoryFromUrl = categoryParamValue || null;
        }
    }

    let needsUpdate = false;
    if (skillFromUrl !== selectedSkill()) {
        setSelectedSkill(skillFromUrl);
        if(selectedCategory() !== null) setSelectedCategory(null);
        needsUpdate = true;
    }
    if (!skillFromUrl && categoryFromUrl !== selectedCategory()) {
        setSelectedCategory(categoryFromUrl);
        if(selectedSkill() !== null) setSelectedSkill(null);
        needsUpdate = true;
    }

    // Optional: Trigger animation if state changed due to URL update
    // if (needsUpdate) { setTimeout(animateFilteredProjects, 50); }
  });

  return (
    <div ref={containerRef} class="pt-24 pb-16">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-8 text-center text-gradient">
          My Projects
        </h1>
        <p class="text-lg text-center max-w-3xl mx-auto mb-12">
          Here are some of the projects I've worked on. Select a category or skill to filter.
        </p>

        <div class="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 mb-12">
          <div class="flex flex-wrap justify-center gap-3">
             <For each={CATEGORIES}>
               {(category) => (
                 <button
                   type="button"
                   class="btn btn-sm rounded-full"
                   classList={{
                     'btn-primary': selectedCategory() === category || (category === 'All' && !selectedCategory() && !selectedSkill()),
                     'btn-ghost': !(selectedCategory() === category || (category === 'All' && !selectedCategory() && !selectedSkill())),
                   }}
                   onClick={() => handleCategoryChange(category)}
                 >
                   {category}
                 </button>
               )}
             </For>
          </div>

          <div class="dropdown dropdown-end" id="skill-dropdown">
            <button 
                type="button"
                tabindex="0" 
                class="btn btn-sm rounded-full m-1" 
                classList={{
                    'btn-primary': !!selectedSkill(), 
                    'btn-outline': !selectedSkill()
                }}
                aria-haspopup="true" 
                aria-expanded={false} 
            >
              {selectedSkill() || "Filter by Skill"} 
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                 <title>Open skill filter menu</title> 
                 <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 max-h-60  overflow-y-auto flex-nowrap">
               <li>
                <button 
                    type="button" 
                    onClick={() => handleSkillChange(null)} 
                    class="text-left w-full truncate"
                    classList={{'text-primary font-bold': !selectedSkill()}}
                 >
                     Clear Skill Filter
                 </button>
              </li>
              <For each={SKILLS}>
                {(skill) => (
                  <li>
                    <button 
                        type="button" 
                        onClick={() => handleSkillChange(skill.name)} 
                        class="text-left w-full truncate"
                        classList={{'text-primary font-bold': selectedSkill() === skill.name}}
                     >
                       {skill.name}
                     </button>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <For each={filteredProjects()}>
            {(project) => (
              <div
                class="project-card bg-base-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 h-full flex flex-col"
                classList={{
                  'transform -translate-y-2 shadow-xl':
                    hoveredProject() === project.id,
                  'border-l-4 border-primary': project.featured,
                }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                 <div class="p-6 flex flex-col flex-grow">
                  <div class="flex justify-between items-start mb-3">
                    <h2 class="text-xl font-bold">{project.title}</h2>
                    {project.featured && (
                      <span class="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>

                  <p class="mb-4 text-neutral/80 flex-grow">{project.description}</p>

                  <div class="flex flex-wrap gap-2 mb-6">
                    <For each={project.technologies}>
                      {(tech) => (
                        <span class="px-2 py-1 bg-base-200 rounded-md text-xs">
                          {tech}
                        </span>
                      )}
                    </For>
                  </div>

                  <div class="flex items-center justify-between mt-auto pt-4 border-t border-base-300/50">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary hover:text-primary/80 transition-colors flex items-center text-sm"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        role="img"
                        aria-hidden="true" 
                        class="w-5 h-5 mr-2"
                      >
                        <path
                          fill="currentColor"
                          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                        />
                      </svg>
                      GitHub
                    </a>

                    {project.stars != null && (
                      <div class="flex items-center text-sm text-neutral/70">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          class="w-4 h-4 text-warning mr-1"
                          role="img"
                          aria-label="GitHub Stars"
                        >
                           <path
                            fill="currentColor"
                            d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
                          />
                        </svg>
                        {project.stars}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
