<template>
  <div class="hc-page">
    <NuxtRouteAnnouncer />

    <header class="border-b border-hc-line bg-hc-paper/70">
      <div class="hc-container py-4 sm:py-0">
        <div class="flex min-h-14 items-center justify-between gap-4 sm:min-h-20">
          <NuxtLink
            to="/"
            class="group inline-flex items-center gap-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hc-emerald"
            aria-label="HelpChain home"
          >
            <span class="relative flex size-10 items-center justify-center rounded-full bg-hc-emerald text-white shadow-hc-button sm:size-11">
              <span class="absolute size-5 rounded-full border border-white/50" />
              <span class="size-2 rounded-full bg-hc-amber" />
            </span>
            <span class="text-lg font-semibold text-hc-ink">HelpChain</span>
          </NuxtLink>

          <nav class="hidden items-center gap-10 md:flex" aria-label="Main navigation">
            <NuxtLink to="/#find-help" class="hc-nav-link">Find Help</NuxtLink>
            <NuxtLink to="/#people-need-help" class="hc-nav-link">Help Someone</NuxtLink>
          </nav>

          <NuxtLink to="/ask" class="hc-button hc-button-primary min-h-10 px-4 text-xs shadow-none sm:min-h-11 sm:px-5 sm:text-sm">
            Ask for Help
          </NuxtLink>
        </div>

        <nav class="mt-4 grid grid-cols-2 gap-2 border-t border-hc-line pt-3 md:hidden" aria-label="Mobile navigation">
          <NuxtLink to="/#find-help" class="hc-nav-link rounded-full border border-hc-line bg-hc-paper-soft px-3 py-2 text-center">Find Help</NuxtLink>
          <NuxtLink to="/#people-need-help" class="hc-nav-link rounded-full border border-hc-line bg-hc-paper-soft px-3 py-2 text-center">Help Someone</NuxtLink>
        </nav>
      </div>
    </header>

    <NuxtPage />
  </div>
</template>
