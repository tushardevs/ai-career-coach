import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.resumeTemplate.createMany({
    data: [
      {
        key: "classic",
        name: "Classic AutoCV",
        description: "A LaTeX-style professional resume template.",
        thumbnailUrl: "/templates/classic.png",
        htmlCode: `
<div class="font-serif text-gray-900 text-sm leading-relaxed max-w-3xl mx-auto">
  <header class="text-center mb-6">
    <h1 class="text-2xl font-bold tracking-wide">{{name}}</h1>
    <p class="text-sm">{{email}} | {{phone}} | {{linkedin}}</p>
  </header>

  {{#if summary}}
  <section>
    <h2 class="uppercase font-semibold border-b">Summary</h2>
    <p>{{summary}}</p>
  </section>
  {{/if}}

  {{#if experience.length}}
  <section>
    <h2 class="uppercase font-semibold border-b">Experience</h2>
    {{#each experience}}
      <div class="flex justify-between mb-2">
        <p class="font-semibold">{{title}} - {{organization}}</p>
        <span>{{startDate}} – {{endDate}}</span>
      </div>
      <p>{{description}}</p>
    {{/each}}
  </section>
  {{/if}}

  {{#if education.length}}
  <section>
    <h2 class="uppercase font-semibold border-b">Education</h2>
    {{#each education}}
      <div class="flex justify-between mb-2">
        <p class="font-semibold">{{title}} - {{organization}}</p>
        <span>{{startDate}} – {{endDate}}</span>
      </div>
    {{/each}}
  </section>
  {{/if}}

  {{#if projects.length}}
  <section>
    <h2 class="uppercase font-semibold border-b">Projects</h2>
    {{#each projects}}
      <div class="mb-2">
        <p class="font-semibold">{{title}}</p>
        <p>{{description}}</p>
      </div>
    {{/each}}
  </section>
  {{/if}}
</div>
        `,
      },
    ],
  });
}

main()
  .then(() => console.log("✅ Templates seeded"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
