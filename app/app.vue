<template>
  <div class="hc-page">
    <NuxtRouteAnnouncer />

    <header class="hc-container flex items-center justify-between py-6 sm:py-8">
      <a
        href="#"
        class="group inline-flex items-center gap-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hc-emerald"
        aria-label="HelpChain home"
      >
        <span class="relative flex size-11 items-center justify-center rounded-full bg-hc-emerald text-white shadow-hc-button">
          <span class="absolute size-5 rounded-full border border-white/50" />
          <span class="size-2 rounded-full bg-hc-amber" />
        </span>
        <span class="text-lg font-semibold tracking-[-0.01em] text-hc-ink">HelpChain</span>
      </a>

      <nav class="hidden items-center gap-8 text-sm font-medium text-hc-muted md:flex" aria-label="Main navigation">
        <a href="#find-help" class="transition hover:text-hc-emerald">Find help</a>
        <a href="#human-source" class="transition hover:text-hc-emerald">Human source</a>
        <a href="#reuse" class="transition hover:text-hc-emerald">Reuse</a>
      </nav>

      <a href="#ask" class="hc-button hc-button-secondary hidden sm:inline-flex">
        Ask for help
      </a>
    </header>

    <main>
      <section class="hc-container grid min-h-[calc(100vh-6rem)] items-center gap-12 pb-14 pt-6 lg:grid-cols-[1.02fr_0.98fr] lg:pb-20">
        <div class="max-w-3xl">
          <span class="hc-badge">
            <span class="size-2 rounded-full bg-hc-coral" />
            AI makes human generosity reusable
          </span>

          <h1 class="hc-text-balance mt-7 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-hc-ink sm:text-6xl lg:text-7xl">
            One person helps once. Their help keeps helping.
          </h1>

          <p class="mt-7 max-w-2xl text-lg leading-8 text-hc-muted sm:text-xl">
            HelpChain starts with a real human demonstration, then turns that act into guidance people can discover, watch, follow, read, and hear.
          </p>

          <div id="find-help" class="mt-10 max-w-2xl rounded-full border border-hc-line bg-hc-paper p-2 shadow-hc-card">
            <form class="flex flex-col gap-2 sm:flex-row" aria-label="Search for existing help">
              <label class="sr-only" for="help-search">What do you need help with?</label>
              <input
                id="help-search"
                class="hc-input border-transparent bg-transparent shadow-none focus:border-hc-emerald"
                type="search"
                value="Fix a dripping kitchen tap"
              />
              <button class="hc-button hc-button-primary shrink-0" type="button">
                Find human help
              </button>
            </form>
          </div>

          <div class="mt-8 grid max-w-2xl gap-3 text-sm text-hc-muted sm:grid-cols-3">
            <div class="hc-card-soft p-4">
              <div class="text-2xl font-semibold text-hc-emerald">27s</div>
              <div class="mt-1">recorded by John</div>
            </div>
            <div class="hc-card-soft p-4">
              <div class="text-2xl font-semibold text-hc-emerald">5</div>
              <div class="mt-1">people helped later</div>
            </div>
            <div class="hc-card-soft p-4">
              <div class="text-2xl font-semibold text-hc-emerald">4</div>
              <div class="mt-1">ways to reuse it</div>
            </div>
          </div>
        </div>

        <div class="relative mx-auto w-full max-w-[22rem] sm:max-w-xl lg:max-w-2xl" aria-label="One act of help spreading to more people">
          <div class="absolute inset-8 rounded-full bg-hc-emerald/5 blur-3xl" />
          <div class="relative aspect-square overflow-hidden rounded-[8px] border border-hc-line bg-hc-paper shadow-hc-card">
            <div class="hc-ripple inset-[18%]" />
            <div class="hc-ripple inset-[10%] [animation-delay:1.1s]" />
            <div class="hc-ripple inset-[2%] [animation-delay:2.2s]" />

            <svg class="absolute inset-0 h-full w-full" viewBox="0 0 620 620" role="img" aria-label="Connected paths from one helper to many recipients">
              <path d="M310 310 C250 250 195 226 128 213" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
              <path d="M310 310 C385 248 432 210 505 168" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
              <path d="M310 310 C225 345 178 395 119 479" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
              <path d="M310 310 C391 337 445 398 500 476" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
              <path d="M310 310 C315 222 319 173 350 96" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
              <path d="M310 310 C296 393 305 462 334 544" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
            </svg>

            <div class="absolute left-1/2 top-1/2 z-10 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hc-emerald/20 bg-hc-emerald p-3 text-center text-white shadow-hc-button sm:w-40 sm:p-4">
              <div class="mx-auto flex size-10 items-center justify-center rounded-full bg-white/12 text-xl font-semibold sm:size-14 sm:text-2xl">J</div>
              <p class="mt-2 text-xs font-semibold leading-4 sm:mt-3 sm:text-sm">John helped once</p>
              <p class="mt-1 text-[0.68rem] leading-3 text-white/72 sm:text-xs">27-second demo</p>
            </div>

            <div class="absolute left-[21%] top-[34%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div class="hc-node">A</div>
              <p class="mt-1 text-center text-[0.68rem] font-medium leading-3 text-hc-muted sm:mt-2 sm:text-xs">Anna</p>
            </div>
            <div class="absolute left-[81%] top-[27%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div class="hc-node">C</div>
              <p class="mt-1 text-center text-[0.68rem] font-medium leading-3 text-hc-muted sm:mt-2 sm:text-xs">Carlos</p>
            </div>
            <div class="absolute left-[19%] top-[77%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div class="hc-node">M</div>
              <p class="mt-1 text-center text-[0.68rem] font-medium leading-3 text-hc-muted sm:mt-2 sm:text-xs">Mei</p>
            </div>
            <div class="absolute left-[81%] top-[77%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div class="hc-node">S</div>
              <p class="mt-1 text-center text-[0.68rem] font-medium leading-3 text-hc-muted sm:mt-2 sm:text-xs">Sara</p>
            </div>
            <div class="absolute left-[57%] top-[16%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div class="hc-node">K</div>
              <p class="mt-1 text-center text-[0.68rem] font-medium leading-3 text-hc-muted sm:mt-2 sm:text-xs">Kim</p>
            </div>
            <div class="absolute bottom-[5%] left-1/2 z-10 -translate-x-1/2">
              <div class="whitespace-nowrap rounded-full border border-hc-amber/30 bg-hc-amber-soft px-3 py-2 text-[0.68rem] font-semibold leading-3 text-hc-ink shadow-hc-soft sm:px-4 sm:text-xs">
                This helped me
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="human-source" class="border-y border-hc-line bg-hc-paper/52 py-12">
        <div class="hc-container grid gap-5 md:grid-cols-3">
          <article class="hc-card p-6">
            <div class="hc-badge border-hc-emerald/20 bg-hc-emerald-wash text-hc-emerald">Human source</div>
            <h2 class="mt-5 text-2xl font-semibold tracking-[-0.02em] text-hc-ink">A real person demonstrates the solution.</h2>
            <p class="mt-4 leading-7 text-hc-muted">The original helper stays visible as the source of the knowledge.</p>
          </article>

          <article class="hc-card p-6">
            <div class="hc-badge border-hc-coral/20 bg-hc-coral-soft text-hc-coral">AI amplification</div>
            <h2 class="mt-5 text-2xl font-semibold tracking-[-0.02em] text-hc-ink">AI reshapes the demo into reusable guidance.</h2>
            <p class="mt-4 leading-7 text-hc-muted">The contribution becomes steps, captions, summaries, audio, and search context.</p>
          </article>

          <article id="reuse" class="hc-card p-6">
            <div class="hc-badge border-hc-amber/20 bg-hc-amber-soft text-hc-ink">Growing chain</div>
            <h2 class="mt-5 text-2xl font-semibold tracking-[-0.02em] text-hc-ink">Each “this helped me” extends the path.</h2>
            <p class="mt-4 leading-7 text-hc-muted">One generous answer keeps spreading beyond the first person who asked.</p>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>
