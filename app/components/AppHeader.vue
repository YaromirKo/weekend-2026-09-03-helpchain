<template>
  <header class="sticky top-0 z-40 border-b border-hc-line/80 bg-hc-paper/90 backdrop-blur-xl">
    <div class="hc-container py-4 sm:py-0">
      <div class="flex min-h-14 items-center justify-between gap-4 sm:min-h-20">
        <NuxtLink
          to="/"
          class="group inline-flex items-center gap-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hc-emerald"
          aria-label="HelpChain home"
        >
          <span class="relative flex size-10 items-center justify-center rounded-full bg-hc-emerald text-white shadow-hc-button sm:size-11">
            <span class="absolute size-7 rounded-full border border-white/35 transition duration-300 group-hover:size-8" />
            <span class="absolute size-3 rounded-full border border-hc-amber/70" />
            <span class="size-1.5 rounded-full bg-hc-amber" />
          </span>
          <span class="text-lg font-semibold tracking-[0.01em] text-hc-ink">HelpChain</span>
        </NuxtLink>

        <nav class="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <NuxtLink to="/#find-help" class="hc-nav-link">Find Help</NuxtLink>
          <NuxtLink to="/#people-need-help" class="hc-nav-link">Help Someone</NuxtLink>
          <NuxtLink to="/guide/1" class="hc-nav-link">Reusable Guide</NuxtLink>
        </nav>

        <AppButton to="/ask" size="sm">Ask for Help</AppButton>
      </div>

      <nav class="mt-4 grid grid-cols-3 gap-2 border-t border-hc-line pt-3 md:hidden" aria-label="Mobile navigation">
        <NuxtLink to="/#find-help" class="hc-nav-link rounded-[4px] border border-hc-line bg-hc-paper-soft px-2 py-2 text-center text-xs">
          Find Help
        </NuxtLink>
        <NuxtLink to="/#people-need-help" class="hc-nav-link rounded-[4px] border border-hc-line bg-hc-paper-soft px-2 py-2 text-center text-xs">
          Help
        </NuxtLink>
        <NuxtLink to="/guide/1" class="hc-nav-link rounded-[4px] border border-hc-line bg-hc-paper-soft px-2 py-2 text-center text-xs">
          Guide
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
