<template>
  <div class="hc-page">
    <NuxtRouteAnnouncer />

    <header class="border-b border-hc-line bg-hc-paper/70">
      <div class="hc-container py-4 sm:py-0">
        <div class="flex min-h-14 items-center justify-between gap-4 sm:min-h-20">
          <a
            href="#"
            class="group inline-flex items-center gap-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hc-emerald"
            aria-label="HelpChain home"
          >
            <span class="relative flex size-10 items-center justify-center rounded-full bg-hc-emerald text-white shadow-hc-button sm:size-11">
              <span class="absolute size-5 rounded-full border border-white/50" />
              <span class="size-2 rounded-full bg-hc-amber" />
            </span>
            <span class="text-lg font-semibold text-hc-ink">HelpChain</span>
          </a>

          <nav class="hidden items-center gap-10 md:flex" aria-label="Main navigation">
            <a href="#find-help" class="hc-nav-link">Find Help</a>
            <a href="#help-someone" class="hc-nav-link">Help Someone</a>
          </nav>

          <a href="#ask" class="hc-button hc-button-primary min-h-10 px-4 text-xs shadow-none sm:min-h-11 sm:px-5 sm:text-sm">
            Ask for Help
          </a>
        </div>

        <nav class="mt-4 grid grid-cols-2 gap-2 border-t border-hc-line pt-3 md:hidden" aria-label="Mobile navigation">
          <a href="#find-help" class="hc-nav-link rounded-full border border-hc-line bg-hc-paper-soft px-3 py-2 text-center">Find Help</a>
          <a href="#help-someone" class="hc-nav-link rounded-full border border-hc-line bg-hc-paper-soft px-3 py-2 text-center">Help Someone</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hc-container grid min-h-[calc(100vh-6rem)] items-center gap-12 pb-14 pt-6 lg:grid-cols-[1.02fr_0.98fr] lg:pb-20">
        <div class="max-w-3xl">
          <span class="hc-badge">
            <span class="size-2 rounded-full bg-hc-coral" />
            AI makes human generosity reusable
          </span>

          <h1 class="hc-text-balance mt-7 max-w-3xl text-5xl font-semibold leading-[0.95] text-hc-ink sm:text-6xl lg:text-7xl">
            One person helps once. Their help keeps helping.
          </h1>

          <p class="mt-7 max-w-xl text-lg leading-8 text-hc-muted sm:text-xl">
            HelpChain starts with a real human demonstration, then turns that act into guidance people can discover, watch, follow, read, and hear.
          </p>

          <div id="ask" class="mt-10 max-w-xl rounded-full border border-hc-line bg-hc-paper p-2 shadow-hc-card">
            <form id="find-help" class="flex flex-col gap-2 sm:flex-row" aria-label="Search for existing help">
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

          <div class="mt-12 grid max-w-3xl gap-7 border-y border-hc-line py-8 text-hc-muted sm:grid-cols-[1.08fr_0.9fr_0.9fr] sm:gap-0">
            <div class="sm:pr-7">
              <p class="text-6xl font-semibold leading-none text-hc-emerald sm:text-7xl lg:text-8xl">27s</p>
              <p class="mt-3 text-lg font-semibold leading-6 text-hc-ink">one recorded answer</p>
              <p class="mt-2 max-w-xs text-base leading-7">John helps Anna with a quick demonstration.</p>
            </div>
            <div class="border-t border-hc-line pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
              <p class="text-6xl font-semibold leading-none text-hc-emerald sm:text-7xl lg:text-8xl">5</p>
              <p class="mt-3 text-lg font-semibold leading-6 text-hc-ink">people helped later</p>
              <p class="mt-2 max-w-xs text-base leading-7">The same human answer keeps moving outward.</p>
            </div>
            <div class="border-t border-hc-line pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
              <p class="text-6xl font-semibold leading-none text-hc-emerald sm:text-7xl lg:text-8xl">4</p>
              <p class="mt-3 text-lg font-semibold leading-6 text-hc-ink">ways to reuse it</p>
              <p class="mt-2 max-w-xs text-base leading-7">Watch, follow, read, or listen to the source.</p>
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

      <section id="help-someone" class="border-y border-hc-line bg-hc-paper/52 py-16 sm:py-20">
        <div class="hc-container grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div class="max-w-md">
            <div class="hc-badge border-hc-emerald/20 bg-hc-emerald-wash text-hc-emerald">Reusable help path</div>
            <h2 class="hc-text-balance mt-5 text-3xl font-semibold leading-tight text-hc-ink sm:text-4xl">
              From one answer to many forms of guidance.
            </h2>
            <p class="mt-5 text-base leading-8 text-hc-muted sm:text-lg">
              The layout keeps the source human visible while the product shows what AI adds around that contribution.
            </p>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <article class="hc-card p-6 sm:p-7 md:col-span-2 lg:mr-12">
              <div class="hc-badge border-hc-emerald/20 bg-hc-emerald-wash text-hc-emerald">Human source</div>
              <h3 class="mt-5 max-w-xl text-lg font-semibold leading-7 text-hc-ink sm:text-xl">A real person demonstrates the solution.</h3>
              <p class="mt-4 max-w-2xl text-base leading-7 text-hc-muted sm:text-lg">The original helper stays visible as the source of the knowledge.</p>
            </article>

            <article class="hc-card p-6 sm:p-7">
              <div class="hc-badge border-hc-coral/20 bg-hc-coral-soft text-hc-coral">AI amplification</div>
              <h3 class="mt-5 text-lg font-semibold leading-7 text-hc-ink sm:text-xl">AI reshapes the demo into reusable guidance.</h3>
              <p class="mt-4 text-base leading-7 text-hc-muted sm:text-lg">The contribution becomes steps, captions, summaries, audio, and search context.</p>
            </article>

            <article id="reuse" class="hc-card p-6 sm:p-7 md:mt-10">
              <div class="hc-badge border-hc-amber/20 bg-hc-amber-soft text-hc-ink">Growing chain</div>
              <h3 class="mt-5 text-lg font-semibold leading-7 text-hc-ink sm:text-xl">Each “this helped me” extends the path.</h3>
              <p class="mt-4 text-base leading-7 text-hc-muted sm:text-lg">One generous answer keeps spreading beyond the first person who asked.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
