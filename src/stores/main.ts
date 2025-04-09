import { defineStore } from 'pinia';
import { StorageSerializers, useLocalStorage } from '@vueuse/core';
import { useBackendFetch } from '@/fetch';
import type { GoalPlan, LoginData } from '@/types';

export const useStore = defineStore('main', {
  state() {
    return {
      loggedIn: useLocalStorage('logged-in', false),
      userId: useLocalStorage('user-id', 0),
      firstName: useLocalStorage('user-first-name', ''),
      lastName: useLocalStorage('user-last-name', ''),
      company: useLocalStorage('user-company', ''),
      email: useLocalStorage('user-email', ''),
      token: useLocalStorage('user-token', ''),
      sex: useLocalStorage('user-sex', 'U'),
      profile: useLocalStorage('user-profile', null, { serializer: StorageSerializers.object }),
      savePoints: useLocalStorage('save-points', null, { serializer: StorageSerializers.object }),
      profiles: useLocalStorage<{id:number, created_at:string}[]>('user-profiles', []),
      feedbackQuestions: useLocalStorage<{name:string, text:string, options: {text:string, value:string}[]}[]>('feedback-questions', []),
    };
  },
  actions: {
    setUserInfo(email: string) {
      const users: Record<string, string> = {
        'stefan.vonbelow@nobina.se': 'Stefan von Below',
        'robert.borger@nobina.se': 'Robert Borger',
        'sarah.elifari@nobina.se': 'Sarah Elifari',
        'susanna.lejeborg@nonina.se': 'Susanna Lejeborg',
        'eva.palsson@nobina.se': 'Eva Pålsson',
        'carolina.granstrom@nobina.se': 'Carolina Granström',
      };

      if (email.length > 0 && email in users) {
        this.firstName = users[email].split(' ')[0];
        this.lastName = users[email].split(' ')[1];
        this.company = 'Nobina';
        this.email = email;
      } else {
        this.firstName = 'Testare';
        this.company = 'Testföretag AB';
        this.email = 'test@foretag.se';
      }
    },
    login(data: LoginData) {
      this.loggedIn = true;
      this.token = data.token;
      this.userId = data.user.id;
      this.firstName = data.user.first_name;
      this.lastName = data.user.last_name;
      this.email = data.user.email;
      this.company = data.user.company;
      this.profile = data.user.active_profile;
      this.sex = data.user.sex;
      this.profiles = data.user.finished_profiles;
      this.feedbackQuestions = [];
    },
    logout() {
      this.loggedIn = false;
      this.userId = 0;
      this.firstName = '';
      this.lastName = '';
      this.company =  '';
      this.email = '';
      this.token = '';
      this.profile = null;
      this.savePoints = null;
      this.profiles = [];
      this.feedbackQuestions = [];
    },
    hasAnyValues() {
      if (this.profile == null || this.profile?.values == null) {
        return false;
      }

      return Object.values(this.profile?.values).length > 0;
    },
    getProfileValue(name: string) {
      return this.profile?.values?.[name] ?? null;
    },
    getProfileFactor(category: number) {
      return this.profile?.factors?.[category] ?? null;
    },
    async setProfileValue(name: string, value: string) {
      if (this.profile?.id === null) {
        this.logout();
        return null;
      }

      const { data, statusCode } = await useBackendFetch(`/profile/${this.profile.id}/value`)
        .post({ name, value })
        .json();

      if (statusCode.value === 401) {
        this.logout();
        return null;
      }

      for (const { category_id, improve, status, value, label, risk_value } of data.value.profile_factors) {
        if (value === null) {
          continue;
        }

        this.profile.factors[category_id] = { improve, status, value, label, risk_value };
      }

      // this.profile.values[name] = data.value.value;
      if (data.value.risk_status_label != null) {
        this.profile.factors[data.value.category_id] = {
          label: data.value.risk_status_label,
          status: data.value.risk_status_name.replace('profile.', ''),
          value: data.value.value,
          risk_value: data.value.risk_value,
        };
      }

      if (data.value.fitness_text !== undefined) {
        this.profile.fitness_text = data.value.fitness_text
      }

      for (const { name, value } of data.value.profile_values) {
        this.profile.values[name] = value;
      }

      if ('energy_balance_value' in data.value) {
        this.profile.values['foodEnergyIntake'] = data.value.energy_intake_value;
        this.profile.values['foodEnergyBalance'] = data.value.energy_balance_value;
      }

      if (data.value.physical_activity_factor != null) {
        const paf = data.value.physical_activity_factor;
        this.profile.factors[paf.category_id] = {
          improve: paf.improve,
          label: paf.label,
          status: paf.status.replace('profile.', ''),
          value: paf.value,
          risk_value: paf.value,
        }
      }

      return data.value;
    },
    async setImproveValue(category: number, value: string) {
      if (this.profile?.id === null) {
        this.logout();
        return null;
      }

      const { data, statusCode } = await useBackendFetch(`/profile/${this.profile.id}/improve`)
        .post({
          category_id: category,
          value,
        })
        .json();

      if (statusCode.value === 401) {
        this.logout();
        return null;
      }

      this.profile.factors[category].improve = value;

      return data.value === 'Saved!';
    },
    async fetchSatisfaction() {
      if (this.profile?.id === null) {
        this.logout();
        return null;
      }

      const { data, statusCode } = await useBackendFetch(`/profile/${this.profile.id}/satisfied`).get().json();

      if (statusCode.value === 401) {
        this.logout();
        return null;
      }

      return data.value.satisfied;
    },
    async updateSatisfaction(categoryIds: string[]) {
      if (this.profile?.id === null) {
        this.logout();
        return null;
      }

      const { data, statusCode } = await useBackendFetch(`/profile/${this.profile.id}/satisfied`)
        .post({
          category_ids: categoryIds,
        })
        .json();

      if (statusCode.value === 401) {
        this.logout();
        return null;
      }

      return data.value;
    },
    async fetchGoals() {
      if (this.profile?.id === null) {
        this.logout();
        return null;
      }

      const { data, statusCode } = await useBackendFetch(`/profile/${this.profile.id}/goals`).get().json();

      if (statusCode.value === 401) {
        this.logout();
        return null;
      }

      return data.value.goals;
    },
    async updateGoals(goals: { category_id: number, vision: number }[]) {
      if (this.profile?.id === null) {
        this.logout();
        return null;
      }

      const { data, statusCode } = await useBackendFetch(`/profile/${this.profile.id}/goals`)
        .post({ goals })
        .json();

      if (statusCode.value === 401) {
        this.logout();
        return null;
      }

      return data.value;
    },
    async fetchPlannedGoals() {
      if (this.profile?.id === null) {
        this.logout();
        return null;
      }

      const { data, statusCode } = await useBackendFetch(`/profile/${this.profile.id}/plan`).get().json();

      if (statusCode.value === 401) {
        this.logout();
        return null;
      }

      return data.value.goals;
    },
    async updatePlannedGoals(plan: Record<number, GoalPlan>[]) {
      if (this.profile?.id === null) {
        this.logout();
        return null;
      }

      const { data, statusCode } = await useBackendFetch(`/profile/${this.profile.id}/plan`)
        .post({ plan })
        .json();

      if (statusCode.value === 401) {
        this.logout();
        return null;
      }

      return data.value;
    },
    async fetchPlan() {
      if (!this.profile?.id) {
        this.logout();
        return null;
      }

      return this.fetchPlanById(this.profile.id);
    },
    async fetchPlanById(planId: number) {
      const { data, statusCode } = await useBackendFetch(`/profile/${planId}/plan?finished=true`).get().json();

      if (statusCode.value === 401) {
        this.logout();
        return null;
      }

      return data.value;
    },
    async getNewPlan() {
      if (this.profile?.id) {
        return;
      }

      const { data, statusCode } = await useBackendFetch(`/profile/create`).post().json();

      if (statusCode.value === 401) {
        this.logout();
        return;
      }

      this.profile = data.value.profile;
      this.savePoints = null;
    },
    async finishPlan() {
      if (!this.profile?.id) {
        return;
      }

      const { data, statusCode } = await useBackendFetch(`/profile/finish`).post().json();

      if (statusCode.value === 401) {
        this.logout();
        return;
      }

      this.profiles = [
        {
          id: this.profile.id,
          created_at: this.profile.created_at,
        },
        ...this.profiles
      ];

      this.profile = null;
      this.savePoints = null;
      this.feedbackQuestions = [];
    },
    async fetchFeedbackQuestions() {
      if (this.feedbackQuestions && this.feedbackQuestions.length) {
        return;
      }

      const { data, statusCode } = await useBackendFetch(`/feedback`)
        .get()
        .json();

      if (statusCode.value === 401) {
        this.logout();
        return;
      }

      this.feedbackQuestions = data.value;
    },
    async saveFeedback(answers: {[key:string]: number}) {
      if (!this.profile?.id) {
        return;
      }

      const { data, statusCode } = await useBackendFetch(`/profile/${this.profile.id}/feedback`)
        .post({
          answers
        })
        .json();

      if (statusCode.value === 401) {
        this.logout();
        return;
      }
    }
  },
});
