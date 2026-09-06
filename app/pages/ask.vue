<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { openRequest, type HelpRequest } from '~/data/helpchain';

const categories = ['Crafts', 'Plants', 'Repairs', 'Cooking', 'Technology', 'Other'] as const;
const selectedCategory = ref<(typeof categories)[number]>('Crafts');
const isSubmitting = ref(false);
const submitError = ref('');
const form = reactive({
  title: '',
  description: '',
  askedBy: '',
});

const canSubmit = computed(() => (
  Boolean(form.title.trim()) &&
  Boolean(form.description.trim()) &&
  !isSubmitting.value
));

const submitHelpRequest = async () => {
  if (!canSubmit.value) {
    return;
  }

  isSubmitting.value = true;
  submitError.value = '';

  try {
    const request = await $fetch<HelpRequest>('/api/help/requests', {
      method: 'POST',
      body: {
        title: form.title.trim(),
        description: form.description.trim(),
        category: selectedCategory.value,
        askedBy: form.askedBy.trim() || undefined,
      },
    });

    await navigateTo(`/request/${request.id}`);
  } catch (error) {
    console.error('Help request creation failed', error);
    submitError.value = 'We could not create this request right now. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <main>
    <section class="hc-container py-12 sm:py-16 lg:py-20">
      <div class="grid gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
        <aside class="max-w-xl">
          <StatusBadge tone="emerald" dot>Ask someone who knows</StatusBadge>

          <h1 class="hc-text-balance mt-6 text-5xl font-semibold leading-[0.96] text-hc-ink sm:text-6xl lg:text-7xl">
            What do you need help with?
          </h1>

          <p class="mt-6 max-w-lg text-lg leading-8 text-hc-muted sm:text-xl">
            Ask a real person. If they solve it, their answer can become reusable guidance for the next person too.
          </p>

          <div class="mt-10 rounded-[4px] border border-hc-line bg-hc-paper p-5 shadow-hc-soft">
            <div class="flex items-center gap-4">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-hc-emerald text-sm font-semibold text-white">1</div>
              <div>
                <p class="text-lg font-semibold leading-6 text-hc-ink">You ask clearly</p>
                <p class="mt-1 text-sm leading-6 text-hc-muted">A title, a category, and a little context.</p>
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
                <p class="mt-1 text-sm leading-6 text-hc-muted">HelpChain turns the answer into formats others can follow.</p>
              </div>
            </div>
          </div>

          <div class="mt-5">
            <OpenRequestCard :request="openRequest" />
          </div>
        </aside>

        <form class="hc-card p-5 sm:p-7 lg:p-8" aria-label="Ask for help" @submit.prevent="submitHelpRequest">
          <div class="grid gap-6">
            <div>
              <label class="text-sm font-semibold leading-6 text-hc-ink" for="problem-title">
                Problem title
              </label>
              <input
                id="problem-title"
                v-model="form.title"
                class="hc-input mt-2"
                type="text"
                maxlength="150"
                placeholder="How do I stop this knot from slipping?"
                :disabled="isSubmitting"
              />
            </div>

            <div>
              <label class="text-sm font-semibold leading-6 text-hc-ink" for="problem-description">
                Description
              </label>
              <textarea
                id="problem-description"
                v-model="form.description"
                class="mt-2 min-h-40 w-full resize-y rounded-[4px] border border-hc-line bg-hc-paper px-5 py-4 text-base leading-7 text-hc-ink shadow-sm outline-none transition placeholder:text-hc-soft focus:border-hc-emerald focus:ring-4 focus:ring-hc-emerald-soft"
                maxlength="2000"
                placeholder="Tell us what you tried and where you're stuck..."
                :disabled="isSubmitting"
              ></textarea>
            </div>

            <div>
              <label class="text-sm font-semibold leading-6 text-hc-ink" for="asked-by">
                Your name
              </label>
              <input
                id="asked-by"
                v-model="form.askedBy"
                class="hc-input mt-2"
                type="text"
                maxlength="80"
                placeholder="Anna"
                autocomplete="name"
                :disabled="isSubmitting"
              />
            </div>

            <fieldset>
              <legend class="text-sm font-semibold leading-6 text-hc-ink">Category</legend>
              <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <label v-for="category in categories" :key="category" class="cursor-pointer">
                  <input v-model="selectedCategory" class="peer sr-only" type="radio" name="category" :value="category" :disabled="isSubmitting" />
                  <span class="flex min-h-11 items-center justify-center rounded-[4px] border border-hc-line bg-hc-paper-soft px-3 text-sm font-semibold text-hc-muted transition peer-checked:border-hc-emerald peer-checked:bg-hc-emerald-wash peer-checked:text-hc-emerald peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-hc-emerald">
                    {{ category }}
                  </span>
                </label>
              </div>
            </fieldset>

            <div class="border-t border-hc-line pt-6">
              <AppButton size="lg" type="submit" class="w-full sm:w-auto" :disabled="!canSubmit" :aria-busy="isSubmitting">
                {{ isSubmitting ? 'Creating request...' : 'Ask for help' }}
              </AppButton>
              <p v-if="submitError" class="mt-4 max-w-xl text-sm font-semibold leading-6 text-hc-coral" role="alert">
                {{ submitError }}
              </p>
              <p class="mt-4 max-w-xl text-sm leading-6 text-hc-muted">
                When someone answers, their demonstration can become reusable help after it solves the first problem.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>
