<script setup lang="ts">
import { ref } from 'vue';
import { openRequest } from '~/data/helpchain';

const categories = ['Crafts', 'Plants', 'Repairs', 'Cooking', 'Technology', 'Other'] as const;
const selectedCategory = ref<(typeof categories)[number]>('Crafts');
</script>

<template>
  <main>
    <section class="hc-container py-12 sm:py-16 lg:py-20">
      <div class="grid gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
        <aside class="max-w-xl">
          <StatusBadge tone="emerald" dot>Ask a human</StatusBadge>

          <h1 class="hc-text-balance mt-6 text-5xl font-semibold leading-[0.96] text-hc-ink sm:text-6xl lg:text-7xl">
            What do you need help with?
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-hc-muted sm:text-xl">
            Ask a real person. If they solve it, their answer can become reusable guidance for the next person too.
          </p>

          <div class="mt-10 rounded-[8px] border border-hc-line bg-hc-paper p-5 shadow-hc-soft">
            <div class="flex items-center gap-4">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-hc-emerald text-sm font-semibold text-white">1</div>
              <div>
                <p class="text-lg font-semibold leading-6 text-hc-ink">You ask clearly</p>
                <p class="mt-1 text-sm leading-6 text-hc-muted">A title, a little context, and a photo if it helps.</p>
              </div>
            </div>

            <div class="ml-6 h-8 w-px bg-hc-line" />

            <div class="flex items-center gap-4">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-hc-emerald-wash text-sm font-semibold text-hc-emerald">2</div>
              <div>
                <p class="text-lg font-semibold leading-6 text-hc-ink">Someone shows the fix</p>
                <p class="mt-1 text-sm leading-6 text-hc-muted">A short demonstration can be enough.</p>
              </div>
            </div>

            <div class="ml-6 h-8 w-px bg-hc-line" />

            <div class="flex items-center gap-4">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-hc-amber-soft text-sm font-semibold text-hc-ink">3</div>
              <div>
                <p class="text-lg font-semibold leading-6 text-hc-ink">Their help keeps going</p>
                <p class="mt-1 text-sm leading-6 text-hc-muted">AI organizes the human answer into reusable formats.</p>
              </div>
            </div>
          </div>

          <div class="mt-5">
            <OpenRequestCard :request="openRequest" />
          </div>
        </aside>

        <form class="hc-card p-5 sm:p-7 lg:p-8" aria-label="Ask for help" @submit.prevent>
          <div class="grid gap-6">
            <div>
              <label class="text-sm font-semibold leading-6 text-hc-ink" for="problem-title">
                Problem title
              </label>
              <input
                id="problem-title"
                class="hc-input mt-2"
                type="text"
                placeholder="How do I stop this knot from slipping?"
              />
            </div>

            <div>
              <label class="text-sm font-semibold leading-6 text-hc-ink" for="problem-description">
                Description
              </label>
              <textarea
                id="problem-description"
                class="mt-2 min-h-40 w-full resize-y rounded-[8px] border border-hc-line bg-hc-paper px-5 py-4 text-base leading-7 text-hc-ink shadow-sm outline-none transition placeholder:text-hc-soft focus:border-hc-emerald focus:ring-4 focus:ring-hc-emerald-soft"
                placeholder="Tell us what you tried and where you're stuck..."
              ></textarea>
            </div>

            <div>
              <span class="text-sm font-semibold leading-6 text-hc-ink">Optional image</span>
              <label
                class="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-hc-line-strong bg-hc-paper-soft px-5 py-8 text-center transition hover:border-hc-emerald hover:bg-hc-emerald-wash/60"
                for="problem-photo"
              >
                <input id="problem-photo" class="sr-only" type="file" accept="image/*" />
                <span class="flex size-14 items-center justify-center rounded-full bg-hc-paper text-hc-emerald shadow-hc-soft">
                  <svg class="size-7" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M8 23h16M16 7v13M10 13l6-6 6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                  </svg>
                </span>
                <span class="mt-4 text-lg font-semibold leading-6 text-hc-ink">Add a photo</span>
                <span class="mt-2 max-w-sm text-sm leading-6 text-hc-muted">A photo can make the problem easier to understand.</span>
              </label>
            </div>

            <fieldset>
              <legend class="text-sm font-semibold leading-6 text-hc-ink">Category</legend>
              <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <label v-for="category in categories" :key="category" class="cursor-pointer">
                  <input v-model="selectedCategory" class="peer sr-only" type="radio" name="category" :value="category" />
                  <span class="flex min-h-11 items-center justify-center rounded-[8px] border border-hc-line bg-hc-paper-soft px-3 text-sm font-semibold text-hc-muted transition peer-checked:border-hc-emerald peer-checked:bg-hc-emerald-wash peer-checked:text-hc-emerald peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-hc-emerald">
                    {{ category }}
                  </span>
                </label>
              </div>
            </fieldset>

            <div class="border-t border-hc-line pt-6">
              <AppButton size="lg" type="submit" class="w-full sm:w-auto">
                Ask for help
              </AppButton>
              <p class="mt-4 max-w-xl text-sm leading-6 text-hc-muted">
                When someone answers, their demonstration can become reusable human help after it solves the first problem.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>
