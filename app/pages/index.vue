<script setup lang="ts">
import {
  featuredSearchQuery,
  openRequests,
  searchResultGuide,
  sponsorMoments,
} from '~/data/helpchain';
</script>

<template>
  <main>
    <section class="hc-container pb-16 pt-10 lg:pb-24 lg:pt-14">
      <div class="grid min-h-[calc(100vh-9rem)] items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <div class="relative z-10 max-w-3xl">
          <StatusBadge tone="emerald" dot>AI makes human generosity reusable</StatusBadge>

          <h1 class="hc-text-balance mt-7 max-w-3xl text-5xl font-semibold leading-[0.95] text-hc-ink sm:text-6xl lg:text-7xl">
            Someone already helped. Find the human answer.
          </h1>

          <p class="mt-7 max-w-2xl text-lg leading-8 text-hc-muted sm:text-xl">
            HelpChain looks for a real person who solved something similar, then uses AI to make that human help easier to watch, follow, read, and listen to.
          </p>

          <div class="mt-10">
            <HeroSearch :initial-query="featuredSearchQuery" :result="searchResultGuide" initial-state="found" />
          </div>
        </div>

        <div class="relative z-10 mx-auto w-full max-w-[35rem] lg:mx-0 lg:justify-self-end" aria-label="One human answer branching into reusable help">
          <div class="relative overflow-hidden rounded-[8px] border border-hc-line bg-hc-paper shadow-hc-card">
            <div class="border-b border-hc-line bg-hc-emerald px-5 py-4 text-white sm:px-6">
              <p class="text-sm font-semibold uppercase leading-5 text-white/70">Human source stays visible</p>
              <p class="mt-1 text-2xl font-semibold leading-tight">John records one 27-second answer.</p>
            </div>

            <div class="relative aspect-[0.92] bg-hc-paper-soft sm:aspect-square">
              <svg class="absolute inset-0 h-full w-full" viewBox="0 0 620 620" role="img" aria-label="John's answer reaching Anna, Carlos, Mei, Sara, and Kim">
                <path class="hc-line-draw" d="M300 330 C250 300 215 265 146 226" fill="none" stroke="#c5cebf" stroke-width="2.4" stroke-linecap="round" />
                <path class="hc-line-draw hc-delay-1" d="M300 330 C346 264 408 222 506 174" fill="none" stroke="#c5cebf" stroke-width="2.4" stroke-linecap="round" />
                <path class="hc-line-draw hc-delay-2" d="M300 330 C244 372 209 424 152 506" fill="none" stroke="#c5cebf" stroke-width="2.4" stroke-linecap="round" />
                <path class="hc-line-draw hc-delay-3" d="M300 330 C365 365 430 430 516 482" fill="none" stroke="#c5cebf" stroke-width="2.4" stroke-linecap="round" />
                <path class="hc-line-draw hc-delay-4" d="M300 330 C303 257 324 187 371 102" fill="none" stroke="#c8892f" stroke-opacity="0.72" stroke-width="3" stroke-linecap="round" />
              </svg>

              <div class="absolute left-1/2 top-1/2 z-10 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hc-emerald/20 bg-hc-emerald p-4 text-center text-white shadow-hc-button sm:w-48 sm:p-5">
                <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-white/10 text-3xl font-semibold">J</div>
                <p class="mt-3 text-sm font-semibold leading-5">John donated a fix</p>
                <p class="mt-1 text-xs leading-4 text-white/70">original human answer</p>
              </div>

              <div class="absolute left-[18%] top-[36%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div class="hc-node">A</div>
                <p class="mt-2 text-xs font-semibold text-hc-muted">Anna</p>
              </div>
              <div class="absolute left-[82%] top-[27%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div class="hc-node">C</div>
                <p class="mt-2 text-xs font-semibold text-hc-muted">Carlos</p>
              </div>
              <div class="absolute left-[22%] top-[76%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div class="hc-node">M</div>
                <p class="mt-2 text-xs font-semibold text-hc-muted">Mei</p>
              </div>
              <div class="absolute left-[82%] top-[72%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div class="hc-node">S</div>
                <p class="mt-2 text-xs font-semibold text-hc-muted">Sara</p>
              </div>
              <div class="absolute left-[60%] top-[15%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div class="hc-node">K</div>
                <p class="mt-2 text-xs font-semibold text-hc-muted">Kim</p>
              </div>

              <div class="absolute bottom-5 left-5 right-5 z-10 rounded-[8px] border border-hc-line bg-hc-paper/95 p-4 shadow-hc-soft">
                <div class="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p class="text-3xl font-semibold leading-none text-hc-emerald">1</p>
                    <p class="mt-1 text-[0.68rem] font-semibold uppercase leading-4 text-hc-muted">answer</p>
                  </div>
                  <div>
                    <p class="text-3xl font-semibold leading-none text-hc-emerald">18</p>
                    <p class="mt-1 text-[0.68rem] font-semibold uppercase leading-4 text-hc-muted">helped</p>
                  </div>
                  <div>
                    <p class="text-3xl font-semibold leading-none text-hc-emerald">3</p>
                    <p class="mt-1 text-[0.68rem] font-semibold uppercase leading-4 text-hc-muted">languages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-hc-line bg-hc-paper/60 py-14 sm:py-20">
      <div class="hc-container">
        <div class="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div class="max-w-md">
            <StatusBadge tone="emerald">Reusable help path</StatusBadge>
            <h2 class="hc-text-balance mt-5 text-3xl font-semibold leading-tight text-hc-ink sm:text-4xl">
              The helper is the source. AI carries the shape.
            </h2>
            <p class="mt-5 text-base leading-8 text-hc-muted sm:text-lg">
              A short human demonstration can become searchable steps, accessible narration, and a guide that keeps credit attached to the person who helped first.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <article
              v-for="moment in sponsorMoments"
              :key="moment.provider"
              class="rounded-[8px] border border-hc-line bg-hc-paper p-5 shadow-hc-soft"
            >
              <p class="text-sm font-semibold leading-6 text-hc-ink">{{ moment.label }}</p>
              <p class="mt-1 text-xs font-semibold uppercase leading-4 text-hc-muted">{{ moment.provider }}</p>
              <p class="mt-4 text-sm leading-6 text-hc-muted">{{ moment.text }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="people-need-help" class="hc-section">
      <div class="hc-container">
        <div class="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div class="max-w-md">
            <StatusBadge tone="coral" dot>Open requests</StatusBadge>
            <h2 class="hc-text-balance mt-5 text-3xl font-semibold leading-tight text-hc-ink sm:text-4xl">
              People who could use your help
            </h2>
            <p class="mt-5 text-base leading-8 text-hc-muted sm:text-lg">
              Small questions become reusable guidance when someone records the first clear human answer.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <HelpRequestCard v-for="request in openRequests" :key="request.id" :request="request" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
